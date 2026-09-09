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
  const criteriaCount=units.reduce((sum,u)=>sum+u.learningOutcomes.reduce((s,lo)=>s+lo.criteria.length,0),0);
  const subItemCount=units.reduce((sum,u)=>sum+u.learningOutcomes.reduce((s,lo)=>s+lo.criteria.reduce((n,c)=>n+c.subItems.length,0),0),0);
  window.NAXOS_6570_05={
    course:{...raw.course},
    specialRules:{...raw.specialRules},
    units,
    counts:{units:units.length,criteria:criteriaCount,subItems:subItemCount},
    rules:{
      learnerFacingUnitPacks:true,
      holisticMapping:true,
      candidateMappingsAreNotAutomaticAwards:true,
      preserveOfficialWording:true,
      trackLetteredSubItemsIndividually:true,
      gapsOnlyShowUnmetRequirements:true
    }
  };
})();
