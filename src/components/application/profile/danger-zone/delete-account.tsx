"use client";
import { reverifyUser } from "@/app/actions/revalidate-user.action";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { showError, showSuccess } from "@/lib/sonner";
import { useReverification, useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const DeleteAccount = () => {
    const [loading, setLoading] = useState(false);

    const { isLoaded, user } = useUser();
    const router = useRouter();
    const performAction = useReverification(reverifyUser);

    if (!isLoaded) {
        return <Loader2 className="animate-spin" />;
    }

    const handleAccountDelete = async () => {
        setLoading(true);
        try {
            const res = await performAction();
            if (!res.success) {
                showError("Verification Failed!");
                return;
            }
            await user?.delete();
            showSuccess("Account Deleted");
            router.replace("/");
        } catch (error) {
            if (error instanceof Error) {
                showError(error.message);
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <Dialog>
            <form>
                <DialogTrigger asChild>
                    <Button
                        variant={"destructive"}
                        className="min-w-44 cursor-pointer ml-auto lg:ml-0 mt-4 lg:mt-0"
                    >
                        Delete Account
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Delete your account</DialogTitle>
                        <DialogDescription>
                            Are you absolutely sure? All data will be lost.
                        </DialogDescription>
                    </DialogHeader>
                    {/* <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="name-1">Name</Label>
                            <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="username-1">Username</Label>
                            <Input id="username-1" name="username" defaultValue="@peduarte" />
                        </div>
                    </div> */}
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            variant={"destructive"}
                            className="cursor-pointer"
                            disabled={loading}
                            onClick={handleAccountDelete}
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                "Delete account"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    );
};

export default DeleteAccount;
