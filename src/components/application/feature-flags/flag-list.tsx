"use client";
import { useUserFlagQuery } from "@/lib/tanstack/hooks/feature-flag";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React from "react";
import FeatureFlagCard from "../workplace/feature-flag-card";
import PaginationBar from "../pagination-bar";

const FlagList = () => {
    const searchParams = useSearchParams();

    const page = Math.max(Number(searchParams.get("page")) || 1, 1);
    const limit = Math.max(Number(searchParams.get("limit")) || 10, 1);

    const { data: featureFlags, isLoading } = useUserFlagQuery(limit, page);
    return (
        <div className="w-full">
            {isLoading ? (
                <Loader2 className="animate-spin" />
            ) : (
                featureFlags &&
                featureFlags.data.map((flag, index) => {
                    return (
                        <FeatureFlagCard
                            key={flag.id}
                            description={flag.description}
                            enabled={flag.enabled}
                            env={flag.environment}
                            evaluations={flag._count.evaluationLogs}
                            id={flag.id}
                            lastModified={flag.updatedAt}
                            name={flag.name}
                            rolloutPercentage={flag.rollout_percentage}
                            user={flag.targeting}
                            roundTop={index === 0}
                            roundBottom={index === featureFlags.data.length - 1}
                        />
                    );
                })
            )}
            {(featureFlags?.meta?.totalPages || 1) > 1 && (
                <div className="my-4">
                    <PaginationBar
                        page={page}
                        totalPages={featureFlags?.meta?.totalPages ?? 0}
                    />
                </div>
            )}
        </div>
    );
};

export default FlagList;
