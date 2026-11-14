"use client";

import { useEffect, useState } from "react";
import { ClipboardList, ArrowLeft, Calendar, User, Award, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { getAssignments, type Assignment } from "@/lib/api";
import React from "react";

export default function AssignmentPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await getAssignments();
        setAssignments(res.data.assignments);
      } catch (err) {
        const errorMsg = "Failed to load assignments.";
        setError(errorMsg);
        toast({
          title: "Load Failed",
          description: errorMsg,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [toast]);

  return (
    <div className="relative flex flex-col min-h-dvh bg-[#070707] selection:bg-orange-500/30 overflow-hidden">
      
      {/* Dynamic Background Spotlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl opacity-[0.1] pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-from)_0%,transparent_70%)] from-orange-600 to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-4xl px-4 py-12 flex flex-col gap-8 animate-in fade-in duration-700">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight bg-linear-to-br from-orange-500 via-yellow-400 to-white bg-clip-text text-transparent">
              Assignments
            </h1>
            <p className="mt-1 text-zinc-500 font-medium">
              Manage and submit your upcoming coursework.
            </p>
          </div>
          <Button 
            variant="ghost" 
            className="text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all group"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="mr-2 size-4 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Button>
        </div>

        {/* Content States */}
        {loading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 w-full rounded-xl bg-zinc-900/50 border border-zinc-800 animate-pulse" />
            ))}
          </div>

        ) : error ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
             <div className="size-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                <p className="text-red-500 text-2xl font-bold">!</p>
             </div>
            <p className="text-zinc-400 text-lg font-medium">{error}</p>
            <Button variant="link" className="text-orange-500" onClick={() => window.location.reload()}>Try again</Button>
          </div>

        ) : assignments.length === 0 ? (
          <Card className="border-zinc-800 bg-zinc-900/40 backdrop-blur-xl border-dashed py-12">
            <CardHeader className="items-center text-center">
              <div className="size-16 rounded-2xl bg-zinc-800/50 flex items-center justify-center mb-4">
                <ClipboardList className="size-8 text-zinc-600" />
              </div>
              <CardTitle className="text-xl font-bold text-white">
                No assignments yet
              </CardTitle>
              <CardDescription className="text-zinc-500 max-w-xs">
                Your workspace is empty. Check back later for tasks assigned by your instructor.
              </CardDescription>
            </CardHeader>
          </Card>

        ) : (
          <div className="flex flex-col gap-4">
            {assignments.map((a) => (
              <Card 
                key={a._id} 
                className="group relative border-zinc-800 bg-zinc-900/40 backdrop-blur-xl hover:border-orange-500/40 transition-all hover:shadow-[0_0_30px_rgba(249,115,22,0.1)] overflow-hidden"
              >
                {/* Side highlight effect on hover */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <CardTitle className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors">
                        {a.title}
                      </CardTitle>
                      <CardDescription className="text-zinc-400 line-clamp-2">
                        {a.description}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end shrink-0 pt-1">
                      <div className="flex items-center text-[10px] font-bold uppercase tracking-widest text-orange-500 mb-1">
                        <Calendar className="size-3 mr-1" />
                        Due: {new Date(a.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-6">
                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-1.5 text-sm text-zinc-500">
                      <User className="size-3.5" />
                      <span className="text-zinc-300 font-medium">{a.createdBy?.fullname}</span>
                    </div>
                    <div className="hidden sm:block size-1 rounded-full bg-zinc-700" />
                    <div className="flex items-center gap-1.5 text-sm text-zinc-500">
                      <Award className="size-3.5" />
                      <span>Marks: <span className="text-zinc-300 font-medium">{a.maxMarks}</span></span>
                    </div>
                  </div>

                  <Button
                    className="bg-orange-600 hover:bg-orange-500 text-white font-bold transition-all active:scale-95 group/btn shrink-0"
                    onClick={() => navigate(`/assignment/${a._id}`)}
                  >
                    View & Submit
                    <ChevronRight className="ml-1 size-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}