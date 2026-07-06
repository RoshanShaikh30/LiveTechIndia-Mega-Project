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
You are the Natural Language Understanding (NLU) engine for Orbit AI.

Your ONLY job is to understand the user's request.

DO NOT generate a schedule.

DO NOT explain your reasoning.

DO NOT write any extra text.

Return ONLY valid JSON.

The JSON MUST follow this exact format:

{{
    "intent": "",
    "scope": "",
    "activity": "",
    "day": "",
    "start_time": "",
    "end_time": "",
    "action": "",
    "reason": "",
    "notes": ""
}}

Meaning of fields:

intent:
- add
- remove
- move
- update
- reschedule
- reduce_workload
- unknown

scope:
- today
- tomorrow
- recurring
- specific_day
- future
- unknown

activity:
Name of the activity.

day:
Monday, Tuesday, etc. Leave empty if unknown.

start_time:
24-hour format HH:MM if available.

end_time:
24-hour format HH:MM if available.

action:
Examples:
move_after_dinner
delay
cancel
replace
shorten
extend
swap
add

reason:
Why the user wants the change.

notes:
Any additional useful context.

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