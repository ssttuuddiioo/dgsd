"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, animate, AnimatePresence } from "framer-motion";
import { CIRCLE_CATEGORIES, CIRCLE_PROJECT_TYPES } from "@/lib/constants";
import { GradualSpacing } from "@/components/ui/gradual-spacing";

const BASE_RADIUS = 200;

interface Circle {
  id: string;
  x: number;
  y: number;
  radius: number;
  category: string;
  label: string;
}

// Check if two circles overlap
const checkOverlap = (c1: Circle, c2: Circle): boolean => {
  const dx = c2.x - c1.x;
  const dy = c2.y - c1.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < c1.radius + c2.radius;
};

// Generate random position ensuring no overlaps
const generateRandomPosition = (
  width: number,
  height: number,
  radius: number,
  existingCircles: Circle[]
): { x: number; y: number } => {
  const margin = radius + 50; // Extra margin
  let attempts = 0;
  const maxAttempts = 100;

  while (attempts < maxAttempts) {
    const x = margin + Math.random() * (width - 2 * margin);
    const y = margin + Math.random() * (height - 2 * margin);

    // Check if this position overlaps with any existing circles
    const tempCircle: Circle = { id: "temp", x, y, radius, category: "", label: "" };
    const hasOverlap = existingCircles.some((circle) => checkOverlap(tempCircle, circle));

    if (!hasOverlap) {
      return { x, y };
    }

    attempts++;
  }

  // Fallback to a safe position if we can't find a non-overlapping spot
  return {
    x: width / 2 + (Math.random() - 0.5) * width * 0.5,
    y: height / 2 + (Math.random() - 0.5) * height * 0.5,
  };
};

// Initialize circles with random positions and varying sizes
const initializeCircles = (): Circle[] => {
  if (typeof window === "undefined") {
    return [
      { id: "circle-A", x: 300, y: 300, radius: BASE_RADIUS * 1.5, category: "A", label: CIRCLE_CATEGORIES.A },
      { id: "circle-B", x: 800, y: 400, radius: BASE_RADIUS, category: "B", label: CIRCLE_CATEGORIES.B },
      { id: "circle-C", x: 500, y: 600, radius: BASE_RADIUS * 0.75, category: "C", label: CIRCLE_CATEGORIES.C },
    ];
  }

  const width = window.innerWidth;
  const height = window.innerHeight;

  const circles: Circle[] = [];

  // Circle A (Spatial) - Bigger
  const posA = generateRandomPosition(width, height, BASE_RADIUS * 1.5, circles);
  circles.push({
    id: "circle-A",
    x: posA.x,
    y: posA.y,
    radius: BASE_RADIUS * 1.5,
    category: "A",
    label: CIRCLE_CATEGORIES.A,
  });

  // Circle B (Interactive) - Medium
  const posB = generateRandomPosition(width, height, BASE_RADIUS, circles);
  circles.push({
    id: "circle-B",
    x: posB.x,
    y: posB.y,
    radius: BASE_RADIUS,
    category: "B",
    label: CIRCLE_CATEGORIES.B,
  });

  // Circle C (Culture) - Smaller
  const posC = generateRandomPosition(width, height, BASE_RADIUS * 0.75, circles);
  circles.push({
    id: "circle-C",
    x: posC.x,
    y: posC.y,
    radius: BASE_RADIUS * 0.75,
    category: "C",
    label: CIRCLE_CATEGORIES.C,
  });

  return circles;
};

// Calculate distance between two points
const getDistance = (x1: number, y1: number, x2: number, y2: number) => {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
};

// Check if two circles overlap
const circlesOverlap = (c1: Circle, c2: Circle) => {
  const distance = getDistance(c1.x, c1.y, c2.x, c2.y);
  return distance < c1.radius + c2.radius;
};

// Get overlap center point
const getOverlapCenter = (c1: Circle, c2: Circle) => {
  return {
    x: (c1.x + c2.x) / 2,
    y: (c1.y + c2.y) / 2,
  };
};

// Calculate the intersection path between two circles
const getIntersectionPath = (c1: Circle, c2: Circle): string => {
  const dx = c2.x - c1.x;
  const dy = c2.y - c1.y;
  const d = Math.sqrt(dx * dx + dy * dy);

  // No overlap
  if (d >= c1.radius + c2.radius) {
    return "";
  }

  // One circle completely inside the other
  if (d <= Math.abs(c1.radius - c2.radius)) {
    const smaller = c1.radius < c2.radius ? c1 : c2;
    return `M ${smaller.x - smaller.radius},${smaller.y} 
            a ${smaller.radius},${smaller.radius} 0 1,0 ${smaller.radius * 2},0 
            a ${smaller.radius},${smaller.radius} 0 1,0 ${-smaller.radius * 2},0`;
  }

  // Calculate intersection points
  const a = (c1.radius * c1.radius - c2.radius * c2.radius + d * d) / (2 * d);
  const h = Math.sqrt(c1.radius * c1.radius - a * a);
  
  const px = c1.x + (a * dx) / d;
  const py = c1.y + (a * dy) / d;
  
  const ix1 = px + (h * dy) / d;
  const iy1 = py - (h * dx) / d;
  
  const ix2 = px - (h * dy) / d;
  const iy2 = py + (h * dx) / d;

  // Create the lens-shaped path
  const largeArc1 = h < c1.radius ? 0 : 1;
  const largeArc2 = h < c2.radius ? 0 : 1;

  return `M ${ix1},${iy1} 
          A ${c1.radius},${c1.radius} 0 ${largeArc1},0 ${ix2},${iy2} 
          A ${c2.radius},${c2.radius} 0 ${largeArc2},0 ${ix1},${iy1} Z`;
};

export function VennCircles() {
  const [circles, setCircles] = useState<Circle[]>([]);
  const [activeCircle, setActiveCircle] = useState<string | null>(null); // Circle in pick-up mode
  const [hoveredCircle, setHoveredCircle] = useState<string | null>(null); // Circle being hovered
  const [draggedCircle, setDraggedCircle] = useState<string | null>(null); // Circle being dragged
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseDownPos = useRef<{ x: number; y: number } | null>(null);
  const [rafTick, setRafTick] = useState(0);

  useEffect(() => {
    const initialCircles = initializeCircles();
    // Validate all circles have required properties
    const validCircles = initialCircles.filter(c => c.x && c.y && c.radius);
    setCircles(validCircles);
    setMounted(true);
  }, []);

  // Handle mouse move for picked-up circle
  useEffect(() => {
    if (!activeCircle) return;

    const handleMouseMove = (e: MouseEvent) => {
      setCircles((prev) =>
        prev.map((circle) =>
          circle.id === activeCircle
            ? { ...circle, x: e.clientX, y: e.clientY }
            : circle
        )
      );
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [activeCircle]);

  // RAF micro-tick to guarantee frequent updates during drag/pickup
  useEffect(() => {
    let rafId: number | null = null;
    const loop = () => {
      setRafTick((t) => (t + 1) % 1000);
      rafId = requestAnimationFrame(loop);
    };
    if (draggedCircle || activeCircle) {
      rafId = requestAnimationFrame(loop);
    }
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [draggedCircle, activeCircle]);

  // Handle scroll for hovered circle (when not in active mode)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (hoveredCircle && !activeCircle && !draggedCircle) {
        e.preventDefault();
        
        setCircles((prev) =>
          prev.map((circle) => {
            if (circle.id === hoveredCircle) {
              // Adjust radius based on scroll direction
              const delta = -e.deltaY * 0.5;
              const newRadius = Math.max(100, Math.min(500, circle.radius + delta));
              return { ...circle, radius: newRadius };
            }
            return circle;
          })
        );
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [hoveredCircle, activeCircle, draggedCircle]);

  const handleMouseDown = (circleId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // If already active, drop it
    if (activeCircle === circleId) {
      setActiveCircle(null);
      return;
    }

    // Record mouse down position to detect drag vs click
    mouseDownPos.current = { x: e.clientX, y: e.clientY };
    setDraggedCircle(circleId);
  };

  const handleMouseMove = (circleId: string, e: React.MouseEvent) => {
    if (draggedCircle === circleId && mouseDownPos.current) {
      e.stopPropagation();
      
      // Update circle position while dragging
      setCircles((prev) =>
        prev.map((circle) =>
          circle.id === circleId
            ? { ...circle, x: e.clientX, y: e.clientY }
            : circle
        )
      );
    }
  };

  const handleMouseUp = (circleId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!mouseDownPos.current || !draggedCircle) return;

    // Calculate distance moved
    const distance = Math.sqrt(
      Math.pow(e.clientX - mouseDownPos.current.x, 2) +
      Math.pow(e.clientY - mouseDownPos.current.y, 2)
    );

    // If barely moved (< 5px), it's a click (pick up mode)
    if (distance < 5) {
      setActiveCircle(circleId);
    }

    // Reset drag state
    setDraggedCircle(null);
    mouseDownPos.current = null;
  };

  const handleMouseEnter = (circleId: string) => {
    setHoveredCircle(circleId);
  };

  const handleMouseLeave = () => {
    setHoveredCircle(null);
  };

  // Handle click anywhere to drop picked-up circle
  const handleBackgroundClick = () => {
    if (activeCircle) {
      setActiveCircle(null);
    }
  };

  // Helper to get project types based on circle categories
  const getProjectTypesForOverlap = (cat1: string, cat2: string, cat3?: string): string[] => {
    // Three-way overlap
    if (cat3) {
      return CIRCLE_PROJECT_TYPES.allThree;
    }

    // Two-way overlaps
    const cats = [cat1, cat2].sort().join("");
    
    if (cats === "AB") return CIRCLE_PROJECT_TYPES.spatialInteractive;
    if (cats === "BC") return CIRCLE_PROJECT_TYPES.interactiveCulture;
    if (cats === "AC") return CIRCLE_PROJECT_TYPES.spatialCulture;
    
    return [];
  };

  // Detect overlaps
  type OverlapData = {
    circles: Circle[];
    center: { x: number; y: number };
    projectTypes: string[];
    isThreeWay: boolean;
  };

  const overlaps: OverlapData[] = [];
  let hasAnyOverlap = false;

  if (circles.length === 3) {
    // Check for three-way overlap first
    const allThreeOverlap = circlesOverlap(circles[0], circles[1]) && 
                           circlesOverlap(circles[1], circles[2]) &&
                           circlesOverlap(circles[0], circles[2]);
    
    if (allThreeOverlap) {
      hasAnyOverlap = true;
      const centerX = (circles[0].x + circles[1].x + circles[2].x) / 3;
      const centerY = (circles[0].y + circles[1].y + circles[2].y) / 3;
      
      overlaps.push({
        circles: [circles[0], circles[1], circles[2]],
        center: { x: centerX, y: centerY },
        projectTypes: getProjectTypesForOverlap("A", "B", "C"),
        isThreeWay: true,
      });
    }

    // Check all two-way combinations
    const pairs: [number, number][] = [
      [0, 1], // A + B
      [1, 2], // B + C
      [0, 2], // A + C
    ];

    pairs.forEach(([i, j]) => {
      if (circlesOverlap(circles[i], circles[j])) {
        hasAnyOverlap = true;
        const projectTypes = getProjectTypesForOverlap(
          circles[i].category, 
          circles[j].category
        );
        
        overlaps.push({
          circles: [circles[i], circles[j]],
          center: getOverlapCenter(circles[i], circles[j]),
          projectTypes,
          isThreeWay: false,
        });
      }
    });
  }

  if (!mounted || circles.length === 0) {
    return null;
  }

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 overflow-hidden"
      onClick={handleBackgroundClick}
    >
      {/* Call to Action - shown when no overlaps */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: hasAnyOverlap ? 0 : 1 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ zIndex: 1 }}
      >
        <div className="text-center">
          <div className="opacity-80">
            <GradualSpacing text="Adaptive Research Projects" />
          </div>
        </div>
      </motion.div>
      {/* SVG for circles and masks */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          {/* Glow filter for hover effect */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Create clipPath for each overlap (2-way) - exact intersection shape */}
          {overlaps.map((overlap, idx) => {
            if (overlap.isThreeWay) {
              return null;
            }
            
            const intersectionPath = getIntersectionPath(overlap.circles[0], overlap.circles[1]);
            
            return (
              <clipPath key={`defs-${idx}`} id={`clip-overlap-${idx}`} clipPathUnits="userSpaceOnUse">
                <path d={intersectionPath} />
              </clipPath>
            );
          })}
          {/* Create clipPath and mask for three-way overlaps */}
          {overlaps.map((overlap, idx) => {
            if (!overlap.isThreeWay) return null;
            // Use first two as pair, third as intersecting circle
            const a = overlap.circles[0];
            const b = overlap.circles[1];
            const c = overlap.circles[2];
            const abPath = getIntersectionPath(a, b);
            
            return (
              <g key={`defs-3-${idx}`}>
                {/* Mask for three-way intersection: A∩B∩C */}
                <mask id={`mask-3way-${idx}`}>
                  <rect width="100%" height="100%" fill="black" />
                  {/* A∩B path in white */}
                  <path d={abPath} fill="white" />
                  {/* C circle in white - only where both overlap */}
                  <circle cx={c.x} cy={c.y} r={c.radius} fill="white" />
                </mask>
                {/* ClipPath for text - nested approach */}
                <clipPath id={`clip-ab-3-${idx}`} clipPathUnits="userSpaceOnUse">
                  <path d={abPath} />
                </clipPath>
                <clipPath id={`clip-c-3-${idx}`} clipPathUnits="userSpaceOnUse">
                  <circle cx={c.x} cy={c.y} r={c.radius} />
                </clipPath>
              </g>
            );
          })}
        </defs>

        {/* Draw circles with dashed stroke */}
        {circles.map((circle) => {
          if (!circle || !circle.radius) return null;
          
          const isHovered = hoveredCircle === circle.id;
          const isActive = activeCircle === circle.id;
          const baseRadius = circle.radius;
          
          return (
            <motion.circle
              key={`stroke-${circle.id}`}
              cx={circle.x}
              cy={circle.y}
              r={baseRadius}
              fill="none"
              stroke="white"
              strokeWidth={3}
              strokeDasharray="15 10"
              opacity={isActive ? 0.5 : 1}
              filter={isHovered && !isActive ? "url(#glow)" : undefined}
              animate={isHovered && !isActive ? {
                scale: [1, 1.05, 1],
                strokeWidth: [3, 4, 3],
              } : {}}
              transition={{
                duration: 2,
                repeat: isHovered && !isActive ? Infinity : 0,
                ease: "easeInOut",
              }}
              style={{ transformOrigin: `${circle.x}px ${circle.y}px` }}
            />
          );
        })}

        {/* Fill overlaps - exact intersection shape */}
        {overlaps.map((overlap, idx) => {
          if (overlap.circles.length < 2) return null;
          
          if (overlap.isThreeWay) {
            // For three-way overlap, use nested clipPath: clip A∩B with C
            const a = overlap.circles[0];
            const b = overlap.circles[1];
            const c = overlap.circles[2];
            const abPath = getIntersectionPath(a, b);
            
            return (
              <g key={`fill-3-${idx}`} clipPath={`url(#clip-ab-3-${idx})`}>
                <g clipPath={`url(#clip-c-3-${idx})`}>
                  <path
                    d={abPath}
                    fill="white"
                    opacity="0.15"
                  />
                </g>
              </g>
            );
          }
          
          // Two-way overlap - use exact intersection path
          const intersectionPath = getIntersectionPath(overlap.circles[0], overlap.circles[1]);
          
          return (
            <path
              key={`fill-${idx}`}
              d={intersectionPath}
              fill="white"
              opacity="0.15"
            />
          );
        })}
      </svg>

      {/* Invisible interactive circles */}
      {circles.map((circle) => (
        <div
          key={`interactive-${circle.id}`}
          onMouseDown={(e) => handleMouseDown(circle.id, e)}
          onMouseMove={(e) => handleMouseMove(circle.id, e)}
          onMouseUp={(e) => handleMouseUp(circle.id, e)}
          onMouseEnter={() => handleMouseEnter(circle.id)}
          onMouseLeave={handleMouseLeave}
          style={{
            position: "absolute",
            left: circle.x - circle.radius,
            top: circle.y - circle.radius,
            width: circle.radius * 2,
            height: circle.radius * 2,
            borderRadius: "50%",
            cursor: activeCircle === circle.id 
              ? "grabbing" 
              : draggedCircle === circle.id 
                ? "grabbing"
                : "grab",
            pointerEvents: "all",
          }}
          className="transition-opacity duration-200"
        />
      ))}

      {/* Scrolling text in overlaps */}
      <AnimatePresence>
      {overlaps.map((overlap, overlapIdx) => {
        // Skip if no project types
        if (overlap.projectTypes.length === 0) return null;

        // Calculate scroll direction based on circle positions
        let angle = 0;
        if (overlap.isThreeWay) {
          // For three-way, use a default angle
          angle = 45;
        } else {
          // Calculate angle between two circle centers
          const dx = overlap.circles[1].x - overlap.circles[0].x;
          const dy = overlap.circles[1].y - overlap.circles[0].y;
          angle = Math.atan2(dy, dx) * (180 / Math.PI);
        }

        // Create unique key that updates when circles move
        const circleKey = overlap.circles.map(c => `${c.x.toFixed(1)}-${c.y.toFixed(1)}-${c.radius.toFixed(1)}`).join('|');

        return (
          <motion.div
            key={`text-${overlapIdx}-${circleKey}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            style={{ pointerEvents: "none" }}
          >
            <ScrollingTextOverlay
              projectTypes={overlap.projectTypes}
              center={overlap.center}
              angle={angle}
              isThreeWay={overlap.isThreeWay}
              circles={overlap.circles}
              overlapIdx={overlapIdx}
            />
          </motion.div>
        );
      })}
      </AnimatePresence>
    </div>
  );
}

// Scrolling text overlay component
interface ScrollingTextOverlayProps {
  projectTypes: string[];
  center: { x: number; y: number };
  angle: number;
  isThreeWay: boolean;
  circles: Circle[];
  overlapIdx: number;
}

function ScrollingTextOverlay({
  projectTypes,
  center,
  angle,
  isThreeWay,
  circles,
  overlapIdx,
}: ScrollingTextOverlayProps) {
  // Calculate bounding box of overlap area
  const getOverlapBounds = (): { minX: number; minY: number; maxX: number; maxY: number } | null => {
    if (circles.length < 2) return null;
    
    if (!isThreeWay) {
      // For two-way overlap, find the intersection bounds
      const c1 = circles[0];
      const c2 = circles[1];
      const dx = c2.x - c1.x;
      const dy = c2.y - c1.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      
      if (d >= c1.radius + c2.radius) return null;
      
      // Calculate intersection points
      const a = (c1.radius * c1.radius - c2.radius * c2.radius + d * d) / (2 * d);
      const h = Math.sqrt(Math.max(0, c1.radius * c1.radius - a * a));
      const px = c1.x + (a * dx) / d;
      const py = c1.y + (a * dy) / d;
      
      const ix1 = px + (h * dy) / d;
      const iy1 = py - (h * dx) / d;
      const ix2 = px - (h * dy) / d;
      const iy2 = py + (h * dx) / d;
      
      // Get bounds from both circles' arcs within the overlap
      const c1Left = c1.x - c1.radius;
      const c1Right = c1.x + c1.radius;
      const c1Top = c1.y - c1.radius;
      const c1Bottom = c1.y + c1.radius;
      
      const c2Left = c2.x - c2.radius;
      const c2Right = c2.x + c2.radius;
      const c2Top = c2.y - c2.radius;
      const c2Bottom = c2.y + c2.radius;
      
      return {
        minX: Math.max(c1Left, c2Left),
        minY: Math.max(c1Top, c2Top),
        maxX: Math.min(c1Right, c2Right),
        maxY: Math.min(c1Bottom, c2Bottom),
      };
    } else {
      // For three-way overlap, find intersection of all three
      const c1 = circles[0];
      const c2 = circles[1];
      const c3 = circles[2];
      
      return {
        minX: Math.max(c1.x - c1.radius, c2.x - c2.radius, c3.x - c3.radius),
        minY: Math.max(c1.y - c1.radius, c2.y - c2.radius, c3.y - c3.radius),
        maxX: Math.min(c1.x + c1.radius, c2.x + c2.radius, c3.x + c3.radius),
        maxY: Math.min(c1.y + c1.radius, c2.y + c2.radius, c3.y + c3.radius),
      };
    }
  };
  
  const overlapBounds = getOverlapBounds();
  
  // Calculate clipPath from current circle positions on every render
  const intersectionPath = !isThreeWay
    ? getIntersectionPath(circles[0], circles[1])
    : getIntersectionPath(circles[0], circles[1]); // A∩B; C applied separately
  
  // Refs for updating clipPath paths directly
  const pathRef2Way = useRef<SVGPathElement | null>(null);
  const pathRef3WayAB = useRef<SVGPathElement | null>(null);
  const circleRef3WayC = useRef<SVGCircleElement | null>(null);
  const circlesRef = useRef(circles);
  
  // Keep circles ref up to date
  useEffect(() => {
    circlesRef.current = circles;
  }, [circles]);
  
  // Update clipPath paths continuously via RAF for smooth updates
  useEffect(() => {
    let rafId: number;
    const updateClipPath = () => {
      const currentCircles = circlesRef.current;
      if (!currentCircles || currentCircles.length < 2) return;
      
      // Recalculate intersection path from current circle positions
      const currentPath = !isThreeWay
        ? getIntersectionPath(currentCircles[0], currentCircles[1])
        : getIntersectionPath(currentCircles[0], currentCircles[1]);
      
      // Update clipPath paths
      if (!isThreeWay && pathRef2Way.current) {
        pathRef2Way.current.setAttribute("d", currentPath);
      } else if (isThreeWay) {
        if (pathRef3WayAB.current) {
          pathRef3WayAB.current.setAttribute("d", currentPath);
        }
        if (circleRef3WayC.current && currentCircles[2]) {
          circleRef3WayC.current.setAttribute("cx", currentCircles[2].x.toString());
          circleRef3WayC.current.setAttribute("cy", currentCircles[2].y.toString());
          circleRef3WayC.current.setAttribute("r", (currentCircles[2].radius || 0).toString());
        }
      }
      
      rafId = requestAnimationFrame(updateClipPath);
    };
    rafId = requestAnimationFrame(updateClipPath);
    return () => cancelAnimationFrame(rafId);
  }, [isThreeWay]);

  // Shuffle titles once per mount
  const shuffled = useRef<string[] | null>(null);
  if (!shuffled.current) {
    const arr = [...projectTypes];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    shuffled.current = arr;
  }

  // For two-way overlaps, use SVG clipPath local to this SVG
  if (!isThreeWay) {
    return (
      <motion.div
        className="absolute pointer-events-none"
        style={{
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
      >
        <svg
          className="absolute inset-0 w-full h-full"
          style={{ pointerEvents: "none" }}
        >
          <defs>
            <clipPath id={`cp-ab-${overlapIdx}`} clipPathUnits="userSpaceOnUse">
              <path ref={pathRef2Way} d={intersectionPath} />
            </clipPath>
          </defs>
          <g clipPath={`url(#cp-ab-${overlapIdx})`} style={{ pointerEvents: "none" }}>
            {overlapBounds && (shuffled.current as string[]).map((projectType, idx) => {
              // Distribute text evenly within the overlap bounds
              const cols = Math.ceil(Math.sqrt((shuffled.current as string[]).length));
              const row = Math.floor(idx / cols);
              const col = idx % cols;
              
              const width = overlapBounds.maxX - overlapBounds.minX;
              const height = overlapBounds.maxY - overlapBounds.minY;
              
              const x = overlapBounds.minX + (col + 0.5) * (width / cols);
              const y = overlapBounds.minY + (row + 0.5) * (height / cols);

              return (
                <motion.text
                  key={`text-${idx}`}
                  x={x}
                  y={y}
                  fill="white"
                  fontSize="14"
                  fontWeight="500"
                  opacity="0.9"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ cursor: "pointer", pointerEvents: "auto" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("Selected type:", projectType);
                  }}
                >
                  {projectType}
                </motion.text>
              );
            })}
          </g>
        </svg>
      </motion.div>
    );
  }

  // For three-way overlap, use SVG clip-path (built earlier)
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: "none" }}
      >
        <defs>
          {/* A∩B path - update via ref */}
          <clipPath id={`clip-ab-3-${overlapIdx}`} clipPathUnits="userSpaceOnUse">
            <path ref={pathRef3WayAB} d={intersectionPath} />
          </clipPath>
          {/* Circle C - nested clipPath creates A∩B∩C */}
          <clipPath id={`clip-c-3-${overlapIdx}`} clipPathUnits="userSpaceOnUse">
            <circle ref={circleRef3WayC} cx={circles[2].x} cy={circles[2].y} r={circles[2].radius} />
          </clipPath>
        </defs>
        <g clipPath={`url(#clip-ab-3-${overlapIdx})`} style={{ pointerEvents: "none" }}>
          <g clipPath={`url(#clip-c-3-${overlapIdx})`}>
            {overlapBounds && (shuffled.current as string[]).map((projectType, idx) => {
              // Distribute text evenly within the overlap bounds
              const cols = Math.ceil(Math.sqrt((shuffled.current as string[]).length));
              const row = Math.floor(idx / cols);
              const col = idx % cols;
              
              const width = overlapBounds.maxX - overlapBounds.minX;
              const height = overlapBounds.maxY - overlapBounds.minY;
              
              const x = overlapBounds.minX + (col + 0.5) * (width / cols);
              const y = overlapBounds.minY + (row + 0.5) * (height / cols);

              return (
                <motion.text
                  key={`text-${idx}`}
                  x={x}
                  y={y}
                  fill="white"
                  fontSize="14"
                  fontWeight="500"
                  opacity="0.9"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ cursor: "pointer", pointerEvents: "auto" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("Selected type:", projectType);
                  }}
                >
                  {projectType}
                </motion.text>
              );
            })}
          </g>
        </g>
      </svg>
    </motion.div>
  );
}
