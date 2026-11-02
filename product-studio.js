(function(){
  'use strict';
  const studio=document.querySelector('.studio');
  if(!studio)return;
  const palettes={
    hoodie:[
      [['White','#ffffff'],['Black','#252c30'],['Navy','#24445c'],['Heather grey','#a8aaa8'],['Forest','#536d5b']],
      [['White','#ffffff'],['Black','#252c30'],['Navy','#24445c'],['Stone','#b9ac95'],['Burgundy','#754349']]
    ],
    tee:[
      [['White','#ffffff'],['Aqua blue','#46aab6'],['Black','#111317'],['Dark green','#124b46'],['Burgundy','#53212d'],['Navy','#17213b'],['Khaki','#a7977d'],['Iron grey','#43454b'],['Bright yellow','#eac25d'],['Pink','#e8b6bb'],['Light beige','#e8decd'],['Light blue','#b3cada'],['Light purple','#a691b5'],['Heather grey','#bab9bd']],
      [['White','#ffffff'],['Navy blue','#1a2338'],['Polar blue','#a5cbd8'],['Burgundy','#642b38'],['Matcha green','#899978'],['Pink','#dfb6bf'],['Taro purple','#afa6cc'],['Oatmeal','#ded8c8'],['Emerald green','#315e4a'],['Black','#151515'],['Beige','#e6ddc4'],['Earth brown','#77613f'],['China red','#b93437'],['Charcoal grey','#56585a']]
    ]
  };
  const kind=studio.dataset.product;
  const sketch=studio.querySelector('.tinted-sketch');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const animated=[studio,document.querySelector('.sample-section')].filter(Boolean);
    animated.forEach(section=>section.classList.add('studio-motion-ready'));
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('studio-in-view');observer.unobserve(entry.target)}
    }),{threshold:.1});
    animated.forEach(section=>observer.observe(section));
  }
  if(palettes[kind]){
    const holder=document.getElementById('studio-colours');
    const label=document.getElementById('colour-label');
    const weightLabel=document.getElementById('palette-weight');
    const weights=Array.from(studio.querySelectorAll('.weight-choice'));
    const notes={hoodie:['The lighter of the two hoodie directions; a starting point for everyday wear.','The heavier hoodie direction; explore a more substantial feel.'],tee:['Style 672: 260 GSM cotton, drop-shoulder relaxed fit.','Style 640: 280 GSM cotton, double-yarn oversized fit.']};
    const weightDescription=document.getElementById('weight-description');
    label.setAttribute('aria-live','polite');
    function renderPalette(index){
      holder.replaceChildren();
      palettes[kind][index].forEach(([name,colour],i)=>{
        const button=document.createElement('button');
        button.type='button';button.setAttribute('aria-label',name+(kind==='tee'?' colour':' example colour'));button.setAttribute('aria-pressed',String(i===0));button.title=name;
        button.style.setProperty('--swatch',colour);button.innerHTML='<i aria-hidden="true"></i>';
        button.addEventListener('click',()=>{
          holder.querySelectorAll('button').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
          sketch.style.setProperty('--fabric',colour);sketch.style.setProperty('--tint-opacity',i===0?'0':'1');sketch.dataset.colour=i===0?'white':'colour';label.textContent=name;
          const rgb=[1,3,5].map(start=>parseInt(colour.slice(start,start+2),16));
          sketch.dataset.tone=(rgb[0]*.299+rgb[1]*.587+rgb[2]*.114)<145?'dark':'light';
          const stitchPaint=document.getElementById('tee-stitch-paint');if(stitchPaint)stitchPaint.setAttribute('flood-color',colour);
        });
        holder.append(button);
      });
      sketch.style.setProperty('--fabric',palettes[kind][index][0][1]);sketch.style.setProperty('--tint-opacity','0');sketch.dataset.colour='white';sketch.dataset.tone='light';label.textContent=palettes[kind][index][0][0];
      const stitchPaint=document.getElementById('tee-stitch-paint');if(stitchPaint)stitchPaint.setAttribute('flood-color','#ffffff');
    }
    weights.forEach((button,index)=>button.addEventListener('click',()=>{
      weights.forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
      weightLabel.textContent=button.querySelector('strong').textContent;weightDescription.textContent=notes[kind][index];renderPalette(index);
    }));
    weightDescription.textContent=notes[kind][0];
    renderPalette(0);
  }
  studio.querySelectorAll('[data-design]').forEach(button=>{
    if(button.tagName!=='BUTTON')return;
    button.addEventListener('click',()=>{
      studio.querySelectorAll('button[data-design]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
      sketch.dataset.design=button.dataset.design;
      document.getElementById('design-label').textContent=button.textContent.replace(/^\s*\d+\s*/, '').trim();
    });
  });
  studio.querySelectorAll('button[data-hat]').forEach(button=>button.addEventListener('click',()=>{
    studio.querySelectorAll('button[data-hat]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
    document.getElementById('hat-label').textContent=button.dataset.hat+' direction';
  }));
  const hatColour=document.getElementById('hat-colour');
  if(hatColour)hatColour.addEventListener('input',()=>{sketch.style.setProperty('--fabric',hatColour.value);sketch.style.setProperty('--tint-opacity','1');sketch.dataset.colour='colour'});
  if(sketch && kind!=='jersey'){
    document.body.insertAdjacentHTML('beforeend','<svg class="filter-defs" aria-hidden="true"><filter id="white-stitch" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  4 -4 0 0 -0.12"/></filter><filter id="tee-stitch-match" color-interpolation-filters="sRGB"><feColorMatrix in="SourceGraphic" type="matrix" result="stitchMask" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  4 -4 0 0 -0.12"/><feFlood id="tee-stitch-paint" flood-color="#ffffff" result="paint"/><feComposite in="paint" in2="stitchMask" operator="in"/></filter><filter id="dark-detail" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 .85  0 0 0 0 .89  0 0 0 0 .9  -1.2 -1.2 -1.2 1.8 0"/></filter></svg>');
    if(kind==='tee'||kind==='hoodie'){
      const detail=sketch.querySelector('img').cloneNode();
      detail.alt='';detail.className='dark-detail-overlay';detail.setAttribute('aria-hidden','true');
      sketch.append(detail);
    }
    const stitching=sketch.querySelector('img').cloneNode();
    stitching.alt='';stitching.className='stitching-overlay';stitching.setAttribute('aria-hidden','true');
    sketch.append(stitching);
    sketch.dataset.colour='white';
  }
  const sizeRows={
    '260':[['S','66','51','51','21.5','90–110'],['M','68','53','53','22','110–125'],['L','70','55','55','22.5','125–140'],['XL','72','57','57','23','140–160'],['2XL','74','59','59','23.5','160–175'],['3XL','76','61','61','24','175–195']],
    '280':[['S','67','108','54','20.3','90–110'],['M','69.5','112','56','20.8','110–130'],['L','72','116','58','21.3','130–145'],['XL','74.5','123','60','21.8','145–165'],['2XL','77','128','62','22.3','165–190'],['3XL','79','133','64','22.8','190–210']]
  };
  const sizeBody=document.getElementById('size-rows');
  if(sizeBody){
    const tabs=Array.from(document.querySelectorAll('[data-size]'));
    const unitButtons=Array.from(document.querySelectorAll('[data-unit]'));
    let currentSize='260',unit='cm';
    function showSizes(value){
      currentSize=value;
      sizeBody.replaceChildren(...sizeRows[value].map(row=>{const tr=document.createElement('tr');row.forEach((cell,i)=>{const td=document.createElement(i?'td':'th');if(!i)td.scope='row';td.textContent=unit==='in'&&i>=1&&i<=4?(Number(cell)/2.54).toFixed(1):cell;tr.append(td)});return tr}));
      document.getElementById('size-caption').textContent=value==='260'?'672 / 260 GSM · drop-shoulder tee':'640 / 280 GSM · double-yarn tee';
      tabs.forEach(tab=>tab.setAttribute('aria-pressed',String(tab.dataset.size===value)));
      unitButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.unit===unit)));
      document.querySelectorAll('[data-measure-heading]').forEach(cell=>{cell.textContent=cell.dataset.measureHeading+' ('+unit+')'});
    }
    tabs.forEach(tab=>tab.addEventListener('click',()=>showSizes(tab.dataset.size)));
    unitButtons.forEach(button=>button.addEventListener('click',()=>{unit=button.dataset.unit;showSizes(currentSize)}));
    studio.querySelectorAll('.weight-choice:not(:disabled)').forEach((button,index)=>button.addEventListener('click',()=>showSizes(index===0?'260':'280')));
    showSizes('260');
  }
})();
