"use client";

import { motion } from "framer-motion";
import { ToolMode } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CircleDot, Grid3x3 } from "lucide-react";

interface ToolSidebarProps {
  currentMode: ToolMode;
  onModeChange: (mode: ToolMode) => void;
}

const tools = [
  {
    mode: "venn-diagram" as ToolMode,
    icon: CircleDot,
    label: "Venn Diagram",
  },
  {
    mode: "archive-grid" as ToolMode,
    icon: Grid3x3,
    label: "Archive Grid",
  },
];

export function ToolSidebar({ currentMode, onModeChange }: ToolSidebarProps) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="fixed left-6 top-1/2 -translate-y-1/2 z-40"
    >
      <div className="flex flex-col gap-4 bg-background/80 backdrop-blur-sm border border-border rounded-lg p-3">
        {tools.map((tool) => {
          const isActive = currentMode === tool.mode;
          const Icon = tool.icon;
          return (
            <button
              key={tool.mode}
              onClick={() => onModeChange(tool.mode)}
              className={cn(
                "w-12 h-12 rounded-lg flex items-center justify-center transition-all relative group",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "bg-muted hover:bg-accent/20"
              )}
              title={tool.label}
            >
              <Icon className="w-6 h-6" />

              {/* Tooltip */}
              <div className="absolute left-full ml-3 px-3 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {tool.label}
              </div>

              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTool"
                  className="absolute inset-0 border-2 border-accent rounded-lg"
                  transition={{ duration: 0.3 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </motion.aside>
  );
}

