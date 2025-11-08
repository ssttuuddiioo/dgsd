"use client";

import { useEffect, useState } from "react";

interface DragBounds {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export function useDragBounds(
  gridColumns: number = 8,
  gridRows: number = 6,
  cellSize: number = 100
): DragBounds {
  const [bounds, setBounds] = useState<DragBounds>({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  });

  useEffect(() => {
    const updateBounds = () => {
      setBounds({
        left: 0,
        right: gridColumns * cellSize - cellSize,
        top: 0,
        bottom: gridRows * cellSize - cellSize,
      });
    };

    updateBounds();
    window.addEventListener("resize", updateBounds);

    return () => {
      window.removeEventListener("resize", updateBounds);
    };
  }, [gridColumns, gridRows, cellSize]);

  return bounds;
}

