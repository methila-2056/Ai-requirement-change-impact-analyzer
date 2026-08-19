document.addEventListener("DOMContentLoaded", () => {
  initFlashMessages();
  initDropdowns();
  initMobileNav();
  initNavbarScroll();
  initThemeToggle();

  const uploadZone = document.getElementById("uploadZone");
  if (uploadZone) initUploadZone();
});

/* ===== Flash Messages ===== */
function initFlashMessages() {
  document.querySelectorAll(".flash").forEach((flash) => {
    setTimeout(() => {
      flash.style.opacity = "0";
      flash.style.transform = "translateX(40px)";
      setTimeout(() => flash.remove(), 300);
    }, 4000);
  });
}

/* ===== Dropdowns ===== */
function initDropdowns() {
  document.querySelectorAll(".nav-dropdown").forEach((dropdown) => {
    const trigger = dropdown.querySelector(".nav-avatar");
    if (!trigger) return;

    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      document.querySelectorAll(".nav-dropdown").forEach((d) => {
        if (d !== dropdown) d.classList.remove("open");
      });
      dropdown.classList.toggle("open");
    });
  });

  document.addEventListener("click", () => {
    document.querySelectorAll(".nav-dropdown").forEach((d) => d.classList.remove("open"));
  });
}

/* ===== Mobile Navigation ===== */
function initMobileNav() {
  const hamburger = document.getElementById("navHamburger");
  const mobileNav = document.getElementById("mobileNav") || createMobileNav();
  const overlay = document.getElementById("mobileOverlay") || createOverlay();

  if (hamburger) {
    hamburger.addEventListener("click", () => {
      mobileNav.classList.add("active");
      overlay.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  }

  if (overlay) {
    overlay.addEventListener("click", closeMobileNav);
  }

  document.querySelectorAll(".mobile-nav-link").forEach((link) => {
    link.addEventListener("click", closeMobileNav);
  });
}

function closeMobileNav() {
  const mobileNav = document.querySelector(".mobile-nav");
  const overlay = document.querySelector(".mobile-overlay");
  if (mobileNav) mobileNav.classList.remove("active");
  if (overlay) overlay.classList.remove("active");
  document.body.style.overflow = "";
}

function createMobileNav() {
  const nav = document.createElement("div");
  nav.className = "mobile-nav";
  nav.id = "mobileNav";

  const isAuth = document.querySelector(".nav-dropdown") !== null;

  let linksHTML = "";
  if (isAuth) {
    linksHTML = `
      <a href="/dashboard" class="mobile-nav-link">
        <i class="icon-layout-dashboard"></i> Dashboard
      </a>
      <a href="/history" class="mobile-nav-link">
        <i class="icon-clock"></i> History
      </a>
      <a href="/profile" class="mobile-nav-link">
        <i class="icon-settings"></i> Profile
      </a>
      <div class="mobile-nav-divider"></div>
      <a href="/logout" class="mobile-nav-link danger">
        <i class="icon-log-out"></i> Sign Out
      </a>
    `;
  } else {
    linksHTML = `
      <a href="/login" class="mobile-nav-link">
        <i class="icon-log-in"></i> Sign In
      </a>
      <a href="/register" class="mobile-nav-link primary">
        <i class="icon-rocket"></i> Get Started
      </a>
    `;
  }

  nav.innerHTML = `
    <div class="mobile-nav-header">
      <a href="/" class="nav-brand">
        <div class="nav-brand-icon"><i class="icon-zap"></i></div>
        <span>SIA</span>
      </a>
      <button class="nav-hamburger" onclick="closeMobileNav()" aria-label="Close">
        <span></span><span></span><span></span>
      </button>
    </div>
    <div class="mobile-nav-links">${linksHTML}</div>
  `;

  document.body.appendChild(nav);
  return nav;
}

function createOverlay() {
  const overlay = document.createElement("div");
  overlay.className = "mobile-overlay";
  overlay.id = "mobileOverlay";
  document.body.appendChild(overlay);
  return overlay;
}

/* ===== Theme Toggle ===== */
function initThemeToggle() {
  const toggle = document.getElementById("themeToggle");
  if (!toggle) return;

  const saved = localStorage.getItem("theme") || "dark";
  if (saved === "light") {
    document.body.classList.add("light");
    toggle.innerHTML = '<i class="icon-moon"></i>';
  }

  toggle.addEventListener("click", () => {
    const isLight = document.body.classList.toggle("light");
    localStorage.setItem("theme", isLight ? "light" : "dark");
    toggle.innerHTML = isLight ? '<i class="icon-moon"></i>' : '<i class="icon-sun"></i>';
  });
}

/* ===== Navbar Scroll Effect ===== */
function initNavbarScroll() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  let lastScroll = 0;
  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 20) {
      navbar.style.borderBottomColor = "rgba(28, 32, 53, 0.8)";
    } else {
      navbar.style.borderBottomColor = "";
    }
    lastScroll = currentScroll;
  });
}

/* ===== Upload Zone ===== */
function initUploadZone() {
  const uploadZone = document.getElementById("uploadZone");
  const fileInput = document.getElementById("fileInput");
  const btnAnalyze = document.getElementById("btnAnalyze");
  const fileChosen = document.getElementById("fileChosen");
  const chosenName = document.getElementById("chosenFileName");
  const errorBox = document.getElementById("errorBox");

  if (!uploadZone || !fileInput) return;

  uploadZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadZone.classList.add("dragover");
  });

  uploadZone.addEventListener("dragleave", () => {
    uploadZone.classList.remove("dragover");
  });

  uploadZone.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadZone.classList.remove("dragover");
    const files = e.dataTransfer.files;
    if (files.length > 0) handleFileSelect(files[0]);
  });

  uploadZone.addEventListener("click", (e) => {
    if (e.target.closest(".file-chosen-remove")) return;
    fileInput.click();
  });

  fileInput.addEventListener("change", () => {
    if (fileInput.files.length > 0) handleFileSelect(fileInput.files[0]);
  });

  function handleFileSelect(file) {
    if (!file.name.toLowerCase().endsWith(".xml")) {
      showError("Only .xml files are accepted.");
      return;
    }
    hideError();
    window._selectedFile = file;
    chosenName.textContent = file.name;
    fileChosen.classList.add("show");
    btnAnalyze.disabled = false;
    btnAnalyze.style.animation = "pulse 0.3s ease";
  }

  if (btnAnalyze) {
    btnAnalyze.addEventListener("click", runAnalysis);
  }
}

/* ===== Analysis ===== */
let _reportText = "";
let _reportFile = "";

async function runAnalysis() {
  const file = window._selectedFile;
  if (!file) return;

  const btnAnalyze = document.getElementById("btnAnalyze");
  const loadingDiv = document.getElementById("loadingDiv");
  const results = document.getElementById("results");
  const errorBox = document.getElementById("errorBox");

  hideError();
  btnAnalyze.disabled = true;
  loadingDiv.classList.add("show");
  results.classList.remove("show");

  animateLoadingSteps();

  const formData = new FormData();
  formData.append("xmlfile", file);

  try {
    const res = await fetch("/analyze", { method: "POST", body: formData });
    const data = await res.json();

    loadingDiv.classList.remove("show");

    if (data.error) {
      showError(data.error);
      btnAnalyze.disabled = false;
      return;
    }

    renderResults(data);
  } catch (err) {
    loadingDiv.classList.remove("show");
    showError("Network error. Make sure the server is running.");
    btnAnalyze.disabled = false;
  }
}

function animateLoadingSteps() {
  const steps = ["step1", "step2", "step3"];
  let current = 0;

  function advance() {
    if (current >= steps.length) return;
    const el = document.getElementById(steps[current]);
    if (el) {
      el.classList.add("active");
      if (current > 0) {
        const prev = document.getElementById(steps[current - 1]);
        if (prev) {
          prev.classList.remove("active");
          prev.classList.add("done");
        }
      }
    }
    current++;
    if (current < steps.length) setTimeout(advance, 800);
  }

  advance();
}

function renderResults(data) {
  const impact = data.impact;
  const results = document.getElementById("results");

  document.getElementById("resultsFileName").textContent = data.filename;

  const riskColors = { HIGH: "risk-HIGH", MEDIUM: "risk-MEDIUM", LOW: "risk-LOW", UNKNOWN: "risk-UNKNOWN" };

  document.getElementById("riskBadge").innerHTML =
    '<span class="risk-badge ' + riskColors[impact.risk_level] + '">' +
    '<i class="icon-shield"></i> ' + impact.risk_level + " RISK</span>";

  document.getElementById("statsRow").innerHTML =
    '<div class="stat-card">' +
      '<div class="stat-icon"><i class="icon-activity"></i></div>' +
      '<div class="stat-label">Risk Score</div>' +
      '<div class="stat-value">' + impact.risk_score + '</div>' +
      '<div class="stat-unit">points</div>' +
    '</div>' +
    '<div class="stat-card">' +
      '<div class="stat-icon"><i class="icon-layers"></i></div>' +
      '<div class="stat-label">Components Hit</div>' +
      '<div class="stat-value">' + impact.total_components + '</div>' +
      '<div class="stat-unit">modules affected</div>' +
    '</div>' +
    '<div class="stat-card">' +
      '<div class="stat-icon"><i class="icon-clock"></i></div>' +
      '<div class="stat-label">Effort (Normal)</div>' +
      '<div class="stat-value">' + impact.effort_days + '</div>' +
      '<div class="stat-unit">' + impact.effort_hrs + ' man-hours</div>' +
    '</div>' +
    '<div class="stat-card">' +
      '<div class="stat-icon"><i class="icon-zap"></i></div>' +
      '<div class="stat-label">Fast Delivery</div>' +
      '<div class="stat-value">' + impact.fast_delivery_days + '</div>' +
      '<div class="stat-unit">days (2-person team)</div>' +
    '</div>';

  const list = document.getElementById("componentsList");
  if (impact.components.length === 0) {
    list.innerHTML = '<div class="empty-components">No standard components detected. Manual review recommended.</div>';
  } else {
    list.innerHTML = impact.components.map(function (c, i) {
      var dotClass = c.risk >= 3 ? "dot-HIGH" : c.risk === 2 ? "dot-MED" : "dot-LOW";
      return '<div class="component-row" style="animation-delay:' + (i * 0.04) + 's">' +
        '<span class="comp-dot ' + dotClass + '"></span>' +
        '<span class="comp-name">' + c.name + '</span>' +
        '<span class="comp-keyword">' + c.keyword + '</span>' +
        '<span class="comp-effort">+' + c.effort_days + 'd / ' + c.effort_hrs + 'h</span>' +
      '</div>';
    }).join("");
  }

  document.getElementById("clientNote").textContent = impact.client_note;

  _reportText = data.report_text;
  _reportFile = data.report_file;
  document.getElementById("reportPre").textContent = _reportText;

  results.classList.add("show");
  results.scrollIntoView({ behavior: "smooth", block: "start" });
}

function copyReport() {
  navigator.clipboard.writeText(_reportText).then(() => {
    const btn = document.querySelector(".btn-copy");
    if (!btn) return;
    const original = btn.innerHTML;
    btn.innerHTML = '<i class="icon-check"></i> Copied!';
    setTimeout(() => { btn.innerHTML = original; }, 2000);
  });
}

function downloadReport() {
  if (!_reportText) return;
  const blob = new Blob([_reportText], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "impact_report.txt";
  a.click();
}

function resetTool() {
  window._selectedFile = null;
  const fileInput = document.getElementById("fileInput");
  const fileChosen = document.getElementById("fileChosen");
  const btnAnalyze = document.getElementById("btnAnalyze");
  const results = document.getElementById("results");
  const loadingDiv = document.getElementById("loadingDiv");

  if (fileInput) fileInput.value = "";
  if (fileChosen) fileChosen.classList.remove("show");
  if (btnAnalyze) btnAnalyze.disabled = true;
  if (results) results.classList.remove("show");
  if (loadingDiv) loadingDiv.classList.remove("show");
  hideError();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showError(msg) {
  const errorBox = document.getElementById("errorBox");
  if (errorBox) {
    errorBox.innerHTML = '<i class="icon-alert-circle"></i> ' + msg;
    errorBox.classList.add("show");
  }
}

function hideError() {
  const errorBox = document.getElementById("errorBox");
  if (errorBox) errorBox.classList.remove("show");
}

/* ===== Password Strength ===== */
function checkPasswordStrength(password) {
  const fill = document.getElementById("strengthFill");
  const text = document.getElementById("strengthText");
  if (!fill || !text) return;

  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const levels = [
    { width: "0%", color: "transparent", label: "", textColor: "transparent" },
    { width: "20%", color: "var(--red)", label: "Very Weak", textColor: "var(--red)" },
    { width: "40%", color: "var(--orange)", label: "Weak", textColor: "var(--orange)" },
    { width: "60%", color: "var(--orange)", label: "Fair", textColor: "var(--orange)" },
    { width: "80%", color: "var(--green)", label: "Strong", textColor: "var(--green)" },
    { width: "100%", color: "var(--green)", label: "Very Strong", textColor: "var(--green)" },
  ];

  const level = levels[score] || levels[0];
  fill.style.width = level.width;
  fill.style.background = level.color;
  text.textContent = level.label;
  text.style.color = level.textColor;
}

/* ===== Toggle Password Visibility ===== */
function togglePassword(btn) {
  const input = btn.parentElement.querySelector("input");
  if (!input) return;

  const icon = btn.querySelector("i");
  if (input.type === "password") {
    input.type = "text";
    if (icon) { icon.className = "icon-eye-off"; }
  } else {
    input.type = "password";
    if (icon) { icon.className = "icon-eye"; }
  }
}
