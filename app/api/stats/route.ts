import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { stationId, stationName, countryCode } = await req.json();
    await prisma.stationStats.upsert({
      where: { stationId },
      update: { playCount: { increment: 1 } },
      create: { stationId, stationName, countryCode, playCount: 1 },
    });
  } catch {}
  return NextResponse.json({ ok: true });
}

export async function GET() {
  const top = await prisma.stationStats.findMany({
    orderBy: { playCount: "desc" },
    take: 20,
  });
  return NextResponse.json(top);
}
