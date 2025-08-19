import { timeAgo } from "@/lib/time-date";
import { Dot } from "lucide-react";
import React from "react";

interface TRecentActivityProps {
    title: string;
    flagName: string;
    time: Date;
}

const RecentActivity: React.FC<TRecentActivityProps> = ({
    flagName,
    title,
    time,
}) => {
    return (
        <div className="w-full bg-background p-5 rounded-2xl">
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight flex justify-start items-center gap-1">
                <Dot size={32} />
                {title}
            </h3>
            <p className="leading-7 text-blue-500 ml-10">{flagName}</p>
            <p className="flex justify-end items-center text-sm text-gray-400">
                {timeAgo(time)}
            </p>
        </div>
    );
};

export default RecentActivity;
