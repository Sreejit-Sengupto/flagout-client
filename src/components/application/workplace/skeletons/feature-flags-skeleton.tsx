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
                "w-full rounded-none",
                roundTop && "rounded-t-2xl",
                roundBottom && "rounded-b-2xl",
            )}
        >
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div className="flex flex-col lg:flex-row justify-center items-start lg:items-center gap-2">
                        <Skeleton className="h-8 w-40" />
                        <Skeleton className="h-6 w-20 lg:hidden" />
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-6 w-20 hidden lg:block" />
                    </div>
                    <Skeleton className="h-6 w-12" />
                </div>
                <Skeleton className="h-5 w-full mt-2" />
            </CardHeader>
            <CardContent className="grid grid-cols-2 lg:flex justify-start items-center gap-1 lg:gap-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-8 w-28" />
            </CardContent>
            <CardFooter className="flex justify-between items-center">
                <div className="w-full flex flex-col justify-center items-start gap-2">
                    <div className="w-[80%] lg:w-[60%] flex justify-between items-center">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-5 w-10" />
                    </div>
                    <Skeleton className="h-2 w-[80%] lg:w-[60%]" />
                </div>
                <Skeleton className="h-6 w-6" />
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
