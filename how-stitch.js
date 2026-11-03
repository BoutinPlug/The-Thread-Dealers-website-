/* The Stitch: the needle sews a thread through the four steps, ties a knot, then loops. */
(function () {
  'use strict';
  var root = document.getElementById('stitch');
  if (!root) return;
  var NS = 'http://www.w3.org/2000/svg';
  var guide = document.getElementById('stGuide'), thread = document.getElementById('stThread');
  var needle = document.getElementById('stNeedle'), knot = document.getElementById('stKnot');
  var stopsG = document.getElementById('stStops');

  // Four stops down the panel; the thread loops once between steps 2 and 3, like the homepage title
  var steps = [
    { x: 92, y: 92, label: 'Purpose', side: 1 },
    { x: 318, y: 200, label: 'Garment', side: -1 },
    { x: 104, y: 330, label: 'Approve', side: 1 },
    { x: 300, y: 452, label: 'Delivered', side: -1 }
  ];
  var segs = [
    'M-30 30 C10 40 40 90 92 92',
    'C160 94 230 120 318 200',
    'C360 240 330 290 290 270 C250 250 280 210 310 230 C330 250 200 330 104 330',
    'C40 330 60 420 140 440 C200 455 250 452 300 452'
  ];
  var d = segs.join(' ');
  guide.setAttribute('d', d);
  thread.setAttribute('d', d);

  // Path length at each stop, measured from cumulative sub-paths
  var probe = document.createElementNS(NS, 'path'), acc = '', at = [];
  guide.parentNode.appendChild(probe);
  segs.forEach(function (s) { acc += ' ' + s; probe.setAttribute('d', acc); at.push(probe.getTotalLength()); });
  probe.remove();
  var total = at[at.length - 1];
  thread.style.strokeDasharray = total;
  thread.style.strokeDashoffset = total;

  var stopEls = steps.map(function (s, i) {
    var g = document.createElementNS(NS, 'g');
    g.setAttribute('class', 'st-stop');
    var w = s.label.length * 10.5 + 28, tx = s.side > 0 ? 34 : -34 - w;
    g.innerHTML =
      '<g transform="translate(' + s.x + ' ' + s.y + ')"><g class="pop"><circle class="dot" r="24"/><text class="num">' + (i + 1) + '</text></g></g>' +
      '<g class="tag"><rect x="' + (s.x + tx) + '" y="' + (s.y - 15) + '" width="' + w + '" height="30" rx="3"/>' +
      '<text x="' + (s.x + tx + 14) + '" y="' + s.y + '">' + s.label + '</text></g>';
    stopsG.appendChild(g);
    return g;
  });

  // Needle heading comes from a short chord around the point and eases toward it, so curves turn smoothly
  var heading = null;
  function place(len) {
    var p = guide.getPointAtLength(len),
        a0 = guide.getPointAtLength(Math.max(len - 6, 0)), a1 = guide.getPointAtLength(Math.min(len + 6, total));
    var a = Math.atan2(a1.y - a0.y, a1.x - a0.x) * 180 / Math.PI;
    if (heading === null || Math.abs(len) < 0.5) heading = a;
    else heading += ((a - heading + 540) % 360 - 180) * 0.35;
    needle.setAttribute('transform', 'translate(' + p.x.toFixed(2) + ' ' + p.y.toFixed(2) + ') rotate(' + heading.toFixed(2) + ')');
    thread.style.strokeDashoffset = total - len;
    stopEls.forEach(function (el, i) { el.classList.toggle('on', len >= at[i] - 2); });
  }

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    place(total); knot.classList.add('on'); return;
  }

  // Each stretch takes time in proportion to its length, so the needle keeps one steady pace; the loop
  // between 2 and 3 runs a touch slower. A soft sine ease settles the needle into each step.
  var SPEED = 0.36, LOOP = 0.75, PAUSE = 200, HOLD = 3000, FADE = 600, MIN = 480;
  var legs = at.map(function (end, i) { return Math.max(MIN, (end - (i ? at[i - 1] : 0)) / (SPEED * (i === 2 ? LOOP : 1))); });
  var starts = [], acc = 0;
  legs.forEach(function (ms) { starts.push(acc); acc += ms + PAUSE; });
  var sewEnd = acc, cycle = sewEnd + HOLD + FADE;
  function ease(t) { return -(Math.cos(Math.PI * t) - 1) / 2; }
  var elapsed = 0, last = null, visible = true, raf;
  function frame(now) {
    if (last !== null) elapsed += Math.min(now - last, 50);
    last = now;
    var t = elapsed % cycle, len = total;
    if (t < sewEnd) {
      for (var i = legs.length - 1; i > 0 && t < starts[i]; i--);
      var from = i ? at[i - 1] : 0, k = Math.min((t - starts[i]) / legs[i], 1);
      len = from + (at[i] - from) * ease(k);
    }
    knot.classList.toggle('on', t >= sewEnd);
    root.classList.toggle('fade', t >= cycle - FADE);
    place(len);
    if (visible) raf = requestAnimationFrame(frame);
  }
  new IntersectionObserver(function (e) {
    visible = e[0].isIntersecting;
    cancelAnimationFrame(raf);
    last = null;
    if (visible) raf = requestAnimationFrame(frame);
  }).observe(root);
})();
