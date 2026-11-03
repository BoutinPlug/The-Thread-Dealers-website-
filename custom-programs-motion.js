(function(){
  // The longer description gets a copy under the picture-and-tag row; CSS shows it only on phones
  document.querySelectorAll('.pg').forEach(pg => {
    const d = pg.querySelector('.pg-copy .pg-d');
    if (!d) return;
    const out = document.createElement('p');
    out.className = 'pg-d-out';
    out.textContent = d.textContent;
    pg.appendChild(out);
  });

  // Numbers stamp in when they reach the middle of the screen, so the moment is in clear view
  if ('IntersectionObserver' in window) {
    const stamp = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('stamped');
      stamp.unobserve(entry.target);
    }), {rootMargin:'0px 0px -50% 0px'});
    document.querySelectorAll('.pg-num').forEach(n => stamp.observe(n));
  } else {
    document.querySelectorAll('.pg-num').forEach(n => n.classList.add('stamped'));
  }

  const media = matchMedia('(max-width: 860px) and (hover: none) and (prefers-reduced-motion: no-preference)');
  if (media.matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('tag-entered');
      observer.unobserve(entry.target);
    }), {threshold:.16, rootMargin:'0px 0px -6% 0px'});
    document.querySelectorAll('.pg-copy').forEach(card => observer.observe(card));
  }

  // Phones: each hang tag gives one gentle swing as it rises into the middle of the screen, then hangs still
  const swingMQ = matchMedia('(max-width: 760px) and (prefers-reduced-motion: no-preference)');
  if (!swingMQ.matches || !('IntersectionObserver' in window)) return;
  function swing(el){
    let a = 0, v = 0.55;
    (function step(){
      v += -a * 0.045; v *= 0.95; a += v;
      el.style.setProperty('--swing', a.toFixed(2) + 'deg');
      if (Math.abs(a) > 0.03 || Math.abs(v) > 0.03) requestAnimationFrame(step);
      else el.style.setProperty('--swing', '0deg');
    })();
  }
  const arrive = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    swing(entry.target);
    arrive.unobserve(entry.target);
  }), {rootMargin:'0px 0px -45% 0px'});
  document.querySelectorAll('.pg-copy').forEach(card => arrive.observe(card));
})();
