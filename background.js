// background.js

// Listen for the extension being installed or updated
chrome.runtime.onInstalled.addListener(() => {
  // Create a context menu item when text is selected
  chrome.contextMenus.create({
    id: 'rewriteText',
    title: 'Rewrite in Modern Language',
    contexts: ['selection'],
  });
});

// Handle clicks on the context menu item
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'rewriteText') {
    const selectedText = info.selectionText;
    if (selectedText) {
      // Use chrome.scripting.executeScript to run code in the page context
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        args: [selectedText],
        func: rewriteTextInPageContext,
      });
    }
  }
});

// Function to be executed in the page context
function rewriteTextInPageContext(selectedText) {
  let originalText = selectedText;
  let rewriterInstance = null;

  (async () => {
    try {
      console.log('Attempting to rewrite text:', originalText);

      // Check if 'ai' is available
      if (typeof ai === 'undefined') {
        alert('The AI APIs are not available in this browser.');
        console.log('ai is undefined');
        return;
      }

      // Create the rewriter instance
      if (ai.rewriter) {
        rewriterInstance = await ai.rewriter.create();
        console.log('Rewriter instance created:', rewriterInstance);
      } else {
        alert('The Rewriter API is not available.');
        console.log('ai.rewriter is not available');
        return;
      }

      // Function to generate rewritten text using non-streaming method
      async function generateRewrittenText() {
        console.log('Generating rewritten text...');
        const context = 'As an English tutor specializing in literature, rewrite the text in modern English to make it accessible and engaging for contemporary readers, while faithfully preserving the original meaning and tone.';
        const rewrittenText = await rewriterInstance.rewrite(originalText, { context });
        console.log('Rewritten text received:', rewrittenText.trim());
        return rewrittenText.trim();
      }

      // Initial generation of rewritten text
      let rewrittenText = await generateRewrittenText();

      // Show modal with options to accept or retry
      showModal(originalText, rewrittenText);

    } catch (error) {
      console.error('Error rewriting text:', error);
      alert('An error occurred while rewriting the text.');
    }
  })();

  // Function to show the modal popup
  function showModal(originalText, rewrittenText) {
    // Remove existing modal if any
    const existingModal = document.getElementById('rewriteModalOverlay');
    if (existingModal) {
      existingModal.remove();
    }

    // Create modal elements
    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'rewriteModalOverlay';

    const modal = document.createElement('div');
    modal.id = 'rewriteModal';

    const title = document.createElement('h2');
    title.innerText = 'Rewritten Text';

    const rewrittenTextDiv = document.createElement('div');
    rewrittenTextDiv.id = 'rewrittenText';
    rewrittenTextDiv.innerText = rewrittenText;

    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'buttonContainer';

    const acceptButton = document.createElement('button');
    acceptButton.id = 'acceptButton';
    acceptButton.title = 'Accept';

    const acceptIcon = document.createElement('span');
    acceptIcon.innerHTML = '&#10003;'; // Unicode check mark
    acceptIcon.style.fontSize = '24px';
    acceptIcon.style.color = 'green';

    acceptButton.appendChild(acceptIcon);

    const retryButton = document.createElement('button');
    retryButton.id = 'retryButton';
    retryButton.title = 'Retry';

    const retryIcon = document.createElement('span');
    retryIcon.innerHTML = '&#8635;'; // Unicode clockwise gapped circle arrow
    retryIcon.style.fontSize = '24px';

    retryButton.appendChild(retryIcon);

    const cancelButton = document.createElement('button');
    cancelButton.id = 'cancelButton';
    cancelButton.title = 'Cancel';

    const cancelIcon = document.createElement('span');
    cancelIcon.innerHTML = '&#10005;'; // Unicode multiplication sign
    cancelIcon.style.fontSize = '24px';
    cancelIcon.style.color = 'red';

    cancelButton.appendChild(cancelIcon);

    // Append elements
    buttonContainer.appendChild(acceptButton);
    buttonContainer.appendChild(retryButton);
    buttonContainer.appendChild(cancelButton);

    modal.appendChild(title);
    modal.appendChild(rewrittenTextDiv);
    modal.appendChild(buttonContainer);
    modalOverlay.appendChild(modal);
    document.body.appendChild(modalOverlay);

    // Event Listeners
    acceptButton.onclick = () => {
      replaceSelectedText(rewrittenText);
      document.body.removeChild(modalOverlay);
      if (rewriterInstance) {
        rewriterInstance.destroy();
        console.log('Rewriter instance destroyed');
      }
    };

    retryButton.onclick = async () => {
      rewrittenTextDiv.innerText = 'Generating...';
      try {
        let newRewrittenText = await generateRewrittenText();
        rewrittenText = newRewrittenText;
        rewrittenTextDiv.innerText = newRewrittenText;
      } catch (error) {
        console.error('Error rewriting text:', error);
        rewrittenTextDiv.innerText = 'An error occurred while rewriting the text.';
      }
    };

    cancelButton.onclick = () => {
      document.body.removeChild(modalOverlay);
      if (rewriterInstance) {
        rewriterInstance.destroy();
        console.log('Rewriter instance destroyed');
      }
    };
  }

  // Function to replace the selected text on the page
  function replaceSelectedText(replacementText) {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    range.deleteContents();

    const span = document.createElement('span');
    span.innerText = replacementText;
    span.classList.add('highlighted-text');

    range.insertNode(span);

    // Optionally, re-apply the selection to the new text
    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.selectNodeContents(span);
    selection.addRange(newRange);
  }
}
