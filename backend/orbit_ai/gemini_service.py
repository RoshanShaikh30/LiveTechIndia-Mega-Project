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
        
def convert_to_orbit_format(gemini_data):
    """
    Converts Gemini JSON into the format expected by
    Orbit's AdjustmentEngine.
    """

    return {
        "activity": gemini_data.get("activity", ""),
        "days": [gemini_data["day"]] if gemini_data.get("day") else [],
        "intent": gemini_data.get("intent", ""),
        "start": gemini_data.get("start_time"),
        "end": gemini_data.get("end_time"),
        "priority": gemini_data.get("priority", "unknown"),
        "action": gemini_data.get("action", ""),
        "scope": gemini_data.get("scope", ""),
        "reason": gemini_data.get("reason", ""),
        "reference_activity": gemini_data.get("reference_activity", ""),
        "constraints": gemini_data.get("constraints", {}),
        "confidence": gemini_data.get("confidence", 0.0),
        "requires_followup": gemini_data.get("requires_followup", False),
        "followup_question": gemini_data.get("followup_question", "")
    }
    
def understand_activity_input(user_input: str):
    """
    Uses Gemini to understand onboarding activities.
    Returns structured JSON containing ALL activities found.
    """

    prompt = f"""
You are the onboarding understanding engine for Orbit AI.

The user is describing their habits, goals or fixed commitments.

Your job is to identify EVERY activity separately.

Return ONLY valid JSON.

Return this EXACT format:

{{
  "activities": [
    {{
      "activity": "",
      "category": "",
      "days": [],
      "start_time": "",
      "end_time": "",
      "preferred_time": "",
      "duration": "",
      "frequency": "",
      "priority": ""
    }}
  ]
}}

Rules:

- Split multiple activities into separate objects.
- Never merge two different activities.
- Infer the category whenever possible.

Valid categories:

- fixed_commitment
- habit
- goal

Example 1

Input:
My internship is on Monday Wednesday Friday and college is Wednesday Friday.

Output:
{{
  "activities": [
    {{
      "activity": "Internship",
      "category": "fixed_commitment",
      "days": ["Monday", "Wednesday", "Friday"],
      "start_time": "",
      "end_time": "",
      "preferred_time": "",
      "duration": "",
      "frequency": "",
      "priority": ""
    }},
    {{
      "activity": "College",
      "category": "fixed_commitment",
      "days": ["Wednesday", "Friday"],
      "start_time": "",
      "end_time": "",
      "preferred_time": "",
      "duration": "",
      "frequency": "",
      "priority": ""
    }}
  ]
}}

Example 2

Input:
I study every evening for 2 hours.

Output:
{{
  "activities": [
    {{
      "activity": "Study",
      "category": "goal",
      "days": [],
      "start_time": "",
      "end_time": "",
      "preferred_time": "Evening",
      "duration": "2 hours",
      "frequency": "",
      "priority": ""
    }}
  ]
}}

User input:

{user_input}
"""

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )

        text = response.text.strip()

        text = text.replace("```json", "").replace("```", "").strip()

        print("\n===== GEMINI ONBOARDING RESPONSE =====")
        print(text)
        print("======================================\n")

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