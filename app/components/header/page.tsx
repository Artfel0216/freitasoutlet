"use client";

import Image from "next/image";
import { ShoppingCart, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext"; // ✅ caminho ajustado conforme sua estrutura

export default function Header() {
  const router = useRouter();
  const { cartCount } = useCart();

  const goToManPage = () => router.push("/routes/ManPage");
  const goToWomanPage = () => router.push("/routes/WomanPage");
  const goToKidsPage = () => router.push("/routes/KidsPage");
  const goToCarPage = () => router.push("/routes/CarPage");
  const goToProfilePage = () => router.push("/routes/ProfilePage");

  return (
    <header className="w-full h-[10rem] p-4 flex items-center text-white text-[1.2rem] font-bold relative">
      <a href="/" className="cursor-pointer">
        <Image
          src="/img/LogoFreitasOutlet.png"
          alt="Logo Freitas-Outlet"
          width={160}
          height={80}
          className="cursor-pointer"
        />
      </a>

      <nav className="flex ml-[45rem] gap-[2rem]">
        <button onClick={goToManPage} className="hover:text-gray-400">
          Masculinos
        </button>
        <button onClick={goToWomanPage} className="hover:text-gray-400">
          Femininos
        </button>
        <button onClick={goToKidsPage} className="hover:text-gray-400">
          Infantis
        </button>
        <button onClick={goToProfilePage} className="hover:text-gray-400">
          <User className="w-6 h-6" />
        </button>
      </nav>

      <div className="ml-[2rem] relative">
        <ShoppingCart
          className="w-6 h-6 cursor-pointer hover:text-gray-400 transition-transform duration-200"
          onClick={goToCarPage}
        />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {cartCount}
          </span>
        )}
      </div>
    </header>
  );
}
