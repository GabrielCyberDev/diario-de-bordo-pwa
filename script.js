const STORAGE_KEY = "diario-bordo-entries";

const form = document.getElementById("entryForm");
const entriesContainer = document.getElementById("entries");
const installBtn = document.getElementById("installBtn");

let deferredPrompt = null;

let entries = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

function saveEntries() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function renderEntries() {
  entriesContainer.innerHTML = "";

  if (entries.length === 0) {
    entriesContainer.innerHTML = "<p>Nenhuma entrada cadastrada.</p>";
    return;
  }

  entries
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .forEach((entry, index) => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <h3>${entry.title}</h3>
        <small>${entry.date}</small>
        <p>${entry.description}</p>
        <button class="delete" onclick="removeEntry(${index})">
          Remover
        </button>
      `;

      entriesContainer.appendChild(card);
    });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const date = document.getElementById("date").value;

  entries.push({
    title,
    description,
    date,
  });

  saveEntries();
  renderEntries();

  form.reset();
});

function removeEntry(index) {
  entries.splice(index, 1);
  saveEntries();
  renderEntries();
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js");
  });
}

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();

  deferredPrompt = event;

  console.log("PWA pode ser instalado.");

  installBtn.hidden = false;
});

window.addEventListener("appinstalled", () => {
  console.log("PWA instalado com sucesso.");

  installBtn.hidden = true;
});

installBtn.addEventListener("click", async () => {
  if (!deferredPrompt) return;

  deferredPrompt.prompt();

  await deferredPrompt.userChoice;

  deferredPrompt = null;

  installBtn.hidden = true;
});

renderEntries();