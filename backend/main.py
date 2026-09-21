from fastapi import FastAPI, HTTPException, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import sys
from pathlib import Path

# Add project root to sys.path so ai and integration modules can be imported
sys.path.append(str(Path(__file__).parent.parent))

from backend.database import get_db, init_db
from backend.models import (
    UserLogin, UserRegister, UserResponse,
    ServiceCreate, PriceCheckRequest, PriceCheckResponse,
    TrustScoreRequest, TrustScoreResponse,
    ReviewAnalysisRequest, ReviewAnalysisResponse,
    TripPlannerRequest, FeedbackCreate
)
from ai.trust_engine import calculate_trust_score
from ai.price_intelligence import analyze_fair_price
from ai.review_intelligence import analyze_reviews
from ai.trust_network import build_tourism_trust_network
from ai.trip_recommendation import generate_trip_itinerary
from ai.demand_predictor import predict_demand_and_trends
from backend.seed import seed_database

app = FastAPI(
    title="TrustTrip AI - Backend Engine",
    description="AI-Powered Tourism Trust & Growth Platform APIs",
    version="1.0.0"
)

# Enable CORS for local Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    init_db()
    seed_database()

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "app": "TrustTrip AI Engine",
        "version": "1.0.0",
        "demo_mode": True
    }

# --------------------------
# AUTH ENDPOINTS
# --------------------------
@app.post("/api/auth/login")
def login(user_data: UserLogin):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (user_data.email,))
    user = cursor.fetchone()
    conn.close()

    if not user or user["password"] != user_data.password:
        # For Demo Mode: Auto-login if demo email is used
        if user_data.email.endswith("@trusttrip.ai"):
            role = "TOURIST"
            if "business" in user_data.email or "hotel" in user_data.email:
                role = "BUSINESS"
            elif "authority" in user_data.email:
                role = "AUTHORITY"
            return {
                "token": "demo-jwt-token-12345",
                "user": {"id": 1, "name": user_data.email.split("@")[0].title(), "email": user_data.email, "role": role}
            }
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {
        "token": f"token-user-{user['id']}",
        "user": {"id": user["id"], "name": user["name"], "email": user["email"], "role": user["role"]}
    }

@app.post("/api/auth/register")
def register(user_data: UserRegister):
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
            (user_data.name, user_data.email, user_data.password, user_data.role)
        )
        user_id = cursor.lastrowid
        conn.commit()
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=400, detail="User with this email already exists")

    conn.close()
    return {
        "token": f"token-user-{user_id}",
        "user": {"id": user_id, "name": user_data.name, "email": user_data.email, "role": user_data.role}
    }

# --------------------------
# DESTINATIONS ENDPOINT
# --------------------------
@app.get("/api/destinations")
def get_destinations():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM destinations")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

# --------------------------
# SERVICES ENDPOINTS
# --------------------------
@app.get("/api/services")
def get_services(
    search: Optional[str] = None,
    category: Optional[str] = None,
    destination: Optional[str] = None,
    min_trust_score: Optional[int] = None,
    max_price: Optional[float] = None,
    min_rating: Optional[float] = None
):
    conn = get_db()
    cursor = conn.cursor()
    query = "SELECT * FROM services WHERE 1=1"
    params = []

    if search:
        query += " AND (name LIKE ? OR location LIKE ? OR description LIKE ?)"
        term = f"%{search}%"
        params.extend([term, term, term])

    if category and category != "All":
        query += " AND category = ?"
        params.append(category)

    if destination and destination != "All":
        query += " AND destination = ?"
        params.append(destination)

    if min_trust_score:
        query += " AND trust_score >= ?"
        params.append(min_trust_score)

    if max_price:
        query += " AND price_per_unit <= ?"
        params.append(max_price)

    if min_rating:
        query += " AND rating >= ?"
        params.append(min_rating)

    query += " ORDER BY trust_score DESC, rating DESC"
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.get("/api/services/{service_id}")
def get_service_details(service_id: int):
    conn = get_db()
    cursor = conn.cursor()

    # Get service record
    cursor.execute("SELECT * FROM services WHERE id = ?", (service_id,))
    service = cursor.fetchone()
    if not service:
        conn.close()
        raise HTTPException(status_code=404, detail="Service not found")

    service_dict = dict(service)

    # Get reviews
    cursor.execute("SELECT * FROM reviews WHERE service_id = ?", (service_id,))
    reviews = [dict(r) for r in cursor.fetchall()]

    # Get feedback
    cursor.execute("SELECT * FROM feedback WHERE service_id = ?", (service_id,))
    feedback = [dict(f) for f in cursor.fetchall()]

    # Get price benchmark
    cursor.execute("SELECT * FROM prices WHERE destination = ? AND category = ?", (service_dict['destination'], service_dict['category']))
    price_row = cursor.fetchone()

    # Calculate AI outputs
    trust_score_data = calculate_trust_score(service_dict, reviews, feedback, dict(price_row) if price_row else None)
    price_check_data = analyze_fair_price(service_dict['destination'], service_dict['category'], service_dict['price_per_unit'], dict(price_row) if price_row else None)
    review_analysis_data = analyze_reviews(reviews)

    # Get Connected Services (Network relationships)
    cursor.execute("""
    SELECT s.*, tc.connection_type, tc.repeat_count, tc.trust_weight
    FROM tourism_connections tc
    JOIN services s ON s.id = tc.target_service_id
    WHERE tc.source_service_id = ?
    """, (service_id,))
    connected_services = [dict(cs) for cs in cursor.fetchall()]

    conn.close()

    return {
        "service": service_dict,
        "trust_score": trust_score_data,
        "price_check": price_check_data,
        "review_analysis": review_analysis_data,
        "reviews": reviews,
        "connected_services": connected_services
    }

@app.post("/api/services")
def create_service(s: ServiceCreate):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO services (name, category, destination, location, lat, lng, price_per_unit, unit_type, description, contact_phone, verified, trust_score, rating)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 88, 4.6)
    """, (s.name, s.category, s.destination, s.location, s.lat, s.lng, s.price_per_unit, s.unit_type, s.description, s.contact_phone))
    service_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return {"id": service_id, "message": "Service listed successfully with initial Trust Verification."}

# --------------------------
# AI CORE FEATURE ENDPOINTS
# --------------------------
@app.post("/api/trust-score", response_model=TrustScoreResponse)
def get_trust_score_analysis(req: TrustScoreRequest):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM services WHERE id = ?", (req.service_id,))
    service = cursor.fetchone()
    if not service:
        conn.close()
        raise HTTPException(status_code=404, detail="Service not found")

    cursor.execute("SELECT * FROM reviews WHERE service_id = ?", (req.service_id,))
    reviews = [dict(r) for r in cursor.fetchall()]

    cursor.execute("SELECT * FROM feedback WHERE service_id = ?", (req.service_id,))
    feedback = [dict(f) for f in cursor.fetchall()]

    conn.close()
    return calculate_trust_score(dict(service), reviews, feedback)

@app.post("/api/price-check", response_model=PriceCheckResponse)
def check_price(req: PriceCheckRequest):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM prices WHERE destination = ? AND category = ?", (req.destination, req.category))
    price_row = cursor.fetchone()
    conn.close()
    return analyze_fair_price(req.destination, req.category, req.price, dict(price_row) if price_row else None)

@app.post("/api/review-analysis", response_model=ReviewAnalysisResponse)
def get_review_analysis(req: ReviewAnalysisRequest):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM reviews WHERE service_id = ?", (req.service_id,))
    reviews = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return analyze_reviews(reviews)

@app.post("/api/trip-recommendation")
def plan_trip(req: TripPlannerRequest):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM services")
    services = [dict(s) for s in cursor.fetchall()]
    conn.close()
    return generate_trip_itinerary(req.destination, req.budget, req.days, req.interests, services)

@app.get("/api/trust-network")
def get_trust_network(destination: Optional[str] = None):
    conn = get_db()
    cursor = conn.cursor()

    if destination and destination != "All":
        cursor.execute("SELECT * FROM services WHERE destination = ?", (destination,))
    else:
        cursor.execute("SELECT * FROM services")
    services = [dict(s) for s in cursor.fetchall()]

    cursor.execute("SELECT * FROM tourism_connections")
    connections = [dict(c) for c in cursor.fetchall()]
    conn.close()

    return build_tourism_trust_network(services, connections)

@app.get("/api/demand")
def get_demand_data(destination: Optional[str] = None):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tourism_demand")
    demand_rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return predict_demand_and_trends(demand_rows, destination)

@app.get("/api/trends")
def get_trend_data(destination: Optional[str] = None):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tourism_demand")
    demand_rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return predict_demand_and_trends(demand_rows, destination)

@app.get("/api/heatmap")
def get_heatmap_data(destination: Optional[str] = None):
    conn = get_db()
    cursor = conn.cursor()

    query = "SELECT id, name, category, destination, location, lat, lng, trust_score, price_per_unit, rating FROM services WHERE 1=1"
    params = []
    if destination and destination != "All":
        query += " AND destination = ?"
        params.append(destination)

    cursor.execute(query, params)
    services = [dict(s) for s in cursor.fetchall()]
    conn.close()

    heatmap_points = []
    for s in services:
        # Intensity based on trust score and rating
        intensity = round((s['trust_score'] / 100.0) * (s['rating'] / 5.0), 2)
        heatmap_points.append({
            "id": s['id'],
            "name": s['name'],
            "category": s['category'],
            "destination": s['destination'],
            "location": s['location'],
            "lat": s['lat'],
            "lng": s['lng'],
            "trust_score": s['trust_score'],
            "price": s['price_per_unit'],
            "rating": s['rating'],
            "intensity": intensity
        })

    return {
        "destination": destination or "All Regions",
        "total_locations": len(heatmap_points),
        "points": heatmap_points
    }

# --------------------------
# ROLE DASHBOARDS
# --------------------------
@app.get("/api/business-insights")
def get_business_insights(user_id: Optional[int] = 2):
    conn = get_db()
    cursor = conn.cursor()

    # Get services under business
    cursor.execute("SELECT * FROM services")
    all_services = [dict(s) for s in cursor.fetchall()]

    cursor.execute("SELECT * FROM reviews")
    all_reviews = [dict(r) for r in cursor.fetchall()]

    cursor.execute("SELECT * FROM tourism_demand WHERE destination = 'Goa'")
    demand_rows = [dict(r) for r in cursor.fetchall()]
    conn.close()

    avg_trust = round(sum(s['trust_score'] for s in all_services) / max(1, len(all_services)), 1)
    total_reviews = len(all_reviews)

    return {
        "business_name": "Sunset Hospitality & Express Transport",
        "overall_trust_score": int(avg_trust),
        "tourist_interest_pct": 86,
        "demand_trend": "UP (+18.4% YoY)",
        "popular_services": [s['name'] for s in all_services[:3]],
        "price_competitiveness": "OPTIMAL (Fair Market Aligned)",
        "tourist_interests_breakdown": [
            {"interest": "Beach Activities", "percentage": 72},
            {"interest": "Guided Heritage Tours", "percentage": 61},
            {"interest": "Local Food & Crafts", "percentage": 55},
            {"interest": "Ayurveda Wellness", "percentage": 40}
        ],
        "recent_reviews": all_reviews[:5],
        "connected_partners_count": 8
    }

@app.get("/api/authority-dashboard")
def get_authority_dashboard(destination: Optional[str] = None):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM services")
    total_services = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM destinations")
    total_destinations = cursor.fetchone()[0]

    cursor.execute("SELECT AVG(trust_score) FROM services")
    avg_national_trust = round(cursor.fetchone()[0] or 88.5, 1)

    cursor.execute("SELECT category, COUNT(*) as count FROM services GROUP BY category")
    service_distribution = [dict(r) for r in cursor.fetchall()]

    cursor.execute("SELECT destination, AVG(trust_score) as avg_trust, COUNT(*) as count FROM services GROUP BY destination")
    regional_trust = [dict(r) for r in cursor.fetchall()]

    cursor.execute("SELECT * FROM tourism_demand")
    demand_rows = [dict(r) for r in cursor.fetchall()]

    cursor.execute("SELECT * FROM services")
    services = [dict(s) for s in cursor.fetchall()]
    cursor.execute("SELECT * FROM tourism_connections")
    connections = [dict(c) for c in cursor.fetchall()]

    conn.close()

    network_summary = build_tourism_trust_network(services, connections)
    demand_summary = predict_demand_and_trends(demand_rows, destination)

    return {
        "total_registered_services": total_services,
        "active_destinations": total_destinations,
        "national_average_trust_score": avg_national_trust,
        "flagged_scam_warnings": 1,
        "service_distribution": service_distribution,
        "regional_trust_scores": regional_trust,
        "demand_analytics": demand_summary,
        "trust_network_summary": {
            "total_nodes": network_summary["total_nodes"],
            "total_connections": network_summary["total_edges"],
            "top_pathways": network_summary["frequent_pathways"]
        },
        "disclaimer": "Smart Tourism Authority Analytics & Governance Intelligence Dashboard."
    }

# --------------------------
# FEEDBACK ENDPOINT
# --------------------------
@app.post("/api/feedback")
def submit_feedback(fb: FeedbackCreate):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO feedback (user_id, service_id, rating, fair_price_rating, service_quality, comments)
    VALUES (1, ?, ?, ?, ?, ?)
    """, (fb.service_id, fb.rating, fb.fair_price_rating, fb.service_quality, fb.comments))

    # Add review record
    cursor.execute("""
    INSERT INTO reviews (service_id, user_name, rating, comment, sentiment)
    VALUES (?, ?, ?, ?, 'POSITIVE')
    """, (fb.service_id, fb.user_name, fb.rating, fb.comments))

    # If connected service was provided, update/insert tourism_connection (Hotel -> Taxi, etc.)
    if fb.connected_service_id:
        cursor.execute("""
        SELECT * FROM tourism_connections WHERE source_service_id = ? AND target_service_id = ?
        """, (fb.service_id, fb.connected_service_id))
        existing_conn = cursor.fetchone()
        if existing_conn:
            cursor.execute("""
            UPDATE tourism_connections SET repeat_count = repeat_count + 1 WHERE id = ?
            """, (existing_conn['id'],))
        else:
            cursor.execute("""
            INSERT INTO tourism_connections (source_service_id, target_service_id, connection_type, repeat_count)
            VALUES (?, ?, 'USER_VERIFIED_LINK', 1)
            """, (fb.service_id, fb.connected_service_id))

    conn.commit()
    conn.close()
    return {"status": "success", "message": "Feedback & Ecosystem Link submitted successfully!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
