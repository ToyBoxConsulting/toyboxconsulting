# Tools gate: how it works and what is left to switch on

Draft branch `leaner-site-draft-2026-10-15`. Nothing here is live until Katoya Palmer merges it.

## Be clear about what "locked" means

This is a static GitHub Pages site. There is no login and no server, so nothing can be truly
password-protected. "Locked" here means **unlisted and noindex**:

- the working tools live at paths nothing public links to,
- each one has `<meta name="robots" content="noindex, nofollow">`,
- none of them is in `sitemap.xml`.

Anyone who has the exact URL (for example, a subscriber who forwards the welcome email) can still
open a locked page. That is the trade-off of a static site. If real protection is ever needed, the
tools would have to move behind a login (for example Cloudflare Access or a members platform).

## The teaser model (built on this branch)

One public teaser tool, everything else in the subscriber library.

| What | Public URL (indexed, in sitemap) | Locked working version (noindex, unlisted) |
|---|---|---|
| CCC Diagnostic (the one public teaser tool) | `/tools/ccc-diagnostic.html`: runs in full, shows a short readout (overall band, pattern readout, the one focus area), then the toolkit line to `tools-signup.html` and "Book a 30-minute call to review your results" | `/tools/library/ccc-diagnostic.html` (full three-card readout) |
| Operational Health Check | `/tools/operational-health-check.html` (teaser page) | `/tools/library/operational-health-check.html` |
| Board Governance Self-Assessment | `/tools/board-governance.html` (teaser page) | `/tools/library/board-governance.html` |
| Financial Controls Self-Assessment | `/tools/financial-controls.html` (teaser page) | `/tools/library/financial-controls.html` |
| Grant Readiness Assessment | `/tools/grant-readiness.html` (teaser page) | `/tools/library/grant-readiness.html` |
| Do I Need a Fractional COO? | `/tools/coo-roi-calculator.html` (teaser page) | `/tools/library/coo-roi-calculator.html` |
| Operating Reserve and Runway Calculator | `/tools/reserve-calculator.html` (teaser page) | `/tools/library/reserve-calculator.html` |
| Conflict of Interest Self-Check | `/tools/conflict-of-interest.html` (teaser page) | `/tools/library/conflict-of-interest.html` |
| Build-With-Claude Playbook | `/playbook/build-with-claude.html` (teaser page with the email form) | `/tools/library/how-i-built-my-site-with-claude.pdf` (moved from `/assets/playbook/`) |
| Subscriber hub | (none) | `/tools/index-subscribers.html` links every locked tool and the PDF |

Why the CCC Diagnostic is the teaser: it is the shortest tool (nine questions, about 2 minutes),
it works for both businesses and nonprofits, and its result names one focus area, which is a
natural reason to book a call or want the deeper tools. The playbook follows the same shape: a
public page that describes what is inside, and the full asset behind the newsletter signup.

Each teaser page keeps the old public URL working, so search results and old links do not break.
It says what decision the tool helps make, who it is for, how long it takes and what you get,
shows three sample questions, and sends people to `tools-signup.html` (with a discovery call as
the second option).

Every public link on the site now goes to the CCC Diagnostic, `tools-signup.html` or a teaser page.
Only `tools/index-subscribers.html` links to `tools/library/`.

The old PDF URL (`/assets/playbook/how-i-built-my-site-with-claude.pdf`) now returns the 404 page.
A PDF cannot be replaced with a teaser, so anyone with the old link lands on the 404 page, which
points to the tools signup.

## What Katoya must do in Brevo (the gate is not complete until these are done)

1. **Welcome email.** Edit the Out the Box double opt-in confirmation and welcome emails so they
   link to `https://www.toyboxconsulting.net/tools/index-subscribers.html`. Until this is done,
   new subscribers have no way to reach the tools or the playbook PDF.
2. **Existing subscribers.** Send current Out the Box subscribers the same hub link once (for
   example in the next issue), so people who signed up before the gate are not locked out.
3. **Playbook form.** The playbook page posts to the same Brevo form. After signup it now tells
   people to check their inbox instead of starting a download, so the welcome email must carry
   the library link (step 1).
4. **Optional tagging.** Add a hidden "source = tools_gate" attribute or tag on the form so tool
   signups can be counted separately.
5. **Results-email Worker.** Confirm whether `toybox-tools-mail.katoya.workers.dev` adds people who
   tick the consent box to the Out the Box list in Brevo. If not, connect it so tool users who opt
   in land on the same list.

## Not changed

- Calendly, Brevo, Cloudflare and the results-email Worker settings.
- The COI Quick Start PDF (`/assets/downloads/toybox-coi-quick-start.pdf`) is still public.
