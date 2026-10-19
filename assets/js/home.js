import { getExperiments, card, showError } from './lab.js';
const list = document.querySelector('#home-experiments');
try {
  const experiments = await getExperiments();
  list.replaceChildren(...experiments.slice(0, 3).map(card));
  document.querySelector('#resource-summary').textContent = `${experiments.length} 个资源位置 · ${experiments.filter(x => x.status === 'ready').length} 个实验可进入`;
} catch { showError(list); }
