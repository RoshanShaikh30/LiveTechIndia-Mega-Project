class QuestionEngine:

    def generate_questions(self, missing_information):

        questions = []

        for item in missing_information:

            if item == "coaching_time":

                questions.append({
                    "id": item,
                    "question": "What time does your coaching start?",
                    "type": "time"
                })

            elif item == "coaching_duration":

                questions.append({
                    "id": item,
                    "question": "How long does coaching usually last?",
                    "type": "duration",
                    "allow_custom": True,
                    "suggestions": [
                        "30 mins",
                        "1 hour",
                        "2 hours"
                    ]
                })

            elif item == "reading_duration":

                questions.append({
                    "id": item,
                    "question": "How long do you usually read?",
                    "type": "duration",
                    "allow_custom":True,
                    "suggestions": [
                        "15 mins",
                        "30 mins",
                        "45 mins",
                        "1 hour"
                    ]
                })

            elif item == "study_session":

                questions.append({
                    "id": item,
                    "question": "How long do you prefer one study session?",
                    "type": "duration",
                    "allow_custom":True,
                    "suggestions": [
                        "30 mins",
                        "45 mins",
                        "1 hour",
                        "2 hours"
                    ]
                })

        return questions