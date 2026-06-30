"use server";

import { serverFetch } from "../core/server";

export async function getMyPrompts(userId) {
  return serverFetch(`/api/my-prompts/${userId}`);
}

export async function getAllPrompts({ search = "" } = {}) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  const qs = params.toString();
  return serverFetch(`/api/prompts${qs ? `?${qs}` : ""}`);
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

export async function getCreatorStats(creatorId) {
  return serverFetch(`/api/dashboard/creator-stats/${creatorId}`);
}

export async function getPerformance(creatorId) {
  return serverFetch(`/api/dashboard/performance/${creatorId}`
  );
}

export async function getGrowth(creatorId) {
  return serverFetch(`/api/dashboard/growth/${creatorId}`
  );
}


export async function getTopPrompts(creatorId) {
  return serverFetch(`/api/dashboard/top-prompts/${creatorId}`
  );
}