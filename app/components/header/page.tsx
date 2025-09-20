'use client';

import Logo from '@/app/public/img/LogoFreitasOutlet.png';
import { ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation'; 
import { useCart } from '@/app/context/CartContext';

export default function Header() {
  const router = useRouter();
  const { cartCount } = useCart();

  const goToManPage = () => router.push('/routes/ManPage/');
  const goToWomanPage = () => router.push('/routes/WomanPage');
  const goToKidsPage = () => router.push('/routes/KidsPage');
  const goToCarPage = () => router.push('/routes/CarPage');

  return (
    <header className="w-full h-[10rem] p-4 flex items-center text-white text-[1.2rem] font-bold relative">
      <a href="/" className="cursor-pointer">
        <img
          src={Logo.src}
          alt="Logo Freitas-Outlet"
          className="w-[10rem] cursor-pointer"
        />
      </a>

      <nav className="flex ml-[45rem] gap-[2rem]">
        <button onClick={goToManPage} className="hover:text-gray-400 cursor-pointer">Masculinos</button>
        <button onClick={goToWomanPage} className="hover:text-gray-400 cursor-pointer">Femininos</button>
        <button onClick={goToKidsPage} className="hover:text-gray-400 cursor-pointer">Infantis</button>
      </nav>

      <div className="ml-[2rem] relative">
        <ShoppingCart className="w-6 h-6 cursor-pointer hover:text-gray-400" onClick={goToCarPage}/>
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {cartCount}
          </span>
        )}
      </div>
    </header>
  );
}
