import * as React from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button" // Using our refined Button

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  onConfirm: () => void
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* Overlay - Darker and more blur for focus */}
        <Dialog.Overlay
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0"
        />

        {/* Content */}
        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-[95%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border p-8 shadow-2xl transition-all duration-300",
            "bg-[#111111] border-neutral-800 text-white", // Elite Dark theme
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            "data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
          )}
        >
          {/* Subtle Orange Glow in background */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-50" />

          <div className="relative z-10 space-y-6">
            <div className="space-y-2">
              <Dialog.Title className="text-2xl font-bold tracking-tight">
                {title}
              </Dialog.Title>

              {description && (
                <Dialog.Description className="text-neutral-400 text-sm leading-relaxed">
                  {description}
                </Dialog.Description>
              )}
            </div>

            {/* Actions - Using our themed buttons */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
              <Dialog.Close asChild>
                <Button variant="secondary" className="w-full sm:w-auto h-10 px-6">
                  Cancel
                </Button>
              </Dialog.Close>

              <Button
                variant="default"
                className="w-full sm:w-auto h-10 px-6"
                onClick={() => {
                  onConfirm()
                  onOpenChange(false)
                }}
              >
                Confirm
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}