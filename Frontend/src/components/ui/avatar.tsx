import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

function Avatar({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> & {
  size?: "default" | "sm" | "lg"
}) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      className={cn(
        "group/avatar relative flex size-8 shrink-0 rounded-full select-none",
        // Dark border with subtle orange accent
        "border border-orange-500/30 bg-slate-900", 
        "data-[size=lg]:size-12 data-[size=sm]:size-6 data-[size=default]:size-10", // Responsive sizing
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn(
        "aspect-square size-full rounded-full object-cover",
        className
      )}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full font-bold uppercase",
        // Orange gradient that matches the theme
        "bg-linear-to-br from-orange-500 to-orange-600 text-white",
        // Subtle orange glow
        "shadow-[0_0_15px_-3px_rgba(249,115,22,0.4)]",
        "text-sm group-data-[size=sm]/avatar:text-[10px]",
        className
      )}
      {...props}
    />
  )
}

function AvatarBadge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        "absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full select-none",
        // Orange badge to match the theme
        "bg-linear-to-tr from-orange-500 to-orange-400 ring-2 ring-slate-900",
        "group-data-[size=sm]/avatar:size-2",
        "group-data-[size=default]/avatar:size-3",
        "group-data-[size=lg]/avatar:size-4",
        className
      )}
      {...props}
    />
  )
}

function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "group/avatar-group flex -space-x-3 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-zinc-800", // Adjusted for zinc bg
        className
      )}
      {...props}
    />
  )
}

function AvatarGroupCount({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        "relative flex shrink-0 items-center justify-center rounded-full font-bold",
        // Count also utilizes the full vibrant gradient
        "bg-linear-to-br bg-red-500 text-white",
        "border border-white/20 ring-2 ring-zinc-800",
        "size-10 group-has-data-[size=lg]/avatar-group:size-12 group-has-data-[size=sm]/avatar-group:size-6 text-xs",
        className
      )}
      {...props}
    />
  )
}

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarBadge,
}