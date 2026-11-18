"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { createClass, startClass } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { AssignmentsCard } from "./assignments-card";
import TodoButton from "@/components/todo-button";

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [sessionTitle, setSessionTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isCreating) return;
    if (!sessionTitle.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a session title",
        variant: "destructive",
      });
      return;
    }

    const isInstructor = user?.role?.toLowerCase() === "instructor";
    if (!isInstructor) {
      toast({
        title: "Instructor Role Required",
        description: `Your account is registered as "${user?.role || "Student"}". You can switch your role to Instructor in Edit Profile.`,
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      const createRes = await createClass(sessionTitle.trim());
      const newClass = createRes.data?.data;
      if (!newClass?._id) throw new Error("Invalid response from server");
      await startClass(newClass._id);
      
      toast({
        title: "Session Created",
        description: "Your live session has been started successfully.",
      });
      setSessionTitle("");
      navigate(`/session/${newClass._id}`);
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || "Failed to start session";
      toast({ title: "Session Creation Failed", description: message, variant: "destructive" });
    } finally {
      setIsCreating(false);
    }
  };

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
                  {user?.fullname || "Instructor"}
                </span>
              </h2>
              <p className="text-neutral-400 text-lg md:text-xl font-medium">
                Ready to start a new session and engage your students?
              </p>
            </div>
            
            {/* Integrated Todo specifically styled for the Hero area */}
            <div className="bg-white/5 p-3 rounded-[2rem] border border-white/10 shadow-2xl backdrop-blur-md">
              <TodoButton />
            </div>
          </CardContent>
          
          {/* Subtle accent glows inside the card */}
          <div className="absolute -top-12 -right-12 size-64 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 size-48 bg-orange-500/10 blur-[80px] rounded-full pointer-events-none" />
        </Card>

        {/* Grid Section - Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Start Session Card */}
          <Card className="bg-white/3 border-white/10 backdrop-blur-3xl flex flex-col transition-all duration-300 hover:border-orange-500/20 shadow-2xl rounded-[1.5rem]">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-linear-to-br from-orange-500 via-yellow-500 to-white rounded-xl shadow-lg shadow-orange-500/20">
                  <BookOpen className="w-5 h-5 text-black" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold tracking-tight text-white">Start a Session</CardTitle>
                  <CardDescription className="text-neutral-400 font-medium">
                    Create a new live Q&A session.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="px-6 pb-8">
              <form onSubmit={handleCreateSession} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="session-title" className="text-xs uppercase font-black text-neutral-500 tracking-[0.2em]">
                    Session Title
                  </Label>
                  <Input
                    id="session-title"
                    placeholder="e.g. Intro to Biology"
                    value={sessionTitle}
                    onChange={(e) => setSessionTitle(e.target.value)}
                    disabled={isCreating}
                    className="bg-black/40 border-white/10 focus:border-orange-500/50 focus:ring-orange-500/20 h-14 text-white rounded-xl placeholder:text-neutral-600"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isCreating}
                  className="w-full h-12 bg-linear-to-r from-orange-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400 text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-orange-500/20"
                >
                  {isCreating ? "Creating..." : (
                    <>
                      Create Session <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Assignments Card */}
          <AssignmentsCard />

        </div>
      </div>
    </div>
  );
}