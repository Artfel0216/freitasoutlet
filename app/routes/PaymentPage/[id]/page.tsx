import HeaderCar from "@/app/components/HeaderCar/page";
import { CreditCard, Wallet, Barcode } from "lucide-react";
import PayButton from "./PayButton";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function PaymentPage({ params }: { params: { id: string } }) {
  const productId = Number(params.id);

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { images: true },
  });

  if (!product) return <p>Produto não encontrado.</p>;

  return (
    <main>
      <HeaderCar />

      <div className="flex ml-4 mt-4 gap-6">

        {/* --- Coluna direita com pagamento --- */}
        <aside className="w-[25rem] h-fit bg-white text-black rounded shadow-md p-6 mr-20">
          
          <h2 className="font-bold text-lg mb-4">Formas de Pagamento</h2>

          {/* ---------------- Botões PIX / CARTÃO / BOLETO ---------------- */}
          <div className="flex flex-col gap-3 mb-6">

            {/* PIX */}
            <div className="group cursor-pointer transition-all">
              <PayButton product={product} method="pix">
                <button className="
                  flex items-center gap-3 w-full h-[3.2rem] border 
                  border-black rounded-xl font-bold 
                  transition-all duration-300
                  group-hover:bg-black group-hover:text-white
                ">
                  <Wallet size={22} />
                  Pagar com PIX
                </button>
              </PayButton>
            </div>

            {/* CARTÃO */}
            <div className="group cursor-pointer transition-all">
              <PayButton product={product} method="card">
                <button className="
                  flex items-center gap-3 w-full h-[3.2rem] border 
                  border-black rounded-xl font-bold 
                  transition-all duration-300
                  group-hover:bg-black group-hover:text-white
                ">
                  <CreditCard size={22} />
                  Cartão de Crédito
                </button>
              </PayButton>
            </div>

            {/* BOLETO */}
            <div className="group cursor-pointer transition-all">
              <PayButton product={product} method="boleto">
                <button className="
                  flex items-center gap-3 w-full h-[3.2rem] border 
                  border-black rounded-xl font-bold 
                  transition-all duration-300
                  group-hover:bg-black group-hover:text-white
                ">
                  <Barcode size={22} />
                  Pagar com Boleto
                </button>
              </PayButton>
            </div>
          </div>

          {/* Resumo */}
          <div className="flex justify-between mb-2">
            <span>Produtos</span>
            <span>R$ {product.price.toFixed(2)}</span>
          </div>

          <hr className="my-3" />

          <div className="flex justify-between items-center">
            <span className="font-bold">Total</span>
            <span className="font-extrabold text-lg text-black">
              R$ {product.price.toFixed(2)}
            </span>
          </div>

        </aside>
      </div>
    </main>
  );
}
