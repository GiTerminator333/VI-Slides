"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"

import { cn } from "@/lib/utils"

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        // Elite Styling: Slightly smaller, uppercase-capable, and crisp
        "text-[11px] uppercase tracking-widest font-bold leading-none select-none",
        "text-neutral-500", // Soft contrast against the black background
        
        // Peer interactions (e.g., when the input it's for is disabled)
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        
        // Ensure it aligns well if used with icons
        "flex items-center gap-1.5",
        
        className
      )}
      {...props}
    />
  )
}

export { Label }