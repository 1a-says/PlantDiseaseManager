import { showToast } from '../utils/toast.js';
import { initAIDiagnosisButton } from '../components/aiDiagnosis.js';

function createToolbar() {
  const wrap = document.createElement('div');
  wrap.style.display = 'flex';
  wrap.style.gap = '12px';
  wrap.style.alignItems = 'center';
  wrap.style.marginBottom = '16px';
  wrap.innerHTML = `
    <button class="btn btn-primary" id="btn-add" style="font-size:16px;padding:12px 20px;background:#4CAF50;border:none;border-radius:8px;color:white;cursor:pointer;">＋ 添加田块</button>
    <select id="filter-crop" class="tag" aria-label="按作物筛选" style="font-size:16px;padding:12px 16px;background:#f5f5f5;border:1px solid #ddd;border-radius:8px;cursor:pointer;">
      <option value="">全部作物</option>
      <option>玉米</option>
      <option>大豆</option>
      <option>棉花</option>
    </select>
    <select id="filter-health" class="tag" aria-label="按健康度筛选" style="font-size:16px;padding:12px 16px;background:#f5f5f5;border:1px solid #ddd;border-radius:8px;cursor:pointer;">
      <option value="">全部健康度</option>
      <option value="healthy">无病虫害</option>
      <option value="warning">轻微感染</option>
      <option value="danger">中度感染</option>
      <option value="severe">重度感染</option>
      <option value="critical">严重感染</option>
    </select>
    <select id="sort-by" class="tag" aria-label="按检测时间排序" style="font-size:16px;padding:12px 16px;background:#f5f5f5;border:1px solid #ddd;border-radius:8px;cursor:pointer;">
      <option value="name">按作物名称</option>
      <option value="id">按田块编号</option>
      <option value="area">按面积</option>
      <option value="health">按健康度</option>
    </select>
    <input id="search-field" placeholder="搜索田块名称" aria-label="搜索田块名称" style="font-size:16px;padding:12px 16px;border:1px solid #ddd;border-radius:8px;background:white;width:200px;"/>
    <button class="btn btn-outline" id="export" style="font-size:16px;padding:12px 20px;background:#f5f5f5;border:1px solid #ddd;border-radius:8px;color:#333;cursor:pointer;">导出</button>
  `;
  return wrap;
}

// 根据实际田块分布生成的模拟数据
const baseFieldsData = [
  // 上排4个田块 - 根据图片中的实际分布
  {
    id: 'F-001',
    crop: '玉米',
    area: 18.0, // L形田块，比F-002小
    time: '今天 08:45',
    soilType: '水稻土',
    irrigation: '滴灌系统',
    lastHarvest: '2024年10月15日',
    expectedYield: 1800, // 减产20%
    plantingDate: '2024年3月25日',
    variety: '登海605',
    deviceCount: 3, // 设备正常
    pestCount: 1, // 当前活跃病虫害（P-001处理中）
    weatherData: {
      temperature: 28.5, // 高温
      humidity: 85, // 高湿度
      rainfall: 15.2, // 过量降雨
      sunshine: 4.2 // 日照不足
    }
  },

  {
    id: 'F-002',
    crop: '大豆',
    area: 24.0, // 矩形田块，比F-001大，与F-003接近
    time: '今天 09:20',
    soilType: '水稻土',
    irrigation: '喷灌',
    lastHarvest: '2024年9月28日',
    expectedYield: 1920,
    plantingDate: '2024年4月15日',
    variety: '中黄13',
    deviceCount: 4,
    pestCount: 0, // 无活跃病虫害（P-006, P-007已解决）
    weatherData: {
      temperature: 22.8,
      humidity: 63,
      rainfall: 7.5,
      sunshine: 7.2
    }
  },

  {
    id: 'F-003',
    crop: '棉花',
    area: 32.0, // L形田块，面积较大
    time: '昨天 16:30',
    soilType: '水稻土',
    irrigation: '滴灌系统',
    lastHarvest: '2024年10月30日',
    expectedYield: 960, // 减产25%
    plantingDate: '2024年4月10日',
    variety: '鄂棉18',
    deviceCount: 2, // 设备正常
    pestCount: 2, // 当前活跃病虫害（P-002待处理，P-003处理中）
    weatherData: {
      temperature: 26.8, // 高温
      humidity: 78, // 高湿度
      rainfall: 18.5, // 过量降雨
      sunshine: 3.8 // 日照严重不足
    }
  },

  {
    id: 'F-004',
    crop: '大豆',
    area: 6.0, // 小方形田块，面积最小
    time: '今天 10:20',
    soilType: '水稻土',
    irrigation: '滴灌系统',
    lastHarvest: '2024年9月25日',
    expectedYield: 720,
    plantingDate: '2024年4月20日',
    variety: '中黄13',
    deviceCount: 2,
    pestCount: 0, // 无活跃病虫害（P-008, P-009已解决）
    weatherData: {
      temperature: 21.8,
      humidity: 69,
      rainfall: 8.8,
      sunshine: 6.2
    }
  },

  // 下排田块 - 按照图片中的颜色分块
  {
    id: 'F-005',
    crop: '棉花',
    area: 26.0, // 矩形田块，与F-006接近
    time: '今天 14:30',
    soilType: '水稻土',
    irrigation: '喷灌',
    lastHarvest: '2024年11月5日',
    expectedYield: 1040,
    plantingDate: '2024年4月5日',
    variety: '鄂棉18',
    deviceCount: 3,
    pestCount: 0, // 无活跃病虫害（P-015, P-016, P-017已解决）
    weatherData: {
      temperature: 24.2,
      humidity: 68,
      rainfall: 6.8,
      sunshine: 7.5
    }
  },

  {
    id: 'F-006',
    crop: '玉米',
    area: 25.0, // 矩形田块，比F-003小
    time: '今天 11:15',
    soilType: '水稻土',
    irrigation: '喷灌',
    lastHarvest: '2024年10月20日',
    expectedYield: 3000,
    plantingDate: '2024年3月30日',
    variety: '登海605',
    deviceCount: 3,
    pestCount: 0, // 无活跃病虫害（P-018, P-019, P-020已解决）
    weatherData: {
      temperature: 25.1,
      humidity: 78,
      rainfall: 12.5,
      sunshine: 6.8
    }
  },

  {
    id: 'F-007',
    crop: '大豆',
    area: 15.0, // 矩形田块，面积较小
    time: '今天 13:10',
    soilType: '水稻土',
    irrigation: '滴灌系统',
    lastHarvest: '2024年9月30日',
    expectedYield: 900, // 减产25%
    plantingDate: '2024年4月25日',
    variety: '中黄13',
    deviceCount: 1, // 设备故障
    pestCount: 1, // 当前活跃病虫害（P-004处理中）
    weatherData: {
      temperature: 25.2, // 高温
      humidity: 72, // 高湿度
      rainfall: 12.8, // 过量降雨
      sunshine: 5.1 // 日照不足
    }
  },

  {
    id: 'F-008',
    crop: '棉花',
    area: 20.0, // 矩形田块
    time: '今天 15:45',
    soilType: '水稻土',
    irrigation: '喷灌',
    lastHarvest: '2024年11月10日',
    expectedYield: 800,
    plantingDate: '2024年4月8日',
    variety: '鄂棉18',
    deviceCount: 3,
    pestCount: 1, // 当前活跃病虫害（P-005待处理）
    weatherData: {
      temperature: 23.5,
      humidity: 75,
      rainfall: 9.2,
      sunshine: 6.8
    }
  }
];

// 数据待计算健康度
const baseFieldsWithNames = baseFieldsData.map(field => ({
  ...field,
  name: `${field.crop}田`
}));

// 生成田块数据（在calculateHealthScore函数定义之后调用）
let mockFields = [];

// 计算田块健康度并初始化mockFields
function initializeMockFields() {
  mockFields = baseFieldsWithNames.map(field => ({
    ...field,
    health: calculateHealthScore(field)
  }));
}

function renderFieldList(container, data) {
  const left = document.createElement('div');
  left.style.width = '60%';
  left.style.paddingRight = '12px';
  left.style.display = 'grid';
  left.style.gap = '12px';
  left.style.maxHeight = '100vh';
  left.style.overflowY = 'auto';
  left.style.paddingBottom = '20px';

  data.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card field-card';
    card.setAttribute('data-field-id', item.id);
    // 根据作物类型选择图片 - 玉米田显示yumi.jpg，大豆田显示dadou.jpg，棉花田显示mianhua.jpg
    const isCornField = item.crop === '玉米';
    const isSoybeanField = item.crop === '大豆';
    const isCottonField = item.crop === '棉花';
    card.innerHTML = `
      <div class="field-thumb">
        ${isCornField ?
        `<img src="assets/images/field/yumi.jpg" alt="${item.name}" onerror="console.log('图片加载失败:', this.src); this.style.display='none'; this.nextElementSibling.style.display='flex';" onload="console.log('图片加载成功:', this.src);"/><div class="field-placeholder" style="display:none;width:100%;height:100%;background:linear-gradient(135deg,#E8F5E9,#C8E6C9);align-items:center;justify-content:center;color:var(--color-text-muted);font-size:12px">${item.crop}</div>` :
        isSoybeanField ?
          `<img src="assets/images/field/dadou.jpg" alt="${item.name}" onerror="console.log('图片加载失败:', this.src); this.style.display='none'; this.nextElementSibling.style.display='flex';" onload="console.log('图片加载成功:', this.src);"/><div class="field-placeholder" style="display:none;width:100%;height:100%;background:linear-gradient(135deg,#E8F5E9,#C8E6C9);align-items:center;justify-content:center;color:var(--color-text-muted);font-size:12px">${item.crop}</div>` :
          isCottonField ?
            `<img src="assets/images/field/mianhua.jpg" alt="${item.name}" onerror="console.log('图片加载失败:', this.src); this.style.display='none'; this.nextElementSibling.style.display='flex';" onload="console.log('图片加载成功:', this.src);"/><div class="field-placeholder" style="display:none;width:100%;height:100%;background:linear-gradient(135deg,#E8F5E9,#C8E6C9);align-items:center;justify-content:center;color:var(--color-text-muted);font-size:12px">${item.crop}</div>` :
            `<div class="field-placeholder" style="width:100%;height:100%;background:linear-gradient(135deg,#E8F5E9,#C8E6C9);display:flex;align-items:center;justify-content:center;color:var(--color-text-muted);font-size:12px">${item.crop}</div>`
      }
      </div>
      <div class="field-meta">
        <div style="display:flex;align-items:center;gap:8px;justify-content:space-between">
          <strong style="font-size:18px;">${item.id} ${item.name}</strong>
        </div>
         <div style="display:flex;gap:16px;font-size:16px;margin:6px 0;align-items:center">
           <span>${item.area} 亩</span>
           <span>${item.irrigation}</span>
           <span>${item.soilType}</span>
        </div>
        <div style="display:flex;align-items:center;gap:12px;margin:6px 0;">
          <span style="font-size:14px;color:var(--color-text-muted);min-width:80px;">健康度评估</span>
          <div class="health-bar" aria-label="健康度 ${item.health}%" style="flex:1;height:10px;"><div class="inner" style="width:${item.health}%;background:${healthColor(item.health)}"></div></div>
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="font-size:14px;font-weight:600;color:var(--color-text);">${item.health}%</span>
            <span class="tag ${tagByHealth(item.health)}" style="font-size:14px;padding:4px 8px;">${statusByHealth(item.health)}</span>
          </div>
        </div>
      </div>`;
    card.addEventListener('click', (e) => {
      // 如果点击的是AI诊断按钮，不触发卡片点击事件
      if (e.target.dataset.action === 'ai-diagnosis') {
        e.stopPropagation();
        // 导入AI诊断组件并显示
        import('../components/aiDiagnosis.js').then(module => {
          module.showAIDiagnosisModal(item);
        });
        return;
      }

      // 检查是否点击的是当前已选中的田块
      const isCurrentlySelected = card.classList.contains('selected');
      const isCurrentField = currentHighlightedField && currentHighlightedField.id === item.id;

      if (isCurrentlySelected && isCurrentField) {
        // 如果点击的是当前已选中的田块，关闭弹窗并清除高亮
        closeCurrentModal();
        clearAllHighlights();
        return;
      }

      // 清除之前的高亮状态
      clearAllHighlights();

      // 选中当前卡片并高亮地图
      card.classList.add('selected');
      highlightOnMap(item);

      // 显示田块详细信息弹窗
      showFieldDetailsModal(item);
    });
    left.appendChild(card);
  });

  const right = document.createElement('div');
  right.style.width = '40%';
  right.style.height = '600px';
  right.style.position = 'sticky';
  right.style.top = '20px';
  right.style.overflow = 'hidden';
  right.style.borderRadius = '8px';
  right.style.border = '1px solid var(--color-border)';
  right.style.flexShrink = '0';
  right.innerHTML = `
    <div id="field-map" role="application" aria-label="田块地图" style="width: 100%; height: 100%; position: relative; overflow: hidden; border-radius: 8px; border: 1px solid var(--color-border); z-index: 1002;">
      <div id="map-container" style="position: relative; width: 100%; height: 100%; overflow: hidden;">
        <img id="map-image" src="assets/images/field/f.png" alt="田块地图" style="width: 100%; height: 100%; object-fit: contain; display: block; transform-origin: center center; transition: transform 0.3s ease; background: #f5f5f5;" />
        <svg id="field-boundaries" viewBox="0 0 100 100" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1012; transform-origin: center center;"></svg>
        <div id="field-overlays" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1022; transform-origin: center center;"></div>
      </div>
      <div id="zoom-controls" style="position: absolute; top: 10px; right: 10px; display: flex; flex-direction: column; gap: 4px; z-index: 1050;">
        <button id="zoom-in" class="zoom-btn" style="width: 32px; height: 32px; border: none; background: white; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.2); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: bold; color: #333;">+</button>
        <button id="zoom-out" class="zoom-btn" style="width: 32px; height: 32px; border: none; background: white; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.2); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: bold; color: #333;">−</button>
        <button id="reset-zoom" class="zoom-btn" style="width: 32px; height: 32px; border: none; background: white; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.2); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; color: #333;">⌂</button>
      </div>
    </div>
  `;

  const wrap = document.createElement('div');
  wrap.style.display = 'flex';
  wrap.style.gap = '12px';
  wrap.style.alignItems = 'flex-start';
  wrap.style.minHeight = '100vh';
  wrap.append(left, right);

  container.appendChild(wrap);
  // 延迟初始化地图，确保DOM元素已渲染
  setTimeout(() => {
    initFieldMap(mockFields);
  }, 100);
  initLazyImages(left);
}

let fieldOverlays = [];
let mapState = {
  scale: 1,
  translateX: 0,
  translateY: 0,
  isDragging: false,
  lastMouseX: 0,
  lastMouseY: 0
};

function initFieldMap(fields) {
  const overlayContainer = document.getElementById('field-overlays');
  const mapImage = document.getElementById('map-image');
  const mapContainer = document.getElementById('map-container');
  if (!overlayContainer || !mapImage || !mapContainer) return;

  // 清空现有的覆盖层
  overlayContainer.innerHTML = '';
  fieldOverlays = [];

  // 初始化地图状态
  mapState = {
    scale: 1,
    translateX: 0,
    translateY: 0,
    isDragging: false,
    lastMouseX: 0,
    lastMouseY: 0
  };

  // 绑定缩放控制事件
  bindZoomControls();

  // 绑定鼠标滚轮缩放
  bindWheelZoom();

  // 绑定拖拽平移
  bindPanControls();

  // 8个田块多边形路径
  const fieldPolygons = {
    // 上排4个田块 - 根据用户精确坐标调整
    'F-001': '10,2 30,2 30,14 23,14 23,47 10,47',
    'F-002': '31,2 49,2 49,47 24,47 24,15 31,15',
    'F-003': '50,2 73,2 73,27 90,27 90,47 50,47',
    'F-004': '74,2 90,2 90,26 74,26',

    // 下排4个田块 - 根据用户精确坐标调整
    'F-005': '10,50 30,50 30,100 10,100',
    'F-006': '30.5,50 51.5,50 51.5,100 30.5,100',
    'F-007': '52,50 68,50 68,100 52,100',
    'F-008': '68,50 90,50 90,100 68,100'
  };

  // 创建SVG边界和多边形
  const svg = document.getElementById('field-boundaries');
  if (svg) {
    svg.innerHTML = ''; // 清空现有内容

    // 添加调试网格（可选）
    // 检查多种可能的调试参数格式
    const currentUrl = window.location.href;
    const currentSearch = window.location.search;
    const currentHash = window.location.hash;

    const isDebugMode =
      currentSearch.includes('debug=true') ||
      currentHash.includes('debug=true') ||
      currentUrl.includes('debug=true') ||
      window.location.search.includes('debug=true') ||
      window.location.hash.includes('debug=true');

    console.log('URL检查:', {
      href: currentUrl,
      search: currentSearch,
      hash: currentHash,
      isDebugMode: isDebugMode
    });

    // 调试网格线已移除，界面更简洁

    fields.forEach((field, idx) => {
      const polygonPath = fieldPolygons[field.id];
      if (polygonPath) {
        // 创建SVG多边形
        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        // SVG polygon的points属性需要纯数字，不需要百分比符号
        polygon.setAttribute('points', polygonPath);
        polygon.setAttribute('fill', 'rgba(64, 148, 96, 0.1)');
        polygon.setAttribute('stroke', healthColor(field.health));
        polygon.setAttribute('stroke-width', '0.5');
        polygon.setAttribute('stroke-linejoin', 'round');
        polygon.setAttribute('pointer-events', 'auto');
        polygon.setAttribute('cursor', 'pointer');
        polygon.style.transition = 'all 0.3s ease';
        polygon.style.transformOrigin = 'center center';
        polygon.dataset.fieldId = field.id;

        // 添加悬停效果
        polygon.addEventListener('mouseenter', () => {
          // 如果当前田块已经被高亮，不改变悬停效果
          if (currentHighlightedField && currentHighlightedField.id === field.id) {
            return;
          }
          polygon.setAttribute('fill', 'rgba(255, 255, 255, 0.2)');
          polygon.setAttribute('stroke-width', '1');
          polygon.style.filter = 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))';
        });

        polygon.addEventListener('mouseleave', () => {
          // 如果当前田块已经被高亮，不改变悬停效果
          if (currentHighlightedField && currentHighlightedField.id === field.id) {
            return;
          }
          polygon.setAttribute('fill', 'rgba(255, 255, 255, 0.1)');
          polygon.setAttribute('stroke-width', '0.5');
          polygon.style.filter = 'none';
        });

        // 添加点击事件
        polygon.addEventListener('click', () => {
          highlightFieldOnMap(field);
        });

        svg.appendChild(polygon);
      }
    });
  }

  // 创建田块编号标签
  fields.forEach((field, idx) => {
    const polygonPath = fieldPolygons[field.id];
    if (polygonPath) {
      // 计算多边形中心点 - 改进算法
      const points = polygonPath.split(' ').map(p => p.split(',').map(Number));

      // 使用重心算法计算更准确的中心点
      let area = 0;
      let centerX = 0;
      let centerY = 0;

      for (let i = 0; i < points.length; i++) {
        const j = (i + 1) % points.length;
        const cross = points[i][0] * points[j][1] - points[j][0] * points[i][1];
        area += cross;
        centerX += (points[i][0] + points[j][0]) * cross;
        centerY += (points[i][1] + points[j][1]) * cross;
      }

      area /= 2;
      centerX = centerX / (6 * area);
      centerY = centerY / (6 * area);

      const label = document.createElement('div');
      label.className = 'field-label';
      label.textContent = field.id.replace('F-', '');

      // 为特定田块添加位置偏移
      let offsetX = 0;
      if (field.id === 'F-003') {
        offsetX = -5; // 3号田向左偏移5%
      }

      label.style.cssText = `
        position: absolute;
        left: ${centerX + offsetX}%;
        top: ${centerY}%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: bold;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
        pointer-events: none;
        z-index: 1032;
        border: 1px solid rgba(255,255,255,0.3);
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        transform-origin: center center;
      `;

      // 添加田块名称标签
      const nameLabel = document.createElement('div');
      nameLabel.textContent = field.name;
      nameLabel.style.cssText = `
        position: absolute;
        left: ${centerX}%;
        top: ${centerY - 8}%;
        transform: translate(-50%, -100%);
        background: rgba(0,0,0,0.9);
        color: white;
        padding: 6px 12px;
        border-radius: 8px;
        font-size: 12px;
        font-weight: 600;
        white-space: nowrap;
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        border: 1px solid rgba(255,255,255,0.3);
        z-index: 1042;
        transform-origin: center center;
      `;

      overlayContainer.appendChild(label);
      overlayContainer.appendChild(nameLabel);

      // 悬停时显示名称标签
      const polygon = svg.querySelector(`[data-field-id="${field.id}"]`);
      if (polygon) {
        polygon.addEventListener('mouseenter', () => {
          nameLabel.style.opacity = '1';
        });

        polygon.addEventListener('mouseleave', () => {
          nameLabel.style.opacity = '0';
        });
      }

      fieldOverlays.push({ id: field.id, polygon, label, nameLabel, field });
    }
  });
}

// 缩放控制函数
function bindZoomControls() {
  const zoomInBtn = document.getElementById('zoom-in');
  const zoomOutBtn = document.getElementById('zoom-out');
  const resetBtn = document.getElementById('reset-zoom');

  if (zoomInBtn) {
    zoomInBtn.addEventListener('click', () => zoomMap(1.2));
  }

  if (zoomOutBtn) {
    zoomOutBtn.addEventListener('click', () => zoomMap(0.8));
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', resetMap);
  }
}

// 鼠标滚轮缩放
function bindWheelZoom() {
  const mapContainer = document.getElementById('map-container');
  if (!mapContainer) return;

  mapContainer.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    zoomMap(delta, e.offsetX, e.offsetY);
  });
}

// 拖拽平移
function bindPanControls() {
  const mapContainer = document.getElementById('map-container');
  if (!mapContainer) return;

  mapContainer.addEventListener('mousedown', (e) => {
    if (e.target.tagName === 'IMG') {
      mapState.isDragging = true;
      mapState.lastMouseX = e.clientX;
      mapState.lastMouseY = e.clientY;
      mapContainer.style.cursor = 'grabbing';
    }
  });

  document.addEventListener('mousemove', (e) => {
    if (mapState.isDragging) {
      const deltaX = e.clientX - mapState.lastMouseX;
      const deltaY = e.clientY - mapState.lastMouseY;

      mapState.translateX += deltaX;
      mapState.translateY += deltaY;

      mapState.lastMouseX = e.clientX;
      mapState.lastMouseY = e.clientY;

      updateMapTransform();
    }
  });

  document.addEventListener('mouseup', () => {
    mapState.isDragging = false;
    const mapContainer = document.getElementById('map-container');
    if (mapContainer) {
      mapContainer.style.cursor = 'grab';
    }
  });
}

// 缩放地图
function zoomMap(scaleFactor, centerX = null, centerY = null) {
  const mapImage = document.getElementById('map-image');
  const mapContainer = document.getElementById('map-container');
  if (!mapImage || !mapContainer) return;

  const newScale = Math.max(0.5, Math.min(3, mapState.scale * scaleFactor));

  if (centerX !== null && centerY !== null) {
    // 以鼠标位置为中心缩放
    const rect = mapContainer.getBoundingClientRect();
    const containerCenterX = rect.width / 2;
    const containerCenterY = rect.height / 2;

    const mouseX = centerX - containerCenterX;
    const mouseY = centerY - containerCenterY;

    const scaleDiff = newScale - mapState.scale;
    mapState.translateX -= mouseX * scaleDiff;
    mapState.translateY -= mouseY * scaleDiff;
  }

  mapState.scale = newScale;
  updateMapTransform();
}

// 重置地图
function resetMap() {
  mapState.scale = 1;
  mapState.translateX = 0;
  mapState.translateY = 0;
  updateMapTransform();
}

// 更新地图变换
function updateMapTransform() {
  const mapImage = document.getElementById('map-image');
  const svg = document.getElementById('field-boundaries');
  const overlays = document.getElementById('field-overlays');

  if (!mapImage) return;

  const transform = `translate(${mapState.translateX}px, ${mapState.translateY}px) scale(${mapState.scale})`;
  mapImage.style.transform = transform;

  // 让SVG和标签跟随图片一起变换
  if (svg) {
    svg.style.transform = transform;
  }

  if (overlays) {
    overlays.style.transform = transform;
  }

  // 更新标记点位置
  updateMarkerPositions();
}

// 更新标记点位置
function updateMarkerPositions() {
  fieldOverlays.forEach(overlay => {
    const marker = overlay.marker;
    if (marker) {
      // 标记点位置会根据图片的缩放和平移自动调整
      // 因为标记点是相对于图片容器的绝对定位
    }
  });
}

// 全局变量跟踪当前高亮的田块
let currentHighlightedField = null;
let currentPopup = null;

function highlightFieldOnMap(field) {
  const target = fieldOverlays.find(p => p.id === field.id);
  if (target && target.polygon) {
    // 如果点击的是当前已高亮的田块，则取消高亮
    if (currentHighlightedField && currentHighlightedField.id === field.id) {
      // 关闭弹窗并清除所有高亮
      closeCurrentModal();
      clearAllHighlights();
      return;
    }

    // 清除之前的高亮状态
    clearAllHighlights();

    // 高亮当前田块 - 使用田块健康状态颜色覆盖显示
    const healthColorValue = healthColor(field.health);
    const fillColor = hexToRgba(healthColorValue, 0.8);
    target.polygon.setAttribute('fill', fillColor);
    target.polygon.setAttribute('stroke', healthColorValue); // 使用健康状态颜色作为边框
    target.polygon.setAttribute('stroke-width', '1'); // 正常边框
    target.polygon.style.filter = `drop-shadow(0 8px 25px ${healthColorValue}80) drop-shadow(0 4px 12px rgba(0,0,0,0.4))`; // 使用健康状态颜色的阴影效果

    // 显示田块详细信息弹窗
    showFieldDetailsModal(field);

    // 选中对应的卡片
    const correspondingCard = document.querySelector(`.field-card[data-field-id="${field.id}"]`);
    if (correspondingCard) {
      correspondingCard.classList.add('selected');
    }

    // 更新当前高亮状态
    currentHighlightedField = field;
  }
}

function highlightOnMap(item) {
  // 直接高亮地图，不调用highlightFieldOnMap（避免重复显示弹窗）
  const target = fieldOverlays.find(p => p.id === item.id);
  if (target && target.polygon) {
    // 清除之前的高亮状态
    clearAllHighlights();

    // 高亮当前田块 - 使用田块健康状态颜色覆盖显示
    const healthColorValue = healthColor(item.health);
    const fillColor = hexToRgba(healthColorValue, 0.8);
    target.polygon.setAttribute('fill', fillColor);
    target.polygon.setAttribute('stroke', healthColorValue); // 使用健康状态颜色作为边框
    target.polygon.setAttribute('stroke-width', '1'); // 正常边框
    target.polygon.style.filter = `drop-shadow(0 8px 25px ${healthColorValue}80) drop-shadow(0 4px 12px rgba(0,0,0,0.4))`; // 使用健康状态颜色的阴影效果

    // 更新当前高亮状态
    currentHighlightedField = item;
  }
}

function healthColor(v) {
  if (v >= 85) return '#2E7D32';  // 深绿色 - 健康（更深的绿色）
  if (v >= 70) return '#FFC107';  // 黄色 - 轻微风险（从浅绿改为黄色）
  if (v >= 50) return '#FF9800';  // 橙色 - 中等风险
  if (v >= 30) return '#FF5722';  // 深橙色 - 高风险
  return '#F44336';               // 红色 - 严重风险
}

// 将十六进制颜色转换为rgba格式
function hexToRgba(hex, alpha = 0.8) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
function tagByHealth(v) {
  if (v >= 85) return 'success';
  if (v >= 70) return 'info';
  if (v >= 50) return 'warning';
  if (v >= 30) return 'danger';
  return 'danger';
}
function statusByHealth(v) {
  if (v >= 85) return '无病虫害';
  if (v >= 70) return '轻微感染';
  if (v >= 50) return '中度感染';
  if (v >= 30) return '重度感染';
  return '严重感染';
}

export async function render(container) {
  try {
    // 每次渲染时重新初始化田块数据，确保数据一致性
    initializeMockFields();

    container.innerHTML = '';
    const toolbar = createToolbar();
    container.appendChild(toolbar);

    // 应用筛选和排序，而不是直接渲染所有数据
    applyFiltersAndSort();

    bindToolbarEvents(toolbar);

    // 设置全局田块数据，供AI诊断使用
    window.currentFieldsData = mockFields;
  } catch (error) {
    console.error('字段渲染失败:', error);
    container.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--color-text-muted);">页面加载失败，请刷新后重试</div>';
  }
}

function initLazyImages(scope) {
  const imgs = scope.querySelectorAll('img.lazy-img');
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const img = e.target; img.src = img.dataset.src; img.addEventListener('load', () => img.parentElement.classList.remove('skeleton')); obs.unobserve(img);
      }
    });
  }, { rootMargin: '100px' });
  imgs.forEach(img => { img.parentElement.classList.add('skeleton'); io.observe(img); });
}

// 根据病虫害情况计算健康度
function calculateHealthScore(field) {
  try {
    // 获取当前活跃的病虫害数量
    const activePestCount = getActivePestCount(field.id);

    // 获取当前活跃的病虫害数据
    const fieldPests = getFieldPests(field.id);
    const activePests = fieldPests.filter(pest => pest.isActive && (pest.status === '待处理' || pest.status === '处理中'));

    // 基础健康度
    let healthScore = 100;

    if (activePests.length === 0) {
      // 无活跃病虫害：健康状态
      return 95;
    }

    // 如果有任何病虫害（包括处理中的），都不能算作完全健康
    // 即使是处理中的病虫害，也说明田块存在健康风险

    // 根据病虫害数量和严重程度计算扣分
    let totalDeduction = 0;

    activePests.forEach(pest => {
      let pestDeduction = 0;

      // 根据病虫害严重程度扣分
      switch (pest.level) {
        case '低':
          pestDeduction = 12; // 提高基础扣分
          break;
        case '中':
          pestDeduction = 20;
          break;
        case '高':
          pestDeduction = 30;
          break;
        case '严重':
          pestDeduction = 40;
          break;
        default:
          pestDeduction = 15;
      }

      // 根据病虫害类型调整扣分
      if (pest.category === '病害') {
        pestDeduction *= 1.2; // 病害通常比虫害更严重
      }

      // 根据处理状态调整
      if (pest.status === '待处理') {
        pestDeduction *= 1.4; // 未处理的病虫害影响更大
      } else if (pest.status === '处理中') {
        pestDeduction *= 1.1; // 处理中的病虫害仍有影响，但比未处理的影响小
      }

      totalDeduction += pestDeduction;
    });

    // 多种病虫害的叠加效应
    if (activePests.length > 1) {
      totalDeduction *= (1 + (activePests.length - 1) * 0.25); // 每增加一种病虫害，影响增加25%
    }

    // 确保有病虫害的田块不会显示为健康状态（85分以上）
    healthScore = Math.max(15, Math.min(84, 100 - totalDeduction));

    return Math.round(Math.max(20, Math.min(100, healthScore)));
  } catch (error) {
    console.warn('健康度计算失败，使用默认值:', error);
    return 75; // 安全的默认值
  }
}

// 添加田块弹窗
function showAddFieldModal() {
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
    background: rgba(0,0,0,0.5); z-index: 1000; display: flex; 
    align-items: center; justify-content: center;
  `;

  modal.innerHTML = `
    <div style="background: white; border-radius: 12px; padding: 32px; width: 500px; max-width: 90vw; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
      <h3 style="margin: 0 0 24px 0; color: var(--color-primary-900); font-size: 24px;">添加新田块</h3>
      <form id="add-field-form">
        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 10px; font-weight: 500; font-size: 18px;">作物类型</label>
          <input type="text" id="field-crop" placeholder="请输入作物类型，如：玉米、大豆、棉花、水稻等" required 
                 style="width: 100%; padding: 16px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 18px;">
        </div>
        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 10px; font-weight: 500; font-size: 18px;">面积（亩）</label>
          <input type="number" id="field-area" placeholder="请输入面积" required min="1"
                 style="width: 100%; padding: 16px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 18px;">
        </div>
        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 10px; font-weight: 500; font-size: 18px;">土壤类型</label>
          <input type="text" id="field-soil" placeholder="如：黑土、黄壤、水田、沙壤土等" 
                 style="width: 100%; padding: 16px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 18px;">
        </div>
        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 10px; font-weight: 500; font-size: 18px;">灌溉方式</label>
          <input type="text" id="field-irrigation" placeholder="如：滴灌系统、喷灌、沟灌、手工浇灌等" 
                 style="width: 100%; padding: 16px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 18px;">
        </div>
        <div style="display: flex; gap: 16px; justify-content: flex-end;">
          <button type="button" id="cancel-btn" class="btn btn-outline" style="font-size: 18px; padding: 12px 24px;">取消</button>
          <button type="submit" class="btn btn-primary" style="font-size: 18px; padding: 12px 24px;">添加田块</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  // 取消按钮
  modal.querySelector('#cancel-btn').addEventListener('click', () => {
    document.body.removeChild(modal);
  });

  // 点击背景关闭
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });

  // 表单提交
  modal.querySelector('#add-field-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const crop = modal.querySelector('#field-crop').value;

    const newField = {
      id: `F-${String(mockFields.length + 1).padStart(3, '0')}`,
      name: `${crop}田`,
      crop: crop,
      area: parseFloat(modal.querySelector('#field-area').value),
      health: calculateHealthScore({ crop: crop }),
      time: '今天 ' + new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      location: '新田块',
      soilType: modal.querySelector('#field-soil').value,
      irrigation: modal.querySelector('#field-irrigation').value,
      lastHarvest: '新种植',
      expectedYield: Math.round(parseFloat(modal.querySelector('#field-area').value) * 100 + Math.random() * 500)
    };

    mockFields.push(newField);
    showToast('田块添加成功！', 'success');
    document.body.removeChild(modal);

    // 重新渲染田块列表，保持当前的筛选和排序状态
    const container = document.getElementById('app-main');
    container.innerHTML = '';
    const toolbar = createToolbar();
    container.appendChild(toolbar);

    // 应用当前的筛选和排序
    applyFiltersAndSort();

    // 重新绑定事件
    bindToolbarEvents(toolbar);

    // 重新初始化地图以显示新田块
    setTimeout(() => {
      initFieldMap(mockFields);
    }, 100);
  });
}

// 导出功能
function exportFields() {
  // 获取当前显示的田块数据（应用了筛选和排序）
  const container = document.getElementById('app-main');
  if (!container) {
    showToast('导出失败：找不到数据容器', 'error');
    return;
  }

  // 获取当前筛选和排序后的数据
  const cropFilter = document.querySelector('#filter-crop')?.value || '';
  const healthFilter = document.querySelector('#filter-health')?.value || '';
  const searchTerm = document.querySelector('#search-field')?.value?.toLowerCase() || '';

  // 应用筛选
  let filtered = mockFields.filter(field => {
    const cropMatch = !cropFilter || field.crop === cropFilter;
    const healthMatch = !healthFilter || (
      healthFilter === 'healthy' && field.health >= 85 ||
      healthFilter === 'warning' && field.health >= 70 && field.health < 85 ||
      healthFilter === 'danger' && field.health >= 50 && field.health < 70 ||
      healthFilter === 'severe' && field.health >= 30 && field.health < 50 ||
      healthFilter === 'critical' && field.health < 30
    );
    const searchMatch = !searchTerm || field.name.toLowerCase().includes(searchTerm);
    return cropMatch && healthMatch && searchMatch;
  });

  // 获取病虫害感染程度状态
  function getInfectionStatus(health) {
    if (health >= 85) return '无病虫害';
    if (health >= 70) return '轻微感染';
    if (health >= 50) return '中度感染';
    if (health >= 30) return '重度感染';
    return '严重感染';
  }

  // 准备导出数据
  const data = filtered.map(field => ({
    田块编号: field.id,
    田块名称: field.name,
    作物类型: field.crop,
    面积: field.area + '亩',
    土壤类型: field.soilType,
    灌溉方式: field.irrigation,
    健康度: field.health + '%',
    感染状态: getInfectionStatus(field.health),
    设备数量: field.deviceCount + '台',
    病虫害数量: field.pestCount + '种'
  }));

  if (data.length === 0) {
    showToast('没有数据可导出', 'warning');
    return;
  }

  // 生成CSV内容
  const csv = [
    Object.keys(data[0]).join(','),
    ...data.map(row => Object.values(row).map(value => `"${value}"`).join(','))
  ].join('\n');

  // 创建并下载文件
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `田块数据_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();

  // 清理URL对象
  URL.revokeObjectURL(link.href);

  showToast(`成功导出 ${data.length} 条田块数据！`, 'success');
}

// 视图切换
let isGridView = false;
function toggleView() {
  isGridView = !isGridView;
  const container = document.getElementById('app-main');
  container.innerHTML = '';
  const toolbar = createToolbar();
  container.appendChild(toolbar);

  // 应用当前的筛选和排序，而不是直接渲染所有数据
  applyFiltersAndSort();

  bindToolbarEvents(toolbar);
  showToast(isGridView ? '已切换到网格视图' : '已切换到列表视图');
}

// 网格视图渲染
function renderFieldGrid(container, data) {
  const grid = document.createElement('div');
  grid.className = 'grid cols-4';
  grid.style.marginTop = '16px';

  data.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.padding = '16px';
    card.style.textAlign = 'center';

    const isCornField = item.crop === '玉米';

    card.innerHTML = `
      <div style="width: 100%; height: 120px; border-radius: 8px; margin-bottom: 12px; overflow: hidden; background: #f5f5f5;">
        ${isCornField ?
        `<img src="assets/images/field/yumi.jpg" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover;"/>` :
        `<div style="width: 100%; height: 100%; background: linear-gradient(135deg,#E8F5E9,#C8E6C9); display: flex; align-items: center; justify-content: center; color: var(--color-text-muted); font-size: 14px;">${item.crop}</div>`
      }
      </div>
      <h4 style="margin: 0 0 8px 0; color: var(--color-primary-900);">${item.name}</h4>
      <div style="color: var(--color-text-muted); font-size: 14px; margin-bottom: 8px;">${item.crop} · ${item.area}亩</div>
      <div class="health-bar" style="margin-bottom: 8px;"><div class="inner" style="width:${item.health}%;background:${healthColor(item.health)}"></div></div>
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
        <span style="font-size: 12px; font-weight:600; color: var(--color-text);">${item.health}%</span>
        <span class="tag ${tagByHealth(item.health)}" style="font-size: 12px; padding: 2px 6px;">${statusByHealth(item.health)}</span>
      </div>
      <div style="font-size: 12px; color: var(--color-text-muted);">${item.time}</div>
    `;

    card.addEventListener('click', () => highlightOnMap(item));
    grid.appendChild(card);
  });

  container.appendChild(grid);
}

// 筛选功能
function filterFields() {
  // 应用筛选和排序
  applyFiltersAndSort();
}

// 排序功能
function sortFields() {
  // 应用筛选和排序
  applyFiltersAndSort();
}

// 统一的筛选和排序函数
function applyFiltersAndSort() {
  const cropFilter = document.querySelector('#filter-crop')?.value || '';
  const healthFilter = document.querySelector('#filter-health')?.value || '';
  const searchTerm = document.querySelector('#search-field')?.value?.toLowerCase() || '';
  const sortBy = document.querySelector('#sort-by')?.value || 'name';

  console.log('筛选参数:', { cropFilter, healthFilter, searchTerm, sortBy });

  // 应用筛选
  let filtered = mockFields.filter(field => {
    const cropMatch = !cropFilter || field.crop === cropFilter;
    const healthMatch = !healthFilter || (
      healthFilter === 'healthy' && field.health >= 85 ||
      healthFilter === 'warning' && field.health >= 70 && field.health < 85 ||
      healthFilter === 'danger' && field.health >= 50 && field.health < 70 ||
      healthFilter === 'severe' && field.health >= 30 && field.health < 50 ||
      healthFilter === 'critical' && field.health < 30
    );
    const searchMatch = !searchTerm || field.name.toLowerCase().includes(searchTerm);

    return cropMatch && healthMatch && searchMatch;
  });

  console.log('筛选后数据:', filtered.length, '条');

  // 应用排序
  let sorted = [...filtered];

  switch (sortBy) {
    case 'name':
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'id':
      sorted.sort((a, b) => a.id.localeCompare(b.id)); // 按田块编号排序
      break;
    case 'area':
      sorted.sort((a, b) => b.area - a.area); // 降序排列，面积大的在前
      break;
    case 'health':
      sorted.sort((a, b) => b.health - a.health); // 降序排列，健康度高的在前
      break;
    case 'time':
      // 改进时间排序逻辑，处理"今天"、"昨天"等相对时间
      sorted.sort((a, b) => {
        const timeA = parseTimeString(a.time);
        const timeB = parseTimeString(b.time);
        return timeB - timeA; // 降序排列，最新的在前
      });
      break;
  }

  console.log('排序后数据:', sorted.map(f => f.name));

  // 重新渲染
  const container = document.getElementById('app-main');
  if (!container) {
    console.error('找不到容器元素 #app-main');
    return;
  }

  // 删除现有的内容区域（保留工具栏）
  const toolbar = container.querySelector('div:first-child');
  const existingContent = container.querySelector('div:last-child');
  if (existingContent && existingContent !== toolbar) {
    existingContent.remove();
  }

  if (isGridView) {
    renderFieldGrid(container, sorted);
  } else {
    renderFieldList(container, sorted);
  }
}

// 解析时间字符串为时间戳，用于排序
function parseTimeString(timeStr) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (timeStr.includes('今天')) {
    const timeMatch = timeStr.match(/(\d{2}):(\d{2})/);
    if (timeMatch) {
      const hours = parseInt(timeMatch[1]);
      const minutes = parseInt(timeMatch[2]);
      return today.getTime() + hours * 60 * 60 * 1000 + minutes * 60 * 1000;
    }
  } else if (timeStr.includes('昨天')) {
    const timeMatch = timeStr.match(/(\d{2}):(\d{2})/);
    if (timeMatch) {
      const hours = parseInt(timeMatch[1]);
      const minutes = parseInt(timeMatch[2]);
      return today.getTime() - 24 * 60 * 60 * 1000 + hours * 60 * 60 * 1000 + minutes * 60 * 1000;
    }
  }

  // 处理具体日期格式，如 "2023年10月15日"
  const dateMatch = timeStr.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
  if (dateMatch) {
    const year = parseInt(dateMatch[1]);
    const month = parseInt(dateMatch[2]) - 1;
    const day = parseInt(dateMatch[3]);
    return new Date(year, month, day).getTime();
  }

  // 如果无法解析，返回当前时间
  return now.getTime();
}

// 搜索功能
function searchFields() {
  filterFields(); // 搜索功能已集成到筛选中
}

// 绑定工具栏事件
function bindToolbarEvents(toolbar) {
  toolbar.querySelector('#btn-add').addEventListener('click', () => showAddFieldModal());
  toolbar.querySelector('#export').addEventListener('click', () => exportFields());

  // 筛选功能
  toolbar.querySelector('#filter-crop').addEventListener('change', (e) => filterFields());
  toolbar.querySelector('#filter-health').addEventListener('change', (e) => filterFields());
  toolbar.querySelector('#sort-by').addEventListener('change', (e) => sortFields());
  toolbar.querySelector('#search-field').addEventListener('input', (e) => searchFields());
}

// 全局变量跟踪当前显示的弹窗
let currentModal = null;

// 显示田块详细信息弹窗
function showFieldDetailsModal(field) {
  // 如果当前有弹窗显示，先关闭它
  if (currentModal) {
    closeCurrentModal();
  }

  // 获取田块列表容器 - 使用更可靠的方法
  let fieldListContainer = null;

  // 方法1：通过田块卡片找到容器
  const fieldCards = document.querySelectorAll('.field-card');
  if (fieldCards.length > 0) {
    fieldListContainer = fieldCards[0].closest('div[style*="width: 60%"]');
  }

  // 方法2：如果找不到，尝试其他选择器
  if (!fieldListContainer) {
    fieldListContainer = document.querySelector('div[style*="width: 60%"]');
  }

  // 方法3：如果还是找不到，使用主容器
  if (!fieldListContainer) {
    fieldListContainer = document.querySelector('.app-main');
  }

  if (!fieldListContainer) {
    console.error('田块列表容器未找到');
    return;
  }

  // 获取容器的位置和尺寸
  const containerRect = fieldListContainer.getBoundingClientRect();

  // 调试信息
  console.log('容器信息:', {
    width: containerRect.width,
    height: containerRect.height,
    left: containerRect.left,
    top: containerRect.top
  });

  // 计算弹窗的居中位置
  const modalWidth = Math.min(800, containerRect.width * 0.9); // 弹窗宽度，最大800px
  const modalHeight = Math.min(600, window.innerHeight * 0.8); // 弹窗高度，最大600px

  // 计算田块列表列的中心位置
  let centerX = containerRect.left + (containerRect.width - modalWidth) / 2;
  let centerY = containerRect.top + (containerRect.height - modalHeight) / 2 - 100; // 往上移动100px

  // 如果容器太小，使用视窗中心
  if (containerRect.width < modalWidth + 40) {
    centerX = (window.innerWidth - modalWidth) / 2;
  }
  if (containerRect.height < modalHeight + 40) {
    centerY = (window.innerHeight - modalHeight) / 2 - 100; // 往上移动100px
  }

  // 确保弹窗不会超出视窗边界
  const finalX = Math.max(20, Math.min(centerX, window.innerWidth - modalWidth - 20));
  const finalY = Math.max(20, Math.min(centerY, window.innerHeight - modalHeight - 20));

  // 调试信息
  console.log('弹窗位置计算:', {
    modalWidth,
    modalHeight,
    centerX,
    centerY,
    finalX,
    finalY,
    containerRect: {
      width: containerRect.width,
      height: containerRect.height,
      left: containerRect.left,
      top: containerRect.top
    }
  });

  // 创建遮罩层（变灰效果）- 只覆盖田块列表区域，不覆盖地图
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 63.5%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 998;
    opacity: 0;
    transition: opacity 0.3s ease;
  `;

  // 创建模态框背景
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: ${finalY}px;
    left: ${finalX}px;
    width: ${modalWidth}px;
    height: ${modalHeight}px;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1001;
    opacity: 0;
    transition: opacity 0.3s ease;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    border: 1px solid rgba(76, 175, 80, 0.2);
  `;

  // 创建模态框内容
  modal.innerHTML = `
    <div style="
      width: 100%;
      height: 100%;
      padding: 20px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
    ">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-shrink: 0;">
        <h2 style="margin: 0; color: var(--color-primary-900); font-size: 24px;">${field.name}</h2>
        <button id="close-modal" style="
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #999;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s ease;
        ">×</button>
      </div>
      
      <!-- 田块信息 -->
      <div style="margin-bottom: 24px; padding: 20px; background: #f8f9fa; border-radius: 12px;">
        <h3 style="margin: 0 0 16px 0; color: var(--color-primary-700); font-size: 20px; font-weight: 600;">田块信息</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 24px; font-size: 20px; color: #666; line-height: 1.6;">
          <div><strong>编号:</strong> ${field.id}</div>
          <div><strong>面积:</strong> ${field.area}亩</div>
          <div><strong>土壤:</strong> ${field.soilType}</div>
          <div><strong>灌溉:</strong> ${field.irrigation}</div>
          </div>
        </div>
        
      <!-- 设备信息 -->
      <div style="margin-bottom: 24px; padding: 20px; background: #f0f8ff; border-radius: 12px;">
        <h3 style="margin: 0 0 16px 0; color: var(--color-primary-700); font-size: 20px; font-weight: 600;">设备信息</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 24px; font-size: 20px; color: #666; line-height: 1.6;">
          ${getFieldDevicesInfo(field.id)}
        </div>
      </div>
      
      <!-- 病虫害信息 -->
      <div style="margin-bottom: 24px; padding: 20px; background: #f0f8f0; border-radius: 12px;">
        <h3 style="margin: 0 0 16px 0; color: var(--color-primary-700); font-size: 20px; font-weight: 600;">病虫害信息</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 24px; font-size: 20px; color: #666; line-height: 1.6;">
          ${getPestInfoForFieldSync(field)}
        </div>
      </div>
    </div>
  `;

  // 添加到页面
  document.body.appendChild(overlay);
  document.body.appendChild(modal);
  currentModal = modal;

  // 显示动画
  setTimeout(() => {
    overlay.style.opacity = '1';
    modal.style.opacity = '1';
    modal.querySelector('div').style.transform = 'scale(1)';
  }, 10);

  // 关闭按钮事件
  const closeBtn = modal.querySelector('#close-modal');
  closeBtn.addEventListener('mouseenter', () => {
    closeBtn.style.background = '#f0f0f0';
    closeBtn.style.color = '#333';
  });
  closeBtn.addEventListener('mouseleave', () => {
    closeBtn.style.background = 'none';
    closeBtn.style.color = '#999';
  });

  // 关闭模态框函数
  const closeModal = () => {
    overlay.style.opacity = '0';
    modal.style.opacity = '0';
    modal.querySelector('div').style.transform = 'scale(0.9)';
    setTimeout(() => {
      // 确保遮罩层被移除
      if (overlay && overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
      if (modal && modal.parentNode) {
        modal.parentNode.removeChild(modal);
      }
      currentModal = null;
      // 清除地图高亮和卡片选中状态
      clearAllHighlights();
    }, 300);
  };

  // 绑定关闭事件
  closeBtn.addEventListener('click', closeCurrentModal);
  overlay.addEventListener('click', closeCurrentModal); // 点击遮罩层关闭
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeCurrentModal();
    }
  });

  // ESC键关闭
  const handleEsc = (e) => {
    if (e.key === 'Escape') {
      closeCurrentModal();
      document.removeEventListener('keydown', handleEsc);
    }
  };
  document.addEventListener('keydown', handleEsc);
}

// 关闭当前弹窗
function closeCurrentModal() {
  if (currentModal) {
    // 查找并关闭遮罩层 - 使用更准确的选择器
    const overlay = document.querySelector('div[style*="position: fixed"][style*="background: rgba(0, 0, 0, 0.5)"][style*="z-index: 998"]');
    if (overlay) {
      overlay.style.opacity = '0';
    }

    currentModal.style.opacity = '0';
    currentModal.querySelector('div').style.transform = 'scale(0.9)';
    setTimeout(() => {
      // 确保遮罩层被移除
      if (overlay && overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
      if (currentModal && currentModal.parentNode) {
        currentModal.parentNode.removeChild(currentModal);
      }
      currentModal = null;
      // 清除地图高亮和卡片选中状态
      clearAllHighlights();
    }, 300);
  }
}

// 清除所有高亮状态
function clearAllHighlights() {
  // 清除地图高亮
  if (currentHighlightedField) {
    const target = fieldOverlays.find(p => p.id === currentHighlightedField.id);
    if (target && target.polygon) {
      target.polygon.setAttribute('fill', 'rgba(255, 255, 255, 0.1)');
      // 保留边框，不清除stroke属性
      target.polygon.setAttribute('stroke-width', '0.5');
      target.polygon.style.filter = 'none';
    }
    currentHighlightedField = null;
  }

  // 清除卡片选中状态
  document.querySelectorAll('.field-card').forEach(card => {
    card.classList.remove('selected');
  });
}

// 获取田块的病虫害信息（同步版本）
function getPestInfoForFieldSync(field) {
  // 基于田块ID获取对应的病虫害信息
  const fieldPests = getFieldPests(field.id);

  if (fieldPests.length === 0) {
    return `
      <div style="text-align: center; padding: 20px; color: #666; background: #f8f9fa; border-radius: 8px;">
        <div style="font-size: 16px; margin-bottom: 8px;">🌱</div>
        <div>暂无病虫害记录</div>
      </div>
    `;
  }

  // 分离当前活跃和历史记录
  const activePests = fieldPests.filter(pest => pest.isActive && (pest.status === '待处理' || pest.status === '处理中'));
  const historyPests = fieldPests.filter(pest => !pest.isActive || pest.status === '已解决');

  let html = '';

  // 所有病虫害信息统一显示
  const allPests = [...activePests, ...historyPests];

  if (allPests.length > 0) {
    return allPests.map(pest => {
      // 将病虫害风险等级转换为感染程度
      let infectionLevel = '';
      switch (pest.level) {
        case '低':
          infectionLevel = '轻微感染';
          break;
        case '中':
          infectionLevel = '中度感染';
          break;
        case '高':
          infectionLevel = '重度感染';
          break;
        case '严重':
          infectionLevel = '严重感染';
          break;
        default:
          infectionLevel = pest.level + '感染';
      }
      return `<div><strong>${pest.title}</strong> • ${pest.category} • ${infectionLevel} • <span style="color: ${getStatusColor(pest.status)};">${pest.status}</span></div>`;
    }).join('');
  } else {
    return '<div style="color: #999;">暂无病虫害记录</div>';
  }

  return html;
}

// 获取指定田块的病虫害数据
function getFieldPests(fieldId) {
  // 模拟病虫害数据，包含当前活跃和历史记录
  const pestData = {
    'F-001': [
      // 当前活跃的病虫害
      { title: '玉米蚜虫', category: '虫害', level: '中', date: '2025-01-15', status: '处理中', isActive: true },
      // 历史记录
      { title: '玉米大斑病', category: '病害', level: '中', date: '2024-10-15', status: '已解决', isActive: false }
    ],
    'F-002': [
      // 历史记录
      { title: '大豆蚜虫', category: '虫害', level: '中', date: '2024-08-15', status: '已解决', isActive: false },
      { title: '大豆根腐病', category: '病害', level: '低', date: '2024-07-20', status: '已解决', isActive: false }
    ],
    'F-003': [
      // 当前活跃的病虫害
      { title: '棉花蚜虫', category: '虫害', level: '高', date: '2025-01-10', status: '待处理', isActive: true },
      { title: '棉铃虫', category: '虫害', level: '中', date: '2025-01-08', status: '处理中', isActive: true },
      // 历史记录
      { title: '棉花立枯病', category: '病害', level: '中', date: '2024-04-20', status: '已解决', isActive: false }
    ],
    'F-004': [
      // 历史记录
      { title: '大豆锈病', category: '病害', level: '中', date: '2024-09-10', status: '已解决', isActive: false },
      { title: '大豆夜蛾', category: '虫害', level: '低', date: '2024-08-25', status: '已解决', isActive: false }
    ],
    'F-005': [
      // 历史记录
      { title: '棉花红蜘蛛', category: '虫害', level: '中', date: '2024-11-05', status: '已解决', isActive: false },
      { title: '棉花黄萎病', category: '病害', level: '低', date: '2024-10-12', status: '已解决', isActive: false }
    ],
    'F-006': [
      // 历史记录
      { title: '玉米螟', category: '虫害', level: '中', date: '2024-09-20', status: '已解决', isActive: false },
      { title: '玉米叶斑病', category: '病害', level: '低', date: '2024-08-15', status: '已解决', isActive: false }
    ],
    'F-007': [
      // 当前活跃的病虫害
      { title: '大豆蚜虫', category: '虫害', level: '低', date: '2025-01-12', status: '处理中', isActive: true },
      // 历史记录
      { title: '大豆锈病', category: '病害', level: '低', date: '2024-10-18', status: '已解决', isActive: false }
    ],
    'F-008': [
      // 当前活跃的病虫害
      { title: '棉花红蜘蛛', category: '虫害', level: '中', date: '2025-01-14', status: '待处理', isActive: true }
    ]
  };

  return pestData[fieldId] || [];
}

// 获取当前活跃的病虫害数量
function getActivePestCount(fieldId) {
  const pests = getFieldPests(fieldId);
  return pests.filter(pest => pest.isActive && (pest.status === '待处理' || pest.status === '处理中')).length;
}

// 根据病虫害等级获取颜色
function getPestColor(level) {
  switch (level) {
    case '低': return '#10b981';
    case '中': return '#f59e0b';
    case '高': return '#ef4444';
    case '严重': return '#dc2626';
    default: return '#6b7280';
  }
}

// 根据状态获取颜色
function getStatusColor(status) {
  switch (status) {
    case '已解决': return '#10b981';
    case '处理中': return '#f59e0b';
    case '待处理': return '#ef4444';
    case '复发': return '#dc2626';
    default: return '#6b7280';
  }
}

// 获取田块设备信息
function getFieldDevicesInfo(fieldId) {
  // 获取该田块的设备数据
  const fieldDevices = getFieldDevices(fieldId);

  if (fieldDevices.length === 0) {
    return '<div style="color: #999;">暂无设备</div>';
  }

  // 直接显示所有设备，不分组
  return fieldDevices.map(device =>
    `<div><strong>${device.id}</strong> ${device.name}</div>`
  ).join('');
}

// 获取田块设备数据
function getFieldDevices(fieldId) {
  // 模拟设备数据
  const deviceData = {
    'F-001': [
      { id: 'D-001', name: '田间监测摄像头', category: '病虫害监测', status: 'online' },
      { id: 'D-002', name: '气象监测站', category: '气象监测', status: 'online' },
      { id: 'D-004', name: '植保无人机', category: '防治设备', status: 'online' }
    ],
    'F-002': [
      { id: 'D-005', name: '田间监测摄像头', category: '病虫害监测', status: 'online' },
      { id: 'D-006', name: '气象监测站', category: '气象监测', status: 'online' },
      { id: 'D-009', name: '植保无人机', category: '防治设备', status: 'online' },
      { id: 'D-010', name: '杀虫灯', category: '防治设备', status: 'online' }
    ],
    'F-003': [
      { id: 'D-011', name: '田间监测摄像头', category: '病虫害监测', status: 'online' },
      { id: 'D-012', name: '气象监测站', category: '气象监测', status: 'online' }
    ],
    'F-004': [
      { id: 'D-013', name: '田间监测摄像头', category: '病虫害监测', status: 'online' },
      { id: 'D-014', name: '气象监测站', category: '气象监测', status: 'online' }
    ],
    'F-005': [
      { id: 'D-015', name: '田间监测摄像头', category: '病虫害监测', status: 'online' },
      { id: 'D-016', name: '气象监测站', category: '气象监测', status: 'online' },
      { id: 'D-017', name: '植保无人机', category: '防治设备', status: 'online' }
    ],
    'F-006': [
      { id: 'D-018', name: '田间监测摄像头', category: '病虫害监测', status: 'online' },
      { id: 'D-019', name: '气象监测站', category: '气象监测', status: 'online' },
      { id: 'D-021', name: '植保无人机', category: '防治设备', status: 'online' }
    ],
    'F-007': [
      { id: 'D-022', name: '田间监测摄像头', category: '病虫害监测', status: 'online' }
    ],
    'F-008': [
      { id: 'D-023', name: '田间监测摄像头', category: '病虫害监测', status: 'online' },
      { id: 'D-024', name: '气象监测站', category: '气象监测', status: 'online' },
      { id: 'D-025', name: '植保无人机', category: '防治设备', status: 'online' }
    ]
  };

  return deviceData[fieldId] || [];
}


