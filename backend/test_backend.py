import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))

from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_all_endpoints():
    print("Testing Backend APIs...")

    # 1. Health
    r = client.get("/api/health")
    assert r.status_code == 200, f"Health check failed: {r.status_code}"
    print("[OK] GET /api/health passed:", r.json()["app"])

    # 2. Destinations
    r = client.get("/api/destinations")
    assert r.status_code == 200
    print("[OK] GET /api/destinations passed:", len(r.json()), "destinations")

    # 3. Services
    r = client.get("/api/services")
    assert r.status_code == 200
    services = r.json()
    print("[OK] GET /api/services passed:", len(services), "services")

    # 4. Service Details
    if services:
        sid = services[0]['id']
        r = client.get(f"/api/services/{sid}")
        assert r.status_code == 200
        print(f"[OK] GET /api/services/{sid} passed: {r.json()['service']['name']}")

    # 5. Trust Score
    r = client.post("/api/trust-score", json={"service_id": 1})
    assert r.status_code == 200
    print("[OK] POST /api/trust-score passed: Score", r.json()["trust_score"])

    # 6. Price Check
    r = client.post("/api/price-check", json={"destination": "Goa", "category": "Hotel", "price": 3500})
    assert r.status_code == 200
    print("[OK] POST /api/price-check passed: Status", r.json()["status"])

    # 7. Review Analysis
    r = client.post("/api/review-analysis", json={"service_id": 1})
    assert r.status_code == 200
    print("[OK] POST /api/review-analysis passed: Reliability", r.json()["reliability_score_pct"], "%")

    # 8. Trip Recommendation
    r = client.post("/api/trip-recommendation", json={"destination": "Goa", "budget": 10000, "days": 3, "interests": ["Beaches", "Food"]})
    assert r.status_code == 200
    print("[OK] POST /api/trip-recommendation passed: Days", len(r.json()["itinerary"]))

    # 9. Trust Network
    r = client.get("/api/trust-network")
    assert r.status_code == 200
    print("[OK] GET /api/trust-network passed: Nodes", r.json()["total_nodes"], "Edges", r.json()["total_edges"])

    # 10. Heatmap
    r = client.get("/api/heatmap")
    assert r.status_code == 200
    print("[OK] GET /api/heatmap passed: Points", r.json()["total_locations"])

    # 11. Demand & Trends
    r = client.get("/api/demand")
    assert r.status_code == 200
    print("[OK] GET /api/demand passed: Trend", r.json()["demand_trend"])

    # 12. Business Insights
    r = client.get("/api/business-insights")
    assert r.status_code == 200
    print("[OK] GET /api/business-insights passed: Overall Trust", r.json()["overall_trust_score"])

    # 13. Authority Dashboard
    r = client.get("/api/authority-dashboard")
    assert r.status_code == 200
    print("[OK] GET /api/authority-dashboard passed: Total Services", r.json()["total_registered_services"])

    print("\nALL 13 BACKEND ENDPOINTS PASSED VERIFICATION PERFECTLY! 🚀")

if __name__ == "__main__":
    test_all_endpoints()
