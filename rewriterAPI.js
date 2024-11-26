// rewriterAPI.js

// Expose the function to the global scope
window.generateRewrittenTextWithRewriterAPI = async function(originalText) {
  console.log('Generating rewritten text using Rewriter API...');

  // Check if 'ai' and 'ai.rewriter' are available
  if (typeof ai === 'undefined' || !ai.rewriter) {
    throw new Error('The AI Rewriter API is not available.');
  }

  // Create the rewriter instance
  const rewriterInstance = await ai.rewriter.create();
  console.log('Rewriter instance created:', rewriterInstance);

  // Context to guide the rewriting process
  const context = `
    As an English tutor specializing in literature, rewrite the following text in modern English to make it accessible and engaging for contemporary students.
    - Simplify archaic language and clarify complex sentences where necessary.
    - Preserve the original meaning and literary elements.
  `;

  // Perform the rewrite
  const rewrittenText = await rewriterInstance.rewrite(originalText, { context });
  console.log('Rewritten text received from Rewriter API:', rewrittenText.trim());

  // Destroy the rewriter instance
  rewriterInstance.destroy();

  return rewrittenText.trim();
};
