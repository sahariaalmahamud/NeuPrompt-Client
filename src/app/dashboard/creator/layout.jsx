import { requireRole } from "@/lib/core/session";



const LayoutPage = async ({ children }) => {
    await requireRole("creator");
    return children;
};

export default LayoutPage;