import { getExperiments, badge, el, localURL, validEntry, showError } from './lab.js';
const root = document.querySelector('#module-detail');
try {
  const data = await getExperiments();
  const item = data.find(x => x.id === new URLSearchParams(location.search).get('id'));
  if (!item) {
    document.title = '未找到模块 · 附小科学实验室';
    const box = el('div', 'empty-state');
    box.append(el('h1', '', '没有找到这个实验模块'), el('p', '', '这个链接可能已更改，请从目录重新选择。'));
    const back = el('a', 'button button-primary', '返回实验目录'); back.href = localURL('catalog.html');
    box.append(back); root.replaceChildren(box);
  } else {
    document.title = `${item.shortTitle} · 附小科学实验室`;
    const art = el('div', 'detail-art');
    const img = el('img'); img.src = localURL(item.image); img.alt = item.imageAlt; img.width = 600; img.height = 450;
    art.append(img, el('p', 'art-caption', '关键器材示意图'));
    const body = el('div', 'detail-body');
    body.append(badge(item.status), el('p', 'eyebrow', `${item.category} · ${item.grades.join(' / ')}`), el('h1', '', item.title), el('p', 'detail-description', item.description));
    body.append(el('h2', '', '认识这些器材'));
    const equipment = el('ul', 'equipment-list');
    for (const name of item.equipment) equipment.append(el('li', '', name));
    body.append(equipment, el('h2', '', '带着问题去观察'));
    const questions = el('ul', 'question-list');
    for (const question of item.questions) questions.append(el('li', '', question));
    body.append(questions);
    const status = el('div', `module-notice ${item.status === 'ready' ? 'module-ready' : ''}`);
    if (item.status === 'ready' && validEntry(item.entry)) {
      status.append(el('strong', '', '实验已接入'));
      const start = el('a', 'button button-primary', '进入实验 →');
      start.href = localURL(`launch.html?id=${encodeURIComponent(item.id)}`); status.append(start);
    } else {
      status.append(el('strong', '', item.status === 'pending' ? '原有实验程序待接入' : '实验正在规划中'), el('p', '', item.status === 'pending' ? '原始程序接入并完成检查后，这里将开放实验入口。' : '这里暂时没有可操作的虚拟实验，欢迎先探索其他模块。'));
    }
    body.append(status); root.replaceChildren(art, body);
  }
} catch { showError(root); }
