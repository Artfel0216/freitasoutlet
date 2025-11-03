'use client';

import Image from 'next/image';
import { Check, Rocket, ShoppingCart, Wallet } from 'lucide-react';

export default function HeaderCar() {
  return (
    <div>
      <header className="w-full flex justify-between items-center text-white font-bold p-4">
        {/* Logo */}
        <a href="/" className="cursor-pointer">
          <Image
            src="/img/LogoFreitasOutlet.png"
            alt="Logo Freitas Outlet"
            width={160}
            height={80}
            className="w-[10rem] h-auto"
          />
        </a>

        {/* Navegação */}
        <nav className="flex gap-7 items-center">
          <p className="flex items-center gap-2 cursor-pointer">
            <ShoppingCart />
            <span>Carrinho</span>
          </p>

          <p className="flex items-center gap-2 cursor-pointer">
            <Rocket />
            <span>Entrega</span>
          </p>

          <p className="flex items-center gap-2 cursor-pointer">
            <Wallet />
            <span>Pagamento</span>
          </p>
        </nav>

        {/* Segurança */}
        <aside className="flex items-center gap-2 mr-6 text-green-400 text-sm">
          <Check aria-hidden="true" />
          <span>Ambiente 100% Seguro</span>
        </aside>
      </header>

      <div className="w-full h-[2px] bg-gray-500 mt-4"></div>
    </div>
  );
}
