import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { message: "Unauthorized. Please sign in." },
      { status: 401 }
    );
  }
  return session;
}