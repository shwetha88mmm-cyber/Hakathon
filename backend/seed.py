try:
    from backend.database import get_db, init_db
except ImportError:
    from database import get_db, init_db

def seed_database():
    init_db()
    conn = get_db()
    cursor = conn.cursor()

    # Check if already seeded
    cursor.execute("SELECT COUNT(*) FROM services")
    if cursor.fetchone()[0] > 0:
        print("Database already seeded.")
        conn.close()
        return

    print("Seeding TrustTrip AI Database with rich Indian Tourism Demo Data...")

    # 1. Users
    users_data = [
        ("Demo Tourist", "tourist@trusttrip.ai", "demo123", "TOURIST"),
        ("Sunset Beach Resort", "hotel@trusttrip.ai", "demo123", "BUSINESS"),
        ("Goa Cabs Association", "taxi@trusttrip.ai", "demo123", "BUSINESS"),
        ("Ministry of Tourism Officer", "authority@trusttrip.ai", "demo123", "AUTHORITY")
    ]
    cursor.executemany("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)", users_data)

    # 2. Destinations
    destinations_data = [
        ("Goa", "Goa", "India", "Famous for pristine beaches, nightlife, and Portuguese heritage.", "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800", 15.2993, 74.1240, "VERY HIGH"),
        ("Jaipur", "Rajasthan", "India", "The Pink City renowned for forts, palaces, and rich royal heritage.", "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800", 26.9124, 75.7873, "HIGH"),
        ("Kerala", "Kerala", "India", "God's Own Country with serene backwaters, tea gardens, and beaches.", "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800", 9.9312, 76.2673, "HIGH"),
        ("Bengaluru", "Karnataka", "India", "The Garden City and Silicon Valley of India with tech hubs and parks.", "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800", 12.9716, 77.5946, "MEDIUM"),
        ("Mysuru", "Karnataka", "India", "Cultural capital famous for Mysuru Palace, silk, and sandalwood.", "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800", 12.2958, 76.6394, "MEDIUM"),
        ("Hyderabad", "Telangana", "India", "City of Pearls famous for Charminar, Golconda Fort, and Biryani.", "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800", 17.3850, 78.4867, "MEDIUM")
    ]
    cursor.executemany("""
    INSERT INTO destinations (name, state, country, description, image_url, lat, lng, demand_level)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, destinations_data)

    # 3. Businesses
    businesses_data = [
        (2, "Taj Resort Calangute Group", "BIZ-GOA-101", 1),
        (3, "Goa Express Transport Federation", "BIZ-GOA-102", 1),
        (2, "Pink City Hospitality Ltd", "BIZ-JPR-201", 1),
        (3, "Backwater Cruisers Kerala", "BIZ-KRL-301", 1)
    ]
    cursor.executemany("INSERT INTO businesses (user_id, company_name, registration_no, verified) VALUES (?, ?, ?, ?)", businesses_data)

    # 4. Services
    services_data = [
        # Goa Services
        (1, "Taj Bay Resort Calangute", "Hotel", "Goa", "Calangute Beach Road, North Goa", 15.5494, 73.7535, 3800.0, "per night", 4.8, 142, 94, 1, "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800", "Luxury beachfront resort with ocean view pool, private beach access, and breakfast included.", "+91 98765 43210"),
        (2, "Goa Express Tourist Taxi", "Taxi", "Goa", "Airport & Beach Transit Hub, Panaji", 15.4989, 73.8278, 1800.0, "per day", 4.6, 98, 91, 1, "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800", "Verified AC sedan and SUV taxi service with fixed transparent pricing across Goa.", "+91 98765 43211"),
        (1, "Heritage Goa Heritage Guide (Rahul)", "Guide", "Goa", "Old Goa Church Complex", 15.5009, 73.9116, 1500.0, "per tour", 4.9, 76, 96, 1, "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800", "Certified historian guide for UNESCO Heritage churches and Latin Quarter walk.", "+91 98765 43212"),
        (1, "Baga Beach Water Sports Adventure", "Activity", "Goa", "Baga Beach Water Sports Point", 15.5553, 73.7517, 2200.0, "per person", 4.7, 210, 89, 1, "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800", "Parasailing, Jet Ski, Banana ride & Scuba diving with certified safety instructor.", "+91 98765 43213"),
        (1, "Sahakari Spice Plantation & Buffet", "Local Business", "Goa", "Ponda Spice Belt, Goa", 15.4024, 74.0152, 800.0, "per person", 4.5, 65, 88, 1, "https://images.unsplash.com/photo-1509358271058-acd02cc93898?w=800", "Organic spice tour, elephant bath viewing, and authentic traditional Goan buffet meal.", "+91 98765 43214"),

        # Jaipur Services
        (3, "Hawa Mahal Heritage Hotel", "Hotel", "Jaipur", "Near Hawa Mahal, Pink City", 26.9239, 75.8267, 3200.0, "per night", 4.7, 115, 92, 1, "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800", "Traditional Rajasthani Haveli stay with rooftop palace view restaurant.", "+91 98765 43215"),
        (3, "Pink City Auto & Cab Service", "Taxi", "Jaipur", "Jaipur Railway Station Circle", 26.9196, 75.7878, 1400.0, "per day", 4.5, 84, 87, 1, "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800", "Fixed price sightseeing cab service across Amber Fort, Jal Mahal, and markets.", "+91 98765 43216"),
        (3, "Amber Fort Royal Guide Association", "Guide", "Jaipur", "Amber Fort Entry Gate", 26.9855, 75.8513, 1200.0, "per tour", 4.8, 62, 93, 1, "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800", "Official state licensed guides fluent in English, Hindi, and French.", "+91 98765 43217"),
        (3, "Johri Bazaar Rajasthani Crafts", "Local Business", "Jaipur", "Johri Bazaar Market", 26.9180, 75.8260, 500.0, "per visit", 4.6, 92, 90, 1, "https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=800", "Government verified emporium for authentic Jaipuri gemstones, textiles, and juttis.", "+91 98765 43218"),

        # Kerala Services
        (4, "Alleppey Backwater Luxury Houseboat", "Hotel", "Kerala", "Punnamada Jetty, Alleppey", 9.4981, 76.3388, 5500.0, "per night", 4.9, 180, 96, 1, "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800", "Fully equipped AC private houseboat with traditional Kerala meals and night stay.", "+91 98765 43219"),
        (4, "Kerala Coastal Tourist Cabs", "Taxi", "Kerala", "Kochi Airport & Station", 9.9312, 76.2673, 2000.0, "per day", 4.6, 75, 90, 1, "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800", "Clean chaufurred cabs for Munnar, Alleppey, and Thekkady circuits.", "+91 98765 43220"),

        # Bengaluru Services
        (1, "UB City Central Suites", "Hotel", "Bengaluru", "Vittal Mallya Road", 12.9719, 77.5957, 4200.0, "per night", 4.6, 95, 91, 1, "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800", "Modern tech-hub hotel near Cubbon Park and MG Road commercial zone.", "+91 98765 43221"),
        (1, "Namma City Tourist Cabs", "Taxi", "Bengaluru", "Kempegowda Int. Airport Hub", 13.1986, 77.7066, 1500.0, "per day", 4.4, 110, 86, 1, "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800", "Verified city cabs with GPS tracking and zero surge guarantee.", "+91 98765 43222"),

        # Mysuru Services
        (2, "Mysore Palace View Residency", "Hotel", "Mysuru", "Sayyaji Rao Road", 12.3052, 76.6552, 2500.0, "per night", 4.7, 88, 93, 1, "https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=800", "Boutique heritage stay overlooking illuminated Mysore Royal Palace.", "+91 98765 43223"),
        (2, "Chamundi Hill Tour Guide Association", "Guide", "Mysuru", "Chamundi Temple Footsteps", 12.2742, 76.6713, 1000.0, "per tour", 4.8, 45, 94, 1, "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800", "Expert guide for Mysore Palace architecture and Chamundi temple history.", "+91 98765 43224"),

        # Hyderabad Services
        (3, "Charminar Heritage Plaza", "Hotel", "Hyderabad", "Old City, Charminar Circle", 17.3616, 78.4747, 3000.0, "per night", 4.5, 78, 89, 1, "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800", "Heritage hotel steps away from Charminar monument and Laad Bazaar.", "+91 98765 43225"),
        (3, "Golconda Fort Guided Walking Tour", "Activity", "Hyderabad", "Golconda Fort Main Gate", 17.3833, 78.4011, 800.0, "per person", 4.8, 130, 95, 1, "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800", "Acoustics & fort history guided walk with evening laser light show access.", "+91 98765 43226")
    ]

    cursor.executemany("""
    INSERT INTO services (business_id, name, category, destination, location, lat, lng, price_per_unit, unit_type, rating, review_count, trust_score, verified, image_url, description, contact_phone)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, services_data)

    # 5. Price Benchmarks
    prices_data = [
        ("Goa", "Hotel", 1500, 6500, 3500),
        ("Goa", "Taxi", 800, 3000, 1800),
        ("Goa", "Guide", 1000, 3500, 2000),
        ("Goa", "Activity", 500, 4000, 2200),
        ("Goa", "Local Business", 300, 2500, 1200),

        ("Jaipur", "Hotel", 1200, 6000, 3000),
        ("Jaipur", "Taxi", 600, 2500, 1500),
        ("Jaipur", "Guide", 800, 3000, 1800),
        ("Jaipur", "Activity", 400, 3500, 1800),
        ("Jaipur", "Local Business", 250, 2000, 1000),

        ("Kerala", "Hotel", 1800, 7500, 4000),
        ("Kerala", "Taxi", 1000, 3500, 2200),

        ("Bengaluru", "Hotel", 1500, 7000, 3800),
        ("Bengaluru", "Taxi", 500, 2500, 1400),

        ("Mysuru", "Hotel", 1000, 4500, 2400),
        ("Hyderabad", "Hotel", 1400, 6500, 3200)
    ]
    cursor.executemany("""
    INSERT INTO prices (destination, category, min_normal_price, max_normal_price, avg_price)
    VALUES (?, ?, ?, ?, ?)
    """, prices_data)

    # 6. Reviews (Including suspicious duplicate wording to test Review Intelligence)
    reviews_data = [
        # Normal positive reviews
        (1, "Aarav Sharma", 5.0, "Great hotel with awesome sea view and super friendly staff. Highly recommended!", "POSITIVE", 0),
        (1, "Neha Patel", 4.5, "Clean rooms and nice swimming pool. Breakfast buffet was top notch.", "POSITIVE", 0),
        (2, "Rohan Verma", 4.8, "Goa Express Taxi was right on time at Dabolim airport. Fixed transparent pricing!", "POSITIVE", 0),
        (3, "Ananya Rao", 5.0, "Rahul guided us through Old Goa churches with unbelievable historical detail.", "POSITIVE", 0),
        (4, "Vikram Malhotra", 4.5, "Parasailing at Baga beach was thrilling! Safe harness and professional instructors.", "POSITIVE", 0),

        # Duplicate/Suspicious patterns (To test AI review pattern flag)
        (1, "Bot_User_1", 5.0, "Amazing resort best experience ever 10/10 good staff!", "POSITIVE", 1),
        (1, "Bot_User_2", 5.0, "Amazing resort best experience ever 10/10 good staff!", "POSITIVE", 1),
        (1, "Bot_User_3", 5.0, "Amazing resort best experience ever 10/10 good staff!", "POSITIVE", 1),

        # Jaipur reviews
        (6, "Karan Singh", 4.7, "Loved the rooftop view of Hawa Mahal at night. Truly royal hospitality.", "POSITIVE", 0),
        (7, "Pooja Gupta", 4.5, "Cab driver was very courteous and knew all shortcut routes in Pink City.", "POSITIVE", 0)
    ]
    cursor.executemany("""
    INSERT INTO reviews (service_id, user_name, rating, comment, sentiment, flagged_duplicate)
    VALUES (?, ?, ?, ?, ?, ?)
    """, reviews_data)

    # 7. Tourism Connections (For Tourism Trust Network - Hotel -> Taxi -> Guide -> Activity)
    # Goa Connections:
    # Service 1 (Taj Bay Resort) -> Service 2 (Goa Express Taxi)
    # Service 2 (Goa Express Taxi) -> Service 3 (Rahul Guide)
    # Service 3 (Rahul Guide) -> Service 4 (Baga Water Sports)
    # Service 1 (Taj Bay Resort) -> Service 4 (Baga Water Sports)
    # Service 1 (Taj Bay Resort) -> Service 5 (Sahakari Spice Plantation)
    # Jaipur Connections:
    # Service 6 (Hawa Mahal Hotel) -> Service 7 (Pink City Taxi)
    # Service 7 (Pink City Taxi) -> Service 8 (Amber Fort Guide)
    # Service 8 (Amber Fort Guide) -> Service 9 (Johri Bazaar)
    connections_data = [
        (1, 2, "Hotel → Taxi Transit", 28, 0.95),
        (2, 3, "Taxi → Guided Heritage Tour", 19, 0.92),
        (3, 4, "Guide → Beach Adventure Activity", 24, 0.94),
        (1, 4, "Hotel → Beach Adventure Direct", 15, 0.90),
        (1, 5, "Hotel → Spice Plantation Dining", 12, 0.88),

        (6, 7, "Hotel → Pink City Cab", 22, 0.93),
        (7, 8, "Taxi → Amber Fort Guide", 18, 0.91),
        (8, 9, "Guide → Craft Emporium", 14, 0.89),

        (10, 11, "Houseboat → Coastal Cab", 16, 0.94),
        (12, 13, "Hotel → City Taxi", 20, 0.90),
        (14, 15, "Residency → Temple Guide", 11, 0.92),
        (16, 17, "Plaza → Fort Walk Activity", 15, 0.93)
    ]
    cursor.executemany("""
    INSERT INTO tourism_connections (source_service_id, target_service_id, connection_type, repeat_count, trust_weight)
    VALUES (?, ?, ?, ?, ?)
    """, connections_data)

    # 8. Tourism Demand & Trends
    demand_data = [
        ("Goa", "Hotel", "Oct", 1400, 620, "UP", 15.2),
        ("Goa", "Hotel", "Nov", 2100, 980, "UP", 22.4),
        ("Goa", "Hotel", "Dec", 3500, 1850, "UP", 35.0),
        ("Goa", "Taxi", "Dec", 2900, 1400, "UP", 30.1),
        ("Goa", "Activity", "Dec", 3200, 1600, "UP", 28.5),

        ("Jaipur", "Hotel", "Oct", 1100, 500, "UP", 10.5),
        ("Jaipur", "Hotel", "Nov", 1800, 850, "UP", 18.0),
        ("Jaipur", "Guide", "Nov", 1300, 620, "UP", 14.2),

        ("Kerala", "Hotel", "Nov", 1600, 750, "UP", 16.5),
        ("Bengaluru", "Hotel", "Oct", 1200, 550, "STABLE", 5.1),
        ("Mysuru", "Hotel", "Oct", 950, 420, "UP", 12.0),
        ("Hyderabad", "Hotel", "Oct", 1300, 600, "UP", 11.4)
    ]
    cursor.executemany("""
    INSERT INTO tourism_demand (destination, category, month, search_volume, booking_volume, trend_direction, growth_rate_pct)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, demand_data)

    # 9. Feedback Data
    feedback_data = [
        (1, 1, 5.0, 5, 5, 1, "The hotel recommended Goa Express Taxi and it was an awesome experience!"),
        (1, 2, 4.5, 4, 5, 1, "Taxi driver recommended Guide Rahul for Old Goa. Great suggestion."),
        (1, 6, 5.0, 5, 5, 1, "Hawa Mahal Hotel arranged our Pink City cab seamlessly.")
    ]
    cursor.executemany("""
    INSERT INTO feedback (user_id, service_id, rating, fair_price_rating, service_quality, trust_verification, comments)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, feedback_data)

    conn.commit()
    conn.close()
    print("TrustTrip AI Database seeded successfully with 17 services, 6 destinations, and full trust network connections.")

if __name__ == "__main__":
    seed_database()
