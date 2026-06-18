export default function Sidebar ({ onAddText, onAddImage, isUploading, envelopeFabricRef, letterFabricRef, activeCanvas }) {

    const fabricRef = activeCanvas === 'envelope' ? envelopeFabricRef : letterFabricRef

    return (
        <>
            <div className="w-full h-13 lg:w-15 lg:h-full bg-yellow-950 border-t-2 border-t-yellow-900 lg:border-r-2 lg:border-t-0 lg:border-r-yellow-900">
                <div className="flex flex-row lg:flex-col gap-12 lg:gap-4 flex-1 justify-center items-center">
                    <button 
                        onClick={() => onAddText(fabricRef?.current)}
                        className="rounded-md cursor-pointer text-[2rem] font-bold text-white"
                    >
                            T
                    </button>
                    <label className="rounded text-sm cursor-pointer flex items-center">
                        { isUploading ? (
                                <div className="w-fit h-fit animate-spin">
                                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-yellow-400 to-transparent"></div>
                                </div>  
                            ) : (<span className="text-[2rem]">🖼️</span>)
                        }
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => onAddImage(e, fabricRef?.current)} 
                            onClick={e => e.target.value = null}
                            className="hidden"
                        />
                    </label>
                </div>
            </div>
        </>
    )
}