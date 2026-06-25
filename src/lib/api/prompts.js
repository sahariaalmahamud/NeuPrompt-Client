"use server";


import { serverFetch } from "../core/server";

export async function getMyPrompts(userId) {
  return serverFetch(`/api/my-prompts/${userId}`);
}

export async function getAllPrompts() {
  return serverFetch('/api/prompts');
}

export async function getPromptById(id) {
  return serverFetch(`/api/prompts/${id}`);
}

export async function getAdminAllPrompts() {
  return serverFetch(`/api/admin/prompts`);
}


export async function getFeaturedPrompts() {
  return serverFetch("/api/featured-prompts");
}