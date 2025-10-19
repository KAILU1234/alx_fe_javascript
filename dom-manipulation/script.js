const quoteDisplay = document.getElementById("quoteDisplay");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const newQuoteInput = document.getElementById("newQuote");
const newCategoryInput = document.getElementById("newCategory");
const exportBtn = document.getElementById("exportBtn");
const importFile = document.getElementById("importFile");
const categoryFilter = document.getElementById("categoryFilter");
const syncBtn = document.getElementById("syncBtn");
const syncStatus = document.getElementById("syncStatus");

let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "Success is not final; failure is not fatal: It is the courage to continue that counts.", category: "Success" },
  { text: "Dream big and dare to fail.", category: "Inspiration" }
];

// ---- SHOW RANDOM QUOTE ----
function displayRandomQuote() {
  const filtered = getFilteredQuotes();
  if (filtered.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes available for this category.</p>";
    return;
  }
  const randomIndex = Math.floor(Math.random() * filtered.length);
  const q = filtered[randomIndex];
  quoteDisplay.innerHTML = `<div id="quoteText" class="quote-card">${q.text} <br><em>(${q.category})</em></div>`;
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(q));
}

// ---- ADD QUOTE ----
function addQuote() {
  const newText = newQuoteInput.value.trim();
  const newCategory = newCategoryInput.value.trim() || "General";
  if (newText === "") return alert("Please enter a quote!");

  quotes.push({ text: newText, category: newCategory });
  saveQuotes();
  populateCategories();
  displayRandomQuote();
  newQuoteInput.value = "";
  newCategoryInput.value = "";
}

// ---- FILTERING ----
function getFilteredQuotes() {
  const selected = localStorage.getItem("selectedCategory") || "all";
  if (selected === "all") return quotes;
  return quotes.filter(q => q.category === selected);
}

function filterQuotes() {
  const selected = categoryFilter.value;
  localStorage.setItem("selectedCategory", selected);
  displayRandomQuote();
}

// ---- POPULATE CATEGORY DROPDOWN ----
function populateCategories() {
  const categories = ["all", ...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = categories
    .map(cat => `<option value="${cat}">${cat}</option>`)
    .join("");

  const last = localStorage.getItem("selectedCategory") || "all";
  categoryFilter.value = last;
}

// ---- STORAGE ----
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ---- EXPORT / IMPORT ----
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
  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    alert("Quotes imported successfully!");
    displayRandomQuote();
  };
  fileReader.readAsText(event.target.files[0]);
}

// ---- SERVER SYNC (SIMULATION) ----
async function syncWithServer() {
  syncStatus.textContent = "Syncing with server...";
  try {
    // Fetch mock quotes from placeholder API
    const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=3");
    const serverQuotes = await response.json();

    // Convert placeholder posts into quotes
    const fetchedQuotes = serverQuotes.map(p => ({
      text: p.title,
      category: "Server"
    }));

    // Conflict resolution: server data takes precedence
    quotes = [...quotes, ...fetchedQuotes];
    const unique = [];
    const seen = new Set();
    for (const q of quotes) {
      const key = q.text.toLowerCase();
      if (!seen.has(key)) {
        unique.push(q);
        seen.add(key);
      }
    }
    quotes = unique;

    saveQuotes();
    populateCategories();
    displayRandomQuote();
    syncStatus.textContent = "Sync complete! (Server data merged)";
  } catch (error) {
    syncStatus.textContent = "Sync failed: " + error.message;
  }
}

// ---- EVENT LISTENERS ----
addQuoteBtn.addEventListener("click", addQuote);
exportBtn.addEventListener("click", exportToJsonFile);
syncBtn.addEventListener("click", syncWithServer);
window.addEventListener("load", () => {
  populateCategories();
  displayRandomQuote();
});
