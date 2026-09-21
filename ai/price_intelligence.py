"""
AI Fair-Price Intelligence Module:
Compares entered price with regional database benchmarks and detects pricing anomalies.
"""

# Default fallbacks if database record is missing
PRICE_BENCHMARKS = {
    "Goa": {
        "Hotel": {"min": 1500, "max": 6500, "avg": 3500},
        "Taxi": {"min": 800, "max": 3000, "avg": 1800},
        "Guide": {"min": 1000, "max": 3500, "avg": 2000},
        "Activity": {"min": 500, "max": 4000, "avg": 2200},
        "Local Business": {"min": 300, "max": 2500, "avg": 1200}
    },
    "Jaipur": {
        "Hotel": {"min": 1200, "max": 6000, "avg": 3000},
        "Taxi": {"min": 600, "max": 2500, "avg": 1500},
        "Guide": {"min": 800, "max": 3000, "avg": 1800},
        "Activity": {"min": 400, "max": 3500, "avg": 1800},
        "Local Business": {"min": 250, "max": 2000, "avg": 1000}
    },
    "Kerala": {
        "Hotel": {"min": 1800, "max": 7500, "avg": 4000},
        "Taxi": {"min": 1000, "max": 3500, "avg": 2200},
        "Guide": {"min": 1200, "max": 3500, "avg": 2200},
        "Activity": {"min": 600, "max": 4500, "avg": 2500},
        "Local Business": {"min": 400, "max": 3000, "avg": 1500}
    },
    "Bengaluru": {
        "Hotel": {"min": 1500, "max": 7000, "avg": 3800},
        "Taxi": {"min": 500, "max": 2500, "avg": 1400},
        "Guide": {"min": 1000, "max": 3000, "avg": 1800},
        "Activity": {"min": 400, "max": 3000, "avg": 1600},
        "Local Business": {"min": 300, "max": 2500, "avg": 1200}
    },
    "Mysuru": {
        "Hotel": {"min": 1000, "max": 4500, "avg": 2400},
        "Taxi": {"min": 500, "max": 2000, "avg": 1200},
        "Guide": {"min": 700, "max": 2200, "avg": 1400},
        "Activity": {"min": 300, "max": 2500, "avg": 1200},
        "Local Business": {"min": 200, "max": 1800, "avg": 800}
    },
    "Hyderabad": {
        "Hotel": {"min": 1400, "max": 6500, "avg": 3200},
        "Taxi": {"min": 600, "max": 2600, "avg": 1500},
        "Guide": {"min": 900, "max": 2800, "avg": 1700},
        "Activity": {"min": 400, "max": 3200, "avg": 1700},
        "Local Business": {"min": 250, "max": 2200, "avg": 1100}
    }
}

def analyze_fair_price(destination: str, category: str, entered_price: float, db_price_row: dict = None) -> dict:
    # Determine reference benchmark
    if db_price_row:
        min_norm = db_price_row['min_normal_price']
        max_norm = db_price_row['max_normal_price']
        avg_price = db_price_row['avg_price']
    else:
        dest_bench = PRICE_BENCHMARKS.get(destination, PRICE_BENCHMARKS["Goa"])
        cat_bench = dest_bench.get(category, {"min": 1000, "max": 5000, "avg": 2500})
        min_norm = cat_bench["min"]
        max_norm = cat_bench["max"]
        avg_price = cat_bench["avg"]

    # Calculate difference
    diff_pct = round(((entered_price - avg_price) / avg_price) * 100, 1)

    if entered_price <= max_norm and entered_price >= min_norm:
        status = "NORMAL"
        explanation = f"₹{entered_price} is within the expected normal market price range of ₹{min_norm} - ₹{max_norm} for {category} in {destination}."
    elif entered_price > max_norm and entered_price <= max_norm * 1.3:
        status = "SLIGHTLY HIGH"
        explanation = f"₹{entered_price} is {abs(diff_pct)}% above the average market rate of ₹{avg_price}, but within peak season premium boundaries."
    elif entered_price > max_norm * 1.3 and entered_price <= max_norm * 1.8:
        status = "HIGH"
        explanation = f"₹{entered_price} is significantly higher ({abs(diff_pct)}%) than standard market rates for {category} in {destination}."
    elif entered_price > max_norm * 1.8:
        status = "UNUSUALLY HIGH"
        explanation = f"ALERT: ₹{entered_price} is {abs(diff_pct)}% above average rate (₹{avg_price}). High risk of price gouging or luxury overcharge."
    else: # below min_norm
        status = "NORMAL"
        explanation = f"₹{entered_price} is budget-friendly (below average ₹{avg_price}) for {category} in {destination}."

    return {
        "entered_price": entered_price,
        "destination": destination,
        "category": category,
        "min_normal": min_norm,
        "max_normal": max_norm,
        "avg_price": avg_price,
        "status": status,
        "difference_pct": diff_pct,
        "explanation": explanation
    }
