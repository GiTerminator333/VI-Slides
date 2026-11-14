import { cn } from "@/lib/utils";
import React from "react";
import logo from "@/assets/logo.png"; 

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

const Logo = ({ className, iconOnly = false }: LogoProps) => {
  return (
    <div
      className={cn(
        "group flex items-center gap-3 select-none cursor-pointer",
        className
      )}
    >
      {/* Visual Icon Element with Enhanced Glow */}
      <div className="relative flex items-center justify-center">
        {/* Enhanced Glow: Spread on hover */}
        <div className="absolute inset-0 bg-orange-500/40 blur-2xl rounded-full scale-50 opacity-0 group-hover:scale-125 group-hover:opacity-100 transition-all duration-700" />
        
        {/* Logo Container */}
        <div className="relative z-10 transition-transform duration-500 group-hover:scale-110">
          <img 
            src={logo}
            alt="VI-Slides Logo" 
            className="h-9 w-9 object-contain brightness-110" 
          />
        </div>
      </div>

      {/* Typography Section */}
      {!iconOnly && (
        <div className="flex flex-col justify-center">
          <span className="text-xl font-black tracking-tighter transition-all duration-300 
            bg-linear-to-br from-orange-500 via-yellow-400 to-white 
            bg-clip-text text-transparent 
            group-hover:drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]">
            VI-SLIDES
          </span>
          
          {/* Animated Underline */}
          <div className="h-0.5 w-0 bg-orange-500 transition-all duration-500 group-hover:w-full rounded-full" />
        </div>
      )}
    </div>
  );
};

export default Logo;