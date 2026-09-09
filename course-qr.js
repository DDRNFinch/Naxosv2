/* Naxosv2 → Evia course installer QR codes. */
(function(){
  'use strict';
  var SCHEMA='naxos-course-install-v1';

  function coursePayload(course){
    var payload={
      type:'naxos-course',
      schema:SCHEMA,
      courseId:course.id,
      name:course.title,
      version:course.version||null,
      sourceUrl:new URL('./',window.location.href).href,
      courseUrl:new URL('./?course='+encodeURIComponent(course.id),window.location.href).href
    };
    if(course.standardId)payload.standardId=course.standardId;
    if(course.pathway)payload.pathway=course.pathway;
    if(course.courseType)payload.courseType=course.courseType;
    return JSON.stringify(payload);
  }

  function renderQr(course){
    console.log('renderQr called for:', course.id);
    if(!course){console.warn('No course');return}
    if(typeof QRCode!=='function'){console.warn('QRCode library not loaded');return}
    
    var header=document.getElementById('courseHeader');
    if(!header){console.warn('No courseHeader element');return}
    
    var old=header.querySelector('.naxos-qr');
    if(old)old.remove();
    
    var wrap=document.createElement('div');
    wrap.className='naxos-qr';
    wrap.style.cssText='margin:14px 0 4px;background:var(--card);border:1px solid var(--line);border-radius:18px;padding:14px;display:grid;grid-template-columns:132px 1fr;gap:14px;align-items:start';
    
    var qrDiv=document.createElement('div');
    qrDiv.className='naxos-qr-code';
    qrDiv.style.cssText='width:132px;height:132px';
    
    var copyDiv=document.createElement('div');
    copyDiv.className='naxos-qr-copy';
    copyDiv.style.cssText='display:flex;flex-direction:column;gap:8px';
    copyDiv.innerHTML='<strong style="font-size:14px;color:var(--ink)">Install this course in Evia</strong><span style="font-size:12px;color:var(--muted);line-height:1.4">Open Evia, choose QR Code, then scan this code. Evia will add '+escapeHtml(course.title)+' automatically.</span>';
    
    wrap.appendChild(qrDiv);
    wrap.appendChild(copyDiv);
    header.appendChild(wrap);
    
    var payload=coursePayload(course);
    console.log('QR Payload:', payload);
    
    try{
      new QRCode(qrDiv,{
        text:payload,
        width:132,
        height:132,
        colorDark:'#000000',
        colorLight:'#ffffff',
        correctLevel:QRCode.CorrectLevel.M
      });
      console.log('QR code generated successfully');
    }catch(e){
      console.error('QR generation failed:', e);
      qrDiv.innerHTML='<p style="color:red;font-size:12px">QR failed</p>';
    }
  }

  function escapeHtml(value){
    return String(value==null?'':value).replace(/[&<>"']/g,function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]
    })
  }

  console.log('course-qr.js loaded');
  
  document.addEventListener('click',function(event){
    var button=event.target.closest?event.target.closest('[data-course]'):null;
    if(!button)return;
    var id=button.getAttribute('data-course');
    console.log('Course clicked:', id);
    var course=window.metadata&&window.metadata.courses?window.metadata.courses[id]:null;
    if(course){
      console.log('Found course metadata:', course);
      setTimeout(function(){renderQr(course)},50);
    }else{
      console.warn('Course not found in metadata:', id);
    }
  });
})();
