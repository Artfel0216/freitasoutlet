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
                    </main>
            
                    <main className='flex gap-2 items-center justify-center'>
                    </main>
                  </div>
        </div>
    )
}