(function(){
  const cards = document.querySelectorAll('.promise.sign');
  const svg = '<svg class="sig" viewBox="0 0 220 64" aria-hidden="true"><path class="sig-ink" d="M30 40 C38 14 50 12 47 34 C45 48 58 22 66 25 C74 28 67 42 78 38 C90 33 93 18 102 22 C110 26 100 44 113 40 C126 35 130 27 142 29 C152 31 148 41 160 37 C172 33 178 27 194 31"/><path class="sig-x" d="M6 34 l9 9 m0 -9 l-9 9"/><path class="sig-line" d="M4 50 H216"/><text x="4" y="62">CLIENT SIGNATURE</text></svg>';
  cards.forEach(card=>{if(!card.querySelector('.sig'))card.insertAdjacentHTML('beforeend',svg)});
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window))return;
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('signature-visible');observer.unobserve(entry.target)}
  }),{threshold:.3});
  cards.forEach(card=>{card.classList.add('signature-ready');observer.observe(card)});
})();
