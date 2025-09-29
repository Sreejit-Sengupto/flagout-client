"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig;

export function GlowingStrokeRadarChart({
    title,
    chartData,
}: {
    title: string;
    chartData: { month: string; value: number }[];
}) {
    const firstDataPoint = chartData[0];
    const lastDataPoint = chartData[chartData.length - 1];

    const firstValue = firstDataPoint.value;
    const lastValue = lastDataPoint.value;

    // Calculate overall percentage change
    let overallChange = 0;
    if (firstValue === 0) {
        overallChange = lastValue > 0 ? 100 : 0;
    } else {
        overallChange = ((lastValue - firstValue) / firstValue) * 100;
    }

    return (
        <Card>
            <CardHeader className="items-center pb-4">
                <CardTitle>
                    {title}
                    <Badge
                        variant="outline"
                        className={cn(
                            "text-red-500 bg-red-500/10 border-none ml-2",
                            overallChange >= 0 &&
                                "text-green-500 bg-green-500/10",
                        )}
                    >
                        <TrendingUp className="h-4 w-4" />
                        <span>{overallChange}%</span>
                    </Badge>
                </CardTitle>
                <CardDescription>
                    Showing total times the feature was visible to the users for
                    the last 6 months
                </CardDescription>
            </CardHeader>
            <CardContent className="pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <RadarChart data={chartData}>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent />}
                        />
                        <PolarAngleAxis dataKey="month" />
                        <PolarGrid strokeDasharray="3 3" />
                        <Radar
                            stroke="var(--color-desktop)"
                            dataKey="value"
                            fill="none"
                            filter="url(#stroke-line-glow)"
                        />
                        <defs>
                            <filter
                                id="stroke-line-glow"
                                x="-20%"
                                y="-20%"
                                width="140%"
                                height="140%"
                            >
                                <feGaussianBlur
                                    stdDeviation="10"
                                    result="blur"
                                />
                                <feComposite
                                    in="SourceGraphic"
                                    in2="blur"
                                    operator="over"
                                />
                            </filter>
                        </defs>
                    </RadarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
