import { showToast } from '../utils/toast.js';
import { showPestDetails, showTreatmentRecords } from '../components/pestDetails.js';
import { showAddTreatmentRecordModal } from '../components/treatmentRecordModals.js';
import { createMockPests, fieldOptions } from '../data/pests.js';

// 获取最新的病虫害数据（每次调用都会重新加载localStorage中的数据）
function getPestData() {
  return createMockPests();
}

// 更新病虫害状态为最新处理记录的状态
function updatePestStatusFromLatestRecord(pest) {
  if (pest.treatmentRecords && pest.treatmentRecords.length > 0) {
    const latestRecord = pest.treatmentRecords[0];
    const result = latestRecord.result || latestRecord.status;

    // 将处理结果映射到标准状态
    if (result === '完全控制' || result === '已解决') {
      pest.status = '已解决';
    } else if (result === '部分控制' || result === '明显改善' || result === '处理中') {
      pest.status = '处理中';
    } else {
      pest.status = '待处理';
    }
  }
}

export async function render(container) {
  // 重新加载数据（包括从localStorage加载的新记录）
  const pestData = getPestData();

  // 更新所有病虫害的状态
  pestData.forEach(pest => updatePestStatusFromLatestRecord(pest));

  const totalPests = pestData.length;
  const pendingCount = pestData.filter(p => p.status === '待处理').length;
  const processingCount = pestData.filter(p => p.status === '处理中').length;
  const resolvedCount = pestData.filter(p => p.status === '已解决').length;

  container.innerHTML = `
    <div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">
        <input type="text" id="search-input" placeholder="搜索病虫害..." style="padding:16px 20px;border:1px solid var(--color-border);border-radius:8px;font-size:18px;min-width:220px;background:white;" />
      <div style="position:relative;display:inline-block;">
        <input type="date" id="date-from" placeholder="年/月/日" style="padding:16px 20px;padding-right:50px;border:1px solid var(--color-border);border-radius:8px;font-size:18px;background:white;min-width:140px;" />
        <span style="position:absolute;right:16px;top:50%;transform:translateY(-50%);color:var(--color-text-muted);pointer-events:none;font-size:18px;">📅</span>
      </div>
      <div style="position:relative;display:inline-block;">
        <input type="date" id="date-to" placeholder="年/月/日" style="padding:16px 20px;padding-right:50px;border:1px solid var(--color-border);border-radius:8px;font-size:18px;background:white;min-width:140px;" />
        <span style="position:absolute;right:16px;top:50%;transform:translateY(-50%);color:var(--color-text-muted);pointer-events:none;font-size:18px;">📅</span>
      </div>
      <div style="position:relative;display:inline-block;">
        <select id="field-filter" style="padding:16px 20px;padding-right:50px;border:1px solid var(--color-border);border-radius:8px;font-size:18px;background:white;min-width:160px;appearance:none;">
          <option value="">全部田块</option>
          ${fieldOptions.map(field => `<option value="${field.id}">${field.id} ${field.name}</option>`).join('')}
        </select>
        <span style="position:absolute;right:16px;top:50%;transform:translateY(-50%);color:var(--color-text-muted);pointer-events:none;font-size:18px;">▼</span>
      </div>
      <div style="position:relative;display:inline-block;">
        <select id="level-filter" style="padding:16px 20px;padding-right:50px;border:1px solid var(--color-border);border-radius:8px;font-size:18px;background:white;min-width:160px;appearance:none;">
          <option value="">全部严重程度</option>
          <option value="严重">严重</option>
          <option value="高">高</option>
          <option value="中">中</option>
          <option value="低">低</option>
        </select>
        <span style="position:absolute;right:16px;top:50%;transform:translateY(-50%);color:var(--color-text-muted);pointer-events:none;font-size:18px;">▼</span>
      </div>
      <div style="position:relative;display:inline-block;">
        <select id="status-filter" style="padding:16px 20px;padding-right:50px;border:1px solid var(--color-border);border-radius:8px;font-size:18px;background:white;min-width:140px;appearance:none;">
          <option value="">全部状态</option>
          <option value="待处理">待处理</option>
          <option value="处理中">处理中</option>
          <option value="已解决">已解决</option>
        </select>
        <span style="position:absolute;right:16px;top:50%;transform:translateY(-50%);color:var(--color-text-muted);pointer-events:none;font-size:18px;">▼</span>
      </div>
      <button id="clear-filters" style="padding:16px 24px;background:white;border:1px solid var(--color-border);border-radius:8px;cursor:pointer;font-size:18px;color:var(--color-text);">清除筛选</button>
    </div>
    <div class="grid cols-4" style="margin-bottom:20px">
      <div class="stat-card blue card"><div style="font-size:16px;">总记录数</div><div class="value" style="font-size:28px;">${totalPests}</div></div>
      <div class="stat-card orange card"><div style="font-size:16px;">待处理</div><div class="value" style="font-size:28px;">${pendingCount}</div></div>
      <div class="stat-card purple card"><div style="font-size:16px;">处理中</div><div class="value" style="font-size:28px;">${processingCount}</div></div>
      <div class="stat-card green card"><div style="font-size:16px;">已解决</div><div class="value" style="font-size:28px;">${resolvedCount}</div></div>
    </div>
    <div class="grid cols-4" id="pest-grid"></div>
    <div class="drawer" id="pest-drawer" aria-label="详情面板"></div>
  `;

  const grid = container.querySelector('#pest-grid');

  // 检查记录是否为收录的记录（可删除）
  function isCollectedRecord(pestId) {
    try {
      const collectedRecords = JSON.parse(localStorage.getItem('pestRecords') || '[]');
      return collectedRecords.some(r => r.id === pestId);
    } catch (error) {
      return false;
    }
  }

  // 创建病虫害卡片的函数
  function createPestCard(pest) {
    const card = document.createElement('div');
    card.className = 'card pest-card';
    card.dataset.pestId = pest.id;

    // 根据严重程度设置颜色
    let levelColor = 'var(--color-success)';
    if (pest.level === '严重') levelColor = 'var(--color-danger)';
    else if (pest.level === '高') levelColor = 'var(--color-warning)';
    else if (pest.level === '中') levelColor = 'var(--color-info)';

    card.innerHTML = `
      <!-- 标题和操作区域 -->
      <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:20px">
        <div style="flex:1">
          <h3 style="margin:0 0 12px 0;font-size:20px;font-weight:600;color:var(--color-text);line-height:1.2">${pest.title}</h3>
          <div style="display:flex;flex-direction:column;gap:8px">
            <div style="font-size:18px;color:var(--color-text-muted)">
              <strong style="color:var(--color-text-600)">发生田块：</strong>${pest.fieldId} ${pest.field}
            </div>
            <div style="font-size:18px;color:var(--color-text-muted)">
              <strong style="color:var(--color-text-600)">发生时间：</strong>${pest.date}
            </div>
            <div style="font-size:18px;color:var(--color-text-muted)">
              <strong style="color:var(--color-text-600)">处理状态：</strong>${pest.status}
            </div>
          </div>
        </div>
        <div style="display:flex;gap:6px;flex-shrink:0;margin-left:16px;align-items:center">
          <button class="btn btn-primary" data-action="view-details" data-pest-id="${pest.id}" style="font-size:14px;padding:6px 12px;border-radius:6px;">详情</button>
          <button class="btn btn-primary" data-action="delete-pest" data-pest-id="${pest.id}" style="font-size:14px;padding:6px 12px;border-radius:6px;">删除</button>
        </div>
      </div>

      <!-- 描述区域 -->
      <div style="margin-bottom:16px">
        <div style="font-size:17px;color:var(--color-text-muted);line-height:1.6">${pest.description}</div>
      </div>
    `;

    // 添加点击事件
    card.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON') return;
      showPestDetails(pest);
    });

    return card;
  }

  // 渲染病虫害列表
  function renderPestList(pestsToRender = pestData) {
    grid.innerHTML = '';

    // 添加病虫害卡片
    pestsToRender.forEach(pest => {
      grid.appendChild(createPestCard(pest));
    });
  }

  // 筛选功能
  function applyFilters() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const dateFrom = document.getElementById('date-from').value;
    const dateTo = document.getElementById('date-to').value;
    const fieldFilter = document.getElementById('field-filter').value;
    const levelFilter = document.getElementById('level-filter').value;
    const statusFilter = document.getElementById('status-filter').value;

    let filteredPests = pestData.filter(pest => {
      // 搜索筛选
      if (searchTerm && !pest.title.toLowerCase().includes(searchTerm) &&
        !pest.pest.toLowerCase().includes(searchTerm) &&
        !pest.field.toLowerCase().includes(searchTerm)) {
        return false;
      }

      // 日期筛选
      if (dateFrom && pest.date < dateFrom) return false;
      if (dateTo && pest.date > dateTo) return false;

      // 田块筛选
      if (fieldFilter && pest.fieldId !== fieldFilter) return false;

      // 严重程度筛选
      if (levelFilter && pest.level !== levelFilter) return false;

      // 状态筛选
      if (statusFilter && pest.status !== statusFilter) return false;

      return true;
    });

    renderPestList(filteredPests);
  }

  // 清除筛选
  function clearFilters() {
    document.getElementById('search-input').value = '';
    document.getElementById('date-from').value = '';
    document.getElementById('date-to').value = '';
    document.getElementById('field-filter').value = '';
    document.getElementById('level-filter').value = '';
    document.getElementById('status-filter').value = '';
    renderPestList();
  }

  // 绑定事件
  document.getElementById('search-input').addEventListener('input', applyFilters);
  document.getElementById('date-from').addEventListener('change', applyFilters);
  document.getElementById('date-to').addEventListener('change', applyFilters);
  document.getElementById('field-filter').addEventListener('change', applyFilters);
  document.getElementById('level-filter').addEventListener('change', applyFilters);
  document.getElementById('status-filter').addEventListener('change', applyFilters);
  document.getElementById('clear-filters').addEventListener('click', clearFilters);

  // 绑定按钮事件
  grid.addEventListener('click', (e) => {
    const action = e.target.dataset.action || e.target.closest('[data-action]')?.dataset.action;
    const pestId = e.target.dataset.pestId || e.target.closest('[data-pest-id]')?.dataset.pestId;

    if (!action || !pestId) return;

    const pest = pestData.find(p => p.id === pestId);
    if (!pest) return;

    switch (action) {
      case 'view-details':
        showPestDetails(pestId, pestData);
        break;
      case 'delete-pest':
        handleDeletePest(pestId, pest);
        break;
    }
  });

  // 删除病虫害记录
  function handleDeletePest(pestId, pest) {
    // 确认删除
    if (!confirm(`确定要删除"${pest.title}"这条记录吗？此操作不可恢复。`)) {
      return;
    }

    try {
      // 检查是否为收录的记录
      const isCollected = isCollectedRecord(pestId);

      if (isCollected) {
        // 从localStorage中删除（收录的记录）
        const collectedRecords = JSON.parse(localStorage.getItem('pestRecords') || '[]');
        const updatedRecords = collectedRecords.filter(r => r.id !== pestId);
        localStorage.setItem('pestRecords', JSON.stringify(updatedRecords));
      }

      // 重新加载数据（从localStorage和mock数据）
      const updatedPestData = getPestData();
      updatedPestData.forEach(p => updatePestStatusFromLatestRecord(p));

      // 从数据中移除被删除的记录
      const index = updatedPestData.findIndex(p => p.id === pestId);
      if (index !== -1) {
        updatedPestData.splice(index, 1);
      }

      // 更新pestData引用
      pestData.length = 0;
      pestData.push(...updatedPestData);

      // 重新渲染列表（使用当前筛选条件）
      const currentFilters = {
        search: document.getElementById('search-input').value,
        dateFrom: document.getElementById('date-from').value,
        dateTo: document.getElementById('date-to').value,
        field: document.getElementById('field-filter').value,
        level: document.getElementById('level-filter').value,
        status: document.getElementById('status-filter').value
      };

      // 应用筛选
      const filteredPests = pestData.filter(p => {
        const searchTerm = currentFilters.search.toLowerCase();
        if (searchTerm && !p.title.toLowerCase().includes(searchTerm) &&
          !p.pest.toLowerCase().includes(searchTerm) &&
          !p.field.toLowerCase().includes(searchTerm)) {
          return false;
        }
        if (currentFilters.dateFrom && p.date < currentFilters.dateFrom) return false;
        if (currentFilters.dateTo && p.date > currentFilters.dateTo) return false;
        if (currentFilters.field && p.fieldId !== currentFilters.field) return false;
        if (currentFilters.level && p.level !== currentFilters.level) return false;
        if (currentFilters.status && p.status !== currentFilters.status) return false;
        return true;
      });

      renderPestList(filteredPests);

      // 更新统计数据
      const totalPests = pestData.length;
      const pendingCount = pestData.filter(p => p.status === '待处理').length;
      const processingCount = pestData.filter(p => p.status === '处理中').length;
      const resolvedCount = pestData.filter(p => p.status === '已解决').length;

      // 更新统计卡片
      const statCards = container.querySelectorAll('.stat-card .value');
      if (statCards.length >= 4) {
        statCards[0].textContent = totalPests;
        statCards[1].textContent = pendingCount;
        statCards[2].textContent = processingCount;
        statCards[3].textContent = resolvedCount;
      }

      // 显示成功消息
      showToast(`已删除"${pest.title}"记录`, 'success');
    } catch (error) {
      console.error('删除记录失败:', error);
      showToast('删除失败，请重试', 'error');
    }
  }

  // 初始渲染
  renderPestList();

  // 监听新记录添加事件，自动刷新页面
  const handlePestRecordAdded = async (event) => {
    const newRecord = event.detail;
    console.log('数据管理模块收到新病虫害记录:', newRecord);
    console.log('记录详情:', {
      id: newRecord.id,
      title: newRecord.title,
      fieldId: newRecord.fieldId,
      field: newRecord.field,
      pest: newRecord.pest,
      date: newRecord.date
    });

    // 显示提示消息
    const recordTitle = newRecord.title || newRecord.pest || '未知病虫害';
    showToast(`新记录已收录：${recordTitle}`, 'success');

    // 重新渲染页面以显示新记录
    // 注意：这里需要重新调用render，但由于render是async函数，我们需要重新导入并调用
    // 为了简化，我们直接重新加载数据并更新列表
    const updatedPestData = getPestData();
    updatedPestData.forEach(pest => updatePestStatusFromLatestRecord(pest));

    // 更新统计数据
    const totalPests = updatedPestData.length;
    const pendingCount = updatedPestData.filter(p => p.status === '待处理').length;
    const processingCount = updatedPestData.filter(p => p.status === '处理中').length;
    const resolvedCount = updatedPestData.filter(p => p.status === '已解决').length;

    // 更新统计卡片
    const statCards = container.querySelectorAll('.stat-card .value');
    if (statCards.length >= 4) {
      statCards[0].textContent = totalPests;
      statCards[1].textContent = pendingCount;
      statCards[2].textContent = processingCount;
      statCards[3].textContent = resolvedCount;
    }

    // 更新列表（使用当前筛选条件）
    const currentFilters = {
      search: document.getElementById('search-input').value,
      dateFrom: document.getElementById('date-from').value,
      dateTo: document.getElementById('date-to').value,
      field: document.getElementById('field-filter').value,
      level: document.getElementById('level-filter').value,
      status: document.getElementById('status-filter').value
    };

    // 应用筛选
    const filteredPests = updatedPestData.filter(pest => {
      const searchTerm = currentFilters.search.toLowerCase();
      if (searchTerm) {
        const titleMatch = pest.title ? pest.title.toLowerCase().includes(searchTerm) : false;
        const pestMatch = pest.pest ? pest.pest.toLowerCase().includes(searchTerm) : false;
        const fieldMatch = pest.field ? pest.field.toLowerCase().includes(searchTerm) : false;
        if (!titleMatch && !pestMatch && !fieldMatch) {
          return false;
        }
      }
      if (currentFilters.dateFrom && pest.date < currentFilters.dateFrom) return false;
      if (currentFilters.dateTo && pest.date > currentFilters.dateTo) return false;
      if (currentFilters.field && pest.fieldId !== currentFilters.field) return false;
      if (currentFilters.level && pest.level !== currentFilters.level) return false;
      if (currentFilters.status && pest.status !== currentFilters.status) return false;
      return true;
    });

    // 重新渲染列表（确保grid变量在作用域内）
    const currentGrid = container.querySelector('#pest-grid');
    if (currentGrid) {
      // 重新定义renderPestList以使用当前grid
      const renderUpdatedList = (pestsToRender) => {
        currentGrid.innerHTML = '';
        pestsToRender.forEach(pest => {
          currentGrid.appendChild(createPestCard(pest));
        });
      };
      renderUpdatedList(filteredPests);
    }
  };

  // 添加事件监听器（移除旧的监听器以避免重复）
  window.removeEventListener('pestRecordAdded', handlePestRecordAdded);
  window.addEventListener('pestRecordAdded', handlePestRecordAdded);
}