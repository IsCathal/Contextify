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

// Function to categorize a sentence based on keywords
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
    const response = await generateExplanationWithPromptAPI(sentence, title, description);
    return response.explanation; // Adjust based on API response structure
  } catch (error) {
    console.error('Error fetching explanation:', error);
    return 'An error occurred while fetching the explanation.';
  }
}

// Function to generate an explanation using the Prompt API
async function generateExplanationWithPromptAPI(originalText, title, description) {
  console.log('Generating explanation using Prompt API...');

  if (typeof ai === 'undefined' || !ai.languageModel) {
    throw new Error('The AI Language Model API is not available.');
  }

  const { available } = await ai.languageModel.capabilities();

  if (available !== 'no') {
    const temperature = 1;
    const topK = 3;

    const systemPrompt = `
      You are an expert in the domain of "${title}". The category is described as: "${description}".
      Based on this context:
      - Explain why the following text belongs to the category "${title}".
      - Highlight specific elements in the text that align with the description of the category.
      - Provide a concise yet detailed explanation that makes the connection clear.
      - Return only the explanation.
    `;

    const session = await ai.languageModel.create({
      temperature: temperature,
      topK: topK,
      systemPrompt: systemPrompt,
    });

    try {
      const explanation = await session.prompt(originalText);
      session.destroy();
      return { explanation: explanation.trim() };
    } catch (error) {
      console.error('Error during prompting:', error);
      session.destroy();
      throw error;
    }
  } else {
    throw new Error('The AI Language Model API is not available.');
  }
}

// Function to create a floating helper widget
function createFloatingHelper() {
  const helper = document.createElement('div');
  helper.id = 'floating-helper';
  helper.style.position = 'absolute';
  helper.style.zIndex = '1000';
  helper.style.padding = '15px';
  helper.style.borderRadius = '8px';
  helper.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
  helper.style.backgroundColor = '#fff';
  helper.style.cursor = 'move';
  helper.style.display = 'none';

  const content = document.createElement('div');
  content.id = 'helper-content';
  content.textContent = 'Processing...';
  helper.appendChild(content);

  const closeButton = document.createElement('button');
  closeButton.textContent = 'Close';
  closeButton.style.marginTop = '10px';
  closeButton.style.padding = '10px 20px';
  closeButton.style.border = 'none';
  closeButton.style.borderRadius = '4px';
  closeButton.style.backgroundColor = '#007BFF';
  closeButton.style.color = '#fff';
  closeButton.style.cursor = 'pointer';
  closeButton.addEventListener('click', () => {
    helper.style.display = 'none';
  });

  helper.appendChild(closeButton);
  document.body.appendChild(helper);

  makeElementDraggable(helper);
}

// Function to make an element draggable
function makeElementDraggable(element) {
  let offsetX = 0;
  let offsetY = 0;
  let isDragging = false;

  element.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - element.offsetLeft;
    offsetY = e.clientY - element.offsetTop;
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      element.style.left = `${e.clientX - offsetX}px`;
      element.style.top = `${e.clientY - offsetY}px`;
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
}

// Function to show the floating helper
function showFloatingHelper(x, y, content = 'Processing...') {
  const helper = document.getElementById('floating-helper');
  const helperContent = document.getElementById('helper-content');
  helperContent.textContent = content;
  helper.style.left = `${x}px`;
  helper.style.top = `${y}px`;
  helper.style.display = 'block';
}

// Function to add click events to tooltips
function addClickEventToTooltips() {
  const tooltips = document.querySelectorAll('.tooltip');

  tooltips.forEach((tooltip) => {
    tooltip.addEventListener('click', async (event) => {
      const sentence = event.target.innerText;
      const title = event.target.getAttribute('data-category');
      const description = event.target.getAttribute('data-description');

      const rect = event.target.getBoundingClientRect();
      showFloatingHelper(rect.x + window.scrollX, rect.y + window.scrollY);

      const explanation = await fetchExplanationFromAPIWithContext(sentence, title, description);

      const helperContent = document.getElementById('helper-content');
      helperContent.textContent = explanation || 'Unable to fetch explanation.';
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

  updateParagraphs(paragraphUpdates);
  addClickEventToTooltips();
}

// Initialize
processParagraphsDebounced();
createFloatingHelper();

