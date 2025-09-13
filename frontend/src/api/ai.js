import axios from "axios";

const API_URL = "https://ai-code-comment-generator-1.onrender.com/api";

export const generateComments = async ({ codeSnippet, language }) => {
  const res = await axios.post(`${API_URL}/generate-comments`, { codeSnippet, language });
  return res.data;
};

export const getCodeExplanationSteps = async ({ codeSnippet, language }) => {
  const res = await axios.post(`${API_URL}/explain-steps`, { codeSnippet, language });
  return res.data;
};


