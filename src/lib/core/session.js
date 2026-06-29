import { headers } from "next/headers";
import { auth } from "../auth";
import { redirect } from "next/navigation";

export const getUserSession = async () => {
    const session = await auth.api.getSession({
        headers: await headers() // some endpoints might require headers
    });

    // console.log("Fetched session data:", session); // Debugging log
    return session?.user || null;
}




export const requireRole = async (role) => {
    const user = await getUserSession();
    if (!user) {
        redirect("/auth/signin");
    }
    if (user.role !== role) {
        redirect("/unauthorized");
    }
    return user;
} 