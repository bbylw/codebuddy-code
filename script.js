// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function () {
    // 初始化所有功能
    initNavigation();
    initScrollAnimations();
    initTerminalAnimation();
    initCopyButtons();
    initSmoothScrolling();
    initParallaxEffects();
    initTypingAnimation();
});

// 导航栏功能
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');

    // 汉堡菜单切换
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // 点击导航链接关闭菜单
        navLinks.forEach(link => {
            link.addEventListener('click', function () {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // 滚动时导航栏样式变化
    window.addEventListener('scroll', function () {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(0, 91, 187, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 91, 187, 0.3)';
        } else {
            navbar.style.background = 'var(--ukraine-blue)';
            navbar.style.boxShadow = 'none';
        }
    });

    // 高亮当前导航项
    updateActiveNavItem();
    window.addEventListener('scroll', updateActiveNavItem);
}

// 更新活动导航项
function updateActiveNavItem() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
}

// 滚动动画
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
            }
        });
    }, observerOptions);

    // 观察需要动画的元素
    const animateElements = document.querySelectorAll('.feature-card, .scenario-card, .privacy-card, .step');
    animateElements.forEach(el => observer.observe(el));
}

// 终端动画
function initTerminalAnimation() {
    const terminalLines = document.querySelectorAll('.terminal-line');

    // 逐行显示终端内容
    terminalLines.forEach((line, index) => {
        line.style.opacity = '0';
        line.style.transform = 'translateY(10px)';

        setTimeout(() => {
            line.style.transition = 'all 0.5s ease';
            line.style.opacity = '1';
            line.style.transform = 'translateY(0)';
        }, index * 800);
    });
}

// 复制按钮功能
function initCopyButtons() {
    const copyButtons = document.querySelectorAll('.copy-btn');

    copyButtons.forEach(button => {
        button.addEventListener('click', function () {
            const codeBlock = this.parentElement.querySelector('pre code');
            const text = codeBlock.textContent;

            navigator.clipboard.writeText(text).then(() => {
                // 显示复制成功反馈
                const originalIcon = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i>';
                this.style.background = '#10b981';

                setTimeout(() => {
                    this.innerHTML = originalIcon;
                    this.style.background = '';
                }, 2000);
            }).catch(err => {
                console.error('复制失败:', err);
                // 回退方案
                fallbackCopyTextToClipboard(text, this);
            });
        });
    });
}

// 复制文本回退方案
function fallbackCopyTextToClipboard(text, button) {
    const textArea = document.createElement("textarea");
    textArea.value = text;

    // 避免滚动到底部
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        const successful = document.execCommand('copy');
        if (successful) {
            const originalIcon = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i>';
            button.style.background = '#10b981';

            setTimeout(() => {
                button.innerHTML = originalIcon;
                button.style.background = '';
            }, 2000);
        }
    } catch (err) {
        console.error('复制失败:', err);
    }

    document.body.removeChild(textArea);
}

// 平滑滚动
function initSmoothScrolling() {
    // 处理锚点链接
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 滚动到指定区域的全局函数
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = element.offsetTop - navbarHeight - 20;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// 视差效果
function initParallaxEffects() {
    window.addEventListener('scroll', function () {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-background');

        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// 打字机动画
function initTypingAnimation() {
    const typingElement = document.querySelector('.typing');
    if (!typingElement) return;

    const text = typingElement.textContent;
    typingElement.textContent = '';

    let i = 0;
    function typeWriter() {
        if (i < text.length) {
            typingElement.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }

    // 延迟开始打字动画
    setTimeout(typeWriter, 2000);
}

// 工具函数：节流
function throttle(func, wait) {
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

// 工具函数：防抖
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// 性能优化：使用节流的滚动监听
const throttledScrollHandler = throttle(function () {
    updateActiveNavItem();
}, 100);

// 页面加载完成后添加滚动监听
window.addEventListener('scroll', throttledScrollHandler);

// 响应式功能
function handleResize() {
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');

    if (window.innerWidth > 768) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
}

// 监听窗口大小变化
window.addEventListener('resize', debounce(handleResize, 250));

// 统计数字动画
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalNumber = target.textContent;
                animateNumber(target, finalNumber);
                observer.unobserve(target);
            }
        });
    });

    stats.forEach(stat => observer.observe(stat));
}

function animateNumber(element, finalNumber) {
    const isPercentage = finalNumber.includes('%');
    const isKPlus = finalNumber.includes('k+');
    const isPlusOnly = finalNumber.includes('+') && !isKPlus;

    let targetValue = parseFloat(finalNumber.replace(/[^\d.]/g, ''));

    if (isKPlus) targetValue *= 1000;

    let currentValue = 0;
    const increment = targetValue / 60; // 60帧动画

    function updateNumber() {
        currentValue += increment;

        if (currentValue >= targetValue) {
            currentValue = targetValue;
        }

        let displayValue = Math.floor(currentValue);

        if (isKPlus) {
            displayValue = Math.floor(currentValue / 1000) + 'k+';
        } else if (isPercentage) {
            displayValue = displayValue + '%';
        } else if (isPlusOnly) {
            displayValue = displayValue + '+';
        }

        element.textContent = displayValue;

        if (currentValue < targetValue) {
            requestAnimationFrame(updateNumber);
        }
    }

    updateNumber();
}

// 初始化统计动画
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(animateStats, 1000);
});

// 添加返回顶部按钮
function createBackToTopButton() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--ukraine-blue), var(--ukraine-yellow));
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(0, 91, 187, 0.3);
    `;

    document.body.appendChild(backToTopBtn);

    // 显示/隐藏按钮
    window.addEventListener('scroll', function () {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.visibility = 'visible';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.visibility = 'hidden';
        }
    });

    // 点击返回顶部
    backToTopBtn.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 悬停效果
    backToTopBtn.addEventListener('mouseenter', function () {
        this.style.transform = 'scale(1.1)';
    });

    backToTopBtn.addEventListener('mouseleave', function () {
        this.style.transform = 'scale(1)';
    });
}

// 创建返回顶部按钮
document.addEventListener('DOMContentLoaded', createBackToTopButton);

// 预加载关键资源
function preloadResources() {
    const preloadLinks = [
        'codebuddy-cat.png',
        'favicon.ico'
    ];

    preloadLinks.forEach(url => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = url;
        document.head.appendChild(link);
    });
}

// 页面加载优化
document.addEventListener('DOMContentLoaded', preloadResources);

// 错误处理
window.addEventListener('error', function (e) {
    console.error('页面错误:', e.error);
});

// 添加加载指示器
function showLoadingIndicator() {
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = `
        <div class="loading-spinner"></div>
        <div class="loading-text">正在加载 CodeBuddy Code...</div>
    `;
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, var(--ukraine-blue), var(--ukraine-yellow));
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        color: white;
        font-family: var(--font-primary);
    `;

    const spinner = loader.querySelector('.loading-spinner');
    if (spinner) {
        spinner.style.cssText = `
            width: 50px;
            height: 50px;
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-top: 4px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
        `;
    }

    document.body.appendChild(loader);

    // 页面加载完成后移除加载指示器
    window.addEventListener('load', function () {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(loader);
            }, 300);
        }, 500);
    });
}

// 显示加载指示器
if (document.readyState === 'loading') {
    showLoadingIndicator();
}

// SEO优化：添加结构化数据
function addStructuredData() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "CodeBuddy Code",
        "description": "CodeBuddy Code 是一个智能编程助手，深度集成到您的开发环境中，精准理解您的项目结构，通过自然语言交互帮助您高效编程。",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Cross-platform",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "publisher": {
            "@type": "Organization",
            "name": "腾讯云",
            "url": "https://cloud.tencent.com/"
        }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
}

// 添加结构化数据
document.addEventListener('DOMContentLoaded', addStructuredData);