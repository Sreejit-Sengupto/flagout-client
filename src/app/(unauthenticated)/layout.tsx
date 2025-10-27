import Logo from "@/components/application/logo";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import React, { ReactNode } from "react";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Authentication | flag0ut",
    description: "Login or register to start managing your feature flags.",
    robots: {
        index: false,
        follow: false,
    },
    openGraph: {
        title: "flag0ut | Smart Feature Flag Management",
        description:
            "Control your releases with flagout — feature flags, AI-powered rollout insights, and a centralized dashboard.",
        url: "https://flag0ut.vercel.app",
        siteName: "flag0ut",
        images: [
            {
                url: "https://asset.cloudinary.com/dagn8yyfi/0ce7ee5d3c73ef1298ae591e091d52a4",
                width: 1200,
                height: 630,
                alt: "flag0ut Feature Flags Dashboard Preview",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "flag0ut | Smart Feature Flag Management",
        description:
            "AI-powered feature flag service. Optimize rollouts, run experiments, and control features with ease.",
        images: [
            "https://asset.cloudinary.com/dagn8yyfi/0ce7ee5d3c73ef1298ae591e091d52a4",
        ],
    },
};

const UnauthenticatedLayout = async ({ children }: { children: ReactNode }) => {
    const { isAuthenticated } = await auth();
    if (isAuthenticated) {
        redirect("/workplace");
    }
    return (
        <section className="w-full h-[100dvh] flex flex-col">
            <Link href={"/"} className="p-5">
                <Logo />
            </Link>
            <div className="my-auto">{children}</div>
        </section>
    );
};

export default UnauthenticatedLayout;
