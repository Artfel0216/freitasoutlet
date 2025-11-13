"use client";

import { useState } from "react";
import { Facebook, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function ProfilePage() {
  const router = useRouter();

  // ===========================================================
  // Estado do formulário e mensagens
  // ===========================================================
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ===========================================================
  // Redirecionar para o registro
  // ===========================================================
  const GoToRegisterPage = () => {
    router.push("/routes/RegisterPage");
  };

  // ===========================================================
  // Função de login com credenciais (NextAuth)
  // ===========================================================
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (result?.error) {
      setMessage(
        "❌ Você não possui login na plataforma. Por favor, registre-se."
      );
    } else {
      setMessage("✅ Login realizado com sucesso!");
      setTimeout(() => {
        router.push("/HomePage");
      }, 1000);
    }
  }

  // ===========================================================
  // UI
  // ===========================================================
  return (
    <main className="flex justify-center items-center h-screen bg-black">
      <section className="w-[60rem] h-[30rem] bg-black rounded-3xl border-2 border-white flex overflow-hidden shadow-lg">
        {/* Painel lateral */}
        <article className="h-full w-[26rem] bg-white rounded-3xl flex flex-col items-center justify-center text-black text-center gap-5 p-5">
          <header>
            <h1 className="font-bold text-[2rem]">Bem-vindo!</h1>
          </header>

          <p className="text-[1rem]">
            Para se manter conectado conosco, <br />
            por favor, entre com suas informações pessoais.
          </p>

          <footer className="flex flex-col gap-4 mt-5">
            <button
              type="button"
              className="border-2 border-black w-[15rem] h-[2.5rem] rounded-3xl cursor-pointer hover:bg-black hover:text-white transition"
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={GoToRegisterPage}
              className="border-2 border-black w-[15rem] h-[2.5rem] rounded-3xl cursor-pointer hover:bg-black hover:text-white transition"
            >
              Registrar
            </button>
          </footer>
        </article>

        {/* Área de login */}
        <section className="flex flex-col items-center justify-center w-[35rem] gap-5 text-white">
          {/* Login social */}
          <div className="flex gap-4">
            {/* Login com Facebook */}
            <button
              type="button"
              onClick={() => signIn("facebook")}
              className="w-[2.5rem] h-[2.5rem] rounded-full border-2 border-white flex justify-center items-center cursor-pointer hover:bg-white/10 transition"
              aria-label="Entrar com Facebook"
            >
              <Facebook size={20} color="white" />
            </button>

            {/* Login com Google */}
            <button
              type="button"
              onClick={() => signIn("google")}
              className="w-[2.5rem] h-[2.5rem] rounded-full border-2 border-white flex justify-center items-center cursor-pointer hover:bg-white/10 transition"
              aria-label="Entrar com Google"
            >
              <Mail size={20} color="white" />
            </button>
          </div>

          <p>Entre com E-mail e Senha</p>

          {/* Formulário de login */}
          <form
            onSubmit={handleLogin}
            className="flex flex-col gap-4 items-center"
          >
            <label htmlFor="email" className="text-sm">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-black bg-white px-4 py-2 w-[18rem] rounded-3xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Digite seu E-mail"
              required
            />

            <label htmlFor="password" className="text-sm">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-black bg-white px-4 py-2 w-[18rem] rounded-3xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Digite sua Senha"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="mt-4 bg-white text-black font-semibold px-10 py-2 rounded-3xl hover:bg-gray-200 transition"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          {/* Mensagem de feedback */}
          {message && (
            <p
              className={`mt-4 text-sm ${
                message.startsWith("✅") ? "text-green-400" : "text-red-400"
              }`}
            >
              {message}
            </p>
          )}
        </section>
      </section>
    </main>
  );
}
