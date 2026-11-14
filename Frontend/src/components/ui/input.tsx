import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Obsidian Glass Base: Deep tint instead of white tint
        "flex h-12 w-full rounded-xl border border-white/5 bg-black/40 px-4 py-2 text-base text-white transition-all duration-300",
        "placeholder:text-neutral-600 outline-none backdrop-blur-xl shadow-[inner_0_2px_4px_rgba(0,0,0,0.3)]",
        
        // Interaction: Deepens and glows
        "focus:border-orange-500/30 focus:bg-black/60 focus:ring-4 focus:ring-orange-500/5",
        "focus:shadow-[0_0_20px_rgba(234,88,12,0.15)]",
        
        // Hover State
        "hover:border-white/10 hover:bg-black/50",

        // File input styling
        "file:border-0 file:bg-transparent file:text-sm file:font-bold file:text-[#EA580C] hover:file:text-white transition-colors",
        
        // Disabled & Error States
        "disabled:cursor-not-allowed disabled:opacity-30 disabled:bg-black/20",
        "aria-invalid:border-red-500/50 aria-invalid:ring-red-500/10",
        
        // Typography
        "md:text-sm font-medium tracking-wide",
        className
      )}
      {...props}
    />
  )
}

export { Input }