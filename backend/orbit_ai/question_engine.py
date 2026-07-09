"""
Orbit Question Engine

This module is Orbit's reasoning layer. It classifies the user's intent into
behaviours first, then asks only for facts that cannot be inferred from parser
output or onboarding context.
"""

import re

from knowledge.activity_aliases import ACTIVITY_ALIASES
from knowledge.activity_library import ACTIVITY_LIBRARY
from knowledge.behavior_rules import (
    BEHAVIOR_RULES,
    FIXED_COMMITMENT_KEYWORDS,
    HABIT_INTENT_KEYWORDS,
    LIFESTYLE_HABIT_KEYWORDS,
    RELATIONSHIP_KEYWORDS,
    REMINDER_INTENT_KEYWORDS,
    SCHEDULED_SESSION_KEYWORDS,
    SCHEDULING_INTENT_KEYWORDS,
    WELLBEING_KEYWORDS,
)
from knowledge.category_rules import CATEGORY_RULES
from knowledge.question_templates import QUESTION_TEMPLATES
from orbit_ai.parser import Parser
from orbit_ai.gemini_service import understand_activity_input


class QuestionEngine:
    DEADLINE_ELIGIBLE_ACTIVITIES = {
        "project",
        "career",
        "study goal",
        "exam",
        "certification",
        "assignment",
        "skill learning",
        "skill",
        "learning",
    }

    def __init__(self):
        self.parser = Parser()
        self.alias_lookup = {
            key.lower(): value for key, value in ACTIVITY_ALIASES.items()
        }
        self.library_lookup = {
            key.lower(): key for key in ACTIVITY_LIBRARY.keys()
        }

    def analyze_user(self, user_data):
        print("\n========== USER DATA ==========")
        print(user_data)
        print("===============================\n")
        grouped_questions = []
        routine_seed = {}
        activity_entries = {}
        activity_order = []

        sections = [
            ("habits", "habit"),
            ("goals", "goal"),
            ("commitments", "fixed_commitment"),
        ]

        # for section_name, fallback_category in sections:
        #     for activity_text in user_data.get(section_name, []):
        #         parsed = self.parser.parse(activity_text)
        #         activity_name = self._canonical_activity(parsed["activity"])
        #         dedupe_key = activity_name.lower()

        #         if dedupe_key not in activity_entries:
        #             activity_entries[dedupe_key] = {
        #                 "activity_name": activity_name,
        #                 "category": fallback_category,
        #                 "texts": [],
        #             }
        #             activity_order.append(dedupe_key)

        #         activity_entries[dedupe_key]["texts"].append(str(activity_text))
        
        for section_name, fallback_category in sections:
          for activity_text in user_data.get(section_name, []):
              
           activity_parts = self.parser.split_multiple_activities(activity_text)

           for activity_text in activity_parts:
              
             print("Section:", section_name)
             print("Activity text:", activity_text)
              
             try:
               gemini_result = understand_activity_input(activity_text)
               activities = gemini_result.get("activities", [])
               print("Gemini Activities:", activities)

             except Exception as e:
                 print("Gemini Error:", e)
                 activities = []

             if not activities:
              parsed = self.parser.parse(activity_text)

              activities = [{
                "activity": parsed.get("activity", ""),
                "category": fallback_category,
                "days": parsed.get("days", []),
                "start_time": parsed.get("start_time", ""),
                "end_time": parsed.get("end_time", ""),
                "preferred_time": parsed.get("preferred_time", ""),
                "duration": parsed.get("duration", ""),
                "frequency": parsed.get("frequency", ""),
                "priority": ""
               }]

             for parsed in activities:

              activity_name = self._canonical_activity(parsed["activity"])
              dedupe_key = activity_name.lower()

              if dedupe_key not in activity_entries:
                activity_entries[dedupe_key] = {
                    "activity_name": activity_name,
                    "category": parsed.get("category") or fallback_category,
                    "texts": [],
                }
                activity_order.append(dedupe_key)

              activity_entries[dedupe_key]["texts"].append(activity_text)

        for dedupe_key in activity_order:
            entry = activity_entries[dedupe_key]
            activity_name = entry["activity_name"]
            fallback_category = entry["category"]
            activity_text = ". ".join(entry["texts"])
            parsed = self.parser.parse(activity_text)

            reasoning = self._reason_about_activity(
                activity_text=activity_text,
                activity_name=activity_name,
                category=fallback_category,
                parsed=parsed,
                user_data=user_data,
            )

            known_information = reasoning["known_information"]
            
            if reasoning["target_module"] == "timetable":
                routine_seed[activity_name] = known_information.copy()

            questions = self._build_questions(
                activity_name=activity_name,
                behavior=reasoning["behavior"],
                known_information=known_information,
            )

            if questions:
                grouped_questions.append({
                    "activity": activity_name,
                    "source_activity": activity_text,
                    "category": fallback_category,
                    "behavior": reasoning["behavior"],
                    "target_module": reasoning["target_module"],
                    "known_information": known_information,
                    "questions": questions,
                })

        return {
            "questions": grouped_questions,
            "routine_seed": routine_seed,
        }

    def analyze_activity(self, activity_name, category, known_information):
        activity_name = self._canonical_activity(activity_name)
        reasoning = self._reason_about_activity(
            activity_text=activity_name,
            activity_name=activity_name,
            category=category,
            parsed=known_information,
            user_data={},
        )
        return self._build_questions(
            activity_name=activity_name,
            behavior=reasoning["behavior"],
            known_information=reasoning["known_information"],
        )

    def _reason_about_activity(self, activity_text, activity_name, category, parsed, user_data):
        combined_text = self._combined_context(activity_text, user_data)
        behavior = self._classify_behavior(activity_name, category, combined_text)
        known_information = self._infer_known_information(
            activity_name=activity_name,
            activity_text=activity_text,
            behavior=behavior,
            parsed=parsed,
            user_data=user_data,
        )

        return {
            "behavior": behavior,
            "target_module": BEHAVIOR_RULES[behavior]["target_module"],
            "known_information": known_information,
        }

    def _classify_behavior(self, activity_name, category, combined_text):
        lower_name = activity_name.lower()
        text = f"{lower_name} {combined_text.lower()}"

        if lower_name in {"better sleep", "sleep better", "improve sleep"}:
            return "wellbeing_habit"

        if self._contains_any(lower_name, REMINDER_INTENT_KEYWORDS):
            return "reminder"

        if self._contains_any(lower_name, RELATIONSHIP_KEYWORDS):
            return "relationship"

        if self._contains_any(lower_name, FIXED_COMMITMENT_KEYWORDS):
            return "fixed_commitment"

        if "healthy eating" in lower_name or "healthy diet" in lower_name or "nutrition" in lower_name:
            if self._contains_any(text, SCHEDULING_INTENT_KEYWORDS):
                return "scheduled_session"
            if self._contains_any(text, HABIT_INTENT_KEYWORDS):
                return "lifestyle_habit"
            return "lifestyle_habit"

        if self._contains_any(lower_name, WELLBEING_KEYWORDS):
            if self._contains_any(text, SCHEDULING_INTENT_KEYWORDS):
                return "scheduled_session"
            return "wellbeing_habit"

        if self._contains_any(lower_name, SCHEDULED_SESSION_KEYWORDS):
            return "scheduled_session"

        if self._contains_any(lower_name, LIFESTYLE_HABIT_KEYWORDS):
            return "lifestyle_habit"

        if category == "fixed_commitment":
            return "fixed_commitment"
        if category == "goal":
            return "scheduled_session"
        if category == "habit":
            return "lifestyle_habit"

        return "long_term_goal"

    def _infer_known_information(self, activity_name, activity_text, behavior, parsed, user_data):
        known = {
            key: value
            for key, value in parsed.items()
            if key != "activity" and value not in (None, "", [])
        }

        context_info = self._parse_activity_context(activity_name, activity_text, user_data)
        for key, value in context_info.items():
            if key != "activity" and value not in (None, "", []):
                known.setdefault(key, value)

        goal_priority = user_data.get("goalPriority", {})
        if activity_name in goal_priority and goal_priority[activity_name]:
            known.setdefault("priority", goal_priority[activity_name])
        if activity_text in goal_priority and goal_priority[activity_text]:
            known.setdefault("priority", goal_priority[activity_text])

        if behavior in {"scheduled_session", "personal_growth"}:
            productive_hours = user_data.get("productiveHours", [])
            if len(productive_hours) == 1:
                known.setdefault("preferred_time", productive_hours[0])

        if behavior == "relationship":
            habit_frequency = user_data.get("habitFrequency")
            if habit_frequency:
                known.setdefault("frequency", habit_frequency)

        # if behavior == "fixed_commitment":
        #     free_days = self._normalize_free_days(user_data.get("freeDays", []))
        #     if free_days and "days" not in known:
        #         known["days"] = free_days

        if self._deadline_makes_sense(activity_name) and user_data.get("deadlineType") and user_data.get("deadlineType") != "custom":
            known.setdefault("deadline", user_data["deadlineType"])
        if self._deadline_makes_sense(activity_name) and user_data.get("customDeadline"):
            known.setdefault("deadline", user_data["customDeadline"])

        return known

    def _build_questions(self, activity_name, behavior, known_information):
        questions = []
        seen_fields = set()

        for field in self._required_fields(activity_name, behavior):
            if field in known_information or field in seen_fields:
                continue

            template = QUESTION_TEMPLATES.get(field)
            if not template:
                continue

            question = {
                "activity": activity_name,
                "field": field,
                "question": self._question_text(activity_name, field, template),
                "input_type": template["input_type"],
                "allow_custom": template.get("allow_custom", False),
            }

            suggestions = self._suggestions(activity_name, field, template)
            if suggestions:
                question["suggestions"] = suggestions

            questions.append(question)
            seen_fields.add(field)

        return questions

    def _required_fields(self, activity_name, behavior):
        lower_name = activity_name.lower()

        activity_data = ACTIVITY_LIBRARY.get(activity_name, {})
        if activity_data.get("needs") is not None:
            fields = list(activity_data["needs"])
        else:
            fields = list(BEHAVIOR_RULES[behavior]["required_fields"])

        if behavior == "scheduled_session":
            fields = [field for field in fields if field != "priority"]
            if "duration" not in fields:
                fields.insert(0, "duration")
            if "preferred_time" not in fields:
                fields.append("preferred_time")

        if self._deadline_makes_sense(activity_name):
            if "deadline" not in fields:
                fields.append("deadline")
        else:
            fields = [field for field in fields if field != "deadline"]

        if lower_name in {"mindfulness", "better sleep", "healthy eating"}:
            return []

        if behavior == "relationship":
            return ["preferred_time"]

        return fields

    def _question_text(self, activity_name, field, template):
        lower_name = activity_name.lower()
        if lower_name in {"mental health", "self care", "self-care"} and field == "duration":
            return "How much time would you like to set aside for yourself?"
        if lower_name in {"mental health", "self care", "self-care"} and field == "preferred_time":
            return "When would that time feel most natural?"
        if field == "frequency" and activity_name == "Relationship":
            return "How often would you like to make time for them?"
        if field == "preferred_time" and activity_name == "Relationship":
            return "When would time with them fit most naturally?"

        return template["question"].replace("{activity}", activity_name)

    def _suggestions(self, activity_name, field, template):
        activity_data = ACTIVITY_LIBRARY.get(activity_name, {})
        if field in {"duration", "session_duration"}:
            return activity_data.get("recommended_duration") or template.get("suggestions")
        if field == "preferred_time":
            return activity_data.get("preferred_times") or template.get("suggestions")
        return template.get("suggestions")

    def _canonical_activity(self, activity_name):
        activity_name = str(activity_name or "").strip()
        lower_name = activity_name.lower()

        if lower_name in self.alias_lookup:
            return self.alias_lookup[lower_name]
        if lower_name in self.library_lookup:
            return self.library_lookup[lower_name]

        title_name = activity_name.title()
        return ACTIVITY_ALIASES.get(title_name, title_name)

    def _combined_context(self, activity_text, user_data):
        text_parts = [activity_text]
        for key in [
            "habitIntent",
            "habitObstacles",
            "orbitHelp",
            "priorityStruggles",
            "successVision",
            "priorityNotes",
        ]:
            value = user_data.get(key)
            if isinstance(value, list):
                text_parts.extend(str(item) for item in value)
            elif value:
                text_parts.append(str(value))
        return " ".join(text_parts)

    def _parse_activity_context(self, activity_name, activity_text, user_data):
        context = self._notes_context(user_data)
        chunks = re.split(r"[\n.;]+", context)
        relevant_chunks = []
        activity_terms = self._activity_terms(activity_name, activity_text)

        for chunk in chunks:
            lower_chunk = chunk.lower()
            if any(term and term in lower_chunk for term in activity_terms):
                relevant_chunks.append(chunk)

        if not relevant_chunks:
            return {}

        return self.parser.parse(" ".join(relevant_chunks))

    def _notes_context(self, user_data):
        text_parts = []
        for key in [
            "habitIntent",
            "habitObstacles",
            "orbitHelp",
            "priorityStruggles",
            "successVision",
            "priorityNotes",
        ]:
            value = user_data.get(key)
            if isinstance(value, list):
                text_parts.extend(str(item) for item in value)
            elif value:
                text_parts.append(str(value))
        return "\n".join(text_parts)

    def _activity_terms(self, activity_name, activity_text):
        terms = {activity_name.lower(), str(activity_text or "").lower()}
        for alias, canonical in ACTIVITY_ALIASES.items():
            if canonical == activity_name:
                terms.add(alias.lower())
        return {term for term in terms if term}

    def _deadline_makes_sense(self, activity_name):
        lower_name = activity_name.lower()
        if lower_name in {
            "healthy eating",
            "reading",
            "exercise",
            "better sleep",
            "mindfulness",
            "relationship",
        }:
            return False
        return any(token in lower_name for token in self.DEADLINE_ELIGIBLE_ACTIVITIES)

    def _contains_any(self, text, keywords):
        return any(keyword in text for keyword in keywords)

    def _normalize_free_days(self, days):
        day_lookup = {
            "Mon": "Monday",
            "Tue": "Tuesday",
            "Wed": "Wednesday",
            "Thu": "Thursday",
            "Fri": "Friday",
            "Sat": "Saturday",
            "Sun": "Sunday",
        }
        return [day_lookup.get(day, day) for day in days]
