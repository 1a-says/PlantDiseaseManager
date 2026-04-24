/**
 * AI智慧农产品识别管理平台 - 主要功能脚本
 * 包含导航栏、图表、移动端菜单等功能
 */

// 全局变量
let diseaseChart, riskChart, yieldChart; // diseaseChart现在是ECharts实例

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function () {
  initializeNavigation();
  initializeMobileMenu();
  initializeBackToTop();
  initializeImageHandling();
  initializeSwiper();
  initializeWOWAnimations();
  initializeCharts();
  initializeMarqueeAnimation();
  initializeSeparatorPosition();
  initializeVideoPlayer();
});

/**
 * 导航栏功能
 */
function initializeNavigation() {
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('back-to-top');

  // 设置固定的白色背景和深色文字
  navbar.classList.add('bg-white');
  navbar.classList.remove('bg-transparent');

  // 设置导航链接为深色文字
  document.querySelectorAll('#navbar a').forEach(link => {
    link.classList.remove('text-white');
    link.classList.add('text-dark');
  });

  // 设置logo为深色文字
  const logo = document.querySelector('#navbar .flex.items-center span');
  if (logo) {
    logo.classList.remove('text-white');
    logo.classList.add('text-dark');
  }

  // 当前页面高亮功能
  function updateActiveNavLink() {
    const sections = ['hero', 'features', 'analytics', 'cases'];
    const navLinks = document.querySelectorAll('#navbar .nav-link');

    // 移除所有活跃状态
    navLinks.forEach(link => {
      link.classList.remove('nav-link-active');
    });

    // 检查当前滚动位置
    let currentSection = 'hero'; // 默认首页

    sections.forEach(section => {
      const element = document.getElementById(section);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          currentSection = section;
        }
      }
    });

    // 设置当前活跃链接
    const activeLink = document.querySelector(`#navbar a[href="#${currentSection}"]`);
    if (activeLink) {
      activeLink.classList.add('nav-link-active');
    }
  }

  // 监听滚动事件更新活跃链接
  window.addEventListener('scroll', function () {
    updateActiveNavLink();

    if (window.scrollY > 100) {
      // 显示返回顶部按钮
      backToTop.classList.remove('opacity-0', 'invisible');
      backToTop.classList.add('opacity-100', 'visible');
    } else {
      // 隐藏返回顶部按钮
      backToTop.classList.add('opacity-0', 'invisible');
      backToTop.classList.remove('opacity-100', 'visible');
    }
  });

  // 初始化时设置首页为活跃状态
  updateActiveNavLink();
}

/**
 * 移动端菜单功能
 */
function initializeMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () {
      mobileMenu.classList.toggle('hidden');
    });

    // 关闭移动端菜单（点击菜单项后）
    document.querySelectorAll('#mobile-menu a').forEach(link => {
      link.addEventListener('click', function () {
        mobileMenu.classList.add('hidden');
      });
    });
  }
}

/**
 * 返回顶部功能
 */
function initializeBackToTop() {
  const backToTop = document.getElementById('back-to-top');

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

/**
 * 图片处理功能
 */
function initializeImageHandling() {
  const images = document.querySelectorAll('img');

  images.forEach(img => {
    // 图片加载成功处理
    img.addEventListener('load', function () {
      this.classList.add('loaded');
    });

    // 图片加载错误处理
    img.addEventListener('error', function () {
      this.style.display = 'none';
      const placeholder = document.createElement('div');
      placeholder.className = 'loading-placeholder';
      placeholder.style.width = this.style.width || '100%';
      placeholder.style.height = this.style.height || '200px';
      placeholder.innerHTML = '<i class="fa fa-image text-4xl"></i>';
      this.parentNode.insertBefore(placeholder, this);
    });
  });
}

/**
 * 轮播图初始化
 */
function initializeSwiper() {
  // 等待Swiper库加载（最多等待5秒）
  let waitCount = 0;
  const maxWait = 50; // 5秒 = 50 * 100ms

  const checkSwiper = setInterval(() => {
    waitCount++;

    // 如果Swiper已加载
    if (typeof Swiper !== 'undefined') {
      clearInterval(checkSwiper);
      initSwiperInstance();
      return;
    }

    // 如果明确标记为加载失败，或等待超时
    if (window.SWIPER_LOAD_FAILED || waitCount >= maxWait) {
      clearInterval(checkSwiper);
      // 静默切换到备用方案，不输出日志（避免控制台噪音）
      initFallbackSlider();
      return;
    }
  }, 100);
}

/**
 * 初始化Swiper实例
 */
function initSwiperInstance() {
  // 检查Swiper是否已加载
  if (typeof Swiper === 'undefined') {
    initFallbackSlider();
    return;
  }

  // 检查容器是否存在
  const container = document.querySelector('.swiper-container');
  if (!container) {
    console.error('找不到.swiper-container元素');
    return;
  }

  console.log('找到Swiper容器，开始初始化...');

  // 创建Swiper实例 - 完全匹配主页配置
  const swiper = new Swiper('.swiper-container', {
    // 基本配置 - 加快切换速度
    effect: 'fade',
    loop: true,
    speed: 80, // 进一步加快切换速度，从100ms改为80ms
    allowTouchMove: false, // 禁用触摸移动，与主页一致

    // 自动播放配置 - 鼠标悬停不影响切换
    autoplay: {
      delay: 3000, // 自动播放间隔改为3秒
      disableOnInteraction: false, // 用户交互后不停止自动播放
      pauseOnMouseEnter: false, // 鼠标悬停时不暂停
      stopOnLastSlide: false, // 不在最后一张幻灯片停止
    },

    // 导航配置 - 与主页完全一致
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },

    // 分页配置 - 与主页一致（主页设置为空字符串，表示不使用分页）
    pagination: {
      el: null, // 主页设置为空，不使用分页
      clickable: false,
    },

    // 响应式配置 - 与主页完全一致
    breakpoints: {
      320: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 1,
      },
      1024: {
        slidesPerView: 1,
      },
      1200: {
        slidesPerView: 1,
      },
      1400: {
        slidesPerView: 1,
      },
      1600: {
        slidesPerView: 1,
      }
    },

    // 事件回调 - 与主页完全一致
    on: {
      init: function () {
        console.log('轮播图初始化完成');
        addSlideNumbers();
        triggerSlideAnimations();
      },
      slideChange: function () {
        console.log('轮播图切换到第', this.realIndex + 1, '张');
        updateSlideCounter();
        triggerSlideAnimations();
      },
      autoplayStart: function () {
        console.log('自动播放开始');
      },
      autoplayStop: function () {
        console.log('自动播放暂停');
      }
    }
  });

  // 将swiper实例保存到全局变量
  window.agronSwiper = swiper;

  // 添加箭头按钮点击事件
  initNavigationButtons();

  return swiper;
}

/**
 * 添加幻灯片编号
 */
function addSlideNumbers() {
  const slides = document.querySelectorAll('.swiper-slide');
  slides.forEach((slide, index) => {
    const slideNumber = document.createElement('div');
    slideNumber.className = 'slide-number';
    slideNumber.textContent = `${index + 1} / ${slides.length}`;
    slideNumber.style.cssText = `
      position: absolute;
      bottom: 20px;
      right: 20px;
      background: rgba(255,255,255,0.2);
      color: white;
      padding: 5px 10px;
      border-radius: 15px;
      font-size: 12px;
      backdrop-filter: blur(10px);
      z-index: 10;
    `;
    slide.appendChild(slideNumber);
  });
}

/**
 * 更新幻灯片计数器
 */
function updateSlideCounter() {
  const slideNumbers = document.querySelectorAll('.slide-number');
  slideNumbers.forEach((number, index) => {
    if (window.agronSwiper) {
      const currentIndex = window.agronSwiper.realIndex + 1;
      const totalSlides = window.agronSwiper.slides.length;
      number.textContent = `${currentIndex} / ${totalSlides}`;
    }
  });
}

/**
 * 初始化导航按钮功能
 */
function initNavigationButtons() {
  const prevBtn = document.querySelector('.swiper-button-prev');
  const nextBtn = document.querySelector('.swiper-button-next');

  if (prevBtn) {
    prevBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (window.agronSwiper) {
        window.agronSwiper.slidePrev();
        console.log('点击左箭头：上一张');
      }
    });
    console.log('左箭头按钮事件已绑定');
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (window.agronSwiper) {
        window.agronSwiper.slideNext();
        console.log('点击右箭头：下一张');
      }
    });
    console.log('右箭头按钮事件已绑定');
  }

  // 添加键盘控制
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft' && window.agronSwiper) {
      window.agronSwiper.slidePrev();
      console.log('键盘左箭头：上一张');
    } else if (e.key === 'ArrowRight' && window.agronSwiper) {
      window.agronSwiper.slideNext();
      console.log('键盘右箭头：下一张');
    }
  });

  console.log('导航按钮功能初始化完成');
}

/**
 * 初始化WOW动画
 */
function initializeWOWAnimations() {
  // 等待WOW.js库加载（最多等待5秒）
  let waitCount = 0;
  const maxWait = 50; // 5秒 = 50 * 100ms

  const checkWOW = setInterval(() => {
    waitCount++;

    // 如果WOW已加载
    if (typeof WOW !== 'undefined' && window.WOW_LOADED) {
      clearInterval(checkWOW);
      initWOWInstance();
      return;
    }

    // 如果明确标记为加载失败，或等待超时
    if (window.WOW_LOAD_FAILED || waitCount >= maxWait) {
      clearInterval(checkWOW);
      // 静默切换到备用方案，不输出日志（避免控制台噪音）
      initCustomAnimations();
      return;
    }
  }, 100);
}

/**
 * 初始化WOW实例
 */
function initWOWInstance() {
  // 检查WOW.js是否已加载
  if (typeof WOW === 'undefined' || window.WOW_LOADED === false) {
    initCustomAnimations();
    return;
  }

  try {
    // 初始化WOW动画
    new WOW({
      boxClass: 'wow',
      animateClass: 'animated',
      offset: 0,
      mobile: true,
      live: true
    }).init();

    console.log('WOW动画初始化完成');
  } catch (error) {
    console.error('WOW.js初始化失败:', error);
    initCustomAnimations();
  }
}

/**
 * 自定义动画初始化（当WOW.js不可用时）
 */
function initCustomAnimations() {
  const animatedElements = document.querySelectorAll('.wow');

  animatedElements.forEach(element => {
    // 添加初始状态
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'all 0.6s ease-out';

    // 创建Intersection Observer来触发动画
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    observer.observe(element);
  });

  console.log('自定义动画初始化完成');
}

/**
 * 触发幻灯片动画
 */
function triggerSlideAnimations() {
  const currentSlide = document.querySelector('.swiper-slide-active');
  if (!currentSlide) return;

  // 为所有幻灯片应用背景缩放动画
  const allSlides = document.querySelectorAll('.swiper-slide');
  allSlides.forEach(slide => {
    const background = slide.querySelector('.slide-background');
    if (background) {
      // 重置动画
      background.style.animation = 'none';
      background.offsetHeight; // 触发重排

      // 根据不同的幻灯片设置不同的动画时长
      let animationDuration = '6s';
      if (slide.classList.contains('elementor-repeater-item-b153571')) {
        animationDuration = '6s';
      } else if (slide.classList.contains('elementor-repeater-item-f61da63')) {
        animationDuration = '5s';
      } else if (slide.classList.contains('elementor-repeater-item-86cc5c8')) {
        animationDuration = '7s';
      }

      // 为每个幻灯片都应用缩放动画
      setTimeout(() => {
        background.style.animation = `enhancedBackgroundZoomOut ${animationDuration} ease-out forwards`;
      }, 100);
    }
  });

  // 触发文字动画
  const animatedElements = currentSlide.querySelectorAll('.wow');
  animatedElements.forEach((element, index) => {
    setTimeout(() => {
      element.style.animation = 'none';
      element.offsetHeight; // 触发重排
      element.style.animation = null;
    }, index * 200);
  });
}

/**
 * 备用轮播图实现（当Swiper库不可用时）
 */
function initFallbackSlider() {
  // 静默使用备用轮播图实现

  const slides = document.querySelectorAll('.swiper-slide');
  const prevBtn = document.querySelector('.swiper-button-prev');
  const nextBtn = document.querySelector('.swiper-button-next');

  if (slides.length === 0) {
    // 静默处理，不输出错误
    return;
  }

  let currentSlide = 0;
  let autoplayInterval;

  // 显示当前幻灯片
  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.style.display = i === index ? 'flex' : 'none';
      slide.style.opacity = i === index ? '1' : '0';
    });
  }

  // 下一张
  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
    triggerSlideAnimations();
  }

  // 上一张
  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
    triggerSlideAnimations();
  }

  // 自动播放
  function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, 3000); // 改为3秒切换
  }

  function stopAutoplay() {
    clearInterval(autoplayInterval);
  }

  // 绑定事件
  if (nextBtn) {
    nextBtn.addEventListener('click', nextSlide);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', prevSlide);
  }

  // 移除鼠标悬停暂停逻辑，保持持续自动播放

  // 键盘控制
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === ' ') {
      e.preventDefault();
      if (autoplayInterval) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    }
  });

  // 初始化
  showSlide(0);
  startAutoplay();

  // 静默初始化完成

  // 导出控制函数
  window.AgronSlider = {
    goToSlide: (index) => {
      currentSlide = index;
      showSlide(currentSlide);
    },
    getCurrentSlideIndex: () => currentSlide,
    getTotalSlides: () => slides.length,
    toggleAutoplay: () => {
      if (autoplayInterval) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    },
    pauseAutoplay: stopAutoplay
  };
}

/**
 * 跑马灯动画初始化
 */
function initializeMarqueeAnimation() {
  const marqueeWrapper = document.querySelector('.pxl-image-marquee-wrapper');
  if (!marqueeWrapper) return;

  console.log('初始化跑马灯动画...');

  // 检查是否在视口中 - 滚动触发
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // 显示跑马灯容器
        marqueeWrapper.classList.add('animate-in');

        // 延迟启动动画，确保容器先显示
        setTimeout(() => {
          startMarqueeAnimation(entry.target);
        }, 300);

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2, // 当20%的元素可见时触发
    rootMargin: '0px 0px -50px 0px' // 提前50px触发
  });

  observer.observe(marqueeWrapper);

  // 添加鼠标悬停控制
  marqueeWrapper.addEventListener('mouseenter', function () {
    const marquee = this.querySelector('.pxl-image-marquee');
    if (marquee) {
      marquee.style.animationPlayState = 'paused';
    }
  });

  marqueeWrapper.addEventListener('mouseleave', function () {
    const marquee = this.querySelector('.pxl-image-marquee');
    if (marquee) {
      marquee.style.animationPlayState = 'running';
    }
  });

  console.log('跑马灯动画初始化完成 - 等待滚动触发');
}

/**
 * 启动跑马灯动画
 */
function startMarqueeAnimation(wrapper) {
  const marquee = wrapper.querySelector('.pxl-image-marquee');
  if (!marquee) return;

  // 获取速度设置
  const speed = marquee.getAttribute('data-speed') || '30';
  const direction = marquee.getAttribute('data-direction') || 'rtl';

  // 设置动画持续时间
  const duration = getAnimationDuration(speed);
  marquee.style.animationDuration = duration + 's';

  // 设置动画方向 - 从右往左
  if (direction === 'rtl') {
    marquee.style.animationDirection = 'normal';
  }

  // 启动无缝循环动画
  marquee.style.animationPlayState = 'running';
  marquee.classList.add('marquee-animating');

  // 确保无缝循环 - 重置动画位置
  marquee.style.transform = 'translateX(0)';

  console.log(`跑马灯动画启动 - 无缝循环，速度: ${speed}, 方向: ${direction}, 持续时间: ${duration}s`);
}

/**
 * 根据速度获取动画持续时间
 */
function getAnimationDuration(speed) {
  const speedMap = {
    '10': 60,
    '20': 40,
    '30': 30,
    '40': 20,
    '50': 15
  };
  return speedMap[speed] || 30;
}

/**
 * 图表初始化
 */
function initializeCharts() {
  // 在DOMContentLoaded时先尝试初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(() => {
        initDiseaseChart();
        initRiskChart();
        initYieldChart();
      }, 100);
    });
  } else {
    // DOM已经加载完成，立即初始化
    setTimeout(() => {
      initDiseaseChart();
      initRiskChart();
      initYieldChart();
    }, 100);
  }

  // 在window.load时再次确保初始化（作为备用）
  window.addEventListener('load', function () {
    setTimeout(() => {
      // 检查图表是否已成功初始化
      const diseaseContainer = document.getElementById('diseaseChart');
      if (diseaseContainer && (!diseaseChart || diseaseChart.isDisposed())) {
        console.log('检测到图表未初始化，重新初始化...');
        initDiseaseChart();
      }
      if (!riskChart) {
        initRiskChart();
      }
      if (!yieldChart) {
        initYieldChart();
      }
    }, 300);
  });
}

/**
 * 病虫害趋势图表 - ECharts动态版本
 */
function initDiseaseChart() {
  const diseaseContainer = document.getElementById('diseaseChart');
  if (!diseaseContainer) {
    console.warn('找不到图表容器 #diseaseChart');
    return;
  }

  // 检查容器是否可见且有尺寸
  const checkContainerReady = () => {
    const rect = diseaseContainer.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  };

  // 如果容器还没准备好，延迟初始化（最多重试10次）
  let retryCount = 0;
  const maxRetries = 10;
  if (!checkContainerReady()) {
    console.log('图表容器未准备好，延迟初始化...');
    const retryInit = () => {
      retryCount++;
      if (checkContainerReady() || retryCount >= maxRetries) {
        if (retryCount >= maxRetries) {
          console.warn('容器准备超时，强制初始化图表');
        }
        initDiseaseChart();
      } else {
        setTimeout(retryInit, 200);
      }
    };
    setTimeout(retryInit, 200);
    return;
  }

  // 检查ECharts是否已加载
  if (typeof echarts === 'undefined') {
    console.warn('ECharts库未加载，使用备用图表实现');
    // 尝试重新加载ECharts
    setTimeout(() => {
      if (typeof echarts !== 'undefined') {
        initDiseaseChart();
      } else {
        initFallbackDiseaseChart();
      }
    }, 500);
    return;
  }

  // 如果已经初始化过，先销毁
  if (diseaseChart) {
    try {
      diseaseChart.dispose();
    } catch (e) {
      console.warn('销毁旧图表实例时出错:', e);
    }
  }

  try {
    // 初始化ECharts实例
    diseaseChart = echarts.init(diseaseContainer);

    // 验证初始化是否成功
    if (!diseaseChart) {
      throw new Error('ECharts初始化失败，返回null');
    }
  } catch (error) {
    console.error('ECharts初始化错误:', error);
    // 尝试使用备用方案
    initFallbackDiseaseChart();
    return;
  }

  // 模拟实时数据更新
  const baseData = {
    months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    fungi: [12, 19, 15, 20, 25, 30, 35, 38, 32, 22, 18, 15],
    bacteria: [8, 12, 15, 18, 22, 25, 28, 30, 25, 18, 12, 10],
    pests: [5, 8, 10, 15, 20, 25, 30, 35, 28, 20, 15, 10]
  };

  // 配置选项
  const option = {
    title: {
      text: '病虫害月度发生趋势',
      left: 'center',
      textStyle: {
        color: '#1E293B',
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: {
        color: '#1E293B'
      },
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999'
        }
      },
      formatter: function (params) {
        let result = `<div style="font-weight: bold; margin-bottom: 8px;">${params[0].axisValue}</div>`;
        params.forEach(param => {
          const color = param.color;
          const name = param.seriesName;
          const value = param.value;
          result += `<div style="display: flex; align-items: center; margin: 4px 0;">
            <span style="display: inline-block; width: 10px; height: 10px; background-color: ${color}; border-radius: 50%; margin-right: 8px;"></span>
            <span style="margin-right: 8px;">${name}:</span>
            <span style="font-weight: bold;">${value}</span>
          </div>`;
        });
        return result;
      }
    },
    legend: {
      data: ['真菌病害', '细菌病害', '虫害'],
      top: 30,
      textStyle: {
        color: '#1E293B'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: baseData.months,
      axisLine: {
        lineStyle: {
          color: '#e5e7eb'
        }
      },
      axisLabel: {
        color: '#6b7280'
      }
    },
    yAxis: {
      type: 'value',
      name: '发病指数',
      nameTextStyle: {
        color: '#6b7280'
      },
      axisLine: {
        lineStyle: {
          color: '#e5e7eb'
        }
      },
      axisLabel: {
        color: '#6b7280'
      },
      splitLine: {
        lineStyle: {
          color: '#f3f4f6'
        }
      }
    },
    series: [
      {
        name: '真菌病害',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          width: 3,
          color: '#2E7D32'
        },
        itemStyle: {
          color: '#2E7D32'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: 'rgba(46, 125, 50, 0.3)'
            }, {
              offset: 1, color: 'rgba(46, 125, 50, 0.05)'
            }]
          }
        },
        data: baseData.fungi,
        animationDelay: function (idx) {
          return idx * 100;
        }
      },
      {
        name: '细菌病害',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          width: 3,
          color: '#1976D2'
        },
        itemStyle: {
          color: '#1976D2'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: 'rgba(25, 118, 210, 0.3)'
            }, {
              offset: 1, color: 'rgba(25, 118, 210, 0.05)'
            }]
          }
        },
        data: baseData.bacteria,
        animationDelay: function (idx) {
          return idx * 100 + 200;
        }
      },
      {
        name: '虫害',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          width: 3,
          color: '#FF9800'
        },
        itemStyle: {
          color: '#FF9800'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: 'rgba(255, 152, 0, 0.3)'
            }, {
              offset: 1, color: 'rgba(255, 152, 0, 0.05)'
            }]
          }
        },
        data: baseData.pests,
        animationDelay: function (idx) {
          return idx * 100 + 400;
        }
      }
    ],
    animation: true,
    animationDuration: 2000,
    animationEasing: 'cubicOut'
  };

  try {
    // 设置配置项
    diseaseChart.setOption(option);

    // 立即检查图表是否正常渲染（多次检查确保可靠性）
    const checkChartRender = (attempt = 1, maxAttempts = 3) => {
      setTimeout(() => {
        if (!diseaseChart || diseaseChart.isDisposed()) {
          console.warn('图表实例无效，尝试重新初始化...');
          diseaseChart = null;
          setTimeout(() => initDiseaseChart(), 500);
          return;
        }

        try {
          const width = diseaseChart.getWidth();
          const height = diseaseChart.getHeight();
          if (!width || !height || width === 0 || height === 0) {
            if (attempt < maxAttempts) {
              console.warn(`图表渲染异常（尝试 ${attempt}/${maxAttempts}），稍后重试...`);
              setTimeout(() => checkChartRender(attempt + 1, maxAttempts), 1000);
            } else {
              console.warn('图表渲染异常，尝试重新初始化...');
              try {
                diseaseChart.dispose();
              } catch (e) {
                // 忽略销毁错误
              }
              diseaseChart = null;
              setTimeout(() => initDiseaseChart(), 500);
            }
          } else {
            console.log('图表渲染正常，尺寸:', width, 'x', height);
          }
        } catch (error) {
          console.error('检查图表渲染时出错:', error);
          if (attempt < maxAttempts) {
            setTimeout(() => checkChartRender(attempt + 1, maxAttempts), 1000);
          } else {
            diseaseChart = null;
            setTimeout(() => initDiseaseChart(), 500);
          }
        }
      }, 500 * attempt);
    };
    checkChartRender();
  } catch (error) {
    console.error('设置图表配置时出错:', error);
    // 如果设置失败，尝试重新初始化
    if (diseaseChart) {
      try {
        diseaseChart.dispose();
      } catch (e) {
        // 忽略销毁错误
      }
      diseaseChart = null;
    }
    setTimeout(() => initDiseaseChart(), 1000);
    return;
  }

  // 响应式处理 - 使用防抖优化
  let resizeTimer = null;
  const handleResize = () => {
    if (resizeTimer) {
      clearTimeout(resizeTimer);
    }
    resizeTimer = setTimeout(() => {
      if (diseaseChart && !diseaseChart.isDisposed()) {
        try {
          diseaseChart.resize();
        } catch (error) {
          console.error('图表resize错误:', error);
        }
      }
    }, 200);
  };

  // 移除旧的监听器（如果存在）
  if (window._diseaseChartResizeHandler) {
    window.removeEventListener('resize', window._diseaseChartResizeHandler);
  }
  window._diseaseChartResizeHandler = handleResize;
  window.addEventListener('resize', handleResize);

  // 添加鼠标悬停效果
  diseaseChart.on('mouseover', function (params) {
    diseaseChart.dispatchAction({
      type: 'highlight',
      seriesIndex: params.seriesIndex
    });
  });

  diseaseChart.on('mouseout', function (params) {
    diseaseChart.dispatchAction({
      type: 'downplay',
      seriesIndex: params.seriesIndex
    });
  });

  // 模拟实时数据更新（减少频率）
  setInterval(() => {
    updateDiseaseData();
  }, 30000); // 从5秒改为30秒

  // 添加数据刷新按钮功能
  addRefreshButton();

  // 添加滚动监听，当图表进入视口时重新播放动画
  const diseaseScrollContainer = document.getElementById('diseaseChart');
  if (diseaseScrollContainer && diseaseChart) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && diseaseChart && !diseaseChart.isDisposed()) {
          try {
            // 重新播放图表动画
            diseaseChart.setOption(option, true); // 第二个参数为true表示不合并配置
          } catch (error) {
            console.error('重新播放图表动画时出错:', error);
          }
        }
      });
    }, {
      threshold: 0.3, // 当30%的图表可见时触发
      rootMargin: '0px 0px -50px 0px' // 提前50px触发
    });

    observer.observe(diseaseScrollContainer);
  }

  // 添加定期健康检查（每30秒检查一次）
  const healthCheckInterval = setInterval(() => {
    if (!diseaseChart || diseaseChart.isDisposed()) {
      console.warn('健康检查：发现图表实例无效，重新初始化...');
      clearInterval(healthCheckInterval);
      diseaseChart = null;
      initDiseaseChart();
      return;
    }

    try {
      const container = document.getElementById('diseaseChart');
      if (!container) {
        console.warn('健康检查：图表容器不存在');
        clearInterval(healthCheckInterval);
        return;
      }

      const width = diseaseChart.getWidth();
      const height = diseaseChart.getHeight();

      // 如果图表尺寸异常，尝试resize恢复
      if (width === 0 || height === 0) {
        console.warn('健康检查：图表尺寸异常，尝试resize...');
        diseaseChart.resize();
        setTimeout(() => {
          const newWidth = diseaseChart.getWidth();
          const newHeight = diseaseChart.getHeight();
          if (newWidth === 0 || newHeight === 0) {
            console.warn('健康检查：resize后仍异常，重新初始化...');
            clearInterval(healthCheckInterval);
            diseaseChart.dispose();
            diseaseChart = null;
            initDiseaseChart();
          }
        }, 500);
      }
    } catch (error) {
      console.error('健康检查出错:', error);
      // 如果健康检查出错，可能是图表实例有问题，重新初始化
      clearInterval(healthCheckInterval);
      if (diseaseChart) {
        try {
          diseaseChart.dispose();
        } catch (e) {
          // 忽略销毁错误
        }
      }
      diseaseChart = null;
      initDiseaseChart();
    }
  }, 30000); // 每30秒检查一次

  // 保存健康检查的interval ID，以便在重新初始化时清理
  if (window._diseaseChartHealthCheck) {
    clearInterval(window._diseaseChartHealthCheck);
  }
  window._diseaseChartHealthCheck = healthCheckInterval;

  console.log('ECharts病虫害趋势图表初始化完成');
}

/**
 * 更新病虫害数据
 */
function updateDiseaseData(showNotification = false) {
  if (!diseaseChart) {
    console.warn('图表实例不存在，尝试重新初始化...');
    initDiseaseChart();
    return;
  }

  // 检查图表是否已销毁
  if (diseaseChart.isDisposed && diseaseChart.isDisposed()) {
    console.warn('图表实例已销毁，尝试重新初始化...');
    diseaseChart = null;
    initDiseaseChart();
    return;
  }

  // 检查容器是否仍然有效
  const container = document.getElementById('diseaseChart');
  if (!container) {
    console.warn('图表容器不存在');
    return;
  }

  try {
    // 生成随机变化的数据
    const newData = {
      fungi: [12, 19, 15, 20, 25, 30, 35, 38, 32, 22, 18, 15].map(val =>
        Math.max(0, val + (Math.random() - 0.5) * 4)
      ),
      bacteria: [8, 12, 15, 18, 22, 25, 28, 30, 25, 18, 12, 10].map(val =>
        Math.max(0, val + (Math.random() - 0.5) * 3)
      ),
      pests: [5, 8, 10, 15, 20, 25, 30, 35, 28, 20, 15, 10].map(val =>
        Math.max(0, val + (Math.random() - 0.5) * 2)
      )
    };

    // 更新图表数据，添加动画效果
    diseaseChart.setOption({
      series: [
        {
          data: newData.fungi,
          animation: true,
          animationDuration: 1000,
          animationEasing: 'cubicOut'
        },
        {
          data: newData.bacteria,
          animation: true,
          animationDuration: 1000,
          animationEasing: 'cubicOut'
        },
        {
          data: newData.pests,
          animation: true,
          animationDuration: 1000,
          animationEasing: 'cubicOut'
        }
      ]
    }, true); // 第二个参数为true表示不合并配置，完全替换

    // 只在手动刷新时显示通知
    if (showNotification) {
      showDataUpdateNotification();
    }
  } catch (error) {
    console.error('更新图表数据时出错:', error);
    // 如果更新失败，尝试重新初始化
    if (diseaseChart && diseaseChart.isDisposed && diseaseChart.isDisposed()) {
      diseaseChart = null;
      setTimeout(() => initDiseaseChart(), 1000);
    }
  }
}

/**
 * 添加刷新按钮
 */
function addRefreshButton() {
  const chartContainer = document.getElementById('diseaseChart');
  if (!chartContainer) return;

  // 创建刷新按钮
  const refreshBtn = document.createElement('button');
  refreshBtn.innerHTML = '<i class="fa fa-refresh"></i> 刷新数据';
  refreshBtn.className = 'absolute top-2 right-2 px-3 py-1 text-xs bg-tertiary text-white rounded hover:bg-tertiary/90 transition-colors';
  refreshBtn.style.cssText = `
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 10;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 6px 12px;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
  `;

  // 添加悬停效果
  refreshBtn.addEventListener('mouseenter', function () {
    this.style.background = '#45a049';
    this.style.transform = 'scale(1.05)';
  });

  refreshBtn.addEventListener('mouseleave', function () {
    this.style.background = '#4CAF50';
    this.style.transform = 'scale(1)';
  });

  // 添加点击事件
  refreshBtn.addEventListener('click', function () {
    // 检查图表状态
    if (!diseaseChart || (diseaseChart.isDisposed && diseaseChart.isDisposed())) {
      console.warn('图表未初始化或已销毁，尝试重新初始化...');
      diseaseChart = null;
      initDiseaseChart();
      return;
    }

    this.style.transform = 'rotate(360deg)';
    setTimeout(() => {
      this.style.transform = 'rotate(0deg)';
    }, 500);

    updateDiseaseData(true); // 手动刷新时显示通知
  });

  // 将按钮添加到图表容器
  chartContainer.style.position = 'relative';
  chartContainer.appendChild(refreshBtn);
}

/**
 * 显示数据更新通知
 */
function showDataUpdateNotification() {
  // 创建通知元素
  const notification = document.createElement('div');
  notification.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 12px 20px;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1000;
      font-size: 14px;
      animation: slideInRight 0.3s ease-out;
    ">
      <i class="fa fa-check-circle" style="margin-right: 8px;"></i>
      数据已更新
    </div>
  `;

  // 添加动画样式
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  document.body.appendChild(notification);

  // 3秒后自动移除通知
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease-in';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

/**
 * 备用图表实现（当ECharts不可用时）
 */
function initFallbackDiseaseChart() {
  const diseaseFallbackContainer = document.getElementById('diseaseChart');
  if (!diseaseFallbackContainer) return;

  diseaseFallbackContainer.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #6b7280;">
      <div style="text-align: center;">
        <i class="fa fa-chart-line" style="font-size: 48px; margin-bottom: 16px; color: #d1d5db;"></i>
        <p>图表加载中...</p>
      </div>
    </div>
  `;
}

/**
 * 风险预警分布图表
 */
function initRiskChart() {
  const riskCtx = document.getElementById('riskChart');
  if (!riskCtx) return;

  riskChart = new Chart(riskCtx.getContext('2d'), {
    type: 'doughnut',
    data: {
      labels: ['低风险', '中低风险', '中风险', '中高风险', '高风险'],
      datasets: [{
        data: [35, 25, 20, 15, 5],
        backgroundColor: [
          'rgba(76, 175, 80, 0.7)',
          'rgba(156, 39, 176, 0.7)',
          'rgba(255, 152, 0, 0.7)',
          'rgba(244, 67, 54, 0.7)',
          'rgba(233, 30, 99, 0.7)'
        ],
        borderColor: [
          'rgba(76, 175, 80, 1)',
          'rgba(156, 39, 176, 1)',
          'rgba(255, 152, 0, 1)',
          'rgba(244, 67, 54, 1)',
          'rgba(233, 30, 99, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
        }
      },
      cutout: '60%'
    }
  });
}

/**
 * 田块月度健康统计图表
 */
function initYieldChart() {
  const healthChartContainer = document.getElementById('field-health-trend-chart');
  if (!healthChartContainer) return;

  // 检查ECharts是否已加载
  if (typeof echarts === 'undefined') {
    console.warn('ECharts库未加载，使用备用图表实现');
    initFallbackHealthChart();
    return;
  }

  // 初始化ECharts实例
  const healthChart = echarts.init(healthChartContainer);

  // 生成过去12个月的月度数据
  const months = [];
  const currentDate = new Date();
  for (let i = 11; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    months.push(date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'short' }));
  }

  // 模拟田块健康数据
  const fieldData = [
    { id: 'F-001', name: '玉米田', crop: '玉米', health: 85 },
    { id: 'F-002', name: '大豆田', crop: '大豆', health: 78 },
    { id: 'F-003', name: '棉花田', crop: '棉花', health: 72 }
  ];

  // 为每个田块生成月度健康率数据
  const allFieldTrendData = fieldData.map(field => {
    const trendData = months.map((month, index) => {
      // 基于当前健康度生成历史趋势
      const baseHealth = field.health;

      // 模拟季节性变化（春季播种期健康度较低，夏季生长期较高）
      const seasonalFactor = Math.sin((index - 2) * Math.PI / 6) * 15; // 春季(3-4月)较低，夏季(6-8月)较高

      // 模拟随机波动
      const randomFactor = (Math.random() - 0.5) * 20;

      // 计算最终健康率
      const healthRate = Math.max(20, Math.min(100,
        baseHealth + seasonalFactor + randomFactor
      ));

      return Math.round(healthRate);
    });

    return {
      name: `${field.id} ${field.name}`,
      type: 'line',
      data: trendData,
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      areaStyle: {
        opacity: 0.3
      },
      lineStyle: {
        width: 3
      },
      itemStyle: {
        borderWidth: 2
      },
      // 根据作物类型设置颜色
      itemStyle: {
        color: field.crop === '玉米' ? '#4CAF50' :
          field.crop === '大豆' ? '#FF9800' : '#2196F3'
      },
      lineStyle: {
        color: field.crop === '玉米' ? '#4CAF50' :
          field.crop === '大豆' ? '#FF9800' : '#2196F3'
      },
      areaStyle: {
        color: field.crop === '玉米' ? 'rgba(76, 175, 80, 0.3)' :
          field.crop === '大豆' ? 'rgba(255, 152, 0, 0.3)' : 'rgba(33, 150, 243, 0.3)'
      },
      // 添加从左到右的绘制动画
      animation: true,
      animationDuration: 2000,
      animationEasing: 'cubicOut',
      animationDelay: function (idx) {
        return idx * 100; // 每个数据点延迟100ms
      }
    };
  });

  // 配置选项
  const option = {
    title: {
      text: '田块月度健康率趋势',
      left: 'center',
      top: 5,
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2E7D32'
      }
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#4CAF50',
      borderWidth: 1,
      textStyle: { color: '#333' },
      formatter: function (params) {
        let result = `${params[0].axisValue}<br/>`;
        params.forEach(param => {
          const fieldInfo = param.seriesName.split(' ');
          const fieldId = fieldInfo[0];
          const fieldName = fieldInfo.slice(1).join(' ');
          result += `${param.marker}${fieldId} ${fieldName}: ${param.value}%<br/>`;
        });
        return result;
      }
    },
    legend: {
      data: allFieldTrendData.map(f => f.name),
      top: 35,
      left: 'center',
      textStyle: { fontSize: 12 },
      itemGap: 15,
      type: 'scroll'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '20%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: months,
      axisLine: {
        lineStyle: { color: '#E0E0E0' }
      },
      axisTick: { show: false },
      axisLabel: {
        color: '#666',
        fontSize: 12,
        rotate: 45
      }
    },
    yAxis: {
      type: 'value',
      name: '健康率 (%)',
      nameTextStyle: {
        color: '#666',
        fontSize: 12
      },
      axisLine: {
        lineStyle: { color: '#E0E0E0' }
      },
      axisTick: { show: false },
      axisLabel: {
        color: '#666',
        fontSize: 12,
        formatter: '{value}%'
      },
      min: 0,
      max: 100,
      splitLine: {
        lineStyle: {
          color: '#F5F5F5',
          type: 'dashed'
        }
      }
    },
    series: allFieldTrendData,
    animation: true,
    animationDuration: 2000,
    animationEasing: 'cubicOut',
    animationDelay: function (idx) {
      return idx * 200; // 每个系列延迟200ms
    }
  };

  // 设置配置项
  healthChart.setOption(option);

  // 添加健康率参考线
  setTimeout(() => {
    healthChart.setOption({
      series: [
        ...allFieldTrendData,
        {
          name: '健康基准线',
          type: 'line',
          data: Array(months.length).fill(80),
          lineStyle: {
            color: '#4CAF50',
            width: 2,
            type: 'dashed'
          },
          symbol: 'none',
          silent: true,
          z: 0
        },
        {
          name: '预警线',
          type: 'line',
          data: Array(months.length).fill(60),
          lineStyle: {
            color: '#FF9800',
            width: 2,
            type: 'dashed'
          },
          symbol: 'none',
          silent: true,
          z: 0
        }
      ]
    });
  }, 1000);

  // 响应式处理
  window.addEventListener('resize', function () {
    healthChart.resize();
  });

  // 添加滚动监听，当图表进入视口时重新播放动画
  const chartContainer = document.getElementById('field-health-trend-chart');
  if (chartContainer) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // 重新播放图表动画 - 从左到右显现
          healthChart.setOption(option, true); // 第二个参数为true表示不合并配置

          // 延迟添加参考线，确保主线条动画完成后再显示
          setTimeout(() => {
            healthChart.setOption({
              series: [
                ...allFieldTrendData,
                {
                  name: '健康基准线',
                  type: 'line',
                  data: Array(months.length).fill(80),
                  lineStyle: {
                    color: '#4CAF50',
                    width: 2,
                    type: 'dashed'
                  },
                  symbol: 'none',
                  silent: true,
                  z: 0,
                  animation: true,
                  animationDuration: 1000,
                  animationEasing: 'cubicOut'
                },
                {
                  name: '预警线',
                  type: 'line',
                  data: Array(months.length).fill(60),
                  lineStyle: {
                    color: '#FF9800',
                    width: 2,
                    type: 'dashed'
                  },
                  symbol: 'none',
                  silent: true,
                  z: 0,
                  animation: true,
                  animationDuration: 1000,
                  animationEasing: 'cubicOut'
                }
              ]
            });
          }, 2000); // 等待主线条动画完成
        }
      });
    }, {
      threshold: 0.3, // 当30%的图表可见时触发
      rootMargin: '0px 0px -50px 0px' // 提前50px触发
    });

    observer.observe(chartContainer);
  }

  console.log('田块月度健康统计图表初始化完成');
}

/**
 * 备用健康图表实现（当ECharts不可用时）
 */
function initFallbackHealthChart() {
  const healthContainer = document.getElementById('field-health-trend-chart');
  if (!healthContainer) return;

  healthContainer.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #6b7280;">
      <div style="text-align: center;">
        <i class="fa fa-chart-line" style="font-size: 48px; margin-bottom: 16px; color: #d1d5db;"></i>
        <p>健康统计图表加载中...</p>
      </div>
    </div>
  `;
}

/**
 * 工具函数
 */

// 平滑滚动到指定元素
function scrollToElement(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}

// 防抖函数
function debounce(func, wait) {
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

// 节流函数
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// 获取元素是否在视口中
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// 添加滚动动画效果
function addScrollAnimation() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-up');
      }
    });
  });

  // 观察所有需要动画的元素
  document.querySelectorAll('.card-hover, .chart-container').forEach(el => {
    observer.observe(el);
  });
}

// 初始化滚动动画
document.addEventListener('DOMContentLoaded', addScrollAnimation);

// 导出函数供外部使用
window.AgriPlatform = {
  scrollToElement,
  debounce,
  throttle,
  isElementInViewport
};
/**
 * 农业轮播图JavaScript文件
 * 包含轮播图初始化、动画效果和交互功能
 */

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function () {
  console.log('农业轮播图开始初始化...');

  // 预加载背景图片
  preloadBackgroundImages();

  // 延迟初始化，确保所有库都已加载
  setTimeout(() => {
    // 初始化所有功能
    initializeSwiper();
    initWOWAnimations();
    initKeyboardControls();
    initMouseControls();
    initButtonEffects();

    console.log('农业轮播图初始化完成！');
  }, 100);
});

/**
 * 预加载背景图片
 */
function preloadBackgroundImages() {
  const backgroundImages = [
    'images/cotton.jpg',
    'images/soy.jpg',
    'images/corn-field.jpg'  // 修复：使用实际存在的图片文件
  ];

  let loadedCount = 0;
  const totalImages = backgroundImages.length;
  let hasError = false;

  backgroundImages.forEach((imageSrc, index) => {
    const img = new Image();
    img.onload = function () {
      loadedCount++;
      // 只在开发环境输出日志
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log(`背景图片 ${index + 1} 加载完成: ${imageSrc}`);
      }

      // 当所有图片加载完成后，显示轮播图
      if (loadedCount === totalImages) {
        if (!hasError && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
          console.log('所有背景图片预加载完成！');
        }
        // 移除加载遮罩
        const loadingMask = document.querySelector('.loading-mask');
        if (loadingMask) {
          loadingMask.style.opacity = '0';
          setTimeout(() => {
            loadingMask.remove();
            document.body.classList.add('loaded');
          }, 500);
        }

        // 显示轮播图
        const slider = document.querySelector('.pxl-slider');
        if (slider) {
          slider.classList.add('loaded');
        }
      }
    };

    img.onerror = function () {
      hasError = true;
      loadedCount++;
      // 静默处理图片加载失败，不输出警告（避免控制台噪音）

      // 即使图片加载失败，也要继续
      if (loadedCount === totalImages) {
        const loadingMask = document.querySelector('.loading-mask');
        if (loadingMask) {
          loadingMask.style.opacity = '0';
          setTimeout(() => {
            loadingMask.remove();
            document.body.classList.add('loaded');
          }, 500);
        }

        const slider = document.querySelector('.pxl-slider');
        if (slider) {
          slider.classList.add('loaded');
        }
      }
    };

    // 设置高质量加载
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;
  });
}


/**
 * 初始化WOW动画
 */
function initWOWAnimations() {
  // 检查WOW.js是否已加载
  if (typeof WOW === 'undefined') {
    // 静默切换到备用方案
    initCustomAnimations();
    return;
  }

  // 只在开发环境输出日志
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('WOW.js加载成功，初始化动画...');
  }

  // 初始化WOW动画
  new WOW({
    boxClass: 'wow',
    animateClass: 'animated',
    offset: 0,
    mobile: true,
    live: true
  }).init();

  console.log('WOW动画初始化完成');
}

/**
 * 自定义动画初始化（当WOW.js不可用时）
 */
function initCustomAnimations() {
  const animatedElements = document.querySelectorAll('.wow');

  animatedElements.forEach(element => {
    // 添加初始状态
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'all 0.6s ease-out';

    // 创建Intersection Observer来触发动画
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    observer.observe(element);
  });

  console.log('自定义动画初始化完成');
}

/**
 * 初始化键盘控制
 */
function initKeyboardControls() {
  document.addEventListener('keydown', function (e) {
    if (!window.agronSwiper) return;

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        window.agronSwiper.slidePrev();
        console.log('键盘控制：上一张');
        break;
      case 'ArrowRight':
        e.preventDefault();
        window.agronSwiper.slideNext();
        console.log('键盘控制：下一张');
        break;
      case ' ':
        e.preventDefault();
        toggleAutoplay();
        break;
      case 'Escape':
        e.preventDefault();
        pauseAutoplay();
        break;
    }
  });

  console.log('键盘控制初始化完成');
}

/**
 * 初始化鼠标控制
 */
function initMouseControls() {
  const swiperContainer = document.querySelector('.swiper-container');
  if (!swiperContainer) return;

  // 移除鼠标悬停暂停逻辑，保持持续自动播放

  // 点击切换
  swiperContainer.addEventListener('click', function (e) {
    // 排除"观看演示"按钮的点击，不触发轮播切换
    if (e.target.closest('.watch-demo-btn')) {
      console.log('检测到观看演示按钮点击，不切换轮播');
      return; // 如果是按钮点击，直接返回，不切换轮播
    }

    if (e.target === swiperContainer || e.target.closest('.swiper-slide')) {
      if (window.agronSwiper) {
        window.agronSwiper.slideNext();
        console.log('点击切换：下一张');
      }
    }
  });

  // 移除鼠标视差效果 - 不再需要3D效果

  console.log('鼠标控制初始化完成');
}

/**
 * 初始化按钮效果
 */
function initButtonEffects() {
  const buttons = document.querySelectorAll('.pxl-button');

  buttons.forEach(button => {
    // 添加点击波纹效果
    button.addEventListener('click', function (e) {
      createRippleEffect(e, this);
    });

    // 添加悬停效果
    button.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-2px) scale(1.05)';
    });

    button.addEventListener('mouseleave', function () {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });

  console.log('按钮效果初始化完成');
}

/**
 * 创建波纹效果
 */
function createRippleEffect(event, element) {
  const ripple = document.createElement('span');
  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = x + 'px';
  ripple.style.top = y + 'px';
  ripple.classList.add('ripple');

  element.appendChild(ripple);

  setTimeout(() => {
    ripple.remove();
  }, 600);
}

/**
 * 添加幻灯片编号
 */
function addSlideNumbers() {
  const slides = document.querySelectorAll('.swiper-slide');
  slides.forEach((slide, index) => {
    const slideNumber = document.createElement('div');
    slideNumber.className = 'slide-number';
    slideNumber.textContent = `${index + 1} / ${slides.length}`;
    slide.appendChild(slideNumber);
  });
}

/**
 * 更新幻灯片计数器
 */
function updateSlideCounter() {
  const slideNumbers = document.querySelectorAll('.slide-number');
  slideNumbers.forEach((number, index) => {
    if (window.agronSwiper) {
      const currentIndex = window.agronSwiper.realIndex + 1;
      const totalSlides = window.agronSwiper.slides.length;
      number.textContent = `${currentIndex} / ${totalSlides}`;
    }
  });
}

/**
 * 触发幻灯片动画
 */
function triggerSlideAnimations() {
  const currentSlide = document.querySelector('.swiper-slide-active');
  if (!currentSlide) return;

  // 为所有幻灯片应用背景缩放动画
  const allSlides = document.querySelectorAll('.swiper-slide');
  allSlides.forEach(slide => {
    const background = slide.querySelector('.slide-background');
    if (background) {
      // 重置动画
      background.style.animation = 'none';
      background.offsetHeight; // 触发重排

      // 根据不同的幻灯片设置不同的动画时长
      let animationDuration = '6s';
      if (slide.classList.contains('elementor-repeater-item-b153571')) {
        animationDuration = '6s';
      } else if (slide.classList.contains('elementor-repeater-item-f61da63')) {
        animationDuration = '5s';
      } else if (slide.classList.contains('elementor-repeater-item-86cc5c8')) {
        animationDuration = '7s';
      }

      // 为每个幻灯片都应用缩放动画
      setTimeout(() => {
        background.style.animation = `enhancedBackgroundZoomOut ${animationDuration} ease-out forwards`;
      }, 100);
    }
  });

  // 触发文字动画
  const animatedElements = currentSlide.querySelectorAll('.wow');
  animatedElements.forEach((element, index) => {
    setTimeout(() => {
      element.style.animation = 'none';
      element.offsetHeight; // 触发重排
      element.style.animation = null;
    }, index * 200);
  });
}

/**
 * 切换自动播放
 */
function toggleAutoplay() {
  if (!window.agronSwiper) return;

  if (window.agronSwiper.autoplay.running) {
    window.agronSwiper.autoplay.stop();
    console.log('自动播放已暂停');
  } else {
    window.agronSwiper.autoplay.start();
    console.log('自动播放已开始');
  }
}

/**
 * 暂停自动播放
 */
function pauseAutoplay() {
  if (window.agronSwiper && window.agronSwiper.autoplay.running) {
    window.agronSwiper.autoplay.stop();
    console.log('自动播放已暂停');
  }
}

/**
 * 跳转到指定幻灯片
 */
function goToSlide(index) {
  if (window.agronSwiper) {
    window.agronSwiper.slideTo(index);
    console.log('跳转到第', index + 1, '张幻灯片');
  }
}

/**
 * 获取当前幻灯片索引
 */
function getCurrentSlideIndex() {
  return window.agronSwiper ? window.agronSwiper.realIndex : 0;
}

/**
 * 获取总幻灯片数量
 */
function getTotalSlides() {
  return window.agronSwiper ? window.agronSwiper.slides.length : 0;
}

/**
 * 备用轮播图实现（当Swiper库不可用时）
 */
function initFallbackSlider() {
  // 静默使用备用轮播图实现

  const slides = document.querySelectorAll('.swiper-slide');
  const prevBtn = document.querySelector('.swiper-button-prev');
  const nextBtn = document.querySelector('.swiper-button-next');

  if (slides.length === 0) {
    // 静默处理，不输出错误
    return;
  }

  let currentSlide = 0;
  let autoplayInterval;

  // 显示当前幻灯片
  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.style.display = i === index ? 'flex' : 'none';
      slide.style.opacity = i === index ? '1' : '0';
    });
  }

  // 下一张
  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
    triggerSlideAnimations();
  }

  // 上一张
  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
    triggerSlideAnimations();
  }

  // 自动播放 - 加快速度
  function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, 3000); // 3秒轮播间隔
  }

  function stopAutoplay() {
    clearInterval(autoplayInterval);
  }

  // 绑定事件
  if (nextBtn) {
    nextBtn.addEventListener('click', nextSlide);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', prevSlide);
  }

  // 移除鼠标悬停暂停逻辑，保持持续自动播放

  // 键盘控制
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === ' ') {
      e.preventDefault();
      if (autoplayInterval) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    }
  });

  // 初始化
  showSlide(0);
  startAutoplay();
  addSlideNumbers();

  // 静默初始化完成

  // 导出控制函数
  window.AgronSlider = {
    goToSlide: (index) => {
      currentSlide = index;
      showSlide(currentSlide);
    },
    getCurrentSlideIndex: () => currentSlide,
    getTotalSlides: () => slides.length,
    toggleAutoplay: () => {
      if (autoplayInterval) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    },
    pauseAutoplay: stopAutoplay
  };
}

// 导出函数供外部使用
window.AgronSlider = {
  goToSlide,
  getCurrentSlideIndex,
  getTotalSlides,
  toggleAutoplay,
  pauseAutoplay
};

// 添加CSS样式到页面
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255,255,255,0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .pxl-button {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(style);

/**
 * 初始化分隔符位置 - 动态计算导航栏高度
 * 分隔符元素已移除，此函数不再需要
 */
function initializeSeparatorPosition() {
  // 分隔符元素已移除，不再需要调整位置
  return;
}

/**
 * 初始化视频播放功能
 */
function initializeVideoPlayer() {
  // 延迟执行，确保DOM完全加载和Swiper初始化完成
  setTimeout(() => {
    // 获取所有"观看演示"按钮
    const watchDemoButtons = document.querySelectorAll('.watch-demo-btn');

    console.log('找到观看演示按钮数量:', watchDemoButtons.length);

    // 为每个按钮添加点击事件（使用捕获阶段，确保优先执行）
    watchDemoButtons.forEach((button, index) => {
      console.log(`为按钮 ${index + 1} 添加点击事件`);

      // 添加新的事件监听器（在捕获阶段执行，优先级最高）
      button.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation(); // 阻止事件冒泡到轮播图
        e.stopImmediatePropagation(); // 阻止同一元素上的其他监听器
        console.log('观看演示按钮被点击，阻止轮播图切换');
        openVideoPlayer();
        return false; // 额外保险
      }, true); // true表示在捕获阶段执行
    });

    // 如果没找到按钮，使用事件委托（也在捕获阶段）
    if (watchDemoButtons.length === 0) {
      console.log('未找到按钮，使用事件委托');
      document.addEventListener('click', function (e) {
        const button = e.target.closest('.watch-demo-btn');
        if (button) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          console.log('通过事件委托捕获到点击');
          openVideoPlayer();
          return false;
        }
      }, true); // 捕获阶段
    }
  }, 1000); // 延迟1秒，确保Swiper完全初始化
}

/**
 * 打开视频播放器
 */
function openVideoPlayer() {
  console.log('openVideoPlayer 被调用');

  // 检查是否已存在视频模态框
  let videoModal = document.getElementById('video-modal');

  if (!videoModal) {
    console.log('创建新的视频模态框');
    // 创建视频模态框 - 使用内联样式确保显示
    videoModal = document.createElement('div');
    videoModal.id = 'video-modal';
    videoModal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.85); display: flex; align-items: center; justify-content: center; z-index: 99999;';

    // 创建视频容器
    const videoContainer = document.createElement('div');
    videoContainer.style.cssText = 'position: relative; width: 90%; max-width: 1200px; margin: 0 auto;';

    // 创建关闭按钮
    const closeBtn = document.createElement('button');
    closeBtn.style.cssText = 'position: absolute; top: -40px; right: 0; background: transparent; border: none; color: white; font-size: 36px; cursor: pointer; z-index: 100000; padding: 10px; line-height: 1;';
    closeBtn.innerHTML = '&times;';
    closeBtn.setAttribute('aria-label', '关闭');
    closeBtn.addEventListener('click', closeVideoPlayer);
    closeBtn.onmouseover = function () { this.style.color = '#ccc'; };
    closeBtn.onmouseout = function () { this.style.color = 'white'; };

    // 创建视频元素
    const video = document.createElement('video');
    video.id = 'demo-video';
    video.style.cssText = 'width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.5); background: #000;';
    video.src = 'video.mp4';
    video.controls = true;
    video.playsInline = true;
    video.preload = 'auto';

    // 视频加载错误处理
    video.addEventListener('error', function (e) {
      console.error('视频加载错误:', e, video.error);
      const errorMsg = document.createElement('div');
      errorMsg.style.cssText = 'color: white; text-align: center; padding: 20px; background: rgba(255,0,0,0.3); border-radius: 8px; margin-top: 20px;';
      errorMsg.innerHTML = '<p>视频加载失败，请检查 vedio.mp4 文件是否存在</p><p style="font-size: 12px; margin-top: 10px;">错误代码: ' + (video.error ? video.error.code : '未知') + '</p>';
      videoContainer.appendChild(errorMsg);
    });

    // 视频加载成功
    video.addEventListener('loadeddata', function () {
      console.log('视频加载成功');
    });

    // 组装结构
    videoContainer.appendChild(closeBtn);
    videoContainer.appendChild(video);
    videoModal.appendChild(videoContainer);

    // 点击背景关闭
    videoModal.addEventListener('click', function (e) {
      if (e.target === videoModal) {
        closeVideoPlayer();
      }
    });

    // 添加到页面
    document.body.appendChild(videoModal);
    console.log('视频模态框已添加到页面');
  }

  // 显示模态框
  videoModal.style.display = 'flex';
  document.body.style.overflow = 'hidden'; // 防止背景滚动
  console.log('视频模态框已显示');

  // 获取视频元素并播放
  const video = document.getElementById('demo-video');
  if (video) {
    video.currentTime = 0; // 重置到开头

    // 全屏函数（处理不同浏览器的API差异）
    function requestFullscreen(element) {
      if (element.requestFullscreen) {
        return element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        return element.webkitRequestFullscreen();
      } else if (element.webkitRequestFullScreen) {
        return element.webkitRequestFullScreen();
      } else if (element.mozRequestFullScreen) {
        return element.mozRequestFullScreen();
      } else if (element.msRequestFullscreen) {
        return element.msRequestFullscreen();
      }
      return Promise.reject(new Error('全屏API不支持'));
    }

    // 直接请求全屏，不自动播放
    function tryFullscreen() {
      // 等待视频元素加载完成后请求全屏
      if (video.readyState >= 2) {
        // 视频已加载足够数据
        requestFullscreen(video).then(() => {
          console.log('视频已进入全屏模式');
        }).catch(fullscreenErr => {
          console.log('全屏请求失败（可能需要用户手动点击）:', fullscreenErr);
        });
      } else {
        // 等待视频加载
        video.addEventListener('loadeddata', function () {
          requestFullscreen(video).then(() => {
            console.log('视频已进入全屏模式');
          }).catch(fullscreenErr => {
            console.log('全屏请求失败（可能需要用户手动点击）:', fullscreenErr);
          });
        }, { once: true });
      }
    }

    // 直接请求全屏
    tryFullscreen();
  } else {
    console.error('未找到视频元素');
  }
}

/**
 * 关闭视频播放器
 */
function closeVideoPlayer() {
  // 退出全屏（如果正在全屏）
  function exitFullscreen() {
    if (document.exitFullscreen) {
      return document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      return document.webkitExitFullscreen();
    } else if (document.webkitCancelFullScreen) {
      return document.webkitCancelFullScreen();
    } else if (document.mozCancelFullScreen) {
      return document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      return document.msExitFullscreen();
    }
    return Promise.resolve();
  }

  // 先退出全屏
  exitFullscreen().then(() => {
    console.log('已退出全屏');
  }).catch(err => {
    console.log('退出全屏失败（可能未在全屏状态）:', err);
  });

  const videoModal = document.getElementById('video-modal');
  if (videoModal) {
    videoModal.style.display = 'none';
    document.body.style.overflow = ''; // 恢复滚动

    // 暂停视频
    const video = document.getElementById('demo-video');
    if (video) {
      video.pause();
      video.currentTime = 0; // 重置到开头
    }
  }
}

// ESC键关闭视频
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    closeVideoPlayer();
  }
});
