"use server";

import { serverFetch } from "../core/server";

export async function getReviews(promptId) {
    return serverFetch(`/api/reviews/${promptId}`);
}