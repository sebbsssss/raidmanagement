# 🚀 Vercel Deployment Guide for X Raider Tracker

## 📋 Prerequisites

- [Node.js 18+](https://nodejs.org/) installed on your computer
- [Git](https://git-scm.com/) installed
- [Vercel account](https://vercel.com/) (free tier is sufficient)
- [GitHub account](https://github.com/) (recommended for automatic deployments)

## 📁 Step 1: Prepare Your Project

### Option A: Download the Complete Package
1. Download the `raider-tracker-complete.tar.gz` file
2. Extract it to your desired location:
   ```bash
   tar -xzf raider-tracker-complete.tar.gz
   cd raider-tracker
   ```

### Option B: Create from Scratch
1. Create a new directory and copy all the source files
2. Initialize the project:
   ```bash
   mkdir my-raider-tracker
   cd my-raider-tracker
   # Copy all files from the raider-tracker folder
   ```

## 🔧 Step 2: Project Setup

### Install Dependencies
```bash
npm install
```

### Test Locally (Optional)
```bash
npm run dev
```
Visit `http://localhost:5173` to ensure everything works.

### Build for Production
```bash
npm run build
```
This creates a `dist/` folder with optimized files.

## 📤 Step 3: Deploy to Vercel

### Method 1: Vercel CLI (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - **Set up and deploy?** → Yes
   - **Which scope?** → Select your account
   - **Link to existing project?** → No
   - **Project name?** → `raider-tracker` (or your preferred name)
   - **Directory?** → `./` (current directory)
   - **Override settings?** → No

4. **Production Deployment:**
   ```bash
   vercel --prod
   ```

### Method 2: GitHub + Vercel Dashboard

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: X Raider Tracker"
   git branch -M main
   git remote add origin https://github.com/yourusername/raider-tracker.git
   git push -u origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Configure settings:
     - **Framework Preset:** Vite
     - **Build Command:** `npm run build`
     - **Output Directory:** `dist`
     - **Install Command:** `npm install`

3. **Deploy:**
   - Click "Deploy"
   - Wait for deployment to complete

### Method 3: Direct Upload

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Upload via Vercel Dashboard:**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Choose "Upload" tab
   - Drag and drop the `dist/` folder
   - Click "Deploy"

## ⚙️ Step 4: Configure Vercel Settings

### vercel.json Configuration
Create a `vercel.json` file in your project root:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Environment Variables (if needed)
1. Go to your project dashboard on Vercel
2. Click "Settings" → "Environment Variables"
3. Add any required variables:
   ```
   NODE_ENV=production
   VITE_APP_NAME=X Raider Tracker
   ```

## 🌐 Step 5: Custom Domain (Optional)

1. **In Vercel Dashboard:**
   - Go to your project
   - Click "Settings" → "Domains"
   - Add your custom domain
   - Follow DNS configuration instructions

2. **DNS Configuration:**
   - Add CNAME record pointing to `cname.vercel-dns.com`
   - Or add A record pointing to `76.76.19.61`

## 🔄 Step 6: Automatic Deployments

### GitHub Integration Benefits:
- **Automatic deployments** on every push to main branch
- **Preview deployments** for pull requests
- **Rollback capabilities** to previous versions
- **Branch deployments** for testing

### Setup:
1. Connect your GitHub repository to Vercel
2. Every push to `main` branch will trigger a new deployment
3. Pull requests will create preview deployments

## 📱 Step 7: Access Your Deployed App

After successful deployment:

1. **Get your URL:**
   - Vercel provides a URL like: `https://raider-tracker-abc123.vercel.app`
   - Or your custom domain if configured

2. **Test the application:**
   - **Admin Login:** username: `admin`, password: `password`
   - **Raider Login:** username: `raider1`, password: `password`

## 🛠 Troubleshooting

### Common Issues:

**Build Fails:**
```bash
# Check your build locally first
npm run build

# If it works locally, check Vercel build logs
```

**404 Errors on Refresh:**
- Ensure `vercel.json` includes the rewrite rule for SPA routing

**Slow Loading:**
- Vercel automatically optimizes static assets
- Consider enabling Edge Functions if needed

**Environment Variables:**
- Prefix client-side variables with `VITE_`
- Server-side variables don't need prefix

### Debug Commands:
```bash
# Check Vercel CLI version
vercel --version

# View deployment logs
vercel logs

# List all deployments
vercel ls
```

## 🔧 Advanced Configuration

### Performance Optimization:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Security Headers:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

## 📊 Monitoring & Analytics

1. **Vercel Analytics:**
   - Enable in project settings
   - Track page views and performance

2. **Error Monitoring:**
   - Vercel automatically captures build errors
   - Runtime errors visible in function logs

## 🎯 Final Checklist

- [ ] Project builds successfully locally
- [ ] All dependencies are in `package.json`
- [ ] `vercel.json` is configured correctly
- [ ] Environment variables are set (if needed)
- [ ] Custom domain is configured (if desired)
- [ ] GitHub integration is set up for auto-deployments
- [ ] Application loads and functions correctly on Vercel URL

## 🚀 You're Live!

Your X Raider Tracker is now deployed and accessible worldwide! The system will automatically handle:
- SSL certificates
- Global CDN distribution
- Automatic scaling
- Zero-downtime deployments

**Next Steps:**
1. Share the URL with your raiders
2. Set up your admin account
3. Start tracking raider performance
4. Consider integrating with X API for automation

Need help? Check the [Vercel documentation](https://vercel.com/docs) or reach out for support!
