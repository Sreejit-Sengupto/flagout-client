"use client";
import React, { ReactNode, useState } from "react";
import {
    Sidebar,
    SidebarBody,
    SidebarButton,
    SidebarLink,
} from "../ui/sidebar";
import { Pixelify_Sans } from "next/font/google";
import {
    IconArrowLeft,
    IconBrandTabler,
    IconLogout,
    IconSettings,
    IconUserBolt,
} from "@tabler/icons-react";
import { Flag, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useClerk, useUser } from "@clerk/nextjs";
import { showSuccess } from "@/lib/sonner";

const pixelSans = Pixelify_Sans({
    variable: "--font-pixel-sans",
    weight: ["400"],
    subsets: ["latin"],
});

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

const AppSidebar = ({ children }: { children: ReactNode }) => {
    const [open, setOpen] = useState(false);
    const [logoutLoader, setLogoutLoader] = useState<boolean>(false);
    const { isLoaded, user } = useUser();
    const { signOut } = useClerk();

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
                        {isLoaded ? (
                            <SidebarLink
                                link={{
                                    label: `${user?.firstName} ${user?.lastName ?? ""}`,
                                    href: "#",
                                    icon: (
                                        <img
                                            src={user?.imageUrl}
                                            className="h-7 w-7 shrink-0 rounded-full"
                                            width={50}
                                            height={50}
                                            alt="Avatar"
                                        />
                                    ),
                                }}
                            />
                        ) : (
                            <Loader2 className="animate-spin" />
                        )}
                        <SidebarButton
                            link={{
                                label: "Logout",
                                href: "#",
                                icon: (
                                    <IconLogout
                                        color="white"
                                        className="h-6 w-6 shrink-0 rounded-full ml-1 mt-1"
                                        width={50}
                                        height={50}
                                    />
                                ),
                            }}
                            onClickHandler={async () => {
                                setLogoutLoader(true);
                                await signOut({ redirectUrl: "/login" });
                                showSuccess("You've been logged out")
                            }}
                            loading={logoutLoader}
                        />
                        {/* <IconLogout
                            color='white'
                            className="h-6 w-6 shrink-0 rounded-full ml-1 mt-1 cursor-pointer"
                            width={50}
                            height={50}
                        /> */}
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

export default AppSidebar;
