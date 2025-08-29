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
    title: "flag0ut | Smart Feature Flag Management",
    description:
        "Manage, monitor, and optimize feature rollouts with flagout. AI-powered insights, percentage rollouts, role-based targeting, and a centralized admin panel.",
    keywords: [
        "feature flags",
        "feature toggle",
        "A/B testing",
        "progressive rollout",
        "AI feature management",
        "experimentation platform",
        "release management",
        "flagout",
    ],
    openGraph: {
        title: "flag0ut | Smart Feature Flag Management",
        description:
            "Control your releases with flagout — feature flags, AI-powered rollout insights, and a centralized dashboard.",
        url: "https://flag0ut.vercel.app",
        siteName: "flag0ut",
        images: [
            {
                url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPkNlFrZjnzTypfcUOGKkD8PLatlyiIgqOGg&s",
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
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPkNlFrZjnzTypfcUOGKkD8PLatlyiIgqOGg&s",
        ],
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
