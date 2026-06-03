(function () {
  "use strict";

  const CONTAINER_SELECTORS = [
    ".project__media",
    ".hero__portrait",
    ".cert-card__visual",
    ".cert-modal__figure",
    "#hero__animation__img",
  ].join(", ");

  const IMAGE_SELECTORS = [
    ".project__img",
    ".hero__portrait-img",
    ".cert-card__visual img",
    ".cert-modal__image",
  ].join(", ");

  function drawImage(ctx, image, width, height, fit, alignBottom) {
    const scale =
      fit === "contain"
        ? Math.min(width / image.naturalWidth, height / image.naturalHeight)
        : Math.max(width / image.naturalWidth, height / image.naturalHeight);
    const drawW = image.naturalWidth * scale;
    const drawH = image.naturalHeight * scale;
    const offsetX = (width - drawW) / 2;
    const offsetY = fit === "contain" && alignBottom ? height - drawH : (height - drawH) / 2;
    ctx.drawImage(image, offsetX, offsetY, drawW, drawH);
  }

  function protectContainer(el) {
    if (!el || el.dataset.imageProtected === "true") return;
    el.dataset.imageProtected = "true";
    el.classList.add("image-protected");

    el.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });

    el.addEventListener("dragstart", (e) => {
      e.preventDefault();
    });
  }

  function hardenImage(img) {
    if (!img) return;
    img.draggable = false;
    img.setAttribute("draggable", "false");
    img.addEventListener("contextmenu", (e) => e.preventDefault());
    img.addEventListener("dragstart", (e) => e.preventDefault());
  }

  function isCertificateImage(img) {
    return (
      img.classList.contains("cert-modal__image") || Boolean(img.closest(".cert-card__visual"))
    );
  }

  function protectCertificateImage(img) {
    hardenImage(img);
    img.dataset.canvasProtected = "true";
    return Promise.resolve();
  }

  function replaceWithCanvas(img) {
    if (!img || img.tagName !== "IMG" || img.dataset.canvasProtected === "true") {
      return Promise.resolve();
    }

    if (isCertificateImage(img)) {
      return protectCertificateImage(img);
    }

    const run = () => {
      const src = img.currentSrc || img.src;
      if (!src || src === window.location.href) {
        img.dataset.canvasProtected = "true";
        return Promise.resolve();
      }

      return new Promise((resolve) => {
        const loader = new Image();
        loader.crossOrigin = "anonymous";
        loader.decoding = "async";

        loader.onload = () => {
          try {
            const displayW = Math.max(img.clientWidth || loader.naturalWidth, 1);
            const displayH = Math.max(img.clientHeight || loader.naturalHeight, 1);
            const canvas = document.createElement("canvas");
            canvas.width = displayW;
            canvas.height = displayH;
            canvas.className = img.className;
            canvas.setAttribute("role", "img");
            if (img.alt) canvas.setAttribute("aria-label", img.alt);
            if (img.hasAttribute("width")) canvas.setAttribute("width", img.getAttribute("width"));
            if (img.hasAttribute("height")) canvas.setAttribute("height", img.getAttribute("height"));
            if (img.hasAttribute("aria-hidden")) {
              canvas.setAttribute("aria-hidden", img.getAttribute("aria-hidden"));
            }

            const ctx = canvas.getContext("2d");
            if (!ctx) throw new Error("Canvas unavailable");
            const fit = img.classList.contains("hero__portrait-img") ? "contain" : "cover";
            drawImage(ctx, loader, displayW, displayH, fit, img.classList.contains("hero__portrait-img"));

            canvas.dataset.canvasProtected = "true";
            hardenImage(canvas);
            img.replaceWith(canvas);
          } catch (_) {
            hardenImage(img);
            img.dataset.canvasProtected = "true";
          }
          resolve();
        };

        loader.onerror = () => {
          hardenImage(img);
          img.dataset.canvasProtected = "true";
          resolve();
        };

        loader.src = src;
      });
    };

    if (img.complete && img.naturalWidth) return run();
    return new Promise((resolve) => {
      img.addEventListener("load", () => run().then(resolve), { once: true });
      img.addEventListener("error", () => {
        hardenImage(img);
        img.dataset.canvasProtected = "true";
        resolve();
      }, { once: true });
    });
  }

  function protectImages(root) {
    const scope = root || document;
    scope.querySelectorAll(CONTAINER_SELECTORS).forEach(protectContainer);

    const images = scope.querySelectorAll(IMAGE_SELECTORS);
    const jobs = Array.from(images).map((img) => {
      hardenImage(img);
      return replaceWithCanvas(img);
    });

    return Promise.all(jobs);
  }

  function refreshImage(img, src) {
    if (!img) return Promise.resolve();

    if (img.tagName === "CANVAS" && img.classList.contains("cert-modal__image")) {
      const replacement = document.createElement("img");
      replacement.className = "cert-modal__image";
      replacement.alt = img.getAttribute("aria-label") || "";
      if (src) replacement.src = src;
      img.replaceWith(replacement);
      return protectCertificateImage(replacement);
    }

    if (isCertificateImage(img)) {
      if (src) img.src = src;
      img.dataset.canvasProtected = "";
      return protectCertificateImage(img);
    }

    if (src) img.src = src;
    img.dataset.canvasProtected = "";
    hardenImage(img);
    return replaceWithCanvas(img);
  }

  window.PryzenImageProtection = {
    protectImages,
    refreshImage,
  };

  function init() {
    protectImages();

    document.addEventListener(
      "keydown",
      (e) => {
        const key = e.key.toLowerCase();
        const saveShortcut = (e.ctrlKey || e.metaKey) && key === "s";
        const copyShortcut = (e.ctrlKey || e.metaKey) && key === "c";
        if (!saveShortcut && !copyShortcut) return;

        const target = e.target;
        if (!(target instanceof Element)) return;
        if (target.closest(".image-protected")) e.preventDefault();
      },
      true
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
