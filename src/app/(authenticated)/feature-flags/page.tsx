import FlagList from "@/components/application/feature-flags/flag-list";
import { currentUser } from "@clerk/nextjs/server";
import React from "react";

const FeatureFlags = async () => {
    const user = await currentUser();
    return (
        <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl bg-background p-5 overflow-auto">
            <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                {user?.firstName}&apos;s Feature Flags
            </h2>
            <div className="w-full flex flex-col justify-center items-center">
                <FlagList />
            </div>
        </div>
    );
};

export default FeatureFlags;
