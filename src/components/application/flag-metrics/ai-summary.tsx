"use client"
import { generateAISuggestions, TInput } from '@/app/actions/ai-summary.action'
import { getFlagIdFromSlug } from '@/app/actions/flag.action';
import React, { useEffect, useState } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Skeleton } from '@/components/ui/skeleton';

const AISummary = ({ slug, data }: { slug: string, data: TInput[] }) => {
    const [summary, setSummary] = useState<string>("");
    const [recommendation, setRecommendation] = useState<string>("")
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handler = async () => {
            setLoading(true);
            const flagId = await getFlagIdFromSlug(slug)
            const { summary, recommendation } = await generateAISuggestions(flagId, data);
            setSummary(summary);
            setRecommendation(recommendation);
            setLoading(false);
        }
        handler();
    }, [slug, data])

    if (loading) {
        return (
            <section className='w-full h-full flex flex-col justify-start items-center gap-3 bg-primary-foreground p-5 rounded-xl'>
                <h2 className="scroll-m-20 border-b pb-2 text-2xl lg:text-3xl font-semibold tracking-tight first:mt-0">
                    Summary & Recommendations
                </h2>
                <div className='w-full flex flex-col gap-4'>
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
                <div className='w-full flex flex-col gap-4'>
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
            </section>
        )
    }

    const formatRecommendation = (text: string) => {
        return text.replace(/(\d\.)/g, '\n$1');
    }

    return (
        <section className='w-full h-full flex flex-col justify-start items-center gap-3 bg-primary-foreground p-5 rounded-xl'>
            <h2 className="scroll-m-20 border-b pb-2 text-2xl lg:text-3xl font-semibold tracking-tight first:mt-0">
                Summary & Recommendations
            </h2>
            <div>
                <h4 className="scroll-m-20 text-xl font-semibold tracking-tight underline">
                    Summary
                </h4>
                <div className="leading-7">
                    <Markdown remarkPlugins={[remarkGfm]}>
                        {summary}
                    </Markdown>
                </div>
            </div>
            <div>
                <h4 className="scroll-m-20 text-xl font-semibold tracking-tight underline">
                    Recommendations
                </h4>
                <div className="leading-7">
                    <Markdown remarkPlugins={[remarkGfm]}>
                        {formatRecommendation(recommendation)}
                    </Markdown>
                </div>
            </div>
        </section>
    )
}

export default AISummary