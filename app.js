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
let revealTimer;

for (const place of places) {
  const option = document.createElement("option");
  option.value = place.name;
  datalist.append(option);
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
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    nav.classList.remove("is-open");
  });
});
