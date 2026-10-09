/* ====================================================================
   Vibe College — app.js  (Full site version)
   ==================================================================== */

/* ─── Campus Places ───────────────────────────────────────────────── */
const places = [
  { name:"The Old Library",    nearby:["North Quad","The Galley Café","Founders Hall","Arts Dock"],       directions:"Head past North Quad and follow the story-shaped trail.",               pollyQuip:"Arr, the Old Library! Where every book be a voyage!"        },
  { name:"Founders Hall",      nearby:["The Old Library","North Quad","Harbour Gardens","Arts Dock"],     directions:"Follow the dotted path from the Old Library toward the heart of campus.", pollyQuip:"Founders Hall! Built by brave souls, just like ye!"         },
  { name:"The Galley Café",    nearby:["North Quad","The Old Library","Harbour Gardens","Founders Hall"], directions:"Take the sunny path beside North Quad. The good smells will guide ye.",   pollyQuip:"The Galley! Me favourite port! Best grub on the isle!"      },
  { name:"Arts Dock",          nearby:["Founders Hall","Harbour Gardens","The Old Library","North Quad"], directions:"Sail south past Founders Hall; look for creativity on the shore.",        pollyQuip:"Arts Dock! Where imagination sets sail every mornin'!"     },
  { name:"Harbour Gardens",    nearby:["The Galley Café","Arts Dock","Founders Hall","North Quad"],       directions:"Follow the green stretch between the Galley and Arts Dock.",             pollyQuip:"Harbour Gardens! Even pirates need a peaceful shore, arrr!" },
  { name:"North Quad",         nearby:["The Old Library","The Galley Café","Founders Hall","Harbour Gardens"], directions:"You're nearly there. The Library and Galley are just a short stroll away.", pollyQuip:"North Quad! The beating heart of our fine vessel!"     },
];

/* ─── Learning Routes ─────────────────────────────────────────────── */
const learningRoutes = [
  { keywords:["library","book","read","research","study","essay","writing"],                         title:"Research & storytelling",   description:"Turn good questions into clear, compelling ideas.",              href:"#courses"    },
  { keywords:["science","technology","tech","coding","computer","math","data","engineering"],         title:"Science & technology",      description:"Explore how to build, test, and improve what comes next.",        href:"#courses"    },
  { keywords:["art","arts","design","creative","humanities","history","music"],                       title:"Arts & humanities",         description:"Follow your curiosity through culture, craft, and big questions.", href:"#courses"    },
  { keywords:["business","lead","leadership","career","entrepreneur","finance"],                      title:"Business & leadership",     description:"Find ways to turn thoughtful ideas into real-world impact.",      href:"#courses"    },
  { keywords:["cafe","café","food","club","event","crew","friends","life"],                           title:"Find your crew",            description:"See what's happening beyond the classroom.",                      href:"#events"     },
  { keywords:["campus","library","hall","quad","garden","map","dock"],                               title:"Explore the campus",        description:"Ask Polly for a map and find your next destination.",             href:"#locator"    },
  { keywords:["apply","admission","admissions","enrol","enroll","join","fee","scholarship"],          title:"Crew Quarters — Admissions",description:"Everything you need to come aboard Vibe College.",                href:"#admissions" },
  { keywords:["placement","job","salary","recruiter","package","career"],                            title:"The Bounty Board",          description:"See where our graduates have landed.",                            href:"#placements" },
  { keywords:["alumni","graduate","legend","hall"],                                                  title:"Hall of Legends",           description:"Meet the finest crew to ever sail these seas.",                   href:"#alumni"     },
  { keywords:["portal","student","marks","attendance","timetable","fees"],                           title:"Navigator's Log",           description:"Log in to your student dashboard.",                               href:"#portal"     },
];
const compassDefaults = [
  { title:"Apply now",              description:"Join the crew — admissions open.",             href:"#admissions" },
  { title:"Explore courses",        description:"Browse arts, science and leadership paths.",   href:"#courses"    },
  { title:"See placement stats",    description:"Where our graduates are sailing.",             href:"#placements" },
];

/* ─── DOM Refs ────────────────────────────────────────────────────── */
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => [...ctx.querySelectorAll(sel)];

const form               = $("#destination-form");
const destinationInput   = $("#destination");
const datalist           = $("#campus-places");
const mapEl              = $("#treasure-map");
const emptyState         = $("#treasure-empty");
const errorMessage       = $("#search-error");
const copyButton         = $("#copy-directions");
const directions         = $("#map-directions");
const menuButton         = $(".menu-toggle");
const nav                = $(".main-nav");
const compassToggle      = $(".compass-toggle");
const compassPanel       = $("#learning-compass");
const compassClose       = $(".compass-close");
const compassSearch      = $("#compass-search");
const compassHint        = $("#compass-hint");
const compassRecs        = $("#compass-recommendations");
const pollyText          = $("#polly-text");
const siteHeader         = $("#site-header");
const backToTop          = $("#back-to-top");
const announcementClose  = $("#announcement-close");
const announcementBar    = $("#announcement-bar");
const cookieNotice       = $("#cookie-notice");
const cookieAccept       = $("#cookie-accept");

let revealTimer;

/* ═══════════════════════════════════════════════════════════════════
   CAMPUS MAP
═══════════════════════════════════════════════════════════════════ */
for (const place of places) {
  const opt = document.createElement("option");
  opt.value = place.name;
  datalist.append(opt);
}

function renderLearningRoutes(searchTerm = "") {
  const q = searchTerm.trim().toLocaleLowerCase();
  const matched = q
    ? learningRoutes.filter(r => r.keywords.some(k => q.includes(k) || (q.length >= 3 && k.includes(q))))
    : [];
  const recs = q ? (matched.length ? matched.slice(0,3) : compassDefaults) : compassDefaults;
  compassRecs.replaceChildren();
  for (const r of recs) {
    const a = document.createElement("a");
    a.className = "compass-recommendation";
    a.href = r.href;
    const txt = document.createElement("span");
    const strong = document.createElement("strong");
    strong.textContent = r.title;
    const small = document.createElement("small");
    small.textContent = r.description;
    txt.append(strong, small);
    const arrow = document.createElement("span");
    arrow.setAttribute("aria-hidden","true");
    arrow.textContent = "↗";
    a.append(txt, arrow);
    compassRecs.append(a);
  }
  compassHint.textContent = q && !matched.length
    ? "No exact bearing yet—here are a few good places to start."
    : q ? "Based on your search, these could be your next stops."
        : "A few good next steps, picked for your search.";
}

function openCompass() {
  if (!compassSearch.value.trim() || compassSearch.dataset.source === "destination") {
    compassSearch.value = destinationInput.value;
    compassSearch.dataset.source = destinationInput.value ? "destination" : "";
  }
  renderLearningRoutes(compassSearch.value);
  compassPanel.hidden = false;
  compassToggle.setAttribute("aria-expanded","true");
}
function closeCompass() {
  compassPanel.hidden = true;
  compassToggle.setAttribute("aria-expanded","false");
}

function revealTreasure(destination) {
  const norm = destination.trim().toLocaleLowerCase();
  const place = places.find(e => e.name.toLocaleLowerCase() === norm);
  if (!place) {
    errorMessage.textContent = "Polly can't find that port yet. Try one of the nearby places below.";
    destinationInput.setAttribute("aria-invalid","true");
    if (pollyText) pollyText.textContent = `"Arrr, that port be off me map! Try another!"`;
    return;
  }
  if (pollyText) pollyText.textContent = `"${place.pollyQuip}"`;
  errorMessage.textContent = "";
  destinationInput.removeAttribute("aria-invalid");
  $("#map-destination").textContent = place.name;
  $("#map-caption-title").textContent = place.name;
  directions.textContent = place.directions;
  place.nearby.forEach((name,i) => {
    $(`#nearby-${["one","two","three","four"][i]} b`).textContent = name;
  });
  window.clearTimeout(revealTimer);
  emptyState.classList.remove("is-hidden");
  emptyState.classList.add("bottle-opening");
  mapEl.classList.add("is-hidden");
  revealTimer = window.setTimeout(() => {
    emptyState.classList.remove("bottle-opening");
    emptyState.classList.add("is-hidden");
    mapEl.classList.remove("is-hidden");
    mapEl.classList.remove("treasure-map");
    void mapEl.offsetWidth;
    mapEl.classList.add("treasure-map");
  }, 520);
  copyButton.textContent = "⧉";
  copyButton.setAttribute("aria-label","Copy directions");
}

form?.addEventListener("submit", e => { e.preventDefault(); revealTreasure(destinationInput.value); });
$$("[data-destination]").forEach(btn => btn.addEventListener("click", () => {
  destinationInput.value = btn.dataset.destination;
  revealTreasure(btn.dataset.destination);
}));

compassToggle?.addEventListener("click", () => compassPanel.hidden ? (openCompass(), compassSearch.focus()) : closeCompass());
compassClose?.addEventListener("click", closeCompass);
compassSearch?.addEventListener("input", () => { compassSearch.dataset.source = "compass"; renderLearningRoutes(compassSearch.value); });
destinationInput?.addEventListener("input", () => {
  compassSearch.value = destinationInput.value;
  compassSearch.dataset.source = destinationInput.value ? "destination" : "";
  renderLearningRoutes(compassSearch.value);
});
document.addEventListener("click", e => {
  if (!compassPanel?.hidden && !compassPanel.contains(e.target) && !compassToggle.contains(e.target)) closeCompass();
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && !compassPanel?.hidden) { closeCompass(); compassToggle.focus(); }
});
copyButton?.addEventListener("click", async () => {
  const dest = $("#map-caption-title").textContent;
  const text = `${dest}: ${directions.textContent}`;
  try {
    await navigator.clipboard.writeText(text);
    copyButton.textContent = "✓";
    copyButton.setAttribute("aria-label","Directions copied");
    setTimeout(() => { copyButton.textContent = "⧉"; copyButton.setAttribute("aria-label","Copy directions"); }, 2000);
  } catch { copyButton.textContent = "!"; }
});

/* ═══════════════════════════════════════════════════════════════════
   MOBILE NAV
═══════════════════════════════════════════════════════════════════ */
menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  nav.classList.toggle("is-open", !isOpen);
});
$$(".main-nav a").forEach(link => link.addEventListener("click", () => {
  closeCompass();
  menuButton.setAttribute("aria-expanded","false");
  menuButton.setAttribute("aria-label","Open navigation");
  nav.classList.remove("is-open");
}));

/* ═══════════════════════════════════════════════════════════════════
   STICKY HEADER
═══════════════════════════════════════════════════════════════════ */
const heroEl = $(".hero");
if (heroEl) {
  new IntersectionObserver(([e]) => siteHeader.classList.toggle("scrolled", !e.isIntersecting), { rootMargin:"-80px 0px 0px 0px" }).observe(heroEl);
}

/* ═══════════════════════════════════════════════════════════════════
   BACK TO TOP
═══════════════════════════════════════════════════════════════════ */
window.addEventListener("scroll", () => { backToTop.hidden = window.scrollY < 500; }, {passive:true});
backToTop?.addEventListener("click", () => window.scrollTo({top:0,behavior:"smooth"}));

/* ═══════════════════════════════════════════════════════════════════
   ANNOUNCEMENT DISMISS
═══════════════════════════════════════════════════════════════════ */
announcementClose?.addEventListener("click", () => {
  announcementBar.style.maxHeight = announcementBar.offsetHeight + "px";
  requestAnimationFrame(() => {
    announcementBar.style.transition = "max-height .35s ease, opacity .3s ease";
    announcementBar.style.maxHeight = "0";
    announcementBar.style.opacity = "0";
    announcementBar.style.overflow = "hidden";
  });
  setTimeout(() => announcementBar.remove(), 360);
});

/* ═══════════════════════════════════════════════════════════════════
   COOKIE NOTICE
═══════════════════════════════════════════════════════════════════ */
if (cookieNotice && cookieAccept) {
  if (!localStorage.getItem("vc_cookie_ok")) {
    setTimeout(() => cookieNotice.classList.add("show"), 1500);
  } else {
    cookieNotice.remove();
  }
  cookieAccept.addEventListener("click", () => {
    localStorage.setItem("vc_cookie_ok","1");
    cookieNotice.classList.remove("show");
    setTimeout(() => cookieNotice.remove(), 400);
  });
}

/* ═══════════════════════════════════════════════════════════════════
   ANIMATED STAT COUNTERS
═══════════════════════════════════════════════════════════════════ */
function animateCount(el, target, duration=1600) {
  const ease = t => t < .5 ? 2*t*t : -1+(4-2*t)*t;
  let start;
  function step(ts) {
    if (!start) start = ts;
    const p = Math.min((ts - start)/duration, 1);
    el.textContent = Math.round(ease(p)*target).toLocaleString();
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString();
  }
  requestAnimationFrame(step);
}
const statObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { animateCount(e.target, +e.target.dataset.target); statObs.unobserve(e.target); } });
}, {threshold:.4});
$$(".stat-number[data-target]").forEach(el => statObs.observe(el));

/* ═══════════════════════════════════════════════════════════════════
   SCROLL REVEAL
═══════════════════════════════════════════════════════════════════ */
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); revObs.unobserve(e.target); } });
}, {threshold:.1, rootMargin:"0px 0px -40px 0px"});
function addReveal(el, delay=0) {
  el.classList.add("reveal");
  if (delay) el.style.transitionDelay = delay + "s";
  revObs.observe(el);
}

/* ═══════════════════════════════════════════════════════════════════
   COURSE TABS
═══════════════════════════════════════════════════════════════════ */
const ctabs = $$(".ctab");
const ctabContents = $$(".ctab-content");
ctabs.forEach(btn => {
  btn.addEventListener("click", () => {
    ctabs.forEach(b => { b.classList.remove("active"); b.setAttribute("aria-selected","false"); });
    ctabContents.forEach(c => c.classList.add("hidden"));
    btn.classList.add("active");
    btn.setAttribute("aria-selected","true");
    const target = document.getElementById("tab-" + btn.dataset.tab);
    if (target) {
      target.classList.remove("hidden");
      // Reveal cards in newly shown tab
      $$(".course-card, .rs-card, .ra-item", target).forEach((el, i) => addReveal(el, i * 0.08));
    }
  });
});

/* ═══════════════════════════════════════════════════════════════════
   FAQ ACCORDION
═══════════════════════════════════════════════════════════════════ */
$$(".faq-q").forEach(btn => {
  btn.addEventListener("click", () => {
    const item = btn.closest(".faq-item");
    const isOpen = item.classList.contains("open");
    // Close all
    $$(".faq-item.open").forEach(i => {
      i.classList.remove("open");
      i.querySelector(".faq-q").setAttribute("aria-expanded","false");
    });
    // Open clicked (if was closed)
    if (!isOpen) {
      item.classList.add("open");
      btn.setAttribute("aria-expanded","true");
    }
  });
});

/* ═══════════════════════════════════════════════════════════════════
   BAR CHART REVEAL
═══════════════════════════════════════════════════════════════════ */
const chartObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      $$(".bar", e.target).forEach(bar => {
        bar.style.setProperty("--h-anim", bar.style.getPropertyValue("--h") || "0%");
        bar.classList.add("bar-animate");
      });
      chartObs.unobserve(e.target);
    }
  });
}, {threshold:.3});
const barChartEl = $(".bar-chart");
if (barChartEl) chartObs.observe(barChartEl);

/* ═══════════════════════════════════════════════════════════════════
   APPLICATION FORM
═══════════════════════════════════════════════════════════════════ */
const applicationForm = $("#application-form");
const formSuccess = $("#form-success");
applicationForm?.addEventListener("submit", e => {
  e.preventDefault();
  const name = $("#app-name").value.trim();
  if (!name) { $("#app-name").focus(); return; }
  applicationForm.style.opacity = ".5";
  applicationForm.style.pointerEvents = "none";
  setTimeout(() => {
    applicationForm.style.opacity = "1";
    applicationForm.style.pointerEvents = "";
    applicationForm.reset();
    if (formSuccess) { formSuccess.hidden = false; }
  }, 800);
});

/* ═══════════════════════════════════════════════════════════════════
   CONTACT FORM
═══════════════════════════════════════════════════════════════════ */
const contactForm = $("#contact-form");
const contactSuccess = $("#contact-success");
contactForm?.addEventListener("submit", e => {
  e.preventDefault();
  setTimeout(() => {
    contactForm.reset();
    if (contactSuccess) contactSuccess.hidden = false;
  }, 600);
});

/* ═══════════════════════════════════════════════════════════════════
   MESSAGE IN A BOTTLE
═══════════════════════════════════════════════════════════════════ */
const mibForm   = $("#mib-form");
const mibReply  = $("#mib-reply");
const mibReplyText = $("#mib-reply-text");

mibForm?.addEventListener("submit", e => {
  e.preventDefault();
  const q = $("#mib-question").value.trim();
  if (!q) return;
  const btn = mibForm.querySelector("button[type=submit]");
  btn.textContent = "Sending... 🌊";
  btn.disabled = true;
  setTimeout(() => {
    if (mibReply) mibReply.hidden = false;
    if (mibReplyText) mibReplyText.textContent =
      `We've received your question: "${q.slice(0,60)}${q.length>60?"...":""}". Our admissions crew will send a full reply to your email within 48 hours. Fair winds! ⚓`;
    mibForm.reset();
    btn.textContent = "Send the Bottle 🌊";
    btn.disabled = false;
  }, 1000);
});

$$(".cq-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    if (mibReply) mibReply.hidden = false;
    if (mibReplyText) mibReplyText.textContent = btn.dataset.reply;
  });
});

/* ═══════════════════════════════════════════════════════════════════
   STUDENT PORTAL
═══════════════════════════════════════════════════════════════════ */
const loginForm      = $("#login-form");
const portalLogin    = $("#portal-login");
const portalDashboard = $("#portal-dashboard");
const dashLogout     = $("#dash-logout");
const dashStudentName = $("#dash-student-name");
const dashRoll       = $("#dash-roll");

loginForm?.addEventListener("submit", e => {
  e.preventDefault();
  const roll  = $("#roll-no").value.trim() || "VC2022CS001";
  const btn   = loginForm.querySelector("button[type=submit]");
  btn.textContent = "Boarding...";
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = "Board the Ship →";
    btn.disabled = false;
    // Show dashboard
    portalLogin.classList.add("hidden");
    portalDashboard.classList.remove("hidden");
    if (dashRoll) dashRoll.textContent = "Roll No: " + roll.toUpperCase();
    // Animate attendance ring
    animateRing();
  }, 700);
});

dashLogout?.addEventListener("click", () => {
  portalDashboard.classList.add("hidden");
  portalLogin.classList.remove("hidden");
  loginForm.reset();
});

function animateRing() {
  const fill = $(".ring-fill");
  if (!fill) return;
  const pct = 82;
  const r = 30;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct / 100;
  fill.style.strokeDasharray = `${dash} ${circ}`;
  fill.style.transition = "stroke-dasharray 1.2s ease";
}

/* ═══════════════════════════════════════════════════════════════════
   NEWSLETTER FORM
═══════════════════════════════════════════════════════════════════ */
const nlForm = $("#newsletter-form");
nlForm?.addEventListener("submit", e => {
  e.preventDefault();
  const inp = nlForm.querySelector("input");
  if (!inp.value.trim()) return;
  const btn = nlForm.querySelector("button");
  btn.textContent = "✓";
  btn.style.background = "#4a9b6f";
  inp.disabled = true;
  inp.value = "You're on the crew list!";
  setTimeout(() => { btn.textContent = "→"; btn.style.background = ""; inp.disabled = false; inp.value = ""; }, 3000);
});

/* ═══════════════════════════════════════════════════════════════════
   ACTIVE NAV HIGHLIGHT ON SCROLL
═══════════════════════════════════════════════════════════════════ */
const navLinks = $$(".main-nav a[href^='#']");
const allSections = $$("section[id], div[id='apply-form']");

const navObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => {
        const active = l.getAttribute("href") === `#${e.target.id}`;
        l.style.color = active ? "var(--gold)" : "";
      });
    }
  });
}, {rootMargin:"-35% 0px -55% 0px"});
allSections.forEach(s => navObs.observe(s));

/* ═══════════════════════════════════════════════════════════════════
   INIT SCROLL REVEALS ON LOAD
═══════════════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  // Stagger section content
  [".stat-item", ".adm-card", ".course-card", ".faculty-card",
   ".ps-card", ".story-card", ".wanted-poster", ".club-card",
   ".ra-item", ".rs-card", ".contact-card"
  ].forEach(sel => {
    $$(sel).forEach((el, i) => addReveal(el, i * 0.07));
  });

  // Single reveals
  [".section-heading", ".about-left", ".about-right",
   ".principal-card", ".history-timeline", ".fee-section",
   ".apply-form-box", ".faq-box", ".year-chart-section",
   ".recruiter-section", ".alumni-cta-strip", ".code-scroll",
   ".mib-left", ".mib-right", ".compliance-box"
  ].forEach(sel => {
    $$(sel).forEach(el => addReveal(el));
  });
});
