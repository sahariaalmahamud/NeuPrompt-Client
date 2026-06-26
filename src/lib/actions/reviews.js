"use server";

import { serverMutation } from "../core/server";

export async function createReview(data) {
  return serverMutation("/api/reviews", data,"POST");
}