import React, { ReactNode } from "react";

interface TEmptyState {
    icon: ReactNode;
    title: string;
    description: string;
    action?: ReactNode;
}

const EmptyState = ({ icon, title, description, action }: TEmptyState) => {
    return (
        <div className="w-full h-[200px] flex flex-col justify-center items-center bg-primary-foreground p-5 rounded-2xl">
            {icon}
            <p className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
                {title}
            </p>
            <p className="leading-7 text-gray-400">{description}</p>
            {action}
        </div>
    );
};

export default EmptyState;
