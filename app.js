const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
let taskStructure=null,metadata=null,nvqConfig=null,selectedCourse=null,deferredInstall=null;
let selectedNvqUnit=null,selectedNvqPackTab='evidence',selectedOptionalUnit='238',selectedExtraPills=new Set();

async function loadJson(path){const r=await fetch(path,{cache:'no-store'});if(!r.ok)throw new Error(`${path}: ${r.status}`);return r.json()}
function escapeHtml(v=''){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function naturalList(items=[]){if(!items.length)return'';if(items.length===1)return items[0];if(items.length===2)return`${items[0]} and ${items[1]}`;return`${items.slice(0,-1).join(', ')}, and ${items[items.length-1]}`}
function getStructureCourse(id){return taskStructure?.courses?.find(c=>c.id===id)}
function nvqData(){return window.NAXOS_6570_05||null}
function getNvqUnit(id){return nvqData()?.units?.find(u=>u.id===id)}
function nvqUnitMeta(id){return nvqConfig?.unitMetadata?.[id]||{}}
function unitCriteriaCount(unit){return unit.learningOutcomes.reduce((n,lo)=>n+lo.criteria.length,0)}
function unitSubItemCount(unit){return unit.learningOutcomes.reduce((n,lo)=>n+lo.criteria.reduce((s,c)=>s+(c.subItems?.length||0),0),0)}

function courseCardSubtitle(m){
  if(m.courseType==='nvq')return`${m.id} · Level ${m.level} · ${m.glhMinimum}–${m.glhMaximum} GLH · ${m.tqt} TQT`;
  return`${m.id} · v${m.version} · Level ${m.level} · ${m.minimumHoursForCompliance} hours`;
}

function renderHome(){
  selectedCourse=null;selectedNvqUnit=null;
  $('#backBtn').hidden=true;$('#pageTitle').textContent='Naxosv2';
  $('#homeView').hidden=false;$('#courseView').hidden=true;
  const order=['ST0095','ST0264-SITE','ST0264-AJ','6570-05'];
  $('#courseCards').innerHTML=order.map(id=>{
    const m=metadata.courses[id];
    return`<button class="course-card" data-course="${id}"><div><h2>${escapeHtml(m.title)}</h2><p>${escapeHtml(courseCardSubtitle(m))}</p></div><div class="count">${m.learnerPackCount}</div></button>`
  }).join('');
  $$('[data-course]').forEach(b=>b.onclick=()=>openCourse(b.dataset.course));
}

function openCourse(id){
  selectedCourse=id;selectedNvqUnit=null;
  const m=metadata.courses[id];
  $('#homeView').hidden=true;$('#courseView').hidden=false;$('#backBtn').hidden=false;$('#pageTitle').textContent=m.title;
  if(m.courseType==='nvq'){
    $('#courseHeader').innerHTML=`<h1>${escapeHtml(m.qualificationTitle)}</h1><p>${escapeHtml(m.id)} · City & Guilds · ${escapeHtml(m.handbookEdition)}</p><div class="chips"><span class="chip">8 mandatory + 1 optional pack</span><span class="chip">${m.glhMinimum}–${m.glhMaximum} GLH</span><span class="chip">${m.tqt} TQT</span><span class="chip">Portfolio of evidence</span></div>`;
    const standardTab=$('[data-tab="standard"]');if(standardTab)standardTab.textContent='Qualification';
  }else{
    $('#courseHeader').innerHTML=`<h1>${escapeHtml(m.title)}</h1><p>${escapeHtml(m.pathway||m.id)} · official standard v${escapeHtml(m.version)}</p><div class="chips"><span class="chip">${m.learnerPackCount} learner packs</span><span class="chip">${m.ksbCounts.total} KSBs</span><span class="chip">${m.minimumHoursForCompliance} minimum hours</span><span class="chip">${m.typicalDurationMonths} months</span></div>`;
    const standardTab=$('[data-tab="standard"]');if(standardTab)standardTab.textContent='Standard';
  }
  setTab('packs');
}

function setTab(tab){
  $$('.tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));
  const m=metadata.courses[selectedCourse],out=$('#courseContent');
  if(m.courseType==='nvq'){
    if(tab==='packs')renderNvqPacks(out);
    else if(tab==='standard')renderNvqQualification(out,m);
    else renderNvqData(out,m);
  }else{
    const course=getStructureCourse(selectedCourse);
    if(tab==='packs'){
      out.innerHTML=`<div class="pack-list">${course.mainTasks.map((p,i)=>`<article class="pack-card"><h3>${i+1}. ${escapeHtml(p.title)}</h3><p>${escapeHtml(p.summary)}</p><div class="capture"><strong>Capture:</strong> ${escapeHtml(naturalList(p.capture))}.</div></article>`).join('')}</div>`;
    }else if(tab==='standard'){
      const cells=[['Reference',m.standardId||m.id],['Version',m.version],['Level',m.level],['Status',m.status],['Typical duration',`${m.typicalDurationMonths} months`],['EPA period',`${m.typicalAssessmentPeriodMonths} months`],['Minimum hours',m.minimumHoursForCompliance],['Maximum funding',`£${Number(m.maximumFundingGBP).toLocaleString('en-GB')}`],['LARS code',m.larsCode],['EQA provider',m.eqaProvider],['Knowledge',m.ksbCounts.knowledge],['Skills',m.ksbCounts.skills],['Behaviours',m.ksbCounts.behaviours]];
      out.innerHTML=`<div class="meta-grid">${cells.map(([a,b])=>`<div class="meta-card"><span>${escapeHtml(a)}</span><strong>${escapeHtml(b)}</strong></div>`).join('')}</div><div class="source-links"><a href="${m.sourceUrl}" target="_blank" rel="noopener">Official Skills England standard ↗</a><a href="${m.epaUrl}" target="_blank" rel="noopener">Official EPA plan ↗</a></div>`;
    }else{
      out.innerHTML=`<div class="data-box">${escapeHtml(JSON.stringify({metadata:m,packSource:'naxosv2-main-task-structure.json',learnerFacingPackCount:course.mainTasks.length,mappingRule:taskStructure.principles},null,2))}</div>`;
    }
  }
  window.scrollTo({top:0,behavior:'smooth'});
}

function renderNvqPacks(out){
  if(selectedNvqUnit){renderNvqPackDetail(out);return}
  const data=nvqData();
  if(!data){out.innerHTML='<div class="error">6570-05 source data did not load.</div>';return}
  const mandatory=data.course.mandatoryUnitIds.map(getNvqUnit).filter(Boolean);
  const optionalIds=data.course.optionalUnitIds;
  const optional=getNvqUnit(selectedOptionalUnit)||getNvqUnit(optionalIds[0]);
  out.innerHTML=`
    <div class="nvq-note"><strong>Learner-facing unit packs</strong><span>The learner completes 8 mandatory packs plus at least 1 optional pack. Naxos tracks every LO, AC and lettered sub-element behind the evidence.</span></div>
    <div class="optional-picker"><label for="optionalUnitSelect">Optional unit pack</label><select id="optionalUnitSelect">${optionalIds.map(id=>{const u=getNvqUnit(id);return`<option value="${id}" ${id===selectedOptionalUnit?'selected':''}>${id} — ${escapeHtml(u.title)}</option>`}).join('')}</select></div>
    <div class="pack-list">${[...mandatory,optional].map((u,i)=>renderNvqPackCard(u,i>=mandatory.length)).join('')}</div>`;
  $('#optionalUnitSelect').onchange=e=>{selectedOptionalUnit=e.target.value;renderNvqPacks(out)};
  $$('[data-nvq-unit]').forEach(b=>b.onclick=()=>{selectedNvqUnit=b.dataset.nvqUnit;selectedNvqPackTab='evidence';selectedExtraPills=new Set();renderNvqPacks(out);window.scrollTo({top:0,behavior:'smooth'})});
}

function renderNvqPackCard(unit,isOptional){
  const meta=nvqUnitMeta(unit.id),criteria=unitCriteriaCount(unit),subs=unitSubItemCount(unit);
  return`<button class="pack-card nvq-pack-button" data-nvq-unit="${unit.id}"><div class="nvq-pack-top"><span class="unit-number">${unit.id}</span><span class="pack-type">${isOptional?'Optional':'Mandatory'}</span></div><h3>${escapeHtml(unit.title)}</h3><p>Level ${unit.level} · ${unit.glh} GLH · ${unit.tqt} TQT · UAN ${escapeHtml(meta.uan||'')}</p><div class="pack-stats"><span>${criteria} ACs</span><span>${subs} lettered sub-elements</span></div></button>`;
}

function renderNvqPackDetail(out){
  const unit=getNvqUnit(selectedNvqUnit),meta=nvqUnitMeta(unit.id),guide=nvqConfig.packGuidance[unit.id]||{},rule=nvqData().specialRules?.[unit.id];
  out.innerHTML=`
    <button class="inline-back" id="allPacksBtn">← All packs</button>
    <div class="nvq-pack-header"><span class="unit-number">${unit.id}</span><div><h2>${escapeHtml(unit.title)}</h2><p>${meta.mandatory?'Mandatory':'Optional'} · Level ${unit.level} · ${unit.glh} GLH · ${unit.tqt} TQT · UAN ${escapeHtml(meta.uan||'')}</p></div></div>
    ${rule?`<div class="special-rule"><strong>Official selection rule</strong><span>${escapeHtml(rule.label)}</span></div>`:''}
    <div class="pack-subtabs"><button data-packtab="evidence" class="${selectedNvqPackTab==='evidence'?'active':''}">Evidence pack</button><button data-packtab="mapping" class="${selectedNvqPackTab==='mapping'?'active':''}">Behind the scenes</button><button data-packtab="gaps" class="${selectedNvqPackTab==='gaps'?'active':''}">Gaps / top-up</button></div>
    <div id="nvqPackBody"></div>`;
  $('#allPacksBtn').onclick=()=>{selectedNvqUnit=null;renderNvqPacks(out)};
  $$('[data-packtab]').forEach(b=>b.onclick=()=>{selectedNvqPackTab=b.dataset.packtab;renderNvqPackDetail(out)});
  renderNvqPackBody(unit,guide,rule);
}

function renderNvqPackBody(unit,guide,rule){
  const body=$('#nvqPackBody');
  if(selectedNvqPackTab==='evidence'){
    const pills=nvqConfig.commonWhatElsePills||[];
    body.innerHTML=`<div class="nvq-note"><strong>Photo dump</strong><span>Take photos naturally throughout the job. Tell the story from start to finish. You do not need one photo for every AC.</span></div><div class="capture-guide"><strong>What to capture</strong><p>Try to capture ${escapeHtml(naturalList(guide.capture||[]))}.</p></div><div class="evidence-layout"><div class="camera-placeholder">Evia camera / evidence area<br><small>Naxos stores the mapping contract; Evia will perform the capture.</small></div><div class="thumb-row"><span>Photo 1</span><span>Photo 2</span><span>Photo 3</span><span>＋</span></div></div><h3 class="mini-heading">What else is shown?</h3><div class="choice-pills">${pills.map((p,i)=>`<button data-extra-pill="${i}" class="${selectedExtraPills.has(i)?'active':''}">${escapeHtml(p)}</button>`).join('')}</div><button class="primary-action" id="previewMapping">Preview mapping</button>`;
    $$('[data-extra-pill]').forEach(b=>b.onclick=()=>{const i=Number(b.dataset.extraPill);selectedExtraPills.has(i)?selectedExtraPills.delete(i):selectedExtraPills.add(i);b.classList.toggle('active',selectedExtraPills.has(i))});
    $('#previewMapping').onclick=()=>{selectedNvqPackTab='mapping';renderNvqPackDetail($('#courseContent'))};
  }else if(selectedNvqPackTab==='mapping'){
    body.innerHTML=`<div class="nvq-note"><strong>Behind the scenes</strong><span>The learner does not repeat evidence for every line. These are the official requirements Naxos tracks against the same workplace evidence.</span></div>${unit.learningOutcomes.map(lo=>`<section class="lo-block"><h3>Learning outcome ${escapeHtml(lo.id)}</h3><p>${escapeHtml(lo.wording)}</p>${lo.criteria.map(c=>renderCriterion(unit,c)).join('')}</section>`).join('')}<section class="cross-map"><h3>Holistic cross-unit opportunities</h3><p>Candidate mappings only — they are never automatic awards.</p>${(guide.crossUnitCandidates||[]).map(id=>{const u=getNvqUnit(id);return`<div><strong>Unit ${id}</strong><span>${escapeHtml(u?.title||'')}</span></div>`}).join('')}</section>`;
  }else{
    const criteria=unit.learningOutcomes.flatMap(lo=>lo.criteria),subTotal=criteria.reduce((n,c)=>n+(c.subItems?.length||0),0);
    body.innerHTML=`<div class="nvq-note"><strong>Top-up only what is missing</strong><span>Once evidence is assessed, requirements already met disappear from the learner's top-up list.</span></div><div class="gap-summary"><div><strong>${criteria.length}</strong><span>assessment criteria tracked</span></div><div><strong>${subTotal}</strong><span>lettered sub-elements tracked individually</span></div></div>${rule?`<div class="special-rule"><strong>Selection rule retained</strong><span>${escapeHtml(rule.label)}${rule.fixedRequired?` · ${escapeHtml(rule.fixedRequirementText)}`:''}</span></div>`:''}<div class="capture-guide"><strong>Gap behaviour</strong><p>A partially covered criterion stays partial. For example, if 7.3a and 7.3c are evidenced but 7.3b is still required, Evia should ask only for the missing requirement rather than making the learner repeat the whole unit.</p></div>`;
  }
}

function renderCriterion(unit,c){
  const subs=c.subItems||[];
  return`<div class="criterion"><div class="criterion-head"><strong>AC ${escapeHtml(c.id)}</strong><span>${escapeHtml(c.evidenceClass||'')}</span></div><p>${escapeHtml(c.wording)}</p>${subs.length?`<div class="subitem-pills">${subs.map(s=>`<span>${escapeHtml(c.id+s.label)} · ${escapeHtml(s.text)}</span>`).join('')}</div>`:''}</div>`;
}

function renderNvqQualification(out,m){
  const cells=[['Qualification',m.id],['Awarding organisation',m.awardingOrganisation],['Ofqual number',m.ofqualAccreditationNumber],['Handbook',m.handbookEdition],['Level',m.level],['Assessment',m.assessment],['Grading',m.grading],['TQT',m.tqt],['GLH',`${m.glhMinimum}–${m.glhMaximum}`],['Mandatory units',m.mandatoryUnitCount],['Optional units available',m.optionalUnitCount],['Optional units required',m.minimumOptionalUnits],['Last registration',m.lastRegistrationDate],['Last certification',m.lastCertificationDate]];
  out.innerHTML=`<div class="meta-grid">${cells.map(([a,b])=>`<div class="meta-card"><span>${escapeHtml(a)}</span><strong>${escapeHtml(b)}</strong></div>`).join('')}</div><div class="source-links"><a href="${m.sourceUrl}" target="_blank" rel="noopener">Official City & Guilds qualification page ↗</a><a href="${m.handbookUrl}" target="_blank" rel="noopener">Official July 2025 qualification handbook ↗</a></div>`;
}

function renderNvqData(out,m){
  const data=nvqData();
  out.innerHTML=`<div class="data-box">${escapeHtml(JSON.stringify({metadata:m,qualificationConfig:nvqConfig,sourceCounts:data?.counts,rules:data?.rules,dataContract:{config:'data/6570-05/config.json',officialUnitSource:'data/6570-05/source/*.js',normalisedRuntime:'window.NAXOS_6570_05'}},null,2))}</div>`;
}

async function boot(){
  try{
    [taskStructure,metadata,nvqConfig]=await Promise.all([loadJson('./naxosv2-main-task-structure.json'),loadJson('./data/course-metadata.json'),loadJson('./data/6570-05/config.json')]);
    renderHome();
  }catch(err){$('#courseCards').innerHTML=`<div class="error"><strong>Naxosv2 could not load its course data.</strong><br>${escapeHtml(err.message)}</div>`}
  if('serviceWorker'in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}))}
}

$('#backBtn').onclick=()=>selectedCourse?renderHome():renderHome();
$$('.tab').forEach(b=>b.onclick=()=>setTab(b.dataset.tab));
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstall=e;$('#installBtn').hidden=false});
$('#installBtn').onclick=async()=>{if(!deferredInstall)return;deferredInstall.prompt();await deferredInstall.userChoice;deferredInstall=null;$('#installBtn').hidden=true};
window.addEventListener('appinstalled',()=>{$('#installBtn').hidden=true});
boot();
