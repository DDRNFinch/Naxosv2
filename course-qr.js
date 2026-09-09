/* Naxosv2 → Evia course installer QR codes. */
(function(){
  'use strict';
  var SCHEMA='naxos-course-install-v1';

  function coursePayload(course){
    var payload={type:'naxos-course',schema:SCHEMA,courseId:course.id,name:course.title,version:course.version||null,sourceUrl:new URL('./',window.location.href).href,courseUrl:new URL('./?course='+encodeURIComponent(course.id),window.location.href).href};
    if(course.standardId)payload.standardId=course.standardId;
    if(course.pathway)payload.pathway=course.pathway;
    if(course.courseType)payload.courseType=course.courseType;
    return JSON.stringify(payload);
  }

  function addStyles(){
    if(document.getElementById('naxosQrStyles'))return;
    var style=document.createElement('style');style.id='naxosQrStyles';
    style.textContent='.naxos-qr{margin:14px 0 4px;background:var(--card);border:1px solid var(--line);border-radius:18px;padding:14px;display:grid;grid-template-columns:132px 1fr;gap:14px;align-items:center}.naxos-qr-code{width:132px;height:132px;background:#fff;border-radius:10px;display:grid;place-items:center;overflow:hidden}.naxos-qr-code img,.naxos-qr-code canvas{max-width:100%;max-height:100%}.naxos-qr-copy strong{display:block;font-size:15px;margin-bottom:5px}.naxos-qr-copy span{display:block;color:var(--muted);font-size:12px;line-height:1.45}.naxos-qr-copy .qr-course-id{margin-top:8px;font-weight:900;color:var(--ink)}@media(max-width:390px){.naxos-qr{grid-template-columns:1fr}.naxos-qr-code{margin:auto}}';
    document.head.appendChild(style);
  }

  function renderQr(course){
    if(!course||typeof QRCode!=='function')return;
    var header=document.getElementById('courseHeader');if(!header)return;
    var old=header.querySelector('.naxos-qr');if(old)old.remove();
    addStyles();
    var wrap=document.createElement('div');wrap.className='naxos-qr';
    wrap.innerHTML='<div class="naxos-qr-code"></div><div class="naxos-qr-copy"><strong>Install this course in Evia</strong><span>Open Evia, choose QR Code, then scan this code. Evia will add this Naxos course to the learner\'s course list.</span><span class="qr-course-id">'+escapeHtml(course.id)+'</span></div>';
    header.appendChild(wrap);
    new QRCode(wrap.querySelector('.naxos-qr-code'),{text:coursePayload(course),width:132,height:132,colorDark:'#000000',colorLight:'#ffffff',correctLevel:QRCode.CorrectLevel.M});
  }

  function escapeHtml(value){return String(value==null?'':value).replace(/[&<>\"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]})}

  /* Use the real course-card click. Do not replace app.js globals. */
  document.addEventListener('click',function(event){
    var button=event.target.closest?event.target.closest('[data-course]'):null;
    if(!button)return;
    var id=button.getAttribute('data-course');
    var course=window.metadata&&window.metadata.courses?window.metadata.courses[id]:null;
    if(course)setTimeout(function(){renderQr(course)},50);
  });
})();
