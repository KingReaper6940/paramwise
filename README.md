# Paramwise

Cleaner links. Every change, visible.

Paramwise cleans batches of HTTP(S) links in your browser, shows exactly what changed, and exports the results. No account, dependencies, analytics, link fetching, or persistence.

## Features

- Remove UTM parameters and known advertising click identifiers.
- Keep unknown query parameters, their raw encoding, order, and URL fragments.
- Leave links with detected signature or authentication fields unchanged.
- Review each link, including errors and duplicate exclusions.
- Copy cleaned links or download TXT and a CSV audit report.
- Optional exact-string deduplication; up to 500 links and 100 KiB per batch.
- Keyboard-accessible controls, status announcements, and responsive layout.

## Use it

Paste one absolute HTTP(S) URL per line and choose **Clean links**. Inspect the changes before copying or exporting. **Try example** demonstrates removal, preserved business parameters, a protected link, a duplicate, and invalid input.

Example:

~~~text
https://example.com/article?utm_source=email&ref=reading#intro
→ https://example.com/article?ref=reading#intro
~~~

The sample in [examples/links.txt](examples/links.txt) exports three links with deduplication enabled, removes two parameters, and keeps one protected link.

## Run locally

Requires Node.js 20 or newer. No package installation needed.

~~~sh
npm test
npm run build
npm run dev
~~~

Open http://127.0.0.1:4175. Static files are built into dist/. Vercel uses the supplied configuration.

## Cleaning rules

Removed names are case-insensitive: all utm_* names, plus gclid, dclid, fbclid, msclkid, igshid, mc_cid, mc_eid, _ga, _gl, ymclid, yclid, ttclid, twclid, li_fat_id, and srsltid. Names are decoded for matching; retained values are never reserialized.

Protected names: signature, sig, token, access_token, auth, expires, policy, key-pair-id, and x-amz-* / x-goog-* prefixes. Detection preserves the entire original link. Blank lines are ignored; credentials, embedded whitespace, backslashes, relative links, and non-HTTP(S) schemes are rejected.

## Limitations

This is a small explicit rule set, not comprehensive tracking protection or anonymity. Signature detection is conservative but not exhaustive. Some destinations depend on parameters classified as tracking: verify important links before sharing. It does not follow redirects, inspect paths, decode nested destination links, or check that destinations work. Exports include protected links, which may carry access credentials; review them before sharing. URLs are not stored by the app, but your browser and downloaded files remain under your control.
