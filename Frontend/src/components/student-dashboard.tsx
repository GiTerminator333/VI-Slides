"use client";

import { CertificatesCard, AssignmentsCard, JoinSessionCard } from "./student-card";
import { useAuth } from "@/context/AuthContext";
import NotificationBell from "@/components/NotificationBell";
import { Card, CardContent } from "@/components/ui/card";
import TodoButton from "@/components/todo-button";
import React from "react";

export default function StudentDashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen text-white antialiased">
      <div className="mx-auto max-w-7xl px-6 py-4">
        
        {/* Welcome Section - Integrated Actions & High-End Glass UI */}
        <Card className="bg-white/2 border-white/5 backdrop-blur-3xl mb-12 overflow-hidden relative">
          <CardContent className="py-12 px-8 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <h2 className="text-5xl md:text-6xl font-bold tracking-tighter mb-3">
                Welcome back,{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-white">
                  {user?.fullname || "Student"}
                </span>
              </h2>
              <p className="text-neutral-400 text-lg md:text-xl font-medium">
                You have no upcoming sessions today. Join a live room to get started!
              </p>
            </div>
            
            {/* Integrated Todo & Notifications */}
            <div className="flex items-center gap-4 bg-white/5 p-3 rounded-[2rem] border border-white/10 shadow-2xl backdrop-blur-md">
              <TodoButton />
              <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-black/40 border border-white/10 hover:border-orange-500/50 hover:text-orange-500 transition-all cursor-pointer">
                <NotificationBell />
              </div>
            </div>
          </CardContent>
          
          {/* Decorative accent glow */}
          <div className="absolute -top-12 -right-12 size-64 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 size-48 bg-orange-500/10 blur-[80px] rounded-full pointer-events-none" />
        </Card>

        {/* Action Cards Grid - Premium Spacing & Glass wrappers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Join Session */}
          <JoinSessionCard />

          {/* Assignments */}
          <AssignmentsCard />

          {/* Certificates */}
          <CertificatesCard />
        </div>

      </div>
    </div>
  );
}