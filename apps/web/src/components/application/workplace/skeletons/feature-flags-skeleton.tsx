import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const FeatureFlagCardSkeleton = ({
    roundTop,
    roundBottom,
}: {
    roundTop: boolean;
    roundBottom: boolean;
}) => {
    return (
        <Card
            className={cn(
                "w-full rounded-none border-x border-b border-border/50 bg-card/50",
                roundTop && "rounded-t-xl border-t",
                roundBottom && "rounded-b-xl",
                !roundTop && !roundBottom && "border-t-0",
            )}
        >
            {/* Header */}
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                            <Skeleton className="h-6 w-44" />
                            <div className="flex items-center gap-1.5">
                                <Skeleton className="h-5 w-24 rounded-full" />
                                <Skeleton className="h-5 w-16 rounded-full" />
                            </div>
                        </div>
                    </div>
                    <Skeleton className="h-5 w-10 rounded-full shrink-0" />
                </div>
                <Skeleton className="h-4 w-full mt-1" />
                <Skeleton className="h-4 w-3/4" />
            </CardHeader>

            {/* Stats Row */}
            <CardContent className="pb-3 pt-0">
                <div className="flex flex-wrap items-center gap-1.5">
                    <Skeleton className="h-7 w-24 rounded-md" />
                    <Skeleton className="h-7 w-20 rounded-md" />
                    <Skeleton className="h-7 w-28 rounded-md" />
                    <Skeleton className="h-7 w-20 rounded-md" />
                </div>
            </CardContent>

            {/* Footer */}
            <CardFooter className="pt-0 pb-4">
                <div className="w-full flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1.5">
                            <Skeleton className="h-3 w-12" />
                            <Skeleton className="h-3 w-8" />
                        </div>
                        <Skeleton className="h-1.5 w-full rounded-full" />
                    </div>
                    <Skeleton className="h-7 w-7 rounded-lg" />
                </div>
            </CardFooter>
        </Card>
    );
};

const FeatureFlagsSkeleton = () => {
    return (
        <div className="w-full flex flex-col">
            {[...Array(3)].map((_, index) => (
                <FeatureFlagCardSkeleton
                    key={index}
                    roundTop={index === 0}
                    roundBottom={index === 2}
                />
            ))}
        </div>
    );
};

export default FeatureFlagsSkeleton;
