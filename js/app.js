(function () {
  var TEAM_COLORS = {
    "Cleveland Cavaliers": "#c8102e", "Miami Heat": "#e03a3e", "Los Angeles Lakers": "#a77bd6",
    "Chicago Bulls": "#ce1141", "Washington Wizards": "#5b84c4", "Golden State Warriors": "#fdb927"
  };
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

  function el(tag, attrs, kids) {
    var e = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "text") e.textContent = attrs[k]; else e.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) { e.appendChild(c); });
    return e;
  }

  function accoladeList(p, season) {
    var y = startYear(season), out = [];
    ACC_ORDER.forEach(function (key) {
      var list = (p.accolades[key] || []).filter(function (s) { return startYear(s) <= y; });
      if (list.length) out.push({ label: ACC_LABELS[key], count: list.length });
    });
    return out;
  }

  function render(side) {
    var root = document.getElementById(side);
    var other = side === "left" ? state.right : state.left;
    var st = state[side], p = st.player, row = seasonRow(p, st.season);
    var color = TEAM_COLORS[row.team] || "#888";
    root.style.setProperty("--c", color);
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
      render(side);
    };
    var ySel = el("select", { "aria-label": "Season (" + side + ")" });
    p.seasons.forEach(function (s) {
      var o = el("option", { value: s.season, text: s.season }); if (s.season === st.season) o.selected = true; ySel.appendChild(o);
    });
    ySel.onchange = function () { st.season = ySel.value; render(side); };
    root.appendChild(el("div", { "class": "pickers" }, [pSel, ySel]));

    // team above portrait
    root.appendChild(el("div", { "class": "team", text: row.team }));
    var portrait = el("div", { "class": "portrait", text: p.initials });
    var img = new Image();
    img.alt = p.name + " " + st.season;
    img.onload = function () { portrait.textContent = ""; portrait.appendChild(img); };
    var tried = 0, paths = ["images/players/" + p.id + "/" + st.season + ".jpg", "images/players/" + p.id + ".jpg"];
    img.onerror = function () { tried++; if (tried < paths.length) img.src = paths[tried]; };
    img.src = paths[0];
    root.appendChild(portrait);
    root.appendChild(el("div", { "class": "pname", text: p.name }));
    root.appendChild(el("div", { "class": "season-label", text: st.season + " season · " + row.gp + " games" }));

    // stats
    var o = other.player, orow = seasonRow(o, other.season);
    var stats = el("div", { "class": "stats" });
    STATS.forEach(function (s) {
      var v = row[s.key], ov = orow[s.key];
      var lead = v > ov ? " lead" : "";
      var bar = el("div", { "class": "bar" }, [el("i", { style: "width:" + Math.min(100, v / s.max * 100) + "%" })]);
      stats.appendChild(el("div", { "class": "stat" + lead }, [
        el("span", { "class": "k", text: s.label }), bar, el("span", { "class": "v", text: s.fmt(v) })
      ]));
    });
    root.appendChild(stats);

    // accolades
    root.appendChild(el("h2", { text: "Accolades through " + st.season }));
    var ul = el("ul", { "class": "acc" });
    var list = accoladeList(p, st.season);
    if (!list.length) ul.appendChild(el("li", { "class": "none", text: "None yet" }));
    list.forEach(function (a) {
      ul.appendChild(el("li", {}, [el("span", { text: a.label }), el("b", { text: "×" + a.count })]));
    });
    root.appendChild(ul);
  }

  function renderAll() { render("left"); render("right"); }
  // re-render the other side too, because the highlighted "leader" stat depends on both sides
  var _render = render;
  render = function (side) { _render(side); var o = side === "left" ? "right" : "left"; if (!render._busy) { render._busy = true; _render(o); render._busy = false; } };
  renderAll();
})();
