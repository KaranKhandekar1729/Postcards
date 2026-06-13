import { Bold, Copy, Trash, Layers } from "lucide-react";
export default function Toolbar({
    toolbarPos,
    isTextObj,
    updateFontFamily,
    updateFontSize,
    updateFontWeight,
    fontOptions,
    selectedFont,
    fontSizeOptions,
    fontSize,
    duplicate,
    deleteSelected,
    showLayerOptions,
    setShowLayerOptions,
    setLayerPosition
}) {

    return (
        <div
            className="absolute z-9999 bg-white w-max rounded-lg shadow-lg border border-[#ccccccb7] px-1 py-1 flex gap-2"
            style={{
                left: toolbarPos.x,
                top: toolbarPos.y,
                transform: "translateX(-50%)",
            }}
        >
            {isTextObj && (
                <div className="flex flex-row gap-1">
                    <div className="px-2 py-1 bg-[#cccccc70] hover:bg-gray-100 rounded-md"
                    >
                        <select value={selectedFont} onChange={updateFontFamily} name="font-family" id="font-family">
                            {fontOptions.map((fontOption, index) => {
                                return (
                                    <option
                                        key={index}
                                        value={fontOption.value}
                                        className="shadow-md border border-[#cccccc86] rounded-md"
                                    >{fontOption.label}</option>
                                )
                            }
                            )}
                        </select>
                    </div>
                    <div className="px-2 py-1 bg-[#cccccc70] hover:bg-gray-100 rounded-md">
                        <select value={fontSize} onChange={updateFontSize} name="font-size" id="font-size">
                            {fontSizeOptions.map((fontSize, index) => (
                                <option key={index} value={fontSize}>{fontSize}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={updateFontWeight}
                        className="px-2 py-1 hover:bg-gray-100 rounded-md"
                    >
                        <Bold size="20" />
                    </button>
                </div>
            )}
            <button
                onClick={duplicate}
                className="px-2 py-1 hover:bg-gray-100 rounded"
            >
                <Copy size="20" />
            </button>

            <button
                onClick={deleteSelected}
                className="px-2 py-1 hover:bg-gray-100 rounded"
            >
                <Trash size="20" />
            </button>

            <button
                onClick={() => setShowLayerOptions((prev) => !prev)}
                className="relative px-2 py-1 hover:bg-gray-100 rounded"
            >
                <Layers size="20" />
            </button>
            {showLayerOptions && (
                <div 
                    className="absolute top-11 right-0 p-1 bg-white flex flex-col gap-1 shadow-md rounded-lg"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div onClick={() => setLayerPosition('front')} className="hover:bg-gray-100 p-2 text-slate-800 rounded-md">Bring to Front</div>
                    <div onClick={() => setLayerPosition('back')} className="hover:bg-gray-100 p-2 text-slate-800 rounded-md">Send to Back</div>
                </div>
            )}
        </div>
    )
}
