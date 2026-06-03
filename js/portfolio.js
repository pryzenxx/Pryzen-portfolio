(function () {
  "use strict";

  const splash = document.getElementById("splash");
  const splashType = document.getElementById("splashType");
  const splashCursor = document.getElementById("splashCursor");
  const toTop = document.getElementById("toTop");
  const yearEl = document.getElementById("year");
  const SPLASH_WORD = "PRYZEN";
  const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const splashStage = document.getElementById("splashStage");
  const splashCurtain = document.getElementById("splashCurtain");
  const splashPct = document.getElementById("splashPct");
  const splashLayerDark = document.getElementById("splashLayerDark");
  const splashLayerLight = document.getElementById("splashLayerLight");
  const splashSweepBand = document.getElementById("splashSweepBand");
  const navLinks = document.querySelectorAll(".nav--left .nav__link, .mobile-drawer__link");
  const sections = document.querySelectorAll(".section[id]");
  const progressCircle = document.querySelector(".to-top__progress");

  const THEME_KEY = "pryzen-theme";
  const circumference = 2 * Math.PI * 22;

  if (progressCircle) {
    progressCircle.style.strokeDasharray = String(circumference);
    progressCircle.style.strokeDashoffset = String(circumference);
  }

  function initTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else if (stored === "dark") {
      document.documentElement.removeAttribute("data-theme");
    } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      document.documentElement.setAttribute("data-theme", "light");
    }
  }

  initTheme();

  function toggleTheme() {
    const isLight = document.documentElement.getAttribute("data-theme") === "light";
    if (isLight) {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem(THEME_KEY, "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem(THEME_KEY, "light");
    }
  }

  document.querySelectorAll(".theme-toggle").forEach((btn) => {
    btn.addEventListener("click", toggleTheme);
  });

  function initMobileMenu() {
    const menuBtn = document.getElementById("mobileMenuBtn");
    const drawer = document.getElementById("mobileDrawer");
    const backdrop = document.getElementById("mobileDrawerBackdrop");
    const closeBtn = document.getElementById("mobileDrawerClose");
    const panel = drawer?.querySelector(".mobile-drawer__panel");
    if (!menuBtn || !drawer || !panel) return;

    const drawerLinks = drawer.querySelectorAll(".mobile-drawer__link");
    const socialLinks = drawer.querySelectorAll(".mobile-drawer__social-link");
    const drawerHead = drawer.querySelector(".mobile-drawer__head");

    let bodyOverflowPrev = "";
    let drawerTl = null;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const useGsapLinks = typeof gsap !== "undefined" && !reduceMotion;

    function clearDrawerInlineStyles() {
      if (!useGsapLinks) return;
      gsap.killTweensOf([panel, backdrop, drawerHead, ...drawerLinks, ...socialLinks].filter(Boolean));
      gsap.set([panel, backdrop], { clearProps: "transform,opacity" });
      gsap.set([drawerHead, ...drawerLinks, ...socialLinks].filter(Boolean), { clearProps: "opacity,transform,x,y" });
    }

    clearDrawerInlineStyles();

    function finalizeClose() {
      drawer.classList.remove("is-open");
      menuBtn.classList.remove("is-open");
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.setAttribute("aria-label", "Open menu");
      drawer.setAttribute("aria-hidden", "true");
      document.body.style.overflow = bodyOverflowPrev || "";
      clearDrawerInlineStyles();
      drawerTl = null;
    }

    function openMobileMenu() {
      if (drawer.classList.contains("is-open")) return;
      drawerTl?.kill();
      clearDrawerInlineStyles();

      bodyOverflowPrev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      drawer.classList.add("is-open");
      menuBtn.classList.add("is-open");
      menuBtn.setAttribute("aria-expanded", "true");
      menuBtn.setAttribute("aria-label", "Close menu");
      drawer.setAttribute("aria-hidden", "false");

      if (useGsapLinks) {
        const run = () => {
          if (drawerHead) {
            gsap.fromTo(
              drawerHead,
              { opacity: 0, y: -12 },
              { opacity: 1, y: 0, duration: 0.32, ease: "power2.out" }
            );
          }
          gsap.fromTo(
            drawerLinks,
            { opacity: 0, x: 20 },
            { opacity: 1, x: 0, duration: 0.4, stagger: 0.055, ease: "power3.out", delay: 0.05 }
          );
          if (socialLinks.length) {
            gsap.fromTo(
              socialLinks,
              { opacity: 0, y: 10 },
              { opacity: 1, y: 0, duration: 0.3, stagger: 0.045, ease: "power2.out", delay: 0.16 }
            );
          }
        };
        requestAnimationFrame(() => requestAnimationFrame(run));
      }
    }

    function closeMobileMenu() {
      if (!drawer.classList.contains("is-open")) return;
      drawerTl?.kill();

      if (useGsapLinks) {
        drawerTl = gsap.timeline({ onComplete: finalizeClose });
        drawerTl.to(drawerLinks, {
          opacity: 0,
          x: 14,
          duration: 0.2,
          stagger: { each: 0.035, from: "end" },
          ease: "power2.in",
        });
        if (socialLinks.length) {
          drawerTl.to(
            socialLinks,
            { opacity: 0, y: 8, duration: 0.16, stagger: { each: 0.025, from: "end" }, ease: "power2.in" },
            0
          );
        }
        if (drawerHead) {
          drawerTl.to(drawerHead, { opacity: 0, y: -8, duration: 0.2, ease: "power2.in" }, 0.04);
        }
      } else {
        finalizeClose();
      }
    }

    function toggleMobileMenu() {
      if (drawer.classList.contains("is-open")) closeMobileMenu();
      else openMobileMenu();
    }

    menuBtn.addEventListener("click", toggleMobileMenu);
    backdrop?.addEventListener("click", closeMobileMenu);
    closeBtn?.addEventListener("click", closeMobileMenu);

    drawer.querySelectorAll(".mobile-drawer__link").forEach((link) => {
      link.addEventListener("click", () => {
        closeMobileMenu();
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && drawer.classList.contains("is-open")) {
        closeMobileMenu();
        menuBtn.focus();
      }
    });

    const mq = window.matchMedia("(min-width: 769px)");
    function onMq(e) {
      if (e.matches) {
        drawerTl?.kill();
        if (drawer.classList.contains("is-open")) {
          finalizeClose();
        }
      }
    }

    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", onMq);
    } else {
      mq.addListener(onMq);
    }
  }

  initMobileMenu();

  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Splash ---------- */
  function runSplash() {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      document.body.classList.remove("is-loading");
      if (splashType) splashType.textContent = SPLASH_WORD;
      if (splashPct) splashPct.textContent = "100";
      splashCursor?.classList.add("is-off");
      if (splashLayerLight) splashLayerLight.style.opacity = "0";
      if (splashLayerDark) splashLayerDark.style.opacity = "1";
      if (splashSweepBand) splashSweepBand.style.removeProperty("transform");
      splash?.classList.add("is-done");
      document.querySelectorAll(".reveal").forEach((el) => {
        el.classList.add("is-inview");
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      return;
    }

    if (!splash || typeof gsap === "undefined") {
      document.body.classList.remove("is-loading");
      if (splashType) splashType.textContent = SPLASH_WORD;
      if (splashPct) splashPct.textContent = "100";
      splashCursor?.classList.add("is-off");
      splash?.classList.add("is-done");
      introHero();
      return;
    }

    document.body.classList.add("is-loading");
    if (splashType) splashType.textContent = "";
    splashCursor?.classList.remove("is-off");
    if (splashCurtain) gsap.set(splashCurtain, { height: "0%" });
    if (splashStage) gsap.set(splashStage, { opacity: 1, y: 0, filter: "blur(0px)" });
    if (splashPct) splashPct.textContent = "0";
    if (splashLayerDark) gsap.set(splashLayerDark, { opacity: 1 });
    if (splashLayerLight) gsap.set(splashLayerLight, { opacity: 0 });
    if (splashSweepBand) gsap.set(splashSweepBand, { xPercent: -140 });
    if (splash) {
      gsap.set(splash, {
        "--splash-fg": "#f5f5f5",
        "--splash-fg-dim": "rgba(245, 245, 245, 0.42)",
      });
    }

    function updateScramble(progress) {
      if (!splashType) return;
      const len = SPLASH_WORD.length;
      let out = "";
      for (let i = 0; i < len; i++) {
        const lock = (i + 1) / (len + 0.65);
        if (progress >= lock) out += SPLASH_WORD[i];
        else out += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      }
      splashType.textContent = out;
    }

    const finishSplash = () => {
      gsap.to(splash, {
        opacity: 0,
        duration: 0.45,
        ease: "power2.inOut",
        delay: 0.08,
        onComplete: () => {
          splash.classList.add("is-done");
          document.body.classList.remove("is-loading");
          splash.classList.remove("is-outline");
          if (splash) {
            splash.style.removeProperty("--splash-fg");
            splash.style.removeProperty("--splash-fg-dim");
            splash.style.removeProperty("--splash-stroke");
            splash.style.removeProperty("--splash-fill");
          }
          introHero();
        },
      });
    };

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: finishSplash,
    });

    tl.fromTo(
      ".splash__glow",
      { opacity: 0, scale: 0.88 },
      { opacity: 0.55, scale: 1, duration: 1.05, ease: "power2.out" },
      0
    );

    const counter = { val: 0 };
    tl.to(
      counter,
      {
        val: 100,
        duration: 1.35,
        ease: "power2.inOut",
        onUpdate: () => {
          const v = Math.min(100, Math.round(counter.val));
          if (splashPct) splashPct.textContent = String(v);
        },
      },
      0.22
    );

    const scram = { p: 0 };
    tl.to(
      scram,
      {
        p: 1,
        duration: 0.92,
        ease: "power2.out",
        onUpdate: () => updateScramble(scram.p),
        onComplete: () => {
          if (splashType) splashType.textContent = SPLASH_WORD;
        },
      },
      0.16
    );

    if (splashSweepBand) {
      tl.fromTo(
        splashSweepBand,
        { xPercent: -140 },
        { xPercent: 265, duration: 1, ease: "power2.inOut" },
        0.48
      );
    }

    if (splashLayerDark && splashLayerLight) {
      tl.to(splashLayerDark, { opacity: 0, duration: 0.95, ease: "power2.inOut" }, 0.52).to(
        splashLayerLight,
        { opacity: 1, duration: 0.95, ease: "power2.inOut" },
        0.52
      );
    }

    if (splash) {
      tl.to(
        splash,
        {
          "--splash-fg": "#0a0a0c",
          "--splash-fg-dim": "rgba(10, 10, 12, 0.38)",
          duration: 0.95,
          ease: "power2.inOut",
        },
        0.52
      );
    }

    tl.to(
      ".splash__glow",
      { opacity: 0.07, scale: 0.9, duration: 0.55, ease: "power2.out" },
      0.55
    );
    tl.to(".splash__sweep", { opacity: 0, duration: 0.35, ease: "power2.out" }, 1.05);

    if (splashLayerDark && splashLayerLight && splash) {
      tl.to(splashLayerLight, { opacity: 0, duration: 0.48, ease: "power2.inOut" }, "+=0.2").to(
        splashLayerDark,
        { opacity: 1, duration: 0.48, ease: "power2.inOut" },
        "<"
      );
      tl.to(
        splash,
        {
          "--splash-fg": "#f5f5f5",
          "--splash-fg-dim": "rgba(245, 245, 245, 0.42)",
          duration: 0.48,
          ease: "power2.inOut",
        },
        "<"
      );
      tl.to(
        ".splash__glow",
        { opacity: 0.42, scale: 1, duration: 0.45, ease: "power2.out" },
        "<"
      );
    }

    tl.to(
      ".splash__brand",
      { scale: 1.008, duration: 0.32, ease: "power2.out" },
      "+=0.1"
    )
      .to(".splash__brand", { scale: 1, duration: 0.4, ease: "power3.out" }, ">")
      .call(
        () => {
          splashCursor?.classList.add("is-off");
        },
        null,
        "+=0.06"
      )
      .to(
        ".splash__pct-wrap",
        { opacity: 0, y: 10, duration: 0.32, ease: "power2.in" },
        "<"
      )
      .to(
        splash,
        { "--splash-stroke": "2px", "--splash-fill": "transparent", duration: 0.26, ease: "power2.out" },
        "+=0.08"
      )
      .call(
        () => {
          splash?.classList.add("is-outline");
        },
        null,
        "<"
      )
      .to(
        ".splash__type-row",
        { opacity: 0, y: -12, duration: 0.34, ease: "power2.in" },
        "+=0.26"
      )
      .to(
        splashStage,
        {
          y: "-6%",
          opacity: 0,
          filter: "blur(10px)",
          duration: 0.5,
          ease: "power3.in",
        },
        "-=0.22"
      );

    if (splashCurtain) {
      tl.to(
        splashCurtain,
        {
          height: "100%",
          duration: 0.62,
          ease: "power4.inOut",
        },
        "-=0.42"
      );
    }
  }

  function introHero() {
    const hero = document.getElementById("hero");
    const heroReveals = document.querySelectorAll("#hero .reveal");
    const heroGrid = document.querySelector("#hero .hero__grid");
    const heroName = document.querySelector("#hero .hero__name");
    const heroVisual = document.querySelector("#hero .hero__visual");
    const heroAside = hero
      ? [...hero.querySelectorAll(".hero__circle-link, .hero__scroll")].filter(Boolean)
      : [];
    const heroBodyReveals = [...heroReveals].filter((el) => el !== heroName && el !== heroVisual);

    if (typeof gsap === "undefined") {
      heroReveals.forEach((el) => {
        el.classList.add("is-inview");
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      window.dispatchEvent(new CustomEvent("hero-layout-ready"));
      return;
    }

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => {
        heroReveals.forEach((el) => el.classList.add("is-inview"));
        gsap.set(heroReveals, { clearProps: "opacity,transform,filter,scale" });
        if (heroAside.length) gsap.set(heroAside, { clearProps: "opacity,transform,scale" });
        if (heroVisual) gsap.set(heroVisual, { clearProps: "opacity,transform,filter,scale" });
        if (heroGrid) gsap.set(heroGrid, { clearProps: "clipPath,willChange" });
        window.dispatchEvent(new CustomEvent("hero-layout-ready"));
      },
    });

    if (heroGrid) {
      gsap.set(heroGrid, { willChange: "clip-path", clipPath: "inset(0 0 0 100%)" });
      tl.to(
        heroGrid,
        {
          clipPath: "inset(0 0 0 0%)",
          duration: 0.92,
          ease: "power3.inOut",
        },
        0
      );
    }

    const heroContentStart = heroGrid ? 0.1 : 0;

    if (heroName) {
      tl.fromTo(
        heroName,
        { opacity: 0, y: 28, scale: 0.985, filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "power3.out",
        },
        heroContentStart
      );
    }

    if (heroBodyReveals.length) {
      tl.fromTo(
        heroBodyReveals,
        { opacity: 0, y: 20, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.78,
          stagger: 0.07,
          ease: "power3.out",
        },
        heroName ? heroContentStart + 0.08 : heroContentStart
      );
    }

    if (heroVisual) {
      tl.fromTo(
        heroVisual,
        { opacity: 0, y: 24, scale: 0.97, filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.88,
          ease: "power3.out",
        },
        heroContentStart + 0.14
      );
    }

    if (heroAside.length) {
      heroAside.forEach((el) => {
        const targetOpacity = el.classList.contains("hero__circle-link") ? 0.78 : 1;
        tl.fromTo(
          el,
          { opacity: 0, y: 14, scale: 0.97 },
          {
            opacity: targetOpacity,
            y: 0,
            scale: 1,
            duration: 0.72,
            ease: "power2.out",
          },
          heroContentStart + 0.28
        );
      });
    }
  }

  runSplash();

  /* ---------- GSAP ScrollTrigger ---------- */
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    /**
     * Per-section + container entrance: clip-path reveal on `.container`,
     * staggered inner motion (modern, once per section).
     */
    function initSectionContainerTransitions() {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) {
        document.querySelectorAll(".section .reveal, main .footer .reveal").forEach((el) => {
          el.classList.add("is-inview");
        });
        return;
      }

      const sectionEase = "power3.inOut";
      const contentEase = "power3.out";

      function markRevealsIn(scope) {
        scope.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-inview"));
      }

      function clearRevealProps(nodes) {
        if (nodes && nodes.length) gsap.set(nodes, { clearProps: "opacity,transform,filter" });
      }

      gsap.utils.toArray("main > .section[id]").forEach((section) => {
        if (section.id === "hero") return;

        const container = section.querySelector(":scope > .container");
        if (!container) return;

        const sectionHead = container.querySelector(".section-head");
        const sectionTitle = container.querySelector(".section-title");
        const sectionNum = container.querySelector(".section-num");
        const allReveals = container.querySelectorAll(".reveal");
        const contentReveals = [...allReveals].filter((el) => {
          if (sectionHead && sectionHead.contains(el)) return false;
          if (section.id === "certificates") {
            return !el.classList.contains("cert-card") && !el.classList.contains("certificates__intro");
          }
          if (section.id === "resume") {
            return !el.classList.contains("resume-card") && !el.closest(".resume__cta-bar");
          }
          return true;
        });

        if (sectionHead) {
          sectionHead.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-inview"));
          if (sectionNum) {
            gsap.set(sectionNum, { opacity: 1, x: 0, scale: 1, filter: "blur(0px)" });
          }
          if (sectionTitle) {
            gsap.set(sectionTitle, { y: 0, filter: "blur(0px)", clearProps: "opacity" });
          }
        }

        const sectionBlocks = [...container.children].filter((el) => !el.classList.contains("section-head"));
        sectionBlocks.forEach((block) => {
          gsap.set(block, { willChange: "clip-path", clipPath: "inset(0% 0% 100% 0%)" });
        });

        if (contentReveals.length) {
          gsap.set(contentReveals, { opacity: 0, y: 20, filter: "blur(8px)" });
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 82%",
            toggleActions: "play none none none",
            once: true,
            fastScrollEnd: true,
          },
          defaults: { ease: contentEase },
          onComplete: () => {
            markRevealsIn(container);
            clearRevealProps(allReveals);
            if (sectionTitle) gsap.set(sectionTitle, { clearProps: "opacity,transform,filter" });
            if (sectionNum) gsap.set(sectionNum, { clearProps: "opacity,transform,filter,scale" });
            if (section.id === "works") {
              gsap.set(container.querySelectorAll(".work-card"), {
                clearProps: "opacity,transform,rotateX,transformPerspective,transformOrigin",
              });
            }
            if (section.id === "certificates") {
              gsap.set(container.querySelectorAll(".cert-card, .certificates__intro"), {
                clearProps: "opacity,transform,filter,scale",
              });
            }
            if (section.id === "resume") {
              gsap.set(container.querySelectorAll(".resume-card.reveal, .resume__cta-bar.reveal"), {
                clearProps: "opacity,transform",
              });
            }
            sectionBlocks.forEach((block) => {
              gsap.set(block, { clearProps: "clipPath,willChange" });
            });
          },
        });

        sectionBlocks.forEach((block) => {
          tl.to(
            block,
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 0.95,
              ease: sectionEase,
            },
            0
          );
        });

        if (section.id === "works") {
          const cards = container.querySelectorAll(".work-card");
          gsap.set(cards, { opacity: 0, y: 24 });
          tl.to(
            cards,
            {
              opacity: 1,
              y: 0,
              duration: 0.68,
              stagger: { each: 0.09, from: "start" },
              ease: "power3.out",
            },
            0.24
          );
        } else if (section.id === "certificates") {
          const intro = container.querySelector(".certificates__intro");
          const cards = container.querySelectorAll(".cert-card");

          if (intro) {
            gsap.set(intro, { opacity: 0, y: 18, filter: "blur(6px)" });
            tl.to(
              intro,
              { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.72, ease: "power3.out" },
              0.2
            );
          }

          if (cards.length) {
            gsap.set(cards, { opacity: 0, y: 22, scale: 0.988 });
            tl.to(
              cards,
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.66,
                stagger: { each: 0.1, from: "start" },
                ease: "power3.out",
              },
              intro ? 0.3 : 0.22
            );
          }
        } else if (section.id === "resume") {
          const resumeItems = container.querySelectorAll(".resume-card.reveal, .resume__cta-bar.reveal");
          if (resumeItems.length) {
            gsap.set(resumeItems, { opacity: 0, y: 14 });
            tl.to(
              resumeItems,
              {
                opacity: 1,
                y: 0,
                duration: 0.58,
                stagger: { each: 0.045, from: "start" },
                ease: "power2.out",
              },
              0.22
            );
          }
        } else if (contentReveals.length) {
          tl.to(
            contentReveals,
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.72,
              stagger: { each: 0.065, from: "start" },
              ease: "power3.out",
            },
            0.22
          );
        }
      });

      const footer = document.querySelector("main > .footer");
      const footerInner = footer?.querySelector(".container.footer__inner");
      if (footer && footerInner) {
        gsap.set(footerInner, {
          willChange: "transform,opacity,clip-path",
          opacity: 0,
          y: 44,
          clipPath: "inset(0% 10% 0% 10%)",
        });
        gsap
          .timeline({
            scrollTrigger: {
              trigger: footer,
              start: "top 88%",
              toggleActions: "play none none none",
              once: true,
            },
            onComplete: () => {
              gsap.set(footerInner, { clearProps: "willChange,clipPath,opacity,transform" });
            },
          })
          .to(
            footerInner,
            {
              clipPath: "inset(0% 0% 0% 0%)",
              opacity: 1,
              y: 0,
              duration: 1,
              ease: sectionEase,
            },
            0
          );
      }
    }

    initSectionContainerTransitions();

    /* ---------- Scroll parallax (scrubbed) ---------- */
    function initScrollParallax() {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const hero = document.getElementById("hero");
      if (hero) {
        const grid = hero.querySelector(".hero__grid");
        const circle = hero.querySelector(".hero__circle-text");
        const marquee = hero.querySelector(".hero__marquee");

        if (grid) {
          gsap.fromTo(
            grid,
            { y: 0 },
            {
              y: -28,
              ease: "none",
              scrollTrigger: {
                trigger: hero,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.65,
              },
            }
          );
        }
        if (circle) {
          gsap.fromTo(
            circle,
            { y: 0 },
            {
              y: 32,
              ease: "none",
              scrollTrigger: {
                trigger: hero,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.85,
              },
            }
          );
        }
        if (marquee) {
          gsap.fromTo(
            marquee,
            { y: 0 },
            {
              y: -12,
              ease: "none",
              scrollTrigger: {
                trigger: hero,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.45,
              },
            }
          );
        }
      }

    }

    initScrollParallax();
  }

  /* ---------- Section nav active ---------- */
  function setActiveNav(id) {
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("data-section") === id);
    });
  }

  if (typeof IntersectionObserver !== "undefined" && sections.length) {
    const obs = new IntersectionObserver(
      () => {
        const vh = window.innerHeight || document.documentElement.clientHeight || 0;
        const center = vh / 2;
        let bestId = null;
        let bestDist = Infinity;

        sections.forEach((s) => {
          const r = s.getBoundingClientRect();
          if (r.bottom <= 0 || r.top >= vh) return;
          const mid = r.top + r.height / 2;
          const dist = Math.abs(mid - center);
          if (dist < bestDist) {
            bestDist = dist;
            bestId = s.id;
          }
        });

        if (bestId) setActiveNav(bestId);
      },
      { rootMargin: "-25% 0px -25% 0px", threshold: [0, 0.15, 0.3, 0.5] }
    );
    sections.forEach((s) => obs.observe(s));
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const id = link.getAttribute("data-section");
      if (!id) return;
      setActiveNav(id);
    });
  });

  /* ---------- Stats counter ---------- */
  function animateStat(el) {
    const n = el.querySelector(".stat__n");
    if (!n || n.dataset.animated === "1") return;
    const target = parseInt(n.getAttribute("data-count"), 10);
    if (Number.isNaN(target)) return;
    n.dataset.animated = "1";
    if (typeof gsap === "undefined") {
      n.textContent = String(target);
      return;
    }
    const obj = { v: 0 };
    gsap.to(obj, {
      v: target,
      duration: 2,
      ease: "power2.out",
      onUpdate: () => {
        n.textContent = String(Math.round(obj.v));
      },
      onComplete: () => {
        n.textContent = String(target);
      },
    });
  }

  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    document.querySelectorAll(".stat").forEach((stat) => {
      ScrollTrigger.create({
        trigger: stat,
        start: "top 85%",
        once: true,
        onEnter: () => animateStat(stat),
      });
    });
  } else if (typeof IntersectionObserver !== "undefined") {
    document.querySelectorAll(".stat").forEach((stat) => {
      const io = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              animateStat(stat);
              obs.disconnect();
            }
          });
        },
        { threshold: 0.2 }
      );
      io.observe(stat);
    });
  }

  /* ---------- To top + progress ring ---------- */
  function updateToTop() {
    const doc = document.documentElement;
    const scrollTop = window.scrollY || doc.scrollTop;
    const max = doc.scrollHeight - window.innerHeight;
    const p = max > 0 ? scrollTop / max : 0;

    if (toTop) {
      toTop.classList.toggle("is-visible", scrollTop > 420);
    }
    if (progressCircle) {
      const offset = circumference * (1 - p);
      progressCircle.style.strokeDashoffset = String(offset);
    }
  }

  window.addEventListener("scroll", updateToTop, { passive: true });
  updateToTop();

  toTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- Custom pointer (desktop / fine pointer) ---------- */
  const pointer = document.getElementById("pointer");
  const pointerHalo = document.getElementById("pointerHalo");
  const prefersReduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const prefersFinePointer = window.matchMedia("(pointer: fine)").matches;

  if (pointer && !prefersReduceMotion && prefersFinePointer) {
    document.documentElement.classList.add("has-pointer");

    let active = false;
    let hovering = false;
    let pressing = false;
    let tx = -9999;
    let ty = -9999;
    let x = -9999;
    let y = -9999;
    let hx = -9999;
    let hy = -9999;
    let tick = 0;

    const setTransform =
      typeof gsap !== "undefined" ? gsap.quickSetter(pointer, "css") : (v) => (pointer.style.transform = v);

    function render() {
      const coreLerp = pressing ? 0.42 : hovering ? 0.32 : 0.24;
      const haloLerp = hovering ? 0.11 : 0.078;

      x += (tx - x) * coreLerp;
      y += (ty - y) * coreLerp;
      hx += (tx - hx) * haloLerp;
      hy += (ty - hy) * haloLerp;

      if (typeof gsap !== "undefined") {
        setTransform({ x, y });
      } else {
        setTransform(`translate3d(${x}px, ${y}px, 0)`);
      }

      if (pointerHalo) {
        const ox = hx - x;
        const oy = hy - y;
        pointerHalo.style.transform = `translate3d(${ox}px, ${oy}px, 0)`;
      }

      tick = window.requestAnimationFrame(render);
    }

    tick = window.requestAnimationFrame(render);

    function isSplashBlocking() {
      return Boolean(splash && !splash.classList.contains("is-done"));
    }

    function closestInteractive(target) {
      if (!(target instanceof Element)) return null;
      return target.closest(
        "a,button,[role='button'],summary,.btn,.nav__link,.mobile-menu-btn,.mobile-drawer__link,.mobile-drawer__close,.social-link,.contact__link,.theme-toggle,.to-top,.work-card,.cert-card,.cert-modal__close,.cert-modal__nav,.hero__portrait"
      );
    }

    function closestTextHost(target) {
      if (!(target instanceof Element)) return null;
      if (target.closest("summary")) return null;
      const host = target.closest(
        "p, h1, h2, h3, h4, h5, h6, li, blockquote, figcaption, .hero__kicker, .hero__roles, .hero__lead, .about__text, .work-card__title, .work-card__desc, .cert-card__title, .certificates__intro, .resume__prose, .resume__degree, .resume__job-title, .resume__job-meta, .resume__job-date, .resume__project-title, .contact__kicker, .contact__lead, .contact__msg, .contact__email, .footer__note, .footer__eyebrow"
      );
      if (!host) return null;
      if (host.classList.contains("hero__title")) return null;
      if (host.closest(".splash")) return null;
      if (host.closest(".pointer")) return null;
      if (host.closest(".section-title, .section-num, .hero__marquee, .footer__ticker, .section-ticker")) return null;
      const txt = host.textContent ? host.textContent.replace(/\s+/g, " ").trim() : "";
      if (!txt) return null;
      return host;
    }

    function setHover(on) {
      hovering = on;
      pointer.classList.toggle("is-hover", on);
    }

    window.addEventListener(
      "pointermove",
      (e) => {
        if (isSplashBlocking()) {
          active = false;
          pointer.classList.remove("is-on", "is-hover", "is-press", "is-circle-home");
          tx = ty = x = y = hx = hy = -9999;
          if (pointerHalo) pointerHalo.style.transform = "translate3d(0,0,0)";
          return;
        }
        if (!active) {
          active = true;
          pointer.classList.add("is-on");
          tx = hx = x = e.clientX;
          ty = hy = y = e.clientY;
        }
        tx = e.clientX;
        ty = e.clientY;

        const el = document.elementFromPoint(e.clientX, e.clientY);
        const interactive = closestInteractive(el);
        const textHost = closestTextHost(el);
        const isNav = Boolean(
          interactive &&
            ((interactive.closest(".nav--left") && interactive.classList.contains("nav__link")) ||
              interactive.classList.contains("mobile-drawer__link"))
        );
        pointer.classList.toggle("is-nav", isNav);
        const isCircleHome = Boolean(interactive?.classList?.contains("hero__circle-link"));
        pointer.classList.toggle("is-circle-home", isCircleHome);
        setHover(Boolean(interactive || textHost));
      },
      { passive: true }
    );

    window.addEventListener("pointerdown", () => {
      pressing = true;
      pointer.classList.add("is-press");
    });

    window.addEventListener("pointerup", () => {
      pressing = false;
      pointer.classList.remove("is-press");
    });

    document.documentElement.addEventListener("pointerleave", () => {
      pointer.classList.remove("is-nav", "is-circle-home");
      setHover(false);
    });

    window.addEventListener("blur", () => {
      active = false;
      pointer.classList.remove("is-on", "is-hover", "is-press", "is-circle-home");
      pointer.classList.remove("is-nav");
      tx = ty = x = y = hx = hy = -9999;
      if (pointerHalo) pointerHalo.style.transform = "translate3d(0,0,0)";
    });
  }

  /* ---------- Resume cards — 3D tilt on hover (fine pointer) ---------- */
  function initResumeCardTilt() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const section = document.getElementById("resume");
    if (!section) return;
    const cards = section.querySelectorAll(".resume-card:not(.resume-card--dropdown)");
    if (!cards.length) return;

    const MAX_RX = 8;
    const MAX_RY = 11;

    cards.forEach((card) => {
      if (typeof gsap !== "undefined") {
        gsap.set(card, { transformPerspective: 980, transformOrigin: "50% 50%" });
      }

      function tiltFromEvent(e) {
        const rect = card.getBoundingClientRect();
        const w = rect.width || 1;
        const h = rect.height || 1;
        const px = (e.clientX - rect.left) / w - 0.5;
        const py = (e.clientY - rect.top) / h - 0.5;
        const rx = -py * 2 * MAX_RX;
        const ry = px * 2 * MAX_RY;
        card.classList.add("is-tilt-active");
        if (typeof gsap !== "undefined") {
          gsap.set(card, { rotateX: rx, rotateY: ry });
        } else {
          card.style.transform = `perspective(980px) rotateX(${rx}deg) rotateY(${ry}deg)`;
        }
      }

      function resetTilt() {
        card.classList.remove("is-tilt-active");
        if (typeof gsap !== "undefined") {
          gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.65,
            ease: "elastic.out(1, 0.55)",
            overwrite: "auto",
          });
        } else {
          card.style.transform = "";
        }
      }

      card.addEventListener("pointerenter", tiltFromEvent);
      card.addEventListener("pointermove", tiltFromEvent);
      card.addEventListener("pointerleave", resetTilt);
    });
  }

  initResumeCardTilt();

  /* ---------- Resume — force file download (no inline PDF) ---------- */
  function initResumeCvDownload() {
    const link = document.querySelector(".resume__dl");
    if (!link) return;

    const pdfUrl = link.getAttribute("href");
    const fileName =
      link.getAttribute("data-download-name") ||
      link.getAttribute("download") ||
      "Pryzen-Resume.pdf";
    if (!pdfUrl) return;

    function triggerBlobDownload(blob) {
      const url = URL.createObjectURL(blob);
      const dl = document.createElement("a");
      dl.href = url;
      dl.download = fileName;
      dl.hidden = true;
      document.body.appendChild(dl);
      dl.click();
      dl.remove();
      URL.revokeObjectURL(url);
    }

    link.addEventListener("click", async (e) => {
      e.preventDefault();

      try {
        const res = await fetch(pdfUrl);
        if (!res.ok) throw new Error("fetch failed");
        const buffer = await res.arrayBuffer();
        const blob = new Blob([buffer], { type: "application/octet-stream" });
        triggerBlobDownload(blob);
      } catch {
        const dl = document.createElement("a");
        dl.href = pdfUrl;
        dl.download = fileName;
        dl.hidden = true;
        document.body.appendChild(dl);
        dl.click();
        dl.remove();
      }
    });
  }

  initResumeCvDownload();

  /* ---------- Works — Visit → View project (GSAP on card hover / focus) ---------- */
  function initWorkCardVisitLabelSwap() {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || typeof gsap === "undefined") return;

    document.querySelectorAll(".work-card").forEach((card) => {
      const visit = card.querySelector(".work-card__visit");
      const def = visit?.querySelector(".work-card__visit__text--default");
      const hov = visit?.querySelector(".work-card__visit__text--hover");
      if (!visit || !def || !hov) return;

      visit.classList.add("is-label-gsap");
      gsap.set(hov, { yPercent: 110, opacity: 0 });
      gsap.set(def, { yPercent: 0, opacity: 1 });

      const toProject = () => {
        gsap.killTweensOf([def, hov]);
        gsap
          .timeline({ defaults: { duration: 0.42, ease: "power3.out" } })
          .to(def, { yPercent: -110, opacity: 0 }, 0)
          .fromTo(hov, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1 }, 0);
      };

      const toVisit = () => {
        gsap.killTweensOf([def, hov]);
        gsap
          .timeline({ defaults: { duration: 0.34, ease: "power3.inOut" } })
          .to(hov, { yPercent: 110, opacity: 0 }, 0)
          .fromTo(def, { yPercent: -110, opacity: 0 }, { yPercent: 0, opacity: 1 }, 0);
      };

      function scheduleIdleLabel() {
        requestAnimationFrame(() => {
          if (!card.matches(":focus-within")) toVisit();
        });
      }

      card.addEventListener("pointerenter", toProject);
      card.addEventListener("pointerleave", scheduleIdleLabel);
      card.addEventListener("focusin", toProject);
      card.addEventListener("focusout", scheduleIdleLabel);
    });
  }

  initWorkCardVisitLabelSwap();
})();
