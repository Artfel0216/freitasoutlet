"use client";

import { Facebook, Mail } from "lucide-react";
import { useRouter } from "next/navigation"; 

export default function ProfilePage() {
  const router = useRouter();

   const GoToRegisterPage = () => {
    router.push('/routes/RegisterPage');
  }

  return (
    <main className="flex justify-center items-center h-screen">
      <section className="w-[60rem] h-[30rem] bg-black rounded-3xl border-1 border-white flex">
        
        {/* Painel de boas-vindas */}
        <article className="h-full w-[26rem] bg-white rounded-3xl flex flex-col items-center justify-center text-black text-center gap-5">
          <header>
            <h1 className="font-bold text-[2rem]">Bem vindo !</h1>
          </header>

          <p className="text-[1rem]">
            Para se manter conectado conosco <br />
            Por favor, logue com suas informações pessoais
          </p>

          <footer className="flex flex-col gap-4 mt-5">
            <button
              type="button"
              className="border-[2px] w-[15rem] h-[2.5rem] rounded-4xl cursor-pointer"
            >
              Entrar
            </button>
            <button
              type="button"
              className="border-[2px] w-[15rem] h-[2.5rem] rounded-4xl cursor-pointer"
              onClick={GoToRegisterPage} 
            >
              Registrar
            </button>
          </footer>
        </article>

        {/* Área de login */}
        <section className="flex flex-col items-center justify-center w-[35rem] gap-5 text-white">
          
          {/* Login social */}
          <div className="flex gap-4">
            <button
              type="button"
              className="w-[2.5rem] h-[2.5rem] rounded-full border-2 border-white flex justify-center items-center cursor-pointer"
              aria-label="Entrar com Facebook"
            >
              <Facebook size={20} color="white" />
            </button>

            <button
              type="button"
              className="w-[2.5rem] h-[2.5rem] rounded-full border-2 border-white flex justify-center items-center cursor-pointer"
              aria-label="Entrar com E-mail"
            >
              <Mail size={20} color="white" />
            </button>
          </div>

          <p>Entre com E-mail e Senha</p>

          {/* Formulário de login */}
          <form className="flex flex-col gap-4 items-center">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              className="text-black bg-white p-4 w-[18rem] h-[2rem] border-none rounded-3xl"
              placeholder="Digite seu E-mail"
              required
            />

            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              className="text-black bg-white p-4 w-[18rem] h-[2rem] border-none rounded-3xl"
              placeholder="Digite sua Senha"
              required
            />
          </form>
        </section>
      </section>
    </main>
  );
}
