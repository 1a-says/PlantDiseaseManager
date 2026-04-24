import { showToast } from '../utils/toast.js';
import { createMockDevices, deviceCategories, getDeviceIcon } from '../data/devices.js';
import { showAddDeviceModal, showBatchMaintenanceModal, showBatchRemoveModal } from '../components/deviceModals.js';
import { showDeviceData, showDeviceSettings, showMaintenanceRecords } from '../components/deviceDetails.js';

// 全局变量
let devices = [];
let state = { filterCat: '全部', keyword: '', fieldFilter: '', selected: new Set() };
let renderGrid = null;

export async function render(container) {
  container.innerHTML = `
    <div style="display:flex;gap:12px;align-items:center;margin-bottom:16px">
      <button id="btn-add-dev" class="btn btn-primary" style="font-size:16px;padding:10px 16px;">＋ 添加设备</button>
      <select id="dev-category-filter" class="tag" aria-label="设备类型筛选" style="font-size:16px;padding:10px 12px;">
        <option value="全部">全部设备类型</option>
        <option value="病虫害监测">病虫害监测</option>
        <option value="气象监测">气象监测</option>
        <option value="防治设备">防治设备</option>
      </select>
      <select id="dev-field-filter" class="tag" aria-label="田块筛选" style="font-size:16px;padding:10px 12px;">
        <option value="">全部田块</option>
        <option value="F-001">F-001 玉米田</option>
        <option value="F-002">F-002 大豆田</option>
        <option value="F-003">F-003 棉花田</option>
        <option value="F-004">F-004 大豆田</option>
        <option value="F-005">F-005 棉花田</option>
        <option value="F-006">F-006 玉米田</option>
        <option value="F-007">F-007 大豆田</option>
        <option value="F-008">F-008 棉花田</option>
      </select>
      <input id="dev-search" class="tag" placeholder="搜索设备ID/名称" aria-label="搜索" style="font-size:16px;padding:10px 12px;" />
      <button id="btn-batch-maintain" class="btn btn-outline" style="font-size:16px;padding:10px 16px;">批量维护</button>
      <button id="btn-batch-remove" class="btn btn-outline" style="font-size:16px;padding:10px 16px;">批量移除</button>
    </div>
    <div style="margin-bottom:8px;color:var(--color-text-muted);font-size:16px;">已选 <span id="sel-count">0</span> 台</div>
    <div class="grid cols-4" id="dev-grid" aria-live="polite"></div>
  `;


  // 初始化设备数据
  devices = createMockDevices();
  state = { filterCat: '全部', keyword: '', fieldFilter: '', selected: new Set() };

  function filtered() {
    return devices.filter(d =>
      (state.filterCat === '全部' || d.category === state.filterCat) &&
      (state.fieldFilter === '' || d.fieldId === state.fieldFilter) &&
      (d.id.includes(state.keyword) || d.name.includes(state.keyword))
    );
  }

  const grid = container.querySelector('#dev-grid');
  renderGrid = function () {
    grid.innerHTML = '';
    filtered().forEach((d, idx) => grid.appendChild(deviceCard(d, idx)));
    updateSelectedCount();
  }

  function deviceCard(dev, idx) {
    const card = document.createElement('div');
    card.className = 'card device-card';
    card.setAttribute('draggable', 'true');
    card.dataset.id = dev.id;
    card.dataset.index = String(idx);
    card.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div style="display:flex;align-items:center;gap:8px"><strong style="font-size:18px;">${dev.name}</strong></div>
        <div style="display:flex;align-items:center;gap:8px">
          <input type="checkbox" aria-label="选择设备 ${dev.id}" ${state.selected.has(dev.id) ? 'checked' : ''}/>
          <span style="cursor:move" title="拖拽排序">⋮⋮</span>
        </div>
      </div>
      <div style="font-size:16px;">设备ID：${dev.id}</div>
      <div style="font-size:16px;">状态： <span class="pulse" title="${dev.status === 'online' ? '在线' : '离线'}" style="background:${dev.status === 'online' ? 'var(--color-success)' : 'var(--color-danger)'}"></span> ${dev.status === 'online' ? '在线' : '离线'}</div>
      <div style="font-size:16px;">位置：${dev.location}</div>
      <div style="display:flex;gap:8px;margin-top:4px">
        <button class="btn btn-outline" data-action="view-data" data-device-id="${dev.id}" style="font-size:14px;padding:6px 12px;">查看数据</button>
        <button class="btn btn-outline" data-action="settings" data-device-id="${dev.id}" style="font-size:14px;padding:6px 12px;">设置</button>
        <button class="btn btn-outline" data-action="maintenance" data-device-id="${dev.id}" style="font-size:14px;padding:6px 12px;">维护记录</button>
      </div>
    `;
    // 选择
    card.querySelector('input[type="checkbox"]').addEventListener('change', (e) => {
      if (e.target.checked) state.selected.add(dev.id); else state.selected.delete(dev.id); updateSelectedCount();
    });
    // 拖拽
    card.addEventListener('dragstart', (e) => { e.dataTransfer.setData('text/plain', dev.id); card.style.opacity = '0.5'; });
    card.addEventListener('dragend', () => { card.style.opacity = '1'; });
    card.addEventListener('dragover', (e) => { e.preventDefault(); });
    card.addEventListener('drop', (e) => {
      e.preventDefault();
      const fromId = e.dataTransfer.getData('text/plain');
      if (fromId && fromId !== dev.id) {
        const fromIdx = devices.findIndex(x => x.id === fromId);
        const toIdx = devices.findIndex(x => x.id === dev.id);
        const [mv] = devices.splice(fromIdx, 1);
        devices.splice(toIdx, 0, mv);
        renderGrid();
      }
    });

    // 绑定按钮事件
    card.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.target.dataset.action;
        const deviceId = e.target.dataset.deviceId;

        switch (action) {
          case 'view-data':
            showDeviceData(deviceId, devices);
            break;
          case 'settings':
            showDeviceSettings(deviceId, devices, renderGrid);
            break;
          case 'maintenance':
            showMaintenanceRecords(deviceId, devices);
            break;
        }
      });
    });

    return card;
  }

  function updateSelectedCount() {
    const selCountEl = container.querySelector('#sel-count');
    if (selCountEl) {
      selCountEl.textContent = String(state.selected.size);
    }
  }

  // 事件绑定
  container.querySelector('#dev-search').addEventListener('input', (e) => { state.keyword = e.target.value.trim(); renderGrid(); });
  container.querySelector('#dev-category-filter').addEventListener('change', (e) => { state.filterCat = e.target.value; renderGrid(); });
  container.querySelector('#dev-field-filter').addEventListener('change', (e) => { state.fieldFilter = e.target.value; renderGrid(); });
  container.querySelector('#btn-add-dev').addEventListener('click', () => showAddDeviceModal(devices, renderGrid));
  container.querySelector('#btn-batch-maintain').addEventListener('click', () => showBatchMaintenanceModal(devices, state, renderGrid));
  container.querySelector('#btn-batch-remove').addEventListener('click', () => showBatchRemoveModal(devices, state, renderGrid));

  renderGrid();
}