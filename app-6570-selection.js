const naxosRangeSelections=new Map();
const naxosFixedSelections=new Set();

function naxosSelectionRuleForUnit(unitId){
  return Object.values(nvqData()?.selectionRules||{}).find(rule=>String(rule.unitId)===String(unitId))||null;
}
function naxosSelectedSet(rule){
  if(!rule)return new Set();
  if(!naxosRangeSelections.has(rule.parentTarget))naxosRangeSelections.set(rule.parentTarget,new Set());
  return naxosRangeSelections.get(rule.parentTarget);
}
function naxosSelectionHtml(rule){
  if(!rule)return'';
  const selected=naxosSelectedSet(rule);
  return `<div class="capture-guide">
    <strong>What did the learner actually do?</strong>
    <p>${escapeHtml(rule.label)} · ${selected.size} / ${rule.required} selected</p>
    ${rule.fixedRequired?`<div class="choice-pills"><button data-naxos-fixed="${escapeHtml(rule.parentTarget)}" class="${naxosFixedSelections.has(rule.parentTarget)?'active':''}">Required: ${escapeHtml(rule.fixedRequirementText)}</button></div>`:''}
    <div class="choice-pills">${(rule.options||[]).map(option=>`<button data-naxos-range="${escapeHtml(option.id)}" data-rule="${escapeHtml(rule.parentTarget)}" class="${selected.has(option.id)?'active':''}"><strong>${escapeHtml(option.label)}</strong> ${escapeHtml(option.text)}</button>`).join('')}</div>
  </div>`;
}
function naxosBindSelection(rule,unit,guide){
  if(!rule)return;
  $$('[data-naxos-range]').forEach(button=>button.onclick=()=>{
    const set=naxosSelectedSet(rule),id=button.dataset.naxosRange;
    set.has(id)?set.delete(id):set.add(id);
    renderNvqPackBody(unit,guide,nvqData().specialRules?.[unit.id]);
  });
  $$('[data-naxos-fixed]').forEach(button=>button.onclick=()=>{
    const id=button.dataset.naxosFixed;
    naxosFixedSelections.has(id)?naxosFixedSelections.delete(id):naxosFixedSelections.add(id);
    renderNvqPackBody(unit,guide,nvqData().specialRules?.[unit.id]);
  });
}
function naxosSelectedRangeLines(rule){
  if(!rule)return[];
  const selected=naxosSelectedSet(rule);
  const lines=[];
  if(rule.fixedRequired&&naxosFixedSelections.has(rule.parentTarget))lines.push(rule.fixedRequirementText);
  for(const option of rule.options||[])if(selected.has(option.id))lines.push(`${option.id} — ${option.text}`);
  return lines;
}
function naxosGapHtml(rule){
  if(!rule)return'';
  const selected=naxosSelectedSet(rule);
  const missing=(rule.options||[]).filter(option=>!selected.has(option.id));
  const fixedMissing=rule.fixedRequired&&!naxosFixedSelections.has(rule.parentTarget);
  const remaining=Math.max(0,Number(rule.required||0)-selected.size);
  return `<div class="capture-guide">
    <strong>${escapeHtml(rule.parentTarget)} selection status</strong>
    <p>${selected.size} selected · ${remaining} more required${fixedMissing?' · required base activity still missing':''}</p>
    ${remaining||fixedMissing?`<div class="subitem-pills">${fixedMissing?`<span>Required: ${escapeHtml(rule.fixedRequirementText)}</span>`:''}${missing.map(option=>`<span>${escapeHtml(option.id)} · ${escapeHtml(option.text)}</span>`).join('')}</div>`:'<p>Minimum selection requirement met.</p>'}
  </div>`;
}

renderNvqPackBody=function(unit,guide,legacyRule){
  const body=$('#nvqPackBody');
  const rule=naxosSelectionRuleForUnit(unit.id);
  if(selectedNvqPackTab==='evidence'){
    const pills=nvqConfig.commonWhatElsePills||[];
    body.innerHTML=`<div class="nvq-note"><strong>Photo dump</strong><span>Take photos naturally throughout the job. Tell the story from start to finish. You do not need one photo for every AC.</span></div>
      <div class="capture-guide"><strong>What to capture</strong><p>Try to capture ${escapeHtml(naturalList(guide.capture||[]))}.</p></div>
      ${naxosSelectionHtml(rule)}
      <div class="evidence-layout"><div class="camera-placeholder">Evia camera / evidence area<br><small>Naxos stores the mapping contract; Evia will perform the capture.</small></div><div class="thumb-row"><span>Photo 1</span><span>Photo 2</span><span>Photo 3</span><span>＋</span></div></div>
      <h3 class="mini-heading">What else is shown?</h3>
      <div class="choice-pills">${pills.map((p,i)=>{const targets=nvqConfig.holisticPillMappings?.[p]||[];return`<button data-extra-pill="${i}" class="${selectedExtraPills.has(i)?'active':''}">${escapeHtml(p)}${targets.length?` · ${targets.length}`:''}</button>`}).join('')}</div>
      <button class="primary-action" id="previewMapping">Preview mapping</button>`;
    naxosBindSelection(rule,unit,guide);
    $$('[data-extra-pill]').forEach(b=>b.onclick=()=>{const i=Number(b.dataset.extraPill);selectedExtraPills.has(i)?selectedExtraPills.delete(i):selectedExtraPills.add(i);b.classList.toggle('active',selectedExtraPills.has(i))});
    $('#previewMapping').onclick=()=>{selectedNvqPackTab='mapping';renderNvqPackDetail($('#courseContent'))};
  }else if(selectedNvqPackTab==='mapping'){
    const chosen=naxosSelectedRangeLines(rule);
    const selectedLabels=[...selectedExtraPills].map(i=>(nvqConfig.commonWhatElsePills||[])[i]).filter(Boolean);
    body.innerHTML=`<div class="nvq-note"><strong>Behind the scenes</strong><span>The learner does not repeat evidence for every line. Naxos tracks the official requirements and only the selected minimum-option areas.</span></div>
      ${rule?`<section class="cross-map"><h3>Official selection rule</h3><p>${escapeHtml(rule.label)}${rule.fixedRequired?` · ${escapeHtml(rule.fixedRequirementText)}`:''}</p>${chosen.length?chosen.map(text=>`<div><strong>Selected</strong><span>${escapeHtml(text)}</span></div>`).join(''):'<div><strong>Nothing selected yet</strong><span>The range AC is not complete.</span></div>'}</section>`:''}
      ${unit.learningOutcomes.map(lo=>`<section class="lo-block"><h3>Learning outcome ${escapeHtml(lo.id)}</h3><p>${escapeHtml(lo.wording)}</p>${lo.criteria.map(c=>renderCriterion(unit,c)).join('')}</section>`).join('')}
      <section class="cross-map"><h3>Holistic cross-unit candidate mappings</h3><p>Candidate mappings only — they are never automatic awards.</p>
        ${selectedLabels.length?selectedLabels.map(label=>`<div><strong>${escapeHtml(label)}</strong><span>${escapeHtml((nvqConfig.holisticPillMappings?.[label]||[]).join(', ')||'No automatic target')}</span></div>`).join(''):'<div><strong>Select “What else is shown?” pills</strong><span>Naxos will show the exact candidate AC references here.</span></div>'}
      </section>`;
  }else{
    const criteria=unit.learningOutcomes.flatMap(lo=>lo.criteria),subTotal=criteria.reduce((n,c)=>n+(c.subItems?.length||0),0);
    body.innerHTML=`<div class="nvq-note"><strong>Top-up only what is missing</strong><span>Once evidence is assessed, requirements already met disappear from the learner's top-up list.</span></div>
      <div class="gap-summary"><div><strong>${criteria.length}</strong><span>assessment criteria tracked</span></div><div><strong>${subTotal}</strong><span>lettered sub-elements tracked individually</span></div></div>
      ${naxosGapHtml(rule)}
      <div class="capture-guide"><strong>Gap behaviour</strong><p>A partially covered criterion stays partial. Minimum-option rules only complete when the required number of different official areas has been selected.</p></div>`;
  }
};
