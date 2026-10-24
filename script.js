/* =========================================================
   Joshua Barrera — Portfolio
   Theme, navigation, scroll reveals, project carousel.
   ========================================================= */

(function () {
  "use strict";

  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Theme ---------- */

  const THEME_KEY = "jb-theme";
  const themeToggle = document.getElementById("themeToggle");
  const themeColor = document.querySelector('meta[name="theme-color"]');

  function applyTheme(theme, persist) {
    const isLight = theme === "light";
    root.setAttribute("data-theme", isLight ? "light" : "dark");

    if (themeToggle) {
      themeToggle.setAttribute("aria-pressed", String(isLight));
      themeToggle.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
    }

    if (themeColor) {
      themeColor.setAttribute("content", isLight ? "#f4f8fb" : "#070b12");
    }

    if (persist) {
      try {
        localStorage.setItem(THEME_KEY, isLight ? "light" : "dark");
      } catch (err) {
        /* Storage can be unavailable in private mode. */
      }
    }
  }

  let storedTheme = null;
  try {
    storedTheme = localStorage.getItem(THEME_KEY);
  } catch (err) {
    storedTheme = null;
  }

  applyTheme(storedTheme === "light" ? "light" : "dark", false);

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      applyTheme(next, true);
    });
  }

  /* ---------- Header + mobile nav ---------- */

  const header = document.getElementById("siteHeader");
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("nav");
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));

  function onScroll() {
    if (header) {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    }
  }

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  function closeMenu() {
    if (!nav || !menuToggle) return;
    nav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
    document.body.classList.remove("nav-open");
  }

  function openMenu() {
    if (!nav || !menuToggle) return;
    nav.classList.add("is-open");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close menu");
    document.body.classList.add("nav-open");
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", function () {
      if (nav.classList.contains("is-open")) closeMenu();
      else openMenu();
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeMenu();
    });

    document.addEventListener("click", function (event) {
      if (!nav.classList.contains("is-open")) return;
      if (nav.contains(event.target) || menuToggle.contains(event.target)) return;
      closeMenu();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 760) closeMenu();
    });
  }

  /* Active navigation link */

  const sectionIds = ["about", "skills", "projects", "contact"];
  const sections = sectionIds
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          navLinks.forEach(function (link) {
            link.classList.toggle(
              "is-active",
              link.getAttribute("href") === "#" + entry.target.id
            );
          });
        });
      },
      { rootMargin: "-42% 0px -52% 0px", threshold: 0 }
    );

    sections.forEach(function (section) { navObserver.observe(section); });
  }

  /* ---------- Scroll reveals ---------- */

  const revealItems = Array.from(document.querySelectorAll(".reveal"));

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach(function (item) { item.classList.add("is-visible"); });
  } else {
    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealItems.forEach(function (item) { revealObserver.observe(item); });
  }

  /* ---------- Project carousel ---------- */

  const carousel = document.getElementById("projectCarousel");
  const viewport = document.getElementById("carouselViewport");
  const track = document.getElementById("carouselTrack");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const dotsWrap = document.getElementById("carouselDots");
  const currentLabel = document.getElementById("slideCurrent");
  const totalLabel = document.getElementById("slideTotal");
  const autoplayBtn = document.getElementById("autoplayBtn");
  const progress = document.getElementById("carouselProgress");
  const status = document.getElementById("carouselStatus");

  if (carousel && viewport && track) {
    const slides = Array.from(track.children);
    const total = slides.length;
    const SLIDE_MS = 8000;

    let index = 0;
    let playing = !reduceMotion;
    let hovering = false;
    let timer = null;

    function pad(number) {
      return String(number).padStart(2, "0");
    }

    if (totalLabel) totalLabel.textContent = pad(total);

    /* Build dots */
    const dots = slides.map(function (slide, i) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "carousel-dot";
      dot.setAttribute("aria-label", "Go to project " + (i + 1));
      dot.addEventListener("click", function () {
        goTo(i);
        restartTimer();
      });
      if (dotsWrap) dotsWrap.appendChild(dot);
      return dot;
    });

    function restartProgress() {
      if (!progress) return;
      progress.classList.remove("is-running", "is-paused");
      /* Force a reflow so the animation restarts. */
      void progress.offsetWidth;
      progress.classList.add("is-running");
      if (!playing || hovering || document.hidden) {
        progress.classList.add("is-paused");
      }
    }

    function restartTimer() {
      window.clearTimeout(timer);
      timer = null;

      if (!playing || hovering || document.hidden) {
        if (progress) progress.classList.add("is-paused");
        return;
      }

      restartProgress();
      timer = window.setTimeout(function () {
        goTo(index + 1);
        restartTimer();
      }, SLIDE_MS);
    }

    function goTo(nextIndex, announce) {
      index = ((nextIndex % total) + total) % total;

      track.style.transform = "translate3d(-" + index * 100 + "%, 0, 0)";

      slides.forEach(function (slide, i) {
        const active = i === index;
        slide.setAttribute("aria-hidden", String(!active));
        if (active) {
          slide.removeAttribute("inert");
        } else {
          slide.setAttribute("inert", "");
        }
      });

      const slideName = (slides[index].getAttribute("aria-label") || "").replace(/^\d+ of \d+:\s*/, "");

      dots.forEach(function (dot, i) {
        const active = i === index;
        dot.classList.toggle("is-active", active);
        if (active) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
      });

      if (currentLabel) currentLabel.textContent = pad(index + 1);

      if (viewport) {
        viewport.setAttribute("aria-label", "Project " + (index + 1) + " of " + total + ": " + slideName + ". Use the left and right arrow keys to navigate.");
      }

      if (announce && status) {
        status.textContent = "Project " + (index + 1) + " of " + total + ": " + slideName;
      }
    }

    function setPlaying(next) {
      playing = next;
      if (autoplayBtn) {
        autoplayBtn.setAttribute("aria-pressed", String(playing));
        autoplayBtn.setAttribute("aria-label", playing ? "Pause automatic slideshow" : "Play automatic slideshow");
        const label = autoplayBtn.querySelector(".autoplay-label");
        if (label) label.textContent = playing ? "Pause" : "Play";
      }
      if (playing) restartTimer();
      else {
        window.clearTimeout(timer);
        timer = null;
        if (progress) progress.classList.add("is-paused");
      }
    }

    if (prevBtn) prevBtn.addEventListener("click", function () { goTo(index - 1, true); restartTimer(); });
    if (nextBtn) nextBtn.addEventListener("click", function () { goTo(index + 1, true); restartTimer(); });

    if (autoplayBtn) {
      autoplayBtn.addEventListener("click", function () { setPlaying(!playing); });
    }

    /* Keyboard support */
    viewport.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goTo(index - 1, true);
        restartTimer();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goTo(index + 1, true);
        restartTimer();
      } else if (event.key === "Home") {
        event.preventDefault();
        goTo(0, true);
        restartTimer();
      } else if (event.key === "End") {
        event.preventDefault();
        goTo(total - 1, true);
        restartTimer();
      }
    });

    /* Pause while hovered or focused */
    function suspend() {
      hovering = true;
      window.clearTimeout(timer);
      timer = null;
      if (progress) progress.classList.add("is-paused");
    }

    function resume() {
      hovering = false;
      restartTimer();
    }

    carousel.addEventListener("mouseenter", suspend);
    carousel.addEventListener("mouseleave", resume);
    carousel.addEventListener("focusin", suspend);
    carousel.addEventListener("focusout", function (event) {
      if (!carousel.contains(event.relatedTarget)) resume();
    });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        window.clearTimeout(timer);
        timer = null;
        if (progress) progress.classList.add("is-paused");
      } else {
        resume();
      }
    });

    /* Touch / pointer swipe */
    let pointerStartX = 0;
    let pointerStartY = 0;
    let tracking = false;

    viewport.addEventListener("pointerdown", function (event) {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      if (event.target.closest("a, button")) return;
      pointerStartX = event.clientX;
      pointerStartY = event.clientY;
      tracking = true;
    });

    viewport.addEventListener("pointerup", function (event) {
      if (!tracking) return;
      tracking = false;
      const dx = event.clientX - pointerStartX;
      const dy = event.clientY - pointerStartY;

      if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.4) return;

      if (dx < 0) goTo(index + 1, true);
      else goTo(index - 1, true);
      restartTimer();
    });

    viewport.addEventListener("pointercancel", function () { tracking = false; });

    /* Initial state */
    goTo(0);
    setPlaying(playing);
    if (playing) restartTimer();
  }

  /* ---------- Contact form ---------- */

  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    const endpoint = contactForm.getAttribute("data-endpoint");
    const submitBtn = document.getElementById("contactSubmit");
    const submitLabel = submitBtn ? submitBtn.querySelector(".contact-submit-label") : null;
    const formStatus = document.getElementById("formStatus");
    const defaultLabel = submitLabel ? submitLabel.textContent : "Send message";

    function setFormStatus(message, type) {
      if (!formStatus) return;
      formStatus.textContent = message;
      formStatus.classList.remove("is-success", "is-error");
      if (type) formStatus.classList.add("is-" + type);
    }

    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!contactForm.reportValidity()) return;

      const honey = contactForm.querySelector('[name="_honey"]');
      if (honey && honey.value.trim()) return;

      if (!endpoint) {
        setFormStatus("The form is unavailable. Please email me directly.", "error");
        return;
      }

      const payload = {};
      new FormData(contactForm).forEach(function (value, key) {
        payload[key] = value;
      });

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add("is-loading");
      }
      if (submitLabel) submitLabel.textContent = "Sending…";
      setFormStatus("Sending your message…", "");

      fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then(function (response) {
          return response.json().catch(function () { return {}; }).then(function (data) {
            return { ok: response.ok, data: data };
          });
        })
        .then(function (result) {
          const message = String(result.data.message || result.data.error || "");
          const activated = !/activation/i.test(message);
          const succeeded =
            result.ok &&
            activated &&
            result.data.success !== false &&
            result.data.success !== "false";

          if (!succeeded) {
            throw new Error(message || "Message could not be delivered.");
          }

          contactForm.reset();
          setFormStatus("Thanks — your message is on its way. I'll reply to the email you shared.", "success");
          showToast("Message sent — thank you!");
        })
        .catch(function (error) {
          const detail = String(error && error.message ? error.message : "");
          if (/activation/i.test(detail)) {
            setFormStatus("The form is waiting for one-time activation. Please email me directly at joshuabarrera659@gmail.com for now.", "error");
          } else {
            setFormStatus("I couldn't send that from here. Please email me directly at joshuabarrera659@gmail.com.", "error");
          }
          showToast("Message not sent — direct email is available below.");
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.classList.remove("is-loading");
          }
          if (submitLabel) submitLabel.textContent = defaultLabel;
        });
    });
  }

  /* ---------- Copy email ---------- */

  const copyBtn = document.getElementById("copyEmail");
  const toast = document.getElementById("toast");
  const toastTimeout = { id: null };

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimeout.id);
    toastTimeout.id = window.setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 2200);
  }

  function legacyCopy(text) {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (err) {
      ok = false;
    }
    document.body.removeChild(area);
    return ok;
  }

  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      const email = copyBtn.getAttribute("data-email") || "";
      const label = copyBtn.querySelector("span");
      const done = function (success) {
        if (!success) {
          showToast("Couldn't copy — email is " + email);
          return;
        }
        copyBtn.classList.add("is-copied");
        if (label) label.textContent = "Copied!";
        showToast("Email copied to clipboard");
        window.setTimeout(function () {
          copyBtn.classList.remove("is-copied");
          if (label) label.textContent = "Copy email";
        }, 2200);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(function () { done(true); }, function () {
          done(legacyCopy(email));
        });
      } else {
        done(legacyCopy(email));
      }
    });
  }

  /* ---------- Footer year ---------- */

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
