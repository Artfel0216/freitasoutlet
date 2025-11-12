'use client';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ContinueButton() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Pegamos os dados que já estão na URL do CarPage
  const id = searchParams.get("id");
  const size = searchParams.get("size");
  const image = searchParams.get("image");
  const quantity = searchParams.get("quantity") || "1"; // valor padrão

  const handleContinue = () => {
    const params = new URLSearchParams({
      id: id || "",
      size: size || "",
      image: image || "",
      quantity,
    }).toString();

    router.push(`/routes/DeliveryPage?${params}`);
  };

  return (
    <button
      onClick={handleContinue}
      className="bg-green-400 hover:bg-green-600 text-black rounded h-10 mt-4 font-semibold cursor-pointer"
    >
      Continuar
    </button>
  );
}
