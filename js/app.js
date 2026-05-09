
function render() {
  document.getElementById("app").innerHTML = `

  <div class="card input-panel">

    <div class="topic-card">

      <h2 class="section-title">Your Research Topic</h2>

      <div class="form-row">
        <label>Topic</label>
        <input id="topic" placeholder="e.g., climate change, AI" />
      </div>

    </div>

    <div class="divider"></div>

    <div class="article-card">

      <h2 class="section-title">Article Information</h2>

      <div class="form-row">
        <label>Author</label>
        <input id="authorInput" />
      </div>

      <div class="form-row">
        <label>Date</label>
        <input id="dateInput" />
      </div>

      <div class="form-row">
        <label>Field</label>
        <select id="field"></select>
      </div>

      <div class="form-row">
        <label>Publisher</label>
        <div>
          <select id="publisherSelect"></select>
          <input id="publisherInput" style="margin-top:10px;">
        </div>
      </div>

      <div class="form-row">
        <label>Article Text</label>
        <textarea id="source"></textarea>
      </div>

    </div>

    <button onclick="evaluateCRAAP()">Evaluate</button>

    <div id="output"></div>

  </div>
  `;

  setupFields();
}

function setupFields() {
  const fieldSelect = document.getElementById("field");

  Object.keys(FIELD_RULES).forEach(f => {
    const opt = document.createElement("option");
    opt.value = f;
    opt.textContent = f;
    fieldSelect.appendChild(opt);
  });
}

function evaluateCRAAP() {

  const text = document.getElementById("source").value.toLowerCase();
  const field = document.getElementById("field").value;

  const author = document.getElementById("authorInput").value;
  const date = document.getElementById("dateInput").value;
  const publisher = document.getElementById("publisherInput").value.toLowerCase();
  const topic = document.getElementById("topic").value.toLowerCase();

  const year = (date.match(/\b(19\d{2}|20\d{2})\b/) || [])[0];
  const currentYear = new Date().getFullYear();

  const results = {
    Currency: CRAAP_ENGINE.evaluateCurrency(year, field, currentYear),
    Authority: CRAAP_ENGINE.evaluateAuthority(author, publisher),
    Relevance: CRAAP_ENGINE.evaluateRelevance(text, topic),
    Accuracy: CRAAP_ENGINE.evaluateAccuracy(text),
    Purpose: CRAAP_ENGINE.evaluatePurpose(text)
  };

  let html = "";

  for (let [k,v] of Object.entries(results)) {
    html += `<p><b>${k}:</b> ${v}</p>`;
  }

  document.getElementById("output").innerHTML = html;
}

window.onload = render;
