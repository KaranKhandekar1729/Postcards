import { Bold, Copy, Trash, Layers, ChevronDown, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import * as Tooltip from "@radix-ui/react-tooltip";
import ColorPicker from "./ColorPicker";
import Tip from "./Tip";

const alignOptions = [
    { value: 'left', Icon: AlignLeft, label: 'Align left' },
    { value: 'center', Icon: AlignCenter, label: 'Align center' },
    { value: 'right', Icon: AlignRight, label: 'Align right' },
]

const groupBg = "bg-stone-100 hover:bg-stone-200"   // dropdowns
const selectedBg = "bg-stone-200"                    // active toggles
const btnHover = "hover:bg-stone-100"                // plain buttons
const iconClass = "w-4 h-4 sm:w-5 sm:h-5" // toolbar icon class

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
    textColor,
    updateTextColor,
    textAlign,
    updateTextAlign,
    isBold,
    duplicate,
    deleteSelected,
    showLayerOptions,
    setShowLayerOptions,
    setLayerPosition
}) {


    return (
        <Popover.Root open onOpenChange={() => { }}>
            <Popover.Anchor asChild>
                <div className="absolute w-0 h-0" style={{ left: toolbarPos.x, top: toolbarPos.y }} />
            </Popover.Anchor>
            <Popover.Portal>
                <Popover.Content
                    side="top"
                    align="center"
                    sideOffset={12}
                    collisionPadding={8}
                    updatePositionStrategy="always"
                    onOpenAutoFocus={(e) => e.preventDefault()}
                    onInteractOutside={(e) => e.preventDefault()}
                    onEscapeKeyDown={(e) => e.preventDefault()}
                    className="z-[60] bg-white max-w-[72vw] sm:max-w-[95vw] w-max rounded-md shadow-lg border border-[#ccccccb7] p-1 flex flex-row flex-wrap items-center justify-start gap-1 text-red-950"
                >
                    <Tooltip.Provider delayDuration={150} skipDelayDuration={300}>
                        {isTextObj && (
                            <>
                                {/* Font family */}
                                <div className={`relative flex items-center h-8 px-2 rounded-md ${groupBg}`}>
                                    <button
                                        onClick={() => {
                                            setShowLayerOptions(false)
                                            setFontSizeDropdownOpen(false)
                                            setFontDropdownOpen((prev) => !prev)
                                        }}
                                        className="w-[80px] sm:w-[140px] flex justify-between items-center gap-1 cursor-pointer"
                                        style={{ fontFamily: fontOptions.find(f => f.value === selectedFont)?.label }}
                                    >
                                        <span className="text-ellipsis text-left text-[11px] sm:text-sm overflow-hidden whitespace-nowrap">{fontOptions.find(f => f.value === selectedFont)?.label}</span>
                                        <ChevronDown size="15" className="shrink-0" />
                                    </button>

                                    {fontDropdownOpen && (
                                        <div className="absolute top-9 left-0 shadow-lg rounded-xl border bg-white border-gray-100 z-50 max-h-[200px] overflow-y-auto scrollbar-thin">
                                            {fontOptions.map((font, index) => (
                                                <div
                                                    key={index}
                                                    onClick={() => {
                                                        updateFontFamily(font.value, fabricRef)
                                                        setFontDropdownOpen(false)
                                                    }}
                                                    className="px-3 py-2 hover:bg-stone-100 cursor-pointer text-sm whitespace-nowrap"
                                                    style={{ fontFamily: font.label }}
                                                >
                                                    {font.label}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Font size */}
                                <div className={`relative flex items-center h-8 px-2 rounded-md ${groupBg}`}>
                                    <button
                                        onClick={() => {
                                            setFontDropdownOpen(false)
                                            setShowLayerOptions(false)
                                            setFontSizeDropdownOpen((prev) => !prev)
                                        }}
                                        className="flex justify-between cursor-pointer items-center gap-1"
                                    >
                                        <span className="text-[11px] sm:text-sm">{fontSize}</span>
                                        <ChevronDown size="15" className="shrink-0" />
                                    </button>
                                    {fontSizeDropdownOpen && (
                                        <div className="absolute top-9 left-0 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-y-scroll scrollbar-thin max-h-[150px]">
                                            {fontSizeOptions.map((size, i) => (
                                                <div
                                                    key={i}
                                                    onClick={() => {
                                                        updateFontSize(size, fabricRef)
                                                        setFontSizeDropdownOpen(false)
                                                    }}
                                                    className="px-3 py-2 hover:bg-stone-100 cursor-pointer text-sm"
                                                >
                                                    {size}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Bold */}
                                <Tip label="Bold">
                                    <button
                                        onClick={() => updateFontWeight(fabricRef)}
                                        className={`h-8 w-8 flex items-center justify-center rounded-md cursor-pointer ${isBold ? selectedBg : btnHover}`}
                                    >
                                        <Bold className={iconClass} />
                                    </button>
                                </Tip>

                                {/* Text color */}
                                <ColorPicker color={textColor} onChange={(color) => updateTextColor(color, fabricRef)} tooltip="Text color">
                                    <button
                                        className={`h-8 w-8 flex items-center justify-center rounded-md cursor-pointer ${btnHover}`}
                                    >
                                        <span
                                            className="block w-4 h-4 sm:w-5 sm:h-5 rounded-full ring-1 ring-black/10"
                                            style={{ backgroundColor: textColor }}
                                        />
                                    </button>
                                </ColorPicker>

                                {/* Text alignment — individual flex items */}
                                {alignOptions.map(({ value, Icon, label }) => (
                                    <Tip key={value} label={label}>
                                        <button
                                            onClick={() => updateTextAlign(value, fabricRef)}
                                            className={`h-8 w-8 flex items-center justify-center rounded-md cursor-pointer ${textAlign === value ? selectedBg : btnHover}`}
                                        >
                                            <Icon className={iconClass} />
                                        </button>
                                    </Tip>
                                ))}
                            </>
                        )}

                        {/* Object actions — flow inline so they fill space beside the align group */}
                        <Tip label="Duplicate">
                            <button
                                onClick={() => duplicate(fabricRef)}
                                className={`h-8 w-8 flex items-center justify-center rounded-md cursor-pointer ${btnHover}`}
                            >
                                <Copy className={iconClass} />
                            </button>
                        </Tip>

                        <Tip label="Delete">
                            <button
                                onClick={() => deleteSelected(fabricRef)}
                                className={`h-8 w-8 flex items-center justify-center rounded-md cursor-pointer ${btnHover}`}
                            >
                                <Trash className={iconClass} />
                            </button>
                        </Tip>

                        <div className="relative">
                            <Tip label="Position">
                                <button
                                    onClick={() => {
                                        setFontDropdownOpen(false)
                                        setFontSizeDropdownOpen(false)
                                        setShowLayerOptions((prev) => !prev)
                                    }}
                                    className={`h-8 w-8 flex items-center justify-center rounded-md cursor-pointer ${showLayerOptions ? selectedBg : btnHover}`}
                                >
                                    <Layers className={iconClass} />
                                </button>
                            </Tip>

                            {showLayerOptions && (
                                <div
                                    className="absolute top-10 right-0 p-1 bg-white flex flex-col gap-1 shadow-md rounded-xl z-50"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div onClick={() => setLayerPosition('front', fabricRef)} className="hover:bg-stone-100 p-2 rounded-md cursor-pointer whitespace-nowrap">Bring to Front</div>
                                    <div onClick={() => setLayerPosition('back', fabricRef)} className="hover:bg-stone-100 p-2 rounded-md cursor-pointer whitespace-nowrap">Send to Back</div>
                                </div>
                            )}
                        </div>
                    </Tooltip.Provider>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    )
}
