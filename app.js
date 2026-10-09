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
    keywords: ["cafe", "café", "food", "club", "event", "crew", "friends", "life"],
    title: "Find your crew",
    description: "See what’s happening beyond the classroom.",
    href: "#events",
  },
  {
    keywords: ["campus", "library", "hall", "quad", "garden", "map", "dock"],
    title: "Explore the campus",
    description: "Ask Polly for a map and find your next destination.",
    href: "#locator",
  },
  {
    keywords: ["apply", "admission", "admissions", "enrol", "enroll", "join"],
    title: "Your next chapter",
    description: "Find out how to come aboard Vibe College.",
    href: "#apply",
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
