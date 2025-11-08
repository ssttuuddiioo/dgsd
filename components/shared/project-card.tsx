"use client";

import { motion } from "framer-motion";
import { Project } from "@/lib/types";
import { CATEGORY_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { PlaceholderImage } from "./placeholder-image";

interface ProjectCardProps {
  project: Project;
  className?: string;
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  return (
    <motion.article
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "group relative overflow-hidden bg-muted rounded-lg cursor-pointer",
        className
      )}
    >
      <div className="aspect-[4/3] relative overflow-hidden">
        <PlaceholderImage
          category={project.category}
          title={project.title}
          className="w-full h-full transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: CATEGORY_COLORS[project.category] }}
          />
          <span className="text-xs uppercase tracking-wider text-foreground/60">
            {project.category}
          </span>
          <span className="text-xs text-foreground/40">·</span>
          <span className="text-xs text-foreground/60">{project.year}</span>
        </div>

        <h3 className="text-lg font-semibold mb-1 group-hover:text-accent transition-colors">
          {project.title}
        </h3>

        <p className="text-sm text-foreground/60 line-clamp-2 mb-3">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 bg-background rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

