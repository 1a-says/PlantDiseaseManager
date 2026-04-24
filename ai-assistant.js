// AI 助手功能实现
class AIAssistant {
  constructor(config) {
    this.appId = config.appId || '1971426275889324033';
    this.apiUrl = 'https://api.qiaoqiaoyun.com/v1/chat/completions';
    this.avatarImage = config.avatarImage || 'images/AIhudongxiaoren.png';
    this.isOpen = false;
    this.isRecording = false;
    this.recognition = null;
    this.conversationHistory = [];

    this.init();
  }

  init() {
    this.createHTML();
    this.bindEvents();
    this.initSpeechRecognition();
    this.loadConversationHistory();
  }

  createHTML() {
    const container = document.createElement('div');
    container.className = 'ai-assistant-container';
    container.innerHTML = `
      <!-- 卡通人物按钮 -->
      <div class="ai-assistant-btn" id="ai-assistant-btn">
        <img src="${this.avatarImage}" alt="AI助手" class="ai-assistant-avatar">
        <div class="ai-assistant-badge" id="ai-assistant-badge">1</div>
      </div>

      <!-- 对话框 -->
      <div class="ai-assistant-chat" id="ai-assistant-chat">
        <!-- 头部 -->
        <div class="ai-assistant-header">
          <div class="ai-assistant-header-info">
            <img src="${this.avatarImage}" alt="AI助手" class="ai-assistant-header-avatar">
            <div class="ai-assistant-header-text">
              <h3>智慧农业助手</h3>
              <p id="ai-status">在线服务中</p>
            </div>
          </div>
          <button class="ai-assistant-close" id="ai-assistant-close">×</button>
        </div>

        <!-- 消息区域 -->
        <div class="ai-assistant-messages" id="ai-assistant-messages">
          <div class="ai-message assistant">
            <img src="${this.avatarImage}" alt="AI" class="ai-message-avatar">
            <div class="ai-message-content">
              👋 您好！我是智慧农业助手，可以帮您解答关于农作物、病虫害防治、农业生产等方面的问题。请问有什么可以帮助您的吗？
            </div>
          </div>
        </div>

        <!-- 输入区域 -->
        <div class="ai-assistant-input">
          <textarea 
            class="ai-assistant-input-textarea" 
            id="ai-input-textarea"
            placeholder="输入您的问题..."
            rows="1"
          ></textarea>
          <div class="ai-assistant-btn-group">
            <button class="ai-assistant-btn-icon ai-assistant-btn-voice" id="ai-btn-voice" title="语音输入">
              🎤
            </button>
            <button class="ai-assistant-btn-icon ai-assistant-btn-send" id="ai-btn-send" title="发送">
              ➤
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(container);
    this.container = container;
    this.btn = container.querySelector('#ai-assistant-btn');
    this.chat = container.querySelector('#ai-assistant-chat');
    this.messagesContainer = container.querySelector('#ai-assistant-messages');
    this.inputTextarea = container.querySelector('#ai-input-textarea');
    this.sendBtn = container.querySelector('#ai-btn-send');
    this.voiceBtn = container.querySelector('#ai-btn-voice');
    this.closeBtn = container.querySelector('#ai-assistant-close');
  }

  bindEvents() {
    // 打开/关闭对话框
    this.btn.addEventListener('click', () => {
      this.toggleChat();
    });

    this.closeBtn.addEventListener('click', () => {
      this.closeChat();
    });

    // 点击背景关闭
    this.chat.addEventListener('click', (e) => {
      if (e.target === this.chat) {
        this.closeChat();
      }
    });

    // 发送消息
    this.sendBtn.addEventListener('click', () => {
      this.sendMessage();
    });

    // Enter 键发送（Shift+Enter 换行）
    this.inputTextarea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    // 自动调整输入框高度
    this.inputTextarea.addEventListener('input', () => {
      this.adjustTextareaHeight();
    });

    // 语音输入
    this.voiceBtn.addEventListener('click', () => {
      this.toggleVoiceRecording();
    });
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.openChat();
    } else {
      this.closeChat();
    }
  }

  openChat() {
    this.chat.classList.add('show');
    this.btn.classList.add('active');
    this.hideBadge();
    this.inputTextarea.focus();
  }

  closeChat() {
    this.chat.classList.remove('show');
    this.btn.classList.remove('active');
  }

  adjustTextareaHeight() {
    const textarea = this.inputTextarea;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 100) + 'px';
  }

  async sendMessage() {
    const message = this.inputTextarea.value.trim();
    if (!message) return;

    // 添加用户消息
    this.addMessage(message, 'user');
    this.inputTextarea.value = '';
    this.adjustTextareaHeight();
    this.setSendButtonDisabled(true);

    // 显示加载动画
    const loadingId = this.showLoading();

    try {
      // 调用 API
      const response = await this.callAPI(message);

      // 移除加载动画
      this.hideLoading(loadingId);

      // 验证回复内容
      if (!response || !response.trim()) {
        throw new Error('API返回空回复');
      }

      // 检查是否是异常回复（比如总是回复相同内容）
      const trimmedResponse = response.trim();
      if (trimmedResponse === '是什么原因引起的' ||
        trimmedResponse === '是什么原因' ||
        trimmedResponse === '原因' ||
        trimmedResponse.length < 10) {
        console.warn('⚠️ 检测到异常回复:', trimmedResponse);
        console.warn('⚠️ 使用备用智能回复');
        const fallbackResponse = this.getFallbackResponse(message);
        this.addMessage(fallbackResponse, 'assistant');

        // 同时在控制台输出原始回复以便调试
        console.log('📋 原始API回复:', response);
      } else {
        // 添加 AI 回复
        console.log('✅ 使用API回复:', trimmedResponse.substring(0, 50) + '...');
        this.addMessage(trimmedResponse, 'assistant');
      }

      // 保存对话历史
      this.saveConversationHistory();
    } catch (error) {
      console.error('❌ AI 回复错误:', error);
      this.hideLoading(loadingId);

      // 使用智能备用回复
      const fallbackResponse = this.getFallbackResponse(message);
      this.addMessage(fallbackResponse, 'assistant');

      // 显示错误提示（但不阻止用户看到回复）
      this.showError(`API调用失败，已使用备用回复。错误: ${error.message}`);
    } finally {
      this.setSendButtonDisabled(false);
    }
  }

  addMessage(content, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-message ${type}`;

    if (type === 'user') {
      messageDiv.innerHTML = `
        <div class="ai-message-content">${this.formatMessage(content)}</div>
      `;
    } else {
      messageDiv.innerHTML = `
        <img src="${this.avatarImage}" alt="AI" class="ai-message-avatar">
        <div class="ai-message-content">${this.formatMessage(content)}</div>
      `;
    }

    this.messagesContainer.appendChild(messageDiv);
    this.scrollToBottom();

    // 保存到历史记录
    this.conversationHistory.push({
      role: type === 'user' ? 'user' : 'assistant',
      content: content
    });
  }

  formatMessage(content) {
    // 简单的 markdown 格式化
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  }

  showLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'ai-message assistant';
    loadingDiv.id = 'ai-loading-' + Date.now();
    loadingDiv.innerHTML = `
      <img src="${this.avatarImage}" alt="AI" class="ai-message-avatar">
      <div class="ai-message-content">
        <div class="ai-message-loading">
          <div class="ai-message-loading-dot"></div>
          <div class="ai-message-loading-dot"></div>
          <div class="ai-message-loading-dot"></div>
        </div>
      </div>
    `;
    this.messagesContainer.appendChild(loadingDiv);
    this.scrollToBottom();
    return loadingDiv.id;
  }

  hideLoading(loadingId) {
    const loadingElement = document.getElementById(loadingId);
    if (loadingElement) {
      loadingElement.remove();
    }
  }

  async callAPI(message) {
    console.log('📤 发送消息到敲敲云:', message);

    // 优先尝试使用敲敲云SDK的API方法
    try {
      const response = await this.callQiaoQiaoYunAPI(message);
      if (response && response.trim()) {
        console.log('✅ 敲敲云API调用成功');
        return response;
      }
    } catch (sdkError) {
      console.warn('⚠️ SDK方式调用失败，尝试直接API:', sdkError);
    }

    // 如果SDK方式失败，尝试直接API调用
    try {
      return await this.callQiaoQiaoYunDirectAPI(message);
    } catch (apiError) {
      console.warn('⚠️ 直接API调用失败，使用备用回复:', apiError);
      return this.getFallbackResponse(message);
    }
  }

  async callQiaoQiaoYunAPI(message) {
    // 方法1：通过敲敲云SDK的API接口调用
    // 首先尝试使用SDK提供的各种可能的方法
    const sdkMethods = [
      // 方法1: 实例方法
      () => window.qiaoqiaoYunChat?.sendMessage?.(message),
      () => window.qiaoqiaoYunChat?.ask?.(message),
      () => window.qiaoqiaoYunChat?.chat?.(message),
      // 方法2: 全局方法
      () => window.sendMessage?.(message),
      () => window.askQuestion?.(message),
      () => window.chat?.(message),
      // 方法3: 通过事件监听（如果SDK支持）
      () => {
        return new Promise((resolve, reject) => {
          if (window.qiaoqiaoYunChat && typeof window.qiaoqiaoYunChat.on === 'function') {
            window.qiaoqiaoYunChat.on('response', (reply) => {
              resolve(reply);
            });
            window.qiaoqiaoYunChat.send(message);
            setTimeout(() => reject(new Error('SDK响应超时')), 10000);
          } else {
            reject(new Error('SDK方法不可用'));
          }
        });
      }
    ];

    for (const method of sdkMethods) {
      try {
        console.log('🔄 尝试SDK方法:', method.toString().substring(0, 50));
        const reply = await method();
        if (reply && reply.trim() && reply.trim() !== '是什么原因引起的') {
          console.log('✅ SDK方法调用成功');
          return typeof reply === 'string' ? reply.trim() : String(reply).trim();
        }
      } catch (error) {
        // 忽略错误，继续尝试下一个方法
        console.log('⚠️ SDK方法尝试失败:', error.message);
      }
    }

    // 如果SDK方法不可用，尝试直接API调用
    // 构建完整的对话历史
    const messages = [
      {
        role: 'system',
        content: '你是一位专业的智慧农业助手。你的职责是：\n1. 详细回答用户关于农作物种植、病虫害防治、农业生产技术等方面的问题\n2. 回答要完整、专业、实用，不要只回复"是什么原因引起的"这样的简短句子\n3. 如果用户问"是什么原因"，要详细解释原因并提供解决方案\n4. 回答要结构清晰，便于理解\n5. 始终保持友好和专业的语调'
      },
      ...this.conversationHistory.slice(-8), // 保留最近8条作为上下文
      {
        role: 'user',
        content: message
      }
    ];

    // 尝试多个可能的API端点
    const apiEndpoints = [
      {
        url: `https://api.qiaoqiaoyun.com/v1/chat/completions`,
        body: {
          appId: this.appId,
          model: 'qwen-plus',
          messages: messages,
          stream: false,
          temperature: 0.7,
          max_tokens: 2000
        }
      },
      {
        url: `https://api.qiaoqiaoyun.com/chat/completions`,
        body: {
          appId: this.appId,
          messages: messages,
          stream: false
        }
      },
      {
        url: `https://api.qiaoqiaoyun.com/api/chat`,
        body: {
          appId: this.appId,
          question: message,
          history: this.conversationHistory.slice(-8)
        }
      }
    ];

    for (const config of apiEndpoints) {
      try {
        console.log(`🔄 尝试API端点: ${config.url}`);

        const response = await fetch(config.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.appId}`,
            'X-App-Id': this.appId,
            'Accept': 'application/json'
          },
          body: JSON.stringify(config.body)
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.warn(`❌ API端点 ${config.url} 返回错误:`, response.status, errorText);
          continue; // 尝试下一个端点
        }

        const data = await response.json();
        console.log('📥 API响应数据:', data);

        // 尝试多种可能的数据结构
        let reply = null;
        if (data.choices && data.choices[0] && data.choices[0].message) {
          reply = data.choices[0].message.content;
        } else if (data.data && data.data.content) {
          reply = data.data.content;
        } else if (data.content) {
          reply = data.content;
        } else if (data.message) {
          reply = data.message;
        } else if (data.text) {
          reply = data.text;
        } else if (data.answer) {
          reply = data.answer;
        } else if (data.result) {
          reply = data.result;
        } else if (typeof data === 'string') {
          reply = data;
        }

        if (reply && reply.trim() && reply.trim() !== '是什么原因引起的') {
          return reply.trim();
        } else {
          console.warn('⚠️ API返回数据格式异常或异常回复:', data);
          continue;
        }
      } catch (error) {
        console.warn(`⚠️ 端点 ${config.url} 调用失败:`, error.message);
        continue; // 尝试下一个端点
      }
    }

    throw new Error('所有API端点都失败了');
  }

  async callQiaoQiaoYunDirectAPI(message) {
    // 方法2：直接调用敲敲云的API（多种格式尝试）
    // 尝试使用敲敲云可能的API格式
    const requestConfigs = [
      // 格式1：标准 OpenAI 格式
      {
        url: `https://api.qiaoqiaoyun.com/v1/chat/completions`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.appId}`,
          'X-App-Id': this.appId
        },
        body: {
          appId: this.appId,
          model: 'qwen-plus',
          messages: [
            {
              role: 'system',
              content: '你是一位专业的智慧农业助手。你的职责是：\n1. 详细回答用户关于农作物种植、病虫害防治、农业生产技术等方面的问题\n2. 回答要完整、专业、实用，不要只回复"是什么原因引起的"这样的简短句子\n3. 如果用户问"是什么原因"，要详细解释原因并提供解决方案\n4. 回答要结构清晰，便于理解\n5. 始终保持友好和专业的语调'
            },
            ...this.conversationHistory.slice(-8),
            {
              role: 'user',
              content: message
            }
          ],
          stream: false,
          temperature: 0.7,
          max_tokens: 2000
        }
      },
      // 格式2：简化格式
      {
        url: `https://api.qiaoqiaoyun.com/api/chat`,
        headers: {
          'Content-Type': 'application/json',
          'X-App-Id': this.appId
        },
        body: {
          appId: this.appId,
          question: message,
          history: this.conversationHistory.slice(-8),
          systemPrompt: '你是一位专业的智慧农业助手。你的职责是详细回答用户关于农作物种植、病虫害防治、农业生产技术等方面的问题。回答要完整、专业、实用，不要只回复"是什么原因引起的"，要给出完整的解答。'
        }
      },
      // 格式3：最简格式
      {
        url: `https://api.qiaoqiaoyun.com/chat`,
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          appId: this.appId,
          message: message,
          conversation: this.conversationHistory.slice(-8)
        }
      }
    ];

    for (const config of requestConfigs) {
      try {
        console.log(`🔄 尝试直接API格式: ${config.url}`);

        const response = await fetch(config.url, {
          method: 'POST',
          headers: config.headers,
          body: JSON.stringify(config.body)
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.warn(`❌ API格式失败 ${config.url}:`, response.status, errorText);
          continue;
        }

        const data = await response.json();
        console.log('📥 直接API响应:', data);

        // 多种数据格式兼容
        let reply = data.choices?.[0]?.message?.content ||
          data.data?.content ||
          data.content ||
          data.message ||
          data.text ||
          data.answer ||
          data.result ||
          (typeof data === 'string' ? data : null);

        if (reply && reply.trim() && reply.trim() !== '是什么原因引起的') {
          return reply.trim();
        } else {
          console.warn('⚠️ API返回数据异常:', data);
          continue;
        }
      } catch (error) {
        console.warn(`⚠️ API格式 ${config.url} 调用失败:`, error.message);
        continue;
      }
    }

    throw new Error('所有API格式都失败了');
  }

  getFallbackResponse(message) {
    // 智能关键词匹配回复
    const lowerMessage = message.toLowerCase();

    // 病虫害相关
    if (lowerMessage.match(/病虫害|虫害|病害|害虫|疾病|病斑|黄叶|枯萎/)) {
      return '关于病虫害防治，我建议您：\n\n✅ **预防措施**：\n• 定期巡查田块，早发现早处理\n• 选择抗病虫害的优良品种\n• 合理轮作，避免连作\n• 保持田间清洁，清除病残体\n\n✅ **防治方法**：\n• 优先使用生物防治（天敌、生物农药）\n• 必要时结合化学防治，注意安全间隔期\n• 采用物理防治（诱虫灯、防虫网等）\n\n🔍 您可以在"病虫害识别"模块上传图片，我会帮您识别具体的病虫害类型并提供针对性的防治建议。';
    }
    // 施肥相关
    else if (lowerMessage.match(/施肥|肥料|养分|氮|磷|钾|有机肥|复合肥/)) {
      return '关于施肥管理，建议如下：\n\n📋 **施肥原则**：\n• 根据土壤检测结果制定施肥方案\n• 遵循"少施多次、营养均衡"的原则\n• 基肥与追肥相结合\n\n🌿 **肥料选择**：\n• 有机肥为主，化肥为辅\n• 注意氮、磷、钾的合理配比\n• 适当补充中微量元素\n\n💡 **施肥技巧**：\n• 深施覆土，提高利用率\n• 避开雨天，防止流失\n• 根据不同生育期调整施肥量\n\n需要更具体的建议吗？请告诉我您的作物类型和土壤情况。';
    }
    // 灌溉相关
    else if (lowerMessage.match(/浇水|灌溉|水分|干旱|缺水|排水/)) {
      return '关于灌溉管理：\n\n💧 **灌溉时机**：\n• 根据土壤湿度和作物需水量确定\n• 一般土壤含水量低于60%时需要灌溉\n• 避免中午高温时段，选择早晨或傍晚\n\n🚿 **灌溉方式**：\n• 优先采用滴灌、喷灌等节水技术\n• 根据作物类型选择合适方式\n• 注意水质，避免含盐量过高\n\n⚠️ **注意事项**：\n• 注意排水，防止田间积水\n• 雨季减少灌溉频次\n• 不同生育期需水量不同，注意调整\n\n当前您田块的土壤湿度如何？';
    }
    // 天气气候相关
    else if (lowerMessage.match(/天气|气候|温度|降雨|湿度|天气预报|温度|高温|低温/)) {
      return '关于气象监测与预测：\n\n🌡️ **监测指标**：\n• **温度**：关注日平均温度和极端温度\n• **降雨量**：注意降雨强度和持续时间\n• **湿度**：空气湿度和土壤湿度都很重要\n• **光照**：日照时长和强度影响作物生长\n\n📊 **查看方式**：\n您可以在"风险预测"模块查看详细的气象数据和未来预测。\n\n⚠️ **预警关注**：\n• 极端高温（>35°C）可能导致热害\n• 持续降雨（>50mm/日）需注意排水\n• 低温霜冻需提前防护\n\n需要我帮您分析当前的气象数据吗？';
    }
    // 种植技术相关
    else if (lowerMessage.match(/种植|播种|移栽|管理|栽培|技术/)) {
      return '关于种植技术：\n\n🌱 **播种管理**：\n• 选择适宜播种期，避开极端天气\n• 控制播种深度和密度\n• 做好种子处理（消毒、催芽等）\n\n🌿 **田间管理**：\n• 及时中耕除草，改善土壤通透性\n• 合理密植，保证通风透光\n• 适时修剪整枝，调节生长\n• 加强水肥管理\n\n📈 **生长监控**：\n• 定期观察作物生长状况\n• 记录关键生育期时间\n• 及时调整管理措施\n\n您具体种植的是什么作物？我可以提供更针对性的建议。';
    }
    // 数据管理相关
    else if (lowerMessage.match(/数据|记录|统计|分析|监控|监测/)) {
      return '关于数据管理：\n\n📊 **数据模块**：\n• **数据管理**：查看田块、设备、病虫害等数据\n• **健康统计**：查看作物健康度趋势和分布\n• **设备监控**：实时监测设备运行状态\n\n💡 **功能特点**：\n• 多维度数据可视化\n• 历史数据对比分析\n• 智能预警提示\n• 数据导出功能\n\n您可以在"数据管理"模块查看所有详细信息。\n\n有什么具体想了解的数据吗？';
    }
    // 默认回复
    else {
      return '👋 您好！我是智慧农业助手，很高兴为您服务！\n\n我可以帮您解答：\n\n🌾 **农作物种植技术**\n• 播种、移栽、田间管理\n• 水肥管理、修剪整枝\n\n🐛 **病虫害识别与防治**\n• 病虫害识别\n• 防治方案推荐\n\n🌡️ **环境监测与预测**\n• 气象数据分析\n• 风险预警提示\n\n📊 **数据管理与分析**\n• 田块数据统计\n• 设备运行监控\n• 历史趋势分析\n\n💬 请直接告诉我您想了解的问题，比如："玉米如何防治蚜虫？"或"什么时候施肥最合适？"';
    }
  }

  initSpeechRecognition() {
    // 检查是否为 HTTPS 环境（localhost 和 127.0.0.1 也算安全环境）
    const isSecureContext = window.isSecureContext ||
      location.protocol === 'https:' ||
      location.hostname === 'localhost' ||
      location.hostname === '127.0.0.1';

    if (!isSecureContext) {
      console.warn('⚠️ 语音识别需要 HTTPS 环境');
      this.speechRecognitionSupported = false;
      // 不在这里显示错误，等用户点击时再提示
      return;
    }

    // 检查浏览器是否支持语音识别
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      console.log('✅ 浏览器支持语音识别');
      try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();

        // 配置语音识别参数
        this.recognition.lang = 'zh-CN'; // 中文识别
        this.recognition.continuous = false; // 改为单次识别，避免状态管理问题
        this.recognition.interimResults = true; // 启用临时结果，实时显示识别文字
        this.recognition.maxAlternatives = 1; // 只返回最佳结果

        // 状态标记，防止重复启动
        this.recognitionStarting = false;
        this.recognitionStopping = false;

        // 语音识别开始
        this.recognition.onstart = () => {
          this.isRecording = true;
          this.voiceBtn.classList.add('recording');
          this.voiceBtn.innerHTML = '⏹';
          this.updateStatus('正在聆听...');
          this.showVoiceHint('🎤 开始录音，请说话...');
          this.recordingStartTime = Date.now();
          // 添加视觉提示
          this.inputTextarea.parentElement.classList.add('has-voice-input');
        };

        // 实时识别结果（临时结果）
        this.recognition.onresult = (event) => {
          let interimTranscript = '';
          let finalTranscript = '';

          // 处理所有识别结果
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              // 累积最终结果
              finalTranscript += transcript + ' ';
            } else {
              // 临时结果（实时识别中）
              interimTranscript += transcript;
            }
          }

          // 初始化累积的最终结果数组
          if (!this.accumulatedFinalTexts) {
            this.accumulatedFinalTexts = [];
          }

          // 如果有最终结果，添加到累积数组
          if (finalTranscript) {
            this.accumulatedFinalTexts.push(finalTranscript.trim());
            this.lastInterimText = ''; // 清空临时文本标记
          }

          // 构建要显示到输入框的文本
          const baseText = this.recordingBaseText || '';

          // 组合所有最终结果
          let finalText = this.accumulatedFinalTexts.join(' ');

          // 如果有临时结果，追加临时结果（用于实时显示）
          let displayText = baseText;
          if (finalText) {
            displayText += finalText;
          }
          if (interimTranscript) {
            displayText += (displayText ? ' ' : '') + interimTranscript;
            this.lastInterimText = interimTranscript; // 保存临时文本用于后续替换
          }

          // 更新输入框内容
          if (finalText || interimTranscript) {
            this.inputTextarea.value = displayText.trim();
            this.adjustTextareaHeight();

            // 更新提示信息
            if (finalTranscript) {
              this.showVoiceHint('✅ 识别完成，可以继续说或点击停止');
              // 重置停止定时器（单次模式下，识别会自动结束，所以延长等待时间）
              clearTimeout(this.recognitionStopTimeout);
              this.recognitionStopTimeout = setTimeout(() => {
                if (this.isRecording) {
                  // 如果1.5秒内没有新的语音输入，自动停止
                  this.stopVoiceRecording();
                  this.showVoiceHint('', true);
                }
              }, 1500); // 1.5秒无新语音则自动停止
            } else if (interimTranscript) {
              this.showVoiceHint(`🎙️ 正在识别: "${interimTranscript}"`);
            }
          }
        };

        // 识别错误处理
        this.recognition.onerror = (event) => {
          console.error('❌ 语音识别错误:', event.error, event);

          let errorMessage = '语音识别失败';
          let showHint = false;

          switch (event.error) {
            case 'no-speech':
              errorMessage = '未检测到语音，请重试（请确保麦克风正常工作并说话）';
              // 不停止录音，让用户可以继续说话
              this.showVoiceHint('未检测到语音，请说话...');
              return; // 不停止，继续等待

            case 'audio-capture':
              errorMessage = '无法访问麦克风，请检查麦克风是否已连接并允许访问';
              showHint = true;
              break;

            case 'not-allowed':
              errorMessage = '麦克风权限被拒绝\n\n请在浏览器地址栏左侧找到锁图标或信息图标，点击后允许麦克风权限';
              showHint = true;
              break;

            case 'network':
              // 网络错误处理
              console.error('❌ 网络错误详情:', {
                error: event.error,
                message: event.message,
                readyState: this.recognition?.readyState
              });

              errorMessage = '❌ 网络连接错误\n\n语音识别需要连接到 Google 服务器进行识别处理。\n\n可能的原因：\n1. 网络连接不稳定\n2. 无法访问 Google 服务（需科学上网）\n3. 防火墙/代理设置阻止\n4. Google 服务器暂时不可用\n\n解决方案：\n1. 检查网络连接\n2. 如在中国大陆，可能需要使用 VPN\n3. 刷新页面重试\n4. 使用文字输入替代';

              // 停止录音并显示详细提示
              this.stopVoiceRecording();
              this.showError(errorMessage);
              this.showVoiceHint('', true);

              // 显示网络问题详细说明
              this.showNetworkErrorHint();
              return; // 不继续处理其他错误逻辑

            case 'aborted':
              console.log('语音识别已取消（可能是手动停止）');
              // 如果是手动停止，不显示错误
              if (!this.isRecording) {
                return;
              }
              errorMessage = '语音识别已取消';
              break;

            case 'service-not-allowed':
              errorMessage = '语音识别服务不可用\n\n可能需要使用 HTTPS 访问，或者浏览器不支持';
              break;

            default:
              errorMessage = `语音识别错误: ${event.error}\n\n请尝试刷新页面或使用 Chrome/Edge 浏览器`;
          }

          this.stopVoiceRecording();
          this.showError(errorMessage);
          this.showVoiceHint('', true);

          if (showHint) {
            this.showPermissionHint();
          }
        };

        // 识别结束
        this.recognition.onend = () => {
          console.log('🔚 语音识别结束事件触发');
          this.recognitionStarting = false;
          this.recognitionStopping = false;

          // 如果是手动停止，不需要做任何事
          if (!this.isRecording) {
            return;
          }

          // 如果是自动结束（用户停止说话），等待一下再重新启动（连续模式）
          if (this.isRecording && this.accumulatedFinalTexts && this.accumulatedFinalTexts.length > 0) {
            // 有识别结果，延迟后重新启动以继续识别
            setTimeout(() => {
              if (this.isRecording && !this.recognitionStarting && !this.recognitionStopping) {
                console.log('🔄 自动重启语音识别以继续识别');
                this.restartRecognition();
              }
            }, 300);
          } else {
            // 没有识别结果，停止录音
            this.stopVoiceRecording();
          }
        };

        // 无语音输入超时
        this.recognition.onspeechend = () => {
          // 如果识别时间超过3秒但没有结果，可能是没有说话
          const recordingTime = (Date.now() - this.recordingStartTime) / 1000;
          if (recordingTime > 3 && !this.inputTextarea.value.trim()) {
            this.showVoiceHint('未检测到语音，请重试', true);
          }
        };

        // 语音开始检测
        this.recognition.onspeechstart = () => {
          this.showVoiceHint('检测到语音，正在识别...');
        };

        this.speechRecognitionSupported = true;
        console.log('✅ 语音识别初始化成功');
      } catch (error) {
        console.error('❌ 初始化语音识别失败:', error);
        this.speechRecognitionSupported = false;
      }
    } else {
      console.warn('⚠️ 浏览器不支持语音识别（需要 Chrome 或 Edge）');
      this.speechRecognitionSupported = false;
    }

    // 在控制台输出诊断信息
    console.log('📊 语音识别诊断信息:', {
      supported: this.speechRecognitionSupported,
      isHTTPS: isSecureContext,
      protocol: location.protocol,
      hostname: location.hostname,
      browser: this.detectBrowser()
    });
  }

  toggleVoiceRecording() {
    if (this.isRecording) {
      this.stopVoiceRecording();
    } else {
      this.startVoiceRecording();
    }
  }

  startVoiceRecording() {
    // 检查浏览器支持
    if (!this.speechRecognitionSupported) {
      const isHTTPS = location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
      let errorMsg = '您的浏览器不支持语音识别功能';

      if (!isHTTPS) {
        errorMsg += '\n\n⚠️ 重要：语音识别需要在 HTTPS 环境下使用！\n请使用 HTTPS 访问网站或使用 localhost';
      } else {
        errorMsg += '\n\n建议使用 Chrome 或 Edge 浏览器';
      }

      this.showError(errorMsg);
      return;
    }

    if (!this.recognition) {
      this.showError('语音识别未初始化，请刷新页面重试');
      console.error('❌ recognition 对象不存在');
      return;
    }

    // 保存录音前输入框的文本（如果用户想追加内容）
    const currentText = this.inputTextarea.value.trim();

    // 如果输入框为空，从空开始；如果已有内容，保留并追加新识别的文字
    this.recordingBaseText = currentText ? currentText + ' ' : '';

    // 清空累积的最终结果和临时文本
    this.accumulatedFinalTexts = [];
    this.lastInterimText = '';

    // 清除之前的停止定时器
    if (this.recognitionStopTimeout) {
      clearTimeout(this.recognitionStopTimeout);
      this.recognitionStopTimeout = null;
    }

    try {
      // 如果正在录音，先停止
      if (this.isRecording) {
        this.recognition.stop();
        // 等待停止完成
        setTimeout(() => {
          this.startRecordingInternal();
        }, 300);
      } else {
        this.startRecordingInternal();
      }
    } catch (error) {
      console.error('启动语音识别异常:', error);
      this.showError('无法启动语音识别');
    }
  }

  async startRecordingInternal() {
    // 防止重复启动
    if (this.recognitionStarting) {
      console.warn('⚠️ 语音识别正在启动中，忽略重复调用');
      return;
    }

    if (this.recognition && this.recognition.readyState === 1) {
      console.warn('⚠️ 语音识别已经在运行中');
      return;
    }

    this.recognitionStarting = true;

    // 首先检查麦克风权限
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // 获取到权限后立即停止流（只是检查权限）
      stream.getTracks().forEach(track => track.stop());
      console.log('✅ 麦克风权限已授予');
    } catch (permissionError) {
      console.error('❌ 麦克风权限错误:', permissionError);
      this.showError('无法访问麦克风，请允许网站访问麦克风权限');
      this.showPermissionHint();
      this.isRecording = false;
      this.recognitionStarting = false;
      this.voiceBtn.classList.remove('recording');
      this.voiceBtn.innerHTML = '🎤';
      return;
    }

    // 权限检查通过，开始语音识别
    try {
      console.log('🎤 正在启动语音识别...');

      // 确保识别对象处于可启动状态
      if (this.recognition.readyState === 1) {
        // 已经在运行，先停止
        this.recognition.stop();
        await this.waitForRecognitionStop();
      }

      this.recognition.start();
      console.log('✅ 语音识别已启动');

      // 延迟重置标记，确保 onstart 事件已触发
      setTimeout(() => {
        this.recognitionStarting = false;
      }, 500);

    } catch (error) {
      console.error('❌ 启动语音识别失败:', error);
      this.recognitionStarting = false;

      // 如果启动失败，可能是上次识别还没完全结束
      if (error.name === 'InvalidStateError') {
        console.warn('⚠️ 语音识别状态无效，等待后重试...');
        // 等待一下再重试
        setTimeout(async () => {
          try {
            // 先确保停止
            if (this.recognition.readyState === 1) {
              this.recognition.stop();
              await this.waitForRecognitionStop();
            }

            this.recognition.start();
            console.log('✅ 重试启动语音识别成功');

            setTimeout(() => {
              this.recognitionStarting = false;
            }, 500);
          } catch (retryError) {
            console.error('❌ 重试启动语音识别失败:', retryError);
            this.showError(`无法启动语音识别: ${retryError.message || '未知错误'}`);
            this.isRecording = false;
            this.recognitionStarting = false;
            this.voiceBtn.classList.remove('recording');
            this.voiceBtn.innerHTML = '🎤';
          }
        }, 800);
      } else {
        this.showError(`无法启动语音识别: ${error.message || '未知错误'}\n\n请检查：\n1. 是否在 HTTPS 环境下访问\n2. 浏览器是否支持语音识别（Chrome/Edge）\n3. 麦克风是否正常工作`);
        this.isRecording = false;
        this.voiceBtn.classList.remove('recording');
        this.voiceBtn.innerHTML = '🎤';
      }
    }
  }

  // 等待语音识别停止
  waitForRecognitionStop() {
    return new Promise((resolve) => {
      if (!this.recognition || this.recognition.readyState === 0) {
        resolve();
        return;
      }

      const checkInterval = setInterval(() => {
        if (this.recognition.readyState === 0) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);

      // 最多等待2秒
      setTimeout(() => {
        clearInterval(checkInterval);
        resolve();
      }, 2000);
    });
  }

  // 重启语音识别（用于连续模式）
  restartRecognition() {
    if (this.recognitionStarting || this.recognitionStopping) {
      return;
    }

    this.recognitionStarting = true;

    try {
      console.log('🔄 重启语音识别...');
      this.recognition.start();
      setTimeout(() => {
        this.recognitionStarting = false;
      }, 500);
    } catch (error) {
      console.error('❌ 重启语音识别失败:', error);
      this.recognitionStarting = false;

      if (error.name === 'InvalidStateError') {
        // 如果还在运行，就不重启了
        console.log('语音识别仍在运行，无需重启');
        this.recognitionStarting = false;
      } else {
        // 其他错误，停止录音
        this.stopVoiceRecording();
      }
    }
  }

  stopVoiceRecording() {
    // 防止重复停止
    if (this.recognitionStopping) {
      return;
    }

    this.recognitionStopping = true;

    // 清除定时器
    if (this.recognitionStopTimeout) {
      clearTimeout(this.recognitionStopTimeout);
      this.recognitionStopTimeout = null;
    }

    if (this.recognition) {
      try {
        if (this.isRecording && this.recognition.readyState === 1) {
          console.log('🛑 停止语音识别...');
          this.recognition.stop();
        }
      } catch (error) {
        console.warn('停止语音识别时出错:', error);
      }
    }

    this.isRecording = false;
    this.voiceBtn.classList.remove('recording');
    this.voiceBtn.innerHTML = '🎤';
    this.updateStatus('在线服务中');

    // 延迟重置停止标记
    setTimeout(() => {
      this.recognitionStopping = false;
      this.recognitionStarting = false;
    }, 500);

    // 移除视觉提示
    this.inputTextarea.parentElement.classList.remove('has-voice-input');

    // 清除定时器
    if (this.recognitionStopTimeout) {
      clearTimeout(this.recognitionStopTimeout);
      this.recognitionStopTimeout = null;
    }

    // 确保最终文本正确显示（包含所有累积的最终结果）
    const baseText = this.recordingBaseText || '';
    const finalText = (this.accumulatedFinalTexts || []).join(' ').trim();
    const displayText = (baseText + finalText).trim();

    if (displayText) {
      this.inputTextarea.value = displayText;
      this.adjustTextareaHeight();
    } else if (this.lastInterimText) {
      // 如果只有临时文本，也保留它
      this.inputTextarea.value = (baseText + this.lastInterimText).trim();
      this.adjustTextareaHeight();
    }

    // 清理状态
    this.recordingBaseText = '';
    this.accumulatedFinalTexts = [];
    this.lastInterimText = '';

    // 如果有识别结果，聚焦到输入框方便编辑或发送
    if (this.inputTextarea.value.trim()) {
      this.inputTextarea.focus();
      // 将光标移到末尾
      const length = this.inputTextarea.value.length;
      this.inputTextarea.setSelectionRange(length, length);
    }
  }

  showVoiceHint(message, hide = false) {
    // 创建或获取提示元素
    let hintEl = document.getElementById('ai-voice-hint');

    if (hide || !message) {
      if (hintEl) {
        hintEl.remove();
      }
      return;
    }

    if (!hintEl) {
      hintEl = document.createElement('div');
      hintEl.id = 'ai-voice-hint';
      hintEl.className = 'ai-voice-hint';
      this.inputTextarea.parentElement.appendChild(hintEl);
    }

    hintEl.textContent = message;
    hintEl.style.display = 'block';

    // 3秒后自动隐藏
    clearTimeout(this.voiceHintTimeout);
    this.voiceHintTimeout = setTimeout(() => {
      if (hintEl) {
        hintEl.style.display = 'none';
      }
    }, 3000);
  }

  showPermissionHint() {
    // 检查是否已经显示过，避免重复显示
    if (document.getElementById('ai-permission-hint')) {
      return;
    }

    const isHTTPS = location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
    const browser = this.detectBrowser();

    const hint = `
      <div id="ai-permission-hint" style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 24px;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        z-index: 10000;
        max-width: 450px;
        text-align: left;
      ">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h3 style="margin: 0; color: #2E7D32;">需要麦克风权限</h3>
          <button onclick="document.getElementById('ai-permission-hint').remove()" style="
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
          ">×</button>
        </div>
        
        <div style="margin-bottom: 20px; color: #666; line-height: 1.8;">
          ${!isHTTPS ? '<p style="color: #FF5722; font-weight: bold; margin-bottom: 12px;">⚠️ 注意：语音识别需要在 HTTPS 环境下使用！</p>' : ''}
          
          <p style="margin: 0 0 12px 0;"><strong>当前环境：</strong></p>
          <ul style="margin: 0 0 12px 20px; padding: 0;">
            <li>协议: ${location.protocol}</li>
            <li>浏览器: ${browser}</li>
            <li>HTTPS: ${isHTTPS ? '✅' : '❌'}</li>
          </ul>
          
          <p style="margin: 12px 0; font-weight: bold;">设置步骤：</p>
          <ol style="margin: 0 0 12px 20px; padding: 0; line-height: 1.8;">
            <li>点击浏览器地址栏左侧的 <strong>锁图标 🔒</strong> 或 <strong>信息图标 ℹ️</strong></li>
            <li>找到"麦克风"或"媒体"权限</li>
            <li>选择<strong>"允许"</strong>或<strong>"始终允许"</strong></li>
            <li>刷新页面后重试</li>
          </ol>
          
          ${browser !== 'Chrome' && browser !== 'Edge' ? '<p style="color: #FF9800; margin: 12px 0 0 0;">💡 建议：语音识别在 Chrome 或 Edge 浏览器中效果最佳</p>' : ''}
        </div>
        
        <div style="text-align: center; padding-top: 16px; border-top: 1px solid #eee;">
          <button onclick="document.getElementById('ai-permission-hint').remove()" style="
            background: #4CAF50;
            color: white;
            border: none;
            padding: 10px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.3s;
          " onmouseover="this.style.background='#45a049'" onmouseout="this.style.background='#4CAF50'">我知道了</button>
        </div>
      </div>
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 9999;
      " onclick="document.getElementById('ai-permission-hint').remove(); this.remove();"></div>
    `;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = hint;
    document.body.appendChild(tempDiv.firstElementChild);

    // 点击背景关闭
    const overlay = document.body.lastElementChild.previousElementSibling;
    overlay.addEventListener('click', function () {
      const modal = document.getElementById('ai-permission-hint');
      if (modal) modal.remove();
      overlay.remove();
    });
  }

  detectBrowser() {
    const ua = navigator.userAgent;
    if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome';
    if (ua.includes('Edg')) return 'Edge';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
    return '未知';
  }

  showNetworkErrorHint() {
    // 检查是否已经显示过，避免重复显示
    if (document.getElementById('ai-network-error-hint')) {
      return;
    }

    // 检测网络状态
    const isOnline = navigator.onLine;
    const canReachGoogle = this.testGoogleConnectivity();

    const hint = `
      <div id="ai-network-error-hint" style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 24px;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        z-index: 10000;
        max-width: 500px;
        text-align: left;
      ">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h3 style="margin: 0; color: #FF5722;">⚠️ 语音识别网络错误</h3>
          <button onclick="document.getElementById('ai-network-error-hint').remove(); document.querySelector('.network-error-overlay')?.remove();" style="
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
          ">×</button>
        </div>
        
        <div style="margin-bottom: 20px; color: #666; line-height: 1.8;">
          <p style="margin: 0 0 12px 0; color: #333; font-weight: bold;">问题原因：</p>
          <p style="margin: 0 0 16px 0;">
            浏览器语音识别功能（Web Speech API）需要连接到 <strong>Google 服务器</strong> 才能进行语音转文字处理。
            当前无法连接到 Google 服务器，导致识别失败。
          </p>
          
          <p style="margin: 16px 0 12px 0; color: #333; font-weight: bold;">网络状态检测：</p>
          <ul style="margin: 0 0 16px 20px; padding: 0;">
            <li>本地网络连接: ${isOnline ? '<span style="color: #4CAF50;">✅ 已连接</span>' : '<span style="color: #F44336;">❌ 未连接</span>'}</li>
            <li>Google 服务: ${canReachGoogle ? '<span style="color: #4CAF50;">✅ 可访问</span>' : '<span style="color: #F44336;">❌ 无法访问</span>'}</li>
          </ul>
          
          <p style="margin: 16px 0 12px 0; color: #333; font-weight: bold;">解决方案：</p>
          <ol style="margin: 0 0 16px 20px; padding: 0; line-height: 2;">
            <li><strong>检查网络连接</strong><br>
              <span style="color: #666; font-size: 13px;">确保设备已连接到互联网</span>
            </li>
            <li><strong>使用 VPN/代理（如在中国大陆）</strong><br>
              <span style="color: #666; font-size: 13px;">Google 服务在某些地区可能无法直接访问，需要使用科学上网工具</span>
            </li>
            <li><strong>检查防火墙设置</strong><br>
              <span style="color: #666; font-size: 13px;">确保防火墙或安全软件未阻止访问 Google 服务器</span>
            </li>
            <li><strong>使用文字输入</strong><br>
              <span style="color: #666; font-size: 13px;">语音识别不可用时，可以直接在输入框中输入文字提问</span>
            </li>
            <li><strong>等待后重试</strong><br>
              <span style="color: #666; font-size: 13px;">如果只是临时网络问题，稍等片刻后刷新页面重试</span>
            </li>
          </ol>
          
          <div style="background: #E3F2FD; padding: 12px; border-radius: 6px; margin: 16px 0;">
            <p style="margin: 0; color: #1976D2; font-size: 13px;">
              <strong>💡 提示：</strong>即使无法使用语音识别，您仍然可以通过文字输入与 AI 助手对话，所有功能都正常工作。
            </p>
          </div>
        </div>
        
        <div style="text-align: center; padding-top: 16px; border-top: 1px solid #eee; display: flex; gap: 10px; justify-content: center;">
          <button onclick="window.location.reload()" style="
            background: #2196F3;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.3s;
          " onmouseover="this.style.background='#1976D2'" onmouseout="this.style.background='#2196F3'">🔄 刷新页面</button>
          <button onclick="document.getElementById('ai-network-error-hint').remove(); document.querySelector('.network-error-overlay')?.remove();" style="
            background: #4CAF50;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.3s;
          " onmouseover="this.style.background='#45a049'" onmouseout="this.style.background='#4CAF50'">我知道了</button>
        </div>
      </div>
      <div class="network-error-overlay" style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 9999;
      " onclick="document.getElementById('ai-network-error-hint').remove(); this.remove();"></div>
    `;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = hint;
    document.body.appendChild(tempDiv.firstElementChild);

    // 点击背景关闭
    const overlay = document.querySelector('.network-error-overlay');
    if (overlay) {
      overlay.addEventListener('click', function () {
        const modal = document.getElementById('ai-network-error-hint');
        if (modal) modal.remove();
        this.remove();
      });
    }
  }

  // 测试 Google 连接性
  async testGoogleConnectivity() {
    try {
      // 尝试访问 Google 的公共服务来检测连接性
      // 注意：这只是简单测试，实际语音识别可能需要特定的 Google 服务端点
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch('https://www.google.com/favicon.ico', {
        method: 'HEAD',
        mode: 'no-cors',
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      return true;
    } catch (error) {
      console.log('Google 连接性测试:', error.name === 'AbortError' ? '超时' : '失败');
      return false;
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }, 100);
  }

  setSendButtonDisabled(disabled) {
    this.sendBtn.disabled = disabled;
  }

  updateStatus(status) {
    const statusEl = document.getElementById('ai-status');
    if (statusEl) {
      statusEl.textContent = status;
    }
  }

  showBadge() {
    const badge = document.getElementById('ai-assistant-badge');
    if (badge) {
      badge.classList.add('show');
    }
  }

  hideBadge() {
    const badge = document.getElementById('ai-assistant-badge');
    if (badge) {
      badge.classList.remove('show');
    }
  }

  showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'ai-message-error';
    errorDiv.textContent = message;
    this.messagesContainer.appendChild(errorDiv);
    setTimeout(() => {
      errorDiv.remove();
    }, 3000);
  }

  saveConversationHistory() {
    try {
      localStorage.setItem('ai-assistant-history', JSON.stringify(this.conversationHistory));
    } catch (error) {
      console.warn('保存对话历史失败:', error);
    }
  }

  loadConversationHistory() {
    try {
      const saved = localStorage.getItem('ai-assistant-history');
      if (saved) {
        this.conversationHistory = JSON.parse(saved).slice(-20); // 只保留最近20条
      }
    } catch (error) {
      console.warn('加载对话历史失败:', error);
    }
  }
}

// 初始化 AI 助手
document.addEventListener('DOMContentLoaded', () => {
  window.aiAssistant = new AIAssistant({
    appId: '1971426275889324033',
    avatarImage: 'images/AIhudongxiaoren.png'
  });
});
