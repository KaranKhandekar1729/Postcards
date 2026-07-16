import { useState } from "react"
import CreateEnvelope from "../components/CreateEnvelope"
import Grid from '../components/Grid'

export default function Home() {
    const [open, setOpen] = useState(false);

    return (
        <div className="bg-[#f1f1f1]">
            <div className="transition-opacity duration-1000 relative min-h-screen py-24 sm:py-0 animate-fade-in flex flex-col justify-center items-center">
                <div className="absolute inset-0 m-0 sm:m-4 sm:rounded-xl bg-[url('https://res.cloudinary.com/docidcbkt/image/upload/v1783264055/envelope-uploads/3b4da4ea231780aa821a2b29c783989e.jpg')] bg-no-repeat bg-cover bg-bottom" />
                <div className="relative w-full max-w-4xl mx-auto px-6 flex flex-col items-center justify-center">
                    <div className="relative z-10 w-full flex flex-col gap-4 sm:gap-6 justify-center items-center">
                        <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-[64px] text-center max-w-[12ch] text-text-white font-serif tracking-[-0.01em] leading-[1.05] font-medium">Create and send digital letters</h1>
                        <p className="font-system text-sm sm:text-base md:text-lg text-text-white max-w-md text-center px-4">Share personalized, digital letters, sealed in interactive envelopes, with your loved ones</p>
                        <button className="p-2 px-8 sm:px-10 font-serif font-medium bg-[#24231D] hover:bg-[#161612] cursor-pointer transition-all duration-400 text-white/80 hover:text-white rounded-lg flex m-auto justify-center shadow-2xl shadow-black"
                            onClick={() => setOpen(true)}
                        >
                            <p className="text-base sm:text-lg tracking-[-0.01em] font-system font-normal">Create now</p>
                        </button>
                    </div>
                </div>
                <CreateEnvelope
                    open={open}
                    onClose={() => setOpen(false)}
                />
            </div>
            <div className="w-full my-8 sm:my-12 px-6 py-8 sm:p-12 flex justify-center">
                <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl max-w-3xl text-center leading-[1.4] font-serif font-medium italic text-[#33302B]">A letter you make in the browser — written in your hand, sealed in an envelope, opened with a click.</h2>
            </div>
            <Grid />
            <div className="w-full h-2 flex">
                <div className="flex-1 bg-violet-500"></div>
                <div className="flex-1 bg-indigo-600"></div>
                <div className="flex-1 bg-indigo-500"></div>
                <div className="flex-1 bg-green-500"></div>
                <div className="flex-1 bg-yellow-500"></div>
                <div className="flex-1 bg-orange-500"></div>
                <div className="flex-1 bg-red-500"></div>
            </div>
        </div>
    )
}