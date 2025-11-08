"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { CIRCLE_CATEGORIES } from "@/lib/constants";

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
  const h = Math.sqrt(Math.max(0, c1.radius * c1.radius - a * a));
  
  const px = c1.x + (a * dx) / d;
  const py = c1.y + (a * dy) / d;
  
  const ix1 = px + (h * dy) / d;
  const iy1 = py - (h * dx) / d;
  
  const ix2 = px - (h * dy) / d;
  const iy2 = py + (h * dx) / d;

  // For the lens shape (intersection), we need the arc on each circle that's inside the other circle
  // Calculate angles to intersection points from each circle center
  const angle1ToIx1 = Math.atan2(iy1 - c1.y, ix1 - c1.x);
  const angle1ToIx2 = Math.atan2(iy2 - c1.y, ix2 - c1.x);
  const angle2ToIx1 = Math.atan2(iy1 - c2.y, ix1 - c2.x);
  const angle2ToIx2 = Math.atan2(iy2 - c2.y, ix2 - c2.x);
  
  // Calculate angle differences
  let angle1DiffSmall = Math.abs(angle1ToIx2 - angle1ToIx1);
  if (angle1DiffSmall > Math.PI) angle1DiffSmall = 2 * Math.PI - angle1DiffSmall;
  
  let angle2DiffSmall = Math.abs(angle2ToIx2 - angle2ToIx1);
  if (angle2DiffSmall > Math.PI) angle2DiffSmall = 2 * Math.PI - angle2DiffSmall;
  
  // Check which arc is inside the other circle by testing midpoint
  const angle1Mid = angle1ToIx1 + angle1DiffSmall / 2;
  const mid1X = c1.x + c1.radius * Math.cos(angle1Mid);
  const mid1Y = c1.y + c1.radius * Math.sin(angle1Mid);
  const dist1ToC2 = Math.sqrt((mid1X - c2.x) ** 2 + (mid1Y - c2.y) ** 2);
  const isArc1Inside = dist1ToC2 <= c2.radius;
  
  const angle2Mid = angle2ToIx1 + angle2DiffSmall / 2;
  const mid2X = c2.x + c2.radius * Math.cos(angle2Mid);
  const mid2Y = c2.y + c2.radius * Math.sin(angle2Mid);
  const dist2ToC1 = Math.sqrt((mid2X - c1.x) ** 2 + (mid2Y - c1.y) ** 2);
  const isArc2Inside = dist2ToC1 <= c1.radius;
  
  // Use the arc that's inside (smaller arc typically, but check)
  // If smaller arc is inside, use it (largeArc=0), otherwise use larger arc (largeArc=1)
  const largeArc1 = isArc1Inside ? 0 : 1;
  const largeArc2 = isArc2Inside ? 0 : 1;

  // Create the lens-shaped path (intersection)
  // Path: start at intersection point 1 -> arc on circle 1 -> intersection point 2 -> arc on circle 2 -> back to start
  // Using sweep-flag = 1 for counterclockwise direction
  return `M ${ix1},${iy1} 
          A ${c1.radius},${c1.radius} 0 ${largeArc1},1 ${ix2},${iy2} 
          A ${c2.radius},${c2.radius} 0 ${largeArc2},1 ${ix1},${iy1} Z`;
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
  const fillPathRefs = useRef<Map<string, SVGPathElement>>(new Map());

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
      
      // Update fill paths directly for real-time sync
      // Match by checking all possible overlap keys
      fillPathRefs.current.forEach((pathEl, key) => {
        if (key.startsWith('fill-3-')) {
          // Three-way overlap
          if (circles.length === 3 && 
              circlesOverlap(circles[0], circles[1]) && 
              circlesOverlap(circles[1], circles[2]) &&
              circlesOverlap(circles[0], circles[2])) {
            const abPath = getIntersectionPath(circles[0], circles[1]);
            pathEl.setAttribute("d", abPath);
          }
        } else if (key.startsWith('fill-')) {
          // Two-way overlap - try to match by checking all pairs
          const idx = parseInt(key.replace('fill-', ''));
          if (!isNaN(idx) && circles.length >= 2) {
            const pairs: [number, number][] = [[0, 1], [1, 2], [0, 2]];
            if (idx < pairs.length) {
              const [i, j] = pairs[idx];
              if (circlesOverlap(circles[i], circles[j])) {
                const intersectionPath = getIntersectionPath(circles[i], circles[j]);
                pathEl.setAttribute("d", intersectionPath);
              }
            }
          }
        }
      });
      
      rafId = requestAnimationFrame(loop);
    };
    if (draggedCircle || activeCircle) {
      rafId = requestAnimationFrame(loop);
    }
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [draggedCircle, activeCircle, circles]);

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

  // Detect overlaps
  type OverlapData = {
    circles: Circle[];
    center: { x: number; y: number };
    isThreeWay: boolean;
  };

  const overlaps: OverlapData[] = [];

  if (circles.length === 3) {
    // Check for three-way overlap first
    const allThreeOverlap = circlesOverlap(circles[0], circles[1]) && 
                           circlesOverlap(circles[1], circles[2]) &&
                           circlesOverlap(circles[0], circles[2]);
    
    if (allThreeOverlap) {
      const centerX = (circles[0].x + circles[1].x + circles[2].x) / 3;
      const centerY = (circles[0].y + circles[1].y + circles[2].y) / 3;
      
      overlaps.push({
        circles: [circles[0], circles[1], circles[2]],
        center: { x: centerX, y: centerY },
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
        overlaps.push({
          circles: [circles[i], circles[j]],
          center: getOverlapCenter(circles[i], circles[j]),
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

          {/* Create clipPath and mask for each overlap (2-way) - exact intersection shape */}
          {overlaps.map((overlap, idx) => {
            if (overlap.isThreeWay) {
              return null;
            }
            
            const c1 = overlap.circles[0];
            const c2 = overlap.circles[1];
            const intersectionPath = getIntersectionPath(c1, c2);
            
            return (
              <g key={`defs-${idx}`}>
                <clipPath id={`clip-overlap-${idx}`} clipPathUnits="userSpaceOnUse">
                  <path d={intersectionPath} />
                </clipPath>
                {/* Mask for intersection fill - both circles must overlap */}
                <mask id={`mask-overlap-${idx}`} maskUnits="userSpaceOnUse">
                  <rect width="100%" height="100%" fill="black" />
                  <circle cx={c1.x} cy={c1.y} r={c1.radius} fill="white" />
                  <circle cx={c2.x} cy={c2.y} r={c2.radius} fill="white" />
                </mask>
              </g>
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
                {/* Mask for three-way intersection: A∩B∩C - use composite to get intersection */}
                <mask id={`mask-3way-${idx}`} maskUnits="userSpaceOnUse">
                  <rect width="100%" height="100%" fill="black" />
                  {/* Use composite to get intersection - draw A∩B and C, then use intersect */}
                  <g fill="white">
                    <path d={abPath} />
                    <circle cx={c.x} cy={c.y} r={c.radius} />
                  </g>
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

        {/* Fill ONLY overlap areas - exact intersection shapes */}
        {overlaps.map((overlap, idx) => {
          if (overlap.circles.length < 2) return null;
          
          // Create unique key based on circle positions to force re-render
          const circleKey = overlap.circles.map(c => `${c.x.toFixed(1)}-${c.y.toFixed(1)}-${c.radius.toFixed(1)}`).join('|');
          
          if (overlap.isThreeWay) {
            // For three-way overlap: A∩B∩C
            // First get A∩B intersection
            const a = overlap.circles[0];
            const b = overlap.circles[1];
            const c = overlap.circles[2];
            const abPath = getIntersectionPath(a, b);
            
            // Check if A∩B path is valid
            if (!abPath) return null;
            
            // For three-way, we need to clip A∩B with circle C
            // Use nested clipPaths to get exact A∩B∩C
            return (
              <g key={`fill-3-${idx}-${circleKey}`} clipPath={`url(#clip-ab-3-${idx})`}>
                <g clipPath={`url(#clip-c-3-${idx})`}>
                  <path
                    ref={(el) => {
                      if (el) fillPathRefs.current.set(`fill-3-${idx}`, el);
                      else fillPathRefs.current.delete(`fill-3-${idx}`);
                    }}
                    d={abPath}
                    fill="rgba(255, 255, 255, 0.2)"
                  />
                </g>
              </g>
            );
          }
          
          // Two-way overlap - use exact intersection path directly
          const intersectionPath = getIntersectionPath(overlap.circles[0], overlap.circles[1]);
          
          // Only render if we have a valid intersection path
          if (!intersectionPath) return null;
          
          return (
            <path
              key={`fill-${idx}-${circleKey}`}
              ref={(el) => {
                if (el) fillPathRefs.current.set(`fill-${idx}`, el);
                else fillPathRefs.current.delete(`fill-${idx}`);
              }}
              d={intersectionPath}
              fill="rgba(255, 255, 255, 0.2)"
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

    </div>
  );
}

