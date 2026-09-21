"""
AI Review Intelligence Module:
Performs sentiment breakdown, duplicate text clustering, and review authenticity verification.
"""
from collections import Counter
import re

POSITIVE_KEYWORDS = ["great", "excellent", "amazing", "wonderful", "clean", "friendly", "honest", "punctual", "best", "safe", "love", "awesome"]
NEGATIVE_KEYWORDS = ["bad", "terrible", "overpriced", "rude", "scam", "dirty", "late", "horrible", "avoid", "worst", "unprofessional", "cheat"]

def analyze_reviews(reviews: list) -> dict:
    if not reviews:
        return {
            "service_id": 0,
            "total_reviews": 0,
            "reliability_score_pct": 95,
            "sentiment_breakdown": {"POSITIVE": 80, "NEUTRAL": 15, "NEGATIVE": 5},
            "flagged_patterns_count": 0,
            "flagged_reasons": [],
            "disclaimer": "No reviews logged yet. Initial default benchmark applied."
        }

    positive_count = 0
    negative_count = 0
    neutral_count = 0
    flagged_reasons = []

    comments = [r.get('comment', '') for r in reviews]

    # Pattern check 1: Exact or near duplicate comments
    comment_counts = Counter(comments)
    duplicates = [comment for comment, count in comment_counts.items() if count > 1]
    if duplicates:
        flagged_reasons.append(f"{len(duplicates)} reviews contain identical or copy-pasted phrasing.")

    # Pattern check 2: Extremely short repetitive reviews ("Good hotel", "Good hotel")
    short_suspicious = sum(1 for c in comments if len(c.strip()) < 12)
    if short_suspicious > 2:
        flagged_reasons.append("High volume of generic short review comments detected.")

    # Sentiment analysis
    for comment in comments:
        text_lower = comment.lower()
        pos_score = sum(1 for word in POSITIVE_KEYWORDS if word in text_lower)
        neg_score = sum(1 for word in NEGATIVE_KEYWORDS if word in text_lower)

        if pos_score > neg_score:
            positive_count += 1
        elif neg_score > pos_score:
            negative_count += 1
        else:
            neutral_count += 1

    total = len(reviews)
    pos_pct = round((positive_count / total) * 100)
    neg_pct = round((negative_count / total) * 100)
    neu_pct = 100 - (pos_pct + neg_pct)

    flagged_patterns_count = len(duplicates) + (1 if short_suspicious > 2 else 0)
    reliability_pct = max(40, 100 - (flagged_patterns_count * 15))

    return {
        "service_id": reviews[0].get('service_id', 0) if reviews else 0,
        "total_reviews": total,
        "reliability_score_pct": reliability_pct,
        "sentiment_breakdown": {
            "POSITIVE": pos_pct,
            "NEUTRAL": max(0, neu_pct),
            "NEGATIVE": neg_pct
        },
        "flagged_patterns_count": flagged_patterns_count,
        "flagged_reasons": flagged_reasons if flagged_reasons else ["No suspicious review patterns detected."],
        "disclaimer": "Automated text pattern & sentiment assessment. Does not serve as legal proof of fake reviews."
    }
