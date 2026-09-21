import os

class AppConfig:
    APP_NAME = "TrustTrip AI"
    VERSION = "1.0.0"
    API_PREFIX = "/api"
    USE_DEMO_DATA_FALLBACK = True
    LEAFLET_TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    DEFAULT_CURRENCY = "INR"
    SYMBOL_CURRENCY = "₹"
