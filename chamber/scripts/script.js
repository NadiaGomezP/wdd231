let daynames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let d = new Date();
  let dayName = daynames[d.getDay()];
  let monthName = months[d.getMonth()];
  let fulldate =
    dayName +
    ", " +
    monthName +
    " " +
    d.getDate() +
    ", " +
    d.getFullYear();

  document.querySelector(".currentyear").innerHTML = d.getFullYear();

  let oLastModif = new Date(document.lastModified);
  document.getElementById("lastModified").dateTime = oLastModif.toISOString();
  document.getElementById("lastModified").textContent = oLastModif.toLocaleString();

    const tiempoTranscurrido = Date.now();
    const hoy = new Date(tiempoTranscurrido);
    const ahora = hoy.toDateString();

    const todayDate = document.getElementById("today-date");
    if (todayDate) {
      todayDate.textContent = ahora;
    }


  function openDrawerMenu(){
    var x = document.getElementById("mainNavBar");
    if (x.className === "navBar"){
      x.className += " responsive";
    } else {
      x.className = "navBar";
    }
  }
  
  
    let n = new Date();
    let q = n.getDay();
  
    const announcement = document.getElementById("announcement");
    if (announcement) {
      announcement.style.display = q === 1 || q === 2 ? "block" : "none";
    }

    const images = document.querySelectorAll("[data-src]");

function preloadImage(img) {
  const src = img.getAttribute("data-src");
  if (!src) {
    return;
  }

  img.src = src;
  img.removeAttribute("data-src");
}

const imgOptions = {
  threshold: 1,
  rootMargin: "0px 0px 200px 0px",
};

const imgObserver = new IntersectionObserver((entries, imgObserver) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      return;
    } else {
      preloadImage(entry.target);
      imgObserver.unobserve(entry.target);
    }
  });
}, imgOptions);

images.forEach((image) => {
  imgObserver.observe(image);
});


const countDisplay = document.querySelector(".visits");
const lastVisit = Number(window.localStorage.getItem("last-visit"));


  const day= Date.now();

  let difference = day - lastVisit;

  let roundedDays = (difference/1000/60/60/24).toFixed(0);

  localStorage.setItem("last-visit", day);

    
  if (countDisplay) {
    countDisplay.textContent = roundedDays;
  }

const menuToggle = document.querySelector("#mobile-menu-toggle");
const navigation = document.querySelector("#mainNavBar");
if (menuToggle && navigation) {
  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation" : "Close navigation");
    navigation.classList.toggle("is-open", !isExpanded);
  });
}

const themeToggle = document.querySelector("#theme-toggle");
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-theme");
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
  });
}

  const gridbutton = document.querySelector("#grid");
  const listbutton = document.querySelector("#list");
  const display = document.querySelector("#member-cards");

  if (gridbutton && listbutton && display) {
    gridbutton.addEventListener("click", () => setDirectoryView("grid"));
    listbutton.addEventListener("click", () => setDirectoryView("list"));
  }

function setDirectoryView(view) {
  const cards = document.querySelector("#member-cards");
  const gridButton = document.querySelector("#grid");
  const listButton = document.querySelector("#list");
  const isGrid = view === "grid";
  cards.classList.toggle("grid", isGrid);
  cards.classList.toggle("list", !isGrid);
  gridButton.setAttribute("aria-pressed", String(isGrid));
  listButton.setAttribute("aria-pressed", String(!isGrid));
}

function createMemberDetail(label, value, href) {
  const detail = document.createElement(href ? "a" : "p");
  const labelElement = document.createElement("strong");
  labelElement.textContent = `${label}: `;
  detail.append(labelElement, document.createTextNode(value));

  if (href) {
    detail.href = href;
  }

  return detail;
}

async function loadDirectory() {
  const cards = document.querySelector("#member-cards");
  const status = document.querySelector("#directory-status");

  try {
    const response = await fetch("./data/members.json");
    if (!response.ok) {
      throw new Error(`Member data request failed with status ${response.status}.`);
    }

    const members = await response.json();
    if (!Array.isArray(members)) {
      throw new TypeError("Member data must be an array.");
    }

    cards.replaceChildren(...members.map((member) => {
      const card = document.createElement("section");
      card.className = "member-card";

      const cardHeading = document.createElement("div");
      cardHeading.className = "member-card-heading";

      const name = document.createElement("h2");
      name.textContent = member.name;

      const tagline = document.createElement("p");
      tagline.textContent = member.description;
      cardHeading.append(name, tagline);

      const content = document.createElement("div");
      content.className = "member-card-content";

      const image = document.createElement("img");
      image.src = `./images/${member.image}`;
      image.alt = `${member.name}`;
      image.loading = "lazy";

      const details = document.createElement("div");
      details.className = "member-card-details";

      const email = createMemberDetail("Email", member.email, `mailto:${member.email}`);
      const phone = createMemberDetail(
        "Phone",
        member.phone,
        `tel:${member.phone.replace(/[^\d+]/g, "")}`
      );
      const address = createMemberDetail("Address", member.address);

      const membershipNames = { 1: "Member", 2: "Silver", 3: "Gold" };
      const membership = createMemberDetail(
        "Membership",
        membershipNames[member.membershipLevel]
      );
      membership.className = `membership membership-${member.membershipLevel}`;

      const link = document.createElement("a");
      link.href = member.website;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      const websiteLabel = document.createElement("strong");
      websiteLabel.textContent = "Website: ";
      link.append(
        websiteLabel,
        document.createTextNode(member.website.replace(/^https?:\/\//, "").replace(/\/$/, ""))
      );

      details.append(email, phone, address, link, membership);
      content.append(image, details);
      card.append(cardHeading, content);
      return card;
    }));
    if (status) {
      status.textContent = `${members.length} chamber members`;
    }
  } catch (error) {
    console.error("Unable to load chamber members:", error);
    if (status) {
      status.textContent = "The member directory could not be loaded. Please try again later.";
      status.classList.add("directory-error");
    }
  }
}

if (document.querySelector("#member-cards")) {
  loadDirectory();
}