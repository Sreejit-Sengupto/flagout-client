import ActivityList from "@/components/application/recent-activities/activity-list";
import React from "react";

const RecentActivities = () => {
    return (
        <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl bg-background p-5 overflow-auto">
            <div>
                <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                    Recent Activities
                </h2>
            </div>
            <div className="w-full flex flex-col justify-center items-center">
                <ActivityList />
            </div>
        </div>
    );
};

export default RecentActivities;
