import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const EnvironmentSkeleton = () => {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-5 w-full mt-2" />
            </CardHeader>
            <CardContent className="flex flex-col justify-center items-center gap-8 w-full">
                <div className="w-full">
                    <Skeleton className="h-5 w-24 mb-2" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="w-full">
                    <Skeleton className="h-5 w-24 mb-2" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="w-full">
                    <Skeleton className="h-5 w-24 mb-2" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </CardContent>
            <CardFooter className="flex justify-end">
                <Skeleton className="h-10 w-24" />
            </CardFooter>
        </Card>
    );
};

export default EnvironmentSkeleton;
