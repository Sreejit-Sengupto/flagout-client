import type { Metadata } from "next";
import { Geist, Geist_Mono, Fira_Code, Bungee } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/theme-provider";
import NextTopLoader from "nextjs-toploader";
import { ClerkProvider } from "@clerk/nextjs";
import TanstackProvider from "@/context/tanstack-provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const firaCode = Fira_Code({
    variable: "--font-fira-code",
    subsets: ["latin"],
});

const bungee = Bungee({
    variable: "--font-bungee",
    weight: ["400"],
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "flagout (flag0ut) | Smart Feature Flag Management Platform",
    description:
        "flagout (flag0ut) - Manage, monitor, and optimize feature rollouts. AI-powered feature flag insights, percentage rollouts, role-based targeting, and a centralized admin panel for modern development teams.",
    keywords: [
        "flagout",
        "flag0ut",
        "flagout feature flags",
        "feature flags",
        "feature toggle",
        "feature flag management",
        "feature flag platform",
        "A/B testing",
        "progressive rollout",
        "AI feature management",
        "experimentation platform",
        "release management",
        "feature rollout",
        "feature toggle service",
    ],
    openGraph: {
        title: "flagout (flag0ut) | Smart Feature Flag Management",
        description:
            "flagout - Control your releases with AI-powered feature flags, rollout insights, and a centralized dashboard for modern teams.",
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
    alternates: {
        canonical: "https://flag0ut.vercel.app",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <ClerkProvider>
                <body
                    className={`${geistSans.variable} ${geistMono.variable} ${firaCode.variable} ${bungee.variable} antialiased`}
                >
                    <NextTopLoader showSpinner={false} />
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="dark"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <TanstackProvider>
                            {children}
                            <Toaster />
                        </TanstackProvider>
                    </ThemeProvider>
                </body>
            </ClerkProvider>
        </html>
    );
}
