"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ListTodo, ArrowRight } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

export function AssignmentsCard() {
  const navigate = useNavigate();

  return (
    <Card className="bg-white/3 border-white/10 backdrop-blur-3xl flex flex-col h-full transition-all duration-300 hover:border-orange-500/20 shadow-2xl rounded-[1.5rem]">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-4">
          {/* Icon Box with the Orange-Yellow-White Schema */}
          <div className="p-2.5 bg-linear-to-br from-orange-500 via-yellow-500 to-white rounded-xl shadow-lg shadow-orange-500/20">
            <ListTodo className="w-5 h-5 text-black" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold tracking-tight text-white">
              Assignments
            </CardTitle>
            <CardDescription className="text-neutral-400 font-medium">
              Create and manage student assignments.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-8 flex flex-col flex-1 justify-between">
        <div className="flex-1 min-h-10" />

        <Button
          onClick={() => navigate("/assignments")}
          className="w-full h-12 bg-linear-to-r from-orange-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400 text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-orange-500/20"
        >
          Manage Assignments
          <ArrowRight className="w-4 h-4" />
        </Button>
      </CardContent>
    </Card>
  );
}