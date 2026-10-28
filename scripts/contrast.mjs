import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../assets/css/tokens.css', import.meta.url), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const block = css.match(/html\[data-theme="retro"\]\s*\{([^}]*)\}/);
const vars = Object.fromEntries([...block[1].matchAll(/(--[\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));

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

const PAIRS = [
  ['--ink', '--surface', 4.5], ['--ink-2', '--surface', 4.5], ['--on-bg', '--bg', 4.5],
  ['--accent', '--surface', 4.5], ['--accent-ink', '--accent', 4.5],
  ['--line-strong', '--surface', 3], ['--focus', '--surface', 3],
];

let fails = 0;
for (const [fg, bg, min] of PAIRS) {
  const r = ratio(vars[fg], vars[bg]);
  if (r < min) { console.log(`FAIL ${fg} ${vars[fg]} on ${bg} ${vars[bg]} = ${r.toFixed(2)} (< ${min})`); fails++; }
}
console.log(fails ? `${fails} failing pair(s)` : 'all Retro token pairs pass AA');
process.exit(fails ? 1 : 0);
