// Category information containing colors, descriptions, and keywords
const categoryInfo = {
  'History & Society': {
    color: 'green',
    description:
      'Refers to topics like historical events, cultural practices, social structures, politics, geography, and local traditions.',
    keywords: ['history', 'society', 'politics', 'tradition', 'culture', 'social'],
  },
  'Literature & Art': {
    color: 'orange',
    description:
      'Points to references from literature, art, music, mythology, philosophical texts, religious scriptures, biographies, and other cultural works.',
    keywords: ['literature', 'art', 'music', 'mythology', 'philosophy', 'biography'],
  },
  'Places & Spaces': {
    color: 'brown',
    description:
      'Highlights geographical locations, architecture, infrastructure, landmarks, and public spaces, as well as their significance in the narrative.',
    keywords: ['place', 'space', 'architecture', 'landmark', 'geography', 'location'],
  },
  'Performance & Expression': {
    color: 'purple',
    description:
      'Indicates connections to performance arts like music, theater, dance, rituals, public speaking, rhetorical styles, and creative expression in daily life.',
    keywords: ['performance', 'expression', 'theater', 'dance', 'ritual', 'speech'],
  },
  'The Human Experience': {
    color: 'red',
    description:
      'Addresses themes related to the human body, emotions, relationships, food, health, memory, dreams, and mortality.',
    keywords: ['emotion', 'relationship', 'health', 'dream', 'memory', 'mortality', 'body'],
  },
  "The Creator's Lens": {
    color: 'blue',
    description:
      'Focuses on stylistic elements, narrative techniques, textual analysis, creative processes, and interpretive frameworks.',
    keywords: ['style', 'narrative', 'creative', 'interpret', 'technique', 'framework'],
  },
};

// Function to retrieve category information
function getCategoryInfo(category) {
  return categoryInfo[category] || null;
}

// Function to categorize a sentence based on keywords and Compromise.js analysis
function categorizeSentence(sentence) {
  const doc = nlp(sentence);
  const terms = doc.terms().out('array').map((word) => word.toLowerCase());

  for (const [category, data] of Object.entries(categoryInfo)) {
    const { keywords } = data;
    for (const keyword of keywords) {
      if (terms.includes(keyword)) {
        return category;
      }
    }
  }

  return null;
}

// Function to fetch explanation from the API
async function fetchExplanationFromAPI(sentence) {
  try {
    const response = await generateRewrittenTextWithPromptAPI(sentence);
    return response.rewrittenText; // Adjust based on API response structure
  } catch (error) {
    console.error('Error fetching explanation:', error);
    return 'An error occurred while fetching the explanation.';
  }
}

// Function to add click events to tooltips
function addClickEventToTooltips() {
  const tooltips = document.querySelectorAll('.tooltip');

  tooltips.forEach((tooltip) => {
    tooltip.addEventListener('click', async (event) => {
      const sentence = event.target.innerText;

      // Fetch explanation from API
      const explanation = await fetchExplanationFromAPI(sentence);

      // Display the explanation (update tooltip or show inline)
      tooltip.setAttribute('data-description', explanation);
      alert(`Explanation: ${explanation}`); // Replace with better UI if needed
    });
  });
}

// Function to update paragraphs with new HTML
function updateParagraphs(paragraphUpdates) {
  paragraphUpdates.forEach(({ para, newHTML }) => {
    para.innerHTML = newHTML;
  });
}

// Function to process paragraphs and add tooltips
function processParagraphsDebounced() {
  const paragraphs = document.querySelectorAll('p');
  const paragraphUpdates = [];

  for (let para of paragraphs) {
    const sentences = para.innerText.match(/[^.!?]+[.!?]+/g) || [para.innerText];
    let newHTML = '';

    for (let sentence of sentences) {
      const category = categorizeSentence(sentence);
      const categoryData = getCategoryInfo(category);

      if (categoryData) {
        newHTML += `<span class="tooltip ${categoryData.color}" data-description="${categoryData.description}">${sentence}</span>`;
      } else {
        newHTML += sentence;
      }
    }

    paragraphUpdates.push({ para, newHTML });
  }

  // Apply batched updates
  updateParagraphs(paragraphUpdates);

  // Add click event listeners to tooltips
  addClickEventToTooltips();
}

// Run the function
processParagraphsDebounced();



// Function to generate rewritten text using the Prompt API
async function generateRewrittenTextWithPromptAPI(originalText) {
  console.log('Generating rewritten text using Prompt API...');

  // Check if 'ai' and 'ai.languageModel' are available
  if (typeof ai === 'undefined' || !ai.languageModel) {
    throw new Error('The AI Language Model API is not available.');
  }

  // Check the capabilities of the language model
  const { available } = await ai.languageModel.capabilities();

  if (available !== 'no') {
    // Set temperature and topK
    const temperature = 1;
    const topK = 3;

    // Construct the system prompt
    const systemPrompt = `
      You are an English tutor specializing in literature. Rewrite the following text in modern English to make it accessible and engaging for contemporary students.
      - Simplify archaic language and clarify complex sentences where necessary.
      - Preserve the original meaning and literary elements.
      - Return only the text of the Rewrite
    `;

    // Create a language model session with specific parameters and system prompt
    const session = await ai.languageModel.create({
      temperature: temperature,
      topK: topK,
      systemPrompt: systemPrompt,
    });
    console.log(
      'Language model session created with temperature:',
      temperature,
      'and topK:',
      topK
    );

    try {
      // Prompt the model with the original text
      const rewrittenText = await session.prompt(originalText);
      console.log(
        'Rewritten text received from Prompt API:',
        rewrittenText.trim()
      );

      // Destroy the session
      session.destroy();

      // Return both original and rewritten text
      return {
        originalText: originalText,
        rewrittenText: rewrittenText.trim(),
      };
    } catch (error) {
      console.error('Error during prompting:', error);

      // Destroy the session in case of error
      session.destroy();
      throw error;
    }
  } else {
    throw new Error('The AI Language Model API is not available.');
  }
}
