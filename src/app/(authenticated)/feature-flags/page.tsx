"use client";
import FlagList from "@/components/application/feature-flags/flag-list";
import CreateFlagDialog from "@/components/application/workplace/create-flag-dialog";
import { Button } from "@/components/ui/button";
import { useGetAllProjects } from "@/lib/tanstack/hooks/projects";
import React from "react";

const FeatureFlags = () => {
    const { data: projects, isLoading: projectsLoading } = useGetAllProjects();

    return (
        <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl bg-background p-5 overflow-auto">
            <div className="flex justify-between items-center">
                <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                    Feature Flags
                </h2>
                <CreateFlagDialog
                    availableProjects={
                        projects?.data.map((item) => ({
                            id: item.id,
                            name: item.name,
                        })) ?? []
                    }
                >
                    <Button className="rounded-xl cursor-pointer">
                        Create Flag
                    </Button>
                </CreateFlagDialog>
            </div>
            <div className="w-full flex flex-col justify-center items-center">
                <FlagList
                    projects={projects}
                    projectsLoading={projectsLoading}
                />
            </div>
        </div>
    );
};

export default FeatureFlags;
