import React, { useRef, useState, useCallback, useEffect } from "react";
import {
  Pencil, Eraser, Undo2, Redo2, Trash2, X, Minus,
  Circle, Triangle, MoveRight, Square, MousePointer2
} from "lucide-react";
import { Slider } from "./ui/slider";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

// -- Types --
type Tool = "pen" | "eraser" | "rect" | "circle" | "line" | "triangle" | "arrow";

interface WhiteboardProps {
  onClose: () => void;
}

// -- Improved Constants & Helpers --
const TOOLS = [
  { id: "pen", icon: <Pencil size={16} />, label: "Pen" },
  { id: "eraser", icon: <Eraser size={16} />, label: "Eraser" },
  { id: "rect", icon: <Square size={16} />, label: "Rectangle" },
  { id: "circle", icon: <Circle size={16} />, label: "Circle" },
  { id: "line", icon: <Minus size={16} />, label: "Line" },
  { id: "triangle", icon: <Triangle size={16} />, label: "Triangle" },
  { id: "arrow", icon: <MoveRight size={16} />, label: "Arrow" },
];

const Whiteboard: React.FC<WhiteboardProps> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [tool, setTool] = useState<Tool>("pen");
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("#818cf8");
  const [brushSize, setBrushSize] = useState(4);
  
  const lastPoint = useRef({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });
  const snapshotRef = useRef<ImageData | null>(null);
  const historyRef = useRef<ImageData[]>([]);
  const redoRef = useRef<ImageData[]>([]);
  const [, setStackVer] = useState(0);

  // -- Canvas Initialization & Resizing --
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !containerRef.current) return;

    const resize = () => {
      const parent = containerRef.current;
      if (!parent) return;
      // Capture current state before resize
      const ctx = canvas.getContext("2d");
      const temp = ctx?.getImageData(0, 0, canvas.width, canvas.height);
      
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      
      // Restore state
      if (temp) ctx?.putImageData(temp, 0, 0);
    };

    window.addEventListener("resize", resize);
    resize();
    return () => window.removeEventListener("resize", resize);
  }, []);

  const getCtx = useCallback(() => canvasRef.current?.getContext("2d", { willReadFrequently: true }) ?? null, []);

  // -- Drawing Logic --
  const drawShape = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const sx = startPos.current.x;
    const sy = startPos.current.y;
    ctx.beginPath();

    if (tool === "rect") ctx.strokeRect(sx, sy, x - sx, y - sy);
    if (tool === "circle") {
      const r = Math.hypot(x - sx, y - sy);
      ctx.arc(sx, sy, r, 0, Math.PI * 2);
    }
    if (tool === "line") {
      ctx.moveTo(sx, sy);
      ctx.lineTo(x, y);
    }
    if (tool === "triangle") {
      ctx.moveTo(sx, sy);
      ctx.lineTo(x, y);
      ctx.lineTo(sx - (x - sx), y);
      ctx.closePath();
    }
    if (tool === "arrow") {
      const headLen = Math.max(15, brushSize * 3);
      const angle = Math.atan2(y - sy, x - sx);
      ctx.moveTo(sx, sy);
      ctx.lineTo(x, y);
      ctx.lineTo(x - headLen * Math.cos(angle - Math.PI / 6), y - headLen * Math.sin(angle - Math.PI / 6));
      ctx.moveTo(x, y);
      ctx.lineTo(x - headLen * Math.cos(angle + Math.PI / 6), y - headLen * Math.sin(angle + Math.PI / 6));
    }
    ctx.stroke();
  };

  // -- Event Handlers (Pointer Events support Touch + Mouse) --
  const handlePointerDown = (e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    const ctx = getCtx();
    if (!canvas || !ctx) return;

    // History management
    historyRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    redoRef.current = [];
    setStackVer(v => v + 1);

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    startPos.current = { x, y };
    lastPoint.current = { x, y };
    setDrawing(true);

    if (tool === "pen" || tool === "eraser") {
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else {
      snapshotRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }
    
    // Lock pointer to capture moves outside canvas
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!drawing) return;
    const canvas = canvasRef.current;
    const ctx = getCtx();
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = color;

    if (tool === "pen" || tool === "eraser") {
      ctx.globalCompositeOperation = tool === "eraser" ? "destination-out" : "source-over";
      // Quadratic curve for smooth lines
      ctx.quadraticCurveTo(lastPoint.current.x, lastPoint.current.y, (lastPoint.current.x + x) / 2, (lastPoint.current.y + y) / 2);
      ctx.stroke();
      lastPoint.current = { x, y };
    } else {
      ctx.globalCompositeOperation = "source-over";
      if (snapshotRef.current) ctx.putImageData(snapshotRef.current, 0, 0);
      drawShape(ctx, x, y);
    }
  };

  const handlePointerUp = () => {
    setDrawing(false);
    snapshotRef.current = null;
    setStackVer(v => v + 1);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-zinc-950 text-zinc-200 overflow-hidden font-sans">
      {/* TOOLBAR */}
      <div className="flex items-center gap-2 p-3 bg-zinc-900 border-b border-zinc-800 shadow-xl z-10">
        <div className="flex items-center gap-1 bg-zinc-800/50 p-1 rounded-lg border border-zinc-700">
          {TOOLS.map((t) => (
            <Button
              key={t.id}
              variant={tool === t.id ? "default" : "ghost"}
              size="icon"
              className={`h-9 w-9 ${tool === t.id ? 'bg-indigo-600 hover:bg-indigo-500' : 'text-zinc-400'}`}
              onClick={() => setTool(t.id as Tool)}
              title={t.label}
            >
              {t.icon}
            </Button>
          ))}
        </div>

        <div className="h-6 w-px bg-zinc-700 mx-1" />

        <div className="flex items-center gap-2 px-2">
           <Input 
            type="color" 
            value={color} 
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-8 p-0 border-none bg-transparent cursor-pointer"
           />
           <Slider
            min={1} max={40} step={1}
            value={[brushSize]}
            onValueChange={(val) => setBrushSize(val[0])}
            className="w-24 lg:w-40"
           />
           <span className="text-xs font-mono w-8 text-zinc-500">{brushSize}px</span>
        </div>

        <div className="flex-1" />

        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => {
            const ctx = getCtx();
            if (ctx && historyRef.current.length) {
              redoRef.current.push(ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height));
              ctx.putImageData(historyRef.current.pop()!, 0, 0);
              setStackVer(v => v + 1);
            }
          }} disabled={historyRef.current.length === 0}>
            <Undo2 size={18} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => {
             const ctx = getCtx();
             if (ctx && redoRef.current.length) {
               historyRef.current.push(ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height));
               ctx.putImageData(redoRef.current.pop()!, 0, 0);
               setStackVer(v => v + 1);
             }
          }} disabled={redoRef.current.length === 0}>
            <Redo2 size={18} />
          </Button>
          <Button variant="destructive" size="sm" onClick={() => {
            const ctx = getCtx();
            ctx?.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            historyRef.current = [];
            redoRef.current = [];
            setStackVer(v => v + 1);
          }} className="gap-2">
            <Trash2 size={14} /> <span className="hidden sm:inline">Clear</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}><X size={18} /></Button>
        </div>
      </div>

      {/* CANVAS AREA */}
      <div ref={containerRef} className="flex-1 relative bg-[radial-gradient(#27272a_1px,transparent_1px)] bg-size-[20px_20px] overflow-hidden">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="absolute inset-0 touch-none"
          style={{ cursor: tool === 'pen' ? 'crosshair' : 'default' }}
        />
        
        {/* Floating Tool Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900/80 backdrop-blur border border-zinc-700 px-4 py-2 rounded-full text-xs flex items-center gap-3 shadow-2xl pointer-events-none">
          <span className="flex items-center gap-1.5 uppercase tracking-wider text-zinc-400">
             <MousePointer2 size={12} /> {tool}
          </span>
          <div className="w-px h-3 bg-zinc-700" />
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-zinc-500 font-mono">{color}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Whiteboard;