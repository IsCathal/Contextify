
# Contexify

Contexify is a Chrome extension designed to enhance your reading experience on Project Gutenberg and other supported websites. It categorizes sentences into thematic groups, highlights them with color-coded backgrounds, and provides tooltips with detailed descriptions. Additionally, it offers a context menu feature that allows you to rephrase selected text into modern English using an AI language model.

## Table of Contents
- Features
- Installation
- Usage
  - Sentence Categorization and Highlighting
  - Rephrase for Today
- Development
  - Project Structure
  - Scripts
  - Dependencies
- Customization
- Troubleshooting
- License
- Acknowledgments

## Features

### Sentence Categorization and Highlighting:
- Automatically processes web pages and highlights sentences based on predefined thematic categories.
- Categories include:
  - History & Society
  - Literature & Art
  - Places & Spaces
  - Performance & Expression
  - The Human Experience
  - The Creator's Lens
- Hover over highlighted sentences to view detailed descriptions in tooltips.

### Rephrase for Today:
- Adds a context menu item when text is selected.
- Rewrites selected text into modern English using an AI language model.
- Displays original and rewritten text in a modal window.
- Options to insert the rewritten text, retry, or cancel.

## Installation

### Prerequisites
- Google Chrome browser.
- Node.js and npm installed on your system.

### Steps

#### Clone or Download the Repository:
```bash
git clone https://github.com/IsCathal/Contextify.git
```

#### Navigate to the Extension Directory:
```bash
cd contexify
```

#### Install Dependencies:
```bash
npm install
```

#### Build the Extension:
```bash
npm run build
```
This will generate the necessary files in the `dist/` directory.

#### Load the Extension into Chrome:
1. Open Chrome and go to `chrome://extensions/`.
2. Enable Developer mode by toggling the switch in the upper right corner.
3. Click **Load unpacked** and select the `contexify` directory.

## Usage

### Sentence Categorization and Highlighting
#### Navigate to a Supported Website:
Visit Project Gutenberg or any website included in the extension's `host_permissions`.

#### Observe the Highlights:
The extension automatically processes paragraphs and highlights sentences based on their categories.

#### View Tooltips:
Hover over a highlighted sentence to see a tooltip with the category description.

### Rephrase for Today
#### Select Text:
Highlight any text on the webpage.

#### Use the Context Menu:
Right-click on the selected text.  
Choose **Rephrase for Today** from the context menu.

#### Interact with the Modal:
A modal window will appear showing the original and rewritten text.  
Options:
- **Insert**: Inserts the rewritten text below the original selection.
- **Retry**: Attempts to generate a new rephrased version.
- **Cancel**: Closes the modal without making changes.

## Development

### Project Structure
```css
contexify/
├── dist/
│   ├── background.bundle.js
│   └── content.bundle.js
├── src/
│   ├── background.js
│   ├── content.js
│   ├── styles.css
│   ├── popup.html
│   └── icons/
│       ├── icon48.png
│       └── icon128.png
├── manifest.json
├── package.json
├── package-lock.json
├── webpack.config.js
└── .babelrc
```

### Scripts

#### Build the Extension:
```bash
npm run build
```

#### Watch for Changes:
```bash
npm run watch
```

### Dependencies
- **Compromise.js**: Used for natural language processing to categorize sentences.

### Configuration Files
- `manifest.json`: Defines the extension's permissions, scripts, and other metadata.
- `webpack.config.js`: Configuration for bundling scripts using Webpack.
- `.babelrc`: Babel configuration for transpiling JavaScript.

## Customization

### Adding or Modifying Categories
Edit `src/content.js`:
- Modify the `categoryInfo` object to add new categories or update existing ones.
- Each category includes:
  - `color`: Background color for highlighting.
  - `description`: Tooltip text.
  - `keywords`: Array of keywords to identify the category.

### Adjusting Styles
Edit `src/styles.css`:
- Customize the appearance of highlighted text, tooltips, and modal windows.

### Updating Host Permissions
Edit `manifest.json`:
- Modify the `host_permissions` field to include additional websites.

#### Example:
```json
"host_permissions": [
  "https://www.gutenberg.org/*",
  "https://example.com/*"
]
```

## Troubleshooting

### Extension Fails to Load:
- Ensure all required fields are present in `manifest.json`.
- Verify file paths and names are correct.

### Build Errors:
- Make sure all dependencies are installed (`npm install`).
- Check for compatibility issues with Node.js and npm versions.

### Features Not Working:
- Confirm that the extension has the necessary permissions.
- Check the browser console for error messages.

## License
This project is licensed under the MIT License.

## Acknowledgments
- **Compromise.js**: For providing a lightweight NLP library.
- **Project Gutenberg**: For offering a vast collection of public domain texts.

Feel free to contribute to this project by submitting issues or pull requests. Your feedback and enhancements are welcome!
