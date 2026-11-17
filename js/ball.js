// Bouncing basketballs + a scoring hoop.
//  - Click anywhere, or change a player/season, to drop some balls.
//  - When the overall leader flips (the side with more ▲ marks changes), a hoop slides in on the new
//    leader's edge of the screen and a ball swishes through it.
// Self-contained: draws on a fixed full-screen canvas and watches #h2h, so it needs no changes to app.js.
// Skipped entirely when the user prefers reduced motion.
(function () {
  var reduced = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  if (reduced) return;

  // Tweak the feel here
  var GRAVITY = 1800;   // px/s^2
  var BOUNCE = 0.72;    // energy kept after hitting the floor
  var WALL = 0.8;       // energy kept after hitting a side wall
  var MAX = 40;         // most balls on screen at once
  var LIFE = 5;         // seconds before a ball starts fading
  var FADE = 1;         // seconds to fade out
  var HOOP_HEIGHT = 0.4; // rim height as a fraction of the window height (from the top)

  var balls = [], bits = [], hoop = null, raf = null, last = 0, on = true;
  try { on = localStorage.getItem("balls") !== "off"; } catch (e) {}

  // ---- canvas ----
  var cv = document.createElement("canvas");
  cv.setAttribute("aria-hidden", "true");
  cv.style.cssText = "position:fixed;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:40";
  document.body.appendChild(cv);
  var ctx = cv.getContext("2d"), W = 0, H = 0;

  function resize() {
    var dpr = window.devicePixelRatio || 1;
    W = window.innerWidth; H = window.innerHeight;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener("resize", resize);

  // ---- drawing: ball ----
  function drawBall(b, alpha) {
    var r = b.r;

    // floor shadow: darker and wider the closer the ball is to the floor
    var near = Math.max(0, 1 - (H - b.y - r) / 400);
    ctx.save();
    ctx.globalAlpha = alpha * 0.28 * near;
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.ellipse(b.x, H - 3, r * (0.6 + 0.5 * near), r * 0.16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // the ball, squashed against the floor on impact
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(b.x, b.y + r * b.s);
    ctx.scale(1 + b.s * 0.6, 1 - b.s);
    ctx.rotate(b.rot);

    var g = ctx.createRadialGradient(-r * 0.35, -r * 0.4, r * 0.1, 0, 0, r);
    g.addColorStop(0, "#ffa85c");
    g.addColorStop(0.6, "#e8691f");
    g.addColorStop(1, "#b9460f");
    ctx.strokeStyle = "rgba(35,12,4,.85)";
    ctx.lineWidth = Math.max(1.5, r * 0.09);
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();

    ctx.save();                 // seams, clipped to the ball
    ctx.clip();
    ctx.beginPath();
    ctx.moveTo(-r, 0); ctx.lineTo(r, 0);
    ctx.moveTo(0, -r); ctx.lineTo(0, r);
    ctx.stroke();
    ctx.beginPath(); ctx.arc(r * 1.4, 0, r * 2, Math.PI - 1, Math.PI + 1); ctx.stroke();
    ctx.beginPath(); ctx.arc(-r * 1.4, 0, r * 2, -1, 1); ctx.stroke();
    ctx.restore();

    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.stroke();               // outline
    ctx.restore();
  }

  // ---- drawing: hoop ----
  // The hoop is mounted on the screen edge and seen from the side: a thin backboard, a flat rim, a net.
  function hoopDir(h) { return h.side === "left" ? -1 : 1; }

  // How many px the hoop is still pushed off-screen (slides in at the start, out at the end).
  function hoopShift(h) {
    var inP = Math.min(1, h.t / 0.35);
    var outStart = h.scoredAt !== null ? h.scoredAt + 1.9 : 4.5;
    var outP = Math.min(1, Math.max(0, (h.t - outStart) / 0.5));
    return ((1 - (1 - Math.pow(1 - inP, 3))) + outP) * 90;
  }

  function drawHoopBack(h) {
    ctx.save();
    ctx.translate(hoopDir(h) * hoopShift(h), 0);
    var left = h.side === "left";
    var bx = left ? 0 : W - 8;
    ctx.fillStyle = "rgba(230,236,248,.95)";           // backboard
    ctx.fillRect(bx, h.hy - 85, 8, 115);
    ctx.fillStyle = "#ff6b1a";
    ctx.fillRect(bx, h.hy - 6, 8, 4);
    ctx.strokeStyle = "#ff6b1a";                        // arm from board to rim
    ctx.lineWidth = 4; ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(left ? 8 : W - 8, h.hy);
    ctx.lineTo(left ? h.hx - h.rimR : h.hx + h.rimR, h.hy);
    ctx.stroke();
    ctx.beginPath();                                    // far half of the rim, behind the ball
    ctx.ellipse(h.hx, h.hy, h.rimR, 7, 0, Math.PI, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  function drawHoopFront(h) {
    ctx.save();
    ctx.translate(hoopDir(h) * hoopShift(h), 0);

    // the net swells and sways right after a score
    var since = h.scoredAt !== null ? h.t - h.scoredAt : 99;
    var decay = Math.max(0, 1 - since / 0.9), w = since * 16;
    var netH = 50 + 18 * decay * (1 - Math.cos(w)) / 2;
    var cx = h.hx + 8 * decay * Math.sin(w);
    var N = 8, i, a, a0, a2, tx, ty;

    ctx.strokeStyle = "rgba(255,255,255,.78)";
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    for (i = 0; i < N; i++) {                           // diamond mesh
      a = (i / N) * Math.PI * 2; a2 = ((i + 1) / N) * Math.PI * 2; a0 = ((i - 1) / N) * Math.PI * 2;
      tx = h.hx + h.rimR * Math.cos(a); ty = h.hy + 7 * Math.sin(a);
      ctx.moveTo(tx, ty);
      ctx.lineTo(cx + h.rimR * 0.5 * Math.cos(a2), h.hy + netH + 3.5 * Math.sin(a2));
      ctx.moveTo(tx, ty);
      ctx.lineTo(cx + h.rimR * 0.5 * Math.cos(a0), h.hy + netH + 3.5 * Math.sin(a0));
    }
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(cx, h.hy + netH, h.rimR * 0.5, 3.5, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = "#ff6b1a";                        // near half of the rim, in front of the ball
    ctx.lineWidth = 4; ctx.lineCap = "round";
    ctx.beginPath();
    ctx.ellipse(h.hx, h.hy, h.rimR, 7, 0, 0, Math.PI);
    ctx.stroke();
    ctx.restore();
  }

  function drawLabel(h) {
    var since = h.t - h.scoredAt;
    var a = since < 1.6 ? 1 : Math.max(0, 1 - (since - 1.6) / 0.6);
    if (a <= 0) return;
    var rise = Math.min(1, since / 0.4);
    var y = h.hy - 46 - 24 * (1 - Math.pow(1 - rise, 3));
    var left = h.side === "left";
    var x = left ? h.hx + h.rimR + 22 : h.hx - h.rimR - 22;
    ctx.save();
    ctx.globalAlpha = a;
    ctx.textAlign = left ? "left" : "right";
    ctx.lineJoin = "round";
    ctx.lineWidth = 5;
    ctx.strokeStyle = "rgba(0,0,0,.7)";
    ctx.font = "800 24px system-ui, sans-serif";
    ctx.strokeText("SWISH!", x, y);
    ctx.fillStyle = "#fff";
    ctx.fillText("SWISH!", x, y);
    ctx.font = "700 15px system-ui, sans-serif";
    ctx.strokeText(h.line, x, y + 22);
    ctx.fillStyle = h.color;
    ctx.fillText(h.line, x, y + 22);
    ctx.restore();
  }

  // ---- physics ----
  function burst(x, y, color) {
    for (var i = 0; i < 14; i++) {
      var ang = Math.random() * Math.PI * 2, sp = 150 + Math.random() * 250;
      bits.push({ x: x, y: y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 150, age: 0, c: color });
    }
  }

  function step(dt) {
    if (hoop) {
      hoop.t += dt;
      if (hoop.scoredAt !== null ? hoop.t - hoop.scoredAt > 2.4 : hoop.t > 5) hoop = null;
    }

    bits = bits.filter(function (p) {
      p.age += dt;
      p.vy += GRAVITY * 0.5 * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      return p.age < 0.9;
    });

    balls = balls.filter(function (b) {
      b.age += dt;
      if (b.age > LIFE + FADE) return false;

      // A shot ball follows an exact arc (so it reliably goes through the rim),
      // then switches to normal physics once it has dropped through.
      if (b.path) {
        var p = b.path, h = p.hoop, prevY = b.y;
        p.t += dt;
        var tt = Math.max(0, p.t);
        b.x = p.sx + p.vx * tt;
        b.y = p.sy + p.vy * tt + 0.5 * GRAVITY * tt * tt;
        b.vx = p.vx;
        b.vy = p.vy + GRAVITY * tt;
        b.rot += b.vr * dt;
        if (h === hoop && !h.scored && prevY < h.hy && b.y >= h.hy) {
          h.scored = true;
          h.scoredAt = h.t;
          burst(h.hx, h.hy, h.color);
          b.x = h.hx;                            // the net centers it...
          b.vx *= 0.25;                          // ...slows it, and pulls it straight down
          b.vy *= 0.9;
          b.path = null;
        } else if (p.t > p.T + 0.4) {
          b.path = null;
        }
        return true;
      }

      b.vy += GRAVITY * dt;
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.rot += b.vr * dt;

      if (b.x < b.r)     { b.x = b.r;     b.vx = -b.vx * WALL; b.vr = -b.vr * WALL; }
      if (b.x > W - b.r) { b.x = W - b.r; b.vx = -b.vx * WALL; b.vr = -b.vr * WALL; }

      if (b.y > H - b.r) {                       // floor
        b.y = H - b.r;
        if (b.vy > 90) {
          b.s = Math.min(0.32, b.vy / 3000);     // squash scales with impact speed
          b.vy = -b.vy * BOUNCE;
        } else {
          b.vy = 0;                              // come to rest
        }
        b.vx *= 0.98;
        b.vr = b.vx / b.r;
      }
      if (b.vy === 0 && b.y >= H - b.r - 0.5) {  // rolling friction while resting
        b.vx *= Math.max(0, 1 - dt * 1.5);
        b.vr = b.vx / b.r;
      }

      b.s *= Math.exp(-dt * 16);                 // squash springs back
      return true;
    });
  }

  function frame(t) {
    var dt = Math.max(0, Math.min(0.033, (t - last) / 1000));
    last = t;
    step(dt);
    ctx.clearRect(0, 0, W, H);
    if (hoop) drawHoopBack(hoop);
    balls.forEach(function (b) {
      drawBall(b, b.age > LIFE ? 1 - (b.age - LIFE) / FADE : 1);
    });
    if (hoop) drawHoopFront(hoop);
    bits.forEach(function (p) {
      ctx.globalAlpha = Math.max(0, 1 - p.age / 0.9);
      ctx.fillStyle = p.c;
      ctx.fillRect(p.x - 3, p.y - 3, 6, 6);
    });
    ctx.globalAlpha = 1;
    if (hoop && hoop.scoredAt !== null) drawLabel(hoop);
    raf = (balls.length || bits.length || hoop) ? requestAnimationFrame(frame) : null;   // loop only while needed
  }

  function start() {
    if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); }
  }

  function spawn(x, y, vx, vy, r) {
    if (!on) return null;
    if (balls.length >= MAX) balls.shift();
    var b = { x: x, y: y, vx: vx, vy: vy, r: r, rot: Math.random() * 6.28, vr: vx / r, age: 0, s: 0, path: null };
    balls.push(b);
    start();
    return b;
  }

  // ---- the shot ----
  // Slide a hoop in on `side` and arc a ball through it. The flight time is chosen so the ball
  // is already dropping (at least 400 px/s) when it reaches the rim.
  function shoot(side) {
    if (!on) return;
    var r = 16, rimR = 30, V = 400;
    var hx = side === "left" ? 48 : W - 48;
    var hy = Math.round(H * HOOP_HEIGHT);
    var reach = Math.min(W * 0.6, 720) * (0.8 + Math.random() * 0.2);   // shooter's distance from the hoop
    var sx = side === "left" ? hx + reach : hx - reach;
    var sy = H - r - 2;
    var dy = sy - hy;
    var T = (V + Math.sqrt(V * V + 2 * GRAVITY * dy)) / GRAVITY;

    var nameEl = h2h && h2h.querySelector(".who." + (side === "left" ? "l" : "r") + " b");
    var color = ((h2h && getComputedStyle(h2h).getPropertyValue(side === "left" ? "--lc" : "--rc")) || "").trim() || "#f2b134";
    hoop = {
      side: side, hx: hx, hy: hy, rimR: rimR, t: 0, scored: false, scoredAt: null, color: color,
      line: nameEl && nameEl.textContent ? nameEl.textContent + " takes the lead" : "New leader"
    };

    var b = spawn(sx, sy, 0, 0, r);
    if (b) {
      b.vr = -5;                                  // a little backspin
      b.path = { sx: sx, sy: sy, vx: (hx - sx) / T, vy: -dy / T - 0.5 * GRAVITY * T, t: -0.35, T: T, hoop: hoop };
    }
    start();
  }

  // ---- watching for a lead change ----
  // "Leader" = the side with more ▲ marks in the head-to-head bars. Ties don't count.
  var h2h = document.getElementById("h2h"), lastLeader = null;

  function leaders() {
    var l = 0, r = 0;
    document.querySelectorAll("#h2h .brow").forEach(function (row) {
      var vs = row.querySelectorAll(".v");        // first = left value, last = right value
      if (vs.length < 2) return;
      if (vs[0].classList.contains("lead")) l++;
      if (vs[vs.length - 1].classList.contains("lead")) r++;
    });
    return { l: l, r: r };
  }

  function checkLeader() {
    var s = leaders();
    var now = s.l > s.r ? "left" : s.r > s.l ? "right" : null;
    if (now && lastLeader && now !== lastLeader) shoot(now);
    if (now) lastLeader = now;                    // remember the last real leader, so a tie or a
  }                                               // missing playoff row doesn't cause a false alarm

  if (h2h && window.MutationObserver) {
    // childList only: the number count-up edits text deeper down and must not trigger this
    new MutationObserver(checkLeader).observe(h2h, { childList: true });
    checkLeader();                                // record the starting leader (no shot on first load)
  }

  // ---- interaction ----

  // Click or tap anywhere: a ball pops up from the pointer.
  document.addEventListener("pointerdown", function (e) {
    if (e.button > 0) return;
    if (e.target.closest && e.target.closest("select, a, input, textarea, #ball-toggle")) return;
    spawn(e.clientX, e.clientY, (Math.random() - 0.5) * 520, -(350 + Math.random() * 550), 15 + Math.random() * 9);
  });

  // Change a player or season: three balls drop from the top of that side's panel.
  // Capture phase, so this runs before app.js redraws the panel and detaches the <select>.
  document.addEventListener("change", function (e) {
    var t = e.target;
    if (!t.matches || !t.matches("select")) return;
    var box = t.closest(".side");
    var rc = box ? box.getBoundingClientRect() : { left: W * 0.3, width: W * 0.4, top: 0 };
    function drop(i) {
      setTimeout(function () {
        spawn(rc.left + rc.width * (0.25 + 0.25 * i), Math.max(-20, rc.top),
              (Math.random() - 0.5) * 160, 0, 20 + Math.random() * 8);
      }, i * 110);
    }
    for (var i = 0; i < 3; i++) drop(i);
  }, true);

  // ---- on/off toggle (remembered between visits) ----
  var btn = document.createElement("button");
  btn.id = "ball-toggle";
  btn.type = "button";
  btn.textContent = "\uD83C\uDFC0";
  btn.title = "Bouncing basketballs: on/off";
  btn.setAttribute("aria-label", "Toggle bouncing basketballs");
  btn.style.cssText = "position:fixed;right:14px;bottom:14px;z-index:41;width:42px;height:42px;padding:0;" +
    "border-radius:50%;border:1px solid var(--line,#2a2f3d);background:var(--panel,#171a23);" +
    "font-size:20px;line-height:1;cursor:pointer";
  function paint() {
    btn.style.opacity = on ? "1" : ".45";
    btn.setAttribute("aria-pressed", String(on));
  }
  btn.onclick = function () {
    on = !on;
    try { localStorage.setItem("balls", on ? "on" : "off"); } catch (e) {}
    if (on) spawn(W - 35, H - 80, -250, -700, 18); else { balls = []; bits = []; hoop = null; }
    paint();
  };
  paint();
  document.body.appendChild(btn);
})();
