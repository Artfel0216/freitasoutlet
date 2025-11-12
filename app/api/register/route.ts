import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      firstName,
      lastName,
      email,
      password,
      address,
      number,
      city,
      state,
      cep,
    } = body;

    if (!email || !password || !firstName) {
      return NextResponse.json(
        { error: "Campos obrigatórios faltando." },
        { status: 400 }
      );
    }

    // 🔹 Verifica se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "E-mail já cadastrado." },
        { status: 400 }
      );
    }

    // 🔹 Cria hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔹 Cria o novo usuário
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        address,
        number,
        city,
        state,
        cep,
        provider: "credentials",
        image: "/default-avatar.png", // ✅ valor padrão para evitar erro
      },
    });

    return NextResponse.json({
      message: "Usuário criado com sucesso!",
      user: newUser,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao criar usuário." },
      { status: 500 }
    );
  }
}
