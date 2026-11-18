import Whiteboard from "@/components/Whiteboard";
import React from "react";

type Props = {
  show: boolean;
  onClose: () => void;
  classId?: string;
};

export const WhiteboardModal = ({ show, onClose, classId }: Props) => {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-[94%] h-[92%] bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Whiteboard onClose={onClose} classId={classId} />
      </div>
    </div>
  );
};