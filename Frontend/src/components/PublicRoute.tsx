import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import logo from "@/assets/logo.png";

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-dvh">
      {/* Dynamic Background Spotlight */}
<div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl opacity-[0.15] pointer-events-none">
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-from)_0%,transparent_65%)] from-orange-600 to-transparent blur-3xl" />
</div>

<div className="relative flex w-full max-w-105 flex-col items-center justify-center py-12 z-10">
  {/* Logo Loading Animation Container */}
  <div className="relative flex items-center justify-center">
    
    {/* 1. The Outer Glowing Ring (Optional - adds "energy") */}
    <div className="absolute w-24 h-24 border-2 border-orange-500/30 rounded-full animate-ping" />
    
    {/* 2. Your Logo */}
    <img 
      src={logo}
      alt="Loading..." 
      className="w-20 h-20 object-contain animate-pulse" 
      style={{
        filter: 'drop-shadow(0 0 10px rgba(234, 88, 12, 0.4))'
      }}
    />
    
    {/* 3. Spinning Accent (Orbits the logo) */}
    <div className="absolute w-28 h-28 border-t-2 border-orange-600 rounded-full animate-spin" />
  </div>

  {/* Optional Loading Text */}
  <p className="mt-6 text-orange-600/80 font-medium tracking-widest text-xs uppercase animate-pulse">
    Loading
  </p>
</div>
    </div>
  );

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
};

export default PublicRoute;