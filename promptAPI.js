// promptAPI.js

// Expose the function to the global scope
window.generateRewrittenTextWithPromptAPI = async function(originalText) {
  console.log('Generating rewritten text using Prompt API...');

  // Check if 'ai' and 'ai.languageModel' are available
  if (typeof ai === 'undefined' || !ai.languageModel) {
    throw new Error('The AI Language Model API is not available.');
  }

  // Create a language model session
  const session = await ai.languageModel.create();
  console.log('Language model session created:', session);

  // Construct the prompt
  const systemPrompt = `
    You are an English tutor specializing in literature. Rewrite the following text in modern English to make it accessible and engaging for contemporary students.
    - Simplify archaic language and clarify complex sentences where necessary.
    - Preserve the original meaning and literary elements.
  `;

  const userPrompt = originalText;

  // Create the initial prompts
  const initialPrompts = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];

  // Send the prompt to the language model
  const rewrittenText = await session.prompt(initialPrompts);
  console.log('Rewritten text received from Prompt API:', rewrittenText.trim());

  // Destroy the session
  session.destroy();

  return rewrittenText.trim();
};
