function render() {
  const output = document.getElementById("app");

  output.innerHTML = `
    <div>
      <label>Field</label>
      <select id="field"></select>

      <label>Author</label>
      <input id="author">

      <label>Publisher</label>
      <input id="publisher">

      <label>Date</label>
      <input id="date">

      <label>Topic</label>
      <input id="topic">

      <label>Article</label>
      <textarea id="text"></textarea>

      <button onclick="run()">Evaluate</button>

      <div id="results"></div>
    </div>
  `;

  // populate fields
  const fieldSelect = document.getElementById("field");
  Object.keys(FIELD_RULES).forEach(f => {
    const opt = document.createElement("option");
    opt.value = f;
    opt.textContent = f;
    fieldSelect.appendChild(opt);
  });
}

function run() {

  const text = document.getElementById("text").value.toLowerCase();
  const field = document.getElementById("field").value;
  const author = document.getElementById("author").value;
  const publisher = document.getElementById("publisher").value.toLowerCase();
  const topic = document.getElementById("topic").value.toLowerCase();
  const date = document.getElementById("date").value;

  const year = (date.match(/\b(19\d{2}|20\d{2})\b/) || [])[0];
  const currentYear = new Date().getFullYear();

  const results = {
    Currency: CRAAP_ENGINE.evaluateCurrency(year, field, currentYear),
    Authority: CRAAP_ENGINE.evaluateAuthority(author, publisher),
    Relevance: CRAAP_ENGINE.evaluateRelevance(text, topic),
    Accuracy: CRAAP_ENGINE.evaluateAccuracy(text),
    Purpose: CRAAP_ENGINE.evaluatePurpose(text)
  };

  document.getElementById("results").innerHTML =
    Object.entries(results)
      .map(([k,v]) => `<p><b>${k}:</b> ${v}</p>`)
      .join("");
}

window.onload = render;
