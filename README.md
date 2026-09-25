# Ligo Lab — Exploration 03

The feed in practice: interactive units rendered inside the real Ligo feed UI,
on one week of real Georgetown posts from September 2026.

Thirteen posts, three treated as interactive units, ten left alone. Two
controls move the cards through open → locked → resolved, and a before/after
toggle shows the difference between one generic action bar on every post and
one button per post matched to what the post actually asks.

Captions and the Philodemic vote tallies are real. Campus splits, the streak
and future results are illustrative and labelled as such on the cards.

Extracted from the `ligo-home-mockup` repo. Eight source files plus the fonts
and images they need — no other prototypes, no password gate, no API routes.

```bash
npm install
npm run dev
```

Images in `public/ig/` were pulled from Instagram Business Discovery. The
signed URLs that API returns expire within days, so the bytes are committed
rather than the links.
