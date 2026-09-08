import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const toggle = document.querySelector(".motion-toggle");
let userPaused = false;
try {
  userPaused = localStorage.getItem("portfolio-motion") === "off";
} catch {}
let motionContext;
let observer;
const sceneControllers = new Set();
const pauseRequested = () => userPaused || reduced.matches;

function setupMotion() {
  motionContext?.revert();
  const paused = pauseRequested();
  document.body.classList.toggle("motion-paused", paused);
  toggle.hidden = false;
  toggle.textContent = reduced.matches
    ? "Reduced motion"
    : paused
      ? "Motion off"
      : "Motion on";
  toggle.disabled = reduced.matches;
  toggle.setAttribute("aria-pressed", String(paused));
  toggle.setAttribute(
    "aria-label",
    reduced.matches
      ? "Reduced motion is enabled by your device"
      : paused
        ? "Motion off. Enable decorative motion"
        : "Motion on. Pause decorative motion",
  );
  sceneControllers.forEach((controller) => controller.setPaused(paused));
  if (paused) {
    gsap.killTweensOf("#policy-result");
    gsap.set("#policy-result", { clearProps: "opacity,transform" });
    return;
  }
  document
    .querySelectorAll("[data-scene]:not([data-scene-initialized])")
    .forEach((node) => observer?.observe(node));
  motionContext = gsap.matchMedia();
  motionContext.add(
    {
      desktop: "(min-width: 1024px)",
      canPin: "(min-width: 1024px) and (min-height: 950px)",
      all: "(min-width: 1px)",
    },
    (ctx) => {
      const desktop = ctx.conditions.desktop;
      gsap.from(".hero h1 span", {
        y: 35,
        stagger: 0.1,
        duration: 1.05,
        ease: "power3.out",
        clearProps: "opacity,transform",
      });
      gsap.to(".hero-art", {
        yPercent: 16,
        scale: 1.09,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      for (const node of document.querySelectorAll(".reveal")) {
        gsap.from(node, {
          y: desktop ? 42 : 20,
          opacity: 0.7,
          duration: 0.85,
          ease: "power2.out",
          scrollTrigger: { trigger: node, start: "top 91%", once: true },
          clearProps: "opacity,transform",
        });
      }
      gsap.to(".origin-image img", {
        yPercent: 7,
        scale: 1.06,
        ease: "none",
        scrollTrigger: {
          trigger: ".origin",
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
      if (desktop) {
        const chapters = gsap.utils.toArray(".chapter");
        chapters.forEach((chapter, index) => {
          if (
            index === chapters.length - 1 ||
            !ctx.conditions.canPin ||
            chapter.offsetHeight > innerHeight
          )
            return;
          ScrollTrigger.create({
            trigger: chapter,
            start: "top top",
            endTrigger: chapters.at(-1),
            end: "top top",
            pin: true,
            pinSpacing: false,
          });
          gsap.to(chapter.querySelector(".chapter-inner"), {
            scale: 0.95,
            opacity: 0.3,
            transformOrigin: "center top",
            ease: "none",
            scrollTrigger: {
              trigger: chapters[index + 1],
              start: "top bottom",
              end: "top top",
              scrub: true,
            },
          });
        });
        gsap.fromTo(
          ".main-screen",
          { rotationY: 10, rotationX: 8, y: 55 },
          {
            rotationY: 0,
            rotationX: 0,
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: ".chapter-product",
              start: "top 80%",
              end: "top 5%",
              scrub: 1,
            },
          },
        );
        gsap.fromTo(
          ".side-screen",
          { y: 100, rotationY: -15 },
          {
            y: 0,
            rotationY: -5,
            ease: "none",
            scrollTrigger: {
              trigger: ".chapter-product",
              start: "top 70%",
              end: "center center",
              scrub: 1,
            },
          },
        );
      }
      const lineTween = gsap.to(".map-trace", {
        strokeDashoffset: -490,
        duration: 5,
        repeat: -1,
        ease: "none",
        paused: true,
      });
      ScrollTrigger.create({
        trigger: ".system-map",
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) =>
          self.isActive ? lineTween.play() : lineTween.pause(),
      });
    },
  );
  document.fonts.ready.then(() => ScrollTrigger.refresh());
}
toggle.addEventListener("click", () => {
  if (reduced.matches) {
    // System reduced-motion preference remains authoritative.
    userPaused = true;
  } else userPaused = !userPaused;
  try {
    localStorage.setItem("portfolio-motion", userPaused ? "off" : "on");
  } catch {}
  setupMotion();
});
reduced.addEventListener("change", setupMotion);
setupMotion();

document
  .querySelectorAll(".decision-list details")
  .forEach((detail) =>
    detail.addEventListener("toggle", () => ScrollTrigger.refresh()),
  );
const result = document.querySelector("#policy-result");
document.querySelector(".policy-controls").hidden = false;
document.querySelector(".policy-fallback").hidden = true;
const decisions = {
  v1: [
    "Specialist review",
    "The source contains “refund”, so the keyword rule escalates a request that explicitly asks for no refund.",
  ],
  v2: [
    "Standard human review",
    "The saved model response gives reviewReason: none. The request is for an invoice, so this policy does not send it to specialist review.",
  ],
};
document.querySelectorAll("[data-policy]").forEach((button) =>
  button.addEventListener("click", () => {
    const policy = button.dataset.policy;
    document
      .querySelectorAll("[data-policy]")
      .forEach((peer) =>
        peer.setAttribute("aria-pressed", String(peer === button)),
      );
    result.querySelector(".decision-name").textContent = decisions[policy][0];
    result.querySelector(".decision-explanation").textContent =
      decisions[policy][1];
    if (!pauseRequested())
      gsap.fromTo(
        result,
        { y: 7 },
        { y: 0, duration: 0.3, clearProps: "transform" },
      );
  }),
);

// 3D is progressive enhancement, imported only when a scene approaches the viewport.
let sceneModule;
observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      if (pauseRequested() || navigator.connection?.saveData) continue;
      observer.unobserve(entry.target);
      entry.target.dataset.sceneInitialized = "true";
      sceneModule ??= import("./scenes.js");
      sceneModule
        .then(({ createScene }) => {
          const controller = createScene(entry.target, {
            paused: pauseRequested(),
          });
          if (controller) sceneControllers.add(controller);
        })
        .catch(() => {
          /* The static artwork remains visible if 3D cannot load. */
        });
    }
  },
  { rootMargin: "250px" },
);
document
  .querySelectorAll("[data-scene]")
  .forEach((node) => observer.observe(node));
window.addEventListener("pagehide", () => {
  sceneControllers.forEach((controller) => controller.setPaused(true));
});
window.addEventListener("pageshow", () => {
  sceneControllers.forEach((controller) =>
    controller.setPaused(pauseRequested()),
  );
});
