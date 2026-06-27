"use server";

import { serverFetch } from "../core/server";



export async function getSubscription(userId) {
    return serverFetch(`/api/subscriptions/${userId}`);
}