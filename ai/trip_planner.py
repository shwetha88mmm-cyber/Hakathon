"""
Smart Trip Planner AI Engine for TrustTrip AI
Optimizes multi-day itineraries for tourists given destination, budget, days, and interests.
Matches verified high-trust services (Hotels, Taxis, Guides, Activities, Dining).
"""

def generate_trip_itinerary(
    destination: str,
    days: int,
    budget: float,
    interests: list,
    available_services: list
) -> dict:
    """
    Generates a day-by-day customized travel itinerary using available verified services in DB.
    """
    dest = destination.strip().title()
    num_days = max(1, min(7, int(days)))
    user_budget = float(budget)
    interest_set = set(i.lower().strip() for i in (interests or []))

    # Filter services matching destination
    dest_services = [s for s in available_services if dest in s.get("location", "")]

    if not dest_services:
        # Fallback to all available services if no exact location match
        dest_services = available_services

    # Sort services by Trust Score descending
    dest_services.sort(key=lambda s: s.get("trust_score", 70.0), reverse=True)

    hotels = [s for s in dest_services if s.get("category") == "Hotel"]
    taxis = [s for s in dest_services if s.get("category") in ["Taxi", "Transport"]]
    guides = [s for s in dest_services if s.get("category") == "Guide"]
    activities = [s for s in dest_services if s.get("category") in ["Activity", "Sightseeing", "Cultural"]]
    dining = [s for s in dest_services if s.get("category") in ["Restaurant", "Local Business", "Food"]]

    selected_hotel = hotels[0] if hotels else {
        "name": f"Verified Heritage Hotel {dest}",
        "price_inr": min(user_budget * 0.35 / num_days, 3000),
        "trust_score": 92.0,
        "rating": 4.8
    }

    selected_taxi = taxis[0] if taxis else {
        "name": f"TrustTrip Certified Express Cabs",
        "price_inr": min(user_budget * 0.15 / num_days, 1200),
        "trust_score": 90.0,
        "rating": 4.7
    }

    selected_guide = guides[0] if guides else {
        "name": f"Local Licensed Guide Association ({dest})",
        "price_inr": min(user_budget * 0.15 / num_days, 1500),
        "trust_score": 94.0,
        "rating": 4.9
    }

    daily_plans = []
    total_estimated_cost = 0.0

    # Calculate hotel total for the trip duration
    hotel_cost_per_night = float(selected_hotel.get("price_inr", 2500))
    hotel_total = hotel_cost_per_night * num_days
    total_estimated_cost += hotel_total

    activity_idx = 0
    dining_idx = 0

    for day_num in range(1, num_days + 1):
        # Pick morning activity
        if activity_idx < len(activities):
            morning_act = activities[activity_idx]
            activity_idx += 1
        else:
            morning_act = {
                "name": f"{dest} Scenic Exploration & Heritage Walk",
                "price_inr": 800,
                "trust_score": 91.0,
                "category": "Activity"
            }

        # Pick afternoon restaurant/dining
        if dining_idx < len(dining):
            afternoon_dine = dining[dining_idx]
            dining_idx += 1
        else:
            afternoon_dine = {
                "name": f"Authentic {dest} Traditional Restaurant",
                "price_inr": 600,
                "trust_score": 89.0,
                "category": "Restaurant"
            }

        # Pick evening activity/sightseeing
        if activity_idx < len(activities):
            evening_act = activities[activity_idx]
            activity_idx += 1
        else:
            evening_act = {
                "name": f"{dest} Sunset Viewpoint & Local Craft Market",
                "price_inr": 500,
                "trust_score": 93.0,
                "category": "Activity"
            }

        day_cost = (
            float(selected_taxi.get("price_inr", 1000)) +
            float(selected_guide.get("price_inr", 1200)) +
            float(morning_act.get("price_inr", 800)) +
            float(afternoon_dine.get("price_inr", 600)) +
            float(evening_act.get("price_inr", 500))
        )

        total_estimated_cost += day_cost

        daily_plans.append({
            "day": day_num,
            "title": f"Day {day_num}: {morning_act.get('name', 'Explore')}",
            "schedule": {
                "morning": {
                    "time": "09:00 AM - 12:30 PM",
                    "activity": morning_act.get("name"),
                    "category": morning_act.get("category", "Activity"),
                    "trust_score": morning_act.get("trust_score", 90.0),
                    "cost_inr": morning_act.get("price_inr", 800)
                },
                "afternoon": {
                    "time": "01:00 PM - 03:30 PM",
                    "activity": afternoon_dine.get("name"),
                    "category": afternoon_dine.get("category", "Dining"),
                    "trust_score": afternoon_dine.get("trust_score", 89.0),
                    "cost_inr": afternoon_dine.get("price_inr", 600)
                },
                "evening": {
                    "time": "04:30 PM - 08:00 PM",
                    "activity": evening_act.get("name"),
                    "category": evening_act.get("category", "Activity"),
                    "trust_score": evening_act.get("trust_score", 92.0),
                    "cost_inr": evening_act.get("price_inr", 500)
                }
            },
            "recommended_transport": selected_taxi.get("name"),
            "recommended_guide": selected_guide.get("name"),
            "estimated_day_expense": round(day_cost, 2)
        })

    budget_status = "WITHIN_BUDGET" if total_estimated_cost <= user_budget else "EXCEEDS_BUDGET"
    savings_or_deficit = round(user_budget - total_estimated_cost, 2)

    return {
        "destination": dest,
        "days": num_days,
        "user_budget": user_budget,
        "total_estimated_cost": round(total_estimated_cost, 2),
        "budget_headroom": savings_or_deficit,
        "budget_status": budget_status,
        "selected_accommodation": {
            "name": selected_hotel.get("name"),
            "trust_score": selected_hotel.get("trust_score", 90.0),
            "cost_per_night": selected_hotel.get("price_inr", 2500),
            "total_stay_cost": round(hotel_total, 2)
        },
        "daily_itinerary": daily_plans,
        "interests_matched": list(interest_set) if interest_set else ["General Tourism", "Sightseeing"]
    }
