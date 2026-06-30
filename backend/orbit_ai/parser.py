import re

class Parser:

    def parse(self, text):

        info = {}

        lower = text.lower()

        # Days

        day_map = {
            "monday": "Monday",
            "tuesday": "Tuesday",
            "wednesday": "Wednesday",
            "thursday": "Thursday",
            "friday": "Friday",
            "saturday": "Saturday",
            "sunday": "Sunday"
        }

        days = []

        for day in day_map:

            if day in lower:
                days.append(day_map[day])

        if days:
            info["days"] = days

        # Extract activity name

        activity = re.split(
            r"\bon\b|\bat\b|\bfrom\b",
            text,
            flags=re.IGNORECASE
        )[0].strip()

        info["activity"] = activity

        return info