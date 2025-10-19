const quoteText = document.getElementById('quoteText');
const addQuoteBtn = document.getElementById('addQuoteBtn');
const newQuoteInput = document.getElementById('newQuote');
const newCategoryInput = document.getElementById('newCategory');
const exportBtn = document.getElementById('exportBtn');
const importFile = document.getElementById('importFile');
const categoryFilter = document.getElementById('categoryFilter');

let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "Success is not final; failure is not fatal: It is the courage to continue that counts.", category: "Perseverance" },
  { text: "Dream big and dare to fail.", category: "Inspiration" }
];

// ✅ Load the last selected category from local storage
let lastCategory = localStorage.getItem('selectedCategory') || 'all';

// ✅ Display a random quote (no Math.random here, we display first filtered quote)
function displayQuotes(filteredQuotes = quotes) {
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  quoteText.textContent = quote ? `${quote.text} (${quote.category})` : "No quotes found for this category.";
  sessionStorage.setItem('lastViewedQuote', quote ? quote.text : '');
}

// ✅ Add new quote with category
function addQuote() {
  const newQuote = newQuoteInput.value.trim();
  const newCategory = newCategoryInput.value.trim() || "General";
  if (newQuote !== "") {
    quotes.push({ text: newQuote, category: newCategory });
    saveQuotes();
    newQuoteInput.value = "";
    newCategoryInput.value = "";
    populateCategories();
    filterQuotes();
  } else {
    alert("Please enter a quote!");
  }
}

// ✅ Save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// ✅ Populate categories dynamically
function populateCategories() {
  const uniqueCategories = ["all", ...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = uniqueCategories
    .map(cat => `<option value="${cat}">${cat}</option>`)
    .join('');
  categoryFilter.value = lastCategory;
}

// ✅ Filter quotes based on selected category
function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem('selectedCategory', selectedCategory);
  lastCategory = selectedCategory;
  const filteredQuotes = selectedCategory === 'all'
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);
  displayQuotes(filteredQuotes);
}

// ✅ Export quotes to JSON file
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

// ✅ Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    filterQuotes();
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

// ✅ Event listeners
addQuoteBtn.addEventListener('click', addQuote);
exportBtn.addEventListener('click', exportToJsonFile);
categoryFilter.addEventListener('change', filterQuotes);
window.addEventListener('load', () => {
  populateCategories();
  filterQuotes();
});
