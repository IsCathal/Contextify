// background.js

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'rewriteText',
    title: 'Rewrite in Modern Language',
    contexts: ['selection'],
  });
});

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

function rewriteTextInPageContext(selectedText) {
  (async () => {
    try {
      // Check if 'ai' and 'ai.rewriter' are available
      if (typeof ai === 'undefined' || !ai.rewriter) {
        alert('The Rewriter API is not available in this browser.');
        return;
      }

      const rewriter = await ai.rewriter.create();

      // Set the context for rewriting
      const context = 'Rewrite the text in modern English while preserving its original meaning.';

      // Use the rewriter to rewrite the selected text
      const rewrittenText = await rewriter.rewrite(selectedText, { context });
      rewriter.destroy();

      // Replace the selected text with the rewritten text
      replaceSelectedText(rewrittenText);
    } catch (error) {
      console.error('Error rewriting text:', error);
      alert('An error occurred while rewriting the text.');
    }
  })();

  // Function to replace the selected text on the page
  function replaceSelectedText(replacementText) {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    range.deleteContents();

    const textNode = document.createTextNode(replacementText);
    range.insertNode(textNode);

    // Optionally, re-apply the selection to the new text
    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.setStartBefore(textNode);
    newRange.setEndAfter(textNode);
    selection.addRange(newRange);
  }
}
