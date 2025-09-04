"use client";
import React, { useEffect, useState } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    useAddEnvUrlMutation,
    useGetEnvQuery,
} from "@/lib/tanstack/hooks/flag-env";
import { Loader2 } from "lucide-react";

const Environment = () => {
    // const [id, setId] = useState("")
    const [envs, setEnvs] = useState({
        prod: "",
        dev: "",
        stage: "",
    });

    const { data: envUrls, isLoading } = useGetEnvQuery();
    const addEnvUrlMutation = useAddEnvUrlMutation();

    useEffect(() => {
        if (envUrls) {
            // setId(envUrls.data.id ?? "")
            setEnvs({
                prod: envUrls?.data.prod ?? "",
                dev: envUrls?.data.dev ?? "",
                stage: envUrls?.data.stage ?? "",
            });
        }
    }, [envUrls]);

    const handleUpdateUrl = async () => {
        try {
            await addEnvUrlMutation.mutateAsync({
                // id,
                dev: envs.dev,
                prod: envs.prod,
                stage: envs.stage,
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <p className="scroll-m-20 text-2xl font-semibold tracking-tight">
                        Configure Enviroments
                    </p>
                </CardTitle>
                <CardDescription>
                    Set the URLs for your PRODUCTION, STAGING and DEVELOPMENT
                    environments to control where your feature flags can be
                    accessed. These URLs enable flag0ut to determine your
                    application&apos;s environment.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading && !envUrls ? (
                    <Loader2 className="animate-spin" />
                ) : (
                    <div className="flex flex-col justify-center items-center gap-8 w-full">
                        <div className="w-full">
                            <Label htmlFor="prod" className="mb-2">
                                Production
                            </Label>
                            <div className="flex flex-col lg:flex-row justify-center items-center gap-2 lg:gap-3">
                                <Input
                                    id="prod--url"
                                    name="prod"
                                    placeholder="https://www.myapp.com"
                                    value={envs.prod}
                                    onChange={(e) =>
                                        setEnvs((prev) => ({
                                            ...prev,
                                            prod: e.target.value,
                                        }))
                                    }
                                />
                                {/* <Button
                  className="ml-auto lg:ml-auto"
                  onClick={handleUpdateUrl}
                >
                  Add
                </Button> */}
                            </div>
                        </div>
                        <div className="w-full">
                            <Label htmlFor="dev" className="mb-2">
                                Development
                            </Label>
                            <div className="flex flex-col lg:flex-row justify-center items-center gap-2">
                                <Input
                                    id="dev--url"
                                    name="dev"
                                    placeholder="http://localhost:3000"
                                    value={envs.dev}
                                    onChange={(e) =>
                                        setEnvs((prev) => ({
                                            ...prev,
                                            dev: e.target.value,
                                        }))
                                    }
                                />
                            </div>
                        </div>
                        <div className="w-full">
                            <Label htmlFor="stage" className="mb-2">
                                Staging
                            </Label>
                            <div className="flex flex-col lg:flex-row justify-center items-center gap-2 lg:gap-3">
                                <Input
                                    id="stage--url"
                                    name="stage"
                                    placeholder="https://stage.myapp.com"
                                    value={envs.stage}
                                    onChange={(e) =>
                                        setEnvs((prev) => ({
                                            ...prev,
                                            stage: e.target.value,
                                        }))
                                    }
                                />
                                {/* <Button
                  className="ml-auto lg:ml-auto"
                  onClick={handleUpdateUrl}
                >
                  Update
                </Button> */}
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
            <CardFooter>
                <Button
                    className="ml-auto lg:ml-auto cursor-pointer"
                    onClick={handleUpdateUrl}
                    disabled={
                        (!envs.dev && !envs.prod && !envs.stage) ||
                        addEnvUrlMutation.isPending
                    }
                >
                    {addEnvUrlMutation.isPending ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        "Update"
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
};

export default Environment;
