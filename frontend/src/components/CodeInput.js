import React, { useState } from "react";
import { generateComments } from "../api";

const CodeInput = () => {
    const [code, setCode] = useState("");
    const [result, setResult] = useState("");

    const handleGenerate = async () => {
        const { data } = await generateComments(code);
        setResult(data.commentedCode);
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-2">AI Code Comment Generator</h2>
            <textarea
                className="w-full p-2 border rounded"
                rows="6"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste your code here..."
            />
            <button
                onClick={handleGenerate}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
            >
                Generate Comments
            </button>

            {result && (
                <div className="mt-4 p-2 border bg-gray-100 rounded">
                    <h3 className="font-semibold">Commented Code:</h3>
                    <pre>{result}</pre>
                </div>
            )}
        </div>
    );
};

export default CodeInput;
