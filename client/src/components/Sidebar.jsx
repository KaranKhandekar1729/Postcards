import { useEffect, useRef, useState } from "react"
import { Image, LoaderCircle, Mail, Palette, ScrollText, Share2, Upload } from "lucide-react"
import * as Tooltip from "@radix-ui/react-tooltip"
import * as Popover from "@radix-ui/react-popover"
import ColorPicker from "./ColorPicker"
import Tip from "./Tip"

const stickerOptions = [
    { id: "sticker-1", url: "https://res.cloudinary.com/docidcbkt/image/upload/w_700,c_limit,f_auto,q_auto/v1782125936/g5hgkcuz0wwbcz3mrekm.webp", label: "red star" },
    { id: "sticker-2", url: "https://res.cloudinary.com/docidcbkt/image/upload/w_700,c_limit,f_auto,q_auto/v1782125937/jj2gswm9dypcifa8pfge.webp", label: "ribbon" },
    { id: "sticker-3", url: "https://res.cloudinary.com/docidcbkt/image/upload/w_700,c_limit,f_auto,q_auto/v1782472614/envelope-uploads/0f5dffa2b70e5dacee4e986f02c9329c.png", label: "lily" },
    { id: "sticker-4", url: "https://res.cloudinary.com/docidcbkt/image/upload/w_700,c_limit,f_auto,q_auto/v1782472597/envelope-uploads/ac0937e73cfd1d4de6dba356c826e6d0.png", label: "stars" },
    { id: "sticker-5", url: "https://res.cloudinary.com/docidcbkt/image/upload/w_700,c_limit,f_auto,q_auto/v1782494206/envelope-uploads/fb689f7dce97c7022a129b040b08fd46.png", label: "hbd" },
    { id: "sticker-6", url: "https://res.cloudinary.com/docidcbkt/image/upload/w_700,c_limit,f_auto,q_auto/v1783253372/envelope-uploads/d94796ca887877ea61ae94fda879d620.png", label: "ribbon2" },
    { id: "sticker-7", url: "https://res.cloudinary.com/docidcbkt/image/upload/w_700,c_limit,f_auto,q_auto/v1783253423/envelope-uploads/02685551d8e805c33364a2f7a0594a90.png", label: "blue star" },
    { id: "sticker-8", url: "https://res.cloudinary.com/docidcbkt/image/upload/w_700,c_limit,f_auto,q_auto/v1783254912/envelope-uploads/b62d905860a0ad2ef90133c7f16a593e.png", label: "frame" },
    { id: "sticker-9", url: "https://res.cloudinary.com/docidcbkt/image/upload/w_700,c_limit,f_auto,q_auto/v1783254991/envelope-uploads/d78c799ce6b20fb0c0d9d87a815fbc4a.png", label: "baddie" },
    { id: "sticker-10", url: "https://res.cloudinary.com/docidcbkt/image/upload/w_700,c_limit,f_auto,q_auto/v1783255046/envelope-uploads/675a4a91e57870c328d1ec4bbfd9a6ba.png", label: "bunny" },
    { id: "sticker-11", url: "https://res.cloudinary.com/docidcbkt/image/upload/w_700,c_limit,f_auto,q_auto/v1783255084/envelope-uploads/c5cdf4b2c8c98547ce694cbc2d7fbe40.png", label: "heart" },
    { id: "sticker-12", url: "https://res.cloudinary.com/docidcbkt/image/upload/w_700,c_limit,f_auto,q_auto/v1783255127/envelope-uploads/b67bdd3fe48c20987fa5114bcfd81946.png", label: "disco ball" },
    { id: "sticker-13", url: "https://res.cloudinary.com/docidcbkt/image/upload/w_700,c_limit,f_auto,q_auto/v1783255197/envelope-uploads/71aa944ee38fae425e2a84135d49a955.png", label: "quote" },
    { id: "sticker-14", url: "https://res.cloudinary.com/docidcbkt/image/upload/w_700,c_limit,f_auto,q_auto/v1783255226/envelope-uploads/baab4c532a5898e9d3460c3f445c26ee.png", label: "quote2" },
    { id: "sticker-15", url: "https://res.cloudinary.com/docidcbkt/image/upload/w_700,c_limit,f_auto,q_auto/v1783255341/envelope-uploads/d13ad94be445bf15061e3808beb34b37.png", label: "hbd2" },
    { id: "sticker-16", url: "https://res.cloudinary.com/docidcbkt/image/upload/w_700,c_limit,f_auto,q_auto/v1783255385/envelope-uploads/019cc4196f393262e2779fc374f7868e.png", label: "cake" },
    { id: "sticker-17", url: "https://res.cloudinary.com/docidcbkt/image/upload/w_700,c_limit,f_auto,q_auto/v1783255419/envelope-uploads/055aad2bc75e6752e851577f30605446.png", label: "uno reverse" },
    { id: "sticker-18", url: "https://res.cloudinary.com/docidcbkt/image/upload/w_700,c_limit,f_auto,q_auto/v1783255599/envelope-uploads/80094f1b35ec55d6a20ce4ec361c1fed.png", label: "teddy and bunny" },
]

const backgroundOptions = [
    { id: "background-1", url: "https://res.cloudinary.com/docidcbkt/image/upload/w_1440,f_auto,q_auto/v1783261284/envelope-uploads/d129d3d59f04d9bee1d8c070497c81de.jpg", label: "starry night" },
    { id: "background-2", url: "https://res.cloudinary.com/docidcbkt/image/upload/w_1440,f_auto,q_auto/v1783259694/envelope-uploads/b407359e370810692d0bfdd993c40f9c.jpg", label: "Summy day" },
    { id: "background-3", url: "https://res.cloudinary.com/docidcbkt/image/upload/w_1440,f_auto,q_auto/v1783257646/envelope-uploads/590102d54e2d6583f42a3f9d89a0cf00.jpg", label: "autumn" },
    { id: "background-4", url: "https://res.cloudinary.com/docidcbkt/image/upload/w_1440,f_auto,q_auto/v1783263476/envelope-uploads/7c71f457e103088d0e359ada7d17aa00.jpg", label: "cozy room" },
    { id: 'background-5', url: "https://res.cloudinary.com/docidcbkt/image/upload/w_1440,f_auto,q_auto/v1783264055/envelope-uploads/3b4da4ea231780aa821a2b29c783989e.jpg", label: "into the woods" },
    { id: 'background-6', url: "https://res.cloudinary.com/docidcbkt/image/upload/w_1440,f_auto,q_auto/v1783264687/envelope-uploads/ac5ae1f8f62fbbf22adc17f0a37534e4.jpg", label: "cozy room 2" }
]

const useSidebarPopupSide = () => {
    const [side, setSide] = useState("top")

    useEffect(() => {
        const media = window.matchMedia("(min-width: 1024px)")
        const updateSide = () => setSide(media.matches ? "right" : "top")

        updateSide()
        media.addEventListener("change", updateSide)
        return () => media.removeEventListener("change", updateSide)
    }, [])

    return side
}

const asBackgroundImage = (url) => url ? `url('${url}')` : ""

export default function Sidebar ({ onAddText, onAddImage, onAddImageUrl, onUploadBackground, isUploading, isBackgroundUploading, envelopeFabricRef, letterFabricRef, activeCanvas, visibleCanvas, openShareModal, envelopeColor, setEnvelopeColor, letterColor, setLetterColor, background, setBackground }) {
    const fileInputRef = useRef(null)
    const backgroundInputRef = useRef(null)
    const [imagePopoverOpen, setImagePopoverOpen] = useState(false)
    const popupSide = useSidebarPopupSide()

    const targetCanvas = activeCanvas ?? visibleCanvas;
    const fabricRef = targetCanvas === 'letter' ? letterFabricRef : envelopeFabricRef
    const disabled = !targetCanvas;

    const handleStickerClick = async (url) => {
        if (disabled || !url) return
        await onAddImageUrl(url, fabricRef?.current)
        setImagePopoverOpen(false)
    }

    const handleBackgroundClick = (url) => {
        if (!url) return
        setBackground(asBackgroundImage(url))
    }

    return (
        <Tooltip.Provider delayDuration={150} skipDelayDuration={300}>
            <div className="w-full h-12 shrink-0 lg:w-15 lg:h-full bg-red-950 border-t-2 border-t-yellow-900 lg:border-r-2 lg:border-t-0 lg:border-r-yellow-900">
                <div className="flex flex-row lg:flex-col justify-evenly lg:justify-start items-center gap-4 lg:gap-10 h-full w-full px-4 lg:px-0 lg:pt-6">
                    <Tip label="Add text" side={popupSide}>
                        <button
                            onClick={() => !disabled && onAddText(fabricRef?.current)}
                            disabled={disabled}
                            className="rounded-md cursor-pointer text-2xl lg:text-[2rem] font-bold text-white leading-none disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            T
                        </button>
                    </Tip>

                    <Popover.Root open={imagePopoverOpen} onOpenChange={setImagePopoverOpen}>
                        <Tip label="Add an image" side={popupSide}>
                            <Popover.Trigger asChild>
                                <button
                                    disabled={disabled}
                                    className="flex items-center justify-center cursor-pointer text-white disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {isUploading ? (
                                        <LoaderCircle className="w-6 h-6 lg:w-8 lg:h-8 animate-spin" />
                                    ) : (
                                        <Image className="w-6 h-6 lg:w-8 lg:h-8" />
                                    )}
                                </button>
                            </Popover.Trigger>
                        </Tip>
                        <Popover.Portal>
                            <Popover.Content
                                side={popupSide}
                                align="center"
                                sideOffset={22}
                                collisionPadding={10}
                                className="z-[70] flex w-[min(18rem,calc(100vw-1rem))] max-h-[min(26rem,calc(100dvh-5.5rem))] flex-col rounded-lg border border-red-100/20 bg-red-950 p-3 shadow-xl lg:max-h-[min(32rem,calc(100dvh-2rem))]"
                            >
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={disabled || isUploading}
                                    className="flex h-10 min-h-10 w-full shrink-0 items-center justify-center gap-2 rounded-md bg-amber-300 px-3 text-sm font-bold text-red-950 transition-colors hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {isUploading ? (
                                        <>
                                            <LoaderCircle className="h-4 w-4 animate-spin" />
                                            Uploading
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="h-4 w-4" />
                                            Upload image
                                        </>
                                    )}
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    disabled={disabled || isUploading}
                                    onChange={async (e) => {
                                        if (disabled) return
                                        await onAddImage(e, fabricRef?.current)
                                        setImagePopoverOpen(false)
                                    }}
                                    onClick={e => e.target.value = null}
                                    className="hidden"
                                />

                                <div className="postcards-thin-scrollbar mt-3 min-h-0 flex-1 overflow-y-auto pr-1">
                                    <div className="grid grid-cols-2 gap-2">
                                        {stickerOptions.map((sticker) => (
                                            <button
                                                key={sticker.id}
                                                type="button"
                                                onClick={() => handleStickerClick(sticker.url)}
                                                disabled={disabled || !sticker.url}
                                                className="aspect-square overflow-hidden rounded-md border border-amber-100/20 bg-amber-50/10 text-xs font-semibold text-amber-50 transition-colors hover:bg-amber-50/20 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                {sticker.url ? (
                                                    <img
                                                        src={sticker.url}
                                                        alt={sticker.label}
                                                        className="h-full w-full object-contain p-2"
                                                    />
                                                ) : (
                                                    <span className="flex h-full items-center justify-center px-2 text-center leading-tight">
                                                        Add URL
                                                    </span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </Popover.Content>
                        </Popover.Portal>
                    </Popover.Root>

                    <ColorPicker color={envelopeColor} onChange={setEnvelopeColor} side={popupSide} align="center" tooltip="Envelope color" tooltipSide={popupSide} sideOffset={22}>
                        <button className="relative flex items-center justify-center cursor-pointer">
                            <Mail className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                            <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full ring-1 ring-white" style={{ backgroundColor: envelopeColor }} />
                        </button>
                    </ColorPicker>

                    <ColorPicker color={letterColor} onChange={setLetterColor} side={popupSide} align="center" tooltip="Letter color" tooltipSide={popupSide} sideOffset={22}>
                        <button className="relative flex items-center justify-center cursor-pointer">
                            <ScrollText className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                            <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full ring-1 ring-white" style={{ backgroundColor: letterColor }} />
                        </button>
                    </ColorPicker>

                    <Popover.Root>
                        <Tip label="Background" side={popupSide}>
                            <Popover.Trigger asChild>
                                <button className="relative flex items-center justify-center cursor-pointer text-white">
                                    <Palette className="w-6 h-6 lg:w-7 lg:h-7" />
                                    <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full ring-1 ring-white" style={{ backgroundImage: background }} />
                                </button>
                            </Popover.Trigger>
                        </Tip>
                        <Popover.Portal>
                            <Popover.Content
                                side={popupSide}
                                align="center"
                                sideOffset={22}
                                collisionPadding={10}
                                className="z-[70] flex w-[min(16rem,calc(100vw-1rem))] flex-col rounded-lg border border-red-100/20 bg-red-950 p-3 shadow-xl"
                            >
                                <button
                                    type="button"
                                    onClick={() => backgroundInputRef.current?.click()}
                                    disabled={isBackgroundUploading}
                                    className="flex h-10 min-h-10 w-full shrink-0 items-center justify-center gap-2 rounded-md bg-amber-300 px-3 text-sm font-bold text-red-950 transition-colors hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {isBackgroundUploading ? (
                                        <>
                                            <LoaderCircle className="h-4 w-4 animate-spin" />
                                            Uploading
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="h-4 w-4" />
                                            Upload background
                                        </>
                                    )}
                                </button>
                                <input
                                    ref={backgroundInputRef}
                                    type="file"
                                    accept="image/*"
                                    disabled={isBackgroundUploading}
                                    onChange={onUploadBackground}
                                    onClick={e => e.target.value = null}
                                    className="hidden"
                                />
                                <div className="mt-3 grid grid-cols-2 gap-2">
                                    {backgroundOptions.map((option) => (
                                        <button
                                            key={option.id}
                                            type="button"
                                            onClick={() => handleBackgroundClick(option.url)}
                                            disabled={!option.url}
                                            className={`aspect-[4/3] border-0 overflow-hidden rounded-md bg-cover bg-center text-xs font-semibold text-amber-50 transition disabled:cursor-not-allowed disabled:bg-amber-50/10 disabled:opacity-60 ${background === asBackgroundImage(option.url) ? "border-amber-300 ring-2 ring-amber-300/60" : "border-amber-100/20 hover:border-amber-100/60"}`}
                                            style={{ backgroundImage: asBackgroundImage(option.url) }}
                                            aria-label={option.label}
                                        >
                                            {!option.url && "Add URL"}
                                        </button>
                                    ))}
                                </div>
                            </Popover.Content>
                        </Popover.Portal>
                    </Popover.Root>

                    <Tip label="Share" side={popupSide}>
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
