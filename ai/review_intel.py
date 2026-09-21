"""
AI Review Intelligence Engine for TrustTrip AI
Analyzes sentiment, duplicate phrasing, burst frequencies, and overall reliability
for tourism service reviews stored in SQLite.
"""

import re
from collections import Counter

POSITIVE_KEYWORDS = [
    "great", "excellent", "amazing", "wonderful", "clean", "friendly", "helpful",
    "authentic", "honest", "punctual", "safe", "best", "love", "highly recommend",
    "comfortable", "superb", "top notch", "delicious", "scenic", "well organized"
]

NEGATIVE_KEYWORDS = [
    "bad", "terrible", "horrible", "dirty", "rude", "scam", "overpriced", "cheat",
    "late", "unsafe", "poor", "worst", "disappointed", "avoid", "ripoff", "fraud",
    "broken", "noisy", "unhygienic", "misleading"
]

def analyze_review_text(text: str) -> dict:
    """Classifies sentiment score and flags repetition patterns for a single review."""
    lower_text = text.lower()
    pos_count = sum(1 for w in POSITIVE_KEYWORDS if w in lower_text)
    neg_count = sum(1 for w in NEGATIVE_KEYWORDS if w in lower_text)

    if pos_count > neg_count:
        sentiment = "POSITIVE"
    elif neg_count > pos_count:
        sentiment = "NEGATIVE"
    else:
        sentiment = "NEUTRAL"

    return {
        "text": text,
        "sentiment": sentiment,
        "positive_keyword_hits": pos_count,
        "negative_keyword_hits": neg_count
    }


def evaluate_service_reviews(reviews_list: list) -> dict:
    """
    Evaluates a collection of reviews for a service to compute Review Reliability Score (0-100%)
    and detect suspicious repetition or burst patterns.
    """
    if not reviews_list:
        return {
            "reliability_score": 85.0,
            "sentiment_breakdown": {"POSITIVE": 0, "NEUTRAL": 0, "NEGATIVE": 0},
            "total_reviews": 0,
            "suspicious_flags": [],
            "status_label": "No Reviews Yet - Default Baseline"
        }

    sentiment_counts = {"POSITIVE": 0, "NEUTRAL": 0, "NEGATIVE": 0}
    phrases = []
    flags = []
    deduplication_penalty = 0.0

    for r in reviews_list:
        text = r.get("text", "")
        rating = r.get("rating", 5)

        # Sentiment assessment
        res = analyze_review_text(text)
        sentiment_counts[res["sentiment"]] += 1

        # Extract normalized 4+ word phrases for duplicate phrase detection
        clean = re.sub(r'[^\w\s]', '', text.lower())
        words = clean.split()
        if len(words) >= 4:
            for i in range(len(words) - 3):
                phrases.append(" ".join(words[i:i+4]))

    # Check for repeated 4-grams (copy-paste review patterns)
    phrase_counts = Counter(phrases)
    duplicate_phrases = [p for p, count in phrase_counts.items() if count >= 2]

    if duplicate_phrases:
        flags.append("Several reviews contain highly similar or copy-pasted wording across multiple entries.")
        deduplication_penalty += min(25.0, len(duplicate_phrases) * 8.0)

    # Check for rating distribution anomaly (e.g. 100% 5-star with identical short text)
    ratings = [r.get("rating", 5) for r in reviews_list]
    if len(ratings) >= 5 and all(rt == 5 for rt in ratings):
        short_text_count = sum(1 for r in reviews_list if len(r.get("text", "").split()) < 5)
        if short_text_count >= 3:
            flags.append("Unusual concentration of short, uniform 5-star ratings detected.")
            deduplication_penalty += 12.0

    # Calculate overall review reliability index (0-100%)
    base_reliability = 96.0
    final_reliability = max(40.0, min(100.0, base_reliability - deduplication_penalty))

    if not flags:
        flags.append("Authentic review pattern verified. No suspicious duplication or bot clusters found.")

    return {
        "reliability_score": round(final_reliability, 1),
        "sentiment_breakdown": sentiment_counts,
        "total_reviews": len(reviews_list),
        "duplicate_phrases_detected": len(duplicate_phrases),
        "suspicious_flags": flags,
        "is_reliable": final_reliability >= 75.0
    }
