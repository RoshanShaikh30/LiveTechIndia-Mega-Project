import { useState } from "react";

// import "./TimePreferenceInput.css";

function TimePreferenceInput({ question, onChange }) {

    const [selected, setSelected] = useState("");

    const options = question?.suggestions || [
        "Morning",
        "Afternoon",
        "Evening",
        "Night",
        "No Preference"
    ];

    return (
        <div className="time-options">

            {options.map((option) => (
                <button
                    key={option}
                    type="button"
                    className={selected === option ? "selected" : ""}
                    onClick={() => {
                        setSelected(option);
                        onChange(option);
                    }}
                >
                    {option}
                </button>
            ))}

        </div>
    );

}

export default TimePreferenceInput;
