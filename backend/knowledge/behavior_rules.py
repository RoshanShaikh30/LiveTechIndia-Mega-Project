BEHAVIOR_RULES = {
    "fixed_commitment": {
        "target_module": "timetable",
        "required_fields": ["days", "start_time", "end_time"],
    },
    "scheduled_session": {
        "target_module": "timetable",
        "required_fields": ["duration", "preferred_time", "priority"],
    },
    "relationship": {
        "target_module": "timetable",
        "required_fields": ["frequency", "preferred_time"],
    },
    "wellbeing_habit": {
        "target_module": "habit_tracking",
        "required_fields": [],
    },
    "lifestyle_habit": {
        "target_module": "habit_tracking",
        "required_fields": [],
    },
    "reminder": {
        "target_module": "reminder_system",
        "required_fields": [],
    },
    "long_term_goal": {
        "target_module": "future_goal_planning",
        "required_fields": [],
    },
    "personal_growth": {
        "target_module": "timetable",
        "required_fields": ["duration", "preferred_time", "priority"],
    },
}

FIXED_COMMITMENT_KEYWORDS = {
    "college",
    "school",
    "university",
    "class",
    "classes",
    "lecture",
    "lectures",
    "internship",
    "office",
    "job",
    "work",
    "coaching",
    "tuition",
}

RELATIONSHIP_KEYWORDS = {
    "boyfriend",
    "girlfriend",
    "parents",
    "parent",
    "family",
    "mother",
    "father",
    "mom",
    "dad",
    "partner",
    "spouse",
    "husband",
    "wife",
    "kids",
    "children",
    "relationship",
    "quality time",
}

SCHEDULED_SESSION_KEYWORDS = {
    "reading",
    "read",
    "study",
    "studying",
    "exercise",
    "workout",
    "gym",
    "coding",
    "code",
    "project",
    "projects",
    "skill",
    "learning",
    "practice",
    "meal prep",
    "meal preparation",
    "meal planning",
}

WELLBEING_KEYWORDS = {
    "mindfulness",
    "meditation",
    "meditate",
    "mental health",
    "self care",
    "self-care",
    "better sleep",
    "sleep better",
}

LIFESTYLE_HABIT_KEYWORDS = {
    "healthy eating",
    "eat healthy",
    "healthy diet",
    "nutrition",
    "reduce junk food",
    "stop skipping meals",
    "drink water",
    "hydration",
}

REMINDER_INTENT_KEYWORDS = {
    "remind",
    "reminder",
    "forget",
    "forgot",
    "notify",
}

SCHEDULING_INTENT_KEYWORDS = {
    "schedule",
    "time for",
    "make time",
    "set aside",
    "prepare",
    "prep",
    "session",
    "slot",
}

HABIT_INTENT_KEYWORDS = {
    "habit",
    "healthier",
    "healthy",
    "reduce",
    "stop",
    "avoid",
    "skip",
    "skipping",
    "consistent",
    "consistency",
}
