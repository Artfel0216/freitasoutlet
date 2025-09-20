'use client';

import LogoFreitasOutlet from '@/app/public/img/LogoFreitasOutlet.png';
import { Check, Rocket, ShoppingCart, Wallet } from 'lucide-react';


export default function HeaderCar() {
  return (
    <div>
         <header className="w-full flex justify-between items-center text-white font-bold p-4">
      {/* Logo */}
      <a href="/" className="cursor-pointer">
        <img
          src={LogoFreitasOutlet.src}
          alt="Logo Freitas Outlet"
          className="w-[10rem]"
        />
      </a>

      {/* Navegação */}
      <nav className="flex gap-7 items-center">
        <button className="flex items-center gap-2 cursor-pointer hover:text-gray-400">
          <ShoppingCart />
          <span>Carrinho</span>
        </button>

        <button className="flex items-center gap-2 cursor-pointer hover:text-gray-400">
          <Rocket />
          <span>Entrega</span>
        </button>

        <button className="flex items-center gap-2 cursor-pointer hover:text-gray-400">
          <Wallet />
          <span>Pagamento</span>
        </button>
      </nav>

      {/* Segurança */}
      <aside className="flex items-center gap-2 mr-6 text-green-400 text-sm">
        <Check aria-hidden="true" />
        <span>Ambiente 100% Seguro</span>
      </aside>
    </header>

    <div className='w-full h-[2px] bg-gray-500 mt-4'></div>
    </div>
   
  );
}
