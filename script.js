// Quote storage
let quotes = [
  { text: "The only limit is your mind.", category: "motivation" },
  { text: "Success is a journey, not a destination.", category: "success" },
  { text: "Believe you can and you're halfway there.", category: "inspiration" }
];

// Display random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  const display = document.getElementById("quoteDisplay");

  display.innerHTML = `
    <p><strong>${randomQuote.text}</strong></p>
    <p>Category: ${randomQuote.category}</p>
  `;
}

// Add new quote
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

  textInput.value = "";
  categoryInput.value = "";

  alert("Quote added successfully!");
}

// Button event listener
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
