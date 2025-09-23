# QA checklist - FlockStats MVP

## Smoke
- [ ] Dashboard opens on GitHub Pages.
- [ ] Four labels read clearly. Numbers are visible.
- [ ] Last updated time shows and makes sense.

## Data load
- [ ] With `data/latest.json` present, numbers render.
- [ ] Temporarily rename `latest.json` to test the friendly error message.
- [ ] Restore `latest.json` and confirm numbers show again.

## Accessibility
- [ ] Tab through the page. Buttons receive focus.
- [ ] Open About. Escape closes it. Focus returns to About button.
- [ ] Color contrast meets AA (check any one line with a contrast checker).

## Mobile
- [ ] iPhone and Android render without horizontal scroll.
- [ ] Buttons are finger friendly.

## Content
- [ ] About dialog text is plain and accurate.
- [ ] Links to USAGE.md and PRIVACY.md work.

## CI
- [ ] Add `GITHUB_TOKEN` and `SALT` as repo secrets.
- [ ] Run the workflow from Actions.
- [ ] Confirm commit under `/data/` appears after a run.

## Security
- [ ] No secrets in the repo.
- [ ] SALT is only in GitHub Secrets.
- [ ] Public page shows totals only.

## Regression
- [ ] After the first scheduled run, numbers still render.
- [ ] Refresh several times. No console errors.

- [ ] Change the window selector and confirm the number updates.

- [ ] Click several month buttons and confirm the number and label update.
