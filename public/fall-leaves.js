// Seasonal fall leaves. Plain JS, no dependencies, independent of the React app.
// To turn off: set FALL_LEAVES_ENABLED to false, or delete the fall-leaves.js <script> tag in index.html.
// Leaves anchor to elements marked data-leaves="logo" | "sponsored-box"; those attributes do nothing on their own.
(function () {
  'use strict';

  var FALL_LEAVES_ENABLED = true;
  if (!FALL_LEAVES_ENABLED) return;

  var NS = 'http://www.w3.org/2000/svg';
  var GRAVITY = 150;
  var DRAG = 1.9;
  // Classic fall colors: yellow, orange, red, brown.
  var PALETTE = ['#f4c430', '#e9a21b', '#ef7d1a', '#d9561b', '#c8312a', '#a8221d', '#8b5a2b', '#a0662f'];
  // Classic maple leaf in a -11..11 box, tip up, stem down. Right-half outline, mirrored for the left.
  var MAPLE_HALF = [
    [1.5, -7.3], [3.1, -8.4], [2.6, -4.8], [1.9, -2.5],
    [4.5, -4.1], [5.3, -6.3], [6.1, -4.7], [8.9, -6.7], [7.7, -3.4], [9.0, -2.5], [6.5, -0.4], [4.4, 0.9],
    [8.4, 2.1], [9.4, 3.4], [6.9, 3.9], [7.4, 5.6], [4.4, 4.9], [1.1, 6.4], [0.6, 6.6],
  ];
  var MAPLE = {
    w: 9.4,
    d: 'M0,-10.5 ' + MAPLE_HALF.map(function (p) { return 'L' + p[0] + ',' + p[1]; }).join(' ') + ' ' +
      MAPLE_HALF.slice().reverse().map(function (p) { return 'L' + -p[0] + ',' + p[1]; }).join(' ') + ' Z',
    vein: 'M0.3,10.8 Q0.1,8 0,5.6 L0,-8.6 M0,5.6 L7.8,-5.8 M0,5.6 L-7.8,-5.8 M0,5.6 L8.2,2.9 M0,5.6 L-8.2,2.9',
  };

  var reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  var smallMQ = window.matchMedia('(max-width: 600px)');
  var motionOK = !reduceMQ.matches;
  var wasSmall = smallMQ.matches;

  function rand(a, b) { return a + Math.random() * (b - a); }
  function randInt(a, b) { return Math.floor(rand(a, b + 1)); }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function clampV(v) { return Math.max(-900, Math.min(900, v)); }
  function shade(hex, f) {
    var out = '#';
    for (var i = 1; i < 7; i += 2) out += Math.round(parseInt(hex.slice(i, i + 2), 16) * f).toString(16).padStart(2, '0');
    return out;
  }

  var style = document.createElement('style');
  style.textContent = '.nhs-leaves,.nhs-leaves *{pointer-events:none!important}@media print{.nhs-leaves{display:none!important}}';
  document.head.appendChild(style);

  function makeLayer(css) {
    var d = document.createElement('div');
    d.className = 'nhs-leaves';
    d.setAttribute('aria-hidden', 'true');
    d.style.cssText = css;
    return d;
  }
  // Resting header leaves live inside the sticky header itself so they move with it exactly (mobile browser
  // toolbars and overscroll can otherwise shift the header out from under a separate overlay).
  // Box leaves live in document coordinates so they scroll natively with the box (and slide under the header).
  // Airborne leaves live in viewport coordinates above everything.
  var fixedLayer = makeLayer('position:fixed;inset:0;overflow:hidden;z-index:60;');
  var docLayer = makeLayer('position:absolute;left:0;top:0;width:0;height:0;z-index:40;');
  var headerLayer = makeLayer('position:absolute;left:0;top:0;width:0;height:0;z-index:1;');
  document.body.appendChild(docLayer);
  document.body.appendChild(fixedLayer);

  var leaves = new Set();
  var logoEl = null, barEl = null, headerEl = null, boxEl = null;
  var raf = 0, lastT = 0, fallTimer = 0;
  var mx = 0, my = 0, mvx = 0, mvy = 0, lastMove = 0;

  function makeLeaf(size) {
    var shape = MAPLE, color = pick(PALETTE), dark = shade(color, 0.62);
    var el = document.createElementNS(NS, 'svg');
    el.setAttribute('viewBox', '-11 -11 22 22');
    el.setAttribute('width', size.toFixed(1));
    el.setAttribute('height', size.toFixed(1));
    el.style.cssText = 'position:absolute;left:0;top:0;overflow:visible;transform-origin:50% 50%;';
    el.innerHTML =
      '<path d="' + shape.d + '" fill="' + color + '" stroke="' + dark + '" stroke-width="0.6" stroke-linejoin="round"/>' +
      '<path d="' + shape.vein + '" fill="none" stroke="' + dark + '" stroke-width="0.7" stroke-linecap="round" stroke-linejoin="round" opacity="0.55"/>';
    var l = {
      el: el, s: size, w: shape.w, x: 0, y: 0, a: 0, sx: 1, vx: 0, vy: 0,
      av: 0, avBase: rand(-28, 28), spin: 0, flip: 0, flipRate: 0, baseFlip: rand(1.1, 2.4),
      sway: rand(160, 300), omega: rand(1.5, 2.5), phase: rand(0, 6.283), time: 0,
      mode: 'rest', surface: null, ax: 0, fx: 0, lift: 0,
      restA: 90, restSx: 0.6, settle: 1, fromA: 90, fromSx: 0.6,
      falling: false, canLand: true, opacity: 1, fading: false, launchY: 0, cool: 0,
    };
    leaves.add(l);
    return l;
  }

  function removeLeaf(l) {
    l.el.remove();
    leaves.delete(l);
  }

  function clearSurface(surface) {
    Array.from(leaves).forEach(function (l) {
      if (l.mode === 'rest' && l.surface === surface) removeLeaf(l);
    });
  }

  function restPose(l) {
    l.restA = (Math.random() < 0.5 ? 90 : -90) + rand(-30, 30);
    l.restSx = rand(0.72, 0.95) * (Math.random() < 0.5 ? -1 : 1);
    l.a = l.restA;
    l.sx = l.restSx;
    l.settle = 1;
  }

  // Half the on-screen height of a leaf lying in its rest pose, so its underside touches the edge.
  function restExtent(l) {
    var r = l.restA * Math.PI / 180;
    return (10 * Math.abs(Math.cos(r)) + l.w * Math.abs(l.restSx) * Math.abs(Math.sin(r))) * l.s / 22;
  }

  function apply(l) {
    var h = l.s / 2;
    l.el.style.transform = 'translate(' + (l.x - h).toFixed(1) + 'px,' + (l.y - h).toFixed(1) + 'px) rotate(' +
      l.a.toFixed(1) + 'deg) scale(' + l.sx.toFixed(3) + ',1)';
  }

  function placeResting(l, r) {
    if (l.surface === 'header') {
      if (!r.bar || !r.logo || !r.hdr) return;
      l.x = Math.min(Math.max(r.logo.right + l.ax, r.bar.left + 8), r.bar.right - 8) - r.hdr.left;
      l.y = r.bar.bottom - r.hdr.top - restExtent(l) + 0.8 - l.lift;
    } else if (l.surface === 'box') {
      if (!r.box) return;
      l.x = r.box.left + window.scrollX + l.fx * r.box.width;
      l.y = r.box.top + window.scrollY - restExtent(l) + 0.8 - l.lift;
    }
    apply(l);
  }

  function rects() {
    return {
      bar: barEl && barEl.getBoundingClientRect(),
      logo: logoEl && logoEl.getBoundingClientRect(),
      hdr: headerEl && headerEl.getBoundingClientRect(),
      box: boxEl && boxEl.getBoundingClientRect(),
    };
  }

  function layout() {
    var r = rects();
    leaves.forEach(function (l) {
      if (l.mode === 'rest') placeResting(l, r);
    });
  }

  function buildHeader() {
    clearSurface('header');
    if (!logoEl || !barEl) return;
    var bar = barEl.getBoundingClientRect(), logo = logoEl.getBoundingClientRect();
    var small = smallMQ.matches;
    var start = logo.right + (small ? 4 : 10);
    var limit = bar.right - 12;
    Array.prototype.forEach.call(barEl.children, function (c) {
      if (c === logoEl) return;
      var r = c.getBoundingClientRect();
      if (r.width && r.left > logo.right) limit = Math.min(limit, r.left - 14);
    });
    // A tight, overlapping pile: leaves spaced closer than their width, raised toward the middle.
    var span = Math.max(40, Math.min(small ? 80 : 150, limit - start));
    var n = small ? 5 : randInt(8, 10);
    for (var i = 0; i < n; i++) {
      var t = (i + 0.5) / n;
      var l = makeLeaf(small ? rand(16, 22) : rand(20, 28));
      l.surface = 'header';
      l.ax = start + span * t + rand(-8, 8) - logo.right;
      l.lift = (1 - Math.abs(2 * t - 1)) * rand(0, small ? 5 : 8);
      restPose(l);
      headerLayer.appendChild(l.el);
    }
    layout();
  }

  function buildBox() {
    clearSurface('box');
    if (!boxEl) return;
    var n = smallMQ.matches ? randInt(5, 6) : randInt(8, 10);
    // Two overlapping piles along the top edge, one larger on the left.
    var piles = [{ c: rand(0.16, 0.28), w: 0.26 }, { c: rand(0.68, 0.82), w: 0.2 }];
    for (var i = 0; i < n; i++) {
      var p = Math.random() < 0.6 ? piles[0] : piles[1];
      var off = (Math.random() - 0.5) * p.w;
      var l = makeLeaf(rand(22, 30));
      l.surface = 'box';
      l.fx = Math.min(0.97, Math.max(0.03, p.c + off));
      l.lift = (1 - Math.abs(off) / (p.w / 2)) * rand(0, 9);
      restPose(l);
      docLayer.appendChild(l.el);
    }
    layout();
  }

  var ro = new ResizeObserver(layout);
  ro.observe(document.body);

  function refreshAnchors() {
    var logo = document.querySelector('[data-leaves="logo"]');
    if (logo !== logoEl) {
      if (logoEl) { ro.unobserve(logoEl); ro.unobserve(barEl); }
      logoEl = logo;
      barEl = logo ? logo.parentElement : null;
      headerEl = logo ? logo.closest('header') : null;
      if (logoEl) { ro.observe(logoEl); ro.observe(barEl); }
      if (headerEl && headerLayer.parentNode !== headerEl) headerEl.appendChild(headerLayer);
      buildHeader();
    }
    var box = document.querySelector('[data-leaves="sponsored-box"]');
    if (box !== boxEl) {
      if (boxEl) ro.unobserve(boxEl);
      boxEl = box;
      if (boxEl) ro.observe(boxEl);
      buildBox();
    }
  }

  function wake() {
    if (!raf && motionOK && !document.hidden) raf = requestAnimationFrame(frame);
  }

  function launch(l, x, y) {
    if (l.el.parentNode !== fixedLayer) fixedLayer.appendChild(l.el);
    l.mode = 'fly';
    l.x = x; l.y = y; l.launchY = y;
    l.vx = 0; l.vy = 0; l.time = 0;
    l.spin = l.a;
    l.flip = Math.acos(Math.max(-1, Math.min(1, l.sx)));
    l.opacity = 1; l.fading = false; l.settle = 1;
    l.canLand = !l.falling;
    l.el.style.willChange = 'transform, opacity';
  }

  function land(l, surface, r) {
    l.mode = 'rest';
    l.surface = surface;
    l.lift = 0;
    l.vx = 0; l.vy = 0;
    l.fading = false; l.opacity = 1;
    l.el.style.opacity = '';
    l.el.style.willChange = '';
    var base = ((l.a % 360) + 360) % 360;
    var target = Math.abs(base - 90) <= Math.abs(base - 270) ? 90 : 270;
    l.fromA = l.a;
    l.restA = l.a + (target - base) + rand(-30, 30);
    l.fromSx = l.sx;
    l.restSx = (l.sx < 0 ? -1 : 1) * rand(0.72, 0.95);
    l.settle = 0;
    if (surface === 'header') {
      l.ax = l.x - r.logo.right;
      headerLayer.appendChild(l.el);
    } else {
      l.fx = Math.min(0.97, Math.max(0.03, (l.x - r.box.left) / r.box.width));
      docLayer.appendChild(l.el);
    }
    placeResting(l, r);
  }

  function fly(l, dt, vw, vh, r) {
    l.time += dt;
    l.vx += (l.sway * Math.sin(l.time * l.omega + l.phase) - DRAG * l.vx) * dt;
    l.vy += (GRAVITY - DRAG * l.vy) * dt;
    var py = l.y;
    l.x += l.vx * dt;
    l.y += l.vy * dt;
    l.av = l.avBase + (l.av - l.avBase) * Math.exp(-1.6 * dt);
    l.spin += l.av * dt;
    l.a = l.spin + 22 * Math.sin(l.time * l.omega + l.phase + 1.2);
    l.flipRate = l.baseFlip + (l.flipRate - l.baseFlip) * Math.exp(-1.2 * dt);
    l.flip += l.flipRate * dt;
    var c = Math.cos(l.flip);
    l.sx = Math.abs(c) < 0.18 ? (c < 0 ? -0.18 : 0.18) : c;

    if (l.canLand && l.vy > 0) {
      var bar = r.bar, box = r.box;
      if (bar && r.logo && r.hdr) {
        var hl = bar.bottom - l.s * 0.18;
        if (py < hl && l.y >= hl && l.x > bar.left + 8 && l.x < bar.right - 8) return land(l, 'header', r);
      }
      if (box && box.top > (bar ? bar.bottom : 0)) {
        var bl = box.top - l.s * 0.18;
        if (py < bl && l.y >= bl && l.x > box.left + 6 && l.x < box.right - 6) return land(l, 'box', r);
      }
    }

    // Falling leaves are gone within ~9s so only one is ever on screen with a 10s drop interval.
    if (!l.fading && (l.falling ? (l.y > vh * 0.7 || l.time > 7.5) : (l.y - l.launchY > 260 || l.time > 10))) l.fading = true;
    if (l.fading) l.opacity -= dt / 1.4;
    if (l.opacity <= 0 || l.y > vh + 60 || l.x < -60 || l.x > vw + 60) return removeLeaf(l);
    l.el.style.opacity = l.opacity.toFixed(2);
    apply(l);
  }

  function frame(t) {
    raf = 0;
    var dt = lastT ? Math.min((t - lastT) / 1000, 0.05) : 1 / 60;
    lastT = t;
    var vw = window.innerWidth, vh = window.innerHeight, r = rects(), busy = false;
    leaves.forEach(function (l) {
      if (l.mode === 'fly') {
        busy = true;
        fly(l, dt, vw, vh, r);
      } else if (l.settle < 1) {
        busy = true;
        l.settle = Math.min(1, l.settle + dt / 0.3);
        var e = 1 - Math.pow(1 - l.settle, 3);
        l.a = l.fromA + (l.restA - l.fromA) * e;
        l.sx = l.fromSx + (l.restSx - l.fromSx) * e;
        apply(l);
      }
    });
    if (busy) raf = requestAnimationFrame(frame);
    else lastT = 0;
  }

  function gust() {
    var speed = Math.hypot(mvx, mvy);
    if (speed < 40) return;
    var now = performance.now(), ox = window.scrollX, oy = window.scrollY, hdr = null, moved = false;
    leaves.forEach(function (l) {
      if (l.cool > now) return;
      var parent = l.el.parentNode, lx = l.x, ly = l.y;
      if (parent === docLayer) {
        lx -= ox; ly -= oy;
      } else if (parent === headerLayer) {
        hdr = hdr || headerEl.getBoundingClientRect();
        lx += hdr.left; ly += hdr.top;
      }
      var dx = lx - mx, dy = ly - my, d = Math.hypot(dx, dy), reach = 24 + l.s;
      if (d > reach) return;
      var str = Math.min(speed, 1400) * (0.35 + 0.65 * (1 - d / reach));
      var nx = d > 0.5 ? dx / d : mvx / speed, ny = d > 0.5 ? dy / d : mvy / speed;
      if (l.mode === 'rest') launch(l, lx, ly);
      l.vx = clampV(l.vx + (mvx / speed) * str * 0.5 + nx * str * 0.12);
      l.vy = clampV(l.vy + (mvy / speed) * str * 0.3 + ny * str * 0.08 - (50 + str * 0.22));
      l.av += (Math.random() - 0.5) * str * 1.4;
      l.flipRate = l.baseFlip + 3 + str / 140;
      l.cool = now + 110;
      moved = true;
    });
    if (moved) wake();
  }

  function dropOne() {
    if (!motionOK || document.hidden || smallMQ.matches) return;
    var vw = window.innerWidth;
    var l = makeLeaf(rand(24, 34));
    l.falling = true;
    l.spin = rand(0, 360);
    l.a = l.spin;
    l.sx = 1;
    launch(l, vw - rand(30, Math.min(240, vw * 0.22)), -16);
    l.vx = rand(-18, 4);
    l.vy = rand(30, 55);
    l.flip = rand(0, 6.283);
    l.flipRate = l.baseFlip;
    apply(l);
    wake();
  }

  function scheduleFall() {
    clearTimeout(fallTimer);
    if (!motionOK || document.hidden) return;
    fallTimer = setTimeout(function () {
      dropOne();
      scheduleFall();
    }, 10000);
  }

  window.addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse') return;
    var dt = (e.timeStamp - lastMove) / 1000;
    if (lastMove && dt <= 0) return;
    if (lastMove && dt < 0.12) {
      mvx = mvx * 0.35 + ((e.clientX - mx) / dt) * 0.65;
      mvy = mvy * 0.35 + ((e.clientY - my) / dt) * 0.65;
    } else {
      mvx = 0;
      mvy = 0;
    }
    mx = e.clientX;
    my = e.clientY;
    lastMove = e.timeStamp;
    if (motionOK && !document.hidden) gust();
  }, { passive: true });

  window.addEventListener('resize', function () {
    if (smallMQ.matches !== wasSmall) {
      wasSmall = smallMQ.matches;
      buildHeader();
      buildBox();
    } else {
      layout();
    }
  }, { passive: true });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      cancelAnimationFrame(raf);
      raf = 0;
      lastT = 0;
      clearTimeout(fallTimer);
    } else {
      scheduleFall();
      wake();
    }
  });

  reduceMQ.addEventListener('change', function () {
    motionOK = !reduceMQ.matches;
    if (motionOK) {
      scheduleFall();
      return;
    }
    cancelAnimationFrame(raf);
    raf = 0;
    lastT = 0;
    clearTimeout(fallTimer);
    Array.from(leaves).forEach(function (l) {
      if (l.mode === 'fly') removeLeaf(l);
      else if (l.settle < 1) { l.settle = 1; l.a = l.restA; l.sx = l.restSx; }
    });
    layout();
  });

  // The app swaps pages by re-rendering, so watch for anchors appearing and disappearing.
  new MutationObserver(refreshAnchors).observe(document.getElementById('root') || document.body, { childList: true, subtree: true });
  refreshAnchors();
  scheduleFall();
})();
