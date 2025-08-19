"use client";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
    IconBrandTabler,
    IconUserBolt,
    IconSettings,
    IconArrowLeft,
} from "@tabler/icons-react";
import { Flag } from "lucide-react";
import { motion } from "motion/react";
import { Pixelify_Sans } from "next/font/google";
import { redirect } from "next/navigation";
import React, { ReactNode, useState } from "react";

const pixelSans = Pixelify_Sans({
    variable: "--font-pixel-sans",
    weight: ["400"],
    subsets: ["latin"],
});

const ProtectedLayout = ({ children }: { children: ReactNode }) => {
    const links = [
        {
            label: "Dashboard",
            href: "/workplace",
            icon: (
                <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
        },
        {
            label: "Profile",
            href: "/profile",
            icon: (
                <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
        },
        {
            label: "Settings",
            href: "/settings",
            icon: (
                <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
        },
        {
            label: "Logout",
            href: "#",
            icon: (
                <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
        },
    ];
    const user = true;
    if (!user) {
        redirect("/");
    }
    const [open, setOpen] = useState(false);
    return (
        <div
            className={cn(
                "mx-auto flex w-full flex-1 flex-col overflow-hidden bg-primary-foreground md:flex-row dark:bg-primary-foreground",
                "h-[100dvh]", // for your use case, use `h-screen` instead of `h-[60vh]`
            )}
        >
            <Sidebar open={open} setOpen={setOpen}>
                <SidebarBody className="justify-between gap-10">
                    <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
                        {open ? <Logo /> : <LogoIcon />}
                        <div className="mt-8 flex flex-col gap-2">
                            {links.map((link, idx) => (
                                <SidebarLink key={idx} link={link} />
                            ))}
                        </div>
                    </div>
                    <div>
                        <SidebarLink
                            link={{
                                label: "Manu Arora",
                                href: "#",
                                icon: (
                                    <img
                                        src="https://assets.aceternity.com/manu.png"
                                        className="h-7 w-7 shrink-0 rounded-full"
                                        width={50}
                                        height={50}
                                        alt="Avatar"
                                    />
                                ),
                            }}
                        />
                    </div>
                </SidebarBody>
            </Sidebar>
            {children}
        </div>
    );
};

export const Logo = () => {
    return (
        <a href="#" className="flex items-center gap-x-2">
            <p className={`${pixelSans.className}`}>
                <span className="">
                    <Flag fill="white" className="w-6 h-6" />
                </span>
                {/* <span className="scroll-m-20 text-center text-xl font-extrabold tracking-tight text-balance">f0</span> */}
            </p>
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`${pixelSans.className} scroll-m-20 text-center text-xl font-extrabold tracking-tight text-balance h-6`}
            >
                flag0ut
            </motion.span>
        </a>
    );
};
export const LogoIcon = () => {
    return (
        <p className={`${pixelSans.className}`}>
            <span className="">
                <Flag fill="white" className="w-6 h-6" />
            </span>
            {/* <span className="scroll-m-20 text-center text-xl font-extrabold tracking-tight text-balance">f0</span> */}
        </p>
    );
};

export default ProtectedLayout;
