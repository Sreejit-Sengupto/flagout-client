"use client";
import { useUserFlagQuery } from "@/lib/tanstack/hooks/feature-flag";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import FeatureFlagCard from "../workplace/feature-flag-card";
import PaginationBar from "../pagination-bar";
import FeatureFlagsSkeleton from "../workplace/skeletons/feature-flags-skeleton";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { TResponseGetAllProjects } from "@/lib/tanstack/api/project";

const FlagList = ({
    projects,
    projectsLoading,
}: {
    projects: TResponseGetAllProjects | undefined;
    projectsLoading: boolean;
}) => {
    const searchParams = useSearchParams();

    const page = Math.max(Number(searchParams.get("page")) || 1, 1);
    const limit = Math.max(Number(searchParams.get("limit")) || 10, 1);

    const [selectedProject, setSelectedProject] = useState("");
    const { data: featureFlags, isLoading } = useUserFlagQuery(
        limit,
        page,
        selectedProject,
    );

    useEffect(() => {
        const projectInLocalStr = localStorage.getItem("selected-project");
        if (projectInLocalStr) {
            setSelectedProject(projectInLocalStr);
        } else {
            setSelectedProject(projects?.data[0].id ?? "");
        }
    }, [projects]);

    const handleProjectSelect = (val: string) => {
        setSelectedProject(val);
        localStorage.setItem("selected-project", val);
    };

    return (
        <div className="w-full">
            <div className="w-full flex justify-end items-center my-3">
                <p className="mr-2">Project: </p>
                {projectsLoading ? (
                    <p>Loading...</p>
                ) : (
                    <Select
                        value={selectedProject}
                        onValueChange={(val) => handleProjectSelect(val)}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a fruit" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Projects</SelectLabel>
                                {projects?.data.map((item) => (
                                    <SelectItem key={item.id} value={item.id}>
                                        {item.name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                )}
            </div>
            {isLoading ? (
                <FeatureFlagsSkeleton />
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
                            slug={flag.slug}
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
