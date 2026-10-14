export function initPageInteractions() {
  document.documentElement.classList.add("js");
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (prefersReducedMotion) {
    document.documentElement.classList.add("reduced-motion");
  } else {
    document.documentElement.classList.remove("reduced-motion");
  }

  const aborter = new AbortController();
  const { signal } = aborter;
  const header = document.getElementById("site-header");
  const onScroll = () => {
    header?.classList.toggle("scrolled", window.scrollY > 60);
  };
  window.addEventListener("scroll", onScroll, { passive: true, signal });
  onScroll();

  const menu = document.getElementById("mobile-menu");
  const closeMenu = () => {
    menu?.classList.remove("open");
    document.body.style.overflow = "";
    document.getElementById("hamburger-btn")?.setAttribute("aria-expanded", "false");
  };
  const openMenu = () => {
    menu?.classList.add("open");
    document.body.style.overflow = "hidden";
    document.getElementById("hamburger-btn")?.setAttribute("aria-expanded", "true");
  };
  document.getElementById("hamburger-btn")?.addEventListener("click", openMenu, { signal });
  document.getElementById("mobile-menu-close")?.addEventListener("click", closeMenu, { signal });
  menu?.querySelectorAll("nav a").forEach((link) =>
    link.addEventListener("click", closeMenu, { signal }),
  );
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  }, { signal });

  document.querySelectorAll<HTMLElement>(".faq-item .summary, .faq-item .faq-q").forEach((question) => {
    question.addEventListener("click", () => {
      const item = question.closest<HTMLElement>(".faq-item");
      const answer = item?.querySelector<HTMLElement>(".answer, .faq-a");
      if (!item || !answer) return;
      const willOpen = !item.classList.contains("open");
      document.querySelectorAll<HTMLElement>(".faq-item.open").forEach((other) => {
        if (other !== item) {
          other.classList.remove("open");
          const otherAnswer = other.querySelector<HTMLElement>(".answer, .faq-a");
          if (otherAnswer) otherAnswer.style.maxHeight = "0";
        }
      });
      item.classList.toggle("open", willOpen);
      answer.style.maxHeight = willOpen ? `${answer.scrollHeight + 40}px` : "0";
    }, { signal });
  });

  const revealElements = document.querySelectorAll<HTMLElement>(".animate-in");
  let observer: IntersectionObserver | undefined;
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("visible"));
  } else if (revealElements.length) {
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer?.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealElements.forEach((element) => observer?.observe(element));
  }

  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
      }
    }, { signal });
  });

  const form = document.querySelector<HTMLFormElement>("form.contact-form");
  const successMessage = form?.querySelector<HTMLElement>(".form-success");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    let valid = true;
    form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input[required], textarea[required]").forEach((input) => {
      if (!input.value.trim()) {
        valid = false;
        input.style.borderColor = "#D93333";
      }
    });
    if (valid && successMessage) {
      successMessage.style.display = "block";
      form.reset();
      window.setTimeout(() => { successMessage.style.display = "none"; }, 5000);
    }
  }, { signal });

  return () => {
    aborter.abort();
    observer?.disconnect();
    document.body.style.overflow = "";
  };
}
