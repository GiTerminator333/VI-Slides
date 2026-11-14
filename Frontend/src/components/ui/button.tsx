/* eslint-disable react-refresh/only-export-components */
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "@radix-ui/react-slot" // Ensure correct Radix import

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-xl border border-transparent text-sm font-bold whitespace-nowrap transition-all duration-300 outline-none select-none focus-visible:ring-2 focus-visible:ring-orange-500/40 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // PREMIUM PRIMARY: A deep orange that "ignites" on hover
        default: 
          "bg-gradient-to-br from-orange-600 to-orange-500 text-white shadow-[0_1px_2px_rgba(0,0,0,0.1),0_8px_16px_-4px_rgba(234,88,12,0.3)] hover:from-orange-500 hover:to-yellow-500 hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:scale-[1.02]",
        
        // GLASS OUTLINE: Subtle border that glows on interaction
        outline:
          "border-white/10 bg-white/[0.02] backdrop-blur-md text-zinc-400 hover:border-orange-500/40 hover:bg-orange-500/5 hover:text-orange-500",
        
        // DEEP SECONDARY: Matches the Zinc card backgrounds
        secondary:
          "bg-zinc-900 text-zinc-100 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 hover:text-white",
        
        // GHOST: Minimalist
        ghost:
          "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100",
        
        // DESTRUCTIVE: A subtle "danger" state
        destructive:
          "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all",
        
        link: "text-orange-500 underline-offset-4 hover:text-orange-400 hover:underline",
      },
      size: {
        default: "h-11 px-6 gap-2.5",
        xs: "h-8 px-3 text-xs gap-1.5 rounded-lg",
        sm: "h-9 px-4 text-sm gap-2 rounded-lg",
        lg: "h-14 px-10 text-base gap-3 uppercase tracking-widest rounded-2xl",
        icon: "size-11 rounded-xl",
        "icon-xs": "size-8 rounded-lg",
        "icon-sm": "size-9 rounded-lg",
        "icon-lg": "size-14 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }