const btns = document.querySelectorAll(".btn");

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

    const show =
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
      applyCurrentFilter();
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

updateCounters();
applyCurrentFilter();
