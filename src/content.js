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

// Function to fetch explanation with context from the API
async function fetchExplanationFromAPIWithContext(sentence, title, description) {
  try {
    const response = await generateRewrittenTextWithPromptAPI(sentence, title, description);
    return response.rewrittenText; // Adjust based on API response structure
  } catch (error) {
    console.error('Error fetching explanation:', error);
    return 'An error occurred while fetching the explanation.';
  }
}

// Function to create a popup modal
function createPopupModal() {
  const modal = document.createElement('div');
  modal.id = 'popup-modal';
  modal.style.display = 'none';
  modal.style.position = 'fixed';
  modal.style.zIndex = '1000';
  modal.style.left = '50%';
  modal.style.top = '50%';
  modal.style.transform = 'translate(-50%, -50%)';
  modal.style.backgroundColor = '#fff';
  modal.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
  modal.style.padding = '20px';
  modal.style.borderRadius = '8px';
  modal.style.width = '80%';
  modal.style.maxWidth = '500px';

  const content = document.createElement('div');
  content.id = 'modal-content';
  content.style.marginBottom = '20px';
  modal.appendChild(content);

  const closeButton = document.createElement('button');
  closeButton.textContent = 'Close';
  closeButton.style.padding = '10px 20px';
  closeButton.style.border = 'none';
  closeButton.style.borderRadius = '4px';
  closeButton.style.backgroundColor = '#007BFF';
  closeButton.style.color = '#fff';
  closeButton.style.cursor = 'pointer';
  closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  modal.appendChild(closeButton);
  document.body.appendChild(modal);
}

// Function to show the popup modal with content
function showPopupModal(content) {
  const modal = document.getElementById('popup-modal');
  const modalContent = document.getElementById('modal-content');

  modalContent.textContent = content;
  modal.style.display = 'block';
}

// Initialize the popup modal
createPopupModal();

// Function to add click events to tooltips
function addClickEventToTooltips() {
  const tooltips = document.querySelectorAll('.tooltip');

  tooltips.forEach((tooltip) => {
    tooltip.addEventListener('click', async (event) => {
      const sentence = event.target.innerText;
      const title = event.target.getAttribute('data-category');
      const description = event.target.getAttribute('data-description');

      // Fetch explanation from API with dynamic title and description
      const explanation = await fetchExplanationFromAPIWithContext(sentence, title, description);

      // Display the explanation in the popup modal
      showPopupModal(explanation);
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
        newHTML += `<span class="tooltip ${categoryData.color}" data-category="${category}" data-description="${categoryData.description}">${sentence}</span>`;
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
async function generateRewrittenTextWithPromptAPI(originalText, title, description) {
  console.log('Generating rewritten text using Prompt API...');

  if (typeof ai === 'undefined' || !ai.languageModel) {
    throw new Error('The AI Language Model API is not available.');
  }

  const { available } = await ai.languageModel.capabilities();

  if (available !== 'no') {
    const temperature = 1;
    const topK = 3;

    // Dynamic system prompt based on the highlighted category
    const systemPrompt = `
      You are an expert in the domain of "${title}". The category is described as: "${description}".
      Based on this context:
      - Rewrite the following text in modern English to make it accessible and engaging for contemporary audiences.
      - Simplify complex language and clarify intricate sentences where necessary.
      - Ensure the rewritten text remains relevant to the topic "${title}" and retains the original meaning.
      - Return only the text of the rewrite.
    `;
    console.log(systemPrompt)
    const session = await ai.languageModel.create({
      temperature: temperature,
      topK: topK,
      systemPrompt: systemPrompt,
    });

    try {
      const rewrittenText = await session.prompt(originalText);
      session.destroy();
      return {
        originalText: originalText,
        rewrittenText: rewrittenText.trim(),
      };
    } catch (error) {
      console.error('Error during prompting:', error);
      session.destroy();
      throw error;
    }
  } else {
    throw new Error('The AI Language Model API is not available.');
  }
}
