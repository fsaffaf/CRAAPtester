import express from "express";
import fetch from "node-fetch";
import * as cheerio from "cheerio";
import path from "path";

const app = express();
app.use(express.json());
app.use(express.static("public"));

/* ---------------------------
   FETCH + EXTRACT ARTICLE
---------------------------- */

async function extractArticle(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0"
    }
  });

  const html = await res.text();
  const $ = cheerio.load(html);

  // --- TITLE ---
  const title =
    $("meta[property='og:title']").attr("content") ||
    $("title").text() ||
    null;

  // --- DATE ---
  const date =
    $("meta[property='article:published_time']").attr("content") ||
    $("meta[name='pubdate']").attr("content") ||
    $("time[datetime]").attr("datetime") ||
    null;

  // --- AUTHOR ---
  const author =
    $("meta[name='author']").attr("content") ||
    $("meta[property='article:author']").attr("content") ||
    $('[rel="author"]').text() ||
    null;

  // --- PUBLISHER ---
  const publisher =
    $("meta[property='og:site_name']").attr("content") ||
    new URL(url).hostname;

  return {
    url,
    title,
    date,
    author,
    publisher
  };
}

/* ---------------------------
   CRAAP EVALUATION ENGINE
---------------------------- */

function evaluateCRAAP(data) {
  const year = data.date ? parseInt(data.date.substring(0, 4)) : null;
  const currentYear = new Date().getFullYear();

  // --- CURRENCY ---
  let currency;
  let currencyExplanation;

  if (!year) {
    currency = "CAUTION";
    currencyExplanation =
      "No publication date was detected in the webpage metadata, so currency cannot be verified.";
  } else if (year >= currentYear - 3) {
    currency = "PASS";
    currencyExplanation =
      `This was published in ${year}, which is recent and appropriate for most academic research.`;
  } else if (year >= currentYear - 10) {
    currency = "CAUTION";
    currencyExplanation =
      `This was published in ${year}, which may still be usable but could be outdated depending on the topic.`;
  } else {
    currency = "FAIL";
    currencyExplanation =
      `This was published in ${year}, which is too old for most modern academic fields such as science and technology.`;
  }

  // --- AUTHORITY ---
  let authority;
  let authorityExplanation;

  if (data.author && data.publisher.includes("edu")) {
    authority = "PASS";
    authorityExplanation =
      `The source is associated with an academic institution (${data.publisher}) and has a named author (${data.author}).`;
  } else if (data.author) {
    authority = "CAUTION";
    authorityExplanation =
      `The author (${data.author}) is identified, but the publisher (${data.publisher}) may not be an academic or peer-reviewed source.`;
  } else {
    authority = "FAIL";
    authorityExplanation =
      `No identifiable author was found, which reduces the credibility of the source.`;
  }

  // --- RELEVANCE ---
  let relevance = "CAUTION";
  let relevanceExplanation =
    "Relevance must be determined based on the student's research topic and cannot be fully inferred from metadata alone.";

  // --- ACCURACY ---
  let accuracy = data.title ? "CAUTION" : "FAIL";
  let accuracyExplanation = data.title
    ? "The source contains structured metadata, but full verification of accuracy requires cross-referencing with other sources."
    : "No structured content was detected to assess accuracy.";

  // --- PURPOSE ---
  let purpose = "CAUTION";
  let purposeExplanation =
    "Purpose requires contextual reading of the full article content, which is beyond metadata extraction alone.";

  return {
    Currency: {
      status: currency,
      explanation: currencyExplanation
    },
    Authority: {
      status: authority,
      explanation: authorityExplanation
    },
    Relevance: {
      status: relevance,
      explanation: relevanceExplanation
    },
    Accuracy: {
      status: accuracy,
      explanation: accuracyExplanation
    },
    Purpose: {
      status: purpose,
      explanation: purposeExplanation
    },
    meta: data
  };
}

/* ---------------------------
   API ROUTE
---------------------------- */

app.post("/analyze", async (req, res) => {
  try {
    const url = req.body.url;

    const articleData = await extractArticle(url);
    const result = evaluateCRAAP(articleData);

    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: "Failed to analyze URL",
      details: err.message
    });
  }
});

/* ---------------------------
   START SERVER
---------------------------- */

app.listen(3000, () => {
  console.log("CRAAP server running on http://localhost:3000");
});
