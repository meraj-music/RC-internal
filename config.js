/* =============================================================
   Renewal Copilot - configuration
   -------------------------------------------------------------
   KEEP THIS FILE OUT OF PUBLIC REPOS if it contains real rates,
   a real Sheet ID, or a production client ID. Add `config.js` to
   .gitignore and commit `config.sample.js` instead.
   ============================================================= */

window.FN_CONFIG = {

  /* Google OAuth client ID from Google Cloud Console
     ( APIs & Services > Credentials > OAuth 2.0 Client IDs ).
     Leave as-is to run in local PREVIEW mode with no sign-in. */
  GOOGLE_CLIENT_ID: "1060041573516-bs3l6590i565j4f1m8236p03htip1lhu.apps.googleusercontent.com",

  /* Only accounts on this Google Workspace domain may sign in. */
  ALLOWED_DOMAIN: "fieldnation.com",

  /* Standard pay-as-you-go work-order fee (%). */
  PAYG_RATE: 12,

  /* -----------------------------------------------------------
     LIVE PRICE BOOK FROM GOOGLE SHEETS (optional but recommended)
     Keeps real rates out of the repo. When a signed-in FN user
     loads the app, the tool reads these rates from the sheet with
     their own read-only token. Leave SHEET_ID blank to always use
     the sample PRICE_BOOK below.
     Sheet tab layout (row 1 = headers): package | spend_limit | fee_pct
     ----------------------------------------------------------- */
  SHEET_ID: "15oF4D25WxbNn3WlbTezCMZJht1fevw7LsL8Nz9OVZcQ",
  SHEET_RANGE: "A:Z",            /* single tab - grab all columns, parser finds the right ones by header */

  /* Org renewal tracker sheet (feeds the Pipeline dashboard). */
  RENEWAL_SHEET_ID: "14IHHDPRm-m1MNRUaEewMKPvK1yv7nZpUl0QY2dlbA0M",
  RENEWAL_RANGE: "Upcoming Renewals!A:N",
  /* Tabs combined into one Pipeline list (falls back to RENEWAL_RANGE if a tab is missing). */
  RENEWAL_RANGES: ["Upcoming Renewals!A:N", "2026 Closed Renewals!A:N"],

  /* -----------------------------------------------------------
     OPTIONAL AI NARRATIVE (Gemini) - via a server-side proxy ONLY.
     NEVER put a Gemini API key here; this file ships to the browser.
     Point this at a small proxy (Apps Script / Cloudflare Worker)
     that holds the key and returns text. Blank = AI button hidden.
     ----------------------------------------------------------- */
  AI_PROXY_URL: "",

  /* -----------------------------------------------------------
     SAMPLE PRICE BOOK - replace with the current internal rates,
     or leave as-is and load live rates from the sheet above.
     These are placeholder values for demo / portfolio use.
     Keys are spend-limit tiers; values are the standard
     subscription work-order fee %. Fee % is editable in the UI
     because real contracts are often discounted below book rate.
     ----------------------------------------------------------- */
  PRICE_BOOK: {
    Plus: {
      50000: 7.0, 100000: 6.0, 250000: 5.7,
      500000: 5.4, 750000: 5.1, 1000000: 4.8
    },
    Premier: {
      50000: 9.0, 100000: 8.0, 250000: 7.6,
      500000: 7.2, 750000: 6.8, 1000000: 6.4
    }
  },

  /* Rule-of-thumb spend where a subscription starts beating PAYG. */
  SUBSCRIPTION_HINT: 25000
};
