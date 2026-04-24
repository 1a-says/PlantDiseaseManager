import './router.js';
import { renderHeader } from './components/header.js';
import { renderSidebar } from './components/sidebar.js';
import { navigate, currentRoute } from './router.js';
import { showToast } from './utils/toast.js';

const headerEl = document.getElementById('app-header');
const sidebarEl = document.getElementById('app-sidebar');
const mainEl = document.getElementById('app-main');

renderHeader(headerEl);
renderSidebar(sidebarEl, (path) => navigate(path));

window.addEventListener('hashchange', () => {
  renderRoute();
  renderSidebar(sidebarEl, (path) => navigate(path)); // 重新渲染侧边栏以更新活跃状态
});
document.addEventListener('DOMContentLoaded', () => renderRoute());

async function renderRoute() {
  const route = currentRoute();
  mainEl.innerHTML = '';
  mainEl.classList.add('view-enter');

  try {
    if (route === 'fields') {
      const module = await import('./views/fields.js');
      await module.render(mainEl);
    } else if (route === 'pests') {
      const module = await import('./views/pests.js');
      await module.render(mainEl);
    } else if (route === 'stats') {
      const module = await import('./views/stats.js');
      await module.render(mainEl);
    } else if (route === 'devices') {
      const module = await import('./views/devices.js');
      await module.render(mainEl);
    } else {
      const module = await import('./views/pests.js');
      await module.render(mainEl);
    }
  } catch (err) {
    console.error(err);
    showToast('页面加载失败，请重试', 'error');
  } finally {
    requestAnimationFrame(() => {
      mainEl.classList.remove('view-enter');
      mainEl.classList.add('view-enter-active');
      setTimeout(() => mainEl.classList.remove('view-enter-active'), 350);
    });
  }
}







