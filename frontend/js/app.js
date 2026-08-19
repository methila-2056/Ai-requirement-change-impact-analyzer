/* ===== Config & Auth ===== */
const DEFAULT_API = "https://strategic-impact-analyzer.onrender.com";

function getApiBase() {
  return localStorage.getItem("api_url") || DEFAULT_API;
}

function getToken() {
  return localStorage.getItem("token");
}

function getUser() {
  try { return JSON.parse(localStorage.getItem("user")); }
  catch { return null; }
}

function setAuth(token, user) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

function requireAuth() {
  if (!getToken()) {
    window.location.href = "/login.html";
    return false;
  }
  return true;
}

/* ===== API Helper ===== */
const API = {
  async request(method, path, body, isForm) {
    const headers = {};
    const token = getToken();
    if (token) headers["Authorization"] = "Bearer " + token;
    if (!isForm) headers["Content-Type"] = "application/json";

    const opts = { method, headers };
    if (body) opts.body = isForm ? body : JSON.stringify(body);

    const res = await fetch(getApiBase() + path, opts);
    const data = await res.json();
    if (!res.ok) throw { status: res.status, ...data };
    return data;
  },
  get(p) { return this.request("GET", p); },
  post(p, b, f) { return this.request("POST", p, b, f); },
  put(p, b) { return this.request("PUT", p, b); },
  del(p) { return this.request("DELETE", p); },
};

/* ===== Toast Notifications ===== */
function toast(msg, type) {
  let c = document.getElementById("toastContainer");
  if (!c) {
    c = document.createElement("div");
    c.id = "toastContainer";
    c.style.cssText = "position:fixed;top:80px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:10px;pointer-events:none;";
    document.body.appendChild(c);
  }
  const el = document.createElement("div");
  const colors = { success: "#22c55e", error: "#ef4444", info: "#5b6ef5" };
  el.style.cssText = `pointer-events:auto;padding:14px 20px;border-radius:12px;color:#fff;font-size:14px;font-weight:500;display:flex;align-items:center;gap:8px;backdrop-filter:blur(12px);box-shadow:0 8px 32px rgba(0,0,0,0.3);animation:slideIn .3s ease;max-width:380px;background:${colors[type] || colors.info};`;
  const icons = { success: "icon-check-circle", error: "icon-alert-circle", info: "icon-info" };
  el.innerHTML = `<i class="${icons[type] || icons.info}"></i><span>${msg}</span>`;
  c.appendChild(el);
  setTimeout(() => { el.style.opacity = "0"; el.style.transform = "translateX(40px)"; el.style.transition = "all .3s"; setTimeout(() => el.remove(), 300); }, 3500);
}

/* ===== Loading Spinner ===== */
function showLoading() {
  const el = document.getElementById("loadingDiv");
  if (el) el.classList.add("show");
}

function hideLoading() {
  const el = document.getElementById("loadingDiv");
  if (el) el.classList.remove("show");
  ["step1", "step2", "step3"].forEach((id, i) => {
    const s = document.getElementById(id);
    if (s) { s.classList.remove("active", "done"); if (i === 0) s.classList.add("active"); }
  });
}

function animateSteps() {
  const ids = ["step1", "step2", "step3"];
  let cur = 0;
  function advance() {
    if (cur >= ids.length) return;
    const el = document.getElementById(ids[cur]);
    if (el) {
      el.classList.add("active");
      if (cur > 0) { const p = document.getElementById(ids[cur - 1]); if (p) { p.classList.remove("active"); p.classList.add("done"); } }
    }
    cur++;
    if (cur < ids.length) setTimeout(advance, 900);
  }
  advance();
}

/* ===== Error Box ===== */
function showError(msg) {
  const el = document.getElementById("errorBox");
  if (el) { el.innerHTML = `<i class="icon-alert-circle"></i> ${msg}`; el.classList.add("show"); }
}

function hideError() {
  const el = document.getElementById("errorBox");
  if (el) el.classList.remove("show");
}

/* ===== Theme Toggle ===== */
function initTheme() {
  const toggle = document.getElementById("themeToggle");
  if (!toggle) return;
  const saved = localStorage.getItem("theme") || "dark";
  if (saved === "light") { document.body.classList.add("light"); toggle.innerHTML = '<i class="icon-moon"></i>'; }
  toggle.addEventListener("click", () => {
    const isLight = document.body.classList.toggle("light");
    localStorage.setItem("theme", isLight ? "light" : "dark");
    toggle.innerHTML = isLight ? '<i class="icon-moon"></i>' : '<i class="icon-sun"></i>';
  });
}

/* ===== Mobile Nav ===== */
function initMobileNav() {
  const hamburger = document.getElementById("navHamburger");
  if (!hamburger) return;
  let overlay = document.getElementById("mobileOverlay");
  let mobileNav = document.getElementById("mobileNav");
  if (!overlay) { overlay = document.createElement("div"); overlay.id = "mobileOverlay"; overlay.className = "mobile-overlay"; document.body.appendChild(overlay); }
  if (!mobileNav) {
    mobileNav = document.createElement("div"); mobileNav.id = "mobileNav"; mobileNav.className = "mobile-nav";
    const isAuth = !!getToken();
    const links = isAuth
      ? `<a href="/dashboard.html" class="mobile-nav-link"><i class="icon-layout-dashboard"></i> Dashboard</a><a href="/history.html" class="mobile-nav-link"><i class="icon-clock"></i> History</a><a href="/profile.html" class="mobile-nav-link"><i class="icon-settings"></i> Profile</a><div class="mobile-nav-divider"></div><a href="#" class="mobile-nav-link danger" id="mobileLogout"><i class="icon-log-out"></i> Sign Out</a>`
      : `<a href="/login.html" class="mobile-nav-link"><i class="icon-log-in"></i> Sign In</a><a href="/register.html" class="mobile-nav-link primary"><i class="icon-rocket"></i> Get Started</a>`;
    mobileNav.innerHTML = `<div class="mobile-nav-header"><a href="/index.html" class="nav-brand"><div class="nav-brand-icon"><i class="icon-zap"></i></div><span>SIA</span></a><button class="nav-hamburger" id="mobileNavClose" aria-label="Close"><span></span><span></span><span></span></button></div><div class="mobile-nav-links">${links}</div>`;
    document.body.appendChild(mobileNav);
    const closeBtn = document.getElementById("mobileNavClose");
    if (closeBtn) closeBtn.addEventListener("click", closeMobileNav);
    overlay.addEventListener("click", closeMobileNav);
    const logoutBtn = document.getElementById("mobileLogout");
    if (logoutBtn) logoutBtn.addEventListener("click", (e) => { e.preventDefault(); clearAuth(); window.location.href = "/login.html"; });
  }
  hamburger.addEventListener("click", () => { mobileNav.classList.add("active"); overlay.classList.add("active"); document.body.style.overflow = "hidden"; });
}

function closeMobileNav() {
  const nav = document.getElementById("mobileNav");
  const ov = document.getElementById("mobileOverlay");
  if (nav) nav.classList.remove("active");
  if (ov) ov.classList.remove("active");
  document.body.style.overflow = "";
}

/* ===== Dropdown ===== */
function initDropdown() {
  document.querySelectorAll(".nav-dropdown").forEach((dd) => {
    const trigger = dd.querySelector(".nav-avatar");
    if (!trigger) return;
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      document.querySelectorAll(".nav-dropdown").forEach((d) => { if (d !== dd) d.classList.remove("open"); });
      dd.classList.toggle("open");
    });
  });
  document.addEventListener("click", () => document.querySelectorAll(".nav-dropdown").forEach((d) => d.classList.remove("open")));
}

/* ===== Settings Modal (API URL) ===== */
function initSettings() {
  const btn = document.getElementById("settingsBtn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    let modal = document.getElementById("settingsModal");
    if (modal) { modal.classList.add("show"); return; }
    modal = document.createElement("div");
    modal.id = "settingsModal";
    modal.className = "modal-overlay show";
    modal.innerHTML = `<div class="modal-card"><div class="modal-header"><h3><i class="icon-settings"></i> API Settings</h3><button class="modal-close" id="settingsClose"><i class="icon-x"></i></button></div><div class="modal-body"><label class="form-label">Backend API URL</label><input class="form-input" type="url" id="apiUrlInput" value="${getApiBase()}" placeholder="https://..."><p class="form-help">Change only if you self-host the backend.</p></div><div class="modal-footer"><button class="btn btn-primary" id="settingsSave">Save</button></div></div>`;
    document.body.appendChild(modal);
    document.getElementById("settingsClose").addEventListener("click", () => modal.classList.remove("show"));
    modal.addEventListener("click", (e) => { if (e.target === modal) modal.classList.remove("show"); });
    document.getElementById("settingsSave").addEventListener("click", () => {
      const val = document.getElementById("apiUrlInput").value.trim().replace(/\/+$/, "");
      if (val) localStorage.setItem("api_url", val);
      modal.classList.remove("show");
      toast("API URL updated", "success");
    });
  });
}

/* ===== Nav User Info ===== */
async function loadNavUser() {
  const nameEl = document.getElementById("navUserName");
  const emailEl = document.getElementById("navUserEmail");
  const avatarEls = document.querySelectorAll(".nav-avatar, .dropdown-avatar");
  if (!nameEl && !avatarEls.length) return;
  try {
    const user = await API.get("/api/me");
    localStorage.setItem("user", JSON.stringify(user));
    const display = user.full_name || user.username;
    const initial = display[0].toUpperCase();
    if (nameEl) nameEl.textContent = display;
    if (emailEl) emailEl.textContent = user.email;
    avatarEls.forEach((el) => { el.textContent = initial; el.title = display; });
  } catch { /* ignore */ }
}

/* ===== Password Helpers ===== */
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
    { w: "0%", c: "transparent", l: "", tc: "transparent" },
    { w: "20%", c: "var(--red)", l: "Very Weak", tc: "var(--red)" },
    { w: "40%", c: "var(--orange)", l: "Weak", tc: "var(--orange)" },
    { w: "60%", c: "var(--orange)", l: "Fair", tc: "var(--orange)" },
    { w: "80%", c: "var(--green)", l: "Strong", tc: "var(--green)" },
    { w: "100%", c: "var(--green)", l: "Very Strong", tc: "var(--green)" },
  ];
  const lv = levels[score] || levels[0];
  fill.style.width = lv.w;
  fill.style.background = lv.c;
  text.textContent = lv.l;
  text.style.color = lv.tc;
}

function togglePassword(btn) {
  const input = btn.parentElement.querySelector("input");
  if (!input) return;
  const icon = btn.querySelector("i");
  if (input.type === "password") { input.type = "text"; if (icon) icon.className = "icon-eye-off"; }
  else { input.type = "password"; if (icon) icon.className = "icon-eye"; }
}

function bindPasswordToggles() {
  document.querySelectorAll(".input-icon-btn").forEach((btn) => {
    btn.addEventListener("click", () => togglePassword(btn));
  });
}

function bindPasswordStrength() {
  const pw = document.getElementById("password");
  if (pw) pw.addEventListener("input", () => checkPasswordStrength(pw.value));
}

/* ===== Analysis Result Helpers ===== */
function renderResults(data) {
  const impact = data.impact;
  const results = document.getElementById("results");
  const riskColors = { HIGH: "risk-HIGH", MEDIUM: "risk-MEDIUM", LOW: "risk-LOW" };
  document.getElementById("resultsFileName").textContent = data.filename;
  document.getElementById("riskBadge").innerHTML = `<span class="risk-badge ${riskColors[impact.risk_level] || ""}"><i class="icon-shield"></i> ${impact.risk_level} RISK</span>`;
  document.getElementById("statsRow").innerHTML = `
    <div class="stat-card"><div class="stat-icon"><i class="icon-activity"></i></div><div class="stat-label">Risk Score</div><div class="stat-value">${impact.risk_score}</div><div class="stat-unit">points</div></div>
    <div class="stat-card"><div class="stat-icon"><i class="icon-layers"></i></div><div class="stat-label">Components Hit</div><div class="stat-value">${impact.total_components}</div><div class="stat-unit">modules affected</div></div>
    <div class="stat-card"><div class="stat-icon"><i class="icon-clock"></i></div><div class="stat-label">Effort (Normal)</div><div class="stat-value">${impact.effort_days}</div><div class="stat-unit">${impact.effort_hrs} man-hours</div></div>
    <div class="stat-card"><div class="stat-icon"><i class="icon-zap"></i></div><div class="stat-label">Fast Delivery</div><div class="stat-value">${impact.fast_delivery_days}</div><div class="stat-unit">days (2-person team)</div></div>`;
  const list = document.getElementById("componentsList");
  if (impact.components.length === 0) {
    list.innerHTML = '<div class="empty-components">No standard components detected. Manual review recommended.</div>';
  } else {
    list.innerHTML = impact.components.map((c, i) => {
      const dot = c.risk >= 3 ? "dot-HIGH" : c.risk === 2 ? "dot-MED" : "dot-LOW";
      return `<div class="component-row" style="animation-delay:${i * 0.04}s"><span class="comp-dot ${dot}"></span><span class="comp-name">${c.name}</span><span class="comp-keyword">${c.keyword}</span><span class="comp-effort">+${c.effort_days}d / ${c.effort_hrs}h</span></div>`;
    }).join("");
  }
  document.getElementById("clientNote").textContent = impact.client_note;
  window._reportText = data.report_text || "";
  document.getElementById("reportPre").textContent = window._reportText;
  results.classList.add("show");
  results.scrollIntoView({ behavior: "smooth", block: "start" });
}

function copyReport() {
  if (!window._reportText) return;
  navigator.clipboard.writeText(window._reportText).then(() => {
    const btn = document.querySelector(".btn-copy");
    if (!btn) return;
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="icon-check"></i> Copied!';
    setTimeout(() => { btn.innerHTML = orig; }, 2000);
  });
}

function downloadReport() {
  if (!window._reportText) return;
  const blob = new Blob([window._reportText], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "impact_report.txt";
  a.click();
}

function resetTool() {
  window._selectedFile = null;
  const fi = document.getElementById("fileInput");
  const fc = document.getElementById("fileChosen");
  const btn = document.getElementById("btnAnalyze");
  const res = document.getElementById("results");
  if (fi) fi.value = "";
  if (fc) fc.classList.remove("show");
  if (btn) btn.disabled = true;
  if (res) res.classList.remove("show");
  hideLoading();
  hideError();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ===== Page: Login ===== */
function initLogin() {
  const form = document.getElementById("loginForm");
  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideError();
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<i class="icon-loader" style="animation:spin .6s linear infinite"></i> Signing in...';
    try {
      const data = await API.post("/api/login", {
        username: form.username.value.trim(),
        password: form.password.value,
      });
      setAuth(data.token, data.user);
      toast("Welcome back!", "success");
      window.location.href = "/dashboard.html";
    } catch (err) {
      showError(err.error || "Login failed");
      btn.disabled = false;
      btn.innerHTML = '<i class="icon-log-in"></i> Sign In';
    }
  });
}

/* ===== Page: Register ===== */
function initRegister() {
  const form = document.getElementById("registerForm");
  if (!form) return;
  bindPasswordStrength();
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideError();
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<i class="icon-loader" style="animation:spin .6s linear infinite"></i> Creating account...';
    try {
      await API.post("/api/register", {
        username: form.username.value.trim(),
        email: form.email.value.trim(),
        full_name: form.full_name.value.trim(),
        password: form.password.value,
        confirm_password: form.confirm_password.value,
      });
      toast("Account created! Please sign in.", "success");
      window.location.href = "/login.html";
    } catch (err) {
      const msgs = err.errors ? err.errors.join("<br>") : (err.error || "Registration failed");
      showError(msgs);
      btn.disabled = false;
      btn.innerHTML = '<i class="icon-rocket"></i> Create Account';
    }
  });
}

/* ===== Page: Forgot Password ===== */
function initForgotPassword() {
  const form = document.getElementById("forgotForm");
  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideError();
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<i class="icon-loader" style="animation:spin .6s linear infinite"></i> Sending...';
    try {
      const data = await API.post("/api/forgot-password", { email: form.email.value.trim() });
      toast(data.message || "Reset link sent", "success");
      btn.innerHTML = '<i class="icon-check"></i> Sent!';
    } catch (err) {
      showError(err.error || "Something went wrong");
      btn.disabled = false;
      btn.innerHTML = '<i class="icon-send"></i> Generate Reset Link';
    }
  });
}

/* ===== Page: Reset Password ===== */
function initResetPassword() {
  const form = document.getElementById("resetForm");
  if (!form) return;
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  if (!token) { showError("Invalid reset link — no token found."); return; }
  bindPasswordStrength();
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideError();
    if (form.password.value !== form.confirm_password.value) {
      showError("Passwords do not match");
      return;
    }
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<i class="icon-loader" style="animation:spin .6s linear infinite"></i> Resetting...';
    try {
      await API.post(`/api/reset-password/${token}`, {
        password: form.password.value,
        confirm_password: form.confirm_password.value,
      });
      toast("Password reset successful!", "success");
      setTimeout(() => { window.location.href = "/login.html"; }, 1500);
    } catch (err) {
      showError(err.error || "Reset failed");
      btn.disabled = false;
      btn.innerHTML = '<i class="icon-check-circle"></i> Reset Password';
    }
  });
}

/* ===== Page: Dashboard ===== */
function initDashboard() {
  const uploadZone = document.getElementById("uploadZone");
  if (!uploadZone) return;

  loadNavUser();

  const fileInput = document.getElementById("fileInput");
  const btnAnalyze = document.getElementById("btnAnalyze");
  const fileChosen = document.getElementById("fileChosen");
  const chosenName = document.getElementById("chosenFileName");

  uploadZone.addEventListener("dragover", (e) => { e.preventDefault(); uploadZone.classList.add("dragover"); });
  uploadZone.addEventListener("dragleave", () => uploadZone.classList.remove("dragover"));
  uploadZone.addEventListener("drop", (e) => { e.preventDefault(); uploadZone.classList.remove("dragover"); if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]); });
  uploadZone.addEventListener("click", (e) => { if (!e.target.closest(".file-chosen-remove")) fileInput.click(); });
  fileInput.addEventListener("change", () => { if (fileInput.files.length) handleFile(fileInput.files[0]); });

  function handleFile(file) {
    if (!file.name.toLowerCase().endsWith(".xml")) { showError("Only .xml files are accepted."); return; }
    hideError();
    window._selectedFile = file;
    chosenName.textContent = file.name;
    fileChosen.classList.add("show");
    btnAnalyze.disabled = false;
  }

  btnAnalyze.addEventListener("click", async () => {
    const file = window._selectedFile;
    if (!file) return;
    hideError();
    btnAnalyze.disabled = true;
    showLoading();
    animateSteps();
    document.getElementById("results").classList.remove("show");

    const fd = new FormData();
    fd.append("xmlfile", file);

    try {
      const data = await API.post("/api/analyze", fd, true);
      hideLoading();
      renderResults(data);
      btnAnalyze.disabled = false;
      loadDashboardStats();
    } catch (err) {
      hideLoading();
      showError(err.error || "Analysis failed");
      btnAnalyze.disabled = false;
    }
  });

  async function loadDashboardStats() {
    try {
      const d = await API.get("/api/dashboard");
      document.getElementById("statTotal").textContent = d.total_analyses;
      document.getElementById("statHigh").textContent = d.high_risk_count;
      const since = d.member_since ? new Date(d.member_since).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "N/A";
      document.getElementById("statSince").textContent = since;
      renderRecent(d.recent);
    } catch { /* ignore */ }
  }

  function renderRecent(items) {
    const tbody = document.getElementById("recentBody");
    const section = document.getElementById("recentSection");
    if (!items || items.length === 0) { if (section) section.style.display = "none"; return; }
    if (section) section.style.display = "";
    if (!tbody) return;
    tbody.innerHTML = items.map((a) => {
      const date = a.created_at ? new Date(a.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "";
      const fname = a.filename.length > 30 ? a.filename.slice(0, 30) + "..." : a.filename;
      return `<tr><td class="filename">${fname}</td><td><span class="risk-pill ${a.risk_level}">${a.risk_level}</span></td><td class="mono">${a.risk_score}</td><td class="mono">${a.effort_days}d / ${a.effort_hrs}h</td><td class="text-muted">${date}</td></tr>`;
    }).join("");
  }

  loadDashboardStats();
}

/* ===== Page: History ===== */
function initHistory() {
  let currentPage = 1;

  async function loadPage(page) {
    try {
      const d = await API.get("/api/history?page=" + page);
      currentPage = d.page;
      renderTable(d.items);
      renderPagination(d);
    } catch { toast("Failed to load history", "error"); }
  }

  function renderTable(items) {
    const tbody = document.getElementById("historyBody");
    const emptyState = document.getElementById("emptyState");
    const tableWrap = document.getElementById("historyTableWrap");
    if (!items.length) { if (tableWrap) tableWrap.style.display = "none"; if (emptyState) emptyState.style.display = ""; return; }
    if (tableWrap) tableWrap.style.display = ""; if (emptyState) emptyState.style.display = "none";
    tbody.innerHTML = items.map((a) => {
      const date = a.created_at ? new Date(a.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "";
      const fname = a.filename.length > 28 ? a.filename.slice(0, 28) + "..." : a.filename;
      return `<tr><td class="filename"><i class="icon-file-text" style="margin-right:6px;opacity:0.5;"></i>${fname}</td><td><span class="risk-pill ${a.risk_level}">${a.risk_level}</span></td><td class="mono">${a.risk_score}</td><td class="mono">${a.total_components}</td><td class="mono">${a.effort_days}d / ${a.effort_hrs}h</td><td class="text-muted">${date}</td><td><div class="table-actions"><a href="/view-analysis.html?id=${a.id}" class="btn btn-ghost btn-xs"><i class="icon-eye"></i> View</a><button class="btn btn-ghost btn-xs danger delete-btn" data-id="${a.id}"><i class="icon-trash-2"></i></button></div></td></tr>`;
    }).join("");
    tbody.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (!confirm("Are you sure you want to delete this analysis?")) return;
        try {
          await API.del("/api/history/" + btn.dataset.id);
          toast("Analysis deleted", "success");
          loadPage(currentPage);
        } catch { toast("Delete failed", "error"); }
      });
    });
  }

  function renderPagination(d) {
    const el = document.getElementById("pagination");
    if (!el || d.pages <= 1) { if (el) el.innerHTML = ""; return; }
    let html = "";
    if (d.has_prev) html += `<button class="pagination-btn" data-page="${d.page - 1}"><i class="icon-chevron-left"></i> Prev</button>`;
    for (let i = 1; i <= d.pages; i++) {
      html += `<button class="pagination-btn ${i === d.page ? "active" : ""}" data-page="${i}">${i}</button>`;
    }
    if (d.has_next) html += `<button class="pagination-btn" data-page="${d.page + 1}">Next <i class="icon-chevron-right"></i></button>`;
    el.innerHTML = html;
    el.querySelectorAll(".pagination-btn").forEach((btn) => {
      btn.addEventListener("click", () => loadPage(parseInt(btn.dataset.page)));
    });
  }

  loadPage(1);
}

/* ===== Page: View Analysis ===== */
function initViewAnalysis() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!id) { showError("No analysis ID provided."); return; }

  API.get("/api/history/" + id).then((d) => {
    const riskColors = { HIGH: "risk-HIGH", MEDIUM: "risk-MEDIUM", LOW: "risk-LOW" };
    document.getElementById("viewFileName").textContent = d.filename;
    document.getElementById("viewRiskBadge").innerHTML = `<span class="risk-badge ${riskColors[d.risk_level] || ""}"><i class="icon-shield"></i> ${d.risk_level} RISK</span>`;
    document.getElementById("viewStats").innerHTML = `
      <div class="stat-card"><div class="stat-icon"><i class="icon-activity"></i></div><div class="stat-label">Risk Score</div><div class="stat-value">${d.risk_score}</div><div class="stat-unit">points</div></div>
      <div class="stat-card"><div class="stat-icon"><i class="icon-layers"></i></div><div class="stat-label">Components Hit</div><div class="stat-value">${d.total_components}</div><div class="stat-unit">modules affected</div></div>
      <div class="stat-card"><div class="stat-icon"><i class="icon-clock"></i></div><div class="stat-label">Effort (Normal)</div><div class="stat-value">${d.effort_days}</div><div class="stat-unit">${d.effort_hrs} man-hours</div></div>
      <div class="stat-card"><div class="stat-icon"><i class="icon-zap"></i></div><div class="stat-label">Fast Delivery</div><div class="stat-value">${d.fast_delivery_days}</div><div class="stat-unit">days (2-person team)</div></div>`;
    const comps = d.impact && d.impact.components;
    if (comps && comps.length) {
      document.getElementById("viewComponents").innerHTML = comps.map((c, i) => {
        const dot = c.risk >= 3 ? "dot-HIGH" : c.risk === 2 ? "dot-MED" : "dot-LOW";
        return `<div class="component-row" style="animation-delay:${i * 0.04}s"><span class="comp-dot ${dot}"></span><span class="comp-name">${c.name}</span><span class="comp-keyword">${c.keyword}</span><span class="comp-effort">+${c.effort_days}d / ${c.effort_hrs}h</span></div>`;
      }).join("");
    }
    if (d.client_note) document.getElementById("viewClientNote").textContent = d.client_note;
    if (d.report_text) document.getElementById("viewReportPre").textContent = d.report_text;
    if (d.created_at) {
      const dt = new Date(d.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
      document.getElementById("viewTimestamp").textContent = "Analyzed on " + dt;
    }
    window._viewReport = d.report_text || "";
  }).catch((err) => {
    showError(err.error || "Failed to load analysis");
  });
}

function copyViewReport() {
  if (!window._viewReport) return;
  navigator.clipboard.writeText(window._viewReport).then(() => {
    const btn = document.querySelector(".btn-copy");
    if (btn) { const o = btn.innerHTML; btn.innerHTML = '<i class="icon-check"></i> Copied!'; setTimeout(() => { btn.innerHTML = o; }, 2000); }
  });
}

function downloadViewReport() {
  if (!window._viewReport) return;
  const blob = new Blob([window._viewReport], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "impact_report.txt";
  a.click();
}

/* ===== Page: Profile ===== */
function initProfile() {
  const form = document.getElementById("profileForm");
  if (!form) return;

  API.get("/api/profile").then((d) => {
    form.full_name.value = d.full_name || "";
    form.email.value = d.email || "";
    document.getElementById("profileUsername").textContent = d.username;
    document.getElementById("profileSince").textContent = d.created_at ? new Date(d.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "";
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideError();
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<i class="icon-loader" style="animation:spin .6s linear infinite"></i> Saving...';
    try {
      await API.put("/api/profile", {
        full_name: form.full_name.value.trim(),
        email: form.email.value.trim(),
        current_password: form.current_password.value,
        new_password: form.new_password.value,
      });
      toast("Profile updated!", "success");
      form.current_password.value = "";
      form.new_password.value = "";
    } catch (err) {
      showError(err.error || "Update failed");
    }
    btn.disabled = false;
    btn.innerHTML = '<i class="icon-save"></i> Save Changes';
  });
}

/* ===== Page: Landing ===== */
function initLanding() {
  if (getToken()) {
    const navLinks = document.getElementById("navLinks");
    if (navLinks) {
      const user = getUser();
      const display = user ? (user.full_name || user.username) : "";
      const initial = display ? display[0].toUpperCase() : "U";
      navLinks.innerHTML = `
        <a href="/dashboard.html" class="nav-link"><i class="icon-layout-dashboard"></i><span>Dashboard</span></a>
        <a href="/history.html" class="nav-link"><i class="icon-clock"></i><span>History</span></a>
        <div class="theme-toggle" id="themeToggle" title="Toggle theme"><i class="icon-sun"></i></div>
        <div class="nav-dropdown"><div class="nav-avatar" title="${display}">${initial}</div><div class="nav-dropdown-menu">
          <div class="dropdown-user-info"><div class="dropdown-avatar">${initial}</div><div><div class="dropdown-name">${display}</div><div class="dropdown-email">${user ? user.email : ""}</div></div></div>
          <div class="nav-dropdown-divider"></div>
          <a href="/profile.html" class="nav-dropdown-item"><i class="icon-settings"></i> Profile Settings</a>
          <a href="/history.html" class="nav-dropdown-item"><i class="icon-bar-chart-2"></i> My Analyses</a>
          <div class="nav-dropdown-divider"></div>
          <a href="#" class="nav-dropdown-item danger" id="navLogout"><i class="icon-log-out"></i> Sign Out</a>
        </div></div>`;
      initTheme();
      initDropdown();
      initSettings();
      const logoutBtn = document.getElementById("navLogout");
      if (logoutBtn) logoutBtn.addEventListener("click", (e) => { e.preventDefault(); clearAuth(); window.location.href = "/login.html"; });
    }
  }
}

/* ===== Router ===== */
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname.replace(/\/+$/, "");
  const page = path.split("/").pop() || "index.html";

  initTheme();
  initDropdown();
  initMobileNav();
  initSettings();
  bindPasswordToggles();
  bindPasswordStrength();

  const publicPages = ["index.html", "login.html", "register.html", "forgot-password.html", "reset-password.html", ""];
  const authPages = ["dashboard.html", "history.html", "view-analysis.html", "profile.html"];

  if (authPages.includes(page) && !requireAuth()) return;

  switch (page) {
    case "index.html": case "": initLanding(); break;
    case "login.html": initLogin(); break;
    case "register.html": initRegister(); break;
    case "forgot-password.html": initForgotPassword(); break;
    case "reset-password.html": initResetPassword(); break;
    case "dashboard.html": initDashboard(); break;
    case "history.html": initHistory(); break;
    case "view-analysis.html": initViewAnalysis(); break;
    case "profile.html": initProfile(); break;
  }

  if (authPages.includes(page)) {
    const logoutBtn = document.getElementById("navLogout");
    if (logoutBtn) logoutBtn.addEventListener("click", (e) => { e.preventDefault(); clearAuth(); window.location.href = "/login.html"; });
    loadNavUser();
  }
});
