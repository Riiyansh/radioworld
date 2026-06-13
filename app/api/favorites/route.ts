import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json([]);
  const favs = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(favs.map((f: any) => JSON.parse(f.stationData)));
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const station = await req.json();
  await prisma.favorite.upsert({
    where: { userId_stationId: { userId: session.user.id, stationId: station.stationuuid } },
    update: {},
    create: {
      userId: session.user.id,
      stationId: station.stationuuid,
      stationName: station.name,
      stationData: JSON.stringify(station),
    },
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { stationId } = await req.json();
  await prisma.favorite.deleteMany({
    where: { userId: session.user.id, stationId },
  });
  return NextResponse.json({ ok: true });
}
