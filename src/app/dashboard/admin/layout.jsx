import { requireRole } from "@/lib/core/session";



const LayoutPage = async ({ children }) => {
    await requireRole("admin");
    return children;
};

export default LayoutPage;