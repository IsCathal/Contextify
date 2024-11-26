
# Contextify Modern Language Rewriter and Thematic Highlighter

This Chrome extension enhances your reading experience on literature websites like Project Gutenberg by:

- **Rewriting Text in Modern Language**: Select any text, right-click, and choose "Rewrite in Modern Language" to get a modernized version of the selected text.
- **Interactive Popup**: Preview the rewritten text in a popup before accepting changes.
- **Retry and Accept Options**: If you're not satisfied with the rewrite, you can retry or accept the rewritten text.
- **Highlighted Rewritten Text**: Accepted rewrites are highlighted for easy identification.
- **Color-Coded Categorization**: The extension categorizes sentences into themes like History, Literature, Places, etc., with tooltips providing more information.

---

## Table of Contents

1. [Installation](#installation)
2. [Enabling Experimental Features](#enabling-experimental-features)
   - [Enable Gemini Nano](#enable-gemini-nano)
   - [Enable the Writer and Rewriter APIs](#enable-the-writer-and-rewriter-apis)
3. [Finalize the Setup](#finalize-the-setup)
4. [Usage](#usage)
5. [Files Overview](#files-overview)
6. [Troubleshooting](#troubleshooting)
7. [License](#license)

---

## Installation

### Clone or Download the Repository

```bash
git clone https://github.com//IsCathal/Contextify.git
```

### Open Chrome Extensions Page

1. Navigate to `chrome://extensions/` in your Chrome browser.
2. Enable **Developer mode** by toggling the switch in the top right corner.

### Load the Unpacked Extension

1. Click on **Load unpacked**.
2. Select the directory where you cloned or downloaded the extension files.

---

## Enabling Experimental Features

To use the AI Rewriter and AI Writer APIs, you need to enable experimental features and flags in Chrome.

---

### Enable Gemini Nano

📣 *Ignore this section if you have already set up the Prompt API!*

#### Open Chrome Flags

Open a new tab in Chrome and navigate to:

```bash
chrome://flags/#optimization-guide-on-device-model
```

#### Enable Bypass Performance Requirement

1. Find **"On Device Model Optimization Guide"**.
2. Set it to **Enabled BypassPerfRequirement**.
3. This bypasses performance checks that might prevent Gemini Nano from being downloaded to your device.

#### Relaunch Chrome

Click on the **"Relaunch"** button that appears after changing the flag.

#### Confirm Availability of Gemini Nano

1. Open Developer Tools (press `F12` or `Ctrl+Shift+I`).
2. Go to the **Console** tab.
3. Enter the following command:

```javascript
(await ai.assistant.capabilities()).available;
```

If this returns **"readily"**, then you are all set.

---

### Enable the Writer and Rewriter APIs

#### Enable Writer API

Open a new tab and navigate to:

```bash
chrome://flags/#writer-api-for-gemini-nano
```

Set it to **Enabled**.

#### Enable Rewriter API

Open a new tab and navigate to:

```bash
chrome://flags/#rewriter-api-for-gemini-nano
```

Set it to **Enabled**.

#### Relaunch Chrome

Click on the **"Relaunch"** button that appears after changing each flag.

---

## Finalize the Setup

### Trigger Model Download

1. Open Developer Tools and go to the **Console** tab.
2. Enter the following command:

```javascript
await ai.writer.create();
```

Don't worry if the call fails; this forces Chrome to schedule a model download.

---

### Check Availability

1. Enter the following command:

```javascript
(await ai.assistant.capabilities()).available;
```

Repeat this command until the response changes to **"readily"**.

This may take about 3 to 5 minutes depending on your network connection, so let your Chrome instance run for a while.

---

## Usage

### Rewriting Text in Modern Language

1. Navigate to a literature website (e.g., Project Gutenberg).
2. Select the text you wish to rewrite.
3. Right-click and choose **"Rewrite in Modern Language"** from the context menu.
4. A modal popup will appear with a loading icon.
5. Once the rewrite is complete, you'll see the rewritten text.
6. You can **Accept**, **Retry**, or **Cancel** the rewrite.
7. Accepted rewrites will replace the original text and be highlighted.

---

### Understanding Color-Coded Categories

The extension automatically processes paragraphs to highlight sentences based on themes:
- **History & Society**: Green
- **Literature & Art**: Orange
- **Places & Spaces**: Brown
- **Performance & Expression**: Purple
- **The Human Experience**: Red
- **The Creator's Lens**: Blue

Hover over the colored text to see tooltips with more information.

---

### Extension Features Popup

Click on the extension icon in the toolbar to view a summary of the extension's features.

---

## Files Overview

- **manifest.json**: Configuration file for the Chrome extension.
- **background.js**: Handles context menu interactions and rewriting functionality.
- **content.js**: Processes page content to highlight themed sentences.
- **popup.html**: Provides information about the extension when the toolbar icon is clicked.
- **styles.css**: Contains styles for modals, tooltips, and highlighted text.

---

## Troubleshooting

### Gemini Nano Not Available

1. Ensure you've followed all steps to enable the necessary Chrome flags.
2. Wait for at least 5 minutes after triggering the model download.
3. Keep Chrome running and avoid closing it during this time.
4. Check your internet connection, as the model download requires network access.

### AI APIs Not Available

1. Make sure you're using the latest version of Chrome Canary, as experimental features may not be available in stable releases.
2. Verify that Experimental Web Platform features are enabled:
    - Navigate to:

```vbnet
chrome://flags/#enable-experimental-web-platform-features
```

    - Set it to **Enabled**.
    - Relaunch Chrome.

### Extension Not Working as Expected

1. Reload the extension from the `chrome://extensions/` page.
2. Check the Console in Developer Tools for any error messages.
3. Ensure all required permissions are included in **manifest.json**:

```json
"permissions": [
  "contextMenus",
  "scripting",
  "activeTab",
  "experimental"
]
```

---

## License

This project is licensed under the MIT License.
