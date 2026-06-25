from fastapi import FastAPI
from orbit_ai.engine import OrbitAI

app = FastAPI()

orbit = OrbitAI()

@app.get("/")
def home():
    return {
        "message": "Orbit AI Backend Running"
    }


@app.post("/orbit/analyze")
def analyze_user(user_data: dict):

    return orbit.analyze_user(user_data)