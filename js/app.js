(function () {
  var TEAM_COLORS = {
    "Cleveland Cavaliers": "#c8102e", "Miami Heat": "#e03a3e", "Los Angeles Lakers": "#a77bd6",
    "Chicago Bulls": "#ce1141", "Washington Wizards": "#5b84c4", "Golden State Warriors": "#fdb927", "Orlando Magic": "#0077c0", "Phoenix Suns": "#e56020", "Boston Celtics": "#2a9d5c", 
    "Milwaukee Bucks": "#3da35d"
  };
    // Used for the right side when both players wear the same team color (e.g. LeBron and Kobe on the Lakers).
  var SAME_COLOR_FALLBACK = "#c9ccd6";
  var ACC_LABELS = {
    champion: "NBA Champion", finals_mvp: "Finals MVP", mvp: "Regular-Season MVP", roy: "Rookie of the Year",
    dpoy: "Defensive Player of the Year", scoring: "Scoring Title", assists: "Assists Leader", steals: "Steals Leader",
    allstar: "All-Star", asg_mvp: "All-Star Game MVP", cup_mvp: "NBA Cup MVP", clutch: "Clutch Player of the Year",
    wcf_mvp: "Western Conf. Finals MVP", olympic: "Olympic Gold",
    rebounds: "Rebounding Title", blocks: "Blocks Leader"
  };
  var ACC_ORDER = ["champion", "finals_mvp", "mvp", "roy", "dpoy", "scoring", "assists", "steals", "wcf_mvp", "cup_mvp", "clutch", "asg_mvp", "olympic", "allstar", "rebounds", "blocks"];
  var STATS = [
    { key: "pts", label: "PTS", max: 40, fmt: function (v) { return v.toFixed(1); } },
    { key: "reb", label: "REB", max: 15, fmt: function (v) { return v.toFixed(1); } },
    { key: "ast", label: "AST", max: 12, fmt: function (v) { return v.toFixed(1); } },
    { key: "fg",  label: "FG%", max: 70, fmt: function (v) { return v.toFixed(1) + "%"; } },
    { key: "tp",  label: "3PT%", max: 50, fmt: function (v) { return v.toFixed(1) + "%"; } },
    { key: "blk", label: "BLK", max: 3, fmt: function (v) { return v.toFixed(1); } }
  ];
    // Full names, used as the career chart's title
  var STAT_NAMES = { pts: "Points per game", reb: "Rebounds per game", ast: "Assists per game",
                     fg: "Field-goal %", tp: "Three-point %", blk: "Blocks per game" };

  // Photos are all drawn at the same height. Because each photo is framed a little differently,
  // this nudges each player's head to about the same size. Default is 1; raise it if a head looks small.
  var PHOTO_SCALE = { "lebron-james": 1.16, "kareem-abdul-jabbar": 1.14, "kobe-bryant": 1.14, "shaquille-oneal": 1.06, "stephen-curry": 1.08, "michael-jordan": 1 };

  var players = window.PLAYERS;
  var state = {
    left: { player: byId("lebron-james") || players[0], season: null },
     right: { player: byId("michael-jordan") || players[1] || players[0], season: null },
        mode: "reg",  // "reg" = regular season, "po" = playoffs
        stat: "pts"   // which stat the career charts show
  };
  state.left.season = lastSeason(state.left.player);
  state.right.season = lastSeason(state.right.player);

  function byId(id) { return players.filter(function (p) { return p.id === id; })[0]; }
  function lastSeason(p) { return p.seasons[p.seasons.length - 1].season; }
  function seasonRow(p, s) { return p.seasons.filter(function (x) { return x.season === s; })[0]; }
  // "2014-15" -> 2014, used to compare seasons chronologically
  function startYear(s) { return parseInt(s.slice(0, 4), 10); }
  // ↓ add these
  function seasonIndex(p, s) { for (var i = 0; i < p.seasons.length; i++) if (p.seasons[i].season === s) return i; return -1; }
  // Age on February 1 of the season (Basketball-Reference's convention).
  function ageIn(p, season) {
    if (!p.born) return null;
    var b = p.born.split("-").map(Number);
    var age = startYear(season) + 1 - b[0];
    if (b[1] > 2 || (b[1] === 2 && b[2] > 1)) age--;
    return age;
  }
    // Team color for a side. If both sides would be the same color, the right side turns light gray.
  function sideColor(side) {
    var l = TEAM_COLORS[seasonRow(state.left.player, state.left.season).team] || "#888";
    if (side === "left") return l;
    var r = TEAM_COLORS[seasonRow(state.right.player, state.right.season).team] || "#888";
    return r === l ? SAME_COLOR_FALLBACK : r;
  }
    // The stat line to show: the regular season, or that season's playoffs
  // (undefined if he didn't make the playoffs that year).
  function statRow(p, season) {
    if (state.mode === "reg") return seasonRow(p, season);
    return (p.playoffs || []).filter(function (x) { return x.season === season; })[0];
  }

  function el(tag, attrs, kids) {
    var e = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "text") e.textContent = attrs[k]; else e.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) { e.appendChild(c); });
    return e;
  }


  // ---- helpers for the career charts ----
  function statDef(key) { return STATS.filter(function (s) { return s.key === key; })[0]; }
  // Every season row for the current mode (playoff list skips years he missed)
  function statRows(p) { return state.mode === "po" ? (p.playoffs || []) : p.seasons; }
  // Like el(), but for SVG shapes
  function sv(tag, attrs, text) {
    var e = document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (text != null) e.textContent = text;
    return e;
  }
  // Make something clickable with the mouse and the keyboard (Enter / Space)
  function clickable(e, label, fn) {
    e.setAttribute("tabindex", "0");
    e.setAttribute("role", "button");
    e.setAttribute("aria-label", label);
    e.addEventListener("click", fn);
    e.addEventListener("keydown", function (ev) { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); fn(); } });
  }
  // One shared hover tooltip
  var tip = document.body.appendChild(el("div", { "class": "tip", role: "tooltip" }));
  function showTip(html, x, y) {
    tip.innerHTML = html;
    tip.style.display = "block";
    var w = tip.offsetWidth, h = tip.offsetHeight;
    tip.style.left = Math.min(window.innerWidth - w - 8, Math.max(8, x - w / 2)) + "px";
    tip.style.top = (y - h - 14 < 8 ? y + 18 : y - h - 14) + "px";
  }
  function hideTip() { tip.style.display = "none"; }

  // How many of each honor a player has earned up to a season (0 if none).
  function accoladeCounts(p, season) {
    var y = startYear(season), out = {};
    ACC_ORDER.forEach(function (key) {
      out[key] = (p.accolades[key] || []).filter(function (s) { return startYear(s) <= y; }).length;
    });
    return out;
  }

  function render(side) {
    var root = document.getElementById(side);
    var st = state[side], p = st.player, row = statRow(p, st.season);
    var color = sideColor(side);
    root.style.setProperty("--c", color);
    document.documentElement.style.setProperty(side === "left" ? "--cl" : "--cr", color);
    root.innerHTML = "";

    // ----- top row: team (outer) + pickers (inner) -----
    var teamRow = seasonRow(p, st.season);
    var team = el("div", { "class": "team" }, [el("small", { text: "Team" }), el("b", { text: teamRow.team.split(" ").pop() })]);
    var pSel = el("select", { "aria-label": "Player (" + side + ")" });
    players.forEach(function (q) {
      var o = el("option", { value: q.id, text: q.name }); if (q.id === p.id) o.selected = true; pSel.appendChild(o);
    });
    pSel.onchange = function () {
      st.player = byId(pSel.value);
      if (!seasonRow(st.player, st.season)) st.season = lastSeason(st.player);
      update();
    };
    var ySel = el("select", { "aria-label": "Season (" + side + ")" });
    p.seasons.forEach(function (s) {
      var text = s.season + (state.mode === "po" && !statRow(p, s.season) ? " (no playoffs)" : "");
      var o = el("option", { value: s.season, text: text }); if (s.season === st.season) o.selected = true; ySel.appendChild(o);
    });
    ySel.onchange = function () { st.season = ySel.value; update(); };
    var pickers = el("div", { "class": "pickers" }, [
      el("div", {}, [el("label", { text: "Player" }), pSel]),
      el("div", {}, [el("label", { text: "Year" }), ySel])
    ]);
    root.appendChild(el("div", { "class": "head" }, [team, pickers]));

    // ----- accolades (only the honors earned so far) -----
    var counts = accoladeCounts(p, st.season);
    var ul = el("ul", { "class": "acc" });
    var any = false;
    ACC_ORDER.forEach(function (k) {
      if (!counts[k]) return;
      any = true;
      ul.appendChild(el("li", {}, [el("span", { text: ACC_LABELS[k] }), el("b", { text: "×" + counts[k] })]));
    });
    if (!any) ul.appendChild(el("li", { "class": "none", text: "None yet" }));
    var accKids = [el("h2", { text: "Accolades through " + st.season }), ul];
    if (p.bref) accKids.push(el("a", { "class": "src", href: p.bref, target: "_blank", rel: "noopener", text: "Full stats on Basketball-Reference ↗" }));
    root.appendChild(el("div", { "class": "accwrap" }, accKids));

    // ----- stats (higher value gets a crown) -----
    var other = side === "left" ? state.right : state.left;
    var orow = statRow(other.player, other.season);
    var stats = el("div", { "class": "stats" });
    if (!row) stats.appendChild(el("p", { "class": "missed", text: "Missed the playoffs this season." }));
    STATS.forEach(function (s) {
      var v = row ? row[s.key] : null, ov = orow ? orow[s.key] : null;
      var lead = v != null && ov != null && v > ov;
      var w = v == null ? 0 : Math.min(100, v / s.max * 100);
      stats.appendChild(el("div", { "class": "stat" + (lead ? " lead" : "") }, [
        el("span", { "class": "k", text: s.label }),
        el("span", { "class": "v", text: v == null ? "—" : (lead ? "  👑  " : "") + s.fmt(v) }),
        el("div", { "class": "bar" }, [el("i", { style: "width:" + w + "%" })])
      ]));
    });
    root.appendChild(stats);

    // ----- big portrait (transparent PNG cutouts look best) -----
    var portrait = el("div", { "class": "portrait" }, [el("span", { "class": "ini", text: p.initials })]);
    var img = new Image();
    img.alt = p.name + " " + st.season;
    var sc = PHOTO_SCALE[p.id] || 1; if (sc !== 1) img.style.transform = "scale(" + sc + ")";
    img.onload = function () { portrait.classList.add("has-img"); portrait.insertBefore(img, portrait.firstChild); };
    var base = "images/players/" + p.id;
    var paths = [base + "/" + st.season + ".png", base + "/" + st.season + ".jpg", base + ".png", base + ".jpg", base + ".webp"];
    var tried = 0;
    img.onerror = function () { tried++; if (tried < paths.length) img.src = paths[tried]; };
    img.src = paths[0];
    root.appendChild(portrait);

    var age = ageIn(p, st.season);
    var games = row ? row.gp + " games" : "missed the playoffs";
    var meta = st.season + (state.mode === "po" ? " playoffs" : " season") + (age != null ? " · Age " + age : "") + " · " + games;
    root.appendChild(el("div", { "class": "cap" }, [
      el("div", { "class": "pname", text: p.name }),
      el("div", { "class": "season-label", text: meta }),
      el("div", { "class": "season-label dim", text: "Career season " + (seasonIndex(p, st.season) + 1) + " of " + p.seasons.length })
    ]));
  }

    // Career chart: the selected stat for every season, shaded by team.
  // Both sides use the same scale, so heights compare directly. Click a season to pick it.
  function careerChart(side) {
    var st = state[side], p = st.player, stat = statDef(state.stat);
    var W = 340, H = 120, m = { l: 34, r: 10, t: 10, b: 22 };
    var pw = W - m.l - m.r, ph = H - m.t - m.b;
    // x-axis always spans his whole career, so playoff and regular charts line up
    var y0 = startYear(p.seasons[0].season), y1 = startYear(lastSeason(p));
    var span = Math.max(1, y1 - y0), step = pw / span;
    function x(s) { return m.l + (startYear(s) - y0) / span * pw; }
    function y(v) { return m.t + (1 - Math.min(v, stat.max) / stat.max) * ph; }

    var svg = sv("svg", { viewBox: "0 0 " + W + " " + H, "class": "spark", role: "img",
      "aria-label": p.name + " " + STAT_NAMES[stat.key] + " by season" });

    // background band for each team stint, with a 2px gap between stints
    var runs = [];
    p.seasons.forEach(function (s) {
      var last = runs[runs.length - 1];
      if (last && last.team === s.team) last.to = s.season; else runs.push({ team: s.team, from: s.season, to: s.season });
    });
    runs.forEach(function (r) {
      var a = Math.max(m.l, x(r.from) - step / 2), b = Math.min(W - m.r, x(r.to) + step / 2);
      if (a > m.l) a += 1; if (b < W - m.r) b -= 1;
      svg.appendChild(sv("rect", { x: a, y: m.t, width: Math.max(0, b - a), height: ph,
        fill: TEAM_COLORS[r.team] || "#888", "fill-opacity": 0.13 }));
    });

    // light grid lines at 0, half and max
    [0, stat.max / 2, stat.max].forEach(function (v) {
      svg.appendChild(sv("line", { x1: m.l, x2: W - m.r, y1: y(v), y2: y(v), "class": v === 0 ? "axis" : "grid" }));
      svg.appendChild(sv("text", { x: m.l - 6, y: y(v) + 3, "text-anchor": "end", "class": "tick" }, stat.fmt(v).replace(".0", "")));
    });
    svg.appendChild(sv("text", { x: m.l, y: H - 6, "class": "tick" }, p.seasons[0].season));
    svg.appendChild(sv("text", { x: W - m.r, y: H - 6, "text-anchor": "end", "class": "tick" }, lastSeason(p)));

    // the line, broken wherever a season is missing (retirement, missed playoffs)
    var rows = statRows(p), d = "", prev = null;
    rows.forEach(function (s) {
      var gap = prev !== null && startYear(s.season) - prev > 1;
      d += (d === "" || gap ? "M" : "L") + x(s.season).toFixed(1) + "," + y(s[stat.key]).toFixed(1);
      prev = startYear(s.season);
    });
    svg.appendChild(sv("path", { d: d, "class": "line" }));
    rows.forEach(function (s) {
      var sel = s.season === st.season;
      svg.appendChild(sv("circle", { cx: x(s.season), cy: y(s[stat.key]), r: sel ? 5 : 2.5, "class": sel ? "dot sel" : "dot" }));
    });

    // invisible click/hover target for every season (bigger than the dot)
    p.seasons.forEach(function (s) {
      var a = Math.max(m.l - 4, x(s.season) - step / 2), b = Math.min(W, x(s.season) + step / 2);
      var hit = sv("rect", { x: a, y: m.t, width: Math.max(4, b - a), height: ph, "class": "hit" });
      var row = rows.filter(function (q) { return q.season === s.season; })[0];
      var age = ageIn(p, s.season);
      var html = "<b>" + s.season + "</b> · " + s.team + (age != null ? " · age " + age : "") + "<br>" +
        (row ? stat.fmt(row[stat.key]) + " " + stat.label : "Missed the playoffs") + "<br><span>Click to select</span>";
      hit.addEventListener("mousemove", function (ev) { showTip(html, ev.clientX, ev.clientY); });
      hit.addEventListener("mouseleave", hideTip);
      clickable(hit, "Select " + s.season, function () { hideTip(); st.season = s.season; update(); });
      svg.appendChild(hit);
    });

    return el("div", { "class": "career", style: "--c:" + sideColor(side) }, [
      el("div", { "class": "career-title", text: (state.mode === "po" ? "Playoff career · " : "Career · ") + STAT_NAMES[stat.key] }),
      svg,
      el("div", { "class": "career-sub", text: "Shaded by team · click a season to select it" })
    ]);
  }
  // Head to head: mirrored stat bars + one shared honors table
  function renderH2H() {
    var root = document.getElementById("h2h");
    root.innerHTML = "";
    var L = state.left, R = state.right;
    var lr = statRow(L.player, L.season), rr = statRow(R.player, R.season);
    root.style.setProperty("--lc", sideColor("left"));

    root.style.setProperty("--rc", sideColor("right"));

    function nameCell(st, cls) {
      var a = ageIn(st.player, st.season);
      return el("div", { "class": "who " + cls }, [
        el("b", { text: st.player.name }),
        el("span", { text: st.season + (state.mode === "po" ? " playoffs" : "") + (a != null ? " · age " + a : "") })      ]);
    }
      root.appendChild(el("div", { "class": "h2h-head" }, [nameCell(L, "l"), el("h2", { text: "Head to head" }), nameCell(R, "r")]));

    // Say so when a player didn't make the playoffs that season
    [L, R].forEach(function (st) {
      if (!statRow(st.player, st.season)) {
        root.appendChild(el("p", { "class": "missed", text: st.player.name + " didn't make the playoffs in " + st.season + "." }));
      }
    });

        // dropdown to pick which stat the career charts show
    var statSel = el("select", { id: "stat-pick", "aria-label": "Stat to chart" });
    STATS.forEach(function (s) {
      var o = el("option", { value: s.key, text: STAT_NAMES[s.key] });
      if (s.key === state.stat) o.selected = true;
      statSel.appendChild(o);
    });
    statSel.onchange = function () { state.stat = statSel.value; update(); };
    root.appendChild(el("div", { "class": "stat-pick" }, [el("label", { "for": "stat-pick", text: "Chart:" }), statSel]));
    // both career charts side by side, above the stat bars
    root.appendChild(el("div", { "class": "careers" }, [careerChart("left"), careerChart("right")]));

    var grid = el("div", { "class": "bfly" });    STATS.forEach(function (s) {
      // null = no playoff stats for that player this season
      var lv = lr ? lr[s.key] : null, rv = rr ? rr[s.key] : null;
      var both = lv != null && rv != null;
      var lLead = both && lv > rv, rLead = both && rv > lv;
      function val(v, lead) {
        if (v == null) return el("span", { "class": "v none", text: "—" });
        return el("span", { "class": "v" + (lead ? " lead" : ""), text: (lead ? "👑 " : "") + s.fmt(v) });      }
      function bar(v, cls) {
        var w = v == null ? 0 : Math.min(100, v / s.max * 100);
        return el("div", { "class": "track " + cls }, [el("i", { style: "width:" + w + "%" })]);
      }
      var row = el("div", { "class": "brow" + (state.stat === s.key ? " on" : "") }, [
        val(lv, lLead), bar(lv, "l"), el("span", { "class": "k", text: s.label }), bar(rv, "r"), val(rv, rLead)
      ]);
      // hover: who leads and by how much; click: chart this stat on both careers
      var leader = lLead ? L.player.name : rLead ? R.player.name : null;
      var html = "<b>" + STAT_NAMES[s.key] + "</b><br>" +
        (leader ? leader + " by " + s.fmt(Math.abs(lv - rv)) : both ? "Tied" : "Only one player has stats") +
        "<br><span>Click to chart it above</span>";
      row.addEventListener("mousemove", function (ev) { showTip(html, ev.clientX, ev.clientY); });
      row.addEventListener("mouseleave", hideTip);
      clickable(row, "Chart " + STAT_NAMES[s.key], function () { hideTip(); state.stat = s.key; update(); });
      grid.appendChild(row);
    });
    root.appendChild(grid);

    var lc = accoladeCounts(L.player, L.season), rc = accoladeCounts(R.player, R.season);
    root.appendChild(el("h3", { text: "Honors through " + L.season + " vs. through " + R.season }));
    var tbl = el("div", { "class": "acc2" });
    var any = false;
    ACC_ORDER.forEach(function (k) {
      var a = lc[k], b = rc[k];
      if (!a && !b) return;
      any = true;
      function n(v, lead) { return el("span", { "class": "n" + (lead ? " lead" : "") + (v ? "" : " zero"), text: v ? (lead ? "👑 " : "") + "×" + v : "–" }); }      tbl.appendChild(el("div", { "class": "arow" }, [n(a, a > b), el("span", { "class": "lbl", text: ACC_LABELS[k] }), n(b, b > a)]));
    });
    if (!any) tbl.appendChild(el("div", { "class": "arow none", text: "No honors yet on either side" }));
    root.appendChild(tbl);
  }

  // Redraw everything whenever anything changes
  function renderMode() {
    var sw = document.getElementById("mode");
    sw.innerHTML = "";
    [["reg", "Regular season"], ["po", "Playoffs"]].forEach(function (m) {
      var b = el("button", { type: "button", "aria-pressed": String(state.mode === m[0]), text: m[1] });
      b.onclick = function () { state.mode = m[0]; update(); };
      sw.appendChild(b);
    });
  }
  function update() {
    renderMode();
    render("left");
    render("right");
    renderH2H();
  }
  update();
})();
