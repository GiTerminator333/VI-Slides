"use client";

import * as React from "react";
import { useState, useMemo, useRef, useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { getAIAnswer } from "@/lib/api";
import {
  MessageSquare,
  ChevronDown,
  Sparkles,
  Send,
  PlusCircle,
  Clock,
  CheckCircle2,
  ArrowRight,
  Bot,
  Users,
  Copy,
  Share2,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Question = {
  id: string | number;
  question: string;
  answer?: string | null;
  studentId?: string;
};

type AIMessage = {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: number;
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
 * Robust Markdown & Code Block Renderer
 */
function MarkdownView({ content }: { content: string }) {
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-2 text-xs leading-relaxed text-zinc-300">
      {parts.map((part, idx) => {
        if (part.startsWith("```") && part.endsWith("```")) {
          const lines = part.slice(3, -3).trim().split("\n");
          const lang = lines[0]?.match(/^[a-zA-Z0-9_-]+$/) ? lines[0] : "";
          const code = (lang ? lines.slice(1) : lines).join("\n");
          return (
            <div
              key={idx}
              className="my-2 rounded-lg bg-zinc-950 border border-zinc-800 overflow-hidden font-mono text-[11px]"
            >
              {lang && (
                <div className="px-3 py-1 bg-zinc-900/80 border-b border-zinc-800 text-[10px] uppercase text-zinc-500 font-bold">
                  {lang}
                </div>
              )}
              <pre className="p-3 overflow-x-auto text-orange-300 scrollbar-thin">
                <code>{code}</code>
              </pre>
            </div>
          );
        }

        return (
          <div key={idx} className="space-y-1.5">
            {part.split("\n").map((line, lineIdx) => {
              const trimmed = line.trim();
              if (!trimmed) return <div key={lineIdx} className="h-1.5" />;

              if (trimmed.startsWith("### ")) {
                return (
                  <h4
                    key={lineIdx}
                    className="text-xs font-bold text-zinc-200 mt-2 mb-1"
                  >
                    {trimmed.slice(4)}
                  </h4>
                );
              }
              if (trimmed.startsWith("## ")) {
                return (
                  <h3
                    key={lineIdx}
                    className="text-sm font-extrabold text-orange-400 mt-2.5 mb-1"
                  >
                    {trimmed.slice(3)}
                  </h3>
                );
              }
              if (trimmed.startsWith("# ")) {
                return (
                  <h2
                    key={lineIdx}
                    className="text-sm font-black text-orange-500 mt-3 mb-1"
                  >
                    {trimmed.slice(2)}
                  </h2>
                );
              }

              // Bullet points
              if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
                return (
                  <div
                    key={lineIdx}
                    className="flex items-start gap-2 ml-1 my-0.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500/70 mt-1.5 shrink-0" />
                    <span className="text-zinc-300">
                      {renderInlineFormatting(trimmed.slice(2))}
                    </span>
                  </div>
                );
              }

              // Numbered lists
              const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
              if (numMatch) {
                return (
                  <div
                    key={lineIdx}
                    className="flex items-start gap-2 ml-1 my-0.5"
                  >
                    <span className="text-orange-500 font-bold font-mono text-[10px] mt-0.5 shrink-0">
                      {numMatch[1]}.
                    </span>
                    <span className="text-zinc-300">
                      {renderInlineFormatting(numMatch[2])}
                    </span>
                  </div>
                );
              }

              // Blockquotes
              if (trimmed.startsWith("> ")) {
                return (
                  <blockquote
                    key={lineIdx}
                    className="border-l-2 border-orange-500/50 pl-2.5 py-0.5 my-1 text-zinc-400 italic bg-zinc-900/30 rounded-r"
                  >
                    {renderInlineFormatting(trimmed.slice(2))}
                  </blockquote>
                );
              }

              return (
                <p key={lineIdx} className="text-zinc-300">
                  {renderInlineFormatting(trimmed)}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function renderInlineFormatting(text: string) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((seg, i) => {
    if (seg.startsWith("`") && seg.endsWith("`")) {
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 mx-0.5 rounded bg-zinc-900 border border-zinc-800 text-orange-400 font-mono text-[11px]"
        >
          {seg.slice(1, -1)}
        </code>
      );
    }
    if (seg.startsWith("**") && seg.endsWith("**")) {
      return (
        <strong key={i} className="font-bold text-zinc-100">
          {seg.slice(2, -2)}
        </strong>
      );
    }
    return seg;
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
  const [tab, setTab] = useState<"bot" | "forum">("bot");
  const [forumInput, setForumInput] = useState("");
  const [botInput, setBotInput] = useState("");
  const [answerInput, setAnswerInput] = useState("");
  const [expandedId, setExpandedId] = useState<string | number | null>(null);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiChat, setAiChat] = useState<AIMessage[]>([
    {
      id: "welcome",
      sender: "ai",
      text: "👋 Hi! I'm your **Vi-Slides AI Teaching Assistant** powered by Gemini.\n\nAsk me any doubt about today's lecture, slides, or code, and I will explain it step-by-step!",
      timestamp: Date.now(),
    },
  ]);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const activeQuestion = useMemo(
    () => questions.find((q) => String(q.id) === String(activeId)),
    [questions, activeId]
  );

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [aiChat]);

  // Ask AI Directly (Chatbot tab)
  const handleAskAI = async () => {
    if (!botInput.trim() || aiGenerating) return;

    const userText = botInput.trim();
    const userMsg: AIMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: userText,
      timestamp: Date.now(),
    };

    setAiChat((prev) => [...prev, userMsg]);
    setBotInput("");
    setAiGenerating(true);

    try {
      const res = await getAIAnswer(userText);
      const reply = res.data?.answer || "No response received from AI.";
      const aiMsg: AIMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: reply.trim(),
        timestamp: Date.now(),
      };
      setAiChat((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.details ||
        err?.response?.data?.error ||
        "AI doubt resolution failed. Please verify your GEMINI_API_KEY in Backend/.env";
      setAiChat((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "ai",
          text: `⚠️ **AI Generation Error**: ${errorMsg}`,
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setAiGenerating(false);
    }
  };

  // Instructor AI Draft Answer
  const handleAIDraftForQuestion = async () => {
    if (!activeQuestion) return;
    try {
      setAiGenerating(true);
      const res = await getAIAnswer(activeQuestion.question);
      const raw = res.data?.answer;
      if (raw) {
        setAnswerInput(raw.trim());
        toast({
          title: "AI Response Ready ✨",
          description: "Review or edit the answer before sending.",
        });
      }
    } catch (err) {
      toast({
        title: "AI Generation Failed",
        description: "Please check backend AI configuration.",
        variant: "destructive",
      });
    } finally {
      setAiGenerating(false);
    }
  };

  // Student / Anyone asks AI to explain an unanswered forum question
  const handleExplainQuestionWithAI = async (q: Question) => {
    try {
      setAiGenerating(true);
      const res = await getAIAnswer(q.question);
      const raw = res.data?.answer;
      if (raw) {
        onAnswerQuestion(String(q.id), `🤖 *AI Assistant Explanation:*\n\n${raw.trim()}`);
        toast({
          title: "Question Answered ✨",
          description: "AI explanation posted to class queue.",
        });
      }
    } catch (err) {
      toast({
        title: "Explanation Failed",
        variant: "destructive",
      });
    } finally {
      setAiGenerating(false);
    }
  };

  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      className="border-r border-zinc-800 bg-zinc-950 flex flex-col h-full"
    >
      {/* HEADER & TAB CONTROLS */}
      <SidebarHeader className="p-3 border-b border-zinc-900 bg-zinc-950">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/20">
              <Bot size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-zinc-100 leading-tight">
                Live Class Assistant
              </h2>
              <p className="text-[10px] text-zinc-500 font-medium">
                AI Doubts & Forum
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-orange-400 font-bold">
            {role}
          </span>
        </div>

        {/* TABS */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-zinc-900/80 rounded-xl border border-zinc-800">
          <button
            onClick={() => setTab("bot")}
            className={cn(
              "flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all",
              tab === "bot"
                ? "bg-orange-600 text-white shadow-md shadow-orange-950/40"
                : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            <Sparkles size={13} />
            <span>AI Tutor</span>
          </button>
          <button
            onClick={() => setTab("forum")}
            className={cn(
              "flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all",
              tab === "forum"
                ? "bg-orange-600 text-white shadow-md shadow-orange-950/40"
                : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            <Users size={13} />
            <span>Forum ({questions.length})</span>
          </button>
        </div>
      </SidebarHeader>

      {/* CONTENT AREA */}
      <SidebarContent className="flex-1 overflow-hidden p-3">
        {/* TAB 1: AI CHATBOT ASSISTANT */}
        {tab === "bot" && (
          <div className="flex flex-col h-full justify-between">
            <div
              ref={chatScrollRef}
              className="flex-1 overflow-y-auto space-y-3 pr-1.5 scrollbar-thin scrollbar-thumb-zinc-800"
            >
              {aiChat.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "rounded-xl p-3 text-xs border transition-all",
                    msg.sender === "user"
                      ? "bg-orange-950/20 border-orange-500/30 text-zinc-100 ml-4"
                      : "bg-zinc-900/60 border-zinc-800/80 mr-2"
                  )}
                >
                  <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-zinc-800/50">
                    <span className="font-bold flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-orange-400">
                      {msg.sender === "user" ? (
                        "Your Doubt"
                      ) : (
                        <>
                          <Sparkles size={11} /> AI Teaching Assistant
                        </>
                      )}
                    </span>
                    {msg.sender === "ai" && (
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            navigator.clipboard.writeText(msg.text);
                            toast({ title: "Copied to clipboard" });
                          }}
                          className="h-5 w-5 text-zinc-500 hover:text-white"
                          title="Copy Answer"
                        >
                          <Copy size={11} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            onAskQuestion(
                              `[Shared AI Q&A]: ${msg.text.slice(0, 120)}...`
                            );
                            toast({ title: "Shared to class forum queue" });
                          }}
                          className="h-5 w-5 text-zinc-500 hover:text-orange-400"
                          title="Share to Class Forum"
                        >
                          <Share2 size={11} />
                        </Button>
                      </div>
                    )}
                  </div>
                  <MarkdownView content={msg.text} />
                </div>
              ))}

              {aiGenerating && (
                <div className="rounded-xl p-3 bg-zinc-900/40 border border-zinc-800 mr-2 flex items-center gap-2 text-xs text-orange-400 animate-pulse">
                  <Sparkles size={14} className="animate-spin" />
                  <span>AI Tutor is formulating an explanation...</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: LIVE DISCUSSION QUEUE / FORUM */}
        {tab === "forum" && (
          <div className="flex flex-col h-full overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-zinc-800">
            {questions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center text-zinc-500 space-y-2">
                <MessageSquare size={32} className="opacity-40 text-orange-500" />
                <p className="text-xs font-semibold text-zinc-400">
                  No questions yet
                </p>
                <p className="text-[11px] max-w-[200px]">
                  Submit a doubt below or ask the AI Tutor for instant help!
                </p>
              </div>
            ) : (
              questions.map((q) => {
                const qIdStr = String(q.id);
                const isActive = String(activeId) === qIdStr;
                const isExpanded = expandedId === q.id;

                return (
                  <div
                    key={q.id}
                    className={cn(
                      "rounded-xl border transition-all duration-200 overflow-hidden",
                      isActive
                        ? "bg-zinc-900 border-orange-500/40 ring-1 ring-orange-500/20"
                        : "bg-zinc-900/40 border-zinc-800/80 hover:border-zinc-700"
                    )}
                  >
                    <div
                      onClick={() => {
                        onSelect(qIdStr);
                        setExpandedId((prev) => (prev === q.id ? null : q.id));
                      }}
                      className="p-3 cursor-pointer flex items-start gap-2.5 select-none"
                    >
                      <div
                        className={cn(
                          "mt-0.5 shrink-0 rounded-full p-1",
                          q.answer
                            ? "text-emerald-400 bg-emerald-500/10"
                            : "text-orange-400 bg-orange-500/10"
                        )}
                      >
                        {q.answer ? (
                          <CheckCircle2 size={12} />
                        ) : (
                          <Clock size={12} />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            "text-xs leading-relaxed line-clamp-2",
                            isActive ? "text-zinc-100 font-semibold" : "text-zinc-300"
                          )}
                        >
                          {q.question}
                        </p>
                      </div>

                      <ChevronDown
                        size={14}
                        className={cn(
                          "mt-0.5 text-zinc-500 transition-transform",
                          isExpanded && "rotate-180 text-orange-400"
                        )}
                      />
                    </div>

                    {isExpanded && (
                      <div className="px-3 pb-3 pt-1 border-t border-zinc-800/50 space-y-2.5 bg-zinc-950/40">
                        {q.answer ? (
                          <div className="pl-2.5 border-l-2 border-orange-500/40 space-y-1">
                            <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">
                              Answer
                            </span>
                            <div className="max-h-60 overflow-y-auto pr-1">
                              <MarkdownView content={q.answer} />
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-[11px] text-zinc-400 bg-zinc-900/60 p-2 rounded-lg border border-zinc-800/60">
                              <Sparkles size={12} className="text-orange-400 shrink-0" />
                              <span>Waiting for instructor response...</span>
                            </div>

                            <Button
                              variant="outline"
                              size="sm"
                              disabled={aiGenerating}
                              onClick={() => handleExplainQuestionWithAI(q)}
                              className="w-full h-8 text-[11px] border-orange-500/30 text-orange-400 hover:bg-orange-500/10 gap-1.5 rounded-lg"
                            >
                              <Sparkles size={12} />
                              {aiGenerating
                                ? "Analyzing..."
                                : "Resolve with AI Assistant"}
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </SidebarContent>

      {/* FOOTER ACTIONS */}
      <SidebarFooter className="p-3 border-t border-zinc-900 bg-zinc-950">
        {/* BOT TAB INPUT */}
        {tab === "bot" && (
          <div className="space-y-2">
            <div className="relative">
              <Textarea
                value={botInput}
                onChange={(e) => setBotInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleAskAI();
                  }
                }}
                placeholder="Ask AI your doubt (e.g., explain slide concept, debug code)..."
                className="bg-zinc-900 border-zinc-800 text-xs min-h-[75px] rounded-xl focus-visible:ring-orange-500/30 resize-none placeholder:text-zinc-600"
              />
            </div>
            <Button
              onClick={handleAskAI}
              disabled={!botInput.trim() || aiGenerating}
              className="w-full bg-linear-to-r from-orange-600 to-yellow-500 hover:from-orange-500 hover:to-yellow-400 text-black font-bold rounded-xl h-9 text-xs gap-2"
            >
              <Sparkles size={13} />
              {aiGenerating ? "Generating Answer..." : "Ask AI Assistant"}
            </Button>
          </div>
        )}

        {/* FORUM TAB INPUT: STUDENT SUBMISSION */}
        {tab === "forum" && role === "Student" && (
          <div className="space-y-2">
            <Textarea
              value={forumInput}
              onChange={(e) => setForumInput(e.target.value)}
              placeholder="Post a question to the class queue..."
              className="bg-zinc-900 border-zinc-800 text-xs min-h-[75px] rounded-xl focus-visible:ring-orange-500/30 resize-none placeholder:text-zinc-600"
            />
            <Button
              onClick={() => {
                if (!forumInput.trim()) return;
                onAskQuestion(forumInput.trim());
                setForumInput("");
                toast({ title: "Question posted to class queue!" });
              }}
              disabled={!forumInput.trim()}
              className="w-full text-orange-400 border border-orange-500/40 hover:bg-orange-500/10 rounded-xl h-9 text-xs font-bold gap-2"
            >
              <PlusCircle size={14} />
              Submit to Instructor
            </Button>
          </div>
        )}

        {/* FORUM TAB INPUT: INSTRUCTOR ANSWERING */}
        {tab === "forum" && role === "Instructor" && activeQuestion && (
          <div className="space-y-2.5">
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-lg p-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest flex items-center gap-1">
                  <ArrowRight size={10} /> Answering
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAIDraftForQuestion}
                  disabled={aiGenerating}
                  className="h-6 px-2 text-[10px] gap-1 text-orange-400 hover:bg-orange-500/10 border border-orange-500/20 rounded-md"
                >
                  <Sparkles size={11} />
                  {aiGenerating ? "Drafting..." : "Draft with AI"}
                </Button>
              </div>
              <p className="text-[11px] text-zinc-300 line-clamp-2 italic">
                "{activeQuestion.question}"
              </p>
            </div>

            <Textarea
              value={answerInput}
              onChange={(e) => setAnswerInput(e.target.value)}
              placeholder="Type your response or use 'Draft with AI'..."
              className="bg-zinc-900 border-zinc-800 text-xs min-h-[90px] rounded-xl focus-visible:ring-orange-500/30 resize-none"
            />

            <Button
              onClick={() => {
                if (!answerInput.trim()) return;
                onAnswerQuestion(String(activeQuestion.id), answerInput.trim());
                setAnswerInput("");
                toast({ title: "Answer sent to students!" });
              }}
              disabled={!answerInput.trim()}
              className="w-full bg-linear-to-r from-orange-600 to-yellow-500 hover:from-orange-500 hover:to-yellow-400 text-black font-bold rounded-xl h-9 text-xs gap-2"
            >
              <Send size={13} />
              Publish Answer
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
