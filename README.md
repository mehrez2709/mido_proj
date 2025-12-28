# Investment Cash Cycle Dashboard

A professional, responsive web application for tracking investment transactions with automated profit calculations and Google Sheets integration.

## Features

- 📊 **Real-time Dashboard**: Track total cash in, profit, and returns
- 📱 **Fully Responsive**: Works seamlessly on mobile, tablet, and desktop
- ✅ **Comprehensive Validation**: Client-side validation with real-time feedback
- 📅 **Auto-calculated Cash Out Dates**: Based on investment plan (1 month or 3 months)
- ☁️ **Google Sheets Integration**: Automatic sync with Google Sheets for data persistence
- 💾 **Local Storage Backup**: Data saved locally as backup
- 🎨 **Modern UI**: Clean, professional design with smooth animations

## Tech Stack

- Pure HTML, CSS, and JavaScript (no frameworks)
- Google Apps Script for backend
- Google Sheets for data storage
- Vercel for hosting

## Deployment to Vercel

### Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. Git repository (optional but recommended)

### Steps

1. **Install Vercel CLI** (optional):
   ```bash
   npm i -g vercel
   ```

2. **Deploy via Vercel Dashboard**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your Git repository or drag and drop the project folder
   - Vercel will automatically detect the configuration

3. **Deploy via CLI**:
   ```bash
   vercel
   ```

4. **Production Deployment**:
   ```bash
   vercel --prod
   ```

The `vercel.json` file is already configured with:
- Static file serving
- Security headers
- Proper routing

## Google Sheets Setup

1. Follow the instructions in `SETUP_INSTRUCTIONS.md`
2. Update the `GOOGLE_SCRIPT_URL` constant in `index.html` with your Web App URL
3. Ensure your Google Apps Script is deployed with "Anyone" access

## Validation Rules

### Client Name
- Required
- 2-100 characters
- Letters, numbers, and common punctuation only

### Phone Number
- Optional
- 7-15 digits when provided
- Accepts various formats (with spaces, dashes, parentheses)

### Date
- Required
- Cannot be in the future
- Must be a valid date

### Cash In
- Required
- Must be a positive number
- Maximum: 999,999,999
- Supports decimals (2 decimal places)

### Plan
- Required
- Must select either:
  - Monthly Plan (5%)
  - 3 Months Plan (15%)

### Notes
- Optional
- Maximum 500 characters

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Lightweight: No external dependencies
- Fast loading: Optimized CSS and JavaScript
- Responsive: Mobile-first design approach

## Security

- XSS Protection headers
- Content Security Policy ready
- Input sanitization
- CORS handling

## License

Private project - All rights reserved

