#!/usr/bin/env python3
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit
import json,re
ROOT=Path(__file__).resolve().parents[1]
class Page(HTMLParser):
 def __init__(self):super().__init__();self.tags=[];self.ids=[];self.labels=[];self.inputs=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs); self.tags.append((tag,a))
  if 'id' in a:self.ids.append(a['id'])
  if tag=='label' and 'for' in a:self.labels.append(a['for'])
  if tag in ['input','select','textarea'] and a.get('type') not in ['hidden'] and a.get('name')!='_honey':self.inputs.append(a)
errors=[];checks=0
for file in ROOT.rglob('*.html'):
 p=Page();text=file.read_text();p.feed(text)
 def check(ok,msg):
  global checks
  checks+=1
  if not ok:errors.append(str(file.relative_to(ROOT))+': '+msg)
 check(len(p.ids)==len(set(p.ids)),'duplicate ids')
 check(len([1 for tag,a in p.tags if tag=='h1'])==1,'one h1')
 check('<title>' in text and 'name="description"' in text and 'rel="canonical"' in text,'SEO metadata')
 check('469) 895' not in re.sub('<[^>]+>','',text),'phone digits visually hidden')
 check('3266915' in text and '1030727' in text,'company registration')
 for a in p.inputs:check(a.get('id') in p.labels,'unlabelled '+str(a))
 for tag,a in p.tags:
  if tag=='img':check('alt' in a,'image alternative')
  for attr in ['src','href']:
   url=a.get(attr,'')
   if url.startswith('/') and not url.startswith('//'):
    path=urlsplit(url).path
    target=ROOT/path.lstrip('/')
    if path.endswith('/'):target=target/'index.html'
    check(target.exists(),'missing local '+url)
   if url.startswith('tel:'):check(url=='tel:+14698959299','wrong call destination')
 for raw in re.findall(r'<script type="application/ld\+json">(.*?)</script>',text):
  json.loads(raw);checks+=1
 check('placeholder legal' not in text.lower(),'placeholder')
print(json.dumps({'checks':checks,'errors':errors},indent=2))
raise SystemExit(bool(errors))
