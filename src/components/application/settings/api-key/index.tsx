import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import React from "react";
import CreateKey from "./create-key";
import { AllKeys } from "./all-keys";

const APIKeys = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <p className="scroll-m-20 text-2xl font-semibold tracking-tight">
                        API Keys
                    </p>
                    <CreateKey />
                </CardTitle>
                <CardDescription>
                    Create and manage your API keys
                </CardDescription>
            </CardHeader>
            <CardContent>
                <AllKeys />
            </CardContent>
        </Card>
    );
};

export default APIKeys;
