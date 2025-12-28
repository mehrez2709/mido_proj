/**
 * Google Apps Script for Investment Cash Cycle Dashboard
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to https://script.google.com
 * 2. Create a new project
 * 3. Copy and paste this entire code
 * 4. Create a new Google Sheet (or use an existing one)
 * 5. Copy the Sheet ID from the URL (the long string between /d/ and /edit)
 * 6. Replace 'YOUR_SHEET_ID' below with your actual Sheet ID
 * 7. Replace 'Sheet1' with your sheet name if different
 * 8. Save the script
 * 9. Click "Deploy" > "New deployment"
 * 10. Select type: "Web app"
 * 11. Execute as: "Me"
 * 12. Who has access: "Anyone" (or "Anyone with Google account" for more security)
 * 13. Click "Deploy"
 * 14. Copy the Web App URL and paste it into your HTML dashboard
 */

// CONFIGURATION - Update these values
const SHEET_ID = 'YOUR_SHEET_ID'; // Replace with your Google Sheet ID
const SHEET_NAME = 'Sheet1'; // Replace with your sheet name if different

/**
 * Helper function to create CORS-enabled response using HtmlService
 * This properly handles CORS preflight requests
 */
function createCorsResponse(data) {
  const jsonData = JSON.stringify(data);
  const htmlOutput = HtmlService.createHtmlOutput(
    '<!DOCTYPE html><html><head><script>window.parent.postMessage(' + 
    JSON.stringify(jsonData) + 
    ', "*");</script></head><body>' + jsonData + '</body></html>'
  )
  .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
  .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  
  // For direct JSON response, we'll use a different approach
  // Return as text with proper headers
  return ContentService
    .createTextOutput(jsonData)
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handle OPTIONS request for CORS preflight
 * Note: Google Apps Script doesn't have doOptions, so we handle it in doGet/doPost
 */
function handleCorsPreflight() {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
}

/**
 * Main doPost function - handles adding new entries
 */
function doPost(e) {
  try {
    let data;
    
    // Handle both JSON and form-encoded data
    if (e.postData && e.postData.contents) {
      try {
        // Try JSON first
        data = JSON.parse(e.postData.contents);
      } catch (e1) {
        // If JSON fails, try form-encoded
        const params = e.parameter;
        if (params && params.data) {
          data = JSON.parse(params.data);
        } else {
          throw new Error('Invalid request format');
        }
      }
    } else if (e.parameter && e.parameter.data) {
      // Handle form-encoded data
      data = JSON.parse(e.parameter.data);
    } else {
      throw new Error('No data received');
    }
    
    // Handle update paid status
    if (data.action === 'updatePaid' && data.data) {
      const updateData = data.data;
      const sheet = getSheet();
      const dataRange = sheet.getDataRange().getValues();
      
      // Check if Paid column exists, if not add it
      const headers = dataRange[0];
      let paidColumnIndex = 7; // Default to column 7 (index 6)
      
      // Find Paid column index
      for (let h = 0; h < headers.length; h++) {
        if (String(headers[h]).toLowerCase() === 'paid') {
          paidColumnIndex = h + 1; // Convert to 1-based
          break;
        }
      }
      
      // If Paid column doesn't exist, add it
      if (paidColumnIndex > headers.length) {
        sheet.getRange(1, paidColumnIndex).setValue('Paid');
        paidColumnIndex = headers.length + 1;
      }
      
      // Find the row to update (match by date and client)
      let found = false;
      for (let i = 1; i < dataRange.length; i++) {
        const row = dataRange[i];
        const rowDate = row[0] instanceof Date ? row[0].toISOString().split('T')[0] : String(row[0]);
        const rowClient = String(row[1]).trim();
        const updateDate = String(updateData.date).trim();
        const updateClient = String(updateData.client).trim();
        
        if (rowDate === updateDate && rowClient === updateClient) {
          // Update paid status
          sheet.getRange(i + 1, paidColumnIndex).setValue(updateData.paid === true || updateData.paid === 'true' || updateData.paid === 1);
          found = true;
          return createCorsResponse({ success: true, message: 'Paid status updated successfully' });
        }
      }
      
      if (!found) {
        return createCorsResponse({ success: false, error: 'Entry not found. Date: ' + updateData.date + ', Client: ' + updateData.client });
      }
    }
    
    if (data.action === 'add' && data.data) {
      const entry = data.data;
      const sheet = getSheet();
      
      // Initialize headers if sheet is empty
      if (sheet.getLastRow() === 0) {
        sheet.appendRow(['Date', 'Client', 'Phone', 'Cash In', 'Plan', 'Notes', 'Paid']);
      }
      
      // Calculate cash out date based on plan
      const entryDate = new Date(entry.date);
      const months = entry.plan == "1" ? 1 : 3; // 1 month for plan 1, 3 months for plan 3
      entryDate.setMonth(entryDate.getMonth() + months);
      const cashOutDate = entryDate.toISOString().split('T')[0]; // YYYY-MM-DD format
      
      // Add the new entry
      sheet.appendRow([
        entry.date,
        entry.client,
        entry.phone || '',
        entry.cashIn || 0,
        entry.plan,
        entry.notes || '',
        entry.paid || false
      ]);
      
      return createCorsResponse({ success: true, message: 'Entry added successfully' });
    } else {
      throw new Error('Invalid request format. Expected: { action: "add", data: {...} }');
    }
  } catch (error) {
    return createCorsResponse({ success: false, error: error.toString() });
  }
}

/**
 * Helper function to get the sheet with error handling
 */
function getSheet() {
  // Check if SHEET_ID is configured
  if (SHEET_ID === 'YOUR_SHEET_ID' || !SHEET_ID) {
    throw new Error('SHEET_ID is not configured. Please update the SHEET_ID constant in the script.');
  }
  
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      // List available sheet names for debugging
      const allSheets = spreadsheet.getSheets();
      const sheetNames = allSheets.map(s => s.getName()).join(', ');
      throw new Error(`Sheet "${SHEET_NAME}" not found. Available sheets: ${sheetNames}. Please update SHEET_NAME constant.`);
    }
    
    return sheet;
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('not configured')) {
      throw error;
    }
    throw new Error(`Cannot access spreadsheet. Check that SHEET_ID "${SHEET_ID}" is correct and the script has permission to access it. Original error: ${error.toString()}`);
  }
}

/**
 * Main doGet function - handles fetching all entries
 */
function doGet(e) {
  try {
    // Handle CORS preflight OPTIONS request
    if (e.parameter && e.parameter.method === 'OPTIONS') {
      return handleCorsPreflight();
    }
    
    const action = e.parameter.action;
    
    if (action === 'get') {
      const sheet = getSheet();
      
      // Check if sheet is empty
      if (sheet.getLastRow() === 0) {
        return createCorsResponse({ success: true, entries: [] });
      }
      
      const data = sheet.getDataRange().getValues();
      
      if (data.length === 0) {
        return createCorsResponse({ success: true, entries: [] });
      }
      
      // Check header row to determine format
      const headers = data[0];
      const hasPhoneColumn = headers.length > 2 && (headers[2] === 'Phone' || headers[2] === 'phone');
      const isOldFormat = headers.length > 2 && (headers[2] === 'Cash In' || headers[2] === 'cashIn' || typeof headers[2] === 'number');
      
      // Skip header row
      const entries = [];
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (row[0] && row[1]) { // Date and Client are required
          let entry;
          
          if (hasPhoneColumn || (!isOldFormat && headers.length >= 6)) {
            // New format: Date, Client, Phone, Cash In, Plan, Notes
            // Format date properly (Google Sheets dates might be Date objects or strings)
            let dateValue = row[0];
            if (dateValue instanceof Date) {
              dateValue = dateValue.toISOString().split('T')[0]; // Convert to YYYY-MM-DD
            } else if (typeof dateValue === 'string') {
              // Ensure it's in YYYY-MM-DD format
              const dateObj = new Date(dateValue);
              if (!isNaN(dateObj.getTime())) {
                dateValue = dateObj.toISOString().split('T')[0];
              }
            }
            
            entry = {
              date: dateValue ? String(dateValue) : '',
              client: row[1] ? String(row[1]).trim() : '',
              phone: row[2] ? String(row[2]).trim() : '',
              cashIn: parseFloat(row[3]) || 0,
              plan: row[4] ? String(row[4]).trim() : '1',
              notes: row[5] ? String(row[5]).trim() : '',
              paid: row[6] === true || row[6] === 'true' || row[6] === 1 || row[6] === '1' || false
            };
          } else {
            // Old format: Date, Client, Cash In, Cash Out, Plan, Notes
            let dateValue = row[0];
            if (dateValue instanceof Date) {
              dateValue = dateValue.toISOString().split('T')[0];
            } else if (typeof dateValue === 'string') {
              const dateObj = new Date(dateValue);
              if (!isNaN(dateObj.getTime())) {
                dateValue = dateObj.toISOString().split('T')[0];
              }
            }
            
            entry = {
              date: dateValue ? String(dateValue) : '',
              client: row[1] ? String(row[1]).trim() : '',
              phone: '', // No phone in old format
              cashIn: parseFloat(row[2]) || 0,
              plan: row[4] ? String(row[4]).trim() : '1',
              notes: row[5] ? String(row[5]).trim() : '',
              paid: row[6] === true || row[6] === 'true' || row[6] === 1 || false
            };
          }
          
          // Validate entry has required fields
          if (entry.date && entry.client) {
            entries.push(entry);
          }
        }
      }
      
      return createCorsResponse({ success: true, entries: entries });
    } else {
      throw new Error('Invalid action. Use ?action=get to fetch entries.');
    }
  } catch (error) {
    return createCorsResponse({ success: false, error: error.toString() });
  }
}


