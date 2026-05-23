**🌐 Language / Язык:** [English](README.md) | [Русский](README.ru.md)

# Mihomo Configurator

A browser-based configurator for generating `mihomo` YAML configs.

Live demo (GitHub Pages): https://123jjck.github.io/mihomo-configurator/

## Features

- Add proxies from links: `vless`, `vmess`, `ss`, `trojan`, `hysteria2`/`hy2`, `tuic`, `vpn://`
- Add WireGuard / AmneziaWG proxies from `.conf` files
- Add subscription providers from `https://...` URLs
- Build routing rules with presets (services, CDN providers, Telegram, `ru-blocked`) and manual rules
- Generate platform-oriented configs:
  - `PC / Android / iOS` (FlClashX + Clash Mi)
  - `Router (OpenWRT)` profile for SSClash
- UI localization: Russian and English
  - Default language is detected from browser language
  - Language can be changed via the switcher in the header

## Usage

1. Open `index.html` in a browser.
2. Go through steps:
   - DNS
   - Servers
   - Rules
   - Download
3. Copy generated YAML or download `config.yaml`.

## Testing

```bash
npm install
npm run test:unit
npm run test:e2e
npm run build
```

- Unit tests cover proxy link parsers, WireGuard / AmneziaWG config parsing, YAML generation, import regeneration, and UI state helpers.
- Browser smoke tests run the static app with Playwright and verify the main config-building flow.
- The GitHub Actions workflow runs tests, builds `dist`, and deploys it to GitHub Pages from `main`.

## Project Structure

- `index.html` - UI markup
- `app/style.css` - styles
- `app/state.js` - state, localization, presets, and shared helpers
- `app/parsers.js` - proxy/subscription/WireGuard parsers
- `app/ui.js` - UI rendering and state transitions
- `app/generate.js` - mihomo YAML generation and import handling
- `tests/unit` - parser, generator, and UI-state unit tests
- `tests/e2e` - Playwright browser smoke tests
- `.github/workflows/test-and-deploy.yml` - CI and GitHub Pages deploy
