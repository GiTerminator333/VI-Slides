import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { cn } from "@/lib/utils"
import { CheckIcon, ChevronRightIcon } from "lucide-react"

function DropdownMenu({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

function DropdownMenuPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  return <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
}

function DropdownMenuTrigger({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return <DropdownMenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />
}

function DropdownMenuContent({
  className,
  align = "end",
  sideOffset = 12,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        align={align}
        className={cn(
          "z-50 min-w-48 overflow-hidden rounded-2xl p-1.5 text-white shadow-[0_20px_50px_rgba(0,0,0,0.4)]",
          "bg-linear-to-br from-orange-500 via-white to-red-500",
          "backdrop-blur-2xl backdrop-saturate-150 border border-white",
          "animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "relative flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 text-sm outline-none select-none transition-all",
        // Glassmorphic hover and focus state - brighter white overlay
        "hover:bg-white/30 focus:bg-white/30 hover:backdrop-blur-md focus:backdrop-blur-md",
        "border border-transparent hover:border-white/30 focus:border-white/30",
        "hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.3)]",
        // Destructive variant
        "data-[variant=destructive]:text-red-400 data-[variant=destructive]:hover:bg-red-500/30 data-[variant=destructive]:focus:bg-red-500/30 data-[variant=destructive]:hover:border-red-500/40 data-[variant=destructive]:focus:border-red-500/40",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        "[&_svg]:size-4 [&_svg]:shrink-0",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      className={cn(
        "relative flex cursor-default items-center rounded-xl py-2 pl-3 pr-8 text-sm outline-none select-none transition-all",
        "hover:bg-white/30 focus:bg-white/30 hover:backdrop-blur-md focus:backdrop-blur-md",
        "border border-transparent hover:border-white/30 focus:border-white/30",
        "hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.3)]",
        className
      )}
      checked={checked}
      {...props}
    >
      {children}
      <span className="absolute right-3 flex h-3.5 w-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon className="size-4 stroke-3 text-orange-400" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
    </DropdownMenuPrimitive.CheckboxItem>
  )
}

function DropdownMenuLabel({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label>) {
  return (
    <DropdownMenuPrimitive.Label
      className={cn("px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/50", className)}
      {...props}
    />
  )
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      className={cn("-mx-1.5 my-1.5 h-px bg-white", className)}
      {...props}
    />
  )
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest text-white/40 font-mono", className)}
      {...props}
    />
  )
}

function DropdownMenuSubTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger>) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      className={cn(
        "flex cursor-default items-center gap-2 rounded-xl px-3 py-2 text-sm outline-none focus:bg-white data-[state=open]:bg-white/20 transition-colors",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto size-4 opacity-50" />
    </DropdownMenuPrimitive.SubTrigger>
  )
}

function DropdownMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  return (
    <DropdownMenuPrimitive.SubContent
      className={cn(
        "z-50 min-w-40 overflow-hidden rounded-2xl p-1.5 text-white shadow-2xl",
        "bg-linear-to-br from-orange-400 via-white to-yellow-400",
        "backdrop-blur-2xl border border-white/20 animate-in fade-in-0 zoom-in-95",
        className
      )}
      {...props}
    />
  )
}

const DropdownMenuSub = DropdownMenuPrimitive.Sub
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup
}