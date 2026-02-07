"use client";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import Logo from "../logo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeClosed, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth, useSignIn } from "@clerk/nextjs";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { useRouter } from "next/navigation";
import { showError, showSuccess, showWarning } from "@/lib/sonner";

const ResetPasswordForm = () => {
    // states
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [code, setCode] = useState("");
    const [successfulCreation, setSuccessfulCreation] = useState(false);
    const [secondFactor, setSecondFactor] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [cooldown, setCooldown] = useState(60);
    const [loaders, setLoaders] = useState({
        createLoader: false,
        resetLoader: false,
    });

    // hooks
    const router = useRouter();
    const { isSignedIn } = useAuth();
    const { isLoaded, signIn, setActive } = useSignIn();

    useEffect(() => {
        if (isSignedIn) {
            router.push("/");
        }
    }, [isSignedIn, router]);

    useEffect(() => {
        if (cooldown <= 0) {
            return;
        }
        const timer = setInterval(() => {
            setCooldown((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [cooldown]);

    if (!isLoaded) {
        return null;
    }

    async function create(e: React.FormEvent) {
        e.preventDefault();
        if (!email) {
            showWarning("Email is required");
            return;
        }
        setLoaders((prev) => ({ ...prev, createLoader: true }));
        await signIn
            ?.create({
                strategy: "reset_password_email_code",
                identifier: email,
            })
            .then(() => {
                setSuccessfulCreation(true);
                showSuccess("Code sent to your E-mail");
                setError("");
            })
            .catch((err) => {
                console.error("error", err.errors[0].longMessage);
                setError(err.errors[0].longMessage);
                showError(err.errors[0].longMessage);
            })
            .finally(() =>
                setLoaders((prev) => ({ ...prev, createLoader: false })),
            );
    }

    // Reset the user's password.
    // Upon successful reset, the user will be
    // signed in and redirected to the home page
    async function reset(e: React.FormEvent) {
        e.preventDefault();
        setLoaders((prev) => ({ ...prev, resetLoader: true }));
        await signIn
            ?.attemptFirstFactor({
                strategy: "reset_password_email_code",
                code,
                password,
            })
            .then((result) => {
                // Check if 2FA is required
                if (result.status === "needs_second_factor") {
                    setSecondFactor(true);
                    setError("");
                } else if (result.status === "complete") {
                    // Set the active session to
                    // the newly created session (user is now signed in)
                    setActive({
                        session: result.createdSessionId,
                        navigate: async ({ session }) => {
                            if (session?.currentTask) {
                                // Check for tasks and navigate to custom UI to help users resolve them
                                // See https://clerk.com/docs/custom-flows/overview#session-tasks
                                console.log(session?.currentTask);
                                return;
                            }

                            router.push("/workplace");
                        },
                    });
                    showSuccess("Password reset success. Go to Dashboard!");
                    setError("");
                } else {
                    console.log(result);
                }
            })
            .catch((err) => {
                console.error("error", err.errors[0].longMessage);
                setError(err.errors[0].longMessage);
                showError(err.errors[0].longMessage);
            })
            .finally(() =>
                setLoaders((prev) => ({ ...prev, resetLoader: false })),
            );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex flex-col lg:flex-row text-center justify-center items-center gap-3 text-2xl text-wrap">
                    <span>Reset your password</span>
                    <span>
                        <Logo textClasses="text-2xl" hideLogo />
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={!successfulCreation ? create : reset}>
                    {!successfulCreation && (
                        <div className="flex flex-col justify-center items-center gap-6">
                            <div className="w-full space-y-2">
                                <Label htmlFor="email">
                                    Provide your email address
                                </Label>
                                <Input
                                    type="email"
                                    placeholder="e.g john@doe.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <Button
                                className="cursor-pointer"
                                disabled={loaders.createLoader}
                            >
                                {loaders.createLoader ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    "Send password reset code"
                                )}
                            </Button>
                            {error && <p>{error}</p>}
                        </div>
                    )}

                    {successfulCreation && (
                        <div className="flex flex-col justify-center items-center gap-6">
                            <div className="relative w-full space-y-2">
                                <Label htmlFor="password">
                                    Enter your new password
                                </Label>
                                <Input
                                    placeholder="ssshhhhh....."
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => {
                                        e.preventDefault();
                                        setPassword(e.target.value);
                                    }}
                                    required
                                />
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setShowPassword((prev) => !prev);
                                    }}
                                    className="absolute right-2 top-1/2 "
                                >
                                    {showPassword ? (
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

                            <div className="w-full space-y-2">
                                <Label htmlFor="code">
                                    Enter the password reset code that was sent
                                    to your email
                                </Label>
                                <InputOTP
                                    maxLength={6}
                                    value={code}
                                    onChange={setCode}
                                >
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0} />
                                        <InputOTPSlot index={1} />
                                        <InputOTPSlot index={2} />
                                        <InputOTPSlot index={3} />
                                        <InputOTPSlot index={4} />
                                        <InputOTPSlot index={5} />
                                    </InputOTPGroup>
                                </InputOTP>
                            </div>
                            <Button
                                className="w-full cursor-pointer"
                                disabled={loaders.resetLoader}
                            >
                                {loaders.resetLoader ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    "Reset"
                                )}
                            </Button>
                            <Button
                                variant={"outline"}
                                className="mx-auto cursor-pointer"
                                disabled={cooldown > 0 || loaders.resetLoader}
                                onClick={(e) => {
                                    e.preventDefault();
                                    create(e);
                                    setCooldown(60);
                                }}
                            >
                                {cooldown > 0 ? (
                                    `Resend verification code in ${cooldown}`
                                ) : loaders.resetLoader ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    "Resend verification code"
                                )}
                            </Button>
                            {error && <p>{error}</p>}
                        </div>
                    )}

                    {secondFactor && (
                        <p>2FA is required, but this UI does not handle that</p>
                    )}
                </form>
            </CardContent>

            <CardFooter className="flex flex-col gap-2 justify-center items-center">
                <section className="my-4">
                    <Link href="/login" className="text-blue-400">
                        Back to login
                    </Link>
                </section>
            </CardFooter>
        </Card>
    );
};

export default ResetPasswordForm;
