import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const MetricCardSkeleton = () => {
    return (
        <>
            {[...Array(4)].map((_, index) => (
                <Card
                    key={index}
                    className="w-full h-full border border-dashed border-gray-700 bg-primary-foreground"
                >
                    <CardHeader>
                        <Skeleton className="h-6 w-3/4" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-8 w-1/2" />
                    </CardContent>
                    <CardFooter>
                        <Skeleton className="h-6 w-1/4" />
                    </CardFooter>
                </Card>
            ))}
        </>
    );
};

export default MetricCardSkeleton;
