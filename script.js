const navLinks = [...document.querySelectorAll("#mainNav .nav-link")];

const revealTargets = document.querySelectorAll(
  ".hero-image, .hobby-card, .journal-row, #schedule .schedule-day-card, #profile .profile-sheet",
);
revealTargets.forEach((element) => element.classList.add("reveal-on-scroll"));

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      }),
    { threshold: 0.08 },
  );
  revealTargets.forEach((element) => revealObserver.observe(element));
} else {
  revealTargets.forEach((element) => element.classList.add("is-visible"));
}

const menu = document.getElementById("mainNav");
const themeButtons = document.querySelectorAll("[data-theme]");

function setTheme(theme) {
  document.documentElement.setAttribute("data-bs-theme", theme);
  themeButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.theme === theme));
  });
}

setTheme(document.documentElement.getAttribute("data-bs-theme") || "light");

themeButtons.forEach((button) => {
  button.addEventListener("click", () => setTheme(button.dataset.theme));
});

function markActive(id) {
  navLinks.forEach((link) => {
    const active = link.getAttribute("href") === "#" + id;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
}

navLinks.forEach((link) =>
  link.addEventListener("click", () => {
    markActive(link.hash.slice(1));
    if (window.bootstrap && menu.classList.contains("show")) {
      bootstrap.Collapse.getOrCreateInstance(menu, { toggle: false }).hide();
    }
  }),
);

markActive(location.hash.slice(1) || "hero");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible.length) markActive(visible[0].target.id);
    },
    { rootMargin: "-15% 0px -45% 0px", threshold: [0, 0.1, 0.5] },
  );
  document.querySelectorAll("main > section").forEach((section) => observer.observe(section));
}

const dateTime = document.getElementById("currentDateTime");

function updateDateTime() {
  dateTime.dateTime = new Date().toISOString();
  dateTime.textContent = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "full",
    timeStyle: "medium",
    timeZone: "Asia/Jakarta",
  }).format(new Date());
}

updateDateTime();
window.setInterval(updateDateTime, 1000);

const scrollToTopButton = document.getElementById("scrollToTop");

function updateScrollToTopVisibility() {
  scrollToTopButton.classList.toggle("is-visible", window.scrollY > 300);
}

window.addEventListener("scroll", updateScrollToTopVisibility, { passive: true });
updateScrollToTopVisibility();

scrollToTopButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
