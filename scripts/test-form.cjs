const fs=require('fs');const path=require('path');const assert=require('node:assert/strict');
const {JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'..');let checks=0;
for(const relative of ['index.html','get-a-quote/index.html']){
 const html=fs.readFileSync(path.join(root,relative),'utf8');const dom=new JSDOM(html,{url:'https://openroadmovingandstorage.com/'+relative,runScripts:'outside-only'});const w=dom.window;w.eval(fs.readFileSync(path.join(root,'assets/site.js'),'utf8'));const d=w.document,f=d.querySelector('.quote-form'),steps=[...f.querySelectorAll('fieldset')];
 const check=(a,b)=>{assert.equal(a,b);checks++};
 check(steps[0].hidden,false);check(steps[1].disabled,true);f.querySelector('[data-next]').click();check(steps[0].hidden,false);
 const set=(name,value)=>f.elements.namedItem(name).value=value;
 set('pickup_zip','75201');set('delivery_zip','60601');set('move_date','2026-11-20');set('home_size','2 bedrooms');
 check(f.elements.namedItem('pickup_zip').validity.patternMismatch,false);set('pickup_zip','abcde');check(f.elements.namedItem('pickup_zip').validity.patternMismatch,true);set('pickup_zip','75201');
 f.querySelector('[data-next]').click();check(steps[1].hidden,false);check(steps[0].disabled,true);set('services','Moving + packing');f.querySelector('[data-next]').click();check(steps[2].hidden,false);check(f.querySelector('[data-submit]').hidden,false);
 f.querySelector('[data-back]').click();check(steps[1].hidden,false);check(f.elements.namedItem('services').value,'Moving + packing');f.querySelector('[data-next]').click();
 set('name','Local QA only');set('phone','4698959299');set('email','qa@example.invalid');f.elements.namedItem('contact_permission').checked=true;
 const event=new w.Event('submit',{bubbles:true,cancelable:true});f.dispatchEvent(event);check(event.defaultPrevented,false);
 const data=new w.FormData(f);for(const name of ['pickup_zip','delivery_zip','move_date','home_size','services','name','phone','email','contact_permission']){assert.ok(data.get(name));checks++}
 check(f.action,'https://formsubmit.co/txmovingandstoragellc@gmail.com');check(d.querySelector('.form-status').hidden,false);
 const toggle=d.querySelector('.menu-toggle');toggle.click();check(toggle.getAttribute('aria-expanded'),'true');d.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape'}));check(toggle.getAttribute('aria-expanded'),'false');dom.window.close();
}
console.log(JSON.stringify({checks,passed:true,externalSubmissions:0}));
