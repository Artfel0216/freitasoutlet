'use client';

import Logo from '@/app/public/img/LogoFreitasOutlet.png';
import { ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation'; 

export default function Header() {
  const router = useRouter();

  const goToManPage = () => {
    router.push('/routes/ManPage/');
  };

  const goToWomanPage = () => {
    router.push('/routes/WomanPage');
  };

  const goToKidsPage = () => {
    router.push('/routes/KidsPage');
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
          onClick={goToManPage}
          className="flex items-center justify-center gap-2 cursor-pointer hover:text-gray-400"
        >
          Masculinos
        </button>
        <button
          onClick={goToWomanPage}
          className="flex items-center justify-center gap-2 cursor-pointer hover:text-gray-400"
        >
          Femininos  
        </button>
        <button
          onClick={goToKidsPage}
          className="flex items-center justify-center gap-2 cursor-pointer hover:text-gray-400"
        >
          Infantis
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
