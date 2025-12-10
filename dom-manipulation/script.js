// === Quotes array (default) ===
let quotes = [
  { text: "The only limit is your mind.", category: "motivation" },
  { text: "Success is a journey, not a destination.", category: "success" },
  { text: "Believe you can and you're halfway there.", category: "inspiration" }
];

// === Storage keys ===
const LOCAL_STORAGE_KEY = "alx_quotes_v1";
const STORAGE_FILTER_KEY = "alx_quotes_filter";
const SESSION_LAST_QUOTE_KEY = "alx_last_viewed_quote_index";

// === Save quotes array to localStorage ===
function saveQuotes() {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(quotes));
}

// === Load quotes array from localStorage ===
function loadQuotes() {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (data) {
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) {
      quotes = parsed;
    }
  }
}

// === Populate categories into dropdown ===
function populateCategories() {
  const select = document.getElementById("categoryFilter");
  // remove all except first option
  select.innerHTML = '<option value="all">All Categories</option>';
  const categories = new Set();
  quotes.forEach(q => {
    categories.add(q.category);
  });
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);
  });
}

// === Filter and display quotes based on selected category ===
function filterQuotes() {
  const select = document.getElementById("categoryFilter");
  const chosen = select.value;
  localStorage.setItem(STORAGE_FILTER_KEY, chosen);

  const filtered = (chosen === "all")
    ? quotes
    : quotes.filter(q => q.category === chosen);

  displayQuotesList(filtered);
}

// === Display list of quotes (multiple) ===
function displayQuotesList(list) {
  const display = document.getElementById("quoteDisplay");
  if (!list || list.length === 0) {
    display.innerHTML = "<p>No quotes available.</p>";
    return;
  }
  display.innerHTML = "";
  list.forEach((q, idx) => {
    const p = document.createElement("p");
    p.innerHTML = `<strong>${escapeHtml(q.text)}</strong> — ${escapeHtml(q.category)}`;
    display.appendChild(p);
  });
}

// === Display quote by single index ===
function displayQuoteByIndex(index) {
  const display = document.getElementById("quoteDisplay");
  if (!quotes.length) {
    display.innerHTML = "<p>No quotes available.</p>";
    return;
  }
  const i = Math.max(0, Math.min(index, quotes.length - 1));
  const q = quotes[i];
  display.innerHTML = `
    <p><strong>${escapeHtml(q.text)}</strong></p>
    <p>Category: ${escapeHtml(q.category)}</p>
  `;
  sessionStorage.setItem(SESSION_LAST_QUOTE_KEY, String(i));
}

// === Show random quote ===
function showRandomQuote() {
  if (!quotes.length) {
    displayQuoteByIndex(0);
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  displayQuoteByIndex(randomIndex);
}

// === Add new quote ===
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (newText === "" || newCategory === "") {
    alert("Please fill all fields");
    return;
  }

  quotes.push({ text: newText, category: newCategory });
  saveQuotes();
  populateCategories();

  textInput.value = "";
  categoryInput.value = "";

  alert("Quote added successfully!");
}

// --- (existing createAddQuoteForm, export/import, escapeHtml) remain unchanged ---
// createAddQuoteForm defined as before
function createAddQuoteForm() {
  const existing = document.getElementById("dynamicAddForm");
  if (existing) return;
  const container = document.createElement("div");
  container.id = "dynamicAddForm";

  const textInput = document.createElement("input");
  textInput.id = "newQuoteText_dynamic";
  textInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory_dynamic";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.onclick = function () {
    const t = document.getElementById("newQuoteText_dynamic").value.trim();
    const c = document.getElementById("newQuoteCategory_dynamic").value.trim();
    if (!t || !c) {
      alert("Please fill all fields");
      return;
    }
    quotes.push({ text: t, category: c });
    saveQuotes();
    populateCategories();
    document.getElementById("newQuoteText_dynamic").value = "";
    document.getElementById("newQuoteCategory_dynamic").value = "";
    alert("Quote added successfully!");
  };

  container.appendChild(textInput);
  container.appendChild(categoryInput);
  container.appendChild(addButton);

  document.body.appendChild(container);
}

// Export / import / escapeHtml functions as before

function exportToJson() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importFromJsonFile(evt) {
  const files = evt.target.files;
  if (!files || !files[0]) return;
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    const imported = JSON.parse(event.target.result);
    if (!Array.isArray(imported)) {
      alert("Imported JSON must be an array of quote objects.");
      return;
    }
    const valid = imported.every(it => it && typeof it.text === "string" && typeof it.category === "string");
    if (!valid) {
      alert("JSON file format invalid. Each item must have 'text' and 'category'.");
      return;
    }
    quotes.push(...imported);
    saveQuotes();
    populateCategories();
    alert("Quotes imported successfully!");
  };
  fileReader.readAsText(files[0]);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Initialization
document.addEventListener("DOMContentLoaded", function () {
  loadQuotes();
  populateCategories();

  const lastFilter = localStorage.getItem(STORAGE_FILTER_KEY) || "all";
  const select = document.getElementById("categoryFilter");
  select.value = lastFilter;

  select.addEventListener("change", filterQuotes);

  const btnShow = document.getElementById("newQuote");
  if (btnShow) btnShow.addEventListener("click", showRandomQuote);

  const addBtnStatic = document.getElementById("addQuoteBtn");
  if (addBtnStatic) addBtnStatic.addEventListener("click", addQuote);

  const exportBtn = document.getElementById("exportJsonBtn");
  if (exportBtn) exportBtn.addEventListener("click", exportToJson);

  const importInput = document.getElementById("importFile");
  if (importInput) importInput.addEventListener("change", importFromJsonFile);

  createAddQuoteForm();

  // apply filter on load
  filterQuotes();
});
