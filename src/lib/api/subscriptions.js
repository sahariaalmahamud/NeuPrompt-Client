"use server";

import { serverFetch } from "../core/server";


export async function getSubscription(userId) {
  if (!userId) return null;

  return serverFetch(`/api/subscriptions/${userId}`);
}


export async function getAllTransactions() {
  return serverFetch("/api/admin/transactions");
}
