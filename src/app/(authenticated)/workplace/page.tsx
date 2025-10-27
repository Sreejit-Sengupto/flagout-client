"use client";
import EmptyState from "@/components/application/emtpy-state";
import FeatureFlagCard from "@/components/application/workplace/feature-flag-card";
import MetricCard from "@/components/application/workplace/metric-cards";
import QuickAction from "@/components/application/workplace/quick-action";
import RecentActivity from "@/components/application/workplace/recent-activity";
import FeatureFlagsSkeleton from "@/components/application/workplace/skeletons/feature-flags-skeleton";
import MetricCardSkeleton from "@/components/application/workplace/skeletons/metric-cards-skeleton";
import RecentActivitySkeleton from "@/components/application/workplace/skeletons/recent-activity-skeleton";
import { useUserFlagQuery } from "@/lib/tanstack/hooks/feature-flag";
import { useGetMetrics } from "@/lib/tanstack/hooks/metrics";
import { useRecentActivity } from "@/lib/tanstack/hooks/recent-activity";
import {
    Flag,
    ArrowRight,
    ChartBarIncreasing,
    ChartColumn,
} from "lucide-react";
import Link from "next/link";

const Workplace = () => {
    const { data: featureFlags, isLoading } = useUserFlagQuery(5, 1);
    const { data: recentActivity, isLoading: activityLoading } =
        useRecentActivity(5, 1);
    const { data: metrics, isLoading: metricsLoading } = useGetMetrics();

    return (
        <div className="flex h-full w-full flex-1 flex-col lg:grid grid-cols-5 gap-2 rounded-tl-2xl bg-background p-5 overflow-auto">
            <div className="col-span-3 flex flex-col justify-start items-center gap-4">
                <div className="w-full hidden lg:flex flex-col lg:flex-row justify-between items-center gap-2">
                    {metricsLoading ? (
                        <MetricCardSkeleton />
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

                <div className="w-full flex flex-col justify-center items-center">
                    <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance mr-auto mb-3 lg:mt-9">
                        Feature Flags
                    </h1>
                    {isLoading ? (
                        <FeatureFlagsSkeleton />
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
                                id={item.id}
                                slug={item.slug}
                                description={item.description}
                                enabled={item.enabled}
                                env={item.environment}
                                evaluations={item._count.evaluationLogs}
                                // lastModified={new Date(item.createdAt)}
                                lastModified={item.createdAt}
                                name={item.name}
                                rolloutPercentage={item.rollout_percentage}
                                user={item.targeting}
                                roundTop={index === 0}
                                roundBottom={
                                    index === featureFlags.data.length - 1
                                }
                            />
                        ))
                    )}
                    <Link
                        href={"/feature-flags"}
                        className="flex justify-center items-center gap-1 mb-12 mt-2 text-blue-400"
                    >
                        <p>View all Feature Flags</p>
                        <ArrowRight size={18} />
                    </Link>
                </div>

                <div className="w-full flex lg:hidden flex-col lg:flex-row justify-between items-center gap-2 mb-12">
                    {metricsLoading ? (
                        <MetricCardSkeleton />
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
                            title=" No metrics yet"
                            description="Not enough data to generate metrics"
                        />
                    )}
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
                        {activityLoading ? (
                            <RecentActivitySkeleton />
                        ) : recentActivity && recentActivity.data.length > 0 ? (
                            recentActivity.data.map((item, index) => (
                                <RecentActivity
                                    key={index}
                                    flagName={item.flag.name}
                                    title={item.activity}
                                    time={item.createdAt}
                                />
                            ))
                        ) : (
                            <EmptyState
                                icon={<ChartColumn size={32} />}
                                title="No activity yet"
                                description="You have not activity yet. Start by creating new flags"
                            />
                        )}
                    </div>
                    <Link
                        href={"/recent-activities"}
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
