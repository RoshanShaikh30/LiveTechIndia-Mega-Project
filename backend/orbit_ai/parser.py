import re


class Parser:
    ALL_DAYS = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ]
    WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    WEEKENDS = ["Saturday", "Sunday"]

    DAY_MAP = {
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

    TIME_PREFERENCES = {
        "morning": "Morning",
        "afternoon": "Afternoon",
        "evening": "Evening",
        "night": "Night",
    }

    def parse(self, text):
        info = {}
        text = str(text or "").strip()
        lower = text.lower()

        days = self._extract_days(lower)
        if days:
            info["days"] = days

        time_range = self._extract_time_range(lower)
        if time_range:
            info["start_time"], info["end_time"] = time_range

        duration = self._extract_duration(lower)
        if duration:
            info["duration"] = duration
            info["session_duration"] = duration

        preferred_time = self._extract_preferred_time(lower)
        if preferred_time:
            info["preferred_time"] = preferred_time

        deadline = self._extract_deadline(lower)
        if deadline:
            info["deadline"] = deadline

        frequency = self._extract_frequency(lower)
        if frequency:
            info["frequency"] = frequency

        info["activity"] = self._extract_activity(text)
        
        # print("PARSER INPUT:", text)
        # print("PARSER OUTPUT:", info)
        return info

    def _extract_days(self, lower):
        days = []
        if re.search(r"\b(every\s+day|daily)\b", lower):
            days = self.ALL_DAYS.copy()
        elif re.search(r"\b(every\s+weekday|weekdays|mon\s*(?:-|to)\s*fri|monday\s*(?:-|to)\s*friday)\b", lower):
            days = self.WEEKDAYS.copy()
        elif re.search(r"\b(weekends?|every\s+weekend)\b", lower):
            days = self.WEEKENDS.copy()

        for token, day in self.DAY_MAP.items():
            if re.search(rf"\b{re.escape(token)}\b", lower) and day not in days:
                days.append(day)

        excluded_days = []
        for exclusion in re.finditer(
            r"\b(?:except|excluding|not\s+on|no\s+\w+\s+on|holiday\s+on|off\s+on)\s+"
            r"(monday|mon|tuesday|tues|tue|wednesday|wed|thursday|thurs|thur|thu|"
            r"friday|fri|saturday|sat|sunday|sun)\b",
            lower,
        ):
            excluded_days.append(self.DAY_MAP[exclusion.group(1)])

        if excluded_days and (not days or all(day in excluded_days for day in days)):
            days = self.ALL_DAYS.copy()

        if excluded_days:
            days = [day for day in days if day not in excluded_days]

        return days

    def _extract_time_range(self, lower):
        pattern = re.compile(
            r"\b(?:from\s+)?(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\s*"
            r"(?:-|–|—|to|until|till)\s*"
            r"(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b"
        )
        match = pattern.search(lower)
        if not match:
            return None

        start_hour, start_minute, start_meridiem, end_hour, end_minute, end_meridiem = match.groups()
        if not start_meridiem and end_meridiem:
            start_meridiem = end_meridiem

        return (
            self._format_time(start_hour, start_minute, start_meridiem),
            self._format_time(end_hour, end_minute, end_meridiem),
        )

    def _format_time(self, hour, minute, meridiem):
        hour = int(hour)
        minute = int(minute or 0)

        if meridiem == "pm" and hour != 12:
            hour += 12
        elif meridiem == "am" and hour == 12:
            hour = 0

        return f"{hour:02d}:{minute:02d}"

    def _extract_duration(self, lower):
        match = re.search(
            r"\b(\d+(?:\.\d+)?)\s*(?:hours?|hrs?|hr|h)\s*"
            r"(?:(\d+)\s*(?:minutes?|mins?|min|m))?\b",
            lower,
        )
        if match:
            hours = float(match.group(1))
            extra_minutes = int(match.group(2) or 0)
            total_minutes = int(hours * 60) + extra_minutes
            return self._format_duration(total_minutes)

        match = re.search(r"\b(\d+(?:\.\d+)?)\s*(hours?|hrs?|h)\b", lower)
        if match:
            amount = float(match.group(1))
            return self._format_duration(int(amount * 60))

        match = re.search(r"\b(\d+)\s*(minutes?|mins?|min|m)\b", lower)
        if match:
            return self._format_duration(int(match.group(1)))

        return None

    def _format_duration(self, total_minutes):
        hours = total_minutes // 60
        minutes = total_minutes % 60
        if hours and minutes:
            hour_label = "hour" if hours == 1 else "hours"
            return f"{hours} {hour_label} {minutes} mins"
        if hours:
            hour_label = "hour" if hours == 1 else "hours"
            return f"{hours} {hour_label}"
        return f"{minutes} mins"

    def _extract_preferred_time(self, lower):
        for token, value in self.TIME_PREFERENCES.items():
            if re.search(rf"\b{token}\b", lower):
                return value
        return None

    def _extract_deadline(self, lower):
        if "within a week" in lower:
            return "Within a week"
        if "within a month" in lower:
            return "Within a month"
        if "within 3 months" in lower or "within three months" in lower:
            return "Within 3 months"
        match = re.search(r"\b(?:till|until|by|before)\s+([a-z]+(?:\s+\d{1,2})?)\b", lower)
        if match and not re.search(r"\d{1,2}\s*(?:am|pm)?\b", match.group(1)):
            return match.group(1).title()
        return None

    def _extract_frequency(self, lower):
        if "daily" in lower or "every day" in lower:
            return "Daily"
        if "every weekday" in lower or "weekdays" in lower:
            return "Weekdays"
        match = re.search(r"\b(\d+)\s*(?:x|times)\s*(?:a|per)?\s*week\b", lower)
        if match:
            return f"{match.group(1)} times a week"
        if "weekly" in lower or "once a week" in lower:
            return "Weekly"
        if "weekend" in lower:
            return "Weekends"
        return None

    def _extract_activity(self, text):
        intent_match = re.search(
            r"\b(?:make time for|set aside time for|time for)\s+(.+)$",
            text,
            flags=re.IGNORECASE,
        )
        if intent_match:
            text = intent_match.group(1).strip()

        activity = re.split(
            r"\bon\b|\bat\b|\bfrom\b|\bfor\s+\d|\bin the\b|\bevery\b|\bdaily\b|"
            r"\btill\b|\buntil\b|\bby\b|\bbefore\b|"
            r"\b\d+(?:\.\d+)?\s*(?:hours?|hrs?|hr|h|minutes?|mins?|min|m)\b|"
            r"\b\d{1,2}(?::\d{2})?\s*(?:am|pm)\b|"
            r"\bmonday\b|\bmon\b|\btuesday\b|\btue\b|\btues\b|\bwednesday\b|\bwed\b|"
            r"\bthursday\b|\bthu\b|\bthur\b|\bthurs\b|\bfriday\b|\bfri\b|"
            r"\bsaturday\b|\bsat\b|\bsunday\b|\bsun\b",
            text,
            flags=re.IGNORECASE,
        )[0].strip()

        activity = re.sub(
            r"^(i\s+)?(want|need|have|would like|like)\s+(to\s+)?",
            "",
            activity,
            flags=re.IGNORECASE,
        ).strip()
        activity = re.sub(
            r"^(my|the|a|an)\s+",
            "",
            activity,
            flags=re.IGNORECASE,
        ).strip()
        activity = re.sub(
            r"^no\s+",
            "",
            activity,
            flags=re.IGNORECASE,
        ).strip()
        activity = re.sub(
            r"\s+(is|are|happens|runs)$",
            "",
            activity,
            flags=re.IGNORECASE,
        ).strip()
        

        return activity or text
