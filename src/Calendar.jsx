import { useState } from "react";
import {
  FaBell,
  FaBookOpen,
  FaCalendarAlt,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaDumbbell,
  FaFire,
  FaHome,
  FaLightbulb,
  FaMoon,
  FaRegCalendarCheck,
  FaRegClock,
  FaSun,
  FaSyncAlt,
  FaUtensils
} from "react-icons/fa";
import "./App.css";

function Calendar() {
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

  const onboardingData = (() => {
    try {
      return JSON.parse(localStorage.getItem("orbitOnboarding")) || {};
    } catch {
      return {};
    }
  })();

  const userGoals = onboardingData.goals || [];
  const userHabits = onboardingData.habits || [];
  const userCommitments = onboardingData.commitments || [];
  const userObstacles = onboardingData.habitObstacles || [];
  const userHelp = onboardingData.orbitHelp || [];
  const userStruggles = onboardingData.priorityStruggles || [];
  const focusGoal = userGoals[0] || "Your top goal";
  const secondaryGoal = userGoals[1] || "Focused work";
  const habitFocus = userHabits[0] || "Your selected habit";
  const commitmentFocus = userCommitments[0] || "Flexible block";
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

  const routineItems = [
    { time: "7:00 AM", title: "Wake Up", icon: <FaSun />, tone: "sun" },
    { time: "7:30 AM", title: "Morning Routine", icon: <FaHome />, tone: "home" },
    { time: "8:00 AM", title: commitmentFocus, icon: <FaBookOpen />, tone: "study" },
    { time: "1:00 PM", title: "Lunch", icon: <FaUtensils />, tone: "food" },
    { time: "2:00 PM", title: focusGoal, icon: <FaRegClock />, tone: "focus" },
    { time: "5:00 PM", title: habitFocus, icon: <FaDumbbell />, tone: "fitness" },
    { time: "7:00 PM", title: secondaryGoal, icon: <FaBookOpen />, tone: "study" },
    { time: "9:30 PM", title: habitFocus, icon: <FaBookOpen />, tone: "reading" },
    { time: "10:30 PM", title: "Sleep", icon: <FaMoon />, tone: "sleep" }
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
            <section className="month-panel">
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
            </section>

            <section className="daily-panel">
              <div className="daily-header">
                <h3>{selectedDateTitle}</h3>
                <button>
                  <FaCalendarAlt />
                </button>
              </div>

              <div className="routine-timeline">
                {routineItems.map((item) => (
                  <div className="timeline-row" key={`${item.time}-${item.title}`}>
                    <span className="timeline-time">{item.time}</span>
                    <div className={`routine-card ${item.tone}`}>
                      <span className="routine-icon">{item.icon}</span>
                      <strong>{item.title}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : (
          <section className="calendar-placeholder-panel">
            <div className="placeholder-card">
              <h3>{activePage}</h3>
              <p>
                {activePage === "Today" && `Your selected day is ${selectedDateTitle}.`}
                {activePage === "Routine" && "Routine details will appear here as Orbit grows."}
                {activePage === "Habits" && "Habit tracking will appear here as Orbit grows."}
              </p>
            </div>
          </section>
        )}
        {activePage === "Calendar" && (
 <div className = "calendar-bottom-section">         
  <div className="bottom-insight-row">

    {/* Today's Focus */}

    <div className="insight-card focus-card">
      <div className="insight-label">
        <FaRegCalendarCheck />
        <strong>Today's Focus</strong>
      </div>

      <div className="focus-content">
        <div className="focus-target">O</div>

        <div>
          <h4>{focusGoal}</h4>
          <p>
            {onboardingData.dailyTime || "A realistic focus block"} at 2:00 PM
          </p>
        </div>
      </div>
    </div>

    {/* Reminders */}

    <div className="insight-card">
      <div className="insight-label">
        <FaBell />
        <strong>Reminders</strong>
      </div>

      <div className="insight-row">
        <span className="small-icon reminder">
          <FaBell />
        </span>

        <div>
          <h4>{focusGoal} check-in</h4>

          <p>
            {onboardingData.deadlineType
              ? "Aligned with your goal timeline"
              : "Review your progress today"}
          </p>
        </div>
      </div>
    </div>

    {/* Habit Streaks */}

    <div className="insight-card">
      <div className="insight-label">
        <FaFire />
        <strong>Habit Streaks</strong>
      </div>

      <div className="insight-row">
        <span className="small-icon streak">
          <FaFire />
        </span>

        <div>
          <h4>{habitFocus}</h4>

          <p>
            {onboardingData.habitFrequency || "Habit streak"} plan
          </p>

          <div className="streak-dots">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>

  </div>
  </div>
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
