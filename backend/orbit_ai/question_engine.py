"""
Orbit Question Engine

NOTE:
Although this file is named Question Engine,
it functions as Orbit's reasoning engine.

Its responsibility is NOT simply generating questions.

It:
1. Analyzes user information.
2. Determines what information is missing.
3. Decides whether more questions are required.
4. Returns structured question requests for Orbit AI.

Question generation is only one part of its reasoning process.
"""

from knowledge.category_rules import CATEGORY_RULES
from knowledge.question_templates import QUESTION_TEMPLATES


class QuestionEngine:

    def analyze_activity(
        self,
        activity_name,
        category,
        known_information
    ):

        questions = []

        category_data = CATEGORY_RULES.get(category)

        if not category_data:
            return questions

        for rule in category_data["required_fields"]:

            field = rule["field"]

            if field in known_information:
                continue

            template = QUESTION_TEMPLATES[field]

            question = {
                "activity": activity_name,
                "field": field,
                "question": template["question"].replace(
                    "{activity}",
                    activity_name
                ),
                "input_type": template["input_type"],
                "allow_custom": template.get(
                    "allow_custom",
                    False
                )
            }

            if "suggestions" in template:
                question["suggestions"] = template["suggestions"]

            questions.append(question)

        return questions
    
    def analyze_user(self, user_data):

        grouped_questions = []

        sections = [
            ("habits", "habit"),
            ("goals", "goal"),
            ("fixedCommitments", "fixed_commitment")
        ]

        for section_name, category in sections:

            activities = user_data.get(section_name, [])

            for activity in activities:

                activity_questions = self.analyze_activity(
                    activity_name=activity,
                    category=category,
                    known_information={}
                )

                if activity_questions:

                 grouped_questions.append({

                  "activity": activity,

                  "category": category,

                  "questions": activity_questions

                })

        return grouped_questions