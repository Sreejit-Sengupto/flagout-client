import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import CreateFlagDialog from "./create-flag-dialog";

const QuickAction = () => {
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
                        <CreateFlagDialog />

                    </div>
                    <Link
                        href={"#"}
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
                        href={"#"}
                        className="flex justify-start items-center h-full gap-2 bg-gray-800 px-4 py-2 rounded-bl-2xl hover:bg-gray-700 transition-all duration-300"
                    >
                        {/* <Plus /> */}
                        <div className="flex flex-col justify-center items-start">
                            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                                AI Insights
                            </h3>
                            <p className="leading-7 text-gray-400">
                                Get useful insights from AI.
                            </p>
                        </div>
                    </Link>
                    <Link
                        href={"#"}
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
