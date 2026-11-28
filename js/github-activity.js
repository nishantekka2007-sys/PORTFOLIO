/* Live public GitHub contribution calendar for nishantekka2007-sys.
   Data source: github-contributions-api.jogruber.de (public contribution data). */
(() => {
  "use strict";

  const USERNAME = "nishantekka2007-sys";
  const DATA_URL = `https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`;
  const REFRESH_INTERVAL = 30 * 60 * 1000;

  const byId = (id) => document.getElementById(id);
  const dateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const parseDate = (value) => new Date(`${value}T00:00:00`);
  const dayLabel = (date) => date.toLocaleDateString(undefined, {
    weekday: "short", month: "short", day: "numeric", year: "numeric"
  });

  function calculateStreaks(days) {
    const counts = new Map(days.map((day) => [day.date, Number(day.count) || 0]));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayKey = dateKey(today);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    let cursor = counts.get(todayKey) > 0 ? today : yesterday;
    let current = 0;

    while (counts.get(dateKey(cursor)) > 0) {
      current += 1;
      cursor.setDate(cursor.getDate() - 1);
    }

    let longest = 0;
    let run = 0;
    for (const day of days) {
      if ((Number(day.count) || 0) > 0) {
        run += 1;
        longest = Math.max(longest, run);
      } else {
        run = 0;
      }
    }
    return { current, longest };
  }

  function renderCalendar(days) {
    const calendar = byId("github-calendar");
    const monthLabels = byId("github-month-labels");
    if (!calendar || !monthLabels || !days.length) return;

    const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));
    const first = parseDate(sorted[0].date);
    const last = parseDate(sorted[sorted.length - 1].date);
    const gridStart = new Date(first);
    gridStart.setDate(gridStart.getDate() - gridStart.getDay());
    const gridEnd = new Date(last);
    gridEnd.setDate(gridEnd.getDate() + (6 - gridEnd.getDay()));

    const countByDate = new Map(sorted.map((day) => [day.date, Number(day.count) || 0]));
    const maxCount = Math.max(1, ...sorted.map((day) => Number(day.count) || 0));
    const totalWeeks = Math.ceil((gridEnd - gridStart + 86400000) / (7 * 86400000));
    calendar.style.gridTemplateColumns = `repeat(${totalWeeks}, minmax(0, 1fr))`;
    monthLabels.style.gridTemplateColumns = `repeat(${totalWeeks}, minmax(0, 1fr))`;
    calendar.replaceChildren();
    monthLabels.replaceChildren();

    let previousMonth = -1;
    for (let week = 0; week < totalWeeks; week += 1) {
      const weekDate = new Date(gridStart);
      weekDate.setDate(gridStart.getDate() + week * 7);
      if (weekDate.getMonth() !== previousMonth) {
        const label = document.createElement("span");
        label.textContent = weekDate.toLocaleDateString(undefined, { month: "short" });
        label.style.gridColumn = String(week + 1);
        monthLabels.appendChild(label);
        previousMonth = weekDate.getMonth();
      }
      for (let weekday = 0; weekday < 7; weekday += 1) {
        const date = new Date(gridStart);
        date.setDate(gridStart.getDate() + week * 7 + weekday);
        const key = dateKey(date);
        const count = countByDate.get(key) || 0;
        const level = count === 0 ? 0 : Math.min(4, Math.ceil((count / maxCount) * 4));
        const cell = document.createElement("span");
        cell.className = `github-day level-${level}`;
        cell.title = `${count} contribution${count === 1 ? "" : "s"} on ${dayLabel(date)}`;
        cell.setAttribute("aria-label", cell.title);
        if (date < first || date > last) cell.style.visibility = "hidden";
        calendar.appendChild(cell);
      }
    }
    calendar.setAttribute("aria-label", `Contribution calendar showing ${sorted.length} days of public GitHub activity`);
  }

  function updateStats(days) {
    const total = days.reduce((sum, day) => sum + (Number(day.count) || 0), 0);
    const best = days.reduce((winner, day) =>
      (Number(day.count) || 0) > (Number(winner.count) || 0) ? day : winner, days[0]);
    const streaks = calculateStreaks(days);

    byId("github-total").textContent = total.toLocaleString();
    byId("github-current-streak").textContent = `${streaks.current}d`;
    byId("github-longest-streak").textContent = `${streaks.longest}d`;
    byId("github-best-day").textContent = String(Number(best.count) || 0);
    byId("github-activity-caption").textContent =
      `Live GitHub data for @${USERNAME} · ${total.toLocaleString()} contributions in the last year`;
  }

  async function loadGitHubActivity() {
    const status = byId("github-live-status-text");
    const error = byId("github-activity-error");
    if (!status) return;
    status.textContent = "SYNCING PUBLIC DATA";
    try {
      const response = await fetch(DATA_URL, {
        cache: "no-store",
        headers: { "Accept": "application/json" }
      });
      if (!response.ok) throw new Error(`Contribution service returned ${response.status}`);
      const payload = await response.json();
      if (!Array.isArray(payload.contributions) || payload.contributions.length === 0) {
        throw new Error("No contribution calendar was returned");
      }
      renderCalendar(payload.contributions);
      updateStats(payload.contributions);
      status.textContent = "LIVE · AUTO-REFRESH";
      if (error) error.hidden = true;
    } catch (err) {
      console.warn("GitHub activity could not be loaded:", err);
      status.textContent = "DATA UNAVAILABLE";
      if (error) error.hidden = false;
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadGitHubActivity, { once: true });
  } else {
    loadGitHubActivity();
  }
  window.setInterval(loadGitHubActivity, REFRESH_INTERVAL);
})();
