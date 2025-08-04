import Header from '@/app/components/header/page';
import Contain from '../components/contain/page';
export default function BoyPage() {
  return (
    <div>
        <Header />
        <div className="w-full h-[1px] bg-white" />

        <main>
            <Contain />
        </main>
    </div>
  )
}