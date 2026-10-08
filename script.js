(function () {
  const root = document.documentElement;

  // Language toggle (remembers choice)
  const roles = {
    en: ["Cyber Security Student", "ML Intrusion Detection", "Penetration Testing", "IT Support & Ops"],
    zh: ["网络安全专业学生", "机器学习入侵检测", "渗透测试", "IT 支持与运维"],
  };
  function setLang(lang) {
    root.dataset.lang = lang;
    root.lang = lang === "zh" ? "zh-CN" : "en";
    try { localStorage.setItem("lang", lang); } catch (e) {}
    restartTyping();
  }
  document.getElementById("langToggle").addEventListener("click", () => {
    setLang(root.dataset.lang === "en" ? "zh" : "en");
  });

  // Typing effect for role line
  const typed = document.getElementById("typed");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let timer;
  function restartTyping() {
    clearTimeout(timer);
    const list = roles[root.dataset.lang] || roles.en;
    if (reduce) { typed.textContent = list[0]; return; }
    let i = 0, pos = 0, deleting = false;
    (function tick() {
      const word = list[i];
      pos += deleting ? -1 : 1;
      typed.textContent = word.slice(0, pos);
      let delay = deleting ? 35 : 70;
      if (!deleting && pos === word.length) { deleting = true; delay = 1800; }
      else if (deleting && pos === 0) { deleting = false; i = (i + 1) % list.length; delay = 300; }
      timer = setTimeout(tick, delay);
    })();
  }

  let saved = null;
  try { saved = localStorage.getItem("lang"); } catch (e) {}
  setLang(saved === "zh" ? "zh" : "en");

  // Mobile menu
  const menuBtn = document.getElementById("menuBtn");
  const navLinks = document.getElementById("navLinks");
  menuBtn.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open);
  });
  navLinks.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    })
  );

  // Highlight current section in nav
  const links = [...navLinks.querySelectorAll("a")];
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + e.target.id));
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  document.querySelectorAll("main section[id]").forEach((s) => spy.observe(s));

  // Reveal cards on scroll
  const items = document.querySelectorAll(".card, .stat");
  if ("IntersectionObserver" in window && !reduce) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
      });
    }, { threshold: 0.08 });
    items.forEach((el) => { el.classList.add("reveal"); io.observe(el); });
  }

  // Email: mailto does nothing without a desktop mail app, so also copy + offer Gmail
  const email = "adrianlwb@gmail.com";
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.setAttribute("role", "status");
  document.body.appendChild(toast);
  let toastTimer;
  document.getElementById("emailLink").addEventListener("click", () => {
    const zh = root.dataset.lang === "zh";
    const gmail = "https://mail.google.com/mail/?view=cm&fs=1&to=" + email;
    const copied = navigator.clipboard ? navigator.clipboard.writeText(email) : Promise.reject();
    const show = (ok) => {
      toast.innerHTML =
        (ok ? (zh ? "已复制邮箱：" : "Copied ") : "") + "<b>" + email + "</b>" +
        ' · <a href="' + gmail + '" target="_blank" rel="noopener">' + (zh ? "用 Gmail 发送" : "Open in Gmail") + "</a>";
      toast.classList.add("show");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove("show"), 6000);
    };
    copied.then(() => show(true), () => show(false));
  });

  document.getElementById("year").textContent = new Date().getFullYear();
})();
