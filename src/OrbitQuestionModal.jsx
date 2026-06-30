import "./OrbitQuestionModal.css";
import { useState } from "react";
import DurationInput from "./inputs/DurationInput";
import TimePreferenceInput from "./inputs/TimePreferenceInput";
import PriorityInput from "./inputs/PriorityInput";
import DateInput from "./inputs/DateInput";
import DaysInput from "./inputs/DaysInput";
import TimeInput from "./inputs/TimeInput";

function OrbitQuestionModal({
  isOpen,
  groupedQuestions,
  onClose,
  setRoutine,
  onComplete,
  routineSeed = {}

}) {

  // console.log(groupedQuestions);

  const [answers, setAnswers] = useState({});
  const generateRoutine = async () => {

    const routineDetails = {
      ...routineSeed,
      ...Object.fromEntries(
        groupedQuestions.map((group) => [
          group.activity,
          {
            ...(routineSeed[group.activity] || {}),
            ...(group.known_information || {}),
            ...(answers[group.activity] || {})
          }
        ])
      )
    };

    console.log(routineDetails);

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/orbit/generate-routine",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(routineDetails)
            }
        );

        const data = await response.json();
        setRoutine(data);
        onComplete();
        // console.log("Routine:", data);

    }

    catch (error) {

        console.error(error);

    }

};
  const updateAnswer = (activity, field, value) => {

  // console.log(activity,field,value);

  setAnswers((prev) => ({
    ...prev,
    [activity]: {
      ...prev[activity],
      [field]: value,
      },
     }));
    };

  if (!isOpen) return null;

  return (


    <div className="orbit-modal-overlay">

      <div className="orbit-modal">

        <h2>Orbit AI</h2>

        <p>
          I need a little more information before I can build
          your personalized routine.
        </p>

        {groupedQuestions.map((group, index) => (

          <div
            key={index}
            className="activity-group"
          >

            <h3>{group.activity}</h3>

            {group.questions.map((question, i) => (

              <div
                key={i}
                className="question-card"
              >

                <label>

                  {question.question}

                </label>

                {/* <p>{question.input_type}</p> */}

                {question.input_type === "duration" && (
                 <DurationInput
                   question={question}
                   onChange={(value) => updateAnswer(
                     group.activity,
                     question.field,
                     value
                    )
                   }/>
                 )}

                {question.input_type === "time_preference" && (
                  <TimePreferenceInput
                   question={question}
                   onChange={(value) => updateAnswer(
                    group.activity,
                    question.field,
                    value
                   )}/>
                 )}

{question.input_type === "priority" && (
  <PriorityInput
    onChange={(value) =>
      updateAnswer(
        group.activity,
        question.field,
        value
      )
    }
  />
)}

{question.input_type === "date" && (
  <DateInput
    onChange={(value) =>
      updateAnswer(
        group.activity,
        question.field,
        value
      )
    }
  />
)}

{question.input_type === "days" && (
  <DaysInput
    onChange={(value) =>
      updateAnswer(
        group.activity,
        question.field,
        value
      )
    }
  />
)}

{question.input_type === "time" && (
    <TimeInput
        onChange={(value) =>
            updateAnswer(
                group.activity,
                question.field,
                value
            )
        }
    />
)}

                {/* <p>

                  Input Type:

                  <strong>

                    {" "}
                    {question.input_type}

                  </strong>

                </p> */}

              </div>

            ))}

          </div>

        ))}

        <div className="orbit-modal-actions">
          <button className="orbit-primary-action" onClick={generateRoutine}>
            Generate Routine
          </button>

          <button className="orbit-secondary-action" onClick={onClose}>
            Close
          </button>
        </div>

      </div>

    </div>

  );

}

export default OrbitQuestionModal;
