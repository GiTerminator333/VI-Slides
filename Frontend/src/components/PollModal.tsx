import { useState } from "react";
import { Plus, X, Timer } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import React from "react";

type PollModalProps = {
  open: boolean;
  onClose: () => void;
  onCreatePoll: (
    question: string,
    options: string[],
    duration: number
  ) => void;
};

export function PollModal({ open, onClose, onCreatePoll }: PollModalProps) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", ""]);
  const [duration, setDuration] = useState(30);
  const { toast } = useToast();

  const handleAddOption = () => setOptions([...options, ""]);
  const handleRemoveOption = (index: number) => setOptions(options.filter((_, i) => i !== index));

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = () => {
    if (!question.trim()) {
      toast({ title: "Question Required", description: "Please enter a poll question.", variant: "destructive" });
      return;
    }
    const filledOptions = options.filter((opt) => opt.trim());
    if (filledOptions.length < 2) {
      toast({ title: "Incomplete Options", description: "Provide at least 2 choices.", variant: "destructive" });
      return;
    }

    onCreatePoll(question, filledOptions, duration);
    setQuestion("");
    setOptions(["", "", ""]);
    setDuration(30);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md border-zinc-800 bg-zinc-950 text-white selection:bg-orange-500/30">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">Create a Poll</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Engagement peaks with live feedback. Launch a poll to your students.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Question */}
          <div className="space-y-2">
            <Label htmlFor="question" className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Poll Question
            </Label>
            <Input
              id="question"
              placeholder="e.g., Which lifecycle method runs first?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="bg-zinc-900 border-zinc-800 focus-visible:ring-orange-500/20 focus-visible:border-orange-500/50"
            />
          </div>

          {/* Options */}
          <div className="space-y-3">
            <Label className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Response Options
            </Label>
            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-800">
              {options.map((option, index) => (
                <div key={index} className="flex gap-2 group">
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="bg-zinc-900 border-zinc-800 focus-visible:ring-orange-500/20 focus-visible:border-orange-500/50"
                  />
                  {options.length > 2 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveOption(index)}
                      className="text-zinc-500 hover:text-red-400 hover:bg-red-400/10 shrink-0"
                    >
                      <X className="size-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleAddOption}
              className="w-full border-dashed border-zinc-700 bg-transparent text-zinc-400 hover:text-orange-500 hover:border-orange-500/50"
            >
              <Plus className="mr-2 size-4" /> Add Option
            </Button>
          </div>

          {/* Duration Selector */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Timer className="size-4 text-orange-500" />
              <Label className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                Poll Duration
              </Label>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[15, 30, 45, 60, 120, 300].map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => setDuration(sec)}
                  className={cn(
                    "flex items-center justify-center rounded-md border py-2 text-xs font-bold transition-all",
                    duration === sec
                      ? "border-orange-500 bg-orange-500/10 text-orange-500"
                      : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-600"
                  )}
                >
                  {sec >= 60 ? `${sec / 60}m` : `${sec}s`}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={onClose} className="text-zinc-400 hover:text-white">
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Launch Poll
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}