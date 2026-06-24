"use server";


import { serverFetch } from "../core/server";

export async function getMyPrompts(userId) {
  return serverFetch(`/api/my-prompts/${userId}`);
}

