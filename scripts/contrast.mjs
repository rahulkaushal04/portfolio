// WCAG AA check over the theme tokens. Usage: node scripts/contrast.mjs
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../assets/css/tokens.css', import.meta.url), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const blocks = [...css.matchAll(/([^{}]+)\{([^}]*)\}/g)].map(([, sel, body]) => ({
  sel: sel.trim(),
  vars: Object.fromEntries([...body.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()])),
}));
const pick = (test) => Object.assign({}, ...blocks.filter((b) => test(b.sel)).map((b) => b.vars));

const base = pick((s) => s.startsWith('html,'));
const worlds = {
  'professional-light': base,
  'professional-dark': { ...base, ...pick((s) => s.includes('data-mode="dark"')) },
};
for (const t of ['retro', 'hallownest', 'souls', 'grandline']) {
  worlds[t] = { ...base, ...pick((s) => s === `html[data-theme="${t}"]`) };
}
worlds['grandline-band'] = { ...worlds.grandline, ...pick((s) => s.endsWith('.band')) };

const lum = (hex) => {
  const n = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

// [foreground, background, minimum]
const PAIRS = [
  ['--ink', '--bg', 4.5], ['--ink', '--surface', 4.5],
  ['--ink-2', '--bg', 4.5], ['--ink-2', '--surface', 4.5],
  ['--on-bg', '--bg', 4.5],
  ['--accent', '--bg', 4.5], ['--accent', '--surface', 4.5],
  ['--accent-ink', '--accent', 4.5],
  ['--line-strong', '--bg', 3], ['--line-strong', '--surface', 3],
  ['--focus', '--bg', 3], ['--focus', '--surface', 3],
];
// Professional alternates tonal bands; text must hold on them too.
const BAND_PAIRS = [['--ink', '--band', 4.5], ['--ink-2', '--band', 4.5], ['--accent', '--band', 4.5], ['--line-strong', '--band', 3], ['--surface', '--band', 1.0]];

let fails = 0;
for (const [name, v] of Object.entries(worlds)) {
  for (const [fg, bg, min] of name.startsWith('professional') ? [...PAIRS, ...BAND_PAIRS] : PAIRS) {
    // Retro puts every control inside a grey window; only --on-bg text touches the teal desktop.
    if (name === 'retro' && bg === '--bg' && fg !== '--on-bg') continue;
    if (!v[fg] || !v[bg]) { console.log(`MISSING ${name} ${fg}/${bg}`); fails++; continue; }
    const r = ratio(v[fg], v[bg]);
    if (r < min) { console.log(`FAIL ${name}: ${fg} ${v[fg]} on ${bg} ${v[bg]} = ${r.toFixed(2)} (< ${min})`); fails++; }
  }
}
console.log(fails ? `${fails} failing pair(s)` : `all token pairs pass AA across ${Object.keys(worlds).length} worlds`);
process.exit(fails ? 1 : 0);
