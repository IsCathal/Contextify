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

// Function to process paragraphs and apply categorization
function processParagraphs() {
  const paragraphs = document.querySelectorAll('p');
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

    para.innerHTML = newHTML;
  }
}

// Start processing paragraphs when the content script runs
processParagraphs();