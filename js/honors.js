// Honors that pop in: when a season advances (the dropdown, the chart, or "Play career"), every honor that
// was newly earned pops into the honors table in order, and its count ticks up one step at a time with a
// small "+1" badge. Watching a career play out shows exactly when the rings and trophies arrived.
//
// Self-contained: it only animates the rows app.js already draws, so it needs no changes to app.js.
// Load it after app.js. Only honors that were earned by the SAME player going forward animate; switching
// players, or going back to an earlier season, just shows the table as it is. With "reduce motion" on,
// nothing animates.
(function () {
  var h2h = document.getElementById("h2h");
  if (!h2h || !document.getElementById("left") || !document.getElementById("right")) return;
  var reduced = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  // Tweak the feel here
  var STAGGER = 320;      // ms between one honor and the next (it shrinks automatically if many arrive at once)
  var MAX_SPAN = 2400;    // ms: the longest the whole sequence may stretch
  var TICK = 240;         // ms between count steps when a count jumps by several
  var MAX_TICKS = 6;      // a big jump ticks in at most this many steps

  var token = 0;          // bumped on every redraw: it cancels animations still waiting from the one before
  var prev = null;        // what the honors table showed last time

  // A small icon for each kind of honor, matched on the label text (so new honors need no changes here).
  function iconFor(label) {
    var s = (label || "").toLowerCase();
    if (/champion/.test(s)) return "💍";                    // ring
    if (/mvp|most valuable/.test(s)) return "🏆";           // trophy
    if (/rookie/.test(s)) return "🌟";
    if (/defens/.test(s)) return "🛡️";
    if (/scor/.test(s)) return "🔥";
    if (/assist/.test(s)) return "🎯";
    if (/steal/.test(s)) return "✋";
    if (/block/.test(s)) return "🚫";
    if (/rebound/.test(s)) return "💪";
    if (/olympic|gold/.test(s)) return "🥇";
    if (/all-star|all star/.test(s)) return "⭐";
    if (/all-nba|all nba/.test(s)) return "🏀";
    return "★";
  }

  function anim(el, frames, opts) {
    if (el && typeof el.animate === "function") { try { return el.animate(frames, opts); } catch (e) {} }
    return null;
  }

  function playerIds() {
    function v(id) { var s = document.getElementById(id).querySelector("select"); return s ? s.value : null; }
    var l = v("left"), r = v("right");
    return l && r ? [l, r] : null;
  }

  // The rows of the honors table: [{ row, label, cells: [left, right], vals: [n, n] }]
  function readRows() {
    var out = [];
    Array.prototype.forEach.call(h2h.querySelectorAll(".arow"), function (row) {
      var lbl = row.querySelector(".lbl"), cells = row.querySelectorAll(".n");
      if (!lbl || cells.length < 2) return;
      function num(c) { var m = /×\s*(\d+)/.exec(c.textContent || ""); return m ? parseInt(m[1], 10) : 0; }
      out.push({ row: row, label: lbl.textContent.trim(), cells: [cells[0], cells[1]], vals: [num(cells[0]), num(cells[1])] });
    });
    return out;
  }

  function show(cell, prefix, v) {
    cell.textContent = prefix + (v ? "×" + v : "–");
    if (v) cell.classList.remove("zero"); else cell.classList.add("zero");
  }

  function badge(cell, side, label, delta) {
    cell.style.position = "relative";
    var b = document.createElement("span");
    b.textContent = iconFor(label) + " +" + delta;
    b.setAttribute("aria-hidden", "true");
    b.style.cssText = "position:absolute;bottom:100%;" + (side === 0 ? "right:0" : "left:0") +
      ";white-space:nowrap;pointer-events:none;z-index:6;font:700 .8rem system-ui,sans-serif;" +
      "color:var(--accent,#f2b134);text-shadow:0 1px 3px rgba(0,0,0,.6);opacity:0";
    cell.appendChild(b);
    var a = anim(b, [
      { opacity: 0, transform: "translateY(4px) scale(.7)" },
      { opacity: 1, transform: "translateY(-6px) scale(1.15)", offset: 0.25 },
      { opacity: 1, transform: "translateY(-12px) scale(1)", offset: 0.7 },
      { opacity: 0, transform: "translateY(-20px) scale(1)" }
    ], { duration: 1150, easing: "ease-out", fill: "forwards" });
    setTimeout(function () { if (b.parentNode) b.parentNode.removeChild(b); }, a ? 1250 : 0);
  }

  function pop(cell, side) {
    cell.style.transformOrigin = side === 0 ? "right center" : "left center";
    anim(cell, [{ transform: "scale(1)" }, { transform: "scale(1.45)", offset: 0.4 }, { transform: "scale(1)" }],
      { duration: 280, easing: "ease-out" });
  }

  // One honor row: reveal it (if it is brand new), then tick each side that went up.
  function play(my, r, ups, old, isNew, delay) {
    var prefixes = [], i;
    if (isNew) r.row.style.opacity = "0";
    ups.forEach(function (side) {
      prefixes[side] = (r.cells[side].textContent || "").replace(/×\s*\d+|–/, "");
      show(r.cells[side], prefixes[side], old[side]);          // start from the old count
    });

    setTimeout(function () {
      if (my !== token || !r.row.isConnected) return;
      if (isNew) {
        r.row.style.opacity = "";
        anim(r.row, [
          { opacity: 0, transform: "scale(.9)" },
          { opacity: 1, transform: "scale(1.035)", offset: 0.6 },
          { opacity: 1, transform: "scale(1)" }
        ], { duration: 440, easing: "ease-out" });
        anim(r.row, [
          { boxShadow: "0 0 0 2px rgba(242,177,52,.75)" },
          { boxShadow: "0 0 0 0 rgba(242,177,52,0)" }
        ], { duration: 900, easing: "ease-out" });
      }
      ups.forEach(function (side) {
        var cell = r.cells[side], target = r.vals[side], delta = target - old[side];
        var steps = Math.min(delta, MAX_TICKS);
        for (var j = 0; j < steps; j++) (function (j) {
          var v = j === steps - 1 ? target : old[side] + Math.ceil(delta * (j + 1) / steps);
          setTimeout(function () {
            if (my !== token || !cell.isConnected) return;
            show(cell, prefixes[side], v);
            pop(cell, side);
            if (j === 0) badge(cell, side, r.label, delta);
          }, j * TICK);
        })(j);
      });
    }, delay);
  }

  function sync() {
    var ids = playerIds();
    if (!ids) return;
    var rows = readRows();
    var cur = { l: ids[0], r: ids[1], map: {} };
    rows.forEach(function (r) { cur.map[r.label] = r.vals; });
    var my = ++token;

    if (prev && !reduced) {
      var plan = [];
      rows.forEach(function (r) {
        var old = prev.map[r.label] || [0, 0], ups = [];
        [prev.l === cur.l, prev.r === cur.r].forEach(function (same, side) {
          if (same && r.vals[side] > old[side]) ups.push(side);   // the same player earned more
        });
        if (ups.length) plan.push({ r: r, ups: ups, old: old, isNew: old[0] === 0 && old[1] === 0 });
      });
      var gap = plan.length > 1 ? Math.min(STAGGER, MAX_SPAN / plan.length) : STAGGER;
      plan.forEach(function (p, i) { play(my, p.r, p.ups, p.old, p.isNew, 120 + i * gap); });
    }
    prev = cur;
  }

  // app.js redraws the whole head-to-head on every change, so one batch of changes = one sync()
  if (window.MutationObserver) new MutationObserver(sync).observe(h2h, { childList: true });
  sync();
})();
