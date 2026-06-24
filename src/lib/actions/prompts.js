"use server";


import { revalidatePath } from "next/cache";
import { serverMutation } from "../core/server";

export async function createPrompt (promptData) {
  const response = serverMutation('/api/prompts', promptData);
  return response;
}


export const updatePrompt = async (id, data) => {
    const result = serverMutation(`/api/prompts/${id}`, data, 'PATCH');
    revalidatePath("/dashboard/my-prompts");
    return result;
  }
  

