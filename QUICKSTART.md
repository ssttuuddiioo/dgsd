# Quick Start Guide

Get your portfolio up and running in 3 steps:

## 1. Install Dependencies

```bash
npm install
```

## 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your site!

## 3. Explore the Features

### Landing Page - Three Interactive Modes

Click the tool icons on the left sidebar to switch between:

1. **🚧 Construction Mode** (Default)
   - Drag traffic cones to reveal content
   - Each cone blocks a grid cell
   - Move them around to uncover information

2. **⊞ Grid View** (Infinite Canvas)
   - Move your mouse to pan across projects
   - Mouse-driven exploration
   - Projects scattered across infinite space

3. **▦ Filter Mode**
   - Hover near cones to filter projects
   - Each cone represents a project category
   - Projects update based on proximity

### Other Pages

- **About** (`/about`) - Agency story with scroll animations
- **Archive** (`/archive`) - Filterable project grid

## Next Steps

1. **Customize Content**
   - Edit `lib/constants.ts` to add your projects
   - Update site name, tagline, and contact info

2. **Replace Placeholders**
   - Add project images to `public/projects/`
   - Update image paths in constants

3. **Deploy to Vercel**
   - See `DEPLOYMENT.md` for detailed instructions
   - One-click deploy from GitHub

## Build for Production

```bash
npm run build
npm run start
```

## Need Help?

- Check `README.md` for full documentation
- See `DEPLOYMENT.md` for deployment guide
- All components are documented with TypeScript types

Enjoy building your portfolio! 🎨

