import React, { useState } from "react";
import { getCodeExplanationSteps } from "../api/ai";

function CodeExplainer() {
  const [code, setCode] = useState("");
  const [steps, setSteps] = useState("");

  const handleExplain = async () => {
    const res = await getCodeExplanationSteps(code);
    setSteps(res.explanation);
  };

  return (
    <div className="p-4 bg-gray-900 text-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-2">Code Explanation in Steps</h2>
      <textarea
        className="w-full p-2 text-black rounded"
        rows="6"
        placeholder="Paste your code here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button
        onClick={handleExplain}
        className="bg-blue-500 px-4 py-2 rounded mt-2 hover:bg-blue-600"
      >
        Explain Steps
      </button>

      {steps && (
        <div className="mt-4 p-3 bg-gray-800 rounded">
          <h3 className="text-lg font-semibold mb-2">Step-by-Step Explanation:</h3>
          <pre className="whitespace-pre-wrap">{steps}</pre>
        </div>
      )}
    </div>
  );
}

export default CodeExplainer;
