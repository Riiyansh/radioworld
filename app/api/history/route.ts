import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json([]);
  const history = await prisma.playHistory.findMany({
    where: { userId: session.user.id },
    orderBy: { playedAt: "desc" },
    take: 20,
  });
  return NextResponse.json(history);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ ok: true });
  const { stationId, stationName, countryCode } = await req.json();
  await prisma.playHistory.create({
    data: { userId: session.user.id, stationId, stationName, countryCode },
  });
  return NextResponse.json({ ok: true });
}
