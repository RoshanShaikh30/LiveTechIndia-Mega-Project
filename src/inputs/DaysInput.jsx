import { useState } from "react";

function DaysInput({ onChange }) {

    const weekDays = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
    ];

    const [selectedDays, setSelectedDays] = useState([]);

    const toggleDay = (day) => {

        let updated;

        if (selectedDays.includes(day)) {
            updated = selectedDays.filter(d => d !== day);
        } else {
            updated = [...selectedDays, day];
        }

        setSelectedDays(updated);
        onChange(updated);

    };

    return (

        <div>

            {weekDays.map(day => (

                <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                >
                    {day}
                </button>

            ))}

        </div>

    );

}

export default DaysInput;