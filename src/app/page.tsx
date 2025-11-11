import Control from "@/components/application/landing-page/control";
import Features from "@/components/application/landing-page/features";
import { Footer } from "@/components/application/landing-page/footer";
import Hero from "@/components/application/landing-page/hero";
import Navbar from "@/components/application/landing-page/navbar";
import PreFooter from "@/components/application/landing-page/pre-footer";
import StartShipping from "@/components/application/landing-page/start-shipping";
import WhatIsFlagout from "@/components/application/landing-page/what-is-flagout";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "flag0ut | Smart Feature Flag Management",
    description:
        "Manage, monitor, and optimize feature rollouts with flagout. AI-powered insights, percentage rollouts, role-based targeting, and a centralized admin panel.",
    openGraph: {
        title: "flag0ut | Smart Feature Flag Management",
        description:
            "Control your releases with flagout — feature flags, AI-powered rollout insights, and a centralized dashboard.",
        url: "https://flag0ut.vercel.app",
        siteName: "flag0ut",
        images: [
            {
                url: "https://flag0ut.vercel.app/f0_logo.png",
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
        images: ["https://flag0ut.vercel.app/f0_logo.png"],
    },
};

export default function Home() {
    return (
        <main className="flex flex-col min-h-[100dvh]">
            <Navbar />
            <section className="flex flex-col min-h-[100dvh]">
                <Hero />
            </section>
            <WhatIsFlagout />
            <StartShipping />
            <Control />
            <Features />
            {/* <FAQ /> */}
            <PreFooter />
            <Footer />
        </main>
    );
}
