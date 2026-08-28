import { NextResponse } from "next/server";

import { buildStats } from "@/lib/db";

/* Static segment, so it takes precedence over /api/[collection]. */
export async function GET() {
  return NextResponse.json(buildStats());
}
