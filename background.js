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
  let modalOverlay = null;
  let modal = null;
  let rewrittenTextDiv = null;
  let loadingIcon = null;
  let errorMessageDiv = null;
  let retryButton = null;
  let cancelButton = null;

  // Function to generate rewritten text using non-streaming method
  async function generateRewrittenText() {
    console.log('Generating rewritten text...');
    const context = 'Rewrite the text in modern English while preserving its original meaning.';
    const rewrittenText = await rewriterInstance.rewrite(originalText, { context });
    console.log('Rewritten text received:', rewrittenText.trim());
    return rewrittenText.trim();
  }

  (async () => {
    try {
      console.log('Attempting to rewrite text:', originalText);

      // Show the modal with loading icon immediately
      showLoadingModal();

      // Check if 'ai' is available
      if (typeof ai === 'undefined') {
        alert('The AI APIs are not available in this browser.');
        console.log('ai is undefined');
        removeModal();
        return;
      }

      // Create the rewriter instance
      if (ai.rewriter) {
        rewriterInstance = await ai.rewriter.create();
        console.log('Rewriter instance created:', rewriterInstance);
      } else {
        alert('The Rewriter API is not available.');
        console.log('ai.rewriter is not available');
        removeModal();
        return;
      }

      // Initial generation of rewritten text
      let rewrittenText = await generateRewrittenText();

      // Update the modal with the rewritten text and options
      updateModalWithResult(rewrittenText);

    } catch (error) {
      console.error('Error rewriting text:', error);
      // Show error message and provide option to resend the request
      showErrorInModal('An error occurred while rewriting the text.');
    }
  })();

  // Function to show the modal with loading icon
  function showLoadingModal() {
    // Remove existing modal if any
    removeModal();

    // Create modal elements
    modalOverlay = document.createElement('div');
    modalOverlay.id = 'rewriteModalOverlay';

    modal = document.createElement('div');
    modal.id = 'rewriteModal';

    const title = document.createElement('h2');
    title.innerText = 'Processing...';

    loadingIcon = document.createElement('div');
    loadingIcon.id = 'loadingIcon';
    loadingIcon.innerHTML = '⏳'; // You can replace this with a loading spinner if desired

    modal.appendChild(title);
    modal.appendChild(loadingIcon);
    modalOverlay.appendChild(modal);
    document.body.appendChild(modalOverlay);

    // Styles are applied via CSS
  }

  // Function to update the modal with the rewritten text and options
  function updateModalWithResult(rewrittenText) {
    // Clear the modal content
    modal.innerHTML = '';

    const title = document.createElement('h2');
    title.innerText = 'Rewritten Text';

    rewrittenTextDiv = document.createElement('div');
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

    retryButton = document.createElement('button');
    retryButton.id = 'retryButton';
    retryButton.title = 'Retry';

    const retryIcon = document.createElement('span');
    retryIcon.innerHTML = '&#8635;'; // Unicode clockwise gapped circle arrow
    retryIcon.style.fontSize = '24px';

    retryButton.appendChild(retryIcon);

    cancelButton = document.createElement('button');
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

    // Event Listeners
    acceptButton.onclick = () => {
      replaceSelectedText(rewrittenText);
      removeModal();
      if (rewriterInstance) {
        rewriterInstance.destroy();
        console.log('Rewriter instance destroyed');
      }
    };

    retryButton.onclick = async () => {
      // Show loading icon
      showLoadingModal();
      try {
        let newRewrittenText = await generateRewrittenText();
        updateModalWithResult(newRewrittenText);
      } catch (error) {
        console.error('Error rewriting text:', error);
        showErrorInModal('An error occurred while rewriting the text.');
      }
    };

    cancelButton.onclick = () => {
      removeModal();
      if (rewriterInstance) {
        rewriterInstance.destroy();
        console.log('Rewriter instance destroyed');
      }
    };
  }

  // Function to show error message in modal
  function showErrorInModal(message) {
    // Clear the modal content
    modal.innerHTML = '';

    const title = document.createElement('h2');
    title.innerText = 'Error';

    errorMessageDiv = document.createElement('div');
    errorMessageDiv.id = 'errorMessage';
    errorMessageDiv.innerText = message;

    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'buttonContainer';

    retryButton = document.createElement('button');
    retryButton.id = 'retryButton';
    retryButton.title = 'Retry';

    const retryIcon = document.createElement('span');
    retryIcon.innerHTML = '&#8635;'; // Unicode clockwise gapped circle arrow
    retryIcon.style.fontSize = '24px';

    retryButton.appendChild(retryIcon);

    cancelButton = document.createElement('button');
    cancelButton.id = 'cancelButton';
    cancelButton.title = 'Cancel';

    const cancelIcon = document.createElement('span');
    cancelIcon.innerHTML = '&#10005;'; // Unicode multiplication sign
    cancelIcon.style.fontSize = '24px';
    cancelIcon.style.color = 'red';

    cancelButton.appendChild(cancelIcon);

    // Append elements
    buttonContainer.appendChild(retryButton);
    buttonContainer.appendChild(cancelButton);

    modal.appendChild(title);
    modal.appendChild(errorMessageDiv);
    modal.appendChild(buttonContainer);

    // Event Listeners
    retryButton.onclick = async () => {
      // Show loading icon
      showLoadingModal();
      try {
        let newRewrittenText = await generateRewrittenText();
        updateModalWithResult(newRewrittenText);
      } catch (error) {
        console.error('Error rewriting text:', error);
        showErrorInModal('An error occurred while rewriting the text.');
      }
    };

    cancelButton.onclick = () => {
      removeModal();
      if (rewriterInstance) {
        rewriterInstance.destroy();
        console.log('Rewriter instance destroyed');
      }
    };
  }

  // Function to remove the modal from the page
  function removeModal() {
    if (modalOverlay) {
      modalOverlay.remove();
      modalOverlay = null;
      modal = null;
    }
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
