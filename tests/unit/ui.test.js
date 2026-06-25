import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../helpers/app-context.mjs';

let ctx;
let app;

beforeEach(() => {
  ctx = createApp();
  app = ctx.app;
});

afterEach(() => {
  ctx.close();
});

describe('UI state helpers', () => {
  it('validates DNS and proxy requirements for the stepper', () => {
    app.setLanguage('ru', false);
    app.state.dns.defaultNs = [];
    app.state.dns.nameservers = [];
    expect(app.validateStep(0)).toBe('Добавьте DNS-серверы, чтобы продолжить.');

    app.state.dns.defaultNs = ['9.9.9.9'];
    expect(app.validateStep(0)).toBe('Добавьте Nameservers (DoH/DoT), чтобы продолжить.');

    app.state.dns.nameservers = ['https://dns.quad9.net/dns-query'];
    expect(app.validateStep(0)).toBe('');
    expect(app.validateStep(1)).toBe('Добавьте прокси-сервер или подписку, чтобы продолжить.');

    app.state.proxyProviders = [{ name: 'sub-main', url: 'https://sub.example.com' }];
    expect(app.validateStep(1)).toBe('');
  });

  it('keeps CDN all-provider mutually exclusive with individual CDN providers', () => {
    app.toggleCdn('cloudflare');
    app.toggleCdn('aws');

    expect([...app.state.activeCdnProviders].sort()).toEqual(['aws', 'cloudflare']);
    expect(app.state.rules.map(rule => rule.payload).sort()).toEqual(['cdn-aws', 'cdn-cloudflare']);

    app.toggleCdn('all');

    expect([...app.state.activeCdnProviders]).toEqual(['all']);
    expect(app.state.rules.map(rule => rule.payload)).toEqual(['cdn-all']);
  });

  it('prioritizes Telegram rule rendering before other rules for stable sniffing config', () => {
    app.state.rules = [
      { type: 'DOMAIN-SUFFIX', payload: 'example.com', target: 'DIRECT' },
      { type: 'RULE-SET', payload: 'telegram', target: 'Proxy' }
    ];

    app.renderRules();

    expect(app.state.rules[0]).toMatchObject({ type: 'RULE-SET', payload: 'telegram' });
    expect(ctx.document.querySelector('#rules-list .rule-text').textContent).toBe('RULE-SET,telegram');
  });

  it('renders proxy names in rule target selectors and falls back when removed', () => {
    app.state.proxies = [
      { name: 'First', type: 'ss', server: 'first.example.com', port: 443 },
      { name: 'Second', type: 'ss', server: 'second.example.com', port: 443 }
    ];
    ctx.document.getElementById('rule-target').value = 'Second';
    app.renderTargetSelects();

    expect([...ctx.document.querySelectorAll('#rule-target option')].map(option => option.value)).toEqual([
      'Proxy',
      'First',
      'Second',
      'DIRECT',
      'REJECT'
    ]);

    app.state.proxies = [{ name: 'First', type: 'ss', server: 'first.example.com', port: 443 }];
    app.renderTargetSelects();

    expect(ctx.document.getElementById('rule-target').value).toBe('Proxy');
  });



  it('renders DNS and routing options derived from the provided Persian config', () => {
    app.renderDnsPresets('default');
    app.renderDnsPresets('ns');
    app.renderAllPresets();

    expect(ctx.document.getElementById('dns-default-presets').textContent).toContain('AdGuard');
    expect(ctx.document.getElementById('dns-default-presets').textContent).toContain('Google + Cloudflare + Quad9');
    expect(ctx.document.getElementById('dns-ns-presets').textContent).toContain('RethinkDNS');
    expect(ctx.document.getElementById('presets-services').textContent).toContain('Steam');
    expect(ctx.document.getElementById('presets-other').textContent).toContain('Iranian ads');
  });

  it('switches localization and updates static labels', () => {
    app.setLanguage('en', false);

    expect(app.state.lang).toBe('en');
    expect(ctx.document.getElementById('servers-title').textContent).toBe('Add Servers');
    expect(ctx.document.getElementById('btn-next').textContent).toContain('Next');
  });

  it('supports Persian localization and RTL document direction', () => {
    app.setLanguage('fa', false);

    expect(app.state.lang).toBe('fa');
    expect(ctx.document.documentElement.lang).toBe('fa');
    expect(ctx.document.documentElement.dir).toBe('rtl');
    expect(ctx.document.getElementById('servers-title').textContent).toBe('افزودن سرورها');
    expect(ctx.document.getElementById('btn-next').textContent).toContain('بعدی');
  });
});
