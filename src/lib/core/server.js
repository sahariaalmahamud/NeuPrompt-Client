"use server";

import { redirect } from "next/navigation";
import { getUserToken } from "./session";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";


export const authHeaders = async () => {
  const token = await getUserToken();
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  return headers;
};

// export async function serverFetch(path) {
//   const response = await fetch(`${baseUrl}${path}`);
//   //handle: 400, 401, 403, 500 errors
//   return response.json();
// }

export async function protectedFetch(path) {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: {
      ...await authHeaders(),
    },
  });
  //handle: 400, 401, 403, 500 errors
  return handleErrorResponse(response) || response.json();
}


export async function serverMutation(path, data, method = "POST") {
  // Implementation for creating a job
  const response = await fetch(`${baseUrl}${path}`, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      ...await authHeaders(),
    },
    body: JSON.stringify(data),
  });


  return handleErrorResponse(response) || response.json();
}

//handle: 400, 401, 403, 500 errors
const handleErrorResponse = (response) => {
  if (response.status === 401) {
    redirect('/auth/signin');
  } else if (response.status === 403) {
    redirect('/unauthorized');
  }
}