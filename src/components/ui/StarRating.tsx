"use client";
import { useState } from "react";

type Props = {
  value?: number;
  onChange?: (v: number) => void;
  readOnly?: boolean;
  size?: number;
};

export default function StarRating({ value = 0, onChange, readOnly = false, size = 20 }: Props) {
  const [hover, setHover] = useState(0);
  const current = hover || value;

  function handleClick(i: number) {
    if (readOnly) return;
    onChange?.(i);
  }

  return (
    <div className="inline-flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const idx = i + 1;
        const filled = idx <= current;
        return (
          <svg
            key={idx}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={filled ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.5"
            className={`text-yellow-400 ${readOnly ? "cursor-default" : "cursor-pointer"}`}
            onMouseEnter={() => !readOnly && setHover(idx)}
            onMouseLeave={() => !readOnly && setHover(0)}
            onClick={() => handleClick(idx)}
            aria-hidden
          >
            <path d="M12 .587l3.668 7.431L24 9.748l-6 5.851L19.335 24 12 20.01 4.665 24 6 15.599 0 9.748l8.332-1.73z" />
          </svg>
        );
      })}
    </div>
  );
}
