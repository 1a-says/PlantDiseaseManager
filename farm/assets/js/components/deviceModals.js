import { showToast } from '../utils/toast.js';
import { generateDefaultReadings, getDeviceIcon } from '../data/devices.js';

// 添加设备模态框
export function showAddDeviceModal(devices, renderGrid) {
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
    background: rgba(0,0,0,0.5); z-index: 1000; display: flex; 
    align-items: center; justify-content: center;
  `;

  modal.innerHTML = `
    <div style="background: white; border-radius: 12px; padding: 24px; width: 600px; max-width: 90vw; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
      <h3 style="margin: 0 0 20px 0; color: var(--color-primary-900);">添加新设备</h3>
      <form id="add-device-form">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">设备名称</label>
            <input type="text" id="device-name" placeholder="如：土壤湿度传感器" required 
                   style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px;">
          </div>
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">设备类型</label>
            <select id="device-category" required 
                    style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px;">
              <option value="">请选择类型</option>
              <option value="传感器">传感器</option>
              <option value="相机">相机</option>
              <option value="控制器">控制器</option>
            </select>
          </div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">关联田块</label>
            <select id="device-field" required 
                    style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px;">
              <option value="">请选择田块</option>
              <option value="F-001">东区玉米田 (F-001)</option>
              <option value="F-002">西区玉米田 (F-002)</option>
              <option value="F-003">南平玉米田 (F-003)</option>
              <option value="F-004">菜园白菜田 (F-004)</option>
            </select>
          </div>
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">安装位置</label>
            <input type="text" id="device-location" placeholder="如：东区玉米田A区" required 
                   style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px;">
          </div>
        </div>
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">设备描述</label>
          <textarea id="device-description" placeholder="设备功能描述、技术参数等" rows="3"
                    style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px; resize: vertical;"></textarea>
        </div>
        <div style="display: flex; gap: 12px; justify-content: flex-end;">
          <button type="button" id="cancel-add-btn" class="btn btn-outline">取消</button>
          <button type="submit" class="btn btn-primary">添加设备</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  // 取消按钮
  modal.querySelector('#cancel-add-btn').addEventListener('click', () => {
    document.body.removeChild(modal);
  });

  // 点击背景关闭
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });

  // 表单提交
  modal.querySelector('#add-device-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const newDevice = {
      id: `DEV-${String(Date.now()).slice(-3)}`,
      name: modal.querySelector('#device-name').value,
      category: modal.querySelector('#device-category').value,
      location: modal.querySelector('#device-location').value,
      fieldId: modal.querySelector('#device-field').value,
      status: 'online',
      description: modal.querySelector('#device-description').value,
      dataReadings: generateDefaultReadings(modal.querySelector('#device-category').value)
    };

    // 添加到设备列表
    devices.push(newDevice);
    showToast('设备添加成功！', 'success');
    document.body.removeChild(modal);

    // 重新渲染
    if (renderGrid) {
      renderGrid();
    }
  });
}

// 批量维护模态框
export function showBatchMaintenanceModal(devices, state, renderGrid) {
  if (state.selected.size === 0) {
    showToast('请先选择要维护的设备', 'warn');
    return;
  }

  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
    background: rgba(0,0,0,0.5); z-index: 1000; display: flex; 
    align-items: center; justify-content: center;
  `;

  const selectedDevices = Array.from(state.selected).map(id =>
    devices.find(d => d.id === id)
  );

  modal.innerHTML = `
    <div style="background: white; border-radius: 12px; padding: 24px; width: 500px; max-width: 90vw; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
      <h3 style="margin: 0 0 20px 0; color: var(--color-primary-900);">批量维护 (${state.selected.size}台设备)</h3>
      <div style="margin-bottom: 16px; max-height: 200px; overflow-y: auto; border: 1px solid var(--color-border); border-radius: 8px; padding: 12px;">
        ${selectedDevices.map(device => `
          <div style="display: flex; align-items: center; gap: 8px; padding: 4px 0; border-bottom: 1px solid #f0f0f0;">
            <span>${getDeviceIcon(device.category)}</span>
            <span style="flex: 1;">${device.name}</span>
            <span style="font-size: 12px; color: var(--color-text-muted);">${device.id}</span>
          </div>
        `).join('')}
      </div>
      <form id="batch-maintenance-form">
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">维护类型</label>
          <select id="maintenance-type" required 
                  style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px;">
            <option value="">请选择维护类型</option>
            <option value="定期检查">定期检查</option>
            <option value="清洁保养">清洁保养</option>
            <option value="校准调试">校准调试</option>
            <option value="电池更换">电池更换</option>
            <option value="固件更新">固件更新</option>
            <option value="故障维修">故障维修</option>
          </select>
        </div>
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">维护说明</label>
          <textarea id="maintenance-note" placeholder="维护详情、注意事项等" rows="3"
                    style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px; resize: vertical;"></textarea>
        </div>
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500;">计划时间</label>
          <input type="datetime-local" id="maintenance-time" 
                 style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px;">
        </div>
        <div style="display: flex; gap: 12px; justify-content: flex-end;">
          <button type="button" id="cancel-maintenance-btn" class="btn btn-outline">取消</button>
          <button type="submit" class="btn btn-primary">创建维护单</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  // 取消按钮
  modal.querySelector('#cancel-maintenance-btn').addEventListener('click', () => {
    document.body.removeChild(modal);
  });

  // 点击背景关闭
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });

  // 表单提交
  modal.querySelector('#batch-maintenance-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const maintenanceType = modal.querySelector('#maintenance-type').value;
    const maintenanceNote = modal.querySelector('#maintenance-note').value;
    const maintenanceTime = modal.querySelector('#maintenance-time').value;

    // 为每个选中的设备创建维护记录
    selectedDevices.forEach(device => {
      const maintenanceRecord = {
        id: `MAINT-${Date.now()}-${device.id}`,
        deviceId: device.id,
        deviceName: device.name,
        type: maintenanceType,
        note: maintenanceNote,
        scheduledTime: maintenanceTime || new Date().toISOString(),
        status: 'scheduled',
        createdAt: new Date().toISOString()
      };

      // 这里应该保存到维护记录数据库
      console.log('创建维护记录:', maintenanceRecord);
    });

    showToast(`已为 ${state.selected.size} 台设备创建维护单`, 'success');
    state.selected.clear();
    document.body.removeChild(modal);
    if (renderGrid) {
      renderGrid();
    }
  });
}

// 批量移除模态框
export function showBatchRemoveModal(devices, state, renderGrid) {
  if (state.selected.size === 0) {
    showToast('请先选择要移除的设备', 'warn');
    return;
  }

  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
    background: rgba(0,0,0,0.5); z-index: 1000; display: flex; 
    align-items: center; justify-content: center;
  `;

  const selectedDevices = Array.from(state.selected).map(id =>
    devices.find(d => d.id === id)
  );

  modal.innerHTML = `
    <div style="background: white; border-radius: 12px; padding: 24px; width: 500px; max-width: 90vw; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
      <h3 style="margin: 0 0 20px 0; color: var(--color-danger-600);">⚠️ 批量移除设备</h3>
      <div style="margin-bottom: 16px; padding: 16px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px;">
        <p style="margin: 0; color: #856404; font-size: 14px;">
          您即将移除 <strong>${state.selected.size}</strong> 台设备，此操作不可撤销！
        </p>
      </div>
      <div style="margin-bottom: 16px; max-height: 200px; overflow-y: auto; border: 1px solid var(--color-border); border-radius: 8px; padding: 12px;">
        ${selectedDevices.map(device => `
          <div style="display: flex; align-items: center; gap: 8px; padding: 4px 0; border-bottom: 1px solid #f0f0f0;">
            <span>${getDeviceIcon(device.category)}</span>
            <span style="flex: 1;">${device.name}</span>
            <span style="font-size: 12px; color: var(--color-text-muted);">${device.id}</span>
          </div>
        `).join('')}
      </div>
      <div style="margin-bottom: 16px;">
        <label style="display: block; margin-bottom: 8px; font-weight: 500;">移除原因</label>
        <select id="remove-reason" required 
                style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px;">
          <option value="">请选择移除原因</option>
          <option value="设备故障">设备故障</option>
          <option value="升级替换">升级替换</option>
          <option value="田块变更">田块变更</option>
          <option value="项目结束">项目结束</option>
          <option value="其他">其他</option>
        </select>
      </div>
      <div style="margin-bottom: 16px;">
        <label style="display: block; margin-bottom: 8px; font-weight: 500;">备注说明</label>
        <textarea id="remove-note" placeholder="移除原因详细说明" rows="3"
                  style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px; resize: vertical;"></textarea>
      </div>
      <div style="display: flex; gap: 12px; justify-content: flex-end;">
        <button type="button" id="cancel-remove-btn" class="btn btn-outline">取消</button>
        <button type="button" id="confirm-remove-btn" class="btn btn-danger">确认移除</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // 取消按钮
  modal.querySelector('#cancel-remove-btn').addEventListener('click', () => {
    document.body.removeChild(modal);
  });

  // 点击背景关闭
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });

  // 确认移除
  modal.querySelector('#confirm-remove-btn').addEventListener('click', () => {
    const removeReason = modal.querySelector('#remove-reason').value;
    const removeNote = modal.querySelector('#remove-note').value;

    if (!removeReason) {
      showToast('请选择移除原因', 'warn');
      return;
    }

    // 记录移除信息
    selectedDevices.forEach(device => {
      const removeRecord = {
        deviceId: device.id,
        deviceName: device.name,
        reason: removeReason,
        note: removeNote,
        removedAt: new Date().toISOString(),
        removedBy: 'current_user'
      };
      console.log('设备移除记录:', removeRecord);
    });

    // 从设备列表中移除
    devices.splice(0, devices.length, ...devices.filter(device => !state.selected.has(device.id)));

    showToast(`已移除 ${state.selected.size} 台设备`, 'success');
    state.selected.clear();
    document.body.removeChild(modal);
    if (renderGrid) {
      renderGrid();
    }
  });
}
