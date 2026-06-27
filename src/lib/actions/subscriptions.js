"use server";

import { serverMutation } from "../core/server";

export async function createSubscription(data) {
    return serverMutation("/api/subscriptions", data, "POST");
}