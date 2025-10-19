const quoteText = document.getElementById('quoteText');
const addQuoteBtn = document.getElementById('addQuoteBtn');
const newQuoteInput = document.getElementById('newQuote');
const exportBtn = document.getElementById('exportBtn');
const importFile = document.getElementById('importFile');

let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  "The only way to do great work is to love what you do.",
  "Success is not final; failure is not fatal: It is the courage to continue that counts.",
  "Dream big and dare to fail."
];

function displayRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  quoteText.textContent = quotes[randomIndex];
  sessionStorage.setItem('lastViewedQuote', quotes[randomIndex]);
}

function addQuote() {
  const newQuote = newQuoteInput.value.trim();
  if (newQuote !== "") {
    quotes.push(newQuote);
    saveQuotes();
    newQuoteInput.value = "";
    displayRandomQuote();
  } else {
    alert("Please enter a quote!");
  }
}

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    alert('Quotes imported successfully!');
    displayRandomQuote();
  };
  fileReader.readAsText(event.target.files[0]);
}

addQuoteBtn.addEventListener('click', addQuote);
exportBtn.addEventListener('click', exportToJsonFile);
window.addEventListener('load', displayRandomQuote);
