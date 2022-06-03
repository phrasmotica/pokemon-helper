# Deployment to Azure App Services

## Configuring app settings

Set the following app settings:
- `REACT_APP_API_URL` - base PokeAPI URL
- `REACT_APP_API_URL_GRAPHQL` - PokeAPI GraphQL URL

Set the following general settings:

- startup command - `npx serve -l 8080 build`

## Enabling HTTPS redirection

Enable HTTPS Only in the TLS/SSL settings panel.
