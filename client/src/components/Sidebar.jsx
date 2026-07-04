import { useState, useEffect } from "react"
import { Share2, Mail, ScrollText } from "lucide-react"
import * as Tooltip from "@radix-ui/react-tooltip"
import ColorPicker from "./ColorPicker"
import Tip from "./Tip"

export default function Sidebar ({ onAddText, onAddImage, isUploading, envelopeFabricRef, letterFabricRef, activeCanvas, visibleCanvas, openShareModal, envelopeColor, setEnvelopeColor, letterColor, setLetterColor }) {

    const targetCanvas = activeCanvas ?? visibleCanvas;
    const fabricRef = targetCanvas === 'letter' ? letterFabricRef : envelopeFabricRef
    const disabled = !targetCanvas;

    // Sidebar sits on the left at lg+ and at the bottom on mobile; open pickers/tooltips away from the bar
    const [isDesktop, setIsDesktop] = useState(() => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches)
    useEffect(() => {
        const mq = window.matchMedia('(min-width: 1024px)')
        const onChange = (e) => setIsDesktop(e.matches)
        mq.addEventListener('change', onChange)
        return () => mq.removeEventListener('change', onChange)
    }, [])
    const side = isDesktop ? 'right' : 'top'

    return (
        <Tooltip.Provider delayDuration={150} skipDelayDuration={300}>
            <div className="w-full h-13 lg:w-15 lg:h-full bg-red-950 border-t-2 border-t-yellow-900 lg:border-r-2 lg:border-t-0 lg:border-r-yellow-900">
                {/* Spread across the bar on mobile; stack from the top on desktop */}
                <div className="flex flex-row lg:flex-col justify-evenly lg:justify-start items-center gap-4 lg:gap-10 h-full w-full px-4 lg:px-0 lg:pt-6">
                    <Tip label="Add text" side={side}>
                        <button
                            onClick={() => !disabled && onAddText(fabricRef?.current)}
                            disabled={disabled}
                            className="rounded-md cursor-pointer text-2xl lg:text-[2rem] font-bold text-white leading-none"
                        >
                            T
                        </button>
                    </Tip>

                    <Tip label="Add an image" side={side}>
                        <label className="rounded text-sm cursor-pointer flex items-center">
                            { isUploading ? (
                                    <div className="w-fit h-fit animate-spin">
                                        <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-linear-to-br from-yellow-400 to-transparent"></div>
                                    </div>
                                ) : (<span className="text-2xl lg:text-[2rem]">🖼️</span>)
                            }
                            <input
                                type="file"
                                accept="image/*"
                                disabled={disabled}
                                onChange={(e) => !disabled && onAddImage(e, fabricRef?.current)}
                                onClick={e => e.target.value = null}
                                className="hidden"
                            />
                        </label>
                    </Tip>

                    <ColorPicker color={envelopeColor} onChange={setEnvelopeColor} side={side} align="center" tooltip="Envelope color" tooltipSide={side}>
                        <button className="relative flex items-center justify-center cursor-pointer">
                            <Mail className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                            <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full ring-1 ring-white" style={{ backgroundColor: envelopeColor }} />
                        </button>
                    </ColorPicker>

                    <ColorPicker color={letterColor} onChange={setLetterColor} side={side} align="center" tooltip="Letter color" tooltipSide={side}>
                        <button className="relative flex items-center justify-center cursor-pointer">
                            <ScrollText className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                            <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full ring-1 ring-white" style={{ backgroundColor: letterColor }} />
                        </button>
                    </ColorPicker>

                    <Tip label="Share" side={side}>
                        <button
                            onClick={() => openShareModal()}
                            className="cursor-pointer"
                        >
                            <Share2 className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                        </button>
                    </Tip>
                </div>
            </div>
        </Tooltip.Provider>
    )
}
