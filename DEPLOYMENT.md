# Deployment Guide - Vercel

## Quick Deploy

### Option 1: Vercel Dashboard (Recommended)

1. **Prepare your project**:
   - Ensure `vercel.json` is in the root directory
   - Update `GOOGLE_SCRIPT_URL` in `index.html` with your Google Apps Script URL
   - Commit all changes to Git (if using version control)

2. **Deploy via Dashboard**:
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "New Project"
   - Import your Git repository OR drag and drop your project folder
   - Vercel will auto-detect the configuration
   - Click "Deploy"

3. **Get your URL**:
   - After deployment, you'll get a URL like: `your-project.vercel.app`
   - Your site is live!

### Option 2: Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Production Deploy**:
   ```bash
   vercel --prod
   ```

## Configuration

The `vercel.json` file includes:
- ✅ Static file serving
- ✅ Security headers (XSS protection, frame options, etc.)
- ✅ Proper routing for SPA

## Environment Variables

If you need to change the Google Script URL dynamically, you can:

1. Add it as an environment variable in Vercel dashboard
2. Update the code to read from `process.env.GOOGLE_SCRIPT_URL` (requires build step)

For now, the URL is hardcoded in `index.html` which is fine for static deployment.

## Custom Domain

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Updates

To update your deployment:
- **Via Dashboard**: Push to your Git repository, Vercel auto-deploys
- **Via CLI**: Run `vercel --prod` again

## Troubleshooting

### CORS Issues
- Ensure Google Apps Script is deployed with "Anyone" access
- Check that the Web App URL is correct

### 404 Errors
- Verify `vercel.json` routing configuration
- Ensure `index.html` is in the root directory

### Build Failures
- Check that all files are committed
- Verify `vercel.json` syntax is correct

## Performance Tips

- ✅ Already optimized: No external dependencies
- ✅ Static files are automatically cached by Vercel
- ✅ CDN distribution is automatic

## Security Checklist

- ✅ Security headers configured in `vercel.json`
- ✅ Input validation implemented
- ✅ XSS protection enabled
- ✅ CORS properly handled

Your application is production-ready!

