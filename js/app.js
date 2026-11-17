(function () {
  var TEAM_COLORS = {
    "Cleveland Cavaliers": "#c8102e", "Miami Heat": "#e03a3e", "Los Angeles Lakers": "#a77bd6",
    "Chicago Bulls": "#ce1141", "Washington Wizards": "#5b84c4", "Golden State Warriors": "#fdb927", "Orlando Magic": "#0077c0", "Phoenix Suns": "#e56020", "Boston Celtics": "#2a9d5c", "Milwaukee Bucks": "#3aa66b"
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

  // Photos are all drawn at the same height. Because each photo is framed a little differently,
  // this nudges each player's head to about the same size. Default is 1; raise it if a head looks small.
  var PHOTO_SCALE = { "lebron-james": 1.16, "kareem-abdul-jabbar": 1.14, "kobe-bryant": 1.14, "shaquille-oneal": 1.06, "stephen-curry": 1.08, "michael-jordan": 1 };

  var players = window.PLAYERS;
  var state = {
    left: { player: byId("lebron-james") || players[0], season: null },
     right: { player: byId("michael-jordan") || players[1] || players[0], season: null },
    mode: "reg"   // "reg" = regular season, "po" = playoffs
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
    var grid = el("div", { "class": "bfly" });
    STATS.forEach(function (s) {
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
      grid.appendChild(el("div", { "class": "brow" }, [
        val(lv, lLead), bar(lv, "l"), el("span", { "class": "k", text: s.label }), bar(rv, "r"), val(rv, rLead)
      ]));
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
