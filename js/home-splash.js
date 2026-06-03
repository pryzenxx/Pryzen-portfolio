(function () {
  "use strict";

  const splash = document.getElementById("splash");
  const splashType = document.getElementById("splashType");
  const splashCursor = document.getElementById("splashCursor");
  const SPLASH_WORD = "PRYZEN";
  const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const splashStage = document.getElementById("splashStage");
  const splashCurtain = document.getElementById("splashCurtain");
  const splashPct = document.getElementById("splashPct");
  const splashLayerDark = document.getElementById("splashLayerDark");
  const splashLayerLight = document.getElementById("splashLayerLight");
  const splashSweepBand = document.getElementById("splashSweepBand");

  function introHero() {
    const heroReveals = document.querySelectorAll("#hero .reveal");
    if (!heroReveals.length) return;
    if (typeof gsap === "undefined") {
      heroReveals.forEach((el) => {
        el.classList.add("is-inview");
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      return;
    }
    gsap.fromTo(
      heroReveals,
      { opacity: 0, y: 40, filter: "blur(14px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.9,
        stagger: 0.085,
        ease: "power4.out",
        onComplete: () => {
          heroReveals.forEach((el) => el.classList.add("is-inview"));
          gsap.set(heroReveals, { clearProps: "opacity,transform,filter" });
        },
      }
    );
  }

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

  runSplash();
})();
