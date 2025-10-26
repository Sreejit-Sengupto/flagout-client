import { cn } from "@/lib/utils";
import { Pixelify_Sans } from "next/font/google";
import React from "react";

const pixelSans = Pixelify_Sans({
    variable: "--font-pixel-sans",
    weight: ["400"],
    subsets: ["latin"],
});

const WhatIsFlagout = () => {
    return (
        <section
            id="what-is-flagout"
            className="container p-5 pt-10 text-center mx-auto"
        >
            <h2 className="text-3xl md:text-4xl font-bold">
                What is{" "}
                <span
                    className={cn(
                        "text-center text-3xl lg:text-4xl font-extrabold tracking-tight text-balance text-pink-600",
                        pixelSans.className,
                    )}
                >
                    flag0ut
                </span>
                ?
            </h2>
            <p className="mt-4 text-md lg:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
                flag0ut is a powerful feature flag management tool designed for
                modern development teams. It provides a centralized dashboard to
                manage, monitor, and optimize feature rollouts with ease. With
                features like percentage-based rollouts, role-based targeting,
                and AI-powered insights, flag0ut empowers developers to ship
                features fearlessly.
            </p>
        </section>
    );
};

export default WhatIsFlagout;
