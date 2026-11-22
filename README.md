# Nabil Portfolio: setup, status & placeholders

## 1. One-time library install (needs internet)
Slick Slider and (optionally) Bootstrap Icons must be downloaded. Run the included script from this folder:

    powershell -ExecutionPolicy Bypass -File .\get-libs.ps1
    powershell -ExecutionPolicy Bypass -File .\get-libs.ps1 -LocalIcons     (also self-host Bootstrap Icons, no CDN)

It saves: `assets/css/slick.css`, `slick-theme.css`, `ajax-loader.gif`, `assets/css/fonts/slick.*`, `assets/js/slick.min.js`
(and with -LocalIcons: `assets/vendor/bootstrap-icons/…`, and switches the 5 pages to the local icon CSS).
Until Slick is installed, the browser console shows 404s + a warning, the hero uses a simple fade and testimonials show as a grid.
After installing, hard-refresh (Ctrl+F5): both sliders should be real Slick (dots appear under the testimonials).

## 2. Theme behaviour
- First visit: Light mode, purple accent. Nothing is saved until the visitor chooses.
- Choosing Dark/Light or an accent saves it under `nr_theme` / `nr_accent` (own keys; the old generic key `theme` was removed because other local projects on the same origin can overwrite it).
- Applied in `<head>` by `assets/js/theme-init.js` before first paint (no flash). Same on all 5 pages.
- To reset: DevTools > Application > Local Storage > delete `nr_theme` / `nr_accent`.

## 3. Placeholders to replace (search for "EDIT")
| Item | Where |
|---|---|
| Email nabil@example.com | about.html, portfolio.html, contact.html |
| Phone +880 1723 456 789, working hours | contact.html |
| Address / map query "Dhaka, Bangladesh" | contact.html (iframe `src` + "Open in Google Maps" link) |
| Testimonials (Sarah Khan etc.) | index.html `.review-slider` |
| Clients (Google, Microsoft, Meta, envato, upwork) | about.html (x2), services.html; text only, not real logos |
| Education entries | portfolio.html |
| Work experience | portfolio.html `.timeline` |
| Certificate | portfolio.html modal uses `assets/images/Neon Glass Certificate Showcase.png` (looks like a design mockup; swap in your real certificate) |
| Projects | portfolio.html "My Projects" |
| Social URLs | `SOC` array in assets/js/app.js |
| Canonical URL / og:url | head of every page, after deployment |

## 4. External services
- Contact form: set `FORM_ENDPOINT` at the top of `assets/js/app.js` (e.g. a Formspree URL). Until then the form validates but delivers nothing.
- Google Map: keyless embed (`maps?q=…&output=embed`). To pin an exact address change the `q=` value. The Maps Embed API with a key is optional; restrict any key to your domain.
