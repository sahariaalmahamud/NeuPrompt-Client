"use server";

import { serverMutation } from "../core/server";

export async function createReport(data) {
    return serverMutation("/api/reports", data, "POST");
}