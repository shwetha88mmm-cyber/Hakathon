"""
End-to-End Integration Test Suite for TrustTrip AI
Verifies every API endpoint, database operation, AI algorithm, and graph builder.
"""

import sys
import os
import unittest

# Ensure UTF-8 output encoding for Windows terminal
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# Add parent directories to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../backend")))

from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

class TestTrustTripPipeline(unittest.TestCase):

    def test_01_health_and_services(self):
        """Test basic services listing endpoint"""
        response = client.get("/api/services")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("services", data)
        self.assertGreater(data["count"], 0)
        print(f"[OK] Services Discovery API returned {data['count']} verified listings.")

    def test_02_service_details(self):
        """Test service details by ID"""
        response = client.get("/api/services/1")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("service", data)
        self.assertIn("trust_breakdown", data)
        self.assertIn("review_intelligence", data)
        print(f"[OK] Service Details API returned trust breakdown: {data['trust_breakdown']['trust_score']}/100")

    def test_03_trust_score_engine(self):
        """Test AI Trust Score engine"""
        payload = {
            "rating": 4.8,
            "review_reliability": 95.0,
            "is_verified": True,
            "positive_feedback_pct": 92.0,
            "network_connection_count": 6
        }
        response = client.post("/api/trust-score", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertGreaterEqual(data["trust_score"], 80.0)
        print(f"[OK] Trust Score Engine calculated: {data['trust_score']} - Status: {data['status_label']}")

    def test_04_price_check_engine(self):
        """Test AI Fair-Price Check engine"""
        payload = {
            "service_category": "Hotel",
            "location": "Goa",
            "entered_price": 3500.0
        }
        response = client.post("/api/price-check", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "NORMAL")
        print(f"[OK] Fair Price Check evaluated INR 3,500 in Goa as: {data['status']}")

    def test_05_review_intelligence(self):
        """Test AI Review Intelligence engine"""
        payload = {
            "reviews": [
                {"rating": 5, "text": "Exceptional beach resort! Super clean rooms, polite staff."},
                {"rating": 5, "text": "Super clean rooms, polite staff."} # duplicate wording
            ]
        }
        response = client.post("/api/review-analysis", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("reliability_score", data)
        print(f"[OK] Review Intelligence returned Reliability: {data['reliability_score']}%")

    def test_06_trip_recommendation(self):
        """Test AI Smart Trip Recommendation engine"""
        payload = {
            "destination": "Goa",
            "days": 3,
            "budget": 10000.0,
            "interests": ["Beaches", "Food", "Sightseeing"]
        }
        response = client.post("/api/trip-recommendation", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data["daily_itinerary"]), 3)
        print(f"[OK] Smart Trip Planner generated {len(data['daily_itinerary'])}-day itinerary for {data['destination']}")

    def test_07_trust_network_graph(self):
        """Test NetworkX Tourism Trust Network Graph"""
        response = client.get("/api/trust-network")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("nodes", data)
        self.assertIn("edges", data)
        self.assertIn("repeated_patterns", data)
        print(f"[OK] Tourism Trust Network graph built with {len(data['nodes'])} nodes, {len(data['edges'])} edges, {len(data['repeated_patterns'])} repeated patterns.")

    def test_08_heatmap_data(self):
        """Test Heatmap points endpoint"""
        response = client.get("/api/heatmap")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("heatmap_points", data)
        print(f"[OK] Heatmap API returned {len(data['heatmap_points'])} spatial points.")

    def test_09_dashboards(self):
        """Test Business & Authority Dashboard endpoints"""
        res_biz = client.get("/api/business-insights")
        self.assertEqual(res_biz.status_code, 200)
        
        res_auth = client.get("/api/authority-dashboard")
        self.assertEqual(res_auth.status_code, 200)
        print("[OK] Business and Authority Dashboards returned 200 OK.")


if __name__ == "__main__":
    print("==================================================")
    print("Running TrustTrip AI Full Pipeline Verification...")
    print("==================================================")
    unittest.main()
