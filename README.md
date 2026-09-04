# HTML Tag Counter Chrome Extension

A Chrome extension that analyzes and counts all HTML tags on any webpage, providing detailed statistics about the page structure.

## Features

- 🔍 **Auto-detect current webpage**: Automatically detects the current active tab
- 📊 **Tag counting**: Counts all HTML tags on the page
- 📈 **Detailed statistics**: Shows total elements, unique tag types, and individual counts
- 🎯 **Sorted results**: Tags sorted by frequency (most common first)
- 🎨 **Clean interface**: Modern, user-friendly popup interface
- ⚡ **Real-time analysis**: Instant results with one click

## Example Output

```
h1 - 1
h2 - 5
div - 45
section - 2
p - 23
a - 18
img - 12
span - 34
```

## Installation

### Method 1: Load Unpacked Extension (Developer Mode)

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" by toggling the switch in the top right
3. Click "Load unpacked" button
4. Select the folder containing this extension
5. The extension should now appear in your extensions list

### Method 2: Chrome Web Store (Future)
This extension can be packaged and published to the Chrome Web Store.

## Usage

1. **Navigate to any webpage** you want to analyze
2. **Click the extension icon** in the Chrome toolbar (or pin it for easy access)
3. **Click "Analyze Page"** to count all HTML tags
4. **View the results** showing:
   - Total number of elements
   - Number of unique tag types
   - Detailed count for each tag type
5. **Click "Clear Results"** to reset the display

## Technical Details

### Files Structure
```
├── manifest.json       # Extension configuration
├── popup.html         # Extension popup interface
├── popup.js           # Popup functionality
├── content.js         # Content script for page analysis
├── icon.svg           # Extension icon
└── README.md          # This file
```

### Permissions
- `activeTab`: Access to the currently active tab for analysis
- `scripting`: Ability to inject scripts for tag counting

### Browser Compatibility
- Chrome (Manifest V3)
- Edge (Chromium-based)
- Other Chromium-based browsers

## Limitations

- Cannot analyze Chrome internal pages (`chrome://`)
- Cannot analyze extension pages (`chrome-extension://`)
- Requires page to be fully loaded for accurate results
- Some dynamically loaded content might not be counted if not present at analysis time

## Development

### Local Development
1. Make changes to the source files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Test your changes

### Building for Production
1. Remove any debug console logs
2. Test thoroughly on various websites
3. Package the extension folder into a .zip file
4. Submit to Chrome Web Store (if desired)

## Privacy

This extension:
- ✅ Only analyzes the current active tab when requested
- ✅ Does not collect or store any personal data
- ✅ Does not send data to external servers
- ✅ Only accesses page content when you click "Analyze Page"
- ✅ All processing happens locally in your browser

## Contributing

Feel free to contribute improvements:
1. Fork the project
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the MIT License.

## Troubleshooting

### Extension not working?
1. Make sure you're on a regular webpage (not chrome:// pages)
2. Refresh the extension in `chrome://extensions/`
3. Try reloading the webpage
4. Check the browser console for any errors

### No results showing?
1. Ensure the page has finished loading
2. Try clicking "Analyze Page" again
3. Check if the page has any HTML content

### Permission errors?
1. Make sure the extension has the necessary permissions
2. Try refreshing both the extension and the webpage