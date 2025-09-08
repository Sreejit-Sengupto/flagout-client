"use client";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Pill } from "@/components/ui/kibo-ui/pill";
import {
    Activity,
    Flag,
    TrendingDown,
    TrendingUp,
    Users,
    History,
} from "lucide-react";
import { Bitcount_Grid_Double } from "next/font/google";
import React from "react";
import CountUp from "react-countup";

interface TMetricCardProps {
    name: string;
    value: number;
    growth: number;
}

const dancingScript = Bitcount_Grid_Double({
    variable: "--font-pixel-sans",
    weight: ["400"],
    subsets: ["latin"],
});

const MetricCard: React.FC<TMetricCardProps> = ({ name, value, growth }) => {
    const growthText = () => {
        switch (name) {
            case "Users Targeted":
                return "unique users";

            default:
                return "this month";
        }
    };

    const cardIcon = () => {
        switch (name) {
            case "Active Flags":
                return <Flag size={18} />;

            case "Flag Calls":
                return <Activity size={18} />;

            case "Users Targeted":
                return <Users size={18} />;

            case "Feature Visibility":
                return <History size={18} />;

            default:
                return "";
        }
    };

    return (
        <Card className="w-full h-full border border-dashed border-gray-700 bg-primary-foreground">
            <CardHeader>
                <CardTitle>
                    <div className="flex justify-start items-center gap-2">
                        <p>{cardIcon()}</p>
                        <p className="text-lg font-semibold">{name}</p>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <CountUp
                    end={value}
                    duration={3}
                    className={`text-xl font-semibold text-gray-300 ${dancingScript.className}`}
                />
            </CardContent>
            <CardFooter>
                <div className="w-full flex justify-start items-center text-sm">
                    <Pill>
                        {growth > 0 ? (
                            <TrendingUp color="#00D100" size={18} />
                        ) : (
                            <TrendingDown color="red" size={18} />
                        )}
                        <CountUp end={growth} duration={3} />
                        &#37;
                    </Pill>
                    <p className="mx-2 text-blue-300">{growthText()}</p>
                </div>
            </CardFooter>
        </Card>
    );
};

export default MetricCard;
