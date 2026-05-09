const publisherMap = {
  science: ["Nature", "Science (AAAS)", "New England Journal of Medicine"],
  technology: ["Wired", "MIT Technology Review", "IEEE Spectrum"],
  social: ["Journal of Social Psychology"],
  humanities: ["Journal of Philosophy"],
  news: ["New York Times", "Washington Post", "BBC", "Reuters", "CNN"]
};

const FIELD_RULES = {
  technology: 5,
  science: 10,
  social: 15,
  humanities: 30,
  news: 3
};
