const btns = document.querySelectorAll(".btn");
const lockToggle = document.getElementById("lockToggle");
let isLocked = localStorage.getItem("albumLocked") !== "false";

function updateLockUI() {
  lockToggle.textContent = isLocked ? "🔒" : "🔓";
}

updateLockUI();

lockToggle.addEventListener("click", () => {
  isLocked = !isLocked;

  localStorage.setItem("albumLocked", isLocked);

  updateLockUI();
});

function getStickers() {
  return Array.from(document.querySelectorAll(".sticker"));
}

function updateCounters() {
  const stickers = getStickers();

  let total = stickers.length;
  let owned = 0;
  let duplicate = 0;
  let missing = 0;

  stickers.forEach((s) => {
    const status = s.dataset.status;

    if (status === "owned") owned++;
    else if (status === "duplicate") duplicate++;
    else missing++;
  });

  const completion = total
    ? Math.round(((owned + duplicate) / total) * 100)
    : 0;

  setSummary("owned", owned + duplicate);
  setSummary("missing", missing);
  setSummary("duplicate", duplicate);
  setSummary("total", total);
  setSummary("completion", `${completion}%`);
}

function updateSectionSummary() {
  const sections = document.querySelectorAll(".album-section");

  let completed = 0;

  sections.forEach((section) => {
    const stickers = [...section.querySelectorAll(".sticker")];

    const isComplete = stickers.every((s) => {
      return s.dataset.status === "owned" || s.dataset.status === "duplicate";
    });

    if (isComplete) completed++;
  });

  const total = sections.length;

  setSummary("sections", `${completed}/${total}`);
}

function updateSections() {
  document.querySelectorAll(".album-section").forEach((section) => {
    const visible = [...section.querySelectorAll(".sticker")].some(
      (s) => s.style.display !== "none",
    );

    section.style.display = visible ? "block" : "none";
  });
}

function applyCurrentFilter() {
  const filter = document.querySelector(".btn.active")?.dataset.filter || "all";

  getStickers().forEach((sticker) => {
    const status = sticker.dataset.status;

    const isSpecial = sticker.textContent.trim().startsWith("FWC");

    const show =
      isSpecial ||
      filter === "all" ||
      (filter === "missing" && status === "missing") ||
      (filter === "have" && status === "duplicate");

    sticker.style.display = show ? "flex" : "none";
  });

  updateSections();
}

function setSummary(field, value) {
  const el = document.querySelector(`[data-field="${field}"]`);
  if (el) el.textContent = value;
}

getStickers().forEach((sticker) => {
  sticker.addEventListener("click", async () => {
    if (isLocked) return;

    try {
      const response = await fetch(`/${sticker.dataset.id}`, {
        method: "PATCH",
      });

      const data = await response.json();

      if (!data.success) return;

      sticker.dataset.status = data.status;

      sticker.classList.remove("missing", "owned", "duplicate");
      sticker.classList.add(data.status);

      updateCounters();
      updateSectionCounters();
      applyCurrentFilter();
      updateSectionSummary();
    } catch (error) {
      console.error(error);
    }
  });
});

btns.forEach((btn) => {
  btn.addEventListener("click", () => {
    btns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    applyCurrentFilter();
  });
});

const scrollBtn = document.getElementById("scrollTop");

window.addEventListener("scroll", () => {
  scrollBtn.classList.toggle("visible", window.scrollY > 300);
});

scrollBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const themeToggle = document.getElementById("themeToggle");
const savedTheme = localStorage.getItem("theme") || "light";

document.documentElement.setAttribute("data-theme", savedTheme);
themeToggle.textContent = savedTheme === "dark" ? "☀️" : "🌙";

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  themeToggle.textContent = next === "dark" ? "☀️" : "🌙";
});

function editRow(id) {
  if (isLocked) return;

  const row = document.getElementById(`row-${id}`);

  row
    .querySelectorAll(".view-mode")
    .forEach((td) => (td.style.display = "none"));

  row.querySelector(".edit-mode").style.display = "";
}

function cancelEdit(id) {
  const row = document.getElementById(`row-${id}`);
  row.querySelectorAll(".view-mode").forEach((td) => (td.style.display = ""));
  row.querySelector(".edit-mode").style.display = "none";
}

const packsToggle = document.getElementById("packsToggle");
const packsBody = document.getElementById("packsBody");

packsToggle.addEventListener("click", () => {
  packsBody.classList.toggle("open");
  packsToggle.closest(".packs-card").classList.toggle("open");
});

document.addEventListener("DOMContentLoaded", () => {
  if (window.twemoji) {
    document.querySelectorAll(".section-flag").forEach((flag) => {
      twemoji.parse(flag, {
        folder: "svg",
        ext: ".svg",
      });
    });
  }
});

function buildStickerText(title, status) {
  const sections = document.querySelectorAll(".album-section");

  let text = `${title}\n`;

  sections.forEach((section) => {
    const sectionName = section.dataset.name;

    const stickers = [
      ...section.querySelectorAll(`.sticker[data-status='${status}']`),
    ];

    if (!stickers.length) return;

    const codes = stickers.map((s) =>
      s.textContent.trim().replace(/^[A-Z]+/, ""),
    );

    text += `${sectionName}: ${codes.join(", ")}\n`;
  });

  return text.trim();
}

const copyMissingBtn = document.getElementById("copyMissingBtn");

copyMissingBtn?.addEventListener("click", async () => {
  const text = buildStickerText("Faltantes", "missing");

  try {
    await navigator.clipboard.writeText(text);

    copyMissingBtn.textContent = "Copiado!";

    setTimeout(() => {
      copyMissingBtn.textContent = "Copiar faltantes";
    }, 500);
  } catch (error) {
    console.error("Error al copiar:", error);
  }
});

const copyDuplicateBtn = document.getElementById("copyDuplicateBtn");

copyDuplicateBtn?.addEventListener("click", async () => {
  const text = buildStickerText("Repetidas", "duplicate");

  try {
    await navigator.clipboard.writeText(text);

    copyDuplicateBtn.textContent = "¡Copiado!";

    setTimeout(() => {
      copyDuplicateBtn.textContent = "Copiar repetidas";
    }, 500);
  } catch (error) {
    console.error("Error al copiar:", error);
  }
});

const copyTradeBtn = document.getElementById("copyTradeBtn");

copyTradeBtn?.addEventListener("click", async () => {
  const missingText = buildStickerText("📕 FALTANTES", "missing");
  const duplicateText = buildStickerText("📗 REPETIDAS", "duplicate");

  const finalText = `${missingText}\n\n${duplicateText}`;

  try {
    await navigator.clipboard.writeText(finalText);

    copyTradeBtn.textContent = "¡Copiado!";

    setTimeout(() => {
      copyTradeBtn.textContent = "Copiar intercambio";
    }, 500);
  } catch (error) {
    console.error(error);
  }
});

function updateSectionCounters() {
  document.querySelectorAll(".album-section").forEach((section) => {
    const stickers = [...section.querySelectorAll(".sticker")];

    const total = stickers.length;

    const completed = stickers.filter(
      (s) => s.dataset.status !== "missing",
    ).length;

    const progress = section.querySelector(".section-progress");

    if (progress) {
      progress.textContent = `${completed}/${total}`;
    }
  });
}

const sortBtns = document.querySelectorAll(".sort-btn");
const container = document.getElementById("sectionsContainer");

const originalSections = [...document.querySelectorAll(".album-section")];

const countriesNav = document.getElementById("countriesNav");

const originalChips = [...document.querySelectorAll(".country-chip")];

sortBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    sortBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const mode = btn.dataset.sort;

    let sortedSections = [];
    let sortedChips = [];

    if (mode === "world") {
      sortedSections = [...originalSections];
      sortedChips = [...originalChips];
    }

    if (mode === "alphabetical") {
      sortedSections = [...originalSections].sort((a, b) => {
        if (a.dataset.code === "FWC") return -1;
        if (b.dataset.code === "FWC") return 1;

        return a.dataset.country.localeCompare(b.dataset.country);
      });

      sortedChips = [...originalChips].sort((a, b) => {
        if (a.dataset.code === "FWC") return -1;
        if (b.dataset.code === "FWC") return 1;

        return a.dataset.country.localeCompare(b.dataset.country);
      });
    }

    if (mode === "code") {
      sortedSections = [...originalSections].sort((a, b) => {
        if (a.dataset.code === "FWC") return -1;
        if (b.dataset.code === "FWC") return 1;

        return a.dataset.code.localeCompare(b.dataset.code);
      });

      sortedChips = [...originalChips].sort((a, b) => {
        if (a.dataset.code === "FWC") return -1;
        if (b.dataset.code === "FWC") return 1;

        return a.dataset.code.localeCompare(b.dataset.code);
      });
    }

    sortedSections.forEach((section) => {
      container.appendChild(section);
    });

    sortedChips.forEach((chip) => {
      countriesNav.appendChild(chip);
    });
  });
});

function normalizeText(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

const searchInput = document.getElementById("searchInput");

searchInput?.addEventListener("input", () => {
  const term = normalizeText(searchInput.value.trim());

  const sections = document.querySelectorAll(".album-section");
  const chips = document.querySelectorAll(".country-chip");

  if (term.length < 2) {
    sections.forEach((section) => {
      section.classList.remove("hidden");
    });

    chips.forEach((chip) => {
      chip.classList.remove("hidden");
    });

    applyCurrentFilter();

    return;
  }

  sections.forEach((section) => {
    const country = normalizeText(section.dataset.country || "");
    const code = normalizeText(section.dataset.code || "");

    const matches = country.includes(term) || code.includes(term);

    section.classList.toggle("hidden", !matches);
  });

  chips.forEach((chip) => {
    const country = normalizeText(chip.dataset.country || "");
    const code = normalizeText(chip.dataset.code || "");

    const matches = country.includes(term) || code.includes(term);

    chip.classList.toggle("hidden", !matches);
  });
});

const clearSearchBtn = document.getElementById("clearSearchBtn");

clearSearchBtn?.addEventListener("click", () => {
  searchInput.value = "";

  document.querySelectorAll(".album-section").forEach((section) => {
    section.classList.remove("hidden");
  });

  document.querySelectorAll(".country-chip").forEach((chip) => {
    chip.classList.remove("hidden");
  });

  applyCurrentFilter();

  searchInput.focus();
});

updateCounters();
applyCurrentFilter();
updateSectionCounters();
updateSectionSummary();
