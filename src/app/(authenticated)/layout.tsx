import { ReactNode } from "react";
import AppSidebar from "@/components/application/sidebar";

// Routes are protected using middleware
// No checks are required here
const ProtectedLayout = async ({ children }: { children: ReactNode }) => {
    return <AppSidebar>{children}</AppSidebar>;
};

export default ProtectedLayout;
