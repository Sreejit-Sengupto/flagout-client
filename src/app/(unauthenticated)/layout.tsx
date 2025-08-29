import Logo from "@/components/application/logo";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import React, { ReactNode } from "react";
import { redirect } from "next/navigation";

const UnauthenticatedLayout = async ({ children }: { children: ReactNode }) => {
    const { isAuthenticated } = await auth();
    if (isAuthenticated) {
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
