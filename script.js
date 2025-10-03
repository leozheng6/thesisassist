// ================== 价格弹窗控制 ==================
document.addEventListener("DOMContentLoaded", () => {
    // 确保使用 index.html 定义的 ID 和 Class
    const priceBtn = document.querySelector("#price-btn");
    const modal = document.querySelector("#priceModal"); 
    const closeBtn = document.querySelector(".modal-close"); 

    if (priceBtn && modal && closeBtn) {
        // 打开弹窗
        priceBtn.addEventListener("click", (e) => {
            e.preventDefault();
            modal.style.display = "flex";
            modal.setAttribute("aria-hidden", "false"); 
        });

        // 关闭弹窗
        closeBtn.addEventListener("click", () => {
            modal.style.display = "none";
            modal.setAttribute("aria-hidden", "true"); 
        });

        // 点击外部关闭
        window.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.style.display = "none";
                modal.setAttribute("aria-hidden", "true"); 
            }
        });
    }
});

// ================== FAQ 折叠功能 ==================
document.addEventListener("DOMContentLoaded", () => {
    const faqItems = document.querySelectorAll(".faq-question");

    faqItems.forEach(item => {
        item.addEventListener("click", () => {
            const parent = item.parentElement;
            // 修正：确保在点击时正确切换 active 状态
            const isActive = parent.classList.toggle("active");

            const answer = parent.querySelector(".faq-answer");
            if (answer) {
                if (isActive) {
                    // 修正：展开时设置 max-height 和 overflow
                    answer.style.maxHeight = answer.scrollHeight + "px";
                    answer.style.overflow = "visible"; 
                } else {
                    // 修正：收起时清除 max-height 并隐藏溢出
                    answer.style.maxHeight = null;
                    answer.style.overflow = "hidden"; 
                }
            }
        });
    });
});

// ================== 价格计算逻辑 ==================
document.addEventListener("DOMContentLoaded", () => {
    const serviceSelect = document.querySelector("#modalService");
    const levelSelect = document.querySelector("#modalAcademic");
    const deadlineSelect = document.querySelector("#modalTime");
    const wordsSelect = document.querySelector("#modalWords");
    const priceBox = document.querySelector(".price-box"); 
    const modalCalcBtn = document.querySelector("#modalCalc");

    if (serviceSelect && levelSelect && deadlineSelect && wordsSelect && priceBox && modalCalcBtn) {

        function calculatePrice() {
            // 设定价格范围
            const MIN_PER_WORD_USD = 0.113; // 最低价格: $0.113/字
            const MAX_PER_WORD_USD = 0.213; // 最高价格: $0.213/字

            let pricePerWord = MIN_PER_WORD_USD;

            // 学历系数: 提升基础价格
            let levelFactor = {
                "highschool": 1.0,  // 高中 0%
                "bachelor": 1.15,   // 本科 +15%
                "master": 1.35,     // 研究生 +35%
                "phd": 1.6,         // 博士 +60%
            }[levelSelect.value] || 1.0;

            // 交付时间系数: 提升基础价格
            let timeFactor = 1.0;
            if (deadlineSelect.value === "12h") timeFactor = 1.6;    // 12小时 +60%
            else if (deadlineSelect.value === "1d") timeFactor = 1.4;// 1天 +40%
            else if (deadlineSelect.value === "2d") timeFactor = 1.25;// 2天 +25%
            else if (deadlineSelect.value === "3d") timeFactor = 1.15;// 3天 +15%
            // 5d/7d/10d 保持 1.0

            // 服务类型系数: 价格为写作的 2/3 (0.667)
            let serviceFactor = {
                "writing": 1.0,
                "editing": 0.667,   // 润色
                "polish": 0.667,    // 精修
                "rewrite": 0.667    // 重写
            }[serviceSelect.value] || 1.0;
            
            // 字数
            let words = parseInt(wordsSelect.value) || 500;

            // 基础字价 = MIN_PER_WORD_USD * levelFactor * timeFactor
            let basePrice = pricePerWord * levelFactor * timeFactor;
            
            // 确保字价不超过 MAX_PER_WORD_USD
            if (basePrice > MAX_PER_WORD_USD) {
                basePrice = MAX_PER_WORD_USD;
            }

            // 计算最终价格
            let finalPrice = basePrice * words * serviceFactor;

            // 首单优惠 30% off (七折)
            let discountedPrice = finalPrice * 0.7;
            
            // 更新价格展示
            priceBox.innerHTML = `
                <p>估算原价: <s>$${finalPrice.toFixed(2)}</s></p>
                <p><strong><span style="font-size:18px; color:#0b78d1;">首单七折优惠价</span>: $${discountedPrice.toFixed(2)}</strong></p>
                <span class="discount" style="font-weight: normal; font-size: 13px; color: #10b981;">(每字约 $${(discountedPrice / words).toFixed(3)} USD)</span>
            `;
        }

        // 绑定事件
        serviceSelect.addEventListener("change", calculatePrice);
        levelSelect.addEventListener("change", calculatePrice);
        deadlineSelect.addEventListener("change", calculatePrice);
        wordsSelect.addEventListener("change", calculatePrice);
        modalCalcBtn.addEventListener("click", calculatePrice); 

        calculatePrice(); // 页面加载时初始化
    }
});


// ================== 计数滚动效果 ==================
document.addEventListener("DOMContentLoaded", () => {
    // 定义要计数的元素及其目标值
    const stats = [
        { id: 'stat-clients', target: 4389 },
        { id: 'stat-orders', target: 19893 },
        { id: 'stat-rating', target: 98, isPercentage: true },
        { id: 'stat-passrate', target: 100, isPercentage: true },
        { id: 'stat-tutors', target: 500, suffix: '+' }
    ];

    const duration = 2000; 
    const counterSection = document.querySelector('.stats-counter');
    let hasAnimated = false;

    function animateCount(element, target, isPercentage = false, suffix = '') {
        const start = 0;
        let startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            
            let currentValue = Math.floor(percentage * target);

            // 特殊处理百分比和后缀
            let displayValue = currentValue.toString();
            if (isPercentage) {
                displayValue += '%';
            }
            if (suffix && percentage === 1) { // 只有达到终点才显示后缀
                displayValue = target.toString() + suffix; 
            } else if (suffix && percentage < 1) {
                // 如果是 500+，在滚动过程中显示数字
                displayValue = currentValue.toString();
            }

            element.textContent = displayValue;

            if (progress < duration) {
                window.requestAnimationFrame(step);
            } else {
                // 确保最终值是准确的目标值
                element.textContent = target.toString() + (isPercentage ? '%' : '') + (suffix && !isPercentage ? suffix : '');
            }
        }

        window.requestAnimationFrame(step);
    }

    // 交叉观察器 API 用于检测元素何时进入视口
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                stats.forEach(stat => {
                    const element = document.getElementById(stat.id);
                    if (element) {
                        animateCount(element, stat.target, stat.isPercentage, stat.suffix);
                    }
                });
                hasAnimated = true;
                observer.unobserve(counterSection); 
            }
        });
    }, {
        threshold: 0.5 
    });

    if (counterSection) {
        observer.observe(counterSection);
    }
});