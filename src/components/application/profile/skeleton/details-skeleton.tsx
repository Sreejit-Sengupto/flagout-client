import { Skeleton } from "@/components/ui/skeleton";

const ProfileDetailsSkeleton = () => {
    return (
        <section className="w-full bg-primary-foreground flex flex-col justify-center items-center gap-4 relative rounded-lg">
            <div className="absolute -top-15 left-1/2 -translate-x-1/2 bg-background p-4 rounded-full">
                <Skeleton className="h-32 w-32 rounded-full" />
            </div>

            <div className="mt-25 flex flex-col justify-center items-center gap-2">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-6 w-60" />
            </div>

            <div className="w-full p-5 grid grid-cols-1 lg:grid-cols-2 gap-3">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
            </div>
        </section>
    );
};

export default ProfileDetailsSkeleton;
