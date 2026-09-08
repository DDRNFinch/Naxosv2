const courses=window.NAXOS_COURSES;
const app=document.getElementById('app');
const homeTpl=document.getElementById('homeTemplate');
const courseTpl=document.getElementById('courseTemplate');
const packTpl=document.getElementById('packTemplate');
const state={courseId:null,mode:'packs',packIndex:null,packTab:'knowledge',libraryTab:'knowledge'};
const defaultPointers=['Before starting','Setting out / measuring','Work in progress','Tools / techniques','Checks','Finished result'];
const strengthStore=JSON.parse(localStorage.getItem('naxos-v2-strength')||'{}');

function clone(t){return t.content.cloneNode(true)}
function esc(s=''){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function count(obj){return Object.keys(obj).length}
function strengthKey(course,pack,type,id){return `${course.id}:${pack.title}:${type}:${id}`}
function strengthHTML(level,key){return `<button class="strength" data-strength-key="${esc(key)}" data-level="${level}" title="Evia evidence-strength preview. Tap to cycle 0–3." aria-label="Evidence strength ${level} of 3"><i></i><i></i><i></i></button>`}
function saveStrength(key){const next=((strengthStore[key]||0)+1)%4;strengthStore[key]=next;localStorage.setItem('naxos-v2-strength',JSON.stringify(strengthStore));return next}
function courseById(id){return courses[id]}

function renderHome(){
  state.courseId=null;state.packIndex=null;app.replaceChildren(clone(homeTpl));
  const grid=document.getElementById('courseGrid');
  Object.values(courses).forEach(c=>{
    const b=document.createElement('button');b.className='course-card';b.dataset.course=c.id;
    b.innerHTML=`<div><p class="eyebrow">${esc(c.standard)} · V${esc(c.version)} · LEVEL ${c.level}</p><h3>${esc(c.title)}</h3><p>${esc(c.summary)}</p></div><div class="route"><span>${c.packs.length} builder packs · ${count(c.knowledge)+count(c.skills)+count(c.behaviours)} KSBs</span><b>→</b></div>`;
    grid.appendChild(b);
  });
}

function renderCourse(){
  const c=courseById(state.courseId);if(!c)return renderHome();
  app.replaceChildren(clone(courseTpl));
  document.getElementById('courseRef').textContent=`${c.standard} · version ${c.version} · Level ${c.level}`;
  document.getElementById('courseTitle').textContent=c.title;
  document.getElementById('courseSummary').textContent=c.summary;
  document.getElementById('courseStats').innerHTML=`<span class="stat"><strong>${count(c.knowledge)}</strong> Knowledge</span><span class="stat"><strong>${count(c.skills)}</strong> Skills</span><span class="stat"><strong>${count(c.behaviours)}</strong> Behaviours</span><span class="stat"><strong>${c.packs.length}</strong> Packs</span><span class="stat">${esc(c.meta.duration)}</span>`;
  document.querySelectorAll('.mode').forEach(b=>b.classList.toggle('active',b.dataset.mode===state.mode));
  state.mode==='library'?renderLibrary(c):renderPacks(c);
}

function renderPacks(c){
  const body=document.getElementById('courseBody');body.innerHTML='';
  const groups={};c.packs.forEach((p,i)=>{(groups[p.area]??=[]).push([p,i])});
  Object.entries(groups).forEach(([area,rows])=>{
    const sec=document.createElement('section');sec.className='area';
    sec.innerHTML=`<div class="area-title"><h3>${esc(area)}</h3><span>${rows.length} ${rows.length===1?'pack':'packs'}</span></div><div class="pack-grid"></div>`;
    const grid=sec.querySelector('.pack-grid');
    rows.forEach(([p,i])=>{
      const kIds=new Set(p.links.flatMap(x=>x.k));const sIds=new Set(p.links.flatMap(x=>x.s));
      const b=document.createElement('button');b.className='pack-card';b.dataset.pack=i;
      b.innerHTML=`<small>${esc(area)}</small><strong>${esc(p.title)}</strong><p>${esc(p.intro)}</p><p><b>${kIds.size}</b> K · <b>${sIds.size}</b> S · <b>${p.behaviours.length}</b> B linked</p>`;
      grid.appendChild(b);
    });body.appendChild(sec);
  });
}

function renderLibrary(c){
  const body=document.getElementById('courseBody');
  body.innerHTML=`<div class="library-toolbar"><button data-lib="knowledge">Knowledge</button><button data-lib="skills">Skills</button><button data-lib="behaviours">Behaviours</button></div><div class="library-list"></div>`;
  body.querySelectorAll('[data-lib]').forEach(b=>b.classList.toggle('active',b.dataset.lib===state.libraryTab));
  const obj=c[state.libraryTab];const list=body.querySelector('.library-list');
  Object.entries(obj).forEach(([id,text])=>{const card=document.createElement('article');card.className='library-card';card.innerHTML=`<strong>${esc(id)}</strong><p>${esc(text)}</p>`;list.appendChild(card)});
}

function getLinked(pack,type,id){
  const found=[];
  pack.links.forEach(link=>{
    if(type==='knowledge'&&link.k.includes(id))found.push(...link.s.map(x=>({id:x,label:link.label})));
    if(type==='skills'&&link.s.includes(id))found.push(...link.k.map(x=>({id:x,label:link.label})));
  });
  return [...new Map(found.map(x=>[x.id,x])).values()];
}

function renderPack(){
  const c=courseById(state.courseId),p=c?.packs[state.packIndex];if(!p)return renderCourse();
  app.replaceChildren(clone(packTpl));
  document.getElementById('packCourseBack').textContent=c.title;
  document.getElementById('packPath').textContent=`${c.standard} · ${p.area}`;
  document.getElementById('packTitle').textContent=p.title;
  document.getElementById('packIntro').textContent=p.intro;
  const pointers=p.photo.length?p.photo:defaultPointers;
  document.getElementById('photoPointers').innerHTML=pointers.map(x=>`<span class="pointer">${esc(x)}</span>`).join('');
  document.querySelectorAll('.ksb-tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===state.packTab));
  renderPackCriteria(c,p);
}

function renderPackCriteria(c,p){
  const box=document.getElementById('packContent');box.innerHTML='';
  const isGap=/gap evidence/i.test(p.title);
  if(state.packTab==='behaviours'){
    const ids=isGap?Object.keys(c.behaviours):p.behaviours;
    if(!ids.length)return box.innerHTML='<div class="empty">No behaviour has been specifically attached to this pack yet.</div>';
    ids.forEach(id=>box.appendChild(criterionCard(c,p,'behaviours',id,c.behaviours[id],[])));
    return;
  }
  const source=c[state.packTab];
  const ids=isGap?Object.keys(source):[...new Set(p.links.flatMap(x=>state.packTab==='knowledge'?x.k:x.s))];
  if(!ids.length)return box.innerHTML='<div class="empty">No criteria are attached yet. Use the gap pack to browse the full library.</div>';
  ids.forEach(id=>box.appendChild(criterionCard(c,p,state.packTab,id,source[id]||'Criterion not found in current course library.',getLinked(p,state.packTab,id))));
}

function criterionCard(c,p,type,id,text,linked){
  const el=document.createElement('article');el.className='criterion';
  const key=strengthKey(c,p,type,id),level=strengthStore[key]||0;
  const linkedLabel=type==='knowledge'?'Linked skills':type==='skills'?'Linked knowledge':'';
  el.innerHTML=`<div class="criterion-top"><span class="code">${esc(id)}</span><div><h4>${esc(text)}</h4></div>${strengthHTML(level,key)}</div>${linked.length?`<div class="linked"><span>${linkedLabel}</span>${linked.map(x=>`<span class="chip primary" title="${esc(x.label)}">${esc(x.id)}</span>`).join('')}</div>`:''}`;
  return el;
}

app.addEventListener('click',e=>{
  const courseBtn=e.target.closest('[data-course]');if(courseBtn){state.courseId=courseBtn.dataset.course;state.mode='packs';renderCourse();scrollTo(0,0);return}
  const action=e.target.closest('[data-action]')?.dataset.action;if(action==='home'){renderHome();scrollTo(0,0);return}if(action==='course'){renderCourse();scrollTo(0,0);return}
  const mode=e.target.closest('[data-mode]')?.dataset.mode;if(mode){state.mode=mode;renderCourse();return}
  const lib=e.target.closest('[data-lib]')?.dataset.lib;if(lib){state.libraryTab=lib;renderLibrary(courseById(state.courseId));return}
  const pack=e.target.closest('[data-pack]')?.dataset.pack;if(pack!==undefined){state.packIndex=Number(pack);state.packTab='knowledge';renderPack();scrollTo(0,0);return}
  const tab=e.target.closest('[data-tab]')?.dataset.tab;if(tab){state.packTab=tab;document.querySelectorAll('.ksb-tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));renderPackCriteria(courseById(state.courseId),courseById(state.courseId).packs[state.packIndex]);return}
  const strength=e.target.closest('[data-strength-key]');if(strength){const next=saveStrength(strength.dataset.strengthKey);strength.dataset.level=next;strength.setAttribute('aria-label',`Evidence strength ${next} of 3`);return}
});

document.getElementById('homeBtn').addEventListener('click',()=>{renderHome();scrollTo(0,0)});
document.getElementById('libraryBtn').addEventListener('click',()=>{if(!state.courseId)state.courseId='site';state.mode='library';state.packIndex=null;renderCourse();scrollTo(0,0)});
renderHome();