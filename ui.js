function runEvaluation() {

  const text = document.getElementById("source").value.toLowerCase();
  const field = document.getElementById("field").value;
  const date = document.getElementById("dateInput").value;

  const year = (date.match(/\b(19\d{2}|20\d{2})\b/) || [])[0];
  const currentYear = new Date().getFullYear();

  const currencyResult =
    CRAAP.evaluateCurrency(year, field, currentYear);

  document.getElementById("app").innerHTML = `
    <div>
      <h2>Currency: ${currencyResult}</h2>
    </div>
  `;
}
