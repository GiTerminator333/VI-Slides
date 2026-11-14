"use client"

import * as React from "react"
import { useState, useMemo } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { getAIAnswer } from "@/lib/api"
import { 
  MessageSquare, 
  ChevronDown, 
  Sparkles, 
  Send, 
  PlusCircle,
  Clock,
  CheckCircle2,
  ArrowRight
} from "lucide-react"
import { cn } from "@/lib/utils"

type Question = {
  id: string;
  question: string;
  answer?: string | null;
};

type AppSidebarProps = {
  questions: Question[];
  activeId?: string;
  onSelect: (id: string) => void;
  onAskQuestion: (text: string) => void;
  onAnswerQuestion: (id: string, answer: string) => void;
  role: "Student" | "Instructor";
};

/**
 * HELPER: Improved Parser for formatted answers
 */
function parseAnswerContent(text: string) {
  return text.split("\n").map((line, i) => {
    if (line.startsWith("## ")) {
      return <h2 key={i} className="text-sm font-bold text-orange-500 mt-3 mb-1">{line.slice(3)}</h2>
    }
    if (line.startsWith("- ")) {
      return (
        <div key={i} className="flex gap-2 mb-1.5 items-start">
          <div className="w-1.5 h-1.5 rounded-full bg-orange-500/60 mt-1.5 shrink-0" />
          <p className="text-xs text-zinc-300 leading-relaxed">
            {line.slice(2).split(/\*\*(.+?)\*\*/).map((part, j) => 
              j % 2 === 1 ? <strong key={j} className="text-zinc-100">{part}</strong> : part
            )}
          </p>
        </div>
      )
    }
    if (!line.trim()) return <div key={i} className="h-2" />;
    return (
      <p key={i} className="text-xs text-zinc-400 mb-2 leading-relaxed">
        {line.split(/\*\*(.+?)\*\*/).map((part, j) => 
          j % 2 === 1 ? <strong key={j} className="text-zinc-100">{part}</strong> : part
        )}
      </p>
    );
  });
}

export function AppSidebar({
  questions,
  activeId,
  onSelect,
  onAskQuestion,
  onAnswerQuestion,
  role,
}: AppSidebarProps) {
  const [input, setInput] = useState("");
  const [answer, setAnswer] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const activeQuestion = useMemo(() => questions.find((q) => q.id === activeId), [questions, activeId]);

  const handleAIAnswer = async () => {
    if (!activeQuestion) return;
    try {
      setLoading(true);
      const res = await getAIAnswer(activeQuestion.question);
      const raw = res.data?.answer;
      if (raw) {
        setAnswer(raw.trim());
        toast({ title: "Magic happened ✨", description: "AI drafted a response for you." });
      }
    } catch (err) {
      toast({ title: "Generation Failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="border-r border-zinc-800 bg-zinc-950">
      {/* HEADER */}
      <SidebarHeader className="p-4 border-b border-zinc-900">
        <div className="flex items-center justify-between group-data-[state=collapsed]:justify-center">
          <div className="flex items-center gap-3 group-data-[state=collapsed]:hidden">
            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
              <MessageSquare size={18} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-zinc-100 leading-none">Live Forum</h2>
              <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-tighter font-medium">Real-time Q&A</p>
            </div>
          </div>
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-orange-500">
            {questions.length}
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="scrollbar-none">
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 py-4 text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] group-data-[state=collapsed]:hidden">
            Discussion Queue
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu className="gap-2 px-2">
              {questions.map((q) => {
                const isActive = activeId === q.id;
                const isExpanded = expandedId === q.id;

                return (
                  <SidebarMenuItem key={q.id}>
                    <div className={cn(
                      "rounded-xl transition-all duration-200 border",
                      isActive 
                        ? "bg-zinc-900 border-orange-500/30 ring-1 ring-orange-500/20" 
                        : "bg-transparent border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/50"
                    )}>
                      <SidebarMenuButton
                        onClick={() => {
                          onSelect(q.id);
                          setExpandedId(prev => prev === q.id ? null : q.id);
                        }}
                        className="h-auto w-full p-3 items-start group-data-[state=collapsed]:p-2"
                      >
                        <div className="flex gap-3 w-full items-start">
                          <div className={cn(
                            "mt-0.5 shrink-0 rounded-full p-1",
                            q.answer ? "text-emerald-500 bg-emerald-500/10" : "text-orange-500 bg-orange-500/10"
                          )}>
                            {q.answer ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                          </div>
                          
                          <div className="flex-1 min-w-0 group-data-[state=collapsed]:hidden text-left">
                            <span className={cn(
                              "text-xs block leading-relaxed line-clamp-2",
                              isActive ? "text-zinc-100 font-medium" : "text-zinc-400"
                            )}>
                              {q.question}
                            </span>
                          </div>

                          <ChevronDown 
                            size={14} 
                            className={cn(
                              "mt-1 transition-transform group-data-[state=collapsed]:hidden text-zinc-600",
                              isExpanded && "rotate-180 text-orange-500"
                            )} 
                          />
                        </div>
                      </SidebarMenuButton>

                      {isExpanded && isActive && (
                        <div className="px-3 pb-3 pt-0 space-y-3 group-data-[state=collapsed]:hidden">
                          <div className="h-px bg-zinc-800 w-full mb-2" />
                          
                          <div className="text-[13px] text-zinc-200 leading-normal bg-zinc-950/50 p-2 rounded-lg border border-zinc-800/50">
                            {q.question}
                          </div>

                          {q.answer ? (
                            <div className="relative pl-3 border-l-2 border-orange-500/30">
                              <div className="max-h-60 overflow-y-auto pr-1">
                                {parseAnswerContent(q.answer)}
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-[11px] text-zinc-500 bg-zinc-950 p-2 rounded-md border border-dashed border-zinc-800">
                              <Sparkles size={12} className="text-orange-500/50" />
                              <span>Waiting for expert response...</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter className="p-4 border-t border-zinc-900 bg-zinc-950 group-data-[state=collapsed]:hidden">
        {role === "Student" && (
          <div className="space-y-3">
            <div className="relative">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask the instructor..."
                className="bg-zinc-900 border-zinc-800 text-xs min-h-[100px] rounded-xl focus-visible:ring-orange-500/30 resize-none placeholder:text-zinc-600"
              />
              <div className="absolute bottom-2 right-2 text-[10px] text-zinc-600 font-mono">
                {input.length}/500
              </div>
            </div>
            <Button
              onClick={() => {
                if (!input.trim()) return;
                onAskQuestion(input);
                setInput("");
              }}
              className="w-full text-orange-500 rounded-xl h-10 text-xs font-bold gap-2 border border-orange-500"
            >
              <PlusCircle size={14} />
              Submit Question
            </Button>
          </div>
        )}

        {role === "Instructor" && activeQuestion && (
          <div className="space-y-3">
            {/* FUNCTIONALITY RESTORED: "Now Answering" Context */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-2.5">
              <div className="flex items-center gap-1.5 mb-1">
                <ArrowRight size={10} className="text-orange-500" />
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Answering</span>
              </div>
              <p className="text-[11px] text-zinc-300 line-clamp-2 italic leading-relaxed">
                "{activeQuestion.question}"
              </p>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Your Response</span>
              <Button
                variant="ghost"
                onClick={handleAIAnswer}
                disabled={loading}
                className="h-7 text-[10px] gap-1.5 px-2 bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border border-orange-500/20 rounded-md"
              >
                <Sparkles size={12} />
                {loading ? "Thinking..." : "Ask AI"}
              </Button>
            </div>

            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer or use AI..."
              className="bg-zinc-900 border-zinc-800 text-xs min-h-[120px] rounded-xl focus-visible:ring-orange-500/30 resize-none"
            />

            {/* UI FIXED: Send Answer color and styling */}
            <Button
              onClick={() => {
                if (!answer.trim()) return;
                onAnswerQuestion(activeQuestion.id, answer);
                setAnswer("");
              }}
              className="w-full bg-zinc-50 hover:bg-white text-orange-500 rounded-xl h-10 text-xs font-bold gap-2 shadow-[0_0_20px_rgba(249,115,22,0.1)] border-b-2 border-orange-600 active:border-b-0 transition-all"
            >
              <Send size={14} className="text-orange-500" />
              Send Answer
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}