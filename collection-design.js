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
    $('selName').innerHTML = data.name;
    $('selLead').textContent = data.lead;
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
    if (options.push && location.hash !== '#' + data.slug) {
      history.pushState(null, '', '#' + data.slug);
    }
    if (options.announce) $('collectionStatus').textContent = data.plain.replace(/&amp;/g, '&') + ', collection ' + (current + 1) + ' of 4.';
    if (options.scroll) scrollToCollection();
  }
  tags.forEach((button, index) => button.addEventListener('click', () => show(index, {push:true, scroll:true, announce:true})));
  indexButtons.forEach((button, index) => button.addEventListener('click', () => show(index, {push:true, scroll:true, announce:true})));
  document.querySelector('.index-buttons').addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const index = event.key === 'Home' ? 0 : event.key === 'End' ? 3 : current + (event.key === 'ArrowRight' ? 1 : -1);
    show(index, {push:true, announce:true});
    indexButtons[current].focus({preventScroll:true});
  });
  $('selPrev').addEventListener('click', () => show(current - 1, {push:true, scroll:true, announce:true}));
  $('selNext').addEventListener('click', () => show(current + 1, {push:true, scroll:true, announce:true}));
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
    observer.observe($('steps')); observer.observe($('promises'));
  } else { $('steps').classList.add('play'); $('promises').classList.add('lit'); }
})();

