'use strict';
const reading=document.querySelector('#reading'),contents=document.querySelector('#contents'),zoom=document.querySelector('#zoom');
const esc=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fonts={head:'Trebuchet MS',body:'Segoe UI',bold:'Segoe UI',mono:'Consolas',heavy:'Impact'};
function boxStyle(b){return `left:${b[0]}px;top:${b[1]}px;width:${b[2]-b[0]}px;height:${b[3]-b[1]}px;`;}
function nativeElement(e,i,page){
 if(e.type==='text'){
  if(e.x===64&&/HISTORY.*SKIP.*AUTO/.test(e.text))return '';
  const meta=e.y<90||/^\d{2} \/ \d{2}$/.test(e.text);
  const tag=e.kind==='head'&&e.size>=46?'h2':'p';
  return `<${tag} class="element text ${e.kind} ${meta?'page-meta':''}" style="order:${e.mobileOrder??i};left:${e.x}px;top:${e.y+Math.round(e.size*.15)}px;width:${Math.min(e.w,1600-e.x-20)}px;font-size:${e.size}px;line-height:${e.step}px;color:${e.color}">${e.lines.map(esc).join('<br> ')}</${tag}>`;
 }
 if(e.type==='image')return `<button class="element art" style="order:${e.mobileOrder??i};${boxStyle(e.box)}" data-art="${esc(e.path)}" aria-label="Enlarge original image ${i+1}: ${esc(page.label)}"><img src="${esc(e.path)}" alt="Original production or research image: ${esc(page.label)}" loading="lazy"></button>`;
 if(e.type==='line'){let b=e.box;return `<span class="element line" aria-hidden="true" style="left:${Math.min(b[0],b[2])}px;top:${Math.min(b[1],b[3])}px;width:${Math.max(e.width,Math.abs(b[2]-b[0]))}px;height:${Math.max(e.width,Math.abs(b[3]-b[1]))}px;background:${e.fill}"></span>`;}
 return `<span class="element shape" aria-hidden="true" style="${boxStyle(e.box)}background:${e.fill||'transparent'};border:${e.outline?e.width+'px solid '+e.outline:'0'};border-radius:${e.type==='ellipse'?'50%':(e.radius||0)+'px'}"></span>`;
}
function resize(){document.querySelectorAll('.canvas-wrap').forEach(w=>{const scale=w.clientWidth/1600;w.style.height=Number(w.dataset.height||1131)*scale+'px';w.firstElementChild.style.transform=`scale(${scale})`;});}
fetch('layout.json?v=focused-11').then(r=>{if(!r.ok)throw Error('Content could not be loaded');return r.json();}).then(pages=>{
 contents.innerHTML=pages.map((p,i)=>`<a href="#section-${i+1}">${String(i+1).padStart(2,'0')} / ${esc(p.label)}</a>`).join('');
 reading.innerHTML=pages.map((p,i)=>{
  const designed=renderDesigned(p,i);if(designed)return designed;
  const links=p.links.map(([label,url])=>`<a href="${esc(url)}" ${url.startsWith('#')?'':'target="_blank" rel="noopener"'}>${esc(label)} ↗</a>`).join('');
  let overlays=i===0?'<a class="native-source" style="left:108px;top:351px;width:289px;height:54px" href="#section-2" aria-label="Begin reading the project">BEGIN SHIFT</a>':'';
  const sourceHeads=p.elements.filter(e=>e.type==='text'&&['OPEN SOURCE  >','SOURCE DETAILS  >'].includes(e.text));
  sourceHeads.forEach((e,j)=>{if(p.links[j])overlays+=`<a class="native-source" style="order:${e.mobileOrder??i};left:${e.x}px;top:${e.y}px;width:450px;height:36px" href="${esc(p.links[j][1])}" ${p.links[j][1].startsWith('#')?'':'target="_blank" rel="noopener"'} aria-label="${esc(p.links[j][0])}">OPEN SOURCE</a>`;});
  const prev=i?`<a href="#section-${i}">← PREVIOUS</a>`:'';const next=i<pages.length-1?`<a href="#section-${i+2}">NEXT →</a>`:`<a href="#section-1">RETURN ↑</a>`;
  return `<section class="folio" id="section-${i+1}" aria-label="${esc(p.label)}"><p class="mobile-label">${String(i+1).padStart(2,'0')} / ${esc(p.label)}</p><div class="canvas-wrap" data-height="${p.height||1131}"><div class="canvas" style="height:${p.height||1131}px;background:${p.elements[0].fill}">${p.elements.map((e,j)=>nativeElement(e,j,p)).join('')}${overlays}<nav class="vn-nav" style="top:${(p.height||1131)-76}px;color:${p.elements.find(e=>e.type==='text').color}" aria-label="Section ${i+1} navigation">${prev}<a href="#" data-contents>CONTENTS</a><a href="#section-11">SOURCES</a>${next}</nav></div></div><div class="section-tail"><div class="citations">${links}</div><div class="chapter-move">${prev}${next}</div></div></section>`;
 }).join('');
 document.querySelectorAll('[data-art]').forEach(b=>b.onclick=()=>{zoom.querySelector('img').src=b.dataset.art;zoom.querySelector('img').alt=b.getAttribute('aria-label');zoom.querySelector('p').textContent=b.closest('section').getAttribute('aria-label');zoom.showModal();});
 document.querySelectorAll('[data-contents]').forEach(a=>a.onclick=e=>{e.preventDefault();contents.hidden=false;});resize();new ResizeObserver(resize).observe(reading);
 if(location.hash)document.querySelector(location.hash)?.scrollIntoView();
}).catch(e=>{reading.innerHTML='<p style="padding:60px">The project could not load. Please refresh the page.</p>';console.error(e);});
document.querySelector('#contents-button').onclick=()=>{contents.hidden=!contents.hidden;document.querySelector('#contents-button').setAttribute('aria-expanded',String(!contents.hidden));};
contents.onclick=e=>{if(e.target.closest('a'))contents.hidden=true;};
document.querySelector('#close-zoom').onclick=()=>zoom.close();

