"use server";

import { redirect } from "next/navigation";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";


// export async function protectedFetch(path) {
//   const response = await fetch(`${baseUrl}${path}`);
//   //handle: 400, 401, 403, 500 errors
//   return response.json();
// }

export async function serverFetch(path) {
  const response = await fetch(`${baseUrl}${path}`);
  //handle: 400, 401, 403, 500 errors
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


  handleErrorResponse(response);


  if (!contentType?.includes("application/json")) {
    const text = await response.text();
    throw new Error(`Expected JSON but received: ${text}`);
  }

  return response.json();
}

//handle: 400, 401, 403, 500 errors
const handleErrorResponse = (response) => {
  if (response.status === 401) {
    redirect('/auth/signin');
  } else if (response.status === 403) {
    redirect('/unauthorized');
  }
}