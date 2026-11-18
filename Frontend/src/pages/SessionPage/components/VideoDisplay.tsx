import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Monitor,
  X,
  Maximize2,
  Minimize2,
} from "lucide-react";

type Props = {
  isTeacher: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  sharedFile: any;
  slidePage?: number;
  onSlidePageChange?: (newPage: number) => void;
  onStopSlideShare?: () => void;
};

export const VideoDisplay = ({
  isTeacher,
  videoRef,
  sharedFile,
  slidePage = 1,
  onSlidePageChange,
  onStopSlideShare,
}: Props) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handlePrevPage = () => {
    if (slidePage > 1 && onSlidePageChange) {
      onSlidePageChange(slidePage - 1);
    }
  };

  const handleNextPage = () => {
    if (onSlidePageChange) {
      onSlidePageChange(slidePage + 1);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  return (
    <div
      className={`flex-1 p-4 md:p-6 transition-all duration-300 ${
        isFullscreen ? "fixed inset-0 z-50 p-0 bg-black" : ""
      }`}
    >
      <Card className="h-full flex flex-col p-3 md:p-4 gap-3 bg-zinc-950/80 border-zinc-800 shadow-2xl backdrop-blur-xl rounded-2xl overflow-hidden">
        {/* TOP TOOLBAR WHEN PDF SLIDES ARE ACTIVE */}
        {sharedFile && (
          <div className="flex items-center justify-between px-3 py-2 bg-zinc-900/90 border border-zinc-800/80 rounded-xl">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-500 shrink-0">
                <FileText size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-zinc-100 truncate max-w-[180px] sm:max-w-xs">
                  {sharedFile.name || "Presentation Slides"}
                </p>
                <p className="text-[10px] text-zinc-400">
                  {isTeacher ? "Instructor Presentation" : "Live Class Slides"}
                </p>
              </div>
            </div>

            {/* SLIDE NAVIGATION CONTROLS */}
            <div className="flex items-center gap-2 sm:gap-3">
              {isTeacher ? (
                <div className="flex items-center gap-1.5 bg-zinc-950/70 border border-zinc-800 px-2 py-1 rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlePrevPage}
                    disabled={slidePage <= 1}
                    className="h-7 w-7 text-zinc-400 hover:text-white disabled:opacity-30"
                    title="Previous Slide"
                  >
                    <ChevronLeft size={14} />
                  </Button>
                  <span className="text-xs font-mono font-bold text-orange-400 px-1 min-w-[50px] text-center">
                    Slide {slidePage}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleNextPage}
                    className="h-7 w-7 text-zinc-400 hover:text-white"
                    title="Next Slide"
                  >
                    <ChevronRight size={14} />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-medium text-emerald-400 font-mono">
                    Slide {slidePage}
                  </span>
                </div>
              )}

              {/* ACTION BUTTONS */}
              <div className="flex items-center gap-1">
                {sharedFile.url && (
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg"
                    title="Open / Download PDF"
                  >
                    <a
                      href={sharedFile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={sharedFile.name || "slides.pdf"}
                    >
                      <Download size={14} />
                    </a>
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFullscreen}
                  className="h-8 w-8 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg"
                  title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                >
                  {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                </Button>

                {isTeacher && onStopSlideShare && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={onStopSlideShare}
                    className="h-8 px-2.5 text-xs font-semibold gap-1 rounded-lg"
                  >
                    <X size={12} />
                    <span className="hidden sm:inline">Stop Slides</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* MAIN DISPLAY CANVAS / VIDEO / PDF CONTAINER */}
        <div className="flex-1 w-full h-full bg-zinc-950 rounded-xl overflow-hidden relative border border-zinc-900 flex items-center justify-center">
          {/* 1. PDF SLIDES VIEW (Active for both Teacher & Students) */}
          {sharedFile ? (
            <div className="absolute inset-0 bg-zinc-900 flex flex-col">
              <iframe
                key={`${sharedFile.url}-${slidePage}`}
                src={`${sharedFile.url}#page=${slidePage}&zoom=page-fit&toolbar=0&navpanes=0`}
                className="w-full h-full border-0 bg-white"
                title={sharedFile.name || "Live Presentation Slides"}
              />
            </div>
          ) : (
            <>
              {/* 2. WEBRTC VIDEO STREAM (For students when teacher shares screen) */}
              {!isTeacher && (
                <div className="w-full h-full flex items-center justify-center relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-6 text-center">
                    <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 backdrop-blur-md max-w-sm">
                      <Monitor className="w-8 h-8 text-orange-500/70 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-zinc-200">
                        Live Classroom Screen
                      </p>
                      <p className="text-xs text-zinc-500 mt-1">
                        Waiting for instructor to start screen sharing or upload lecture slides.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. TEACHER DASHBOARD PLACEHOLDER (When not sharing PDF) */}
              {isTeacher && (
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 bg-[radial-gradient(#27272a_1px,transparent_1px)] bg-size-[24px_24px]">
                  <div className="p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl max-w-md space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-500 flex items-center justify-center mx-auto">
                      <FileText className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-zinc-100">
                        Interactive Lecture Stage
                      </h3>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                        Click <strong className="text-orange-400 font-semibold">Choose PDF</strong> in the top bar to upload and present synchronized slides to your students, or use <strong className="text-orange-400 font-semibold">Share Screen</strong> for live video.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Card>
    </div>
  );
};
