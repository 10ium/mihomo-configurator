**🌐 Language / Язык:** [English](README.md) | [Русский](README.ru.md)

# Mihomo Configurator

Браузерный конструктор для генерации YAML-конфигов `mihomo`.

Демо (GitHub Pages): https://123jjck.github.io/mihomo-configurator/

## Возможности

- Добавление прокси по ссылкам: `vless`, `vmess`, `ss`, `trojan`, `hysteria2`/`hy2`, `tuic`, `vpn://`
- Добавление WireGuard / AmneziaWG из `.conf` файлов
- Добавление подписок из URL `https://...`
- Настройка правил маршрутизации через пресеты (сервисы, CDN-провайдеры, Telegram, `ru-blocked`) и вручную
- Генерация конфигов под платформы:
  - `PC / Android / iOS` (FlClashX + Clash Mi)
  - профиль `Router (OpenWRT)` для SSClash
- Локализация интерфейса: русский и английский
  - По умолчанию язык выбирается по языку браузера
  - Язык можно переключать в шапке

## Использование

1. Откройте `index.html` в браузере.
2. Пройдите шаги:
   - DNS
   - Серверы
   - Правила
   - Скачивание
3. Скопируйте YAML из предпросмотра или скачайте `config.yaml`.

## Тестирование

```bash
npm install
npm run test:unit
npm run test:e2e
npm run build
```

- Unit-тесты покрывают парсеры ссылок прокси, WireGuard / AmneziaWG конфиги, генерацию YAML, повторную генерацию импортированного конфига и UI-состояния.
- Browser smoke-тесты запускают статическое приложение через Playwright и проверяют основной сценарий сборки конфига.
- GitHub Actions workflow прогоняет тесты, собирает `dist` и деплоит его на GitHub Pages из `main`.

## Структура проекта

- `index.html` - разметка интерфейса
- `app/style.css` - стили
- `app/state.js` - состояние, локализация, пресеты и общие helpers
- `app/parsers.js` - парсеры прокси, подписок и WireGuard
- `app/ui.js` - рендеринг UI и переходы состояния
- `app/generate.js` - генерация YAML для mihomo и импорт конфигов
- `tests/unit` - unit-тесты парсеров, генератора и UI-состояний
- `tests/e2e` - браузерные smoke-тесты Playwright
- `.github/workflows/test-and-deploy.yml` - CI и деплой GitHub Pages
