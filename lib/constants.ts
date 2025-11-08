import { Project } from "./types";

export const SITE_CONFIG = {
  name: "DGSD",
  tagline: "Creative Agency",
  description: "We design experiences that matter",
  url: "https://dgsd.vercel.app",
} as const;

export const PROJECTS: Project[] = [
  {
    id: "project-1",
    title: "Brand Evolution",
    description: "Complete brand identity redesign for tech startup",
  },
  {
    id: "project-2",
    title: "Interactive Platform",
    description: "Web application with immersive 3D experience",
  },
  {
    id: "project-3",
    title: "Motion Reel 2024",
    description: "Collection of motion graphics and animations",
  },
  {
    id: "project-4",
    title: "3D Product Viz",
    description: "Photorealistic product visualization",
  },
  {
    id: "project-5",
    title: "Print Campaign",
    description: "Editorial design and print campaign",
  },
  {
    id: "project-6",
    title: "Brand Strategy",
    description: "Strategic positioning for global brand",
  },
];

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/archive", label: "Archive" },
] as const;

// Circle categories
export const CIRCLE_CATEGORIES = {
  A: "Spatial",
  B: "Interactive",
  C: "Culture",
} as const;

// Project types for each circle combination
export const CIRCLE_PROJECT_TYPES = {
  spatialInteractive: [
    "Responsive buildings",
    "Adaptive wayfinding",
    "Smart materials",
    "Projection mapping",
    "Sensor lighting",
    "Interactive facades",
    "Kinetic architecture",
    "Touch surfaces",
    "Ambient computing",
    "Modular systems",
    "Haptic environments",
    "Motion tracking",
    "Environmental interfaces",
    "Adaptive furniture",
    "Gesture control",
  ],
  interactiveCulture: [
    "Community platforms",
    "Participatory tools",
    "Interactive archives",
    "Language preservation",
    "Hybrid ceremonies",
    "Digital storytelling",
    "Cultural games",
    "Oral history",
    "Traditional crafts",
    "Community mapping",
    "Identity platforms",
    "Cultural exchange",
    "Ritual design",
    "Memory interfaces",
    "Heritage apps",
  ],
  spatialCulture: [
    "Community spaces",
    "Cultural renovations",
    "Public activation",
    "Housing typologies",
    "Sacred design",
    "Gathering places",
    "Cultural landscapes",
    "Ceremonial architecture",
    "Community gardens",
    "Cultural districts",
    "Traditional building",
    "Public plazas",
    "Neighborhood identity",
    "Cultural infrastructure",
    "Place making",
  ],
  allThree: [
    "Smart infrastructure",
    "Adaptive centers",
    "Planning tools",
    "Resilience hubs",
    "Responsive art",
    "Heritage documentation",
    "Community kiosks",
    "Cultural dashboards",
    "Interactive memorials",
    "Neighborhood apps",
    "Civic engagement",
    "Cultural navigation",
    "Public interfaces",
    "Community sensing",
    "Participatory design",
  ],
} as const;

