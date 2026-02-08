import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import React from "react";
import Metrics from "./metrics";

const ProfileDetails = async () => {
    const user = await currentUser();

    return (
        <section className="w-full bg-primary-foreground flex flex-col justify-center items-center gap-4 relative rounded-lg">
            <div className="absolute -top-15 left-1/2 -translate-x-1/2 bg-background p-4 rounded-full">
                <Image
                    src={user?.imageUrl ?? "/profile_fallback.png"}
                    alt={`${user?.firstName}'s profile picture`}
                    width={120}
                    height={120}
                    className="rounded-full"
                />
            </div>

            <div className="mt-25">
                <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 text-center">
                    {user?.fullName}
                </h2>
                <blockquote className="mt-2 border-l-2 pl-6 italic">
                    {user?.primaryEmailAddress?.emailAddress}
                </blockquote>
            </div>

            <div className="w-full p-5">
                <Metrics />
            </div>
        </section>
    );
};

export default ProfileDetails;
