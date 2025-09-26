"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis } from "recharts";
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

// const chartData = [
//     { month: "January", desktop: 342 },
//     { month: "February", desktop: 876 },
//     { month: "March", desktop: 512 },
//     { month: "April", desktop: 629 },
//     { month: "May", desktop: 458 },
//     { month: "June", desktop: 781 },
//     { month: "July", desktop: 394 },
//     { month: "August", desktop: 925 },
//     { month: "September", desktop: 647 },
//     { month: "October", desktop: 532 },
//     { month: "November", desktop: 803 },
//     { month: "December", desktop: 271 },
// ];

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig;

export function GradientBarChart({
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

    // Calculate overall percentage change
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
                            shape={<CustomGradientBar />}
                            dataKey="value"
                            fill="var(--color-desktop)"
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

const CustomGradientBar = (
    props: React.SVGProps<SVGRectElement> & { dataKey?: string },
) => {
    const { fill, x, y, width, height, dataKey } = props;

    return (
        <>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                stroke="none"
                fill={`url(#gradient-bar-pattern-${dataKey})`}
            />
            <rect
                x={x}
                y={y}
                width={width}
                height={2}
                stroke="none"
                fill={fill}
            />
            <defs>
                <linearGradient
                    id={`gradient-bar-pattern-${dataKey}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                >
                    <stop offset="0%" stopColor={fill} stopOpacity={0.5} />
                    <stop offset="100%" stopColor={fill} stopOpacity={0} />
                </linearGradient>
            </defs>
        </>
    );
};
