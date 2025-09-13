import React, { useState } from "react";
import { generateComments } from "../api/ai";

function CommentGenerator() {
  const [code, setCode] = useState("");
  const [comments, setComments] = useState("");

  const handleGenerate = async () => {
    const res = await generateComments(code);
    setComments(res.comments);
  };

  return (
    <div className="p-4 bg-gray-900 text-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-2">AI Code Comment Generator</h2>
      <textarea
        className="w-full p-2 text-black rounded"
        rows="6"
        placeholder="Paste your code here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button
        onClick={handleGenerate}
        className="bg-green-500 px-4 py-2 rounded mt-2 hover:bg-green-600"
      >
        Generate Comments
      </button>

      {comments && (
        <div className="mt-4 p-3 bg-gray-800 rounded">
          <h3 className="text-lg font-semibold mb-2">Commented Code:</h3>
          <pre className="whitespace-pre-wrap">{comments}</pre>
        </div>
      )}
    </div>
  );
}

export default CommentGenerator;
