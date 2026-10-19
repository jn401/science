import { readFile, access, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { validEntry } from '../assets/js/paths.js';

export const projectRoot = fileURLToPath(new URL('../', import.meta.url));
export const publicFiles = ['index.html', 'catalog.html', 'experiment.html', 'launch.html', '404.html', '.nojekyll', 'assets', 'data', 'experiments'];

export function validateManifest(items) {
  if (!Array.isArray(items)) return ['目录必须是数组'];
  const errors = [], ids = new Set();
  for (const [i, item] of items.entries()) {
    const label = item?.id || `第 ${i + 1} 项`;
    if (!item || typeof item !== 'object') { errors.push(`${label}: 无效模块`); continue; }
    if (typeof item.id !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.id)) errors.push(`${label}: ID 格式错误`);
    if (ids.has(item.id)) errors.push(`${label}: ID 重复`);
    ids.add(item.id);
    for (const key of ['title', 'shortTitle', 'category', 'summary', 'description', 'imageAlt']) {
      if (typeof item[key] !== 'string' || !item[key].trim()) errors.push(`${label}: 缺少 ${key}`);
    }
    for (const key of ['equipment', 'questions', 'grades']) {
      if (!Array.isArray(item[key]) || !item[key].length || item[key].some(x => typeof x !== 'string' || !x.trim())) errors.push(`${label}: ${key} 应为非空文字数组`);
    }
    if (typeof item.image !== 'string' || !/^assets\/images\/[a-zA-Z0-9_./-]+\.(svg|png|jpe?g|webp)$/.test(item.image) || item.image.split('/').includes('..')) errors.push(`${label}: 图片须为站内 assets/images 文件`);
    if (!['ready', 'pending', 'planned'].includes(item.status)) errors.push(`${label}: 未知状态`);
    if (item.status === 'ready' && (!validEntry(item.entry) || !item.entry.startsWith(`experiments/${item.id}/`))) errors.push(`${label}: 开放模块必须有同目录的真实 HTML 入口`);
    if (item.status !== 'ready' && item.entry !== null) errors.push(`${label}: 未开放模块 entry 必须为 null`);
  }
  return errors;
}

export async function walk(dir) {
  const results = [];
  for (const file of await readdir(dir, { withFileTypes: true })) {
    if (file.name.startsWith('.') && file.name !== '.nojekyll') continue;
    const name = path.join(dir, file.name);
    if (file.isSymbolicLink()) throw new Error(`不支持符号链接: ${name}`);
    if (file.isDirectory()) results.push(...await walk(name));
    else results.push(name);
  }
  return results;
}

export async function check() {
  const entries = JSON.parse(await readFile(path.join(projectRoot, 'data/experiments.json'), 'utf8'));
  const errors = validateManifest(entries);
  for (const entry of entries) {
    for (const file of [entry.image, ...(entry.status === 'ready' ? [entry.entry] : [])]) {
      if (typeof file !== 'string') continue;
      const absolute = path.resolve(projectRoot, file);
      if (!absolute.startsWith(projectRoot)) { errors.push(`路径越界: ${file}`); continue; }
      try { await access(absolute); } catch { errors.push(`资源不存在: ${file}`); }
    }
  }
  for (const file of await walk(path.join(projectRoot, 'assets/js'))) {
    if (!file.endsWith('.js')) continue;
    const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
    if (result.status !== 0) errors.push(result.stderr);
  }
  for (const file of publicFiles.filter(x => x.endsWith('.html'))) {
    const html = await readFile(path.join(projectRoot, file), 'utf8');
    if (!html.includes('name="viewport"') || !html.includes('lang="zh-CN"')) errors.push(`${file}: 缺少移动端或语言配置`);
    for (const match of html.matchAll(/(?:src|href)="([^"#?]+)(?:[?#][^"]*)?"/g)) {
      const ref = match[1];
      if (ref.startsWith('/') || /^[a-z]+:/i.test(ref)) continue;
      try { await access(path.resolve(projectRoot, ref)); } catch { errors.push(`${file}: 链接不存在 ${ref}`); }
    }
  }
  if (errors.length) throw new Error(errors.join('\n'));
  console.log(`检查通过：${entries.length} 个模块，${entries.filter(x => x.status === 'ready').length} 个已开放；入口、图片、页面链接和脚本语法有效。`);
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await check();
