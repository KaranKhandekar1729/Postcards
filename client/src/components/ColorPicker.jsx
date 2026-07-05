import * as Popover from "@radix-ui/react-popover";
import { HexColorPicker, HexColorInput } from "react-colorful";
import { Pipette } from "lucide-react";
import Tip from "./Tip";
import "../styles/colorpicker.css";

const supportsEyeDropper = typeof window !== 'undefined' && 'EyeDropper' in window

// Reusable color picker. `children` is the trigger (e.g. a swatch button).
// Radix Popover handles positioning, collision and outside-click for us.
// Pass `tooltip` (requires a Tooltip.Provider ancestor) to label the trigger.
export default function ColorPicker({ color, onChange, children, side = "bottom", align = "start", tooltip, tooltipSide = "top", sideOffset = 6 }) {
    const pickFromScreen = async () => {
        if (!supportsEyeDropper) return
        try {
            const { sRGBHex } = await new window.EyeDropper().open()
            onChange(sRGBHex)
        } catch {
            // user dismissed the eyedropper — ignore
        }
    }

    return (
        <Popover.Root>
            {tooltip ? (
                <Tip label={tooltip} side={tooltipSide}>
                    <Popover.Trigger asChild>{children}</Popover.Trigger>
                </Tip>
            ) : (
                <Popover.Trigger asChild>{children}</Popover.Trigger>
            )}
            <Popover.Portal>
                <Popover.Content
                    side={side}
                    align={align}
                    sideOffset={sideOffset}
                    collisionPadding={8}
                    className="color-popover z-[70] w-[208px] bg-white rounded-xl shadow-lg p-2 flex flex-col gap-2"
                >
                    <HexColorPicker color={color} onChange={onChange} />
                    <div className="flex items-center gap-1">
                        <div className="flex flex-1 items-center gap-1 bg-stone-50 rounded-full px-3 py-1">
                            <span className="text-sm text-red-950/50">#</span>
                            <HexColorInput
                                color={color}
                                onChange={onChange}
                                className="w-full min-w-0 bg-transparent outline-none text-sm text-red-950 uppercase"
                            />
                        </div>
                        {supportsEyeDropper && (
                            <button
                                onClick={pickFromScreen}
                                title="pick a color"
                                className="h-8 w-8 flex shrink-0 items-center justify-center rounded-full cursor-pointer hover:bg-stone-100"
                            >
                                <Pipette className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    )
}
