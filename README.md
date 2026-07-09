# Renewal Copilot

A lightweight, client-side tool that recommends the best-fit package.

1. **Cost fit** — subscription fee vs. PAYG fee at their projected spend, utilization, effective rate, break-even.
2. **Feature fit** — a short needs checklist that sets the *minimum* package that even has what they need.

The recommendation is the intersection: the cheapest tier that clears the feature floor.

Static HTML + JS. No build step, no server. Hosts on GitHub Pages like Calendar Jenga.

---

## Files

| File | Purpose |
|------|---------|
| `index.html` | The whole app (UI + logic). |
| `config.js` | Client ID, allowed domain, PAYG rate, Google Sheet ID, AI proxy URL, and sample rates. **Keep real rates/IDs out of public repos.** |
| `README.md` | This file. |

---

## Run it locally

Because `index.html` loads `config.js` over `file://` fine in most browsers, you can just open it.
If your browser blocks the local script, run a tiny server:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

On first load, click **"Continue in preview mode"** to skip sign-in while testing.

---

## Google sign-in (restrict to Field Nation accounts)

Same idea as on Calendar Jenga.

1. Google Cloud Console → **APIs & Services → Credentials → Create OAuth client ID → Web application**.
2. Under **Authorized JavaScript origins**, add your GitHub Pages origin
   (e.g. `https://YOURNAME.github.io`) and `http://localhost:8080` for testing.
3. Copy the client ID into `config.js` → `GOOGLE_CLIENT_ID`.
4. `ALLOWED_DOMAIN` is already `fieldnation.com`. Only accounts whose Google Workspace
   domain (`hd`) or email match are let in.

### Security reality check
This is a **client-side gate**. It hides the *interface* from non-FN users, but a static
site still serves its source files to anyone. So:

- Sign-in stops casual access to the UI. Good enough for an internal helper.
- It does **not** hide the source. Anything in `config.js` (including the price book) is
  readable by anyone who views source **if the repo/site is public**.

If you want real access control or to keep pricing private, host behind auth
(e.g. a private repo on GitHub Pages with a paid plan, Cloudflare Access, or a small proxy).

---

## Keeping the price book confidential

`config.js` ships with **sample** rates, clearly labeled. Before using real internal rates:

1. Rename the shipped file to `config.sample.js` and commit that.
2. Add `config.js` to `.gitignore`.
3. Put the real rates in your local `config.js` only, or inject them at deploy time.


## Analytics included

- **Scenario comparison** — current plan vs. PAYG vs. right-sized subscription (annual cost + effective rate).
- **Right-size / upgrade suggestion** — names the tier that fits the buyer's projected spend; for over-utilized accounts it names the specific tier to move up to.
- **Savings callout** — dollar delta of the recommended move.
- **Break-even chart** — inline SVG (no library) showing where the subscription overtakes PAYG, with projected spend marked.

All of the above is deterministic math — no AI, no key.

---

## Optional: AI narrative via a proxy (NEVER a client-side key)

A Gemini (or any LLM) API key must never go in `config.js` or the page — a static site
ships its source to every visitor, so the key would be exposed and abusable.

Instead, run a tiny proxy that holds the key server-side and returns text. Set
`AI_PROXY_URL` in `config.js` to its URL and a "Draft narrative summary" button appears.
The app POSTs `{ task, context, points }`; the proxy calls Gemini and returns `{ text }`.

Minimal Google Apps Script proxy (deploy as a web app, "Execute as me", access
"Anyone within Field Nation"), with the key stored in Script Properties, not in code:

```javascript
function doPost(e){
  var key = PropertiesService.getScriptProperties().getProperty('GEMINI_KEY');
  var body = JSON.parse(e.postData.contents);
  var prompt = "You are a Field Nation Buyer Success rep. Write a short, warm renewal " +
    "note based on this analysis. Do not invent numbers.\n\n" + body.points;
  var res = UrlFetchApp.fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + key,
    { method:"post", contentType:"application/json",
      payload: JSON.stringify({ contents:[{ parts:[{ text: prompt }] }] }) });
  var text = JSON.parse(res.getContentText()).candidates[0].content.parts[0].text;
  return ContentService.createTextOutput(JSON.stringify({ text: text }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

Keep the AI output as a *drafting aid* — the numbers in the tool are the source of truth.

---

## Deploy to GitHub Pages

```bash
git init
git add index.html config.sample.js README.md   # note: NOT the real config.js
git commit -m "Renewal Copilot"
git branch -M main
git remote add origin https://github.com/YOURNAME/plan-advisor.git
git push -u origin main
```

Then repo **Settings → Pages → Source: main / root**. Live at `https://YOURNAME.github.io/plan-advisor/`.

---
