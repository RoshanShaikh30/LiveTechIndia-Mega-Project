import os
import json
from dotenv import load_dotenv
from google import genai

# Load environment variables
load_dotenv()

# Get API key
API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError("GEMINI_API_KEY not found in .env file")

# Create Gemini client
client = genai.Client(api_key=API_KEY)


def understand_user_input(user_input: str):
    """
    Uses Gemini to understand the user's Orbit Insights request.
    Returns structured JSON only.
    """

    prompt = f"""
You are Orbit AI's Natural Language Understanding (NLU) engine.

Orbit is an intelligent personal planner.

IMPORTANT RULES:

1. You DO NOT create schedules.
2. You DO NOT explain anything.
3. You DO NOT answer the user.
4. You ONLY understand what the user wants.
5. Return ONLY valid JSON.
6. Never wrap the JSON inside markdown.
7. Never include any text before or after the JSON.

The user already has an existing timetable.

Your job is to extract structured information that Orbit's scheduling engine can use.

The JSON MUST follow this EXACT format:

{{
    "intent": "",
    "activity": "",
    "scope": "",
    "day": "",
    "start_time": "",
    "end_time": "",
    "priority": "",
    "action": "",
    "reason": "",
    "reference_activity": "",
    "confidence": 0.0,
    "requires_followup": false,
    "followup_question": "",
    "constraints": {{
        "keep_fixed_commitments": true,
        "allow_flexible_shift": true,
        "allow_overlap": false
    }}
}}

Valid intent values:

- add_commitment
- remove_commitment
- move_activity
- reschedule
- delay_activity
- update_activity
- reduce_workload
- increase_workload
- skip_activity
- swap_activity
- unknown

Valid priority values:

- fixed
- flexible
- preferred
- unknown

Valid scope values:

- today
- tomorrow
- future
- recurring
- specific_day
- unknown

Rules:

- Convert times into 24-hour HH:MM format.
- Infer priority whenever possible.
- If the request is unclear, set:
    requires_followup = true
    and provide a followup_question.
- Estimate confidence between 0.0 and 1.0.
- Keep activity names short.
- If no reason is given, leave it blank.
- If no reference activity exists, leave it blank.

Return ONLY JSON.

User message:

{user_input}
"""

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )

        text = response.text.strip()

        # Remove markdown formatting if Gemini adds it
        text = text.replace("```json", "").replace("```", "").strip()

        return json.loads(text)

    except json.JSONDecodeError:
        return {
            "error": "Gemini returned invalid JSON.",
            "raw_response": text
        }

    except Exception as e:
        return {
            "error": str(e)
        }