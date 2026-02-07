import { cn } from "@/lib/utils";
import { Flag } from "lucide-react";
import { Pixelify_Sans } from "next/font/google";
import React from "react";

const pixelSans = Pixelify_Sans({
    variable: "--font-pixel-sans",
    weight: ["400"],
    subsets: ["latin"],
});

interface TLogo {
    iconClasses?: string;
    textClasses?: string;
    hideLogo?: boolean;
}

const Logo: React.FC<TLogo> = ({
    hideLogo = false,
    iconClasses,
    textClasses,
}) => {
    return (
        <p
            className={cn(
                !hideLogo
                    ? `flex justify-start items-center gap-2 lg:gap-3 ${pixelSans.className}`
                    : `${pixelSans.className}`,
            )}
        >
            {!hideLogo && (
                <span className="">
                    <Flag
                        fill="white"
                        className={
                            iconClasses ? iconClasses : "w-6 lg:w-8 h-6 lg:h-8"
                        }
                    />
                </span>
            )}
            {/* <span className="scroll-m-20 text-center text-2xl lg:text-4xl font-extrabold tracking-tight text-balance">
                flag0ut
            </span> */}
            <span
                className={cn(
                    "scroll-m-20 text-center font-extrabold tracking-tight text-balance",
                    textClasses ? textClasses : "text-2xl lg:text-4xl",
                )}
            >
                flag0ut
            </span>
        </p>
    );
};

export default Logo;
