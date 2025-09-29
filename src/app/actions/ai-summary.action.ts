"use server"

import { PromptTemplate } from "@langchain/core/prompts"
import { JsonOutputParser } from "@langchain/core/output_parsers"
import { initModel } from "@/lib/gen-ai/init";
import prisma from "@/lib/prisma";
import crypto from "crypto"

export interface TInput {
    category: string;
    metrics: {
        month: string;
        value: number;
    }[]
}

interface TOutput {
    summary: string;
    recommendation: string;
}

const serializeInput = (data: TInput[]) => {
    const serializedData = data.map((item) => {
        const lastMVal = item.metrics[item.metrics.length - 1].value;
        const secondLastMVal = item.metrics[item.metrics.length - 2].value;

        const percentageChange = (lastMVal - secondLastMVal) / secondLastMVal * 100;

        const sumOfRest = item.metrics.reduce((acc, red) => {
            return acc + red.value;
        }, 0)

        return {
            category: item.category,
            "percentage_change_last_two_months": percentageChange,
            "average_of_remaining_months": sumOfRest / item.metrics.length
        }
    })
    return serializedData;
}

const getSummAndRec = async ({ serializedData }: {
    serializedData: {
        category: string;
        percentage_change_last_two_months: number;
        average_of_remaining_months: number;
    }[]
}) => {
    const promptTemplate = PromptTemplate.fromTemplate(
        `You are analyzing feature flag usage data for an application. The data includes the category name (flag calls, users targeted, feature visibility, active flags), the percentage change between last two months and the average of the values of the rest of the months.
         Your task:  
            1. Write a concise, human-readable summary of the key metrics (flag calls, users targeted, feature visibility, active flags).  
            2. Suggest 2–3 actionable recommendations, such as increasing or decreasing rollout percentage, adjusting targeting, or monitoring performance trends.  
            3. Keep the summary and recommendations professional, clear, and easy to understand as if shown in a product dashboard.  

            Input (JSON data):  
            {metrics}

            Format Instructions: {format_instructions}
        `
    )
    const formatInstructions = "Respond with a valid JSON object, containing two fields: 'summary' and 'recommendation'. Both string fields, follow the format strictly DO NOT come up with your own. 'summary' is string and 'recommendation' is string as well and NOT AN array";

    try {
        const partialPrompt = await promptTemplate.partial({
            format_instructions: formatInstructions
        })

        const parser = new JsonOutputParser<TOutput>();
        const ai = initModel({});
        const chain = partialPrompt.pipe(ai).pipe(parser)

        const response = await chain.invoke({
            metrics: serializedData,
        })

        console.log("response", response);

        console.log("Summary:", response.summary);
        console.log("Recommendation:", response.recommendation);

        return {
            summary: response.summary,
            recommendation: response.recommendation
        }
    } catch (error) {
        throw error
    }
}

export const generateAISuggestions = async (flagId: string, data: TInput[]) => {
    try {
        // first check DB
        // if entry doesn't exists add it
        // if percentage change is less than 10% don't generate recommendations, return from DB
        const existingSuggestion = await prisma.aISum.findFirst({
            where: {
                flag_id: flagId
            }
        })


        const serializedData = serializeInput(data);
        const stringifiedData = JSON.stringify(serializedData);
        const hashedData = crypto.createHash('sha256').update(stringifiedData).digest('hex');
        if (!existingSuggestion) {
            console.log("I am in");

            const suggestions = await getSummAndRec({ serializedData })
            const addedSuggestion = await prisma.aISum.create({
                data: {
                    flag_id: flagId,
                    hash: hashedData,
                    summary: suggestions.summary,
                    recommendation: suggestions.recommendation
                }
            })
            return addedSuggestion;
        }

        // const shouldRegenerate = serializedData.map((item) => (item.percentage_change_last_two_months > 10 || item.percentage_change_last_two_months < -10) && item.percentage_change_last_two_months !== prev).includes(true);
        const shouldRegenerate = hashedData !== existingSuggestion.hash;
        if (shouldRegenerate) {
            const suggestions = await getSummAndRec({ serializedData });
            const updatedSuggestion = await prisma.aISum.update({
                data: {
                    summary: suggestions.summary,
                    recommendation: suggestions.recommendation
                },
                where: {
                    flag_id: flagId
                }
            })
            return updatedSuggestion;
        } else {
            return existingSuggestion;
        }

    } catch (error) {
        throw error
    }
}

