let getDictionary = function (lang) {
  // English dictionary: returns word for 1–3
  let englishDictionary = function (number) {
    switch (number) {
      case 1: return 'one';
      case 2: return 'two';
      case 3: return 'three';
      default: return 'unknown';
    }
  };

  // French dictionary: returns word for 1–3
  let frenchDictionary = function (number) {
    switch (number) {
      case 1: return 'un';
      case 2: return 'deux';
      case 3: return 'trois';
      default: return 'inconnu';
    }
  };

  // return the requested dictionary
  if (lang === 'E') return englishDictionary;
  if (lang === 'F') return frenchDictionary;
  return englishDictionary; // default
};

// Call getDictionary so these bindings are the functions
let english;
let french;
english = getDictionary('E');
french  = getDictionary('F');

// DO NOT change the lines below
console.log(english(1));
console.log(french(1));
console.log(english(2));
console.log(french(2));
console.log(english(3));
console.log(french(3));