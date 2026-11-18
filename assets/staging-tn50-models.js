/**
 * VẬT LÝ XUÂN TRƯỜNG — THƯ VIỆN 27 MÔ HÌNH CANVAS 2D CHO 50 CÂU TRẮC NGHIỆM MỚI (CHƯƠNG 2 & 3)
 * Quy chuẩn VLXT_MOTION_SPEC:
 * - Tỉ lệ logic chuẩn 780 x 305 (Retina 2x HiDPI tự động bởi Studio).
 * - Phong cách EdTech phẳng sắc nét (tuyệt đối CẤM hiệu ứng phát sáng mờ ảo kiểu AI Glow).
 * - Mỗi hàm tự chứa hoàn toàn helper (Self-Contained) để chạy Hot-Reload 100% trong Code Editor.
 * - Zero Data Leakage: không lộ đáp án, không đánh dấu hình đúng/sai trên mô hình đối chứng.
 */
(function (global) {
    'use strict';

    if (!global.VLXTModels || typeof global.VLXTModels.register !== 'function') {
        console.error('[VLXT staging-tn50-models] Thiếu window.VLXTModels Registry!');
        return;
    }

    var M = global.VLXTModels;

    // ==================== 1. MH-TN50-C2-251 ====================
    M.register('MH-TN50-C2-251', function (ctx, w, h, t) {
        function clearBg() {
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);
        }
        function roundRect(x, y, rw, rh, r) {
            ctx.beginPath();
            ctx.roundRect(x, y, rw, rh, r);
        }
        function arrow(x1, y1, x2, y2, color, lw) {
            const ang = Math.atan2(y2 - y1, x2 - x1);
            ctx.save();
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.lineWidth = lw || 2;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(x2 - 9 * Math.cos(ang - 0.36), y2 - 9 * Math.sin(ang - 0.36));
            ctx.lineTo(x2 - 9 * Math.cos(ang + 0.36), y2 - 9 * Math.sin(ang + 0.36));
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }

        clearBg();
        const saw = (t * 0.18) % 1;
        const u = saw < 0.85 ? saw / 0.85 : 1;

        // Header
        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 14px "Be Vietnam Pro", "Inter", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('THÍ NGHIỆM ĐỊNH LUẬT BOYLE & ĐỒ THỊ KHẢO SÁT (T = const)', 18, 26);

        // Khung trái: Bộ thí nghiệm nén khí đẳng nhiệt
        roundRect(18, 40, 355, 250, 12);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        ctx.fillStyle = '#94a3b8';
        ctx.font = '700 13px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Bộ xilanh - pít-tông nén khí từ từ (T = const)', 195, 62);

        const cylX = 48, cylY = 128, cylW = 240, cylH = 88;
        const pistX = cylX + cylW - 22 - u * 138;

        // Buồng khí
        ctx.fillStyle = 'rgba(56, 189, 248, 0.14)';
        ctx.fillRect(cylX + 3, cylY + 3, pistX - cylX - 3, cylH - 6);

        // Phân tử khí chuyển động
        const molCount = 20;
        const gasW = Math.max(28, pistX - cylX - 10);
        ctx.fillStyle = '#7dd3fc';
        for (let i = 0; i < molCount; i++) {
            const sx = (Math.sin(i * 12.7 + t * 4.2) * 0.5 + 0.5);
            const sy = (Math.cos(i * 7.3 + t * 3.9) * 0.5 + 0.5);
            const mx = cylX + 8 + sx * (gasW - 8);
            const my = cylY + 10 + sy * (cylH - 20);
            ctx.beginPath();
            ctx.arc(mx, my, 2.7, 0, Math.PI * 2);
            ctx.fill();
        }

        // Thành xilanh
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cylX + cylW + 25, cylY);
        ctx.lineTo(cylX, cylY);
        ctx.lineTo(cylX, cylY + cylH);
        ctx.lineTo(cylX + cylW + 25, cylY + cylH);
        ctx.stroke();

        // Pít-tông & thanh đẩy
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(pistX, cylY + 2, 16, cylH - 4);
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(pistX, cylY + 2, 16, cylH - 4);
        ctx.fillStyle = '#64748b';
        ctx.fillRect(pistX + 16, cylY + cylH / 2 - 5, cylX + cylW + 46 - pistX, 10);
        arrow(pistX + 68, cylY + cylH / 2 - 22, pistX + 32, cylY + cylH / 2 - 22, '#f59e0b', 2.4);
        ctx.fillStyle = '#fbbf24';
        ctx.font = '700 12.5px "Be Vietnam Pro", sans-serif';
        ctx.fillText('Nén chậm', pistX + 52, cylY + cylH / 2 - 30);

        // Nhãn đáy trái (giữ trung tính, không lộ trục)
        roundRect(42, 236, 306, 36, 8);
        ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '700 13px "Be Vietnam Pro", sans-serif';
        ctx.fillText('Khí lí tưởng xác định — giữ T không đổi', 195, 259);

        // Khung phải: Biểu đồ đề bài (y - x, tuyệt đối KHÔNG ghi p hay 1/V)
        roundRect(390, 40, 372, 250, 12);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        ctx.fillStyle = '#94a3b8';
        ctx.font = '700 13px "Be Vietnam Pro", sans-serif';
        ctx.fillText('Biểu đồ kết quả đo thực nghiệm (Oxy)', 576, 62);

        const ox = 445, oy = 244, axW = 266, axH = 166;
        arrow(ox, oy, ox, oy - axH, '#e2e8f0', 2.4);
        arrow(ox, oy, ox + axW, oy, '#e2e8f0', 2.4);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 16px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('y', ox - 12, oy - axH + 14);
        ctx.fillText('O', ox - 10, oy + 16);
        ctx.textAlign = 'left';
        ctx.fillText('x', ox + axW + 8, oy + 5);

        // 5 điểm đo thực nghiệm dấu X đúng như hình gốc + chấm chạy đồng bộ theo quá trình nén
        const pts = [
            { x: 0.19, y: 0.22 },
            { x: 0.36, y: 0.34 },
            { x: 0.51, y: 0.55 },
            { x: 0.69, y: 0.69 },
            { x: 0.87, y: 0.89 }
        ];

        // Đường kéo dài đứt nét đi qua gốc O
        ctx.save();
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.55)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(ox + 0.15 * axW, oy - 0.15 * axH);
        ctx.stroke();
        ctx.restore();

        // Đường thẳng fit nét liền qua các điểm đo
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(ox + 0.15 * axW, oy - 0.15 * axH);
        ctx.lineTo(ox + 0.92 * axW, oy - 0.92 * axH);
        ctx.stroke();

        pts.forEach(pt => {
            const px = ox + pt.x * axW;
            const py = oy - pt.y * axH;
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 2.4;
            ctx.beginPath();
            ctx.moveTo(px - 6, py - 6);
            ctx.lineTo(px + 6, py + 6);
            ctx.moveTo(px + 6, py - 6);
            ctx.lineTo(px - 6, py + 6);
            ctx.stroke();
        });

        // Chấm trạng thái đồng bộ quá trình nén pít-tông
        const dotFrac = 0.19 + u * 0.68;
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(ox + dotFrac * axW, oy - dotFrac * axH, 5.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.8;
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.font = '700 13px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Các điểm đo thực nghiệm (×)', 576, 276);
    });

    // ==================== 2. MH-TN50-C2-258 ====================
    M.register('MH-TN50-C2-258', function (ctx, w, h, t) {
        function clearBg() {
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);
        }
        function roundRect(x, y, rw, rh, r) {
            ctx.beginPath();
            ctx.roundRect(x, y, rw, rh, r);
        }
        function arrow(x1, y1, x2, y2, color, lw) {
            const ang = Math.atan2(y2 - y1, x2 - x1);
            ctx.save();
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.lineWidth = lw || 2;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(x2 - 9 * Math.cos(ang - 0.36), y2 - 9 * Math.sin(ang - 0.36));
            ctx.lineTo(x2 - 9 * Math.cos(ang + 0.36), y2 - 9 * Math.sin(ang + 0.36));
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }

        clearBg();
        const saw = (t * 0.16) % 1;
        const phase1 = saw < 0.45;
        const p1 = phase1 ? saw / 0.45 : 1;
        const p2 = phase1 ? 0 : Math.min(1, (saw - 0.45) / 0.43);

        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 14px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('MÔ PHỎNG XILANH — PÍT-TÔNG QUA 2 GIAI ĐOẠN (i → f)', 18, 26);

        // Khung lớn bên trái-giữa: Xilanh + Pít-tông + Chốt + Đá làm mát + Đồng hồ P & T
        roundRect(18, 40, 505, 250, 12);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        const cylX = 68, cylY = 108, cylW = 290, cylH = 98;
        const pistX = cylX + cylW - 44 - p2 * 135;

        // Vùng khí lí tưởng
        const coolAlpha = phase1 ? (0.14 + 0.08 * p1) : 0.18;
        ctx.fillStyle = phase1 ? 'rgba(56, 189, 248,' + coolAlpha + ')' : 'rgba(99, 102, 241, 0.2)';
        ctx.fillRect(cylX + 3, cylY + 3, pistX - cylX - 3, cylH - 6);

        // Phân tử khí: phase1 chậm dần, phase2 mật độ tăng ở nhiệt độ thấp không đổi
        const gasW = Math.max(40, pistX - cylX - 10);
        const speedMul = phase1 ? (3.5 - 1.8 * p1) : 1.7;
        ctx.fillStyle = phase1 ? '#7dd3fc' : '#a5b4fc';
        for (let i = 0; i < 24; i++) {
            const mx = cylX + 10 + ((Math.sin(i * 9.1 + t * speedMul) * 0.5 + 0.5) * (gasW - 14));
            const my = cylY + 12 + ((Math.cos(i * 5.7 + t * speedMul) * 0.5 + 0.5) * (cylH - 24));
            ctx.beginPath();
            ctx.arc(mx, my, 2.8, 0, Math.PI * 2);
            ctx.fill();
        }

        // Nhãn trong buồng khí giống hình gốc
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '700 14px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Khí lí tưởng', cylX + gasW / 2, cylY + cylH / 2 + 5);

        // Xilanh chữ C mở bên phải
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.moveTo(cylX + cylW + 30, cylY);
        ctx.lineTo(cylX, cylY);
        ctx.lineTo(cylX, cylY + cylH);
        ctx.lineTo(cylX + cylW + 30, cylY + cylH);
        ctx.stroke();

        ctx.fillStyle = '#94a3b8';
        ctx.font = '700 13.5px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('Xilanh', cylX - 8, cylY + cylH / 2 + 5);

        // Pít-tông gạch chéo giống hình gốc
        ctx.fillStyle = '#334155';
        ctx.fillRect(pistX, cylY + 2, 22, cylH - 4);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        for (let hy = cylY + 8; hy < cylY + cylH - 4; hy += 11) {
            ctx.moveTo(pistX + 2, hy);
            ctx.lineTo(pistX + 20, hy - 8);
        }
        ctx.stroke();
        ctx.strokeRect(pistX, cylY + 2, 22, cylH - 4);
        ctx.fillStyle = '#64748b';
        ctx.fillRect(pistX + 22, cylY + cylH / 2 - 6, cylX + cylW + 58 - pistX, 12);

        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 13.5px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('Pít-tông', pistX + 18, cylY - 12);

        // Chốt giữ cố định ở GĐ1 hoặc mũi tên đẩy vào ở GĐ2 (tách rời hẳn chữ Pít-tông)
        if (phase1) {
            ctx.fillStyle = '#f59e0b';
            ctx.fillRect(pistX + 26, cylY - 10, 7, 14);
            ctx.fillRect(pistX + 26, cylY + cylH - 4, 7, 14);
            ctx.fillStyle = '#fbbf24';
            ctx.font = '700 12.5px "Be Vietnam Pro", sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('Chốt giữ (V = const)', pistX + 42, cylY - 14);

            // Khay làm mát bên dưới xilanh
            roundRect(cylX + 24, cylY + cylH + 16, 175, 28, 7);
            ctx.fillStyle = 'rgba(14, 165, 233, 0.22)';
            ctx.fill();
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.fillStyle = '#7dd3fc';
            ctx.font = '700 12.5px "Be Vietnam Pro", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('❄ Làm mát khí từ từ', cylX + 111, cylY + cylH + 35);
        } else {
            arrow(pistX + 102, cylY + cylH / 2 - 22, pistX + 44, cylY + cylH / 2 - 22, '#10b981', 2.6);
            ctx.fillStyle = '#34d399';
            ctx.font = '700 13px "Be Vietnam Pro", sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('Đẩy vào từ từ (T = const)', pistX + 44, cylY - 14);
        }

        // Bảng trạng thái định tính bên phải (KHÔNG vẽ đồ thị p-V đáp án!)
        roundRect(538, 40, 224, 250, 12);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 13.5px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('DIỄN BIẾN THÍ NGHIỆM', 650, 66);

        // Thẻ GĐ1
        roundRect(552, 82, 196, 86, 8);
        ctx.fillStyle = phase1 ? 'rgba(56, 189, 248, 0.16)' : 'rgba(30, 41, 59, 0.65)';
        ctx.fill();
        ctx.strokeStyle = phase1 ? '#38bdf8' : 'rgba(148, 163, 184, 0.28)';
        ctx.lineWidth = phase1 ? 1.8 : 1;
        ctx.stroke();
        ctx.textAlign = 'left';
        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 13px "Be Vietnam Pro", sans-serif';
        ctx.fillText('GĐ 1: Từ trạng thái i', 564, 104);
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '600 12.5px "Be Vietnam Pro", sans-serif';
        ctx.fillText('• Giữ cố định pít-tông', 564, 126);
        ctx.fillText('• Làm mát khối khí', 564, 146);

        // Thẻ GĐ2
        roundRect(552, 182, 196, 86, 8);
        ctx.fillStyle = !phase1 ? 'rgba(16, 185, 129, 0.16)' : 'rgba(30, 41, 59, 0.65)';
        ctx.fill();
        ctx.strokeStyle = !phase1 ? '#10b981' : 'rgba(148, 163, 184, 0.28)';
        ctx.lineWidth = !phase1 ? 1.8 : 1;
        ctx.stroke();
        ctx.fillStyle = '#34d399';
        ctx.font = '800 13px "Be Vietnam Pro", sans-serif';
        ctx.fillText('GĐ 2: Đến trạng thái f', 564, 204);
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '600 12.5px "Be Vietnam Pro", sans-serif';
        ctx.fillText('• Đẩy pít-tông vào từ từ', 564, 226);
        ctx.fillText('• Nhiệt độ không đổi', 564, 246);
    });

    // ==================== 3. MH-TN50-C2-274 ====================
    M.register('MH-TN50-C2-274', function (ctx, w, h, t) {
        function clearBg() {
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);
        }
        function roundRect(x, y, rw, rh, r) {
            ctx.beginPath();
            ctx.roundRect(x, y, rw, rh, r);
        }
        function arrow(x1, y1, x2, y2, color, lw) {
            const ang = Math.atan2(y2 - y1, x2 - x1);
            ctx.save();
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.lineWidth = lw || 2;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(x2 - 9 * Math.cos(ang - 0.36), y2 - 9 * Math.sin(ang - 0.36));
            ctx.lineTo(x2 - 9 * Math.cos(ang + 0.36), y2 - 9 * Math.sin(ang + 0.36));
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }

        clearBg();
        const saw = (t * 0.18) % 1;
        const isSeg1 = saw < 0.55;
        const u1 = isSeg1 ? saw / 0.55 : 1;
        const u2 = isSeg1 ? 0 : (saw - 0.55) / 0.45;

        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 14px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('ĐỒ THỊ (p, V) HAI GIAI ĐOẠN BIẾN ĐỔI TRẠNG THÁI KHÍ', 18, 26);

        // Khung trái: Đồ thị đúng theo q_274_0.jpg
        roundRect(18, 40, 392, 250, 12);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        const ox = 86, oy = 258, unitX = 48, unitY = 38;
        ctx.save();
        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.32)';
        ctx.lineWidth = 1;
        for (let gx = 1; gx <= 5; gx++) {
            ctx.beginPath();
            ctx.moveTo(ox + gx * unitX, oy);
            ctx.lineTo(ox + gx * unitX, oy - 5 * unitY);
            ctx.stroke();
        }
        for (let gy = 1; gy <= 5; gy++) {
            ctx.beginPath();
            ctx.moveTo(ox, oy - gy * unitY);
            ctx.lineTo(ox + 5 * unitX, oy - gy * unitY);
            ctx.stroke();
        }
        ctx.restore();

        arrow(ox, oy, ox, oy - 5.35 * unitY, '#e2e8f0', 2.4);
        arrow(ox, oy, ox + 5.45 * unitX, oy, '#e2e8f0', 2.4);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 15px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('p', ox - 10, oy - 5.1 * unitY);
        ctx.fillText('O', ox - 10, oy + 16);
        ctx.textAlign = 'left';
        ctx.fillText('V', ox + 5.25 * unitX, oy + 18);

        // Đường hyperbol pV = 4 từ (1,4) đến (4,1)
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let i = 0; i <= 40; i++) {
            const vx = 1 + 3 * (i / 40);
            const py = 4 / vx;
            const px = ox + vx * unitX;
            const cy = oy - py * unitY;
            if (i === 0) ctx.moveTo(px, cy);
            else ctx.lineTo(px, cy);
        }
        ctx.stroke();

        // Đoạn thẳng ngang từ (4,1) về (1,1) mũi tên hướng trái
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(ox + 4 * unitX, oy - 1 * unitY);
        ctx.lineTo(ox + 1 * unitX, oy - 1 * unitY);
        ctx.stroke();
        arrow(ox + 2.8 * unitX, oy - 1 * unitY, ox + 2.35 * unitX, oy - 1 * unitY, '#f59e0b', 3);

        // Chấm chuyển động theo quỹ đạo: (1,4) -> (4,1) -> (1,1)
        let curV, curP;
        if (isSeg1) {
            curV = 1 + 3 * u1;
            curP = 4 / curV;
        } else {
            curV = 4 - 3 * u2;
            curP = 1;
        }
        const dotX = ox + curV * unitX;
        const dotY = oy - curP * unitY;
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(dotX, dotY, 6.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Khung phải: Mô hình xilanh đồng bộ với điểm trạng thái (KHÔNG ghi tên đẳng quá trình!)
        roundRect(426, 40, 336, 250, 12);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        ctx.fillStyle = '#94a3b8';
        ctx.font = '700 13px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Trạng thái thể tích V & áp suất p tương ứng', 594, 64);

        const cX = 466, cY = 108, cW = 240, cH = 92;
        const pX = cX + 46 + (curV - 1) / 3 * 135;
        ctx.fillStyle = 'rgba(56, 189, 248, 0.16)';
        ctx.fillRect(cX + 3, cY + 3, pX - cX - 3, cH - 6);

        const gw = pX - cX - 12;
        ctx.fillStyle = '#7dd3fc';
        for (let i = 0; i < 16; i++) {
            const mx = cX + 8 + ((Math.sin(i * 11.3 + t * 3.2) * 0.5 + 0.5) * Math.max(20, gw));
            const my = cY + 10 + ((Math.cos(i * 6.7 + t * 3.1) * 0.5 + 0.5) * (cH - 20));
            ctx.beginPath();
            ctx.arc(mx, my, 2.5, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cX + cW, cY);
        ctx.lineTo(cX, cY);
        ctx.lineTo(cX, cY + cH);
        ctx.lineTo(cX + cW, cY + cH);
        ctx.stroke();

        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(pX, cY + 2, 16, cH - 4);
        ctx.fillStyle = '#64748b';
        ctx.fillRect(pX + 16, cY + cH / 2 - 5, cX + cW + 24 - pX, 10);

        roundRect(454, 224, 280, 44, 8);
        ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
        ctx.fill();
        ctx.strokeStyle = isSeg1 ? '#38bdf8' : '#f59e0b';
        ctx.lineWidth = 1.4;
        ctx.stroke();
        ctx.fillStyle = isSeg1 ? '#38bdf8' : '#fbbf24';
        ctx.font = '700 13px "Be Vietnam Pro", sans-serif';
        ctx.fillText(
            isSeg1 ? 'Đoạn cong: p giảm, V tăng' : 'Đoạn ngang: p không đổi, V giảm',
            594, 251
        );
    });

    // ==================== 4. MH-TN50-C2-255 ====================
    M.register('MH-TN50-C2-255', function (ctx, w, h, t) {
        function clearBg() {
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);
        }
        function roundRect(x, y, rw, rh, r) {
            ctx.beginPath();
            ctx.roundRect(x, y, rw, rh, r);
        }
        function arrow(x1, y1, x2, y2, color, lw) {
            const ang = Math.atan2(y2 - y1, x2 - x1);
            ctx.save();
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.lineWidth = lw || 2;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(x2 - 9 * Math.cos(ang - 0.36), y2 - 9 * Math.sin(ang - 0.36));
            ctx.lineTo(x2 - 9 * Math.cos(ang + 0.36), y2 - 9 * Math.sin(ang + 0.36));
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
        function subText(main, sub, x, y, color, fontMain, fontSub) {
            ctx.save();
            ctx.fillStyle = color;
            ctx.textAlign = 'left';
            ctx.font = fontMain || '700 14px "Be Vietnam Pro", sans-serif';
            const mw = ctx.measureText(main).width;
            ctx.fillText(main, x, y);
            if (sub) {
                ctx.font = fontSub || '700 10.5px "Be Vietnam Pro", sans-serif';
                ctx.fillText(sub, x + mw + 1, y + 4);
            }
            ctx.restore();
        }

        clearBg();
        const saw = (t * 0.16) % 1;
        let curT, curV, stage;
        if (saw < 0.36) {
            const k = saw / 0.36;
            curT = 0.28 + k * 0.50;
            curV = 0.28 + k * 0.50;
            stage = 1;
        } else if (saw < 0.68) {
            const k = (saw - 0.36) / 0.32;
            curT = 0.78;
            curV = 0.78 - k * 0.50;
            stage = 2;
        } else {
            const k = (saw - 0.68) / 0.32;
            curT = 0.78 - k * 0.50;
            curV = 0.28;
            stage = 3;
        }

        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 14px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('CHU TRÌNH V - T CỦA KHỐI KHÍ LÍ TƯỞNG (X → Y → Z → X)', 18, 26);

        // Khung trái: Đồ thị V - T giống q_255_0.jpg
        roundRect(18, 40, 410, 250, 12);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        const ox = 86, oy = 254, axW = 295, axH = 188;
        arrow(ox, oy, ox, oy - axH, '#e2e8f0', 2.4);
        arrow(ox, oy, ox + axW, oy, '#e2e8f0', 2.4);

        subText('V (m', '', ox + 12, oy - axH + 18, '#f8fafc', '800 14px "Be Vietnam Pro", sans-serif');
        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 10px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('3', ox + 49, oy - axH + 11);
        ctx.font = '800 14px "Be Vietnam Pro", sans-serif';
        ctx.fillText(')', ox + 55, oy - axH + 18);
        ctx.fillText('T (K)', ox + axW - 68, oy - 12);
        ctx.fillText('O', ox - 20, oy + 12);

        const Xx = ox + 0.28 * axW, Xy = oy - 0.28 * axH;
        const Yx = ox + 0.78 * axW, Yy = oy - 0.78 * axH;
        const Zx = ox + 0.78 * axW, Zy = oy - 0.28 * axH;

        // Đường kéo dài đứt nét từ O tới X
        ctx.save();
        ctx.setLineDash([6, 5]);
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.6)';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(Xx, Xy);
        ctx.stroke();
        ctx.restore();

        // Chu trình X -> Y -> Z -> X
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(Xx, Xy);
        ctx.lineTo(Yx, Yy);
        ctx.lineTo(Zx, Zy);
        ctx.closePath();
        ctx.stroke();

        // Mũi tên theo chu trình
        arrow(Xx + (Yx - Xx) * 0.45, Xy + (Yy - Xy) * 0.45, Xx + (Yx - Xx) * 0.58, Xy + (Yy - Xy) * 0.58, '#38bdf8', 3);
        arrow(Yx, Yy + (Zy - Yy) * 0.42, Yx, Yy + (Zy - Yy) * 0.58, '#38bdf8', 3);
        arrow(Zx + (Xx - Zx) * 0.42, Zy, Zx + (Xx - Zx) * 0.58, Zy, '#38bdf8', 3);

        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 15px "Be Vietnam Pro", sans-serif';
        ctx.fillText('X', Xx - 18, Xy - 8);
        ctx.fillText('Y', Yx + 6, Yy - 8);
        ctx.fillText('Z', Zx + 10, Zy + 12);

        // Chấm chạy chu trình
        const curPx = ox + curT * axW;
        const curPy = oy - curV * axH;
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(curPx, curPy, 6.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Khung phải: Trực quan V & T tại điểm chạy (tuyệt đối KHÔNG tiết lộ chiều tăng/giảm của p!)
        roundRect(444, 40, 318, 250, 12);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        ctx.fillStyle = '#94a3b8';
        ctx.font = '700 13px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Thể tích V & Nhiệt độ T trên chu trình', 603, 64);

        const cX = 482, cY = 82, cW = 92, cH = 148;
        const pistTop = cY + cH - (curV / 0.85) * 116;
        ctx.fillStyle = 'rgba(56, 189, 248, 0.16)';
        ctx.fillRect(cX + 2, pistTop + 12, cW - 4, cY + cH - pistTop - 12);

        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2.8;
        ctx.beginPath();
        ctx.moveTo(cX, cY);
        ctx.lineTo(cX, cY + cH);
        ctx.lineTo(cX + cW, cY + cH);
        ctx.lineTo(cX + cW, cY);
        ctx.stroke();

        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(cX + 2, pistTop, cW - 4, 12);
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '700 12.5px "Be Vietnam Pro", sans-serif';
        ctx.fillText('V', cX + cW / 2, cY + cH + 20);

        // Cột nhiệt kế bên cạnh
        const thX = 638, thY = 86, thH = 136;
        ctx.fillStyle = '#1e293b';
        roundRect(thX - 8, thY, 16, thH, 8);
        ctx.fill();
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1.6;
        ctx.stroke();
        const mercuryH = (curT / 0.85) * (thH - 18);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(thX - 4, thY + thH - 8 - mercuryH, 8, mercuryH);
        ctx.beginPath();
        ctx.arc(thX, thY + thH, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#e2e8f0';
        ctx.fillText('T (K)', thX, thY + thH + 24);

        // Thẻ mô tả giai đoạn hiện tại (chỉ mô tả hình học đồ thị, không lộ đáp án)
        roundRect(464, 250, 278, 28, 7);
        ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
        ctx.fill();
        ctx.fillStyle = '#38bdf8';
        ctx.font = '700 12.5px "Be Vietnam Pro", sans-serif';
        const txt = stage === 1
            ? 'GĐ X → Y: tia thẳng kéo dài qua gốc O'
            : (stage === 2 ? 'GĐ Y → Z: đoạn thẳng đứng T = const' : 'GĐ Z → X: đoạn nằm ngang V = const');
        ctx.fillText(txt, 603, 269);
    });

    // ==================== 5. MH-TN50-C2-269 ====================
    M.register('MH-TN50-C2-269', function (ctx, w, h, t) {
        function clearBg() {
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);
        }
        function roundRect(x, y, rw, rh, r) {
            ctx.beginPath();
            ctx.roundRect(x, y, rw, rh, r);
        }
        function arrow(x1, y1, x2, y2, color, lw) {
            const ang = Math.atan2(y2 - y1, x2 - x1);
            ctx.save();
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.lineWidth = lw || 2;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(x2 - 9 * Math.cos(ang - 0.36), y2 - 9 * Math.sin(ang - 0.36));
            ctx.lineTo(x2 - 9 * Math.cos(ang + 0.36), y2 - 9 * Math.sin(ang + 0.36));
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
        function subText(main, sub, x, y, color, fontMain, fontSub) {
            ctx.save();
            ctx.fillStyle = color;
            ctx.textAlign = 'left';
            ctx.font = fontMain || '800 15px "Be Vietnam Pro", sans-serif';
            const mw = ctx.measureText(main).width;
            ctx.fillText(main, x, y);
            if (sub) {
                ctx.font = fontSub || '800 11px "Be Vietnam Pro", sans-serif';
                ctx.fillText(sub, x + mw + 1, y + 4);
            }
            ctx.restore();
        }

        clearBg();
        const saw = (t * 0.20) % 1;
        const frac = 0.32 + 0.48 * saw;

        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 14px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('HAI ĐƯỜNG ĐẲNG ÁP TRONG HỆ TỌA ĐỘ (V, T)', 18, 26);

        // Khung trái: Đồ thị đúng chuẩn q_269_0.jpg
        roundRect(18, 40, 405, 250, 12);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        const ox = 86, oy = 252, axW = 290, axH = 186;
        arrow(ox, oy, ox, oy - axH, '#e2e8f0', 2.4);
        arrow(ox, oy, ox + axW, oy, '#e2e8f0', 2.4);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 15px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('V', ox - 12, oy - axH + 14);
        ctx.fillText('O', ox - 10, oy + 16);
        ctx.textAlign = 'left';
        ctx.fillText('T', ox + axW - 6, oy - 12);

        // 2 tia p2 (dốc hơn) và p1 (thoải hơn) đi qua O
        const p2End = { x: ox + 215, y: oy - 165 };
        const p1End = { x: ox + 255, y: oy - 108 };

        function drawIsobar(endPt, color, labelNum, labelX, labelY) {
            ctx.save();
            ctx.setLineDash([6, 5]);
            ctx.strokeStyle = color;
            ctx.lineWidth = 2.4;
            ctx.beginPath();
            ctx.moveTo(ox, oy);
            ctx.lineTo(ox + (endPt.x - ox) * 0.28, oy + (endPt.y - oy) * 0.28);
            ctx.stroke();
            ctx.restore();

            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(ox + (endPt.x - ox) * 0.28, oy + (endPt.y - oy) * 0.28);
            ctx.lineTo(endPt.x, endPt.y);
            ctx.stroke();
            subText('p', labelNum, labelX, labelY, color);
        }

        drawIsobar(p2End, '#38bdf8', '2', p2End.x - 36, p2End.y + 4);
        drawIsobar(p1End, '#f59e0b', '1', p1End.x - 28, p1End.y - 10);

        // Đường dò đẳng nhiệt T di chuyển ngang để học sinh quan sát trực giác (không lộ p1 > p2)
        const scanX = ox + frac * 220;
        const yOnP2 = oy - (165 / 215) * (scanX - ox);
        const yOnP1 = oy - (108 / 255) * (scanX - ox);
        ctx.save();
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.75)';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(scanX, oy);
        ctx.lineTo(scanX, yOnP2 - 8);
        ctx.stroke();
        ctx.restore();
        ctx.fillStyle = '#10b981';
        ctx.font = '700 12.5px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('T', scanX, oy + 16);

        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(scanX, yOnP2, 5.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(scanX, yOnP1, 5.5, 0, Math.PI * 2);
        ctx.fill();

        // Khung phải: Hai xilanh song song ở cùng T (hiển thị độ cao pít-tông thay đổi theo T)
        roundRect(438, 40, 324, 250, 12);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        ctx.fillStyle = '#94a3b8';
        ctx.font = '700 13px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Thể tích hai trạng thái tại cùng nhiệt độ T', 600, 64);

        const boxes = [
            { x: 486, color: '#f59e0b', num: '1', fillH: (oy - yOnP1) * 0.72 },
            { x: 636, color: '#38bdf8', num: '2', fillH: (oy - yOnP2) * 0.72 }
        ];
        boxes.forEach(b => {
            const cY = 92, cW = 76, cH = 140;
            const topY = cY + cH - Math.min(120, Math.max(22, b.fillH));
            ctx.fillStyle = b.color === '#38bdf8' ? 'rgba(56, 189, 248, 0.16)' : 'rgba(245, 158, 11, 0.16)';
            ctx.fillRect(b.x + 2, topY + 12, cW - 4, cY + cH - topY - 12);

            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 2.6;
            ctx.beginPath();
            ctx.moveTo(b.x, cY);
            ctx.lineTo(b.x, cY + cH);
            ctx.lineTo(b.x + cW, cY + cH);
            ctx.lineTo(b.x + cW, cY);
            ctx.stroke();

            ctx.fillStyle = '#cbd5e1';
            ctx.fillRect(b.x + 2, topY, cW - 4, 12);
            subText('Áp suất p', b.num, b.x - 4, cY + cH + 24, b.color, '700 13.5px "Be Vietnam Pro", sans-serif', '700 10.5px sans-serif');
        });
    });

    // ==================== 6. MH-TN50-C2-314 ====================
    M.register('MH-TN50-C2-314', function (ctx, w, h, t) {
        function clearBg() {
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);
        }
        function roundRect(x, y, rw, rh, r) {
            ctx.beginPath();
            ctx.roundRect(x, y, rw, rh, r);
        }
        function arrow(x1, y1, x2, y2, color, lw) {
            const ang = Math.atan2(y2 - y1, x2 - x1);
            ctx.save();
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.lineWidth = lw || 2;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(x2 - 8 * Math.cos(ang - 0.36), y2 - 8 * Math.sin(ang - 0.36));
            ctx.lineTo(x2 - 8 * Math.cos(ang + 0.36), y2 - 8 * Math.sin(ang + 0.36));
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
        function subText(main, sub, x, y, color) {
            ctx.save();
            ctx.fillStyle = color;
            ctx.textAlign = 'left';
            ctx.font = '700 11.5px "Be Vietnam Pro", sans-serif';
            const mw = ctx.measureText(main).width;
            ctx.fillText(main, x, y);
            ctx.font = '700 8.5px "Be Vietnam Pro", sans-serif';
            ctx.fillText(sub, x + mw + 0.5, y + 3);
            ctx.restore();
        }

        clearBg();
        const saw = (t * 0.22) % 1;

        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 14px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('SO SÁNH 4 ĐỒ THỊ (P, T) — ĐUN NÓNG ĐẲNG ÁP (T × 2) RỒI LÀM LẠNH ĐẲNG TÍCH', 18, 26);

        const panels = [
            {
                title: 'Hình 1',
                pts: [{ x: 1, y: 2.5, lbl: '(1)' }, { x: 2, y: 2.5, lbl: '(3)' }, { x: 2, y: 1.25, lbl: '(2)' }]
            },
            {
                title: 'Hình 2',
                pts: [{ x: 1, y: 2.5, lbl: '(1)' }, { x: 2, y: 2.5, lbl: '(2)' }, { x: 1, y: 1.25, lbl: '(3)' }]
            },
            {
                title: 'Hình 3',
                pts: [{ x: 1, y: 2.5, lbl: '(1)' }, { x: 1, y: 1.25, lbl: '(2)' }, { x: 2, y: 1.25, lbl: '(3)' }]
            },
            {
                title: 'Hình 4',
                pts: [{ x: 1, y: 2.5, lbl: '(1)' }, { x: 1, y: 1.25, lbl: '(2)' }, { x: 2, y: 1.25, lbl: '(3)' }]
            }
        ];

        const cardW = 176, gap = 12, startX = 18;
        panels.forEach((p, idx) => {
            const cx = startX + idx * (cardW + gap);
            const cy = 42, ch = 248;
            // TẤT CẢ 4 KHUNG GIỐNG NHAU HOÀN TOÀN (Zero Data Leakage!)
            roundRect(cx, cy, cardW, ch, 10);
            ctx.fillStyle = 'rgba(15, 23, 42, 0.74)';
            ctx.fill();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
            ctx.lineWidth = 1.3;
            ctx.stroke();

            const ox = cx + 38, oy = cy + 202, ux = 46, uy = 48;

            // Lưới đứt nét
            ctx.save();
            ctx.setLineDash([3, 3]);
            ctx.strokeStyle = 'rgba(148, 163, 184, 0.28)';
            ctx.lineWidth = 1;
            [1, 2].forEach(gx => {
                ctx.beginPath();
                ctx.moveTo(ox + gx * ux, oy);
                ctx.lineTo(ox + gx * ux, oy - 3 * uy);
                ctx.stroke();
            });
            [1.25, 2.5].forEach(gy => {
                ctx.beginPath();
                ctx.moveTo(ox, oy - gy * uy);
                ctx.lineTo(ox + 2.4 * ux, oy - gy * uy);
                ctx.stroke();
            });
            ctx.restore();

            arrow(ox, oy, ox, oy - 3.25 * uy, '#cbd5e1', 1.8);
            arrow(ox, oy, ox + 2.65 * ux, oy, '#cbd5e1', 1.8);

            ctx.fillStyle = '#e2e8f0';
            ctx.font = '700 12px "Be Vietnam Pro", sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText('P', ox - 8, oy - 3.05 * uy);
            ctx.fillText('O', ox - 6, oy + 14);
            ctx.textAlign = 'left';
            ctx.fillText('T', ox + 2.45 * ux, oy - 7);

            subText('P', '1', ox - 24, oy - 2.5 * uy + 4, '#94a3b8');
            subText('P', '3', ox - 24, oy - 1.25 * uy + 4, '#94a3b8');
            subText('T', '1', ox + ux - 7, oy + 15, '#94a3b8');
            subText('T', '2', ox + 2 * ux - 7, oy + 15, '#94a3b8');

            // Đoạn gấp khúc + mũi tên
            const p0 = { x: ox + p.pts[0].x * ux, y: oy - p.pts[0].y * uy };
            const p1 = { x: ox + p.pts[1].x * ux, y: oy - p.pts[1].y * uy };
            const p2 = { x: ox + p.pts[2].x * ux, y: oy - p.pts[2].y * uy };

            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2.6;
            ctx.beginPath();
            ctx.moveTo(p0.x, p0.y);
            ctx.lineTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();

            arrow(p0.x + (p1.x - p0.x) * 0.42, p0.y + (p1.y - p0.y) * 0.42, p0.x + (p1.x - p0.x) * 0.62, p0.y + (p1.y - p0.y) * 0.62, '#38bdf8', 2.4);
            arrow(p1.x + (p2.x - p1.x) * 0.42, p1.y + (p2.y - p1.y) * 0.42, p1.x + (p2.x - p1.x) * 0.62, p1.y + (p2.y - p1.y) * 0.62, '#38bdf8', 2.4);

            // Nhãn trạng thái
            ctx.fillStyle = '#f8fafc';
            ctx.font = '700 11.5px "Be Vietnam Pro", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(p.pts[0].lbl, p0.x - 10, p0.y - 8);
            ctx.fillText(p.pts[1].lbl, p1.x + 10, p1.y - 8);
            ctx.fillText(p.pts[2].lbl, p2.x + 10, p2.y + 14);

            // Chấm đồng bộ chạy trên cả 4 đồ thị
            let dx, dy;
            if (saw < 0.5) {
                const k = saw / 0.5;
                dx = p0.x + (p1.x - p0.x) * k;
                dy = p0.y + (p1.y - p0.y) * k;
            } else {
                const k = (saw - 0.5) / 0.5;
                dx = p1.x + (p2.x - p1.x) * k;
                dy = p1.y + (p2.y - p1.y) * k;
            }
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath();
            ctx.arc(dx, dy, 4.8, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#e2e8f0';
            ctx.font = '800 13.5px "Be Vietnam Pro", sans-serif';
            ctx.fillText(p.title, cx + cardW / 2, cy + 236);
        });
    });

    // ==================== 7. MH-TN50-C2-337 ====================
    M.register('MH-TN50-C2-337', function (ctx, w, h, t) {
        function clearBg() {
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);
        }
        function roundRect(x, y, rw, rh, r) {
            ctx.beginPath();
            ctx.roundRect(x, y, rw, rh, r);
        }
        function arrow(x1, y1, x2, y2, color, lw) {
            const ang = Math.atan2(y2 - y1, x2 - x1);
            ctx.save();
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.lineWidth = lw || 2;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(x2 - 9 * Math.cos(ang - 0.36), y2 - 9 * Math.sin(ang - 0.36));
            ctx.lineTo(x2 - 9 * Math.cos(ang + 0.36), y2 - 9 * Math.sin(ang + 0.36));
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }

        clearBg();
        const saw = (t * 0.16) % 1;
        const heating = saw < 0.5;
        const level = heating ? (saw / 0.5) : (1 - (saw - 0.5) / 0.5);

        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 14px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('BÌNH CẦU KHÔNG KHÍ NGĂN BỞI GIỌT THỦY NGÂN TRONG ỐNG HỞ', 18, 26);

        roundRect(18, 40, 744, 250, 12);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        // Bình cầu bên trái + ống cong góc vuông hở đầu bên phải đúng chuẩn q_337_0.jpg
        const bx = 210, by = 188, br = 48;
        const neckL = 198, neckR = 222, tubeTopY = 66, tubeBotY = 90, tubeEndX = 560;

        // Vùng khí bên trong bình + ống
        const dropX = 330 + level * 145;
        const tint = heating ? (0.12 + 0.16 * level) : 0.14;
        ctx.fillStyle = heating ? 'rgba(249, 115, 22,' + tint + ')' : 'rgba(56, 189, 248, 0.16)';
        ctx.beginPath();
        ctx.arc(bx, by, br - 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(neckL + 2, tubeBotY - 2, neckR - neckL - 4, by - br - tubeBotY + 12);
        ctx.fillRect(neckL + 2, tubeTopY + 2, dropX - neckL, tubeBotY - tubeTopY - 4);

        // Phân tử khí bên trong bình cầu
        const spd = 2.2 + 2.2 * level;
        ctx.fillStyle = heating ? '#fdba74' : '#7dd3fc';
        for (let i = 0; i < 16; i++) {
            const ang = i * 2.1 + t * spd;
            const rad = 12 + (i % 4) * 9;
            const mx = bx + Math.cos(ang) * rad;
            const my = by + Math.sin(ang * 0.9) * rad;
            ctx.beginPath();
            ctx.arc(mx, my, 2.6, 0, Math.PI * 2);
            ctx.fill();
        }

        // Thành thủy tinh hình chữ L ngược gắn bình cầu (HỞ đầu phải)
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        const neckAngle = Math.asin((neckR - bx) / br);
        ctx.arc(bx, by, br, -Math.PI / 2 + neckAngle, Math.PI * 1.5 - neckAngle, false);
        ctx.lineTo(neckL, tubeTopY);
        ctx.lineTo(tubeEndX, tubeTopY);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(neckR, by - Math.sqrt(br * br - (neckR - bx) * (neckR - bx)));
        ctx.lineTo(neckR, tubeBotY);
        ctx.lineTo(tubeEndX, tubeBotY);
        ctx.stroke();

        // Giọt thủy ngân dịch chuyển trơn tru (viên nang màu xanh đậm / bạc thủy ngân)
        const plugW = 68;
        roundRect(dropX, tubeTopY + 3, plugW, tubeBotY - tubeTopY - 6, 9);
        ctx.fillStyle = '#16a34a';
        ctx.fill();
        ctx.strokeStyle = '#86efac';
        ctx.lineWidth = 1.8;
        ctx.stroke();

        // Nguồn nhiệt / làm nguội dưới đáy bình cầu (gọn bên trong viền khung)
        if (heating) {
            ctx.fillStyle = 'rgba(249, 115, 22, 0.25)';
            ctx.beginPath();
            ctx.ellipse(bx, by + br + 12, 42, 9, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#fb923c';
            ctx.font = '700 13px "Be Vietnam Pro", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Làm nóng bình cầu từ từ', bx, by + br + 36);
            arrow(dropX + plugW + 10, 56, dropX + plugW + 46, 56, '#fb923c', 2.2);
        } else {
            ctx.fillStyle = '#38bdf8';
            ctx.font = '700 13px "Be Vietnam Pro", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Làm nguội bình cầu từ từ', bx, by + br + 36);
            arrow(dropX - 10, 56, dropX - 46, 56, '#38bdf8', 2.2);
        }

        // Nhãn cấu tạo trung tính (tuyệt đối KHÔNG ghi đẳng áp!)
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '700 13.5px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('Giọt thủy ngân', dropX - 8, tubeBotY + 24);
        ctx.fillText('Đầu ống hở thông khí quyển', tubeEndX + 12, 83);
        ctx.textAlign = 'right';
        ctx.fillText('Khối khí', bx - br - 14, by - 4);
        ctx.fillText('trong bình cầu', bx - br - 14, by + 16);
    });

    // ==================== 8. MH-TN50-C2-347 ====================
    M.register('MH-TN50-C2-347', function (ctx, w, h, t) {
        function clearBg() {
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);
        }
        function roundRect(x, y, rw, rh, r) {
            ctx.beginPath();
            ctx.roundRect(x, y, rw, rh, r);
        }
        function arrow(x1, y1, x2, y2, color, lw) {
            const ang = Math.atan2(y2 - y1, x2 - x1);
            ctx.save();
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.lineWidth = lw || 2;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(x2 - 9 * Math.cos(ang - 0.36), y2 - 9 * Math.sin(ang - 0.36));
            ctx.lineTo(x2 - 9 * Math.cos(ang + 0.36), y2 - 9 * Math.sin(ang + 0.36));
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
        function subText(main, sub, x, y, color, fMain, fSub) {
            ctx.save();
            ctx.fillStyle = color;
            ctx.textAlign = 'left';
            ctx.font = fMain || '700 14px "Be Vietnam Pro", sans-serif';
            const mw = ctx.measureText(main).width;
            ctx.fillText(main, x, y);
            ctx.font = fSub || '700 10.5px "Be Vietnam Pro", sans-serif';
            ctx.fillText(sub, x + mw + 1, y + 4);
            ctx.restore();
        }

        clearBg();
        const saw = (t * 0.18) % 1;
        const isSeg1 = saw < 0.55;
        const u1 = isSeg1 ? saw / 0.55 : 1;
        const u2 = isSeg1 ? 0 : (saw - 0.55) / 0.45;

        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 14px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('ĐỒ THỊ (p, T) HAI GIAI ĐOẠN BIẾN ĐỔI (1) → (2) → (3)', 18, 26);

        // Khung trái: Đồ thị đúng chuẩn q_347_0.jpg
        roundRect(18, 40, 396, 250, 12);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        const ox = 86, oy = 252, unitT = 110, unitP = 74;
        arrow(ox, oy, ox, oy - 2.55 * unitP, '#e2e8f0', 2.4);
        arrow(ox, oy, ox + 2.85 * unitT, oy, '#e2e8f0', 2.4);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 15px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('p', ox - 12, oy - 2.38 * unitP);
        ctx.fillText('0', ox - 10, oy + 14);
        ctx.textAlign = 'left';
        ctx.fillText('T', ox + 2.7 * unitT, oy + 18);

        // Lưới gióng đứt nét p0, 2p0, T0
        ctx.save();
        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.48)';
        ctx.lineWidth = 1.4;
        // ngang 2p0
        ctx.beginPath();
        ctx.moveTo(ox, oy - 2 * unitP);
        ctx.lineTo(ox + 2 * unitT, oy - 2 * unitP);
        ctx.stroke();
        // ngang p0
        ctx.beginPath();
        ctx.moveTo(ox, oy - unitP);
        ctx.lineTo(ox + 2 * unitT, oy - unitP);
        ctx.stroke();
        // dọc T0
        ctx.beginPath();
        ctx.moveTo(ox + unitT, oy);
        ctx.lineTo(ox + unitT, oy - 2 * unitP);
        ctx.stroke();
        // tia đứt nét từ 0 đến (1)
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(ox + unitT, oy - unitP);
        ctx.stroke();
        ctx.restore();

        subText('2p', '0', ox - 36, oy - 2 * unitP + 5, '#cbd5e1');
        subText('p', '0', ox - 28, oy - unitP + 5, '#cbd5e1');
        subText('T', '0', ox + unitT - 9, oy + 18, '#cbd5e1');

        const p1 = { x: ox + unitT, y: oy - unitP };
        const p2 = { x: ox + 2 * unitT, y: oy - 2 * unitP };
        const p3 = { x: ox + 2 * unitT, y: oy - unitP };

        // Đoạn (1)->(2) và (2)->(3)
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.stroke();
        arrow(p1.x + (p2.x - p1.x) * 0.45, p1.y + (p2.y - p1.y) * 0.45, p1.x + (p2.x - p1.x) * 0.62, p1.y + (p2.y - p1.y) * 0.62, '#38bdf8', 2.8);
        arrow(p2.x, p2.y + (p3.y - p2.y) * 0.42, p2.x, p2.y + (p3.y - p2.y) * 0.60, '#38bdf8', 2.8);

        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 14px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('(1)', p1.x - 18, p1.y - 8);
        ctx.fillText('(2)', p2.x, p2.y - 12);
        ctx.fillText('(3)', p3.x, p3.y + 20);

        const curX = isSeg1 ? p1.x + (p2.x - p1.x) * u1 : p2.x;
        const curY = isSeg1 ? p1.y + (p2.y - p1.y) * u1 : p2.y + (p3.y - p2.y) * u2;
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(curX, curY, 6.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Khung phải: Trực quan p & T đang biến thiên (KHÔNG tiết lộ đẳng tích / đẳng nhiệt)
        roundRect(430, 40, 332, 250, 12);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        ctx.fillStyle = '#94a3b8';
        ctx.font = '700 13px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Biến thiên áp suất p & nhiệt độ T theo đồ thị', 596, 64);

        // Thể hiện 2 thanh mức p và T trực quan theo đồ thị
        const curPVal = isSeg1 ? (1 + u1) : (2 - u2);
        const curTVal = isSeg1 ? (1 + u1) : 2;
        const bars = [
            { label: 'Áp suất p', val: curPVal, x: 512, color: '#38bdf8' },
            { label: 'Nhiệt độ T', val: curTVal, x: 638, color: '#f59e0b' }
        ];
        bars.forEach(b => {
            roundRect(b.x, 94, 44, 126, 8);
            ctx.fillStyle = '#0f172a';
            ctx.fill();
            ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
            ctx.lineWidth = 1.2;
            ctx.stroke();

            const bh = (b.val / 2.2) * 116;
            ctx.fillStyle = b.color;
            ctx.fillRect(b.x + 5, 215 - bh, 34, bh);
            ctx.fillStyle = '#e2e8f0';
            ctx.font = '700 13px "Be Vietnam Pro", sans-serif';
            ctx.fillText(b.label, b.x + 22, 240);
        });

        roundRect(454, 254, 284, 26, 6);
        ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
        ctx.fill();
        ctx.fillStyle = '#38bdf8';
        ctx.font = '700 12.5px "Be Vietnam Pro", sans-serif';
        ctx.fillText(isSeg1 ? 'GĐ (1)→(2): p và T tăng tỉ lệ (tia qua gốc 0)' : 'GĐ (2)→(3): T không đổi, p giảm từ 2p₀ → p₀', 596, 271);
    });

    // ==================== 9. MH-TN50-C2-350 ====================
    M.register('MH-TN50-C2-350', function (ctx, w, h, t) {
        function clearBg() {
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);
        }
        function roundRect(x, y, rw, rh, r) {
            ctx.beginPath();
            ctx.roundRect(x, y, rw, rh, r);
        }
        function arrow(x1, y1, x2, y2, color, lw) {
            const ang = Math.atan2(y2 - y1, x2 - x1);
            ctx.save();
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.lineWidth = lw || 2;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(x2 - 8 * Math.cos(ang - 0.36), y2 - 8 * Math.sin(ang - 0.36));
            ctx.lineTo(x2 - 8 * Math.cos(ang + 0.36), y2 - 8 * Math.sin(ang + 0.36));
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
        function subText(main, sub, x, y, color) {
            ctx.save();
            ctx.fillStyle = color;
            ctx.textAlign = 'left';
            ctx.font = '700 11px "Be Vietnam Pro", sans-serif';
            const mw = ctx.measureText(main).width;
            ctx.fillText(main, x, y);
            ctx.font = '700 8px "Be Vietnam Pro", sans-serif';
            ctx.fillText(sub, x + mw + 0.5, y + 3);
            ctx.restore();
        }

        clearBg();
        const saw = (t * 0.22) % 1;

        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 14px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('SO SÁNH 4 ĐỒ THỊ — BIẾN ĐỔI ĐẲNG ÁP ĐẾN 2V₀ RỒI NÉN ĐẲNG NHIỆT VỀ V₀', 18, 26);

        const cardW = 176, gap = 12, startX = 18;
        for (let idx = 0; idx < 4; idx++) {
            const cx = startX + idx * (cardW + gap);
            const cy = 42, ch = 248;
            // TẤT CẢ 4 KHUNG GIỐNG NHAU HOÀN TOÀN (Zero Data Leakage!)
            roundRect(cx, cy, cardW, ch, 10);
            ctx.fillStyle = 'rgba(15, 23, 42, 0.74)';
            ctx.fill();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
            ctx.lineWidth = 1.3;
            ctx.stroke();

            const ox = cx + 40, oy = cy + 196, ux = 48, uy = 54;
            arrow(ox, oy, ox, oy - 2.55 * uy, '#cbd5e1', 1.8);
            arrow(ox, oy, ox + 2.55 * ux, oy, '#cbd5e1', 1.8);
            ctx.fillStyle = '#e2e8f0';
            ctx.font = '700 12px "Be Vietnam Pro", sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText('p', ox - 8, oy - 2.38 * uy);
            ctx.fillText('O', ox - 6, oy + 14);
            ctx.textAlign = 'left';
            ctx.fillText((idx === 0 || idx === 3) ? 'V' : 'T', ox + 2.38 * ux, oy + 15);

            // Lưới chuẩn 1..2 trên mỗi hệ trục
            ctx.save();
            ctx.setLineDash([3, 3]);
            ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
            ctx.lineWidth = 1;
            [1, 2].forEach(g => {
                ctx.beginPath();
                ctx.moveTo(ox + g * ux, oy);
                ctx.lineTo(ox + g * ux, oy - 2 * uy);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(ox, oy - g * uy);
                ctx.lineTo(ox + 2 * ux, oy - g * uy);
                ctx.stroke();
            });
            if (idx === 1 || idx === 2) {
                ctx.beginPath();
                ctx.moveTo(ox, oy);
                ctx.lineTo(ox + ux, oy - uy);
                ctx.stroke();
            }
            ctx.restore();

            if (idx === 0) {
                subText('p', '0', ox - 24, oy - uy + 4, '#94a3b8');
                subText('V', '0', ox + ux - 8, oy + 15, '#94a3b8');
                subText('2V', '0', ox + 2 * ux - 10, oy + 15, '#94a3b8');
                ctx.strokeStyle = '#38bdf8';
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.moveTo(ox + ux, oy - uy);
                ctx.lineTo(ox + 2 * ux, oy - uy);
                ctx.lineTo(ox + ux, oy - 2 * uy);
                ctx.stroke();
                arrow(ox + 1.3 * ux, oy - uy, ox + 1.65 * ux, oy - uy, '#38bdf8', 2.4);
                arrow(ox + 1.65 * ux, oy - 1.35 * uy, ox + 1.35 * ux, oy - 1.65 * uy, '#38bdf8', 2.4);
                const dx = saw < 0.5 ? ox + (1 + saw * 2) * ux : ox + (2 - (saw - 0.5) * 2) * ux;
                const dy = saw < 0.5 ? oy - uy : oy - (1 + (saw - 0.5) * 2) * uy;
                ctx.fillStyle = '#fbbf24';
                ctx.beginPath(); ctx.arc(dx, dy, 4.5, 0, Math.PI * 2); ctx.fill();
            } else if (idx === 1) {
                subText('p', '0', ox - 24, oy - uy + 4, '#94a3b8');
                subText('2p', '0', ox - 29, oy - 2 * uy + 4, '#94a3b8');
                subText('T', '0', ox + ux - 8, oy + 15, '#94a3b8');
                subText('2T', '0', ox + 2 * ux - 10, oy + 15, '#94a3b8');
                ctx.strokeStyle = '#38bdf8';
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.moveTo(ox + 2 * ux, oy - uy);
                ctx.lineTo(ox + 2 * ux, oy - 2 * uy);
                ctx.lineTo(ox + ux, oy - uy);
                ctx.stroke();
                arrow(ox + 2 * ux, oy - 1.3 * uy, ox + 2 * ux, oy - 1.65 * uy, '#38bdf8', 2.4);
                arrow(ox + 1.65 * ux, oy - 1.65 * uy, ox + 1.35 * ux, oy - 1.35 * uy, '#38bdf8', 2.4);
                const dx = saw < 0.5 ? ox + 2 * ux : ox + (2 - (saw - 0.5) * 2) * ux;
                const dy = saw < 0.5 ? oy - (1 + saw * 2) * uy : oy - (2 - (saw - 0.5) * 2) * uy;
                ctx.fillStyle = '#fbbf24';
                ctx.beginPath(); ctx.arc(dx, dy, 4.5, 0, Math.PI * 2); ctx.fill();
            } else if (idx === 2) {
                subText('V', '0', ox - 24, oy - uy + 4, '#94a3b8');
                subText('2V', '0', ox - 29, oy - 2 * uy + 4, '#94a3b8');
                subText('T', '0', ox + ux - 8, oy + 15, '#94a3b8');
                subText('2T', '0', ox + 2 * ux - 10, oy + 15, '#94a3b8');
                ctx.strokeStyle = '#38bdf8';
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.moveTo(ox + ux, oy - uy);
                ctx.lineTo(ox + 2 * ux, oy - 2 * uy);
                ctx.lineTo(ox + 2 * ux, oy - uy);
                ctx.stroke();
                const dx = saw < 0.5 ? ox + (1 + saw * 2) * ux : ox + 2 * ux;
                const dy = saw < 0.5 ? oy - (1 + saw * 2) * uy : oy - (2 - (saw - 0.5) * 2) * uy;
                ctx.fillStyle = '#fbbf24';
                ctx.beginPath(); ctx.arc(dx, dy, 4.5, 0, Math.PI * 2); ctx.fill();
            } else {
                subText('p', '0', ox - 24, oy - uy + 4, '#94a3b8');
                subText('V', '0', ox + ux - 8, oy + 15, '#94a3b8');
                subText('2V', '0', ox + 2 * ux - 10, oy + 15, '#94a3b8');
                ctx.strokeStyle = '#38bdf8';
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.moveTo(ox + ux, oy - uy);
                ctx.lineTo(ox + 2 * ux, oy - uy);
                ctx.stroke();
                ctx.beginPath();
                for (let s = 0; s <= 24; s++) {
                    const vx = 2 - (s / 24);
                    const py = 2 / vx;
                    const px = ox + vx * ux;
                    const cy = oy - py * uy;
                    if (s === 0) ctx.moveTo(px, cy);
                    else ctx.lineTo(px, cy);
                }
                ctx.stroke();
                // Đuôi hyperbol đứt nét
                ctx.save();
                ctx.setLineDash([3, 3]);
                ctx.beginPath();
                for (let s = 0; s <= 10; s++) {
                    const vx = 0.85 + (s / 10) * 0.15;
                    const py = 2 / vx;
                    if (s === 0) ctx.moveTo(ox + vx * ux, oy - py * uy);
                    else ctx.lineTo(ox + vx * ux, oy - py * uy);
                }
                ctx.stroke();
                ctx.beginPath();
                for (let s = 0; s <= 10; s++) {
                    const vx = 2 + (s / 10) * 0.35;
                    const py = 2 / vx;
                    if (s === 0) ctx.moveTo(ox + vx * ux, oy - py * uy);
                    else ctx.lineTo(ox + vx * ux, oy - py * uy);
                }
                ctx.stroke();
                ctx.restore();

                const curV = saw < 0.5 ? 1 + saw * 2 : 2 - (saw - 0.5) * 2;
                const curP = saw < 0.5 ? 1 : 2 / curV;
                ctx.fillStyle = '#fbbf24';
                ctx.beginPath(); ctx.arc(ox + curV * ux, oy - curP * uy, 4.5, 0, Math.PI * 2); ctx.fill();
            }

            ctx.fillStyle = '#e2e8f0';
            ctx.font = '800 13.5px "Be Vietnam Pro", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Hình ' + (idx + 1), cx + cardW / 2, cy + 234);
        }
    });

    // ==================== 10. MH-TN50-C3-502 ====================
    M.register('MH-TN50-C3-502', function (ctx, w, h, t) {
        function clearBg() {
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);
        }
        function roundRect(x, y, rw, rh, r) {
            ctx.beginPath();
            ctx.roundRect(x, y, rw, rh, r);
        }
        function arrowHead(x1, y1, x2, y2, color, lw) {
            const ang = Math.atan2(y2 - y1, x2 - x1);
            ctx.save();
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.lineWidth = lw || 2.2;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(x2 - 8 * Math.cos(ang - 0.36), y2 - 8 * Math.sin(ang - 0.36));
            ctx.lineTo(x2 - 8 * Math.cos(ang + 0.36), y2 - 8 * Math.sin(ang + 0.36));
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }

        clearBg();
        const pulse = (t * 0.65) % 1;

        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 14px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('NAM CHÂM ĐIỆN LÕI SẮT NON CHỮ U — CHIỀU DÒNG ĐIỆN TRÊN 2 NHÁNH', 18, 26);

        // Khung chính
        roundRect(18, 40, 480, 250, 12);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        // Vẽ lõi sắt non hình chữ U nằm ngang hướng mở sang phải (giống hệt q_502_u_magnet.jpg)
        const ucX = 132, topY = 92, botY = 224, armLen = 285, thick = 22;
        const midY = (topY + botY) / 2;
        const outerR = (botY - topY) / 2 + thick / 2;
        const innerR = (botY - topY) / 2 - thick / 2;

        ctx.fillStyle = '#475569';
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.arc(ucX, midY, outerR, Math.PI / 2, Math.PI * 1.5, false);
        ctx.lineTo(ucX + armLen, topY - thick / 2);
        ctx.lineTo(ucX + armLen, topY + thick / 2);
        ctx.lineTo(ucX, topY + thick / 2);
        ctx.arc(ucX, midY, innerR, -Math.PI / 2, Math.PI / 2, true);
        ctx.lineTo(ucX + armLen, botY - thick / 2);
        ctx.lineTo(ucX + armLen, botY + thick / 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Đầu vào dưới phải -> quấn nhánh B (mặt trước xiên ↖), nối thẳng đứng lên trên ↑, quấn nhánh A (mặt trước xiên ↘) -> ra trên phải ↑
        const turns = 7;
        const xStart = ucX + 20, pitch = 30;
        const inX = xStart + (turns - 1) * pitch + 20;
        arrowHead(inX, botY + 46, inX, botY + 14, '#f59e0b', 2.6);
        ctx.fillStyle = '#fbbf24';
        ctx.font = '700 13.5px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('Dòng điện vào', inX + 10, botY + 38);

        // Cuộn nhánh B: nét sau đi phía sau lõi, nét trước nghiêng ↖ (từ dưới-phải lên trên-trái)
        for (let i = 0; i < turns; i++) {
            const cx = xStart + i * pitch;
            // Nét sau
            ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
            ctx.lineWidth = 2.2;
            ctx.beginPath();
            ctx.moveTo(cx, botY - thick / 2 - 5);
            ctx.lineTo(cx + 12, botY + thick / 2 + 5);
            ctx.stroke();
            // Nét trước hướng ↖
            const x1 = cx + 10, y1 = botY + thick / 2 + 6;
            const x2 = cx - 4, y2 = botY - thick / 2 - 6;
            arrowHead(x1, y1, x2, y2, '#fbbf24', 2.8);
            const dotT = (pulse + i * 0.14) % 1;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(x1 + (x2 - x1) * dotT, y1 + (y2 - y1) * dotT, 2.5, 0, Math.PI * 2);
            ctx.fill();
        }

        // Dây nối thẳng đứng từ cuối cuộn B lên đầu cuộn A (↑)
        const connX = xStart - 4;
        arrowHead(connX, botY - thick / 2 - 6, connX, topY + thick / 2 + 6, '#fbbf24', 2.6);
        const connDotY = (botY - thick / 2 - 6) - pulse * ((botY - topY) - thick - 12);
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(connX, connDotY, 2.8, 0, Math.PI * 2);
        ctx.fill();

        // Cuộn nhánh A: nét trước nghiêng ↘ (từ trên-trái xuống dưới-phải)
        for (let i = 0; i < turns; i++) {
            const cx = xStart + i * pitch;
            ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
            ctx.lineWidth = 2.2;
            ctx.beginPath();
            ctx.moveTo(cx + 10, topY + thick / 2 + 5);
            ctx.lineTo(cx + 22, topY - thick / 2 - 5);
            ctx.stroke();
            const x1 = cx - 4, y1 = topY - thick / 2 - 6;
            const x2 = cx + 10, y2 = topY + thick / 2 + 6;
            arrowHead(x1, y1, x2, y2, '#fbbf24', 2.8);
            const dotT = (pulse + i * 0.14) % 1;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(x1 + (x2 - x1) * dotT, y1 + (y2 - y1) * dotT, 2.5, 0, Math.PI * 2);
            ctx.fill();
        }

        // Đầu ra trên phải ↑
        const outX = xStart + (turns - 1) * pitch + 22;
        arrowHead(outX, topY - thick / 2, outX, topY - 46, '#f59e0b', 2.6);
        ctx.fillStyle = '#fbbf24';
        ctx.fillText('Dòng điện ra', outX + 10, topY - 26);

        // Chữ A và B (tuyệt đối KHÔNG ghi N hay S!)
        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 18px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('A', ucX + armLen + 12, topY + 6);
        ctx.fillText('B', ucX + armLen + 12, botY + 6);

        // Khung phải: Hướng dẫn quan sát quy tắc nắm tay phải (Zero Data Leakage)
        roundRect(512, 40, 250, 250, 12);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        ctx.fillStyle = '#e2e8f0';
        ctx.font = '800 14px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('GỢI Ý QUAN SÁT', 637, 72);

        roundRect(528, 92, 218, 82, 8);
        ctx.fillStyle = 'rgba(30, 41, 59, 0.75)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
        ctx.lineWidth = 1.1;
        ctx.stroke();
        ctx.textAlign = 'left';
        ctx.fillStyle = '#fbbf24';
        ctx.font = '700 13px "Be Vietnam Pro", sans-serif';
        ctx.fillText('Nhánh trên (đầu A):', 540, 118);
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '600 12.5px "Be Vietnam Pro", sans-serif';
        ctx.fillText('Mặt trước dòng điện hướng', 540, 140);
        ctx.fillText('từ trên xuống dưới (↘).', 540, 158);

        roundRect(528, 188, 218, 82, 8);
        ctx.fillStyle = 'rgba(30, 41, 59, 0.75)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.lineWidth = 1.1;
        ctx.stroke();
        ctx.fillStyle = '#38bdf8';
        ctx.font = '700 13px "Be Vietnam Pro", sans-serif';
        ctx.fillText('Nhánh dưới (đầu B):', 540, 214);
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '600 12.5px "Be Vietnam Pro", sans-serif';
        ctx.fillText('Mặt trước dòng điện hướng', 540, 236);
        ctx.fillText('từ dưới lên trên (↖).', 540, 254);
    });

    // ==================== 11. MH-TN50-C3-503 ====================
    M.register('MH-TN50-C3-503', function (ctx, w, h, t) {
        function clearBg() {
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);
        }
        function roundRect(x, y, rw, rh, r) {
            ctx.beginPath();
            ctx.roundRect(x, y, rw, rh, r);
        }
        function arrowHead(x1, y1, x2, y2, color, lw) {
            const ang = Math.atan2(y2 - y1, x2 - x1);
            ctx.save();
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.lineWidth = lw || 2.2;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(x2 - 8 * Math.cos(ang - 0.36), y2 - 8 * Math.sin(ang - 0.36));
            ctx.lineTo(x2 - 8 * Math.cos(ang + 0.36), y2 - 8 * Math.sin(ang + 0.36));
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }

        clearBg();
        const pulse = (t * 0.7) % 1;

        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 14px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('CẤU TẠO NAM CHÂM ĐIỆN LÕI SẮT NON CHỮ U & THÔNG SỐ CUỘN DÂY', 18, 26);

        roundRect(18, 40, 480, 250, 12);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        const ucX = 132, topY = 92, botY = 224, armLen = 285, thick = 22;
        const midY = (topY + botY) / 2;
        ctx.fillStyle = '#475569';
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.arc(ucX, midY, (botY - topY) / 2 + thick / 2, Math.PI / 2, Math.PI * 1.5, false);
        ctx.lineTo(ucX + armLen, topY - thick / 2);
        ctx.lineTo(ucX + armLen, topY + thick / 2);
        ctx.lineTo(ucX, topY + thick / 2);
        ctx.arc(ucX, midY, (botY - topY) / 2 - thick / 2, -Math.PI / 2, Math.PI / 2, true);
        ctx.lineTo(ucX + armLen, botY - thick / 2);
        ctx.lineTo(ucX + armLen, botY + thick / 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        const turns = 7, xStart = ucX + 20, pitch = 30;
        const inX = xStart + (turns - 1) * pitch + 20;
        arrowHead(inX, botY + 46, inX, botY + 14, '#f59e0b', 2.6);
        ctx.fillStyle = '#fbbf24';
        ctx.font = '700 13.5px "Be Vietnam Pro", sans-serif';
        ctx.fillText('Dòng điện vào', inX + 10, botY + 38);

        for (let i = 0; i < turns; i++) {
            const cx = xStart + i * pitch;
            arrowHead(cx + 10, botY + thick / 2 + 6, cx - 4, botY - thick / 2 - 6, '#fbbf24', 2.8);
            arrowHead(cx - 4, topY - thick / 2 - 6, cx + 10, topY + thick / 2 + 6, '#fbbf24', 2.8);
            const dt = (pulse + i * 0.14) % 1;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(cx + 10 - 14 * dt, botY + (thick / 2 + 6) * (1 - 2 * dt), 2.4, 0, Math.PI * 2);
            ctx.arc(cx - 4 + 14 * dt, topY - (thick / 2 + 6) * (1 - 2 * dt), 2.4, 0, Math.PI * 2);
            ctx.fill();
        }
        arrowHead(xStart - 4, botY - thick / 2 - 6, xStart - 4, topY + thick / 2 + 6, '#fbbf24', 2.6);
        const outX = xStart + (turns - 1) * pitch + 22;
        arrowHead(outX, topY - thick / 2, outX, topY - 46, '#f59e0b', 2.6);
        ctx.fillStyle = '#fbbf24';
        ctx.fillText('Dòng điện ra', outX + 10, topY - 26);

        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 18px "Be Vietnam Pro", sans-serif';
        ctx.fillText('A', ucX + armLen + 12, topY + 6);
        ctx.fillText('B', ucX + armLen + 12, botY + 6);

        // Khung phải: Hiển thị các thành phần cấu tạo (KHÔNG ghi đáp án tăng/giảm!)
        roundRect(512, 40, 250, 250, 12);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        ctx.fillStyle = '#e2e8f0';
        ctx.font = '800 14px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('CÁC ĐẠI LƯỢNG ĐẶC TRƯNG', 637, 74);

        const items = [
            { title: '1. Lõi sắt non hình chữ U', desc: 'Tập trung và tăng từ tính lõi', col: '#94a3b8' },
            { title: '2. Cường độ dòng điện (I)', desc: 'Dòng điện chạy qua cuộn dây', col: '#fbbf24' },
            { title: '3. Số vòng dây đồng (N)', desc: 'Mật độ vòng cuốn trên 2 nhánh', col: '#38bdf8' }
        ];
        items.forEach((it, idx) => {
            const ry = 94 + idx * 62;
            roundRect(528, ry, 218, 52, 8);
            ctx.fillStyle = 'rgba(30, 41, 59, 0.78)';
            ctx.fill();
            ctx.strokeStyle = 'rgba(148, 163, 184, 0.28)';
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.textAlign = 'left';
            ctx.fillStyle = it.col;
            ctx.font = '700 13px "Be Vietnam Pro", sans-serif';
            ctx.fillText(it.title, 540, ry + 21);
            ctx.fillStyle = '#cbd5e1';
            ctx.font = '600 12px "Be Vietnam Pro", sans-serif';
            ctx.fillText(it.desc, 540, ry + 40);
        });
    });

    // ==================== 12. MH-TN50-C3-505 ====================
    M.register('MH-TN50-C3-505', function (ctx, w, h, t) {
        function clearBg() {
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);
        }
        function roundRect(x, y, rw, rh, r) {
            ctx.beginPath();
            ctx.roundRect(x, y, rw, rh, r);
        }
        function drawMagnet(mx, my, label) {
            const mw = 36, mh = 70;
            // Nửa trên cực S (xanh), nửa dưới cực N (đỏ) đúng hệt q_505_0.jpg
            ctx.fillStyle = '#2563eb';
            ctx.fillRect(mx - mw / 2, my, mw, mh / 2);
            ctx.fillStyle = '#dc2626';
            ctx.fillRect(mx - mw / 2, my + mh / 2, mw, mh / 2);
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 2;
            ctx.strokeRect(mx - mw / 2, my, mw, mh);

            ctx.fillStyle = '#ffffff';
            ctx.font = '800 15px "Be Vietnam Pro", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('S', mx, my + 24);
            ctx.fillText('N', mx, my + 58);

            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 16px "Be Vietnam Pro", sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText(label, mx - mw / 2 - 12, my + 40);
        }

        clearBg();
        const saw = (t * 0.20) % 1;
        // Chỉ cho chuyển động đoạn khởi đầu trước khi qua vòng để KHÔNG lộ đáp án rơi trước/sau!
        const dropOffset = saw < 0.7 ? Math.pow(saw / 0.7, 2) * 28 : 28;

        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 14px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('THẢ 3 NAM CHÂM GIỐNG HỆT NHAU P, Q, R TỪ CÙNG ĐỘ CAO', 18, 26);

        roundRect(18, 40, 744, 250, 12);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        const cols = [
            { x: 168, label: 'P', desc: 'Rơi tự do (không vòng)', type: 'none' },
            { x: 396, label: 'Q', desc: 'Qua vòng dẫn KÍN', type: 'closed' },
            { x: 624, label: 'R', desc: 'Qua vòng có KHE HỞ', type: 'slit' }
        ];
        const groundY = 250;
        const startY = 66 + dropOffset;
        const ringY = 192;

        // Mặt đất
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2.8;
        ctx.beginPath();
        ctx.moveTo(76, groundY);
        ctx.lineTo(704, groundY);
        ctx.stroke();

        cols.forEach(c => {
            // Trục rơi đứt nét
            ctx.save();
            ctx.setLineDash([6, 5]);
            ctx.strokeStyle = 'rgba(148, 163, 184, 0.55)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(c.x, startY + 70);
            ctx.lineTo(c.x, groundY);
            ctx.stroke();
            ctx.restore();

            // Vạch chạm đất
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 2.4;
            ctx.beginPath();
            ctx.moveTo(c.x, groundY - 5);
            ctx.lineTo(c.x, groundY + 5);
            ctx.stroke();

            if (c.type === 'closed') {
                ctx.strokeStyle = '#f59e0b';
                ctx.lineWidth = 5;
                ctx.beginPath();
                ctx.ellipse(c.x, ringY, 44, 14, 0, 0, Math.PI * 2);
                ctx.stroke();
            } else if (c.type === 'slit') {
                // Vòng có khe hở cắt rõ nét ở phía trước
                ctx.strokeStyle = '#38bdf8';
                ctx.lineWidth = 5;
                ctx.beginPath();
                ctx.ellipse(c.x, ringY, 44, 14, 0, Math.PI * 0.62, Math.PI * 2.38);
                ctx.stroke();
                ctx.fillStyle = '#fb7185';
                ctx.font = '700 11.5px "Be Vietnam Pro", sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('Khe hở', c.x, ringY + 30);
            }

            drawMagnet(c.x, startY, c.label);

            ctx.fillStyle = '#cbd5e1';
            ctx.font = '700 13px "Be Vietnam Pro", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(c.desc, c.x, 274);
        });
    });

    // ==================== 13. MH-TN50-C3-521 ====================
    M.register('MH-TN50-C3-521', function (ctx, w, h, t) {
        function clearBg() {
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);
        }
        function roundRect(x, y, rw, rh, r) {
            ctx.beginPath();
            ctx.roundRect(x, y, rw, rh, r);
        }
        function arrow(x1, y1, x2, y2, color, lw) {
            const ang = Math.atan2(y2 - y1, x2 - x1);
            ctx.save();
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.lineWidth = lw || 2;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(x2 - 8 * Math.cos(ang - 0.36), y2 - 8 * Math.sin(ang - 0.36));
            ctx.lineTo(x2 - 8 * Math.cos(ang + 0.36), y2 - 8 * Math.sin(ang + 0.36));
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }

        clearBg();
        const activeIdx = Math.floor((t * 0.6) % 5);

        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 14px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('KHUNG DÂY MNPQ QUAY ĐỀU TRONG TỪ TRƯỜNG ĐỀU (VỊ TRÍ 1 → 5)', 18, 26);

        const specs = [
            { num: '1', edge: false, topL: 'Q', topR: 'P', botL: 'M', botR: 'N' },
            { num: '2', edge: true, top: 'Q', midL: 'M', midR: 'P', bot: 'N' },
            { num: '3', edge: false, topL: 'P', topR: 'Q', botL: 'N', botR: 'M' },
            { num: '4', edge: true, top: 'P', midL: 'N', midR: 'Q', bot: 'M' },
            { num: '5', edge: false, topL: 'Q', topR: 'P', botL: 'M', botR: 'N' }
        ];

        const cardW = 140, gap = 10, startX = 18;
        specs.forEach((sp, i) => {
            const cx = startX + i * (cardW + gap);
            const cy = 42, ch = 248;
            const isActive = (i === activeIdx);
            roundRect(cx, cy, cardW, ch, 10);
            ctx.fillStyle = isActive ? 'rgba(56, 189, 248, 0.12)' : 'rgba(15, 23, 42, 0.72)';
            ctx.fill();
            // MỌI VỊ TRÍ DÙNG CÙNG MÀU SCANNER TUẦN TỰ (không ưu tiên vị trí 2, 4!)
            ctx.strokeStyle = isActive ? '#38bdf8' : 'rgba(56, 189, 248, 0.28)';
            ctx.lineWidth = isActive ? 1.8 : 1.2;
            ctx.stroke();

            const midX = cx + cardW / 2 - 4, midY = cy + 134;

            // Mũi tên quay trên đỉnh
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(midX + 8, cy + 56, 14, Math.PI * 1.15, Math.PI * 1.92);
            ctx.stroke();
            arrow(midX + 18, cy + 48, midX + 22, cy + 54, '#38bdf8', 2);
            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 15px "Be Vietnam Pro", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(sp.num, cx + cardW / 2, cy + 28);

            // Trục quay nghiêng nhẹ như q_521_0.jpg
            ctx.save();
            ctx.setLineDash([4, 4]);
            ctx.strokeStyle = '#7dd3fc';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(midX + 16, midY - 78);
            ctx.lineTo(midX - 18, midY + 86);
            ctx.stroke();
            ctx.restore();

            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 2.4;
            if (!sp.edge) {
                const tl = { x: midX - 4, y: midY - 46 };
                const tr = { x: midX + 30, y: midY - 46 };
                const bl = { x: midX - 30, y: midY + 46 };
                const br = { x: midX + 4, y: midY + 46 };
                ctx.beginPath();
                ctx.moveTo(tl.x, tl.y);
                ctx.lineTo(tr.x, tr.y);
                ctx.lineTo(br.x, br.y);
                ctx.lineTo(bl.x + 20, br.y);
                ctx.lineTo(bl.x + 17, br.y + 18);
                ctx.moveTo(bl.x, bl.y);
                ctx.lineTo(bl.x + 10, bl.y);
                ctx.lineTo(bl.x + 7, bl.y + 18);
                ctx.moveTo(tl.x, tl.y);
                ctx.lineTo(bl.x, bl.y);
                ctx.stroke();

                ctx.fillStyle = '#e2e8f0';
                ctx.font = '700 13px "Be Vietnam Pro", sans-serif';
                ctx.fillText(sp.topL, tl.x - 10, tl.y - 2);
                ctx.fillText(sp.topR, tr.x + 10, tr.y - 2);
                ctx.fillText(sp.botL, bl.x - 11, bl.y + 4);
                ctx.fillText(sp.botR, br.x + 11, br.y + 4);
            } else {
                const top = { x: midX + 10, y: midY - 56 };
                const ml = { x: midX - 16, y: midY + 34 };
                const mr = { x: midX + 20, y: midY - 12 };
                const bot = { x: midX - 6, y: midY + 62 };
                ctx.beginPath();
                ctx.moveTo(top.x, top.y);
                ctx.lineTo(mr.x, mr.y);
                ctx.lineTo(bot.x + 4, bot.y);
                ctx.moveTo(top.x, top.y);
                ctx.lineTo(ml.x, ml.y);
                ctx.lineTo(bot.x - 6, bot.y - 6);
                ctx.stroke();

                ctx.fillStyle = '#e2e8f0';
                ctx.font = '700 13px "Be Vietnam Pro", sans-serif';
                ctx.fillText(sp.top, top.x - 10, top.y - 4);
                ctx.fillText(sp.midL, ml.x - 12, ml.y + 4);
                ctx.fillText(sp.midR, mr.x + 11, mr.y - 10);
                ctx.fillText(sp.bot, bot.x + 12, bot.y + 10);
            }

            // Vecto cảm ứng từ B nằm ngang từ tâm khung sang phải (chữ B đặt dưới mũi tên để không đụng chữ P/Q)
            arrow(midX, midY, midX + 46, midY, '#f59e0b', 2.4);
            ctx.fillStyle = '#fbbf24';
            ctx.font = '800 13px "Be Vietnam Pro", sans-serif';
            ctx.fillText('B', midX + 36, midY + 18);

            ctx.fillStyle = '#94a3b8';
            ctx.font = '700 12px "Be Vietnam Pro", sans-serif';
            ctx.fillText('Vị trí ' + sp.num, cx + cardW / 2, cy + 234);
        });
    });

    // ==================== 14. MH-TN50-C3-522 ====================
    M.register('MH-TN50-C3-522', function (ctx, w, h, t) {
        function clearBg() {
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);
        }
        function roundRect(x, y, rw, rh, r) {
            ctx.beginPath();
            ctx.roundRect(x, y, rw, rh, r);
        }
        function arrow(x1, y1, x2, y2, color, lw) {
            const ang = Math.atan2(y2 - y1, x2 - x1);
            ctx.save();
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.lineWidth = lw || 2.4;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(x2 - 9 * Math.cos(ang - 0.36), y2 - 9 * Math.sin(ang - 0.36));
            ctx.lineTo(x2 - 9 * Math.cos(ang + 0.36), y2 - 9 * Math.sin(ang + 0.36));
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }

        clearBg();
        const saw = (t * 0.22) % 1;
        const moveLeft = saw < 0.8 ? (saw / 0.8) * 62 : 62;

        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 14px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('DỊCH CHUYỂN THANH NAM CHÂM RA XA ỐNG DÂY (CẢM ỨNG ĐIỆN TỪ)', 18, 26);

        roundRect(18, 40, 744, 250, 12);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        // Thanh nam châm S (trái) - N (phải) dịch chuyển sang trái ra xa ống dây
        const magX = 122 - moveLeft, magY = 124, magW = 152, magH = 38;
        arrow(magX + magW - 14, magY - 18, magX + 14, magY - 18, '#fbbf24', 2.8);
        ctx.fillStyle = '#fbbf24';
        ctx.font = '700 12.5px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Ra xa ống dây', magX + magW / 2, magY - 28);

        ctx.fillStyle = '#2563eb';
        ctx.fillRect(magX, magY, magW / 2, magH);
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(magX + magW / 2, magY, magW / 2, magH);
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 2;
        ctx.strokeRect(magX, magY, magW, magH);
        ctx.fillStyle = '#ffffff';
        ctx.font = '800 18px "Be Vietnam Pro", sans-serif';
        ctx.fillText('S', magX + magW * 0.25, magY + 25);
        ctx.fillText('N', magX + magW * 0.75, magY + 25);

        // Ống dây đầu 1 (trái) - đầu 2 (phải) nối điện kế 0 (tuyệt đối KHÔNG vẽ chiều dòng cảm ứng hay N/S trên ống!)
        const coilL = 340, coilR = 665, coilCy = 143, rx = 18, ry = 44;
        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 18px "Be Vietnam Pro", sans-serif';
        ctx.fillText('1', coilL - 18, coilCy - 46);
        ctx.fillText('2', coilR + 18, coilCy - 46);

        // Mạch điện dưới nối điện kế
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.moveTo(coilL - 14, coilCy - 18);
        ctx.lineTo(coilL - 14, 240);
        ctx.lineTo(coilR + 10, 240);
        ctx.lineTo(coilR + 10, coilCy - 18);
        ctx.stroke();

        // Nét đứt nửa sau + nét liền nửa trước các vòng dây
        for (let k = 0; k < 9; k++) {
            const cx = coilL + 16 + k * 36;
            ctx.save();
            ctx.setLineDash([4, 4]);
            ctx.strokeStyle = 'rgba(203, 213, 225, 0.55)';
            ctx.lineWidth = 2.4;
            ctx.beginPath();
            ctx.ellipse(cx, coilCy, rx, ry, 0, Math.PI * 0.5, Math.PI * 1.5);
            ctx.stroke();
            ctx.restore();

            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 2.8;
            ctx.beginPath();
            ctx.ellipse(cx, coilCy, rx, ry, 0, -Math.PI * 0.5, Math.PI * 0.5);
            ctx.stroke();
        }

        // Điện kế trung tâm
        const gx = (coilL + coilR) / 2, gy = 240, gr = 28;
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(gx, gy, gr, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.4;
        ctx.stroke();
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '800 13px "Be Vietnam Pro", sans-serif';
        ctx.fillText('0', gx + 4, gy - 10);
        // Kim điện kế lệch khi thanh nam châm đang chuyển động (theo q_522_0.jpg)
        arrow(gx + 3, gy + 14, gx - 12, gy - 12, '#ef4444', 2.4);
    });

    // ==================== 15. MH-TN50-C3-526 ====================
    M.register('MH-TN50-C3-526', function (ctx, w, h, t) {
        function clearBg() {
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);
        }
        function roundRect(x, y, rw, rh, r) {
            ctx.beginPath();
            ctx.roundRect(x, y, rw, rh, r);
        }

        clearBg();
        const idleSway = Math.sin(t * 2.2) * 0.015;

        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 14px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('ỐNG DÂY ĐIỆN TỪ (CÔNG TẮC ĐANG MỞ) & KIM NAM CHÂM TREO', 18, 26);

        roundRect(18, 40, 744, 250, 12);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        // Lõi sắt bên trái + cuộn dây vàng (công tắc K giữ MỞ để không lộ đáp án!)
        const coreX = 68, coreY = 122, coreW = 350, coreH = 34;
        const gradCore = ctx.createLinearGradient(0, coreY, 0, coreY + coreH);
        gradCore.addColorStop(0, '#475569');
        gradCore.addColorStop(0.5, '#cbd5e1');
        gradCore.addColorStop(1, '#475569');
        ctx.fillStyle = gradCore;
        ctx.fillRect(coreX, coreY, coreW, coreH);

        // 15 vòng dây đồng mặt trước
        for (let i = 0; i < 15; i++) {
            const wx = coreX + 38 + i * 18;
            ctx.fillStyle = '#eab308';
            roundRect(wx, coreY - 6, 9, coreH + 12, 4);
            ctx.fill();
            ctx.strokeStyle = '#92400e';
            ctx.lineWidth = 1.2;
            ctx.stroke();
        }

        // Mạch điện dưới: công tắc MỞ (bên trái) và nguồn 1 chiều (bản DÀI trái = +, bản NGẮN phải = -)
        const wireL = coreX + 42, wireR = coreX + 38 + 14 * 18 + 6, wireBot = 242;
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.moveTo(wireL, coreY + coreH + 6);
        ctx.lineTo(wireL, wireBot);
        ctx.lineTo(186, wireBot);
        ctx.moveTo(234, wireBot);
        ctx.lineTo(286, wireBot);
        ctx.moveTo(298, wireBot);
        ctx.lineTo(wireR, wireBot);
        ctx.lineTo(wireR, coreY + coreH + 6);
        ctx.stroke();

        // Tiếp điểm công tắc đang MỞ
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(186, wireBot, 4.5, 0, Math.PI * 2);
        ctx.arc(234, wireBot, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(186, wireBot);
        ctx.lineTo(228, wireBot - 22);
        ctx.stroke();
        ctx.fillStyle = '#fbbf24';
        ctx.font = '700 12.5px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Công tắc (đang mở)', 210, wireBot + 24);

        // Nguồn điện 1 chiều (đúng cực q_526_0.jpg: bản dài trái = +, bản ngắn phải = -)
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.moveTo(286, wireBot - 20);
        ctx.lineTo(286, wireBot + 20);
        ctx.stroke();
        ctx.lineWidth = 4.6;
        ctx.beginPath();
        ctx.moveTo(298, wireBot - 11);
        ctx.lineTo(298, wireBot + 11);
        ctx.stroke();
        ctx.fillStyle = '#ef4444';
        ctx.font = '800 13px "Be Vietnam Pro", sans-serif';
        ctx.fillText('+', 274, wireBot - 16);
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('−', 310, wireBot - 16);

        // Kim nam châm treo bên phải (giữ đứng yên cân bằng vì công tắc mở!)
        const supX = 588, supY = 76;
        ctx.fillStyle = '#64748b';
        ctx.fillRect(supX - 70, supY - 8, 140, 8);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(supX, supY);
        ctx.lineTo(supX, 188);
        ctx.stroke();

        ctx.save();
        ctx.translate(supX, 188);
        ctx.rotate(idleSway);
        // Nửa trái cực N (đỏ), nửa phải cực S (xanh) đúng q_526_0.jpg
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.moveTo(-102, 0);
        ctx.lineTo(0, -24);
        ctx.lineTo(0, 24);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#2563eb';
        ctx.beginPath();
        ctx.moveTo(102, 0);
        ctx.lineTo(0, -24);
        ctx.lineTo(0, 24);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(-102, 0);
        ctx.lineTo(0, -24);
        ctx.lineTo(102, 0);
        ctx.lineTo(0, 24);
        ctx.closePath();
        ctx.stroke();

        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 17px "Be Vietnam Pro", sans-serif';
        ctx.fillText('N', -106, -16);
        ctx.fillText('S', 106, -16);
        ctx.restore();
    });

    // ==================== 16. MH-TN50-C3-546 ====================
    M.register('MH-TN50-C3-546', function (ctx, w, h, t) {
        function clearBg() {
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);
        }
        function roundRect(x, y, rw, rh, r) {
            ctx.beginPath();
            ctx.roundRect(x, y, rw, rh, r);
        }
        function arrow(x1, y1, x2, y2, color, lw) {
            const ang = Math.atan2(y2 - y1, x2 - x1);
            ctx.save();
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.lineWidth = lw || 2.4;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(x2 - 9 * Math.cos(ang - 0.36), y2 - 9 * Math.sin(ang - 0.36));
            ctx.lineTo(x2 - 9 * Math.cos(ang + 0.36), y2 - 9 * Math.sin(ang + 0.36));
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }

        clearBg();
        const theta = (t * 1.8) % (Math.PI * 2);

        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 14px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('VÒNG DÂY (C) QUAY QUANH TRỤC ĐỐI XỨNG SONG SONG VỚI Oy', 18, 26);

        roundRect(18, 40, 744, 250, 12);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        // Đường sức từ dọc trục nam châm xuyên đối xứng qua vòng (C)
        const loopCx = 368, loopCy = 166;
        ctx.save();
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
        ctx.lineWidth = 1.5;
        [-30, 0, 30].forEach(dy => {
            ctx.beginPath();
            ctx.moveTo(270, loopCy + dy);
            ctx.lineTo(445, loopCy + dy);
            ctx.stroke();
        });
        ctx.restore();

        // Nửa sau vòng dây (C)
        ctx.strokeStyle = 'rgba(96, 165, 250, 0.7)';
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.ellipse(loopCx, loopCy, 34, 72, 0, Math.PI * 0.5, Math.PI * 1.5);
        ctx.stroke();

        // Thanh nam châm thẳng N (đỏ) - S (xanh) song song trục Oy
        const mx = 104, my = 144, mw = 264, mh = 44;
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(mx, my, mw * 0.5, mh);
        ctx.fillStyle = '#2563eb';
        ctx.fillRect(mx + mw * 0.5, my, mw * 0.5, mh);
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 2;
        ctx.strokeRect(mx, my, mw, mh);
        ctx.fillStyle = '#ffffff';
        ctx.font = '800 20px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('N', mx + mw * 0.25, my + 29);
        ctx.fillText('S', mx + mw * 0.75, my + 29);

        // Nửa trước vòng dây (C)
        ctx.strokeStyle = '#60a5fa';
        ctx.lineWidth = 3.8;
        ctx.beginPath();
        ctx.ellipse(loopCx, loopCy, 34, 72, 0, -Math.PI * 0.5, Math.PI * 0.5);
        ctx.stroke();

        // Điểm đánh dấu quay đều trên vành vòng (C) quanh trục đối xứng
        for (let k = 0; k < 4; k++) {
            const ang = theta + k * Math.PI / 2;
            const px = loopCx + 34 * Math.cos(ang);
            const py = loopCy + 72 * Math.sin(ang);
            ctx.fillStyle = Math.cos(ang) >= 0 ? '#fbbf24' : 'rgba(251, 191, 36, 0.45)';
            ctx.beginPath();
            ctx.arc(px, py, 4.4, 0, Math.PI * 2);
            ctx.fill();
        }

        // Mũi tên chiều dương (+)
        ctx.strokeStyle = '#60a5fa';
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.arc(loopCx + 24, loopCy - 46, 36, -0.35, -1.25, true);
        ctx.stroke();
        arrow(loopCx + 42, loopCy - 72, loopCx + 32, loopCy - 80, '#60a5fa', 2.4);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 18px "Be Vietnam Pro", sans-serif';
        ctx.fillText('+', loopCx + 16, loopCy - 84);
        ctx.fillText('(C)', loopCx + 30, loopCy + 96);

        // Hệ trục tọa độ Oxyz bên phải (đúng chuẩn q_546_0.jpg)
        const ox = 524, oy = 166;
        arrow(ox, oy, ox, oy - 90, '#60a5fa', 2.8);
        arrow(ox, oy, ox + 150, oy, '#60a5fa', 2.8);
        arrow(ox, oy, ox + 78, oy + 78, '#60a5fa', 2.8);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 17px "Be Vietnam Pro", sans-serif';
        ctx.fillText('O', ox - 18, oy + 6);
        ctx.fillText('z', ox + 16, oy - 80);
        ctx.fillText('y', ox + 146, oy - 14);
        ctx.fillText('x', ox + 66, oy + 86);
    });

    // ==================== 17. MH-TN50-C3-528 ====================
    M.register('MH-TN50-C3-528', function (ctx, w, h, t) {
        function clearBg() {
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);
        }
        function roundRect(x, y, rw, rh, r) {
            ctx.beginPath();
            ctx.roundRect(x, y, rw, rh, r);
        }
        function arrow(x1, y1, x2, y2, color, lw) {
            const ang = Math.atan2(y2 - y1, x2 - x1);
            ctx.save();
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.lineWidth = lw || 2;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(x2 - 8 * Math.cos(ang - 0.36), y2 - 8 * Math.sin(ang - 0.36));
            ctx.lineTo(x2 - 8 * Math.cos(ang + 0.36), y2 - 8 * Math.sin(ang + 0.36));
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }

        clearBg();
        const saw = (t * 0.22) % 1;
        const curI = 0.4 + 3.6 * saw;
        const curF = 2.0 * curI; // F(10^-3 N) = 2*I

        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 14px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('BỘ THÍ NGHIỆM ĐO CẢM ỨNG TỪ B (l = 10 cm) & ĐỒ THỊ F(I)', 18, 26);

        // Khung trái: Cân điện tử + Khối nam châm chữ U + Đoạn dây 10 cm giữ cố định
        roundRect(18, 40, 344, 250, 12);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        // Đế bàn thí nghiệm & cân điện tử
        ctx.fillStyle = '#334155';
        ctx.fillRect(58, 212, 264, 18);
        ctx.fillStyle = '#475569';
        ctx.fillRect(88, 174, 204, 38);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(142, 182, 96, 22);
        ctx.fillStyle = '#10b981';
        ctx.font = '800 13px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText((curF * 0.102).toFixed(2) + ' g', 190, 198);

        // Đĩa cân & Khối nam châm
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(102, 166, 176, 8);
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(128, 108, 124, 24);
        ctx.fillStyle = '#2563eb';
        ctx.fillRect(128, 142, 124, 24);
        ctx.fillStyle = '#ffffff';
        ctx.font = '800 12px "Be Vietnam Pro", sans-serif';
        ctx.fillText('N', 190, 124);
        ctx.fillText('S', 190, 158);

        // Hai trụ giá cách điện & đoạn dây dẫn l = 10 cm đi qua khe giữa hai cực
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(72, 104, 8, 108);
        ctx.fillRect(300, 104, 8, 108);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(76, 137);
        ctx.lineTo(304, 137);
        ctx.stroke();

        // Xung dòng điện I chạy dọc đoạn dây
        const px = 86 + ((t * 0.9) % 1) * 204;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(px, 137, 3.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#cbd5e1';
        ctx.font = '700 12.5px "Be Vietnam Pro", sans-serif';
        ctx.fillText('Dây dẫn l = 10 cm đặt trong từ trường', 190, 74);
        ctx.fillStyle = '#fbbf24';
        ctx.fillText('Cường độ I = ' + curI.toFixed(1) + ' A', 190, 260);

        // Khung phải: Đồ thị F(10^-3 N) theo I(A) đúng chuẩn q_528_0.jpg
        roundRect(376, 40, 386, 250, 12);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        const ox = 442, oy = 250, ux = 62, uy = 30;
        ctx.save();
        ctx.setLineDash([4, 3]);
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
        ctx.lineWidth = 1;
        for (let gx = 0.5; gx <= 4.2; gx += 0.5) {
            ctx.beginPath();
            ctx.moveTo(ox + gx * ux, oy);
            ctx.lineTo(ox + gx * ux, oy - 5 * uy);
            ctx.stroke();
        }
        for (let gy = 0.5; gy <= 5; gy += 0.5) {
            ctx.beginPath();
            ctx.moveTo(ox, oy - gy * uy);
            ctx.lineTo(ox + 4.25 * ux, oy - gy * uy);
            ctx.stroke();
        }
        ctx.restore();

        arrow(ox, oy, ox, oy - 5.55 * uy, '#e2e8f0', 2.2);
        arrow(ox, oy, ox + 4.6 * ux, oy, '#e2e8f0', 2.2);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 12.5px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('F (×10⁻³ N)', ox + 8, oy - 5.3 * uy);
        ctx.textAlign = 'center';
        ctx.fillText('I (A)', ox + 4.45 * ux, oy + 24);
        ctx.fillText('0', ox - 10, oy + 14);

        ['2,0', '4,0', '6,0', '8,0', '10,0'].forEach((lbl, idx) => {
            ctx.textAlign = 'right';
            ctx.fillStyle = '#94a3b8';
            ctx.font = '700 11.5px "Be Vietnam Pro", sans-serif';
            ctx.fillText(lbl, ox - 8, oy - (idx + 1) * uy + 4);
        });
        ['1,0', '2,0', '3,0', '4,0'].forEach((lbl, idx) => {
            ctx.textAlign = 'center';
            ctx.fillStyle = '#94a3b8';
            ctx.fillText(lbl, ox + (idx + 1) * ux, oy + 18);
        });

        // Đường thẳng tuyến tính F = 2I và 4 điểm đo thực nghiệm
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.8;
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(ox + 4.2 * ux, oy - 4.2 * uy);
        ctx.stroke();
        [1, 2, 3, 4].forEach(k => {
            ctx.fillStyle = '#f8fafc';
            ctx.beginPath();
            ctx.arc(ox + k * ux, oy - k * uy, 4.2, 0, Math.PI * 2);
            ctx.fill();
        });

        // Điểm quét trực quan đồng bộ với I
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(ox + curI * ux, oy - (curF / 2) * uy, 5.8, 0, Math.PI * 2);
        ctx.fill();
    });

    // ==================== 18. MH-TN50-C3-535 ====================
    M.register('MH-TN50-C3-535', function (ctx, w, h, t) {
        function clearBg() {
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);
        }
        function roundRect(x, y, rw, rh, r) {
            ctx.beginPath();
            ctx.roundRect(x, y, rw, rh, r);
        }
        function arrow(x1, y1, x2, y2, color, lw) {
            const ang = Math.atan2(y2 - y1, x2 - x1);
            ctx.save();
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.lineWidth = lw || 2.4;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(x2 - 9 * Math.cos(ang - 0.36), y2 - 9 * Math.sin(ang - 0.36));
            ctx.lineTo(x2 - 9 * Math.cos(ang + 0.36), y2 - 9 * Math.sin(ang + 0.36));
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
        function drawFieldCrosses(sx, sy, cols, rows, step) {
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
            ctx.lineWidth = 1.8;
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const cx = sx + c * step;
                    const cy = sy + r * step;
                    ctx.beginPath();
                    ctx.moveTo(cx - 5, cy - 5);
                    ctx.lineTo(cx + 5, cy + 5);
                    ctx.moveTo(cx + 5, cy - 5);
                    ctx.lineTo(cx - 5, cy + 5);
                    ctx.stroke();
                }
            }
        }

        clearBg();
        const saw = (t * 0.20) % 1;
        const morph = saw < 0.75 ? saw / 0.75 : 1;

        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 14px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('BIẾN DẠNG KHUNG DÂY TỪ HÌNH VUÔNG SANG HÌNH TRÒN TRONG B = 0,6 T', 18, 26);

        // Khung trái: Hình vuông cạnh a = 15,7 cm
        roundRect(18, 40, 290, 250, 12);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        drawFieldCrosses(68, 74, 6, 5, 38);
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 3.2;
        ctx.strokeRect(112, 98, 102, 102);
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '700 13px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Hình vuông (a = 15,7 cm)', 163, 272);

        // Vùng giữa: Mô phỏng khung dây đang uốn liên tục sau 0,5 s (không vẽ chiều dòng cảm ứng!)
        const midCx = 390, midCy = 148;
        arrow(320, 198, 460, 198, '#38bdf8', 2.6);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 13.5px "Be Vietnam Pro", sans-serif';
        ctx.fillText('sau 0,5 s', midCx, 188);

        // Đa giác nội suy mượt từ vuông -> tròn có cùng chu vi
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.beginPath();
        const rCircle = 42, rSquare = rCircle * Math.PI / 4;
        for (let k = 0; k <= 64; k++) {
            const ang = (k / 64) * Math.PI * 2;
            const c = Math.cos(ang), s = Math.sin(ang);
            const rSq = rSquare / Math.max(Math.abs(c), Math.abs(s));
            const rr = rSq * (1 - morph) + rCircle * morph;
            const px = midCx + rr * c;
            const py = midCy - 26 + rr * s;
            if (k === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();

        // Khung phải: Hình tròn lúc sau
        roundRect(472, 40, 290, 250, 12);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        drawFieldCrosses(522, 74, 6, 5, 38);
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.arc(617, 150, 56, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = '#e2e8f0';
        ctx.fillText('Hình tròn (cùng chu vi)', 617, 272);
    });

    // ==================== 19. MH-TN50-C3-538 ====================
    M.register('MH-TN50-C3-538', function (ctx, w, h, t) {
        function clearBg() {
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);
        }
        function roundRect(x, y, rw, rh, r) {
            ctx.beginPath();
            ctx.roundRect(x, y, rw, rh, r);
        }
        function arrow(x1, y1, x2, y2, color, lw) {
            const ang = Math.atan2(y2 - y1, x2 - x1);
            ctx.save();
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.lineWidth = lw || 2.4;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(x2 - 8 * Math.cos(ang - 0.36), y2 - 8 * Math.sin(ang - 0.36));
            ctx.lineTo(x2 - 8 * Math.cos(ang + 0.36), y2 - 8 * Math.sin(ang + 0.36));
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }

        clearBg();
        const saw = (t * 0.35) % 1;

        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 14px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('KHUNG DÂY TAM GIÁC VUÔNG CÂN ADC CÓ DÒNG ĐIỆN I = 5 A', 18, 26);

        // Khung trái: Hình tam giác ADC đúng chuẩn q_538_0.jpg
        roundRect(18, 40, 440, 250, 12);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        const Ax = 132, Ay = 248;
        const Dx = 132, Dy = 78;
        const Cx = 332, Cy = 248;

        // Khung tam giác ADC
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 3.4;
        ctx.beginPath();
        ctx.moveTo(Ax, Ay);
        ctx.lineTo(Dx, Dy);
        ctx.lineTo(Cx, Cy);
        ctx.closePath();
        ctx.stroke();

        // Ký hiệu góc vuông tại A
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2;
        ctx.strokeRect(Ax, Ay - 18, 18, 18);

        // Mũi tên chiều dòng điện C -> A -> D -> C
        arrow(Cx - 70, Cy, Ax + 70, Ay, '#f59e0b', 2.8);
        arrow(Ax, Ay - 55, Dx, Dy + 55, '#f59e0b', 2.8);
        arrow(Dx + 72, Dy + 61, Cx - 72, Cy - 61, '#f59e0b', 2.8);

        // Hạt xung dòng điện chạy dọc C -> A -> D -> C
        const perimPts = [
            { x: Cx, y: Cy },
            { x: Ax, y: Ay },
            { x: Dx, y: Dy }
        ];
        const segLens = [200, 170, Math.hypot(Cx - Dx, Cy - Dy)];
        const totalL = segLens[0] + segLens[1] + segLens[2];
        for (let p = 0; p < 6; p++) {
            let d = ((saw + p / 6) % 1) * totalL;
            let px, py;
            if (d < segLens[0]) {
                const k = d / segLens[0];
                px = Cx + (Ax - Cx) * k;
                py = Cy;
            } else if (d < segLens[0] + segLens[1]) {
                const k = (d - segLens[0]) / segLens[1];
                px = Ax;
                py = Ay + (Dy - Ay) * k;
            } else {
                const k = (d - segLens[0] - segLens[1]) / segLens[2];
                px = Dx + (Cx - Dx) * k;
                py = Dy + (Cy - Dy) * k;
            }
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(px, py, 3, 0, Math.PI * 2);
            ctx.fill();
        }

        // Ký hiệu từ trường ⊕ B ở giữa tam giác giống hệt q_538_0.jpg
        const bx = 205, by = 198;
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.arc(bx, by, 14, 0, Math.PI * 2);
        ctx.moveTo(bx - 8, by);
        ctx.lineTo(bx + 8, by);
        ctx.moveTo(bx, by - 8);
        ctx.lineTo(bx, by + 8);
        ctx.stroke();
        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 17px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('B', bx + 20, by + 12);
        arrow(bx + 18, by - 6, bx + 32, by - 6, '#38bdf8', 1.8);

        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 16px "Be Vietnam Pro", sans-serif';
        ctx.fillText('D', Dx - 22, Dy + 6);
        ctx.fillText('A', Ax - 22, Ay + 6);
        ctx.fillText('C', Cx + 10, Cy + 6);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '700 12.5px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('AD = AC = 20 cm', 232, 276);

        // Khung phải: Thông số bài toán (Zero Leakage: không tính lực hay hiện 0,1 N!)
        roundRect(472, 40, 290, 250, 12);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        ctx.fillStyle = '#e2e8f0';
        ctx.font = '800 14px "Be Vietnam Pro", sans-serif';
        ctx.fillText('DỮ KIỆN THÍ NGHIỆM', 617, 74);

        const rows = [
            '• Cảm ứng từ đều: B = 0,1 T',
            '• B vuông góc mặt phẳng (ADC)',
            '• Cạnh góc vuông: AD = AC = 20 cm',
            '• Dòng điện: I = 5 A (C → A → D → C)',
            '• Cần tính: Độ lớn lực từ trên AC'
        ];
        rows.forEach((txt, idx) => {
            roundRect(490, 92 + idx * 36, 254, 29, 6);
            ctx.fillStyle = 'rgba(30, 41, 59, 0.75)';
            ctx.fill();
            ctx.textAlign = 'left';
            ctx.fillStyle = idx === 4 ? '#fbbf24' : '#cbd5e1';
            ctx.font = '700 12.5px "Be Vietnam Pro", sans-serif';
            ctx.fillText(txt, 502, 111 + idx * 36);
        });
    });

    // ==================== 20. MH-TN50-C3-539 ====================
    M.register('MH-TN50-C3-539', function (ctx, w, h, t) {
        function clearBg() {
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);
        }
        function roundRect(x, y, rw, rh, r) {
            ctx.beginPath();
            ctx.roundRect(x, y, rw, rh, r);
        }
        function arrow(x1, y1, x2, y2, color, lw) {
            const ang = Math.atan2(y2 - y1, x2 - x1);
            ctx.save();
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.lineWidth = lw || 2.4;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(x2 - 8 * Math.cos(ang - 0.36), y2 - 8 * Math.sin(ang - 0.36));
            ctx.lineTo(x2 - 8 * Math.cos(ang + 0.36), y2 - 8 * Math.sin(ang + 0.36));
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }

        clearBg();
        const saw = (t * 0.35) % 1;

        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 14px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('KHUNG DÂY TAM GIÁC TỰ DO ADC ĐẶT TRONG TỪ TRƯỜNG ĐỀU', 18, 26);

        roundRect(18, 40, 440, 250, 12);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        const Ax = 132, Ay = 248, Dx = 132, Dy = 78, Cx = 332, Cy = 248;

        // Vẽ khung dây cứng không biến dạng hay vẽ lực F (Zero Data Leakage!)
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 3.4;
        ctx.beginPath();
        ctx.moveTo(Ax, Ay);
        ctx.lineTo(Dx, Dy);
        ctx.lineTo(Cx, Cy);
        ctx.closePath();
        ctx.stroke();

        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2;
        ctx.strokeRect(Ax, Ay - 18, 18, 18);

        arrow(Cx - 70, Cy, Ax + 70, Ay, '#f59e0b', 2.8);
        arrow(Ax, Ay - 55, Dx, Dy + 55, '#f59e0b', 2.8);
        arrow(Dx + 72, Dy + 61, Cx - 72, Cy - 61, '#f59e0b', 2.8);

        const segLens = [200, 170, Math.hypot(Cx - Dx, Cy - Dy)];
        const totalL = segLens[0] + segLens[1] + segLens[2];
        for (let p = 0; p < 6; p++) {
            let d = ((saw + p / 6) % 1) * totalL;
            let px, py;
            if (d < segLens[0]) {
                px = Cx + (Ax - Cx) * (d / segLens[0]);
                py = Cy;
            } else if (d < segLens[0] + segLens[1]) {
                px = Ax;
                py = Ay + (Dy - Ay) * ((d - segLens[0]) / segLens[1]);
            } else {
                const k = (d - segLens[0] - segLens[1]) / segLens[2];
                px = Dx + (Cx - Dx) * k;
                py = Dy + (Cy - Dy) * k;
            }
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(px, py, 3, 0, Math.PI * 2);
            ctx.fill();
        }

        const bx = 205, by = 198;
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.arc(bx, by, 14, 0, Math.PI * 2);
        ctx.moveTo(bx - 8, by);
        ctx.lineTo(bx + 8, by);
        ctx.moveTo(bx, by - 8);
        ctx.lineTo(bx, by + 8);
        ctx.stroke();
        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 17px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('B', bx + 20, by + 12);
        arrow(bx + 18, by - 6, bx + 32, by - 6, '#38bdf8', 1.8);

        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 16px "Be Vietnam Pro", sans-serif';
        ctx.fillText('D', Dx - 22, Dy + 6);
        ctx.fillText('A', Ax - 22, Ay + 6);
        ctx.fillText('C', Cx + 10, Cy + 6);

        // Khung phải: Trạng thái câu hỏi (không tiết lộ phình to hay co nhỏ!)
        roundRect(472, 40, 290, 250, 12);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        ctx.fillStyle = '#e2e8f0';
        ctx.font = '800 14px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('XÉT TÁC DỤNG TỪ TRƯỜNG LÊN KHUNG', 617, 74);

        const notes = [
            '1. Khung kín ADC gồm 3 đoạn thẳng',
            '   CA, AD và DC đặt hoàn toàn trong B.',
            '2. Bỏ qua trọng lượng, khung hoàn toàn tự do.',
            '3. Xác định hợp lực từ tổng cộng và',
            '   hướng lực từ trên từng cạnh khung.'
        ];
        ctx.textAlign = 'left';
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '600 13px "Be Vietnam Pro", sans-serif';
        notes.forEach((line, i) => {
            ctx.fillText(line, 492, 114 + i * 32);
        });
    });

    // ==================== 21. MH-TN50-C3-531 ====================
    M.register('MH-TN50-C3-531', function (ctx, w, h, t) {
        function clearBg() {
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);
        }
        function roundRect(x, y, rw, rh, r) {
            ctx.beginPath();
            ctx.roundRect(x, y, rw, rh, r);
        }

        clearBg();
        const saw = (t * 0.25) % 1;
        const alphaB = 0.38 + 0.55 * saw;

        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 14px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('KHUNG TRÒN NỘI TIẾP KHUNG VUÔNG TRONG TỪ TRƯỜNG ĐỀU TĂNG ĐỀU', 18, 26);

        roundRect(18, 40, 744, 250, 12);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        // Lưới dấu × từ trường B hướng vào mặt phẳng trang giấy (5x5 giống q_531_0.png)
        const gx0 = 104, gy0 = 72, step = 46;
        ctx.strokeStyle = 'rgba(56, 189, 248,' + alphaB.toFixed(2) + ')';
        ctx.lineWidth = 2 + saw * 1.4;
        for (let r = 0; r < 5; r++) {
            for (let c = 0; c < 5; c++) {
                const x = gx0 + c * step;
                const y = gy0 + r * step;
                ctx.beginPath();
                ctx.moveTo(x - 6, y - 6);
                ctx.lineTo(x + 6, y + 6);
                ctx.moveTo(x + 6, y - 6);
                ctx.lineTo(x - 6, y + 6);
                ctx.stroke();
            }
        }

        // Khung vuông cạnh a = 3 * step, khung tròn đường kính d = a nội tiếp tiếp xúc 4 cạnh
        const sqSize = 3 * step;
        const sqX = gx0 + 0.5 * step;
        const sqY = gy0 + 0.5 * step;
        const cx = sqX + sqSize / 2;
        const cy = sqY + sqSize / 2;

        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 3.2;
        ctx.strokeRect(sqX, sqY, sqSize, sqSize);

        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.arc(cx, cy, sqSize / 2, 0, Math.PI * 2);
        ctx.stroke();

        // Chú thích bên phải (tuyệt đối KHÔNG lộ tỷ số 1:1!)
        ctx.textAlign = 'left';
        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 15px "Be Vietnam Pro", sans-serif';
        ctx.fillText('Từ trường đều hướng vào', 392, 108);
        ctx.fillText('trong mặt phẳng trang giấy', 392, 132);

        roundRect(392, 154, 336, 106, 10);
        ctx.fillStyle = 'rgba(30, 41, 59, 0.78)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
        ctx.lineWidth = 1.1;
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.font = '700 13px "Be Vietnam Pro", sans-serif';
        ctx.fillText('• Cùng chất liệu dây dẫn kim loại (ρ, s giống nhau)', 406, 182);
        ctx.fillStyle = '#fbbf24';
        ctx.fillText('• Cạnh hình vuông = Đường kính hình tròn (a = 2R)', 406, 208);
        ctx.fillStyle = '#cbd5e1';
        ctx.fillText('• Mật độ từ thông B đang tăng đều theo t', 406, 234);
    });

    // ==================== 22. MH-TN50-C3-533 ====================
    M.register('MH-TN50-C3-533', function (ctx, w, h, t) {
        function clearBg() {
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);
        }
        function roundRect(x, y, rw, rh, r) {
            ctx.beginPath();
            ctx.roundRect(x, y, rw, rh, r);
        }
        function arrow(x1, y1, x2, y2, color, lw) {
            const ang = Math.atan2(y2 - y1, x2 - x1);
            ctx.save();
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.lineWidth = lw || 2;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(x2 - 8 * Math.cos(ang - 0.36), y2 - 8 * Math.sin(ang - 0.36));
            ctx.lineTo(x2 - 8 * Math.cos(ang + 0.36), y2 - 8 * Math.sin(ang + 0.36));
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }

        clearBg();
        const saw = (t * 0.20) % 1;
        const curT = saw;
        const curB = 0.5 * curT;

        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 14px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('VÒNG DÂY KÍN S = 50 dm² (B // n) & ĐỒ THỊ CẢM ỨNG TỪ B(t)', 18, 26);

        // Khung trái: Vòng dây đặt vuông góc các đường sức B (B song song n)
        roundRect(18, 40, 316, 250, 12);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        ctx.fillStyle = '#94a3b8';
        ctx.font = '700 12.5px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Vòng dây S = 50 dm², B // n', 176, 64);

        // Nét đường sức từ tăng mật độ/độ đậm theo B(t)
        const nLines = Math.max(1, Math.round(1 + curB * 10));
        for (let i = -2; i <= 2; i++) {
            const ly = 152 + i * 24;
            ctx.strokeStyle = 'rgba(56, 189, 248,' + (0.25 + curT * 0.65).toFixed(2) + ')';
            ctx.lineWidth = 1.4 + curT * 1.4;
            arrow(56, ly, 276, ly, ctx.strokeStyle, ctx.lineWidth);
        }

        // Vòng dây tròn nhìn nghiêng
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 3.6;
        ctx.beginPath();
        ctx.ellipse(176, 152, 26, 70, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Vectơ pháp tuyến n và B
        arrow(176, 152, 224, 152, '#10b981', 2.4);
        ctx.fillStyle = '#10b981';
        ctx.font = '800 13px "Be Vietnam Pro", sans-serif';
        ctx.fillText('n', 216, 142);
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('B', 284, 156);

        ctx.fillStyle = '#e2e8f0';
        ctx.font = '700 13px "JetBrains Mono", monospace';
        ctx.fillText('t = ' + curT.toFixed(2) + ' s   |   B = ' + curB.toFixed(2) + ' T (' + nLines + ' nét)', 176, 264);

        // Khung phải: Đồ thị B(T) - t(s) chuẩn theo q_533_0.jpg
        roundRect(348, 40, 414, 250, 12);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        const ox = 420, oy = 248, wPlot = 264, hPlot = 166;
        ctx.save();
        ctx.setLineDash([4, 3]);
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.28)';
        ctx.lineWidth = 1;
        for (let k = 1; k <= 5; k++) {
            const gx = ox + (k / 5) * wPlot;
            ctx.beginPath(); ctx.moveTo(gx, oy); ctx.lineTo(gx, oy - hPlot); ctx.stroke();
        }
        for (let k = 1; k <= 10; k++) {
            const gy = oy - (k / 10) * hPlot;
            ctx.beginPath(); ctx.moveTo(ox, gy); ctx.lineTo(ox + wPlot, gy); ctx.stroke();
        }
        ctx.restore();

        arrow(ox, oy, ox, oy - hPlot - 22, '#e2e8f0', 2.2);
        arrow(ox, oy, ox + wPlot + 44, oy, '#e2e8f0', 2.2);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 13px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('B (T)', ox + 8, oy - hPlot - 10);
        ctx.fillText('t (s)', ox + wPlot + 12, oy + 20);
        ctx.fillText('0', ox - 14, oy + 14);

        [0.1, 0.2, 0.3, 0.4, 0.5].forEach((val, i) => {
            ctx.textAlign = 'right';
            ctx.fillStyle = '#94a3b8';
            ctx.font = '700 11.5px "Be Vietnam Pro", sans-serif';
            ctx.fillText(val.toFixed(1).replace('.', ','), ox - 8, oy - ((i + 1) * 2 / 10) * hPlot + 4);
        });
        ctx.textAlign = 'center';
        ctx.fillText('0,5', ox + 0.4 * wPlot, oy + 18);
        ctx.fillText('1,0', ox + 0.8 * wPlot, oy + 18);

        // Đường thẳng từ (0, 0) qua (0,5; 0,25) tới (1,0; 0,5)
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(ox + 0.8 * wPlot, oy - hPlot * (10 / 11));
        ctx.stroke();

        // Điểm chạy đồng bộ trên đồ thị
        const px = ox + curT * 0.8 * wPlot;
        const py = oy - (curB / 0.55) * hPlot;
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(px, py, 5.8, 0, Math.PI * 2);
        ctx.fill();
    });

    // ==================== 23. MH-TN50-C3-544 ====================
    M.register('MH-TN50-C3-544', function (ctx, w, h, t) {
        function clearBg() {
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);
        }
        function roundRect(x, y, rw, rh, r) {
            ctx.beginPath();
            ctx.roundRect(x, y, rw, rh, r);
        }
        function arrow(x1, y1, x2, y2, color, lw) {
            const ang = Math.atan2(y2 - y1, x2 - x1);
            ctx.save();
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.lineWidth = lw || 2.4;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(x2 - 8 * Math.cos(ang - 0.36), y2 - 8 * Math.sin(ang - 0.36));
            ctx.lineTo(x2 - 8 * Math.cos(ang + 0.36), y2 - 8 * Math.sin(ang + 0.36));
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }

        clearBg();
        const theta = t * 1.9;
        const rx = Math.max(4, Math.abs(Math.cos(theta)) * 72);

        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 14px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('VÒNG DÂY TRÒN S = 20 cm² QUAY ĐỀU QUANH TRỤC THẲNG ĐỨNG TRONG B = 0,1 T', 18, 26);

        roundRect(18, 40, 744, 250, 12);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        // Chùm đường sức từ đều nằm ngang hướng sang phải giống q_544_0.jpg
        for (let i = 0; i < 9; i++) {
            const fy = 82 + i * 21;
            arrow(110, fy, 336, fy, '#38bdf8', 2.2);
        }
        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 17px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('B', 92, 172);
        arrow(76, 152, 92, 152, '#f8fafc', 1.8);

        // Trục quay thẳng đứng + vòng dây tròn tiết diện S đang quay góc ωt
        const loopCx = 516, loopCy = 168, rVert = 72;
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(loopCx, 60);
        ctx.lineTo(loopCx, 272);
        ctx.stroke();

        // Mũi tên tốc độ góc ω quanh đỉnh trục
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.ellipse(loopCx, 78, 30, 8, 0, Math.PI * 0.2, Math.PI * 1.85);
        ctx.stroke();
        arrow(loopCx + 24, 73, loopCx + 28, 79, '#fbbf24', 2.2);
        ctx.fillStyle = '#fbbf24';
        ctx.font = '800 16px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('ω', loopCx + 36, 76);

        // Vòng dây quay
        ctx.fillStyle = 'rgba(56, 189, 248, 0.10)';
        ctx.beginPath();
        ctx.ellipse(loopCx, loopCy, rx, rVert, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 3.8;
        ctx.stroke();

        ctx.fillStyle = '#cbd5e1';
        ctx.font = '700 13px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('S = 20 cm²  |  B = 0,1 T', loopCx, 286);
    });

    // ==================== 24. MH-TN50-C3-545 ====================
    M.register('MH-TN50-C3-545', function (ctx, w, h, t) {
        function clearBg() {
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);
        }
        function roundRect(x, y, rw, rh, r) {
            ctx.beginPath();
            ctx.roundRect(x, y, rw, rh, r);
        }
        function arrow(x1, y1, x2, y2, color, lw) {
            const ang = Math.atan2(y2 - y1, x2 - x1);
            ctx.save();
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.lineWidth = lw || 2.4;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(x2 - 9 * Math.cos(ang - 0.36), y2 - 9 * Math.sin(ang - 0.36));
            ctx.lineTo(x2 - 9 * Math.cos(ang + 0.36), y2 - 9 * Math.sin(ang + 0.36));
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }

        clearBg();
        const saw = (t * 0.16) % 1;
        // 0..0.45: nam châm được đẩy vào trong cuộn dây; 0.45..0.90: dừng hẳn bên trong!
        const moving = saw < 0.45;
        const frac = moving ? saw / 0.45 : 1;
        const magX = 82 + frac * 316;

        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 14px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('ĐẨY NAM CHÂM VÀO CUỘN DÂY ĐẾN KHI DỪNG LẠI BÊN TRONG', 18, 26);

        roundRect(18, 40, 744, 250, 12);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        // Nửa sau cuộn dây
        const coilL = 340, coilR = 640, coilCy = 138, ry = 44;
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
        ctx.lineWidth = 2.2;
        for (let k = 0; k < 6; k++) {
            const cx = coilL + 30 + k * 48;
            ctx.beginPath();
            ctx.ellipse(cx, coilCy, 14, ry, 0, Math.PI * 0.5, Math.PI * 1.5);
            ctx.stroke();
        }

        // Đường trục ống & viền đứt nét ống trụ giống q_545_0.jpg
        ctx.save();
        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.55)';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(coilL, coilCy - ry);
        ctx.lineTo(coilR + 20, coilCy - ry);
        ctx.moveTo(coilL, coilCy + ry);
        ctx.lineTo(coilR + 20, coilCy + ry);
        ctx.moveTo(coilL, coilCy);
        ctx.lineTo(coilR + 36, coilCy);
        ctx.stroke();
        ctx.restore();

        // Thanh nam châm [N | S] chuyển động vào lòng cuộn rồi dừng lại
        const mw = 134, mh = 34;
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(magX, coilCy - mh / 2, mw / 2, mh);
        ctx.fillStyle = '#2563eb';
        ctx.fillRect(magX + mw / 2, coilCy - mh / 2, mw / 2, mh);
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 2;
        ctx.strokeRect(magX, coilCy - mh / 2, mw, mh);
        ctx.fillStyle = '#ffffff';
        ctx.font = '800 16px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('N', magX + mw * 0.25, coilCy + 6);
        ctx.fillText('S', magX + mw * 0.75, coilCy + 6);
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '700 13.5px "Be Vietnam Pro", sans-serif';
        ctx.fillText('Nam châm', magX + mw / 2, coilCy - 28);

        if (moving) {
            arrow(magX + mw + 4, coilCy, magX + mw + 52, coilCy, '#fbbf24', 2.8);
        }

        // Nửa trước cuộn dây đè lên nam châm khi nam châm đi vào trong!
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 3;
        for (let k = 0; k < 6; k++) {
            const cx = coilL + 30 + k * 48;
            ctx.beginPath();
            ctx.ellipse(cx, coilCy, 14, ry, 0, -Math.PI * 0.5, Math.PI * 0.5);
            ctx.stroke();
        }
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '700 14px "Be Vietnam Pro", sans-serif';
        ctx.fillText('Cuộn dây', 490, 74);

        // Mạch nối Ampe kế nhạy bên dưới
        const wireL = coilL + 30, wireR = coilL + 30 + 5 * 48 + 14;
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.moveTo(wireL, coilCy + ry);
        ctx.lineTo(wireL, 236);
        ctx.lineTo(wireR, 236);
        ctx.lineTo(wireR, coilCy + ry);
        ctx.stroke();

        const gx = (wireL + wireR) / 2, gy = 236;
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(gx, gy, 24, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = moving ? '#fbbf24' : '#38bdf8';
        ctx.lineWidth = 2.4;
        ctx.stroke();

        // Vạch chia nhỏ trên đồng hồ đo nhạy + kim lệch rõ khi đang đẩy nam châm
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.7)';
        ctx.lineWidth = 1.5;
        [-0.75, 0, 0.75].forEach(ang => {
            ctx.beginPath();
            ctx.moveTo(gx + Math.sin(ang) * 18, gy - Math.cos(ang) * 18);
            ctx.lineTo(gx + Math.sin(ang) * 22, gy - Math.cos(ang) * 22);
            ctx.stroke();
        });
        const defl = moving ? Math.sin((saw / 0.45) * Math.PI) * 0.82 : 0;
        const tipX = gx + Math.sin(defl) * 16;
        const tipY = gy - Math.cos(defl) * 16;
        arrow(gx - Math.sin(defl) * 10, gy + Math.cos(defl) * 10, tipX, tipY, moving ? '#fbbf24' : '#cbd5e1', 2.4);

        ctx.textAlign = 'left';
        ctx.fillStyle = moving ? '#fbbf24' : '#94a3b8';
        ctx.font = '700 13px "Be Vietnam Pro", sans-serif';
        ctx.fillText(moving ? 'Đang đẩy nam châm → Kim lệch' : 'Nam châm dừng lại → Kim về 0', 60, 268);
    });

    // ==================== 25. MH-TN50-C3-554 ====================
    M.register('MH-TN50-C3-554', function (ctx, w, h, t) {
        function clearBg() {
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);
        }
        function roundRect(x, y, rw, rh, r) {
            ctx.beginPath();
            ctx.roundRect(x, y, rw, rh, r);
        }
        function arrow(x1, y1, x2, y2, color, lw) {
            const ang = Math.atan2(y2 - y1, x2 - x1);
            ctx.save();
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.lineWidth = lw || 2.2;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(x2 - 8 * Math.cos(ang - 0.36), y2 - 8 * Math.sin(ang - 0.36));
            ctx.lineTo(x2 - 8 * Math.cos(ang + 0.36), y2 - 8 * Math.sin(ang + 0.36));
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
        function subText(main, sub, x, y, color) {
            ctx.save();
            ctx.fillStyle = color;
            ctx.textAlign = 'left';
            ctx.font = '700 13.5px "Be Vietnam Pro", sans-serif';
            const mw = ctx.measureText(main).width;
            ctx.fillText(main, x, y);
            ctx.font = '700 10px "Be Vietnam Pro", sans-serif';
            ctx.fillText(sub, x + mw + 0.5, y + 4);
            ctx.restore();
        }

        clearBg();
        const saw = (t * 0.20) % 1;
        const u = saw;
        const t0Frac = 0.42;

        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 14px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('ĐỒ THỊ TỪ THÔNG φ(t) KHI ĐƯA CUỘN DÂY VÀO TỪ TRƯỜNG', 18, 26);

        // Khung trái: Đồ thị φ(t) chuẩn q_554_0.jpg
        roundRect(18, 40, 386, 250, 12);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        const ox = 76, oy = 248, axW = 285, axH = 166;
        arrow(ox, oy, ox, oy - axH, '#e2e8f0', 2.2);
        arrow(ox, oy, ox + axW, oy, '#e2e8f0', 2.2);

        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 13.5px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('Từ thông φ', ox - 34, oy - axH - 8);
        ctx.textAlign = 'right';
        ctx.fillText('0', ox - 10, oy + 4);
        ctx.textAlign = 'center';
        ctx.fillText('0', ox, oy + 18);
        ctx.fillText('Thời gian', ox + axW - 22, oy + 22);

        const t0X = ox + t0Frac * axW;
        const phiTopY = oy - 118;
        const endX = ox + 0.88 * axW;

        ctx.save();
        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.55)';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(t0X, oy);
        ctx.lineTo(t0X, phiTopY);
        ctx.stroke();
        ctx.restore();
        subText('t', '0', t0X - 6, oy + 19, '#cbd5e1');

        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(t0X, phiTopY);
        ctx.lineTo(endX, phiTopY);
        ctx.stroke();

        // Chấm chạy trên đồ thị φ(t)
        let dotX, dotY;
        if (u <= t0Frac) {
            const k = u / t0Frac;
            dotX = ox + k * (t0X - ox);
            dotY = oy + k * (phiTopY - oy);
        } else {
            const k = (u - t0Frac) / (1 - t0Frac);
            dotX = t0X + k * (endX - t0X);
            dotY = phiTopY;
        }
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(dotX, dotY, 5.8, 0, Math.PI * 2);
        ctx.fill();

        // Khung phải: Trực quan khung dây đi vào vùng từ trường đều (KHÔNG ghi giá trị suất điện động!)
        roundRect(418, 40, 344, 250, 12);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        ctx.fillStyle = '#94a3b8';
        ctx.font = '700 13px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Chuyển động khung dây vào vùng từ trường đều', 590, 64);

        // Vùng từ trường đều × bên phải x >= 560
        const magStart = 550;
        ctx.fillStyle = 'rgba(56, 189, 248, 0.08)';
        ctx.fillRect(magStart, 82, 196, 146);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
        ctx.lineWidth = 1.6;
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 5; c++) {
                const x = magStart + 22 + c * 38;
                const y = 104 + r * 34;
                ctx.beginPath();
                ctx.moveTo(x - 4, y - 4); ctx.lineTo(x + 4, y + 4);
                ctx.moveTo(x + 4, y - 4); ctx.lineTo(x - 4, y + 4);
                ctx.stroke();
            }
        }

        // Khung dây trượt đều sang phải từ ngoài (x = 468) vào ngập hoàn toàn (x >= 550)
        const coilW = 82, coilH = 74;
        const coilX = 468 + u * 188;
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 3.2;
        ctx.strokeRect(coilX, 118, coilW, coilH);

        roundRect(442, 244, 296, 32, 7);
        ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
        ctx.fill();
        ctx.fillStyle = '#38bdf8';
        ctx.font = '700 12.5px "Be Vietnam Pro", sans-serif';
        ctx.fillText(u <= t0Frac ? '0 → t₀: Từ thông φ tăng đều' : 't > t₀: Từ thông φ không đổi', 590, 265);
    });

    // ==================== 26. MH-TN50-C3-556 ====================
    M.register('MH-TN50-C3-556', function (ctx, w, h, t) {
        function clearBg() {
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);
        }
        function roundRect(x, y, rw, rh, r) {
            ctx.beginPath();
            ctx.roundRect(x, y, rw, rh, r);
        }

        clearBg();
        const acGlow = 0.35 + 0.65 * Math.pow(Math.sin(t * 4.5), 2);

        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 14px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('MÁY BIẾN ÁP TĂNG ÁP LÍ TƯỞNG (N₁ < N₂) NỐI BÓNG ĐÈN', 18, 26);

        roundRect(18, 40, 744, 250, 12);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        // Nguồn xoay chiều (~) bên trái
        const acX = 104, acY = 164;
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2.8;
        ctx.beginPath();
        ctx.moveTo(acX, 82);
        ctx.lineTo(acX, acY - 24);
        ctx.moveTo(acX, acY + 24);
        ctx.lineTo(acX, 246);
        ctx.lineTo(354, 246);
        ctx.moveTo(acX, 82);
        ctx.lineTo(354, 82);
        ctx.stroke();

        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(acX, acY, 24, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.6;
        ctx.stroke();
        ctx.strokeStyle = '#38bdf8';
        ctx.beginPath();
        ctx.moveTo(acX - 12, acY);
        ctx.bezierCurveTo(acX - 6, acY - 12, acX, acY - 12, acX, acY);
        ctx.bezierCurveTo(acX, acY + 12, acX + 6, acY + 12, acX + 12, acY);
        ctx.stroke();

        // Cuộn sơ cấp (4 vòng lớn đúng q_556_0.jpg)
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3;
        const pCoilH = 164, pTurns = 4;
        for (let i = 0; i < pTurns; i++) {
            const cy = 82 + (i + 0.5) * (pCoilH / pTurns);
            ctx.beginPath();
            ctx.arc(354, cy, (pCoilH / pTurns) * 0.5, -Math.PI / 2, Math.PI / 2);
            ctx.stroke();
        }

        // Lõi thép kỹ thuật ở giữa
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(386, 76, 8, 176);

        // Cuộn thứ cấp (8 vòng nhỏ hơn đúng máy tăng áp q_556_0.jpg)
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        const sTurns = 8;
        for (let i = 0; i < sTurns; i++) {
            const cy = 82 + (i + 0.5) * (pCoilH / sTurns);
            ctx.beginPath();
            ctx.arc(426, cy, (pCoilH / sTurns) * 0.5, Math.PI / 2, Math.PI * 1.5);
            ctx.stroke();
        }

        // Mạch thứ cấp nối bóng đèn (⊗) bên phải
        const lampX = 676, lampY = 164;
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2.8;
        ctx.beginPath();
        ctx.moveTo(426, 82);
        ctx.lineTo(lampX, 82);
        ctx.lineTo(lampX, lampY - 24);
        ctx.moveTo(lampX, lampY + 24);
        ctx.lineTo(lampX, 246);
        ctx.lineTo(426, 246);
        ctx.stroke();

        // Đèn phát sáng phẳng EdTech (không phát sáng mờ ảo)
        ctx.fillStyle = 'rgba(250, 204, 21,' + (0.14 * acGlow).toFixed(2) + ')';
        ctx.beginPath();
        ctx.arc(lampX, lampY, 36, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(250, 204, 21,' + (0.35 + 0.45 * acGlow).toFixed(2) + ')';
        ctx.beginPath();
        ctx.arc(lampX, lampY, 24, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2.6;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(lampX - 15, lampY - 15);
        ctx.lineTo(lampX + 15, lampY + 15);
        ctx.moveTo(lampX + 15, lampY - 15);
        ctx.lineTo(lampX - 15, lampY + 15);
        ctx.stroke();

        // Chú thích tên cuộn dây (KHÔNG tiết lộ đáp án Φ hay I!)
        ctx.fillStyle = '#fbbf24';
        ctx.font = '700 13px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Cuộn sơ cấp (N₁)', 230, 272);
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('Cuộn thứ cấp (N₂ > N₁)', 552, 272);
        ctx.fillStyle = '#cbd5e1';
        ctx.fillText('Nguồn xoay chiều', acX, 66);
        ctx.fillText('Bóng đèn', lampX, 66);
    });

    // ==================== 27. MH-TN50-C3-564 ====================
    M.register('MH-TN50-C3-564', function (ctx, w, h, t) {
        function clearBg() {
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);
        }
        function roundRect(x, y, rw, rh, r) {
            ctx.beginPath();
            ctx.roundRect(x, y, rw, rh, r);
        }

        clearBg();
        const saw = (t * 0.18) % 1;
        // Chỉ chạy đoạn thả ban đầu phía trên miệng ống để không lộ thứ tự thoát đáy ống!
        const dropY = saw < 0.7 ? Math.pow(saw / 0.7, 2) * 20 : 20;

        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 14px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('THẢ 3 NAM CHÂM P, Q, R QUA 3 ỐNG: ĐỒNG, CHÌ VÀ CAO SU', 18, 26);

        roundRect(18, 40, 744, 250, 12);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        const tubes = [
            { cx: 158, mLabel: 'P', mat: 'Đồng', fill: '#b45309', stroke: '#f59e0b', rho: 'ρ = 1,7·10⁻⁸ Ωm' },
            { cx: 386, mLabel: 'Q', mat: 'Chì', fill: '#475569', stroke: '#94a3b8', rho: 'ρ = 22·10⁻⁸ Ωm' },
            { cx: 614, mLabel: 'R', mat: 'Cao su', fill: '#1e293b', stroke: '#38bdf8', rho: 'ρ = 50·10¹³ Ωm' }
        ];

        tubes.forEach(tb => {
            // Nam châm hình trụ P, Q, R [S | N] phía trên miệng ống
            const my = 58 + dropY;
            const mw = 28, mh = 44;
            ctx.fillStyle = '#2563eb';
            ctx.fillRect(tb.cx - mw / 2, my, mw, mh / 2);
            ctx.fillStyle = '#dc2626';
            ctx.fillRect(tb.cx - mw / 2, my + mh / 2, mw, mh / 2);
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 1.8;
            ctx.strokeRect(tb.cx - mw / 2, my, mw, mh);

            ctx.fillStyle = '#ffffff';
            ctx.font = '800 12px "Be Vietnam Pro", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('S', tb.cx, my + 15);
            ctx.fillText('N', tb.cx, my + 37);

            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 15px "Be Vietnam Pro", sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(tb.mLabel, tb.cx + mw / 2 + 8, my + 27);

            // Ống hình trụ rỗng thẳng đứng
            const tx = tb.cx - 34, ty = 136, tw = 68, th = 128;
            ctx.fillStyle = tb.fill;
            ctx.fillRect(tx, ty, tw, th);
            ctx.strokeStyle = tb.stroke;
            ctx.lineWidth = 2.2;
            ctx.strokeRect(tx, ty, tw, th);

            // Miệng ống hình elip rỗng phía trên & đáy bo tròn
            ctx.fillStyle = '#0a1226';
            ctx.beginPath();
            ctx.ellipse(tb.cx, ty, 34, 11, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = tb.stroke;
            ctx.lineWidth = 2.2;
            ctx.stroke();
            ctx.beginPath();
            ctx.ellipse(tb.cx, ty, 24, 7, 0, 0, Math.PI * 2);
            ctx.stroke();

            // Nhãn chất liệu ống + điện trở suất đúng đề bài (KHÔNG lộ nhanh/chậm!)
            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 14px "Be Vietnam Pro", sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(tb.mat, tb.cx + 44, ty + 62);
            ctx.fillStyle = '#94a3b8';
            ctx.font = '600 11.5px "Be Vietnam Pro", sans-serif';
            ctx.fillText(tb.rho, tb.cx + 44, ty + 82);
        });
    });

    console.info('[VLXT staging-tn50-models] Đã đăng ký thành công toàn bộ 27 mô hình Canvas 60 FPS (MH-TN50-C2 & C3).');
})(window);

// === VLXT_TN50_CAPTIONS_REGISTRY ===
(function (g) {
  const caps = {
  "MH-TN50-C2-251": "Câu 251: Biểu đồ cho thấy kết quả thu được khi thực hiện thí nghiệm để nghiên cứu...",
  "MH-TN50-C2-258": "Câu 258: Một xilanh được lắp một pit-tông trơn chứa khí lý tưởng như hình vẽ bên....",
  "MH-TN50-C2-274": "Câu 274: Đồ thị sau đây diễn tả quá trình biến đổi nào của một lượng khí xác định?",
  "MH-TN50-C2-255": "Câu 255: Đồ thị biểu diễn mối quan hệ $V - T$ của một khối khí lý tưởng xác định....",
  "MH-TN50-C2-269": "Câu 269: Đường đẳng áp của một khối khí xác định tương ứng với áp suất $p_1$ và...",
  "MH-TN50-C2-314": "Câu 314: Một khối khí có áp suất $p_0$, thể tích $V_0$ được đun nóng đẳng áp,...",
  "MH-TN50-C2-337": "Câu 337: Một thí nghiệm được thực hiện với khối không khí chứa trong bình cầu và...",
  "MH-TN50-C2-347": "Câu 347: Một khối khí thay đổi trạng thái như đồ thị biểu diễn như hình vẽ bên. Sự...",
  "MH-TN50-C2-350": "Câu 350: Một khối khí ban đầu có các thông số trạng thái là $p_0, V_0, T_0$. Biến...",
  "MH-TN50-C3-502": "Câu 502: Với nam châm điện ở hình trên, kết luận nào sau đây đúng?",
  "MH-TN50-C3-503": "Câu 503: Muốn tăng từ trường của nam châm điện ta có thể",
  "MH-TN50-C3-505": "Câu 505: Ba nam châm giống hệt nhau $P, Q$ và $R$ được thả đồng thời từ trạng thái...",
  "MH-TN50-C3-521": "Câu 521: Một khung dây dẫn $MNPQ$ quay đều quanh một trục nằm ngang vuông góc với...",
  "MH-TN50-C3-522": "Câu 522: Khi dịch chuyển thanh nam châm ra xa ống dây (hình bên), trong ống dây có...",
  "MH-TN50-C3-526": "Câu 526: Cho sơ đồ mạch điện và kim nam châm được treo như hình. Khi đóng công tắc...",
  "MH-TN50-C3-546": "Câu 546: Một vòng dây dẫn kín, tròn, phẳng không biến dạng $(C)$ đặt trong mặt...",
  "MH-TN50-C3-528": "Câu 528: Để xác định chiều của lực từ tác dụng lên đoạn dây mang dòng điện người...",
  "MH-TN50-C3-535": "Câu 535: Một sợi dây kim loại hình vuông có cạnh bằng $15,7\\text{ cm}$ được đặt...",
  "MH-TN50-C3-538": "Câu 538: Lực từ tác dụng lên đoạn dây $AC$ có độ lớn là",
  "MH-TN50-C3-539": "Câu 539: Bỏ qua trọng lượng khung dây, nếu khung tự do thì hệ lực từ tác dụng lên...",
  "MH-TN50-C3-531": "Câu 531: Một khung tròn và một khung vuông, được làm từ cùng một loại dây kim...",
  "MH-TN50-C3-533": "Câu 533: Từ thông qua vòng dây tại thời điểm $t = 0,5\\text{ s}$ là",
  "MH-TN50-C3-544": "Câu 544: Từ thông cực đại qua vòng dây là bao nhiêu $\\text{mWb}$? (Kết quả làm...",
  "MH-TN50-C3-545": "Câu 545: Một thanh nam châm được đẩy vào một cuộn dây được nối với một ampe kế...",
  "MH-TN50-C3-554": "Câu 554: Đồ thị cho thấy mối liên hệ giữa từ thông $\\phi$ qua cuộn dây theo thời...",
  "MH-TN50-C3-556": "Câu 556: Cuộn dây sơ cấp của máy biến áp tăng áp lí tưởng được nối với nguồn điện...",
  "MH-TN50-C3-564": "Câu 564: Ống thẳng đứng, làm bằng đồng, chì và cao su, có kích thước giống hệt..."
};
  g.VLXT_TN50_CAPTIONS = Object.assign(g.VLXT_TN50_CAPTIONS || {}, caps);
  if (typeof MODEL_CAPTIONS === 'object' && MODEL_CAPTIONS) {
    Object.assign(MODEL_CAPTIONS, caps);
  }
})(typeof window !== 'undefined' ? window : globalThis);
