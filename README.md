# Vaibhav Vikas Gaikwad — Portfolio

Static, high‑performance portfolio built with **HTML + Tailwind (CDN) + vanilla JS**.

## Local preview
Just open `index.html` in your browser. No build step required.

## Customize
- **Avatar:** replace `assets/headshot-placeholder.svg` with your photo (same filename).
- **Resume:** add your `assets/resume.pdf`. The viewer will auto‑load.
- **Projects:** edit `projects.json`. Cards are generated dynamically.
- **Colors/Theme:** Tailwind + dark mode toggle (persists in `localStorage`).

## Deploy to GitHub Pages
1. Create a new repo called **vaibhavgaikwad7.github.io**.
2. Copy these files to the repo root.
3. Commit & push:
   ```bash
   git init
   git add .
   git commit -m "feat: initial portfolio"
   git branch -M main
   git remote add origin https://github.com/vaibhavgaikwad7/vaibhavgaikwad7.github.io.git
   git push -u origin main
   ```
4. Visit **https://vaibhavgaikwad7.github.io** in a minute.

## Form submissions (optional)
- Replace the `onSubmit` handler in `script.js` with a Formspree or Netlify form endpoint.

## License
MIT — feel free to adapt.
