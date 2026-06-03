// Define DOM elements
const heroImage = document.querySelector("#hero__animation__img");

const tl = document.querySelector("#grid__tl");
const tr = document.querySelector("#grid__tr");
const bl = document.querySelector("#grid__bl");
const br = document.querySelector("#grid__br");

const tlBtn = document.querySelector("#grid__tl__btn");
const trBtn = document.querySelector("#grid__tr__btn");
const blBtn = document.querySelector("#grid__bl__btn");
const brBtn = document.querySelector("#grid__br__btn");

const tlContent = document.querySelector("#grid__tl__content");
const trContent = document.querySelector("#grid__tr__content");
const blContent = document.querySelector("#grid__bl__content");
const brContent = document.querySelector("#grid__br__content");

const projectOne = document.querySelector(".p-1");
const projectTwo = document.querySelector(".p-2");
const projectThree = document.querySelector(".p-3");
const projectFour = document.querySelector(".p-4");
const projectFive = document.querySelector(".p-5");
const projectSix = document.querySelector(".p-6");
const projectSeven = document.querySelector(".p-7");
const projectEight = document.querySelector(".p-8");

// Define colors and positions
const bgColor = "var(--bg)";
const bgColorAlt = "var(--bg-alt)";
const textColor = "var(--text)";
const textColorAlt = "var(--text-alt)";

let tlActive = "translateX(5vw) translateY(0)";
let tlHidden = "translateX(-100vw) translateY(-100vh)";

let trActive = "translateX(-5vw) translateY(0)";
let trHidden = "translateX(100vw) translateY(-100vh)";

let blActive = "translateX(10vw) translateY(7vh)";
let blHidden = "translateX(-100vw) translateY(100vh)";

let brActive = "translateX(-5vw) translateY(0)";
let brHidden = "translateX(100vw) translateY(100vh)";

// Define corner that is open
let activeCorner = "";

// Add an event listener to the window object to listen for resize events
window.addEventListener("resize", handleWindowResize);

const MOBILE_BREAK = 1100;

function isMobileViewport() {
  return window.innerWidth <= MOBILE_BREAK;
}

function setBodyPanelLock(locked) {
  document.body.classList.toggle("has-grid-panel-open", locked);
}

function applyMobileOverlay(content, btn, peers) {
  content.classList.add("grid-panel--mobile");
  content.style.transform = "translate(0, 0)";
  content.style.zIndex = "200";
  btn.style.zIndex = "300";
  peers.forEach((peer) => {
    peer.style.zIndex = "100";
  });
  setBodyPanelLock(true);
}

function resetDesktopPanel(content) {
  content.classList.remove("grid-panel--mobile");
  content.style.transform = "";
  content.style.zIndex = "";
}

function resetProjectWidths() {
  const projects = [projectOne, projectTwo, projectThree, projectFour, projectFive, projectSix, projectSeven, projectEight];
  projects.forEach((el) => {
    if (el) {
      el.style.width = "";
      el.style.margin = "";
    }
  });
}

const panelByCorner = {
  "top-left": tlContent,
  "top-right": trContent,
  "bottom-left": blContent,
  "bottom-right": brContent,
};

// Function that handles the styling when resizing window
function handleWindowResize() {
  const allBtns = [tlBtn, trBtn, blBtn, brBtn];
  const activePanel = panelByCorner[activeCorner];

  [tlContent, trContent, blContent, brContent].forEach((panel) => {
    if (panel && panel !== activePanel) {
      resetDesktopPanel(panel);
    }
  });

  if (!activeCorner) {
    setBodyPanelLock(false);
  }

  switch (activeCorner) {
    case "top-left":
      if (window.innerWidth <= 1100) {
        tlActive = "translateX(0) translateY(0)";
        applyMobileOverlay(tlContent, tlBtn, [trBtn, blBtn, brBtn]);
      } else {
        tlActive = "translateX(5vw) translateY(0)";
        resetDesktopPanel(tlContent);
        tlContent.style.transform = "translateX(5vw) translateY(0)";
      }
      break;

    case "top-right":
      if (window.innerWidth <= 1100) {
        trActive = "translateX(0) translateY(0)";
        applyMobileOverlay(trContent, trBtn, [tlBtn, blBtn, brBtn]);
      } else {
        trActive = "translateX(-5vw) translateY(0)";
        resetDesktopPanel(trContent);
        trContent.style.transform = "translateX(-5vw) translateY(0)";
      }
      break;

    case "bottom-left":
      if (window.innerWidth <= 1100) {
        blActive = "translateX(0) translateY(0)";
        applyMobileOverlay(blContent, blBtn, [tlBtn, trBtn, brBtn]);
        resetProjectWidths();
      } else {
        blActive = "translateX(10vw) translateY(7vh)";
        resetDesktopPanel(blContent);
        blContent.style.transform = "translateX(10vw) translateY(7vh)";
        resetProjectWidths();
      }
      break;

    case "bottom-right":
      if (window.innerWidth <= 1100) {
        brActive = "translateX(0) translateY(0)";
        applyMobileOverlay(brContent, brBtn, [tlBtn, trBtn, blBtn]);
      } else {
        brActive = "translateX(-5vw) translateY(0)";
        resetDesktopPanel(brContent);
        brContent.style.transform = "translateX(-5vw) translateY(0)";
      }
      break;

    default:
      allBtns.forEach((b) => {
        b.style.zIndex = "";
      });
      setBodyPanelLock(false);
  }
}

// Store last reverse animation, ready to be played
let lastReverseAnimation = "";

// Play animation function
function playAnimation(animation, reverseAnimation) {
  // Remove all the animation classes from heroImage
  heroImage.className = "";

  if (lastReverseAnimation !== "") {
    heroImage.classList.add(lastReverseAnimation);
    setTimeout(function () {
      heroImage.classList.remove(lastReverseAnimation);
      heroImage.classList.add(animation);
      lastReverseAnimation = reverseAnimation;
    }, 200);
  } else {
    heroImage.classList.add(animation);
    lastReverseAnimation = reverseAnimation;
  }
}

function playClosingAnimation(reverseAnimation) {
  tlBtn.innerHTML = "About";
  trBtn.innerHTML = "Experience";
  blBtn.innerHTML = "Works";
  brBtn.innerHTML = "Contact";

  switch (activeCorner) {
    case "top-left":
      tlBtn.style.background = bgColor;
      tlBtn.style.color = textColor;
      tlContent.style.transform = tlHidden;
      break;
    case "top-right":
      trBtn.style.background = bgColor;
      trBtn.style.color = textColor;
      trContent.style.transform = trHidden;
      break;
    case "bottom-left":
      blBtn.style.background = bgColor;
      blBtn.style.color = textColor;
      blContent.style.transform = blHidden;
      break;
    case "bottom-right":
      brBtn.style.background = bgColor;
      brBtn.style.color = textColor;
      brContent.style.transform = brHidden;
      break;

    default:
  }

  heroImage.className = "";
  lastReverseAnimation = "";
  activeCorner = "";
  [tlContent, trContent, blContent, brContent].forEach(resetDesktopPanel);
  setBodyPanelLock(false);
  heroImage.classList.add(reverseAnimation);
  setTimeout(function () {
    heroImage.classList.remove(reverseAnimation);
  }, 200);
}

// Onclick corner button functions
tlBtn.onclick = function () {
  if (activeCorner === "top-left") {
    playClosingAnimation("reverse-animate-top-left");
  } else {
    trBtn.innerHTML = "Experience";
    blBtn.innerHTML = "Works";
    brBtn.innerHTML = "Contact";

    // Setting activeCorner
    activeCorner = "top-left";
    tlBtn.innerHTML = "&uarr;<br/>About";

    handleWindowResize();
    playAnimation("animate-top-left", "reverse-animate-top-left");

    // Change background colors
    trBtn.style.background = bgColor;
    brBtn.style.background = bgColor;
    blBtn.style.background = bgColor;
    tlBtn.style.background = bgColorAlt;

    // Change text colors
    trBtn.style.color = textColor;
    brBtn.style.color = textColor;
    blBtn.style.color = textColor;
    tlBtn.style.color = textColorAlt;

    // Change positions of the corner content
    trContent.style.transform = trHidden;
    brContent.style.transform = brHidden;
    blContent.style.transform = blHidden;
    tlContent.style.transform = tlActive;
  }
};

trBtn.onclick = function () {
  if (activeCorner === "top-right") {
    playClosingAnimation("reverse-animate-top-right");
  } else {
    tlBtn.innerHTML = "About";
    blBtn.innerHTML = "Works";
    brBtn.innerHTML = "Contact";

    // Setting activeCorner
    activeCorner = "top-right";
    trBtn.innerHTML = "&uarr;<br/>Experience";

    handleWindowResize();
    playAnimation("animate-top-right", "reverse-animate-top-right");

    // Change background colors
    trBtn.style.background = bgColorAlt;
    brBtn.style.background = bgColor;
    blBtn.style.background = bgColor;
    tlBtn.style.background = bgColor;

    // Change text colors
    trBtn.style.color = textColorAlt;
    brBtn.style.color = textColor;
    blBtn.style.color = textColor;
    tlBtn.style.color = textColor;

    // Change positions of the corner content
    trContent.style.transform = trActive;
    brContent.style.transform = brHidden;
    blContent.style.transform = blHidden;
    tlContent.style.transform = tlHidden;
  }
};

blBtn.onclick = function () {
  if (activeCorner === "bottom-left") {
    playClosingAnimation("reverse-animate-bottom-left");
  } else {
    tlBtn.innerHTML = "About";
    trBtn.innerHTML = "Experience";
    brBtn.innerHTML = "Contact";

    // Setting activeCorner
    activeCorner = "bottom-left";
    blBtn.innerHTML = "Works<br/>&darr;";
  

    handleWindowResize();
    playAnimation("animate-bottom-left", "reverse-animate-bottom-left");

    // Change background colors
    trBtn.style.background = bgColor;
    brBtn.style.background = bgColor;
    blBtn.style.background = bgColorAlt;
    tlBtn.style.background = bgColor;

    // Change text colors
    trBtn.style.color = textColor;
    brBtn.style.color = textColor;
    blBtn.style.color = textColorAlt;
    tlBtn.style.color = textColor;

    // Change positions of the corner content
    trContent.style.transform = trHidden;
    brContent.style.transform = brHidden;
    blContent.style.transform = blActive;
    tlContent.style.transform = tlHidden;
  }
};

brBtn.onclick = function () {
  if (activeCorner === "bottom-right") {
    playClosingAnimation("reverse-animate-bottom-right");
  } else {
    tlBtn.innerHTML = "About";
    trBtn.innerHTML = "Experience";
    blBtn.innerHTML = "Works";

    // Setting activeCorner
    activeCorner = "bottom-right";
    brBtn.innerHTML = "Contact<br/>&darr;";

    handleWindowResize();
    playAnimation("animate-bottom-right", "reverse-animate-bottom-right");

    // Change background colors
    trBtn.style.background = bgColor;
    brBtn.style.background = bgColorAlt;
    blBtn.style.background = bgColor;
    tlBtn.style.background = bgColor;

    // Change text colors
    trBtn.style.color = textColor;
    brBtn.style.color = textColorAlt;
    blBtn.style.color = textColor;
    tlBtn.style.color = textColor;

    // Change positions of the corner content
    trContent.style.transform = trHidden;
    brContent.style.transform = brActive;
    blContent.style.transform = blHidden;
    tlContent.style.transform = tlHidden;
  }
};

 var cursor = document.querySelector(".cursor");
    var cursor2 = document.querySelector(".cursor2");
    document.addEventListener("mousemove",function(e){
      cursor.style.cssText = cursor2.style.cssText = "left: " + e.clientX + "px; top: " + e.clientY + "px;";
    });
