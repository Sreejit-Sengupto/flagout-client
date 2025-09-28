import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

interface TModel {
    name?: string;
    maxOutputTokens?: number;
}

export const initModel = ({
    name = "gemini-2.5-flash",
    maxOutputTokens = 2048,
}: TModel) => {
    const model = new ChatGoogleGenerativeAI({
        apiKey: process.env.GEMINI_API_KEY,
        model: name,
        maxOutputTokens,
    });

    return model;
};