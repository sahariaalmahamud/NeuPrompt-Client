"use server";

import { redirect } from "next/navigation";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";


// export async function protectedFetch(path) {
//   const response = await fetch(`${baseUrl}${path}`);
//   //handle: 400, 401, 403, 500 errors
//   return response.json();
// }

export async function serverFetch(path) {
  const response = await fetch(`${baseUrl}${path}`, {
    cache: "no-store",
  });
  return handleErrorResponse(response) || response.json();
}



// export async function serverMutation(path, data, method = "POST") {
//   // Implementation for creating a prompt
//   const response = await fetch(`${baseUrl}${path}`, {
//     method: method,
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   });

//   return handleErrorResponse(response) || response.json();
// }


export async function serverMutation(path, data, method = "POST") {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (data !== null && data !== undefined) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${baseUrl}${path}`, options);

  handleErrorResponse(response);

  const text = await response.text();
  let result = null;

  if (text) {
    try {
      result = JSON.parse(text);
    } catch (err) {
      result = text;
    }
  }

  if (!response.ok) {
    const message = result?.message || (typeof result === "string" ? result : `Request failed: ${response.status}`);
    throw new Error(message);
  }

  return result;
}

//handle: 400, 401, 403, 500 errors
const handleErrorResponse = (response) => {
  if (response.status === 401) {
    redirect('/auth/signin');
  } else if (response.status === 403) {
    redirect('/unauthorized');
  }
}