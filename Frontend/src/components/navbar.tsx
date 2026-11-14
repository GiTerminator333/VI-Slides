"use client";

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DropdownMenuAvatar } from "./avatar-dropdown-menu";
import logo from "../assets/logo.png";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-500 border-b",
        isScrolled 
          ? "bg-zinc-900/40 backdrop-blur-xl border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]" 
          : "bg-transparent border-transparent"
      )}
    >
      {/* Dynamic accent line that glows on scroll */}
      <div 
        className={cn(
          "absolute -bottom-px left-0 right-0 h-px bg-linear-to-r from-transparent via-orange-500/40 to-transparent transition-opacity duration-500",
          isScrolled ? "opacity-100" : "opacity-0"
        )} 
      />

      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Section */}
        <Link 
          to="/dashboard" 
          className="flex items-center gap-3 group"
        >
          <div className="relative flex items-center justify-center">
            {/* Enhanced Glow */}
            <div className="absolute inset-0 bg-orange-500/40 blur-2xl rounded-full scale-50 opacity-0 group-hover:scale-125 group-hover:opacity-100 transition-all duration-700" />
            
            <div className="relative z-10 transition-transform duration-500 group-hover:scale-110">
              <img 
                src={logo}
                alt="VI-Slides Logo" 
                className="h-9 w-9 object-contain brightness-110" 
              />
            </div>
          </div>
  
          <div className="flex flex-col justify-center">
            <span className="text-xl font-black tracking-tighter transition-all duration-300 
              bg-linear-to-br from-orange-500 via-yellow-400 to-white 
              bg-clip-text text-transparent 
              group-hover:drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]">
              VI-SLIDES
            </span>
            
            <div className="h-0.5 w-0 bg-orange-500 transition-all duration-500 group-hover:w-full rounded-full" />
          </div>
        </Link>

        {/* Actions Section */}
        <div className="flex items-center gap-2">         
          <div className="flex items-center gap-4">     
            <div className="relative group p-1 rounded-full border border-white/5 bg-white/5 backdrop-blur-md transition-all duration-500 hover:border-orange-500/50 hover:bg-orange-500/5 hover:shadow-[0_0_20px_rgba(249,115,22,0.15)]">
              
              {/* Subtle Inner Highlight (The Glass Edge) */}
              <div className="absolute inset-0 rounded-full bg-linear-to-tr from-orange-500/10 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <DropdownMenuAvatar />
              </div>

              {/* Decorative Outer Ring on Hover */}
              <div className="absolute -inset-0.5 rounded-full border border-orange-500/20 scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500" />
            </div>
          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;