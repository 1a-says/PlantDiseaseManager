import { navigate } from '../router.js';
import { showToast } from '../utils/toast.js';

export function renderHeader(container) {
  // 清除容器内容，避免重复渲染
  container.innerHTML = '';

  // 创建新的导航栏元素
  const headerElement = document.createElement('div');
  headerElement.innerHTML = `
    <style>
      /* 完全复制首页的导航栏样式 - 使用与首页相同的Tailwind类名 */
      .nav-link {
        position: relative;
        text-decoration: none;
        transition: all 0.3s ease;
        border-bottom: none !important;
      }
      
      .nav-link::before {
        display: none;
      }
      
      .nav-link::after {
        content: '';
        position: absolute;
        bottom: -8px;
        left: 0;
        width: 0;
        height: 2px;
        background: linear-gradient(90deg, #4CAF50, #2E7D32);
        transition: width 0.3s ease;
        border-radius: 1px;
      }
      
      .nav-link:hover {
        border-bottom: none !important;
        text-decoration: none !important;
      }
      
      .nav-link:hover::after {
        width: 100%;
      }
      
      .nav-link-active {
        color: #4CAF50 !important;
      }
      
      .nav-link-active::after {
        content: '';
        position: absolute;
        bottom: -8px;
        left: 0;
        width: 100%;
        height: 2px;
        background: linear-gradient(90deg, #4CAF50, #2E7D32);
        border-radius: 1px;
        animation: slideInFromLeft 0.5s ease;
      }
      
      @keyframes slideInFromLeft {
        0% { width: 0; }
        100% { width: 100%; }
      }
    </style>
    
    <!-- 导航栏 - 移除logo并调整布局 -->
    <header id="navbar" class="fixed w-full top-0 z-50 transition-all duration-300 bg-white shadow-md">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-center items-center py-4">
          <!-- 桌面端导航 - 居中 -->
          <nav class="hidden md:flex space-x-14">
            <a href="../index.html#hero" class="nav-link text-dark hover:text-tertiary transition-colors text-[1.3rem] font-semibold">首页</a>
            <a href="../zhishikepu/index.html" class="nav-link text-dark hover:text-tertiary transition-colors text-[1.3rem] font-semibold">虫病科普</a>
            <a href="../Plant_foliar_disease_and_pest_detection-main/src/datas/index.html" class="nav-link text-dark hover:text-tertiary transition-colors text-[1.35rem] font-semibold">病虫害识别</a>
            <a href="../prediction/enpre.html" class="nav-link text-dark hover:text-tertiary transition-colors text-[1.3rem] font-semibold">风险预测</a>
            <a href="../control/index.html" class="nav-link text-dark hover:text-tertiary transition-colors text-[1.3rem] font-semibold">智能防控</a>
            <a href="#" class="nav-link text-dark hover:text-tertiary transition-colors text-[1.3rem] font-semibold nav-link-active">数据管理</a>
          </nav>
        </div>
      </div>
    </header>
  `;

  // 将新元素添加到容器中
  container.appendChild(headerElement);

  // 导航链接事件处理
  const navLinks = headerElement.querySelectorAll('nav a');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href !== '#') {
      link.addEventListener('click', (e) => {
        // 对于外部链接或锚点，允许默认行为
        if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('#')) {
          return; // 允许默认行为
        }
        e.preventDefault();
        // 对于相对路径，使用当前页面的基础路径来解析
        const baseUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);
        const targetUrl = new URL(href, baseUrl);
        window.location.href = targetUrl.href;
      });
    }
  });

  // 移动端菜单切换
  const menuToggle = headerElement.querySelector('#menu-toggle');
  const mobileMenu = headerElement.querySelector('#mobile-menu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

}














