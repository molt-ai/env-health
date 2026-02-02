"use client";

import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  visible: boolean;
  onClose: () => void;
  duration?: number;
  type?: "success" | "error" | "info";
}

const typeStyles = {
  success: "bg-[var(--accent-green)] text-white",
  error: "bg-[var(--accent-red)] text-white",
  info: "bg-[var(--accent-gold)] text-[var(--bg-primary)]",
};

export default function Toast({ message, visible, onClose, duration = 3000, type = "success" }: ToastProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 300); // Wait for animation to finish
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  if (!visible && !show) return null;

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-xl font-semibold text-sm shadow-2xl transition-all duration-300 ${typeStyles[type]} ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      {message}
    </div>
  );
}
