"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis } from "recharts";
import React from "react";
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
import { cn } from "@/lib/utils";

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "var(--secondary-foreground)",
    },
} satisfies ChartConfig;

export function ValueLineBarChart({
    title,
    chartData,
}: {
    title: string;
    chartData: { month: string; value: number }[];
}) {
    const startMonth = chartData[0].month;
    const endMonth = chartData[chartData.length - 1].month;

    const firstDataPoint = chartData[0];
    const lastDataPoint = chartData[chartData.length - 1];

    const firstValue = firstDataPoint.value;
    const lastValue = lastDataPoint.value;

    let overallChange = 0;
    if (firstValue === 0) {
        overallChange = lastValue > 0 ? 100 : 0;
    } else {
        overallChange = ((lastValue - firstValue) / firstValue) * 100;
    }

    return (
        <Card>
            <CardHeader>
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
                        {overallChange >= 0 ? (
                            <TrendingUp className="h-4 w-4" />
                        ) : (
                            <TrendingDown className="h-4 w-4" />
                        )}
                        <span>{overallChange}%</span>
                    </Badge>
                </CardTitle>
                <CardDescription>
                    {startMonth} - {endMonth}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData}>
                        <rect
                            x="0"
                            y="0"
                            width="100%"
                            height="85%"
                            fill="url(#default-pattern-dots)"
                        />
                        <defs>
                            <DottedBackgroundPattern />
                        </defs>
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar
                            dataKey="value"
                            fill="var(--color-desktop)"
                            radius={4}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

const DottedBackgroundPattern = () => {
    return (
        <pattern
            id="default-pattern-dots"
            x="0"
            y="0"
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
        >
            <circle
                className="dark:text-muted/40 text-muted"
                cx="2"
                cy="2"
                r="1"
                fill="currentColor"
            />
        </pattern>
    );
};
