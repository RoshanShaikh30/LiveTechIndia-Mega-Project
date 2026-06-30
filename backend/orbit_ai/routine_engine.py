from datetime import datetime, timedelta
from orbit_ai.parser import Parser
import re 


WEEK_DAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
]

DAY_ALIASES = {
    "mon": "Monday",
    "monday": "Monday",
    "tue": "Tuesday",
    "tues": "Tuesday",
    "tuesday": "Tuesday",
    "wed": "Wednesday",
    "wednesday": "Wednesday",
    "thu": "Thursday",
    "thur": "Thursday",
    "thurs": "Thursday",
    "thursday": "Thursday",
    "fri": "Friday",
    "friday": "Friday",
    "sat": "Saturday",
    "saturday": "Saturday",
    "sun": "Sunday",
    "sunday": "Sunday",
}

SCHEDULER_CONTEXT_KEYS = {
    "role",
    "scheduleType",
    "productiveHours",
    "freeDays",
    "wakeTime",
    "sleepTime",
    "weeklySleepTimes",
    "commitments",
    "goals",
    "goalPriority",
    "dailyTime",
    "deadlineType",
    "customDeadline",
    "successVision",
    "habits",
    "habitIntent",
    "habitFrequency",
    "habitObstacles",
    "orbitHelp",
    "priorityStruggles",
    "routineStructure",
    "planChangePreference",
    "priorityNotes",
}

TIME_BLOCK_ORDER = ["Morning", "Afternoon", "Evening", "Night"]

def duration_to_minutes(duration):
    if not duration:
        return 30

    duration = duration.lower().strip()

    hours = re.search(r"(\d+)\s*(hour|hours|hr|hrs)", duration)
    minutes = re.search(r"(\d+)\s*(minute|minutes|min|mins)", duration)

    total = 0

    if hours:
        total += int(hours.group(1)) * 60

    if minutes:
        total += int(minutes.group(1))

    return total if total > 0 else 30
  
# def duration_to_minutes(duration):
#     duration_map = {
#         "15 mins": 15,
#         "30 mins": 30,
#         "45 mins": 45,
#         "1 hour": 60,
#         "1 hour 30 mins": 90,
#     }

#     return duration_map.get(duration, 30)


def overlaps(start, end, blocked_periods):
    for period in blocked_periods:
        if start < period["end"] and end > period["start"]:
            return True

    return False


def parse_time(value, fallback="08:00"):
    try:
        return datetime.strptime(value or fallback, "%H:%M")
    except (TypeError, ValueError):
        return datetime.strptime(fallback, "%H:%M")


def later_time(first, second):
    return first if first >= second else second


class RoutineEngine:
    def _normalize_days(self, days):
        if not days:
            return WEEK_DAYS.copy()

        if isinstance(days, str):
            days = re.split(r"[,/]", days)

        normalized_days = []
        for day in days:
            normalized_day = DAY_ALIASES.get(str(day).strip().lower())
            if normalized_day and normalized_day not in normalized_days:
                normalized_days.append(normalized_day)

        return normalized_days or WEEK_DAYS.copy()

    def _wake_time_for_day(self, user_data, day):
        weekly_sleep_times = user_data.get("weeklySleepTimes", {})
        day_key = day[:3]
        daily_sleep = weekly_sleep_times.get(day_key) or weekly_sleep_times.get(day)

        if isinstance(daily_sleep, dict) and daily_sleep.get("wake"):
            return parse_time(daily_sleep.get("wake"))

        return parse_time(user_data.get("wakeTime"))

    def _place_flexible_activity(self, details, pointers, blocked_periods):
        duration = details.get("duration", "30 mins")
        preferred_time = details.get("preferred_time", "Morning")
        duration_minutes = duration_to_minutes(duration)
        preferred_key = str(preferred_time).strip().lower()

        if preferred_key == "afternoon":
            pointer_key = "Afternoon"
        elif preferred_key == "evening":
            pointer_key = "Evening"
        elif preferred_key == "night":
            pointer_key = "Night"
        else:
            pointer_key = "Morning"

        candidates = []
        for candidate_key in TIME_BLOCK_ORDER:
            start = pointers[candidate_key]
            end = start + timedelta(minutes=duration_minutes)

            while overlaps(start, end, blocked_periods):
                start += timedelta(minutes=30)
                end = start + timedelta(minutes=duration_minutes)

            candidates.append({
                "key": candidate_key,
                "start": start,
                "end": end,
            })

        preferred_candidate = next(
            candidate for candidate in candidates if candidate["key"] == pointer_key
        )
        earlier_candidates = [
            candidate
            for candidate in candidates
            if candidate["start"] < preferred_candidate["start"]
        ]
        chosen = min(earlier_candidates, key=lambda candidate: candidate["start"]) if earlier_candidates else preferred_candidate

        start = chosen["start"]
        end = chosen["end"]
        pointers[chosen["key"]] = end
        blocked_periods.append({
            "title": details.get("activity", "Flexible"),
            "start": start,
            "end": end,
        })
        return start, end, duration, preferred_time

    def generate_routine(self, user_data):
        parser = Parser()
        print(user_data)

        routine = []
        normalized_items = []
        for activity, raw_details in user_data.items():
            if activity in SCHEDULER_CONTEXT_KEYS or not isinstance(raw_details, dict):
                continue
          
            print(f"\nScheduling: {activity}")
            # print(details)
          
            # print("ACTIVITY:", activity)
            # print("DETAILS:", raw_details)
            
            details = dict(raw_details)
            parsed = parser.parse(activity)

            for key, value in parsed.items():
                details.setdefault(key, value)

            details["days"] = self._normalize_days(details.get("days"))
            normalized_items.append((activity, details))

        for day in WEEK_DAYS:
            wake_time = self._wake_time_for_day(user_data, day)
            pointers = {
                "Morning": wake_time,
                "Afternoon": later_time(parse_time("14:00"), wake_time),
                "Evening": later_time(parse_time("18:00"), wake_time),
                "Night": later_time(parse_time("21:00"), wake_time),
            }

            blocked_periods = []
            for activity, details in normalized_items:
                is_fixed = "start_time" in details and "end_time" in details

                if is_fixed and day in details["days"]:
                    blocked_periods.append({
                        "title": activity,
                        "start": parse_time(details["start_time"]),
                        "end": parse_time(details["end_time"]),
                    })

            for activity, details in normalized_items:
                if day not in details["days"]:
                    continue

                is_fixed = "start_time" in details and "end_time" in details

                if is_fixed:
                    start = parse_time(details["start_time"])
                    end = parse_time(details["end_time"])
                    duration = None
                    preferred_time = "Fixed"
                else:
                    start, end, duration, preferred_time = self._place_flexible_activity(
                        details,
                        pointers,
                        blocked_periods,
                    )

                print(f"{day}: {activity} -> {start.strftime('%H:%M')} to {end.strftime('%H:%M')}")
                routine.append({
                    "title": activity,
                    "duration": duration,
                    "preferred_time": preferred_time,
                    "start": start.strftime("%H:%M"),
                    "end": end.strftime("%H:%M"),
                    "days": [day],
                })
            # blocked_periods.append({
            #    "title": activity,
            #    "start": start,
            #    "end": end,
            # })

        # print(routine)
        print("\n========== FINAL ROUTINE ==========")
        for item in routine:
         print(item)
        print("===================================\n")  
        return routine
