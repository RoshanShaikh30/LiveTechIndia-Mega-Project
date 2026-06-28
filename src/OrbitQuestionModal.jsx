import "./OrbitQuestionModal.css";
import { useState } from "react";
import DurationInput from "./inputs/DurationInput";
import TimePreferenceInput from "./inputs/TimePreferenceInput";
import PriorityInput from "./inputs/PriorityInput";
import DateInput from "./inputs/DateInput";
import DaysInput from "./inputs/DaysInput";

function OrbitQuestionModal({
  isOpen,
  groupedQuestions,
  onClose

}) {

  // console.log(groupedQuestions);

  const [answers, setAnswers] = useState({});
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

        <button onClick = {() => console.log(answers)}>
          Generate Routine
        </button>

        <button onClick={onClose}>

          Close

        </button>

      </div>

    </div>

  );

}

export default OrbitQuestionModal;