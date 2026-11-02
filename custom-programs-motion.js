(function(){
  const media = matchMedia('(max-width: 860px) and (hover: none) and (prefers-reduced-motion: no-preference)');
  if (!media.matches || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('tag-entered');
    observer.unobserve(entry.target);
  }), {threshold:.16, rootMargin:'0px 0px -6% 0px'});
  document.querySelectorAll('.pg-copy').forEach(card => observer.observe(card));
})();
