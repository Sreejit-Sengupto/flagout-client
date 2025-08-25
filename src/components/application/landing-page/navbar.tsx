"use client";

import * as React from "react";
import Link from "next/link";
import {
    CircleCheckIcon,
    CircleHelpIcon,
    CircleIcon,
    Flag,
    Github,
    GoalIcon,
    Menu,
} from "lucide-react";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { Pixelify_Sans } from "next/font/google";
import { Separator } from "@/components/ui/separator";
import { SiGithub } from "@icons-pack/react-simple-icons";

const pixelSans = Pixelify_Sans({
    variable: "--font-pixel-sans",
    weight: ["400"],
    subsets: ["latin"],
});

const components: { title: string; href: string; description: string }[] = [
    {
        title: "Create Flag",
        href: "/docs/flags/create",
        description:
            "Define a new feature flag with name, key, and default state.",
    },
    {
        title: "Targeting Rules",
        href: "/docs/flags/targeting",
        description: "Control which users or environments see the feature.",
    },
    {
        title: "Rollouts",
        href: "/docs/flags/rollouts",
        description:
            "Gradually release features to a percentage of your users.",
    },
    {
        title: "Environments",
        href: "/docs/flags/environments",
        description:
            "Manage separate flag states for dev, staging, and production.",
    },
    {
        title: "SDK Integration",
        href: "/docs/sdk",
        description:
            "Integrate the SDK into your app to check and toggle flags.",
    },
    {
        title: "Audit Logs",
        href: "/docs/audit-logs",
        description:
            "Track every change to feature flags for security and debugging.",
    },
];

export default function Navbar() {
    return (
        <>
            <header className="flex justify-between items-center p-5 sticky top-0 left-0 bg-black z-10">
                <p
                    className={`flex justify-center items-center gap-2 lg:gap-3 ${pixelSans.className}`}
                >
                    <span className="">
                        <Flag fill="white" className="w-6 lg:w-8 h-6 lg:h-8" />
                    </span>
                    <span className="scroll-m-20 text-center text-2xl lg:text-4xl font-extrabold tracking-tight text-balance">
                        flag0ut
                    </span>
                </p>
                <NavigationMenu viewport={false} className="hidden lg:block">
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger>
                                Dashboard
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                    <li className="row-span-3">
                                        <NavigationMenuLink asChild>
                                            <a
                                                className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md"
                                                href="/workplace"
                                            >
                                                <div
                                                    className={`${pixelSans.className} mt-4 mb-2 text-lg font-medium`}
                                                >
                                                    flag0ut
                                                </div>
                                                <p className="text-muted-foreground text-sm leading-tight">
                                                    Feature flags for modern
                                                    developers. Deploy once,
                                                    release whenever you want.
                                                </p>
                                            </a>
                                        </NavigationMenuLink>
                                    </li>
                                    <ListItem href="/docs" title="Introduction">
                                        Control features without redeploys.
                                    </ListItem>
                                    <ListItem
                                        href="/docs/installation"
                                        title="Installation"
                                    >
                                        Install the SDK and connect quickly.
                                    </ListItem>
                                    <ListItem
                                        href="/docs/using-flags"
                                        title="Using Feature Flags"
                                    >
                                        Add flags, roll out, and monitor.
                                    </ListItem>
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger>
                                Features
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                    {components.map((component) => (
                                        <ListItem
                                            key={component.title}
                                            title={component.title}
                                            href={component.href}
                                        >
                                            {component.description}
                                        </ListItem>
                                    ))}
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink
                                asChild
                                className={navigationMenuTriggerStyle()}
                            >
                                <Link href="/docs">Docs</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink
                                asChild
                                className={navigationMenuTriggerStyle()}
                            >
                                <Link href="/pricing">Pricing</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>

                <section className="hidden lg:flex justify-center items-center gap-2">
                    <Button variant={"outline"}>
                        <Link
                            href={"https://github.com/Sreejit-Sengupto"}
                            className="flex justify-center items-center gap-1"
                        >
                            <span>
                                <Github />
                            </span>
                            <span>Github</span>
                        </Link>
                    </Button>
                    <Button>
                        <Link href={"/login"}>Get Started</Link>
                    </Button>
                </section>

                <Drawer>
                    <DrawerTrigger asChild className="lg:hidden">
                        <Menu />
                    </DrawerTrigger>
                    <DrawerContent className="min-h-[40%]">
                        <DrawerHeader className="hidden">
                            <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                            <DrawerDescription>
                                This action cannot be undone.
                            </DrawerDescription>
                        </DrawerHeader>
                        <section className="p-3 flex flex-col gap-4">
                            <Link href={"/workplace"}>Dashboard</Link>
                            <Link href={"/home"}>Tools</Link>
                            <Link href={"/home"}>Docs</Link>
                            <Link href={"/home"}>Pricing</Link>
                        </section>
                        <DrawerFooter>
                            <Button variant={"outline"}>
                                <Link
                                    href={"https://github.com/Sreejit-Sengupto"}
                                    className="flex justify-center items-center gap-1"
                                >
                                    <span>
                                        <SiGithub />
                                    </span>
                                    <span>Github</span>
                                </Link>
                            </Button>
                            <Button>
                                <Link href={"/login"}>Get Started</Link>
                            </Button>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </header>
            <Separator />
        </>
    );
}

function ListItem({
    title,
    children,
    href,
    ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
    return (
        <li {...props}>
            <NavigationMenuLink asChild>
                <Link href={href}>
                    <div className="text-sm leading-none font-medium">
                        {title}
                    </div>
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                        {children}
                    </p>
                </Link>
            </NavigationMenuLink>
        </li>
    );
}
