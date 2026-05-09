
function getMaxAge(field) {
  return FIELD_RULES[field] || 10;
}

function evaluateCurrency(year, field, currentYear) {
  if (!year) return "CAUTION";

  const age = currentYear - year;
  const maxAge = getMaxAge(field);

  if (age <= maxAge) return "PASS";
  if (age <= maxAge * 1.5) return "CAUTION";
  return "FAIL";
}

function evaluateAuthority(author, publisher) {

  const credible = ["new york times","washington post","bbc","reuters","cnn","nature"];

  if (!author) return "FAIL";
  if (credible.some(c => publisher.includes(c))) return "PASS";

  return "CAUTION";
}

function evaluateRelevance(text, topic) {
  if (topic && text.includes(topic)) return "PASS";
  return "FAIL";
}

function evaluateAccuracy(text) {
  if (text.includes("study") || text.includes("data") || text.includes("research")) {
    return "PASS";
  }
  return "FAIL";
}

function evaluatePurpose(text) {
  if (text.includes("buy") || text.includes("sale")) return "FAIL";
  return "PASS";
}

window.CRAAP_ENGINE = {
  evaluateCurrency,
  evaluateAuthority,
  evaluateRelevance,
  evaluateAccuracy,
  evaluatePurpose
};
