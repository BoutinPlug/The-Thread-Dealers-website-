(function(){
  const button=document.createElement('button');
  button.type='button';button.className='to-top';button.setAttribute('aria-label','Back to top');
  button.innerHTML='<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 16V4M4.5 9.5 10 4l5.5 5.5"/></svg>';
  document.body.append(button);
  function update(){button.classList.toggle('show',window.scrollY>window.innerHeight*.8)}
  window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);update();
  button.addEventListener('click',()=>window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}));
})();
