// Play career: steps both players through their careers, age by age, so the bars, counts, crown and hoop
// all move as the lead changes hands. LeBron at 21 against Jordan at 21, then 22 against 22, and so on.
// It adds a slim control bar (Play / Pause, speed, an age scrubber and a caption) under the portraits.
//
// Self-contained: it drives the season dropdowns that app.js already draws and calls app.js's own
// change handlers, so it needs no changes to app.js. Load it after app.js and stage.js.
// If a player sat out a year (Jordan in 1993-94), that player holds their last season and the caption says so.
// Press anything yourself (a dropdown, the chart) and playback hands control back to you.
(function () {
  if (!window.PLAYERS || !document.getElementById("left") || !document.getElementById("right")) return;

  var SPEEDS = [
    { label: "1\u00D7", ms: 1400 },   // one season every 1.4 s: long enough for the bars, counts and crown to land
    { label: "2\u00D7", ms: 700 },
    { label: "\u00BD\u00D7", ms: 2600 }
  ];
  var speedIdx = 0, running = false, timer = null, age = null, expected = null;

  // ---- reading the page (the dropdowns are the source of truth) ----
  function byId(id) { return window.PLAYERS.filter(function (p) { return p.id === id; })[0]; }
  function selects(side) {
    var root = document.getElementById(side);
    return root ? Array.prototype.slice.call(root.querySelectorAll("select")) : [];
  }
  function seasonSel(side) { return selects(side).filter(function (s) { return /^\d{4}-\d{2}$/.test(s.value); })[0]; }
  function playerOf(side) { var s = selects(side)[0]; return s ? byId(s.value) : null; }
  function lastName(p) { return p.name.split(" ").slice(-1)[0]; }

  // Age on February 1 of the season (the same convention app.js uses).
  function ageIn(p, season) {
    var b = p.born.split("-").map(Number);
    var a = parseInt(season.slice(0, 4), 10) + 1 - b[0];
    if (b[1] > 2 || (b[1] === 2 && b[2] > 1)) a--;
    return a;
  }

  // ---- the timeline: ages (or career years if a birth date is missing) ----
  function seasonKey(p, season, useAge) {
    if (useAge) return ageIn(p, season);
    for (var i = 0; i < p.seasons.length; i++) if (p.seasons[i].season === season) return i + 1;
    return null;
  }

  function timeline() {
    var l = playerOf("left"), r = playerOf("right");
    if (!l || !r || !l.seasons.length || !r.seasons.length) return null;
    var useAge = !!(l.born && r.born);
    function span(p) {
      return [seasonKey(p, p.seasons[0].season, useAge), seasonKey(p, p.seasons[p.seasons.length - 1].season, useAge)];
    }
    var a = span(l), b = span(r);
    var min = Math.max(a[0], b[0]), max = Math.min(a[1], b[1]);   // the years both were playing
    if (min > max) { min = Math.min(a[0], b[0]); max = Math.max(a[1], b[1]); }   // no overlap: the shorter career holds
    return { l: l, r: r, useAge: useAge, min: min, max: max };
  }

  // The player's season at a given age: the latest one at or before it (a gap year holds the last season).
  function seasonAt(p, key, useAge) {
    var best = p.seasons[0].season, exact = false;
    p.seasons.forEach(function (s, i) {
      var k = useAge ? ageIn(p, s.season) : i + 1;
      if (k <= key) { best = s.season; exact = (k === key); }
    });
    return { season: best, exact: exact };
  }

  // ---- driving app.js ----
  // Set a dropdown and run app.js's own handler (which redraws everything). Calling the handler directly,
  // instead of dispatching an event, keeps ball.js from dropping balls on every step.
  function setSeason(side, season) {
    var sel = seasonSel(side);
    if (!sel || sel.value === season) return;
    sel.value = season;
    if (typeof sel.onchange === "function") sel.onchange(new Event("change"));
    else sel.dispatchEvent(new Event("change", { bubbles: true }));     // fallback if app.js uses addEventListener
  }

  function applyAge(tl, a) {
    age = a;
    var L = seasonAt(tl.l, a, tl.useAge), R = seasonAt(tl.r, a, tl.useAge);
    setSeason("left", L.season);
    setSeason("right", R.season);
    expected = { l: tl.l.id, r: tl.r.id, ls: L.season, rs: R.season, lx: L.exact, rx: R.exact };
    paint();
  }

  // Does the page still show exactly what we last set? If not, the user took over.
  function inControl() {
    if (!expected) return false;
    var ls = seasonSel("left"), rs = seasonSel("right"), lp = playerOf("left"), rp = playerOf("right");
    return !!(ls && rs && lp && rp && lp.id === expected.l && rp.id === expected.r &&
              ls.value === expected.ls && rs.value === expected.rs);
  }

  // ---- playback ----
  function stop() {
    running = false;
    if (timer) { clearTimeout(timer); timer = null; }
    paint();
  }

  function tick() {
    timer = null;
    if (!running) return;
    var tl = timeline();
    if (!tl || !inControl()) { stop(); return; }          // the user changed something: hand control back
    if (age >= tl.max) { stop(); return; }
    applyAge(tl, age + 1);
    if (age >= tl.max) stop(); else timer = setTimeout(tick, SPEEDS[speedIdx].ms);
  }

  function start() {
    var tl = timeline();
    if (!tl) return;
    var resume = inControl() && age !== null && age < tl.max;     // paused part-way: carry on from there
    applyAge(tl, resume ? age : tl.min);
    if (age >= tl.max) { stop(); return; }
    running = true;
    paint();
    timer = setTimeout(tick, SPEEDS[speedIdx].ms);
  }

  // ---- the control bar (inserted above the stage when it exists) ----
  var style = document.createElement("style");
  style.textContent =
    "#play-bar button:hover{filter:brightness(1.12)}" +
    "#play-bar button:focus-visible,#play-bar input:focus-visible{outline:2px solid var(--accent,#f2b134);outline-offset:2px}";
  document.head.appendChild(style);

  var bar = document.createElement("div");
  bar.id = "play-bar";
  bar.style.cssText = "display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:10px 16px;" +
    "padding:10px 16px;border-top:1px solid var(--line,#2a2f3d);background:var(--panel,#171a23)";

  var playBtn = document.createElement("button");
  playBtn.type = "button";
  playBtn.style.cssText = "min-width:150px;padding:8px 18px;border:0;border-radius:999px;cursor:pointer;" +
    "background:var(--accent,#f2b134);color:#0f1117;font:700 .95rem system-ui,sans-serif";

  var speedBtn = document.createElement("button");
  speedBtn.type = "button";
  speedBtn.title = "Playback speed";
  speedBtn.setAttribute("aria-label", "Change playback speed");
  speedBtn.style.cssText = "padding:7px 12px;border:1px solid var(--line,#2a2f3d);border-radius:999px;cursor:pointer;" +
    "background:transparent;color:var(--text,#eef0f6);font:700 .85rem system-ui,sans-serif";

  var slider = document.createElement("input");
  slider.type = "range";
  slider.setAttribute("aria-label", "Scrub through the careers by age");
  slider.style.cssText = "flex:1 1 160px;max-width:380px;accent-color:var(--accent,#f2b134)";

  var caption = document.createElement("span");
  caption.style.cssText = "color:var(--muted,#9aa1b5);font:.9rem system-ui,sans-serif;font-variant-numeric:tabular-nums";

  bar.appendChild(playBtn);
  bar.appendChild(speedBtn);
  bar.appendChild(slider);
  bar.appendChild(caption);
  // Placement: right above the court strip when it exists; otherwise after the panels, before the head-to-head.
  var stage = document.getElementById("stage"), split = document.querySelector(".split");
  var h2hEl = document.getElementById("h2h"), leftEl = document.getElementById("left");
  if (stage && stage.parentNode) stage.parentNode.insertBefore(bar, stage);
  else if (split) split.insertAdjacentElement("afterend", bar);
  else if (h2hEl && h2hEl.parentNode) h2hEl.parentNode.insertBefore(bar, h2hEl);
  else if (leftEl.parentNode) leftEl.parentNode.insertAdjacentElement("afterend", bar);

  function paint() {
    var tl = timeline(), ctl = inControl();
    speedBtn.textContent = SPEEDS[speedIdx].label;
    if (!tl) { playBtn.textContent = "\u25B6 Play career"; slider.disabled = true; caption.textContent = ""; return; }

    var ls = seasonSel("left"), rs = seasonSel("right");
    var shown = ctl ? age : (ls ? seasonKey(tl.l, ls.value, tl.useAge) : tl.min);
    if (shown === null || shown === undefined) shown = tl.min;

    playBtn.textContent = running ? "\u23F8 Pause"
      : (ctl && age !== null && age >= tl.max) ? "\u21BB Replay"
      : (ctl && age !== null && age > tl.min) ? "\u25B6 Resume"
      : "\u25B6 Play career";
    playBtn.setAttribute("aria-label", playBtn.textContent.replace(/^\S+\s/, "") + " the career comparison");

    slider.min = tl.min;
    slider.max = tl.max;
    slider.value = Math.max(tl.min, Math.min(tl.max, shown));
    slider.disabled = tl.min === tl.max;

    function part(p, sel, exact) {
      return lastName(p) + " " + (sel ? sel.value : "") + (ctl && !exact ? " (sat out)" : "");
    }
    if (ctl) {
      caption.textContent = (tl.useAge ? "Age " : "Career year ") + shown + " \u00B7 " +
        part(tl.l, ls, expected.lx) + " vs. " + part(tl.r, rs, expected.rx);
    } else {                          // picked by hand: the two sides may not be the same age, so show each one's own
      function own(p, sel) {
        var k = sel ? seasonKey(p, sel.value, tl.useAge) : null;
        return lastName(p) + " " + (sel ? sel.value : "") + (k != null ? " (" + (tl.useAge ? "age " : "year ") + k + ")" : "");
      }
      caption.textContent = own(tl.l, ls) + " vs. " + own(tl.r, rs);
    }
  }

  playBtn.onclick = function () { if (running) stop(); else start(); };
  speedBtn.onclick = function () {
    speedIdx = (speedIdx + 1) % SPEEDS.length;
    if (running) { clearTimeout(timer); timer = setTimeout(tick, SPEEDS[speedIdx].ms); }
    paint();
  };
  slider.oninput = function () {
    var tl = timeline();
    if (!tl) return;
    var a = Number(slider.value);     // read it first: stop() repaints the slider
    stop();
    applyAge(tl, a);
  };

  // Keep the bar in step with whatever the page shows (players changed, a season picked from the chart...).
  if (window.MutationObserver) {
    var mo = new MutationObserver(paint);
    ["left", "right"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) mo.observe(el, { childList: true });
    });
  }
  paint();
})();
