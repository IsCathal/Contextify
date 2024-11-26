// categoryInfo object containing categories, colors, and descriptions
const categoryInfo = {
  'History & Society': {
    color: 'green',
    description: 'Refers to topics like historical events, cultural practices, social structures, politics, geography, and local traditions.'
  },
  'Literature & Art': {
    color: 'orange',
    description: 'Points to references from literature, art, music, mythology, philosophical texts, religious scriptures, biographies, and other cultural works.'
  },
  'Places & Spaces': {
    color: 'brown',
    description: 'Highlights geographical locations, architecture, infrastructure, landmarks, and public spaces, as well as their significance in the narrative.'
  },
  'Performance & Expression': {
    color: 'purple',
    description: 'Indicates connections to performance arts like music, theater, dance, rituals, public speaking, rhetorical styles, and creative expression in daily life.'
  },
  'The Human Experience': {
    color: 'red',
    description: 'Addresses themes related to the human body, emotions, relationships, food, health, memory, dreams, and mortality.'
  },
  "The Creator's Lens": {
    color: 'blue',
    description: 'Focuses on stylistic elements, narrative techniques, textual analysis, creative processes, and interpretive frameworks.'
  }
};

function getCategoryInfo(category) {
  return categoryInfo[category] || null;
}

// Function to categorize a sentence based on keywords
function categorizeSentence(sentence) {
  const lowerSentence = sentence.toLowerCase();

  if (lowerSentence.match(/\b(history|society|politics|tradition|culture|social)\b/)) {
    return 'History & Society';
  } else if (lowerSentence.match(/\b(literature|art|music|mythology|philosophy|biography)\b/)) {
    return 'Literature & Art';
  } else if (lowerSentence.match(/\b(place|space|architecture|landmark|geography|location)\b/)) {
    return 'Places & Spaces';
  } else if (lowerSentence.match(/\b(performance|expression|theater|dance|ritual|speech)\b/)) {
    return 'Performance & Expression';
  } else if (lowerSentence.match(/\b(emotion|relationship|health|dream|memory|mortality|body)\b/)) {
    return 'The Human Experience';
  } else if (lowerSentence.match(/\b(style|narrative|creative|interpret|technique|framework)\b/)) {
    return "The Creator's Lens";
  } else {
    return null;
  }
}

// Function to process paragraphs
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

// Start processing
processParagraphs();
