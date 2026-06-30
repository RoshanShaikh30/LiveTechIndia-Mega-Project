QUESTION_TEMPLATES = {

    "duration": {

        "question": "How much time would you like to set aside for {activity}?",

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

        "question": "When would {activity} fit most naturally?",

        "input_type": "time_preference"
    },

    "priority": {

        "question": "How important should {activity} be when Orbit plans your routine?",

        "input_type": "priority",

        "suggestions": [
            "Low",
            "Medium",
            "High"
        ]
    },

    "days": {

        "question": "Which days is {activity} fixed?",

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

        "question": "How much time would you like to set aside for {activity}?",

        "input_type": "duration",

        "allow_custom": True
    },

    "frequency": {

        "question": "How often would you like to make time for {activity}?",

        "input_type": "time_preference",

        "suggestions": [
            "Daily",
            "A few times a week",
            "Weekly",
            "Weekends"
        ]
    },

    "deadline": {

        "question": "Do you have a deadline for {activity}?",

        "input_type": "date"
    }

}
