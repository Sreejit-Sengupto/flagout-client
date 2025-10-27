import React from "react";
import { Pacifico } from "next/font/google";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";

const pacifico = Pacifico({
    variable: "--font-pixel-sans",
    weight: ["400"],
    subsets: ["latin"],
});

const PreFooter = () => {
    return (
        <main
            id="get-started"
            className="p-5 flex flex-col justify-center items-center gap-3 my-20"
        >
            <section className={`${pacifico.className}`}>
                <p className="scroll-m-20 text-center text-6xl font-extrabold tracking-tight text-balance">
                    Feature Flags.
                </p>
                <p className="scroll-m-20 text-center text-6xl font-extrabold tracking-tight text-balance">
                    Made Easy.
                </p>
            </section>
            <section className="flex justify-center items-center gap-2 mt-12">
                <Button className="inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                    <Link
                        href={"/login"}
                        className="flex justify-center items-center gap-2"
                    >
                        Get Started
                        <ArrowRight />
                    </Link>
                </Button>
                <Button variant={"link"}>
                    <Link
                        href={"https://github.com/Sreejit-Sengupto/flagout-client/blob/main/README.md"}
                        className="flex justify-center items-center gap-1"
                    >
                        Documentation
                    </Link>
                </Button>
            </section>
            <section className="hidden h-[32rem] lg:flex items-center justify-center">
                <TextHoverEffect text="flag0ut" />
            </section>
        </main>
    );
};

export default PreFooter;
