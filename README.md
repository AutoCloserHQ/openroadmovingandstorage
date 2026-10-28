# Open Road Moving & Storage

Responsive, buildless marketing website for `openroadmovingandstorage.com`, hosted on GitHub Pages. Forest-green / ivory / burnt-orange brand and approved curved-road logo.

## Update contact details

Edit `site-config.json`, then run `python3 scripts/build.py`. This updates both forms, call links, contact text, disclosures and structured data. The public call labels intentionally do not display the digits. `tel:` links are inspectable in source.

## Publishing

GitHub Pages source: `main`, repository root. Custom domain: `openroadmovingandstorage.com` (also stored in `CNAME`). Enable HTTPS after GitHub provisions the certificate. No build dependencies or Jekyll processing.

GoDaddy apex A records: 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153. `www` CNAME: `autocloserhq.github.io`. Keep mail/MX/TXT records intact.

## Quote delivery

Both intake forms use the existing public Web3Forms access key from the owner's Texas sites. The notification recipient is controlled by that key; changing the visible contact email does not change its recipient. Do not change the shared key's recipient globally, since other sites also use it. To deliver directly to the new Open Road Gmail inbox, obtain a separate key for that inbox and update `web3forms_access_key` in `site-config.json`.

Visible contact email: openroadmovingandstorage@gmail.com. AJAX submission preserves all fields, waits for HTTP success and `success: true`, prevents duplicates, times out after 30 seconds, and restores the form on errors. No-JavaScript fallback posts multipart data to Web3Forms with the thank-you redirect. The customer's email is used for replies; the Open Road notification subject/from-name distinguish the brand. No real external inquiry was sent during QA, so inbox receipt is not verified.

No CRM integration or analytics is configured. No advertising trackers or browser persistence of contact information.

## Pages

Homepage; long-distance moving; packing/storage; service areas plus Texas/Midwest/Northeast; how it works; estimates; about; FAQs; quote/contact; privacy; website terms; thank-you; 404.

Coverage language uses owner-supplied Texas, Midwest (Illinois/Wisconsin) and Northeast regions. Exact city/date coverage is confirmed individually. No invented reviews, ratings, certifications, company history or fleet claims.

## Company details

Owner-supplied legal company: TX Moving and Storage LLC; USDOT 3266915; MC 1030727. Address omitted as requested. DBA filing, current authority/operating role, required advertising disclosures and final coverage should be confirmed by the business before paid promotion. Website is not independent verification of licensing.

## Checks

`python3 scripts/check.py` checks generated metadata, internal assets and links, registration text and field labels.

`node scripts/test-form.cjs` requires the optional development dependency (`npm install` first). It exercises validation, forward/back navigation, complete form payload and menu behavior without external delivery.

`python3 -m http.server 8787` serves a local preview.

## Assets

Approved logo/icon were supplied in the owner's prior conversation. Road and packed-home photographs generated using the built-in image generation tool for this website. Full briefs are in `ASSET-NOTES.md`. These are illustrative brand photographs, not documentation of company vehicles, facilities or customers.

All rights reserved. No open-source license is granted by publication of this repository.
