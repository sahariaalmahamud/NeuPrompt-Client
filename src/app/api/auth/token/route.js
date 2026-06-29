import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const token = await auth.api.getToken({
      headers: await headers(),
    });

    return NextResponse.json({
      token,
    });
  } catch (error) {
    console.warn("Auth token request failed:", error?.message || error);
    return NextResponse.json({ token: null }, { status: 200 });
  }
}