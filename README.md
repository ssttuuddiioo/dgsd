# DGSD - Creative Agency Portfolio

An interactive portfolio website built with Next.js, featuring traffic cone navigation, infinite canvas exploration, and smooth animations.

## Features

- 🚧 **Construction Mode**: Draggable traffic cones that reveal content when moved
- ⊞ **Infinite Canvas**: Mouse-driven infinite scroll through projects
- ▦ **Filter Mode**: Hover near cones to filter projects by category
- 🎨 **Smooth Animations**: Framer Motion powered transitions
- 🎯 **Three.js Support**: Optional 3D scene components
- 📱 **Responsive Design**: Works seamlessly across devices
- ⚡ **Performance Optimized**: Built with Next.js 14 App Router

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **3D**: React Three Fiber + Drei
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
/app                    # Next.js App Router pages
  /about               # About page
  /archive             # Projects archive
  page.tsx             # Landing page with modes
  layout.tsx           # Root layout
  globals.css          # Global styles

/components
  /landing             # Landing page components
    construction-mode.tsx
    infinite-canvas.tsx
    filter-mode.tsx
    traffic-cone.tsx
    tool-sidebar.tsx
  /layout              # Layout components
    header.tsx
    footer.tsx
  /shared              # Shared components
    project-card.tsx
  /three               # 3D components
    scene.tsx
    floating-object.tsx

/lib                   # Utilities and constants
  animations.ts        # Framer Motion variants
  constants.ts         # Site config and data
  types.ts             # TypeScript types
  utils.ts             # Helper functions
  /hooks               # Custom React hooks

/public                # Static assets
  /projects            # Project images
  /icons               # UI icons
```

## Customization

### Adding Projects

Edit `/lib/constants.ts` to add or modify projects:

```typescript
export const PROJECTS: Project[] = [
  {
    id: "unique-id",
    title: "Project Name",
    description: "Project description",
    category: "branding", // or web, motion, 3d, print, strategy
    image: "/projects/image.jpg",
    year: "2024",
    tags: ["Tag1", "Tag2"],
  },
  // ... more projects
];
```

### Updating Colors

Modify the color scheme in `/app/globals.css`:

```css
:root {
  --accent: #ff6b00;  /* Primary accent color */
  --background: #ffffff;
  --foreground: #171717;
  /* ... other colors */
}
```

### Configuring Traffic Cones

Update cone positions and categories in `/lib/constants.ts`:

```typescript
export const INITIAL_CONES: Cone[] = [
  {
    id: "cone-1",
    x: 2,
    y: 1,
    category: "branding",
    color: CATEGORY_COLORS.branding,
  },
  // ... more cones
];
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Vercel will automatically detect Next.js and configure the build
4. Click "Deploy"

Or use the Vercel CLI:

```bash
npm i -g vercel
vercel
```

### Environment Variables

If you add any environment variables, create a `.env.local` file:

```env
# Add your variables here
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Performance

The site is optimized for performance:

- Server-side rendering with Next.js
- Image optimization with next/image
- Code splitting and lazy loading
- Optimized animations with Framer Motion
- Minimal bundle size

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Contact

For questions or collaboration: hello@dgsd.com
