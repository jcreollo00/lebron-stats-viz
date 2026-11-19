// Action photos: a faded photo of each player in an iconic pose (jumper, dunk...) behind the stat bars and
// honors, fading out toward the center. It crossfades and slides when you change a player.
// Self-contained: needs no changes to app.js, and it never changes the position of any existing element.
// Load it after app.js.
//
// Where the photos go (one per player, nothing is shown for a player without one):
//   images/players/<player-id>/action.jpg        e.g. images/players/michael-jordan/action.jpg
// Optional extras in a player's data file:
//   action: "images/players/x/dunk.png"          use a different path or format
//   actionPos: "40% 20%"                         which part of the photo stays visible (CSS object-position)
//   actionCredit: "Name, CC BY-SA 4.0"           small "Photo: ..." credit shown in the corner
(function () {
  var h2h = document.getElementById("h2h");
  if (!h2h || !h2h.parentNode || !window.PLAYERS) return;
  var board = h2h.parentNode;
  var reduced = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  var OPACITY = 0.55;          // how strong the photo is on wide screens ("a little faded")
  var OPACITY_NARROW = 0.26;   // on phones the photo sits behind the stats, so it is fainter
  var WIDTH = "34%";           // how much of the width each photo covers

  function byId(id) { return window.PLAYERS.filter(function (p) { return p.id === id; })[0]; }
  function rgba(hex, a) {
    var h = (hex || "").trim().replace("#", "");
    if (h.length === 3) h = h.replace(/./g, "$&$&");
    var n = parseInt(h, 16);
    if (h.length !== 6 || isNaN(n)) return "rgba(136,136,136," + a + ")";
    return "rgba(" + ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")";
  }

  // The layer: a zero-height positioned wrapper right above #h2h. Its children are absolutely placed
  // over the stats area, and z-index:-1 inside an isolated .board puts them behind the content but
  // above the board's background. Nothing that already exists gets repositioned.
  board.style.isolation = "isolate";
  var layer = document.createElement("div");
  layer.setAttribute("aria-hidden", "true");
  layer.style.cssText = "position:relative;height:0;z-index:-1;pointer-events:none";
  board.insertBefore(layer, h2h);

  var slots = {};
  ["left", "right"].forEach(function (side) {
    var el = document.createElement("div");
    el.style.cssText = "position:absolute;top:0;height:0;" + side + ":0;width:" + WIDTH + ";overflow:hidden";

    var shade = document.createElement("div");      // fades the top and bottom edges into the panel color
    shade.style.cssText = "position:absolute;left:0;top:0;right:0;bottom:0;z-index:2;" +
      "background:linear-gradient(to bottom,var(--panel,#171a23) 0%,rgba(0,0,0,0) 30%,rgba(0,0,0,0) 70%,var(--panel,#171a23) 100%)";
    var credit = document.createElement("div");
    credit.style.cssText = "position:absolute;bottom:8px;" + side + ":10px;z-index:3;font:10px system-ui,sans-serif;" +
      "color:rgba(238,240,246,.55)";
    el.appendChild(shade);
    el.appendChild(credit);
    layer.appendChild(el);
    slots[side] = { el: el, credit: credit, pid: null, img: null, seq: 0 };
  });

  function dx(side) { return (side === "left" ? -24 : 24) + "px"; }
  function narrow() { return board.clientWidth < 700; }

  function fadeOut(img, side) {
    if (!img) return;
    img.style.opacity = "0";
    img.style.transform = "translateX(" + dx(side) + ")";
    setTimeout(function () { if (img.parentNode) img.parentNode.removeChild(img); }, 750);
  }

  function setPlayer(side, pid, color) {
    var s = slots[side], p = byId(pid);
    var cx = side === "left" ? "25%" : "75%";
    s.el.style.background = "radial-gradient(ellipse at " + cx + " 55%," + rgba(color, 0.3) + ",rgba(0,0,0,0) 70%)";
    if (s.pid === pid) return;
    s.pid = pid;
    var seq = ++s.seq;
    fadeOut(s.img, side);
    s.img = null;
    s.credit.textContent = "";
    if (!p) return;

    var img = new Image();
    img.alt = "";
    img.onload = function () {
      if (seq !== s.seq) return;                    // the player changed again while this was loading
      var fade = side === "left" ? "to right" : "to left";
      var mask = "linear-gradient(" + fade + ",#000 40%,rgba(0,0,0,0) 100%)";
      img.style.cssText = "position:absolute;left:0;top:0;width:100%;height:100%;object-fit:cover;" +
        "object-position:" + (p.actionPos || "50% 30%") + ";opacity:0;filter:saturate(.9) brightness(.85);" +
        "-webkit-mask-image:" + mask + ";mask-image:" + mask + ";" +
        (reduced ? "" : "transform:translateX(" + dx(side) + ");transition:opacity .6s ease,transform .6s cubic-bezier(.22,1,.36,1);");
      s.el.insertBefore(img, s.el.firstChild);
      s.img = img;
      s.credit.textContent = p.actionCredit ? "Photo: " + p.actionCredit : "";
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {         // two frames, so the starting state is painted first
          if (s.img !== img) return;
          img.style.opacity = String(narrow() ? OPACITY_NARROW : OPACITY);
          img.style.transform = "none";
        });
      });
    };
    img.onerror = function () { /* no photo for this player yet: show nothing */ };
    img.src = p.action || "images/players/" + p.id + "/action.jpg";
  }

  // Cover the stats and honors, not the charts above them.
  function layout() {
    var base = layer.getBoundingClientRect().top;
    var bfly = h2h.querySelector(".bfly");
    var top = bfly ? Math.max(0, bfly.getBoundingClientRect().top - base - 12) : 0;
    var height = Math.max(0, h2h.getBoundingClientRect().bottom - base - top);
    var w = narrow() ? "55%" : WIDTH;
    ["left", "right"].forEach(function (side) {
      var s = slots[side];
      s.el.style.top = top + "px";
      s.el.style.height = height + "px";
      s.el.style.width = w;
      if (s.img && s.img.style.opacity !== "0") s.img.style.opacity = String(narrow() ? OPACITY_NARROW : OPACITY);
    });
  }

  function readPlayer(id) {
    var root = document.getElementById(id), sel = root && root.querySelectorAll("select")[0];
    return sel ? sel.value : null;
  }

  function sync() {
    var l = readPlayer("left"), r = readPlayer("right");
    if (!l || !r) return;
    var cs = getComputedStyle(h2h);
    setPlayer("left", l, cs.getPropertyValue("--lc"));
    setPlayer("right", r, cs.getPropertyValue("--rc"));
    layout();
  }

  // app.js redraws #left, #right and #h2h together, so one batch of changes = one sync()
  if (window.MutationObserver) {
    var mo = new MutationObserver(sync);
    ["left", "right", "h2h"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) mo.observe(el, { childList: true });
    });
  }
  if (window.ResizeObserver) {
    var ro = new ResizeObserver(layout);
    ro.observe(h2h);
    ro.observe(board);
  }
  window.addEventListener("resize", layout);
  window.addEventListener("load", layout);
  sync();
})();
