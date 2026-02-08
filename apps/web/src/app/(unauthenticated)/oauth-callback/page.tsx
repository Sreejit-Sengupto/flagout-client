"use client";

import { useSignIn } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Loader2 } from "lucide-react";

function OAuthCallbackContent() {
    const { signIn, setActive, isLoaded } = useSignIn();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isLoaded) return;

        const ticket = searchParams.get("__clerk_ticket");
        const errorParam = searchParams.get("error");

        if (errorParam) {
            setError(`Authentication failed: ${errorParam}`);
            return;
        }

        if (ticket) {
            // Handle sign-in token from our custom OAuth flow
            signIn
                .create({
                    strategy: "ticket",
                    ticket,
                })
                .then((result) => {
                    if (result.status === "complete") {
                        setActive({ session: result.createdSessionId });
                        router.replace("/workplace");
                    }
                })
                .catch((err) => {
                    console.error("Sign-in error:", err);
                    setError("Failed to complete sign-in");
                });
        } else {
            // No ticket - might be using Clerk's native OAuth (fallback)
            // The AuthenticateWithRedirectCallback handles this case
        }
    }, [isLoaded, searchParams, signIn, setActive, router]);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
                <p className="text-red-500">{error}</p>
                <a href="/login" className="text-blue-400 underline">
                    Return to login
                </a>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <Loader2 className="animate-spin h-8 w-8" />
        </div>
    );
}

export default function OAuthCallbackPage() {
    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center min-h-[50vh]">
                    <Loader2 className="animate-spin h-8 w-8" />
                </div>
            }
        >
            <OAuthCallbackContent />
        </Suspense>
    );
}
