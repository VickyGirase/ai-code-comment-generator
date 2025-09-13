import React, { useState } from "react";
import { generateComments, getCodeExplanationSteps } from "./api/ai";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

function App() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState("");
  const [mode, setMode] = useState("comments");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("Auto");
  const [history, setHistory] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const languages = [
    { value: "Auto", label: "Auto-Detect", flag: "🌐" },
    { value: "English", label: "English", flag: "🇺🇸" },
    { value: "Hindi", label: "Hindi", flag: "🇮🇳" },
    { value: "Gujarati", label: "Gujarati", flag: "🇮🇳" },
  ];

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([result], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `ai_output_${mode}_${language}.txt`;
    document.body.appendChild(element);
    element.click();
  };

  const handleSubmit = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setResult("");

    try {
      const payload = { codeSnippet: code, language };
      let data;
      if (mode === "comments") {
        data = await generateComments(payload);
        setResult(data.comments);
      } else {
        data = await getCodeExplanationSteps(payload);
        setResult(data.explanation);
      }

      setHistory(prev => [{ mode, language, code, result: data[mode==='comments'?'comments':'explanation'] }, ...prev.slice(0,4)]);
    } catch (err) {
      setResult("❌ Error generating response. Try again!");
      console.error(err);
    }

    setLoading(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectLanguage = (lang) => {
    setLanguage(lang);
    setIsDropdownOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-6 flex justify-center items-center">
      <div className="w-full max-w-4xl bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 flex flex-col gap-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            AI Code Helper
          </h1>
          <p className="text-gray-600">Enhance your code with AI-powered comments and explanations</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 p-1 bg-gray-100 rounded-xl">
          <button
            onClick={() => setMode("comments")}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              mode === "comments"
                ? "bg-white text-blue-600 shadow-md"
                : "text-gray-600 hover:text-blue-500"
            }`}
          >
            Generate Comments
          </button>
          <button
            onClick={() => setMode("explain")}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              mode === "explain"
                ? "bg-white text-blue-600 shadow-md"
                : "text-gray-600 hover:text-blue-500"
            }`}
          >
            Explain Steps
          </button>
        </div>

        {/* Custom Language Dropdown */}
        <div className="relative">
          <div 
            className="w-full p-3 border border-gray-300 rounded-xl bg-white flex items-center justify-between cursor-pointer"
            onClick={toggleDropdown}
          >
            <div className="flex items-center">
              <span className="text-lg mr-2">
                {languages.find(lang => lang.value === language)?.flag}
              </span>
              <span>{languages.find(lang => lang.value === language)?.label}</span>
            </div>
            <svg 
              className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          {isDropdownOpen && (
            <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-xl shadow-lg overflow-hidden">
              {languages.map((lang) => (
                <div
                  key={lang.value}
                  className={`px-4 py-3 cursor-pointer flex items-center transition-colors duration-200 ${
                    language === lang.value
                      ? 'bg-blue-50 text-blue-600'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => selectLanguage(lang.value)}
                >
                  <span className="text-lg mr-3">{lang.flag}</span>
                  <span>{lang.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Code Input */}
        <div className="relative">
          <textarea
            className="w-full h-40 border border-gray-300 rounded-xl p-4 font-mono text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
            placeholder="Paste your code here..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          {code && (
            <button
              onClick={() => setCode("")}
              className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600 rounded-full bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-4 text-white font-bold rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center ${
            loading 
              ? "bg-blue-400 cursor-not-allowed" 
              : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 hover:shadow-xl"
          }`}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Generating...
            </>
          ) : (
            "Submit"
          )}
        </button>

        {/* Result Display - Light Theme Design */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-5 rounded-2xl border border-blue-100 shadow-inner min-h-[200px] overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${result ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <h3 className="font-semibold text-blue-700">
                {mode === "comments" ? "Generated Comments" : "Code Explanation"}
              </h3>
            </div>
            {result && (
              <div className="flex gap-2">
                <button
                  onClick={() => navigator.clipboard.writeText(result)}
                  className="text-sm bg-white text-blue-500 hover:text-blue-700 flex items-center px-3 py-1 rounded-lg border border-blue-200 shadow-sm transition-all duration-200 hover:shadow-md"
                  title="Copy to clipboard"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  Copy
                </button>
              </div>
            )}
          </div>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-blue-600 font-medium">Generating your {mode === "comments" ? "comments" : "explanation"}...</p>
              <p className="text-blue-400 text-sm mt-1">This may take a few moments</p>
            </div>
          ) : result ? (
            <div className="bg-white rounded-xl p-4 shadow-lg border border-blue-100">
              <div className="flex justify-between items-center mb-3 px-2">
                <span className="text-xs text-blue-600 font-mono bg-blue-50 px-2 py-1 rounded">
                  {mode === "comments" ? "COMMENTED CODE" : "CODE EXPLANATION"}
                </span>
                <span className="text-xs text-blue-600 font-mono bg-blue-50 px-2 py-1 rounded">
                  {language !== "Auto" ? language.toUpperCase() : "AUTO-DETECT"}
                </span>
              </div>
              <SyntaxHighlighter 
                language="javascript" 
                style={oneLight} 
                wrapLines={true}
                customStyle={{
                  background: 'transparent',
                  padding: 0,
                  fontSize: '0.9rem',
                  borderRadius: '0.5rem'
                }}
              >
                {result}
              </SyntaxHighlighter>
            </div>
          ) : (
            <div className="text-center py-10 bg-white/70 rounded-xl border border-dashed border-blue-200">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-medium text-blue-600 mb-1">Your {mode === "comments" ? "commented code" : "code explanation"} will appear here</h3>
              <p className="text-sm text-blue-400">Submit your code to see the AI-generated result</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            disabled={!result}
            className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 ${
              result 
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 hover:shadow-lg" 
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download .txt
          </button>
        </div>

        {/* History Panel */}
        <div className="mt-2 bg-gradient-to-br from-blue-50 to-purple-50 p-5 rounded-2xl border border-blue-100 shadow-inner max-h-64 overflow-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-blue-700 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              History (Last 5)
            </h2>
            {history.length > 0 && (
              <button 
                onClick={() => setHistory([])}
                className="text-sm text-red-500 hover:text-red-700 flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear all
              </button>
            )}
          </div>
          
          {history.length === 0 ? (
            <div className="text-center py-4 text-blue-400">
              <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>No history yet. Your results will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item, index) => (
                <div key={index} className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                      {item.mode} | {item.language}
                    </span>
                    <span className="text-xs text-blue-500">
                      {new Date().toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-xs whitespace-pre-wrap bg-blue-50 p-3 rounded-lg mt-2 font-mono overflow-hidden">
                    {item.result.substring(0, 120)}...
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;