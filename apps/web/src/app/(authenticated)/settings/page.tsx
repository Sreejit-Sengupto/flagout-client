import APIKeys from "@/components/application/settings/api-key";
import Environment from "@/components/application/settings/enviroment";
import React from "react";

const Settings = () => {
    return (
        <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl bg-background p-5 overflow-auto">
            <APIKeys />
            <Environment />
        </div>
    );
};

export default Settings;
