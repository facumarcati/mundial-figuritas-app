const stickers = document.querySelectorAll(".sticker");
const btns = document.querySelectorAll(".btn");

function updateCounters() {
  const total = document.querySelectorAll(".sticker").length;

  const owned =
    document.querySelectorAll(".sticker.owned").length +
    document.querySelectorAll(".sticker.duplicate").length;

  const duplicate = document.querySelectorAll(".sticker.duplicate").length;

  document.querySelector(".stat-total").textContent = `Total: ${total}`;
  document.querySelector(".stat-owned").textContent = `Tengo: ${owned}`;
  document.querySelector(".stat-dup").textContent = `Repetidas: ${duplicate}`;
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
  const filter = document.querySelector(".btn.active").dataset.filter;

  stickers.forEach((sticker) => {
    const show = filter === "all" || sticker.dataset.status === filter;

    sticker.style.display = show ? "flex" : "none";
  });

  updateSections();
}

stickers.forEach((sticker) => {
  sticker.addEventListener("click", async () => {
    try {
      const response = await fetch(`/${sticker.dataset.id}`, {
        method: "PATCH",
      });

      const data = await response.json();

      if (!data.success) return;

      sticker.className = `sticker ${data.status} ${
        sticker.classList.contains("special") ? "special" : ""
      }`;

      sticker.dataset.status = data.status;

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
