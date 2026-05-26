# 👗 MyDressShop — Free Clothing Shop Website

A complete, dynamic clothing shop website. Upload product photos, manage inventory, show your store address and contact, and let customers enquire via WhatsApp.

---

## 📁 Folder Structure

```
clothing-shop/
├── index.html          ← Main website file
├── css/
│   └── style.css       ← All styling & responsive design
├── js/
│   └── app.js          ← All JavaScript logic
├── images/             ← (optional) Put your logo or banner here
└── README.md           ← This file
```

---

## ✨ Features

- **Shop Page** — Product grid with search, category filter, sort by price/newest
- **Add Product** — Upload compressed photo, name, price, sizes, material, color, description, stock
- **Product Detail** — Click any card for full info + WhatsApp enquiry button
- **Store Info** — Add your address, phone, WhatsApp, email, business hours
- **Fully Responsive** — Works on mobile, tablet, desktop
- **Auto image compression** — Photos compressed automatically to save storage
- **WhatsApp integration** — Customers can enquire directly from product page
- **Free hosting ready** — Works on Netlify, GitHub Pages, Vercel (100% free)

---

## 🚀 HOW TO HOST FOR FREE

### ✅ Option 1: Netlify Drop (EASIEST — 2 minutes, no account needed)

1. Go to → **https://app.netlify.com/drop**
2. Select all files in the `clothing-shop` folder (the whole folder)
3. **Drag and drop** the folder onto the page
4. Netlify gives you a free URL instantly! e.g. `https://random-name-123.netlify.app`
5. *(Optional)* Create a free Netlify account to keep the site and rename the URL

---

### ✅ Option 2: GitHub Pages (Free, permanent URL)

**Step 1 — Create GitHub Account**
- Go to https://github.com and sign up for free

**Step 2 — Create a Repository**
1. Click the **+** button → **New repository**
2. Name it: `clothing-shop` (or your shop name)
3. Set it to **Public**
4. Click **Create repository**

**Step 3 — Upload your files**
1. Click **"uploading an existing file"** link
2. Drag all your files (`index.html`, `css/` folder, `js/` folder)
3. Click **Commit changes**

**Step 4 — Enable GitHub Pages**
1. Go to your repository → **Settings** tab
2. Click **Pages** in the left sidebar
3. Under "Branch", select `main` → click **Save**
4. Your site is live at: `https://YOUR-USERNAME.github.io/clothing-shop`

---

### ✅ Option 3: Vercel (Fast, free, professional)

1. Go to → **https://vercel.com** → Sign up with GitHub
2. Click **New Project** → Import your GitHub repository
3. Click **Deploy** — done!
4. You get a free URL like: `https://clothing-shop.vercel.app`

---

## 🛠️ Customization

### Change your shop name
Open `index.html` and find:
```html
<div class="logo" ...>👗 MyDressShop</div>
```
Replace `MyDressShop` with your actual shop name.

Or just go to the website → **Store Info** → **Edit Store Info** → enter your shop name there. It updates the header and title automatically!

### Change currency symbol
Open `js/app.js` and search for `₹` — replace with your currency (e.g. `$`, `€`, `£`).

### Change colors / theme
Open `css/style.css` — the top of the file has color variables:
```css
:root {
  --brown: #3d2b1f;   ← Main dark color
  --gold:  #c9913a;   ← Accent/highlight color
  --cream: #faf6f1;   ← Background color
}
```
Change these hex codes to your preferred colors.

### Add your own categories
In `index.html`, search for the `<select id="pCategory">` and `<select id="categoryFilter">` tags. Add or remove `<option>` items.

---

## 📦 Important Notes

- **Products are stored in the browser's localStorage** — this means:
  - Data stays on the device where you added it
  - Different customers see the same products only if you use a backend (not needed for basic use)
  - For a shared product database, consider upgrading to Supabase (still free tier available)

- **Image storage**: Images are compressed to ~700px and stored as base64. Approximately 20-50 products with photos can be stored before hitting limits.

- **WhatsApp**: Set your WhatsApp number in **Store Info** for the enquiry button to appear on product detail pages.

---

## 📞 Need Help?

If you get stuck at any step, just ask! This website is fully yours — no monthly fees, no subscription.

---

*Made with ❤️ — Free forever*
