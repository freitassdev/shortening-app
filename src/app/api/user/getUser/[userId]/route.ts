import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Usuario nao encontrado" },
      { status: 400 }
    );
  }
  const { password, ...userWithoutPassword } = user;
  return NextResponse.json({ ...userWithoutPassword });
}
