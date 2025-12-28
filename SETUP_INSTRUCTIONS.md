# Google Sheets Integration Setup Instructions

## Step-by-Step Setup Guide

### 1. Create a Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Name it "Investment Cash Cycle Data" (or any name you prefer)
4. Copy the Sheet ID from the URL:
   - The URL looks like: `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE/edit`
   - Copy the part between `/d/` and `/edit`

### 2. Create Google Apps Script
1. Go to [Google Apps Script](https://script.google.com)
2. Click "New Project"
3. Delete the default code
4. Copy the entire contents of `GoogleAppsScript.gs` file
5. Paste it into the script editor
6. **IMPORTANT**: Find these two lines near the top:
   ```javascript
   const SHEET_ID = 'YOUR_SHEET_ID';
   const SHEET_NAME = 'Sheet1';
   ```
7. Replace `'YOUR_SHEET_ID'` with your actual Sheet ID (keep the quotes)
   - Example: `const SHEET_ID = '1abc123def456ghi789jkl012mno345pq';`
8. If your sheet tab name is not "Sheet1", update `SHEET_NAME` variable
   - To check your sheet name: Look at the bottom tab in your Google Sheet
   - Example: `const SHEET_NAME = 'Data';`
9. Click "Save" (Ctrl+S or Cmd+S)
10. Name your project (e.g., "Investment Dashboard API")

### 3. Deploy as Web App
1. Click "Deploy" in the top right
2. Select "New deployment"
3. Click the gear icon ⚙️ next to "Select type"
4. Choose "Web app"
5. Set the following:
   - **Description**: "Investment Dashboard API" (optional)
   - **Execute as**: "Me"
   - **Who has access**: **"Anyone"** ⚠️ **IMPORTANT: Must be "Anyone" for CORS to work!**
6. Click "Deploy"
7. **IMPORTANT**: Copy the Web App URL that appears
8. Click "Done"
9. **Note**: If you get CORS errors, make sure:
   - "Who has access" is set to "Anyone" (not "Anyone with Google account")
   - You're accessing the dashboard via `http://localhost:8000` (not file://)
   - You've created a NEW deployment after updating SHEET_ID

### 4. Authorize the Script
1. When you first run the script, Google will ask for authorization
2. Click "Review Permissions"
3. Select your Google account
4. Click "Advanced" → "Go to [Your Project Name] (unsafe)"
5. Click "Allow"
6. This gives the script permission to read/write to your Google Sheet

### 5. Run a Local Web Server (IMPORTANT!)
**You cannot open the HTML file directly** - browsers block CORS requests from `file://` protocol.

**Option 1: Use the provided script (Easiest)**
- **Mac/Linux**: Double-click `start-server.sh` or run: `./start-server.sh`
- **Windows**: Double-click `start-server.bat`
- Then open: `http://localhost:8000`

**Option 2: Manual server**
- Open terminal/command prompt in the project folder
- Run: `python3 -m http.server 8000` (or `python -m SimpleHTTPServer 8000`)
- Open browser to: `http://localhost:8000`

**Option 3: Node.js**
- Run: `npx http-server`
- Open the URL shown in terminal

### 6. Connect Your Dashboard
1. Open your dashboard at `http://localhost:8000` (NOT by double-clicking the file!)
2. In the "Google Sheets Configuration" section at the top
3. Paste the Web App URL you copied in step 3
4. Click "Save URL"
5. Click "Load from Google Sheets" to test the connection

## How It Works

- **Adding Entries**: When you add a new transaction, it's automatically saved to both:
  - Local storage (as backup)
  - Google Sheets (for permanent storage and sharing)

- **Loading Data**: Click "Load from Google Sheets" to fetch all entries from your sheet

- **Data Format**: The sheet will have these columns:
  - Date
  - Client
  - Cash In
  - Cash Out
  - Plan
  - Notes

## Troubleshooting

### "CORS policy" or "Access-Control-Allow-Origin" errors
**This is the most common error!** It happens when you open the HTML file directly.

**Solution:**
- You MUST run a local web server (see step 5 above)
- Do NOT double-click the HTML file
- Always access via `http://localhost:8000` or similar
- The dashboard will show a red warning if it detects you're using `file://` protocol

### "Cannot read properties of null (reading 'getDataRange')" or "SHEET_ID is not configured"
**This is the most common error!** It means the script can't find your Google Sheet.

**Solution:**
1. Open your Google Apps Script project
2. Check line 22: `const SHEET_ID = 'YOUR_SHEET_ID';`
3. If it still says `'YOUR_SHEET_ID'`, you haven't configured it yet!
4. Replace it with your actual Sheet ID (the long string from your Google Sheet URL)
5. Save the script
6. **Important**: You need to create a NEW deployment after changing the SHEET_ID
   - Go to "Deploy" > "Manage deployments"
   - Click the pencil icon to edit your deployment
   - Click "New version"
   - Click "Deploy"
   - Copy the new Web App URL and update it in your dashboard

### "Sheet 'Sheet1' not found"
- Check the bottom tab name in your Google Sheet
- Update `SHEET_NAME` in the script to match exactly (case-sensitive)
- Common names: "Sheet1", "Sheet 1", "Data", etc.

### "Error loading data"
- Make sure the Sheet ID is correct (no extra spaces, includes all characters)
- Make sure the sheet name matches exactly (case-sensitive)
- Check that the Web App is deployed and accessible
- Verify the script has permission to access the sheet
- Try running the script manually in Apps Script editor to see detailed errors

### "Entry saved locally. Google Sheets sync failed."
- Check your internet connection
- Verify the Web App URL is correct
- Make sure the script is deployed and not in "Test" mode
- Check the Apps Script execution log for errors
- Verify SHEET_ID and SHEET_NAME are configured correctly

### Permission Errors
- Re-authorize the script in Apps Script editor
- Make sure "Who has access" is set to "Anyone" or "Anyone with Google account"
- Run the script once manually in the editor to trigger authorization

## Security Note

The Web App URL allows anyone who has it to read/write to your sheet. For better security:
- Use "Anyone with Google account" instead of "Anyone"
- Or implement authentication in your Apps Script
- Keep your Web App URL private

