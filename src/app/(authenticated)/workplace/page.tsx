"use client";
import EmptyState from "@/components/application/emtpy-state";
import FeatureFlagCard from "@/components/application/workplace/feature-flag-card";
import MetricCard from "@/components/application/workplace/metric-cards";
import QuickAction from "@/components/application/workplace/quick-action";
import RecentActivity from "@/components/application/workplace/recent-activity";
import { useUserFlagQuery } from "@/lib/tanstack/hooks/feature-flag";
import {
    Activity,
    Flag,
    Users,
    History,
    ArrowRight,
    Loader2,
} from "lucide-react";
import Link from "next/link";

const Workplace = () => {
    const { data: featureFlags, isLoading, isError } = useUserFlagQuery(10, 1);
    console.log("Data:", featureFlags);

    const metrics = [
        {
            name: "Active Flags",
            value: 24,
            growth: 12,
            icon: <Flag size={18} />,
        },
        {
            name: "Flag Calls",
            value: 24000000,
            growth: 23,
            icon: <Activity size={18} />,
        },
        {
            name: "Users Targeted",
            value: 45200,
            growth: 8,
            icon: <Users size={18} />,
        },
        {
            name: "Rollbacks",
            value: 3,
            growth: -2,
            icon: <History size={18} />,
        },
    ];

    const recentActivity = [
        {
            action: "Flag enabled",
            target: "New Dashboard UI",
            time: new Date("2025-08-19T12:02:00Z"),
            user: "John Doe",
        },
        {
            action: "Experiment started",
            target: "Button Color Test",
            time: new Date("2025-08-19T11:00:00Z"),
            user: "Jane Smith",
        },
        {
            action: "Flag disabled",
            target: "Legacy Feature",
            time: new Date("2025-08-19T09:00:00Z"),
            user: "Mike Johnson",
        },
        {
            action: "Flag created",
            target: "Dark Mode Rollout",
            time: new Date("2025-08-18T18:30:00Z"),
            user: "Alice Brown",
        },
        {
            action: "Experiment ended",
            target: "Homepage Layout Test",
            time: new Date("2025-08-18T15:45:00Z"),
            user: "Robert Wilson",
        },
        {
            action: "Flag updated",
            target: "Checkout Flow",
            time: new Date("2025-08-17T20:10:00Z"),
            user: "Emily Davis",
        },
        {
            action: "Flag deleted",
            target: "Old Search Feature",
            time: new Date("2025-08-17T09:25:00Z"),
            user: "Chris Lee",
        },
        {
            action: "Experiment started",
            target: "Signup Funnel Test",
            time: new Date("2025-08-16T22:00:00Z"),
            user: "Sophia Martinez",
        },
    ];

    return (
        <div className="flex h-full w-full flex-1 flex-col lg:grid grid-cols-5 gap-2 rounded-tl-2xl bg-background p-5 overflow-auto">
            <div className="col-span-3 flex flex-col justify-start items-center gap-4">
                <div className="w-full hidden lg:flex flex-col lg:flex-row justify-between items-center gap-2">
                    {metrics.map((item, index) => (
                        <MetricCard
                            key={index}
                            name={item.name}
                            value={item.value}
                            growth={item.growth}
                            icon={item.icon}
                        />
                    ))}
                </div>

                <div className="w-full flex flex-col justify-center items-center">
                    <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance mr-auto mb-3 lg:mt-8">
                        Feature Flags
                    </h1>
                    {isLoading ? (
                        <Loader2 className="animate-spin" />
                    ) : featureFlags && featureFlags.data.length === 0 ? (
                        <EmptyState
                            icon={<Flag size={32} />}
                            title="No Feature Flags"
                            description="You haven't created any feature flags yet"
                        />
                    ) : (
                        featureFlags?.data.map((item, index) => (
                            <FeatureFlagCard
                                key={item.id}
                                description={item.description}
                                enabled={item.enabled}
                                env={
                                    item.environment}
                                evaluations={0}
                                // lastModified={new Date(item.createdAt)}
                                lastModified={item.createdAt}
                                name={item.name}
                                rolloutPercentage={item.rollout_percentage}
                                user={item.targeting}
                                roundTop={index === 0}
                                roundBottom={index === featureFlags.data.length - 1}
                            />
                        ))
                    )}
                    <Link
                        href={"#"}
                        className="flex justify-center items-center gap-1 mb-12 mt-2 text-blue-400"
                    >
                        <p>View all Feature Flags</p>
                        <ArrowRight size={18} />
                    </Link>
                </div>

                <div className="w-full flex lg:hidden flex-col lg:flex-row justify-between items-center gap-2 mb-12">
                    {metrics.map((item, index) => (
                        <MetricCard
                            key={index}
                            name={item.name}
                            value={item.value}
                            growth={item.growth}
                            icon={item.icon}
                        />
                    ))}
                </div>
            </div>

            <div className="col-span-2 flex flex-col justify-start items-center gap-4">
                <div className="w-full">
                    <QuickAction />
                </div>

                <div className="w-full rounded-2xl bg-primary-foreground p-5 border">
                    <h1 className="scroll-m-20 text-center lg:text-left text-4xl font-extrabold tracking-tight text-balance mb-8">
                        Recent Activity
                    </h1>
                    <div className="flex flex-col justify-start items-center w-full gap-2 max-h-[60dvh] overflow-y-auto">
                        {recentActivity.map((item, index) => (
                            <RecentActivity
                                key={index}
                                flagName={item.target}
                                title={item.action}
                                time={item.time}
                            />
                        ))}
                    </div>
                    <Link
                        href={"#"}
                        className="flex justify-center items-center gap-1 mt-4 text-blue-400"
                    >
                        <p>See all Recent Activity</p>
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Workplace;
