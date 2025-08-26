import Logo from "@/components/application/logo";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import React, { ReactNode } from "react";
import { redirect } from "next/navigation";

const UnauthenticatedLayout = async ({ children }: { children: ReactNode }) => {
    const user = await currentUser();
    if (user) {
        redirect("/workplace");
    }
    return (
        <section className="w-full h-[100dvh] flex flex-col">
            <Link href={"/"} className="p-5">
                <Logo />
            </Link>
            <div className="my-auto">{children}</div>
        </section>
    );
};

export default UnauthenticatedLayout;
