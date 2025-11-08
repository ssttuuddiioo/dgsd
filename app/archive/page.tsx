"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PROJECTS } from "@/lib/constants";
import { Project } from "@/lib/types";

type ArchiveView = "freeform" | "detailed" | "organized";

export default function ArchivePage() {
  const [view, setView] = useState<ArchiveView>("freeform");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const rafIdRef = useRef<number | null>(null);

  // Mouse-controlled canvas panning for free-form view (piloting interface)
  useEffect(() => {
    if (view !== "freeform") {
      // Reset offset when leaving free-form view
      setCanvasOffset({ x: 0, y: 0 });
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate mouse position relative to center (normalized to -1 to 1)
      const mouseX = (e.clientX - rect.left - centerX) / centerX;
      const mouseY = (e.clientY - rect.top - centerY) / centerY;
      
      setMousePos({ x: mouseX, y: mouseY });
    };

    // Smooth panning animation with RAF - works in all directions including diagonal
    const animatePan = () => {
      setCanvasOffset((prev) => {
        // Pan speed multiplier - higher = more responsive
        const panSpeed = 500;
        const targetX = mousePos.x * panSpeed;
        const targetY = mousePos.y * panSpeed;
        
        // Smooth interpolation for fluid movement
        const smoothing = 0.12;
        const dx = targetX - prev.x;
        const dy = targetY - prev.y;
        
        return {
          x: prev.x + dx * smoothing,
          y: prev.y + dy * smoothing,
        };
      });
      
      rafIdRef.current = requestAnimationFrame(animatePan);
    };

    window.addEventListener("mousemove", handleMouseMove);
    rafIdRef.current = requestAnimationFrame(animatePan);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [view, mousePos]);

  const handleProjectClick = (project: Project) => {
    // Toggle inline details (one-page experience)
    if (selectedProject?.id === project.id) {
      setSelectedProject(null);
    } else {
      setSelectedProject(project);
    }
  };

  const handleViewChange = (newView: ArchiveView) => {
    setView(newView);
    setSelectedProject(null);
  };


  // Generate 5x5 grid positions with randomness (images float independently)
  const freeFormPositionsRef = useRef<Map<number, { x: number; y: number; width: number; height: number }>>(new Map());
  
  const getFreeFormPosition = (index: number) => {
    if (!freeFormPositionsRef.current.has(index)) {
      const gridSize = 5;
      const spacing = 350; // Base spacing between grid points
      
      // Calculate grid position (5x5 = 25 positions max)
      const col = index % gridSize;
      const row = Math.floor(index / gridSize);
      
      // Center the grid around origin
      const baseX = (col - (gridSize - 1) / 2) * spacing;
      const baseY = (row - (gridSize - 1) / 2) * spacing;
      
      // Add randomness to break the grid pattern (but keep it consistent)
      const randomX = (Math.sin(index * 0.7) * 80) + (Math.cos(index * 0.3) * 60);
      const randomY = (Math.cos(index * 0.5) * 80) + (Math.sin(index * 0.9) * 60);
      
      // Vary sizes slightly
      const width = 200 + (index % 3) * 30 + Math.sin(index) * 20;
      const height = 250 + (index % 2) * 40 + Math.cos(index) * 30;
      
      freeFormPositionsRef.current.set(index, {
        x: baseX + randomX,
        y: baseY + randomY,
        width,
        height,
      });
    }
    
    return freeFormPositionsRef.current.get(index)!;
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* View Mode Switcher */}
      <div className="fixed top-8 right-8 z-50 flex gap-2">
        <button
          onClick={() => handleViewChange("freeform")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            view === "freeform"
              ? "bg-white text-black"
              : "bg-gray-800 text-white hover:bg-gray-700"
          }`}
        >
          Free Form
        </button>
        <button
          onClick={() => handleViewChange("organized")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            view === "organized"
              ? "bg-white text-black"
              : "bg-gray-800 text-white hover:bg-gray-700"
          }`}
        >
          Organized
        </button>
      </div>

      {/* Free Form View - One Page Experience */}
      <AnimatePresence mode="wait">
        {view === "freeform" && (
          <motion.div
            key="freeform"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            ref={containerRef}
            className="absolute inset-0 overflow-hidden cursor-none"
            style={{ cursor: "none" }}
          >
            {/* Centered cursor indicator - changes state when hovering over projects */}
            <motion.div 
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50"
              animate={{
                scale: hoveredProject ? 1.5 : 1,
              }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <motion.div 
                className="rounded-full"
                animate={{
                  width: hoveredProject ? 20 : 12,
                  height: hoveredProject ? 20 : 12,
                  borderWidth: hoveredProject ? 3 : 2,
                  borderColor: hoveredProject ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.6)",
                }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                style={{
                  borderStyle: "solid",
                  position: "relative",
                }}
              />
              <motion.div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full"
                animate={{
                  width: hoveredProject ? 8 : 4,
                  height: hoveredProject ? 8 : 4,
                  opacity: hoveredProject ? 1 : 1,
                }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              />
              {/* Pulse effect when hovering */}
              {hoveredProject && (
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-white rounded-full"
                  initial={{ width: 20, height: 20, opacity: 0.6 }}
                  animate={{ 
                    width: 40, 
                    height: 40, 
                    opacity: 0,
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                />
              )}
            </motion.div>

            {/* Independent floating images - each moves with canvas offset */}
            {PROJECTS.map((project, index) => {
              const pos = getFreeFormPosition(index);
              const isHovered = hoveredProject === project.id;
              const isSelected = selectedProject?.id === project.id;
              
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    scale: isHovered ? 1.08 : 1,
                    filter: isHovered ? "brightness(1.2)" : "brightness(1)",
                  }}
                  transition={{ duration: 0.3 }}
                  className="absolute cursor-pointer group"
                  style={{
                    left: `calc(50vw + ${pos.x + canvasOffset.x}px)`,
                    top: `calc(50vh + ${pos.y + canvasOffset.y}px)`,
                    width: `${pos.width}px`,
                    height: `${pos.height}px`,
                    transform: "translate(-50%, -50%)",
                    zIndex: isSelected ? 100 : isHovered ? 50 : 10,
                  }}
                  onClick={() => handleProjectClick(project)}
                  onMouseEnter={() => setHoveredProject(project.id)}
                  onMouseLeave={() => setHoveredProject(null)}
                  whileHover={{ scale: 1.08 }}
                >
                  <div className={`w-full h-full bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center transition-all duration-300 ${
                    isHovered ? "ring-2 ring-white ring-opacity-50" : ""
                  }`}>
                    {project.imageUrl ? (
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-gray-600 text-sm font-medium text-center px-4">
                        {project.title}
                      </div>
                    )}
                  </div>

                  {/* Inline project details - appears when selected */}
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-80 bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg p-6 z-50"
                      style={{ pointerEvents: "auto" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <h3 className="text-xl font-bold text-white mb-2">
                        {project.title}
                      </h3>
                      <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                        {project.description}
                      </p>
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block px-4 py-2 bg-white text-black text-sm font-medium rounded hover:bg-gray-200 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View Project →
                        </a>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}


        {/* Organized Archive Index */}
        {view === "organized" && (
          <motion.div
            key="organized"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pt-32 px-8 pb-12 overflow-y-auto"
          >
            <div className="max-w-7xl mx-auto">
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-bold text-white mb-12"
              >
                Archive
              </motion.h1>

              <div className="grid grid-cols-4 gap-6">
                {PROJECTS.map((project, index) => {
                  // Vary image sizes
                  const sizes = [
                    { w: "col-span-1", h: "h-64" },
                    { w: "col-span-1", h: "h-80" },
                    { w: "col-span-2", h: "h-48" },
                    { w: "col-span-1", h: "h-72" },
                  ];
                  const size = sizes[index % sizes.length];
                  
                  return (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className={`${size.w} group cursor-pointer`}
                      onClick={() => handleProjectClick(project)}
                    >
                      <div className={`${size.h} bg-gray-800 rounded-lg overflow-hidden mb-3 flex items-center justify-center`}>
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
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-white">
                          {project.title}
                        </h3>
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="w-8 h-8 bg-white rounded flex items-center justify-center hover:bg-gray-200 transition-colors"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M6 3H3C2.44772 3 2 3.44772 2 4V13C2 13.5523 2.44772 14 3 14H12C12.5523 14 13 13.5523 13 13V10M10 2H14M14 2V6M14 2L6 10"
                                stroke="black"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </a>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
