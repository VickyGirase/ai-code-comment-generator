import axios from "axios";

const API = axios.create({ baseURL: "https://ai-code-comment-generator-1.onrender.com" });

export const generateComments = (codeSnippet) =>
    API.post("/generate", { codeSnippet });
