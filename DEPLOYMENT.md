# 🚀 TechStore Deployment Guide

## GitHub Pages Setup

### Step 1: Repository Setup
```bash
# Create new repository on GitHub first, then:
git remote add origin https://github.com/tu-usuario/techstore-demo.git
git branch -M main
git push -u origin main
```

### Step 2: Enable GitHub Pages
1. Go to repository **Settings** tab
2. Scroll to **Pages** section
3. Source: **Deploy from a branch**
4. Branch: **main** / **(root)**
5. Click **Save**

### Step 3: Custom Domain (Optional)
1. Add CNAME file with your domain
2. Configure DNS A records:
   - 185.199.108.153
   - 185.199.109.153
   - 185.199.110.153
   - 185.199.111.153

## Alternative Deployment Platforms

### Netlify
1. Drag project folder to netlify.com
2. Configure build settings (if needed)
3. Deploy automatically on every commit

### Vercel
```bash
npm i -g vercel
vercel --prod
```

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## Performance Optimization for Production

### CSS Optimization
```bash
# Minify CSS
npx clean-css-cli styles.css -o styles.min.css
```

### JavaScript Optimization
```bash
# Minify JavaScript
npx terser script.js -o script.min.js
```

### Image Optimization
- Use WebP format for better compression
- Implement lazy loading for product images
- Add responsive image sizes

## SEO Checklist
- ✅ Meta description unique and descriptive
- ✅ Title tags optimized for keywords
- ✅ Open Graph tags for social media
- ✅ Structured data for products
- ✅ XML sitemap generated
- ✅ Robots.txt configured
- ✅ Internal linking optimized
- ✅ Page speed optimized

## Analytics Setup

### Google Analytics 4
Add to `<head>` section:
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Hotjar (Optional)
For user behavior analytics and heatmaps.

## Security Headers

### _headers file (for Netlify)
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
```

## Monitoring and Maintenance

### Performance Monitoring
- Use Google PageSpeed Insights
- Monitor Core Web Vitals
- Set up uptime monitoring

### Regular Updates
- Update dependencies monthly
- Test across different browsers
- Optimize based on user analytics
- Update content and product data

## Troubleshooting

### Common Issues
1. **CSS not loading**: Check file paths and case sensitivity
2. **JavaScript errors**: Open browser console for debugging
3. **Mobile layout issues**: Test responsive design tools
4. **Performance issues**: Use Lighthouse for analysis

### Browser Compatibility
- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅
