"""
Trust Score Engine: Calculates multi-factor trust score (0-100) for tourism services.
"""

def calculate_trust_score(service: dict, reviews: list, feedback: list, price_benchmark: dict = None) -> dict:
    # 1. Base verification score (25 pts)
    verification_score = 25 if service.get('verified') else 10

    # 2. Rating & Review volume score (25 pts)
    rating = service.get('rating', 4.0)
    review_count = service.get('review_count', 5)

    rating_factor = (rating / 5.0) * 20.0
    volume_bonus = min(5.0, (review_count / 20.0) * 5.0)
    review_score = rating_factor + volume_bonus

    # 3. Review reliability / anomaly penalty (25 pts)
    # Check for flagged duplicate or suspicious reviews
    flagged_count = sum(1 for r in reviews if r.get('flagged_duplicate', 0) == 1)
    if reviews:
        reliability_pct = int(((len(reviews) - flagged_count) / len(reviews)) * 100)
    else:
        reliability_pct = 90
    reliability_score = (reliability_pct / 100.0) * 25.0

    # 4. Community Feedback Score (25 pts)
    if feedback:
        avg_quality = sum(f.get('service_quality', 4) for f in feedback) / len(feedback)
        feedback_pct = int((avg_quality / 5.0) * 100)
    else:
        feedback_pct = 88
    feedback_score = (feedback_pct / 100.0) * 25.0

    # Total score calculation
    total_score = int(verification_score + review_score + reliability_score + feedback_score)
    total_score = max(30, min(99, total_score))

    factors = [
        {"name": "Government / Business Verification", "score": f"{verification_score}/25", "status": "Passed" if service.get('verified') else "Pending"},
        {"name": "Rating & Review Volume", "score": f"{round(review_score, 1)}/25", "status": f"{rating}/5 ({review_count} reviews)"},
        {"name": "Review Authenticity Index", "score": f"{round(reliability_score, 1)}/25", "status": f"{reliability_pct}% Verified Reviews"},
        {"name": "Tourist Feedback Score", "score": f"{round(feedback_score, 1)}/25", "status": f"{feedback_pct}% Positive Experience"}
    ]

    return {
        "service_id": service.get('id'),
        "service_name": service.get('name'),
        "trust_score": total_score,
        "verification_status": bool(service.get('verified')),
        "review_reliability_pct": reliability_pct,
        "service_feedback_pct": feedback_pct,
        "rating": rating,
        "factors": factors,
        "disclaimer": "Automated Trust Score generated from multi-source algorithmic assessment. Not a legal guarantee."
    }
