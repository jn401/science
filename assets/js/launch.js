import { getExperiments, validEntry, localURL, el, showError } from './lab.js';
const root = document.querySelector('#experiment-stage');
try {
  const item = (await getExperiments()).find(x => x.id === new URLSearchParams(location.search).get('id'));
  if (!item || item.status !== 'ready' || !validEntry(item.entry)) {
    const box = el('div', 'empty-state');
    box.append(el('h1', '', '这个实验暂未开放'), el('p', '', '请从目录查看实验接入状态。'));
    const back = el('a', 'button button-primary', '返回实验目录'); back.href = localURL('catalog.html'); box.append(back);
    root.replaceChildren(box);
  } else {
    document.title = `${item.shortTitle} · 实验中`;
    document.querySelector('#stage-title').textContent = item.shortTitle;
    const response = await fetch(localURL(item.entry), { method: 'HEAD' });
    if (!response.ok) throw new Error('实验文件暂时无法访问，请返回目录或稍后重试。');
    const frame = el('iframe', 'experiment-frame');
    frame.title = item.title;
    frame.allowFullscreen = true;
    frame.src = localURL(item.entry);
    root.replaceChildren(frame);
    const fullscreen = document.querySelector('#fullscreen');
    if (root.requestFullscreen && document.fullscreenEnabled) {
      fullscreen.hidden = false;
      fullscreen.addEventListener('click', async () => {
        try { await root.requestFullscreen(); } catch { document.querySelector('#stage-hint').textContent = '此浏览器无法进入全屏，可以尝试横屏或单独打开实验。'; }
      });
    }
    const standalone = document.querySelector('#standalone');
    standalone.href = frame.src; standalone.hidden = false;
  }
} catch (error) { showError(root, error.message); }
