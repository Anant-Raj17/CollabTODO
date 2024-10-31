import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash, compare } from "bcrypt";

export async function POST(request: Request) {
  const body = await request.json();
  const { username, password, action } = body;

  if (action === "signup") {
    const hashedPassword = await hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });
    return NextResponse.json({ id: user.id, username: user.username });
  }

  if (action === "login") {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    return NextResponse.json({ id: user.id, username: user.username });
  }
}
