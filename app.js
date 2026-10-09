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

if (datalist) {
  for (const place of places) {
    const option = document.createElement("option");
    option.value = place.name;
    datalist.append(option);
  }
}

function renderLearningRoutes(searchTerm = "") {
  if (!compassRecommendations) return;
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

  if (compassHint) {
    compassHint.textContent = query && !matchingRoutes.length
      ? "No exact bearing yet—here are a few good places to start."
      : query
        ? "Based on your search, these could be your next stops."
        : "A few good next steps, picked for your search.";
  }
}

function openLearningCompass() {
  if (!compassPanel || !compassToggle) return;
  if (compassSearch && destinationInput) {
    if (!compassSearch.value.trim() || compassSearch.dataset.source === "destination") {
      compassSearch.value = destinationInput.value;
      compassSearch.dataset.source = destinationInput.value ? "destination" : "";
    }
    renderLearningRoutes(compassSearch.value);
  }
  compassPanel.hidden = false;
  compassToggle.setAttribute("aria-expanded", "true");
}

function closeLearningCompass() {
  if (!compassPanel || !compassToggle) return;
  compassPanel.hidden = true;
  compassToggle.setAttribute("aria-expanded", "false");
}

function revealTreasure(destination) {
  const normalizedDestination = (destination || "").trim().toLocaleLowerCase();
  const place = places.find((entry) => entry.name.toLocaleLowerCase() === normalizedDestination);

  if (!place) {
    if (errorMessage) errorMessage.textContent = "Polly can’t find that port yet. Try one of the nearby places below.";
    if (destinationInput) destinationInput.setAttribute("aria-invalid", "true");
    return;
  }

  if (errorMessage) errorMessage.textContent = "";
  if (destinationInput) destinationInput.removeAttribute("aria-invalid");
  const destEl = document.querySelector("#map-destination");
  const capTitleEl = document.querySelector("#map-caption-title");
  if (destEl) destEl.textContent = place.name;
  if (capTitleEl) capTitleEl.textContent = place.name;
  if (directions) directions.textContent = place.directions;
  place.nearby.forEach((name, index) => {
    const nearEl = document.querySelector(`#nearby-${["one", "two", "three", "four"][index]} b`);
    if (nearEl) nearEl.textContent = name;
  });
  window.clearTimeout(revealTimer);
  if (emptyState && map) {
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
  }
  if (copyButton) {
    copyButton.textContent = "⧉";
    copyButton.setAttribute("aria-label", "Copy directions");
  }
}

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (destinationInput) revealTreasure(destinationInput.value);
  });
}

document.querySelectorAll("[data-destination]").forEach((button) => {
  button.addEventListener("click", () => {
    const destination = button.dataset.destination;
    if (destinationInput) destinationInput.value = destination;
    revealTreasure(destination);
  });
});

if (compassToggle && compassPanel) {
  compassToggle.addEventListener("click", () => {
    if (compassPanel.hidden) {
      openLearningCompass();
      if (compassSearch) compassSearch.focus();
    } else {
      closeLearningCompass();
    }
  });
}

if (compassClose) {
  compassClose.addEventListener("click", closeLearningCompass);
}
if (compassSearch) {
  compassSearch.addEventListener("input", () => {
    compassSearch.dataset.source = "compass";
    renderLearningRoutes(compassSearch.value);
  });
}

if (destinationInput) {
  destinationInput.addEventListener("input", () => {
    if (compassSearch) {
      compassSearch.value = destinationInput.value;
      compassSearch.dataset.source = destinationInput.value ? "destination" : "";
      renderLearningRoutes(compassSearch.value);
    }
  });
}

document.addEventListener("click", (event) => {
  if (compassPanel && compassToggle && !compassPanel.hidden && !compassPanel.contains(event.target) && !compassToggle.contains(event.target)) {
    closeLearningCompass();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && compassPanel && !compassPanel.hidden) {
    closeLearningCompass();
    if (compassToggle) compassToggle.focus();
  }
});

if (copyButton) {
  copyButton.addEventListener("click", async () => {
    const destEl = document.querySelector("#map-caption-title");
    const destination = destEl ? destEl.textContent : "";
    const text = `${destination}: ${directions ? directions.textContent : ""}`;
    try {
      await navigator.clipboard.writeText(text);
      copyButton.textContent = "✓";
      copyButton.setAttribute("aria-label", "Directions copied");
    } catch {
      copyButton.textContent = "!";
      copyButton.setAttribute("aria-label", "Unable to copy directions");
    }
  });
}

if (menuButton && nav) {
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
}

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

/* ============================================================== */
/* LANGUAGE SWITCHER                                              */
/* ============================================================== */
const langPicker = document.querySelector("#lang-picker");
const langTranslations = {
  en: {
    announcement: "OPEN DECK DAY · Saturday, 24 October · All hands welcome",
    claim: "Claim your place →",
    heroEyebrow: "A college for curious souls",
    heroH1: "Chart your<br />own <em>course.</em>",
    heroIntro: "Big ideas. Good people. A little salt in the air. Find your crew and make a future worth sailing toward.",
  },
  pirate: {
    announcement: "OPEN DECK DAY · Saturday, 24 October · All hands ahoy, ye hearty mariners!",
    claim: "Stake yer claim on deck →",
    heroEyebrow: "A buccaneer haven for daring rogues",
    heroH1: "Chart yer<br />own <em>course, matey.</em>",
    heroIntro: "Grand dreams. Fearless scalawags. Salt in the gale. Rally yer crew and forge a destiny on high seas.",
  },
  hi: {
    announcement: "ओपन डेक दिवस · शनिवार, 24 अक्टूबर · सभी नाविकों का स्वागत है",
    claim: "अपना स्थान सुरक्षित करें →",
    heroEyebrow: "जिज्ञासु आत्माओं के लिए एक अनूठा महाविद्यालय",
    heroH1: "तय करें अपना<br />खुद का <em>मार्ग।</em>",
    heroIntro: "बड़े विचार। सच्चे साथी। हवा में ताजगी। अपनी टीम चुनें और भविष्य की ओर आगे बढ़ें।",
  },
  es: {
    announcement: "DÍA DE CUBIERTA ABIERTA · Sábado, 24 de octubre · Bienvenidos a bordo",
    claim: "Reclama tu lugar →",
    heroEyebrow: "Una universidad para almas curiosas",
    heroH1: "Traza tu<br />propio <em>rumbo.</em>",
    heroIntro: "Grandes ideas. Buena tripulación. Viento a favor. Encuentra a tu equipo y navega hacia el futuro.",
  },
};

if (langPicker) {
  langPicker.addEventListener("change", (e) => {
    const lang = e.target.value;
    const trans = langTranslations[lang];
    if (!trans) return;

    const annText = document.querySelector("#announcement-text");
    if (annText) annText.textContent = trans.announcement;

    const heroH1 = document.querySelector(".hero-copy h1");
    if (heroH1) heroH1.innerHTML = trans.heroH1;

    const heroIntro = document.querySelector(".hero-intro");
    if (heroIntro) heroIntro.textContent = trans.heroIntro;

    const heroEyebrow = document.querySelector(".hero-copy .eyebrow");
    if (heroEyebrow) heroEyebrow.innerHTML = `<span></span> ${trans.heroEyebrow}`;
  });
}

/* ============================================================== */
/* ISLAND HOPPING DEPARTMENT DOSSIERS                            */
/* ============================================================== */
const islandDossiers = {
  cs: {
    title: "Computing Atoll — School of Navigational Tech",
    coord: "ISLE 01 · 12° 34' N",
    head: "Dr. Alistair Finch (Ph.D. Cambridge, F.R.G.S.)",
    headMsg: "“In the digital fog, algorithms are the stars by which we steer. Our students master high-performance computing, distributed networks, and maritime artificial intelligence.”",
    facultyRoster: [
      { name: "Prof. Maya Lin", role: "Chair of Astrolabe AI & Cryptography", hours: "Mon & Wed 14:00 - 16:00" },
      { name: "Dr. Kenji Sato", role: "Associate Dean of Autonomous Maritime Systems", hours: "Tue & Thu 10:00 - 12:00" },
      { name: "Prof. Helena Vance", role: "Lead Researcher in High-Seas Satellite Mesh", hours: "Fri 11:00 - 13:00" },
    ],
    labs: ["Quantum Astrolabe Supercomputing Cluster", "Neural Surface Navigation Hangar", "Distributed Edge Cyber-Defense Lab"],
    projects: ["ReefClean Autonomous Vision Skiffs", "Sub-Surface Acoustic Swarm Routing ($1.4M Grant)"],
  },
  robotics: {
    title: "Mechanics Isle — Marine Robotics & Naval Systems",
    coord: "ISLE 02 · 12° 36' N",
    head: "Dr. Evelyn Drake (Ph.D. MIT Robotics, Former DARPA Fellow)",
    headMsg: "“We combine classical naval architecture with cutting-edge mechatronics to engineer vessels that brave any storm.”",
    facultyRoster: [
      { name: "Cmdr. Sean O'Connor", role: "Professor of Hydrodynamics & Propulsion", hours: "Mon & Fri 09:00 - 11:00" },
      { name: "Dr. Amara Sen", role: "Director of Autonomous Submersibles", hours: "Wed 13:00 - 15:00" },
    ],
    labs: ["100-Meter Towing Wave Basin", "CAD Rigging & 3D Metal Fabrication Dock", "Autonomous Galleon Hangar"],
    projects: ["Wave-Powered Cargo Galleon", "Bio-mimetic Manta Ray Reconnaissance Sub ($2.1M DST Grant)"],
  },
  commerce: {
    title: "Commerce Atoll — International Trade & Admiralty Finance",
    coord: "ISLE 03 · 12° 38' N",
    head: "Capt. Marcus Sterling (MBA Wharton, Ex-Director Mediterranean Shipping)",
    headMsg: "“Commerce is the bloodstream of global trade. We forge commanders who negotiate multi-million doubloon charters and build enduring enterprises.”",
    facultyRoster: [
      { name: "Prof. Ronald Sterling", role: "Professor of Maritime Law & Sovereign Charters", hours: "Tue & Thu 11:00 - 13:00" },
      { name: "Dr. Priya Nair", role: "Chair of Global Commodity Trading & Derivatives", hours: "Mon 14:00 - 16:00" },
    ],
    labs: ["High-Seas Bloomberg & FinTech Trading Floor", "Global Supply Chain Logistics Simulation Hub"],
    projects: ["Sovereign Carbon Credit Maritime Exchange", "Maritime Blockchain Bills of Lading Standard"],
  },
  arts: {
    title: "Creative Isle — Humanities, Cartography & Maritime Lore",
    coord: "ISLE 04 · 12° 40' N",
    head: "Dame Cordelia Vane (M.A. Oxford, Poet Laureate of the Admiralty)",
    headMsg: "“Without stories, art, and philosophy, a voyage has direction but no purpose. We illuminate the human soul against the backdrop of the sea.”",
    facultyRoster: [
      { name: "Dr. Julian Black", role: "Reader in Maritime Historical Cartography", hours: "Wed & Fri 10:00 - 12:00" },
      { name: "Maestro Gabriel Costa", role: "Director of Nautical Soundscapes & Drama", hours: "Tue 15:00 - 17:00" },
    ],
    labs: ["Historical Cartographic Lithography Press", "Acoustics & Shanty Soundstage", "Digital Humanities Archive"],
    projects: ["Oral History of the High Seas", "The Illustrated Encyclopedia of Nautical Folklore"],
  },
};

document.querySelectorAll(".island-btn[data-island]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.island;
    const isle = islandDossiers[key];
    if (!isle) return;

    const body = document.querySelector("#island-modal-body");
    if (body) {
      body.innerHTML = `
        <div>
          <span style="font-size: 8px; font-weight: bold; letter-spacing: .12em; text-transform: uppercase; color: var(--rust);">${isle.coord}</span>
          <h2 style="margin: 4px 0 10px; font-family: var(--serif); font-size: 24px; color: var(--sea);">${isle.title}</h2>
          
          <div style="padding: 14px 18px; background: #fbf7ee; border-left: 3px solid var(--gold); border-radius: 2px; margin-bottom: 20px;">
            <strong style="display: block; font-size: 11px; color: var(--sea); margin-bottom: 4px;">Message from the Head of Isle — ${isle.head}:</strong>
            <p style="margin: 0; font-size: 11px; line-height: 1.6; color: #5a6258; font-style: italic;">${isle.headMsg}</p>
          </div>

          <h4 style="margin: 0 0 10px; font-family: var(--serif); font-size: 15px;">Distinguished Faculty & Office Hours</h4>
          <table class="mess-table" style="margin-bottom: 20px;">
            <thead>
              <tr>
                <th>Faculty Officer</th>
                <th>Academic Domain</th>
                <th>Consultation Office Hours</th>
              </tr>
            </thead>
            <tbody>
              ${isle.facultyRoster.map(f => `
                <tr>
                  <td><strong>${f.name}</strong></td>
                  <td>${f.role}</td>
                  <td><span class="trust-badge" style="background:#f4eedb; color:var(--sea);">${f.hours}</span></td>
                </tr>
              `).join("")}
            </tbody>
          </table>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;" class="calc-grid">
            <div style="padding: 14px; background: #fff; border: 1px solid #ded5be; border-radius: 3px;">
              <strong style="display: block; font-size: 11px; color: var(--sea); margin-bottom: 6px;">Specialized Research Labs:</strong>
              <ul style="margin: 0; padding-left: 16px; font-size: 10px; color: #6d756b; line-height: 1.6;">
                ${isle.labs.map(l => `<li>${l}</li>`).join("")}
              </ul>
            </div>
            <div style="padding: 14px; background: #fff; border: 1px solid #ded5be; border-radius: 3px;">
              <strong style="display: block; font-size: 11px; color: var(--sea); margin-bottom: 6px;">Flagship Funded Projects:</strong>
              <ul style="margin: 0; padding-left: 16px; font-size: 10px; color: #6d756b; line-height: 1.6;">
                ${isle.projects.map(p => `<li>${p}</li>`).join("")}
              </ul>
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end;">
            <button class="button button-gold" onclick="closeModal('island-modal'); openModal('enlist-modal');">Enlist in this Department →</button>
          </div>
        </div>
      `;
    }
    openModal("island-modal");
  });
});

/* ============================================================== */
/* VIRTUAL TOUR & VIDEO WALKTHROUGH                              */
/* ============================================================== */
const btnDroneTour = document.querySelector("#btn-drone-tour");
const btnCaptainVideo = document.querySelector("#btn-captain-video");
const btnPlayVideoSim = document.querySelector("#btn-play-video-sim");

if (btnDroneTour) {
  btnDroneTour.addEventListener("click", () => openModal("tour-video-modal"));
}
if (btnCaptainVideo) {
  btnCaptainVideo.addEventListener("click", () => openModal("tour-video-modal"));
}
document.querySelectorAll(".tour-btn[data-tour]").forEach((btn) => {
  btn.addEventListener("click", () => openModal("tour-video-modal"));
});

if (btnPlayVideoSim) {
  btnPlayVideoSim.addEventListener("click", () => {
    const display = document.querySelector("#tour-video-display");
    if (!display) return;
    display.innerHTML = `
      <div style="padding: 24px; text-align: center; color: var(--gold);">
        <div style="font-size: 40px; margin-bottom: 12px; animation: pulse 1s infinite;">🛰️</div>
        <h4 style="font-family: var(--serif); font-size: 18px; margin: 0 0 6px; color: #fff;">Streaming Live Campus Drone Stream (1080p 60fps)</h4>
        <p style="font-size: 11px; color: #a4b5a2; margin: 0 0 14px;">Passing over High Admiral Sterling’s Deck, Old Library Cliffs, and Robotics Towing Basin...</p>
        <div style="width: 240px; height: 6px; background: rgba(255,255,255,.2); border-radius: 3px; margin: 0 auto; overflow: hidden;">
          <div style="width: 70%; height: 100%; background: var(--gold); border-radius: 3px;"></div>
        </div>
        <p style="margin-top: 10px; font-size: 9px; color: #728273;">360° Gyro Tracking Active · Compass Heading 042° NNE</p>
      </div>
    `;
  });
}

document.querySelectorAll(".btn-tour-chapter[data-chapter]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const ch = btn.dataset.chapter;
    const title = document.querySelector("#video-sim-title");
    const desc = document.querySelector("#video-sim-desc");
    if (ch === "library") {
      if (title) title.textContent = "Chapter 1: The University Library of the Seven Seas & Reading Cliffs";
      if (desc) desc.textContent = "140,000+ volumes, RFID automated stacks, and ocean-facing reading carrels.";
    } else if (ch === "robotics") {
      if (title) title.textContent = "Chapter 2: Autonomous Robotics & AI Naval Hangar";
      if (desc) desc.textContent = "100m wave basin, autonomous surface skiffs, and edge computing labs.";
    } else {
      if (title) title.textContent = "Chapter 3: North Quad & Campus Harbor Anchorage";
      if (desc) desc.textContent = "Student amphitheater, Siren's shanty stage, and residential barracks.";
    }
  });
});

/* ============================================================== */
/* STUDENT LIFE HUB: TABS, LIBRARY SEARCH, HOSTEL, CLUBS          */
/* ============================================================== */
document.querySelectorAll(".life-tab-btn[data-ltab]").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".life-tab-btn").forEach((b) => {
      b.classList.remove("is-active");
      b.setAttribute("aria-selected", "false");
    });
    document.querySelectorAll(".life-pane").forEach((p) => p.classList.remove("is-active"));

    btn.classList.add("is-active");
    btn.setAttribute("aria-selected", "true");
    const pane = document.querySelector(`#life-pane-${btn.dataset.ltab}`);
    if (pane) pane.classList.add("is-active");
  });
});

// Library search filter
const libSearchInput = document.querySelector("#lib-search-input");
const btnLibSearch = document.querySelector("#btn-lib-search");
function filterLibrary() {
  const query = (libSearchInput ? libSearchInput.value : "").toLowerCase().trim();
  const rows = document.querySelectorAll("#lib-catalog-body tr");
  rows.forEach((row) => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(query) ? "" : "none";
  });
}
if (libSearchInput) libSearchInput.addEventListener("input", filterLibrary);
if (btnLibSearch) btnLibSearch.addEventListener("click", filterLibrary);

// Library cadet status check
const btnCheckLibStatus = document.querySelector("#btn-check-lib-status");
if (btnCheckLibStatus) {
  btnCheckLibStatus.addEventListener("click", () => {
    const id = (document.querySelector("#lib-cadet-check")?.value || "").trim();
    const out = document.querySelector("#lib-status-output");
    if (!out) return;
    out.style.display = "block";
    if (id) {
      out.innerHTML = `<strong>⚓ Registry for Cadet ${id}:</strong> 2 Scrolls Issued · <em>"Principles of Autonomous Systems"</em> (Due 24 Oct) · <em>"Admiralty Law"</em> (Due 30 Oct) · Outstanding Fines: ₹0.00 (All Clear).`;
    } else {
      out.innerHTML = `Please enter your Cadet Roll ID to check book status.`;
    }
  });
}

// Hostel cabin check
const btnCheckHostel = document.querySelector("#btn-check-hostel");
if (btnCheckHostel) {
  btnCheckHostel.addEventListener("click", () => {
    const roll = (document.querySelector("#hostel-roll-input")?.value || "").trim();
    const res = document.querySelector("#hostel-result");
    if (!res) return;
    res.style.display = "block";
    if (roll) {
      res.innerHTML = `<strong>Berth Allotment for ${roll}:</strong> Barrack Galleon HMS Victory · Deck 3, Cabin 304 (AC 2-Sharing, Ocean View) · Resident Warden: Capt. Sterling. Gate clearance biometric active.`;
    } else {
      res.innerHTML = `Please enter a Cadet Roll Number.`;
    }
  });
}

// Club enlistment
document.querySelectorAll(".btn-enlist-club[data-club]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const club = btn.dataset.club;
    const input = document.querySelector("#club-selected-name");
    if (input) input.value = club;
    openModal("club-modal");
  });
});

const clubForm = document.querySelector("#club-form");
if (clubForm) {
  clubForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const success = document.querySelector("#club-success");
    if (success) success.classList.add("is-visible");
    clubForm.reset();
  });
}

/* ============================================================== */
/* RESEARCH DOWNLOADS                                             */
/* ============================================================== */
document.querySelectorAll(".download-btn[data-dl]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const title = btn.dataset.dl;
    alert(`✦ PARCHMENT DISPATCHED ✦\n\n"${title}" has been downloaded to your device storage.\nOfficial digital verification seal: VC-HASH-99824`);
  });
});

const btnPitchStartup = document.querySelector("#btn-pitch-startup");
if (btnPitchStartup) {
  btnPitchStartup.addEventListener("click", () => {
    alert("✦ CROW'S NEST INCUBATION CELL ✦\n\nPitch rounds for Spring 2027 are now accepting proposals!\nSeed Grant: Up to ₹50 Lakhs + Wet Lab Allocation.\nSubmit pitch decks to: crowsnest@vibecollege.edu");
  });
}

/* ============================================================== */
/* CREW RECRUITMENT & JOB BERTH APPLICATIONS                      */
/* ============================================================== */
document.querySelectorAll(".btn-open-job-modal[data-role]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const role = btn.dataset.role;
    const pos = document.querySelector("#job-position");
    if (pos) pos.value = role;
    openModal("job-modal");
  });
});

const jobForm = document.querySelector("#job-form");
if (jobForm) {
  jobForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const success = document.querySelector("#job-success");
    if (success) success.classList.add("is-visible");
    jobForm.reset();
  });
}

/* ============================================================== */
/* ALUMNI GUILD & ENDOWMENT                                       */
/* ============================================================== */
const alumniData = [
  { name: "Captain Ananya Roy", year: "2021", prog: "B.Tech Navigational Tech", role: "CEO, SkyCorsair AI ($40M Series B)", fleet: "San Francisco / Bangalore" },
  { name: "Cmdr. Vikram Malhotra", year: "2019", prog: "B.Tech Computer Science", role: "Principal Architect, CloudGalleon", fleet: "London / Seattle" },
  { name: "Cmdr. Elara Vance", year: "2022", prog: "B.S. Oceanics", role: "Climate Cartographer, World Oceanic Institute", fleet: "Geneva / Tokyo" },
  { name: "Capt. Tariq Al-Mansoor", year: "2020", prog: "B.B.A. Maritime Commerce", role: "Managing Partner, Clean Ocean Ventures ($120M)", fleet: "Dubai / Singapore" },
  { name: "Lt. Samantha Reed", year: "2018", prog: "B.A. Nautical Literature", role: "Senior Editor, Royal Geographical Journal", fleet: "Edinburgh" },
  { name: "David Kim", year: "2023", prog: "B.Tech Robotics", role: "Senior Robotics Lead, DeepSea Dynamics", fleet: "Seoul / Boston" },
];

function renderAlumni(filter = "") {
  const container = document.querySelector("#alumni-results-list");
  if (!container) return;
  const q = filter.toLowerCase().trim();
  const matched = alumniData.filter(a => a.name.toLowerCase().includes(q) || a.role.toLowerCase().includes(q) || a.year.includes(q) || a.fleet.toLowerCase().includes(q));

  container.innerHTML = matched.map(a => `
    <div style="padding: 12px 14px; background: #fff; border: 1px solid #ded5be; border-radius: 3px; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <strong style="font-family: var(--serif); font-size: 13px; color: var(--sea);">${a.name} (Class of '${a.year.slice(2)})</strong>
        <p style="margin: 2px 0 0; font-size: 10px; color: #6d756b;">${a.role} · ${a.fleet}</p>
      </div>
      <span class="trust-badge" style="background:#f4eedb; color:var(--sea); font-size: 8px;">VERIFIED ALUMNUS</span>
    </div>
  `).join("");
}

const btnAlumniJoin = document.querySelector("#btn-alumni-join");
if (btnAlumniJoin) {
  btnAlumniJoin.addEventListener("click", () => {
    renderAlumni();
    openModal("alumni-modal");
  });
}
const footerLinkAlumni = document.querySelector("#footer-link-alumni");
if (footerLinkAlumni) {
  footerLinkAlumni.addEventListener("click", () => {
    renderAlumni();
    openModal("alumni-modal");
  });
}

const alumniSearchInput = document.querySelector("#alumni-search-input");
if (alumniSearchInput) {
  alumniSearchInput.addEventListener("input", (e) => renderAlumni(e.target.value));
}

// Alumni modal tabs
const atabBtnDir = document.querySelector("#atab-btn-dir");
const atabBtnEndow = document.querySelector("#atab-btn-endow");
const atabPaneDir = document.querySelector("#atab-pane-dir");
const atabPaneEndow = document.querySelector("#atab-pane-endow");

if (atabBtnDir && atabBtnEndow) {
  atabBtnDir.addEventListener("click", () => {
    atabBtnDir.classList.add("is-active");
    atabBtnEndow.classList.remove("is-active");
    if (atabPaneDir) atabPaneDir.style.display = "block";
    if (atabPaneEndow) atabPaneEndow.style.display = "none";
  });
  atabBtnEndow.addEventListener("click", () => {
    atabBtnEndow.classList.add("is-active");
    atabBtnDir.classList.remove("is-active");
    if (atabPaneDir) atabPaneDir.style.display = "none";
    if (atabPaneEndow) atabPaneEndow.style.display = "block";
  });
}

const donationForm = document.querySelector("#donation-form");
if (donationForm) {
  donationForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const donor = (document.querySelector("#don-donor")?.value || "Distinguished Mariner").trim();
    const amt = document.querySelector("#don-amount")?.value || "100000";
    const success = document.querySelector("#don-success");
    const msg = document.querySelector("#don-success-msg");
    if (msg) {
      msg.innerHTML = `Thank you, <strong>${donor}</strong>! Your endowment of <strong>₹${Number(amt).toLocaleString('en-IN')}</strong> has been received by the Scholar's Chest. Official 80G Tax Exemption Receipt <strong>#80G-VC-2026-992</strong> has been generated and dispatched to your email.`;
    }
    if (success) success.classList.add("is-visible");
    donationForm.reset();
  });
}

/* ============================================================== */
/* GRIEVANCE, COUNSELLOR, DISCLOSURES & POLICIES MODALS           */
/* ============================================================== */
const btnOpenGrievance = document.querySelector("#btn-open-grievance");
const footerLinkGrievance = document.querySelector("#footer-link-grievance");
if (btnOpenGrievance) btnOpenGrievance.addEventListener("click", () => openModal("grievance-modal"));
if (footerLinkGrievance) footerLinkGrievance.addEventListener("click", () => openModal("grievance-modal"));

const grievanceForm = document.querySelector("#grievance-form");
if (grievanceForm) {
  grievanceForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const success = document.querySelector("#griev-success");
    if (success) success.classList.add("is-visible");
    grievanceForm.reset();
  });
}

const btnOpenCounsellor = document.querySelector("#btn-open-counsellor");
const footerLinkCounsellor = document.querySelector("#footer-link-counsellor");
if (btnOpenCounsellor) btnOpenCounsellor.addEventListener("click", () => openModal("counsellor-modal"));
if (footerLinkCounsellor) footerLinkCounsellor.addEventListener("click", () => openModal("counsellor-modal"));

const counsellorForm = document.querySelector("#counsellor-form");
if (counsellorForm) {
  counsellorForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const success = document.querySelector("#couns-success");
    if (success) success.classList.add("is-visible");
    counsellorForm.reset();
  });
}

const btnViewDisclosures = document.querySelector("#btn-view-disclosures");
const footerLinkDisclosures = document.querySelector("#footer-link-disclosures");
const footerLinkRti = document.querySelector("#footer-link-rti");
if (btnViewDisclosures) btnViewDisclosures.addEventListener("click", () => openModal("disclosure-modal"));
if (footerLinkDisclosures) footerLinkDisclosures.addEventListener("click", () => openModal("disclosure-modal"));
if (footerLinkRti) footerLinkRti.addEventListener("click", () => openModal("disclosure-modal"));

const linkPrivacy = document.querySelector("#link-privacy");
const linkCookies = document.querySelector("#link-cookies");
const linkAccessibility = document.querySelector("#link-accessibility");
const btnCookiePrivacy = document.querySelector("#btn-cookie-privacy");

if (linkPrivacy) linkPrivacy.addEventListener("click", () => openModal("privacy-modal"));
if (linkCookies) linkCookies.addEventListener("click", () => openModal("privacy-modal"));
if (linkAccessibility) linkAccessibility.addEventListener("click", () => openModal("privacy-modal"));
if (btnCookiePrivacy) btnCookiePrivacy.addEventListener("click", () => openModal("privacy-modal"));

// Cookie banner dismiss
const cookieBanner = document.querySelector("#cookie-banner");
const btnCookieAccept = document.querySelector("#btn-cookie-accept");
if (btnCookieAccept && cookieBanner) {
  btnCookieAccept.addEventListener("click", () => {
    cookieBanner.classList.add("is-hidden");
    try { localStorage.setItem("vc_cookies_accepted", "true"); } catch (e) {}
  });
}
try {
  if (localStorage.getItem("vc_cookies_accepted") === "true" && cookieBanner) {
    cookieBanner.classList.add("is-hidden");
  }
} catch (e) {}

// Newsletter signup form
const newsletterForm = document.querySelector("#newsletter-form");
if (newsletterForm) {
  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = document.querySelector("#newsletter-msg");
    if (msg) msg.style.display = "block";
    newsletterForm.reset();
  });
}

/* ============================================================== */
/* VIBE COLLEGE MULTI-PAGE PIRATE ENGINE                          */
/* Shared State, Auth, Animations, Queries & Security Gate       */
/* ============================================================== */

// 1. Session & Auth Helpers
function getAuth() {
  try {
    const raw = localStorage.getItem("vc_currentUser");
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function setAuth(user) {
  try {
    localStorage.setItem("vc_currentUser", JSON.stringify(user));
  } catch (e) {}
}

function clearAuth() {
  try {
    localStorage.removeItem("vc_currentUser");
  } catch (e) {}
}

// 2. Default Seed Data: Queries & Circulars
const DEFAULT_QUERIES = [
  {
    id: "Q-1042",
    studentName: "Cadet Jack Sparrow",
    roll: "VC-2024-TECH-042",
    category: "Academic Exemption",
    title: "Night Watch Waiver for Autonomous Hull Regatta Trials",
    message: "High Admiral Sterling, requesting dispensation from the 21:00 curfew on Thursday to calibrate the subsea lidar in Dock 3 before the fleet trials.",
    urgent: true,
    date: "08 Oct 2026",
    status: "answered",
    captainReply: "Dispensation granted, Cadet Sparrow. The Night Watch Lantern officer has been notified. Maintain safety tether at all times while at the docks. — High Admiral Sterling",
    replyDate: "08 Oct 2026"
  },
  {
    id: "Q-1088",
    studentName: "Cadet Jack Sparrow",
    roll: "VC-2024-TECH-042",
    category: "Research Grant",
    title: "Additional Micro-Sensors for RoboBoat Hull",
    message: "Requesting allocation of 4 ultrasonic hydrophone transducers from Crow's Nest Inventory for our semester capstone project.",
    urgent: false,
    date: "09 Oct 2026",
    status: "pending",
    captainReply: null,
    replyDate: null
  }
];

const DEFAULT_NOTICES = [
  {
    id: "NOT-201",
    title: "Annual Hack-the-Armada Regatta 2026 Registration Open",
    dept: "Office of the High Admiral & Student Fleet Affairs",
    category: "Regatta & Drills",
    date: "09 Oct 2026",
    content: "All pirate crews across computer science, navigation, and nautical design are invited to form teams of 4. Cash bounty of ₹1,50,000 in doubloons!"
  },
  {
    id: "NOT-202",
    title: "End-Term Sea-Trial Examination Timetable Released",
    dept: "Controller of Fleet Examinations",
    category: "Academic Notice",
    date: "07 Oct 2026",
    content: "Theory and practical assessment scrolls are now posted on the Shipmate Deck. Verify your examination berth numbers by 15 Oct."
  }
];

function getStoredQueries() {
  try {
    const raw = localStorage.getItem("vc_queries");
    if (raw) return JSON.parse(raw);
    localStorage.setItem("vc_queries", JSON.stringify(DEFAULT_QUERIES));
    return DEFAULT_QUERIES;
  } catch (e) {
    return DEFAULT_QUERIES;
  }
}

function saveStoredQueries(queries) {
  try {
    localStorage.setItem("vc_queries", JSON.stringify(queries));
  } catch (e) {}
}

function getStoredNotices() {
  try {
    const raw = localStorage.getItem("vc_notices");
    if (raw) return JSON.parse(raw);
    localStorage.setItem("vc_notices", JSON.stringify(DEFAULT_NOTICES));
    return DEFAULT_NOTICES;
  } catch (e) {
    return DEFAULT_NOTICES;
  }
}

function saveStoredNotices(notices) {
  try {
    localStorage.setItem("vc_notices", JSON.stringify(notices));
  } catch (e) {}
}

// ==============================================================
// 3. LOGIN PAGE: THE BOARDING GATE ANIMATED SCENE (login.html)
// ==============================================================
const boardingForm = document.querySelector("#boarding-login-form");
const ropeWrapper = document.querySelector("#rope-wrapper");
const alertFailure = document.querySelector("#alert-failure");
const alertSuccess = document.querySelector("#alert-success");
const successWelcomeMsg = document.querySelector("#success-welcome-msg");
const btnRetryClimb = document.querySelector("#btn-retry-climb");
const btnQuickCadet = document.querySelector("#btn-quick-cadet");
const btnQuickCaptain = document.querySelector("#btn-quick-captain");

function playBoardingSuccess(role, name, roll, rank) {
  if (ropeWrapper) {
    ropeWrapper.classList.remove("is-cutting", "is-severed");
    ropeWrapper.classList.add("is-success");
  }
  if (alertFailure) alertFailure.classList.remove("is-active");
  if (alertSuccess) {
    if (successWelcomeMsg) {
      successWelcomeMsg.textContent = `Permission to board granted! Welcome aboard, ${name} (${rank} · ${roll}). Hoisting the gangplank...`;
    }
    alertSuccess.classList.add("is-active");
  }

  setAuth({ role, name, roll, rank });

  // Play boarding transition and redirect
  setTimeout(() => {
    if (role === "admin") {
      window.location.href = "admin.html";
    } else {
      window.location.href = "student.html";
    }
  }, 2200);
}

function playBoardingFailure() {
  if (ropeWrapper) {
    ropeWrapper.classList.remove("is-success");
    ropeWrapper.classList.add("is-cutting");

    // Blade strikes rope and severs it
    setTimeout(() => {
      ropeWrapper.classList.add("is-severed");
    }, 550);
  }

  if (alertSuccess) alertSuccess.classList.remove("is-active");
  if (alertFailure) {
    setTimeout(() => {
      alertFailure.classList.add("is-active");
    }, 700);
  }
}

function resetBoardingStage() {
  if (ropeWrapper) {
    ropeWrapper.classList.remove("is-cutting", "is-severed", "is-success");
  }
  if (alertFailure) alertFailure.classList.remove("is-active");
  if (alertSuccess) alertSuccess.classList.remove("is-active");
}

if (btnRetryClimb) {
  btnRetryClimb.addEventListener("click", resetBoardingStage);
}

if (btnQuickCadet) {
  btnQuickCadet.addEventListener("click", () => {
    playBoardingSuccess("student", "Cadet Jack Sparrow", "VC-2024-TECH-042", "Quartermaster");
  });
}

if (btnQuickCaptain) {
  btnQuickCaptain.addEventListener("click", () => {
    playBoardingSuccess("admin", "High Admiral Sterling", "VC-ADM-001", "Fleet Commander");
  });
}

if (boardingForm) {
  boardingForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = (document.querySelector("#login-username")?.value || "").trim().toLowerCase();
    const password = (document.querySelector("#login-password")?.value || "").trim();
    const selectedRole = document.querySelector("#login-role")?.value || "student";

    // Authentication verification
    const isCadet = (username === "cadet" || username === "sparrow" || selectedRole === "student") && password === "pirate123";
    const isCaptain = (username === "captain" || username === "sterling" || selectedRole === "admin") && (password === "admin123" || password === "captain123");

    if (isCaptain) {
      playBoardingSuccess("admin", "High Admiral Sterling", "VC-ADM-001", "Fleet Commander");
    } else if (isCadet) {
      playBoardingSuccess("student", "Cadet Jack Sparrow", "VC-2024-TECH-042", "Quartermaster");
    } else {
      playBoardingFailure();
    }
  });
}

// ==============================================================
// 4. STUDENT DECK: FAQS, QUERIES & TABS (student.html)
// ==============================================================
const btnLogout = document.querySelector("#btn-logout");
if (btnLogout) {
  btnLogout.addEventListener("click", () => {
    clearAuth();
    window.location.href = "login.html";
  });
}

// Cadet FAQs Accordion
document.querySelectorAll(".faq-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const parentItem = trigger.closest(".faq-item");
    if (!parentItem) return;
    const isOpen = parentItem.classList.contains("is-open");
    // Close sibling accordions in same group for crisp UX
    const parentGrid = parentItem.closest(".faq-accordion-grid");
    if (parentGrid) {
      parentGrid.querySelectorAll(".faq-item").forEach((item) => {
        item.classList.remove("is-open");
        const btn = item.querySelector(".faq-trigger");
        if (btn) btn.setAttribute("aria-expanded", "false");
      });
    }
    if (!isOpen) {
      parentItem.classList.add("is-open");
      trigger.setAttribute("aria-expanded", "true");
    }
  });
});

// Render Student Query Ledger
function renderStudentQueryHistory() {
  const container = document.querySelector("#student-query-history");
  if (!container) return;

  const queries = getStoredQueries();
  if (!queries || queries.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 28px 12px; color: #889487;">
        <span style="font-size: 32px; display: block; margin-bottom: 8px;">📭</span>
        <p style="margin: 0; font-size: 11px;">No signals dispatched yet. Use the parchment form on the left to petition the Captain!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = queries
    .map((q) => {
      const isAnswered = q.status === "answered";
      const statusBadge = isAnswered
        ? `<span class="query-status-badge query-status-answered">✓ ADMIRAL DISPATCHED REPLY</span>`
        : `<span class="query-status-badge query-status-pending">⏳ PENDING ADMIRAL REVIEW</span>`;
      const urgentBadge = q.urgent
        ? `<span class="trust-badge" style="background: rgba(255,71,87,.2); color: #ff4757; font-size: 8px; margin-left: 6px;">⚡ PRIORITY SIGNAL</span>`
        : ``;

      const replyHtml = isAnswered
        ? `
          <div style="margin-top: 10px; padding: 12px 14px; background: #fffcf2; border-left: 3px solid var(--gold); border-radius: 2px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <strong style="font-size: 10px; color: var(--sea); text-transform: uppercase; letter-spacing: .06em;">
                ⚓ High Admiral's Rescript (${q.replyDate || "Recorded"}):
              </strong>
              <span style="font-size: 9px; color: var(--gold); font-weight: 700;">ADMIRALTY SEAL 🔏</span>
            </div>
            <p style="margin: 0; font-size: 11px; color: #3d433b; line-height: 1.6; font-style: italic;">
              "${q.captainReply}"
            </p>
          </div>
        `
        : `
          <div style="margin-top: 8px; font-size: 10px; color: #889487; display: flex; align-items: center; gap: 6px;">
            <span>⏱ Transmitted to Command Bridge. Awaiting High Admiral's quill...</span>
          </div>
        `;

      return `
        <div class="query-item-card">
          <div class="query-item-head">
            <div>
              <span style="font-size: 9px; color: var(--sea); font-weight: 700; text-transform: uppercase;">${q.category}</span>
              ${urgentBadge}
            </div>
            ${statusBadge}
          </div>
          <h4 style="margin: 0 0 6px; font-family: var(--serif); font-size: 14px; color: var(--sea);">${q.title}</h4>
          <p style="margin: 0; font-size: 11px; color: #5a6258; line-height: 1.5;">${q.message}</p>
          <div style="margin-top: 6px; font-size: 9px; color: #8c9789;">
            Dispatched on: ${q.date} · Ref: ${q.id}
          </div>
          ${replyHtml}
        </div>
      `;
    })
    .join("");
}

// Student Query Form Submission
const cadetQueryForm = document.querySelector("#cadet-query-form");
if (cadetQueryForm) {
  renderStudentQueryHistory();

  cadetQueryForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const cat = document.querySelector("#query-category")?.value || "Academic Exemption";
    const title = (document.querySelector("#query-title")?.value || "").trim();
    const msg = (document.querySelector("#query-message")?.value || "").trim();
    const urgent = !!document.querySelector("#query-urgent")?.checked;

    if (!title || !msg) return;

    const currentAuth = getAuth() || { name: "Cadet Jack Sparrow", roll: "VC-2024-TECH-042" };
    const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

    const newQuery = {
      id: "Q-" + Math.floor(1000 + Math.random() * 9000),
      studentName: currentAuth.name,
      roll: currentAuth.roll,
      category: cat,
      title: title,
      message: msg,
      urgent: urgent,
      date: today,
      status: "pending",
      captainReply: null,
      replyDate: null
    };

    const queries = getStoredQueries();
    queries.unshift(newQuery);
    saveStoredQueries(queries);

    const successNotice = document.querySelector("#query-dispatch-success");
    if (successNotice) {
      successNotice.style.display = "block";
      setTimeout(() => {
        successNotice.style.display = "none";
      }, 4500);
    }

    cadetQueryForm.reset();
    renderStudentQueryHistory();
  });
}

// ==============================================================
// 5. CAPTAIN'S HEADQUARTERS ADMIN DESK (admin.html)
// ==============================================================
const btnAdminLogout = document.querySelector("#btn-admin-logout");
if (btnAdminLogout) {
  btnAdminLogout.addEventListener("click", () => {
    clearAuth();
    window.location.href = "login.html";
  });
}

let adminFilter = "all";
function renderAdminQueries() {
  const container = document.querySelector("#admin-queries-container");
  if (!container) return;

  const queries = getStoredQueries();
  const pendingCount = queries.filter((q) => q.status === "pending").length;
  const pendingBadge = document.querySelector("#admin-pending-count");
  if (pendingBadge) pendingBadge.textContent = `${pendingCount} PENDING`;

  const filtered = adminFilter === "pending"
    ? queries.filter((q) => q.status === "pending")
    : queries;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 36px 14px; color: #a4b5a2;">
        <span style="font-size: 36px; display: block; margin-bottom: 8px;">⚓</span>
        <p style="margin: 0; font-size: 12px;">All cadet petitions in this sector have been resolved. The fleet rests easy!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered
    .map((q) => {
      const isPending = q.status === "pending";
      const urgentBadge = q.urgent
        ? `<span class="trust-badge" style="background: rgba(255,71,87,.2); color: #ff6b81; font-size: 8px;">PRIORITY</span>`
        : ``;

      const actionArea = isPending
        ? `
          <div class="admin-reply-box">
            <label for="reply-${q.id}" style="display: block; font-size: 10px; color: var(--gold); text-transform: uppercase; margin-bottom: 4px;">
              Dispatch High Admiral Decree / Decision:
            </label>
            <textarea id="reply-${q.id}" rows="2" placeholder="State your command or approval for this cadet..."></textarea>
            <button class="button button-gold btn-send-reply" data-qid="${q.id}" style="padding: 6px 14px; font-size: 10px;" type="button">
              📜 Seal & Transmit Decree →
            </button>
          </div>
        `
        : `
          <div style="margin-top: 10px; padding: 10px 14px; background: rgba(241,201,87,.08); border-left: 3px solid var(--gold); border-radius: 2px;">
            <strong style="display: block; font-size: 10px; color: var(--gold); margin-bottom: 2px;">
              Dispatched Decree (${q.replyDate || "Recorded"}):
            </strong>
            <p style="margin: 0; font-size: 11px; color: #f5eedf; font-style: italic;">
              "${q.captainReply}"
            </p>
          </div>
        `;

      return `
        <div style="background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.08); border-radius: 3px; padding: 16px 20px; margin-bottom: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 8px;">
            <div>
              <strong style="color: #fff; font-size: 13px;">${q.studentName}</strong>
              <small style="color: #a4b5a2; margin-left: 8px; font-size: 10px;">Roll: ${q.roll} · Ref: ${q.id}</small>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="trust-badge" style="background: rgba(241,201,87,.15); color: var(--gold); font-size: 9px;">${q.category}</span>
              ${urgentBadge}
              <span class="query-status-badge ${isPending ? "query-status-pending" : "query-status-answered"}">
                ${isPending ? "Pending Review" : "Resolved"}
              </span>
            </div>
          </div>
          <h4 style="margin: 0 0 6px; font-family: var(--serif); font-size: 15px; color: var(--gold);">${q.title}</h4>
          <p style="margin: 0; font-size: 11px; color: #d6ded4; line-height: 1.6;">${q.message}</p>
          <div style="margin-top: 6px; font-size: 9px; color: #889487;">Dispatched by cadet: ${q.date}</div>
          ${actionArea}
        </div>
      `;
    })
    .join("");

  // Attach reply dispatch listeners
  container.querySelectorAll(".btn-send-reply").forEach((btn) => {
    btn.addEventListener("click", () => {
      const qid = btn.dataset.qid;
      const textEl = document.querySelector(`#reply-${qid}`);
      const replyText = textEl?.value?.trim();
      if (!replyText) {
        alert("Please write the Admiral decree before dispatching.");
        return;
      }

      const allQueries = getStoredQueries();
      const target = allQueries.find((item) => item.id === qid);
      if (target) {
        target.status = "answered";
        target.captainReply = replyText;
        target.replyDate = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
        saveStoredQueries(allQueries);
        renderAdminQueries();
      }
    });
  });
}

const btnFilterAll = document.querySelector("#btn-filter-all-queries");
const btnFilterPending = document.querySelector("#btn-filter-pending-queries");
if (btnFilterAll) {
  btnFilterAll.addEventListener("click", () => {
    adminFilter = "all";
    btnFilterAll.classList.replace("button-dark", "button-gold");
    if (btnFilterPending) btnFilterPending.classList.replace("button-gold", "button-dark");
    renderAdminQueries();
  });
}
if (btnFilterPending) {
  btnFilterPending.addEventListener("click", () => {
    adminFilter = "pending";
    btnFilterPending.classList.replace("button-dark", "button-gold");
    if (btnFilterAll) btnFilterAll.classList.replace("button-gold", "button-dark");
    renderAdminQueries();
  });
}

// Admin Circular Broadcast Form
const adminBroadcastForm = document.querySelector("#admin-broadcast-form");
if (adminBroadcastForm) {
  adminBroadcastForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = (document.querySelector("#notice-title")?.value || "").trim();
    const dept = (document.querySelector("#notice-dept")?.value || "").trim();
    const cat = document.querySelector("#notice-category")?.value || "Academic Notice";
    const date = (document.querySelector("#notice-date")?.value || "Today").trim();
    const content = (document.querySelector("#notice-content")?.value || "").trim();

    if (!title || !content) return;

    const notices = getStoredNotices();
    notices.unshift({
      id: "NOT-" + Math.floor(200 + Math.random() * 800),
      title,
      dept,
      category: cat,
      date,
      content
    });
    saveStoredNotices(notices);

    const successNotice = document.querySelector("#broadcast-success");
    if (successNotice) {
      successNotice.style.display = "block";
      setTimeout(() => {
        successNotice.style.display = "none";
      }, 4500);
    }
    adminBroadcastForm.reset();
  });
}

// Initial admin desk render if on admin page
if (document.querySelector("#admin-queries-container")) {
  renderAdminQueries();
}

// Sound quarters & alert fleet action buttons
const btnSoundQuarters = document.querySelector("#btn-sound-quarters");
const btnAlertFleet = document.querySelector("#btn-alert-fleet");
if (btnSoundQuarters) {
  btnSoundQuarters.addEventListener("click", () => {
    alert("🔔 SHIP'S BELL SOUNDED: All Cadet monitors signaled for quarters muster!");
  });
}
if (btnAlertFleet) {
  btnAlertFleet.addEventListener("click", () => {
    alert("🚨 RED MARITIME ADVISORY: Fleet-wide urgent signal transmitted to all consoles!");
  });
}

// ==============================================================
// 6. SECRET TREASURE MAP SECURITY ACCESS GATE (map.html)
// ==============================================================
function initMapSecurity() {
  const lockoutEl = document.querySelector("#portcullis-lockout");
  const securedMapEl = document.querySelector("#secured-map-content");
  if (!lockoutEl || !securedMapEl) return;

  const auth = getAuth();
  if (auth && (auth.role === "student" || auth.role === "admin" || auth.name)) {
    // Member authorized! Raise portcullis
    lockoutEl.style.display = "none";
    securedMapEl.style.display = "block";

    const nameEl = document.querySelector("#member-welcome-name");
    const titleEl = document.querySelector("#member-clearance-title");
    const deckLink = document.querySelector("#member-deck-link");

    if (nameEl) {
      nameEl.textContent = `Logged in as: ${auth.name} (${auth.rank || auth.role} · ${auth.roll || "FLEET-HQ"})`;
    }
    if (titleEl) {
      titleEl.textContent = "CREW IDENTITY VERIFIED · IRON PORTCULLIS RAISED";
    }
    if (deckLink) {
      deckLink.href = auth.role === "admin" ? "admin.html" : "student.html";
      deckLink.textContent = auth.role === "admin" ? "Return to Command Bridge →" : "Return to Student Deck →";
    }
  } else {
    // Unauthenticated guest: Portcullis locked!
    lockoutEl.style.display = "block";
    securedMapEl.style.display = "none";
  }
}

// Wire Map Quick-Unlock and Logout buttons
const btnQuickUnlockCadet = document.querySelector("#btn-quick-unlock-cadet");
const btnQuickUnlockCaptain = document.querySelector("#btn-quick-unlock-captain");
const btnMapLogout = document.querySelector("#btn-map-logout");

if (btnQuickUnlockCadet) {
  btnQuickUnlockCadet.addEventListener("click", () => {
    setAuth({
      role: "student",
      name: "Cadet Jack Sparrow",
      roll: "VC-2024-TECH-042",
      rank: "Quartermaster"
    });
    initMapSecurity();
  });
}

if (btnQuickUnlockCaptain) {
  btnQuickUnlockCaptain.addEventListener("click", () => {
    setAuth({
      role: "admin",
      name: "High Admiral Sterling",
      roll: "VC-ADM-001",
      rank: "Fleet Commander"
    });
    initMapSecurity();
  });
}

if (btnMapLogout) {
  btnMapLogout.addEventListener("click", () => {
    clearAuth();
    initMapSecurity();
  });
}

if (document.querySelector("#portcullis-lockout")) {
  initMapSecurity();
}


