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
  var base = /* @__PURE__ */ new Map();
  var main = () => {
    const div = document.getElementById("text");
    if (!div)
      return;
    for (const child of div.children) {
      base.set(child, child.textContent ?? "");
    }
  };
  window.onload = function() {
    const div = document.getElementById("text");
    if (!div)
      return;
    for (const child of div.children)
      lexer(child, child.innerHTML.toString());
  };
  window.render = function() {
    const div = document.getElementById("text");
    if (!div)
      return;
    for (const child of div.children) {
      if (document.getElementById("show-highlights").checked) {
        const tokens = tokensMap.get(child);
        if (!tokens)
          continue;
        const parsed = parser(tokens);
        child.innerHTML = parsed;
      } else {
        child.innerHTML = base.get(child) ?? "";
      }
    }
  };
  var punctuation = [".", ","];
  var htmlRegex = /^<\/*[a-z]+(?![^>]*\/>)[^>]*>$/;
  var lineLength = 12;
  var tokensMap = /* @__PURE__ */ new Map();
  function lexer(element, str) {
    const words = str.trim().split(/<\/*[a-z]+(?![^>]*\/>)[^>]*>|\s/);
    const elementTokens = [];
    let idx = 0;
    for (const word of words) {
      if (word.length === 0)
        continue;
      const fullWord = word.replace(/[\.,\s\n]/g, "").replace(/\<.*\>/g, "").replace(/\<\/.*\>/g, "");
      let currentWord = fullWord;
      if (word.match(htmlRegex)) {
        elementTokens.push({
          type: "" /* None */,
          text: word,
          position: 0,
          hasChildren: () => false,
          scentanceStart: false
        });
        continue;
      }
      const wordToken = {
        type: getWordClass(fullWord),
        text: word,
        scentanceStart: false,
        position: 0,
        children: [],
        hasChildren() {
          return Object.hasOwn(this, "children");
        }
      };
      if (punctuation.includes(word.at(-1) ?? "")) {
        wordToken.children.push(createToken(
          "punctuation" /* Punctuation */,
          word.at(-1),
          word.length - 1,
          wordToken.scentanceStart
        ));
      }
      wordToken.children.push(createToken(
        "first" /* First */,
        currentWord.slice(0, 1),
        0,
        wordToken.scentanceStart
      ));
      if (fullWord.length > 8) {
        wordToken.children.push(createToken(
          "center" /* Center */,
          currentWord.slice(2, -2),
          2,
          wordToken.scentanceStart
        ));
      }
      elementTokens.push(wordToken);
      if (idx > 0 && idx % lineLength === 0)
        elementTokens.push(createToken("" /* None */, "</br>", 0, false));
      idx++;
    }
    tokensMap.set(element, elementTokens);
  }
  function createToken(type, text, position, scentanceStart) {
    return {
      type,
      text,
      position,
      scentanceStart,
      hasChildren() {
        return false;
      }
    };
  }
  function parser(tokens) {
    return tokens.map((token) => {
      const highlights = [];
      if (!token.hasChildren())
        return highlightWrap(token.text, token.type);
      const children = token.children.sort((a, b) => a.position - b.position);
      let remainder = token.text;
      for (const child of children) {
        if (child.type !== "" /* None */ && !document.getElementById("hl-" + child.type).checked) {
          continue;
        }
        const offsetChildPosition = child.position - (token.text.length - remainder.length);
        const before = remainder.slice(0, offsetChildPosition);
        const hl = highlightWrap(remainder.slice(offsetChildPosition, offsetChildPosition + child.text.length), child.type);
        remainder = remainder.slice(offsetChildPosition + child.text.length);
        if (before.length)
          highlights.push(before);
        highlights.push(hl);
      }
      if (remainder.length)
        highlights.push(remainder);
      const finalText = highlights.join("");
      return token.type === "" /* None */ || !document.getElementById("hl - " + token.type).checked ? finalText : highlightWrap(finalText, token.type);
    }).join(" ");
  }
  function highlightWrap(string, hlClass) {
    return `<span class='hl-${hlClass}'>${string}</span>`;
  }
  function getWordClass(word) {
    if (conjunctions.includes(word))
      return "conjunction" /* Conjunction */;
    if (prepositions.includes(word))
      return "preposition" /* Preposition */;
    return "" /* None */;
  }
  main();
})();
//# sourceMappingURL=index.js.map
