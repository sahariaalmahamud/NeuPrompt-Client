"use server";


import { serverMutation } from "../core/server";

export async function createPrompt (promptData) {
  const response = serverMutation('/api/prompts', promptData);
  return response;
}



  
  // revalidatePath(`/dashboard/admin/companies`);

