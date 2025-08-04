import SneackersBrown from "@/public/HugoBossMarrom.jpeg";
import SneackersBlack from "@/public/HugoBossPreto.jpeg";

export default function Contain() {
    return(
        <div className="w-[20rem] h-[30rem] mt-[2rem] ml-4 border-[1px] border-white p-4 relative text-white text-center font-bold animate-fade-right animate-once animate-duration-[3000ms] animate-delay-1000 animate-ease-linear">
            <div className="rounded-full w-[4rem] h-[4rem]  text-black bg-white absolute flex items-center justify-center font-bold cursor-pointer">
                50% <br />
                Off
            </div>

            <img src={SneackersBrown.src} alt="" className="w-[16rem] ml-[1.1rem] h-[20rem]"/>

            <h1 className="text-[1.2rem] ">Tênis Hugo Boss</h1>
        </div>
    )
}