import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Verifica se o usuário existe
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
    }

    // Verifica se há senha registrada
    if (!user.password) {
      return NextResponse.json({ error: "Usuário sem senha cadastrada." }, { status: 400 });
    }

    // Compara senha criptografada
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Senha incorreta." }, { status: 401 });
    }

    return NextResponse.json({
      message: "Login bem-sucedido",
      user: { id: user.id, email: user.email, name: user.firstName },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
