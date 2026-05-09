function getMaxAge(field) {
  return {
    technology: 5,
    science: 10,
    social: 15,
    humanities: 30,
    news: 3
  }[field];
}

function evaluateCurrency(year, field, currentYear) {
  if (!year) return "CAUTION";

  const age = currentYear - year;
  const maxAge = getMaxAge(field);

  if (age <= maxAge) return "PASS";
  if (age <= maxAge * 1.5) return "CAUTION";
  return "FAIL";
}

// export-style pattern (browser global)
window.CRAAP = {
  evaluateCurrency
};
