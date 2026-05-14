/* ===== COUNTDOWN TIMER ===== */
function initCountdown() {
    // Set deadline to 3 days from now (adjustable)
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 3);
    deadline.setHours(22, 0, 0, 0);

    function update() {
        const now = new Date();
        const diff = deadline - now;
        if (diff <= 0) {
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        document.getElementById('days').textContent = String(d).padStart(2, '0');
        document.getElementById('hours').textContent = String(h).padStart(2, '0');
        document.getElementById('minutes').textContent = String(m).padStart(2, '0');
        document.getElementById('seconds').textContent = String(s).padStart(2, '0');
    }
    update();
    setInterval(update, 1000);
}

/* ===== SCROLL ANIMATIONS ===== */
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-up-element').forEach(el => observer.observe(el));
}

/* ===== STICKY CTA ===== */
function initStickyCTA() {
    const sticky = document.getElementById('sticky-cta');
    const hero = document.getElementById('hero');
    if (!sticky || !hero) return;
    
    window.addEventListener('scroll', () => {
        if (window.innerWidth > 768) return;
        sticky.style.display = window.scrollY > hero.offsetHeight ? 'block' : 'none';
    });
}

/* ===== SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 20;
            window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
        }
    });
});

/* ===== 1. CURSOR SPOTLIGHT ===== */
function initCursorSpotlight() {
    const spotlight = document.getElementById('cursor-spotlight');
    if (!spotlight) return;

    let mouseX = 0, mouseY = 0;
    let spotX = 0, spotY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth follow with requestAnimationFrame
    function animate() {
        spotX += (mouseX - spotX) * 0.08;
        spotY += (mouseY - spotY) * 0.08;
        spotlight.style.left = spotX + 'px';
        spotlight.style.top = spotY + 'px';
        requestAnimationFrame(animate);
    }
    animate();
}

/* ===== 2. ANIMATED COUNTERS ===== */
function initAnimatedCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
}

function animateCounter(el) {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const format = el.dataset.format || '';
    const duration = 2000; // ms
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);

        if (format === 'price') {
            el.textContent = current.toLocaleString('vi-VN') + suffix;
        } else {
            el.textContent = current + suffix;
        }

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    requestAnimationFrame(update);
}

/* ===== 3. 3D CARD TILT ===== */
function initCardTilt() {
    const cards = document.querySelectorAll('.tilt-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -8; // max 8deg
            const rotateY = ((x - centerX) / centerX) * 8;

            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
            card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        });

        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.15s ease-out';
        });
    });
}

/* ===== 4. SCROLL PROGRESS BAR ===== */
function initScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        bar.style.width = progress + '%';
    }, { passive: true });
}

/* ===== FORM SUBMISSION TO GOOGLE SHEETS ===== */
function initForm() {
    const form = document.getElementById('register-form');
    const btn = document.getElementById('submit-btn');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const data = {
            fullname: document.getElementById('fullname').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            timestamp: new Date().toLocaleString('vi-VN')
        };

        if (!data.fullname || !data.email || !data.phone) {
            alert('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        btn.textContent = 'ĐANG XỬ LÝ...';
        btn.disabled = true;

        try {
            // ========================================
            // HƯỚNG DẪN KẾT NỐI GOOGLE SHEETS:
            // 1. Tạo Google Sheet mới
            // 2. Vào Extensions > Apps Script
            // 3. Dán đoạn code bên dưới vào Apps Script:
            //
            //   function doPost(e) {
            //     var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
            //     var data = JSON.parse(e.postData.contents);
            //     sheet.appendRow([data.timestamp, data.fullname, data.email, data.phone]);
            //     return ContentService.createTextOutput(JSON.stringify({status: 'ok'}))
            //       .setMimeType(ContentService.MimeType.JSON);
            //   }
            //
            // 4. Deploy > New deployment > Web app > Anyone
            // 5. Copy URL và dán vào biến GOOGLE_SCRIPT_URL bên dưới
            // ========================================
            
            const GOOGLE_SCRIPT_URL = ''; // <-- DÁN URL APPS SCRIPT TẠI ĐÂY

            if (GOOGLE_SCRIPT_URL) {
                await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            } else {
                console.log('Form data (chưa kết nối Google Sheets):', data);
            }

            // Show success
            form.innerHTML = `
                <div style="text-align:center;padding:40px 20px;">
                    <div style="font-size:64px;margin-bottom:16px;">🎉</div>
                    <h3 style="font-size:22px;font-weight:800;margin-bottom:12px;color:#22c55e;">ĐĂNG KÝ THÀNH CÔNG!</h3>
                    <p style="font-size:15px;color:rgba(255,255,255,0.7);">Cảm ơn <strong>${data.fullname}</strong>!<br>Vui lòng tham gia nhóm Zalo bên dưới để nhận thông tin chi tiết.</p>
                    <a href="https://zalo.me/g/cahxss4sbh6ysjv7lggv" target="_blank" style="display:inline-block;margin-top:20px;padding:12px 24px;background:#0068ff;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;">THAM GIA NHÓM ZALO</a>
                </div>
            `;
        } catch (err) {
            btn.textContent = 'HOÀN TẤT ĐĂNG KÝ';
            btn.disabled = false;
            alert('Có lỗi xảy ra. Vui lòng thử lại hoặc liên hệ 0947 421 789');
        }
    });
}

/* ===== INIT ALL ===== */
document.addEventListener('DOMContentLoaded', () => {
    initCountdown();
    initScrollAnimations();
    initStickyCTA();
    initForm();

    // Premium effects
    initCursorSpotlight();
    initAnimatedCounters();
    initCardTilt();
    initScrollProgress();
});
