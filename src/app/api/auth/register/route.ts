import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // const parsedBody = UserSchema.safeParse(body);
    // if (!parsedBody.success) {
    //   const serverErrors = Object.fromEntries(
    //     parsedBody.error?.issues?.map((issue) => [
    //       issue.path[0],
    //       issue.message,
    //     ]) || []
    //   );

    //   return NextResponse.json(
    //     {
    //       errors: serverErrors,
    //       message: "Validation Error",
    //     },
    //     { status: 400 }
    //   );
    // }
    const { email, password, name } = body;

    const existsEmail = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (existsEmail) {
      return NextResponse.json(
        { message: "Email já cadastrado." },
        { status: 500 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({ message: "User Registered" }, { status: 201 });
  } catch (error) {
    console.log("Error while Registeing", error);
    return NextResponse.json(
      { message: "Error Occured While Registering the user." },
      { status: 500 }
    );
  }
}
