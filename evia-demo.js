(()=>{
  'use strict';
  const COURSES=window.NAXOS_COURSES;
  const app=document.getElementById('app');
  const backBtn=document.getElementById('backBtn');
  const resetBtn=document.getElementById('resetBtn');
  const STORE='eviaLearnerDemoV1';
  const strengthTemplate=document.getElementById('strengthTemplate');

  const seed={
    site:{S5:1,S9:2,S10:2,S21:1,K14:2,K17:1,B1:2},
    joiner:{S5:1,S9:2,S23:1,S24:1,K14:1,K32:1,B1:2},
    brick:{S2:2,S7:1,S8:2,S10:1,K2:1,K3:1,K13:2,B1:2}
  };

  const load=()=>{
    try{return JSON.parse(localStorage.getItem(STORE))||{counts:structuredClone(seed),submissions:[]};}
    catch{return {counts:structuredClone(seed),submissions:[]};}
  };
  let db=load();
  if(!db.counts) db.counts=structuredClone(seed);

  const state={course:'brick',view:'home',area:null,pack:null,tab:'photos',photos:[],selected:new Set(),answers:{}};
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const arr=x=>Array.isArray(x)?x:[x];
  const uniq=a=>[...new Set(a.filter(Boolean))];
  const course=()=>COURSES[state.course];
  const pack=()=>state.pack==null?null:course().packs[state.pack];
  const count=id=>db.counts?.[state.course]?.[id]||0;
  const saveDb=()=>localStorage.setItem(STORE,JSON.stringify(db));

  function strengthHTML(id){
    const n=Math.min(3,count(id));
    return `<span class="strength" title="Previously evidenced ${count(id)} time${count(id)===1?'':'s'}" aria-label="Evidence strength ${n} of 3"><i class="${n>=1?'on':''}"></i><i class="${n>=2?'on':''}"></i><i class="${n>=3?'on':''}"></i></span>`;
  }

  function updateBack(){
    backBtn.hidden=state.view==='home';
  }

  function courseSwitch(){
    return `<div class="course-switch">${Object.values(COURSES).map(c=>`<button class="course-pill ${c.id===state.course?'active':''}" data-course="${c.id}" type="button">${esc(c.title)}<br><span style="font-weight:600;color:#777168">${esc(c.standard)}</span></button>`).join('')}</div>`;
  }

  function renderHome(){
    const c=course();
    const areas=uniq(c.packs.map(p=>p.area));
    app.innerHTML=`
      <section class="hero">
        <div class="eyebrow">Learner evidence</div>
        <h1>What are you working on?</h1>
        <p>Choose your course, then the part of the job you are doing today.</p>
      </section>
      ${courseSwitch()}
      <div class="section-title"><h2>${esc(c.title)}</h2><span>${c.standard} · v${c.version}</span></div>
      <div class="grid">${areas.map(area=>{
        const ps=c.packs.filter(p=>p.area===area);
        return `<button class="tile" type="button" data-area="${esc(area)}"><strong>${esc(area)}</strong><small>${ps.slice(0,3).map(p=>p.title).join(' · ')}${ps.length>3?'…':''}</small><div class="count">${ps.length} evidence ${ps.length===1?'area':'areas'}</div></button>`;
      }).join('')}</div>
      <div class="card" style="margin-top:18px"><h3>How Evia uses Naxos</h3><p>Naxos holds the complete course and the K↔S relationships. Evia only shows the task the learner chose and the evidence opportunities linked to it.</p></div>`;
    bindCommon();
  }

  function renderArea(){
    const c=course();
    const ps=c.packs.map((p,i)=>({...p,index:i})).filter(p=>p.area===state.area);
    app.innerHTML=`
      <section class="hero"><div class="eyebrow">${esc(c.title)}</div><h1>${esc(state.area)}</h1><p>Choose the job that best matches what you are doing today.</p></section>
      <div class="task-list">${ps.map(p=>`<button class="task-btn" data-pack="${p.index}" type="button"><span><strong>${esc(p.title)}</strong><small>${esc(p.intro)}</small></span><span class="chev">›</span></button>`).join('')}</div>`;
    document.querySelectorAll('[data-pack]').forEach(b=>b.addEventListener('click',()=>openPack(Number(b.dataset.pack))));
  }

  function openPack(index){
    state.pack=index;state.view='pack';state.tab='photos';state.photos=[];state.selected=new Set();state.answers={};
    render();
  }

  function photoPointers(){
    const p=pack();
    if(p.photo?.length) return p.photo;
    return ['Before you start','Setting out / measuring','Work in progress','Tools / techniques','Details / fixings','Finished result'];
  }

  function renderPack(){
    const p=pack(),c=course();
    app.innerHTML=`
      <section class="pack-head"><div class="eyebrow">${esc(p.area)} · ${esc(c.title)}</div><h1>${esc(p.title)}</h1><p>${esc(p.intro)}</p></section>
      <nav class="tabs" aria-label="Evidence sections">
        ${['photos','skills','knowledge','behaviours'].map(t=>`<button class="tab ${state.tab===t?'active':''}" type="button" data-tab="${t}">${t==='photos'?'Photo story':t[0].toUpperCase()+t.slice(1)}</button>`).join('')}
      </nav>
      <div id="tabContent"></div>
      <div class="summary-bar"><div class="summary-inner"><div class="summary-copy"><strong>${state.selected.size} evidence areas selected</strong><small>${state.photos.length} photo${state.photos.length===1?'':'s'} in this story</small></div><button class="save-btn" id="savePack" type="button">Save pack</button></div></div>`;
    document.querySelectorAll('[data-tab]').forEach(b=>b.addEventListener('click',()=>{state.tab=b.dataset.tab;renderPack();}));
    document.getElementById('savePack').addEventListener('click',savePack);
    renderTab();
  }

  function renderTab(){
    const host=document.getElementById('tabContent');
    if(!host)return;
    if(state.tab==='photos') renderPhotos(host);
    if(state.tab==='skills') renderKSB(host,'skills');
    if(state.tab==='knowledge') renderKSB(host,'knowledge');
    if(state.tab==='behaviours') renderKSB(host,'behaviours');
  }

  function renderPhotos(host){
    host.innerHTML=`
      <div class="card">
        <h3>Tell the story of the job</h3>
        <p>Take photos naturally as you work from start to finish. Capture everything useful you can. You do not need one photo for every KSB.</p>
        <div class="pointer-list">${photoPointers().map(x=>`<div class="pointer">${esc(x)}</div>`).join('')}</div>
        <div class="upload-row">
          <label class="upload">Take a photo<input id="cameraInput" type="file" accept="image/*" capture="environment"></label>
          <label class="upload secondary">Add photos<input id="galleryInput" type="file" accept="image/*" multiple></label>
        </div>
        <div class="photo-grid">${state.photos.map((ph,i)=>`<div class="photo"><img src="${ph.url}" alt="Evidence photo ${i+1}"><span>${i+1}</span></div>`).join('')}</div>
      </div>
      <div class="helper"><strong>Next:</strong> open <strong>Skills</strong>, <strong>Knowledge</strong> and <strong>Behaviours</strong> and tick what this whole photo story actually demonstrates. Existing bars stay visible so you can see where you already have evidence.</div>`;
    ['cameraInput','galleryInput'].forEach(id=>document.getElementById(id)?.addEventListener('change',e=>addPhotos(e.target.files)));
  }

  function addPhotos(files){
    [...files].forEach(file=>state.photos.push({name:file.name,url:URL.createObjectURL(file)}));
    renderPack();
  }

  function linkedItems(type){
    const p=pack(),c=course();
    const isGap=p.links.length===0 && /gap|additional/i.test(p.title);
    if(type==='behaviours'){
      const ids=isGap?Object.keys(c.behaviours):p.behaviours;
      return ids.map(id=>({id,wording:c.behaviours[id],labels:['Behaviour demonstrated'],linked:[]}));
    }
    const dict=type==='skills'?c.skills:c.knowledge;
    if(isGap){
      return Object.keys(dict).sort((a,b)=>count(a)-count(b)||Number(a.slice(1))-Number(b.slice(1))).map(id=>({id,wording:dict[id],labels:['Additional / gap evidence'],linked:[]}));
    }
    const ids=uniq(p.links.flatMap(l=>type==='skills'?l.s:l.k));
    return ids.filter(id=>dict[id]).map(id=>{
      const matches=p.links.filter(l=>(type==='skills'?l.s:l.k).includes(id));
      const linked=uniq(matches.flatMap(l=>type==='skills'?l.k:l.s));
      return {id,wording:dict[id],labels:uniq(matches.map(l=>l.label)),linked};
    });
  }

  function friendlyLabel(item,type){
    if(item.labels?.length && item.labels[0]) return item.labels.join(' / ');
    if(type==='behaviours') return item.wording;
    return item.id;
  }

  function renderKSB(host,type){
    const items=linkedItems(type);
    const title=type==='skills'?'What does your evidence show?':type==='knowledge'?'What knowledge did you use?':'What behaviours did you demonstrate?';
    const intro=type==='skills'
      ?'Tick anything genuinely visible across the whole job. The bars show how many previous packs have also included that evidence area.'
      :type==='knowledge'
        ?'Tick the knowledge that genuinely relates to today’s work. Knowledge is shown beside the Skills it supports.'
        :'Only tick behaviours that were genuinely demonstrated during this work.';
    host.innerHTML=`<div class="helper"><strong>${title}</strong><br>${intro}</div><div class="ksb-list">${items.length?items.map(item=>rowHTML(item,type)).join(''):'<div class="empty">No mapped items in this section.</div>'}</div>`;
    document.querySelectorAll('.ksb-check').forEach(cb=>cb.addEventListener('change',()=>{
      if(cb.checked)state.selected.add(cb.dataset.key);else state.selected.delete(cb.dataset.key);
      renderPack();
    }));
    document.querySelectorAll('textarea[data-answer]').forEach(t=>t.addEventListener('input',()=>state.answers[t.dataset.answer]=t.value));
  }

  function rowHTML(item,type){
    const key=`${type}:${item.id}`;
    const checked=state.selected.has(key);
    const linkedText=item.linked?.length?`${type==='skills'?'Linked knowledge':'Linked skills'}: ${item.linked.join(', ')}`:'';
    const q=type==='knowledge'?`<div class="question"><label>Optional explanation</label><textarea data-answer="${item.id}" placeholder="Explain how this applied to the work you did today…">${esc(state.answers[item.id]||'')}</textarea></div>`:'';
    return `<article class="ksb-row"><div class="ksb-top"><input class="ksb-check" data-key="${key}" type="checkbox" ${checked?'checked':''}><div class="ksb-main"><div class="ksb-label"><span class="ksb-id">${item.id}</span>${esc(friendlyLabel(item,type))}</div>${linkedText?`<div class="ksb-sub">${esc(linkedText)}</div>`:''}</div>${strengthHTML(item.id)}</div><div class="official">${esc(item.wording)}</div>${q}</article>`;
  }

  function savePack(){
    if(!db.counts[state.course])db.counts[state.course]={};
    const ids=uniq([...state.selected].map(k=>k.split(':')[1]));
    ids.forEach(id=>db.counts[state.course][id]=(db.counts[state.course][id]||0)+1);
    db.submissions.push({course:state.course,pack:pack().title,date:new Date().toISOString(),photos:state.photos.length,criteria:ids,answers:state.answers});
    saveDb();
    state.selected=new Set();
    showNotice(ids.length?`Saved · ${ids.length} evidence areas updated`:'Pack saved');
    renderPack();
  }

  function showNotice(text){
    document.querySelector('.notice')?.remove();
    const n=document.createElement('div');n.className='notice';n.textContent=text;document.body.appendChild(n);setTimeout(()=>n.remove(),2400);
  }

  function bindCommon(){
    document.querySelectorAll('[data-course]').forEach(b=>b.addEventListener('click',()=>{state.course=b.dataset.course;state.view='home';state.area=null;render();}));
    document.querySelectorAll('[data-area]').forEach(b=>b.addEventListener('click',()=>{state.area=b.dataset.area;state.view='area';render();}));
  }

  backBtn.addEventListener('click',()=>{
    if(state.view==='pack'){state.view='area';state.pack=null;state.photos=[];state.selected=new Set();}
    else if(state.view==='area'){state.view='home';state.area=null;}
    render();
  });

  resetBtn.addEventListener('click',()=>{
    db={counts:structuredClone(seed),submissions:[]};saveDb();state.view='home';state.area=null;state.pack=null;state.photos=[];state.selected=new Set();render();showNotice('Demo reset');
  });

  function render(){
    updateBack();
    if(state.view==='home')renderHome();
    else if(state.view==='area')renderArea();
    else renderPack();
  }

  render();
})();
