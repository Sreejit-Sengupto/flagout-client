"use client";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formatDate, timeAgo } from "@/lib/time-date";
import EmptyState from "../../emtpy-state";
import { KeyIcon, Loader2 } from "lucide-react";
import {
    useDeleteAPIKey,
    useQueryAPIKeys,
    useRevokeAPIKey,
} from "@/lib/tanstack/hooks/api-key";

export function AllKeys() {
    const { data: apiKeys, isLoading } = useQueryAPIKeys();
    const revokeKeyMutation = useRevokeAPIKey();
    const deleteKeyMutation = useDeleteAPIKey();

    const handleDeleteAPIKey = async (id: string) => {
        try {
            await deleteKeyMutation.mutateAsync(id);
        } catch (error) {
            console.error(error);
        }
    };

    const handleRevokeAPIKey = async (id: string, revoke: boolean) => {
        try {
            await revokeKeyMutation.mutateAsync({ id, revoke });
        } catch (error) {
            throw error;
        }
    };

    return isLoading ? (
        <Loader2 className="animate-spin" />
    ) : apiKeys && apiKeys.data.length <= 0 ? (
        <EmptyState
            icon={<KeyIcon size={32} />}
            title="No API Keys"
            description="You have not created any API keys yet"
        />
    ) : (
        <Table>
            <TableCaption>A list of all your API Keys.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="scroll-m-20 text-xl font-semibold tracking-tight">
                        Name
                    </TableHead>
                    <TableHead className="scroll-m-20 text-xl font-semibold tracking-tight">
                        Created at
                    </TableHead>
                    <TableHead className="scroll-m-20 text-xl font-semibold tracking-tight">
                        Last used
                    </TableHead>
                    <TableHead className="text-right scroll-m-20 text-xl font-semibold tracking-tight">
                        Actions
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {apiKeys?.data.map((key) => (
                    <TableRow key={key.id}>
                        <TableCell className="font-medium">
                            {key.name}
                        </TableCell>
                        <TableCell>
                            {formatDate(new Date(key.createdAt))}
                        </TableCell>
                        <TableCell>
                            {key.lastUsed
                                ? timeAgo(key.lastUsed)
                                : "Not used yet"}
                        </TableCell>
                        <TableCell className="text-right flex justify-end items-center gap-1">
                            <Button
                                variant={key.revoked ? "outline" : "secondary"}
                                className="cursor-pointer"
                                onClick={() =>
                                    handleRevokeAPIKey(key.id, !key.revoked)
                                }
                                disabled={
                                    (revokeKeyMutation.variables?.id ===
                                        key.id &&
                                        revokeKeyMutation.isPending) ||
                                    deleteKeyMutation.isPending
                                }
                            >
                                {revokeKeyMutation.isPending ? (
                                    <Loader2 className="animate-spin" />
                                ) : key.revoked ? (
                                    "Revoked"
                                ) : (
                                    "Revoke"
                                )}
                            </Button>
                            <Button
                                variant={"destructive"}
                                className="cursor-pointer"
                                onClick={() => handleDeleteAPIKey(key.id)}
                                disabled={
                                    deleteKeyMutation.variables === key.id &&
                                    deleteKeyMutation.isPending
                                }
                            >
                                {deleteKeyMutation.variables === key.id &&
                                    deleteKeyMutation.isPending ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    "Delete"
                                )}
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
