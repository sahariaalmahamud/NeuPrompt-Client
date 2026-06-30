'use server';

import { headers } from "next/headers";
import { auth } from "../auth";
import { revalidatePath } from "next/cache";


export const updateUserRole = async (userId, role) => {
    const data = await auth.api.setRole({
        body: {
            userId: userId,
            role: role, // required
        },
        // This endpoint requires session cookies.
        headers: await headers(),
    });
    revalidatePath("/dashboard/admin/users");
    return data;
}

export const deleteUser = async (userId) => {
    const data = await auth.api.removeUser({
        body: {
            userId, // required
        },
        // This endpoint requires session cookies.
        headers: await headers(),
    });
    revalidatePath("/dashboard/admin/users");
    return data;
};