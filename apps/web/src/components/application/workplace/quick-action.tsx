import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import React from "react";
import CreateFlagDialog from "./create-flag-dialog";

const QuickAction = ({
    availableProjects,
}: {
    availableProjects: { id: string; name: string }[];
}) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
                        Quick Actions
                    </h1>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-1.5">
                    <div className="w-full">
                        <CreateFlagDialog availableProjects={availableProjects}>
                            <div className="flex justify-start items-center h-full gap-2 bg-gray-800 px-4 py-2 rounded-tl-2xl hover:bg-gray-700 transition-all duration-300 cursor-pointer">
                                <div className="flex flex-col justify-center items-start">
                                    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-white">
                                        Create Flag
                                    </h3>
                                    <p className="leading-7 text-gray-400">
                                        Add a new flag
                                    </p>
                                </div>
                            </div>
                        </CreateFlagDialog>
                    </div>
                    <Link
                        href={
                            "https://github.com/Sreejit-Sengupto/flagout-client/blob/main/README.md"
                        }
                        className="flex justify-start items-center h-full gap-2 bg-gray-800 px-4 py-2 rounded-tr-2xl hover:bg-gray-700 transition-all duration-300"
                    >
                        {/* <Plus /> */}
                        <div className="flex flex-col justify-center items-start">
                            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                                View Docs
                            </h3>
                            <p className="leading-7 text-gray-400">
                                Integration guides
                            </p>
                        </div>
                    </Link>
                    <Link
                        href={"/settings"}
                        className="flex justify-start items-center h-full gap-2 bg-gray-800 px-4 py-2 rounded-bl-2xl hover:bg-gray-700 transition-all duration-300"
                    >
                        {/* <Plus /> */}
                        <div className="flex flex-col justify-center items-start">
                            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                                API Key
                            </h3>
                            <p className="leading-7 text-gray-400">
                                Get your API Key.
                            </p>
                        </div>
                    </Link>
                    <Link
                        href={
                            "https://github.com/Sreejit-Sengupto/flagout-client/blob/main/README.md#how-to"
                        }
                        className="flex justify-start items-center h-full gap-2 bg-gray-800 px-4 py-2 rounded-br-2xl hover:bg-gray-700 transition-all duration-300"
                    >
                        {/* <Plus /> */}
                        <div className="flex flex-col justify-center items-start">
                            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                                SDK Setup
                            </h3>
                            <p className="leading-7 text-gray-400">
                                Add to your project
                            </p>
                        </div>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
};

export default QuickAction;
