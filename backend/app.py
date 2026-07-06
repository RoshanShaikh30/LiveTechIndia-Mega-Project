from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from orbit_ai.engine import OrbitAI
from orbit_ai.routine_engine import RoutineEngine
from orbit_ai.adjustment_engine import AdjustmentEngine
from orbit_ai.gemini_service import understand_user_input

app = FastAPI()

app.add_middleware(
    
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173"
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"]
)

orbit = OrbitAI()
routine_engine = RoutineEngine()
adjustment_engine = AdjustmentEngine()

@app.get("/")
def home():
    return {
        "message": "Orbit AI Backend Running"
    }


@app.post("/orbit/analyze")
def analyze_user(user_data: dict):

    return orbit.analyze_user(user_data)

@app.post("/orbit/generate-routine")
def generate_routine(data: dict):

    return routine_engine.generate_routine(data)

@app.post("/orbit/adjust-schedule")
def adjust_schedule(data: dict):

    return adjustment_engine.adjust_schedule(
        data.get("routine", []),
        data.get("adjustment", {})
    )

@app.post("/test-gemini")
def test_gemini(data: dict):
    return understand_user_input(
        data.get("text", "")
    )