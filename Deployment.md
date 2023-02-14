# Deployment

## GitHub Pages

Run `npm run deploy -- -m "{commitMessage}"`, this should push the latest build of the app to the remote `gh-pages` branch and deploy it to GitHub Pages.

## Azure App Services

### Configuring app settings

Set the following general settings:

- startup command - `npx serve -l 8080 build`
- enable HTTPS Only
