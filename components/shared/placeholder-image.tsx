"use client";

import { ProjectCategory } from "@/lib/types";
import { CATEGORY_COLORS } from "@/lib/constants";

interface PlaceholderImageProps {
  category: ProjectCategory;
  title: string;
  className?: string;
}

export function PlaceholderImage({
  category,
  title,
  className = "",
}: PlaceholderImageProps) {
  const color = CATEGORY_COLORS[category];
  const initials = title
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{
        background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
      }}
    >
      <div className="text-white font-bold text-6xl opacity-30">{initials}</div>
    </div>
  );
}

