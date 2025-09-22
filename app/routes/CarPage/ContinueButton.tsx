'use client';
import { useRouter } from 'next/navigation';

export default function ContinueButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/routes/DeliveryPage')}
      className="bg-green-400 hover:bg-green-600 text-black rounded h-10 mt-4 font-semibold cursor-pointer"
    >
      Continuar
    </button>
  );
}
