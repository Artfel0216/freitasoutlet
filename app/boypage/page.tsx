import React from "react";
import SneackersBrown from "@/public/HugoBossMarrom.jpeg";
import SneackersBlack from "@/public/HugoBossPreto.jpeg";
import Contain from "@/app/components/contain/page";
import Header from "../components/header/page";

const sneakersHugoBoss = [
  {
    src: SneackersBrown.src,
    alt: "Tênis Hugo Boss marrom"
  },
  {
    src: SneackersBlack.src,
    alt: "Tênis Hugo Boss preto"
  }
];

export default function BoyPage() {
  return (

    <div>
      <Header />
      <div className="w-full h-[1px] bg-gray-500"></div>
        <div className="min-h-screen bg-black p-8">
      <main>
        <Contain sneakers={sneakersHugoBoss} title="Tênis Hugo Boss" />
      </main>
    </div>
    </div>
   
  );
}
