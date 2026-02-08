import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

export default function PaginationBar({
    page,
    totalPages,
}: {
    page: number;
    totalPages: number;
}) {
    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    {page === 1 ? (
                        <span className="px-3 py-2 text-gray-400 cursor-not-allowed text-sm">
                            Previous
                        </span>
                    ) : (
                        <PaginationPrevious
                            href={`?page=${Math.max(page - 1, 1)}`}
                        />
                    )}
                </PaginationItem>

                {page > 2 && (
                    <PaginationItem>
                        <PaginationLink href="?page=1">1</PaginationLink>
                    </PaginationItem>
                )}

                {page > 3 && <PaginationEllipsis />}

                {page > 1 && (
                    <PaginationItem>
                        <PaginationLink href={`?page=${page - 1}`}>
                            {page - 1}
                        </PaginationLink>
                    </PaginationItem>
                )}

                <PaginationItem>
                    <PaginationLink href={`?page=${page}`} isActive>
                        {page}
                    </PaginationLink>
                </PaginationItem>

                {page < totalPages && (
                    <PaginationItem>
                        <PaginationLink href={`?page=${page + 1}`}>
                            {page + 1}
                        </PaginationLink>
                    </PaginationItem>
                )}

                {page < totalPages - 1 && (
                    <PaginationItem>
                        <PaginationLink href={`?page=${page + 2}`}>
                            {page + 2}
                        </PaginationLink>
                    </PaginationItem>
                )}

                {page < totalPages - 2 && <PaginationEllipsis />}

                <PaginationItem>
                    {page === totalPages ? (
                        <span className="px-3 py-2 text-gray-400 cursor-not-allowed text-sm">
                            Next
                        </span>
                    ) : (
                        <PaginationNext href={`?page=${page + 1}`} />
                    )}
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
