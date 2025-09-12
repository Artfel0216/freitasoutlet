'use client';

import Header from "@/app/components/header/page";
import Sliders from "./components/sliders/page";

export default function Home() {
  return (
    <>
      <Header />
      
      <div className="w-full h-[1px] bg-white" />

      <main>
        <Sliders />
      </main>
    </>
  );
}
