import {
  FaUserGraduate,
  FaBriefcase,
  FaLaptopCode,
  FaHome,
  FaEllipsisH,
  FaSun,
  FaCloudSun,
  FaMoon,
  FaGraduationCap,
  FaCalendarAlt,
  FaCheckCircle,
  FaUsers,
  FaBolt,
  FaBook,
  FaDumbbell,
  FaRocket,
  FaSeedling,
  FaPlus,
  FaBrain,
  FaClock,
  FaStopwatch,
  FaRegClock,
  FaHourglassHalf
} from "react-icons/fa";
import "./App.css";
import { useState } from "react";

function RoutineBuilder() {
  const [selectedRole, setSelectedRole] = useState("");
  const [step, setStep] = useState(1);
  const [otherRole, setOtherRole] = useState("");
  const [scheduleType, setScheduleType] = useState("");
  const [productiveHours, setProductiveHours] = useState([]);
  const [freeDays, setFreeDays] = useState([]);
  const [commitments, setCommitments] = useState([]);
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [otherGoal, setOtherGoal] = useState("");
  const [customGoals, setCustomGoals] = useState([]);
  const [goalPriority, setGoalPriority] = useState({});
  const [dailyTime, setDailyTime] = useState("");
  const [deadlineType, setDeadlineType] = useState("");
  const [customDeadline, setCustomDeadline] = useState("");

  console.log("Role:", selectedRole);
  console.log("Schedule Type:", scheduleType);
  console.log("Productive Hours:", productiveHours);
  console.log("Free Days:", freeDays);
  console.log("Commitments:", commitments);

  const toggleProductiveHour = (hour) => {
  if (productiveHours.includes(hour)) {
    setProductiveHours(
      productiveHours.filter(item => item !== hour)
    );
  } else {
    setProductiveHours([
      ...productiveHours,
      hour
    ]);
  }

};

const toggleFreeDay = (day) => {
  if (freeDays.includes(day)) {
    setFreeDays(
      freeDays.filter(item => item !== day)
    );
  } else {
    setFreeDays([
      ...freeDays,
      day
    ]);
  }

};

const toggleCommitment = (commitment) => {

  if (commitments.includes(commitment)) {
    setCommitments(
      commitments.filter(item => item !== commitment)
    );
  }

  else {
    setCommitments([
      ...commitments,
      commitment
    ]);
  }
};

const toggleGoal = (goal) => {

  if (selectedGoals.includes(goal)) {
    setSelectedGoals(
      selectedGoals.filter(item => item !== goal)
    );
  } else {
    setSelectedGoals([
      ...selectedGoals,
      goal
    ]);
  }
};

const addCustomGoal = () => {
  if (!otherGoal.trim()) return;
  setCustomGoals([
    ...customGoals,
    otherGoal.trim()
  ]);
  setOtherGoal("");
};

const handlePriorityChange = (goal, priority) => {
  setGoalPriority({
    ...goalPriority,
    [goal]: priority
  });
};

const allGoals = [
  ...selectedGoals.filter(goal => goal !== "Other"),
  ...customGoals
];


  return (
    <div className="routine-builder">
      <h2 className="build-your-orbit">Build Your Orbit</h2>
      {/* <p>Current Step: {step}</p> -> js for checking if step works */}
      <p>
        Tell Orbit about your schedule, goals, and habits so it can create a routine that adapts to your life.
      </p>

    <div className="onboarding-wrapper">
     {step === 1 && (
      <div className="onboarding-card">

       <div className="section-header">

        <div className="step-circle">

        </div>

        <div>
         <b> <h3>About You</h3> </b>
         <p>Which option best describes you?</p>
        </div>

       </div> {/* section header ends here. */}

       <div className="choice-grid">

        <div className={`choice-card ${selectedRole === "Student" ? "selected" : ""}`}
        onClick={() => setSelectedRole("Student")}>
          <div className="icon-circle">
           <FaUserGraduate className="choice-icon" />
          </div>
          <h4>Student</h4>
          <p>I'm currently studying.</p>
        </div>

        <div className={`choice-card ${selectedRole === "Working Professional" ? "selected" : ""}`}
        onClick={() => setSelectedRole("Working Professional")}>
          <div className="icon-circle">
           <FaBriefcase className="choice-icon" />
          </div>
          <h4>Working Professional</h4>
          <p>I have a full-time or part-time job.</p>
        </div>

        <div className={`choice-card ${selectedRole === "Freelancer" ? "selected" : ""}`}
        onClick={() => setSelectedRole("Freelancer")}>
          <div className="icon-circle">
           <FaLaptopCode className="choice-icon" />
          </div>
          <h4>Freelancer</h4>
          <p> I work independently. </p>
        </div>

       <div className={`choice-card ${selectedRole === "Homemaker" ? "selected" : ""}`}
        onClick={() => setSelectedRole("Homemaker")}>
          <div className="icon-circle">
            <FaHome className="choice-icon"/>
          </div>
          <h4>Homemaker</h4>
          <p>I manage my home and family.</p>
       </div>

       <div className={`choice-card other-card ${selectedRole === "Other" ? "selected" : ""}`}
  onClick={() => setSelectedRole("Other")}>

    <div className="icon-circle">
      <FaEllipsisH className="choice-icon" />
    </div>

         <h4>Other</h4>
         {/* <p> Something else! (You can tell us) </p> */}

         {selectedRole === "Other" && (
          <input 
          type="text"
          placeholder="Tell us what best describes you..."
          value={otherRole}
          onChange={(e) => setOtherRole(e.target.value)}
          className="other-input"
          onClick={(e) => e.stopPropagation()}
          />
         )}

       </div>

      </div> {/* choice grid ends here. */}

      {/* {selectedRole === "Other" && (
        <input
          type="text"
          placeholder="Tell us what best describes you..."
          value={otherRole}
          onChange={(e) => setOtherRole(e.target.value)}
          className="other-input"
        />
      )} */}

     </div> /* onboarding card ends here. */
     )}

     {step === 2 && (

      <div className="onboarding-card">
       <h3>Basic Schedule</h3>
       <p> Tell Orbit about your daily schedule so we can build a routine that fits your life!</p>
        
       <div className="section-divider"></div>

       <div className="schedule-section">
       <div className="schedule-header-row">
       <div className="schedule-question">
        <h4> 1. How is your weekly schedule? </h4>
        <p>This helps us understand how to plan your schedule.</p>
       </div>
        <div className="schedule-type-grid">

          <div className={`schedule-option ${scheduleType === "same" ? "selected" : ""  }`}
          onClick = {() => setScheduleType("same" )} >
            {scheduleType === "same" && (
            <FaCheckCircle className="check-icon" />
            )}
            <FaSun className="schedule-icon"/>
            <div>
            <h5> Mostly Same Every Day</h5>
            <p> My wake and sleep times are similar each day.</p>
            </div>
          </div>

          <div className={`schedule-option ${scheduleType === "different" ? "selected" : "" }`}
          onClick = {() => setScheduleType("different")}>
            {scheduleType === "different" && (
            <FaCheckCircle className="check-icon" />
            )}
            <FaCalendarAlt className="schedule-icon"/>
            <div>
            <h5>Different Across the Week</h5>
            <p>My schedule changes on different days.</p>
            </div>
          </div>

         </div>
         </div>
        </div>

        {scheduleType === "same" && (
         <>
         <h4> 2. Wake Up & Sleep Time </h4>
         <div className="time-section">

           <div className="input-group">
             <label>Wake Up Time</label>
             <input type="time" />
           </div>

           <div className="input-group">
             <label>Sleep Time</label>
             <input type="time" />
            </div>

          </div>
          </>
        )}

        {scheduleType === "different" && (
         <div className="weekly-schedule">
           <h4>2. Wake Up & Sleep Time (Per Day)</h4>
           <div className="day-row">
             <span>Mon</span>
             <input type="time" />
             <input type="time" />
           </div>

           <div className="day-row">
             <span>Tue</span>
             <input type="time" />
             <input type="time" />
            </div>

            <div className="day-row">
              <span>Wed</span>
              <input type="time" />
              <input type="time" />
            </div>

            <div className="day-row">
              <span>Thu</span>
              <input type="time" />
              <input type="time" />
            </div>

            <div className="day-row">
             <span>Fri</span>
             <input type="time" />
             <input type="time" />
            </div>

            <div className="day-row">
              <span>Sat</span>
              <input type="time"/>
              <input type="time" />
            </div>

            <div className="day-row">
              <span>Sun</span>
              <input type="time"/>
              <input type="time" />
            </div>

          </div>
        )}

        <div className="section-divider"> </div>
        <div className="two-column-section">
         <div className="column-card"> 
        <h4>3. When are you most productive?</h4>
        <div className="multi-card-grid">

         <div
    className={`multi-card ${
      productiveHours.includes("Morning") ? "selected" : ""
    }`}
    onClick={() => toggleProductiveHour("Morning")}>
      <FaSun className="productive-icon morning" />
      <span>Morning</span>
      </div>

         <div
    className={`multi-card ${
      productiveHours.includes("Afternoon") ? "selected" : ""
    }`}
    onClick={() => toggleProductiveHour("Afternoon")}>
      <FaSun className="productive-icon afternoon" />
      <span>Afternoon</span>
      </div>

         <div
    className={`multi-card ${
      productiveHours.includes("Evening") ? "selected" : ""
    }`}
    onClick={() => toggleProductiveHour("Evening")}>
      <FaCloudSun className="productive-icon evening" />
      <span>Evening</span>
    </div>

         <div
    className={`multi-card ${
      productiveHours.includes("Night") ? "selected" : ""
    }`}
    onClick={() => toggleProductiveHour("Night")}>
      <FaMoon className="productive-icon night"/>
      <span>Night</span>
      </div>

        </div>
        </div>
       
     
        {/* <div className="section-divider"> </div> */}
      <div className="column-card">

        <h4>4. Which days are usually free?</h4>

        <div className="days-grid">
         <div className="days-row">
         <div
    className={`day-pill ${freeDays.includes("Mon") ? "selected" : ""}`}
    onClick={() => toggleFreeDay("Mon")}>Mon</div>
          <div
    className={`day-pill ${freeDays.includes("Tue") ? "selected" : ""}`}
    onClick={() => toggleFreeDay("Tue")}>Tue</div>
         <div
    className={`day-pill ${freeDays.includes("Wed") ? "selected" : ""}`}
    onClick={() => toggleFreeDay("Wed")}>Wed</div>
         <div
    className={`day-pill ${freeDays.includes("Thu") ? "selected" : ""}`}
    onClick={() => toggleFreeDay("Thu")}>Thu</div>
         </div>
         <div className="days-row">
         <div
    className={`day-pill ${freeDays.includes("Fri") ? "selected" : ""}`}
    onClick={() => toggleFreeDay("Fri")}>Fri</div>
         <div
    className={`day-pill ${freeDays.includes("Sat") ? "selected" : ""}`}
    onClick={() => toggleFreeDay("Sat")}>Sat</div>
         <div
    className={`day-pill ${freeDays.includes("Sun") ? "selected" : ""}`}
    onClick={() => toggleFreeDay("Sun")}>Sun</div>
    </div>

        </div>
      </div>
      </div>

        <div className="section-divider"> </div> 

        <h4>5.Fixed Commitments!</h4>

        <div className="commitment-grid">

         <div
    className={`multi-card ${
      commitments.includes("College") ? "selected" : ""
    }`}
    onClick={() => toggleCommitment("College")}>
      <FaGraduationCap className="commitment-icon" />
      <span>College</span>
      </div>

         <div
    className={`multi-card ${
      commitments.includes("Job") ? "selected" : ""
    }`}
    onClick={() => toggleCommitment("Job")}>
      <FaBriefcase className="commitment-icon" />
      <span>Job</span>
      </div>

         <div
    className={`multi-card ${
      commitments.includes("Coaching") ? "selected" : ""
    }`}
    onClick={() => toggleCommitment("Coaching")}>
      <FaBook className="commitment-icon"/>
      <span> Coaching </span>
      </div>

         <div
    className={`multi-card ${
      commitments.includes("Family") ? "selected" : ""
    }`}
    onClick={() => toggleCommitment("Family")}>
      <FaUsers className="commitment-icon" />
      <span>Family</span>
    </div>

         <div
    className={`multi-card ${
      commitments.includes("Other") ? "selected" : ""
    }`}
    onClick={() => toggleCommitment("Other")}>
      <FaEllipsisH className="commitment-icon"/>
      <span>Other</span>
    </div>

        </div>
        {commitments.includes("Other") && (
        <input
          type="text"
          placeholder="Tell Orbit about your commitment..."
          className="other-input"/>
         )}


      </div> /*basic schedule onboardin card ends here */
      )}

      {step === 3 && (
       <div className="onboarding-card">

         <h3>Goals</h3>
         <p> Help Orbit understand what matters to you so it can build a routine that moves you closer to your goals. </p>

        <div className="section-divider"></div>
        <div className="schedule-header-row">
        <div className="schedule-question">
         <h4>1. What are you currently working toward?</h4>
         <p>Select all that apply.</p>
        </div>

        <div className="goal-grid">
          <div className={`goal-card ${selectedGoals.includes("Study") ? "selected" : ""}`}
           onClick={() => toggleGoal("Study")}>
            <FaBook className="goal-icon"/>
            <span>Study</span>
          </div>

          <div className={`goal-card ${selectedGoals.includes("Fitness") ? "selected" : ""}`}
           onClick={() => toggleGoal("Fitness")}>
             <FaDumbbell className="goal-icon"/>
             <span>Fitness</span>
          </div>

          <div className={`goal-card ${selectedGoals.includes("Skill Learning") ? "selected" : ""}`}
          onClick={() => toggleGoal("Skill Learning")}>
            <FaLaptopCode className="goal-icon"/>
            <span>Skill Learning</span>
          </div>

          <div className={`goal-card ${selectedGoals.includes("Reading") ? "selected" : ""}`}
          onClick={() => toggleGoal("Reading")}>
           <FaBook className="goal-icon"/>
           <span>Reading</span>
          </div>

          <div className={`goal-card ${selectedGoals.includes("Project") ? "selected" : ""}`}
          onClick={() => toggleGoal("Project")}>
           <FaRocket className="goal-icon"/>
           <span>Project</span>
          </div>

          <div className={`goal-card ${selectedGoals.includes("Career") ? "selected" : ""}`}
          onClick={() => toggleGoal("Career")}>
           <FaBriefcase className="goal-icon"/>
           <span>Career</span>
          </div>

          <div className={`goal-card ${selectedGoals.includes("Personal Growth") ? "selected" : ""}`}
          onClick={() => toggleGoal("Personal Growth")}>
           <FaSeedling className="goal-icon"/>
           <span>Personal Growth</span>
          </div>

          <div className={`goal-card ${selectedGoals.includes("Mental Health") ? "selected" : ""}`}
          onClick={() => toggleGoal("Mental Health")}>
            <FaBrain className="goal-icon"/>
            <span>Mental Health</span>
          </div>

          <div className={`goal-card ${selectedGoals.includes("Other") ? "selected" : ""}`}
          onClick={() => toggleGoal("Other")}>
           <FaPlus className="goal-icon"/>
           <span>Other</span>
          </div>

        </div>
        </div>

        {selectedGoals.includes("Other") && (
         <div className="custom-goal-section">
          <div className="custom-goal-input-row">
           <input type="text" className="other-input"
             placeholder="Add a custom goal..."
             value={otherGoal}
             onChange={(e) => setOtherGoal(e.target.value)}/>

           <button className="add-goal-btn" onClick={addCustomGoal}>
           Add</button>

          </div>

          {customGoals.length > 0 && (
           <div className="custom-goals-list">
            {customGoals.map((goal, index) => (
             <div key={index} className="goal-chip">
              {goal}
             </div>
          ))}
           </div>
        )}
         </div>
       )}

       {allGoals.length > 1 && (
        <div className="priority-section">
        <div className="section-divider"></div>
        <div className="priority-box">
         <h4>Help Orbit understand what matters most</h4>
         <p>Rank your selected goals by importance.</p>

        {allGoals.map((goal) => (
         <div key={goal} className="priority-row">
         <div className="priority-goal">
           <span>{goal}</span>
         </div> 
         <select value={goalPriority[goal] || ""}
          onChange={(e) =>
          handlePriorityChange(goal, e.target.value)
        }>
           <option value="">Select</option>
           <option value="Highest">Highest</option>
           <option value="High">High</option>
           <option value="Medium">Medium</option>
           <option value="Low">Low</option>
          </select>

         </div>
        ))}

        <p className="priority-note">Highest priority goals will receive more focus in your routine.</p>

         </div>
         </div>
       )}
        
        <div className="section-divider"></div>

    <div className="goal-section-row">
       <div className="goal-question">
        <h4>2. How much time can you dedicate daily?</h4>
        <p> Be realistic. This helps Orbit build a realistic schedule! </p>
       </div>

        <div className="time-commitment-grid">

         <div className={`time-card ${dailyTime === "Less than 30 mins" ? "selected" : ""}`}
         onClick={() => setDailyTime("Less than 30 mins")}>
          <FaStopwatch className="time-icon"/>
          <span>Less than 30 mins</span>
         </div>

         <div className={`time-card ${dailyTime === "30 mins - 1 hr" ? "selected" : ""}`}
         onClick={() => setDailyTime("30 mins - 1 hr")}>
          <FaClock className="time-icon" />
          <span>30 mins - 1 hr</span>
         </div>

         <div className={`time-card ${dailyTime === "1 - 2 hrs" ? "selected" : ""}`}
         onClick={() => setDailyTime("1 - 2 hrs")}>
          <FaRegClock className="time-icon" />
          <span>1 - 2 hrs</span>
         </div>

         <div className={`time-card ${dailyTime === "2 - 4 hrs" ? "selected" : ""}`}
         onClick={() => setDailyTime("2 - 4 hrs")}>
          <FaHourglassHalf className="time-icon" />
          <span>2 - 4 hrs</span>
         </div>

         <div className={`time-card ${dailyTime === "4+ hrs" ? "selected" : ""}`}
         onClick={() => setDailyTime("4+ hrs")}>
          <FaRocket className="time-icon" />
          <span>4+ hrs</span>
         </div>

        </div> 
        </div>

        {/* {selectedGoals.includes("Other") && (
         <input type="text" className="other-input"
         placeholder="Tell Orbit about your goal..."
         value={otherGoal}
         onChange={(e) => setOtherGoal(e.target.value)}/>
        )} */}

       </div>
      ) } {/* goals onboarding card ends here. */}

      {step === 4 && (
        <div className="onboarding-card">
          <h3>Habits</h3>
          <p> What habits would you like Orbit to support? </p>
        </div>
      ) } {/* habits onboarding card ends here. */}

      {step === 5 && (
        <div className="onboarding-card">
         <h3>Priorities</h3>
         <p> What's most important in your routine right now? </p>
        </div>
      ) } {/* priorities onboarding card ends here. */}

       <div className="navigation-row">

      <div className="back-container">
      {step > 1 && ( 
       <button className="back-btn" onClick={() => step > 1 && setStep(step - 1)}>
         Back
       </button> 
      )}
     </div>

     <div className="progress-section">
       <span className={`dot ${step >= 1 ? "active" : ""}`}></span>
       <span className={`dot ${step >= 2 ? "active" : ""}`}></span>
       <span className={`dot ${step >= 3 ? "active" : ""}`}></span>
       <span className={`dot ${step >= 4 ? "active" : ""}`}></span>
       <span className={`dot ${step >= 5 ? "active" : ""}`}></span>
     </div>

     <div className="next-container">
      <button className="next-btn" disabled={!selectedRole} onClick={() => step < 5 && setStep(step + 1)}>
        Next
      </button>
     </div>

    </div> {/* navigation row ends here. */}

    </div>

  </div>
); 

}

export default RoutineBuilder;

      {/* <div className="builder-section">

       <h2>About You</h2>
       <p>Which option best describes you?</p>

      </div> 
      // abcd
      <div className="builder-section">
       <h2>Basic Schedule</h2>
       <div className="schedule-grid">

         <div className="input-group">
           <label>Wake Up Time</label>
           <input type="time" />
         </div>

         <div className="input-group">
           <label>Sleep Time</label>
           <input type="time" />
         </div>

         <div className="input-group">
           <label>College Start</label>
           <input type="time" />
         </div>

         <div className="input-group">
           <label>College End</label>
            <input type="time" />
         </div>

         <div className="input-group">
            <label>Travel Time (minutes)</label>
            <input type="number" />
         </div>

       </div>

      </div>

      <div className="builder-section">
       <h2>Goals</h2>
      </div>

      <div className="builder-section">
       <h2>Habits</h2>
      </div>

      <div className="builder-section">
       <h2>Priorities</h2>
      </div> */}
