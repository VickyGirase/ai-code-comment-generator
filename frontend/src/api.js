import axios from "axios";

const API = axios.create({ baseURL: "https://ai-code-comment-generator-rrr3.vercel.app" });

export const generateComments = (codeSnippet) =>
    API.post("/generate", { codeSnippet });
