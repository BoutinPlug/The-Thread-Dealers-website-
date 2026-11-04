/* Google Analytics loads only after the visitor accepts. Any element with data-analytics-choice reopens the banner. */
(function(){
  const TAG='GTM-56F5JND6', KEY='ttd-analytics';
  let started=false, banner=null;

  function read(){try{return localStorage.getItem(KEY)}catch(e){return null}}
  function save(value){try{localStorage.setItem(KEY,value)}catch(e){}}

  function start(){
    if(started)return;
    started=true;
    window.dataLayer=window.dataLayer||[];
    window.gtag=function(){dataLayer.push(arguments)};
    gtag('js',new Date());
    const script=document.createElement('script');
    script.async=true;
    script.src='https://www.googletagmanager.com/gtm.js?id='+TAG;
    document.head.appendChild(script);
  }

  function clearCookies(){
    const parts=location.hostname.split('.');
    const domains=['',location.hostname,'.'+parts.slice(-2).join('.')];
    document.cookie.split(';').forEach(function(c){
      const name=c.split('=')[0].trim();
      if(name.indexOf('_ga')!==0)return;
      domains.forEach(function(d){document.cookie=name+'=;path=/;max-age=0'+(d?';domain='+d:'')});
    });
  }

  function addStyles(){
    if(document.getElementById('consent-css'))return;
    const css=document.createElement('style');
    css.id='consent-css';
    css.textContent=
      '.consent{position:fixed;left:16px;right:16px;bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:200;max-width:430px;padding:18px;border-radius:6px;background:var(--ink,#06263A);color:var(--cream,#F4EBDD);font:500 14px/1.5 var(--body,"Manrope",system-ui,sans-serif);box-shadow:0 14px 36px rgba(3,26,43,.35)}'+
      '.consent p{margin:0 0 14px;color:inherit;font:inherit}'+
      '.consent a{color:inherit;font-weight:700;text-decoration:underline}'+
      '.consent-row{display:flex;gap:10px}'+
      '.consent button{flex:1;min-height:44px;border-radius:4px;border:1.5px solid var(--cream,#F4EBDD);background:none;color:inherit;font:800 14px/1 var(--body,"Manrope",system-ui,sans-serif);cursor:pointer}'+
      '.consent button.yes{border-color:var(--rust,#C94A2C);background:var(--rust,#C94A2C);color:#fff}'+
      '.consent button:focus-visible{outline:2px solid #fff;outline-offset:2px}';
    document.head.appendChild(css);
  }

  function showBanner(){
    if(banner)return;
    addStyles();
    banner=document.createElement('section');
    banner.className='consent';
    banner.setAttribute('aria-label','Cookie choice');
    banner.innerHTML='<p>We use cookies to see how people find and use this site. No ads. See our <a href="privacy.html">privacy policy</a>.</p>'+
      '<div class="consent-row"><button type="button" class="yes">Accept</button><button type="button" class="no">Decline</button></div>';
    banner.querySelector('.yes').addEventListener('click',function(){choose('yes')});
    banner.querySelector('.no').addEventListener('click',function(){choose('no')});
    document.body.appendChild(banner);
  }

  function choose(value){
    save(value);
    banner.remove();
    banner=null;
    if(value==='yes'){start();return}
    clearCookies();
    if(started)location.reload();
  }

  document.addEventListener('click',function(e){
    if(e.target.closest&&e.target.closest('[data-analytics-choice]'))showBanner();
  });

  const saved=read();
  if(saved==='yes')start();
  else if(saved!=='no')showBanner();
})();
