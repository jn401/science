import { validEntry } from './paths.js';
export { validEntry };
export const statuses = { ready: '可进入', pending: '待接入', planned: '规划中' };
export const siteBase = new URL('../../', import.meta.url);

export function localURL(path) {
  const url = new URL(path, siteBase);
  if (url.origin !== siteBase.origin || !url.pathname.startsWith(siteBase.pathname)) {
    throw new Error('资源必须位于本站目录内');
  }
  return url.href;
}

export async function getExperiments() {
  const response = await fetch(localURL('data/experiments.json'));
  if (!response.ok) throw new Error('目录暂时无法读取');
  const entries = await response.json();
  if (!Array.isArray(entries) || entries.some(item => !statuses[item.status])) {
    throw new Error('目录内容格式有误');
  }
  return entries;
}

export function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function badge(status) {
  return el('span', `badge badge-${status}`, statuses[status]);
}

export function card(item) {
  const article = el('article', 'experiment-card');
  const art = el('a', 'card-art');
  art.href = localURL(`experiment.html?id=${encodeURIComponent(item.id)}`);
  art.setAttribute('aria-label', `查看${item.shortTitle}的模块说明`);
  const img = el('img');
  img.src = localURL(item.image);
  img.alt = item.imageAlt;
  img.width = 600;
  img.height = 450;
  img.loading = 'lazy';
  art.append(img, badge(item.status));
  const body = el('div', 'card-body');
  body.append(el('p', 'eyebrow', `${item.category} · ${item.grades.join(' / ')}`));
  const title = el('h3');
  const link = el('a', '', item.title);
  link.href = art.href;
  title.append(link);
  body.append(title, el('p', 'card-summary', item.summary));
  const foot = el('div', 'card-foot');
  foot.append(el('span', '', item.equipment[0]));
  const more = el('a', 'text-link', item.status === 'ready' ? '查看实验 →' : '查看模块 →');
  more.href = art.href;
  more.setAttribute('aria-label', `查看${item.shortTitle}模块`);
  foot.append(more);
  body.append(foot);
  article.append(art, body);
  return article;
}

export function showError(container, message = '实验目录暂时无法加载，请检查网络后重试。') {
  const box = el('div', 'empty-state');
  box.setAttribute('role', 'alert');
  box.append(el('h2', '', '暂时无法打开'), el('p', '', message));
  const retry = el('button', 'button button-primary', '重新加载');
  retry.addEventListener('click', () => location.reload());
  box.append(retry);
  container.replaceChildren(box);
}

const current = document.body.dataset.page;
const header = document.querySelector('[data-header]');
if (header) {
  header.innerHTML = `<div class="container header-inner"><a class="brand" href="${localURL('index.html')}" aria-label="科学实验室首页"><span class="brand-mark" aria-hidden="true">✳</span><span>附小 · 科学实验室<small>YUXI SCIENCE LAB</small></span></a><nav aria-label="主导航"><a href="${localURL('index.html')}" ${current === 'home' ? 'aria-current="page"' : ''}>首页</a><a href="${localURL('catalog.html')}" ${current === 'catalog' ? 'aria-current="page"' : ''}>实验目录</a><a href="${localURL('index.html#about')}">关于实验室</a></nav></div>`;
}
const principles = document.querySelector('[data-principles]');
if (principles) {
  principles.innerHTML = `<div class="container"><details class="principles"><summary><span class="principles-title"><span aria-hidden="true">!</span> 虚拟实验室原则</span><span class="principles-short">先观察，再记录，用证据解释。虚拟体验不能替代真实实验。</span><span class="principles-toggle">查看原则 <span aria-hidden="true">＋</span></span></summary><div class="principles-body"><ol><li><strong>虚实结合：</strong>虚拟实验帮助熟悉器材、练习观察，真实实验仍需在老师指导下开展。</li><li><strong>尊重证据：</strong>区分看到的现象和作出的解释，如实记录，不把预期当作结果。</li><li><strong>理解边界：</strong>模型是对现实的简化，不能代表所有真实情况。</li></ol></div></details></div>`;
}
const footer = document.querySelector('[data-footer]');
if (footer) {
  footer.innerHTML = `<div class="container footer-inner"><div><strong>玉溪师范学院附属小学科学实验室</strong><p>保持好奇，让每一次发现都有证据。</p></div><a href="${localURL('catalog.html')}">探索实验目录 <span aria-hidden="true">↗</span></a><small>科学家培养基地 · 虚拟实验资源</small></div>`;
}
