import "./TimePreferenceInput.css";

function TimePreferenceInput({ onChange }) {

    const options = [
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
                    onClick={() => onChange(option)}
                >
                    {option}
                </button>
            ))}

        </div>
    );

}

export default TimePreferenceInput;