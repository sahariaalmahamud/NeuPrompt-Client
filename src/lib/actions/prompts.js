"use server";


import { revalidatePath } from "next/cache";
import { serverMutation } from "../core/server";

export async function createPrompt(promptData) {
  const response = serverMutation('/api/prompts', promptData);
  return response;
}


export const updatePrompt = async (id, data) => {
  const result = serverMutation(`/api/prompts/${id}`, data, 'PATCH');
  revalidatePath("/dashboard/my-prompts");
  revalidatePath("/dashboard/admin/all-prompts");
  return result;
}

// Delete prompt by creator 
export const deletePrompt = async (id) => {
  const result = serverMutation(`/api/prompts/${id}`, null, 'DELETE');
  revalidatePath("/dashboard/my-prompts");
  revalidatePath("/dashboard/all-prompts");
  return result;
}


export async function approvePrompt(id) {
  const result = await serverMutation(`/api/admin/prompts/${id}/approve`, null, "PATCH");

  revalidatePath(`/dashboard/admin/all-prompts/${id}`);
  revalidatePath(`/prompts/${id}`);

  return result;
}


export async function rejectPrompt(id, rejectionNote) {
  const result = await serverMutation(`/api/admin/prompts/${id}/reject`, { rejectionNote }, "PATCH");

  revalidatePath("/dashboard/admin/all-prompts");
  revalidatePath("/prompts");

  return result;
}


export async function toggleFeaturePrompt(id) {
  const result = await serverMutation(`/api/admin/prompts/${id}/feature`, null, "PATCH");

  revalidatePath("/dashboard/admin/all-prompts");
  revalidatePath("/prompts");

  return result;
}


//Delete prompt by admin
export async function adminDeletePrompt(id) {
  const result = await serverMutation(`/api/admin/prompts/${id}`, null, "DELETE");

  revalidatePath("/dashboard/admin/all-prompts");
  revalidatePath("/dashboard/my-prompts");
  revalidatePath("/prompts");

  return result;
}