import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { id, email, name } = body;

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required." },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: "User email is required." },
        { status: 400 }
      );
    }

    const user = await prisma.user.upsert({
      where: {
        email,
      },
      update: {
        name: name || null,
      },
      create: {
        id,
        email,
        name: name || null,
        role: "STUDENT",
      },
    });

    return NextResponse.json({
      message: "User synced successfully.",
      user,
    });
  } catch (error) {
    console.error("Sync user error:", error);

    return NextResponse.json(
      { error: "Something went wrong while syncing the user." },
      { status: 500 }
    );
  }
}