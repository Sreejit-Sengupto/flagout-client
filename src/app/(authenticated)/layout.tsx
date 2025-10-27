import { ReactNode } from "react";
import AppSidebar from "@/components/application/sidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dashboard | flag0ut",
    description: "Manage your feature flags and experiments.",
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
                url: "https://flagout.app/f0_logo.png",
                width: 1200,
                height: 630,
                alt: "flag0ut Logo",
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
        images: ["https://flagout.app/f0_logo.png"],
    },
};

// Routes are protected using middleware
// No checks are required here
const ProtectedLayout = async ({ children }: { children: ReactNode }) => {
    return <AppSidebar>{children}</AppSidebar>;
};

export default ProtectedLayout;
