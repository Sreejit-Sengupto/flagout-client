"use client";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateAPIKey } from "@/lib/tanstack/hooks/api-key";
import { Loader2, PlusCircle } from "lucide-react";
import React, { useState } from "react";

const CreateKey = () => {
    const [keyName, setKeyName] = useState("");
    const [createDialog, setCreateDialog] = useState<boolean>(false);
    const [showKeyDialog, setShowKeyDialog] = useState<boolean>(false);
    console.log("Show key", showKeyDialog);

    const [keyDetails, setKeyDetails] = useState({
        name: "",
        key: "",
        copied: false,
    });

    const createAPIKeyMutation = useCreateAPIKey();
    const handleCreateAPIKey = async () => {
        try {
            const result = await createAPIKeyMutation.mutateAsync(keyName);
            if (result.data) {
                setShowKeyDialog(true);
                setKeyDetails({
                    name: result.data.name,
                    key: result.data.key,
                    copied: false,
                });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setCreateDialog(false);
            setKeyName("");
        }
    };

    if (showKeyDialog) {
        return (
            <div className="w-full">
                <Dialog open={showKeyDialog} onOpenChange={setShowKeyDialog}>
                    <DialogContent className="sm:max-w-[725px]">
                        <DialogHeader>
                            <DialogTitle>Your API Key</DialogTitle>
                            <DialogDescription>
                                Make sure to copy the API key, you won&apos;t be able
                                to see it again.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4">
                            <div className="grid gap-3">
                                <p className="scroll-m-20 text-xl font-semibold tracking-tight">
                                    {keyDetails.name}
                                </p>
                            </div>
                            <div className="grid gap-3">
                                <p>{keyDetails.key}</p>
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button
                                    variant="destructive"
                                    className="cursor-pointer"
                                >
                                    Close
                                </Button>
                            </DialogClose>
                            <Button
                                type="submit"
                                className="cursor-pointer"
                                onClick={() => {
                                    navigator.clipboard.writeText(
                                        keyDetails.key,
                                    );
                                    setKeyDetails({
                                        ...keyDetails,
                                        copied: true,
                                    });
                                }}
                            >
                                {keyDetails.copied ? "Copied!" : "Copy"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }

    return (
        <Dialog open={createDialog} onOpenChange={setCreateDialog}>
            <form onSubmit={handleCreateAPIKey}>
                <DialogTrigger asChild>
                    <Button variant="default" className="cursor-pointer">
                        <PlusCircle />
                        <p>Create</p>
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Create an API Key</DialogTitle>
                        <DialogDescription>
                            Please provide a name for your API key. This will
                            help you identify and manage your keys.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="name-1">Name</Label>
                            <Input
                                id="name-1"
                                name="name"
                                value={keyName}
                                onChange={(e) => {
                                    e.preventDefault();
                                    setKeyName(e.target.value);
                                }}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button
                                variant="outline"
                                className="cursor-pointer"
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            className="cursor-pointer"
                            disabled={
                                !keyName || createAPIKeyMutation.isPending
                            }
                            onClick={handleCreateAPIKey}
                        >
                            {createAPIKeyMutation.isPending ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                "Create API Key"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    );
};

export default CreateKey;
