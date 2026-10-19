import { getExperiments, card, el, showError } from './lab.js';
const form = document.querySelector('#filters');
const list = document.querySelector('#experiment-list');
const count = document.querySelector('#result-count');
const query = new URLSearchParams(location.search);
const search = form.elements.q;
const category = form.elements.category;
const status = form.elements.status;
const clear = document.querySelector('#clear-filters');
let experiments;
try {
  experiments = await getExperiments();
  for (const name of new Set(experiments.map(x => x.category))) {
    const option = el('option', '', name);
    option.value = name;
    category.append(option);
  }
  search.value = query.get('q') || '';
  if ([...category.options].some(x => x.value === query.get('category'))) category.value = query.get('category');
  if ([...status.options].some(x => x.value === query.get('status'))) status.value = query.get('status');
  render();
} catch { count.textContent = '加载失败'; showError(list); }

function render() {
  if (!experiments) return;
  const term = search.value.trim().toLocaleLowerCase();
  const filtered = experiments.filter(item => (!category.value || item.category === category.value)
    && (!status.value || item.status === status.value)
    && `${item.title} ${item.shortTitle} ${item.summary} ${item.equipment.join(' ')} ${item.grades.join(' ')}`.toLocaleLowerCase().includes(term));
  count.textContent = `找到 ${filtered.length} 个模块`;
  const params = new URLSearchParams();
  for (const key of ['q', 'category', 'status']) if (form.elements[key].value) params.set(key, form.elements[key].value);
  history.replaceState(null, '', `${location.pathname}${params.size ? '?' + params : ''}`);
  clear.hidden = !params.size;
  if (filtered.length) list.replaceChildren(...filtered.map(card));
  else {
    const box = el('div', 'empty-state');
    box.append(el('span', 'empty-icon', '⌕'), el('h2', '', '还没有找到这个实验'), el('p', '', '换个关键词，或清除筛选，看看其他模块。'));
    const reset = el('button', 'button button-secondary', '清除全部筛选');
    reset.addEventListener('click', resetFilters);
    box.append(reset);
    list.replaceChildren(box);
  }
}
function resetFilters() { form.reset(); render(); search.focus(); }
form.addEventListener('submit', event => { event.preventDefault(); render(); });
form.addEventListener('input', event => { if (event.target === search) render(); });
form.addEventListener('change', event => { if (event.target instanceof HTMLSelectElement) render(); });
clear.addEventListener('click', resetFilters);
