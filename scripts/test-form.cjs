const fs=require('fs');const path=require('path');const assert=require('node:assert/strict');
const {JSDOM}=require('jsdom');const root=path.resolve(__dirname,'..');let checks=0;
const tick=()=>new Promise(resolve=>setImmediate(resolve));
(async()=>{
for(const relative of ['index.html','get-a-quote/index.html']){
 const html=fs.readFileSync(path.join(root,relative),'utf8');const dom=new JSDOM(html,{url:'https://openroadmovingandstorage.com/'+relative,runScripts:'outside-only'});const w=dom.window;let mode='pending',pending,payload,calls=0;
 w.fetch=async(url,options)=>{calls++;assert.equal(url,'https://api.web3forms.com/submit');payload=JSON.parse(options.body);if(mode==='pending')return new Promise(resolve=>{pending=resolve});if(mode==='network')throw Error('Offline');if(mode==='invalid-json')return{ok:true,json:async()=>{throw Error('Bad JSON')}};return{ok:mode==='success'||mode==='rejected',json:async()=>({success:mode==='success'})}};
 w.eval(fs.readFileSync(path.join(root,'assets/site.js'),'utf8'));const d=w.document,f=d.querySelector('.quote-form'),steps=[...f.querySelectorAll('fieldset')];const check=(a,b)=>{assert.equal(a,b);checks++};const set=(name,value)=>f.elements.namedItem(name).value=value;
 check(steps[0].hidden,false);check(steps[1].disabled,true);f.querySelector('[data-next]').click();check(steps[0].hidden,false);
 set('pickup_zip','75201');set('delivery_zip','60601');set('move_date',new Date(Date.now()+30*86400000).toISOString().slice(0,10));set('home_size','2 bedrooms');check(f.elements.namedItem('pickup_zip').validity.patternMismatch,false);set('pickup_zip','abcde');check(f.elements.namedItem('pickup_zip').validity.patternMismatch,true);set('pickup_zip','75201');
 f.querySelector('[data-next]').click();check(steps[1].hidden,false);set('services','Moving + packing');f.querySelector('[data-next]').click();check(steps[2].hidden,false);f.querySelector('[data-back]').click();check(steps[1].hidden,false);check(f.elements.namedItem('services').value,'Moving + packing');f.querySelector('[data-next]').click();
 set('name','Local QA only');set('phone','4698959299');set('email','qa@example.invalid');f.elements.namedItem('contact_permission').checked=true;
 function submit(){const event=new w.Event('submit',{bubbles:true,cancelable:true});f.dispatchEvent(event);check(event.defaultPrevented,true)}
 submit();check(f.querySelector('[data-submit]').disabled,true);submit();check(calls,1);
 for(const name of ['pickup_zip','delivery_zip','move_date','home_size','services','name','phone','email','contact_permission','access_key','subject','from_name']){assert.ok(payload[name]);checks++}
 check(payload.from_name,'Open Road Moving & Storage');check(payload.subject,'Open Road — New moving quote request');check(payload.email,'qa@example.invalid');check(payload.access_key,'6bc5385c-1b5b-4955-bb2e-fc6da8bc924d');check('botcheck' in payload,false);check(html.includes('FormSubmit'),false);
 pending({ok:false,json:async()=>({success:false})});await tick();check(d.querySelector('.form-status').getAttribute('role'),'alert');check(f.querySelector('[data-submit]').disabled,false);check(f.elements.namedItem('email').value,'qa@example.invalid');check(f.elements.namedItem('pickup_zip').value,'75201');
 for(mode of ['network','invalid-json','rejected']){submit();await tick();check(f.dataset.submitted,undefined);check(f.querySelector('[data-submit]').disabled,false);check(d.querySelector('.form-status').getAttribute('role'),'alert')}
 mode='success';submit();await tick();check(f.dataset.submitted,'true');check(f.querySelector('[data-submit]').disabled,true);check(d.querySelector('.form-status').getAttribute('role'),'status');const before=calls;submit();check(calls,before);
 check(d.querySelector('.footer-bottom').textContent.includes('TX Moving'),false);check(d.querySelector('.footer-bottom').textContent.includes('USDOT 3266915'),true);
 const toggle=d.querySelector('.menu-toggle');toggle.click();check(toggle.getAttribute('aria-expanded'),'true');d.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape'}));check(toggle.getAttribute('aria-expanded'),'false');dom.window.close();
}
console.log(JSON.stringify({checks,passed:true,externalSubmissions:0}));
})().catch(e=>{console.error(e);process.exitCode=1});
