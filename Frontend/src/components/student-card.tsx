"use client";

import { Award, ClipboardList, ArrowRight, Video } from "lucide-react";
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
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { joinClass } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";

// ===================== CERTIFICATES =====================
export function CertificatesCard() {
  const certificates: any[] = [];

  return (
    <Card className="bg-white/3 border-white/10 backdrop-blur-3xl h-full flex flex-col transition-all duration-300 hover:border-orange-500/20 shadow-2xl">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-linear-to-br from-orange-500 via-yellow-500 to-white rounded-xl shadow-lg shadow-orange-500/20">
            <Award className="w-5 h-5 text-black" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold tracking-tight text-white">Certificates</CardTitle>
            <CardDescription className="text-neutral-400 font-medium">
              View your achievements.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col flex-1 justify-between px-6 pb-8">
        <div className="flex-1 min-h-10" />
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full h-12 bg-linear-to-r from-orange-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400 text-black font-bold rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-orange-500/10">
              View Certificates
            </Button>
          </DialogTrigger>

          <DialogContent className="bg-[#0A0A0A]/95 border-white/10 backdrop-blur-2xl max-w-xl p-0 overflow-hidden text-white rounded-[2rem]">
            <div className="p-8 border-b border-white/5 bg-linear-to-b from-white/5 to-transparent">
              <DialogHeader>
                <DialogTitle className="text-3xl font-black tracking-tighter">
                  Your <span className="bg-linear-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">Achievements</span>
                </DialogTitle>
                <p className="text-neutral-400 font-medium mt-2">
                  Track your progress and download your earned rewards.
                </p>
              </DialogHeader>
            </div>

            <div className="p-8">
              {certificates.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="p-6 rounded-full bg-orange-500/5 border border-orange-500/10 mb-6 relative">
                    <div className="absolute inset-0 bg-orange-500/20 blur-2xl rounded-full" />
                    <Award className="w-12 h-12 text-orange-500 relative z-10" />
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight">No Certificates Yet</h3>
                  <p className="text-neutral-500 mt-2 max-w-xs leading-relaxed">
                    Attend live sessions and complete activities to unlock your professional credentials.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {certificates.map((cert, index) => (
                    <div key={index} className="bg-white/5 border border-white/10 flex items-center justify-between p-5 rounded-2xl transition-colors hover:bg-white/10">
                      <div>
                        <p className="font-bold text-lg tracking-tight">{cert.title}</p>
                        <p className="text-sm text-neutral-500 font-medium">Issued recently</p>
                      </div>
                      <Button className="bg-white text-black hover:bg-neutral-200 font-bold h-10 px-6 rounded-lg transition-all">
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

// ===================== ASSIGNMENTS =====================
export function AssignmentsCard() {
  const navigate = useNavigate();

  return (
    <Card className="bg-white/3 border-white/10 backdrop-blur-3xl h-full flex flex-col transition-all duration-300 hover:border-orange-500/20 shadow-2xl">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-linear-to-br from-orange-500 via-yellow-500 to-white rounded-xl shadow-lg shadow-orange-500/20">
            <ClipboardList className="w-5 h-5 text-black" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold tracking-tight text-white">Assignments</CardTitle>
            <CardDescription className="text-neutral-400 font-medium">
              View and submit tasks.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col flex-1 justify-between px-6 pb-8">
        <div className="flex-1 min-h-10" />
        <Button
          className="w-full h-12 bg-linear-to-r from-orange-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400 text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-orange-500/10"
          onClick={() => navigate("/assignment")}
        >
          View Assignments <ArrowRight className="w-4 h-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

// ===================== JOIN SESSION =====================
export function JoinSessionCard() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleJoin = async () => {
    if (!code.trim()) {
      toast({ title: "Error", description: "Enter session code", variant: "destructive" });
      return;
    }

    try {
      setLoading(true);
      const res = await joinClass(code.trim());
      const classId = res.data?.classId;
      if (!classId) throw new Error("Invalid session");
      toast({ title: "Joined!", description: "Welcome to the session." });
      navigate(`/session/${classId}`);
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || "Invalid session code";
      toast({ title: "Failed", description: errorMsg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-white/3 border-white/10 backdrop-blur-3xl h-full flex flex-col transition-all duration-300 hover:border-orange-500/20 shadow-2xl">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-linear-to-br from-orange-500 via-yellow-500 to-white rounded-xl shadow-lg shadow-orange-500/20">
            <Video className="w-5 h-5 text-black" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold tracking-tight text-white">Join Session</CardTitle>
            <CardDescription className="text-neutral-400 font-medium">
              Enter the 6-digit code.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col flex-1 px-6 pb-8">
        <div className="space-y-4 mb-6 mt-2">
          <div className="grid gap-3">
            <Label htmlFor="code" className="text-xs uppercase font-black text-neutral-500 tracking-[0.2em]">
              Session Code
            </Label>
            <Input
              id="code"
              placeholder="E.G. AB1234"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              disabled={loading}
              className="bg-black/40 border-white/10 focus:border-orange-500/50 focus:ring-orange-500/20 h-14 text-white font-mono text-center text-lg tracking-[0.5em] rounded-xl"
            />
          </div>
        </div>

        <Button
          className="w-full h-12 bg-linear-to-r from-orange-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400 text-black font-bold rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-orange-500/20"
          onClick={handleJoin}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Join Session"}
        </Button>
      </CardContent>
    </Card>
  );
}