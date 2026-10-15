# Tools gate: what is built and what is left to switch on

Draft branch `leaner-site-draft-2026-10-15`. Nothing here is live until Katoya Palmer merges it.

## Built on this branch

- `tools-signup.html`: the public "Get the free tools" page. It explains that the tools come with
  Out the Box and links to the existing Brevo (sibforms) newsletter form, with
  `utm_campaign=tools_gate`. Double opt-in is set in Brevo, not on the site.
- `tools/index-subscribers.html`: the subscriber tools library. It lists all eight tools plus the
  playbook and COI quick start. It has `<meta name="robots" content="noindex, nofollow">` and is
  not in `sitemap.xml`. Nothing on the public site links to it.
- Every generic "free tools" link (nav "Tools", footers, homepage teaser, /public-sector
  "See all eight diagnostics", the 404 page, the CCC Diagnostic) now points to `tools-signup.html`.
- Each tool's results area ends with "Book a 30-minute call to review your results", linked to the
  discovery call with `utm_content=tool_<name>` (the small header button uses `tool_<name>_header`).
- The tools still work without a signup. Nothing has been disabled.

## Left to switch on (Katoya decides when)

1. **Brevo welcome email.** In Brevo, edit the Out the Box double opt-in confirmation and welcome
   emails so they link to `https://www.toyboxconsulting.net/tools/index-subscribers.html`. Optionally
   add a hidden "source = tools_gate" attribute or tag on the form so tool signups can be counted.
2. **Remove public links to individual tool pages.** These pages still link straight to tools and
   would need to point to `tools-signup.html` instead:
   - `resources.html` and `tools.html` (full public catalogs; either redirect both to
     `tools-signup.html` or unlink them)
   - `services.html` (tool cards and inline "How to start" links)
   - `start.html` ("Start with a free check" cards)
   - `public-sector.html` (four tool cards)
   - `coi-quick-start.html` (inline link to the conflict of interest self-check)
   - `blog/year-end-operations-tune-up.html` (inline links; blog posts were left as written)
   - `sitemap.xml` still lists `tools.html`, `resources.html` and the eight `tools/*` pages; remove
     them when the gate goes live so search engines stop sending people around the signup.
   - Add `<meta name="robots" content="noindex">` to each `tools/*.html` page at the same time.
3. **Move the playbook PDF behind the gate.** `playbook/build-with-claude.html` links straight to
   `/assets/playbook/how-i-built-my-site-with-claude.pdf` (a download button and a script). Move the
   PDF link into the welcome email or the subscriber library, and change the playbook page's
   button to `tools-signup.html`. The file itself can stay where it is until then.
4. **Results-email Worker.** Confirm whether `toybox-tools-mail.katoya.workers.dev` adds people who
   tick the consent box to the Out the Box list in Brevo. If not, connect it so tool users who opt in
   land on the same list.
5. **CCC Diagnostic** still says "No email required to see results". Update that line when the gate
   goes live.
