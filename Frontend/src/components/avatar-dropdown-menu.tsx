"use client";

import * as React from "react"
import { useNavigate } from "react-router-dom"
import { LogOutIcon, PencilIcon } from "lucide-react"

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/context/AuthContext"
import { cn } from "@/lib/utils"

export function DropdownMenuAvatar() {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const initials =
    user?.fullname
      ?.split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "NA"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-11 w-11 rounded-full p-0 transition-all duration-300 hover:scale-110 active:scale-95 group outline-none"
        >
          <div className="absolute inset-0 rounded-full bg-linear-to-tr from-orange-500 to-yellow-400 blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
          
          <Avatar className="h-10 w-10 border border-orange-500/40 shadow-lg relative z-10">
            <AvatarFallback className="bg-linear-to-br from-orange-500 to-orange-600 text-white font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        align="end" 
        sideOffset={12}
        className="w-64 border border-white/20 bg-zinc-900/40 backdrop-blur-2xl backdrop-saturate-150 text-white shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-top-2 duration-300 rounded-2xl overflow-hidden"
      >
        <DropdownMenuLabel className="p-5 pb-4 border-b border-white/10">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-base font-bold text-white tracking-tight leading-none pt-1 truncate">{user?.fullname}</p>
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0",
                user?.role?.toLowerCase() === "instructor"
                  ? "bg-orange-500/10 text-orange-400 border-orange-500/30"
                  : "bg-blue-500/10 text-blue-400 border-blue-500/30"
              )}>
                {user?.role || "Student"}
              </span>
            </div>
            <p className="text-xs font-medium text-white/40 truncate">{user?.email}</p>
          </div>
        </DropdownMenuLabel>

        <div className="p-1.5 space-y-1">
          {/* GLASS HOVER ITEM */}
          <DropdownMenuItem
            className={cn(
              "group relative flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-sm text-white transition-all duration-300 outline-none",
              "hover:bg-white/10 focus:bg-white/10 hover:backdrop-blur-md focus:backdrop-blur-md",
              "border border-transparent hover:border-white/20 focus:border-white/20",
              "hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
            )}
            onSelect={() => navigate("/edit-profile")}
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-orange-500/20 transition-all group-hover:bg-orange-500/40 group-hover:scale-110">
              <PencilIcon className="size-4 text-orange-400 group-hover:text-orange-300" />
            </div>
            <span className="font-medium">Edit Profile</span>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="bg-white/10 mx-0" />

        <div className="p-1.5">
          {/* DESTRUCTIVE GLASS HOVER */}
          <DropdownMenuItem
            className={cn(
              "group relative flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-sm text-white transition-all duration-300 outline-none",
              "hover:bg-red-500/20 focus:bg-red-500/20 hover:backdrop-blur-md focus:backdrop-blur-md",
              "border border-transparent hover:border-red-500/30 focus:border-red-500/30"
            )}
            onSelect={(e) => {
              e.preventDefault()
              logout()
            }}
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-red-500/20 transition-all group-hover:bg-red-500/40 group-hover:scale-110">
              <LogOutIcon className="size-4 text-red-400 group-hover:text-red-300" />
            </div>
            <span className="font-medium">Logout</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}