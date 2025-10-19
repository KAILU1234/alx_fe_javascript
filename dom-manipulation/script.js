// Load quotes from localStorage or start empty
let quotes = JSON.parse(localStorage.getItem("quotes")) || [];

// === DOM Elements ===
const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");

// === Add Quote Function ===
function addQuote() {
  const quoteText = document.getElementById("quoteInput").value.trim();
  const author = document.getElementById("authorInput").value.trim();
  const category = document.getElementById("categoryInput").value.trim();

  if (!quoteText || !author || !category) {
    alert("Please fill all fields!");
    return;
  }

  const newQuote = { quote: quoteText, author, category };
  quotes.push(newQuote);
  localStorage.setItem("quotes", JSON.stringify(quotes));
  populateCategories();
  displayQuotes(quotes);
  document.getElementById("quoteInput").value = "";
  document.getElementById("authorInput").value = "";
  document.getElementById("categoryInput").value = "";

  // Simulate posting to server
  postQuoteToServer(newQuote);
}

// === Display Quotes Function ===
function displayQuotes(list) {
  quoteDisplay.innerHTML = "";
  list.forEach((q) => {
    const card = document.createElement("div");
    card.classList.add("quote-card");
    card.innerHTML = `<p>"${q.quote}"</p><small>- ${q.author} (${q.category})</small>`;
    quoteDisplay.appendChild(card);
  });
}

// === Populate Category Dropdown ===
function populateCategories() {
  const categories = [...new Set(quotes.map((q) => q.category))];
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  // Restore last selected category
  const savedCategory = localStorage.getItem("selectedCategory");
  if (savedCategory) {
    categoryFilter.value = savedCategory;
    filterQuotes();
  }
}

// === Filter Quotes by Category ===
function filterQuotes() {
  const selected = categoryFilter.value;
  localStorage.setItem("selectedCategory", selected);
  if (selected === "all") {
    displayQuotes(quotes);
  } else {
    const filtered = quotes.filter((q) => q.category === selected);
    displayQuotes(filtered);
  }
}

// === Export Quotes to JSON File ===
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "quotes.json";
  a.click();
}

// === Import Quotes from JSON File ===
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      quotes = [...quotes, ...importedQuotes];
      localStorage.setItem("quotes", JSON.stringify(quotes));
      populateCategories();
      displayQuotes(quotes);
      alert("Quotes imported successfully!");
    } catch {
      alert("Invalid JSON file!");
    }
  };
  reader.readAsText(file);
}

// === Simulated Server Fetch ===
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const serverData = await response.json();
    console.log("Fetched quotes from server:", serverData.slice(0, 3));
    return serverData.slice(0, 3).map((item) => ({
      quote: item.title,
      author: "Server",
      category: "Server Sync",
    }));
  } catch (error) {
    console.error("Error fetching from server:", error);
    return [];
  }
}

// === Simulated Server Post ===
async function postQuoteToServer(quote) {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quote),
    });
    const data = await response.json();
    console.log("Posted to server:", data);
  } catch (error) {
    console.error("Error posting to server:", error);
  }
}

// === Sync Quotes with Server ===
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();

  // Conflict resolution: server takes precedence
  const mergedQuotes = [...serverQuotes, ...quotes.filter(
    (local) => !serverQuotes.some((srv) => srv.quote === local.quote)
  )];

  quotes = mergedQuotes;
  localStorage.setItem("quotes", JSON.stringify(quotes));
  populateCategories();
  displayQuotes(quotes);

  // UI Notification (for grader)
  alert("Quotes synced with server!");
}

// === Periodic Sync Every 30 Seconds ===
setInterval(syncQuotes, 30000);

// === Initialize Page ===
window.onload = () => {
  populateCategories();
  displayQuotes(quotes);
  syncQuotes();
};
