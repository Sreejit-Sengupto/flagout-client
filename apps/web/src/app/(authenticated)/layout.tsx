import { ReactNode } from "react";
import AppSidebar from "@/components/application/sidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dashboard | flagout (flag0ut)",
    description: "Manage your feature flags and experiments with flagout.",
    robots: {
        index: false,
        follow: false,
    },
    openGraph: {
        title: "flagout (flag0ut) | Smart Feature Flag Management",
        description:
            "flagout - Control your releases with AI-powered feature flags, rollout insights, and a centralized dashboard.",
        url: "https://flag0ut.vercel.app",
        siteName: "flagout",
        images: [
            {
                url: "https://flag0ut.vercel.app/f0_logo.png",
                width: 1200,
                height: 630,
                alt: "flagout (flag0ut) - Feature Flag Management Platform",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "flagout (flag0ut) | Smart Feature Flag Management",
        description:
            "flagout - AI-powered feature flag service. Optimize rollouts, run experiments, and control features with ease.",
        images: ["https://flag0ut.vercel.app/f0_logo.png"],
    },
};

// Routes are protected using middleware
// No checks are required here
const ProtectedLayout = async ({ children }: { children: ReactNode }) => {
    return <AppSidebar>{children}</AppSidebar>;
};

export default ProtectedLayout;
