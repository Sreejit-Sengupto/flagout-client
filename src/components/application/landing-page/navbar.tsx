"use client";

import * as React from "react";
import Link from "next/link";
import { Flag, Github, Menu } from "lucide-react";
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
        title: "Feature Flag Management",
        href: "#features",
        description: "Manage, monitor, and optimize feature rollouts.",
    },
    {
        title: "Percentage-based Rollouts",
        href: "#features",
        description:
            "Gradually release features to a percentage of your users.",
    },
    {
        title: "Role-based Targeting",
        href: "#features",
        description:
            "Target specific user segments like BETA, INTERNAL, or PREMIUM users.",
    },
    {
        title: "API Key Management",
        href: "#features",
        description:
            "Generate and manage API keys to securely interact with the API.",
    },
    {
        title: "Recent Activity Tracking",
        href: "#features",
        description: "Keep track of all changes made to your feature flags.",
    },
    {
        title: "Dashboard",
        href: "#features",
        description:
            "An intuitive dashboard with key metrics and recent activity.",
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
                                    <ListItem
                                        href="#what-is-flagout"
                                        title="Introduction"
                                    >
                                        Control features without redeploys.
                                    </ListItem>
                                    <ListItem
                                        href="#get-started"
                                        title="Installation"
                                    >
                                        Install the SDK and connect quickly.
                                    </ListItem>
                                    <ListItem
                                        href="/feature-flags"
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
                                <Link href="https://github.com/Sreejit-Sengupto/flagout-client">
                                    Docs
                                </Link>
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
                        <Link href={"/workplace"}>Workplace</Link>
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
                            <Link
                                href={
                                    "https://github.com/Sreejit-Sengupto/flagout-client"
                                }
                            >
                                Docs
                            </Link>
                            <Link href={"/pricing"}>Pricing</Link>
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
                                <Link href={"/workplace"}>Go to Workplace</Link>
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
