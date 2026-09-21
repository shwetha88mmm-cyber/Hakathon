# TrustTrip AI — AI-Powered Tourism Trust & Growth Platform

> **SIH Hackathon Solution** | Built for scalable, trustworthy, intelligent tourism ecosystems.

---

## 1. Problem Statement
Tourism consists of disjointed services — hotels, taxis, guides, activities, and local crafts/restaurants.
- **Tourists** lack a single intelligent system to evaluate trustworthy services, fair pricing, and reliable reviews.
- **Tourism Businesses** lack visibility into tourist demand patterns and inter-service relationships.
- Existing platforms (e.g., booking apps, Google Maps) focus on search and navigation, but do **not** solve tourism-specific trust, price gouging, review fraud, and ecosystem network intelligence.

---

## 2. Our Solution: TrustTrip AI
TrustTrip AI introduces an intelligence layer connecting:
$$\text{Tourists} \longleftrightarrow \text{Hotels} \longleftrightarrow \text{Taxis} \longleftrightarrow \text{Guides} \longleftrightarrow \text{Activities} \longleftrightarrow \text{Local Businesses}$$

### Key Innovations:
1. **Tourism Trust Network ⭐**: Uses **NetworkX** to discover repeated service connection chains ($\text{Hotel A} \to \text{Taxi B} \to \text{Guide C} \to \text{Activity D}$) from tourist telemetry.
2. **AI Fair-Price Check**: Classifies quoted prices (`NORMAL`, `SLIGHTLY HIGH`, `HIGH`, `UNUSUALLY HIGH`) against regional database statistics.
3. **Review Intelligence Scanner**: Detects duplicate phrasing clusters, generic bot reviews, and calculates a true Review Reliability Index %.
4. **Smart Trip Recommendation Engine**: Generates day-wise budget-optimized itineraries matching user interests with verified high-trust providers.
5. **Geographic Tourism Heatmap**: Interactive Leaflet & OpenStreetMap visualization of regional tourist activity and trust hotspots.
6. **Business & Authority Dashboards**: Provides regional demand forecasting and governance telemetry.

---

## 3. Technology Stack
- **Frontend**: React 18, Vite, Lucide Icons, Recharts, Leaflet & React-Leaflet (OpenStreetMap), Modern Responsive CSS
- **Backend**: Python 3.10+, FastAPI, Uvicorn, SQLite 3, Pydantic
- **AI & Data Engines**: NetworkX (Graph Centrality & Pathways), Pandas, NumPy, Scikit-learn
- **API Standard**: RESTful JSON endpoints

---

## 4. Folder Structure
```
TrustTrip-AI/
├── backend/
│   ├── main.py                  # FastAPI Application & APIs
│   ├── database.py              # SQLite Database Schema & Helper
│   ├── models.py                # Pydantic Schemas
│   ├── seed.py                  # Seed Script (Goa, Jaipur, Kerala, Bengaluru, Mysuru, Hyderabad)
│   └── requirements.txt         # Backend Python Dependencies
├── ai/
│   ├── __init__.py
│   ├── trust_engine.py          # Trust Score (0-100) Multi-factor Algorithm
│   ├── price_intelligence.py    # Fair-Price Benchmark & Anomaly Classifier
│   ├── review_intelligence.py   # Sentiment & Repeated Wording Pattern Analyzer
│   ├── trust_network.py         # NetworkX Ecosystem Service Graph Builder
│   ├── trip_recommendation.py   # Smart Itinerary Generator
│   └── demand_predictor.py      # Demand & Trend Prediction Analytics
├── integration/
│   ├── __init__.py
│   └── config.py                # App Configurations
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css            # Custom Styling
│       ├── components/          # Navbar, Footer, ServiceCard, NetworkGraph, HeatmapView, etc.
│       ├── pages/               # 18 Full Interactive Pages
│       ├── context/             # AuthContext with Demo Role Switcher
│       └── services/            # API Connector for FastAPI
└── README.md
```

---

## 5. API Endpoints
- `GET /api/services` — Filter services by search query, category, destination, trust score, max price.
- `GET /api/services/{id}` — Full service detail + trust score + price check + review analysis + connected services.
- `POST /api/trust-score` — Evaluates multi-factor trust score (0-100).
- `POST /api/price-check` — Checks quoted price against database benchmarks.
- `POST /api/review-analysis` — Scans text patterns & sentiment breakdown.
- `POST /api/trip-recommendation` — Generates day-wise budget itinerary.
- `GET /api/trust-network` — Generates NetworkX node-link structure.
- `GET /api/heatmap` — Mapped geospatial points for Leaflet map.
- `GET /api/business-insights` — Business analytics & tourist category demand.
- `GET /api/authority-dashboard` — Macro governance & regional trust scores.
- `POST /api/feedback` — Submits feedback & ecosystem link into Trust Network.

---

## 6. How to Run Locally (Windows 64-bit / VS Code)

### Prerequisites:
- Node.js (v18+)
- Python 3.10+

### Step 1: Backend Setup
Open PowerShell or Command Prompt in VS Code:
```powershell
cd TrustTrip-AI/backend

# Create virtual environment (optional but recommended)
python -m venv venv
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Seed the database
python seed.py

# Start FastAPI server
uvicorn main:app --reload --port 8000
```
*Backend API will run at:* `http://127.0.0.1:8000`
*Swagger Docs:* `http://127.0.0.1:8000/docs`

### Step 2: Frontend Setup
Open a second terminal window:
```powershell
cd TrustTrip-AI/frontend

# Install node packages
npm install

# Start Vite development server
npm run dev
```
*Frontend App will run at:* `http://localhost:3000`

---

## 7. Demo Accounts & Role Switching
The application includes a **Top Demo Banner** with instant role switching for judge demonstration:
- **Tourist Role**: Access Discovery, Smart Trip Planner, Fair-Price Check, Review Scanner, Trust Network, Heatmap, and Feedback.
- **Business Role**: Access Business Dashboard, Demand Insights, Service Management, Review Monitoring.
- **Authority Role**: Access Smart Tourism Authority Dashboard, Regional Trust Scores, National Network Analytics.

---

## 8. Closing Line
> *"We don't want to replace Google. We want to solve the tourism-specific intelligence problem that a general search engine was never designed to solve."*
