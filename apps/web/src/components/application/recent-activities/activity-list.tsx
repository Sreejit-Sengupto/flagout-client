"use client";
import { useSearchParams } from "next/navigation";
import React from "react";
import PaginationBar from "../pagination-bar";
import { useRecentActivity } from "@/lib/tanstack/hooks/recent-activity";
import RecentActivity from "../workplace/recent-activity";
import RecentActivitySkeleton from "../workplace/skeletons/recent-activity-skeleton";

const ActivityList = () => {
    const searchParams = useSearchParams();

    const page = Math.max(Number(searchParams.get("page")) || 1, 1);
    const limit = Math.max(Number(searchParams.get("limit")) || 10, 1);

    const { data: activities, isLoading } = useRecentActivity(limit, page);

    return (
        <div className="w-full">
            {isLoading ? (
                <RecentActivitySkeleton className="bg-primary-foreground my-4" />
            ) : (
                activities &&
                activities.data.map((activity) => {
                    return (
                        <RecentActivity
                            key={activity.id}
                            flagName={activity.flag.name}
                            time={activity.createdAt}
                            title={activity.activity}
                            className="bg-primary-foreground my-4"
                        />
                    );
                })
            )}
            {(activities?.meta?.totalPages || 1) > 1 && (
                <div className="my-4">
                    <PaginationBar
                        page={page}
                        totalPages={activities?.meta?.totalPages ?? 0}
                    />
                </div>
            )}
        </div>
    );
};

export default ActivityList;
