import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Pill, PillIndicator } from "@/components/ui/kibo-ui/pill";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Activity, Calendar, TrendingUp, Users } from "lucide-react";
import React from "react";

const DashboardPreview = () => {
    return (
        <Card className={cn("w-full rounded-2xl")}>
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <div className="flex flex-col lg:flex-row justify-center items-start lg:items-center gap-2">
                        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                            Awesome Feature
                        </h3>
                        <Badge
                            variant={"destructive"}
                            className={
                                "bg-green-500 text-white transition-all duration-300"
                            }
                        >
                            Enabled
                        </Badge>
                        <Pill>
                            <PillIndicator pulse variant={"success"} />
                            PROD
                        </Pill>
                    </div>
                    <Switch
                        checked
                        className="cursor-pointer  data-[state=checked]:bg-[#00D100]"
                    />
                </CardTitle>
                <CardDescription>
                    <p className="leading-7 [&:not(:first-child)]:mt-6">
                        This is a description for an awesome feature.
                    </p>
                </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 lg:flex justify-start items-center gap-1 lg:gap-2">
                <Pill>
                    <TrendingUp color="#00D100" size={18} />
                    <p>50%</p>
                    <p>Rollout</p>
                </Pill>
                <Pill>
                    <Users color="white" size={18} />
                    <p>Internal</p>
                    <p>Users</p>
                </Pill>
                <Pill>
                    <Calendar color="yellow" size={18} />
                    <p>2 days ago</p>
                </Pill>
                <Pill>
                    <Activity color="red" size={18} />
                    <p>1.2k</p>
                    <p>Evaluations</p>
                </Pill>
            </CardContent>
        </Card>
    );
};

export default DashboardPreview;
