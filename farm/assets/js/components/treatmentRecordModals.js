// 处理记录模态框组件
import { showToast } from '../utils/toast.js';

// 获取状态标签样式
function getStatusTagClass(status) {
  switch (status) {
    case '待处理': return 'tag-warning';
    case '处理中': return 'tag-info';
    case '已解决': return 'tag-success';
    default: return 'tag-default';
  }
}

// 显示编辑处理记录模态框
export function showEditTreatmentRecordModal(record, pest, pests, onSuccess) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  `;

  modal.innerHTML = `
    <div class="modal" style="max-width: 600px; max-height: 90vh; overflow-y: auto; background: white; border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.15); position: relative;">
      <button class="modal-close" id="close-edit-treatment-btn" style="position: absolute; top: 16px; right: 16px; width: 32px; height: 32px; border-radius: 50%; border: none; background: rgba(0,0,0,0.1); color: var(--color-text-600); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: bold; z-index: 10;">&times;</button>
      
      <div class="modal-header" style="padding: 20px 24px; border-bottom: 1px solid var(--color-border);">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 40px; height: 40px; background: linear-gradient(135deg, var(--color-warning-100), var(--color-warning-200)); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 20px;">
            ✏️
          </div>
          <div>
            <h3 style="margin: 0; font-size: 20px; color: var(--color-text-800);">编辑处理记录</h3>
            <p style="margin: 4px 0 0 0; font-size: 14px; color: var(--color-text-500);">${pest.title}</p>
          </div>
        </div>
      </div>
      
      <div class="modal-body" style="padding: 24px;">
        <form id="edit-treatment-form">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
            <div>
              <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--color-text-700);">处理日期 *</label>
              <input type="date" id="edit-treatment-date" required
                     style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px; background: var(--color-bg-50);"
                     value="${record.date}">
            </div>
            <div>
              <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--color-text-700);">处理状态 *</label>
              <select id="edit-treatment-status" required
                      style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px; background: var(--color-bg-50);">
                <option value="">请选择状态</option>
                <option value="待处理" ${record.status === '待处理' ? 'selected' : ''}>待处理</option>
                <option value="处理中" ${record.status === '处理中' ? 'selected' : ''}>处理中</option>
                <option value="已解决" ${record.status === '已解决' ? 'selected' : ''}>已解决</option>
                <option value="复发" ${record.status === '复发' ? 'selected' : ''}>复发</option>
              </select>
            </div>
          </div>
          
          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--color-text-700);">处理内容 *</label>
            <textarea id="edit-treatment-content" rows="4" required
                      style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px; resize: vertical; background: var(--color-bg-50);"
                      placeholder="请详细描述处理内容，包括方法、效果等">${record.content || record.method || ''}</textarea>
          </div>
          
          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--color-text-700);">使用药剂</label>
            <input type="text" id="edit-treatment-chemical"
                   style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px; background: var(--color-bg-50);"
                   placeholder="请输入使用的药剂名称" value="${record.chemical || ''}">
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
            <div>
              <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--color-text-700);">操作人</label>
              <input type="text" id="edit-treatment-operator"
                     style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px; background: var(--color-bg-50);"
                     placeholder="请输入操作人姓名" value="${record.operator || record.technician || ''}">
            </div>
            <div>
              <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--color-text-700);">处理成本（元）</label>
              <input type="number" id="edit-treatment-cost" min="0" step="0.01"
                     style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px; background: var(--color-bg-50);"
                     placeholder="请输入处理成本" value="${record.cost || 0}">
            </div>
          </div>
          
          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--color-text-700);">备注</label>
            <textarea id="edit-treatment-notes" rows="3"
                      style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px; resize: vertical; background: var(--color-bg-50);"
                      placeholder="请输入备注信息，如注意事项、后续计划等">${record.notes || ''}</textarea>
          </div>
          
          <div style="display: flex; gap: 12px; justify-content: flex-end;">
            <button type="button" id="cancel-edit-treatment-btn" class="btn btn-outline" style="padding: 10px 20px; border-radius: 8px; font-weight: 500;">取消</button>
            <button type="submit" class="btn btn-primary" style="padding: 10px 20px; border-radius: 8px; font-weight: 500;">保存修改</button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // 关闭按钮
  modal.querySelector('#close-edit-treatment-btn').addEventListener('click', () => {
    document.body.removeChild(modal);
  });

  // 取消按钮
  modal.querySelector('#cancel-edit-treatment-btn').addEventListener('click', () => {
    document.body.removeChild(modal);
  });

  // 表单提交
  modal.querySelector('#edit-treatment-form').addEventListener('submit', (e) => {
    e.preventDefault();

    // 更新记录
    record.date = modal.querySelector('#edit-treatment-date').value;
    record.content = modal.querySelector('#edit-treatment-content').value;
    record.method = modal.querySelector('#edit-treatment-content').value; // 兼容method字段
    record.chemical = modal.querySelector('#edit-treatment-chemical').value || '';
    record.status = modal.querySelector('#edit-treatment-status').value;
    record.result = modal.querySelector('#edit-treatment-status').value; // 兼容result字段
    record.operator = modal.querySelector('#edit-treatment-operator').value || '未指定';
    record.technician = modal.querySelector('#edit-treatment-operator').value || '未指定'; // 兼容technician字段
    record.cost = parseFloat(modal.querySelector('#edit-treatment-cost').value) || 0;
    record.notes = modal.querySelector('#edit-treatment-notes').value;
    record.updatedAt = new Date().toISOString();

    // 更新病虫害状态为最新处理记录的状态
    if (pest.treatmentRecords && pest.treatmentRecords.length > 0) {
      const latestRecord = pest.treatmentRecords[0];
      pest.status = latestRecord.status;
    }

    showToast('处理记录修改成功！', 'success');
    document.body.removeChild(modal);

    // 执行成功回调
    if (onSuccess) {
      onSuccess();
    }
  });

  // 移除点击背景关闭功能，只能通过关闭按钮关闭
}

// 显示添加处理记录模态框
export function showAddTreatmentRecordModal(pest, pests, onSuccess) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  `;

  modal.innerHTML = `
    <div class="modal" style="max-width: 600px; max-height: 90vh; overflow-y: auto; background: white; border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.15); position: relative;">
      <button class="modal-close" id="close-add-treatment-btn" style="position: absolute; top: 16px; right: 16px; width: 32px; height: 32px; border-radius: 50%; border: none; background: rgba(0,0,0,0.1); color: var(--color-text-600); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: bold; z-index: 10;">&times;</button>
      
      <div class="modal-header" style="padding: 20px 24px; border-bottom: 1px solid var(--color-border);">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 40px; height: 40px; background: linear-gradient(135deg, var(--color-success-100), var(--color-success-200)); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 20px;">
            📝
          </div>
          <div>
            <h3 style="margin: 0; font-size: 20px; color: var(--color-text-800);">添加处理记录</h3>
            <p style="margin: 4px 0 0 0; font-size: 14px; color: var(--color-text-500);">${pest.title}</p>
          </div>
        </div>
      </div>
      
      <div class="modal-body" style="padding: 24px;">
        <form id="add-treatment-form">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
            <div>
              <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--color-text-700);">处理日期 *</label>
              <input type="date" id="treatment-date" required
                     style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px; background: var(--color-bg-50);">
            </div>
            <div>
              <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--color-text-700);">处理状态 *</label>
              <select id="treatment-status" required
                      style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px; background: var(--color-bg-50);">
                <option value="">请选择状态</option>
                <option value="待处理">待处理</option>
                <option value="处理中">处理中</option>
                <option value="已解决">已解决</option>
                <option value="复发">复发</option>
              </select>
            </div>
          </div>
          
          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--color-text-700);">处理内容 *</label>
            <textarea id="treatment-content" rows="4" required
                      style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px; resize: vertical; background: var(--color-bg-50);"
                      placeholder="请详细描述处理内容，包括方法、效果等"></textarea>
          </div>
          
          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--color-text-700);">使用药剂</label>
            <input type="text" id="treatment-chemical"
                   style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px; background: var(--color-bg-50);"
                   placeholder="请输入使用的药剂名称">
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
            <div>
              <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--color-text-700);">操作人</label>
              <input type="text" id="treatment-operator"
                     style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px; background: var(--color-bg-50);"
                     placeholder="请输入操作人姓名" value="${pest.technician || ''}">
            </div>
            <div>
              <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--color-text-700);">处理成本（元）</label>
              <input type="number" id="treatment-cost" min="0" step="0.01"
                     style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px; background: var(--color-bg-50);"
                     placeholder="请输入处理成本">
            </div>
          </div>
          
          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: var(--color-text-700);">备注</label>
            <textarea id="treatment-notes" rows="3"
                      style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px; resize: vertical; background: var(--color-bg-50);"
                      placeholder="请输入备注信息，如注意事项、后续计划等"></textarea>
          </div>
          
          <div style="display: flex; gap: 12px; justify-content: flex-end;">
            <button type="button" id="cancel-add-treatment-btn" class="btn btn-outline" style="padding: 10px 20px; border-radius: 8px; font-weight: 500;">取消</button>
            <button type="submit" class="btn btn-primary" style="padding: 10px 20px; border-radius: 8px; font-weight: 500;">添加记录</button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // 设置默认日期为今天
  const today = new Date().toISOString().split('T')[0];
  modal.querySelector('#treatment-date').value = today;

  // 关闭按钮
  modal.querySelector('#close-add-treatment-btn').addEventListener('click', () => {
    document.body.removeChild(modal);
  });

  // 取消按钮
  modal.querySelector('#cancel-add-treatment-btn').addEventListener('click', () => {
    document.body.removeChild(modal);
  });

  // 表单提交
  modal.querySelector('#add-treatment-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const treatmentRecord = {
      id: `TR-${Date.now()}`,
      date: modal.querySelector('#treatment-date').value,
      content: modal.querySelector('#treatment-content').value,
      method: modal.querySelector('#treatment-content').value, // 兼容method字段
      chemical: modal.querySelector('#treatment-chemical').value || '',
      status: modal.querySelector('#treatment-status').value,
      result: modal.querySelector('#treatment-status').value, // 兼容result字段
      operator: modal.querySelector('#treatment-operator').value || '未指定',
      technician: modal.querySelector('#treatment-operator').value || '未指定', // 兼容technician字段
      cost: parseFloat(modal.querySelector('#treatment-cost').value) || 0,
      notes: modal.querySelector('#treatment-notes').value,
      createdAt: new Date().toISOString()
    };

    // 更新病虫害状态
    pest.status = treatmentRecord.status;

    // 更新防治成本
    if (treatmentRecord.cost > 0) {
      pest.cost = (pest.cost || 0) + treatmentRecord.cost;
    }

    // 计算下次检查时间（7天后）
    const nextCheckDate = new Date();
    nextCheckDate.setDate(nextCheckDate.getDate() + 7);
    pest.nextCheck = nextCheckDate.toISOString().split('T')[0];

    // 添加处理记录到病虫害对象中
    if (!pest.treatmentRecords) {
      pest.treatmentRecords = [];
    }
    pest.treatmentRecords.unshift(treatmentRecord);

    showToast('处理记录添加成功！', 'success');
    document.body.removeChild(modal);

    // 执行成功回调
    if (onSuccess) {
      onSuccess();
    }
  });

  // 移除点击背景关闭功能，只能通过关闭按钮关闭
}
