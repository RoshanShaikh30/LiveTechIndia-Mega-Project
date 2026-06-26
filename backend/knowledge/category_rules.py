CATEGORY_RULES = {

    "habit": {

        "required_fields": [

            {
                "field": "duration",
                "required": True
            },

            {
                "field": "preferred_time",
                "required": True
            },

            {
                "field": "priority",
                "required": False
            }

        ]
    },

    "fixed_commitment": {

        "required_fields": [

            {
                "field": "days",
                "required": True
            },

            {
                "field": "start_time",
                "required": True
            },

            {
                "field": "end_time",
                "required": True
            }

        ]
    },

    "goal": {

        "required_fields": [

            {
                "field": "session_duration",
                "required": True
            },

            {
                "field": "deadline",
                "required": False
            }

        ]
    }

}