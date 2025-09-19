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
import { showError, showSuccess } from "@/lib/sonner";
import { useUser } from "@clerk/nextjs";
import { useReverification } from "@clerk/nextjs";
import { reverifyUser } from "@/app/actions/revalidate-user.action";
import { Eye, EyeClosed, Loader2 } from "lucide-react";
import { useState } from "react";

const ChangePassword = () => {
    const [passwords, setPasswords] = useState({
        // oldPassword: "",
        newPassword: "",
    });
    const [showPassword, setShowPassword] = useState({
        // showOldPass: false,
        showNewPass: false,
    });
    const [loader, setLoader] = useState(false);

    const { isLoaded, user } = useUser();

    // This is still in public BETA fallback
    const performAction = useReverification(reverifyUser);

    if (!isLoaded) {
        return <Loader2 className="animate-spin" />;
    }

    const handleChangePassword = async () => {
        setLoader(true);
        try {
            const res = await performAction();
            if (!res.success) {
                showError("Verification Failed!");
                return;
            }

            await user?.updatePassword({
                newPassword: passwords.newPassword,
                // currentPassword: passwords.oldPassword,
                signOutOfOtherSessions: false,
            });
            showSuccess("Password updated");
        } catch (error) {
            if (error instanceof Error) {
                showError(error.message as string);
            }
        } finally {
            setLoader(false);
        }
    };

    return (
        <Dialog>
            <form>
                <DialogTrigger asChild>
                    <Button className="min-w-44 cursor-pointer ml-auto lg:ml-0 lg:mt-0">
                        {user?.passwordEnabled
                            ? "Change Password"
                            : "Add Password"}
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>
                            {user?.passwordEnabled ? "Update" : "Add"} your
                            password
                        </DialogTitle>
                        <DialogDescription>
                            {user?.passwordEnabled
                                ? "Change your password to a new one."
                                : "Add a password to your account"}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        {/* <div className="grid gap-3 relative">
                            <Label htmlFor="old--password">Old Password</Label>
                            <Input
                                id="old--password"
                                value={passwords.oldPassword}
                                onChange={(e) =>
                                    setPasswords((prev) => ({
                                        ...prev,
                                        oldPassword: e.target.value,
                                    }))
                                }
                                type={
                                    showPassword.showOldPass
                                        ? "text"
                                        : "password"
                                }
                            />
                            <button
                                onClick={() =>
                                    setShowPassword((prev) => ({
                                        ...prev,
                                        showOldPass: !prev.showOldPass,
                                    }))
                                }
                                className="absolute right-2 top-[55%]"
                            >
                                {showPassword.showOldPass ? (
                                    <Eye
                                        className="cursor-pointer"
                                        color="gray"
                                        size={20}
                                    />
                                ) : (
                                    <EyeClosed
                                        className="cursor-pointer"
                                        color="gray"
                                        size={20}
                                    />
                                )}
                            </button>
                        </div> */}
                        <div className="grid gap-3 relative">
                            <Label htmlFor="new--password">New Password</Label>
                            <Input
                                id="new--password"
                                value={passwords.newPassword}
                                onChange={(e) =>
                                    setPasswords((prev) => ({
                                        ...prev,
                                        newPassword: e.target.value,
                                    }))
                                }
                                type={
                                    showPassword.showNewPass
                                        ? "text"
                                        : "password"
                                }
                            />
                            <button
                                onClick={() =>
                                    setShowPassword((prev) => ({
                                        ...prev,
                                        showNewPass: !prev.showNewPass,
                                    }))
                                }
                                className="absolute right-2 top-[55%]"
                            >
                                {showPassword.showNewPass ? (
                                    <Eye
                                        className="cursor-pointer"
                                        color="gray"
                                        size={20}
                                    />
                                ) : (
                                    <EyeClosed
                                        className="cursor-pointer"
                                        color="gray"
                                        size={20}
                                    />
                                )}
                            </button>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            onClick={handleChangePassword}
                            className="cursor-pointer"
                            disabled={loader}
                        >
                            {loader ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                "Save changes"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    );
};

export default ChangePassword;
