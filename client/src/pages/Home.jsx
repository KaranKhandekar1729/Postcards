import CreateEnvelope from "../components/CreateEnvelope"
import { useState } from "react"

export default function Home () {
    const [open, setOpen] = useState(false);

    return (
        <div className={`transition-opacity duration-1000 relative h-screen animate-fade-in bg-amber-300 flex justify-center items-center
        `}>
            <div className="absolute inset-0 m-0 sm:m-4 rounded-lg bg-[url('https://res.cloudinary.com/docidcbkt/image/upload/v1780292789/postcard-uploads/vwqr5qnzr0juhmipxzao.jpg')] bg-no-repeat bg-cover bg-center" />
                <div className="absolute inset-0 m-0 sm:m-4 sm:rounded-lg backdrop-blur-xs bg-black/30" />
                <div className="relative w-fit max-w-4xl mx-auto aspect-video flex flex-col items-center justify-center">
                    <img src="https://res.cloudinary.com/docidcbkt/image/upload/v1782125937/jj2gswm9dypcifa8pfge.webp" alt="" className="absolute right-[4%] xs:right-[5%] top-[20%] xs:top-[25%] w-[27%] xs:w-[28%] rotate-20" />
                    <img src="https://res.cloudinary.com/docidcbkt/image/upload/v1782125936/g5hgkcuz0wwbcz3mrekm.webp" alt="" className="absolute left-[2%] xs:left-0 top-[-16%] xs:top-[-10%] sm:top-[-5%] md:top-[-2%] w-[30%] xs:w-[28%] rotate-180" />
                    <div className="relative z-10 w-fit flex flex-col gap-4 justify-center items-center">
                        <h1 className="text-4xl xs:text-[2.5rem] sm:text-5xl md:text-6xl lg:text-7xl text-center max-w-[16ch] text-amber-300 font-advercase tracking-[1px] leading-[1.2] font-medium text-shadow-md text-shadow-red-950">Create and Send Digital Letters</h1>
                        <button className="p-2 px-10 mt-12 font-serif font-medium bg-red-900 hover:bg-yellow-300 cursor-pointer transition-all duration-400 text-amber-300 hover:text-orange-800 rounded-lg border border-amber-400/40 flex m-auto justify-center shadow-2xl shadow-black"
                            onClick={() => setOpen(true)}
                            >
                            <p className="text-lg sm:text-2xl">Create now</p>                  
                        </button>
                    </div>
                </div>

                <CreateEnvelope
                    open={open}
                    onClose={() => setOpen(false)}
                />
        </div>
    )
}