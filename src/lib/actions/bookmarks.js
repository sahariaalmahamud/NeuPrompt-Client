"use server";

import { revalidatePath } from "next/cache";
import { serverMutation } from "../core/server";

export async function createBookmark(data) {
    const result = await serverMutation("/api/bookmarks", data, "POST");

    revalidatePath(`/prompts/${data.promptId}`);
    revalidatePath("/dashboard/saved-prompts");
    revalidatePath("/dashboard/creator");

    return result;
}


export async function removeBookmark(data) {
    const result = await serverMutation("/api/bookmarks", data, "DELETE");

    revalidatePath(`/prompts/${data.promptId}`);
    revalidatePath("/dashboard/saved-prompts");
    revalidatePath("/dashboard/creator");

    return result;
}