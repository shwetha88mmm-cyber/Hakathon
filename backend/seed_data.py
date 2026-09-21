"""
Database Seeder for TrustTrip AI
Seeds SQLite database with realistic Indian tourism data:
Goa, Bengaluru, Mysuru, Kerala, Hyderabad, Rajasthan.
"""

import hashlib
from database import SessionLocal, engine, Base
from models import User, Business, Service, Review, Feedback, TourismConnection, TourismDemand

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Avoid duplicate seeding if data already exists
    if db.query(User).first():
        print("Database already seeded.")
        db.close()
        return

    print("Seeding TrustTrip AI SQLite Database...")

    # 1. Create Demo Users
    tourist_user = User(
        email="tourist@trusttrip.ai",
        password_hash=hash_password("tourist123"),
        full_name="Aarav Sharma (Tourist)",
        role="TOURIST"
    )
    business_user = User(
        email="business@trusttrip.ai",
        password_hash=hash_password("business123"),
        full_name="Priya Nair (Goa Hospitality Group)",
        role="BUSINESS"
    )
    authority_user = User(
        email="authority@trusttrip.ai",
        password_hash=hash_password("authority123"),
        full_name="Dr. Vikram Rao (Karnataka & Goa Tourism Board)",
        role="AUTHORITY"
    )

    db.add_all([tourist_user, business_user, authority_user])
    db.commit()

    # 2. Create Demo Businesses
    biz_goa = Business(
        user_id=business_user.id,
        business_name="Goa Coastal Hospitality & Tours",
        category="Hotel & Travel Enterprise",
        location="North Goa",
        trust_score=94.5,
        verified=True,
        contact_phone="+91 98765 43210",
        contact_email="info@goacoastal.in"
    )
    biz_karnataka = Business(
        user_id=business_user.id,
        business_name="Heritage Karnataka Travel Network",
        category="Travel & Heritage Services",
        location="Bengaluru & Mysuru",
        trust_score=92.0,
        verified=True,
        contact_phone="+91 98123 45678",
        contact_email="contact@heritagekarnataka.org"
    )
    db.add_all([biz_goa, biz_karnataka])
    db.commit()

    # 3. Create Demo Services across Indian Destinations
    raw_services = [
        # GOA
        {
            "business_id": biz_goa.id,
            "name": "Baga Bay Heritage Resort",
            "category": "Hotel",
            "location": "Goa",
            "price_inr": 3500.0,
            "rating": 4.8,
            "trust_score": 93.5,
            "verification_status": True,
            "description": "Beachfront luxury resort with eco-certified amenities, swimming pool, and private beach access.",
            "image_url": "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
            "coordinates_lat": 15.5524,
            "coordinates_lng": 73.7517
        },
        {
            "business_id": biz_goa.id,
            "name": "Goa Express Coastal Cabs",
            "category": "Taxi",
            "location": "Goa",
            "price_inr": 1200.0,
            "rating": 4.7,
            "trust_score": 91.0,
            "verification_status": True,
            "description": "Verified fixed-meter taxi fleet with GPS tracking, English/Hindi/Konkani speaking drivers.",
            "image_url": "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80",
            "coordinates_lat": 15.4989,
            "coordinates_lng": 73.8278
        },
        {
            "business_id": biz_goa.id,
            "name": "Vasco Heritage & Spice Guide",
            "category": "Guide",
            "location": "Goa",
            "price_inr": 1500.0,
            "rating": 4.9,
            "trust_score": 95.0,
            "verification_status": True,
            "description": "Govt-licensed heritage walking guide for Old Goa churches and spice plantations.",
            "image_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
            "coordinates_lat": 15.5009,
            "coordinates_lng": 73.9116
        },
        {
            "business_id": biz_goa.id,
            "name": "Grand Island Scuba & Watersports",
            "category": "Activity",
            "location": "Goa",
            "price_inr": 2200.0,
            "rating": 4.6,
            "trust_score": 89.0,
            "verification_status": True,
            "description": "PADI certified scuba diving, jet skiing, and dolphin sighting expedition.",
            "image_url": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
            "coordinates_lat": 15.3853,
            "coordinates_lng": 73.7915
        },
        {
            "business_id": biz_goa.id,
            "name": "Fisherman's Wharf Seafood Shack",
            "category": "Restaurant",
            "location": "Goa",
            "price_inr": 850.0,
            "rating": 4.7,
            "trust_score": 92.0,
            "verification_status": True,
            "description": "Authentic Goan fish curry, peri peri prawns, and live Fado acoustic music.",
            "image_url": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
            "coordinates_lat": 15.4851,
            "coordinates_lng": 73.8052
        },

        # BENGALURU
        {
            "business_id": biz_karnataka.id,
            "name": "The Pavilion Heritage Hotel",
            "category": "Hotel",
            "location": "Bengaluru",
            "price_inr": 4200.0,
            "rating": 4.7,
            "trust_score": 92.0,
            "verification_status": True,
            "description": "Boutique hotel near MG Road and Cubbon Park featuring lush garden suites.",
            "image_url": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
            "coordinates_lat": 12.9716,
            "coordinates_lng": 77.5946
        },
        {
            "business_id": biz_karnataka.id,
            "name": "Namma Bengaluru Airport Cabs",
            "category": "Taxi",
            "location": "Bengaluru",
            "price_inr": 1100.0,
            "rating": 4.6,
            "trust_score": 89.5,
            "verification_status": True,
            "description": "Prepaid airport transit cabs with electric vehicle fleet options.",
            "image_url": "https://images.unsplash.com/photo-1556122071-e404eaedb77f?auto=format&fit=crop&w=800&q=80",
            "coordinates_lat": 12.9789,
            "coordinates_lng": 77.5917
        },

        # MYSURU
        {
            "business_id": biz_karnataka.id,
            "name": "Royal Mysore Palace Grand Hotel",
            "category": "Hotel",
            "location": "Mysuru",
            "price_inr": 2900.0,
            "rating": 4.8,
            "trust_score": 94.0,
            "verification_status": True,
            "description": "Heritage stay overlooking the illuminated Mysore Palace and Chamundi Hills.",
            "image_url": "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
            "coordinates_lat": 12.3052,
            "coordinates_lng": 76.6552
        },
        {
            "business_id": biz_karnataka.id,
            "name": "Mysore Royal Silk & Heritage Guide",
            "category": "Guide",
            "location": "Mysuru",
            "price_inr": 1200.0,
            "rating": 4.9,
            "trust_score": 96.0,
            "verification_status": True,
            "description": "Expert royal historian guiding palace art, silk weaving, and sandalwood oil crafts.",
            "image_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
            "coordinates_lat": 12.3023,
            "coordinates_lng": 76.6575
        },

        # KERALA
        {
            "business_id": None,
            "name": "Alleppey Emerald Backwater Houseboat",
            "category": "Hotel",
            "location": "Kerala",
            "price_inr": 4500.0,
            "rating": 4.9,
            "trust_score": 96.5,
            "verification_status": True,
            "description": "Traditional luxury Kettuvallam houseboat with chef and panoramic backwater views.",
            "image_url": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
            "coordinates_lat": 9.4981,
            "coordinates_lng": 76.3388
        },
        {
            "business_id": None,
            "name": "Munnar Spice Trail & Plantation Walk",
            "category": "Activity",
            "location": "Kerala",
            "price_inr": 1800.0,
            "rating": 4.8,
            "trust_score": 93.0,
            "verification_status": True,
            "description": "Guided organic tea & cardamom plantation trekking with fresh tea tasting.",
            "image_url": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
            "coordinates_lat": 10.0889,
            "coordinates_lng": 77.0595
        },

        # RAJASTHAN
        {
            "business_id": None,
            "name": "Pink City Palace Heritage Resort",
            "category": "Hotel",
            "location": "Rajasthan",
            "price_inr": 4800.0,
            "rating": 4.9,
            "trust_score": 95.0,
            "verification_status": True,
            "description": "Restored 18th-century Haveli with royal courtyard, puppet show, and rooftop dining.",
            "image_url": "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
            "coordinates_lat": 26.9124,
            "coordinates_lng": 75.7873
        },
        {
            "business_id": None,
            "name": "Jaisalmer Desert Safari & Folk Night",
            "category": "Activity",
            "location": "Rajasthan",
            "price_inr": 2800.0,
            "rating": 4.7,
            "trust_score": 91.5,
            "verification_status": True,
            "description": "Thar Desert camel dune bashing, Kalbelia folk dance, and luxury tent camp night.",
            "image_url": "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80",
            "coordinates_lat": 26.9157,
            "coordinates_lng": 70.9083
        },

        # HYDERABAD
        {
            "business_id": None,
            "name": "Pearl City Nizam Palace Stay",
            "category": "Hotel",
            "location": "Hyderabad",
            "price_inr": 3800.0,
            "rating": 4.7,
            "trust_score": 91.0,
            "verification_status": True,
            "description": "Charming boutique hotel near Charminar with authentic Hyderabadi Biryani dining.",
            "image_url": "https://images.unsplash.com/photo-1561501900-3701fa6a0864?auto=format&fit=crop&w=800&q=80",
            "coordinates_lat": 17.3850,
            "coordinates_lng": 78.4867
        },
        {
            "business_id": None,
            "name": "Golconda Fort Acoustic Heritage Tour",
            "category": "Guide",
            "location": "Hyderabad",
            "price_inr": 1300.0,
            "rating": 4.8,
            "trust_score": 94.0,
            "verification_status": True,
            "description": "Detailed walk explaining the clapping acoustics and diamond treasury of Qutb Shahi kings.",
            "image_url": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
            "coordinates_lat": 17.3833,
            "coordinates_lng": 78.4011
        }
    ]

    service_objects = []
    for s_dict in raw_services:
        s_obj = Service(**s_dict)
        db.add(s_obj)
        service_objects.append(s_obj)

    db.commit()

    # Refresh service objects to get generated IDs
    for s in service_objects:
        db.refresh(s)

    # 4. Create Demo Reviews
    review_entries = [
        Review(
            service_id=service_objects[0].id, # Baga Bay Resort
            user_name="Rahul Verma",
            rating=5.0,
            text="Exceptional beach resort! Super clean rooms, polite staff, and beautiful sunset view.",
            sentiment="POSITIVE",
            reliability_score=96.0
        ),
        Review(
            service_id=service_objects[0].id,
            user_name="Sneha K.",
            rating=5.0,
            text="Wonderful stay for family trip. Highly recommended for eco-friendly hospitality.",
            sentiment="POSITIVE",
            reliability_score=94.0
        ),
        Review(
            service_id=service_objects[1].id, # Goa Cabs
            user_name="Vikram Patel",
            rating=4.5,
            text="Driver was on time and used meter properly. Clean air-conditioned sedan.",
            sentiment="POSITIVE",
            reliability_score=92.0
        ),
        Review(
            service_id=service_objects[2].id, # Vasco Guide
            user_name="Ananya Roy",
            rating=5.0,
            text="Extremely knowledgeable guide! Showed us hidden spots in Old Goa we would never find.",
            sentiment="POSITIVE",
            reliability_score=98.0
        ),
        Review(
            service_id=service_objects[3].id, # Scuba Goa
            user_name="Deepak Joshi",
            rating=4.0,
            text="Great diving experience near Grand Island. Instructors were patient with beginners.",
            sentiment="POSITIVE",
            reliability_score=90.0
        )
    ]
    db.add_all(review_entries)
    db.commit()

    # 5. Create Repeated Connections for Tourism Trust Network (Hotel → Taxi → Guide → Activity)
    # Service IDs:
    # 0: Baga Bay Hotel (Goa)
    # 1: Goa Express Cabs (Goa)
    # 2: Vasco Heritage Guide (Goa)
    # 3: Grand Island Scuba (Goa)
    # 4: Fisherman's Shack (Goa)
    # 5: Pavilion Hotel (Bengaluru)
    # 6: Namma Cabs (Bengaluru)
    # 7: Royal Mysore Hotel (Mysuru)
    # 8: Mysore Guide (Mysuru)

    s0 = service_objects[0].id # Hotel
    s1 = service_objects[1].id # Taxi
    s2 = service_objects[2].id # Guide
    s3 = service_objects[3].id # Activity
    s4 = service_objects[4].id # Restaurant
    s5 = service_objects[5].id # Hotel (Blr)
    s6 = service_objects[6].id # Taxi (Blr)
    s7 = service_objects[7].id # Hotel (Mys)
    s8 = service_objects[8].id # Guide (Mys)

    connections = [
        # Goa Trust Chain (Hotel -> Taxi -> Guide -> Activity -> Restaurant)
        TourismConnection(source_service_id=s0, target_service_id=s1, weight=18, connection_type="Verified Hotel-Cab Partnership"),
        TourismConnection(source_service_id=s1, target_service_id=s2, weight=14, connection_type="Preferred Tour Driver Chain"),
        TourismConnection(source_service_id=s2, target_service_id=s3, weight=12, connection_type="Guide Recommended Adventure"),
        TourismConnection(source_service_id=s0, target_service_id=s4, weight=15, connection_type="Hotel Guest Dining Alliance"),
        TourismConnection(source_service_id=s3, target_service_id=s4, weight=9, connection_type="Post-Activity Coastal Dining"),
        # Bengaluru -> Mysuru Heritage Corridor
        TourismConnection(source_service_id=s5, target_service_id=s6, weight=16, connection_type="Tech City Airport Express"),
        TourismConnection(source_service_id=s6, target_service_id=s7, weight=11, connection_type="Intercity Heritage Highway"),
        TourismConnection(source_service_id=s7, target_service_id=s8, weight=13, connection_type="Royal Palace Heritage Walk")
    ]
    db.add_all(connections)
    db.commit()

    # 6. Create Tourism Demand Regional Statistics
    demand_records = [
        TourismDemand(destination="Goa", month_year="2026-09", demand_index=88.5, visitor_count=52000, top_category="Beach & Watersports"),
        TourismDemand(destination="Kerala", month_year="2026-09", demand_index=91.0, visitor_count=58000, top_category="Backwater Houseboats"),
        TourismDemand(destination="Rajasthan", month_year="2026-09", demand_index=85.0, visitor_count=44000, top_category="Fort Heritage & Desert"),
        TourismDemand(destination="Mysuru", month_year="2026-09", demand_index=82.5, visitor_count=32000, top_category="Royal Palace & Silk"),
        TourismDemand(destination="Hyderabad", month_year="2026-09", demand_index=79.0, visitor_count=36000, top_category="Charminar & Culinary"),
        TourismDemand(destination="Bengaluru", month_year="2026-09", demand_index=76.0, visitor_count=40000, top_category="Tech Parks & Gardens")
    ]
    db.add_all(demand_records)
    db.commit()

    print("Database seeding completed successfully!")
    db.close()

if __name__ == "__main__":
    seed_database()
