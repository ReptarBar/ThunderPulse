# Publishing FlockStats

This guide explains how to publish the FlockStats dashboard so it is live on the web with GitHub Pages.

## Prerequisites
- A GitHub account
- The project files from this repo or the provided zip

## One time setup
1. **Create a new repo**
   - On GitHub click New repository and name it for example `flockstats`
   - Keep it public to use GitHub Pages easily

2. **Upload the files**
   - Unzip locally
   - Upload everything at the root level of the repo
   - You should see folders `dashboard/`, `etl/`, `data/`, `.github/` plus docs like `README.md`

3. **Add Actions secrets**
   - Go to **Settings → Secrets and variables → Actions**
   - Add these repository secrets:
     - `GITHUB_TOKEN` a personal access token that can read public repos
     - `SALT` any long random string used for hashing email addresses
   - Optional: `GITHUB_ORG` to point at a different org than `thunderbird`

4. **Enable GitHub Pages**
   - Go to **Settings → Pages**
   - Source: **Deploy from a branch**
   - Branch: **main**
   - Folder: **/** (root)
   - Save
   - GitHub shows your site URL in a few seconds for example `https://<username>.github.io/<repo>/`

## First run
1. Go to the **Actions** tab
2. Open the **ETL** workflow
3. Click **Run workflow** and confirm
4. After it finishes check the repo for a new commit under `/data/`

## View the dashboard
Open:
```
https://<username>.github.io/<repo>/dashboard/
```
You should see the contributor numbers and a **Last updated** time.

## Common issues
- **Numbers are dashes only**
  - Make sure `/data/latest.json` exists on the default branch
  - Re run the ETL workflow
- **404 on the dashboard URL**
  - Re check Settings → Pages and confirm Source is **Deploy from a branch**, Branch **main**, Folder **/** (root)
- **About opens but numbers fail**
  - Likely a fetch error while reading `../data/latest.json`
  - Refresh the page after the workflow completes

## How updates happen
- The ETL runs on a daily schedule and can be triggered manually from Actions
- Any code or style change pushed to main will be served by Pages after a short delay

## Privacy reminder
- The dashboard shows totals only
- No raw emails are published
- The hashing salt lives only in Actions secrets

## Support
- See `USAGE.md` for a simple viewing guide
- See `PRIVACY.md` for privacy notes
- Contact the team with a link and a screenshot if something does not look right
