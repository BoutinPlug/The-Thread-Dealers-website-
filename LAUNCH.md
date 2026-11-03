# Launch checklist: Netlify + thethreaddealers.com

The site is static HTML, so there is no build step. Netlify publishes the repository as it is
and redeploys every time `main` changes.

## 0. Still to finish before launch

- [ ] **Hoodie fabric weights:** `hoodies-track-pants.html` shows "GSM to be confirmed" for both
      weights (Everyday and Heavyweight). Add the real GSM numbers.
- [ ] **Sample pricing:** `hoodies-track-pants.html` and `custom-hats.html` say paid samples are
      "estimated at $70–$75. Exact pricing is to be confirmed." Confirm the price.
- [ ] **Finish the four core product pages to the same standard as the rest of the site:**
      `hoodies-track-pants.html`, `premium-tees.html`, `performance-jerseys.html`, `custom-hats.html`.
- [ ] Confirm business details: email, phone, free sample on 100+ pieces, 50 piece minimum,
      6 to 8 week delivery.

## 1. Put the site on Netlify (about 10 minutes)

1. Go to netlify.com and sign up with your GitHub account.
2. **Add new project → Import an existing project → GitHub**, then pick
   `BoutinPlug/The-Thread-Dealers-website-`.
3. Settings:
   - Branch to deploy: `main`
   - Build command: leave empty
   - Publish directory: leave empty (the repository root)
4. Deploy. Netlify gives the site a temporary address like `something.netlify.app`.
   Open it and click around.

## 2. Turn on the form (about 5 minutes)

Both forms (homepage and Start a Project) send to one Netlify form called **project-brief**.

1. In the Netlify project: **Forms → Enable form detection**.
2. Trigger a new deploy (**Deploys → Trigger deploy → Deploy site**) so Netlify finds the form.
3. Email alerts: **Project configuration → Notifications → Emails and webhooks →
   Form submission notifications → Add notification → Email notification**.
   Use `info@thethreaddealers.com` and pick the `project-brief` form.
4. Test it: fill in the form on the `.netlify.app` address. You should see "Brief sent",
   the submission appears under **Forms**, and an email arrives.

Each email includes: name, company, email, what it is for, garments, quantity, timing,
logo status, notes, and which page it came from. Spam bots are filtered by a hidden field.

(Menu names can shift a little as Netlify updates its dashboard. The steps stay the same.)

## 3. Connect the domain (with your friend's domain login)

1. In Netlify: **Domain management → Add a domain** → `thethreaddealers.com`.
2. Netlify then offers two ways to point the domain:
   - **Easiest: use Netlify DNS.** Netlify shows 4 nameservers. At the company where the
     domain was bought, replace its nameservers with those 4.
     Before switching, check whether the domain has email set up (MX records). If
     info@thethreaddealers.com already works, those email records must be copied into
     Netlify DNS too, or email will stop working.
   - **Or keep the current DNS** and add the two records Netlify shows: an `A` record for
     the bare domain and a `CNAME` for `www` pointing to your `.netlify.app` address.
     This option never touches email.
3. Wait for it to connect (minutes to a few hours). Netlify turns on HTTPS automatically.
4. Check `https://thethreaddealers.com` and `https://www.thethreaddealers.com` both load.

## 4. After it is live

- **Switch the form emails to info@thethreaddealers.com.** Right now they go to the Netlify
  sign-in email (set up 2026-11-03, because the free plan only emails team members).
  1. Netlify **User settings** → change the login email to `info@thethreaddealers.com`
     and confirm it from that inbox.
  2. **Forms → Submission notifications → Options → Edit** → change the email to
     `info@thethreaddealers.com` → Save.
- Send one more test brief from the real domain.
- Turn off GitHub Pages so there is only one copy of the site:
  GitHub repo → **Settings → Pages → Unpublish site**.
- Optional: add the site to Google Search Console and submit `sitemap.xml`.
