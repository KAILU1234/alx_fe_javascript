/* Global element refs */
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const newQuoteText = document.getElementById('newQuoteText');
const newQuoteCategory = document.getElementById('newQuoteCategory');
const importFile = document.getElementById('importFile');
const exportBtn = document.getElementById('exportBtn');

/* Data key and initial seed */
const STORAGE_KEY = 'quotes';
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "Success is not final; failure is not fatal: It is the courage to continue that counts.", category: "Success" },
  { text: "Dream big and dare to fail.", category: "Inspiration" }
];

/* Load from localStorage if present */
function loadQuotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // normalize: array of strings -> array of objects
      if (typeof parsed[0] === 'string') {
        quotes = parsed.map(s => ({ text: s, category: 'uncategorized' }));
      } else {
        quotes = parsed;
      }
    }
  } catch (err) {
    console.warn('Could not load quotes:', err);
  }
}

/* Save to localStorage */
function saveQuotes() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
  } catch (err) {
    console.warn('Could not save quotes:', err);
  }
}

/* Show a random quote */
function displayRandomQuote() {
  if (!quotes || quotes.length === 0) {
    quoteDisplay.textContent = 'No quotes available.';
    return;
  }
  const idx = Math.floor(Math.random() * quotes.length);
  const q = quotes[idx];
  const text = q && q.text ? q.text : String(q);
  const cat = q && q.category ? q.category : 'uncategorized';
  quoteDisplay.textContent = `"${text}" — (${cat})`;

  // Save last viewed quote to sessionStorage
  try {
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(q));
  } catch (e) { /* ignore */ }
}

/* Add a new quote (called by button onclick) */
function addQuote() {
  const text = (newQuoteText && newQuoteText.value || '').trim();
  const category = (newQuoteCategory && newQuoteCategory.value || '').trim();
  if (!text || !category) {
    alert('Please enter both a quote and category!');
    return;
  }
  quotes.push({ text, category });
  saveQuotes();
  newQuoteText.value = '';
  newQuoteCategory.value = '';
  alert('Quote added successfully!');
  displayRandomQuote();
}

/* Export quotes to JSON file (required function) */
function exportToJsonFile() {
  try {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  } catch (err) {
    alert('Export failed.');
  }
}

/* Import quotes from uploaded JSON file (required function) */
function importFromJsonFile(event) {
  const file = event && event.target && event.target.files && event.target.files[0];
  if (!file) {
    alert('No file selected.');
    return;
  }
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const parsed = JSON.parse(e.target.result);
      if (!Array.isArray(parsed)) {
        alert('Invalid JSON format: expected an array.');
        return;
      }
      // normalize imported entries then push
      const normalized = parsed.map(item => {
        if (typeof item === 'string') return { text: item, category: 'uncategorized' };
        if (typeof item === 'object' && item !== null && 'text' in item) return { text: String(item.text), category: item.category || 'uncategorized' };
        // fallback
        return { text: String(item), category: 'uncategorized' };
      });
      quotes.push(...normalized);
      saveQuotes();
      alert('Quotes imported successfully!');
      displayRandomQuote();
      // clear file input value so same file can be re-imported if needed
      importFile.value = '';
    } catch (err) {
      alert('Error reading JSON file.');
    }
  };
  reader.readAsText(file);
}

/* Initialize on load */
window.addEventListener('load', () => {
  loadQuotes();

  // If session has lastViewedQuote, show it; otherwise show random
  try {
    const last = sessionStorage.getItem('lastViewedQuote');
    if (last) {
      const q = JSON.parse(last);
      if (q && (q.text || typeof q === 'string')) {
        if (q.text) quoteDisplay.textContent = `"${q.text}" — (${q.category || 'uncategorized'})`;
        else quoteDisplay.textContent = String(q);
      } else {
        displayRandomQuote();
      }
    } else {
      displayRandomQuote();
    }
  } catch (e) {
    displayRandomQuote();
  }
});

/* Event listeners */
if (newQuoteBtn) newQuoteBtn.addEventListener('click', displayRandomQuote);
if (exportBtn) exportBtn.addEventListener('click', exportToJsonFile);
if (importFile) importFile.addEventListener('change', importFromJsonFile);
