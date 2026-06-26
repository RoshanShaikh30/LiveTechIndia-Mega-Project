import { useState } from "react";

import OptionsList from "../components/OptionsList";

function DurationInput({ question }) {

    const [selected, setSelected] = useState("");

    const [custom, setCustom] = useState("");

    // const [answers, setAnswers] = useState({});

    return (

        <div>

            <label>

                {question.question}

            </label>

            <OptionsList

                options={question.suggestions || []}

                selected={selected}

                onSelect={setSelected}

            />

            {question.allow_custom && (

                <>

                    <button
                        type="button"
                        onClick={() => setSelected("custom")}
                    >

                        + Custom Duration

                    </button>

                    {selected === "custom" && (

                        <input

                            placeholder="Example: 2 hours"

                            value={custom}

                            onChange={(e) =>
                                setCustom(e.target.value)
                            }

                        />

                    )}

                </>

            )}

        </div>

    );

}

export default DurationInput;