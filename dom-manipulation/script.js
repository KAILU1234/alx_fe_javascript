let quotes = JSON.parse(localStorage.getItem("quotes")) || [];
let lastFilter = localStorage.getItem("lastFilter") || "all";

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Add a new quote
function addQuote() {
  const text = document.getElementById("quoteInput").value.trim();
  const author = document.getElementById("authorInput").value.trim();
  const category = document.getElementById("categoryInput").value.trim();

  if (!text || !author || !category) {
    alert("Please fill in all fields!");
    return;
  }

  quotes.push({ text, author, category });
  saveQuotes();
  populateCategories();
  displayQuotes();
  document.getElementById("quoteInput").value = "";
  document.getElementById("authorInput").value = "";
  document.getElementById("categoryInput").value = "";
  alert("Quote added successfully!");
}

// Display quotes (filtered or all)
function displayQuotes() {
  const container = document.getElementById("quoteDisplay");
  container.innerHTML = "";

  let filtered = quotes;
  if (lastFilter !== "all") {
    filtered = quotes.filter(q => q.category === lastFilter);
  }

  if (filtered.length === 0) {
    container.innerHTML = "<p>No quotes available.</p>";
    return;
  }

  filtered.forEach((q, index) => {
    const div = document.createElement("div");
    div.classList.add("quote-card");
    div.innerHTML = `
      <p>"${q.text}"</p>
      <p><em>- ${q.author}</em></p>
      <p><strong>Category:</strong> ${q.category}</p>
    `;
    container.appendChild(div);
  });
}

// Populate categories dynamically
function populateCategories() {
  const filter = document.getElementById("categoryFilter");
  const categories = [...new Set(quotes.map(q => q.category))];
  const selected = lastFilter;

  filter.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    if (cat === selected) option.selected = true;
    filter.appendChild(option);
  });
}

// Filter quotes when dropdown changes
function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  lastFilter = selected;
  localStorage.setItem("lastFilter", selected);
  displayQuotes();
}

// Export quotes as JSON
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

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    displayQuotes();
    alert("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}

// Initialize app
window.onload = function () {
  populateCategories();
  displayQuotes();
};
