"use server";

import { serverFetch } from "../core/server";

export async function checkBookmark(userId, promptId) {
  return serverFetch(`/api/bookmarks/check/${userId}/${promptId}`);
}


export async function getBookmarks(userId) {
  return serverFetch(`/api/bookmarks/${userId}`);
}