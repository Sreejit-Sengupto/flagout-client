import { Button } from "@/components/ui/button";
import React from "react";

const DangerZone = () => {
    return (
        <section className="w-full bg-red-950/60 rounded-lg flex flex-col justify-center items-center divide-y-2">
            <div className="w-full flex flex-col lg:flex-row justify-between items-center p-5">
                <div>
                    <h2 className="scroll-m-20 text-xl font-semibold tracking-tight first:mt-0">
                        Update Password
                    </h2>
                    <p className="leading-7 [&:not(:first-child)]:mt-0 text-sm">
                        Change your old password with a new one.
                    </p>
                </div>
                <Button className="min-w-44 cursor-pointer ml-auto lg:ml-0 lg:mt-0">
                    Change Password
                </Button>
            </div>

            <div className="w-full flex flex-col lg:flex-row justify-between items-center p-5">
                <div>
                    <h2 className="scroll-m-20 text-xl font-semibold tracking-tight first:mt-0">
                        Delete Account
                    </h2>
                    <p className="leading-7 [&:not(:first-child)]:mt-0 text-sm">
                        Permanently delete your account from flag0ut.
                    </p>
                </div>
                <Button
                    variant={"destructive"}
                    className="min-w-44 cursor-pointer ml-auto lg:ml-0 mt-4 lg:mt-0"
                >
                    Delete Account
                </Button>
            </div>
        </section>
    );
};

export default DangerZone;
