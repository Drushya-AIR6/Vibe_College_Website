const places = [
  {
    name: "The Old Library",
    nearby: ["North Quad", "The Galley Café", "Founders Hall", "Arts Dock"],
    directions: "Head past North Quad and follow the story-shaped trail.",
  },
  {
    name: "Founders Hall",
    nearby: ["The Old Library", "North Quad", "Harbour Gardens", "Arts Dock"],
    directions: "Follow the dotted path from the Old Library toward the heart of campus.",
  },
  {
    name: "The Galley Café",
    nearby: ["North Quad", "The Old Library", "Harbour Gardens", "Founders Hall"],
    directions: "Take the sunny path beside North Quad. The good smells will guide ye.",
  },
  {
    name: "Arts Dock",
    nearby: ["Founders Hall", "Harbour Gardens", "The Old Library", "North Quad"],
    directions: "Sail south past Founders Hall; look for creativity on the shore.",
  },
  {
    name: "Harbour Gardens",
    nearby: ["The Galley Café", "Arts Dock", "Founders Hall", "North Quad"],
    directions: "Follow the green stretch between the Galley and Arts Dock.",
  },
  {
    name: "North Quad",
    nearby: ["The Old Library", "The Galley Café", "Founders Hall", "Harbour Gardens"],
    directions: "You’re nearly there. The Old Library and Galley are just a short stroll away.",
  },
];

const form = document.querySelector("#destination-form");
const destinationInput = document.querySelector("#destination");
const datalist = document.querySelector("#campus-places");
const map = document.querySelector("#treasure-map");
const emptyState = document.querySelector("#treasure-empty");
const errorMessage = document.querySelector("#search-error");
const copyButton = document.querySelector("#copy-directions");
const directions = document.querySelector("#map-directions");
const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");
const compassToggle = document.querySelector(".compass-toggle");
const compassPanel = document.querySelector("#learning-compass");
const compassClose = document.querySelector(".compass-close");
const compassSearch = document.querySelector("#compass-search");
const compassHint = document.querySelector("#compass-hint");
const compassRecommendations = document.querySelector("#compass-recommendations");
let revealTimer;

const learningRoutes = [
  {
    keywords: ["library", "book", "read", "research", "study", "essay", "writing"],
    title: "Research & storytelling",
    description: "Turn good questions into clear, compelling ideas.",
    href: "#courses",
  },
  {
    keywords: ["science", "technology", "tech", "coding", "computer", "math", "data", "engineering"],
    title: "Science & technology",
    description: "Explore how to build, test, and improve what comes next.",
    href: "#courses",
  },
  {
    keywords: ["art", "arts", "design", "creative", "humanities", "history", "music"],
    title: "Arts & humanities",
    description: "Follow your curiosity through culture, craft, and big questions.",
    href: "#courses",
  },
  {
    keywords: ["business", "lead", "leadership", "career", "entrepreneur", "finance"],
    title: "Business & leadership",
    description: "Find ways to turn thoughtful ideas into real-world impact.",
    href: "#courses",
  },
  {
    keywords: ["fee", "fees", "calculator", "tuition", "cost", "doubloon", "scholarship", "dates", "schedule", "admissions", "apply", "enrol", "enroll"],
    title: "Crew Quarters & Fee Calculator",
    description: "Calculate doubloons, check deadlines, and assemble your dossier.",
    href: "#admissions",
  },
  {
    keywords: ["placement", "placements", "job", "jobs", "salary", "package", "bounty", "recruiters", "companies", "career", "hiring"],
    title: "The Bounty Board (Placements)",
    description: "Explore ₹48.5 LPA top bounties and 180+ global allied fleets.",
    href: "#placements",
  },
  {
    keywords: ["portal", "student", "login", "grades", "marks", "attendance", "timetable", "transcript", "receipt", "shipmate"],
    title: "The Shipmate Deck (Student Portal)",
    description: "Check sea-readiness attendance, marks, duty timetable, and receipts.",
    href: "#portal-modal",
  },
  {
    keywords: ["alumni", "legend", "legends", "wanted", "graduates", "success", "posters", "roy", "malhotra", "vance"],
    title: "Hall of Legends (Alumni Wanted Board)",
    description: "Meet illustrious privateers who conquered global oceans.",
    href: "#legends",
  },
  {
    keywords: ["contact", "bottle", "enquiry", "message", "question", "phone", "email", "whatsapp", "help", "signal"],
    title: "Message in a Bottle (Contact)",
    description: "Cast an inquiry into the tide for our harbor watch.",
    href: "#bottle-enquiry",
  },
  {
    keywords: ["rules", "code", "ragging", "anti-ragging", "grievance", "complaint", "health", "counselor", "regulations", "aicte", "naac", "disclosures"],
    title: "The Pirate Code & Charters",
    description: "Honor, safety, zero-ragging helpline, and statutory governance.",
    href: "#ship-code",
  },
  {
    keywords: ["captain", "principal", "chancellor", "sterling", "vision", "leadership", "head"],
    title: "Captain's Quarters (Principal)",
    description: "High Admiral Sterling's address to the bold and curious.",
    href: "#captain",
  },
  {
    keywords: ["cafe", "café", "food", "club", "event", "crew", "friends", "life", "regatta"],
    title: "Life with the Crew",
    description: "Discover events, lantern nights, and pirate regattas.",
    href: "#events",
  },
  {
    keywords: ["campus", "library", "hall", "quad", "garden", "map", "dock", "polly", "treasure"],
    title: "Campus Treasure Map",
    description: "Ask Captain Polly for a map and chart your coordinates.",
    href: "#locator",
  },
];

const compassDefaults = [
  {
    title: "Explore a course",
    description: "Browse arts, science, and leadership paths.",
    href: "#courses",
  },
  {
    title: "Find a campus landmark",
    description: "Let Captain Polly chart a route for you.",
    href: "#locator",
  },
  {
    title: "See what’s on deck",
    description: "Discover events and life with the crew.",
    href: "#events",
  },
];

for (const place of places) {
  const option = document.createElement("option");
  option.value = place.name;
  datalist.append(option);
}

function renderLearningRoutes(searchTerm = "") {
  const query = searchTerm.trim().toLocaleLowerCase();
  const matchingRoutes = query
    ? learningRoutes.filter((route) =>
        route.keywords.some((keyword) => query.includes(keyword) || (query.length >= 3 && keyword.includes(query))),
      )
    : [];
  const recommendations = query
    ? matchingRoutes.length
      ? matchingRoutes.slice(0, 3)
      : compassDefaults
    : compassDefaults;

  compassRecommendations.replaceChildren();
  for (const recommendation of recommendations) {
    const link = document.createElement("a");
    link.className = "compass-recommendation";
    link.href = recommendation.href;

    const text = document.createElement("span");
    const title = document.createElement("strong");
    title.textContent = recommendation.title;
    const description = document.createElement("small");
    description.textContent = recommendation.description;
    text.append(title, description);

    const arrow = document.createElement("span");
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "↗";
    link.append(text, arrow);
    compassRecommendations.append(link);
  }

  compassHint.textContent = query && !matchingRoutes.length
    ? "No exact bearing yet—here are a few good places to start."
    : query
      ? "Based on your search, these could be your next stops."
      : "A few good next steps, picked for your search.";
}

function openLearningCompass() {
  if (!compassSearch.value.trim() || compassSearch.dataset.source === "destination") {
    compassSearch.value = destinationInput.value;
    compassSearch.dataset.source = destinationInput.value ? "destination" : "";
  }
  renderLearningRoutes(compassSearch.value);
  compassPanel.hidden = false;
  compassToggle.setAttribute("aria-expanded", "true");
}

function closeLearningCompass() {
  compassPanel.hidden = true;
  compassToggle.setAttribute("aria-expanded", "false");
}

function revealTreasure(destination) {
  const normalizedDestination = destination.trim().toLocaleLowerCase();
  const place = places.find((entry) => entry.name.toLocaleLowerCase() === normalizedDestination);

  if (!place) {
    errorMessage.textContent = "Polly can’t find that port yet. Try one of the nearby places below.";
    destinationInput.setAttribute("aria-invalid", "true");
    return;
  }

  errorMessage.textContent = "";
  destinationInput.removeAttribute("aria-invalid");
  document.querySelector("#map-destination").textContent = place.name;
  document.querySelector("#map-caption-title").textContent = place.name;
  directions.textContent = place.directions;
  place.nearby.forEach((name, index) => {
    document.querySelector(`#nearby-${["one", "two", "three", "four"][index]} b`).textContent = name;
  });
  window.clearTimeout(revealTimer);
  emptyState.classList.remove("is-hidden");
  emptyState.classList.add("bottle-opening");
  map.classList.add("is-hidden");
  revealTimer = window.setTimeout(() => {
    emptyState.classList.remove("bottle-opening");
    emptyState.classList.add("is-hidden");
    map.classList.remove("is-hidden");
    map.classList.remove("treasure-map");
    void map.offsetWidth;
    map.classList.add("treasure-map");
  }, 520);
  copyButton.textContent = "⧉";
  copyButton.setAttribute("aria-label", "Copy directions");
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  revealTreasure(destinationInput.value);
});

document.querySelectorAll("[data-destination]").forEach((button) => {
  button.addEventListener("click", () => {
    const destination = button.dataset.destination;
    destinationInput.value = destination;
    revealTreasure(destination);
  });
});

compassToggle.addEventListener("click", () => {
  if (compassPanel.hidden) {
    openLearningCompass();
    compassSearch.focus();
  } else {
    closeLearningCompass();
  }
});

compassClose.addEventListener("click", closeLearningCompass);
compassSearch.addEventListener("input", () => {
  compassSearch.dataset.source = "compass";
  renderLearningRoutes(compassSearch.value);
});

destinationInput.addEventListener("input", () => {
  compassSearch.value = destinationInput.value;
  compassSearch.dataset.source = destinationInput.value ? "destination" : "";
  renderLearningRoutes(compassSearch.value);
});

document.addEventListener("click", (event) => {
  if (!compassPanel.hidden && !compassPanel.contains(event.target) && !compassToggle.contains(event.target)) {
    closeLearningCompass();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !compassPanel.hidden) {
    closeLearningCompass();
    compassToggle.focus();
  }
});

copyButton.addEventListener("click", async () => {
  const destination = document.querySelector("#map-caption-title").textContent;
  const text = `${destination}: ${directions.textContent}`;
  try {
    await navigator.clipboard.writeText(text);
    copyButton.textContent = "✓";
    copyButton.setAttribute("aria-label", "Directions copied");
  } catch {
    copyButton.textContent = "!";
    copyButton.setAttribute("aria-label", "Unable to copy directions");
  }
});

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  nav.classList.toggle("is-open", !isOpen);
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    closeLearningCompass();
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    nav.classList.remove("is-open");
  });
});

/* ============================================================== */
/* MODAL SYSTEM CONTROLLER                                        */
/* ============================================================== */
function openModal(modalId) {
  const modal = document.querySelector(`#${modalId}`);
  if (modal) {
    modal.classList.add("is-active");
    document.body.style.overflow = "hidden";
  }
}

function closeModal(modalId) {
  const modal = document.querySelector(`#${modalId}`);
  if (modal) {
    modal.classList.remove("is-active");
    document.body.style.overflow = "";
  }
}

document.querySelectorAll("[data-close-modal]").forEach((btn) => {
  btn.addEventListener("click", () => {
    closeModal(btn.dataset.closeModal);
  });
});

document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) {
      closeModal(backdrop.id);
    }
  });
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.querySelectorAll(".modal-backdrop.is-active").forEach((m) => closeModal(m.id));
  }
});

/* ============================================================== */
/* STUDENT PORTAL ("THE SHIPMATE DECK")                           */
/* ============================================================== */
const openPortalBtn = document.querySelector("#open-portal-btn");
const footerPortalLink = document.querySelector("#footer-portal-link");

if (openPortalBtn) {
  openPortalBtn.addEventListener("click", () => openModal("portal-modal"));
}
if (footerPortalLink) {
  footerPortalLink.addEventListener("click", (e) => {
    e.preventDefault();
    openModal("portal-modal");
  });
}

// Student Portal Sub-tabs
const portalNavBtns = document.querySelectorAll(".portal-nav-btn");
const portalPanes = {
  overview: document.querySelector("#portal-pane-overview"),
  grades: document.querySelector("#portal-pane-grades"),
  timetable: document.querySelector("#portal-pane-timetable"),
  fees: document.querySelector("#portal-pane-fees"),
  log: document.querySelector("#portal-pane-log"),
};

portalNavBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    portalNavBtns.forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    const tabKey = btn.dataset.ptab;
    Object.keys(portalPanes).forEach((key) => {
      if (portalPanes[key]) {
        portalPanes[key].style.display = key === tabKey ? "block" : "none";
      }
    });
  });
});

// Ship's Log Circular Search
const portalLogSearch = document.querySelector("#portal-log-search");
if (portalLogSearch) {
  portalLogSearch.addEventListener("input", () => {
    const query = portalLogSearch.value.trim().toLowerCase();
    const items = document.querySelectorAll(".portal-log-item");
    items.forEach((item) => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(query) ? "flex" : "none";
    });
  });
}

// Student Portal View Receipt
const btnPortalReceipt = document.querySelector("#btn-portal-view-receipt");
if (btnPortalReceipt) {
  btnPortalReceipt.addEventListener("click", () => {
    const receiptBody = document.querySelector("#receipt-modal-body");
    if (receiptBody) {
      receiptBody.innerHTML = `
        <div style="padding: 20px; background: #fffdf8; border: 2px dashed #b8974d; border-radius: 4px; font-family: monospace;">
          <div style="text-align: center; border-bottom: 2px solid #b8974d; padding-bottom: 12px; margin-bottom: 16px;">
            <h2 style="margin: 0; font-family: var(--serif); font-size: 22px; color: var(--sea);">VIBE COLLEGE ACADEMIC TREASURY</h2>
            <p style="margin: 4px 0 0; font-size: 11px;">OFFICIAL CLEARANCE SCROLL · SEMESTER 5</p>
          </div>
          <table style="width: 100%; font-size: 11px; margin-bottom: 14px;">
            <tr><td><strong>Mariner Name:</strong></td><td>Cadet Jack Sparrow</td></tr>
            <tr><td><strong>Roll Number:</strong></td><td>VC-2024-TECH-042</td></tr>
            <tr><td><strong>Program:</strong></td><td>B.Tech Navigational Engineering</td></tr>
            <tr><td><strong>Transaction Ref:</strong></td><td>TXN-VC-99418294 (Paid in Full)</td></tr>
            <tr><td><strong>Payment Mode:</strong></td><td>Maritime NetBanking (SBI Allied)</td></tr>
            <tr><td><strong>Date of Stamp:</strong></td><td>12 August 2026</td></tr>
          </table>
          <hr style="border: 0; border-top: 1px dashed #d5c8a5; margin: 12px 0;" />
          <table style="width: 100%; font-size: 11px; margin-bottom: 14px;">
            <tr><td>Tuition Fee (Term I & II):</td><td style="text-align: right;">₹90,000</td></tr>
            <tr><td>Laboratory & Astrolabe Dues:</td><td style="text-align: right;">₹12,500</td></tr>
            <tr><td>Harbour Deck Hostel Mess:</td><td style="text-align: right;">₹37,500</td></tr>
            <tr><td>High Sea Merit Waiver (30%):</td><td style="text-align: right; color: #225c34;">-₹27,000</td></tr>
            <tr style="font-weight: bold; font-size: 13px; border-top: 2px solid #8e6c38;">
              <td style="padding-top: 8px;">Total Doubloons Cleared:</td>
              <td style="text-align: right; padding-top: 8px; color: var(--rust);">₹1,13,000</td>
            </tr>
          </table>
          <div style="text-align: center; margin-top: 20px; padding-top: 12px; border-top: 1px solid #e0d5ba; font-size: 10px; color: #6e746b;">
            <p style="margin: 0;">✦ CERTIFIED SEAL OF THE BURSAR · NO DUES OUTSTANDING ✦</p>
            <button class="button button-gold" style="margin-top: 12px;" onclick="window.print()">Print / Save Scroll</button>
          </div>
        </div>
      `;
    }
    openModal("receipt-modal");
  });
}

/* ============================================================== */
/* DOUBLOON FEE CALCULATOR                                        */
/* ============================================================== */
const programRates = {
  tech: 180000,
  business: 150000,
  arts: 120000,
};

const fixedEquipmentFee = 25000;
const hostelFee = 75000;

function formatCurrency(amount) {
  return "₹" + amount.toLocaleString("en-IN");
}

function updateDoubloonCalculator() {
  const programSelect = document.querySelector("#calc-program");
  if (!programSelect) return;

  const progKey = programSelect.value;
  const baseTuition = programRates[progKey] || 180000;

  const stayRadio = document.querySelector('input[name="stay"]:checked');
  const stayCost = stayRadio && stayRadio.value === "hostel" ? hostelFee : 0;

  const scholarshipRadio = document.querySelector('input[name="scholarship"]:checked');
  let waiverRate = 0;
  if (scholarshipRadio) {
    if (scholarshipRadio.value === "merit") waiverRate = 0.30;
    else if (scholarshipRadio.value === "voyager") waiverRate = 0.15;
  }

  const waiverAmount = Math.round(baseTuition * waiverRate);
  const netTotal = baseTuition + fixedEquipmentFee + stayCost - waiverAmount;

  const inst1 = Math.round(netTotal / 3);
  const inst2 = Math.round(netTotal / 3);
  const inst3 = netTotal - (inst1 + inst2);

  const baseEl = document.querySelector("#calc-base-tuition");
  const hostelEl = document.querySelector("#calc-hostel-dues");
  const waiverEl = document.querySelector("#calc-waiver-dues");
  const netEl = document.querySelector("#calc-net-total");
  const inst1El = document.querySelector("#calc-inst-1");
  const inst2El = document.querySelector("#calc-inst-2");
  const inst3El = document.querySelector("#calc-inst-3");

  if (baseEl) baseEl.textContent = formatCurrency(baseTuition);
  if (hostelEl) hostelEl.textContent = formatCurrency(stayCost);
  if (waiverEl) waiverEl.textContent = waiverAmount > 0 ? "-" + formatCurrency(waiverAmount) : "₹0";
  if (netEl) netEl.textContent = formatCurrency(netTotal);
  if (inst1El) inst1El.textContent = formatCurrency(inst1);
  if (inst2El) inst2El.textContent = formatCurrency(inst2);
  if (inst3El) inst3El.textContent = formatCurrency(inst3);
}

const calcProgram = document.querySelector("#calc-program");
if (calcProgram) {
  calcProgram.addEventListener("change", updateDoubloonCalculator);
}
document.querySelectorAll('input[name="stay"], input[name="scholarship"]').forEach((input) => {
  input.addEventListener("change", updateDoubloonCalculator);
});

// Print Estimate Charter button
const btnPrintEstimate = document.querySelector("#btn-print-estimate");
if (btnPrintEstimate) {
  btnPrintEstimate.addEventListener("click", () => {
    updateDoubloonCalculator();
    const progText = calcProgram.options[calcProgram.selectedIndex].text;
    const baseTuition = document.querySelector("#calc-base-tuition").textContent;
    const hostelDues = document.querySelector("#calc-hostel-dues").textContent;
    const waiverDues = document.querySelector("#calc-waiver-dues").textContent;
    const netTotal = document.querySelector("#calc-net-total").textContent;
    const inst1 = document.querySelector("#calc-inst-1").textContent;
    const inst2 = document.querySelector("#calc-inst-2").textContent;
    const inst3 = document.querySelector("#calc-inst-3").textContent;

    const receiptBody = document.querySelector("#receipt-modal-body");
    if (receiptBody) {
      receiptBody.innerHTML = `
        <div style="padding: 24px; background: #fffcf4; border: 2px solid #b8974d; border-radius: 4px;">
          <div style="text-align: center; border-bottom: 2px solid #a4813f; padding-bottom: 12px; margin-bottom: 16px;">
            <p style="margin: 0; color: #8e7443; font-size: 9px; font-weight: bold; letter-spacing: .15em;">VIBE COLLEGE · ADMISSIONS DECK</p>
            <h2 style="margin: 4px 0 0; font-family: var(--serif); font-size: 22px; color: var(--sea);">Official Doubloon Estimate Charter</h2>
            <small style="color: #6d756b;">Issued for Academic Year 2026-2027</small>
          </div>
          <table style="width: 100%; font-size: 11px; margin-bottom: 14px;">
            <tr><td><strong>Selected Voyage:</strong></td><td>${progText}</td></tr>
            <tr><td><strong>Base Tuition Fee:</strong></td><td style="text-align: right;">${baseTuition}</td></tr>
            <tr><td><strong>Equipment & Fleet Lab:</strong></td><td style="text-align: right;">₹25,000</td></tr>
            <tr><td><strong>Hostel Berth & Mess:</strong></td><td style="text-align: right;">${hostelDues}</td></tr>
            <tr><td><strong>Scholarship Deduction:</strong></td><td style="text-align: right; color: #235c34;">${waiverDues}</td></tr>
            <tr style="font-weight: bold; font-size: 14px; border-top: 2px solid #8e6c38;">
              <td style="padding-top: 8px;">Net Estimated Doubloons:</td>
              <td style="text-align: right; padding-top: 8px; color: var(--rust);">${netTotal}</td>
            </tr>
          </table>
          <div style="padding: 12px; background: #f6eedb; border-radius: 3px; font-size: 10px; margin-bottom: 16px;">
            <strong>Payment Instalments (Trimester breakdown):</strong>
            <div style="display: flex; justify-content: space-between; margin-top: 6px;">
              <span>Term I: <strong>${inst1}</strong></span>
              <span>Term II: <strong>${inst2}</strong></span>
              <span>Term III: <strong>${inst3}</strong></span>
            </div>
          </div>
          <p style="font-size: 9px; color: #847a66; text-align: center; margin: 0 0 14px;">
            * This estimate charter is valid for 60 sailing days and eligible for allied maritime educational loans.
          </p>
          <div style="display: flex; gap: 10px; justify-content: center;">
            <button class="button button-gold" onclick="window.print()">Print Charter</button>
            <button class="button button-dark" onclick="closeModal('receipt-modal'); openModal('enlist-modal');">Proceed to Enlistment</button>
          </div>
        </div>
      `;
    }
    openModal("receipt-modal");
  });
}

// Open Enlist Form button from calc
const btnOpenEnlistForm = document.querySelector("#btn-open-enlist-form");
if (btnOpenEnlistForm) {
  btnOpenEnlistForm.addEventListener("click", () => openModal("enlist-modal"));
}

/* ============================================================== */
/* ADMISSIONS TAB SWITCHER                                        */
/* ============================================================== */
const admTabs = [
  { btn: document.querySelector("#tab-btn-calc"), pane: document.querySelector("#pane-calc") },
  { btn: document.querySelector("#tab-btn-schedule"), pane: document.querySelector("#pane-schedule") },
  { btn: document.querySelector("#tab-btn-dossier"), pane: document.querySelector("#pane-dossier") },
  { btn: document.querySelector("#tab-btn-faq"), pane: document.querySelector("#pane-faq") },
];

admTabs.forEach(({ btn, pane }) => {
  if (btn && pane) {
    btn.addEventListener("click", () => {
      admTabs.forEach((item) => {
        if (item.btn) {
          item.btn.classList.remove("is-active");
          item.btn.setAttribute("aria-selected", "false");
        }
        if (item.pane) item.pane.classList.remove("is-active");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-selected", "true");
      pane.classList.add("is-active");
    });
  }
});

/* ============================================================== */
/* SEAFARER'S DOSSIER CHECKLIST                                   */
/* ============================================================== */
const dossierChecks = document.querySelectorAll(".dossier-check");
const dossierCounter = document.querySelector("#dossier-counter");
const dossierFill = document.querySelector("#dossier-fill");

function updateDossierProgress() {
  const total = dossierChecks.length;
  let checked = 0;
  dossierChecks.forEach((chk) => {
    const parent = chk.closest(".dossier-item");
    const badge = parent.querySelector(".dossier-status-badge");
    if (chk.checked) {
      checked++;
      parent.classList.add("is-checked");
      if (badge) badge.textContent = "Verified ✓";
    } else {
      parent.classList.remove("is-checked");
      if (badge) badge.textContent = "Pending";
    }
  });

  const percentage = Math.round((checked / total) * 100);
  if (dossierCounter) {
    dossierCounter.textContent = `${checked} OF ${total} SCROLLS PREPARED (${percentage}%)`;
  }
  if (dossierFill) {
    dossierFill.style.width = `${percentage}%`;
  }
}

dossierChecks.forEach((chk) => {
  chk.addEventListener("change", updateDossierProgress);
});

const btnDossierEnlist = document.querySelector("#btn-dossier-enlist");
if (btnDossierEnlist) {
  btnDossierEnlist.addEventListener("click", () => openModal("enlist-modal"));
}

/* ============================================================== */
/* ADMISSIONS FAQS ACCORDIONS                                     */
/* ============================================================== */
document.querySelectorAll(".faq-question-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const parent = btn.closest(".faq-accordion");
    if (parent) {
      parent.classList.toggle("is-open");
    }
  });
});

/* ============================================================== */
/* PLACEMENTS YEAR TRAJECTORY                                     */
/* ============================================================== */
const placementYearData = {
  2026: [
    { label: "Total Offers Made", value: "412 Offers" },
    { label: "Mariners with Dream Offers (>₹20 LPA)", value: "68 Cadets" },
    { label: "Leading Sector", value: "Distributed AI & Cloud (44%)" },
    { label: "International Placements", value: "24 Berths in SG, UK & US" },
  ],
  2025: [
    { label: "Total Offers Made", value: "384 Offers" },
    { label: "Mariners with Dream Offers (>₹20 LPA)", value: "54 Cadets" },
    { label: "Leading Sector", value: "Autonomous Systems & Fintech (38%)" },
    { label: "International Placements", value: "19 Berths in SG & Europe" },
  ],
  2024: [
    { label: "Total Offers Made", value: "340 Offers" },
    { label: "Mariners with Dream Offers (>₹20 LPA)", value: "42 Cadets" },
    { label: "Leading Sector", value: "Full-Stack & Global Logistics (35%)" },
    { label: "International Placements", value: "15 Berths" },
  ],
};

const trajTabs = document.querySelectorAll(".traj-tab");
const trajContainer = document.querySelector("#traj-stats-container");

trajTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    trajTabs.forEach((t) => t.classList.remove("is-active"));
    tab.classList.add("is-active");
    const year = tab.dataset.year;
    const stats = placementYearData[year] || placementYearData[2026];
    if (trajContainer) {
      trajContainer.innerHTML = stats
        .map(
          (s) => `
        <div class="traj-row">
          <span>${s.label}</span>
          <strong>${s.value}</strong>
        </div>
      `
        )
        .join("");
    }
  });
});

/* ============================================================== */
/* HALL OF LEGENDS: FILTERING & CHRONICLE MODALS                  */
/* ============================================================== */
const legendFilters = document.querySelectorAll(".legend-filter-btn");
const wantedPosters = document.querySelectorAll(".wanted-poster");

legendFilters.forEach((btn) => {
  btn.addEventListener("click", () => {
    legendFilters.forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    const cat = btn.dataset.cat;
    wantedPosters.forEach((poster) => {
      if (cat === "all" || poster.dataset.cat === cat) {
        poster.style.display = "block";
      } else {
        poster.style.display = "none";
      }
    });
  });
});

const legendChronicles = {
  roy: {
    name: "Captain Ananya Roy",
    year: "Class of 2021 · B.Tech Navigational Computing",
    role: "Founder & Chief Navigator, SkyCorsair AI",
    bounty: "Raised $40M Series B · Featured in Forbes 30 Under 30",
    image: "assets/legend_roy.jpg",
    bio: "Ananya developed her first autonomous pathfinding neural network in the Vibe College Founders Lab during her junior voyage. Today, SkyCorsair provides real-time atmospheric and ocean navigation for 1,200 maritime shipping vessels across 4 continents.",
    quote: "“The safe harbor never produced legend-worthy ships. Learn to welcome stormy bugs and uncharted research topics.”",
    advice: "Master the algorithmic foundations before chasing frameworks. Build projects with fellow crew members outside classroom hours.",
  },
  malhotra: {
    name: "Commander Vikram Malhotra",
    year: "Class of 2019 · B.Tech Distributed Systems",
    role: "Principal Systems Architect, CloudGalleon Global",
    bounty: "Architect of 12M Transactions/Sec Maritime Ledger",
    image: "assets/legend_malhotra.jpg",
    bio: "Vikram spent his undergraduate years maintaining the campus high-performance computing cluster. Now at CloudGalleon, he designs hyper-scale distributed infrastructure supporting real-time oceanic tracking and trade telemetry.",
    quote: "“Simplicity in architecture is the truest luxury at sea. If your design cannot survive a hurricane, strip away the excess.”",
    advice: "Study operating systems and distributed consensus deeply. The core mechanics of computing have not changed; only the scale has.",
  },
  vance: {
    name: "Commodore Elara Vance",
    year: "Class of 2022 · B.S. Oceanic Sciences & Cartography",
    role: "Lead Climate Cartographer, Oceanic Observatory",
    bounty: "Authored 14 Nature Papers on Deep-Tide Dynamics",
    image: "assets/legend_vance.jpg",
    bio: "Elara led three student research expeditions into the Southern Coral Trench during her honors degree. Her climate simulation models now forecast marine heatwaves 45 days in advance for international environmental agencies.",
    quote: "“Every drop in the ocean holds a mathematical secret. Our duty as scientists is to listen with humility.”",
    advice: "Cross-disciplinary curiosity is your superpower. Pair computer science with environmental physics for maximum impact.",
  },
  tariq: {
    name: "Captain Tariq Al-Mansoor",
    year: "Class of 2020 · B.B.A. Maritime Commerce",
    role: "Managing Partner, Clean Ocean Ventures",
    bounty: "Directed $120M into Clean Maritime Energy Startups",
    image: "assets/legend_tariq.jpg",
    bio: "Tariq started his first venture—a sustainable hemp rigging supply chain—while a sophomore at Vibe College. He now manages a specialized venture capital fleet investing in electric cargo galleons and oceanic carbon sequestration.",
    quote: "“Profit without planetary purpose is mere plunder. True commerce builds sustainable trade winds for generations.”",
    advice: "Learn how capital flows and how contracts are drawn. Good ideas only sail when supported by sound economic discipline.",
  },
};

document.querySelectorAll(".wanted-btn[data-legend]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.legend;
    const legend = legendChronicles[key];
    if (!legend) return;

    const body = document.querySelector("#legend-modal-body");
    if (body) {
      body.innerHTML = `
        <div style="display: grid; grid-template-columns: 220px 1fr; gap: 24px; align-items: start;">
          <div style="border: 2px solid #8f6c3a; padding: 8px; background: #f3dc98; border-radius: 3px; text-align: center;">
            <img src="${legend.image}" alt="${legend.name}" style="width: 100%; aspect-ratio: 1/1; object-fit: cover; display: block; border: 1px solid #5a3c1c;" />
            <p style="margin: 8px 0 2px; font-family: var(--serif); font-size: 14px; font-weight: bold; color: #372010;">${legend.name}</p>
            <small style="font-size: 8px; color: #785a36; font-weight: bold; display: block;">${legend.year}</small>
          </div>
          <div>
            <span style="font-size: 8px; font-weight: bold; letter-spacing: .12em; text-transform: uppercase; color: var(--rust);">CHRONICLE ARCHIVE · ROLL OF HONOR</span>
            <h2 style="margin: 4px 0 10px; font-family: var(--serif); font-size: 24px; color: var(--sea);">${legend.name}</h2>
            <div style="padding: 8px 12px; background: #f6eed8; border-left: 3px solid var(--gold); border-radius: 2px; margin-bottom: 14px;">
              <strong style="display: block; font-size: 11px; color: #2e1d0e;">Current Station: ${legend.role}</strong>
              <small style="color: #6d5b3d; font-size: 10px;">${legend.bounty}</small>
            </div>
            <p style="font-size: 11px; line-height: 1.7; color: #535d50; margin: 0 0 14px;">${legend.bio}</p>
            <blockquote style="margin: 0 0 14px; padding-left: 12px; border-left: 2px solid var(--rust); font-family: var(--serif); font-size: 13px; font-style: italic; color: #433324;">
              ${legend.quote}
            </blockquote>
            <div style="padding: 10px; background: #fffcf4; border: 1px dashed #d5c8a4; border-radius: 2px; font-size: 10px; color: #555e52;">
              <strong>Word to Incoming Cadets:</strong> ${legend.advice}
            </div>
          </div>
        </div>
      `;
    }
    openModal("legend-modal");
  });
});

const btnAlumniJoin = document.querySelector("#btn-alumni-join");
if (btnAlumniJoin) {
  btnAlumniJoin.addEventListener("click", () => openModal("enlist-modal"));
}

/* ============================================================== */
/* COURSE CHARTER DETAIL MODALS                                   */
/* ============================================================== */
const courseCharters = {
  arts: {
    title: "Arts & Humanities (B.A. Hons)",
    tagline: "Cartography, Narrative Storytelling & Maritime Philosophy",
    duration: "3 Years (6 Semesters)",
    intake: "120 Berths",
    highlights: [
      "Semester 1-2: Foundations of World Mythology, Historical Cartography & Critical Dialectics.",
      "Semester 3-4: Maritime Anthropology, Narrative Design for Modern Media & High-Seas Ethics.",
      "Semester 5-6: Advanced Archival Research, Capstone Literary Voyage & Cultural Curation.",
    ],
    careers: "Museum Curators, Narrative Designers, Policy Historians, Investigative Journalists, Creative Directors.",
    faculty: "Prof. Alistair Finch (Ph.D. Oxford, Fellow of the Royal Geographical Society)",
  },
  tech: {
    title: "Science & Technology (B.Tech / B.S.)",
    tagline: "Autonomous Galleon Navigation, AI Systems & Marine Robotics",
    duration: "4 Years (8 Semesters)",
    intake: "240 Berths",
    highlights: [
      "Semester 1-2: Computational Thinking, Discrete Math, Physics of Fluid Dynamics & C/Rust Core.",
      "Semester 3-4: Celestial Astrolabe Algorithms, Operating Systems, Machine Learning & Computer Vision.",
      "Semester 5-6: Autonomous Unmanned Galleon Systems, Deep-Sea IoT Sensors & Cyber Navigation Security.",
      "Semester 7-8: Industry Fleet Internship, Distributed Consensus & Multi-Agent Robotics Capstone.",
    ],
    careers: "Autonomous Systems Engineers, AI Researchers, Distributed Backend Architects, Robotics Specialists.",
    faculty: "Dr. Evelyn Drake (Ph.D. MIT Robotics, Former Marine AI Lead at OceanGate Technologies)",
  },
  business: {
    title: "Business & Leadership (B.B.A. / B.Com)",
    tagline: "Global Maritime Logistics, Trade Treasury & Enterprise Command",
    duration: "3 Years (6 Semesters)",
    intake: "180 Berths",
    highlights: [
      "Semester 1-2: Principles of Trade, Global Macroeconomics, Financial Accounting & Maritime Law.",
      "Semester 3-4: Supply Chain Oceanics, Venture Fleet Valuation, Port Asset Management & Marketing.",
      "Semester 5-6: International Sovereign Financing, Sustainability in High-Seas Logistics & Incubation Pitch.",
    ],
    careers: "Venture Capital Analysts, Global Supply Chain Directors, Merchant Traders, FinTech Strategists.",
    faculty: "Capt. Marcus Sterling (MBA Wharton, Former Director of Mediterranean Shipping Alliances)",
  },
};

document.querySelectorAll(".inspect-course-btn[data-course]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.course;
    const charter = courseCharters[key];
    if (!charter) return;

    const body = document.querySelector("#course-modal-body");
    if (body) {
      body.innerHTML = `
        <div>
          <span style="font-size: 8px; font-weight: bold; letter-spacing: .12em; text-transform: uppercase; color: var(--rust);">ACADEMIC VOYAGE SPECIFICATION</span>
          <h2 style="margin: 4px 0 4px; font-family: var(--serif); font-size: 24px; color: var(--sea);">${charter.title}</h2>
          <p style="margin: 0 0 16px; font-size: 12px; color: #727a6f;">${charter.tagline}</p>
          <div style="display: flex; gap: 12px; margin-bottom: 20px;">
            <span class="trust-badge" style="background: #eee7d5; color: var(--ink);">⏱ Duration: ${charter.duration}</span>
            <span class="trust-badge" style="background: #eee7d5; color: var(--ink);">⚓ Annual Berths: ${charter.intake}</span>
          </div>
          <h4 style="margin: 0 0 8px; font-family: var(--serif); font-size: 15px;">Voyage Curriculum Milestones</h4>
          <ul style="margin: 0 0 18px; padding-left: 18px; font-size: 11px; line-height: 1.7; color: #525a4f;">
            ${charter.highlights.map((h) => `<li>${h}</li>`).join("")}
          </ul>
          <div style="padding: 14px; background: #fbf7ee; border: 1px solid #ded5be; border-radius: 3px; margin-bottom: 18px;">
            <strong style="display: block; font-size: 11px; color: var(--sea); margin-bottom: 4px;">Destination Career Helm:</strong>
            <p style="margin: 0; font-size: 10px; color: #697166;">${charter.careers}</p>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <small style="color: #847a66; font-size: 9px;">Star Faculty Navigator: <strong>${charter.faculty}</strong></small>
            <button class="button button-gold" onclick="closeModal('course-modal'); openModal('enlist-modal');">Enlist for this Voyage →</button>
          </div>
        </div>
      `;
    }
    openModal("course-modal");
  });
});

/* ============================================================== */
/* MESSAGE IN A BOTTLE (CONTACT & ENQUIRY)                        */
/* ============================================================== */
const bottleForm = document.querySelector("#bottle-form");
const bottleSuccess = document.querySelector("#bottle-success");

if (bottleForm) {
  bottleForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.querySelector("#bottle-name").value.trim();
    const dept = document.querySelector("#bottle-dept").options[document.querySelector("#bottle-dept").selectedIndex].text;
    const randomId = Math.floor(1000 + Math.random() * 9000);

    const msgEl = document.querySelector("#bottle-success-msg");
    if (msgEl) {
      msgEl.innerHTML = `
        Ahoy, <strong>${name}</strong>! Your message bottle has been safely plucked from the tide and delivered to the <strong>${dept}</strong>.
        <br />Your Dispatch Tracking ID is <strong>#VB-${randomId}</strong>. A carrier pigeon confirmation has been sent to your email. Expect a full response within 24 tide hours!
      `;
    }

    bottleSuccess.classList.add("is-visible");
    bottleForm.reset();
  });
}

/* ============================================================== */
/* ENLISTMENT APPLICATION FORM                                    */
/* ============================================================== */
const enlistForm = document.querySelector("#enlist-form");
const enlistSuccess = document.querySelector("#enlist-success");
const btnBannerEnlist = document.querySelector("#btn-banner-enlist");

if (btnBannerEnlist) {
  btnBannerEnlist.addEventListener("click", () => openModal("enlist-modal"));
}

if (enlistForm) {
  enlistForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.querySelector("#enlist-name").value.trim();
    const prog = document.querySelector("#enlist-program").options[document.querySelector("#enlist-program").selectedIndex].text;
    const appId = "VC-2027-APP-" + Math.floor(1000 + Math.random() * 9000);

    const msgEl = document.querySelector("#enlist-success-msg");
    if (msgEl) {
      msgEl.innerHTML = `
        Congratulations, <strong>${name}</strong>! Your application for <strong>${prog}</strong> has been logged in the Admiralty Roll.
        <br />Your Application Scroll ID is <strong>#${appId}</strong>. Your provisional trial hall ticket and entrance syllabus have been sent to your inbox. Welcome aboard!
      `;
    }

    enlistSuccess.classList.add("is-visible");
    enlistForm.reset();
  });
}

// Mandatory disclosures alert / view
const btnViewDisclosures = document.querySelector("#btn-view-disclosures");
if (btnViewDisclosures) {
  btnViewDisclosures.addEventListener("click", (e) => {
    e.preventDefault();
    alert("✦ VIBE COLLEGE MANDATORY STATUTORY CHARTERS ✦\n\n• UGC 2(f) & 12(B) Recognition: F. No. 8-12/2018 (CPP-I/C)\n• AICTE Permanent Approval: F. No. South-West/1-93214981\n• NAAC Accreditation: Grade A++ (Score: 3.82/4.00)\n• Anti-Ragging National Monitoring Cell: www.antiragging.in\n• Ombudsman & Grievance Cell: grievances@vibecollege.edu\n\nAll statutory scrolls and audited finance statements are accessible at the Registrar's Port.");
  });
}

