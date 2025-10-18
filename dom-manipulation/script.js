// script.js

/* ========= Data management ========= */
const STORAGE_KEY = 'dom_quotes_v1';

let quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "inspirational" },
  { text: "Simplicity is the ultimate sophistication.", category: "philosophy" },
  { text: "Code is like humor. When you have to explain it, it's bad.", category: "programming" },
  { text: "Don't watch the clock; do what it does. Keep going.", category: "motivational" }
];

// load from localStorage if available
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) quotes = parsed;
    }
  } catch (e) {
    console.warn("Could not load saved quotes:", e);
  }
}

function saveToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
  } catch (e) {
    console.warn("Could not save quotes:", e);
  }
}

/* ========= DOM references ========= */
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const categoryContainer = document.getElementById('categoryContainer');
const addArea = document.getElementById('addArea');
const categorySelect = document.getElementById('categorySelect');

/* ========= Utility ========= */
function getUniqueCategories() {
  const cats = new Set(quotes.map(q => (q.category || 'uncategorized').toLowerCase().trim()));
  return Array.from(cats).filter(Boolean).sort();
}

function pickRandom(arr) {
  if (!arr || arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

/* ========= Display logic ========= */
function renderCategories() {
  categoryContainer.innerHTML = '';
  categorySelect.innerHTML = '<option value="all">All categories</option>';

  const cats = getUniqueCategories();
  cats.forEach(cat => {
    // create button
    const btn = document.createElement('button');
    btn.className = 'category-btn';
    btn.textContent = cat;
    btn.setAttribute('data-cat', cat);
    btn.addEventListener('click', (e) => {
      // toggle active
      const currentlyActive = btn.classList.contains('active');
      document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
      if (!currentlyActive) {
        btn.classList.add('active');
        categorySelect.value = cat;
      } else {
        categorySelect.value = 'all';
      }
      showRandomQuote();
    });
    categoryContainer.appendChild(btn);

    // add to select
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    categorySelect.appendChild(opt);
  });
}

function showQuoteObject(qObj) {
  if (!qObj) {
    quoteDisplay.innerHTML = '<em>No quotes available.</em>';
    return;
  }
  quoteDisplay.innerHTML = '';
  const p = document.createElement('p');
  p.textContent = qObj.text;
  p.style.fontWeight = '600';
  p.style.marginBottom = '10px';

  const small = document.createElement('div');
  small.textContent = `Category: ${qObj.category || 'uncategorized'}`;
  small.style.fontSize = '0.9rem';
  small.style.color = '#444';

  quoteDisplay.appendChild(p);
  quoteDisplay.appendChild(small);
}

function showRandomQuote() {
  const selectedCat = categorySelect.value || 'all';
  let pool = quotes.slice();

  if (selectedCat && selectedCat !== 'all') {
    pool = pool.filter(q => (q.category || 'uncategorized').toLowerCase().trim() === selectedCat.toLowerCase().trim());
  }

  const picked = pickRandom(pool);
  showQuoteObject(picked);
}

/* ========= Adding quotes dynamically ========= */
function createAddQuoteForm() {
  // create form
  const form = document.createElement('form');
  form.id = 'addQuoteForm';
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    addQuote();
  });

  const textInput = document.createElement('input');
  textInput.type = 'text';
  textInput.placeholder = 'Enter a new quote';
  textInput.id = 'newQuoteText';
  textInput.required = true;

  const catInput = document.createElement('input');
  catInput.type = 'text';
  catInput.placeholder = 'Enter quote category';
  catInput.id = 'newQuoteCategory';
  catInput.required = true;

  const addBtn = document.createElement('button');
  addBtn.type = 'submit';
  addBtn.textContent = 'Add Quote';

  const clearBtn = document.createElement('button');
  clearBtn.type = 'button';
  clearBtn.textContent = 'Clear Saved';
  clearBtn.addEventListener('click', () => {
    if (!confirm('Clear all saved quotes and restore seeded quotes?')) return;
    localStorage.removeItem(STORAGE_KEY);
    // restore defaults
    quotes = [
      { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "inspirational" },
      { text: "Simplicity is the ultimate sophistication.", category: "philosophy" },
      { text: "Code is like humor. When you have to explain it, it's bad.", category: "programming" },
      { text: "Don't watch the clock; do what it does. Keep going.", category: "motivational" }
    ];
    saveToStorage();
    renderCategories();
    showRandomQuote();
  });

  form.appendChild(textInput);
  form.appendChild(catInput);
  form.appendChild(addBtn);
  form.appendChild(clearBtn);

  addArea.innerHTML = '';
  addArea.appendChild(form);
}

function addQuote() {
  const textEl = document.getElementById('newQuoteText');
  const catEl = document.getElementById('newQuoteCategory');
  if (!textEl || !catEl) return;

  const text = textEl.value.trim();
  const category = catEl.value.trim().toLowerCase();

  if (!text) {
    alert('Please enter a quote text.');
    textEl.focus();
    return;
  }
  if (!category) {
    alert('Please enter a category.');
    catEl.focus();
    return;
  }

  const newQ = { text, category };
  quotes.push(newQ);
  saveToStorage();

  // update UI
  renderCategories();

  // clear inputs and show the new quote
  textEl.value = '';
  catEl.value = '';
  // make the category selected
  categorySelect.value = category;
  // highlight corresponding category button
  document.querySelectorAll('.category-btn').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-cat') === category);
  });

  showQuoteObject(newQ);
}

/* ========= Hooks / event bindings ========= */
function init() {
  loadFromStorage();
  renderCategories();
  createAddQuoteForm();
  showRandomQuote();

  newQuoteBtn.addEventListener('click', showRandomQuote);
  categorySelect.addEventListener('change', () => {
    // Remove active from buttons when select changes to 'all' or another cat
    document.querySelectorAll('.category-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-cat') === categorySelect.value);
    });
    showRandomQuote();
  });
}

/* ========= Start ========= */
document.addEventListener('DOMContentLoaded', init);
