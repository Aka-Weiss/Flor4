import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { Script } from 'node:vm';

const html = readFileSync(new URL('index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('styles.css', import.meta.url), 'utf8');
const js = readFileSync(new URL('script.js', import.meta.url), 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
assert.equal(new Set(ids).size, ids.length, 'IDs devem ser únicos.');

for (const [, target] of html.matchAll(/href="#([^"]+)"/g)) {
  assert(ids.includes(target), `Destino interno ausente: ${target}`);
}
for (const [, asset] of (html + css).matchAll(/(?:src="|href="|url\(')(assets\/[^"')]+)/g)) {
  assert(existsSync(new URL(asset, import.meta.url)), `Asset ausente: ${asset}`);
}
assert.equal((html.match(/data-category=/g) || []).length, 3, 'O catálogo deve conter três buquês.');
assert(html.includes('lang="pt-BR"'), 'O idioma deve ser português brasileiro.');
assert(!/[\u0400-\u04ff]/u.test(html + js), 'Não deve restar conteúdo em russo.');
for (const [, category] of html.matchAll(/data-category="([^"]+)"/g)) {
  assert(html.includes(`data-filter="${category}"`), `Categoria sem filtro: ${category}`);
  assert(js.includes(`${category}:`), `Buquê sem descrição: ${category}`);
}
for (const [, key] of html.matchAll(/data-info="([^"]+)"/g)) {
  assert(js.includes(`${key}:`), `Informação sem conteúdo: ${key}`);
}
for (const price of ['189,00', '149,00', '289,00']) {
  assert(html.includes(`R$ ${price}`), `Preço ausente: ${price}`);
}
new Script(js);
console.log('OK: links internos, IDs, assets, três buquês e sintaxe JavaScript.');
