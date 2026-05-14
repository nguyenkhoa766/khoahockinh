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
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), i * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.pain-card, .curriculum-card, .objection-item').forEach(el => observer.observe(el));
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

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
    initCountdown();
    initScrollAnimations();
    initStickyCTA();
    initForm();
});
