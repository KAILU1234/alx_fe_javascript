// Load existing quotes or default
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to predict the future is to invent it.", author: "Alan Kay", category: "Motivation" },
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci", category: "Wisdom" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein", category: "Inspiration" }
];

// DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");

// -----------------------------
// Display a random quote
// -----------------------------
function displayRandomQuote() {
  if (quotes.length === 0) return;
  const randomIndex = Math.floor(Math.random() * quotes.length); // Math.random required
  const randomQuote = quotes[randomIndex];
  quoteDisplay.innerHTML = `
    <div class="quote-card">
      <p>"${randomQuote.text}"</p>
      <small>- ${randomQuote.author} (${randomQuote.category})</small>
    </div>
  `;
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(randomQuote));
}

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

  // Restore saved category if exists
  const savedCategory = localStorage.getItem("selectedCategory");
  if (savedCategory) {
    categoryFilter.value = savedCategory;
    filterQuote();
  } else {
    displayRandomQuote();
  }
}

// -----------------------------
// filterQuote()
// -----------------------------
function filterQuote() {
  const selected = categoryFilter.value;
  localStorage.setItem("selectedCategory", selected);

  if (selected === "all") {
    displayRandomQuote();
    return;
  }

  const filteredQuotes = quotes.filter(q => q.category === selected);

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = `<p>No quotes found for ${selected}.</p>`;
    return;
  }

  // Show one random quote from filtered list
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];

  quoteDisplay.innerHTML = `
    <div class="quote-card">
      <p>"${randomQuote.text}"</p>
      <small>- ${randomQuote.author} (${randomQuote.category})</small>
    </div>
  `;
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(randomQuote));
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
window.addEventListener("load", () => {
  populateCategories();
  const lastViewed = sessionStorage.getItem("lastViewedQuote");
  if (lastViewed) {
    const q = JSON.parse(lastViewed);
    quoteDisplay.innerHTML = `
      <div class="quote-card">
        <p>"${q.text}"</p>
        <small>- ${q.author} (${q.category})</small>
      </div>
    `;
  } else {
    displayRandomQuote();
  }
});
