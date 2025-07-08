# 🚀 Cars for Trees - Deployment Guide

This guide covers three deployment options for the Cars for Trees PWA, each optimized for different needs and preferences.

## 🎯 Prerequisites

Before deploying, ensure you have:
- ✅ Firebase project set up with Firestore and Storage enabled
- ✅ Environment variables configured (`.env` file)
- ✅ Project builds successfully (`npm run build`)
- ✅ All dependencies installed

## 🌟 Option 1: Vercel (Recommended)

**Best for:** Fast deployment, excellent performance, automatic HTTPS

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy
```bash
# From project root
vercel

# Follow prompts:
# - Set up and deploy? [Y/n] Y
# - Which scope? Choose your account
# - Link to existing project? [y/N] N
# - Project name: cars4trees-pwa
# - Directory: ./ (press Enter)
```

### Step 4: Configure Environment Variables
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to Settings → Environment Variables
4. Add all variables from your `.env` file:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_MEASUREMENT_ID`

### Step 5: Redeploy
```bash
vercel --prod
```

### Custom Domain (Optional)
1. In Vercel Dashboard → Domains
2. Add your custom domain
3. Configure DNS records as instructed

---

## 🟦 Option 2: Netlify

**Best for:** Git-based workflows, branch previews, form handling

### Method A: Drag & Drop (Quick)

1. Build the project:
   ```bash
   npm run build
   ```

2. Go to [Netlify](https://app.netlify.com/)
3. Drag the `dist/` folder to the deploy area
4. Configure environment variables in Site Settings

### Method B: Git Integration (Recommended)

1. Push code to GitHub/GitLab/Bitbucket
2. Go to [Netlify](https://app.netlify.com/)
3. Click "New site from Git"
4. Connect repository
5. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
6. Add environment variables:
   - Site Settings → Environment Variables
   - Add all Firebase config variables

### Netlify Configuration

Create `netlify.toml` in project root:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/sw.js"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
```

---

## 🔥 Option 3: Firebase Hosting

**Best for:** Firebase ecosystem integration, CDN, easy rollbacks

### Step 1: Install Firebase CLI
```bash
npm install -g firebase-tools
```

### Step 2: Login
```bash
firebase login
```

### Step 3: Initialize Hosting
```bash
firebase init hosting

# Select:
# - Use existing project → your-firebase-project
# - Public directory: dist
# - Single-page app: Yes
# - Automatic builds with GitHub: No (for now)
```

### Step 4: Build and Deploy
```bash
# Build the project
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

### Step 5: Custom Domain (Optional)
```bash
firebase hosting:channel:create live
firebase target:apply hosting production your-domain.com
```

### Firebase Configuration

The `firebase.json` file should look like:
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "/sw.js",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=0, must-revalidate"
          }
        ]
      }
    ]
  }
}
```

---

## 🔧 Post-Deployment Setup

### 1. Update Firebase Security Rules

**Firestore Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /carSubmissions/{document} {
      allow read: if true;
      allow create: if request.auth == null && 
                   resource.data.keys().hasAll(['imageUrl', 'location', 'createdAt']);
    }
  }
}
```

**Storage Rules:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /car-images/{imageId} {
      allow read: if true;
      allow write: if request.auth == null && 
                   resource.size < 10 * 1024 * 1024 &&
                   resource.contentType.matches('image/.*');
    }
  }
}
```

### 2. Enable CORS for Storage
```bash
# Create cors.json
echo '[
  {
    "origin": ["https://your-domain.com"],
    "method": ["GET", "POST"],
    "maxAgeSeconds": 3600
  }
]' > cors.json

# Apply CORS settings
gsutil cors set cors.json gs://your-firebase-storage-bucket
```

### 3. Test PWA Installation
1. Open deployed app on mobile
2. Check for "Add to Home Screen" prompt
3. Verify offline functionality
4. Test camera and geolocation features

---

## 📊 Performance Optimization

### 1. Enable Compression
Most hosting platforms enable gzip compression automatically. Verify with:
```bash
curl -H "Accept-Encoding: gzip" -I https://your-domain.com
```

### 2. Configure Caching Headers
Already configured in platform-specific sections above.

### 3. Monitor Performance
- Use [Google PageSpeed Insights](https://pagespeed.web.dev/)
- Check [Web.dev Measure](https://web.dev/measure/)
- Monitor with Google Analytics

---

## 🚨 Troubleshooting

### Common Issues

**PWA not installing:**
- Check manifest.json is accessible
- Verify HTTPS deployment
- Ensure service worker is registered

**Firebase errors:**
- Verify environment variables are set
- Check Firestore rules allow read/write
- Ensure Storage bucket has correct permissions

**Geolocation not working:**
- Must be served over HTTPS
- Check browser permissions
- Test on actual mobile device

**Images not uploading:**
- Check Storage rules
- Verify CORS configuration
- Check file size limits

### Debug Commands
```bash
# Check build output
npm run build -- --debug

# Test service worker locally
npm run preview

# Check Firebase configuration
firebase projects:list
firebase firestore:rules:get
```

---

## 🔄 Continuous Deployment

### GitHub Actions (Vercel)
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Vercel
on: [push]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### Auto-deploy on Git Push (Netlify)
1. Connect repository in Netlify dashboard
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables
5. Enable auto-deploy on push

---

## 📈 Monitoring & Analytics

### 1. Set up Firebase Analytics
Already configured in the app. View analytics at:
https://console.firebase.google.com/project/your-project/analytics

### 2. Error Tracking
Consider adding Sentry for error tracking:
```bash
npm install @sentry/react @sentry/vite-plugin
```

### 3. Performance Monitoring
Use Firebase Performance Monitoring:
```bash
npm install firebase/performance
```

---

## 🎉 Success!

Your Cars for Trees PWA should now be live and accessible! 

**Next Steps:**
1. Share the app URL with users
2. Monitor submissions in Firebase Console
3. Set up admin dashboard (future feature)
4. Plan marketing and community outreach

**Remember to:**
- Keep Firebase costs monitored
- Update security rules as needed
- Regular backups of Firestore data
- Monitor performance metrics

---

**Need help?** Open an issue in the GitHub repository or check the main README.md for support contacts.