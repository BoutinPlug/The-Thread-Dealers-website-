/* Collection browsing, recommendations and accessible sketch detail. */
(function () {
  'use strict';
  const collections = [
  {
    "slug": "hoodies-track-pants",
    "idx": "01",
    "name": "Hoodies &amp;<br>Track Pants",
    "plain": "Hoodies &amp; Track Pants",
    "lead": "Heavyweight hoodies and matching track pants from one proven factory program. The set people actually reach for.",
    "b": [
      "Two hoodie weights to choose from",
      "Heavyweight track pants on the same program",
      "Fit built from a proven size reference"
    ],
    "img": [
      "hoodie",
      "pants"
    ],
    "kind": "hd"
  },
  {
    "slug": "premium-tees",
    "idx": "02",
    "name": "Premium<br>Tees",
    "plain": "Premium Tees",
    "lead": "Tested tees in two cotton weights with separate size charts. We match the fabric to the job, so you skip the guesswork.",
    "b": [
      "260 GSM and 280 GSM cotton",
      "Relaxed and oversized fits with separate size charts",
      "Fabric matched to how it will be worn"
    ],
    "img": [
      "tee"
    ],
    "kind": "te"
  },
  {
    "slug": "performance-jerseys",
    "idx": "03",
    "name": "Performance<br>&amp; Jerseys",
    "plain": "Performance &amp; Jerseys",
    "lead": "Performance shirts and jerseys that have been tested and approved. Keep it simple or go fully custom.",
    "b": [
      "Tested performance shirts and jerseys",
      "Simple custom or fully custom kits",
      "Polos on the same fabric program"
    ],
    "img": [
      "jersey"
    ],
    "kind": "je"
  },
  {
    "slug": "custom-hats",
    "idx": "04",
    "name": "Custom<br>Hats",
    "plain": "Custom Hats",
    "lead": "Proven custom headwear that finishes an apparel order and keeps your logo in sight.",
    "b": [
      "Proven custom headwear",
      "Pairs with any apparel order",
      "Logo method and placement handled for you"
    ],
    "img": [
      "cap"
    ],
    "kind": "cp"
  }
];
  const captions = ['The everyday uniform', '260 GSM / 280 GSM', 'Built for the team', 'Finish the kit'];
  const $ = id => document.getElementById(id);
  const root = document.documentElement;
  root.dataset.show = 'combo';
  root.dataset.bg = 'stone';
  const indexButtons = Array.from(document.querySelectorAll('[data-collection]'));
  const tags = Array.from(document.querySelectorAll('.tag-btn'));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const rail = document.querySelector('.collection-rail');
  if (rail && !reduced.matches && 'IntersectionObserver' in window && !location.hash) {
    const railTrack = rail.querySelector('.tags');
    const railItems = Array.from(railTrack.children);
    const edge = Math.min(innerWidth, railTrack.getBoundingClientRect().right);
    railItems.forEach(item => item.style.setProperty('--rail-distance', Math.max(80, edge - item.getBoundingClientRect().left + 25) + 'px'));
    rail.classList.add('rail-armed');
    let railInView = false, hasScrolled = false, railFrame = 0;
    const initialScroll = scrollY;
    function startHangers() {
      railFrame = 0;
      if (!hasScrolled || (!railInView && !rail.classList.contains('rail-visible'))) return;
      const top = rail.getBoundingClientRect().top;
      const progress = Math.min(1, Math.max(0, (innerHeight * .95 - top) / (innerHeight * .63)));
      if (progress <= 0) return;
      rail.classList.add('rail-visible');
      railItems.forEach((item, index) => {
        const local = Math.min(1, Math.max(0, (progress - index * .12) / .64));
        const eased = local * local * (3 - 2 * local);
        const distance = parseFloat(item.style.getPropertyValue('--rail-distance')) || 0;
        const swing = local > .72 ? Math.sin((local - .72) * Math.PI * 5) * (1 - local) * 18 : 0;
        item.style.opacity = '1';
        item.style.transform = 'translate3d(' + ((1 - eased) * distance) + 'px,0,0) rotate(' + swing + 'deg)';
      });
      if (progress >= 1) {
        railItems.forEach(item => { item.style.transform = ''; item.style.opacity = ''; });
        railObserver.disconnect();
        window.removeEventListener('scroll', onRailScroll);
      }
    }
    function onRailScroll() {
      if (Math.abs(scrollY - initialScroll) > 8) hasScrolled = true;
      if (!railFrame) railFrame = requestAnimationFrame(startHangers);
    }
    const railObserver = new IntersectionObserver(entries => {
      railInView = entries[0].isIntersecting;
      if (!railFrame) railFrame = requestAnimationFrame(startHangers);
    }, {threshold:0, rootMargin:'0px 0px -5% 0px'});
    railObserver.observe(rail);
    window.addEventListener('scroll', onRailScroll, {passive:true});
    rail.addEventListener('focusin', () => { hasScrolled = true; railInView = true; rail.classList.add('rail-visible'); railItems.forEach(item => { item.style.transform = ''; item.style.opacity = ''; }); railObserver.disconnect(); window.removeEventListener('scroll', onRailScroll); }, {once:true});
  }
  let current = 0, copyTimer;
  function scrollToCollection() {
    const section = document.querySelector('.collection-browser');
    const top = section.getBoundingClientRect().top + window.scrollY - $('top-bar').offsetHeight;
    window.scrollTo({top, behavior: reduced.matches ? 'auto' : 'smooth'});
  }
  function artwork(data) {
    return data.img.map(key => '<img src="' + window.__IMG[key] + '" alt="' + window.TDMockupAlt[key] + '" width="1280" height="1280" decoding="async">').join('');
  }
  function show(index, options = {}) {
    current = (index + collections.length) % collections.length;
    const data = collections[current];
    tags.forEach((button, i) => button.setAttribute('aria-pressed', String(i === current)));
    indexButtons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === current)));
    $('selArt').className = 'card-art art-img art-' + data.kind;
    $('selArt').innerHTML = artwork(data);
    $('selIdx').textContent = data.idx;
    // The number on the circle stamps in again for each collection once it has first been seen
    const num = $('selNum');
    if (num) {
      num.textContent = data.idx;
      if (num.classList.contains('stamped')) { num.classList.remove('stamped'); void num.offsetWidth; num.classList.add('stamped'); }
    }
    $('selName').innerHTML = data.name;
    $('selLead').textContent = data.lead;
    if ($('selLeadOut')) $('selLeadOut').textContent = data.lead;
    $('selList').replaceChildren(...data.b.map(text => {
      const li = document.createElement('li'); li.textContent = text; return li;
    }));
    $('selGo').href = data.slug + '.html';
    $('sketchCaption').textContent = data.idx + ' / ' + captions[current];
    $('selectionPosition').textContent = data.idx + ' / 04';
    $('sxRow1').textContent = (data.plain.replace(/&amp;/g, '&') + ' · ').repeat(4);
    $('sxRow2').textContent = (data.plain.replace(/&amp;/g, '&') + ' · ').repeat(4);
    $('sel').classList.remove('sel-switch');
    void $('sel').offsetWidth;
    $('sel').classList.add('sel-switch');
    if ($('sel').dataset.seen) swingTag();
    if (options.push && location.hash !== '#' + data.slug) {
      history.pushState(null, '', '#' + data.slug);
    }
    if (options.announce) $('collectionStatus').textContent = data.plain.replace(/&amp;/g, '&') + ', collection ' + (current + 1) + ' of 4.';
    if (options.scroll) scrollToCollection();
    rackTo(current);
  }
  // Swipeable stage: drag the circle sideways to change collection; dots track the position
  const dots = $('stDots') ? Array.from($('stDots').children) : [];
  function rackTo(index) { dots.forEach((dot, i) => dot.classList.toggle('on', i === index)); }
  const stage = document.querySelector('.sel-stage');
  if (stage) {
    let x0 = null, dx = 0;
    const art = () => $('selArt');
    stage.addEventListener('pointerdown', event => { x0 = event.clientX; dx = 0; stage.classList.add('dragging'); stage.setPointerCapture(event.pointerId); });
    stage.addEventListener('pointermove', event => {
      if (x0 === null) return;
      dx = event.clientX - x0;
      art().style.transform = 'translateX(' + dx * .6 + 'px) rotate(' + dx * .03 + 'deg)';
      art().style.opacity = String(1 - Math.min(Math.abs(dx) / 400, .5));
    });
    const end = () => {
      if (x0 === null) return;
      x0 = null; stage.classList.remove('dragging');
      art().style.transform = ''; art().style.opacity = '';
      if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1), {push:true, announce:true});
    };
    stage.addEventListener('pointerup', end);
    stage.addEventListener('pointercancel', end);
  }
  // Arrows, drag and trackpad all slide the garment the same way
  function slide(dir) {
    show(current + dir, {push:true, announce:true});
    const a = $('selArt');
    if (reduced.matches || !a.animate) return;
    a.animate([{transform:'translateX(' + dir * 90 + 'px) rotate(' + dir * 6 + 'deg)', opacity:0}, {transform:'none', opacity:1}], {duration:450, easing:'cubic-bezier(.2,.8,.3,1)'});
  }
  $('stPrev')?.addEventListener('click', () => slide(-1));
  $('stNext')?.addEventListener('click', () => slide(1));
  if (stage) {
    let wheelAcc = 0, wheelLock = false;
    stage.addEventListener('wheel', event => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      event.preventDefault();
      if (wheelLock) return;
      wheelAcc += event.deltaX;
      if (Math.abs(wheelAcc) > 60) {
        slide(wheelAcc > 0 ? 1 : -1);
        wheelAcc = 0; wheelLock = true;
        setTimeout(() => { wheelLock = false; }, 650);
      }
    }, {passive:false});
  }
  // Thread from the stage into the tag's eyelet, redrawn whenever the layout moves
  const grid = document.querySelector('.sel-grid'), string = document.querySelector('.sx-string');
  function drawString() {
    if (!grid || !string) return;
    const g = grid.getBoundingClientRect(), st = stage.getBoundingClientRect(), hole = document.querySelector('.sx-hole').getBoundingClientRect();
    if (!hole.width || st.right > hole.left) { string.style.display = 'none'; return; }
    string.style.display = '';
    string.setAttribute('viewBox', '0 0 ' + g.width + ' ' + g.height);
    const x1 = st.right - st.width * .08 - g.left, y1 = st.top + st.height * .38 - g.top;
    const x2 = hole.left + hole.width / 2 - g.left, y2 = hole.top + hole.height / 2 - g.top;
    const mx = (x1 + x2) / 2;
    string.querySelector('path').setAttribute('d', 'M' + x1 + ' ' + y1 + ' C' + mx + ' ' + (y1 - 60) + ' ' + mx + ' ' + (y2 + 70) + ' ' + x2 + ' ' + y2);
  }
  addEventListener('resize', drawString);
  addEventListener('load', drawString);
  $('sel').addEventListener('animationend', drawString);
  setTimeout(drawString, 300);
  tags.forEach((button, index) => button.addEventListener('click', () => show(index, {push:true, scroll:true, announce:true})));
  // Hero rack cards open their collection in the showcase instead of leaving the page
  document.querySelectorAll('[data-pick]').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    show(Number(link.dataset.pick), {push:true, scroll:true, announce:true});
  }));
  indexButtons.forEach((button, index) => button.addEventListener('click', () => show(index, {push:true, scroll:true, announce:true})));
  document.querySelector('.index-buttons')?.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const index = event.key === 'Home' ? 0 : event.key === 'End' ? 3 : current + (event.key === 'ArrowRight' ? 1 : -1);
    show(index, {push:true, announce:true});
    indexButtons[current].focus({preventScroll:true});
  });
  $('selPrev').addEventListener('click', () => show(current - 1, {push:true, announce:true}));
  $('selNext').addEventListener('click', () => show(current + 1, {push:true, announce:true}));
  function readLocation() {
    const index = collections.findIndex(data => '#' + data.slug === location.hash);
    show(index < 0 ? 0 : index);
  }
  window.addEventListener('popstate', readLocation);
  window.addEventListener('hashchange', () => {
    if (collections.some(data => '#' + data.slug === location.hash)) readLocation();
  });
  readLocation();
  if (collections.some(data => '#' + data.slug === location.hash)) {
    window.addEventListener('load', scrollToCollection, {once:true});
  }
  const purposes = Array.from(document.querySelectorAll('.why'));
  purposes.forEach(button => button.addEventListener('click', () => {
    const active = button.getAttribute('aria-pressed') !== 'true';
    purposes.forEach(item => item.setAttribute('aria-pressed', String(item === button && active)));
    $('picks').hidden = !active;
    $('pickNote').hidden = !active;
    $('finderEmpty').hidden = active;
    if (!active) return;
    const keys = button.dataset.m.split(' ');
    Array.from($('picks').children).forEach(pick => {
      const order = keys.indexOf(pick.dataset.k);
      pick.hidden = order < 0;
      pick.style.order = order;
    });
    const label = document.createElement('b');
    label.textContent = 'A good start for ' + button.dataset.t.toLowerCase();
    $('pickNote').replaceChildren(label, document.createTextNode(button.dataset.n));
  }));
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add(entry.target.id === 'steps' ? 'play' : 'lit');
      observer.unobserve(entry.target);
    }), {threshold:.2});
    observer.observe($('promises'));
  } else { $('promises').classList.add('lit'); }
})();


/* Start dock: show after the hero, hide while the final Start a Project band is on screen.
   It waits until block 2 is left behind, so the bar never covers the scanner's details. */
(function () {
  'use strict';
  const dock = document.getElementById('startDock');
  const hero = document.querySelector('.col-hero');
  const scan = document.querySelector('.bp-scan');
  const band = document.querySelector('.cta-band');
  if (!dock || !hero) return;
  let pastHero = false, bandOn = false, raf = 0;
  const paint = () => {
    raf = 0;
    const gate = scan ? scan.getBoundingClientRect().bottom < innerHeight - 110 : pastHero;
    const on = gate && !bandOn;
    dock.classList.toggle('show', on);
    document.documentElement.classList.toggle('dock-on', on);
  };
  const ask = () => { if (!raf) raf = requestAnimationFrame(paint); };
  new IntersectionObserver(e => { pastHero = !e[0].isIntersecting; ask(); }).observe(hero);
  if (band) new IntersectionObserver(e => { bandOn = e[0].isIntersecting; ask(); }).observe(band);
  addEventListener('scroll', ask, {passive: true});
  addEventListener('resize', ask);
})();

/* FAQ: opening one question closes the others (fallback for browsers without details[name]) */
document.querySelectorAll('.faq').forEach((item, _, all) => item.addEventListener('toggle', () => {
  if (item.open) all.forEach(other => { if (other !== item) other.open = false; });
}));

/* Stage number: stamps in the first time it reaches the middle of the screen */
(function () {
  const num = document.getElementById('selNum');
  if (!num) return;
  document.documentElement.classList.add('num-armed');
  if (!('IntersectionObserver' in window)) { num.classList.add('stamped'); return; }
  const io = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    num.classList.add('stamped');
    io.disconnect();
  }), {rootMargin: '0px 0px -50% 0px'});
  io.observe(num);
})();

/* Ring dots: an orange dot centred on the letters' middle height in each gap between the trust words */
(function () {
  const text = document.querySelector('.opt-ring text');
  if (!text || !text.getNumberOfChars) return;
  function place() {
    const svg = text.ownerSVGElement, NS = 'http://www.w3.org/2000/svg';
    svg.querySelectorAll('.rd-dot').forEach(dot => dot.remove());
    // The ring is hidden below desktop width; there is nothing to measure until it shows
    if (!text.getNumberOfChars()) return;
    const chars = text.textContent;
    // Middle of the capitals (cap height is about 0.7em), measured outward from the ring's centre at (100, 100)
    const capMid = parseFloat(getComputedStyle(text).fontSize) * 0.35;
    for (let i = 0; i < chars.length; i++) {
      if (chars[i] !== '•') continue;
      const a = text.getStartPositionOfChar(i), b = text.getEndPositionOfChar(i);
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, d = Math.hypot(mx - 100, my - 100) || 1;
      const dot = document.createElementNS(NS, 'circle');
      dot.setAttribute('class', 'rd-dot');
      dot.setAttribute('r', '1.7');
      dot.setAttribute('cx', (mx + (mx - 100) / d * capMid).toFixed(2));
      dot.setAttribute('cy', (my + (my - 100) / d * capMid).toFixed(2));
      svg.appendChild(dot);
    }
  }
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(place);
  matchMedia('(min-width: 961px)').addEventListener('change', place);
})();

/* The hanging cards sit below the strip as a "Jump to a collection" selector */
(function () {
  const rack = document.querySelector('.hero-rack'), strip = document.querySelector('.cc-divider');
  if (!rack || !strip) return;
  const box = document.createElement('div');
  box.className = 'rack-after';
  box.innerHTML = '<div class="wrap"><p class="rack-label">Jump to a collection</p></div>';
  box.firstChild.appendChild(rack);
  strip.after(box);
})();

/* Block 2: the blueprint scanner */
(function () {
  const root = document.querySelector('.bp-scan');
  if (!root) return;
  const C = [
    {n: '01', t: 'Hoodies & Track Pants', img: 'img/core-hoodie-v1.png', href: 'hoodies-track-pants.html', b: 'Staff, crews, teams and merch', c: 'Two hoodie weights plus matching pants', s: 'Tested size chart, proven fit',
      d: [[24, 62, 'r', 'Two hoodie weights'], [52, 30, 'l', 'Colour-matched stitching'], [84, 64, 'r', 'Pants on the same program']]},
    {n: '02', t: 'Premium Tees', img: 'img/core-tee-v1.png', href: 'premium-tees.html', b: 'Staff, events and everyday merch', c: 'Two cotton weights', s: 'Separate size charts for each tee',
      d: [[22, 22, 'l', 'Drop-shoulder fit'], [52, 70, 'r', '260 or 280 GSM cotton'], [84, 34, 'l', 'Colour-matched stitching']]},
    {n: '03', t: 'Performance & Jerseys', img: 'img/core-jersey-v1.png', href: 'performance-jerseys.html', b: 'Teams, leagues, gyms and events', c: 'Simple custom or fully custom', s: 'Tested size chart, built from proven sizes',
      d: [[22, 76, 'r', 'Performance fabric'], [50, 30, 'l', 'Full sublimation'], [82, 66, 'r', 'Sampled and quality checked']]},
    {n: '04', t: 'Custom Hats', img: 'img/core-cap-v1.png', href: 'custom-hats.html', b: 'Finishing any kit', c: 'Proven custom headwear', s: 'Proven sizing, structured fit',
      d: [[24, 52, 'l', 'Structured or relaxed crown'], [50, 72, 'r', 'Choose your panels'], [80, 24, 'l', 'Curved or flat brim']]}
  ];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const GLYPHS = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%/<>*+=';
  const tiles = [...root.querySelectorAll('.bp-tile')], xr = root.querySelector('.xr'), imgs = xr.querySelectorAll('img');
  const calls = root.querySelector('.calls'), frame = root.querySelector('.bp-frame');
  const pct = root.querySelector('.bp-read .pct'), lay = root.querySelector('.bp-read .lay'), ok = root.querySelector('.bp-read .ok');
  const BAND = 24, TOP = 76;

  /* Spy-film decode: letters flicker through random characters, then lock in left to right, timed by the clock */
  function decode(el, text, delay) {
    cancelAnimationFrame(el._raf);
    if (reduced.matches) { el.textContent = text; return; }
    const start = performance.now() + delay, dur = Math.max(520, text.length * 26);
    (function frameStep(now) {
      const t = Math.max(0, (now - start) / dur), locked = Math.floor(Math.min(1, t) * text.length);
      let out = '';
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (i < locked || ch === ' ') out += ch.replace('&', '&amp;');
        else if (i < locked + 6 && t > 0) out += '<span class="x">' + GLYPHS[(Math.random() * GLYPHS.length) | 0] + '</span>';
        else out += '&nbsp;';
      }
      el.innerHTML = out;
      if (t < 1) el._raf = requestAnimationFrame(frameStep);
    })(performance.now());
  }

  /* Reboot sweep: one bright pass, then the steady two-line scan restarts from the top */
  function boot() {
    if (reduced.matches) return;
    xr.classList.remove('booting'); xr.style.animation = 'none'; void xr.offsetWidth;
    xr.classList.add('booting');
    clearTimeout(xr._boot);
    xr._boot = setTimeout(() => { xr.classList.remove('booting'); xr.style.animation = ''; }, 1500);
  }

  let cur = -1, started = false;
  function show(k) {
    started = true;
    if (k === cur) return;
    cur = k;
    const c = C[k];
    tiles.forEach((tile, i) => tile.setAttribute('aria-pressed', String(i === k)));
    // Both layers load the same picture before it shows, so the X-ray never appears without its solid twin
    xr.classList.add('swap');
    const pre = new Image(); pre.src = c.img;
    (pre.decode ? pre.decode() : Promise.resolve()).catch(() => {}).then(() => setTimeout(() => {
      imgs.forEach(img => { img.src = c.img; });
      xr.classList.remove('swap');
      boot();
    }, 180));
    root.querySelector('.bp-read .sid').textContent = 'SCAN ' + c.n + '/04';
    calls.innerHTML = c.d.map(d => '<div class="call ' + d[2] + '" style="top:' + d[0] + '%;--x:' + d[1] + '%" data-y="' + d[0] + '"><i></i><span>' + d[3] + '</span></div>').join('');
    document.getElementById('bpNum').textContent = c.n;
    document.getElementById('bpName').textContent = c.t;
    document.getElementById('bpGo').href = c.href;
    root.querySelectorAll('[data-sr]').forEach(el => { el.textContent = c[el.dataset.sr]; });
    decode(root.querySelector('[data-dec="t"]'), c.t.toUpperCase(), 120);
    ['b', 'c', 's'].forEach((f, i) => decode(root.querySelector('[data-dec="' + f + '"]'), c[f], 380 + i * 220));
  }
  tiles.forEach((tile, i) => tile.addEventListener('click', () => show(i)));

  /* Callouts and readout read the same --y the band is drawn from, so they stay in step with it */
  let prevY = null, dir = 0, okT, raf = 0, visible = false;
  function tick() {
    const y = parseFloat(getComputedStyle(xr).getPropertyValue('--y')) || 0, booting = xr.classList.contains('booting'), now = performance.now();
    pct.textContent = booting ? 'BOOT ···' : 'PASS ' + String(Math.round(y / TOP * 100)).padStart(3, '0') + '%';
    const mid = y + BAND / 2;
    lay.textContent = booting ? '' : 'LAYER ' + (mid < 40 ? 'SEAMS' : mid < 68 ? 'FABRIC' : 'FIT');
    // A detail shows while the band covers it and stays up a little longer so it can be read
    calls.querySelectorAll('.call').forEach(el => {
      const d = +el.dataset.y, inside = !booting && d >= y + 1 && d <= y + BAND - 1;
      if (inside) el._until = now + 2400;
      el.classList.toggle('on', !booting && (inside || now < (el._until || 0)));
    });
    if (prevY !== null && !booting) {
      const nd = Math.sign(y - prevY);
      if (nd && dir && nd !== dir) {
        ok.classList.add('show'); frame.classList.add('flash');
        clearTimeout(okT); okT = setTimeout(() => { ok.classList.remove('show'); frame.classList.remove('flash'); }, 1400);
      }
      if (nd) dir = nd;
    }
    prevY = y;
    raf = visible ? requestAnimationFrame(tick) : 0;
  }
  // Only run the readout loop while the block is on screen
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (visible && !raf) raf = requestAnimationFrame(tick);
  }).observe(root);

  // Starts on 01 once; after that it only changes when someone picks a tile
  new IntersectionObserver((entries, io) => {
    if (!entries[0].isIntersecting || started) return;
    io.disconnect();
    show(0);
  }, {rootMargin: '0px 0px -25% 0px'}).observe(root.querySelector('.bp-scanner'));
})();

/* Phones: the four hanging cards slide in along the bar from the right as the selector scrolls up.
   They start moving when the bar comes into view and are all in place when it reaches mid-screen. */
(function () {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let raf = 0;
  function update() {
    raf = 0;
    const box = document.querySelector('.rack-after');
    if (!box) return;
    const cards = [...box.querySelectorAll('.hr-list li')].filter(li => li.offsetParent);
    if (reduced.matches) { cards.forEach(li => { li.style.translate = ''; }); return; }
    const vh = innerHeight, r = box.querySelector('.hero-rack').getBoundingClientRect();
    const start = vh, end = vh / 2 - r.height / 2;
    const p = Math.min(1, Math.max(0, (start - r.top) / (start - end)));
    cards.forEach((li, i) => {
      // Each card leaves a little after the one before it; a soft ease-out lands them gently
      const k = Math.min(1, Math.max(0, (p - i * 0.12) / 0.64)), e = 1 - Math.pow(1 - k, 3);
      li.style.translate = ((1 - e) * innerWidth) + 'px 0';
    });
  }
  const ask = () => { if (!raf) raf = requestAnimationFrame(update); };
  addEventListener('scroll', ask, {passive: true});
  addEventListener('resize', ask);
  ask();
})();

/* Hang tag swing: once when the showcase first comes into view (show() swings it on each change after that) */
function swingTag() {
  const sel = document.getElementById('sel');
  if (!sel) return;
  sel.classList.remove('swing');
  void sel.offsetWidth;
  sel.classList.add('swing');
}
(function () {
  const sel = document.getElementById('sel'), tag = document.getElementById('selCopy');
  if (!sel || !tag || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(e => {
    if (!e[0].isIntersecting) return;
    sel.dataset.seen = '1';
    swingTag();
    io.disconnect();
  }, {threshold: .5});
  io.observe(tag);
})();
