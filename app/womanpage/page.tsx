import Header from "../components/header/page";
import Contain from '@/app/components/contain/page';

export default function WomanPage() {
    return(
        <div>
             {/* Header */}
            <Header />

             {/* Divisor */}
            <div className="w-full h-[1px] bg-gray-500"></div>

             <div className="min-h-screen bg-black p-8">
                    <main className="flex gap-2 items-center justify-center">
                      <Contain
                        sneakers='{}'
                        title="Tênis Hugo Boss"
                        price="R$ 199,99"
                      />
                      <Contain
                        sneakers='{}'
                        title="Tênis Armani"
                        price="R$ 299,99"
                      />
                      <Contain
                      sneakers='{}'
                      title="Tênis Boss"
                      price="R$ 129,99"
                      />
                    </main>
            
                    <main className='flex gap-2 items-center justify-center'>
                      <Contain
                        sneakers='{}'
                        title="Tênis Hugo Boss"
                        price="R$ 199,99"
                      />
            
                      <Contain
                        sneakers='{}'
                        title="Tênis New Balance"
                        price="R$ 299,99"
                      />
                      <Contain
                        sneakers='{}'
                        title="Tênis Reserva"
                        price="R$ 129,99"
                      />
                    </main>
                  </div>
        </div>
    )
}