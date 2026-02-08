import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const DemoDashboard = () => {
    return (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-background p-4">
            <div className="grid gap-4 w-full">
                <div className="grid md:grid-cols-2 gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Flags</CardTitle>
                            <CardDescription>
                                Total number of feature flags.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="w-1/2 h-8" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Active Flags</CardTitle>
                            <CardDescription>
                                Number of currently active flags.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="w-1/2 h-8" />
                        </CardContent>
                    </Card>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>
                            Recent activities in your workplace.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Skeleton className="w-full h-8" />
                            <Skeleton className="w-full h-8" />
                            <Skeleton className="w-2/3 h-8" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DemoDashboard;
