// 病虫害详情组件
import { showToast } from '../utils/toast.js';

// 提取症状关键信息（缩短文本）
function extractSymptomKeyInfo(symptoms) {
  if (!symptoms) return '';

  let symptomText = Array.isArray(symptoms) ? symptoms.join('、') : symptoms;

  // 如果文本过长，提取关键信息
  if (symptomText.length > 40) {
    let keyParts = [];

    // 1. 提取病斑形状（优先匹配"大型椭圆形"）
    if (symptomText.includes('大型椭圆形') || (symptomText.includes('大型') && symptomText.includes('椭圆形'))) {
      keyParts.push('大型椭圆形病斑');
    } else if (symptomText.includes('小型圆形') || (symptomText.includes('小型') && symptomText.includes('圆形'))) {
      keyParts.push('小型圆形病斑');
    } else if (symptomText.match(/大型[^，。]*?病斑/)) {
      keyParts.push('大型病斑');
    } else if (symptomText.match(/椭圆形[^，。]*?病斑/)) {
      keyParts.push('椭圆形病斑');
    } else if (symptomText.includes('不规则病斑')) {
      keyParts.push('不规则病斑');
    }

    // 2. 提取病斑颜色特征（中央和边缘）
    const centerMatch = symptomText.match(/中央[^，。]*?(灰白色|白色|黄色|褐色|黑色)/);
    const edgeMatch = symptomText.match(/边缘[^，。]*?(深褐色|褐色|黑色|黄色|红色)/);

    if (centerMatch || edgeMatch) {
      let colorDesc = '';
      if (centerMatch) {
        const color = centerMatch[1];
        colorDesc = '中央' + color;
      }
      if (edgeMatch) {
        const color = edgeMatch[1];
        if (colorDesc) {
          colorDesc += '，边缘' + color;
        } else {
          colorDesc = '边缘' + color;
        }
      }
      if (colorDesc) keyParts.push(colorDesc);
    }

    // 3. 提取严重情况
    if (symptomText.includes('严重时') || symptomText.includes('症状严重')) {
      if (symptomText.includes('叶片枯死')) {
        keyParts.push('严重时叶片枯死');
      } else if (symptomText.includes('病斑连片')) {
        keyParts.push('严重时病斑连片');
      } else if (symptomText.includes('枯死')) {
        keyParts.push('严重时枯死');
      }
    }

    // 如果提取到关键信息，组合成简短描述（最多3个部分，总长度不超过45字）
    if (keyParts.length > 0) {
      let result = keyParts.slice(0, 3).join('，');
      // 确保总长度不超过45字
      if (result.length > 45) {
        result = result.substring(0, 42) + '...';
      }
      return result + '。';
    }

    // 如果提取失败，尝试提取前两个短句（每个句子不超过25字）
    const sentences = symptomText.split(/[，。]/).filter(s => s.trim().length > 0);
    if (sentences.length > 0) {
      let shortText = '';
      for (let i = 0; i < Math.min(2, sentences.length); i++) {
        const sentence = sentences[i].trim();
        if (sentence.length <= 25) {
          shortText += (shortText ? '，' : '') + sentence;
        } else {
          shortText += (shortText ? '，' : '') + sentence.substring(0, 22) + '...';
        }
        if (shortText.length >= 45) break;
      }
      return shortText + '。';
    }

    // 最后兜底：直接截取前40个字符
    return symptomText.substring(0, 40) + '...';
  }

  return symptomText;
}

// 获取严重程度标签样式
function getSeverityTagClass(level) {
  switch (level) {
    case '严重': return 'tag-danger';
    case '高': return 'tag-warning';
    case '中': return 'tag-info';
    case '低': return 'tag-success';
    default: return 'tag-default';
  }
}

// 获取状态标签样式
function getStatusTagClass(status) {
  switch (status) {
    case '待处理': return 'tag-warning';
    case '处理中': return 'tag-info';
    case '已解决': return 'tag-success';
    default: return 'tag-default';
  }
}

// 获取病虫害图标
function getPestIcon(category) {
  return '';
}
import { showEditTreatmentRecordModal, showAddTreatmentRecordModal } from './treatmentRecordModals.js';

// 更新病虫害状态为最新处理记录的状态
function updatePestStatusFromLatestRecord(pest) {
  if (pest.treatmentRecords && pest.treatmentRecords.length > 0) {
    const latestRecord = pest.treatmentRecords[0];
    pest.status = latestRecord.status || latestRecord.result || pest.status;
  }
}

// 显示病虫害详情
export function showPestDetails(pestId, pests) {
  console.log('showPestDetails called with:', pestId, pests.length);
  const pest = pests.find(p => p.id === pestId);
  if (!pest) {
    console.error('Pest not found:', pestId);
    showToast('未找到病虫害记录', 'error');
    return;
  }

  // 更新状态
  updatePestStatusFromLatestRecord(pest);

  console.log('Found pest:', pest.title);

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
    <div class="modal" style="width: 650px; max-width: 90vw; max-height: 90vh; overflow-y: auto; background: white; border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.15); position: relative;">
      <div class="modal-header" style="padding: 20px 24px; border-bottom: 1px solid var(--color-border);">
        <div>
          <h3 style="margin: 0; font-size: 28px; color: var(--color-text-800);">${pest.title}</h3>
          <p style="margin: 4px 0 0 0; font-size: 18px; color: var(--color-text-500);">详细信息</p>
        </div>
        <button class="modal-close" id="close-pest-details-btn" style="position: absolute; top: 16px; right: 16px; width: 32px; height: 32px; border-radius: 50%; border: none; background: rgba(0,0,0,0.1); color: var(--color-text-600); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: bold; z-index: 10;">&times;</button>
      </div>
      <div class="modal-body" style="padding: 24px;">
        <!-- 状态概览 -->
        ${(() => {
      // 判断是否为从识别系统收录的记录
      const isCollectedRecord = pest.notes && pest.notes.includes('通过AI识别系统自动收录');

      // 对于收录的记录，如果字段有值则显示，无值则显示 "-"
      const severityDisplay = isCollectedRecord
        ? (pest.severity != null && pest.severity !== '' ? (pest.severity + '%') : '-')
        : (pest.severity + '%');
      const areaDisplay = isCollectedRecord
        ? (pest.area != null && pest.area !== '' && pest.area !== '0.0亩' ? pest.area : '-')
        : pest.area;
      const costDisplay = isCollectedRecord
        ? (pest.cost != null && pest.cost !== '' && pest.cost !== 0 ? ('¥' + pest.cost) : '-')
        : ('¥' + (pest.cost || 0));

      return `
            <div style="background: linear-gradient(135deg, var(--color-bg-50), var(--color-primary-50)); border-radius: 12px; padding: 20px; margin-bottom: 24px; border: 1px solid var(--color-primary-100);">
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
                <div style="text-align: center;">
                  <div style="font-size: 32px; font-weight: 600; color: var(--color-primary-700);">${severityDisplay}</div>
                  <div style="font-size: 16px; color: var(--color-text-500); text-transform: uppercase; letter-spacing: 0.5px;">严重程度</div>
                </div>
                <div style="text-align: center;">
                  <div style="font-size: 32px; font-weight: 600; color: var(--color-warning-600);">${areaDisplay}</div>
                  <div style="font-size: 16px; color: var(--color-text-500); text-transform: uppercase; letter-spacing: 0.5px;">感染面积</div>
                </div>
                <div style="text-align: center;">
                  <div style="font-size: 32px; font-weight: 600; color: var(--color-success-600);">${costDisplay}</div>
                  <div style="font-size: 16px; color: var(--color-text-500); text-transform: uppercase; letter-spacing: 0.5px;">防治成本</div>
                </div>
                <div style="text-align: center;">
                  <div style="font-size: 32px; font-weight: 600; color: var(--color-info-600);">${pest.date}</div>
                  <div style="font-size: 16px; color: var(--color-text-500); text-transform: uppercase; letter-spacing: 0.5px;">发现日期</div>
                </div>
              </div>
            </div>
          `;
    })()}

        <!-- 基本信息 -->
        <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 20px;">
              <div style="width: 4px; height: 20px; background: var(--color-primary-500); border-radius: 2px;"></div>
              <h4 style="margin: 0; color: var(--color-primary-700); font-size: 22px; font-weight: 600;">基本信息</h4>
            </div>
            <div style="background: var(--color-bg-50); border-radius: 12px; padding: 20px; border: 1px solid var(--color-border);">
              <div style="display: grid; gap: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--color-border-100);">
                  <span style="font-weight: 500; color: var(--color-text-600); font-size: 18px;">发生田块</span>
                  <span style="color: var(--color-text-700); font-size: 18px;">${pest.fieldId} ${pest.field}</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--color-border-100);">
                  <span style="font-weight: 500; color: var(--color-text-600); font-size: 18px;">病虫害类型</span>
                  <span class="tag" style="background: var(--color-info-100); color: var(--color-info-700); font-size: 16px; padding: 6px 12px;">${pest.category}</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--color-border-100);">
                  <span style="font-weight: 500; color: var(--color-text-600); font-size: 18px;">严重程度</span>
                  <span class="tag ${getSeverityTagClass(pest.level)}" style="font-size: 16px; padding: 6px 12px;">${pest.level} (${pest.severity}%)</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--color-border-100);">
                  <span style="font-weight: 500; color: var(--color-text-600); font-size: 18px;">处理状态</span>
                  <span class="tag ${getStatusTagClass(pest.status)}" style="font-size: 16px; padding: 6px 12px;">${pest.status}</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--color-border-100);">
                  <span style="font-weight: 500; color: var(--color-text-600); font-size: 18px;">病原/害虫学名</span>
                  <span style="font-style: italic; color: var(--color-text-700); font-size: 18px;">${pest.pest}</span>
                </div>
                ${pest.symptoms ? `
                  <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--color-border-100);">
                    <span style="font-weight: 500; color: var(--color-text-600); font-size: 18px;">主要症状</span>
                    <span style="color: var(--color-text-700); font-size: 18px; text-align: right; max-width: 60%; line-height: 1.5;">
                      ${extractSymptomKeyInfo(pest.symptoms)}
                    </span>
                  </div>
                ` : ''}
              </div>
            </div>
          </div>

        <!-- 防治记录 -->
        <div style="margin-top: 32px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
            <div style="width: 4px; height: 20px; background: var(--color-success-500); border-radius: 2px;"></div>
            <h4 style="margin: 0; color: var(--color-success-700); font-size: 22px; font-weight: 600;">防治记录</h4>
            ${pest.treatmentRecords && pest.treatmentRecords.length > 0 ? `
              <span style="background: var(--color-success-100); color: var(--color-success-700); padding: 4px 12px; border-radius: 12px; font-size: 16px; font-weight: 500;">${pest.treatmentRecords.length} 条记录</span>
            ` : ''}
          </div>
          <div style="border: 1px solid var(--color-border); border-radius: 12px; overflow: hidden; background: var(--color-bg-50);">
            ${pest.treatmentRecords && pest.treatmentRecords.length > 0 ? `
              <!-- 表头 -->
              <div style="background: var(--color-bg-100); padding: 16px; border-bottom: 1px solid var(--color-border);">
                <div style="display: grid; grid-template-columns: 100px 1fr 120px 100px 80px; gap: 12px; font-weight: 500; color: var(--color-text-600); font-size: 18px;">
                  <div>日期</div>
                  <div>处理内容</div>
                  <div>使用药剂</div>
                  <div>处理结果</div>
                  <div>操作</div>
                </div>
              </div>
              
              <!-- 处理记录行 -->
              ${pest.treatmentRecords.map(record => `
                <div style="padding: 20px; border-bottom: 1px solid var(--color-border-100); display: grid; grid-template-columns: 100px 1fr 120px 100px 80px; gap: 12px; align-items: center; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor='var(--color-bg-100)'" onmouseout="this.style.backgroundColor='transparent'">
                  <div style="font-size: 18px; color: var(--color-text-700);">${record.date}</div>
                  <div style="font-size: 18px; color: var(--color-text-600); line-height: 1.4;">${record.method || record.content || '未填写'}</div>
                  <div style="font-size: 18px; color: var(--color-text-600);">${record.chemical || '-'}</div>
                  <div><span class="tag ${getStatusTagClass(record.result || record.status)}" style="font-size: 16px; padding: 4px 8px;">${record.result || record.status || '未知'}</span></div>
                  <div>
                    <button class="btn btn-outline btn-sm edit-treatment-btn" data-record-id="${record.id}" data-pest-id="${pest.id}" style="font-size: 16px; padding: 6px 12px; border-radius: 6px;">编辑</button>
                  </div>
                </div>
              `).join('')}
            ` : `
              <!-- 空白状态 -->
              <div style="padding: 48px; text-align: center; color: var(--color-text-500);">
                <div style="font-size: 48px; margin-bottom: 16px; opacity: 0.3;">📋</div>
                <h3 style="margin: 0 0 8px 0; font-size: 18px; color: var(--color-text-600);">暂无防治记录</h3>
                <p style="margin: 0; font-size: 16px;">点击下方按钮添加第一条防治记录</p>
              </div>
            `}
          </div>
        </div>


        <!-- 操作按钮 -->
        <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid var(--color-border); display: flex; gap: 12px; justify-content: flex-end;">
          <button class="btn btn-outline" id="edit-pest-btn" style="padding: 12px 24px; border-radius: 8px; font-weight: 500; font-size: 18px;">编辑记录</button>
          <button class="btn btn-outline" id="close-pest-details-btn-2" style="padding: 12px 24px; border-radius: 8px; font-weight: 500; font-size: 18px;">关闭</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // 关闭按钮
  const closeButtons = modal.querySelectorAll('#close-pest-details-btn, #close-pest-details-btn-2');
  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      document.body.removeChild(modal);
    });
  });

  // 编辑按钮
  modal.querySelector('#edit-pest-btn').addEventListener('click', () => {
    document.body.removeChild(modal);
    // 导入编辑模态框函数
    import('./pestModals.js').then(module => {
      module.showEditPestModal(pest, pests, () => {
        // 重新打开详情
        showPestDetails(pestId, pests);
      });
    });
  });


  // 编辑防治记录按钮
  modal.querySelectorAll('.edit-treatment-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const recordId = btn.dataset.recordId;
      const record = pest.treatmentRecords.find(r => r.id === recordId);
      if (record) {
        document.body.removeChild(modal);
        showEditTreatmentRecordModal(record, pest, pests, () => {
          // 重新打开详情页面
          showPestDetails(pestId, pests);
        });
      }
    });
  });

  // 移除点击背景关闭功能，只能通过关闭按钮关闭
}

// 显示删除确认模态框
export function showDeleteConfirmModal(pest, pests) {
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
    <div class="modal" style="max-width: 400px; background: white; border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.15);">
      <div class="modal-header">
        <h3>确认删除</h3>
        <button class="modal-close" id="close-delete-confirm-btn">&times;</button>
      </div>
      <div class="modal-body">
        <div style="text-align: center; padding: 24px 0;">
          <p style="font-size: 16px; line-height: 1.5; color: var(--color-text-600);">
            确定要删除病虫害记录 <strong>"${pest.title}"</strong> 吗？
          </p>
          <p style="font-size: 14px; color: var(--color-text-500); margin-top: 12px;">
            此操作不可撤销，请谨慎操作。
          </p>
        </div>
        <div style="display: flex; gap: 12px; justify-content: center;">
          <button class="btn btn-outline" id="cancel-delete-btn">取消</button>
          <button class="btn btn-danger" id="confirm-delete-btn">确认删除</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // 关闭按钮
  modal.querySelector('#close-delete-confirm-btn').addEventListener('click', () => {
    document.body.removeChild(modal);
  });

  // 取消按钮
  modal.querySelector('#cancel-delete-btn').addEventListener('click', () => {
    document.body.removeChild(modal);
  });

  // 确认删除按钮
  modal.querySelector('#confirm-delete-btn').addEventListener('click', () => {
    const index = pests.findIndex(p => p.id === pest.id);
    if (index > -1) {
      pests.splice(index, 1);
      showToast('病虫害记录删除成功！', 'success');
      document.body.removeChild(modal);
      // 触发重新渲染
      const event = new CustomEvent('pestDeleted', { detail: { pestId: pest.id } });
      document.dispatchEvent(event);
    }
  });

  // 移除点击背景关闭功能，只能通过关闭按钮关闭
}

// 显示处理记录模态框
export function showTreatmentRecords(pestId, pests) {
  console.log('showTreatmentRecords called with:', pestId, pests.length);
  const pest = pests.find(p => p.id === pestId);
  if (!pest) {
    console.error('Pest not found for treatment records:', pestId);
    showToast('未找到病虫害记录', 'error');
    return;
  }

  // 更新状态
  updatePestStatusFromLatestRecord(pest);

  console.log('Found pest for treatment:', pest.title);

  // 确保有处理记录数组
  if (!pest.treatmentRecords) {
    pest.treatmentRecords = [];
  }

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
    <div class="modal" style="max-width: 800px; max-height: 90vh; overflow-y: auto; background: white; border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.15); position: relative;">
      <div class="modal-header" style="padding: 20px 24px; border-bottom: 1px solid var(--color-border);">
        <div>
          <h3 style="margin: 0; font-size: 20px; color: var(--color-text-800);">${pest.title}</h3>
          <p style="margin: 4px 0 0 0; font-size: 14px; color: var(--color-text-500);">处理记录</p>
        </div>
        <button class="modal-close" id="close-treatment-records-btn" style="position: absolute; top: 16px; right: 16px; width: 32px; height: 32px; border-radius: 50%; border: none; background: rgba(0,0,0,0.1); color: var(--color-text-600); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: bold; z-index: 10;">&times;</button>
      </div>
      <div class="modal-body" style="padding: 24px;">
        <!-- 状态概览 -->
        <div style="background: linear-gradient(135deg, var(--color-bg-50), var(--color-primary-50)); border-radius: 12px; padding: 20px; margin-bottom: 24px; border: 1px solid var(--color-primary-100);">
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;">
            <div style="text-align: center;">
              <div style="font-size: 18px; font-weight: 600; color: var(--color-primary-700);">${pest.status}</div>
              <div style="font-size: 12px; color: var(--color-text-500); text-transform: uppercase; letter-spacing: 0.5px;">当前状态</div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 18px; font-weight: 600; color: var(--color-warning-600);">${pest.severity}%</div>
              <div style="font-size: 12px; color: var(--color-text-500); text-transform: uppercase; letter-spacing: 0.5px;">严重程度</div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 18px; font-weight: 600; color: var(--color-success-600);">${pest.technician || '未指定'}</div>
              <div style="font-size: 12px; color: var(--color-text-500); text-transform: uppercase; letter-spacing: 0.5px;">负责技术员</div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 18px; font-weight: 600; color: var(--color-info-600);">${getNextCheckDate(pest)}</div>
              <div style="font-size: 12px; color: var(--color-text-500); text-transform: uppercase; letter-spacing: 0.5px;">下次检查</div>
            </div>
          </div>
        </div>

        <!-- 处理历史 -->
        <div style="margin-bottom: 24px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
            <div style="width: 4px; height: 20px; background: var(--color-info-500); border-radius: 2px;"></div>
            <h4 style="margin: 0; color: var(--color-info-700); font-size: 16px; font-weight: 600;">处理历史</h4>
            <span style="background: var(--color-info-100); color: var(--color-info-700); padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: 500;">${pest.treatmentRecords.length} 条记录</span>
          </div>
          
          <div style="border: 1px solid var(--color-border); border-radius: 12px; overflow: hidden; background: var(--color-bg-50);">
            ${pest.treatmentRecords.length > 0 ? `
              <div style="background: var(--color-bg-100); padding: 16px; border-bottom: 1px solid var(--color-border);">
                <div style="display: grid; grid-template-columns: 100px 1fr 100px 100px 80px; gap: 12px; font-weight: 500; color: var(--color-text-600); font-size: 14px;">
                  <div>日期</div>
                  <div>处理内容</div>
                  <div>状态</div>
                  <div>操作人</div>
                  <div>操作</div>
                </div>
              </div>
              ${pest.treatmentRecords.map(record => `
                <div style="padding: 16px; border-bottom: 1px solid var(--color-border-100); display: grid; grid-template-columns: 100px 1fr 100px 100px 80px; gap: 12px; align-items: center; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor='var(--color-bg-100)'" onmouseout="this.style.backgroundColor='transparent'">
                  <div style="font-size: 13px; color: var(--color-text-700);">${record.date}</div>
                  <div style="font-size: 13px; color: var(--color-text-600); line-height: 1.4;">${record.method || record.content || '未填写'}</div>
                  <div><span class="tag ${getStatusTagClass(record.result || record.status)}" style="font-size: 11px; padding: 2px 6px;">${record.result || record.status || '未知'}</span></div>
                  <div style="font-size: 13px; color: var(--color-text-600);">${record.technician || record.operator || '未指定'}</div>
                  <div>
                    <button class="btn btn-outline btn-sm edit-treatment-btn" data-record-id="${record.id}" data-pest-id="${pest.id}" style="font-size: 11px; padding: 2px 6px; border-radius: 4px;">编辑</button>
                  </div>
                </div>
              `).join('')}
            ` : `
              <div style="padding: 48px; text-align: center; color: var(--color-text-500);">
                <h3 style="margin: 0 0 8px 0; font-size: 16px;">暂无处理记录</h3>
                <p style="margin: 0; font-size: 14px;">点击下方按钮添加第一条处理记录</p>
              </div>
            `}
          </div>
        </div>


        <!-- 操作按钮 -->
        <div style="display: flex; gap: 12px; justify-content: flex-end;">
          <button class="btn btn-primary" id="add-treatment-btn" style="padding: 10px 20px; border-radius: 8px; font-weight: 500;">+ 添加处理记录</button>
          <button class="btn btn-outline" id="close-treatment-records-btn-2" style="padding: 10px 20px; border-radius: 8px; font-weight: 500;">关闭</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // 关闭按钮
  const closeButtons = modal.querySelectorAll('#close-treatment-records-btn, #close-treatment-records-btn-2');
  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      document.body.removeChild(modal);
    });
  });

  // 添加处理记录按钮
  modal.querySelector('#add-treatment-btn').addEventListener('click', () => {
    document.body.removeChild(modal);
    showAddTreatmentRecordModal(pest, pests, () => {
      // 重新打开处理记录模态框
      showTreatmentRecords(pestId, pests);
    });
  });

  // 编辑处理记录按钮
  modal.querySelectorAll('.edit-treatment-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const recordId = btn.dataset.recordId;
      const pestId = btn.dataset.pestId;
      const record = pest.treatmentRecords.find(r => r.id === recordId);
      if (record) {
        document.body.removeChild(modal);
        showEditTreatmentRecordModal(record, pest, pests, () => {
          // 重新打开处理记录模态框
          showTreatmentRecords(pestId, pests);
        });
      }
    });
  });

  // 移除点击背景关闭功能，只能通过关闭按钮关闭
}


// 获取下次检查日期的辅助函数
function getNextCheckDate(pest) {
  if (!pest.nextCheck) {
    return '-';
  }

  const nextCheckDate = new Date(pest.nextCheck);
  const today = new Date();

  // 如果下次检查日期已过，返回横杠
  if (nextCheckDate < today) {
    return '-';
  }

  return pest.nextCheck;
}
