import React, { useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createPortal } from "react-dom";

interface ModalProps {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  /** width/height presets */
  size?: "sm" | "md" | "lg" | "xl";
  /** optional custom footer (e.g., actions) */
  footer?: React.ReactNode;
  /** close when clicking backdrop (default: true) */
  closeOnBackdrop?: boolean;
}

const sizeMap: Record<NonNullable<ModalProps["size"]>, string> = {
  sm: "max-w-md h-[50vh]",
  md: "max-w-2xl h-[60vh]",
  lg: "max-w-3xl h-[70vh]",
  xl: "max-w-4xl h-[75vh]",
};

export default function Modal({
  open,
  title,
  onClose,
  children,
  size = "lg",
  footer,
  closeOnBackdrop = true,
}: ModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  const content = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeOnBackdrop ? onClose : undefined}
      />

      {/* Panel */}
      <div
        className={`relative z-10 w-full ${sizeMap[size]} bg-slate-800 border border-purple-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-purple-500/20">
          <h3 className="text-white font-semibold truncate pr-4">
            {title || "Dialog"}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-300 hover:bg-gray-300/50"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Body */}
        <div className="p-4 flex-1 overflow-auto">{children}</div>

        {/* Footer (optional) */}
        {/* {footer && (
          <div className="p-4 border-t border-purple-500/20">{footer}</div>
        )} */}
      </div>
    </div>
  );
  // Use a portal so it’s not clipped by parent containers
  const root = document.getElementById("modal-root") || document.body;
  return createPortal(content, root);
}
