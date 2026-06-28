ACTIVITY_LIBRARY = {

    "Reading": {

        "category": "habit",
        
        "nature": "continuous",

        "recurring": True,

        "deadline_possible": False,

         "needs": [

            "duration",

            "preferred_time"
 
        ],

        "recommended_duration": [
            "15 mins",
            "30 mins",
            "45 mins",
            "1 hour"
        ],

        "preferred_times": [
            "Morning",
            "Afternoon",
            "Evening",
            "Night"
        ]
    },

    "Gym": {

        "category": "habit",
        
        "nature": "continuous",

        "recurring": True,

        "deadline_possible": False,

        "needs": [

           "duration",

           "preferred_time",

           "days",

           "priority"

       ],

        "recommended_duration": [
            "30 mins",
            "45 mins",
            "1 hour",
            "1 hour 30 mins"
        ],

        "preferred_times": [
            "Morning",
            "Evening"
        ]
    },

    "Coaching": {

        "category": "fixed_commitment",
        
        "nature": "fixed",

        "recurring": True,

        "deadline_possible": False,

         "needs": [
           "days",
           "start_time",
           "end_time"
        ]
    },

    "College": {

        "category": "fixed_commitment",
        
        "nature": "fixed",

        "recurring": True,

        "deadline_possible": False,

        "needs": [

           "days",

           "start_time",

           "end_time"

       ]
    }
}