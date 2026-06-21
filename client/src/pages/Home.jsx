import CreateEnvelope from "../components/CreateEnvelope"
import { useState } from "react"

export default function Home () {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative h-screen bg-amber-300 flex justify-center items-center">
            <div className="absolute inset-0 m-6 rounded-lg bg-[url('https://res.cloudinary.com/docidcbkt/image/upload/v1780292789/postcard-uploads/vwqr5qnzr0juhmipxzao.jpg')] bg-no-repeat bg-cover" />
                <div className="absolute inset-0 m-6 rounded-lg backdrop-blur-xs bg-black/30" />
                <div className="relative w-fit flex flex-col gap-4 justify-center items-center">
                    <h1 className="text-7xl text-amber-300 font-advercase font-normal tracking-[1px]">Create and Send Digital Letters</h1>
                    <button className="p-3 mt-12 bg-amber-800 hover:bg-yellow-300 cursor-pointer transition-all duration-300 text-amber-300 hover:text-orange-800 rounded-md w-[250px] flex m-auto justify-center"
                        onClick={() => setOpen(true)}
                    >
                        Create now                  
                    </button>
                </div>

                <CreateEnvelope
                    open={open}
                    onClose={() => setOpen(false)}
                />
        </div>
    )
}