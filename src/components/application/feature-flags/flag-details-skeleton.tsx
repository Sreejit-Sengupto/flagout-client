
import { Skeleton } from "@/components/ui/skeleton";

const FlagDetailsSkeleton = () => {
    return (
        <div className="w-full flex flex-col lg:grid lg:grid-cols-5 rounded-tl-2xl bg-background lg:p-5 gap-2 overflow-auto">
            <div className="col-span-2 flex flex-col justify-start items-center gap-4">
                <Skeleton className="w-full h-full" />
            </div>

            <div className="w-full col-span-3 flex flex-col lg:grid lg:grid-cols-2 gap-3">
                <Skeleton className="w-full h-80" />
                <Skeleton className="w-full h-80" />
                <Skeleton className="w-full h-80" />
                <Skeleton className="w-full h-80" />
            </div>
        </div>
    );
};

export default FlagDetailsSkeleton;
