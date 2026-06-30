import { useState } from "react";

import OptionsList from "../components/OptionsList";

function DurationInput({ question , onChange }) {

    const [selected, setSelected] = useState("");

    const [custom, setCustom] = useState("");

    const [customTouched, setCustomTouched] = useState(false);

    const [applied, setApplied] = useState(false);

    // const [answers, setAnswers] = useState({});

    const isValidDuration = (value) => {
        const normalized = value.trim();

        return /^(\d+(?:\.\d+)?\s*(hours?|hrs?|hr|h)(\s+\d+\s*(minutes?|mins?|min|m))?|\d+\s*(minutes?|mins?|min|m))$/i.test(normalized);
    };

    const customIsValid = isValidDuration(custom);

    const applyCustomDuration = () => {
        setCustomTouched(true);

        if (!customIsValid) return;

        onChange(custom.trim());
        setApplied(true);
    };

    return (

        <div className="duration-input">

            {/* <label>

                {question.question}

            </label> */}

            <OptionsList

                options={question.suggestions || []}

                selected={selected}

                onSelect={
                    (value) => {
                        setSelected(value);
                        setApplied(false);
                        onChange(value);
                    }
                }

            />

            {question.allow_custom && (

                <>

                    <button
                        type="button"
                        className={selected === "custom" ? "custom-duration-btn active" : "custom-duration-btn"}
                        onClick={() => {
                            setSelected("custom");
                            setApplied(false);
                        }}
                    >

                        + Custom Duration

                    </button>

                    {selected === "custom" && (

                        <div className="custom-duration-panel">

                        <div className="custom-duration-row">

                        <input

                            placeholder="Example: 2 hours"

                            value={custom}

                            onChange={(e) =>{
                                setCustom(e.target.value);
                                setCustomTouched(true);
                                setApplied(false);
                            }
                            }

                        />

                        <button
                            type="button"
                            className="apply-duration-btn"
                            onClick={applyCustomDuration}
                            disabled={!customIsValid}
                        >
                            Use Duration
                        </button>

                        </div>

                        {customTouched && custom && !customIsValid && (
                            <p className="duration-validation">
                                Enter a duration like 45 minutes, 75 mins, or 2 hr 30 mins.
                            </p>
                        )}

                        {applied && (
                            <p className="duration-applied">Applied</p>
                        )}

                        </div>

                    )}

                </>

            )}

        </div>

    );

}

export default DurationInput;
