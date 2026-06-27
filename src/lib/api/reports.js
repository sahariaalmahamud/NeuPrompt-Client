"use server";
import { serverFetch } from "../core/server";

 

// export async function getReports() {
//   return serverFetch("/api/reports");
// }

export async function getReports() {
  const data = await serverFetch("/api/reports");

  console.log(data);

  return data;
}