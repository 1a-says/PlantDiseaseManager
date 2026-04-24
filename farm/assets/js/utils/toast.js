export function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const node = document.createElement('div');

  // 设置基础类名
  let className = 'toast';
  if (type === 'success') className += ' success';
  else if (type === 'warn') className += ' warn';
  else if (type === 'error') className += ' error';
  else className += ' info';

  node.className = className;
  node.setAttribute('role', 'status');
  node.textContent = message;

  // 添加到容器
  container.appendChild(node);

  // 触发浮现动画
  requestAnimationFrame(() => {
    node.classList.add('show');
  });

  // 3秒后开始消失动画
  setTimeout(() => {
    node.classList.remove('show');
    // 等待动画完成后移除元素
    setTimeout(() => {
      if (node.parentNode) {
        node.parentNode.removeChild(node);
      }
    }, 300);
  }, 3000);
}














