"use client";

import { useEffect, useState } from "react";

interface ItemPopupProps {
  itemName: string;
  itemDescription: string;
  onDismiss: () => void;
}

export default function ItemPopup({
  itemName,
  itemDescription,
  onDismiss,
}: ItemPopupProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger slide-up animation
    requestAnimationFrame(() => setVisible(true));

    // Auto-dismiss after 3 seconds
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300); // wait for slide-out animation
    }, 3000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  const handleTap = () => {
    setVisible(false);
    setTimeout(onDismiss, 300);
  };

  return (
    <div
      className="pointer-events-auto fixed inset-x-0 bottom-4 z-50 flex justify-center px-4"
      onClick={handleTap}
    >
      <div
        className={`flex max-w-sm items-center gap-3 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-900/90 to-yellow-900/90 px-5 py-3.5 shadow-2xl backdrop-blur-md transition-all duration-300 ${
          visible
            ? "translate-y-0 opacity-100"
            : "translate-y-8 opacity-0"
        }`}
      >
        {/* Icon */}
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-2xl">
          {"\u2728"}
        </div>

        {/* Text */}
        <div className="flex flex-col">
          <span className="text-sm font-bold text-amber-200">{itemName}</span>
          <span className="text-xs text-amber-100/60">{itemDescription}</span>
        </div>
      </div>
    </div>
  );
}
