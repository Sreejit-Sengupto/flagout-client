"use client";
import { GradientBarChart } from "@/components/application/charts/bar-chart";
import { ValueLineBarChart } from "@/components/application/charts/bar-chart-2";
import { RainbowGlowGradientLineChart } from "@/components/application/charts/pie-chart";
import { GlowingStrokeRadarChart } from "@/components/application/charts/radar-chart";
import { useFeatureFlagQuery } from "@/lib/tanstack/hooks/feature-flag";
import { useParams, useRouter } from "next/navigation";
import React, { useMemo } from "react";

const FlagDetails = () => {
    // const { slug } = await params;
    const { slug } = useParams();

    const router = useRouter();

    if (!slug) {
        router.back();
    }

    const { data: metrics, isLoading } = useFeatureFlagQuery(slug as string);

    const flagCalls = useMemo(() => {
        return metrics
            ? metrics.data.map((item) => ({
                  month: item.month.slice(0, item.month.indexOf(" ")),
                  value: item.metrics.flagCalls,
              }))
            : [];
    }, [metrics]);

    const usersTargeted = useMemo(() => {
        return metrics
            ? metrics.data.map((item) => ({
                  month: item.month.slice(0, item.month.indexOf(" ")),
                  value: item.metrics.usersTargeted,
              }))
            : [];
    }, [metrics]);

    const visibility = useMemo(() => {
        return metrics
            ? metrics.data.map((item) => ({
                  month: item.month.slice(0, item.month.indexOf(" ")),
                  value: item.metrics.visibility,
              }))
            : [];
    }, [metrics]);

    const activeFlags = useMemo(() => {
        return metrics
            ? metrics.data.map((item) => ({
                  month: item.month.slice(0, item.month.indexOf(" ")),
                  value: item.metrics.activeFlags,
              }))
            : [];
    }, [metrics]);

    return (
        <section className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl bg-background p-5 overflow-auto">
            <div>
                <p className="scroll-m-20 text-2xl font-semibold tracking-tight">
                    Analytics
                </p>
                <p className="uppercase text-gray-500 font-semibold">
                    {slug?.toString().split("-").join(" ")}
                </p>
            </div>

            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div className="w-full grid grid-cols-5 rounded-tl-2xl bg-background p-5 gap-2 overflow-auto">
                    <div className="col-span-2 flex flex-col justify-start items-center gap-4">
                        AI Suggestion {slug}
                    </div>

                    <div className="w-full col-span-3 grid grid-cols-2 gap-3">
                        <GradientBarChart
                            title="Flag Calls"
                            chartData={flagCalls}
                        />
                        <RainbowGlowGradientLineChart
                            title="Users Targeted"
                            chartData={usersTargeted}
                        />
                        <GlowingStrokeRadarChart
                            title="Visibility"
                            chartData={visibility}
                        />
                        <ValueLineBarChart
                            title="Active Flags"
                            chartData={activeFlags}
                        />
                    </div>
                </div>
            )}
        </section>
    );
};

export default FlagDetails;
