
Copy code
# Extension Name

## Description
This is a Chrome extension built using React, Parcel, and Babel. The extension provides [briefly describe the purpose and functionality of the extension].

## Installation

### Prerequisites
- You need to have [Node.js](https://nodejs.org/) installed on your machine.
- You also need npm (which comes with Node.js) to manage dependencies.

### Setup
1. Clone this repository or download the project files.
   
   ```bash
   git clone https://github.com/IsCathal/Contextify.git
   cd extension-name
Install the required dependencies by running:

bash
Copy code
npm install
Development
Build
To create a production build of your extension:

bash
Copy code
npm run build
The build files will be placed in the src/build/ folder.

Watch Mode
To run Parcel in watch mode (for automatic rebuilding when code changes):

bash
Copy code
npm run watch
This will automatically rebuild your code whenever changes are made, placing the output files in the src/build/ folder.

Testing the Extension
To test the Chrome extension locally, follow these steps:

Build your extension (if not already built) by running:

bash
Copy code
npm run build
Open Chrome and go to chrome://extensions/.

Enable Developer Mode by toggling the switch in the upper-right corner.

Click the Load Unpacked button.

Select your project folder where the manifest.json file is located. Chrome will load the extension, and you should now be able to test it.

Author
Cathal McCabe

