# Deployment Guide

## Quick Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings
   - Click "Deploy"

3. **Done!** Your site will be live at `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

## Custom Domain Setup

1. Go to your project settings on Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Update your DNS records as instructed
5. Wait for SSL certificate to provision (automatic)

## Environment Variables

If you need to add environment variables:

1. Create `.env.local` locally (already in .gitignore)
2. Add variables to Vercel dashboard under "Settings" → "Environment Variables"
3. Redeploy for changes to take effect

Example `.env.local`:
```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_GA_ID=your-analytics-id
```

## Post-Deployment Checklist

- [ ] Test all three navigation modes (Construction, Grid, Filter)
- [ ] Verify all pages load correctly (Home, About, Archive)
- [ ] Check mobile responsiveness
- [ ] Test traffic cone drag functionality
- [ ] Verify animations play smoothly
- [ ] Check that placeholder images display correctly
- [ ] Test navigation between pages
- [ ] Verify footer links work
- [ ] Check that metadata displays correctly in social shares

## Performance Optimization

Your site is already optimized with:

✅ Next.js App Router for optimal performance  
✅ Image optimization enabled  
✅ Code splitting and lazy loading  
✅ Compression enabled  
✅ React strict mode  
✅ Optimized Framer Motion animations  

To check your Lighthouse score:
1. Open your deployed site in Chrome
2. Open DevTools (F12)
3. Go to "Lighthouse" tab
4. Run audit

Target scores:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+

## Updating Content

### Add New Projects

Edit `lib/constants.ts`:

```typescript
{
  id: "new-project",
  title: "New Project",
  description: "Description here",
  category: "branding",
  image: "/projects/new-project.jpg",
  year: "2024",
  tags: ["Tag1", "Tag2"],
}
```

### Replace Placeholder Images

1. Add your images to `public/projects/`
2. Update the image paths in `lib/constants.ts`
3. Remove the `PlaceholderImage` usage and replace with:

```tsx
<Image
  src={project.image}
  alt={project.title}
  fill
  className="object-cover"
/>
```

## Troubleshooting

### Build Fails

- Check for TypeScript errors: `npm run build`
- Verify all dependencies are installed: `npm install`
- Check Node.js version (should be 18+)

### Animations Not Working

- Clear browser cache
- Check if JavaScript is enabled
- Verify Framer Motion is installed: `npm list framer-motion`

### Images Not Loading

- Verify image paths are correct
- Check that images exist in `public/` directory
- Ensure Next.js image optimization is configured in `next.config.ts`

## Support

For deployment issues:
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)

For code issues, refer to the main README.md

