"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ToolSidebar } from "@/components/landing/tool-sidebar";
import { VennCircles } from "@/components/landing/venn-circles";
import { ToolMode } from "@/lib/types";
import { PROJECTS } from "@/lib/constants";

export default function HomePage() {
  const [currentMode, setCurrentMode] = useState<ToolMode>("venn-diagram");

  return (
    <div className="relative min-h-screen bg-black">
      <ToolSidebar currentMode={currentMode} onModeChange={setCurrentMode} />

      <AnimatePresence mode="wait">
        {currentMode === "venn-diagram" && (
          <motion.div
            key="venn-diagram"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen"
          >
            <VennCircles />
          </motion.div>
        )}

        {currentMode === "archive-grid" && (
          <motion.div
            key="archive-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen pt-32 px-8"
          >
            <div className="max-w-7xl mx-auto">
              <h1 className="text-4xl font-bold text-white mb-12 text-center">
                Project Archive
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {PROJECTS.map((project) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-[4/3] bg-gray-800 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
                      {project.imageUrl ? (
                        <img
                          src={project.imageUrl}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <div className="text-gray-600 text-sm font-medium text-center px-4">
                          {project.title}
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {project.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
