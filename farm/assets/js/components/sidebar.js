import { currentRoute } from '../router.js';

const menus = [
  { key: 'pests', label: '病虫害档案' },
  { key: 'fields', label: '田块管理' },
  { key: 'devices', label: '设备管理' },
  { key: 'stats', label: '健康统计' },
];

export function renderSidebar(container, onNavigate) {
  const active = currentRoute();
  const list = menus.map(m => `
    <li class="menu-item ${active === m.key ? 'active' : ''}" role="menuitem" tabindex="0" data-key="${m.key}">
      <span class="menu-label">${m.label}</span>
    </li>`).join('');
  container.innerHTML = `
    <nav class="sidebar" role="navigation" aria-label="主导航">
      <ul class="menu" role="menu">${list}</ul>
    </nav>`;

  container.querySelectorAll('.menu-item').forEach(el => {
    el.addEventListener('click', () => onNavigate(el.dataset.key));
    el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { onNavigate(el.dataset.key); } });
  });
}














