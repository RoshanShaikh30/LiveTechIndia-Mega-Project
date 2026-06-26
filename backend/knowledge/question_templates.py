QUESTION_TEMPLATES = {

    "duration": {

        "question": "How much time would you like to spend on {activity}?",

        "input_type": "duration",

        "allow_custom": True,

        "suggestions": [
            "15 mins",
            "30 mins",
            "45 mins",
            "1 hour"
        ]
    },

    "preferred_time": {

        "question": "When would you prefer to do {activity}?",

        "input_type": "time_preference"
    },

    "priority": {

        "question": "How important is {activity} to your daily routine?",

        "input_type": "priority",

        "suggestions": [
            "Low",
            "Medium",
            "High"
        ]
    },

    "days": {

        "question": "Which days do you usually have {activity}?",

        "input_type": "days"
    },

    "start_time": {

        "question": "What time does {activity} usually start?",

        "input_type": "time"
    },

    "end_time": {

        "question": "What time does {activity} usually end?",

        "input_type": "time"
    },

    "session_duration": {

        "question": "How long would you like each {activity} session to be?",

        "input_type": "duration",

        "allow_custom": True
    },

    "deadline": {

        "question": "Do you have a deadline for {activity}?",

        "input_type": "date"
    }

}