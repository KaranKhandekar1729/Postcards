import { Bold, Copy, Trash, Layers, ChevronDown } from "lucide-react";
export default function Toolbar({
    fabricRef,
    toolbarPos,
    isTextObj,
    updateFontFamily,
    updateFontSize,
    updateFontWeight,
    fontOptions,
    selectedFont,
    fontSizeOptions,
    fontDropdownOpen,
    setFontDropdownOpen,
    fontSize,
    fontSizeDropdownOpen,
    setFontSizeDropdownOpen,
    duplicate,
    deleteSelected,
    showLayerOptions,
    setShowLayerOptions,
    setLayerPosition
}) {

    return (
        <div
            className="absolute z-9 backface-hidden bg-white w-max rounded-lg shadow-lg border border-[#ccccccb7] px-1 py-1 flex flex-col sm:flex-row gap-2"
            style={{
                left: toolbarPos.x,
                top: toolbarPos.y,
                transform: "translateX(-50%)",
            }}
        >
            {isTextObj && (
                <div className="flex flex-row gap-1">
                        <div className="px-2 py-1 bg-[#cccccc50] hover:bg-gray-100 rounded-md">
                            <div className="relative">
                                <button
                                    onClick={() => {
                                        setShowLayerOptions(false)
                                        setFontSizeDropdownOpen(false)
                                        setFontDropdownOpen((prev) => !prev)
                                    }}
                                    className="text-sm max-w-[50px] sm:min-w-[150px] flex justify-between items-center cursor-pointer"
                                    style={{ fontFamily: fontOptions.find(f => f.value === selectedFont)?.label }}
                                >
                                    <p className="text-ellipsis text-left text-[10px] sm:text-base overflow-hidden">{fontOptions.find(f => f.value === selectedFont)?.label}</p>
                                    <span><ChevronDown size="15" className="cursor-pointer"/></span>
                                </button>

                                {fontDropdownOpen && (
                                    <div className="absolute top-8 left-0 shadow-lg rounded-lg border bg-white border-gray-100 z-50">
                                        {fontOptions.map((font, index) => (
                                            <div
                                                key={index}
                                                onClick={() => {
                                                    updateFontFamily(font.value, fabricRef)
                                                    setFontDropdownOpen(false)
                                                }}
                                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                                style={{ fontFamily: font.label }}
                                            >
                                                {font.label}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="px-2 py-1 bg-[#cccccc50] hover:bg-gray-100 rounded-md">
                            <div className="relative">
                                <button
                                    onClick={() => { 
                                        setFontDropdownOpen(false)
                                        setShowLayerOptions(false)
                                        setFontSizeDropdownOpen((prev) => !prev)
                                    }} 
                                    className="text-sm flex justify-between items-center gap-2"
                                >    
                                    <p>{fontSize}</p>
                                    <span><ChevronDown size="15" /></span>
                                </button>
                                {fontSizeDropdownOpen && (
                                    <div className="absolute top-8 bg-white rounded-lg shadow-lg border border-gray-100 z-50 overflow-y-scroll scrollbar-thin max-h-[150px]">
                                        {fontSizeOptions.map((fontSize, i) => (
                                            <div
                                                key={i}
                                                onClick={() => {
                                                    updateFontSize(fontSize, fabricRef)
                                                    setFontSizeDropdownOpen(false)
                                                }}
                                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                            >
                                                {fontSize}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    <button
                        onClick={() => updateFontWeight(fabricRef)}
                        className="px-2 py-1 hover:bg-gray-100 rounded-md"
                    >
                        <Bold size="20" />
                    </button>
                </div>
            )}
            <div>
                <button
                    onClick={() => duplicate(fabricRef)}
                    className="px-2 py-1 hover:bg-gray-100 rounded"
                >
                    <Copy size="20" />
                </button>

                <button
                    onClick={() => deleteSelected(fabricRef)}
                    className="px-2 py-1 hover:bg-gray-100 rounded"
                >
                    <Trash size="20" />
                </button>

                <button
                    onClick={() => {
                        setFontDropdownOpen(false)
                        setFontSizeDropdownOpen(false)
                        setShowLayerOptions((prev) => !prev)
                    }}
                    className="relative px-2 py-1 hover:bg-gray-100 rounded"
                >
                    <Layers size="20" />
                </button>
            </div>
            {showLayerOptions && (
                <div
                    className="absolute top-11 right-0 p-1 bg-white flex flex-col gap-1 shadow-md rounded-lg"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div onClick={() => setLayerPosition('front', fabricRef)} className="hover:bg-gray-100 p-2 text-slate-800 rounded-md">Bring to Front</div>
                    <div onClick={() => setLayerPosition('back', fabricRef)} className="hover:bg-gray-100 p-2 text-slate-800 rounded-md">Send to Back</div>
                </div>
            )}
        </div>
    )
}
