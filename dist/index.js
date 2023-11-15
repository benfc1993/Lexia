"use strict";
(() => {
  // dictionary/conjunctions.ts
  var conjunctions = [
    "and",
    "but",
    "or",
    "so",
    "yet",
    "nor",
    "for",
    "after",
    "although",
    "as",
    "because",
    "before",
    "if",
    "once",
    "since",
    "that",
    "though",
    "till",
    "unless",
    "while"
  ];

  // dictionary/prepositions.ts
  var prepositions = [
    "aboard",
    "about",
    "above",
    "across",
    "after",
    "against",
    "along",
    "amid",
    "among",
    "anti",
    "around",
    "as",
    "at",
    "before",
    "behind",
    "below",
    "beneath",
    "beside",
    "besides",
    "between",
    "beyond",
    "but",
    "by",
    "concerning",
    "considering",
    "despite",
    "down",
    "during",
    "except",
    "excepting",
    "excluding",
    "following",
    "for",
    "from",
    "in",
    "inside",
    "into",
    "like",
    "minus",
    "near",
    "of",
    "off",
    "on",
    "onto",
    "opposite",
    "outside",
    "over",
    "past",
    "per",
    "plus",
    "regarding",
    "round",
    "save",
    "since",
    "than",
    "through",
    "to",
    "toward",
    "towards",
    "under",
    "underneath",
    "unlike",
    "until",
    "up",
    "upon",
    "versus",
    "via",
    "with",
    "within",
    "without"
  ];

  // index.ts
  var main = () => {
    const div = document.getElementById("text");
    if (!div)
      return;
    const text = div.innerText;
    const parsed = parse(text);
    div.innerHTML = parsed;
  };
  var punctuation = [".", ","];
  function parse(str) {
    let startIndex = 0;
    let currentWord = "";
    let punctMark = "";
    let newScentence = true;
    let firstWord = true;
    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      const isPunctuation = punctuation.includes(char);
      if (char === " " || isPunctuation) {
        if (isPunctuation) {
          punctMark = char;
        }
        const wordClass = getWordClass(currentWord);
        if (wordClass) {
          const { string, insertLength } = highlightText(str, currentWord, startIndex, wordClass);
          str = string;
          i += insertLength - currentWord.length - 1;
        }
        startIndex = i;
        if (isPunctuation) {
          const { string, insertLength } = highlightText(str, punctMark, startIndex, "punctuation");
          str = string;
          i += insertLength - currentWord.length - 1;
          if (punctMark === ".")
            newScentence = true;
        }
        startIndex += 1;
        currentWord = "";
        firstWord = false;
        punctMark = "";
        continue;
      }
      currentWord += char;
    }
    return str;
  }
  function getWordClass(word) {
    if (conjunctions.includes(word))
      return "conjunction";
    if (prepositions.includes(word))
      return "preposition";
    return null;
  }
  function highlightText(str, word, startIndex, highlightClass) {
    const highlight = `<span class='hl-${highlightClass}'>${word}</span>`;
    return {
      string: str.slice(0, startIndex) + highlight + str.slice(startIndex + word.length),
      insertLength: highlight.length
    };
  }
  main();
})();
//# sourceMappingURL=index.js.map
