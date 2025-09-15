import { Skeleton } from "@/components/ui/skeleton";

const RecentActivitySkeleton = () => {
    return (
        <div className="w-full flex flex-col gap-2">
            {[...Array(5)].map((_, index) => (
                <div
                    key={index}
                    className="w-full bg-background p-5 rounded-2xl"
                >
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-4 w-1/4 ml-auto" />
                </div>
            ))}
        </div>
    );
};

export default RecentActivitySkeleton;
