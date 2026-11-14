import * as React from "react"
import { cn } from "@/lib/utils"

function Card({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & { size?: "default" | "sm" }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        // Dimension Glass Base: High blur and very low opacity
        "group/card flex flex-col gap-4 overflow-hidden rounded-[2rem] bg-white/[0.02] py-6 text-sm text-white transition-all duration-500",
        "backdrop-blur-3xl border border-white/10 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)]",
        
        // Hover State: Subtle border illumination and orange-tinted shadow
        "hover:border-white/20 hover:bg-white/[0.04] hover:shadow-[0_0_40px_rgba(234,88,12,0.1)]",
        
        // Responsive Spacing
        "data-[size=sm]:py-4 data-[size=sm]:gap-3 data-[size=sm]:rounded-2xl",
        className
      )}
      {...props}
    >
      {/* Internal Glass Highlight: Simulates light hitting the top edge */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />
      {props.children}
    </div>
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "relative group/card-header grid auto-rows-min items-start gap-2 px-8 group-data-[size=sm]/card:px-5",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "text-2xl leading-tight font-black tracking-tighter text-white group-data-[size=sm]/card:text-lg",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn(
        "text-sm text-neutral-400 font-medium leading-relaxed group-data-[size=sm]/card:text-xs", 
        className
      )}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("relative px-8 group-data-[size=sm]/card:px-5", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "relative mt-auto flex items-center border-t border-white/5 bg-white/[0.02] p-8 group-data-[size=sm]/card:p-5",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}