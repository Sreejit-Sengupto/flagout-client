import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { Button } from "@/components/ui/button";
import { Flag } from "lucide-react";
import { Pixelify_Sans } from "next/font/google";
import Link from "next/link";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Pricing | flag0ut",
    description: "Find the perfect plan for your team. Start for free and scale with us.",
    openGraph: {
        title: "Pricing | flag0ut",
        description: "Find the perfect plan for your team. Start for free and scale with us.",
        images: [
            {
                url: "https://asset.cloudinary.com/dagn8yyfi/0ce7ee5d3c73ef1298ae591e091d52a4",
                width: 1200,
                height: 630,
                alt: "flag0ut App Dashboard",
            },
        ],
    },
};

const pixelSans = Pixelify_Sans({
    variable: "--font-pixel-sans",
    weight: ["400"],
    subsets: ["latin"],
});

// const pricingTiers = [
//     {
//         name: "Hobby",
//         price: "Free",
//         features: [
//             "Unlimited Feature Flags",
//             "Unlimited Environments",
//             "1,000 MAUs",
//             "Community Support",
//         ],
//         buttonText: "Get Started",
//         comingSoon: false,
//     },
//     {
//         name: "Pro",
//         price: "$20",
//         features: [
//             "Everything in Hobby",
//             "20,000 MAUs",
//             "Role-based Access Control",
//             "Email Support",
//         ],
//         buttonText: "Get Started",
//         comingSoon: true,
//     },
//     {
//         name: "Enterprise",
//         price: "Custom",
//         features: [
//             "Everything in Pro",
//             "Unlimited MAUs",
//             "SAML SSO",
//             "Dedicated Support",
//         ],
//         buttonText: "Contact Us",
//         comingSoon: true,
//     },
// ];

const PricingPage = () => {
    return (
        // <div className="container py-24 sm:py-32">
        //     <h1 className="text-4xl font-bold text-center">
        //         Pricing
        //     </h1>
        //     <p className="text-xl text-muted-foreground text-center mt-4">
        //         We are still planning on the pricing model. For now, the application is free to use!
        //     </p>
        //     <p className="text-xl text-muted-foreground text-center mt-4">
        //         Start for free, then scale with us.
        //     </p>
        //     <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        //         {pricingTiers.map((tier) => (
        //             <Card key={tier.name} className="flex flex-col">
        //                 <CardHeader>
        //                     <CardTitle className="flex justify-between items-center">
        //                         {tier.name}
        //                         {tier.comingSoon && <Badge variant="outline">Coming Soon</Badge>}
        //                     </CardTitle>
        //                     <CardDescription>{tier.price}</CardDescription>
        //                 </CardHeader>
        //                 <CardContent className="flex-grow">
        //                     <ul className="space-y-4">
        //                         {tier.features.map((feature) => (
        //                             <li key={feature} className="flex items-center gap-2">
        //                                 <Check className="w-5 h-5 text-green-500" />
        //                                 <span>{feature}</span>
        //                             </li>
        //                         ))}
        //                     </ul>
        //                 </CardContent>
        //                 <CardFooter>
        //                     <Button className="w-full" disabled={tier.comingSoon}>
        //                         {tier.buttonText}
        //                     </Button>
        //                 </CardFooter>
        //             </Card>
        //         ))}
        //     </div>
        // </div>

        <div className="relative flex min-h-screen w-full flex-col items-start justify-start overflow-hidden p-5">
            <BackgroundRippleEffect />
            <Link
                href={"/"}
                className={`flex justify-center items-center gap-2 lg:gap-3 ${pixelSans.className} z-10`}
            >
                <span className="">
                    <Flag fill="white" className="w-6 lg:w-8 h-6 lg:h-8" />
                </span>
                <span className="scroll-m-20 text-center text-2xl lg:text-4xl font-extrabold tracking-tight text-balance">
                    flag0ut
                </span>
            </Link>
            <div className="mt-60 lg:mt-80 w-full">
                <h2 className="relative z-10 mx-auto max-w-4xl text-center font-bold text-pink-700 text-4xl lg:text-7xl dark:text-pink-600">
                    Pricing
                </h2>
                <p className="relative z-10 mx-auto mt-4 max-w-xl text-center text-xl">
                    We are still planning on the pricing model. For now, the
                    application is free to use! Start for free, then scale with
                    us.
                </p>
            </div>
            <Button className="mx-auto mt-10 cursor-pointer z-10">
                <Link href={"/workplace"} className="cursor-pointer">
                    Go to Workplace
                </Link>
            </Button>
        </div>
    );
};

export default PricingPage;
