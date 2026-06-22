import {
  FaUserGraduate,
  FaBriefcase,
  FaLaptopCode,
  FaHome,
  FaEllipsisH
} from "react-icons/fa";
import "./App.css";
import { useState } from "react";

function RoutineBuilder() {
  const [selectedRole, setSelectedRole] = useState("");
  const [step, setStep] = useState(1);
  const [otherRole, setOtherRole] = useState("");
  const [scheduleType, setScheduleType] = useState("");
  const [productiveHours, setProductiveHours] = useState([]);

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

        <h4> 1. How is your weekly schedule? </h4>
        <div className="schedule-type-grid">

          <div className={`schedule-option ${scheduleType === "same" ? "selected" : ""  }`}
          onClick = {() => setScheduleType("same" )} >
            <h5> Mostly Same Every Day</h5>
            <p> My wake and sleep times are similar each day.</p>
          </div>
          <div className={`schedule-option ${scheduleType === "different" ? "selected" : "" }`}
          onClick = {() => setScheduleType("different")}>
            <h5>Different Across the Week</h5>
            <p>My schedule changes on different days.</p>
          </div>

         </div>
        </div>

        {scheduleType === "same" && (
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

        <h4>3. When are you most productive?</h4>
        <div className="multi-card-grid">

         <div className="multi-card">Morning</div>
         <div className="multi-card">Afternoon</div>
         <div className="multi-card">Evening</div>
         <div className="multi-card">Night</div>

        </div>

        <div className="section-divider"> </div>

        <h4>4. Which days are usually free?</h4>

        <div className="days-grid">

         <div className="day-pill">Mon</div>
         <div className="day-pill">Tue</div>
         <div className="day-pill">Wed</div>
         <div className="day-pill">Thu</div>
         <div className="day-pill">Fri</div>
         <div className="day-pill">Sat</div>
         <div className="day-pill">Sun</div>

        </div>

        <div className="section-divider"> </div> 

        <h4>5.Fixed Commitments!</h4>

        <div className="multi-card-grid">

         <div className="multi-card">College</div>
         <div className="multi-card">Job</div>
         <div className="multi-card">Coaching</div>
         <div className="multi-card">Family</div>
         <div className="multi-card">Other</div>

        </div>


      </div> /*basic schedule onboardin card ends here */
      )}

      {step === 3 && (
       <div className="onboarding-card">
         <h3>Goals</h3>
         <p> What are you currently working toward? </p>
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
