(function(){
  const raw=window.NVQPLUS_COURSE_DATA;
  if(!raw)return;
  const parseSubItems=wording=>{
    const lines=String(wording||'').split(/\n+/).map(s=>s.trim()).filter(Boolean);
    const items=[];
    for(const line of lines.slice(1)){
      const m=line.match(/^([a-z]{1,2})\s+(.+)$/i);
      if(m)items.push({label:m[1].toLowerCase(),text:m[2].trim()});
    }
    return items;
  };
  const units=raw.units.map(unit=>({
    ...unit,
    learningOutcomes:unit.learningOutcomes.map(lo=>({
      ...lo,
      criteria:lo.criteria.map(c=>({
        ...c,
        subItems:(Array.isArray(c.subItems)&&c.subItems.length?c.subItems:parseSubItems(c.wording)).map(x=>({...x})),
        fullId:`${unit.id}.${c.id}`
      }))
    }))
  }));
  const findCriterion=(unitId,criterionId)=>{
    const unit=units.find(u=>String(u.id)===String(unitId));
    if(!unit)return null;
    for(const lo of unit.learningOutcomes||[]){
      const criterion=(lo.criteria||[]).find(c=>String(c.id)===String(criterionId));
      if(criterion)return criterion;
    }
    return null;
  };
  const selectionRules={};
  for(const [unitId,rule] of Object.entries(raw.specialRules||{})){
    const criterion=findCriterion(unitId,rule.criterion);
    if(!criterion)continue;
    selectionRules[criterion.fullId]={
      unitId:String(unitId),
      criterionId:String(rule.criterion),
      parentTarget:criterion.fullId,
      required:Number(rule.minimumSubItems||0),
      label:rule.label||'',
      fixedRequired:!!rule.fixedRequired,
      fixedRequirementText:rule.fixedRequirementText||'',
      wording:criterion.wording,
      options:(criterion.subItems||[]).map(item=>({
        id:`${criterion.fullId}${item.label}`,
        label:item.label,
        text:item.text
      }))
    };
  }
  const criteriaCount=units.reduce((sum,u)=>sum+u.learningOutcomes.reduce((s,lo)=>s+lo.criteria.length,0),0);
  const subItemCount=units.reduce((sum,u)=>sum+u.learningOutcomes.reduce((s,lo)=>s+lo.criteria.reduce((n,c)=>n+c.subItems.length,0),0),0);
  window.NAXOS_6570_05={
    course:{...raw.course},
    specialRules:{...raw.specialRules},
    selectionRules,
    units,
    counts:{units:units.length,criteria:criteriaCount,subItems:subItemCount},
    rules:{
      learnerFacingUnitPacks:true,
      holisticMapping:true,
      candidateMappingsAreNotAutomaticAwards:true,
      preserveOfficialWording:true,
      trackLetteredSubItemsIndividually:true,
      enforceMinimumSelectionRules:true,
      gapsOnlyShowUnmetRequirements:true
    }
  };
})();
