import sqlite3
import os
from pathlib import Path

DB_PATH = Path(__file__).parent / "trusttrip.db"

def get_db():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    # Users Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'TOURIST', -- TOURIST, BUSINESS, AUTHORITY
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # Destinations Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS destinations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        state TEXT NOT NULL,
        country TEXT DEFAULT 'India',
        description TEXT,
        image_url TEXT,
        lat REAL,
        lng REAL,
        demand_level TEXT DEFAULT 'HIGH'
    )
    """)

    # Businesses Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS businesses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        company_name TEXT NOT NULL,
        registration_no TEXT UNIQUE,
        verified INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
    """)

    # Services Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        business_id INTEGER,
        name TEXT NOT NULL,
        category TEXT NOT NULL, -- Hotel, Taxi, Guide, Activity, Local Business
        destination TEXT NOT NULL,
        location TEXT NOT NULL,
        lat REAL,
        lng REAL,
        price_per_unit REAL NOT NULL,
        unit_type TEXT DEFAULT 'per day', -- per day, per ride, per person
        rating REAL DEFAULT 4.5,
        review_count INTEGER DEFAULT 0,
        trust_score INTEGER DEFAULT 85,
        verified INTEGER DEFAULT 1,
        image_url TEXT,
        description TEXT,
        contact_phone TEXT,
        FOREIGN KEY (business_id) REFERENCES businesses(id)
    )
    """)

    # Reviews Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        service_id INTEGER NOT NULL,
        user_name TEXT NOT NULL,
        rating REAL NOT NULL,
        comment TEXT NOT NULL,
        sentiment TEXT DEFAULT 'POSITIVE', -- POSITIVE, NEUTRAL, NEGATIVE
        flagged_duplicate INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (service_id) REFERENCES services(id)
    )
    """)

    # Feedback Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        service_id INTEGER NOT NULL,
        rating REAL NOT NULL,
        fair_price_rating INTEGER, -- 1 to 5
        service_quality INTEGER,   -- 1 to 5
        trust_verification INTEGER DEFAULT 1,
        comments TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (service_id) REFERENCES services(id)
    )
    """)

    # Price Benchmarks Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS prices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        destination TEXT NOT NULL,
        category TEXT NOT NULL,
        min_normal_price REAL NOT NULL,
        max_normal_price REAL NOT NULL,
        avg_price REAL NOT NULL,
        currency TEXT DEFAULT 'INR'
    )
    """)

    # Tourism Connections Table (For Tourism Trust Network)
    # Service A (Source) -> Service B (Target)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS tourism_connections (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source_service_id INTEGER NOT NULL,
        target_service_id INTEGER NOT NULL,
        connection_type TEXT DEFAULT 'RECOMMENDED', -- e.g., Hotel->Taxi, Taxi->Guide, Guide->Activity
        repeat_count INTEGER DEFAULT 1,
        trust_weight REAL DEFAULT 0.9,
        FOREIGN KEY (source_service_id) REFERENCES services(id),
        FOREIGN KEY (target_service_id) REFERENCES services(id)
    )
    """)

    # Demand & Trend Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS tourism_demand (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        destination TEXT NOT NULL,
        category TEXT NOT NULL,
        month TEXT NOT NULL,
        search_volume INTEGER DEFAULT 1000,
        booking_volume INTEGER DEFAULT 500,
        trend_direction TEXT DEFAULT 'UP', -- UP, STABLE, DOWN
        growth_rate_pct REAL DEFAULT 12.5
    )
    """)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    print("Database initialized successfully.")
