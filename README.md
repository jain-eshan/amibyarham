# AMI by Arham

**Made-to-order, handcrafted lab-grown diamond jewellery.**  
A family business — Arham Diamonds, 40 years in Old Delhi — brought online for the first time.

Live site: [www.arhamdiamonds.in](https://www.arhamdiamonds.in)  
GitHub: [github.com/jain-eshan/amibyarham](https://github.com/jain-eshan/amibyarham)

---

## What this product is

AMI is not a jewellery catalogue. There is no "Add to cart."

The product is a custom commission flow: a customer uploads an inspiration image (Pinterest save, sketch, photo), answers 4 questions about occasion + budget, sees what their budget can make, and submits their contact details. The karigar in Old Delhi then reviews their reference and comes back within 24 hours with a confirmed design, spec, and price.

**The site's one job:** make someone trust us enough to submit their reference.

### Who it's for
Young Indian professionals (22–35), metro + tier-1 cities. Discover jewellery on Pinterest/Instagram. Want something personal, not off-the-shelf. Intimidated by traditional showrooms. Value authenticity and craft.

### Brand voice
Warm, honest, unhurried. Like your family jeweller's son who went to design school. No pressure. Transparent pricing. Personal attention.

---

## What's built (current state)

Everything lives in a single file: `index.html`. No framework, no build step, no npm. Pure HTML + CSS + JS, deployed as a static site on Vercel.

### Marketing site (scrollable)
- **Hero section** — scroll-scrubbed video (desktop) / autoplay loop (mobile). 4 beat moments as you scroll, each revealing brand copy.
- **Process section** — explains the 3-step custom order process (share inspiration → get mockup → karigar makes it).
- **Trust section** — 40-year heritage, IGI certification, karigar transparency.
- **CTA section** — final conversion push before the footer.
- **Footer** — brand info, links.

### Commission overlay (the product core)
Triggered by every "Start your piece" button on the page. Full-screen dark overlay, cinematic feel. 5 steps + confirmation:

| Step | What happens |
|------|-------------|
| 1 — Upload | Drag-and-drop or tap-to-upload. JPG/PNG/WEBP, max 10MB. Image previewed in-place. |
| 2 — Occasion | Single-select chips: For myself · Gift · Anniversary · Engagement · Wedding · Just because. Optional free-text. |
| 3 — Budget | 5 budget tiers from Under Rs 5,000 to Rs 40,000+. |
| 4 — Estimate | Smart cards showing what the selected budget can make — metal type, stone carat range, clarity grade, price range. Powered by a configurable `PRICING_TIERS` object. |
| 5 — Details | Name (required), phone (required, 10-digit Indian), email (optional), city (optional). |
| Confirmation | "Your reference is pinned to the bench." WhatsApp CTA pre-filled with customer's name + budget. |

### On submit (Step 5 → Confirmation)
Three things fire in sequence:
1. **Image upload** → Supabase Storage bucket `commission-images` (public read)
2. **Lead row** → Supabase table `commission_leads`
3. **Email notification** → EmailJS fires to `amibyarham@gmail.com` (Amit) with all lead details. BCC to `eshanjain2004@gmail.com`.

If any step fails, the confirmation screen still shows — the customer always gets a positive response. Errors log to the browser console.

### Floating CTA (FAB)
Fixed gold pill bottom-right. Appears 800ms after page load, pulses a gold glow every 8 seconds to draw attention without being annoying.

---

## Tech stack

| Layer | Tool | Why |
|-------|------|-----|
| Frontend | Vanilla HTML/CSS/JS | No build step. Eshan can edit in any text editor. |
| Database | Supabase (Postgres) | Stores commission leads. Free tier sufficient for MVP. |
| File storage | Supabase Storage | Stores inspiration images uploaded by customers. |
| Email | EmailJS | Client-side email — no backend server needed. 200 emails/month free. |
| Hosting | Vercel | Git-push deploys. Connected to `main` branch of GitHub repo. |
| Domain | arhamdiamonds.in | DNS managed separately (not Vercel). |
| Fonts | Google Fonts CDN | Bodoni Moda (display), EB Garamond (body), DM Sans (UI), Caveat (script), Noto Serif Devanagari (Hindi). |

---

## Credentials & services

All credentials are set as JS constants at the top of the script block in `index.html` (~line 1237). They are safe to be public because:
- The Supabase anon key only has permission to INSERT into `commission_leads` and upload to `commission-images` — it cannot read other tables or delete anything.
- EmailJS public keys are designed to be client-side.

| Variable | Service | Purpose |
|----------|---------|---------|
| `SUPABASE_URL` | Supabase | Project URL |
| `SUPABASE_ANON_KEY` | Supabase | Anonymous client key |
| `EMAILJS_SERVICE_ID` | EmailJS | `service_k9er721` |
| `EMAILJS_TEMPLATE_ID` | EmailJS | `template_sv5a7me` |
| `EMAILJS_PUBLIC_KEY` | EmailJS | Public key |
| `WHATSAPP_NUMBER` | WhatsApp | `919958863129` (Amit's number) |

---

## Supabase setup

### Table: `commission_leads`
```sql
create table commission_leads (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz default now(),
  name           text not null,
  phone          text not null,
  email          text,
  city           text,
  occasion       text,
  occasion_note  text,
  budget_range   text,
  image_url      text,
  status         text default 'new'
);
alter table commission_leads enable row level security;
create policy "anon can insert leads" on commission_leads
  for insert to anon with check (true);
```

### Storage bucket: `commission-images`
- Public bucket (allows `getPublicUrl` to return a working link)
- RLS policies:
  - `anon` can INSERT (upload)
  - `anon` and `authenticated` can SELECT (view)

---

## EmailJS template (`template_sv5a7me`)

The template must use these exact variable names:

```
Subject: New AMI commission — {{name}}, {{budget}}

To: amibyarham@gmail.com
Reply-To: {{email}}
BCC: eshanjain2004@gmail.com

Body variables: {{name}} {{phone}} {{email}} {{city}} {{occasion}} {{occasion_note}} {{budget}} {{image_url}}
```

---

## Pricing tiers (update before go-live)

The estimate cards in Step 4 are powered by the `PRICING_TIERS` object in `index.html` (~line 1246). **These are placeholder numbers.** Before going live, Eshan needs to confirm the real numbers with Amit and the karigar and update this object. Nothing else needs to change — the UI reads from it dynamically.

Questions to confirm with Amit/karigar before updating:
- Silver: weight in grams at each tier, current 925 silver rate, diamond carat + clarity available
- Gold: minimum budget for 14k vs 18k, weight in grams, current gold rate (14k + 18k separately), diamond size/clarity per tier

---

## How to make changes

**Editing text, prices, copy:** Open `index.html`, use Cmd+F to find the text, change it, save, commit, push. Vercel deploys automatically within ~60 seconds.

**Editing the commission flow steps:** All overlay HTML is in `index.html` around lines 990–1150. CSS for the overlay is around lines 490–760. JS is from line 1232 onwards.

**Deploying:**
```
git add index.html
git commit -m "what you changed"
git push origin main
```
Vercel picks it up automatically. No manual deploy button needed.

---

## What's NOT built yet (Phase 2)

These were explicitly out of scope for the MVP:

- **AI mockup generation** — customer uploads inspiration, AI generates a jewellery mockup in their style
- **Karigar portal / admin dashboard** — Amit can see all leads, update status, attach mockups
- **Payment / deposit collection** — online payment to book the karigar's time
- **Saved wishlist / user accounts** — return customers, saved designs
- **WhatsApp bot follow-up** — automated follow-up sequence after lead submission

---

## People

| Person | Role | Contact |
|--------|------|---------|
| Eshan Jain | Product, strategy, design direction | eshanjain2004@gmail.com |
| AK Jain (dad) | Business, karigar relationships, operations | — |
| Amit Jain | Day-to-day operations, customer liaison | amibyarham@gmail.com · +919958863129 |
| Arham Diamonds | Parent company (40yr legacy, Old Delhi + IDI Surat) | — |

---

## Design system

Brand tokens are CSS custom properties at the top of the `<style>` block:

```css
--oxblood: #6E1B2E    /* primary brand colour */
--gold: #B5944A       /* accent */
--silk: #F0E6D2       /* light background */
--kohl: #1A1411       /* near-black text */
--lac: #4A0F1E        /* deep dark (overlay background) */
```

Full design reference: `_designsystem/` folder and `brand-guide.html`.
