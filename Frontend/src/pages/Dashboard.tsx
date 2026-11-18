"use client";

import { useAuth } from "@/context/AuthContext";
import TeacherDashboard from "@/components/teacher-dashboard";
import Navbar from "@/components/navbar";
import StudentDashboard from "@/components/student-dashboard";
import React from "react";

export default function Dashboard() {
  const { user } = useAuth();
  const isInstructor = user?.role?.toLowerCase() === "instructor";

  return (
    <div className="relative min-h-screen w-full text-white selection:bg-orange-500/30 overflow-x-hidden bg-[#050508]">
      
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-linear-to-br from-[#0a0a1a] via-[#080812] to-[#0d0d1a]" />
        
        <div 
          className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[140%] h-[80%] rounded-[100%] opacity-30 blur-[120px] pointer-events-none"
          style={{
            background: "radial-gradient(circle at center, #4f46e5 0%, #f97316 40%, transparent 80%)",
          }}
        />

        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-600/10 blur-[120px] rounded-full" />
      </div>

      <div 
        className="fixed inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(circle at center, white 10%, transparent 90%)',
          WebkitMaskImage: 'radial-gradient(circle at center, white 10%, transparent 90%)',
        }}
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-1 pt-24 pb-12 px-4 md:px-8">
          <section className="max-w-5xl mx-auto text-center mb-16 space-y-6">
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-neutral-300 backdrop-blur-xl shadow-2xl">
              <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_#f97316]" />
              Intelligence for Collaboration
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter bg-linear-to-b from-white via-white to-white/20 bg-clip-text text-transparent">
              {isInstructor ? "Instructor Space" : "Student Space"}
            </h1>
            
            <p className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed"> 
              {isInstructor 
                ? "Manage your live sessions and students with precision." 
                : "Track your progress and join live rooms in real-time."}
            </p>
          </section>

            {/* The wrapper now uses a very slight tint instead of black */}
            <div>
              {isInstructor ? (
                <TeacherDashboard />
              ) : (
                <StudentDashboard />
              )}
            </div>
        </main>
      </div>

      {/* 4. FOOTER BLOOM (Warmth at the bottom) */}
      <div className="fixed bottom-0 left-0 right-0 h-64 bg-linear-to-t from-orange-500/10 to-transparent pointer-events-none z-0" />
    </div>
  );
}