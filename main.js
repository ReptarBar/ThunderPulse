function fmtDate(s) {
  try {
    const d = new Date(s);
    return d.toLocaleString();
  } catch { return s; }
}

let data = null;

async function load() {
  const status = document.getElementById("status");
  status.textContent = "Loading numbers...";
  try {
    const res = await fetch("../data/latest.json", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load data");
    data = await res.json();
    document.getElementById("updated").textContent = fmtDate(data.generatedAt);

    const gh = data.sources?.github;
    if (gh && gh.windows) {
      // All-time
      document.getElementById("gh-all").textContent = gh.windows["all"]?.total ?? "0";
      // Windows selector
      updateFromWindowSel();
      // Months row
      renderMonths(gh.months || []);
    } else {
      status.textContent = "GitHub data is not available yet. Please try again later.";
      return;
    }
    status.textContent = "";
  } catch (e) {
    console.error(e);
    status.textContent = "The numbers did not load. Please refresh in a few minutes.";
  }
}

function updateFromWindowSel() {
  const sel = document.getElementById("windowSel");
  const win = sel.value;
  const gh = data?.sources?.github;
  const val = gh?.windows?.[win]?.total ?? 0;
  const label = win === "all" ? "All-time contributors" : `Contributors in the last ${win} days`
  document.getElementById("gh-label").textContent = label;
  document.getElementById("gh-num").textContent = val;
}

function renderMonths(months) {
  const row = document.getElementById("monthsRow");
  row.innerHTML = "";
  if (!months.length) {
    document.getElementById("monthLabel").textContent = "Monthly data not available yet";
    document.getElementById("monthNum").textContent = "–";
    return;
  }
  // months come newest first; show left-to-right oldest -> newest for readability
  const monthsAsc = [...months].reverse();
  monthsAsc.forEach((m, idx) => {
    const btn = document.createElement("button");
    btn.className = "monthBtn";
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", "false");
    btn.dataset.key = m.key;
    btn.textContent = m.label;
    btn.addEventListener("click", () => selectMonth(m, btn, row));
    row.appendChild(btn);
    // Auto-select the most recent by default (last item)
    if (idx === monthsAsc.length - 1) {
      selectMonth(m, btn, row);
    }
  });
}

function selectMonth(m, btn, row) {
  for (const child of row.children) {
    child.setAttribute("aria-selected", "false");
  }
  btn.setAttribute("aria-selected", "true");
  document.getElementById("monthLabel").textContent = m.label;
  document.getElementById("monthNum").textContent = m.total ?? 0;
}

// About dialog controls
const aboutBtn = document.getElementById("aboutBtn");
const aboutDialog = document.getElementById("aboutDialog");
const aboutClose = document.getElementById("aboutClose");
const aboutOk = document.getElementById("aboutOk");
const windowSel = document.getElementById("windowSel");

function openAbout() {
  aboutDialog.hidden = false;
  aboutDialog.querySelector(".modal__box").focus();
}
function closeAbout() {
  aboutDialog.hidden = true;
  aboutBtn.focus();
}

aboutBtn.addEventListener("click", openAbout);
aboutClose.addEventListener("click", closeAbout);
aboutOk.addEventListener("click", closeAbout);
document.addEventListener("keydown", (e) => {
  if (!aboutDialog.hidden && e.key === "Escape") closeAbout();
});

windowSel.addEventListener("change", updateFromWindowSel);

load();
