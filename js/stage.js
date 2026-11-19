// Head-to-head stage: two cartoon figures stand on a court strip under the portraits, facing each other.
// Change a player and that figure turns, walks off its edge of the screen while the new player walks on.
// The player who leads more categories gets a crown that floats gently beside their count. Self-contained: reads
// the pickers and team colors that app.js already draws, so it needs no changes to app.js. Load it after app.js. With "reduce motion" on, the figures simply appear in place.
(function () {
  var split = document.querySelector(".split");
  if (!split || !window.PLAYERS) return;
  var reduced = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  // ---- who they are ----
  // Heights are in inches (Basketball-Reference). You can also put `height: 81` in a player's data file.
  var LOOKS = {
    "lebron-james":        { inches: 81, build: 1.1,  headband: true },
    "michael-jordan":      { inches: 78, build: 1.0 },
    "kobe-bryant":         { inches: 78, build: 1.0 },
    "stephen-curry":       { inches: 74, build: 0.9 },
    "shaquille-oneal":     { inches: 85, build: 1.35 },
    "kareem-abdul-jabbar": { inches: 86, build: 0.9,  goggles: true }
  };
  function byId(id) { return window.PLAYERS.filter(function (p) { return p.id === id; })[0]; }
  function look(p) {
    var l = (p && LOOKS[p.id]) || {};
    return { inches: (p && p.height) || l.inches || 78, build: l.build || 1, headband: !!l.headband, goggles: !!l.goggles };
  }
  function heightText(inches) { return Math.floor(inches / 12) + "'" + (inches % 12) + '"'; }

  function hexToRgb(s) {
    var h = (s || "").trim().replace("#", "");
    if (h.length === 3) h = h.replace(/./g, "$&$&");
    var n = parseInt(h, 16);
    return (h.length !== 6 || isNaN(n)) ? [136, 136, 136] : [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function rgb(c, k) {
    k = k == null ? 1 : k;
    return "rgb(" + Math.round(c[0] * k) + "," + Math.round(c[1] * k) + "," + Math.round(c[2] * k) + ")";
  }

  // ---- the stage element (inserted between the portraits and the head-to-head bars) ----
  var stage = document.createElement("section");
  stage.id = "stage";
  stage.setAttribute("aria-label", "The two players facing each other");
  stage.style.cssText = "position:relative;height:250px;border-top:1px solid var(--line,#2a2f3d);" +
    "background:linear-gradient(#171a23,#0f1117)";
  var cv = document.createElement("canvas");
  cv.setAttribute("aria-hidden", "true");
  cv.style.cssText = "position:absolute;left:0;top:0;width:100%;height:100%";
  stage.appendChild(cv);
  split.insertAdjacentElement("afterend", stage);

  var ctx = cv.getContext("2d"), W = 0, H = 0, FLOOR = 0, PXI = 1;   // PXI = pixels per inch of height
  function resize() {
    var dpr = window.devicePixelRatio || 1;
    W = stage.clientWidth; H = stage.clientHeight;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    FLOOR = H - 52;
    PXI = (FLOOR - 46) / 88;              // the tallest player (7'4") just fits
  }
  resize();
  window.addEventListener("resize", resize);

  // ---- state ----
  var WALK = 440;                          // px/s
  var slots = { left: { fig: null, leaving: [] }, right: { fig: null, leaving: [] } };
  var counts = { left: 0, right: 0 }, prevCounts = null, vsAlpha = 0;

  function dirIn(side) { return side === "left" ? 1 : -1; }   // +1 means "faces right"
  function standX(side) {
    var gap = Math.min(180, Math.max(110, W * 0.14));
    return W / 2 - dirIn(side) * gap / 2;
  }

  function spawn(side, w) {
    var d = dirIn(side);
    slots[side].fig = {
      pid: w.pid, name: w.name, team: w.team, inches: w.inches, build: w.build,
      headband: w.headband, goggles: w.goggles,
      x: reduced ? standX(side) : (side === "left" ? -80 : W + 80),
      state: reduced ? "idle" : "in",
      facing: d, facingT: d, walk: 0, phase: 0, t: Math.random() * 6, ui: reduced ? 1 : 0, hopT: -1,
      cur: hexToRgb(w.color), tgt: hexToRgb(w.color)
    };
  }

  function applySide(side, info) {
    var slot = slots[side], f = slot.fig, p = byId(info.pid), lk = look(p);
    var want = {
      pid: info.pid, name: p ? p.name : info.pid, team: info.team, color: info.color,
      inches: lk.inches, build: lk.build, headband: lk.headband, goggles: lk.goggles
    };
    if (f && f.pid === want.pid) {          // same player: only the jersey color / team may change
      f.tgt = hexToRgb(want.color);
      f.team = want.team;
      return;
    }
    if (f && !reduced) {                    // different player: the old one turns and walks off
      f.state = "out";
      slot.leaving.push(f);
      if (slot.leaving.length > 3) slot.leaving.shift();
    }
    spawn(side, want);                      // the new one walks on right away
  }

  // ---- reading what app.js drew ----
  function readSide(id) {
    var root = document.getElementById(id);
    if (!root) return null;
    var sels = root.querySelectorAll("select"), teamEl = root.querySelector(".team");
    if (!sels.length || !teamEl) return null;
    var c = (getComputedStyle(root).getPropertyValue("--c") || "").trim();
    var pid = sels[0].value, season = sels[1] ? sels[1].value : "", p = byId(pid), team = "";
    if (p && p.seasons) {                    // full team name straight from the data
      p.seasons.forEach(function (s) { if (s.season === season) team = s.team; });
    }
    if (!team) team = teamEl.textContent.trim().replace(/^Team\s*/i, "");   // fallback: the on-screen label
    return { pid: pid, team: team, color: c || "#888" };
  }

  function leaderCounts() {                  // how many categories each side leads (the ▲ marks)
    var l = 0, r = 0;
    document.querySelectorAll("#h2h .brow").forEach(function (row) {
      var vs = row.querySelectorAll(".v");
      if (vs.length < 2) return;
      if (vs[0].classList.contains("lead")) l++;
      if (vs[vs.length - 1].classList.contains("lead")) r++;
    });
    return { left: l, right: r };
  }

  function sync() {
    var L = readSide("left"), R = readSide("right");
    if (!L || !R) return;
    var c = leaderCounts();
    if (prevCounts) {                        // a side that just gained a category hops once
      ["left", "right"].forEach(function (s) {
        var f = slots[s].fig;
        if (c[s] > prevCounts[s] && f && f.state === "idle") f.hopT = 0;
      });
    }
    counts = c;
    prevCounts = { left: c.left, right: c.right };
    applySide("left", L);
    applySide("right", R);
  }

  // ---- motion ----
  function stepFigure(f, side, dt) {
    var d = dirIn(side), x0 = f.x, k;
    f.t += dt;
    if (f.state === "in") {
      var tx = standX(side), remain = (tx - f.x) * d;
      if (remain <= 0.5) { f.x = tx; f.state = "idle"; }
      else f.x += d * Math.min(Math.min(WALK, 70 + remain * 4.5) * dt, remain);
      f.facingT = d;
    } else if (f.state === "out") {
      f.facingT = -d;                        // turn around first, then walk to the edge
      if (Math.abs(f.facing - f.facingT) < 0.35) f.x -= d * WALK * dt;
    } else {
      f.x += (standX(side) - f.x) * Math.min(1, dt * 8);   // follows window resizes
      f.facingT = d;
    }
    f.facing += Math.max(-9 * dt, Math.min(9 * dt, f.facingT - f.facing));
    var dx = Math.abs(f.x - x0);
    f.phase += dx / (0.55 * f.inches * PXI) * Math.PI * 2;  // one stride per ~0.55 body heights
    f.walk += ((dx > 0.05 ? 1 : 0) - f.walk) * Math.min(1, dt * 10);
    f.ui += ((f.state === "idle" ? 1 : 0) - f.ui) * Math.min(1, dt * 6);
    k = Math.min(1, dt * 6);
    for (var i = 0; i < 3; i++) f.cur[i] += (f.tgt[i] - f.cur[i]) * k;   // jersey color glides
    if (f.hopT >= 0) { f.hopT += dt; if (f.hopT > 0.5) f.hopT = -1; }
  }

  function update(dt) {
    ["left", "right"].forEach(function (side) {
      var slot = slots[side];
      if (slot.fig) stepFigure(slot.fig, side, dt);
      slot.leaving = slot.leaving.filter(function (f) {
        stepFigure(f, side, dt);
        return f.x > -90 && f.x < W + 90;
      });
    });
    var both = slots.left.fig && slots.right.fig && slots.left.fig.state === "idle" && slots.right.fig.state === "idle";
    vsAlpha += ((both ? 1 : 0) - vsAlpha) * Math.min(1, dt * 6);
  }

  // ---- drawing ----
  function drawFloor() {
    var g = ctx.createLinearGradient(0, FLOOR, 0, H);
    g.addColorStop(0, "#3a2a1c");
    g.addColorStop(1, "#1d150e");
    ctx.fillStyle = g;
    ctx.fillRect(0, FLOOR, W, H - FLOOR);
    ctx.strokeStyle = "rgba(255,255,255,.14)";
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, FLOOR); ctx.lineTo(W, FLOOR); ctx.stroke();            // baseline
    ctx.beginPath(); ctx.moveTo(W / 2, FLOOR); ctx.lineTo(W / 2, H); ctx.stroke();        // half-court line
    ctx.beginPath(); ctx.ellipse(W / 2, FLOOR + 26, 64, 12, 0, 0, Math.PI * 2); ctx.stroke();   // center circle
  }

  // Draws one figure in profile (faces +x, mirrored by f.facing) and returns the y of the top of its head.
  function drawFigure(f) {
    var h = f.inches * PXI, b = Math.sqrt(f.build);
    var headR = h * 0.065, thigh = h * 0.245, shin = h * 0.245, torso = h * 0.31, neck = h * 0.04;
    var uArm = h * 0.16, fArm = h * 0.15, shoe = h * 0.03, shoeW = h * 0.045;
    var w = f.walk, ph = f.phase;

    function legPose(p) {                     // angles are from vertical, positive = forward
      var a = 0.55 * Math.sin(p) * w;
      var k = (0.08 + 0.95 * Math.max(0, Math.cos(p))) * w;   // knee bends while the leg swings through
      var kx = Math.sin(a) * thigh, ky = Math.cos(a) * thigh;
      return { kx: kx, ky: ky, ax: kx + Math.sin(a - k) * shin, ay: ky + Math.cos(a - k) * shin };
    }
    var near = legPose(ph), far = legPose(ph + Math.PI);
    var drop = Math.max(near.ay, far.ay) + shoe;           // lowest foot stays on the floor
    var hop = f.hopT >= 0 ? Math.sin(Math.PI * f.hopT / 0.5) * 0.1 * h : 0;
    var hipX = 0, hipY = FLOOR - drop - hop + Math.sin(f.t * 2.2) * 0.004 * h * (1 - w);

    var lean = 0.02 + 0.07 * w;
    var sx = hipX + Math.sin(lean) * torso, sy = hipY - Math.cos(lean) * torso;     // shoulder
    var nx = sx + Math.sin(lean) * neck, ny = sy - Math.cos(lean) * neck;
    var hx = nx + Math.sin(lean) * headR, hy = ny - Math.cos(lean) * headR;         // head centre

    function armPose(p) {
      var a = -0.5 * Math.sin(p) * w + 0.05 + 0.03 * Math.sin(f.t * 1.7) * (1 - w);
      var e = 0.25 + 0.35 * w;
      var ex = sx + Math.sin(a) * uArm, ey = sy + Math.cos(a) * uArm;
      return { ex: ex, ey: ey, wx: ex + Math.sin(a + e) * fArm, wy: ey + Math.cos(a + e) * fArm };
    }
    var nearArm = armPose(ph + Math.PI), farArm = armPose(ph);

    var skin = "#c9ccd6", skinFar = "#8f94a6";
    var jersey = rgb(f.cur), shorts = rgb(f.cur, 0.62), shortsFar = rgb(f.cur, 0.45);
    var lw = h * 0.05 * b;

    // shadow
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,.35)";
    ctx.beginPath();
    ctx.ellipse(f.x, FLOOR + 4, h * 0.2, h * 0.03, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(f.x, 0);
    ctx.scale(f.facing, 1);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    function seg(x1, y1, x2, y2, wid, col) {
      ctx.strokeStyle = col; ctx.lineWidth = wid;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    }
    function leg(L, skinCol, shortsCol, shoeCol) {
      seg(hipX, hipY, hipX + L.kx, hipY + L.ky, lw, skinCol);
      seg(hipX + L.kx, hipY + L.ky, hipX + L.ax, hipY + L.ay, lw, skinCol);
      seg(hipX, hipY, hipX + L.kx * 0.7, hipY + L.ky * 0.7, h * 0.095 * b, shortsCol);   // shorts
      var sy2 = hipY + L.ay + shoe - shoeW / 2;
      seg(hipX + L.ax - h * 0.01, sy2, hipX + L.ax + h * 0.075, sy2, shoeW, shoeCol);   // shoe
    }
    function arm(A, col) {
      seg(sx, sy, A.ex, A.ey, lw * 0.85, col);
      seg(A.ex, A.ey, A.wx, A.wy, lw * 0.85, col);
    }

    arm(farArm, skinFar);
    leg(far, skinFar, shortsFar, "#8f94a6");
    seg(hipX, hipY - h * 0.02, sx, sy, h * 0.12 * b, jersey);                        // jersey
    seg(sx, sy, nx, ny, h * 0.04 * b, skin);                                           // neck
    leg(near, skin, shorts, "#eef0f6");
    arm(nearArm, skin);

    ctx.fillStyle = skin;                                                              // head
    ctx.beginPath(); ctx.arc(hx, hy, headR, 0, Math.PI * 2); ctx.fill();
    var ex = hx + headR * 0.45, ey = hy - headR * 0.1;
    ctx.fillStyle = "#1b1e29";
    ctx.beginPath(); ctx.arc(ex, ey, headR * 0.12, 0, Math.PI * 2); ctx.fill();        // eye

    if (f.headband) seg(hx - headR * 0.95, hy - headR * 0.4, hx + headR * 0.95, hy - headR * 0.4, headR * 0.3, "#eef0f6");
    if (f.goggles) {
      ctx.strokeStyle = "#1b1e29"; ctx.lineWidth = Math.max(1.5, headR * 0.14);
      ctx.fillStyle = "rgba(190,225,255,.4)";
      ctx.beginPath(); ctx.arc(ex - headR * 0.1, ey, headR * 0.4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ex - headR * 0.5, ey); ctx.lineTo(hx - headR * 0.95, ey); ctx.stroke();   // strap
    }

    ctx.restore();
    return hy - headR;
  }

  function drawTags(f, side, headTop) {
    var narrow = W < 560;
    var name = narrow ? f.name.split(" ").slice(-1)[0] : f.name;
    ctx.save();
    ctx.textAlign = "center";
    ctx.fillStyle = "#eef0f6";
    ctx.font = "700 13px system-ui, sans-serif";
    ctx.fillText(name, f.x, FLOOR + 22);
    ctx.fillStyle = "#9aa1b5";
    ctx.font = "11px system-ui, sans-serif";
    ctx.fillText(heightText(f.inches) + (narrow ? "" : " \u00B7 " + f.team), f.x, FLOOR + 38);
    if (f.ui > 0.02) {                       // categories this player leads; the better side gets the crown
      var n = counts[side], other = counts[side === "left" ? "right" : "left"], crowned = n > other;
      var y = headTop - 12;
      ctx.globalAlpha = f.ui;
      ctx.fillStyle = crowned ? "#f2b134" : "#9aa1b5";
      ctx.font = "800 18px system-ui, 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif";
      ctx.fillText(String(n), f.x, y);                          // the count stays put
      if (crowned) {                                            // the crown floats up and down beside it
        var bob = reduced ? 0 : Math.sin(f.t * 2.6) * 3;
        ctx.textAlign = "right";
        ctx.fillText("\uD83D\uDC51", f.x - ctx.measureText(String(n)).width / 2 - 4, y + bob);
      }
    }
    ctx.restore();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    drawFloor();
    if (vsAlpha > 0.02) {
      ctx.save();
      ctx.globalAlpha = vsAlpha;
      ctx.textAlign = "center";
      ctx.fillStyle = "#9aa1b5";
      ctx.font = "800 22px system-ui, sans-serif";
      ctx.fillText("VS", W / 2, FLOOR - 70);
      ctx.restore();
    }
    ["left", "right"].forEach(function (side) {
      var slot = slots[side];
      slot.leaving.forEach(function (f) { drawTags(f, side, drawFigure(f)); });
      if (slot.fig) drawTags(slot.fig, side, drawFigure(slot.fig));
    });
  }

  // ---- loop and wiring ----
  var last = performance.now();
  function frame(t) {
    update(Math.max(0, Math.min(0.05, (t - last) / 1000)));
    last = t;
    draw();
    requestAnimationFrame(frame);
  }

  // app.js redraws #left, #right and #h2h together, so one batch of changes = one sync()
  if (window.MutationObserver) {
    var mo = new MutationObserver(sync);
    ["left", "right", "h2h"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) mo.observe(el, { childList: true });
    });
  }
  sync();
  requestAnimationFrame(frame);
})();
