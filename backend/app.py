from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from orbit_ai.engine import OrbitAI

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

@app.get("/")
def home():
    return {
        "message": "Orbit AI Backend Running"
    }


@app.post("/orbit/analyze")
def analyze_user(user_data: dict):

    return orbit.analyze_user(user_data)