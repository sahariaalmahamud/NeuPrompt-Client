import { requireRole } from "@/lib/core/session";



const LayoutPage = async ({ children }) => {
    await requireRole("user");
    return children;
};

export default LayoutPage;