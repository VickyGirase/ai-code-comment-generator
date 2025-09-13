// controllers/aiController.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyC4lSe0V2EHfDzxQKrGguwADe4ci8ukNZA");

const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export const generateComments = async (req, res) => {
  try {
    let { codeSnippet, language } = req.body;
    if (!language || language === "Auto") language = "English"; // default AI will detect
    const prompt = `Add simple and clear comments in ${language} to the following code:\n\n${codeSnippet}`;
    const result = await model.generateContent(prompt);

    res.json({
      comments: result.response.text(),
    });
  } catch (error) {
    console.error("Error in generateComments:", error);
    res.status(500).json({ error: "Failed to generate comments" });
  }
};

export const explainCodeSteps = async (req, res) => {
  try {
    let { codeSnippet, language } = req.body;
    if (!language || language === "Auto") language = "English";
    const prompt = `Explain the following code in 5 simple step-by-step bullet points in ${language} 
for beginners. Keep the explanation short and clear.\n\n${codeSnippet}`;
    const result = await model.generateContent(prompt);

    res.json({
      explanation: result.response.text(),
    });
  } catch (error) {
    console.error("Error in explainCodeSteps:", error);
    res.status(500).json({ error: "Failed to generate explanation" });
  }
};


