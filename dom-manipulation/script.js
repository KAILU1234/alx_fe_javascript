// Array to store quotes
let quotes = [
  { text: "The best way to predict the future is to invent it.", category: "Motivation" },
  { text: "Life is what happens when you’re busy making other plans.", category: "Life" },
  { text: "Simplicity is the ultimate sophistication.", category: "Wisdom" },
  { text: "In the middle of difficulty lies opportunity.", category: "Inspiration" }
];

// Get DOM elements
const quoteText = document.getElementById("quoteText");
const categoryFilter = document.getElementById("categoryFilter");
const newQuoteInput = document.getElementById("newQuote");
const newCategoryInput = document.getElementById("newCategory");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const exportBtn = document.getElementById("exportBtn");
const importFile = document.getElementById("importFile");

// ----------------------
// populateCategories()
// ----------------------
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))]; // extract unique categories

  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  // restore last selected category if available
  const lastCategory = localStorage.getItem("selectedCategory");
  if (lastCategory) {
    categoryFilter.value = lastCategory;
    filterQuote();
  } else {
    displayRandomQuote();
  }
}

// ----------------------
// filterQuote()
// ----------------------
function filterQuote() {
  const selected = categoryFilter.value;
  localStorage.setItem("selectedCategory", selected); // save selected category

  let filteredQuotes = quotes;
  if (selected !== "all") {
    filteredQuotes = quotes.filter(q => q.category === selected);
  }

  if (filteredQuotes.length > 0) {
    const random = Math.floor(Math.random() * filteredQuotes.length);
    quoteText.textContent = filteredQuotes[random].text;
  } else {
    quoteText.textContent = "No quotes found for this category.";
  }
}

// ----------------------
// displayRandomQuote()
// ----------------------
function displayRandomQuote() {
  const random = Math.floor(Math.random() * quotes.length);
  quoteText.textContent = quotes[random].text;
}

// ----------------------
// Add new quote
// ----------------------
addQuoteBtn.addEventListener("click", () => {
  const quote = newQuoteInput.value.trim();
  const category = newCategoryInput.value.trim();

  if (!quote || !category) return alert("Please fill both fields!");

  quotes.push({ text: quote, category });
  newQuoteInput.value = "";
  newCategoryInput.value =
