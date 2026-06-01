const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const navAnchors = document.querySelectorAll(".nav-links a");
const currentPage = document.body.dataset.page;

navToggle?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navAnchors.forEach((anchor) => {
  anchor.classList.toggle("active", anchor.dataset.nav === currentPage);

  anchor.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

const siliconVisual = document.querySelector(".silicon-visual");

if (siliconVisual) {
  const maxTilt = 6;

  siliconVisual.addEventListener("mousemove", (event) => {
    const rect = siliconVisual.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    const tiltY = (x - 0.5) * (maxTilt * 2);
    const tiltX = (0.5 - y) * (maxTilt * 2);

    siliconVisual.style.setProperty("--tilt-x", `${tiltX.toFixed(2)}deg`);
    siliconVisual.style.setProperty("--tilt-y", `${tiltY.toFixed(2)}deg`);
    siliconVisual.style.setProperty("--shadow-x", `${(tiltY * 0.8).toFixed(2)}px`);
    siliconVisual.style.setProperty("--shadow-y", `${(-tiltX * 0.8).toFixed(2)}px`);
  });

  siliconVisual.addEventListener("mouseleave", () => {
    siliconVisual.style.setProperty("--tilt-x", "0deg");
    siliconVisual.style.setProperty("--tilt-y", "0deg");
    siliconVisual.style.setProperty("--shadow-x", "0px");
    siliconVisual.style.setProperty("--shadow-y", "0px");
  });
}
