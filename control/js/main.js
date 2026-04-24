// 主JavaScript文件 - 页面导航和基础功能

class ControlApp {
    constructor() {
        this.currentTab = 'chemical';
        this.init();
    }

    init() {
        this.bindEvents();
        this.initTabs();
        this.loadInitialData();
    }

    bindEvents() {
        // 导航滚动
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = item.dataset.tab;
                this.scrollToSection(targetId);
            });
        });

        // 模态框关闭
        document.getElementById('close-modal')?.addEventListener('click', () => {
            this.closeModal('alternatives-modal');
        });

        document.getElementById('close-device-modal')?.addEventListener('click', () => {
            this.closeModal('device-modal');
        });

        // 点击模态框背景关闭
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });

        // 滚动监听，更新导航状态
        window.addEventListener('scroll', this.throttle(() => {
            this.updateNavigationState();
            this.updateScrollIndicator();
        }, 100));

        // 滚动指示器点击事件
        document.querySelectorAll('.scroll-dot').forEach(dot => {
            dot.addEventListener('click', () => {
                const sectionId = dot.dataset.section;
                this.scrollToSection(sectionId);
            });
        });
    }

    initTabs() {
        // 初始化两个模块
        this.initChemicalControl();
        this.initGreenControl();
        this.updateNavigationState();
    }

    scrollToSection(sectionId) {
        const targetElement = document.getElementById(`${sectionId}-control`);
        if (targetElement) {
            const headerHeight = document.querySelector('.main-header').offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // 更新导航状态
            this.updateActiveNav(sectionId);
        }
    }

    updateActiveNav(activeId) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-tab="${activeId}"]`).classList.add('active');
    }

    updateNavigationState() {
        const sections = ['chemical', 'green'];
        const headerHeight = document.querySelector('.main-header').offsetHeight;
        const scrollPosition = window.scrollY + headerHeight + 100;

        let activeSection = 'chemical';
        
        sections.forEach(sectionId => {
            const element = document.getElementById(`${sectionId}-control`);
            if (element) {
                const elementTop = element.offsetTop;
                const elementBottom = elementTop + element.offsetHeight;
                
                if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
                    activeSection = sectionId;
                }
            }
        });

        this.updateActiveNav(activeSection);
    }

    updateScrollIndicator() {
        const sections = ['chemical', 'green'];
        const headerHeight = document.querySelector('.main-header').offsetHeight;
        const scrollPosition = window.scrollY + headerHeight + 100;

        let activeSection = 'chemical';
        
        sections.forEach(sectionId => {
            const element = document.getElementById(`${sectionId}-control`);
            if (element) {
                const elementTop = element.offsetTop;
                const elementBottom = elementTop + element.offsetHeight;
                
                if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
                    activeSection = sectionId;
                }
            }
        });

        // 更新滚动指示器
        document.querySelectorAll('.scroll-dot').forEach(dot => {
            dot.classList.remove('active');
        });
        document.querySelector(`[data-section="${activeSection}"]`).classList.add('active');
    }

    initChemicalControl() {
        // 化学防控模块初始化
        // ChemicalControl在DOMContentLoaded时自动初始化，不需要手动调用init
        // 但如果需要，确保它已经初始化
        if (window.ChemicalControl && typeof window.ChemicalControl.init === 'function') {
            window.ChemicalControl.init();
        } else if (window.ChemicalControlClass && !window.ChemicalControl) {
            // 如果只有类，创建实例
            window.ChemicalControl = new window.ChemicalControlClass();
        }
    }

    initGreenControl() {
        // 绿色防控模块初始化
        // GreenControl在DOMContentLoaded时自动初始化，不需要手动调用init
        // 但如果需要，确保它已经初始化
        if (window.GreenControl && typeof window.GreenControl.init === 'function') {
            window.GreenControl.init();
        } else if (window.GreenControlClass && !window.GreenControl) {
            // 如果只有类，创建实例
            window.GreenControl = new window.GreenControlClass();
        }
    }

    loadInitialData() {
        // 加载初始数据
        this.showNotification('系统初始化完成', 'success');
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const iconMap = {
            success: 'fas fa-check-circle',
            warning: 'fas fa-exclamation-triangle',
            error: 'fas fa-times-circle',
            info: 'fas fa-info-circle'
        };

        notification.innerHTML = `
            <div class="notification-header">
                <div class="notification-title">
                    <i class="${iconMap[type]}"></i>
                    ${this.getNotificationTitle(type)}
                </div>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="notification-body">${message}</div>
        `;

        // 添加关闭事件
        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.removeNotification(notification);
        });

        document.body.appendChild(notification);

        // 显示动画
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // 自动关闭
        if (duration > 0) {
            setTimeout(() => {
                this.removeNotification(notification);
            }, duration);
        }
    }

    removeNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    getNotificationTitle(type) {
        const titles = {
            success: '操作成功',
            warning: '警告',
            error: '错误',
            info: '提示'
        };
        return titles[type] || '通知';
    }

    // 工具方法
    formatDate(date) {
        return new Date(date).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    formatNumber(number, decimals = 0) {
        return Number(number).toLocaleString('zh-CN', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// 全局工具函数
window.utils = {
    // 生成随机ID
    generateId: () => {
        return Math.random().toString(36).substr(2, 9);
    },

    // 深拷贝对象
    deepClone: (obj) => {
        return JSON.parse(JSON.stringify(obj));
    },

    // 防抖函数
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // 节流函数
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // 格式化文件大小
    formatFileSize: (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    // 验证图片文件
    validateImageFile: (file) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        const maxSize = 10 * 1024 * 1024; // 10MB

        if (!allowedTypes.includes(file.type)) {
            return { valid: false, message: '请上传有效的图片文件（JPG、PNG、GIF、WebP）' };
        }

        if (file.size > maxSize) {
            return { valid: false, message: '图片文件大小不能超过10MB' };
        }

        return { valid: true };
    }
};

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    window.controlApp = new ControlApp();
});

// 导出全局对象
window.ControlApp = ControlApp;
