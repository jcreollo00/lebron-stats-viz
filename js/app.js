(function () {
  var TEAM_COLORS = {
    "Cleveland Cavaliers": "#c8102e", "Miami Heat": "#e03a3e", "Los Angeles Lakers": "#a77bd6",
    "Chicago Bulls": "#ce1141", "Washington Wizards": "#5b84c4", "Golden State Warriors": "#fdb927"
  };
    // Used for the right side when both players wear the same team color (e.g. LeBron and Kobe on the Lakers).
  var SAME_COLOR_FALLBACK = "#c9ccd6";
  var ACC_LABELS = {
    champion: "NBA Champion", finals_mvp: "Finals MVP", mvp: "Regular-Season MVP", roy: "Rookie of the Year",
    dpoy: "Defensive Player of the Year", scoring: "Scoring Title", assists: "Assists Leader", steals: "Steals Leader",
    allstar: "All-Star", asg_mvp: "All-Star Game MVP", cup_mvp: "NBA Cup MVP", clutch: "Clutch Player of the Year",
    wcf_mvp: "Western Conf. Finals MVP", olympic: "Olympic Gold"
  };
  var ACC_ORDER = ["champion", "finals_mvp", "mvp", "roy", "dpoy", "scoring", "assists", "steals", "wcf_mvp", "cup_mvp", "clutch", "asg_mvp", "olympic", "allstar"];
  var STATS = [
    { key: "pts", label: "PTS", max: 40, fmt: function (v) { return v.toFixed(1); } },
    { key: "reb", label: "REB", max: 15, fmt: function (v) { return v.toFixed(1); } },
    { key: "ast", label: "AST", max: 12, fmt: function (v) { return v.toFixed(1); } },
    { key: "fg",  label: "FG%", max: 70, fmt: function (v) { return v.toFixed(1) + "%"; } },
    { key: "tp",  label: "3PT%", max: 50, fmt: function (v) { return v.toFixed(1) + "%"; } },
    { key: "blk", label: "BLK", max: 3, fmt: function (v) { return v.toFixed(1); } }
  ];

  var players = window.PLAYERS;
  var state = {
    left: { player: byId("lebron-james") || players[0], season: null },
    right: { player: byId("michael-jordan") || players[1] || players[0], season: null }
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
    var other = side === "left" ? state.right : state.left;
    var st = state[side], p = st.player, row = seasonRow(p, st.season);
    root.style.setProperty("--c", sideColor(side));
    root.innerHTML = "";

    // pickers
    var pSel = el("select", { "aria-label": "Player (" + side + ")" });
    players.forEach(function (q) {
      var o = el("option", { value: q.id, text: q.name }); if (q.id === p.id) o.selected = true; pSel.appendChild(o);
    });
    pSel.onchange = function () {
      st.player = byId(pSel.value);
      var has = seasonRow(st.player, st.season);
      if (!has) st.season = lastSeason(st.player);
      update();
    };
    var ySel = el("select", { "aria-label": "Season (" + side + ")" });
    p.seasons.forEach(function (s) {
      var o = el("option", { value: s.season, text: s.season }); if (s.season === st.season) o.selected = true; ySel.appendChild(o);
    });
    ySel.onchange = function () { st.season = ySel.value; update(); };
    root.appendChild(el("div", { "class": "pickers" }, [pSel, ySel]));

    // team above portrait
    root.appendChild(el("div", { "class": "team", text: row.team }));
    var portrait = el("div", { "class": "portrait" }, [el("span", { "class": "ini", text: p.initials })]);
    var img = new Image();
    img.alt = p.name + " " + st.season;
    img.onload = function () { portrait.classList.add("has-img"); portrait.insertBefore(img, portrait.firstChild); };
    var tried = 0, paths = ["images/players/" + p.id + "/" + st.season + ".jpg", "images/players/" + p.id + ".jpg"];
    img.onerror = function () { tried++; if (tried < paths.length) img.src = paths[tried]; };
    img.src = paths[0];
    var age = ageIn(p, st.season);
    var meta = st.season + " season" + (age != null ? " · Age " + age : "") + " · " + row.gp + " games";
    var cap = el("div", { "class": "cap" }, [
      el("div", { "class": "pname", text: p.name }),
      el("div", { "class": "season-label", text: meta }),
      el("div", { "class": "season-label dim", text: "Career season " + (seasonIndex(p, st.season) + 1) + " of " + p.seasons.length })
    ]);
    portrait.appendChild(cap);
    root.appendChild(portrait);

    if (p.bref) root.appendChild(el("a", { "class": "src", href: p.bref, target: "_blank", rel: "noopener", text: "Full stats on Basketball-Reference ↗" }));
  }

  // Head to head: mirrored stat bars + one shared honors table
  function renderH2H() {
    var root = document.getElementById("h2h");
    root.innerHTML = "";
    var L = state.left, R = state.right;
    var lr = seasonRow(L.player, L.season), rr = seasonRow(R.player, R.season);
    root.style.setProperty("--lc", sideColor("left"));
    root.style.setProperty("--rc", sideColor("right"));

    function nameCell(st, cls) {
      var a = ageIn(st.player, st.season);
      return el("div", { "class": "who " + cls }, [
        el("b", { text: st.player.name }),
        el("span", { text: st.season + (a != null ? " · age " + a : "") })
      ]);
    }
    root.appendChild(el("div", { "class": "h2h-head" }, [nameCell(L, "l"), el("h2", { text: "Head to head" }), nameCell(R, "r")]));

    var grid = el("div", { "class": "bfly" });
    STATS.forEach(function (s) {
      var lv = lr[s.key], rv = rr[s.key];
      var lLead = lv > rv, rLead = rv > lv;
      function val(v, lead) { return el("span", { "class": "v" + (lead ? " lead" : ""), text: (lead ? "▲ " : "") + s.fmt(v) }); }
      function bar(v, cls) {
        return el("div", { "class": "track " + cls }, [el("i", { style: "width:" + Math.min(100, v / s.max * 100) + "%" })]);
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
      function n(v, lead) { return el("span", { "class": "n" + (lead ? " lead" : "") + (v ? "" : " zero"), text: v ? (lead ? "▲ " : "") + "×" + v : "–" }); }
      tbl.appendChild(el("div", { "class": "arow" }, [n(a, a > b), el("span", { "class": "lbl", text: ACC_LABELS[k] }), n(b, b > a)]));
    });
    if (!any) tbl.appendChild(el("div", { "class": "arow none", text: "No honors yet on either side" }));
    root.appendChild(tbl);
  }

  // Redraw everything whenever anything changes
  function update() {
    render("left");
    render("right");
    renderH2H();
  }
  update();
})();