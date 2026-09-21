"""
AI Fair-Price Check Engine for TrustTrip AI
Compares user-entered tourism prices against regional statistical distributions
to identify overpricing, normal ranges, and dynamic market medians.
"""

import numpy as np

# Regional baseline prices (INR) per category and destination
# Format: (median, std_dev)
REGIONAL_PRICE_BASELINES = {
    "Goa": {
        "Hotel": (3500, 1000),
        "Taxi": (1200, 300),
        "Guide": (1500, 400),
        "Activity": (2000, 600),
        "Restaurant": (800, 250),
    },
    "Bengaluru": {
        "Hotel": (4200, 1200),
        "Taxi": (1000, 250),
        "Guide": (1800, 500),
        "Activity": (1500, 400),
        "Restaurant": (1000, 300),
    },
    "Mysuru": {
        "Hotel": (2800, 800),
        "Taxi": (900, 200),
        "Guide": (1200, 300),
        "Activity": (1000, 300),
        "Restaurant": (600, 200),
    },
    "Kerala": {
        "Hotel": (3800, 1100),
        "Taxi": (1500, 400),
        "Guide": (1600, 450),
        "Activity": (2200, 700),
        "Restaurant": (750, 220),
    },
    "Hyderabad": {
        "Hotel": (3600, 950),
        "Taxi": (1100, 300),
        "Guide": (1400, 350),
        "Activity": (1200, 350),
        "Restaurant": (900, 280),
    },
    "Rajasthan": {
        "Hotel": (4500, 1500),
        "Taxi": (1600, 450),
        "Guide": (1800, 500),
        "Activity": (2500, 800),
        "Restaurant": (850, 260),
    }
}

# Fallback baseline for unspecified locations
DEFAULT_BASELINE = {
    "Hotel": (3500, 1000),
    "Taxi": (1200, 300),
    "Guide": (1500, 400),
    "Activity": (1800, 500),
    "Restaurant": (800, 250),
}


def analyze_fair_price(service_category: str, location: str, entered_price: float) -> dict:
    """
    Analyzes entered price against baseline distribution for specified location and category.
    Returns estimated normal range, difference, evaluation result, and explanation.
    """
    category = service_category.strip().title()
    loc = location.strip().title()

    # Find matching baseline or default
    destination_baseline = REGIONAL_PRICE_BASELINES.get(loc, DEFAULT_BASELINE)
    median_price, std_dev = destination_baseline.get(category, (2500, 700))

    normal_min = max(300, int(median_price - 0.75 * std_dev))
    normal_max = int(median_price + 0.85 * std_dev)

    price_diff = entered_price - median_price
    pct_diff = (price_diff / median_price) * 100.0

    # Categorize price status
    if entered_price <= normal_max:
        status = "NORMAL"
        badge_color = "emerald"
        explanation = f"Price of ₹{int(entered_price):,} is well within the typical market range (₹{normal_min:,} - ₹{normal_max:,}) for {category} in {loc}."
    elif entered_price <= median_price * 1.35:
        status = "SLIGHTLY HIGH"
        badge_color = "amber"
        explanation = f"Price of ₹{int(entered_price):,} is roughly {abs(int(pct_diff))}% above the local median (₹{median_price:,}), which may reflect peak season or premium amenities."
    elif entered_price <= median_price * 1.80:
        status = "HIGH"
        badge_color = "orange"
        explanation = f"Price of ₹{int(entered_price):,} is significantly higher ({int(pct_diff)}% above median ₹{median_price:,}). Compare with alternative providers in {loc} before booking."
    else:
        status = "UNUSUALLY HIGH"
        badge_color = "rose"
        explanation = f"Caution: ₹{int(entered_price):,} is {int(pct_diff)}% higher than typical rates (median ₹{median_price:,}). This represents an outlier price."

    return {
        "service_category": category,
        "location": loc,
        "entered_price": float(entered_price),
        "median_price": float(median_price),
        "normal_range": {
            "min": float(normal_min),
            "max": float(normal_max)
        },
        "price_difference": round(price_diff, 2),
        "percentage_difference": round(pct_diff, 1),
        "status": status,
        "badge_color": badge_color,
        "explanation": explanation
    }
