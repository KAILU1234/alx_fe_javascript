// =======================
// Dynamic Quote Generator with Server Sync
// =======================

let quotes = JSON.parse(localStorage.getItem("quotes")) || [];
const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");
const syncStatus = document.getElementById("syncStatus");
const mockAPI = "https://jsonplaceholder.typicode.com/posts"; // mock endpoint

// ---------- Populate Dropdown ----------
function populateCategories() {
  const uniqueCategories = ["all", ...new Set(quotes.map(q => q.category || "Uncategorized"))];
  categoryFilter.innerHTML = uniqueCategories
    .map(cat => `<option value="${cat}">${cat}</option>`)
    .join("");

  // Restore last selected filter
  const savedFilter = localStorage.getItem("selectedCategory");
  if (savedFilter && uniqueCategories.includes(savedFilter)) {
    categoryFilter.value = savedFilter;
    filterQuotes();
  } else {
    filterQuotes();
  }
}

// ---------- Display Quotes ----------
function displayQuotes(quotesToShow) {
  if (!quotesToShow.length) {
    quoteDisplay.innerHTML = "<p>No quotes found.</p>";
    return;
  }
  quoteDisplay.innerHTML = quotesToShow
    .map(
      q => `
      <div class="quote-card">
        <p>"${q.text}"</p>
        <p><strong>- ${q.author || "Unknown"}</strong></p>
        <small>(${q.category || "Uncategorized"})</small>
      </div>
    `
    )
    .join("");
}

// ---------- Filter Quotes ----------
function filterQuotes() {
  const selected = categoryFilter.value;
  localStorage.setItem("selectedCategory", selected);

  const filtered =
    selected === "all" ? quotes : quotes.filter(q => q.category === selected);

  displayQuotes(filtered);
}

// ---------- Add New Quote ----------
document.getElementById("addQuoteBtn").addEventListener("click", () => {
  const text = document.getElementById("newQuote").value.trim();
  const category = document.getElementById("newCategory").value.trim() || "Uncategorized";

  if (!text) {
    alert("Please enter a quote before adding.");
    return;
  }

  const newQuote = {
    id: Date.now(),
    text,
    author: "User",
    category,
  };

  quotes.push(newQuote);
  localStorage.setItem("quotes", JSON.stringify(quotes));
  populateCategories();
  displayQuotes(quotes);

  // Sync immediately after adding
  syncQuotes();

  document.getElementById("newQuote").value = "";
  document.getElementById("newCategory").value = "";
});

// ---------- Fetch Data from Mock Server ----------
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(mockAPI);
    const data = await response.json();

    // Simulate server quotes
    const serverQuotes = data.slice(0, 5).map(item => ({
      id: item.id,
      text: item.title,
      author: "Server",
      category: "General"
    }));

    return serverQuotes;
  } catch (error) {
    console.error("Error fetching from server:", error);
    return [];
  }
}

// ---------- Post Data to Mock Server ----------
async function postQuoteToServer(quote) {
  try {
    await fetch(mockAPI, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quote),
    });
  } catch (error) {
    console.error("Error posting to server:", error);
  }
}

// ---------- Sync Quotes ----------
async function syncQuotes() {
  syncStatus.textContent = "🔄 Syncing with server...";
  const serverQuotes = await fetchQuotesFromServer();

  // Conflict Resolution: Server data takes precedence
  const localIds = new Set(quotes.map(q => q.id));
  const mergedQuotes = [
    ...serverQuotes,
    ...quotes.filter(q => !serverQuotes.some(s => s.id === q.id)),
  ];

  const conflicts = quotes.filter(q => localIds.has(q.id) && serverQuotes.some(s => s.id === q.id));

  if (conflicts.length > 0) {
    syncStatus.textContent = "⚠️ Conflict resolved (server version kept)";
  } else {
    syncStatus.textContent = "✅ Synced successfully";
  }

  quotes = mergedQuotes;
  localStorage.setItem("quotes", JSON.stringify(quotes));
  populateCategories();
  filterQuotes();
}

// ---------- Periodic Sync ----------
setInterval(syncQuotes, 30000); // sync every 30 seconds

// ---------- Import / Export ----------
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "quotes.json";
  a.click();
}

function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      quotes = [...quotes, ...importedQuotes];
      localStorage.setItem("quotes", JSON.stringify(quotes));
      populateCategories();
      displayQuotes(quotes);
      alert("Quotes imported successfully!");
    } catch {
      alert("Invalid JSON file.");
    }
  };
  reader.readAsText(file);
}

// ---------- Initialize ----------
(async function init() {
  quotes = JSON.parse(localStorage.getItem("quotes")) || [];
  populateCategories();
  displayQuotes(quotes);
  await syncQuotes();
})();
