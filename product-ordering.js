(function(){
  const steps=document.getElementById('steps');
  if(!steps)return;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)){steps.classList.add('play');return}
  const observer=new IntersectionObserver(entries=>{if(entries[0].isIntersecting){steps.classList.add('play');observer.disconnect()}},{threshold:.2});
  observer.observe(steps);
})();
