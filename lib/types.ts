export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  link?: string;
}

export type ToolMode = "venn-diagram" | "archive-grid";

export interface Circle {
  id: string;
  x: number;
  y: number;
  radius: number;
  category?: string;
}

