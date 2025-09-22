"use client";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import React, { FormEvent, useEffect, useMemo, useState } from "react";
import Logo from "../logo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeClosed, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiGithub, SiGoogle } from "@icons-pack/react-simple-icons";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useSignUp, useSignIn } from "@clerk/nextjs";
import { OAuthStrategy } from "@clerk/types";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { useRouter } from "next/navigation";

interface TAuthForm {
    type: "login" | "register";
}

const AuthenticationForm: React.FC<TAuthForm> = ({ type }) => {
    // states
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [verificationPending, setVerificationPending] =
        useState<boolean>(false);
    const [cooldown, setCooldown] = useState(60);
    const [authForm, setAuthForm] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
    });
    const [verificationCode, setVerificationCode] = useState<string>("");
    const [loaders, setLoaders] = useState({
        authLoader: false,
        verifyBtnLoader: false,
        resendCodeLoader: false,
    });

    // memos
    const cardTitle = useMemo(
        () =>
            type === "login"
                ? "Welcome back to"
                : "We are excited to have you on",
        [type],
    );
    const buttonText = useMemo(
        () => (type === "login" ? "Login" : "Register"),
        [type],
    );
    const footerText = useMemo(
        () =>
            type === "login"
                ? "No account? Sign up now"
                : "Have an account? Login",
        [type],
    );
    const redirectLink = useMemo(
        () => (type === "login" ? "/register" : "/login"),
        [type],
    );
    // const signUpBtnDisabled = useMemo(() => {
    //     const { email, password, firstname, lastname } = authForm;
    //     if (email.length === 0 || password.length === 0) {
    //         return false;
    //     }
    //     if (type === "register" && !firstname || !lastname) {
    //         return false;
    //     }
    //     return true;
    // }, [authForm]);

    // hooks
    const { isLoaded, setActive, signUp } = useSignUp();
    const {
        isLoaded: signInLoaded,
        setActive: setSigInActive,
        signIn,
    } = useSignIn();
    const router = useRouter();

    useEffect(() => {
        if (cooldown <= 0) {
            return;
        }
        const timer = setInterval(() => {
            setCooldown((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [cooldown]);

    if (!isLoaded || !signInLoaded) {
        return <Loader2 className="animate-spin text-center mx-auto" />;
    }

    // methods and handlers
    const toggleShowPassword = (e: FormEvent) => {
        e.preventDefault();
        setShowPassword((prev) => !prev);
    };

    const handleAuthentication = async (e: FormEvent) => {
        setLoaders((prev) => ({ ...prev, authLoader: true }));
        try {
            e.preventDefault();
            if (type === "register") {
                await signUp.create({
                    firstName: authForm.firstname,
                    lastName: authForm.lastname,
                    emailAddress: authForm.email,
                    password: authForm.password,
                });
                await signUp.prepareEmailAddressVerification({
                    strategy: "email_code",
                });
                setVerificationPending(true);
            } else {
                const result = await signIn.create({
                    identifier: authForm.email,
                    password: authForm.password,
                });
                if (result.status === "complete") {
                    await setSigInActive({ session: result.createdSessionId });
                    // router.replace()
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoaders((prev) => ({ ...prev, signUpLoader: false }));
        }
    };

    const handleSignInWithOAuth = async (strategy: OAuthStrategy) => {
        setLoaders((prev) => ({ ...prev, authLoader: true }));
        try {
            return signIn.authenticateWithRedirect({
                strategy,
                redirectUrl: "/oauth-callback",
                redirectUrlComplete: "/workplace",
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleCodeVerification = async (e: FormEvent) => {
        setLoaders((prev) => ({ ...prev, verifyBtnLoader: true }));
        try {
            e.preventDefault();
            const result = await signUp.attemptEmailAddressVerification({
                code: verificationCode,
            });
            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId });
            }
            router.replace("/workplace");
        } catch (error) {
            console.error(error);
        } finally {
            setLoaders((prev) => ({ ...prev, verifyBtnLoader: false }));
        }
    };

    const handleResendVerificationCode = async () => {
        setLoaders((prev) => ({ ...prev, resendCodeLoader: true }));
        try {
            if (cooldown > 0) {
                return;
            }
            await signUp.prepareEmailAddressVerification({
                strategy: "email_code",
            });
            setCooldown(60);
        } catch (error) {
            console.error(error);
        } finally {
            setLoaders((prev) => ({ ...prev, resendCodeLoader: false }));
        }
    };

    return !verificationPending ? (
        <Card>
            <CardHeader>
                <CardTitle className="flex flex-col lg:flex-row text-center justify-center items-center gap-3 text-2xl text-wrap">
                    <span>{cardTitle}</span>
                    <span>
                        <Logo textClasses="text-2xl" hideLogo />
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleAuthentication}>
                    {type === "register" && (
                        <div className="flex justify-center items-center gap-2">
                            <div className="w-full">
                                <Label className="mb-1">First name</Label>
                                <Input
                                    placeholder="Krishna"
                                    value={authForm.firstname}
                                    onChange={(e) =>
                                        setAuthForm((prev) => ({
                                            ...prev,
                                            firstname: e.target.value,
                                        }))
                                    }
                                    required={type === "register"}
                                />
                            </div>

                            <div className="w-full">
                                <Label className="mb-1">Last name</Label>
                                <Input
                                    placeholder="Vasudev"
                                    value={authForm.lastname}
                                    onChange={(e) =>
                                        setAuthForm((prev) => ({
                                            ...prev,
                                            lastname: e.target.value,
                                        }))
                                    }
                                    required={type === "register"}
                                />
                            </div>
                        </div>
                    )}

                    <div className="w-full my-4">
                        <Label className="mb-1">E-mail</Label>
                        <Input
                            placeholder="sreesen@gmail.com"
                            value={authForm.email}
                            onChange={(e) =>
                                setAuthForm((prev) => ({
                                    ...prev,
                                    email: e.target.value,
                                }))
                            }
                            type="email"
                            required
                        />
                    </div>

                    <div className="w-full my-4 relative">
                        <Label className="mb-1">Password</Label>
                        <Input
                            placeholder="ssshhhhh....."
                            type={showPassword ? "text" : "password"}
                            value={authForm.password}
                            onChange={(e) =>
                                setAuthForm((prev) => ({
                                    ...prev,
                                    password: e.target.value,
                                }))
                            }
                            required
                        />
                        <button
                            onClick={toggleShowPassword}
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

                    <Button
                        type="submit"
                        className="w-full cursor-pointer"
                        // onClick={handleSignUp}
                        disabled={loaders.authLoader}
                    >
                        {loaders.authLoader ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            buttonText
                        )}
                    </Button>

                    {type === "register" && (
                        <div
                            id="clerk-captcha"
                            className="w-full justify-center items-center mt-4"
                        ></div>
                    )}
                </form>
            </CardContent>

            <section className="flex justify-center items-center gap-2 overflow-hidden">
                <Separator />
                <p>OR</p>
                <Separator />
            </section>

            <CardFooter className="flex flex-col gap-2 justify-center items-center">
                <section className="w-full flex flex-col justify-center items-center gap-2">
                    {process.env.NODE_ENV === "development" && (
                        <>
                            <Button
                                className="w-full cursor-pointer text-lg"
                                variant={"secondary"}
                                onClick={() =>
                                    handleSignInWithOAuth("oauth_google")
                                }
                                asChild
                            >
                                <p className="flex justify-center items-center gap-1">
                                    <span>
                                        <SiGoogle />
                                    </span>
                                    <span>Google</span>
                                </p>
                            </Button>
                            <Button
                                className="w-full cursor-pointer text-lg"
                                variant={"secondary"}
                                onClick={() =>
                                    handleSignInWithOAuth("oauth_github")
                                }
                                asChild
                            >
                                <p className="flex justify-center items-center gap-1">
                                    <span>
                                        <SiGithub />
                                    </span>
                                    <span>Github</span>
                                </p>
                            </Button>
                        </>
                    )}
                    {process.env.NODE_ENV === "production" && (
                        <>
                            <Button
                                className="w-full cursor-pointer text-lg"
                                variant={"secondary"}
                                disabled
                                asChild
                            >
                                <p className="flex justify-center items-center gap-1">
                                    <span>
                                        <SiGoogle />
                                    </span>
                                    <span>Google &#40;Coming Soon&#41;</span>
                                </p>
                            </Button>
                            <Button
                                className="w-full cursor-pointer text-lg"
                                variant={"secondary"}
                                asChild
                            >
                                <p className="flex justify-center items-center gap-1">
                                    <span>
                                        <SiGithub />
                                    </span>
                                    <span>Github &#40;Coming Soon&#41;</span>
                                </p>
                            </Button>
                        </>
                    )}
                </section>

                <section className="my-4 flex flex-col gap-2 justify-center items-center">
                    <Link href={redirectLink} className="text-blue-400">
                        {footerText}
                    </Link>
                    {type === 'login' && <Link href={'/reset-password'} className="text-blue-200">
                        Forgot Password?
                    </Link>}
                </section>
            </CardFooter>
        </Card>
    ) : (
        <Card>
            <CardHeader>
                <CardTitle className="flex flex-col lg:flex-row text-center justify-center items-center gap-3 text-2xl text-wrap">
                    Enter verification Code
                </CardTitle>
                <CardDescription className="text-center">
                    Enter the code sent to {authForm.email}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col justify-center items-center gap-3">
                <InputOTP
                    maxLength={6}
                    value={verificationCode}
                    onChange={setVerificationCode}
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
                <Button
                    className="cursor-pointer"
                    disabled={
                        verificationCode.length < 6 || loaders.verifyBtnLoader
                    }
                    onClick={handleCodeVerification}
                >
                    {loaders.verifyBtnLoader ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        "Verify"
                    )}
                </Button>
            </CardContent>
            <CardFooter>
                <Button
                    variant={"outline"}
                    className="mx-auto cursor-pointer"
                    disabled={cooldown > 0}
                    onClick={handleResendVerificationCode}
                >
                    {cooldown > 0 ? (
                        `Resend verification code in ${cooldown}`
                    ) : loaders.resendCodeLoader ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        "Resend verification code"
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
};

export default AuthenticationForm;
