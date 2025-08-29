"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Pill, PillIndicator } from "@/components/ui/kibo-ui/pill";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Environment, TargetUser } from "@/generated/prisma";
import { formatNumber } from "@/lib/format-number";
import { timeAgo } from "@/lib/time-date";
import { cn } from "@/lib/utils";
import { IconGitMerge, IconSettings, IconSettingsFilled } from "@tabler/icons-react";
import { Activity, Calendar, TrendingUp, Users } from "lucide-react";
import React, { useMemo, useState } from "react";

interface TFlagCardProps {
    roundTop: boolean;
    roundBottom: boolean;
    name: string;
    env: Environment;
    enabled: boolean;
    description: string;
    rolloutPercentage: number;
    user: TargetUser[]
    lastModified: Date;
    evaluations: number;
}

const FeatureFlagCard: React.FC<TFlagCardProps> = ({
    roundTop,
    roundBottom,
    name,
    env,
    enabled,
    description,
    rolloutPercentage,
    user,
    lastModified,
    evaluations,
}) => {
    const [flagEnabled, setFlagEnabled] = useState<boolean>(enabled);

    const envVariant = useMemo(() => {
        switch (env) {
            case "STAGING":
                return "warning";
            case "PRODUCTION":
                return "success";
            case "DEVELOPMENT":
                return "info";
            default:
                return "error";
        }
    }, [env]);

    return (
        <Card
            className={cn(
                "w-full rounded-none",
                roundTop && "rounded-t-2xl",
                roundBottom && "rounded-b-2xl",
            )}
        >
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <div className="flex flex-col lg:flex-row justify-center items-start lg:items-center gap-2">
                        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                            {name}
                        </h3>
                        <Badge
                            variant={flagEnabled ? "destructive" : "secondary"}
                            className={
                                flagEnabled
                                    ? "bg-green-500 text-white transition-all duration-300 lg:hidden"
                                    : "transition-all duration-300 lg:hidden"
                            }
                        >
                            {flagEnabled ? "Enabled" : "Disabled"}
                        </Badge>
                        <Pill>
                            <PillIndicator pulse variant={envVariant} />
                            {env}
                        </Pill>
                        <Badge
                            variant={flagEnabled ? "secondary" : "destructive"}
                            className={
                                flagEnabled
                                    ? "bg-green-500 text-black transition-all duration-300 hidden lg:block"
                                    : "transition-all duration-300 hidden lg:block"
                            }
                        >
                            {flagEnabled ? "Enabled" : "Disabled"}
                        </Badge>
                    </div>
                    <Switch
                        checked={flagEnabled}
                        onCheckedChange={setFlagEnabled}
                        className="cursor-pointer  data-[state=checked]:bg-[#00D100]"
                    />
                </CardTitle>
                <CardDescription>
                    <p className="leading-7 [&:not(:first-child)]:mt-6">
                        {description}
                    </p>
                </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 lg:flex justify-start items-center gap-1 lg:gap-2">
                <Pill>
                    <TrendingUp color="#00D100" size={18} />
                    <p>{rolloutPercentage}&#37;</p>
                    <p>Rollout</p>
                </Pill>
                {user.map(item => <Pill key={item}>
                    <Users color="white" size={18} />
                    <p>{item.charAt(0).toUpperCase() + item.slice(1)}</p>
                    <p>Users</p>
                </Pill>)}
                <Pill>
                    <Calendar color="yellow" size={18} />
                    <p>{timeAgo(lastModified)}</p>
                </Pill>
                <Pill>
                    <Activity color="red" size={18} />
                    <p>{formatNumber(evaluations)}</p>
                    <p>Evaluations</p>
                </Pill>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
                <div className="w-full flex flex-col justify-center items-start gap-2">
                    <div className="w-[80%] lg:w-[60%] flex justify-between items-center">
                        <p>Rollout Percentage</p>
                        <p>{rolloutPercentage}&#37;</p>
                    </div>
                    <Progress
                        value={rolloutPercentage}
                        className="w-[80%] lg:w-[60%]"
                    />
                </div>
                <IconSettings
                    size={25}
                    className="cursor-pointer text-gray-400"
                />
            </CardFooter>
        </Card>
    );
};

export default FeatureFlagCard;
