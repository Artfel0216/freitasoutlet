"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import LogoFreitasOutlet from "@/app/public/img/LogoFreitasOutlet.png";



export default function RegisterPage() {
  return (
    <main className="relative flex items-center justify-center h-screen w-full bg-black p-10 overflow-hidden">
      {/* Imagem de fundo transparente */}
      <Image
        src={LogoFreitasOutlet}
        alt="Logo Freitas Outlet"
        fill
        className="object-contain opacity-10 pointer-events-none"
      />

      {/* Container animado */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-6xl bg-black/40 rounded-3xl p-10 text-white shadow-lg backdrop-blur-sm"
      >
        <header className="mb-8 text-center">
          <motion.h1
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-3xl font-bold"
          >
            Criar Conta
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-gray-300 mt-2"
          >
            Preencha os campos abaixo para finalizar seu cadastro
          </motion.p>
        </header>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Coluna 1 */}
          <fieldset className="flex flex-col gap-4">
            <legend className="sr-only">Dados Pessoais</legend>

            {[
              { label: "Primeiro Nome", type: "text", placeholder: "Digite seu Primeiro Nome" },
              { label: "Segundo Nome", type: "text", placeholder: "Digite seu Segundo Nome" },
              { label: "E-mail", type: "email", placeholder: "Digite seu E-mail" },
              { label: "Senha", type: "password", placeholder: "Digite sua Senha" },
              { label: "Confirmar Senha", type: "password", placeholder: "Confirme sua Senha" },
            ].map((field, index) => (
              <motion.label
                key={field.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 * index, duration: 0.5 }}
                className="font-semibold text-lg"
              >
                {field.label}
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  className="bg-white text-black p-3 rounded-3xl w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </motion.label>
            ))}
          </fieldset>

          {/* Coluna 2 */}
          <fieldset className="flex flex-col gap-4">
            <legend className="sr-only">Endereço</legend>

            {[
              { label: "Endereço", type: "text", placeholder: "Digite o nome da rua" },
              { label: "Número", type: "text", placeholder: "Digite o número da casa" },
              { label: "Cidade", type: "text", placeholder: "Digite o nome da cidade" },
              { label: "Estado", type: "text", placeholder: "Digite o nome do estado" },
              { label: "CEP", type: "text", placeholder: "Digite o CEP" },
            ].map((field, index) => (
              <motion.label
                key={field.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 * index, duration: 0.5 }}
                className="font-semibold text-lg"
              >
                {field.label}
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  className="bg-white text-black p-3 rounded-3xl w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </motion.label>
            ))}
          </fieldset>
        </form>

        {/* Botão de ação */}
        <footer className="mt-8 flex justify-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "#e5e7eb" }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="bg-white text-black font-semibold px-10 py-3 rounded-3xl shadow-md transition"
          >
           Cancelar
          </motion.button>

            <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "#e5e7eb" }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="bg-white text-black font-semibold px-10 py-3 rounded-3xl shadow-md transition"
          >
            Registrar
          </motion.button>
        </footer>
      </motion.section>
    </main>
  );
}
