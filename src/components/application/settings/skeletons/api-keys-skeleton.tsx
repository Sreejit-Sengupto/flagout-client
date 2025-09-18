import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

const APIKeysSkeleton = () => {
    return (
        <Table>
            <TableCaption>Loading API Keys...</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>
                        <Skeleton className="h-6 w-24" />
                    </TableHead>
                    <TableHead>
                        <Skeleton className="h-6 w-24" />
                    </TableHead>
                    <TableHead>
                        <Skeleton className="h-6 w-24" />
                    </TableHead>
                    <TableHead className="text-right">
                        <Skeleton className="h-6 w-24 ml-auto" />
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {[...Array(3)].map((_, index) => (
                    <TableRow key={index}>
                        <TableCell>
                            <Skeleton className="h-5 w-32" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-5 w-40" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-5 w-24" />
                        </TableCell>
                        <TableCell className="text-right flex justify-end items-center gap-1">
                            <Skeleton className="h-10 w-20" />
                            <Skeleton className="h-10 w-20" />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default APIKeysSkeleton;
