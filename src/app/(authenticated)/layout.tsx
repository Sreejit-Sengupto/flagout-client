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

// Routes are protected using middleware
// No checks are required here
const ProtectedLayout = async ({ children }: { children: ReactNode }) => {
    return <AppSidebar>{children}</AppSidebar>;
};

export default ProtectedLayout;
