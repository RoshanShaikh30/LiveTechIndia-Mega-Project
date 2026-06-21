import "./App.css";

function RoutineBuilder() {
  return (
    <div class="routine-builder">
      <h1>Build Your Orbit</h1>
      <p>
        Tell Orbit about your schedule, goals, and habits so it can create a routine that adapts to your life.
      </p>

      <div className="onboarding-card">

       <div className="section-header">

        <div className="step-circle">

        </div>

        <div>
         <h2>About You</h2>
         <p>Which option best describes you?</p>
        </div>

       </div> {/* section header ends here. */}

       <div className="choice-grid">

        <div className="choice-card">
          Student
        </div>

        <div className="choice-card">
          Working Professional
        </div>

        <div className="choice-card">
          Freelancer
        </div>

       <div className="choice-card">
          Homemaker
       </div>

       <div className="choice-card">
          Other
       </div>

      </div>

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
