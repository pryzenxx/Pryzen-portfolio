(function () {
  "use strict";

  const modal = document.getElementById("certModal");
  if (!modal) return;

  const cards = document.querySelectorAll(".cert-card[data-cert-index]");
  const backdrop = modal.querySelector(".cert-modal__backdrop");
  const closeBtn = modal.querySelector(".cert-modal__close");
  const prevBtn = modal.querySelector(".cert-modal__prev");
  const nextBtn = modal.querySelector(".cert-modal__next");
  const imageEl = modal.querySelector(".cert-modal__image");
  const titleEl = modal.querySelector(".cert-modal__title");
  const issuerEl = modal.querySelector(".cert-modal__issuer");
  const dateEl = modal.querySelector(".cert-modal__date");
  const counterEl = modal.querySelector(".cert-modal__counter");
  const dialog = modal.querySelector(".cert-modal__dialog");

  const items = Array.from(cards).map((card) => ({
    title: card.dataset.certTitle || "",
    issuer: card.dataset.certIssuer || "",
    date: card.dataset.certDate || "",
    image: card.dataset.certImage || "",
    alt: card.dataset.certAlt || card.dataset.certTitle || "Certificate",
  }));

  let currentIndex = 0;
  let lastFocus = null;

  function updateNav() {
    const total = items.length;
    const hasMany = total > 1;
    if (prevBtn) prevBtn.hidden = !hasMany;
    if (nextBtn) nextBtn.hidden = !hasMany;
    if (counterEl) {
      counterEl.textContent = hasMany ? `${currentIndex + 1} / ${total}` : "";
      counterEl.hidden = !hasMany;
    }
  }

  function render(index) {
    const item = items[index];
    if (!item) return;
    currentIndex = index;
    if (imageEl) {
      imageEl.src = item.image;
      imageEl.alt = item.alt;
    }
    if (titleEl) titleEl.textContent = item.title;
    if (issuerEl) issuerEl.textContent = item.issuer;
    if (dateEl) dateEl.textContent = item.date;
    updateNav();
  }

  function open(index) {
    if (!items[index]) return;
    lastFocus = document.activeElement;
    render(index);
    modal.hidden = false;
    modal.classList.add("is-open");
    document.body.classList.add("cert-modal-open");
    closeBtn?.focus();
  }

  function close() {
    modal.classList.remove("is-open");
    modal.hidden = true;
    document.body.classList.remove("cert-modal-open");
    if (lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus();
    }
  }

  function step(delta) {
    const total = items.length;
    if (total < 2) return;
    const next = (currentIndex + delta + total) % total;
    render(next);
  }

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const index = Number(card.dataset.certIndex);
      if (!Number.isNaN(index)) open(index);
    });
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const index = Number(card.dataset.certIndex);
        if (!Number.isNaN(index)) open(index);
      }
    });
  });

  closeBtn?.addEventListener("click", close);
  backdrop?.addEventListener("click", close);
  prevBtn?.addEventListener("click", () => step(-1));
  nextBtn?.addEventListener("click", () => step(1));

  modal.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("is-open")) return;
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      step(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      step(1);
    } else if (e.key === "Tab" && dialog) {
      const focusable = dialog.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const list = Array.from(focusable).filter((el) => !el.hidden && el.offsetParent !== null);
      if (list.length < 2) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
})();
