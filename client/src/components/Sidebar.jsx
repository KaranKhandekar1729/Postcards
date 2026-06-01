export default function Sidebar ({ onAddText, onAddImage, isUploading }) {
    return (
        <>
            <div className="w-15 absolute left-0 h-full bg-yellow-950 border-r-2 border-y-yellow-950">
                <div className="flex flex-col gap-4 flex-1 justify-center items-center">
                    <button 
                        onClick={() => onAddText()}
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
                            onChange={onAddImage} 
                            onClick={e => e.target.value = null}
                            className="hidden"
                        />
                    </label>
                </div>
            </div>
        </>
    )
}