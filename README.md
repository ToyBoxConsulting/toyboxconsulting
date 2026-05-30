# toyboxconsulting.net — ToyBox Consulting & Management

A complete, self-contained static website. No build step.

```
toyboxconsulting-site/
├── index.html          ← Home  (hero, sectors, approach, services, workshop video, about, recognition)
├── services.html       ← Services & Investment (rate card + free client tools)
├── about.html          ← About Katoya (story, timeline, credentials, boards)
├── case-study.html     ← Featured engagement ($12M crisis turnaround)
├── contact.html        ← Calendly meeting types + note form + booking disclaimer
├── events.html         ← Golden Hour Unboxed (event sub-brand)
├── CNAME               ← toyboxconsulting.net
├── tools/
│   ├── financial-controls.html      ← Financial Controls Self-Assessment
│   └── conflict-of-interest.html    ← Conflict of Interest Self-Check
└── assets/             ← logos + photos
```

## The free client tools — yes, they're live & fully functional
Both tools in `tools/` are complete, interactive apps that run entirely in the visitor's
browser — no server, no sign-up, no data leaves the device (state persists in localStorage).
They're linked from the Services page under "Free tools for clients," and also work as
standalone pages you can share directly.
- **financial-controls.html** — auto-detects WA reporting tier, federal-controls toggle, live readiness score, printable gap report.
- **conflict-of-interest.html** — gut-check of commonly missed conflicts → generates a sign-ready disclosure.

## The workshop — "Beyond Compliance Theater"
Lives on the **Home page** (`index.html`) in the "Workshop" section (anchor `#workshops`):
a full Vimeo embed of the WSNC 2026 session, plus format/audience/take-home details.
It's also listed as a service with pricing on the **Services** page. (Note: the video is a
Vimeo embed, so it requires an internet connection to play.)

## Deploy on GitHub Pages
1. Create a **public** repo (e.g. `toyboxconsulting`).
2. Commit all files above to the repo **root** (keep `tools/` and `assets/` as folders; keep `CNAME` as-is).
3. **Settings → Pages → Deploy from a branch → `main` / `/(root)` → Save.**
4. Custom domain auto-fills `toyboxconsulting.net` from CNAME. Enable **Enforce HTTPS** once DNS resolves.

## DNS (GoDaddy)
- Four **A** records, Host `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
- One **CNAME**, Host `www` → `YOURUSERNAME.github.io`

## Booking
Every "Schedule / Book" button → `https://calendly.com/toyboxcm/new-meeting-1`.

---
© 2026 ToyBox Consulting & Management, LLC
