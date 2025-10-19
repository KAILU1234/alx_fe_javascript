// ----------------------
// Quotes Array
// ----------------------
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to predict the future is to invent it.", author: "Alan Kay", category: "Motivation" },
  { text: "Life is what happens when you’re busy making other plans.", author: "John Lennon", category: "Life" },
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci", category: "Wisdom" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein", category: "Inspiration" }
];

// ----------------------
// DOM Elements
// ----------------------
const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");

// ----------------------
// populateCategories()
// ----------------------
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  // Restore the last selected category if available
  const savedCategory = localStorage.getItem("selectedCategory");
  if (savedCategory) {
    categoryFilter.value = savedCategory;
    filterQuote();
  } else {
    displayQuotes(quotes);
  }
}

// ----------------------
// filterQuote()
// ----------------------
function filterQuote() {
  const selected = categoryFilter.value;
  localStorage.setItem("selectedCategory", selected);

  let filtered = quotes;
  if (selected !== "all") {
    filtered = quotes.filter(q => q.category === selected);
  }

  displayQuotes(filtered);
}

// ----------------------
// Display Quotes
// ----------------------
function displayQuotes(list) {
  quoteDisplay.innerHTML = "";
  if (list.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes found for this category.</p>";
    return;
  }

  list.forEach(q => {
    const div = document.createElement("div");
    div.className = "quote-card";
    div.innerHTML = `<p>"${q.text}"</p><small>- ${q.author} (${q.category})</small>`;
    quoteDisplay.appendChild(div);
  });
}

// ----------------------
// Add New Quote
// ----------------------
function addQuote() {
  const quoteInput = document.getElementById("quoteInput");
  const authorInput = document.getElementById("authorInput");
  const categoryInput = document.getElementById("categoryInput");

  const text = quoteInput.value.trim();
  const author = authorInput.value.trim();
  const category = categoryInput.value.trim();

  if (!text || !author || !category) {
    alert("Please fill in all fields!");
    return;
  }

  quotes.push({ text, author, category });
  localStorage.setItem("quotes", JSON.stringify(quotes));

  quoteInput.value = "";
  authorInput.value = "";
  categoryInput.value = "";

  populateCategories();
  filterQuote();
}

// ----------------------
// Export Quotes
// ----------------------
function exportToJsonFile() {
  const data = JSON.stringify(quotes, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// ----------------------
// Import Quotes
// ----------------------
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes = importedQuotes;
        localStorage.setItem("quotes", JSON.stringify(quotes));
        populateCategories();
        filterQuote();
      } else {
        alert("Invalid file format.");
      }
    } catch {
      alert("Error reading file.");
    }
  };
  reader.readAsText(file);
}

// ----------------------
// Initialize on page load
// ----------------------
window.addEventListener("load", populateCategories);
