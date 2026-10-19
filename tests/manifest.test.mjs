import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { validateManifest } from '../scripts/check.mjs';
import { validEntry } from '../assets/js/paths.js';
const manifest = JSON.parse(await readFile(new URL('../data/experiments.json', import.meta.url), 'utf8'));
test('真实目录遵守状态与入口契约', () => {
  assert.deepEqual(validateManifest(manifest), []);
});
test('模块 ID 不能重复，以免启动错误的实验', () => {
  assert.ok(validateManifest([manifest[0], manifest[0]]).some(x => x.includes('重复')));
});
test('已开放模块必须绑定同目录入口，未开放模块不能带启动链接', () => {
  assert.ok(validateManifest([{ ...manifest[0], status: 'ready' }]).length > 0);
  assert.ok(validateManifest([{ ...manifest[0], status: 'ready', entry: 'experiments/other/index.html' }]).length > 0);
  assert.ok(validateManifest([{ ...manifest[0], entry: 'experiments/microscope/original/index.html' }]).length > 0);
  assert.deepEqual(validateManifest([{ ...manifest[0], status: 'ready', entry: 'experiments/microscope/original/index.html' }]), []);
});
test('实验入口不能跳转站外或越过实验目录', () => {
  for (const bad of [null, 'https://example.com/a.html', '/experiments/a/index.html', 'experiments/a/../../index.html', 'javascript:alert(1)', 'experiments/a/index.html?x=1']) assert.equal(validEntry(bad), false);
  assert.equal(validEntry('experiments/microscope/original/index.html'), true);
});
