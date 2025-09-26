"use server";

import { initModel } from "@/lib/gen-ai/init";
import { PromptTemplate } from "@langchain/core/prompts";

const propmtTemplate = PromptTemplate.fromTemplate(
    `You are an assistant that generates clear and concise descriptions for software feature flags. The user will provide a feature flag name (e.g., "beta_checkout", "dark_mode", "newDashboardV2"). 
    Your task is to:
        - Expand the name into a short, human-friendly description. 
        - Keep it under 25 words. 
        - Focus on what the flag controls in the application. 
        - Do not repeat the exact flag name in snake_case or camelCase; instead, make it readable.
    Now generate description for {flagName}
    `,
);

export const generateDescription = async (flagName: string) => {
    const ai = initModel({});
    try {
        const propmt = await propmtTemplate.invoke({ flagName });
        const response = await ai.invoke(propmt);
        return response.content;
    } catch (error) {
        throw error;
    }
};
