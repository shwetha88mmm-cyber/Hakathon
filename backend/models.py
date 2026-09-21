from pydantic import BaseModel, Field
from typing import List, Optional

# Auth Schemas
class UserLogin(BaseModel):
    email: str
    password: str

class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    role: str = "TOURIST" # TOURIST, BUSINESS, AUTHORITY

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str

# Service Schemas
class ServiceCreate(BaseModel):
    name: str
    category: str
    destination: str
    location: str
    lat: float
    lng: float
    price_per_unit: float
    unit_type: Optional[str] = "per day"
    description: Optional[str] = ""
    contact_phone: Optional[str] = ""

# AI Feature Inputs & Outputs
class PriceCheckRequest(BaseModel):
    destination: str
    category: str
    price: float

class PriceCheckResponse(BaseModel):
    entered_price: float
    destination: str
    category: str
    min_normal: float
    max_normal: float
    avg_price: float
    status: str # NORMAL, SLIGHTLY HIGH, HIGH, UNUSUALLY HIGH
    difference_pct: float
    explanation: str

class TrustScoreRequest(BaseModel):
    service_id: int

class TrustScoreResponse(BaseModel):
    service_id: int
    service_name: str
    trust_score: int
    verification_status: bool
    review_reliability_pct: int
    service_feedback_pct: int
    rating: float
    factors: List[dict]
    disclaimer: str

class ReviewAnalysisRequest(BaseModel):
    service_id: int

class ReviewAnalysisResponse(BaseModel):
    service_id: int
    total_reviews: int
    reliability_score_pct: int
    sentiment_breakdown: dict
    flagged_patterns_count: int
    flagged_reasons: List[str]
    disclaimer: str

class TripPlannerRequest(BaseModel):
    destination: str
    budget: float
    days: int
    interests: List[str]

class FeedbackCreate(BaseModel):
    service_id: int
    user_name: str
    rating: float
    fair_price_rating: int
    service_quality: int
    comments: str
    connected_service_id: Optional[int] = None
