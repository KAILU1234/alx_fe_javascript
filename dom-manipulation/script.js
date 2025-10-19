// -----------------------------
// Load quotes from localStorage
// -----------------------------
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to predict the future is to invent it.", author: "Alan Kay", category: "Motivation" },
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci", category: "Wisdom" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein", category: "Inspiration" }
];

// -----------------------------
// Display quotes container
// -----------------------------
const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");

// -----------------------------
// populateCategories()
// -----------------------------
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  // Restore last selected category if saved
  const savedCategory = localStorage.getItem("selectedCategory");
  if (savedCategory) {
    categoryFilter.value = savedCategory;
    filterQuote();
  } else {
    displayQuotes(quotes);
  }
}

// -----------------------------
// filterQuote()
// -----------------------------
function filterQuote() {
  const selected = categoryFilter.value;
  localStorage.setItem("selectedCategory", selected);

  let filteredQuotes = quotes;
  if (selected !== "all") {
    filteredQuotes = quotes.filter(q => q.category === selected);
  }

  displayQuotes(filteredQuotes);
}

// -----------------------------
// displayQuotes()
// -----------------------------
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

// -----------------------------
// addQuote()
// -----------------------------
function addQuote() {
  const text = document.getElementById("quoteInput").value.trim();
  const author = document.getElementById("authorInput").value.trim();
  const category = document.getElementById("categoryInput").value.trim();

  if (!text || !author || !category) {
    alert("Please fill in all fields!");
    return;
  }

  quotes.push({ text, author, category });
  localStorage.setItem("quotes", JSON.stringify(quotes));

  populateCategories();
  filterQuote();

  document.getElementById("quoteInput").value = "";
  document.getElementById("authorInput").value = "";
  document.getElementById("categoryInput").value = "";
}

// -----------------------------
// Initialize when page loads
// -----------------------------
window.addEventListener("load", populateCategories);
