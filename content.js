// content.js

// Function to map categories to colors
function getColor(category) {
  switch (category) {
    case 'History & Society':
      return 'green';
    case 'Literature & Art':
      return 'orange';
    case 'Places & Spaces':
      return 'brown';
    case 'Performance & Expression':
      return 'purple';
    case 'The Human Experience':
      return 'red';
    case "The Creator's Lens":
      return 'blue';
    default:
      return null;
  }
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
      const colorClass = getColor(category);

      if (colorClass) {
        newHTML += `<span class="${colorClass}">${sentence}</span>`;
      } else {
        newHTML += sentence;
      }
    }

    para.innerHTML = newHTML;
  }
}

// Start processing
processParagraphs();
