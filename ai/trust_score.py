"""
Trust Score Calculation Engine for TrustTrip AI
Calculates a multi-factor trust score (0 - 100) from ratings, review reliability,
verification, feedback ratio, and network repeat co-occurrences.
"""

def calculate_trust_score(
    rating: float,
    review_reliability: float,
    is_verified: bool,
    positive_feedback_pct: float,
    network_connection_count: int
) -> dict:
    """
    Computes weighted trust score (0-100)
    - Rating (0-5.0): up to 35 points
    - Review Reliability (0-100%): up to 25 points
    - Verification Status: 15 points (verified) vs 5 points (unverified)
    - Positive Feedback Pct (0-100%): up to 15 points
    - Network Connections (repeat co-occurrences): up to 10 points
    """
    # 1. Rating contribution (0-5 scale)
    clamped_rating = max(0.0, min(5.0, float(rating)))
    rating_score = (clamped_rating / 5.0) * 35.0

    # 2. Review reliability contribution (0-100%)
    clamped_rel = max(0.0, min(100.0, float(review_reliability)))
    reliability_score = (clamped_rel / 100.0) * 25.0

    # 3. Verification status
    verification_score = 15.0 if is_verified else 5.0

    # 4. Positive feedback percentage
    clamped_fb = max(0.0, min(100.0, float(positive_feedback_pct)))
    feedback_score = (clamped_fb / 100.0) * 15.0

    # 5. Network co-occurrence count (diminishing returns)
    conn_count = max(0, int(network_connection_count))
    if conn_count == 0:
        network_score = 2.0
    elif conn_count <= 3:
        network_score = 5.0
    elif conn_count <= 7:
        network_score = 8.0
    else:
        network_score = 10.0

    # Total aggregate score
    total_score = round(rating_score + reliability_score + verification_score + feedback_score + network_score, 1)
    total_score = max(0.0, min(100.0, total_score))

    # Determine status label
    if total_score >= 88.0:
        label = "Platinum Verified Trust"
        badge_color = "emerald"
    elif total_score >= 75.0:
        label = "High Trust & Verified"
        badge_color = "blue"
    elif total_score >= 60.0:
        label = "Moderate Trust"
        badge_color = "amber"
    else:
        label = "Unverified / Needs Review"
        badge_color = "rose"

    return {
        "trust_score": total_score,
        "status_label": label,
        "badge_color": badge_color,
        "factors": {
            "rating_contribution": round(rating_score, 1),
            "review_reliability": round(reliability_score, 1),
            "verification": round(verification_score, 1),
            "feedback": round(feedback_score, 1),
            "network": round(network_score, 1)
        },
        "breakdown": {
            "rating": f"{clamped_rating}/5.0",
            "reliability_pct": f"{int(clamped_rel)}%",
            "verified": is_verified,
            "feedback_pct": f"{int(clamped_fb)}%",
            "network_connections": conn_count
        }
    }
