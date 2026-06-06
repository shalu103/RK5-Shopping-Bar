# RK5 Shopping Bazar - Astro + Sveltia CMS

A modern, minimalist landing page for RK5 Shopping Bazar, built with Astro and integrated with Sveltia CMS for easy content editing.

## Local Development

1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Access CMS: Visit `http://localhost:4321/admin/`

## Deployment to GitHub Pages

1. Create a GitHub repository.
2. Update `astro.config.mjs`:
   - `site`: Set to `https://your-username.github.io`
   - `base`: Set to `/${your-repo-name}`
3. Update `public/admin/config.yml`:
   - `repo`: Set to `your-username/your-repo-name`
4. Push to GitHub.
5. In GitHub Repo Settings -> Pages:
   - Build and deployment -> Source: **GitHub Actions**
