"use client";
import { useGetMetrics } from "@/lib/tanstack/hooks/metrics";
import { ChartBarIncreasing, Loader2 } from "lucide-react";
import React from "react";
import MetricCard from "../workplace/metric-cards";
import EmptyState from "../emtpy-state";

const Metrics = () => {
    const { data: metrics, isLoading: metricsLoading } = useGetMetrics();

    return (
        <div className="w-full hidden lg:flex flex-col lg:flex-row justify-between items-center gap-2">
            {metricsLoading ? (
                <Loader2 className="animate-spin" />
            ) : metrics ? (
                Object.entries(metrics.data).map(([key, data]) => (
                    <MetricCard
                        key={key}
                        // name={"Name"}
                        name={key
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase())}
                        value={data.value}
                        growth={data.change}
                    />
                ))
            ) : (
                <EmptyState
                    icon={<ChartBarIncreasing />}
                    title="No metrics yet"
                    description="Not enough data to generate metrics"
                />
            )}
        </div>
    );
};

export default Metrics;
