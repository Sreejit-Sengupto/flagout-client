import DangerZone from "@/components/application/profile/danger-zone";
import ProfileDetails from "@/components/application/profile/details";
import React from "react";

const Profile = () => {
    return (
        <section className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl bg-background p-5 overflow-auto">
            <p className="scroll-m-20 text-2xl font-semibold tracking-tight">
                User Profile
            </p>

            <div className="mt-20 flex justify-center items-center">
                <ProfileDetails />
            </div>

            <div className="mt-10">
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-red-500 mb-2">
                    Danger Zone
                </h3>
                <DangerZone />
            </div>
        </section>
    );
};

export default Profile;
