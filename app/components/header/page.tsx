'use client';

import Logo from '@/app/public/img/LogoFreitasOutlet.png';
import { ChevronDown, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation'; 

export default function Header() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/boypage');
  };

  const WomanPage = () => {
    router.push('/womanpage');
  }
  const KidsPage = () => {
    router.push('/kidspage');
  };

  return (
    <header className="w-full h-[10rem] p-4 flex items-center text-white text-[1.2rem] font-bold">
      <a href="/" className="cursor-pointer">
        <img
          src={Logo.src}
          alt="Logo Freitas-Outlet"
          className="w-[10rem] cursor-pointer"
        />
      </a>

      <nav className="flex ml-[45rem] gap-[2rem]">
        <button
          onClick={handleClick}
          className="flex items-center justify-center gap-2 cursor-pointer hover:text-gray-400"
        >
          Masculinos
          <ChevronDown />
        </button>
        <button
          onClick={WomanPage}
         className="flex items-center justify-center gap-2 cursor-pointer hover:text-gray-400">
          Femininos
          <ChevronDown />
        </button>
        <button
          onClick={KidsPage}
         className="flex items-center justify-center gap-2 cursor-pointer hover:text-gray-400">
          Infantis
          <ChevronDown />
        </button>
      </nav>

      <button
        className="ml-[2rem] cursor-pointer hover:text-gray-400"
        aria-label="Carrinho de compras"
      >
        <ShoppingCart className="w-6 h-6" />
      </button>
    </header>
  );
}
