// Array to hold quotes with categories
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "In the middle of difficulty lies opportunity.", category: "Inspiration" },
  { text: "Success is not the key to happiness. Happiness is the key to success.", category: "Life" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" }
];

// DOM references
const quoteDisplay = document.getElementById("quoteDisplay");
const quoteText = quoteDisplay.querySelector(".quote-text");
const quoteCategory = quoteDisplay.querySelector(".quote-category");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");

// Function to show a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  quoteText.textContent = `"${randomQuote.text}"`;
  quoteCategory.textContent = `Category: ${randomQuote.category}`;
}

// Function to add a new quote dynamically
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value.trim();
  const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (!newQuoteText || !newQuoteCategory) {
    alert("Please enter both a quote and a category!");
    return;
  }

  // Add the new quote to the array
  quotes.push({
    text: newQuoteText,
    category: newQuoteCategory
  });

  // Clear input fields
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  // Give feedback and show the new quote immediately
  alert("New quote added successfully!");
  showRandomQuote();
}

// Event listeners
newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);

// Show one quote on load
showRandomQuote();
