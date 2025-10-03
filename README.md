<div align="center">

## 🩸 Blood Donation Website

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit-blue)](https://blood-donation-website-atid.onrender.com)
[![Status](https://img.shields.io/badge/Status-Active-success)](#)
[![License](https://img.shields.io/badge/License-MIT-green)](#license)

</div>

An accessible, responsive website to connect blood donors with people in need. It provides information about donation, allows users to search for donors, and streamlines the process to sign in and offer help.

> GitHub short description (for the repo tagline/description field): A responsive frontend to connect blood donors and seekers with search, donate, and sign‑in flows.

---

## ✨ Features

- Responsive, mobile‑first pages: Home, About, Donate, Search, Sign‑in
- Donor search with filters and interactive UI
- Simple donation flow with client‑side validation
- Clean, modern UI with reusable CSS
- Modular JavaScript for API calls and page logic

## 🚀 Live Demo

- Demo: https://blood-donation-website-atid.onrender.com

## 🧱 Tech Stack

- HTML5, CSS3 (Vanilla)
- JavaScript (Vanilla, modular scripts)
- No backend required to run locally; API calls can be wired to any service

## 📁 Project Structure

```
Blood-Donation-Website/
└─ blood donation/
   ├─ index.html        # Landing page
   ├─ about.html        # About blood donation
   ├─ donate.html       # Donation flow (form/UI)
   ├─ search.html       # Donor search page
   ├─ signin.html       # Sign-in page
   ├─ css/
   │  └─ styles.css     # Global styles
   ├─ js/
   │  ├─ main.js        # Home page logic
   │  ├─ search.js      # Search logic and interactions
   │  ├─ donate.js      # Donation form logic/validation
   │  ├─ signin.js      # Sign-in logic
   │  └─ api.js         # API helper functions
   └─ img/              # Images and icons
```

## 🧰 Quick Start (Local)

Because this is a static site, you can run it in minutes.

1) Clone the repository

```bash
git clone https://github.com/<your-username>/Blood-Donation-Website.git
cd Blood-Donation-Website/blood\ donation
```

2) Open locally

- Option A: Double‑click `index.html` to open in your browser
- Option B: Use a local server (recommended for fetch/API and routing)

```bash
# Using VS Code Live Server (extension) or:
python -m http.server 5500
# then open http://localhost:5500 in your browser
```

## 🔌 Configuration

- API endpoints and integration points live in `js/api.js`. Adjust base URLs and request methods as needed for your backend.
- Page‑specific behavior is in `js/main.js`, `js/search.js`, `js/donate.js`, and `js/signin.js`.
- Global styling is defined in `css/styles.css`.

## 🧪 Testing Checklist (Manual)

- Home page loads without layout shifts on mobile and desktop
- Search accepts valid inputs and displays meaningful results/empty states
- Donate form validates required fields and shows errors inline
- Sign‑in handles success/error states
- Navigation links work across all pages

## 🌐 SEO & Meta

- Add descriptive `<title>` and meta description to each page
- Include Open Graph/Twitter meta tags for better link previews
- Optimize images in `img/` for size and performance

## 📸 Screenshots (optional)

Add screenshots to showcase the UI:

```
img/
├─ header.png
├─ blood.jpg
└─ ...
```

You can embed them in README once uploaded:

```markdown
![Header](blood%20donation/img/header.png)
```

## 🧭 Roadmap Ideas

- Connect to a real donor registry API
- Add user profiles and donor verification
- Enable location‑based search and maps
- Multi‑language support

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feat/your-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file if present, or include one with your preferred terms.

---

## 💡 Credits

Built with HTML, CSS, and JavaScript to support the life‑saving mission of blood donation.
