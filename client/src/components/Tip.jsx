import * as Tooltip from "@radix-ui/react-tooltip";

// Shared Radix tooltip. `children` is the trigger element.
export default function Tip({ label, side = "top", children }) {
    return (
        <Tooltip.Root>
            <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
            <Tooltip.Portal>
                <Tooltip.Content
                    side={side}
                    sideOffset={16}
                    className="z-[80] select-none font-system rounded-md bg-red-950 border border-red-200/20 px-3 py-2 text-sm text-amber-50 shadow-md"
                >
                    {label}
                    <Tooltip.Arrow className="fill-red-950" />
                </Tooltip.Content>
            </Tooltip.Portal>
        </Tooltip.Root>
    )
}
