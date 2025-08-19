import Image from "next/image";
import React from "react";

const Control = () => {
    return (
        <main className="p-5 min-h-[100dvh] flex flex-col justify-center items-center relative">
            <div className="absolute top-0 left-0 w-[250px] h-[250px] bg-gradient-to-b lg:bg-gradient-to-l from-blue-500/40 via-purple-500/40 to-pink-500/40 blur-[120px]"></div>
            <div className="absolute bottom-0 right-0 w-[250px] h-[250px] bg-gradient-to-b lg:bg-gradient-to-l from-emerald-500/40 via-green-500/40 to-red-500/40 blur-[120px]"></div>

            <section className="mx-auto w-full flex flex-col justify-center items-center">
                <p className="scroll-m-20 border-b pb-2 text-2xl lg:text-3xl font-semibold tracking-tight first:mt-0 flex justify-center items-center gap-3">
                    <span>You are in</span>
                    <span className="text-pink-700">Control</span>
                </p>
                <p className="mt-2 mb-4 max-w-2xl text-center text-gray-400">
                    Our powerful admin dashboard gives you full control over
                    your feature rollouts. Toggle features on or off instantly,
                    fine-tune rollout criteria like user segments or
                    percentages, and monitor performance in real-time. With an
                    intuitive, lightning-fast interface, you can test, iterate,
                    and release confidently—without touching a single line of
                    code.
                </p>
            </section>
            <section className="my-4 flex flex-col lg:flex-row justify-center items-center gap-6 font-semibold">
                <div className="p-4 border-x-2 rounded-2xl"></div>
                <div className="p-1 rounded-2xl bg-gradient-to-l from-red-500/40 via-orange-500/40 to-amber-500/40 min-w-xs text-center lg:min-w-0">
                    <div className="bg-background p-4 rounded-2xl">
                        Granular Rollouts
                    </div>
                </div>
                <div className="p-1 rounded-2xl bg-gradient-to-l from-blue-500/40 via-purple-500/40 to-pink-500/40 min-w-xs text-center lg:min-w-0">
                    <div className="bg-background p-4 rounded-2xl">
                        Instant Toggles
                    </div>
                </div>
                <div className="p-1 rounded-2xl bg-gradient-to-l from-cyan-500/40 via-green-500/40 to-emerald-500/40 min-w-xs text-center lg:min-w-0">
                    <div className="bg-background p-4 rounded-2xl">
                        Smart Targeting
                    </div>
                </div>
                <div className="p-4 border-x-2 rounded-2xl"></div>
            </section>
            <section>
                <Image
                    src={"/dashboard.avif"}
                    alt="dashboard image"
                    width={700}
                    height={700}
                    className="rounded-lg mt-4"
                />
            </section>
        </main>
    );
};

export default Control;
