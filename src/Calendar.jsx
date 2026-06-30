import { useMemo, useState } from "react";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaHome,
  FaLightbulb,
  FaRegCalendarCheck,
  FaSyncAlt,
} from "react-icons/fa";
import "./App.css";

const weekDays = [
  { key: "monday", label: "Monday", short: "Mon" },
  { key: "tuesday", label: "Tuesday", short: "Tue" },
  { key: "wednesday", label: "Wednesday", short: "Wed" },
  { key: "thursday", label: "Thursday", short: "Thu" },
  { key: "friday", label: "Friday", short: "Fri" },
  { key: "saturday", label: "Saturday", short: "Sat" },
  { key: "sunday", label: "Sunday", short: "Sun" }
];

const dayAliases = {
  mon: "monday",
  monday: "monday",
  tue: "tuesday",
  tues: "tuesday",
  tuesday: "tuesday",
  wed: "wednesday",
  wednesday: "wednesday",
  thu: "thursday",
  thur: "thursday",
  thurs: "thursday",
  thursday: "thursday",
  fri: "friday",
  friday: "friday",
  sat: "saturday",
  saturday: "saturday",
  sun: "sunday",
  sunday: "sunday"
};

const parseTimeToMinutes = (time) => {
  if (!time) return null;

  const normalizedTime = String(time).trim();
  const match = normalizedTime.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/i);
  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = Number(match[2] || 0);
  const meridiem = match[3]?.toUpperCase();

  if (meridiem === "PM" && hours !== 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;

  return hours * 60 + minutes;
};

const formatTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
};

const normalizeRoutineDays = (item) => {
  const rawDays = item.days || item.day || item.weekdays || item.weekday;
  if (!rawDays) return weekDays.map((day) => day.key);

  const dayValues = Array.isArray(rawDays) ? rawDays : String(rawDays).split(/[,/]/);
  const normalizedDays = dayValues
    .map((day) => dayAliases[String(day).trim().toLowerCase()])
    .filter(Boolean);

  return normalizedDays.length > 0 ? normalizedDays : weekDays.map((day) => day.key);
};

function WeeklyTimetable({ routine }) {
  const timetableItems = useMemo(() => (
    (routine || [])
      .map((item, index) => {
        const startMinutes = parseTimeToMinutes(item.start || item.start_time || item.time);
        if (startMinutes === null) return null;

        const parsedEndMinutes = parseTimeToMinutes(item.end || item.end_time);
        const endMinutes = parsedEndMinutes === null ? startMinutes + 60 : parsedEndMinutes;

        return {
          id: `${item.title}-${startMinutes}-${index}`,
          title: item.title || item.task || "Routine activity",
          startMinutes,
          endMinutes,
          days: normalizeRoutineDays(item)
        };
      })
      .filter(Boolean)
  ), [routine]);

  const timeSlots = useMemo(() => {
    if (timetableItems.length === 0) {
      return Array.from({ length: 15 }, (_, index) => 8 * 60 + index * 60);
    }

    const earliest = Math.min(...timetableItems.map((item) => item.startMinutes));
    const latest = Math.max(...timetableItems.map((item) => item.endMinutes));
    const start = Math.max(0, Math.floor(earliest / 60) * 60);
    const end = Math.min(24 * 60, Math.ceil(latest / 60) * 60);
    const slotCount = Math.max(1, Math.ceil((end - start) / 60));

    return Array.from({ length: slotCount }, (_, index) => start + index * 60);
  }, [timetableItems]);

  const getItemsForCell = (dayKey, slotStart) => {
    const slotEnd = slotStart + 60;
    return timetableItems.filter((item) => (
      item.days.includes(dayKey) &&
      item.startMinutes >= slotStart &&
      item.startMinutes < slotEnd
    ));
  };

  return (
    <section className="weekly-timetable-panel">
      <div className="timetable-header">
        <div>
          <FaRegCalendarCheck className="calendar-title-icon" />
          <div>
            <h3>Weekly Timetable</h3>
            <p>Your generated routine, arranged across the week.</p>
          </div>
        </div>
      </div>

      <div className="timetable-scroll">
        <div className="weekly-timetable">
          <div className="timetable-heading time-heading">Time</div>
          {weekDays.map((day) => (
            <div className="timetable-heading" key={day.key}>
              <span>{day.short}</span>
            </div>
          ))}

          {timeSlots.map((slot) => (
            <div className="timetable-row" key={slot}>
              <div className="timetable-time">{formatTime(slot)}</div>
              {weekDays.map((day) => {
                const cellItems = getItemsForCell(day.key, slot);

                return (
                  <div className="timetable-cell" key={`${day.key}-${slot}`}>
                    {cellItems.map((item) => (
                      <div className="timetable-activity" key={`${day.key}-${item.id}`}>
                        <span>{`${formatTime(item.startMinutes)}-${formatTime(item.endMinutes)}`}</span>
                        <strong>{item.title}</strong>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {timetableItems.length === 0 && (
          <div className="empty-timetable-note">
            Generate your Orbit routine to fill this weekly timetable.
          </div>
        )}
      </div>
    </section>
  );
}

function Calendar( { routine } ) {
  const today = new Date();
  const [activePage, setActivePage] = useState("Calendar");
  const [selectedDate, setSelectedDate] = useState(today);
  const [scheduleChange, setScheduleChange] = useState("");
  const [adjustmentScope, setAdjustmentScope] = useState("");
  const [scheduleAdjustments, setScheduleAdjustments] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("orbitScheduleAdjustments")) || [];
    } catch {
      return [];
    }
  });
  const [waterCount, setWaterCount] = useState(() => {
  return Number(localStorage.getItem("orbitWaterCount")) || 0;
});

const addGlass = () => {
  if (waterCount >= 8) return;

  const nextCount = waterCount + 1;

  setWaterCount(nextCount);

  localStorage.setItem(
    "orbitWaterCount",
    nextCount
  );
};

  const onboardingData = (() => {
    try {
      return JSON.parse(localStorage.getItem("orbitOnboarding")) || {};
    } catch {
      return {};
    }
  })();

  const userGoals = onboardingData.goals || [];
  const userHabits = onboardingData.habits || [];
  console.log(userHabits);
  const userObstacles = onboardingData.habitObstacles || [];
  const userHelp = onboardingData.orbitHelp || [];
  const userStruggles = onboardingData.priorityStruggles || [];
  const focusGoal = userGoals[0] || "Your top goal";
  const habitFocus = userHabits[0] || "Your selected habit";
  const obstacle = userObstacles[0] || userStruggles[0] || "your routine changes";
  const helpPreference = userHelp[0] || "smart adjustments";

  const monthName = selectedDate.toLocaleString("en-US", {
    month: "long",
    year: "numeric"
  });
  const selectedDateTitle = selectedDate.toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric"
  });
  const selectedDateKey = selectedDate.toISOString().slice(0, 10);

  const getCalendarCells = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const firstWeekday = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const previousMonthDays = new Date(year, month, 0).getDate();
    const cells = [];

    for (let index = firstWeekday - 1; index >= 0; index -= 1) {
      cells.push({
        day: previousMonthDays - index,
        muted: true,
        date: new Date(year, month - 1, previousMonthDays - index)
      });
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push({
        day,
        muted: false,
        date: new Date(year, month, day)
      });
    }

    const nextMonthDayCount = (7 - (cells.length % 7)) % 7;
    for (let day = 1; day <= nextMonthDayCount; day += 1) {
      cells.push({
        day,
        muted: true,
        date: new Date(year, month + 1, day)
      });
    }

    return cells;
  };

  const calendarDays = getCalendarCells(selectedDate);
  const highlightedDays = [1, 7, 11, 12, 13, 17, 23, 25];

  const isSameDate = (firstDate, secondDate) =>
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate();

  const changeMonth = (direction) => {
    setSelectedDate((currentDate) => {
      const currentDay = currentDate.getDate();
      const targetYear = currentDate.getFullYear();
      const targetMonth = currentDate.getMonth() + direction;
      const daysInTargetMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
      return new Date(
        targetYear,
        targetMonth,
        Math.min(currentDay, daysInTargetMonth)
      );
    });
  };

  const saveScheduleAdjustment = (scope) => {
    if (!scheduleChange.trim()) return;

    const nextAdjustment = {
      id: Date.now(),
      date: selectedDateKey,
      text: scheduleChange.trim(),
      scope
    };
    const updatedAdjustments = [
      nextAdjustment,
      ...scheduleAdjustments
    ];

    setAdjustmentScope(scope);
    setScheduleAdjustments(updatedAdjustments);
    localStorage.setItem(
      "orbitScheduleAdjustments",
      JSON.stringify(updatedAdjustments)
    );
    setScheduleChange("");
  };

  const sideNavItems = [
    { label: "Today", icon: <FaHome /> },
    { label: "Calendar", icon: <FaCalendarAlt /> },
    { label: "Routine", icon: <FaRegCalendarCheck /> },
    { label: "Habits", icon: <FaCheckCircle /> }
  ];

  return (
    <div className="calendar-page">
      <aside className="orbit-sidebar">
        <h2>Orbit</h2>

        <nav className="orbit-side-nav">
          {sideNavItems.map((item) => (
            <button
              key={item.label}
              className={`side-nav-item ${activePage === item.label ? "active" : ""}`}
              onClick={() => setActivePage(item.label)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="profile-card">
          <div className="profile-avatar">R</div>
          <div>
            <strong>Rosie</strong>
            <span>View Profile</span>
          </div>
        </div>
      </aside>

      <main className="calendar-main">
        {activePage === "Calendar" ? (
          <>
          
            {/* <section className="month-panel">
              <div className="calendar-header">
                <div>
                  <FaRegCalendarCheck className="calendar-title-icon" />
                  <h2>{monthName}</h2>
                </div>

                <div className="calendar-controls">
                  <button onClick={() => changeMonth(-1)}><FaChevronLeft /></button>
                  <button onClick={() => changeMonth(1)}><FaChevronRight /></button>
                </div>
              </div>

              <div className="weekday-row">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>

              <div className="month-grid">
                {calendarDays.map((day) => (
                  <button
                    key={`${day.date.getFullYear()}-${day.date.getMonth()}-${day.day}`}
                    className={`calendar-day ${isSameDate(day.date, selectedDate) ? "selected" : ""} ${highlightedDays.includes(day.day) && !day.muted ? "has-dot" : ""} ${day.muted ? "muted" : ""}`}
                    onClick={() => setSelectedDate(day.date)}
                  >
                    <span>{day.day}</span>
                  </button>
                ))}
              </div>
            </section> */}

            <WeeklyTimetable routine={routine} />
          </>
        ) : (
          <section className="calendar-placeholder-panel">
            {activePage === "Habits" ? (
  <div className="orbit-habits-page">

    <div className="habits-header">
      <h2>🌱 Your Habits</h2>
      <p>
        These are the habits Orbit is helping you stay consistent with.
      </p>
    </div>

    <div className="habits-grid">

      {userHabits.includes("Healthy Eating") && (
        <div className="habit-tracker-card">
          <h3>🍎 Healthy Eating</h3>
         <div className="meal-buttons">
          <button className="habit-action-btn">Breakfast</button>
          <button className="habit-action-btn">Lunch</button>
          <button className="habit-action-btn">Dinner</button>
          </div>
        </div>
      )}

      {userHabits.includes("Drink More Water") && (
        <div className="habit-tracker-card">
          <h3>💧 Drink More Water</h3>

          <div className="water-counter">

             {Array.from({ length: 8 }).map((_, index) => (
              <span key={index}>
               {index < waterCount ? "💧" : "○"}
              </span>
             ))}

          </div>

          <p> {waterCount} / 8 Glasses </p>

          <button className="habit-action-btn" onClick={addGlass}>
            + Add Glass
          </button>
        </div>
      )}

      {userHabits.includes("Mindfulness") && (
        <div className="habit-tracker-card">
          <h3>🧘 Mindfulness</h3>

          <button className="habit-action-btn">
            Mark Today's Session Complete
          </button>
        </div>
      )}

       {userHabits.includes("Reading") && (
        <div className="habit-tracker-card">
          <h3>📚 Reading</h3>

          <button className="habit-action-btn">
            Mark Reading Complete
          </button>
        </div>
      )} 

      {userHabits.includes("Better Sleep") && (
        <div className="habit-tracker-card">
          <h3>🌙 Better Sleep</h3>

          <p>
            Sleep Goal
          </p>

          <strong>
            {onboardingData.sleepTime || "--:--"}
          </strong>

          <p>
            Wake Time
          </p>

          <strong>
            {onboardingData.wakeTime || "--:--"}
          </strong>

        </div>
      )}

    </div>

  </div>
) : (
  <div className="placeholder-card">
    <h3>{activePage}</h3>
    <p>
      {activePage === "Today" && `Your selected day is ${selectedDateTitle}.`}
      {activePage === "Routine" && "Routine details will appear here as Orbit grows."}
    </p>
  </div>
)}
            {/* <div className="placeholder-card">
              <h3>{activePage}</h3>
              <p>
                {activePage === "Today" && `Your selected day is ${selectedDateTitle}.`}
                {activePage === "Routine" && "Routine details will appear here as Orbit grows."}
                {activePage === "Habits" && "Habit tracking will appear here as Orbit grows."}
              </p>
            </div> */}
          </section>
        )}
      </main>

      

      <aside className="orbit-insights">
        <div className="insights-heading">
          <h3>Orbit Insights</h3>
          <FaLightbulb />
        </div>

        <div className="insight-card schedule-adjust-card">
          <div className="insight-label">
            <FaSyncAlt />
            <strong>What changed?</strong>
          </div>
          <textarea
            placeholder="I have coaching at 6 PM today."
            value={scheduleChange}
            onChange={(e) => setScheduleChange(e.target.value)}
          />
          <div className="adjustment-actions">
            <button
              className={adjustmentScope === "today" ? "active" : ""}
              onClick={() => saveScheduleAdjustment("today")}
            >
              Adjust Today Only
            </button>
            <button
              className={adjustmentScope === "future" ? "active" : ""}
              onClick={() => saveScheduleAdjustment("future")}
            >
              Adjust Future Schedule
            </button>
          </div>
          {scheduleAdjustments.length > 0 && (
            <p className="adjustment-note">
              Last saved as {scheduleAdjustments[0].scope === "today" ? "today only" : "future schedule"}.
            </p>
          )}
        </div>

        {/* <div className="insight-card focus-card">
          <div className="insight-label">
            <FaRegCalendarCheck />
            <strong>Today's Focus</strong>
          </div>
          <div className="focus-content">
            <div className="focus-target">O</div>
            <div>
              <h4>{focusGoal}</h4>
              <p>{onboardingData.dailyTime || "A realistic focus block"} at 2:00 PM</p>
            </div>
          </div>
        </div> */}

        {/* <div className="insight-card">
          <div className="insight-label">
            <FaBell />
            <strong>Reminders</strong>
          </div>
          <div className="insight-row">
            <span className="small-icon reminder"><FaBell /></span>
            <div>
              <h4>{focusGoal} check-in</h4>
              <p>{onboardingData.deadlineType ? "Aligned with your goal timeline" : "Review your progress today"}</p>
            </div>
          </div>
        </div> */}

        {/* <div className="insight-card">
          <div className="insight-label">
            <FaFire />
            <strong>Habit Streaks</strong>
          </div>
          <div className="insight-row">
            <span className="small-icon streak"><FaFire /></span>
            <div>
              <h4>{habitFocus}</h4>
              <p>{onboardingData.habitFrequency || "Habit streak"} plan</p>
              <div className="streak-dots">
                <span></span><span></span><span></span><span></span>
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        </div> */}

        <div className="insight-card suggestion-card">
          <div className="insight-label">
            <FaLightbulb />
            <strong>Orbit Suggestion</strong>
          </div>
          <p>
            You mentioned {obstacle} can get in the way. Orbit can use {helpPreference} to keep {focusGoal} and {habitFocus} easier to follow today.
          </p>
          <div className="suggestion-actions">
            <button>Accept</button>
            <button className="ignore-btn">Ignore</button>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default Calendar;
