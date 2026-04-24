// 病虫害模态框组件
import { showToast } from '../utils/toast.js';
import { pestCategories, pestLevels, pestStatuses, fieldOptions, generatePestId } from '../data/pests.js';

// 显示添加病虫害模态框
export function showAddPestModal(pests, renderGrid) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal" style="max-width: 600px; max-height: 90vh; overflow-y: auto;">
      <div class="modal-header">
        <h3>添加病虫害记录</h3>
        <button class="modal-close" id="close-add-pest-btn">&times;</button>
      </div>
      <div class="modal-body">
        <form id="add-pest-form">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
            <div>
              <label style="display: block; margin-bottom: 8px; font-weight: 500;">病虫害名称 *</label>
              <input type="text" id="pest-title" required
                     style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px;"
                     placeholder="请输入病虫害名称">
            </div>
            <div>
              <label style="display: block; margin-bottom: 8px; font-weight: 500;">发生田块 *</label>
              <select id="pest-field" required
                      style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px;">
                <option value="">请选择田块</option>
                ${fieldOptions.map(field => `<option value="${field.id}" data-name="${field.name}">${field.name}</option>`).join('')}
              </select>
            </div>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
            <div>
              <label style="display: block; margin-bottom: 8px; font-weight: 500;">病虫害类型 *</label>
              <select id="pest-category" required
                      style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px;">
                <option value="">请选择类型</option>
                ${pestCategories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
              </select>
            </div>
            <div>
              <label style="display: block; margin-bottom: 8px; font-weight: 500;">严重程度 *</label>
              <select id="pest-level" required
                      style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px;">
                <option value="">请选择严重程度</option>
                ${pestLevels.map(level => `<option value="${level}">${level}</option>`).join('')}
              </select>
            </div>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
            <div>
              <label style="display: block; margin-bottom: 8px; font-weight: 500;">发现日期 *</label>
              <input type="date" id="pest-date" required
                     style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px;">
            </div>
            <div>
              <label style="display: block; margin-bottom: 8px; font-weight: 500;">感染面积 *</label>
              <input type="number" id="pest-area" required min="0" step="0.1"
                     style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px;"
                     placeholder="请输入面积">
            </div>
          </div>
          
          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">病原/害虫学名</label>
            <input type="text" id="pest-scientific-name"
                   style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px;"
                   placeholder="请输入学名（可选）">
          </div>
          
          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">症状描述</label>
            <textarea id="pest-description" rows="3"
                      style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px; resize: vertical;"
                      placeholder="请描述病虫害的症状表现"></textarea>
          </div>
          
          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">防治方案</label>
            <textarea id="pest-solution" rows="3"
                      style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px; resize: vertical;"
                      placeholder="请输入防治方案"></textarea>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
            <div>
              <label style="display: block; margin-bottom: 8px; font-weight: 500;">处理状态</label>
              <select id="pest-status"
                      style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px;">
                ${pestStatuses.map(status => `<option value="${status}">${status}</option>`).join('')}
              </select>
            </div>
            <div>
              <label style="display: block; margin-bottom: 8px; font-weight: 500;">严重程度百分比</label>
              <input type="number" id="pest-severity" min="0" max="100"
                     style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px;"
                     placeholder="0-100">
            </div>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
            <div>
              <label style="display: block; margin-bottom: 8px; font-weight: 500;">负责技术员</label>
              <input type="text" id="pest-technician"
                     style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px;"
                     placeholder="请输入技术员姓名">
            </div>
            <div>
              <label style="display: block; margin-bottom: 8px; font-weight: 500;">防治成本（元）</label>
              <input type="number" id="pest-cost" min="0" step="0.01"
                     style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px;"
                     placeholder="请输入成本">
            </div>
          </div>
          
          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">备注</label>
            <textarea id="pest-notes" rows="2"
                      style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px; resize: vertical;"
                      placeholder="请输入备注信息"></textarea>
          </div>
          
          <div style="display: flex; gap: 12px; justify-content: flex-end;">
            <button type="button" id="cancel-add-pest-btn" class="btn btn-outline">取消</button>
            <button type="submit" class="btn btn-primary">添加记录</button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // 设置默认日期为今天
  const today = new Date().toISOString().split('T')[0];
  modal.querySelector('#pest-date').value = today;

  // 关闭按钮
  modal.querySelector('#close-add-pest-btn').addEventListener('click', () => {
    document.body.removeChild(modal);
  });

  // 取消按钮
  modal.querySelector('#cancel-add-pest-btn').addEventListener('click', () => {
    document.body.removeChild(modal);
  });

  // 表单提交
  modal.querySelector('#add-pest-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const fieldSelect = modal.querySelector('#pest-field');
    const selectedField = fieldSelect.options[fieldSelect.selectedIndex];

    const newPest = {
      id: generatePestId(),
      title: modal.querySelector('#pest-title').value,
      field: selectedField.dataset.name,
      fieldId: modal.querySelector('#pest-field').value,
      category: modal.querySelector('#pest-category').value,
      pest: modal.querySelector('#pest-scientific-name').value || '未知',
      level: modal.querySelector('#pest-level').value,
      date: modal.querySelector('#pest-date').value,
      status: modal.querySelector('#pest-status').value,
      severity: parseInt(modal.querySelector('#pest-severity').value) || 0,
      area: modal.querySelector('#pest-area').value + '亩',
      solution: modal.querySelector('#pest-solution').value,
      description: modal.querySelector('#pest-description').value,
      technician: modal.querySelector('#pest-technician').value || '未指定',
      notes: modal.querySelector('#pest-notes').value,
      cost: parseFloat(modal.querySelector('#pest-cost').value) || 0,
      symptoms: [],
      prevention: [],
      treatment: [],
      images: [],
      nextCheck: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    pests.unshift(newPest);
    showToast('病虫害记录添加成功！', 'success');
    document.body.removeChild(modal);
    if (renderGrid) renderGrid();
  });

  // 点击背景关闭
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
}

// 显示编辑病虫害模态框
export function showEditPestModal(pest, pests, renderGrid) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal" style="max-width: 300px; width: 90vw; max-height: 95vh; overflow-y: auto;">
      <div class="modal-header" style="padding: 16px 20px;">
        <h3 style="margin: 0; font-size: 18px;">编辑病虫害记录</h3>
        <button class="modal-close" id="close-edit-pest-btn">&times;</button>
      </div>
      <div class="modal-body" style="padding: 20px;">
        <form id="edit-pest-form">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
            <div>
              <label style="display: block; margin-bottom: 8px; font-weight: 500;">病虫害名称 *</label>
              <input type="text" id="edit-pest-title" value="${pest.title}" required
                     style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px;">
            </div>
            <div>
              <label style="display: block; margin-bottom: 8px; font-weight: 500;">发生田块 *</label>
              <select id="edit-pest-field" required
                      style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px;">
                <option value="">请选择田块</option>
                ${fieldOptions.map(field =>
    `<option value="${field.id}" data-name="${field.name}" ${field.id === pest.fieldId ? 'selected' : ''}>${field.name}</option>`
  ).join('')}
              </select>
            </div>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
            <div>
              <label style="display: block; margin-bottom: 8px; font-weight: 500;">病虫害类型 *</label>
              <select id="edit-pest-category" required
                      style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px;">
                <option value="">请选择类型</option>
                ${pestCategories.map(cat =>
    `<option value="${cat}" ${cat === pest.category ? 'selected' : ''}>${cat}</option>`
  ).join('')}
              </select>
            </div>
            <div>
              <label style="display: block; margin-bottom: 8px; font-weight: 500;">严重程度 *</label>
              <select id="edit-pest-level" required
                      style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px;">
                <option value="">请选择严重程度</option>
                ${pestLevels.map(level =>
    `<option value="${level}" ${level === pest.level ? 'selected' : ''}>${level}</option>`
  ).join('')}
              </select>
            </div>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
            <div>
              <label style="display: block; margin-bottom: 8px; font-weight: 500;">发现日期 *</label>
              <input type="date" id="edit-pest-date" value="${pest.date}" required
                     style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px;">
            </div>
            <div>
              <label style="display: block; margin-bottom: 8px; font-weight: 500;">感染面积 *</label>
              <input type="number" id="edit-pest-area" value="${parseFloat(pest.area)}" required min="0" step="0.1"
                     style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px;">
            </div>
          </div>
          
          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">病原/害虫学名</label>
            <input type="text" id="edit-pest-scientific-name" value="${pest.pest}"
                   style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px;">
          </div>
          
          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">症状描述</label>
            <textarea id="edit-pest-description" rows="3"
                      style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px; resize: vertical;">${pest.description || ''}</textarea>
          </div>
          
          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">防治方案</label>
            <textarea id="edit-pest-solution" rows="3"
                      style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px; resize: vertical;">${pest.solution}</textarea>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
            <div>
              <label style="display: block; margin-bottom: 8px; font-weight: 500;">处理状态</label>
              <select id="edit-pest-status"
                      style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px;">
                ${pestStatuses.map(status =>
    `<option value="${status}" ${status === pest.status ? 'selected' : ''}>${status}</option>`
  ).join('')}
              </select>
            </div>
            <div>
              <label style="display: block; margin-bottom: 8px; font-weight: 500;">严重程度百分比</label>
              <input type="number" id="edit-pest-severity" value="${pest.severity}" min="0" max="100"
                     style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px;">
            </div>
          </div>
          
          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">防治成本（元）</label>
            <input type="number" id="edit-pest-cost" value="${pest.cost || 0}" min="0" step="0.01"
                   style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 14px;">
          </div>
          
          <!-- 防治记录管理 -->
          <div style="margin-top: 32px; padding-top: 24px; border-top: 2px solid var(--color-border);">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <div style="width: 4px; height: 20px; background: var(--color-success-500); border-radius: 2px;"></div>
                <h4 style="margin: 0; color: var(--color-success-700); font-size: 18px; font-weight: 600;">防治记录</h4>
                ${pest.treatmentRecords && pest.treatmentRecords.length > 0 ? `
                  <span style="background: var(--color-success-100); color: var(--color-success-700); padding: 2px 8px; border-radius: 12px; font-size: 14px; font-weight: 500;">${pest.treatmentRecords.length} 条</span>
                ` : ''}
              </div>
              <button type="button" id="add-treatment-in-edit-btn" class="btn btn-primary" style="padding: 8px 16px; border-radius: 6px; font-size: 14px; font-weight: 500;">+ 添加记录</button>
            </div>
            
            <div id="treatment-records-list" style="max-height: 400px; overflow-y: auto; border: 1px solid var(--color-border); border-radius: 8px; background: var(--color-bg-50);">
              ${pest.treatmentRecords && pest.treatmentRecords.length > 0 ? `
                ${pest.treatmentRecords.map((record, index) => `
                  <div class="treatment-record-item" data-record-id="${record.id}" style="padding: 16px; border-bottom: ${index < pest.treatmentRecords.length - 1 ? '1px solid var(--color-border-100)' : 'none'}; display: grid; grid-template-columns: 100px 1fr 120px 100px 100px; gap: 12px; align-items: center; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor='var(--color-bg-100)'" onmouseout="this.style.backgroundColor='transparent'">
                    <div style="font-size: 14px; color: var(--color-text-700);">${record.date}</div>
                    <div style="font-size: 14px; color: var(--color-text-600); line-height: 1.4;">${record.content || record.method || '未填写'}</div>
                    <div style="font-size: 14px; color: var(--color-text-600);">${record.chemical || '-'}</div>
                    <div><span class="tag" style="font-size: 12px; padding: 4px 8px; background: var(--color-info-100); color: var(--color-info-700); border-radius: 4px;">${record.status || record.result || '未知'}</span></div>
                    <div style="display: flex; gap: 6px;">
                      <button type="button" class="edit-treatment-record-btn" data-record-id="${record.id}" style="padding: 4px 8px; border: 1px solid var(--color-border); border-radius: 4px; background: white; cursor: pointer; font-size: 12px;">编辑</button>
                      <button type="button" class="delete-treatment-record-btn" data-record-id="${record.id}" style="padding: 4px 8px; border: 1px solid var(--color-danger-300); border-radius: 4px; background: white; color: var(--color-danger-600); cursor: pointer; font-size: 12px;">删除</button>
                    </div>
                  </div>
                `).join('')}
              ` : `
                <div style="padding: 40px; text-align: center; color: var(--color-text-500);">
                  <div style="font-size: 36px; margin-bottom: 12px; opacity: 0.3;">📋</div>
                  <p style="margin: 0; font-size: 14px;">暂无防治记录，点击上方按钮添加</p>
                </div>
              `}
            </div>
          </div>
          
          <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px;">
            <button type="button" id="cancel-edit-pest-btn" class="btn btn-outline">取消</button>
            <button type="submit" class="btn btn-primary">保存修改</button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // 关闭按钮
  modal.querySelector('#close-edit-pest-btn').addEventListener('click', () => {
    document.body.removeChild(modal);
  });

  // 取消按钮
  modal.querySelector('#cancel-edit-pest-btn').addEventListener('click', () => {
    document.body.removeChild(modal);
  });

  // 导入防治记录相关函数
  import('./treatmentRecordModals.js').then(treatmentModule => {
    // 添加防治记录按钮
    const addTreatmentBtn = modal.querySelector('#add-treatment-in-edit-btn');
    if (addTreatmentBtn) {
      addTreatmentBtn.addEventListener('click', () => {
        treatmentModule.showAddTreatmentRecordModal(pest, pests, () => {
          // 重新渲染防治记录列表
          renderTreatmentRecordsList(modal, pest, pests);
        });
      });
    }

    // 编辑防治记录按钮
    modal.querySelectorAll('.edit-treatment-record-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const recordId = btn.dataset.recordId;
        const record = pest.treatmentRecords.find(r => r.id === recordId);
        if (record) {
          treatmentModule.showEditTreatmentRecordModal(record, pest, pests, () => {
            // 重新渲染防治记录列表
            renderTreatmentRecordsList(modal, pest, pests);
          });
        }
      });
    });

    // 删除防治记录按钮
    modal.querySelectorAll('.delete-treatment-record-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const recordId = btn.dataset.recordId;
        if (confirm('确定要删除这条防治记录吗？')) {
          const index = pest.treatmentRecords.findIndex(r => r.id === recordId);
          if (index > -1) {
            pest.treatmentRecords.splice(index, 1);
            showToast('防治记录已删除', 'success');
            // 重新渲染防治记录列表
            renderTreatmentRecordsList(modal, pest, pests);
          }
        }
      });
    });
  });

  // 渲染防治记录列表的函数
  function renderTreatmentRecordsList(modalElement, pestData, pestsArray) {
    const listContainer = modalElement.querySelector('#treatment-records-list');
    const headerDiv = modalElement.querySelector('#treatment-records-list').closest('div').querySelector('div[style*="display: flex"]');
    let countSpan = headerDiv ? headerDiv.querySelector('span') : null;

    if (pestData.treatmentRecords && pestData.treatmentRecords.length > 0) {
      listContainer.innerHTML = pestData.treatmentRecords.map((record, index) => `
        <div class="treatment-record-item" data-record-id="${record.id}" style="padding: 16px; border-bottom: ${index < pestData.treatmentRecords.length - 1 ? '1px solid var(--color-border-100)' : 'none'}; display: grid; grid-template-columns: 100px 1fr 120px 100px 100px; gap: 12px; align-items: center; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor='var(--color-bg-100)'" onmouseout="this.style.backgroundColor='transparent'">
          <div style="font-size: 14px; color: var(--color-text-700);">${record.date}</div>
          <div style="font-size: 14px; color: var(--color-text-600); line-height: 1.4;">${record.content || record.method || '未填写'}</div>
          <div style="font-size: 14px; color: var(--color-text-600);">${record.chemical || '-'}</div>
          <div><span class="tag" style="font-size: 12px; padding: 4px 8px; background: var(--color-info-100); color: var(--color-info-700); border-radius: 4px;">${record.status || record.result || '未知'}</span></div>
          <div style="display: flex; gap: 6px;">
            <button type="button" class="edit-treatment-record-btn" data-record-id="${record.id}" style="padding: 4px 8px; border: 1px solid var(--color-border); border-radius: 4px; background: white; cursor: pointer; font-size: 12px;">编辑</button>
            <button type="button" class="delete-treatment-record-btn" data-record-id="${record.id}" style="padding: 4px 8px; border: 1px solid var(--color-danger-300); border-radius: 4px; background: white; color: var(--color-danger-600); cursor: pointer; font-size: 12px;">删除</button>
          </div>
        </div>
      `).join('');

      // 更新计数
      if (!countSpan && headerDiv) {
        const titleDiv = headerDiv.querySelector('div');
        countSpan = document.createElement('span');
        countSpan.style.cssText = 'background: var(--color-success-100); color: var(--color-success-700); padding: 2px 8px; border-radius: 12px; font-size: 14px; font-weight: 500;';
        titleDiv.appendChild(countSpan);
      }
      if (countSpan) {
        countSpan.textContent = `${pestData.treatmentRecords.length} 条`;
      }

      // 重新绑定事件
      import('./treatmentRecordModals.js').then(treatmentModule => {
        modalElement.querySelectorAll('.edit-treatment-record-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const recordId = btn.dataset.recordId;
            const record = pestData.treatmentRecords.find(r => r.id === recordId);
            if (record) {
              treatmentModule.showEditTreatmentRecordModal(record, pestData, pestsArray, () => {
                renderTreatmentRecordsList(modalElement, pestData, pestsArray);
              });
            }
          });
        });

        modalElement.querySelectorAll('.delete-treatment-record-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const recordId = btn.dataset.recordId;
            if (confirm('确定要删除这条防治记录吗？')) {
              const index = pestData.treatmentRecords.findIndex(r => r.id === recordId);
              if (index > -1) {
                pestData.treatmentRecords.splice(index, 1);
                showToast('防治记录已删除', 'success');
                renderTreatmentRecordsList(modalElement, pestData, pestsArray);
              }
            }
          });
        });
      });
    } else {
      listContainer.innerHTML = `
        <div style="padding: 40px; text-align: center; color: var(--color-text-500);">
          <div style="font-size: 36px; margin-bottom: 12px; opacity: 0.3;">📋</div>
          <p style="margin: 0; font-size: 14px;">暂无防治记录，点击上方按钮添加</p>
        </div>
      `;
      if (countSpan) {
        countSpan.remove();
      }
    }
  }

  // 表单提交
  modal.querySelector('#edit-pest-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const fieldSelect = modal.querySelector('#edit-pest-field');
    const selectedField = fieldSelect.options[fieldSelect.selectedIndex];

    // 更新病虫害记录
    pest.title = modal.querySelector('#edit-pest-title').value;
    pest.field = selectedField.dataset.name;
    pest.fieldId = modal.querySelector('#edit-pest-field').value;
    pest.category = modal.querySelector('#edit-pest-category').value;
    pest.pest = modal.querySelector('#edit-pest-scientific-name').value;
    pest.level = modal.querySelector('#edit-pest-level').value;
    pest.date = modal.querySelector('#edit-pest-date').value;
    pest.status = modal.querySelector('#edit-pest-status').value;
    pest.severity = parseInt(modal.querySelector('#edit-pest-severity').value) || 0;
    pest.area = modal.querySelector('#edit-pest-area').value + '亩';
    pest.solution = modal.querySelector('#edit-pest-solution').value;
    pest.description = modal.querySelector('#edit-pest-description').value;
    pest.cost = parseFloat(modal.querySelector('#edit-pest-cost').value) || 0;

    showToast('病虫害记录修改成功！', 'success');
    document.body.removeChild(modal);
    if (renderGrid) renderGrid();
  });

  // 点击背景关闭
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
}
