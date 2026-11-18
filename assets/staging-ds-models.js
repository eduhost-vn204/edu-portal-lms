/*!
 * VLXT Staging Models Engine v3.0 — 106/106 Bespoke Self-Contained High-Visibility Canvas Models
 * Đã thay thế toàn bộ 11 hàm mẫu chung; mỗi mô hình bám sát đề bài & hình gốc 1-1,
 * tự chủ hoàn toàn (helper cục bộ), chữ lớn >= 14.5px (trừ chỉ số phụ >= 12.5px), 0 AI Glow.
 */
(function(window) {
    'use strict';
    if (!window.VLXTModels) {
        window.VLXTModels = {
            _reg: {},
            _canvasRegistry: {},
            register: function(id, fn) {
                this._reg[id] = fn;
                this._canvasRegistry[id] = fn;
                window._canvasRegistry = window._canvasRegistry || {};
                window._canvasRegistry[id] = fn;
            }
        };
    }

    // =========================================================================
    // CÂU 1 (MH-STAGING-C1-01 · VLXT-DS-VD28-001): Thí nghiệm hơ nóng ống nghiệm đậy nút bấc trên giá đỡ (4 dụng cụ)
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C1-01', function(ctx, w, h, t) {
            // 1. Nền kỹ thuật phẳng EdTech & Lưới chuẩn
            ctx.clearRect(0, 0, w, h);
            const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
            bgGrad.addColorStop(0, '#060b19');
            bgGrad.addColorStop(1, '#0a1226');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) {
                ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke();
            }
            for (let gy = 20; gy < h; gy += 26) {
                ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke();
            }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2.2) {
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(x, y, bw, bh, r);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function arrowLine(x1, y1, x2, y2, col, lw = 2.6, hl = 8) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }

            function calloutTag(tx, ty, bx, by, label, col) {
                ctx.save();
                ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
                const padX = 12, boxH = 30;
                const tw = ctx.measureText(label).width;
                const boxW = tw + padX * 2;
                const ax = (bx + boxW / 2 < tx) ? (bx + boxW) : bx;
                const ay = by + boxH / 2;

                ctx.strokeStyle = col;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(tx, ty);
                ctx.lineTo(ax, ay);
                ctx.stroke();

                ctx.fillStyle = col;
                ctx.beginPath();
                ctx.arc(tx, ty, 3.8, 0, Math.PI * 2);
                ctx.fill();

                roundBox(bx, by, boxW, boxH, 7, '#0f172a', col, 2);
                ctx.fillStyle = '#f8fafc';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(label, bx + boxW / 2, by + boxH / 2);
                ctx.restore();
            }

            // Hộp tiêu đề góc trên trái (Cỡ chữ lớn, phẳng, sắc nét)
            ctx.save();
            const title = 'THÍ NGHIỆM HƠ NÓNG ỐNG NGHIỆM ĐẨY BẬT NÚT BẤC';
            ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
            const titleW = ctx.measureText(title).width + 22;
            roundBox(16, 12, titleW, 28, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, 27, 26);
            ctx.restore();

            // Chu kỳ thí nghiệm 1 chiều (Sawtooth): 0..0.72 hơ nóng tăng nhiệt/áp; 0.72..1.0 nút bấc bật ra
            const cycle = (t * 0.16) % 1;
            const heatRatio = Math.min(1, cycle / 0.72);
            const popProgress = cycle >= 0.72 ? (cycle - 0.72) / 0.28 : 0;

            // Mặt bàn thí nghiệm
            const tableY = 282;
            ctx.save();
            ctx.strokeStyle = '#334155';
            ctx.lineWidth = 3.2;
            ctx.beginPath();
            ctx.moveTo(70, tableY);
            ctx.lineTo(710, tableY);
            ctx.stroke();
            ctx.restore();

            // 2. (4) GIÁ ĐỠ THÍ NGHIỆM (Chân kiềng gang 3 chạc + trụ thép + khớp kẹp + vít)
            const rodX = 414;
            ctx.save();
            // Chân kiềng 3 chạc vững chãi giống ảnh gốc
            ctx.fillStyle = '#1e293b';
            ctx.strokeStyle = '#64748b';
            ctx.lineWidth = 2.6;
            ctx.beginPath();
            ctx.moveTo(rodX - 18, 244);
            ctx.lineTo(rodX + 18, 244);
            ctx.lineTo(516, 274);
            ctx.lineTo(516, 282);
            ctx.lineTo(486, 282);
            ctx.lineTo(426, 260);
            ctx.lineTo(422, 282);
            ctx.lineTo(398, 282);
            ctx.lineTo(396, 262);
            ctx.lineTo(354, 282);
            ctx.lineTo(334, 282);
            ctx.lineTo(334, 272);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Núm vít chỉnh cân bằng trên chân phải
            roundBox(504, 262, 10, 12, 2, '#475569', '#94a3b8', 1.6);

            // Cổ kẹp chân đế
            roundBox(rodX - 14, 232, 28, 16, 4, '#334155', '#94a3b8', 2);

            // Trụ thép thẳng đứng (dừng gọn sau khớp kẹp ống nghiệm, không đâm nhô lên mép trên ống)
            ctx.fillStyle = '#94a3b8';
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 1.6;
            ctx.fillRect(rodX - 4, 98, 8, 134);
            ctx.strokeRect(rodX - 4, 98, 8, 134);

            // Tay đòn nối từ trụ đến ngàm kẹp ống nghiệm
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 5;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(rodX, 112);
            ctx.lineTo(398, 112);
            ctx.stroke();

            // Khớp nối + vít vặn chữ T trên trụ
            roundBox(rodX - 8, 103, 16, 18, 3, '#475569', '#e2e8f0', 1.8);
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 2.8;
            ctx.beginPath();
            ctx.moveTo(rodX + 8, 112); ctx.lineTo(rodX + 20, 112);
            ctx.moveTo(rodX + 20, 104); ctx.lineTo(rodX + 20, 120);
            ctx.stroke();
            ctx.restore();

            // 3. (3) ĐÈN CỒN THỦY TINH (Bầu chứa, mức cồn, dây bấc, chụp sứ, ngọn lửa 2 lớp)
            const bx = 276;
            ctx.save();
            // Bầu thủy tinh hình thang bo tròn
            ctx.fillStyle = 'rgba(30, 41, 59, 0.72)';
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 2.8;
            ctx.beginPath();
            ctx.moveTo(bx - 22, 224);
            ctx.lineTo(bx + 22, 224);
            ctx.quadraticCurveTo(bx + 44, 240, bx + 40, 274);
            ctx.quadraticCurveTo(bx + 38, 282, bx + 28, 282);
            ctx.lineTo(bx - 28, 282);
            ctx.quadraticCurveTo(bx - 38, 282, bx - 40, 274);
            ctx.quadraticCurveTo(bx - 44, 240, bx - 22, 224);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Chất lỏng cồn bên trong đèn
            ctx.fillStyle = 'rgba(56, 189, 248, 0.28)';
            ctx.beginPath();
            ctx.moveTo(bx - 35, 250);
            ctx.lineTo(bx + 35, 250);
            ctx.quadraticCurveTo(bx + 40, 278, bx + 28, 280);
            ctx.lineTo(bx - 28, 280);
            ctx.quadraticCurveTo(bx - 40, 278, bx - 35, 250);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#7dd3fc';
            ctx.lineWidth = 1.6;
            ctx.beginPath();
            ctx.moveTo(bx - 35, 250); ctx.lineTo(bx + 35, 250);
            ctx.stroke();

            // Cổ đèn & chụp sứ trắng giữ bấc
            roundBox(bx - 12, 206, 24, 18, 3, 'rgba(30, 41, 59, 0.8)', '#cbd5e1', 2.4);
            roundBox(bx - 15, 199, 30, 9, 3, '#e2e8f0', '#94a3b8', 1.8);

            // Dây bấc cotton
            ctx.strokeStyle = '#f8fafc';
            ctx.lineWidth = 3.2;
            ctx.beginPath();
            ctx.moveTo(bx, 199);
            ctx.quadraticCurveTo(bx - 4, 246, bx - 14, 273);
            ctx.stroke();

            // Ngọn lửa đèn cồn 2 lớp (sắc nét, không AI Glow)
            const sway = Math.sin(t * 11) * 1.8;
            const fh = 24 + Math.sin(t * 15) * 2.2;
            // Lớp ngoài cam
            ctx.fillStyle = '#f97316';
            ctx.beginPath();
            ctx.moveTo(bx - 7, 199);
            ctx.quadraticCurveTo(bx - 10, 184, bx + sway, 199 - fh);
            ctx.quadraticCurveTo(bx + 10, 184, bx + 7, 199);
            ctx.closePath();
            ctx.fill();
            // Lõi trong vàng sáng
            ctx.fillStyle = '#fde047';
            ctx.beginPath();
            ctx.moveTo(bx - 3.8, 199);
            ctx.quadraticCurveTo(bx - 4.5, 188, bx + sway * 0.6, 199 - fh * 0.62);
            ctx.quadraticCurveTo(bx + 4.5, 188, bx + 3.8, 199);
            ctx.closePath();
            ctx.fill();

            // 2 mũi tên nhiệt nhẹ hướng lên đáy ống nghiệm khi đang hơ
            const hAlpha = 0.55 + 0.45 * Math.sin(t * 5) ** 2;
            arrowLine(bx - 16, 188, bx - 12, 173, `rgba(251, 146, 60, ${hAlpha.toFixed(2)})`, 2.2, 6);
            arrowLine(bx + 16, 188, bx + 12, 173, `rgba(251, 146, 60, ${hAlpha.toFixed(2)})`, 2.2, 6);
            ctx.restore();

            // 4. (1) ỐNG NGHIỆM THỦY TINH NGHIÊNG CÓ VẠCH CHIA & (2) NÚT BẤC
            const tubeX = 276, tubeY = 166;
            const tubeAng = -0.42; // Nghiêng lên phải giống ảnh gốc
            const tubeLen = 212;
            const tubeR = 14;

            ctx.save();
            ctx.translate(tubeX, tubeY);
            ctx.rotate(tubeAng);

            // Lòng khí bên trong ống nghiệm (sắc ấm nhẹ tăng theo heatRatio)
            const gasAlpha = 0.14 + heatRatio * 0.24;
            const gGrad = ctx.createLinearGradient(0, 0, tubeLen, 0);
            gGrad.addColorStop(0, `rgba(249, 115, 22, ${gasAlpha})`);
            gGrad.addColorStop(0.55, `rgba(56, 189, 248, 0.18)`);
            gGrad.addColorStop(1, `rgba(56, 189, 248, 0.22)`);
            ctx.fillStyle = gGrad;
            ctx.beginPath();
            ctx.arc(0, 0, tubeR, Math.PI / 2, Math.PI * 1.5);
            ctx.lineTo(tubeLen, -tubeR);
            ctx.lineTo(tubeLen, tubeR);
            ctx.closePath();
            ctx.fill();

            // 14 phân tử khí chuyển động nhiệt hỗn loạn bên trong ống
            const speedAmp = 1 + heatRatio * 1.6;
            ctx.fillStyle = '#7dd3fc';
            for (let i = 0; i < 14; i++) {
                const basePx = 12 + ((i * 37) % (tubeLen - 34));
                const basePy = -8 + ((i * 19) % 17);
                const mx = basePx + Math.sin(t * 3.4 * speedAmp + i * 1.7) * (4 * speedAmp);
                const my = basePy + Math.cos(t * 4.1 * speedAmp + i * 2.3) * 3.5;
                ctx.beginPath();
                ctx.arc(Math.max(4, Math.min(tubeLen - 22, mx)), Math.max(-tubeR + 4, Math.min(tubeR - 4, my)), 2.8, 0, Math.PI * 2);
                ctx.fill();
            }

            // Thành ống nghiệm thủy tinh (đáy tròn trái, hở miệng phải)
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(tubeLen + 3, -tubeR - 2);
            ctx.lineTo(tubeLen, -tubeR);
            ctx.lineTo(0, -tubeR);
            ctx.arc(0, 0, tubeR, -Math.PI / 2, Math.PI / 2, true);
            ctx.lineTo(tubeLen, tubeR);
            ctx.lineTo(tubeLen + 3, tubeR + 2);
            ctx.stroke();

            // Vạch chia thể tích màu cam dọc thân ống (khớp ảnh gốc)
            ctx.strokeStyle = '#f59e0b';
            for (let tickX = 24; tickX <= tubeLen - 26; tickX += 10) {
                const major = ((tickX - 24) % 40 === 0);
                ctx.lineWidth = major ? 2.2 : 1.4;
                ctx.beginPath();
                ctx.moveTo(tickX, tubeR - 1);
                ctx.lineTo(tickX, tubeR - (major ? 9 : 5));
                ctx.stroke();
            }

            // Ngàm kẹp kim loại ôm quanh thân ống (tại vị trí nối với giá đỡ x_local = 136)
            roundBox(128, -tubeR - 5, 16, tubeR * 2 + 10, 4, '#475569', '#e2e8f0', 2);

            // (2) NÚT BẤC tại miệng ống nghiệm
            let corkX = tubeLen - 8;
            let corkY = 0;
            let corkRot = 0;
            if (cycle > 0.52 && cycle < 0.72) {
                // Rung nhẹ trước khi bật ra
                corkX += Math.sin(t * 42) * 1.4;
            } else if (popProgress > 0) {
                // Bật văng ra khỏi miệng ống theo trục ống + rơi nhẹ theo trọng lực
                corkX += popProgress * 82;
                corkY += popProgress * popProgress * 26;
                corkRot = popProgress * 0.45;
                // Hạt khí phụt ra ở miệng ống
                for (let k = 0; k < 5; k++) {
                    const kp = Math.min(1, popProgress * 1.6);
                    const px = tubeLen + 6 + kp * (18 + k * 8);
                    const py = (k - 2) * (4 + kp * 5);
                    ctx.fillStyle = `rgba(125, 211, 252, ${(1 - kp) * 0.85})`;
                    ctx.beginPath();
                    ctx.arc(px, py, 2.5, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            ctx.save();
            ctx.translate(corkX, corkY);
            ctx.rotate(corkRot);
            // Hình trụ cụt nút bấc (hơi loe ra bên ngoài)
            ctx.fillStyle = '#78716c';
            ctx.strokeStyle = '#e7e5e4';
            ctx.lineWidth = 2.4;
            ctx.beginPath();
            ctx.moveTo(-10, -tubeR + 2);
            ctx.lineTo(14, -tubeR - 2);
            ctx.lineTo(14, tubeR + 2);
            ctx.lineTo(-10, tubeR - 2);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.restore();

            ctx.restore(); // Kết thúc xoay theo ống nghiệm

            // Tính tọa độ thực của nút bấc để đường chỉ dẫn (2) luôn bám chính xác theo nút bấc
            const cwX = tubeX + corkX * Math.cos(tubeAng) - corkY * Math.sin(tubeAng);
            const cwY = tubeY + corkX * Math.sin(tubeAng) + corkY * Math.cos(tubeAng);

            // 5. 4 HỘP CHÚ THÍCH ĐÁNH SỐ (1), (2), (3), (4) TO RÕ, CHỐNG ĐÈ NÉT (ZERO DATA LEAKAGE)
            calloutTag(346, 134, 22, 64, '(1) Ống nghiệm', '#38bdf8');
            calloutTag(cwX + 4, cwY - 4, 594, 48, '(2) Nút bấc', '#fbbf24');
            calloutTag(242, 246, 22, 198, '(3) Đèn cồn', '#f97316');
            calloutTag(418, 194, 558, 198, '(4) Giá đỡ thí nghiệm', '#10b981');
        });

    // =========================================================================
    // CÂU 2 (MH-STAGING-C1-02 · VLXT-DS-VD28-002): Đồ thị nhiệt độ t (°C) theo thời gian τ (phút) khi nung nóng thỏi chì 1 kg
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C1-02', function(ctx, w, h, t) {
            // 1. Nền kỹ thuật phẳng EdTech & Lưới chuẩn
            ctx.clearRect(0, 0, w, h);
            const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
            bgGrad.addColorStop(0, '#060b19');
            bgGrad.addColorStop(1, '#0a1226');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) {
                ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke();
            }
            for (let gy = 20; gy < h; gy += 26) {
                ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke();
            }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2.2) {
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(x, y, bw, bh, r);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function arrowLine(x1, y1, x2, y2, col, lw = 2.8, hl = 9) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }

            // Open-Top Crucible (Nồi/chén chịu nhiệt hở miệng trên - tuyệt đối không strokeRect kín miệng)
            function drawOpenCrucible(x, y, cw, ch, col, lw = 3.2, flare = 6) {
                ctx.save();
                ctx.strokeStyle = col;
                ctx.lineWidth = lw;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.beginPath();
                ctx.moveTo(x - flare, y);
                ctx.lineTo(x, y + 6);
                ctx.lineTo(x, y + ch);
                ctx.lineTo(x + cw, y + ch);
                ctx.lineTo(x + cw, y + 6);
                ctx.lineTo(x + cw + flare, y);
                ctx.stroke();
                ctx.restore();
            }

            // 2. CỘT TRÁI: ĐỒ THỊ t (°C) THEO τ (phút) TRÙNG KHỚP 100% HÌNH GỐC
            const ox = 92, oy = 258;
            const x5 = 162, x10 = 232, x15 = 302, xC = 398;
            const y27 = 240, y127 = 188, y227 = 136, y327 = 84;

            ctx.save();
            // Hai trục tọa độ đậm rõ
            arrowLine(ox, oy + 6, ox, 32, '#f1f5f9', 2.8, 9);
            arrowLine(ox - 6, oy, 456, oy, '#f1f5f9', 2.8, 9);

            // Nhãn hai trục & gốc O to rõ
            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 16px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            ctx.fillText('t (°C)', ox - 10, 42);

            ctx.textAlign = 'center';
            ctx.font = '800 15.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillText('τ (phút)', 424, oy + 26);

            ctx.font = '800 15px "DM Mono", monospace';
            ctx.fillText('O', ox - 12, oy + 20);

            // Các mốc giá trị trên trục hoành (5, 10, 15)
            ctx.fillStyle = '#e2e8f0';
            ctx.font = '800 14.5px "DM Mono", monospace';
            ctx.textAlign = 'center';
            ctx.fillText('5', x5, oy + 21);
            ctx.fillText('10', x10, oy + 21);
            ctx.fillText('15', x15, oy + 21);

            // Các mốc giá trị trên trục tung (27, 127, 227, 327)
            ctx.textAlign = 'right';
            ctx.fillText('27', ox - 10, y27);
            ctx.fillText('127', ox - 10, y127);
            ctx.fillText('227', ox - 10, y227);
            ctx.fillText('327', ox - 10, y327);

            // Các đường gióng nét đứt vuông góc khớp hình gốc
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 1.8;
            ctx.setLineDash([5, 4]);
            ctx.beginPath();
            ctx.moveTo(ox, y127); ctx.lineTo(x5, y127); ctx.lineTo(x5, oy);
            ctx.moveTo(ox, y227); ctx.lineTo(x10, y227); ctx.lineTo(x10, oy);
            ctx.moveTo(ox, y327); ctx.lineTo(x15, y327); ctx.lineTo(x15, oy);
            ctx.stroke();
            ctx.setLineDash([]);

            // Đường đồ thị chính: từ (ox, y27) xiên qua A lên B(302, 84) -> ngang tới C(398, 84)
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 3.8;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(ox, y27);
            ctx.lineTo(x15, y327);
            ctx.lineTo(xC, y327);
            ctx.stroke();

            // Điểm A (giữa mốc 5 và 10), B (tại 15 phút), C (cuối đoạn ngang)
            const xA = ox + (7.2 / 15) * (x15 - ox);
            const yA = y27 - (7.2 / 15) * (y27 - y327);
            const markers = [
                { x: xA, y: yA, label: 'A', lx: xA - 16, ly: yA - 13 },
                { x: x15, y: y327, label: 'B', lx: x15, ly: y327 - 19 },
                { x: xC, y: y327, label: 'C', lx: xC, ly: y327 - 19 }
            ];
            markers.forEach(m => {
                ctx.fillStyle = '#fbbf24';
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(m.x, m.y, 5.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = '#fbbf24';
                ctx.font = '800 17px "Plus Jakarta Sans", system-ui, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(m.label, m.lx, m.ly);
            });

            // Điểm chạy động 1 chiều (sawtooth) dọc theo đoạn đồ thị từ τ=0 -> B -> C
            const saw = (t * 0.18) % 1;
            let dotX, dotY;
            if (saw < 0.68) {
                const r = saw / 0.68;
                dotX = ox + (x15 - ox) * r;
                dotY = y27 + (y327 - y27) * r;
            } else {
                const r = (saw - 0.68) / 0.32;
                dotX = x15 + (xC - x15) * r;
                dotY = y327;
            }
            ctx.fillStyle = '#f97316';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2.2;
            ctx.beginPath();
            ctx.arc(dotX, dotY, 6.8, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.restore();

            // 3. CỘT PHẢI: THÔNG SỐ ĐỀ BÀI & NUNG NÓNG THỎI CHÌ (ZERO DATA LEAKAGE)
            ctx.save();
            // Card 1: Thông số đề bài (không lộ 327°C là nhiệt độ nóng chảy, không lộ 20800 J)
            roundBox(488, 22, 272, 112, 10, '#0f172a', '#38bdf8', 2);
            ctx.fillStyle = '#38bdf8';
            ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText('THÔNG SỐ ĐỀ BÀI', 506, 44);

            ctx.fillStyle = '#f8fafc';
            ctx.font = '700 14px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillText('• Vật nung: Thỏi chì (Pb)', 506, 70);
            ctx.fillText('• Khối lượng: m = 1 kg', 506, 94);
            ctx.fillStyle = '#7dd3fc';
            ctx.fillText('• c = 130 J/(kg·K)', 506, 118);

            // Card 2: Minh họa chén nung chịu nhiệt hở miệng trên + thỏi chì đang được nung
            roundBox(488, 148, 272, 138, 10, '#0f172a', '#475569', 2);

            const cupX = 564, cupY = 172, cupW = 120, cupH = 66;
            // Khối chì bên trong chén chuyển sắc ấm dần theo chu kỳ
            const warmR = Math.round(110 + saw * 135);
            const warmG = Math.round(125 + saw * 25);
            const warmB = Math.round(145 - saw * 95);
            roundBox(cupX + 12, cupY + 26, cupW - 24, 34, 6, `rgb(${warmR}, ${warmG}, ${warmB})`, '#e2e8f0', 1.8);

            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Pb (1 kg)', cupX + cupW / 2, cupY + 43);

            // Chén nung hở miệng trên (U-shape, không vẽ nét ngang đóng miệng trên)
            drawOpenCrucible(cupX, cupY, cupW, cupH, '#cbd5e1', 3.2, 7);

            // Đế gia nhiệt bên dưới chén nung
            const burnerGlow = 0.55 + 0.45 * Math.sin(t * 5) ** 2;
            roundBox(554, 240, 140, 10, 4, `rgba(249, 115, 22, ${(0.45 + 0.35 * burnerGlow).toFixed(2)})`, '#fb923c', 1.8);
            ctx.fillStyle = '#cbd5e1';
            ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillText('Quá trình nung nóng chì', 624, 270);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 3 (MH-STAGING-C1-03 · VLXT-DS-VD28-003): Hệ thống sấy lạnh & sấy thăng hoa đông trùng hạ thảo
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C1-03', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
            bgGrad.addColorStop(0, '#060b19');
            bgGrad.addColorStop(1, '#0a1226');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) {
                ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke();
            }
            for (let gy = 20; gy < h; gy += 26) {
                ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke();
            }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2.2) {
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(x, y, bw, bh, r);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function arrowLine(x1, y1, x2, y2, col, lw = 2.6, hl = 8) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }

            function calloutTag(tx, ty, bx, by, label, col) {
                ctx.save();
                ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
                const padX = 11, boxH = 28;
                const tw = ctx.measureText(label).width;
                const boxW = tw + padX * 2;
                bx = Math.min(w - 10 - boxW, Math.max(10, bx));
                by = Math.min(h - 10 - boxH, Math.max(10, by));
                const ax = (bx + boxW / 2 < tx) ? (bx + boxW) : bx;
                const ay = by + boxH / 2;

                ctx.strokeStyle = col;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(tx, ty);
                ctx.lineTo(ax, ay);
                ctx.stroke();

                ctx.fillStyle = col;
                ctx.beginPath();
                ctx.arc(tx, ty, 3.6, 0, Math.PI * 2);
                ctx.fill();

                roundBox(bx, by, boxW, boxH, 6, '#0f172a', col, 2);
                ctx.fillStyle = '#f8fafc';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(label, bx + boxW / 2, by + boxH / 2);
                ctx.restore();
            }

            // Tiêu đề góc trên trái
            ctx.save();
            const title = 'HỆ THỐNG SẤY LẠNH & SẤY THĂNG HOA';
            ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
            const titleW = ctx.measureText(title).width + 24;
            roundBox(14, 12, titleW, 30, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, 26, 27);
            ctx.restore();

            const saw = (t * 0.24) % 1;

            // 1. Đường ống nối thông kín khít (Zero-Gap Topology)
            ctx.save();
            ctx.strokeStyle = '#64748b';
            ctx.lineWidth = 10;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            // Ống từ bộ gia nhiệt -> buồng sấy
            ctx.beginPath();
            ctx.moveTo(132, 184); ctx.lineTo(205, 184);
            ctx.stroke();
            // Ống trên đỉnh buồng sấy -> bộ ngưng tụ
            ctx.beginPath();
            ctx.moveTo(295, 102); ctx.lineTo(295, 76); ctx.lineTo(548, 76); ctx.lineTo(548, 102);
            ctx.stroke();
            // Ống hơi giữa buồng sấy -> bộ ngưng tụ
            ctx.beginPath();
            ctx.moveTo(415, 134); ctx.lineTo(488, 134);
            ctx.stroke();
            // Ống hồi/hút từ buồng sấy & ngưng tụ -> bơm hút khí
            ctx.beginPath();
            ctx.moveTo(164, 184); ctx.lineTo(164, 276); ctx.lineTo(506, 276);
            ctx.moveTo(548, 224); ctx.lineTo(548, 246);
            ctx.stroke();

            // Lòng ống mảnh bên trong
            ctx.strokeStyle = '#1e293b';
            ctx.lineWidth = 5.5;
            ctx.beginPath();
            ctx.moveTo(132, 184); ctx.lineTo(205, 184);
            ctx.moveTo(295, 102); ctx.lineTo(295, 76); ctx.lineTo(548, 76); ctx.lineTo(548, 102);
            ctx.moveTo(415, 134); ctx.lineTo(488, 134);
            ctx.moveTo(164, 184); ctx.lineTo(164, 276); ctx.lineTo(506, 276);
            ctx.moveTo(548, 224); ctx.lineTo(548, 246);
            ctx.stroke();
            ctx.restore();

            // 2. Bộ gia nhiệt (trái)
            roundBox(26, 152, 108, 76, 8, '#1e293b', '#94a3b8', 2.6);
            roundBox(38, 168, 84, 44, 5, '#0f172a', '#475569', 1.8);
            // Thanh điện trở đỏ cam
            for (let k = 0; k < 4; k++) {
                const glow = 0.55 + 0.45 * Math.sin(t * 4 + k * 0.6) ** 2;
                roundBox(46 + k * 18, 176, 12, 28, 3, `rgba(249, 115, 22, ${glow.toFixed(2)})`, '#fb923c', 1.4);
            }

            // 3. Buồng sấy kín (giữa)
            roundBox(204, 102, 212, 134, 10, '#1e293b', '#cbd5e1', 3);
            roundBox(220, 118, 180, 102, 6, '#0b1324', '#64748b', 2);
            // 3 khay sản phẩm bên trong buồng sấy
            for (let row = 0; row < 3; row++) {
                const py = 144 + row * 28;
                ctx.fillStyle = '#475569';
                ctx.fillRect(228, py, 164, 5);
                // Viên đông trùng hạ thảo màu vàng nâu
                ctx.fillStyle = '#d97706';
                for (let c = 0; c < 11; c++) {
                    ctx.beginPath();
                    ctx.ellipse(238 + c * 14, py - 4, 5.5, 3.2, 0, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            // Các hạt hơi nước thăng hoa chuyển động 1 chiều (sawtooth) lên & sang bộ ngưng tụ
            ctx.fillStyle = '#38bdf8';
            for (let i = 0; i < 8; i++) {
                const p = (saw + i * 0.125) % 1;
                const px = 248 + p * 238;
                const py = 136 - Math.sin(p * Math.PI) * 14 + (i % 3 - 1) * 8;
                if (px < 488) {
                    ctx.beginPath();
                    ctx.arc(px, py, 3, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            // Áp kế trên đỉnh buồng sấy
            ctx.fillStyle = '#94a3b8';
            ctx.fillRect(344, 72, 12, 30);
            ctx.save();
            ctx.fillStyle = '#f8fafc';
            ctx.strokeStyle = '#64748b';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(350, 56, 22, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            // Kim áp kế dao động nhẹ ở vùng áp suất thấp
            const needleAng = -2.2 + Math.sin(t * 2.5) * 0.12;
            ctx.strokeStyle = '#dc2626';
            ctx.lineWidth = 2.6;
            ctx.beginPath();
            ctx.moveTo(350, 56);
            ctx.lineTo(350 + 15 * Math.cos(needleAng), 56 + 15 * Math.sin(needleAng));
            ctx.stroke();
            ctx.fillStyle = '#0f172a';
            ctx.beginPath(); ctx.arc(350, 56, 3.2, 0, Math.PI * 2); ctx.fill();
            ctx.restore();

            // Van trên ống dẫn
            roundBox(418, 66, 22, 20, 4, '#334155', '#e2e8f0', 2);
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 2.6;
            ctx.beginPath();
            ctx.moveTo(429, 66); ctx.lineTo(429, 54);
            ctx.moveTo(417, 54); ctx.lineTo(441, 54);
            ctx.stroke();

            // 4. Bộ ngưng tụ (phải trên)
            roundBox(488, 102, 120, 124, 12, '#1e293b', '#cbd5e1', 2.8);
            roundBox(502, 118, 92, 92, 6, '#0b1324', '#475569', 1.8);
            // Ống xoắn ngưng tụ màu xanh băng
            ctx.save();
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 4.5;
            ctx.lineCap = 'round';
            for (let k = 0; k < 5; k++) {
                const cy = 128 + k * 14;
                ctx.beginPath();
                ctx.moveTo(514, cy);
                ctx.lineTo(582, cy + 5);
                ctx.stroke();
            }
            // Nước lỏng ngưng tụ ở đáy bộ ngưng tụ
            ctx.fillStyle = 'rgba(56, 189, 248, 0.38)';
            ctx.fillRect(503, 194, 90, 15);
            ctx.restore();

            // 5. Bơm hút khí (phải dưới) + mũi tên khí thải
            roundBox(506, 242, 114, 42, 8, '#334155', '#94a3b8', 2.4);
            roundBox(578, 245, 40, 36, 6, '#2563eb', '#93c5fd', 2);
            arrowLine(626, 263, 742, 263, '#38bdf8', 3.4, 10);

            // 6. Các nhãn callout rõ nét, nằm gọn trong [10, 770] x [10, 295]
            calloutTag(80, 152, 14, 96, 'Bộ gia nhiệt', '#f97316');
            calloutTag(350, 34, 412, 12, 'Áp kế', '#fbbf24');
            calloutTag(429, 54, 510, 12, 'Van', '#94a3b8');
            calloutTag(262, 102, 140, 56, 'Buồng sấy', '#38bdf8');
            calloutTag(608, 134, 632, 84, 'Bộ ngưng tụ', '#38bdf8');
            calloutTag(506, 263, 292, 240, 'Bơm hút khí', '#10b981');
            calloutTag(688, 263, 628, 200, 'Khí thải ra', '#cbd5e1');
        });

    // =========================================================================
    // CÂU 4 (MH-STAGING-C1-04 · VLXT-DS-VD28-004): Đồ thị nung chảy khối kim loại 13,2 kg bằng lò hồ quang điện
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C1-04', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
            bgGrad.addColorStop(0, '#060b19');
            bgGrad.addColorStop(1, '#0a1226');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) {
                ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke();
            }
            for (let gy = 20; gy < h; gy += 26) {
                ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke();
            }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2.2) {
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(x, y, bw, bh, r);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function arrowLine(x1, y1, x2, y2, col, lw = 2.8, hl = 9) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }

            function drawOpenCrucible(x, y, cw, ch, col, lw = 3.2, flare = 7) {
                ctx.save();
                ctx.strokeStyle = col;
                ctx.lineWidth = lw;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.beginPath();
                ctx.moveTo(x - flare, y);
                ctx.lineTo(x, y + 6);
                ctx.lineTo(x, y + ch);
                ctx.lineTo(x + cw, y + ch);
                ctx.lineTo(x + cw, y + 6);
                ctx.lineTo(x + cw + flare, y);
                ctx.stroke();
                ctx.restore();
            }

            // CỘT TRÁI: ĐỒ THỊ t (°C) THEO T (phút) KHỚP 100% ẢNH GỐC
            const ox = 86, oy = 258;
            const x11 = 210, x19 = 306, xD = 374;
            const y34 = 234, y659 = 92, yD = 36;

            ctx.save();
            arrowLine(ox, oy + 6, ox, 24, '#f1f5f9', 2.8, 9);
            arrowLine(ox - 6, oy, 444, oy, '#f1f5f9', 2.8, 9);

            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 16px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            ctx.fillText('t (°C)', ox - 10, 34);

            ctx.textAlign = 'center';
            ctx.font = '800 15.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillText('T (phút)', 416, oy + 24);
            ctx.fillText('O', ox - 14, oy + 20);

            ctx.fillStyle = '#e2e8f0';
            ctx.font = '800 15px "DM Mono", monospace';
            ctx.fillText('11', x11, oy + 21);
            ctx.fillText('19', x19, oy + 21);

            ctx.textAlign = 'right';
            ctx.fillText('34', ox - 10, y34);
            ctx.fillText('659', ox - 10, y659);

            // Đường gióng nét đứt
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 1.8;
            ctx.setLineDash([5, 4]);
            ctx.beginPath();
            ctx.moveTo(ox, y659); ctx.lineTo(x19, y659);
            ctx.moveTo(x11, y659); ctx.lineTo(x11, oy);
            ctx.moveTo(x19, y659); ctx.lineTo(x19, oy);
            ctx.stroke();
            ctx.setLineDash([]);

            // Đường đồ thị A -> B -> C -> D
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 3.8;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(ox, y34);
            ctx.lineTo(x11, y659);
            ctx.lineTo(x19, y659);
            ctx.lineTo(xD, yD);
            ctx.stroke();

            const pts = [
                { x: ox, y: y34, lbl: 'A', lx: ox + 16, ly: y34 + 6 },
                { x: x11, y: y659, lbl: 'B', lx: x11 - 6, ly: y659 - 20 },
                { x: x19, y: y659, lbl: 'C', lx: x19 - 6, ly: y659 - 20 },
                { x: xD, y: yD, lbl: 'D', lx: xD + 16, ly: yD + 4 }
            ];
            pts.forEach(p => {
                ctx.fillStyle = '#fbbf24';
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.beginPath(); ctx.arc(p.x, p.y, 5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                ctx.font = '800 17px "Plus Jakarta Sans", system-ui, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(p.lbl, p.lx, p.ly);
            });

            // Điểm chạy 1 chiều sawtooth trên A -> B -> C -> D
            const saw = (t * 0.16) % 1;
            let dotX, dotY;
            if (saw < 0.45) {
                const r = saw / 0.45;
                dotX = ox + (x11 - ox) * r;
                dotY = y34 + (y659 - y34) * r;
            } else if (saw < 0.78) {
                const r = (saw - 0.45) / 0.33;
                dotX = x11 + (x19 - x11) * r;
                dotY = y659;
            } else {
                const r = (saw - 0.78) / 0.22;
                dotX = x19 + (xD - x19) * r;
                dotY = y659 + (yD - y659) * r;
            }
            ctx.fillStyle = '#f97316';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2.2;
            ctx.beginPath(); ctx.arc(dotX, dotY, 6.8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.restore();

            // CỘT PHẢI: THÔNG SỐ ĐỀ BÀI & LÒ HỒ QUANG ĐIỆN (ZERO DATA LEAKAGE)
            ctx.save();
            roundBox(476, 16, 286, 114, 10, '#0f172a', '#38bdf8', 2);
            ctx.fillStyle = '#38bdf8';
            ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText('LÒ HỒ QUANG ĐIỆN', 494, 39);

            ctx.fillStyle = '#f8fafc';
            ctx.font = '700 15px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillText('• Công suất: P = 1,1 · 10⁴ W', 494, 68);
            ctx.fillText('• Khối lượng: m = 13,2 kg', 494, 94);
            ctx.fillStyle = '#7dd3fc';
            ctx.fillText('• Theo dõi nhiệt độ t theo T', 494, 116);

            // Card mô phỏng lò hồ quang + chén nung hở miệng trên
            roundBox(476, 142, 286, 146, 10, '#0f172a', '#475569', 2);
            const cx = 554, cy = 186, cw = 130, ch = 64;
            // Điện cực hồ quang từ trên xuống miệng lò
            ctx.fillStyle = '#94a3b8';
            ctx.fillRect(cx + 34, 154, 10, 30);
            ctx.fillRect(cx + 86, 154, 10, 30);
            // Tia hồ quang sắc nét
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2.6;
            ctx.beginPath();
            const j1 = Math.sin(t * 25) * 4;
            ctx.moveTo(cx + 39, 184);
            ctx.lineTo(cx + 65, 194 + j1);
            ctx.lineTo(cx + 91, 184);
            ctx.stroke();

            // Khối kim loại trong lò nung nóng dần theo saw
            const meltH = saw < 0.45 ? 36 : (saw < 0.78 ? 36 - 10 * ((saw - 0.45) / 0.33) : 26);
            const kr = Math.round(120 + saw * 130);
            const kg = Math.round(130 + (1 - Math.abs(saw - 0.5)) * 40);
            const kb = Math.round(150 - saw * 110);
            roundBox(cx + 12, cy + ch - meltH - 4, cw - 24, meltH, 5, `rgb(${kr}, ${kg}, ${kb})`, '#fbbf24', 1.8);
            drawOpenCrucible(cx, cy, cw, ch, '#cbd5e1', 3.2, 8);

            ctx.fillStyle = '#e2e8f0';
            ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Khối kim loại (13,2 kg)', 619, 270);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 5 (MH-STAGING-C1-05 · VLXT-DS-VD28-005): Thí nghiệm so sánh sự bay hơi (nắng gió) và sự đun sôi nước tới cạn
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C1-05', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
            bgGrad.addColorStop(0, '#060b19');
            bgGrad.addColorStop(1, '#0a1226');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) {
                ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke();
            }
            for (let gy = 20; gy < h; gy += 26) {
                ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke();
            }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2.2) {
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(x, y, bw, bh, r);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function arrowLine(x1, y1, x2, y2, col, lw = 2.6, hl = 8) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }

            function drawOpenCup(x, y, cw, ch, col, lw = 3.2, flare = 7) {
                ctx.save();
                ctx.strokeStyle = col;
                ctx.lineWidth = lw;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.beginPath();
                ctx.moveTo(x - flare, y);
                ctx.lineTo(x, y + 6);
                ctx.lineTo(x, y + ch);
                ctx.lineTo(x + cw, y + ch);
                ctx.lineTo(x + cw, y + 6);
                ctx.lineTo(x + cw + flare, y);
                ctx.stroke();
                ctx.restore();
            }

            const saw = (t * 0.18) % 1;

            // KHUNG TRÁI: BƯỚC 1 - ĐỂ NƠI CÓ NẮNG VÀ GIÓ
            roundBox(16, 14, 366, 276, 12, '#0f172a', 'rgba(56, 189, 248, 0.45)', 2);
            ctx.save();
            ctx.fillStyle = '#38bdf8';
            ctx.font = '800 15.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('BƯỚC 1: NƠI CÓ NẮNG & GIÓ', 199, 38);

            // Mặt trời nhỏ góc trái
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath(); ctx.arc(64, 82, 16, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 2.4;
            for (let a = 0; a < 8; a++) {
                const ang = a * Math.PI / 4 + t * 0.4;
                ctx.beginPath();
                ctx.moveTo(64 + 21 * Math.cos(ang), 82 + 21 * Math.sin(ang));
                ctx.lineTo(64 + 27 * Math.cos(ang), 82 + 27 * Math.sin(ang));
                ctx.stroke();
            }

            // Gió thổi ngang qua mặt thoáng
            arrowLine(112, 86, 240, 86, '#7dd3fc', 2.4, 7);
            arrowLine(126, 108, 258, 108, '#7dd3fc', 2.4, 7);
            ctx.fillStyle = '#bae6fd';
            ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('Gió', 268, 97);

            // Cốc kim loại hở miệng trên (trái)
            const c1x = 136, c1y = 136, c1w = 126, c1h = 112;
            const wl1 = 82 - saw * 26;
            ctx.fillStyle = 'rgba(56, 189, 248, 0.34)';
            ctx.fillRect(c1x + 2, c1y + c1h - wl1, c1w - 4, wl1 - 2);
            ctx.strokeStyle = '#7dd3fc';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(c1x + 2, c1y + c1h - wl1);
            ctx.lineTo(c1x + c1w - 2, c1y + c1h - wl1);
            ctx.stroke();

            // Các hạt hơi thoát từ mặt thoáng
            ctx.fillStyle = '#93c5fd';
            for (let k = 0; k < 5; k++) {
                const p = (saw * 1.4 + k * 0.2) % 1;
                const hx = c1x + 22 + k * 20;
                const hy = (c1y + c1h - wl1 - 6) - p * 42;
                ctx.globalAlpha = 1 - p;
                ctx.beginPath(); ctx.arc(hx, hy, 3, 0, Math.PI * 2); ctx.fill();
            }
            ctx.globalAlpha = 1;
            drawOpenCup(c1x, c1y, c1w, c1h, '#cbd5e1', 3.2, 8);

            ctx.fillStyle = '#e2e8f0';
            ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Lượng nước giảm dần', 199, 270);
            ctx.restore();

            // KHUNG PHẢI: BƯỚC 2 & 3 - ĐUN SÔI TRÊN NGỌN LỬA ĐÈN CỒN
            roundBox(398, 14, 366, 276, 12, '#0f172a', 'rgba(249, 115, 22, 0.5)', 2);
            ctx.save();
            ctx.fillStyle = '#fb923c';
            ctx.font = '800 15.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('BƯỚC 2 – 3: ĐUN SÔI ĐẾN CẠN', 581, 38);

            const c2x = 518, c2y = 92, c2w = 126, c2h = 104;
            const boilPhase = saw < 0.45 ? 0 : (saw - 0.45) / 0.55;
            const wl2 = 76 - boilPhase * 42;
            ctx.fillStyle = 'rgba(251, 146, 60, 0.25)';
            ctx.fillRect(c2x + 2, c2y + c2h - wl2, c2w - 4, wl2 - 2);
            ctx.strokeStyle = '#fdba74';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(c2x + 2, c2y + c2h - wl2);
            ctx.lineTo(c2x + c2w - 2, c2y + c2h - wl2);
            ctx.stroke();

            // Bọt khí trong lòng chất lỏng đi lên vỡ ở mặt thoáng
            ctx.strokeStyle = '#f8fafc';
            ctx.lineWidth = 1.6;
            for (let b = 0; b < 7; b++) {
                const bp = (saw * 2.2 + b * 0.14) % 1;
                const bx = c2x + 18 + b * 15;
                const by = (c2y + c2h - 8) - bp * Math.max(10, wl2 - 12);
                const br = 2 + bp * (saw > 0.35 ? 3.2 : 1.5);
                ctx.beginPath(); ctx.arc(bx, by, br, 0, Math.PI * 2); ctx.stroke();
            }
            // Hơi bốc mạnh phía trên miệng cốc
            ctx.fillStyle = '#e2e8f0';
            for (let k = 0; k < 5; k++) {
                const p = (saw * 2 + k * 0.2) % 1;
                const hx = c2x + 20 + k * 21;
                const hy = (c2y + c2h - wl2 - 8) - p * 36;
                ctx.globalAlpha = (1 - p) * 0.85;
                ctx.beginPath(); ctx.arc(hx, hy, 3.2, 0, Math.PI * 2); ctx.fill();
            }
            ctx.globalAlpha = 1;
            drawOpenCup(c2x, c2y, c2w, c2h, '#cbd5e1', 3.2, 8);

            // Giá kiềng & đèn cồn bên dưới
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(c2x - 10, c2y + c2h + 4); ctx.lineTo(c2x + c2w + 10, c2y + c2h + 4);
            ctx.moveTo(c2x + 6, c2y + c2h + 4); ctx.lineTo(c2x - 4, 260);
            ctx.moveTo(c2x + c2w - 6, c2y + c2h + 4); ctx.lineTo(c2x + c2w + 4, 260);
            ctx.stroke();

            // Đèn cồn
            roundBox(554, 232, 54, 28, 6, '#1e293b', '#cbd5e1', 2);
            roundBox(574, 224, 14, 9, 2, '#e2e8f0', '#94a3b8', 1.5);
            const sway = Math.sin(t * 12) * 2;
            ctx.fillStyle = '#f97316';
            ctx.beginPath();
            ctx.moveTo(575, 224);
            ctx.quadraticCurveTo(572, 210, 581 + sway, 202);
            ctx.quadraticCurveTo(590, 210, 587, 224);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#fde047';
            ctx.beginPath();
            ctx.moveTo(578, 224);
            ctx.quadraticCurveTo(577, 214, 581 + sway * 0.5, 209);
            ctx.quadraticCurveTo(585, 214, 584, 224);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = '#e2e8f0';
            ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Đun trên ngọn lửa đèn cồn', 581, 275);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 6 (MH-STAGING-C1-06 · VLXT-DS-VD28-006): Hai nhiệt kế thủy ngân giống nhau nhúng trong hai cốc nước A và B
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C1-06', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
            bgGrad.addColorStop(0, '#060b19');
            bgGrad.addColorStop(1, '#0a1226');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) {
                ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke();
            }
            for (let gy = 20; gy < h; gy += 26) {
                ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke();
            }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2.2) {
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(x, y, bw, bh, r);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function drawOpenCup(x, y, cw, ch, col, lw = 3.2, flare = 8) {
                ctx.save();
                ctx.strokeStyle = col;
                ctx.lineWidth = lw;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.beginPath();
                ctx.moveTo(x - flare, y);
                ctx.lineTo(x, y + 6);
                ctx.lineTo(x, y + ch);
                ctx.lineTo(x + cw, y + ch);
                ctx.lineTo(x + cw, y + 6);
                ctx.lineTo(x + cw + flare, y);
                ctx.stroke();
                ctx.restore();
            }

            // Tiêu đề
            ctx.save();
            const title = 'HAI NHIỆT KẾ THỦY NGÂN TRONG CỐC A & B';
            ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
            const tw = ctx.measureText(title).width + 24;
            roundBox(16, 12, tw, 30, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, 28, 27);
            ctx.restore();

            // Sawtooth 1 chiều: mức thủy ngân từ cùng nhiệt độ ban đầu dâng dần lên mức cuối (2) > (1)
            const saw = (t * 0.22) % 1;
            const baseY = 178; // Mức ban đầu giống nhau
            const y1Top = baseY - saw * 34; // (1) lên đến y = 144
            const y2Top = baseY - saw * 72; // (2) lên đến y = 106

            function drawCupAndTherm(cx, cupLabel, thLabel, mercuryTopY, waterCol) {
                const cy = 178, cw = 136, ch = 104;
                // Nước tràn sát thành bình
                ctx.save();
                ctx.fillStyle = waterCol;
                ctx.fillRect(cx + 2, cy + 16, cw - 4, ch - 18);
                ctx.strokeStyle = '#7dd3fc';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(cx + 2, cy + 16);
                ctx.lineTo(cx + cw - 2, cy + 16);
                ctx.stroke();
                ctx.restore();

                drawOpenCup(cx, cy, cw, ch, '#cbd5e1', 3.2, 8);

                // Nhãn cốc A / B
                ctx.save();
                ctx.fillStyle = '#f8fafc';
                ctx.font = '800 18px "Plus Jakarta Sans", system-ui, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(cupLabel, cx - 22, cy + ch - 10);

                // Nhiệt kế thủy ngân thẳng đứng
                const tx = cx + cw / 2;
                const tubeTop = 72, bulbY = cy + 62;
                roundBox(tx - 6, tubeTop, 12, bulbY - tubeTop, 6, '#0f172a', '#e2e8f0', 2);
                // Bầu thủy ngân dưới
                ctx.fillStyle = '#ef4444';
                ctx.strokeStyle = '#e2e8f0';
                ctx.lineWidth = 2;
                ctx.beginPath(); ctx.arc(tx, bulbY, 10, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                // Cột thủy ngân dâng 1 chiều
                ctx.fillStyle = '#ef4444';
                ctx.fillRect(tx - 3.2, mercuryTopY, 6.4, bulbY - mercuryTopY);

                // Vạch chia nhỏ bên cạnh
                ctx.strokeStyle = '#94a3b8';
                ctx.lineWidth = 1.4;
                for (let vy = tubeTop + 12; vy < cy + 8; vy += 10) {
                    ctx.beginPath(); ctx.moveTo(tx + 6, vy); ctx.lineTo(tx + 11, vy); ctx.stroke();
                }

                // Nhãn (1) hoặc (2) trên đỉnh
                ctx.fillStyle = '#fbbf24';
                ctx.font = '800 17px "Plus Jakarta Sans", system-ui, sans-serif';
                ctx.fillText(thLabel, tx, tubeTop - 16);
                ctx.restore();
                return tx;
            }

            const t1x = drawCupAndTherm(98, 'A', '(1)', y1Top, 'rgba(56, 189, 248, 0.25)');
            const t2x = drawCupAndTherm(318, 'B', '(2)', y2Top, 'rgba(249, 115, 22, 0.25)');

            // Đường nét đứt ngang từ đỉnh thủy ngân (2) sang ống (1) giống ảnh gốc
            ctx.save();
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 2.2;
            ctx.setLineDash([6, 5]);
            ctx.beginPath();
            ctx.moveTo(t1x + 8, y2Top);
            ctx.lineTo(t2x - 8, y2Top);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.restore();

            // Card tóm tắt dữ kiện đề (Zero Data Leakage)
            ctx.save();
            roundBox(498, 62, 264, 212, 10, '#0f172a', '#38bdf8', 2);
            ctx.fillStyle = '#38bdf8';
            ctx.font = '800 15.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText('DỮ KIỆN ĐỀ BÀI', 518, 90);

            ctx.fillStyle = '#f8fafc';
            ctx.font = '700 15px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillText('• Hai nhiệt kế (1), (2) giống nhau', 518, 126);
            ctx.fillText('• Ban đầu chỉ cùng nhiệt độ', 518, 158);
            ctx.fillText('• Nhúng vào hai cốc nước A, B', 518, 190);
            ctx.fillStyle = '#fbbf24';
            ctx.fillText('• Sau đó: mức (2) cao hơn (1)', 518, 222);
            ctx.fillStyle = '#94a3b8';
            ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillText('Quan sát chiều dâng cột Hg', 518, 252);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 7 (MH-STAGING-C1-07 · VLXT-DS-VD28-007): Nhiệt kế phòng chia hai thang đo Celsius (°C) và Fahrenheit (°F)
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C1-07', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
            bgGrad.addColorStop(0, '#060b19');
            bgGrad.addColorStop(1, '#0a1226');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) {
                ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke();
            }
            for (let gy = 20; gy < h; gy += 26) {
                ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke();
            }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2.2) {
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(x, y, bw, bh, r);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            // Tiêu đề
            ctx.save();
            const title = 'NHIỆT KẾ HAI THANG ĐO CELSIUS (°C) & FAHRENHEIT (°F)';
            ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
            const tw = ctx.measureText(title).width + 22;
            roundBox(14, 12, tw, 30, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, 25, 27);
            ctx.restore();

            // Thân nhiệt kế gỗ phẳng đẹp bên trái
            const tx = 186, topY = 58, botY = 286;
            roundBox(86, topY - 4, 200, botY - topY + 8, 18, '#1e293b', '#94a3b8', 2.8);
            roundBox(tx - 8, topY + 34, 16, botY - topY - 62, 8, '#0f172a', '#cbd5e1', 2);

            // Nhãn đầu 2 thang đo
            ctx.save();
            ctx.fillStyle = '#38bdf8';
            ctx.font = '800 17px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('°C', tx - 46, topY + 16);
            ctx.fillStyle = '#fbbf24';
            ctx.fillText('°F', tx + 46, topY + 16);

            // Vạch chia từ 0°C (y=234) đến 100°C (y=104)
            const y0C = 234, y100C = 104;
            const marks = [
                { c: '0', f: '32', r: 0 },
                { c: '25', f: '77', r: 0.25 },
                { c: '50', f: '122', r: 0.5 },
                { c: '75', f: '167', r: 0.75 },
                { c: '100', f: '212', r: 1.0 }
            ];
            marks.forEach(m => {
                const yy = y0C - m.r * (y0C - y100C);
                ctx.strokeStyle = '#cbd5e1';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(tx - 24, yy); ctx.lineTo(tx - 9, yy);
                ctx.moveTo(tx + 9, yy); ctx.lineTo(tx + 24, yy);
                ctx.stroke();

                ctx.font = '800 15px "DM Mono", monospace';
                ctx.fillStyle = '#e2e8f0';
                ctx.textAlign = 'right';
                ctx.fillText(m.c, tx - 30, yy);
                ctx.textAlign = 'left';
                ctx.fillStyle = '#fde68a';
                ctx.fillText(m.f, tx + 30, yy);
            });

            // Cột thủy ngân dâng 1 chiều sawtooth từ 0°C/32°F -> 100°C/212°F
            const saw = (t * 0.16) % 1;
            const curY = y0C - saw * (y0C - y100C);
            ctx.fillStyle = '#ef4444';
            ctx.beginPath(); ctx.arc(tx, botY - 22, 12, 0, Math.PI * 2); ctx.fill();
            ctx.fillRect(tx - 4, curY, 8, (botY - 22) - curY);

            // Đường gióng ngang nổi bật ở đỉnh thủy ngân
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(tx - 24, curY); ctx.lineTo(tx + 24, curY);
            ctx.stroke();
            ctx.restore();

            // CỘT PHẢI: HAI MỐC NHIỆT ĐỘ CỦA FAHRENHEIT (ZERO DATA LEAKAGE)
            ctx.save();
            roundBox(316, 62, 446, 108, 10, '#0f172a', '#fbbf24', 2);
            ctx.fillStyle = '#fbbf24';
            ctx.font = '800 15.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText('THANG NHIỆT ĐỘ FAHRENHEIT (1724)', 336, 88);
            ctx.fillStyle = '#f8fafc';
            ctx.font = '700 15px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillText('• Mốc nước đá đang tan (1 atm): 32 °F', 336, 118);
            ctx.fillText('• Mốc nước tinh khiết sôi (1 atm): 212 °F', 336, 146);

            roundBox(316, 184, 446, 102, 10, '#0f172a', '#38bdf8', 2);
            ctx.fillStyle = '#38bdf8';
            ctx.font = '800 15.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillText('NHIỆT KẾ PHÒNG HAI THANG ĐO', 336, 212);
            ctx.fillStyle = '#e2e8f0';
            ctx.font = '700 15px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillText('• Chung bầu chất lỏng & ống mao quản', 336, 240);
            ctx.fillText('• Đối chiếu trực tiếp hai thang °C và °F', 336, 266);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 8 (MH-STAGING-C1-08 · VLXT-DS-VD28-008): Đồ thị nhiệt độ – thời gian khi đun nóng chất lỏng đến nhiệt độ sôi 80 °C
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C1-08', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
            bgGrad.addColorStop(0, '#060b19');
            bgGrad.addColorStop(1, '#0a1226');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) {
                ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke();
            }
            for (let gy = 20; gy < h; gy += 26) {
                ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke();
            }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2.2) {
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(x, y, bw, bh, r);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function arrowLine(x1, y1, x2, y2, col, lw = 2.8, hl = 9) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }

            function drawOpenCup(x, y, cw, ch, col, lw = 3.2, flare = 7) {
                ctx.save();
                ctx.strokeStyle = col;
                ctx.lineWidth = lw;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.beginPath();
                ctx.moveTo(x - flare, y);
                ctx.lineTo(x, y + 6);
                ctx.lineTo(x, y + ch);
                ctx.lineTo(x + cw, y + ch);
                ctx.lineTo(x + cw, y + 6);
                ctx.lineTo(x + cw + flare, y);
                ctx.stroke();
                ctx.restore();
            }

            // CỘT TRÁI: LƯỚI ĐỒ THỊ KHỚP 100% ẢNH GỐC
            const ox = 92, oy = 250;
            const stepX = 50; // 1 phút = 50px (0..7)
            const stepY = 22; // 10°C = 22px (0..90)

            ctx.save();
            // Lưới phụ của đồ thị
            ctx.strokeStyle = 'rgba(148, 163, 184, 0.28)';
            ctx.lineWidth = 1.2;
            for (let m = 1; m <= 7; m++) {
                const xx = ox + m * stepX;
                ctx.beginPath(); ctx.moveTo(xx, oy); ctx.lineTo(xx, oy - 9 * stepY); ctx.stroke();
            }
            for (let k = 1; k <= 9; k++) {
                const yy = oy - k * stepY;
                ctx.beginPath(); ctx.moveTo(ox, yy); ctx.lineTo(ox + 7 * stepX, yy); ctx.stroke();
            }

            // Trục tọa độ
            arrowLine(ox, oy + 4, ox, 26, '#f8fafc', 2.8, 9);
            arrowLine(ox - 4, oy, ox + 7 * stepX + 34, oy, '#f8fafc', 2.8, 9);

            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 15.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            ctx.fillText('Nhiệt độ', ox - 10, 26);
            ctx.fillText('(°C)', ox - 16, 46);

            ctx.textAlign = 'center';
            ctx.fillText('Thời gian', 442, oy + 20);
            ctx.fillText('(phút)', 442, oy + 38);

            ctx.font = '800 15px "DM Mono", monospace';
            ctx.fillText('0', ox - 12, oy + 16);
            for (let m = 1; m <= 6; m++) {
                ctx.fillText(String(m), ox + m * stepX, oy + 20);
            }
            ctx.textAlign = 'right';
            [20, 40, 60, 80].forEach(val => {
                ctx.fillText(String(val), ox - 10, oy - (val / 10) * stepY);
            });

            // Đường cong thực nghiệm: t = 30 -> 50 -> 65 -> 75 -> 80 -> 80 -> 80 -> 80
            function tempAtMin(tau) {
                if (tau >= 4) return 80;
                // Đa thức khớp qua (0,30), (1,50), (2,65), (3,75), (4,80)
                return 30 + 22.5 * tau - 2.5 * tau * tau;
            }
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 3.8;
            ctx.lineCap = 'round';
            ctx.beginPath();
            for (let i = 0; i <= 70; i++) {
                const tau = i * 0.1;
                const px = ox + tau * stepX;
                const py = oy - (tempAtMin(tau) / 10) * stepY;
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.stroke();

            // Hạt động 1 chiều sawtooth trên đồ thị
            const saw = (t * 0.16) % 1;
            const curTau = saw * 7;
            const curTemp = tempAtMin(curTau);
            const dotX = ox + curTau * stepX;
            const dotY = oy - (curTemp / 10) * stepY;
            ctx.fillStyle = '#f97316';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2.2;
            ctx.beginPath(); ctx.arc(dotX, dotY, 6.8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.restore();

            // CỘT PHẢI: MINH HỌA CỐC ĐUN SÔI & THÔNG TIN ĐỀ (ZERO DATA LEAKAGE)
            ctx.save();
            roundBox(498, 22, 266, 98, 10, '#0f172a', '#38bdf8', 2);
            ctx.fillStyle = '#38bdf8';
            ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText('ĐUN NÓNG CHẤT LỎNG', 516, 46);
            ctx.fillStyle = '#f8fafc';
            ctx.font = '700 15px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillText('• Đun chất lỏng đến khi sôi', 516, 74);
            ctx.fillText('• Ghi nhiệt độ theo phút', 516, 100);

            roundBox(498, 134, 266, 152, 10, '#0f172a', '#475569', 2);
            const cx = 568, cy = 152, cw = 126, ch = 88;
            ctx.fillStyle = 'rgba(56, 189, 248, 0.28)';
            ctx.fillRect(cx + 2, cy + 20, cw - 4, ch - 22);
            ctx.strokeStyle = '#7dd3fc';
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(cx + 2, cy + 20); ctx.lineTo(cx + cw - 2, cy + 20); ctx.stroke();
            // Bọt khí tăng dần khi curTau > 3.5
            const isBoil = curTau >= 3.8;
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 1.6;
            for (let b = 0; b < (isBoil ? 8 : 3); b++) {
                const bp = (t * 0.9 + b * 0.17) % 1;
                const bx = cx + 18 + b * 13;
                const by = cy + ch - 8 - bp * 58;
                ctx.beginPath(); ctx.arc(bx, by, isBoil ? 3.5 : 2, 0, Math.PI * 2); ctx.stroke();
            }
            drawOpenCup(cx, cy, cw, ch, '#cbd5e1', 3.2, 7);
            // Thanh gia nhiệt bên dưới
            roundBox(cx - 8, cy + ch + 5, cw + 16, 9, 4, 'rgba(249, 115, 22, 0.78)', '#fb923c', 1.6);
            ctx.fillStyle = '#e2e8f0';
            ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Bình chất lỏng đang đun', 631, 268);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 9 (MH-STAGING-C1-09 · VLXT-DS-VD28-009): Máy hàn điện xung có biến áp hạ áp làm nóng chảy cuộn dây thiếc – chì
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C1-09', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
            bgGrad.addColorStop(0, '#060b19');
            bgGrad.addColorStop(1, '#0a1226');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) {
                ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke();
            }
            for (let gy = 20; gy < h; gy += 26) {
                ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke();
            }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2.2) {
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(x, y, bw, bh, r);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function calloutTag(tx, ty, bx, by, label, col) {
                ctx.save();
                ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
                const padX = 11, boxH = 28;
                const tw = ctx.measureText(label).width;
                const boxW = tw + padX * 2;
                bx = Math.min(w - 10 - boxW, Math.max(10, bx));
                by = Math.min(h - 10 - boxH, Math.max(10, by));
                const ax = (bx + boxW / 2 < tx) ? (bx + boxW) : bx;
                const ay = by + boxH / 2;

                ctx.strokeStyle = col;
                ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(ax, ay); ctx.stroke();
                ctx.fillStyle = col;
                ctx.beginPath(); ctx.arc(tx, ty, 3.6, 0, Math.PI * 2); ctx.fill();

                roundBox(bx, by, boxW, boxH, 6, '#0f172a', col, 2);
                ctx.fillStyle = '#f8fafc';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(label, bx + boxW / 2, by + boxH / 2);
                ctx.restore();
            }

            function drawSub(x, y, base, sub, rest, col, fontPx = 15.5) {
                ctx.save();
                ctx.fillStyle = col;
                ctx.textAlign = 'left';
                ctx.textBaseline = 'middle';
                ctx.font = `700 ${fontPx}px "Plus Jakarta Sans", system-ui, sans-serif`;
                ctx.fillText(base, x, y);
                const w1 = ctx.measureText(base).width;
                ctx.font = '700 12.5px "Plus Jakarta Sans", system-ui, sans-serif';
                ctx.fillText(sub, x + w1, y + 5);
                const w2 = ctx.measureText(sub).width;
                ctx.font = `700 ${fontPx}px "Plus Jakarta Sans", system-ui, sans-serif`;
                ctx.fillText(rest, x + w1 + w2, y);
                ctx.restore();
            }

            const saw = (t * 0.25) % 1;

            // 1. Thân súng máy hàn (giống ảnh gốc: vỏ cam, lõi biến áp, tay cầm)
            ctx.save();
            ctx.fillStyle = '#ea580c';
            ctx.strokeStyle = '#fdba74';
            ctx.lineWidth = 2.4;
            ctx.beginPath();
            ctx.moveTo(210, 64);
            ctx.lineTo(432, 64);
            ctx.lineTo(432, 160);
            ctx.lineTo(392, 160);
            ctx.lineTo(436, 266);
            ctx.lineTo(380, 274);
            ctx.lineTo(330, 160);
            ctx.lineTo(222, 148);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Cò bấm màu đen
            roundBox(314, 152, 20, 34, 4, '#1e293b', '#94a3b8', 1.8);

            // Máy biến áp bên trong thân máy
            roundBox(310, 74, 108, 72, 6, '#334155', '#e2e8f0', 2);
            // Cuộn dây vàng bên trong biến áp
            roundBox(332, 86, 64, 46, 4, '#eab308', '#fef08a', 1.8);
            // Thanh đồng thứ cấp chạy ra đầu mỏ hàn
            ctx.strokeStyle = '#d97706';
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.moveTo(332, 92); ctx.lineTo(226, 92);
            ctx.moveTo(332, 122); ctx.lineTo(226, 122);
            ctx.stroke();

            // Hai ống kẹp thép & đầu Mỏ hàn chữ V/U
            roundBox(166, 86, 62, 12, 3, '#94a3b8', '#e2e8f0', 1.6);
            roundBox(166, 116, 62, 12, 3, '#94a3b8', '#e2e8f0', 1.6);

            const tipR = Math.round(148 + saw * 107);
            const tipG = Math.round(163 - saw * 70);
            const tipB = Math.round(184 - saw * 150);
            ctx.strokeStyle = `rgb(${tipR}, ${tipG}, ${tipB})`;
            ctx.lineWidth = 4;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(166, 92);
            ctx.lineTo(106, 98);
            ctx.lineTo(74, 107);
            ctx.lineTo(106, 116);
            ctx.lineTo(166, 122);
            ctx.stroke();

            // Điểm nóng chảy đầu mỏ hàn
            ctx.fillStyle = `rgb(255, ${Math.round(200 - saw * 100)}, 40)`;
            ctx.beginPath(); ctx.arc(74, 107, 4.8, 0, Math.PI * 2); ctx.fill();
            ctx.restore();

            // 2. Cuộn thiếc hàn (bên dưới trái) & sợi dây thiếc đưa lên chạm đầu mỏ hàn
            ctx.save();
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 2.6;
            ctx.beginPath();
            ctx.moveTo(118, 206);
            ctx.quadraticCurveTo(80, 160, 74, 108);
            ctx.stroke();

            // Cuộn dây thiếc (hình trụ phẳng)
            roundBox(96, 206, 118, 42, 10, '#475569', '#cbd5e1', 2.2);
            roundBox(92, 198, 126, 14, 6, '#eab308', '#fef08a', 2);
            roundBox(92, 242, 126, 14, 6, '#64748b', '#e2e8f0', 2);
            ctx.fillStyle = '#0f172a';
            ctx.beginPath(); ctx.ellipse(155, 205, 16, 4.5, 0, 0, Math.PI * 2); ctx.fill();
            ctx.restore();

            // 3. Các callout khớp nhãn ảnh gốc
            calloutTag(86, 102, 16, 20, 'Mỏ hàn', '#f97316');
            calloutTag(364, 108, 286, 18, 'Máy biến áp', '#fbbf24');
            calloutTag(155, 250, 14, 260, 'Thiếc hàn', '#38bdf8');

            // 4. Card thông số đề bài bên phải (Zero Data Leakage: không lộ máy hạ áp, 4768 J, 99,3 s)
            ctx.save();
            roundBox(476, 18, 288, 268, 10, '#0f172a', '#38bdf8', 2);
            ctx.fillStyle = '#38bdf8';
            ctx.font = '800 15.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText('THÔNG SỐ MÁY HÀN', 494, 46);

            ctx.fillStyle = '#f8fafc';
            ctx.font = '700 15px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillText('• Cuộn thiếc – chì: m = 100 g', 494, 82);
            ctx.fillText('• Tỉ lệ khối lượng: 63 : 37', 494, 112);
            drawSub(494, 142, '• λ', 'Sn', ' = 0,61 · 10⁵ J/kg', '#7dd3fc', 15.5);
            drawSub(494, 172, '• λ', 'Pb', ' = 0,25 · 10⁵ J/kg', '#7dd3fc', 15.5);
            ctx.fillStyle = '#fbbf24';
            ctx.font = '700 15px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillText('• Hiệu điện thế: U = 12 V', 494, 204);
            ctx.fillText('• Điện trở mối hàn: R = 2,4 Ω', 494, 234);
            ctx.fillText('• Hiệu suất mỏ hàn: H = 80%', 494, 264);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 10 (MH-STAGING-C1-10 · VLXT-DS-VD28-010): Đồ thị trao đổi nhiệt giữa 200 g nước đá (−8 °C) và nước (35 °C)
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C1-10', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
            bgGrad.addColorStop(0, '#060b19');
            bgGrad.addColorStop(1, '#0a1226');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) {
                ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke();
            }
            for (let gy = 20; gy < h; gy += 26) {
                ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke();
            }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2.2) {
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(x, y, bw, bh, r);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function arrowLine(x1, y1, x2, y2, col, lw = 2.8, hl = 9) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }

            function drawOpenCup(x, y, cw, ch, col, lw = 3.2, flare = 7) {
                ctx.save();
                ctx.strokeStyle = col;
                ctx.lineWidth = lw;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.beginPath();
                ctx.moveTo(x - flare, y);
                ctx.lineTo(x, y + 6);
                ctx.lineTo(x, y + ch);
                ctx.lineTo(x + cw, y + ch);
                ctx.lineTo(x + cw, y + 6);
                ctx.lineTo(x + cw + flare, y);
                ctx.stroke();
                ctx.restore();
            }

            function drawSub(x, y, base, sub, rest, col, fontPx = 15.5) {
                ctx.save();
                ctx.fillStyle = col;
                ctx.textAlign = 'left';
                ctx.textBaseline = 'middle';
                ctx.font = `700 ${fontPx}px "Plus Jakarta Sans", system-ui, sans-serif`;
                ctx.fillText(base, x, y);
                const w1 = ctx.measureText(base).width;
                ctx.font = '700 12.5px "Plus Jakarta Sans", system-ui, sans-serif';
                ctx.fillText(sub, x + w1, y + 5);
                const w2 = ctx.measureText(sub).width;
                ctx.font = `700 ${fontPx}px "Plus Jakarta Sans", system-ui, sans-serif`;
                ctx.fillText(rest, x + w1 + w2, y);
                ctx.restore();
            }

            // CỘT TRÁI: ĐỒ THỊ KHỚP 100% ẢNH GỐC
            const ox = 86, oy = 216; // t = 0 °C
            const y35 = 62, y5 = 192, yM8 = 256;
            const x1 = 158, x2 = 226, x3 = 266, xEnd = 368;

            ctx.save();
            arrowLine(ox, 286, ox, 22, '#f8fafc', 2.8, 9);
            arrowLine(26, oy, 444, oy, '#f8fafc', 2.8, 9);

            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 15.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText('Nhiệt độ t (°C)', ox + 14, 34);
            ctx.textAlign = 'center';
            ctx.fillText('Thời gian τ (s)', 402, oy + 28);

            ctx.font = '800 15px "DM Mono", monospace';
            ctx.textAlign = 'right';
            ctx.fillText('35', ox - 10, y35);
            ctx.fillText('5', ox - 10, y5);
            ctx.fillText('O', ox - 10, oy + 16);
            ctx.fillText('-8', ox - 10, yM8);

            // Nhãn τ1, τ2, τ3 chuẩn subscript
            drawSub(x1 - 10, oy + 20, 'τ', '1', '', '#e2e8f0', 16);
            drawSub(x2 - 10, oy + 20, 'τ', '2', '', '#e2e8f0', 16);
            drawSub(x3 - 6, oy + 20, 'τ', '3', '', '#e2e8f0', 16);

            // Đường gióng nét đứt đỏ giống ảnh gốc
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 4]);
            ctx.beginPath();
            ctx.moveTo(ox, y5); ctx.lineTo(x3, y5); ctx.lineTo(x3, oy);
            ctx.stroke();
            ctx.setLineDash([]);

            // Đường nước nóng (cam): (0, 35) -> (τ3, 5) -> (xEnd, 5)
            ctx.strokeStyle = '#f97316';
            ctx.lineWidth = 3.6;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(ox, y35); ctx.lineTo(x3, y5); ctx.lineTo(xEnd, y5);
            ctx.stroke();

            // Đường nước đá (xanh băng): (0, -8) -> (τ1, 0) -> (τ2, 0) -> (τ3, 5) -> (xEnd, 5)
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 3.6;
            ctx.beginPath();
            ctx.moveTo(ox, yM8); ctx.lineTo(x1, oy); ctx.lineTo(x2, oy); ctx.lineTo(x3, y5); ctx.lineTo(xEnd, y5);
            ctx.stroke();

            // Hai điểm chạy đồng bộ theo sawtooth 1 chiều
            const saw = (t * 0.16) % 1;
            const px = ox + saw * (xEnd - ox);
            const wY = px <= x3 ? y35 + ((px - ox) / (x3 - ox)) * (y5 - y35) : y5;
            let iY;
            if (px <= x1) iY = yM8 + ((px - ox) / (x1 - ox)) * (oy - yM8);
            else if (px <= x2) iY = oy;
            else if (px <= x3) iY = oy + ((px - x2) / (x3 - x2)) * (y5 - oy);
            else iY = y5;

            ctx.fillStyle = '#f97316'; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(px, wY, 6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath(); ctx.arc(px, iY, 6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.restore();

            // CỘT PHẢI: THÔNG SỐ & CỐC CÁCH NHIỆT (ZERO DATA LEAKAGE)
            ctx.save();
            roundBox(476, 14, 288, 140, 10, '#0f172a', '#38bdf8', 2);
            ctx.fillStyle = '#38bdf8';
            ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText('CỐC CÁCH NHIỆT', 494, 34);
            ctx.fillStyle = '#f8fafc';
            ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillText('• Đá: 200 g (-8 °C) · Nước: 35 °C', 494, 58);
            drawSub(494, 84, '• c', 'đ', ' = 2100 J/(kg·K)', '#7dd3fc', 15.5);
            drawSub(494, 110, '• c', 'n', ' = 4200 J/(kg·K)', '#7dd3fc', 15.5);
            ctx.fillStyle = '#fbbf24';
            ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillText('• λ = 3,4 · 10⁵ J/kg', 494, 136);

            roundBox(476, 164, 288, 126, 10, '#0f172a', '#475569', 2);
            const cx = 548, cy = 180, cw = 144, ch = 76;
            ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
            ctx.fillRect(cx + 2, cy + 20, cw - 4, ch - 22);
            ctx.strokeStyle = '#7dd3fc';
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(cx + 2, cy + 20); ctx.lineTo(cx + cw - 2, cy + 20); ctx.stroke();

            // Viên đá nhỏ dần từ lúc qua τ1 đến tan hết tại τ2
            const meltFrac = px <= x1 ? 1 : (px >= x2 ? 0 : 1 - (px - x1) / (x2 - x1));
            if (meltFrac > 0.05) {
                const iw = 88 * (0.4 + 0.6 * meltFrac);
                const ih = 34 * (0.4 + 0.6 * meltFrac);
                roundBox(cx + cw / 2 - iw / 2, cy + 24, iw, ih, 6, '#bae6fd', '#ffffff', 2);
            }
            drawOpenCup(cx, cy, cw, ch, '#cbd5e1', 3.4, 8);
            ctx.fillStyle = '#e2e8f0';
            ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Quá trình cân bằng nhiệt', 620, 272);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 11 (MH-STAGING-C1-11 · VLXT-DS-VD28-011): Khảo sát tốc độ giảm nhiệt độ của 2 kg nước theo 3 chế độ gió
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C1-11', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
            bgGrad.addColorStop(0, '#060b19');
            bgGrad.addColorStop(1, '#0a1226');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) {
                ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke();
            }
            for (let gy = 20; gy < h; gy += 26) {
                ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke();
            }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2.2) {
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(x, y, bw, bh, r);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function arrowLine(x1, y1, x2, y2, col, lw = 2.6, hl = 8) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }

            function drawOpenCup(x, y, cw, ch, col, lw = 3.2, flare = 8) {
                ctx.save();
                ctx.strokeStyle = col;
                ctx.lineWidth = lw;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.beginPath();
                ctx.moveTo(x - flare, y);
                ctx.lineTo(x, y + 6);
                ctx.lineTo(x, y + ch);
                ctx.lineTo(x + cw, y + ch);
                ctx.lineTo(x + cw, y + 6);
                ctx.lineTo(x + cw + flare, y);
                ctx.stroke();
                ctx.restore();
            }

            const saw = (t * 0.18) % 1;

            // CỘT TRÁI: QUẠT GIÓ THỔI QUA CHẬU NƯỚC 2 kg (50 °C)
            roundBox(14, 14, 336, 276, 12, '#0f172a', 'rgba(56, 189, 248, 0.45)', 2);
            ctx.save();
            ctx.fillStyle = '#38bdf8';
            ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('KHẢO SÁT LÀM NGUỘI NƯỚC', 182, 38);

            // Quạt gió bên trái
            const fx = 66, fy = 128;
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 3;
            ctx.beginPath(); ctx.arc(fx, fy, 32, 0, Math.PI * 2); ctx.stroke();
            ctx.fillStyle = '#1e293b'; ctx.fill();
            for (let b = 0; b < 3; b++) {
                const ang = t * 6 + (b * Math.PI * 2) / 3;
                ctx.fillStyle = '#38bdf8';
                ctx.beginPath();
                ctx.ellipse(fx + 14 * Math.cos(ang), fy + 14 * Math.sin(ang), 14, 5, ang, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.fillStyle = '#e2e8f0';
            ctx.beginPath(); ctx.arc(fx, fy, 5, 0, Math.PI * 2); ctx.fill();
            // Chân quạt
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(fx, fy + 32); ctx.lineTo(fx, 244);
            ctx.moveTo(fx - 22, 244); ctx.lineTo(fx + 22, 244);
            ctx.stroke();

            // Luồng gió thổi ngang qua miệng chậu
            const windShift = (t * 45) % 24;
            for (let row = 0; row < 2; row++) {
                arrowLine(108 + windShift * 0.4, 114 + row * 24, 168 + windShift * 0.4, 114 + row * 24, '#7dd3fc', 2.4, 7);
            }

            // Chậu nước hở miệng trên (2 kg nước)
            const bx = 186, by = 152, bw = 136, bh = 90;
            ctx.fillStyle = 'rgba(56, 189, 248, 0.34)';
            ctx.fillRect(bx + 2, by + 18, bw - 4, bh - 20);
            ctx.strokeStyle = '#7dd3fc';
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(bx + 2, by + 18); ctx.lineTo(bx + bw - 2, by + 18); ctx.stroke();
            drawOpenCup(bx, by, bw, bh, '#cbd5e1', 3.2, 8);

            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillText('Nước: 2 kg', bx + bw / 2, by + 54);
            ctx.fillStyle = '#cbd5e1';
            ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillText('Phòng: 25 °C · Ban đầu: 50 °C', 182, 268);
            ctx.restore();

            // CỘT PHẢI: ĐỒ THỊ 3 CHẾ ĐỘ TỪ SỐ LIỆU BẢNG (KHÔNG LỘ ĐÁP ÁN a, b, c, d)
            ctx.save();
            roundBox(366, 14, 400, 276, 12, '#0f172a', '#475569', 2);
            const ox = 424, oy = 232, wG = 294, hG = 166;
            arrowLine(ox, oy + 4, ox, 44, '#f8fafc', 2.4, 8);
            arrowLine(ox - 4, oy, ox + wG + 28, oy, '#f8fafc', 2.4, 8);

            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText('t (°C)', ox + 10, 44);
            ctx.textAlign = 'center';
            ctx.fillText('τ (phút)', 716, oy + 40);

            // Mốc trục tung 30, 40, 50 và trục hoành 0..5
            ctx.fillStyle = '#cbd5e1';
            ctx.font = '800 14.5px "DM Mono", monospace';
            for (let m = 0; m <= 5; m++) {
                const xx = ox + (m / 5) * (wG - 18);
                ctx.fillText(String(m), xx, oy + 18);
            }
            ctx.textAlign = 'right';
            [30, 40, 50].forEach(val => {
                const yy = oy - ((val - 28) / 25) * hG;
                ctx.fillText(String(val), ox - 8, yy);
            });

            const series = [
                { name: 'Không gió', col: '#fbbf24', pts: [50, 46, 43.5, 41.5, 40, 39], ly: 60 },
                { name: 'Gió nhỏ', col: '#38bdf8', pts: [50, 45, 42, 39.5, 37.8, 36.5], ly: 84 },
                { name: 'Gió lớn', col: '#10b981', pts: [50, 43, 39, 36, 34, 32.3], ly: 108 }
            ];
            series.forEach(s => {
                ctx.strokeStyle = s.col;
                ctx.lineWidth = 3;
                ctx.beginPath();
                s.pts.forEach((val, idx) => {
                    const xx = ox + (idx / 5) * (wG - 18);
                    const yy = oy - ((val - 28) / 25) * hG;
                    if (idx === 0) ctx.moveTo(xx, yy);
                    else ctx.lineTo(xx, yy);
                });
                ctx.stroke();
                // Chú thích màu góc trên phải
                ctx.fillStyle = s.col;
                ctx.fillRect(584, s.ly - 4, 18, 5);
                ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
                ctx.textAlign = 'left';
                ctx.fillText(s.name, 610, s.ly - 1);
            });

            // Hạt quét theo sawtooth trên cả 3 đường
            const mPos = saw * 5;
            const i0 = Math.min(4, Math.floor(mPos));
            const fr = mPos - i0;
            series.forEach(s => {
                const v = s.pts[i0] + (s.pts[i0 + 1] - s.pts[i0]) * fr;
                const px = ox + (mPos / 5) * (wG - 18);
                const py = oy - ((v - 28) / 25) * hG;
                ctx.fillStyle = s.col;
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 1.8;
                ctx.beginPath(); ctx.arc(px, py, 5.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            });
            ctx.restore();
        });

    // =========================================================================
    // CÂU 12 (MH-STAGING-C1-12 · VLXT-DS-VD28-012): Bộ thí nghiệm đo nhiệt nóng chảy riêng của nước đá (có bù nhiệt môi trường)
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C1-12', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
            bgGrad.addColorStop(0, '#060b19');
            bgGrad.addColorStop(1, '#0a1226');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) {
                ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke();
            }
            for (let gy = 20; gy < h; gy += 26) {
                ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke();
            }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2.2) {
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(x, y, bw, bh, r);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function drawOpenCup(x, y, cw, ch, col, lw = 3, flare = 6) {
                ctx.save();
                ctx.strokeStyle = col;
                ctx.lineWidth = lw;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.beginPath();
                ctx.moveTo(x - flare, y);
                ctx.lineTo(x, y + 5);
                ctx.lineTo(x, y + ch);
                ctx.lineTo(x + cw, y + ch);
                ctx.lineTo(x + cw, y + 5);
                ctx.lineTo(x + cw + flare, y);
                ctx.stroke();
                ctx.restore();
            }

            function calloutTag(tx, ty, bx, by, label, col) {
                ctx.save();
                ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
                const padX = 10, boxH = 26;
                const tw = ctx.measureText(label).width;
                const boxW = tw + padX * 2;
                bx = Math.min(w - 10 - boxW, Math.max(10, bx));
                by = Math.min(h - 10 - boxH, Math.max(10, by));
                const ax = (bx + boxW / 2 < tx) ? (bx + boxW) : bx;
                const ay = by + boxH / 2;

                ctx.strokeStyle = col;
                ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(ax, ay); ctx.stroke();
                ctx.fillStyle = col;
                ctx.beginPath(); ctx.arc(tx, ty, 3.5, 0, Math.PI * 2); ctx.fill();

                roundBox(bx, by, boxW, boxH, 6, '#0f172a', col, 2);
                ctx.fillStyle = '#f8fafc';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(label, bx + boxW / 2, by + boxH / 2);
                ctx.restore();
            }

            const saw = (t * 0.2) % 1;

            // 1. Biến áp nguồn (góc trái dưới) & Oát kế (cạnh phải)
            roundBox(22, 224, 92, 58, 7, '#1e293b', '#94a3b8', 2.4);
            roundBox(34, 234, 68, 22, 4, '#0f172a', '#38bdf8', 1.6);
            ctx.save();
            ctx.fillStyle = '#38bdf8';
            ctx.font = '800 14.5px "DM Mono", monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('NGUỒN', 68, 245);
            ctx.restore();

            roundBox(142, 234, 58, 38, 6, '#1e293b', '#fbbf24', 2.2);
            ctx.save();
            ctx.fillStyle = '#fbbf24';
            ctx.font = '800 14.5px "DM Mono", monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('24 W', 171, 253);
            ctx.restore();

            // Dây dẫn điện từ biến áp -> oát kế -> nắp nhiệt lượng kế (kín khít)
            ctx.save();
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 2.4;
            ctx.beginPath();
            ctx.moveTo(114, 244); ctx.lineTo(142, 244);
            ctx.moveTo(114, 260); ctx.lineTo(142, 260);
            // 2 dây chạy lên nhiệt lượng kế
            ctx.moveTo(200, 242); ctx.lineTo(256, 242); ctx.lineTo(256, 40); ctx.lineTo(356, 40); ctx.lineTo(356, 62);
            ctx.moveTo(200, 262); ctx.lineTo(272, 262); ctx.lineTo(272, 56); ctx.lineTo(392, 56); ctx.lineTo(392, 62);
            ctx.stroke();
            ctx.restore();

            // 2. Giá đỡ bên phải nhiệt lượng kế
            const rodX = 502;
            ctx.save();
            ctx.fillStyle = '#64748b';
            ctx.fillRect(rodX - 4, 48, 8, 232);
            roundBox(rodX - 24, 276, 48, 12, 3, '#334155', '#94a3b8', 2);
            // Tay kẹp ngang ôm nhiệt lượng kế
            ctx.fillStyle = '#cbd5e1';
            ctx.fillRect(326, 98, rodX - 326, 6);
            ctx.restore();

            // 3. Nhiệt lượng kế + nước đá + dây nung + vòi chảy
            roundBox(328, 62, 92, 86, 8, '#1e293b', '#cbd5e1', 2.8);
            // Viên nước đá bên trong
            ctx.fillStyle = 'rgba(186, 230, 253, 0.52)';
            for (let k = 0; k < 4; k++) {
                roundBox(338 + (k % 2) * 38, 78 + Math.floor(k / 2) * 28, 32, 24, 4, 'rgba(186, 230, 253, 0.5)', '#e0f2fe', 1.5);
            }
            // Dây nung xoắn màu cam bên trong
            ctx.save();
            ctx.strokeStyle = '#f97316';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(356, 62); ctx.lineTo(356, 118);
            for (let z = 0; z < 4; z++) {
                ctx.lineTo(362 + z * 8, 112 + (z % 2) * 12);
            }
            ctx.lineTo(392, 118); ctx.lineTo(392, 62);
            ctx.stroke();
            ctx.restore();

            // Phễu nhỏ giọt dưới đáy nhiệt lượng kế
            ctx.fillStyle = '#cbd5e1';
            ctx.fillRect(369, 148, 10, 14);
            // Giọt nước rơi 1 chiều xuống cốc hứng nước
            const dropP = (saw * 3) % 1;
            const dropY = 166 + dropP * 32;
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath(); ctx.arc(374, dropY, 4, 0, Math.PI * 2); ctx.fill();

            // 4. Cốc hứng nước hở miệng trên đặt trên Cân điện tử
            const cx = 338, cy = 186, cw = 72, ch = 64;
            const waterH = 14 + saw * 36;
            ctx.fillStyle = 'rgba(56, 189, 248, 0.42)';
            ctx.fillRect(cx + 2, cy + ch - waterH, cw - 4, waterH - 2);
            drawOpenCup(cx, cy, cw, ch, '#cbd5e1', 3, 6);

            // Cân điện tử bên dưới
            roundBox(298, 252, 152, 34, 6, '#1e293b', '#38bdf8', 2.4);
            roundBox(342, 258, 64, 20, 4, '#0f172a', '#64748b', 1.6);
            ctx.save();
            ctx.fillStyle = '#7dd3fc';
            ctx.font = '800 14.5px "DM Mono", monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('CÂN', 374, 268);
            ctx.restore();

            // 5. Đồng hồ bấm giây (bên phải)
            const swX = 684, swY = 224, swR = 42;
            ctx.save();
            ctx.fillStyle = '#f8fafc';
            ctx.strokeStyle = '#64748b';
            ctx.lineWidth = 4;
            ctx.beginPath(); ctx.arc(swX, swY, swR, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            roundBox(swX - 8, swY - swR - 12, 16, 10, 3, '#94a3b8', '#e2e8f0', 1.6);
            // Kim quay 1 chiều sawtooth
            const swAng = -Math.PI / 2 + saw * Math.PI * 2;
            ctx.strokeStyle = '#dc2626';
            ctx.lineWidth = 2.8;
            ctx.beginPath(); ctx.moveTo(swX, swY); ctx.lineTo(swX + 30 * Math.cos(swAng), swY + 30 * Math.sin(swAng)); ctx.stroke();
            ctx.fillStyle = '#0f172a';
            ctx.beginPath(); ctx.arc(swX, swY, 4, 0, Math.PI * 2); ctx.fill();
            ctx.restore();

            // 6. Nhãn callout to rõ, chống đè nét
            calloutTag(68, 224, 14, 154, 'Biến áp nguồn', '#38bdf8');
            calloutTag(171, 234, 142, 190, 'Oát kế', '#fbbf24');
            calloutTag(374, 62, 474, 16, 'Nhiệt lượng kế', '#cbd5e1');
            calloutTag(392, 112, 526, 66, 'Dây nung', '#f97316');
            calloutTag(410, 214, 514, 114, 'Cốc hứng nước', '#38bdf8');
            calloutTag(684, 170, 658, 114, 't = 180 s', '#10b981');
        });

    // =========================================================================
    // CÂU 13 (MH-STAGING-C1-13 · VLXT-DS-VD28-013): Thí nghiệm đun cách thủy và đồ thị nóng chảy của băng phiến (60 °C – 86 °C)
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C1-13', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
            bgGrad.addColorStop(0, '#060b19');
            bgGrad.addColorStop(1, '#0a1226');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) {
                ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke();
            }
            for (let gy = 20; gy < h; gy += 26) {
                ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke();
            }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2.2) {
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(x, y, bw, bh, r);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function arrowLine(x1, y1, x2, y2, col, lw = 2.6, hl = 8) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }

            function drawOpenCup(x, y, cw, ch, col, lw = 3.2, flare = 7) {
                ctx.save();
                ctx.strokeStyle = col;
                ctx.lineWidth = lw;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.beginPath();
                ctx.moveTo(x - flare, y);
                ctx.lineTo(x, y + 5);
                ctx.lineTo(x, y + ch);
                ctx.lineTo(x + cw, y + ch);
                ctx.lineTo(x + cw, y + 5);
                ctx.lineTo(x + cw + flare, y);
                ctx.stroke();
                ctx.restore();
            }

            function calloutTag(tx, ty, bx, by, label, col) {
                ctx.save();
                ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
                const padX = 10, boxH = 27;
                const tw = ctx.measureText(label).width;
                const boxW = tw + padX * 2;
                bx = Math.min(w - 10 - boxW, Math.max(10, bx));
                by = Math.min(h - 10 - boxH, Math.max(10, by));
                const ax = (bx + boxW / 2 < tx) ? (bx + boxW) : bx;
                const ay = by + boxH / 2;

                ctx.strokeStyle = col;
                ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(ax, ay); ctx.stroke();
                ctx.fillStyle = col;
                ctx.beginPath(); ctx.arc(tx, ty, 3.6, 0, Math.PI * 2); ctx.fill();

                roundBox(bx, by, boxW, boxH, 6, '#0f172a', col, 2);
                ctx.fillStyle = '#f8fafc';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(label, bx + boxW / 2, by + boxH / 2);
                ctx.restore();
            }

            const saw = (t * 0.16) % 1;

            // CỘT TRÁI: BỘ THÍ NGHIỆM GIÁ ĐỠ + ĐÈN CỒN + BÌNH NƯỚC + ỐNG NGHIỆM BĂNG PHIẾN + NHIỆT KẾ
            const rodX = 336;
            ctx.save();
            // Chân đế & trụ giá đỡ
            ctx.fillStyle = '#334155';
            ctx.strokeStyle = '#64748b';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(200, 286); ctx.lineTo(382, 286); ctx.lineTo(366, 266); ctx.lineTo(256, 266);
            ctx.closePath(); ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#94a3b8';
            ctx.fillRect(rodX - 4, 24, 8, 242);

            // 3 tay kẹp ngang từ trụ sang trái
            ctx.fillStyle = '#cbd5e1';
            ctx.fillRect(218, 34, rodX - 218, 6);  // kẹp nhiệt kế
            ctx.fillRect(216, 114, rodX - 216, 6); // kẹp ống nghiệm
            ctx.fillRect(160, 214, rodX - 160, 5); // kiềng đỡ bình nước

            // Đèn cồn dưới kiềng
            const bx = 224;
            roundBox(bx - 22, 244, 44, 34, 8, '#1e293b', '#cbd5e1', 2.2);
            roundBox(bx - 8, 236, 16, 9, 2, '#e2e8f0', '#94a3b8', 1.5);
            const sway = Math.sin(t * 11) * 1.8;
            ctx.fillStyle = '#f97316';
            ctx.beginPath();
            ctx.moveTo(bx - 6, 236);
            ctx.quadraticCurveTo(bx - 8, 224, bx + sway, 216);
            ctx.quadraticCurveTo(bx + 8, 224, bx + 6, 236);
            ctx.closePath(); ctx.fill();

            // Bình nước cách thủy (hở miệng trên)
            const wx = 172, wy = 140, ww = 104, wh = 72;
            ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
            ctx.fillRect(wx + 2, wy + 12, ww - 4, wh - 14);
            drawOpenCup(wx, wy, ww, wh, '#cbd5e1', 3, 6);

            // Ống nghiệm đựng băng phiến nhúng trong bình nước
            const tx = 208, ty = 92, tw = 32, th = 106;
            roundBox(tx, ty, tw, th, 14, 'rgba(30, 41, 59, 0.7)', '#e2e8f0', 2.2);
            // Trạng thái băng phiến: 0..0.53 rắn (trắng), 0.53..0.73 rắn+lỏng, 0.73..1 lỏng (trong xanh)
            const isMelt = saw >= 0.53 && saw <= 0.73;
            const isLiq = saw > 0.73;
            ctx.fillStyle = isLiq ? 'rgba(125, 211, 252, 0.6)' : (isMelt ? 'rgba(186, 230, 253, 0.75)' : '#e2e8f0');
            roundBox(tx + 3, ty + 60, tw - 6, 42, 10, ctx.fillStyle, '#94a3b8', 1.4);

            // Nhiệt kế cắm từ trên xuống vào ống nghiệm
            roundBox(220, 24, 8, 162, 4, '#0f172a', '#e2e8f0', 1.8);
            const mTop = 94 - saw * 42;
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(222, mTop, 4, 180 - mTop);
            ctx.restore();

            calloutTag(224, 52, 14, 20, 'Nhiệt kế', '#ef4444');
            calloutTag(172, 162, 14, 118, 'Bình nước', '#38bdf8');
            calloutTag(224, 178, 14, 184, 'Băng phiến', '#e2e8f0');
            calloutTag(202, 260, 14, 254, 'Đèn cồn', '#f97316');

            // CỘT PHẢI: BIỂU ĐỒ DỮ LIỆU BẢNG THEO DÕI (0..15 phút: 60 -> 80 -> 86 °C)
            ctx.save();
            roundBox(406, 16, 360, 274, 12, '#0f172a', '#475569', 2);
            const ox = 466, oy = 242, wG = 272, hG = 186;
            arrowLine(ox, oy + 4, ox, 34, '#f8fafc', 2.4, 8);
            arrowLine(ox - 4, oy, ox + wG + 14, oy, '#f8fafc', 2.4, 8);

            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText('t (°C)', ox + 10, 42);
            ctx.textAlign = 'center';
            ctx.fillText('Thời gian (phút)', 656, oy + 32);

            ctx.font = '800 14.5px "DM Mono", monospace';
            ctx.fillStyle = '#cbd5e1';
            [0, 4, 8, 11, 15].forEach(m => {
                ctx.fillText(String(m), ox + (m / 15) * (wG - 14), oy + 16);
            });
            ctx.textAlign = 'right';
            [60, 70, 80, 86].forEach(val => {
                const yy = oy - ((val - 56) / 34) * hG;
                ctx.fillText(String(val), ox - 8, yy);
            });

            const pts = [
                [0, 60], [1, 63], [2, 66], [3, 69], [4, 72], [5, 75], [6, 77], [7, 79],
                [8, 80], [9, 80], [10, 80], [11, 80], [12, 81], [13, 82], [14, 84], [15, 86]
            ];
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 3.4;
            ctx.beginPath();
            pts.forEach(([m, val], idx) => {
                const xx = ox + (m / 15) * (wG - 14);
                const yy = oy - ((val - 56) / 34) * hG;
                if (idx === 0) ctx.moveTo(xx, yy);
                else ctx.lineTo(xx, yy);
            });
            ctx.stroke();

            // Hạt chạy 1 chiều trên đường đồ thị
            const fMin = saw * 15;
            const i0 = Math.min(14, Math.floor(fMin));
            const fr = fMin - i0;
            const curV = pts[i0][1] + (pts[i0 + 1][1] - pts[i0][1]) * fr;
            const dotX = ox + (fMin / 15) * (wG - 14);
            const dotY = oy - ((curV - 56) / 34) * hG;
            ctx.fillStyle = '#f97316';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(dotX, dotY, 6.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.restore();
        });

    // =========================================================================
    // CÂU 14 (MH-STAGING-C1-14 · VLXT-DS-VD28-014): Quạt hơi nước làm mát không khí trong phòng kín (4 m × 5 m × 4 m)
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C1-14', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
            bgGrad.addColorStop(0, '#060b19');
            bgGrad.addColorStop(1, '#0a1226');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) {
                ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke();
            }
            for (let gy = 20; gy < h; gy += 26) {
                ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke();
            }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2.2) {
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(x, y, bw, bh, r);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function arrowLine(x1, y1, x2, y2, col, lw = 3.2, hl = 10) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }

            function drawOpenCup(x, y, cw, ch, col, lw = 2.8, flare = 5) {
                ctx.save();
                ctx.strokeStyle = col;
                ctx.lineWidth = lw;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.beginPath();
                ctx.moveTo(x - flare, y);
                ctx.lineTo(x, y + 4);
                ctx.lineTo(x, y + ch);
                ctx.lineTo(x + cw, y + ch);
                ctx.lineTo(x + cw, y + 4);
                ctx.lineTo(x + cw + flare, y);
                ctx.stroke();
                ctx.restore();
            }

            function calloutTag(tx, ty, bx, by, label, col) {
                ctx.save();
                ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
                const padX = 10, boxH = 26;
                const tw = ctx.measureText(label).width;
                const boxW = tw + padX * 2;
                bx = Math.min(w - 10 - boxW, Math.max(10, bx));
                by = Math.min(h - 10 - boxH, Math.max(10, by));
                const ax = (bx + boxW / 2 < tx) ? (bx + boxW) : bx;
                const ay = by + boxH / 2;

                ctx.strokeStyle = col;
                ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(ax, ay); ctx.stroke();
                ctx.fillStyle = col;
                ctx.beginPath(); ctx.arc(tx, ty, 3.6, 0, Math.PI * 2); ctx.fill();

                roundBox(bx, by, boxW, boxH, 6, '#0f172a', col, 2);
                ctx.fillStyle = '#f8fafc';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(label, bx + boxW / 2, by + boxH / 2);
                ctx.restore();
            }

            const saw = (t * 0.25) % 1;

            // 1. Khay chia nước (trên) & Khay hứng nước (dưới) đều hở miệng trên (U-shape)
            ctx.save();
            ctx.fillStyle = 'rgba(56, 189, 248, 0.45)';
            ctx.fillRect(216, 44, 72, 14);
            drawOpenCup(214, 34, 76, 26, '#cbd5e1', 2.8, 5);

            ctx.fillStyle = 'rgba(56, 189, 248, 0.45)';
            ctx.fillRect(216, 250, 72, 16);
            drawOpenCup(214, 240, 76, 28, '#cbd5e1', 2.8, 5);

            // Giọt nước chảy dọc xuống tấm làm mát
            ctx.fillStyle = '#38bdf8';
            for (let k = 0; k < 5; k++) {
                const dp = (saw * 2 + k * 0.2) % 1;
                const dx = 224 + k * 14;
                const dy = 64 + dp * 176;
                ctx.beginPath(); ctx.arc(dx, dy, 2.8, 0, Math.PI * 2); ctx.fill();
            }

            // 2. Tấm làm mát tổ ong (giữa)
            roundBox(218, 78, 68, 144, 5, '#b45309', '#f59e0b', 2.4);
            ctx.strokeStyle = 'rgba(254, 243, 199, 0.35)';
            ctx.lineWidth = 1.4;
            for (let gy = 88; gy < 216; gy += 12) {
                ctx.beginPath(); ctx.moveTo(220, gy); ctx.lineTo(284, gy); ctx.stroke();
            }

            // 3. Luồng gió nóng (đỏ cam, trái) -> Gió tươi mát (xanh, phải)
            arrowLine(34, 150, 196, 150, '#ef4444', 4.5, 12);
            ctx.fillStyle = '#fca5a5';
            ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Gió nóng', 110, 128);

            // Quạt gió bên phải tấm làm mát
            roundBox(352, 88, 44, 122, 6, '#334155', '#cbd5e1', 2.6);
            ctx.fillStyle = '#0f172a';
            ctx.beginPath(); ctx.ellipse(374, 149, 14, 46, 0, 0, Math.PI * 2); ctx.fill();
            // Cánh quạt quay
            const bladeY = Math.sin(t * 9) * 34;
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 5;
            ctx.beginPath(); ctx.moveTo(374, 149 - bladeY); ctx.lineTo(374, 149 + bladeY); ctx.stroke();

            // Luồng gió mát sau tấm làm mát -> qua quạt ra ngoài
            arrowLine(294, 150, 346, 150, '#38bdf8', 4, 10);
            arrowLine(402, 126, 488, 112, '#38bdf8', 3.4, 9);
            arrowLine(402, 150, 496, 150, '#38bdf8', 3.8, 10);
            arrowLine(402, 174, 488, 188, '#38bdf8', 3.4, 9);

            ctx.fillStyle = '#7dd3fc';
            ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillText('Gió tươi mát', 448, 78);
            ctx.restore();

            // 4. Nhãn callout khớp ảnh gốc
            calloutTag(214, 46, 14, 24, 'Khay chia nước', '#38bdf8');
            calloutTag(218, 198, 14, 198, 'Tấm làm mát', '#fbbf24');
            calloutTag(214, 256, 14, 260, 'Khay hứng nước', '#38bdf8');
            calloutTag(374, 210, 314, 256, 'Quạt gió', '#cbd5e1');

            // 5. Card thông số phòng kín bên phải (Zero Data Leakage: không lộ 0,42 kg, 949200 J, 96 kg, 9,8 °C)
            ctx.save();
            roundBox(506, 20, 260, 264, 10, '#0f172a', '#38bdf8', 2);
            ctx.fillStyle = '#38bdf8';
            ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText('THÔNG SỐ ĐỀ BÀI', 524, 48);

            ctx.fillStyle = '#f8fafc';
            ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillText('• Phòng kín: 4 m × 5 m × 4 m', 524, 84);
            ctx.fillText('• Nước bay hơi: 0,7 g/s', 524, 116);
            ctx.fillText('• Nhiệt độ nước: 35 °C', 524, 148);
            ctx.fillStyle = '#7dd3fc';
            ctx.fillText('• L = 2,26 · 10⁶ J/kg', 524, 180);
            ctx.fillText('• D = 1,2 kg/m³', 524, 212);
            ctx.fillText('• c = 1005 J/(kg·K)', 524, 244);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 15 (MH-STAGING-C1-15 · VLXT-DS-VD28-015): So sánh cơ chế bay hơi trên mặt thoáng và sôi trong lòng chất lỏng
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C1-15', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
            bgGrad.addColorStop(0, '#060b19');
            bgGrad.addColorStop(1, '#0a1226');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) {
                ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke();
            }
            for (let gy = 20; gy < h; gy += 26) {
                ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke();
            }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2.2) {
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(x, y, bw, bh, r);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function drawOpenCup(x, y, cw, ch, col, lw = 3.2, flare = 8) {
                ctx.save();
                ctx.strokeStyle = col;
                ctx.lineWidth = lw;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.beginPath();
                ctx.moveTo(x - flare, y);
                ctx.lineTo(x, y + 6);
                ctx.lineTo(x, y + ch);
                ctx.lineTo(x + cw, y + ch);
                ctx.lineTo(x + cw, y + 6);
                ctx.lineTo(x + cw + flare, y);
                ctx.stroke();
                ctx.restore();
            }

            const saw = (t * 0.22) % 1;

            // KHUNG TRÁI: SỰ BAY HƠI
            roundBox(16, 14, 366, 276, 12, '#0f172a', 'rgba(56, 189, 248, 0.45)', 2);
            ctx.save();
            ctx.fillStyle = '#38bdf8';
            ctx.font = '800 16px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('SỰ BAY HƠI', 199, 40);

            const c1x = 128, c1y = 118, c1w = 142, c1h = 114;
            ctx.fillStyle = 'rgba(56, 189, 248, 0.32)';
            ctx.fillRect(c1x + 2, c1y + 34, c1w - 4, c1h - 36);
            ctx.strokeStyle = '#7dd3fc';
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(c1x + 2, c1y + 34); ctx.lineTo(c1x + c1w - 2, c1y + 34); ctx.stroke();

            // Chỉ các phân tử ở lớp mặt thoáng bật lên
            ctx.fillStyle = '#bae6fd';
            for (let k = 0; k < 6; k++) {
                const p = (saw * 1.3 + k * 0.17) % 1;
                const px = c1x + 20 + k * 20;
                const py = c1y + 32 - p * 54;
                ctx.globalAlpha = 1 - p;
                ctx.beginPath(); ctx.arc(px, py, 3.2, 0, Math.PI * 2); ctx.fill();
            }
            ctx.globalAlpha = 1;
            drawOpenCup(c1x, c1y, c1w, c1h, '#cbd5e1', 3.2, 8);

            ctx.fillStyle = '#e2e8f0';
            ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillText('Phân tử thoát khỏi mặt thoáng', 199, 260);
            ctx.restore();

            // KHUNG PHẢI: SỰ SÔI
            roundBox(398, 14, 366, 276, 12, '#0f172a', 'rgba(249, 115, 22, 0.5)', 2);
            ctx.save();
            ctx.fillStyle = '#fb923c';
            ctx.font = '800 16px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('SỰ SÔI', 581, 40);

            const c2x = 510, c2y = 108, c2w = 142, c2h = 114;
            ctx.fillStyle = 'rgba(249, 115, 22, 0.25)';
            ctx.fillRect(c2x + 2, c2y + 28, c2w - 4, c2h - 30);
            ctx.strokeStyle = '#fdba74';
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(c2x + 2, c2y + 28); ctx.lineTo(c2x + c2w - 2, c2y + 28); ctx.stroke();

            // Bọt khí sinh ra trong lòng chất lỏng đi lên vỡ ở mặt thoáng + hơi thoát ra
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.8;
            for (let b = 0; b < 8; b++) {
                const p = (saw * 1.8 + b * 0.13) % 1;
                const bx = c2x + 18 + b * 15;
                const by = c2y + c2h - 10 - p * 74;
                ctx.beginPath(); ctx.arc(bx, by, 2.2 + p * 3.5, 0, Math.PI * 2); ctx.stroke();
            }
            ctx.fillStyle = '#fde68a';
            for (let k = 0; k < 6; k++) {
                const p = (saw * 1.8 + k * 0.16) % 1;
                const px = c2x + 20 + k * 20;
                const py = c2y + 26 - p * 46;
                ctx.globalAlpha = 1 - p;
                ctx.beginPath(); ctx.arc(px, py, 3.4, 0, Math.PI * 2); ctx.fill();
            }
            ctx.globalAlpha = 1;
            drawOpenCup(c2x, c2y, c2w, c2h, '#cbd5e1', 3.2, 8);
            // Nguồn nhiệt đun bên dưới
            roundBox(c2x - 6, c2y + c2h + 6, c2w + 12, 10, 4, 'rgba(249, 115, 22, 0.85)', '#fb923c', 1.6);

            ctx.fillStyle = '#e2e8f0';
            ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillText('Bọt khí trong lòng & mặt thoáng', 581, 260);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 16 (MH-STAGING-C1-16 · VLXT-DS-VD28-016): Đồ thị nhiệt độ – thời gian của chì qua hai giai đoạn nóng chảy (327 °C) và sôi (1749 °C)
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C1-16', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
            bgGrad.addColorStop(0, '#060b19');
            bgGrad.addColorStop(1, '#0a1226');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) {
                ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke();
            }
            for (let gy = 20; gy < h; gy += 26) {
                ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke();
            }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2.2) {
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(x, y, bw, bh, r);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function arrowLine(x1, y1, x2, y2, col, lw = 2.8, hl = 9) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }

            function drawOpenCrucible(x, y, cw, ch, col, lw = 3.2, flare = 7) {
                ctx.save();
                ctx.strokeStyle = col;
                ctx.lineWidth = lw;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.beginPath();
                ctx.moveTo(x - flare, y);
                ctx.lineTo(x, y + 6);
                ctx.lineTo(x, y + ch);
                ctx.lineTo(x + cw, y + ch);
                ctx.lineTo(x + cw, y + 6);
                ctx.lineTo(x + cw + flare, y);
                ctx.stroke();
                ctx.restore();
            }

            // CỘT TRÁI: ĐỒ THỊ KHỚP 100% ẢNH GỐC
            const ox = 86, oy = 258;
            const y327 = 192, y1749 = 92, yTop = 38;
            const x1 = 128, x2 = 224, x3 = 304, x4 = 384, x5 = 432;

            ctx.save();
            arrowLine(ox, oy + 6, ox, 24, '#f8fafc', 2.8, 9);
            arrowLine(ox - 6, oy, 464, oy, '#f8fafc', 2.8, 9);

            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 15.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText('t (°C)', ox + 14, 34);
            ctx.textAlign = 'center';
            ctx.fillText('Thời gian', 428, oy + 24);

            ctx.font = '800 15px "DM Mono", monospace';
            ctx.textAlign = 'right';
            ctx.fillText('0', ox - 10, oy + 14);
            ctx.fillText('327', ox - 10, y327);
            ctx.fillText('1749', ox - 10, y1749);

            // Đường gióng ngang nét đứt
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 1.8;
            ctx.setLineDash([5, 4]);
            ctx.beginPath();
            ctx.moveTo(ox, y327); ctx.lineTo(x1, y327);
            ctx.moveTo(ox, y1749); ctx.lineTo(x3, y1749);
            ctx.stroke();
            ctx.setLineDash([]);

            // Đường đồ thị chính: (ox,oy) -> (x1,y327) -> (x2,y327) -> (x3,y1749) -> (x4,y1749) -> (x5,yTop)
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 3.8;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(ox, oy);
            ctx.lineTo(x1, y327);
            ctx.lineTo(x2, y327);
            ctx.lineTo(x3, y1749);
            ctx.lineTo(x4, y1749);
            ctx.lineTo(x5, yTop);
            ctx.stroke();

            // Các điểm M, N, P, Q giống ảnh gốc
            const pts = [
                { x: (ox + x1) / 2, y: (oy + y327) / 2, lbl: 'M', lx: (ox + x1) / 2 + 16, ly: (oy + y327) / 2 + 8 },
                { x: (x1 + x2) / 2, y: y327, lbl: 'N', lx: (x1 + x2) / 2, ly: y327 - 19 },
                { x: (x2 + x3) / 2, y: (y327 + y1749) / 2, lbl: 'P', lx: (x2 + x3) / 2 - 16, ly: (y327 + y1749) / 2 - 10 },
                { x: (x3 + x4) / 2, y: y1749, lbl: 'Q', lx: (x3 + x4) / 2, ly: y1749 - 19 }
            ];
            pts.forEach(p => {
                ctx.fillStyle = '#fbbf24';
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.beginPath(); ctx.arc(p.x, p.y, 5.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                ctx.font = '800 17px "Plus Jakarta Sans", system-ui, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(p.lbl, p.lx, p.ly);
            });

            // Hạt chuyển động 1 chiều sawtooth trên toàn đồ thị
            const saw = (t * 0.15) % 1;
            let dotX, dotY;
            if (saw < 0.16) {
                const r = saw / 0.16;
                dotX = ox + (x1 - ox) * r; dotY = oy + (y327 - oy) * r;
            } else if (saw < 0.42) {
                const r = (saw - 0.16) / 0.26;
                dotX = x1 + (x2 - x1) * r; dotY = y327;
            } else if (saw < 0.64) {
                const r = (saw - 0.42) / 0.22;
                dotX = x2 + (x3 - x2) * r; dotY = y327 + (y1749 - y327) * r;
            } else if (saw < 0.88) {
                const r = (saw - 0.64) / 0.24;
                dotX = x3 + (x4 - x3) * r; dotY = y1749;
            } else {
                const r = (saw - 0.88) / 0.12;
                dotX = x4 + (x5 - x4) * r; dotY = y1749 + (yTop - y1749) * r;
            }
            ctx.fillStyle = '#f97316';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2.2;
            ctx.beginPath(); ctx.arc(dotX, dotY, 6.6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.restore();

            // CỘT PHẢI: CHÉN NUNG CHÌ (ZERO DATA LEAKAGE)
            ctx.save();
            roundBox(498, 22, 266, 98, 10, '#0f172a', '#38bdf8', 2);
            ctx.fillStyle = '#38bdf8';
            ctx.font = '800 15.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText('ĐUN NÓNG CHÌ (Pb)', 516, 46);
            ctx.fillStyle = '#f8fafc';
            ctx.font = '700 15px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillText('• Đồ thị t (°C) theo thời gian', 516, 74);
            ctx.fillText('• Các điểm khảo sát: M, N, P, Q', 516, 100);

            roundBox(498, 134, 266, 152, 10, '#0f172a', '#475569', 2);
            const cx = 568, cy = 166, cw = 126, ch = 70;
            const kr = Math.round(120 + saw * 135);
            const kg = Math.round(135 + saw * 30);
            const kb = Math.round(150 - saw * 110);
            roundBox(cx + 12, cy + 28, cw - 24, 36, 5, `rgb(${kr}, ${kg}, ${kb})`, '#e2e8f0', 1.8);
            drawOpenCrucible(cx, cy, cw, ch, '#cbd5e1', 3.2, 7);
            roundBox(cx - 8, cy + ch + 5, cw + 16, 9, 4, 'rgba(249, 115, 22, 0.8)', '#fb923c', 1.6);

            ctx.fillStyle = '#e2e8f0';
            ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Quá trình cấp nhiệt liên tục', 631, 268);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 17 (MH-STAGING-C1-17 · VLXT-DS-VD28-017): Cân bằng nhiệt giữa 0,5 kg nước đá (−20 °C) và 0,5 kg nước (30 °C)
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C1-17', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
            bgGrad.addColorStop(0, '#060b19');
            bgGrad.addColorStop(1, '#0a1226');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) {
                ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke();
            }
            for (let gy = 20; gy < h; gy += 26) {
                ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke();
            }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2.2) {
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(x, y, bw, bh, r);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function arrowLine(x1, y1, x2, y2, col, lw = 2.8, hl = 8) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }

            function drawOpenCup(x, y, cw, ch, col, lw = 3.2, flare = 8) {
                ctx.save();
                ctx.strokeStyle = col;
                ctx.lineWidth = lw;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.beginPath();
                ctx.moveTo(x - flare, y);
                ctx.lineTo(x, y + 6);
                ctx.lineTo(x, y + ch);
                ctx.lineTo(x + cw, y + ch);
                ctx.lineTo(x + cw, y + 6);
                ctx.lineTo(x + cw + flare, y);
                ctx.stroke();
                ctx.restore();
            }

            function drawSub(x, y, base, sub, rest, col, fontPx = 15.5) {
                ctx.save();
                ctx.fillStyle = col;
                ctx.textAlign = 'left';
                ctx.textBaseline = 'middle';
                ctx.font = `700 ${fontPx}px "Plus Jakarta Sans", system-ui, sans-serif`;
                ctx.fillText(base, x, y);
                const w1 = ctx.measureText(base).width;
                ctx.font = '700 12.5px "Plus Jakarta Sans", system-ui, sans-serif';
                ctx.fillText(sub, x + w1, y + 5);
                const w2 = ctx.measureText(sub).width;
                ctx.font = `700 ${fontPx}px "Plus Jakarta Sans", system-ui, sans-serif`;
                ctx.fillText(rest, x + w1 + w2, y);
                ctx.restore();
            }

            const saw = (t * 0.18) % 1;

            // CỘT TRÁI: BÌNH NHIỆT LƯỢNG KẾ CÁCH NHIỆT HAI LỚP HỞ MIỆNG TRÊN
            ctx.save();
            const title = 'TRAO ĐỔI NHIỆT TRONG NHIỆT LƯỢNG KẾ';
            ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
            const tw = ctx.measureText(title).width + 22;
            roundBox(14, 12, tw, 30, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, 25, 27);

            // Vỏ bình cách nhiệt ngoài & cốc trong hở miệng (U-shape)
            const bx = 92, by = 84, bw = 240, bh = 166;
            drawOpenCup(bx - 12, by + 6, bw + 24, bh + 10, '#64748b', 3.4, 8);
            // Nước bên trong tràn sát thành trong
            const waterTop = by + 44 - saw * 10;
            ctx.fillStyle = 'rgba(56, 189, 248, 0.30)';
            ctx.fillRect(bx + 2, waterTop, bw - 4, (by + bh) - waterTop - 2);
            ctx.strokeStyle = '#7dd3fc';
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(bx + 2, waterTop); ctx.lineTo(bx + bw - 2, waterTop); ctx.stroke();
            drawOpenCup(bx, by, bw, bh, '#cbd5e1', 3.2, 8);

            // Khối nước đá đủ rộng >= 116px để chữ nằm gọn 100% bên trong
            const iceW = 128 - saw * 22;
            const iceH = 58 - saw * 10;
            const iceX = bx + (bw - iceW) / 2;
            const iceY = waterTop + 14;
            roundBox(iceX, iceY, iceW, iceH, 8, '#bae6fd', '#ffffff', 2.2);
            ctx.fillStyle = '#0f172a';
            ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Đá: 0,5 kg', iceX + iceW / 2, iceY + iceH / 2);

            // Mũi tên truyền nhiệt từ nước sang khối đá
            const pulse = (saw * 2.5) % 1;
            arrowLine(bx + 18, by + 132, iceX + 12, iceY + iceH - 4, `rgba(249, 115, 22, ${(0.95 - pulse * 0.4).toFixed(2)})`, 2.6, 8);
            arrowLine(bx + bw - 18, by + 132, iceX + iceW - 12, iceY + iceH - 4, `rgba(249, 115, 22, ${(0.95 - pulse * 0.4).toFixed(2)})`, 2.6, 8);

            ctx.fillStyle = '#e2e8f0';
            ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillText('Bình nhiệt lượng kế cách nhiệt', bx + bw / 2, 276);
            ctx.restore();

            // CỘT PHẢI: THÔNG SỐ ĐỀ BÀI (ZERO DATA LEAKAGE: không ghi kết quả 0 °C, 21 kJ, 626 g)
            ctx.save();
            roundBox(410, 20, 356, 266, 10, '#0f172a', '#38bdf8', 2);
            ctx.fillStyle = '#38bdf8';
            ctx.font = '800 15.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText('THÔNG SỐ HỆ TRAO ĐỔI NHIỆT', 428, 48);

            ctx.fillStyle = '#bae6fd';
            ctx.font = '700 15px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillText('• Nước đá: 0,5 kg ở –20 °C', 428, 84);
            ctx.fillStyle = '#fdba74';
            ctx.fillText('• Nước: 0,5 kg ở 30 °C', 428, 114);
            drawSub(428, 146, '• c', 'đá', ' = 2100 J/(kg·K)', '#7dd3fc', 15.5);
            drawSub(428, 178, '• c', 'nước', ' = 4200 J/(kg·K)', '#7dd3fc', 15.5);
            ctx.fillStyle = '#fbbf24';
            ctx.font = '700 15px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillText('• λ = 3,34 · 10⁵ J/kg', 428, 210);
            ctx.fillStyle = '#cbd5e1';
            ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillText('• Bỏ qua nhiệt dung bình & môi trường', 428, 244);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 18 (MH-STAGING-C1-18 · VLXT-DS-VD28-018): Thí nghiệm xác định nhiệt nóng chảy riêng của nước đá với nguồn nhiệt 25 W và cân điện tử
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C1-18', function(ctx, w, h, t) {
        ctx.clearRect(0, 0, w, h);
        const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
        bgGrad.addColorStop(0, '#060b19');
        bgGrad.addColorStop(1, '#0a1226');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.save();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
        ctx.lineWidth = 1;
        for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
        for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
        ctx.restore();

        function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2.2) {
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(x, y, bw, bh, r);
            if (fill) { ctx.fillStyle = fill; ctx.fill(); }
            if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
            ctx.restore();
        }

        function drawOpenCup(x, y, cw, ch, col, lw = 3) {
            ctx.save();
            ctx.strokeStyle = col;
            ctx.lineWidth = lw;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + ch);
            ctx.lineTo(x + cw, y + ch);
            ctx.lineTo(x + cw, y);
            ctx.stroke();
            ctx.restore();
        }

        function arrowLine(x1, y1, x2, y2, col, lw = 2.4, hl = 7) {
            const ang = Math.atan2(y2 - y1, x2 - x1);
            ctx.save();
            ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
            ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
            ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
            ctx.closePath(); ctx.fill();
            ctx.restore();
        }

        function calloutTag(tx, ty, bx, by, label, col) {
            ctx.save();
            ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            const padX = 10, boxH = 28;
            const boxW = ctx.measureText(label).width + padX * 2;
            const safeBx = Math.min(w - 10 - boxW, Math.max(10, bx));
            const safeBy = Math.min(h - 10 - boxH, Math.max(10, by));
            const ax = (safeBx + boxW / 2 < tx) ? (safeBx + boxW) : safeBx;
            const ay = safeBy + boxH / 2;

            ctx.strokeStyle = col;
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(ax, ay); ctx.stroke();
            ctx.fillStyle = col;
            ctx.beginPath(); ctx.arc(tx, ty, 3.6, 0, Math.PI * 2); ctx.fill();

            roundBox(safeBx, safeBy, boxW, boxH, 7, '#0f172a', col, 2);
            ctx.fillStyle = '#f8fafc';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(label, safeBx + boxW / 2, safeBy + boxH / 2);
            ctx.restore();
        }

        // Tiêu đề góc trên trái
        ctx.save();
        const title = 'THÍ NGHIỆM ĐO NHIỆT NÓNG CHẢY RIÊNG NƯỚC ĐÁ';
        ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
        const titleW = ctx.measureText(title).width + 22;
        roundBox(14, 10, titleW, 28, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
        ctx.fillStyle = '#38bdf8';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(title, 25, 24);
        ctx.restore();

        // Chu kỳ sawtooth 1 chiều: 0..0.38 bước 1 (tắt nguồn, 0 -> 4 g); 0.38..1.0 bước 2 (bật 25 W, 4 -> 31 g)
        const saw = (t * 0.14) % 1;
        const isStep2 = saw >= 0.38;
        const stepProg = isStep2 ? (saw - 0.38) / 0.62 : saw / 0.38;
        const massVal = isStep2 ? (4 + 27 * stepProg) : (4 * stepProg);

        // 1. Nguồn nhiệt phía trên phễu đá
        const cx = 306;
        roundBox(cx - 46, 52, 92, 10, 4, isStep2 ? '#f97316' : '#334155', isStep2 ? '#fde047' : '#64748b', 2);
        if (isStep2) {
            arrowLine(cx - 28, 66, cx - 22, 88, '#fb923c', 2.4, 7);
            arrowLine(cx, 66, cx, 88, '#fb923c', 2.4, 7);
            arrowLine(cx + 28, 66, cx + 22, 88, '#fb923c', 2.4, 7);
        }

        // 2. Nhiệt lượng kế chứa đá đang tan (hở miệng trên)
        const boxX = cx - 58, boxY = 92, boxW = 116, boxH = 72;
        // Nước tan mỏng đáy bình (tràn sát thành trong)
        ctx.fillStyle = 'rgba(56, 189, 248, 0.28)';
        ctx.fillRect(boxX + 2, boxY + boxH - 12, boxW - 4, 11);
        // Viên đá
        const cubes = [
            [cx - 44, boxY + 26, 22], [cx - 18, boxY + 20, 24], [cx + 12, boxY + 24, 22],
            [cx - 34, boxY + 46, 22], [cx - 6, boxY + 44, 23], [cx + 22, boxY + 46, 22]
        ];
        cubes.forEach(([qx, qy, qs]) => {
            roundBox(qx, qy, qs, qs - 3, 4, 'rgba(226, 232, 240, 0.85)', '#7dd3fc', 1.6);
        });
        drawOpenCup(boxX, boxY, boxW, boxH, '#cbd5e1', 3.2);

        // Vòi chảy nước xuống cốc hứng
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx - 9, boxY + boxH); ctx.lineTo(cx - 5, boxY + boxH + 14);
        ctx.moveTo(cx + 9, boxY + boxH); ctx.lineTo(cx + 5, boxY + boxH + 14);
        ctx.stroke();

        // Giọt nước rơi 1 chiều sawtooth
        const dropPhase = (t * (isStep2 ? 1.8 : 0.7)) % 1;
        const dropY = boxY + boxH + 15 + dropPhase * 32;
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath(); ctx.arc(cx, dropY, 3.2, 0, Math.PI * 2); ctx.fill();

        // 3. Cốc hứng nước (hở miệng trên) đặt trên cân điện tử
        const cupX = cx - 28, cupY = 194, cupW = 56, cupH = 48;
        const waterH = 4 + (massVal / 31) * 34;
        ctx.fillStyle = 'rgba(56, 189, 248, 0.42)';
        ctx.fillRect(cupX + 2, cupY + cupH - waterH, cupW - 4, waterH - 1);
        drawOpenCup(cupX, cupY, cupW, cupH, '#e2e8f0', 2.8);

        // 4. Cân điện tử
        roundBox(cx - 48, 243, 96, 6, 2, '#94a3b8', '#e2e8f0', 1.5);
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(cx - 64, 249); ctx.lineTo(cx + 64, 249);
        ctx.lineTo(cx + 76, 288); ctx.lineTo(cx - 76, 288);
        ctx.closePath(); ctx.fill(); ctx.stroke();

        roundBox(cx - 46, 255, 92, 26, 4, '#09111f', '#38bdf8', 1.6);
        ctx.fillStyle = '#34d399';
        ctx.font = '800 15.5px "DM Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(massVal.toFixed(1).replace('.', ',') + ' g', cx, 268);

        // Chú thích callout bên trái
        calloutTag(cx - 46, 57, 14, 52, 'Nguồn nhiệt 25 W', '#f97316');
        calloutTag(boxX, 128, 14, 114, 'Nước đá đang tan', '#7dd3fc');
        calloutTag(cupX, 218, 14, 186, 'Cốc hứng nước', '#38bdf8');
        calloutTag(cx - 68, 268, 14, 250, 'Cân điện tử', '#10b981');

        // Card thông số đề bài bên phải (Zero Data Leakage)
        roundBox(468, 12, 298, 280, 10, '#0f172a', '#38bdf8', 2);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 15.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('THÔNG SỐ THÍ NGHIỆM', 486, 38);

        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('• Công suất dây nung: P = 25 W', 486, 72);
        ctx.fillText('• Bước 1 (5 phút, tắt nguồn):', 486, 106);
        ctx.fillStyle = '#7dd3fc';
        ctx.fillText('   Lượng nước cân: m = 4 g', 486, 132);
        ctx.fillStyle = '#f8fafc';
        ctx.fillText('• Bước 2 (5 phút, bật nguồn):', 486, 168);
        ctx.fillStyle = '#fbbf24';
        ctx.fillText('   Tổng nước cân: M = 31 g', 486, 194);
        ctx.fillStyle = '#e2e8f0';
        ctx.fillText('• Kết thúc TN: Vẫn còn nước đá', 486, 228);

        roundBox(486, 248, 262, 32, 7, '#1e293b', isStep2 ? '#f97316' : '#38bdf8', 1.8);
        ctx.fillStyle = isStep2 ? '#fdba74' : '#7dd3fc';
        ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(isStep2 ? 'Pha 2: Đang cấp nhiệt 25 W' : 'Pha 1: Đá tan do môi trường', 617, 264);
    });

    // =========================================================================
    // CÂU 19 (MH-STAGING-C1-19 · VLXT-DS-VD28-019): Bảng nhiệt dung riêng một số chất & So sánh độ tăng nhiệt độ khi cấp cùng nhiệt lượng
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C1-19', function(ctx, w, h, t) {
        ctx.clearRect(0, 0, w, h);
        const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
        bgGrad.addColorStop(0, '#060b19');
        bgGrad.addColorStop(1, '#0a1226');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.save();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
        ctx.lineWidth = 1;
        for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
        for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
        ctx.restore();

        function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2.2) {
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(x, y, bw, bh, r);
            if (fill) { ctx.fillStyle = fill; ctx.fill(); }
            if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
            ctx.restore();
        }

        function drawOpenCup(x, y, cw, ch, col, lw = 3) {
            ctx.save();
            ctx.strokeStyle = col;
            ctx.lineWidth = lw;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + ch);
            ctx.lineTo(x + cw, y + ch);
            ctx.lineTo(x + cw, y);
            ctx.stroke();
            ctx.restore();
        }

        function arrowLine(x1, y1, x2, y2, col, lw = 2.2, hl = 7) {
            const ang = Math.atan2(y2 - y1, x2 - x1);
            ctx.save();
            ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
            ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
            ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
            ctx.closePath(); ctx.fill();
            ctx.restore();
        }

        ctx.save();
        const title = 'SO SÁNH NHIỆT DUNG RIÊNG CÁC CHẤT (CÙNG Q & m)';
        ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
        const titleW = ctx.measureText(title).width + 22;
        roundBox(14, 10, titleW, 28, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
        ctx.fillStyle = '#38bdf8';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(title, 25, 24);
        ctx.restore();

        const saw = (t * 0.16) % 1;
        const samples = [
            { name: 'Đồng', sym: 'Cu', c: 0.38, col: '#f59e0b', fill: '#b45309', isLiquid: false, ratio: 0.92, cx: 74 },
            { name: 'Sắt',  sym: 'Fe', c: 0.46, col: '#94a3b8', fill: '#475569', isLiquid: false, ratio: 0.78, cx: 192 },
            { name: 'Nhôm', sym: 'Al', c: 0.88, col: '#cbd5e1', fill: '#64748b', isLiquid: false, ratio: 0.44, cx: 310 },
            { name: 'Nước', sym: 'H₂O', c: 4.19, col: '#38bdf8', fill: 'rgba(56, 189, 248, 0.45)', isLiquid: true, ratio: 0.16, cx: 428 }
        ];

        samples.forEach(s => {
            // Nhiệt kế phía trên mẫu
            const tx = s.cx + 28, ty = 64, th = 114;
            roundBox(tx - 6, ty, 12, th, 6, '#0f172a', '#cbd5e1', 2);
            ctx.fillStyle = '#ef4444';
            ctx.beginPath(); ctx.arc(tx, ty + th + 4, 9, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 2; ctx.stroke();

            const mercH = 10 + saw * (th - 18) * s.ratio;
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(tx - 3, ty + th - mercH, 6, mercH + 2);

            // Vật mẫu bên trái nhiệt kế
            if (s.isLiquid) {
                ctx.fillStyle = s.fill;
                ctx.fillRect(s.cx - 38, 198, 56, 39);
                drawOpenCup(s.cx - 40, 186, 60, 52, '#e2e8f0', 2.8);
                ctx.fillStyle = '#f8fafc';
                ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('Nước', s.cx - 10, 218);
            } else {
                roundBox(s.cx - 38, 194, 56, 44, 6, s.fill, s.col, 2.2);
                ctx.fillStyle = '#f8fafc';
                ctx.font = '800 15.5px "Plus Jakarta Sans", system-ui, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(s.sym, s.cx - 10, 216);
            }

            // Bộ cấp nhiệt Q giống nhau bên dưới
            roundBox(s.cx - 36, 250, 52, 10, 4, '#ea580c', '#fdba74', 1.8);
            arrowLine(s.cx - 10, 250, s.cx - 10, 239, '#fb923c', 2.2, 6);

            // Tên chất dưới đáy
            ctx.fillStyle = s.col;
            ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(s.name, s.cx - 10, 278);
        });

        // Card bảng nhiệt dung riêng bên phải (khớp dữ liệu đề dẫn, Zero Data Leakage)
        roundBox(498, 12, 268, 280, 10, '#0f172a', '#38bdf8', 2);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('NHIỆT DUNG RIÊNG (BẢNG)', 516, 38);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('Đơn vị: kJ/(kg·K)', 516, 64);

        const rows = [
            ['• Đồng:', '0,38', '#f59e0b'],
            ['• Sắt:',  '0,46', '#cbd5e1'],
            ['• Nhôm:', '0,88', '#e2e8f0'],
            ['• Nước:', '4,19', '#38bdf8']
        ];
        rows.forEach(([k, v, col], idx) => {
            const ry = 98 + idx * 34;
            ctx.fillStyle = col;
            ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(k, 518, ry);
            ctx.textAlign = 'right';
            ctx.font = '800 15.5px "DM Mono", monospace';
            ctx.fillText(v, 742, ry);
        });

        roundBox(514, 234, 236, 44, 7, '#1e293b', '#475569', 1.6);
        ctx.fillStyle = '#fbbf24';
        ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Q = m · c · ΔT', 632, 256);
    });

    // =========================================================================
    // CÂU 20 (MH-STAGING-C1-20 · VLXT-DS-VD28-020): Đo nhiệt dung riêng và nhiệt nóng chảy riêng của nước đá bằng hai lần trao đổi nhiệt
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C1-20', function(ctx, w, h, t) {
        ctx.clearRect(0, 0, w, h);
        const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
        bgGrad.addColorStop(0, '#060b19');
        bgGrad.addColorStop(1, '#0a1226');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.save();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
        ctx.lineWidth = 1;
        for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
        for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
        ctx.restore();

        function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2.2) {
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(x, y, bw, bh, r);
            if (fill) { ctx.fillStyle = fill; ctx.fill(); }
            if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
            ctx.restore();
        }

        function drawOpenCup(x, y, cw, ch, col, lw = 3) {
            ctx.save();
            ctx.strokeStyle = col;
            ctx.lineWidth = lw;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + ch);
            ctx.lineTo(x + cw, y + ch);
            ctx.lineTo(x + cw, y);
            ctx.stroke();
            ctx.restore();
        }

        function drawSub(base, sub, x, y, col, align = 'left', baseSize = 15.5, subSize = 12.5) {
            ctx.save();
            ctx.font = `800 ${baseSize}px "Plus Jakarta Sans", system-ui, sans-serif`;
            const bw = ctx.measureText(base).width;
            ctx.font = `800 ${subSize}px "Plus Jakarta Sans", system-ui, sans-serif`;
            const sw = ctx.measureText(sub).width;
            let sx = x;
            if (align === 'center') sx = x - (bw + sw) / 2;
            else if (align === 'right') sx = x - (bw + sw);
            ctx.fillStyle = col;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.font = `800 ${baseSize}px "Plus Jakarta Sans", system-ui, sans-serif`;
            ctx.fillText(base, sx, y);
            ctx.font = `800 ${subSize}px "Plus Jakarta Sans", system-ui, sans-serif`;
            ctx.fillText(sub, sx + bw + 1, y + 5);
            ctx.restore();
            return bw + sw + 1;
        }

        ctx.save();
        const title = 'HAI LẦN TRAO ĐỔI NHIỆT NƯỚC – NƯỚC ĐÁ';
        ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
        const titleW = ctx.measureText(title).width + 22;
        roundBox(14, 10, titleW, 28, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
        ctx.fillStyle = '#38bdf8';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(title, 25, 24);

        // Badge hằng số nước ở góc trên phải
        roundBox(518, 10, 248, 28, 7, '#0f172a', '#475569', 1.8);
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('c (nước) = 4180 J/(kg·K)', 642, 24);
        ctx.restore();

        const saw = (t * 0.16) % 1;
        const dropR = Math.min(1, saw / 0.25);

        const panels = [
            {
                x: 14, col: '#fbbf24', header: 'LẦN THÍ NGHIỆM 1',
                m1: '550 g', t1: '43,0 °C', m2: '220 g', t2: '5,4 °C',
                waterRatio: 0.62, iceW: 42, iceH: 26,
                startMerc: 0.78, endMerc: 0.34, waterCol: 'rgba(251, 146, 60, 0.38)'
            },
            {
                x: 396, col: '#38bdf8', header: 'LẦN THÍ NGHIỆM 2',
                m1: '60 g', t1: '5,0 °C', m2: '710 g', t2: '-3,7 °C',
                waterRatio: 0.24, iceW: 68, iceH: 42,
                startMerc: 0.34, endMerc: 0.14, waterCol: 'rgba(56, 189, 248, 0.42)'
            }
        ];

        panels.forEach(p => {
            roundBox(p.x, 48, 370, 244, 10, '#0f172a', p.col, 2);
            ctx.fillStyle = p.col;
            ctx.font = '800 15.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(p.header, p.x + 16, 72);

            // Bình cách nhiệt (vỏ kép hở miệng trên)
            const bx = p.x + 22, by = 114, bw = 112, bh = 136;
            drawOpenCup(bx - 6, by, bw + 12, bh + 6, '#64748b', 2.4);
            const wH = bh * p.waterRatio;
            ctx.fillStyle = p.waterCol;
            ctx.fillRect(bx + 2, by + bh - wH, bw - 4, wH - 1);
            drawOpenCup(bx, by, bw, bh, '#e2e8f0', 2.8);

            // Viên đá rơi vào bình theo saw
            const iceY = (by - 18) + dropR * (bh - wH * 0.55 - p.iceH / 2 + 12);
            const iceX = bx + (bw - p.iceW) / 2;
            roundBox(iceX, iceY, p.iceW, p.iceH, 5, 'rgba(226, 232, 240, 0.88)', '#7dd3fc', 2);

            // Nhiệt kế bên phải bình
            const tx = p.x + 160, ty = 104, th = 140;
            roundBox(tx - 6, ty, 12, th, 6, '#09111f', '#cbd5e1', 2);
            ctx.fillStyle = '#ef4444';
            ctx.beginPath(); ctx.arc(tx, ty + th + 4, 8.5, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 2; ctx.stroke();

            const mRatio = p.startMerc + (p.endMerc - p.startMerc) * saw;
            const mH = 12 + mRatio * (th - 20);
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(tx - 3, ty + th - mH, 6, mH + 2);

            // Thông số đề bài của từng lần (Zero Data Leakage)
            const ix = p.x + 184;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';

            const w1 = drawSub('m', '1', ix, 114, '#e2e8f0');
            ctx.fillStyle = '#f8fafc';
            ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillText('= ' + p.m1, ix + w1 + 4, 114);

            const wt1 = drawSub('t', '1', ix, 144, '#e2e8f0');
            ctx.fillStyle = '#f8fafc';
            ctx.fillText('= ' + p.t1, ix + wt1 + 4, 144);

            const w2 = drawSub('m', '2', ix, 174, '#7dd3fc');
            ctx.fillStyle = '#7dd3fc';
            ctx.fillText('= ' + p.m2, ix + w2 + 4, 174);

            const wt0 = drawSub('t', '0', ix, 204, '#7dd3fc');
            ctx.fillStyle = '#7dd3fc';
            ctx.fillText('= -18 °C', ix + wt0 + 4, 204);

            roundBox(ix - 2, 224, 168, 34, 7, '#1e293b', p.col, 1.8);
            const wt2 = drawSub('t', '2', ix + 10, 241, p.col);
            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 15px "DM Mono", monospace';
            ctx.fillText('= ' + p.t2, ix + 10 + wt2 + 4, 241);
        });
    });

    // =========================================================================
    // CÂU 21 (MH-STAGING-C1-21 · VLXT-DS-VD28-021): Đun nóng đẳng tích khối khí Helium lý tưởng trong bình kín 2 lít
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C1-21', function(ctx, w, h, t) {
        ctx.clearRect(0, 0, w, h);
        const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
        bgGrad.addColorStop(0, '#060b19');
        bgGrad.addColorStop(1, '#0a1226');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.save();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
        ctx.lineWidth = 1;
        for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
        for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
        ctx.restore();

        function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2.2) {
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(x, y, bw, bh, r);
            if (fill) { ctx.fillStyle = fill; ctx.fill(); }
            if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
            ctx.restore();
        }

        function arrowLine(x1, y1, x2, y2, col, lw = 2.4, hl = 7) {
            const ang = Math.atan2(y2 - y1, x2 - x1);
            ctx.save();
            ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
            ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
            ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
            ctx.closePath(); ctx.fill();
            ctx.restore();
        }

        ctx.save();
        const title = 'ĐUN ĐẲNG TÍCH KHÍ HELIUM (V = 2 LÍT)';
        ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
        const titleW = ctx.measureText(title).width + 22;
        roundBox(14, 10, titleW, 28, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
        ctx.fillStyle = '#38bdf8';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(title, 25, 24);
        ctx.restore();

        const saw = (t * 0.15) % 1;
        const bx = 30, by = 102, bw = 316, bh = 140;

        // Lòng bình khí ấm dần theo saw
        const gasR = Math.round(18 + saw * 110);
        const gasG = Math.round(52 + saw * 40);
        const gasB = Math.round(105 - saw * 45);
        roundBox(bx, by, bw, bh, 14, `rgba(${gasR}, ${gasG}, ${gasB}, 0.38)`, '#94a3b8', 3.4);

        // 20 nguyên tử Helium chuyển động nhiệt
        const speedAmp = 1 + saw * 1.45;
        for (let i = 0; i < 20; i++) {
            const rx = bx + 20 + ((i * 53) % (bw - 40));
            const ry = by + 20 + ((i * 37) % (bh - 40));
            const px = Math.max(bx + 12, Math.min(bx + bw - 12, rx + Math.sin(t * 3.1 * speedAmp + i * 1.9) * (9 * speedAmp)));
            const py = Math.max(by + 12, Math.min(by + bh - 12, ry + Math.cos(t * 3.7 * speedAmp + i * 2.4) * (8 * speedAmp)));
            ctx.fillStyle = i % 2 === 0 ? '#38bdf8' : '#fbbf24';
            ctx.beginPath(); ctx.arc(px, py, 4.2, 0, Math.PI * 2); ctx.fill();
        }

        // Nhãn trong bình
        roundBox(bx + 12, by + 10, 142, 28, 6, 'rgba(15, 23, 42, 0.85)', '#475569', 1.6);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Khí He · V = 2 lít', bx + 83, by + 24);

        // Áp kế nối kín vào nóc phải bình (tách xa hộp tiêu đề)
        const gx = 326, gy = 62;
        ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(gx, by); ctx.lineTo(gx, gy + 24); ctx.stroke();
        ctx.fillStyle = '#0f172a'; ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 2.6;
        ctx.beginPath(); ctx.arc(gx, gy, 24, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        const dialAng = -Math.PI * 0.8 + saw * Math.PI * 0.9;
        ctx.strokeStyle = '#f43f5e'; ctx.lineWidth = 2.6;
        ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx + Math.cos(dialAng) * 16, gy + Math.sin(dialAng) * 16); ctx.stroke();
        ctx.fillStyle = '#f8fafc'; ctx.beginPath(); ctx.arc(gx, gy, 3, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fbbf24';
        ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('Áp kế p', gx + 32, gy);

        // Đế gia nhiệt dưới bình
        roundBox(86, 254, 198, 12, 4, '#ea580c', '#fdba74', 2);
        arrowLine(128, 254, 128, 241, '#fb923c', 2.4, 7);
        arrowLine(185, 254, 185, 241, '#fb923c', 2.4, 7);
        arrowLine(242, 254, 242, 241, '#fb923c', 2.4, 7);
        ctx.fillStyle = '#fdba74';
        ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Cấp nhiệt (quá trình đẳng tích)', 185, 282);

        // Nhiệt kế bên phải bình
        const tx = 374, ty = 88, th = 144;
        roundBox(tx - 6, ty, 12, th, 6, '#0f172a', '#cbd5e1', 2);
        ctx.fillStyle = '#ef4444';
        ctx.beginPath(); ctx.arc(tx, ty + th + 4, 9, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 2; ctx.stroke();
        const mercH = 26 + saw * (th - 42);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(tx - 3, ty + th - mercH, 6, mercH + 2);

        ctx.textAlign = 'left';
        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 14.5px "DM Mono", monospace';
        ctx.fillText('127 °C', tx + 14, ty + 16);
        ctx.fillStyle = '#7dd3fc';
        ctx.fillText('27 °C', tx + 14, ty + th - 26);

        // Card phải thông số đề bài (Zero Data Leakage)
        roundBox(476, 12, 290, 280, 10, '#0f172a', '#38bdf8', 2);
        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 15.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('THÔNG SỐ KHÍ HELIUM', 494, 38);

        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('• Bình kín: V = 2 lít (đẳng tích)', 494, 74);
        ctx.fillText('• Khối lượng mol: M = 4 g/mol', 494, 106);
        ctx.fillStyle = '#7dd3fc';
        ctx.fillText('• Trạng thái đầu:', 494, 140);
        ctx.fillStyle = '#f8fafc';
        ctx.fillText('   t₁ = 27 °C ;  p₁ = 10⁵ Pa', 494, 166);
        ctx.fillStyle = '#fbbf24';
        ctx.fillText('• Trạng thái cuối: t₂ = 127 °C', 494, 200);

        roundBox(494, 224, 254, 48, 8, '#1e293b', '#fbbf24', 1.8);
        ctx.fillStyle = '#fbbf24';
        ctx.font = '800 16px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('U = (3/2) n R T', 621, 248);
    });

    // =========================================================================
    // CÂU 22 (MH-STAGING-C1-22 · VLXT-DS-VD28-022): Thí nghiệm đo nhiệt hóa hơi riêng của nước với bộ đun nhúng 100 W trên cân điện tử
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C1-22', function(ctx, w, h, t) {
        ctx.clearRect(0, 0, w, h);
        const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
        bgGrad.addColorStop(0, '#060b19');
        bgGrad.addColorStop(1, '#0a1226');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.save();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
        ctx.lineWidth = 1;
        for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
        for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
        ctx.restore();

        function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2.2) {
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(x, y, bw, bh, r);
            if (fill) { ctx.fillStyle = fill; ctx.fill(); }
            if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
            ctx.restore();
        }

        function drawOpenCup(x, y, cw, ch, col, lw = 3) {
            ctx.save();
            ctx.strokeStyle = col;
            ctx.lineWidth = lw;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + ch);
            ctx.lineTo(x + cw, y + ch);
            ctx.lineTo(x + cw, y);
            ctx.stroke();
            ctx.restore();
        }

        function calloutTag(tx, ty, bx, by, label, col) {
            ctx.save();
            ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            const padX = 10, boxH = 28;
            const boxW = ctx.measureText(label).width + padX * 2;
            const safeBx = Math.min(w - 10 - boxW, Math.max(10, bx));
            const safeBy = Math.min(h - 10 - boxH, Math.max(10, by));
            const ax = (safeBx + boxW / 2 < tx) ? (safeBx + boxW) : safeBx;
            const ay = safeBy + boxH / 2;

            ctx.strokeStyle = col;
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(ax, ay); ctx.stroke();
            ctx.fillStyle = col;
            ctx.beginPath(); ctx.arc(tx, ty, 3.6, 0, Math.PI * 2); ctx.fill();

            roundBox(safeBx, safeBy, boxW, boxH, 7, '#0f172a', col, 2);
            ctx.fillStyle = '#f8fafc';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(label, safeBx + boxW / 2, safeBy + boxH / 2);
            ctx.restore();
        }

        ctx.save();
        const title = 'THÍ NGHIỆM ĐO NHIỆT HÓA HƠI RIÊNG CỦA NƯỚC';
        ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
        const titleW = ctx.measureText(title).width + 22;
        roundBox(14, 10, titleW, 28, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
        ctx.fillStyle = '#38bdf8';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(title, 25, 24);
        ctx.restore();

        const saw = (t * 0.14) % 1;
        const cx = 310;
        const cupX = cx - 56, cupY = 92, cupW = 112, cupH = 128;

        // Mực nước sôi hạ đều 1 chiều sawtooth (tràn sát thành trong cốc)
        const waterTop = cupY + 26 + saw * 14;
        ctx.fillStyle = 'rgba(56, 189, 248, 0.34)';
        ctx.fillRect(cupX + 2, waterTop, cupW - 4, cupY + cupH - waterTop - 1);
        ctx.strokeStyle = '#7dd3fc'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(cupX + 2, waterTop); ctx.lineTo(cupX + cupW - 2, waterTop); ctx.stroke();

        // Bọt khí sôi nổi lên và hơi nước bay lên khỏi miệng
        for (let i = 0; i < 8; i++) {
            const bp = (t * 0.75 + i * 0.14) % 1;
            const bx = cx - 28 + ((i * 19) % 56);
            const by = 186 - bp * (186 - waterTop - 6);
            ctx.fillStyle = 'rgba(224, 242, 254, 0.7)';
            ctx.beginPath(); ctx.arc(bx, by, 2.8, 0, Math.PI * 2); ctx.fill();
        }
        for (let j = 0; j < 6; j++) {
            const sp = (t * 0.55 + j * 0.18) % 1;
            const sx = cx - 32 + j * 13 + Math.sin(t * 3 + j) * 4;
            const sy = waterTop - 6 - sp * 44;
            ctx.fillStyle = `rgba(186, 230, 253, ${(1 - sp) * 0.75})`;
            ctx.beginPath(); ctx.arc(sx, sy, 3.2, 0, Math.PI * 2); ctx.fill();
        }

        // Bộ đun nhúng (treo giữa nước, không chạm thành cốc)
        ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 3.2;
        ctx.beginPath(); ctx.moveTo(cx, 44); ctx.lineTo(cx, 66); ctx.stroke();
        roundBox(cx - 10, 62, 20, 26, 4, '#334155', '#e2e8f0', 2);
        ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.moveTo(cx - 5, 88); ctx.lineTo(cx - 14, 134);
        ctx.moveTo(cx + 5, 88); ctx.lineTo(cx + 14, 134);
        ctx.stroke();
        // Vòng xoắn bộ đun
        ctx.strokeStyle = '#f97316'; ctx.lineWidth = 3;
        for (let k = 0; k < 5; k++) {
            const ky = 138 + k * 9;
            ctx.beginPath(); ctx.moveTo(cx - 15, ky); ctx.lineTo(cx + 15, ky + 3); ctx.stroke();
        }

        // Thành cốc thủy tinh hở miệng trên
        drawOpenCup(cupX, cupY, cupW, cupH, '#e2e8f0', 3.2);

        // Cân điện tử bên dưới
        roundBox(cx - 72, 222, 144, 6, 2, '#94a3b8', '#e2e8f0', 1.5);
        ctx.fillStyle = '#1e293b'; ctx.strokeStyle = '#64748b'; ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(cx - 78, 228); ctx.lineTo(cx + 78, 228);
        ctx.lineTo(cx + 90, 288); ctx.lineTo(cx - 90, 288);
        ctx.closePath(); ctx.fill(); ctx.stroke();

        const curMass = 525.4 - (525.4 - 515.2) * saw;
        roundBox(cx - 58, 238, 116, 36, 5, '#09111f', '#38bdf8', 1.8);
        ctx.fillStyle = '#34d399';
        ctx.font = '800 17px "DM Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(curMass.toFixed(1) + ' g', cx, 256);

        // Nhãn callout giống ảnh gốc 022.png
        calloutTag(cx + 10, 74, 14, 56, 'Đế cấp điện (100 W)', '#fbbf24');
        calloutTag(cupX, 114, 14, 114, 'Cốc thủy tinh', '#38bdf8');
        calloutTag(cx - 15, 160, 14, 174, 'Bộ đun nhúng', '#f97316');
        calloutTag(cx - 82, 256, 14, 240, 'Cân điện tử', '#10b981');

        // Card phải thông số đề bài (Zero Data Leakage)
        roundBox(472, 12, 294, 280, 10, '#0f172a', '#38bdf8', 2);
        ctx.textAlign = 'left';
        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 15.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('SỐ LIỆU THÍ NGHIỆM', 490, 38);

        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('• Công suất bộ đun: P = 100 W', 490, 76);
        ctx.fillStyle = '#7dd3fc';
        ctx.fillText('• Lúc bắt đầu sôi (0 s): 525,4 g', 490, 112);
        ctx.fillStyle = '#fbbf24';
        ctx.fillText('• Sau Δt = 240 s sôi: 515,2 g', 490, 148);
        ctx.fillStyle = '#e2e8f0';
        ctx.fillText('• Bộ đun nhúng không chạm cốc', 490, 184);

        const elapsedSec = Math.round(saw * 240);
        roundBox(490, 218, 258, 54, 8, '#1e293b', '#38bdf8', 1.8);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Thời gian đun sôi đồng hồ:', 619, 234);
        ctx.fillStyle = '#34d399';
        ctx.font = '800 16.5px "DM Mono", monospace';
        ctx.fillText('τ = ' + elapsedSec + ' s / 240 s', 619, 256);
    });

    // =========================================================================
    // CÂU 23 (MH-STAGING-C1-23 · VLXT-DS-VD28-023): Cân bằng nhiệt khi pha chế ly trà sữa từ 3 nguyên liệu (trà ô long, nước đường, sữa tươi)
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C1-23', function(ctx, w, h, t) {
        ctx.clearRect(0, 0, w, h);
        const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
        bgGrad.addColorStop(0, '#060b19');
        bgGrad.addColorStop(1, '#0a1226');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.save();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
        ctx.lineWidth = 1;
        for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
        for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
        ctx.restore();

        function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2.2) {
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(x, y, bw, bh, r);
            if (fill) { ctx.fillStyle = fill; ctx.fill(); }
            if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
            ctx.restore();
        }

        function drawOpenCup(x, y, cw, ch, col, lw = 3) {
            ctx.save();
            ctx.strokeStyle = col;
            ctx.lineWidth = lw;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + ch);
            ctx.lineTo(x + cw, y + ch);
            ctx.lineTo(x + cw, y);
            ctx.stroke();
            ctx.restore();
        }

        function arrowLine(x1, y1, x2, y2, col, lw = 2.6, hl = 7) {
            const ang = Math.atan2(y2 - y1, x2 - x1);
            ctx.save();
            ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
            ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
            ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
            ctx.closePath(); ctx.fill();
            ctx.restore();
        }

        function drawSub(base, sub, x, y, col, align = 'left', baseSize = 15, subSize = 12.5) {
            ctx.save();
            ctx.font = `800 ${baseSize}px "Plus Jakarta Sans", system-ui, sans-serif`;
            const bw = ctx.measureText(base).width;
            ctx.font = `800 ${subSize}px "Plus Jakarta Sans", system-ui, sans-serif`;
            const sw = ctx.measureText(sub).width;
            let sx = x;
            if (align === 'center') sx = x - (bw + sw) / 2;
            else if (align === 'right') sx = x - (bw + sw);
            ctx.fillStyle = col;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.font = `800 ${baseSize}px "Plus Jakarta Sans", system-ui, sans-serif`;
            ctx.fillText(base, sx, y);
            ctx.font = `800 ${subSize}px "Plus Jakarta Sans", system-ui, sans-serif`;
            ctx.fillText(sub, sx + bw + 1, y + 5);
            ctx.restore();
            return bw + sw + 1;
        }

        ctx.save();
        const title = 'CÂN BẰNG NHIỆT KHI PHA TRÀ SỮA (3 NGUYÊN LIỆU)';
        ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
        const titleW = ctx.measureText(title).width + 22;
        roundBox(14, 10, titleW, 28, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
        ctx.fillStyle = '#38bdf8';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(title, 25, 24);
        ctx.restore();

        const saw = (t * 0.16) % 1;
        const cups = [
            { x: 24,  label: 'Trà ô long',   info: '50 g · 50 °C',  fill: 'rgba(217, 119, 6, 0.65)',  col: '#f59e0b', h: 32 },
            { x: 174, label: 'Nước đường',  info: '10 g · 20 °C',  fill: 'rgba(147, 197, 253, 0.55)', col: '#7dd3fc', h: 20 },
            { x: 324, label: 'Sữa tươi',    info: '100 g · 28 °C', fill: 'rgba(241, 245, 249, 0.72)', col: '#e2e8f0', h: 42 }
        ];

        cups.forEach((c, idx) => {
            const cw = 104, ch = 56, cy = 78;
            const level = Math.max(4, c.h * (1 - saw * 0.85));
            ctx.fillStyle = c.fill;
            ctx.fillRect(c.x + 2, cy + ch - level, cw - 4, level - 1);
            drawOpenCup(c.x, cy, cw, ch, c.col, 2.8);

            ctx.fillStyle = c.col;
            ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(c.label, c.x + cw / 2, 62);
            ctx.fillStyle = '#f8fafc';
            ctx.fillText(c.info, c.x + cw / 2, 148);

            const targetX = 226 + (idx - 1) * 20;
            arrowLine(c.x + cw / 2, 160, targetX, 188, c.col, 2.4, 7);
        });

        // Ly trà sữa hỗn hợp bên dưới
        const mx = 166, my = 190, mw = 120, mh = 92;
        const mixH = 12 + saw * 66;
        ctx.fillStyle = 'rgba(214, 163, 107, 0.68)';
        ctx.fillRect(mx + 2, my + mh - mixH, mw - 4, mixH - 1);
        drawOpenCup(mx, my, mw, mh, '#e2e8f0', 3);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Ly trà sữa', mx + mw / 2, my + mh - 18);

        // Hộp nhiệt độ cân bằng ẩn đáp án (Zero Data Leakage)
        roundBox(300, 218, 142, 46, 8, '#0f172a', '#fbbf24', 1.8);
        ctx.fillStyle = '#fbbf24';
        ctx.textAlign = 'center';
        ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('Cân bằng nhiệt:', 371, 232);
        const wt = drawSub('t', 'cb', 332, 252, '#f8fafc');
        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 15px "DM Mono", monospace';
        ctx.textAlign = 'left';
        ctx.fillText('= ? °C', 332 + wt + 4, 252);

        // Card phải thông số đề bài
        roundBox(460, 12, 306, 280, 10, '#0f172a', '#38bdf8', 2);
        ctx.textAlign = 'left';
        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 15.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('THÔNG SỐ 3 NGUYÊN LIỆU', 478, 38);

        ctx.fillStyle = '#f59e0b';
        ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('1. Trà ô long: 50 g (50 °C)', 478, 74);
        let sw1 = drawSub('c', '1', 494, 98, '#e2e8f0');
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('= 4200 J/(kg·K)', 494 + sw1 + 4, 98);

        ctx.fillStyle = '#7dd3fc';
        ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('2. Nước đường: 10 g (20 °C)', 478, 134);
        let sw2 = drawSub('c', '2', 494, 158, '#e2e8f0');
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('= 2280 J/(kg·K)', 494 + sw2 + 4, 158);

        ctx.fillStyle = '#e2e8f0';
        ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('3. Sữa tươi: 100 g (28 °C)', 478, 194);
        let sw3 = drawSub('c', '3', 494, 218, '#e2e8f0');
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('= 3950 J/(kg·K)', 494 + sw3 + 4, 218);

        roundBox(478, 242, 270, 34, 7, '#1e293b', '#475569', 1.6);
        ctx.fillStyle = '#94a3b8';
        ctx.textAlign = 'center';
        ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('Bỏ qua trao đổi nhiệt môi trường', 613, 259);
    });

    // =========================================================================
    // CÂU 24 (MH-STAGING-C1-24 · VLXT-DS-VD28-024): Truyền nhiệt & cân bằng nhiệt qua 2 lần rót nước giữa hai bình cách nhiệt
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C1-24', function(ctx, w, h, t) {
        ctx.clearRect(0, 0, w, h);
        const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
        bgGrad.addColorStop(0, '#060b19');
        bgGrad.addColorStop(1, '#0a1226');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.save();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
        ctx.lineWidth = 1;
        for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
        for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
        ctx.restore();

        function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2.2) {
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(x, y, bw, bh, r);
            if (fill) { ctx.fillStyle = fill; ctx.fill(); }
            if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
            ctx.restore();
        }

        function drawOpenCup(x, y, cw, ch, col, lw = 3) {
            ctx.save();
            ctx.strokeStyle = col;
            ctx.lineWidth = lw;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + ch);
            ctx.lineTo(x + cw, y + ch);
            ctx.lineTo(x + cw, y);
            ctx.stroke();
            ctx.restore();
        }

        function arrowLine(x1, y1, x2, y2, col, lw = 2.8, hl = 8) {
            const ang = Math.atan2(y2 - y1, x2 - x1);
            ctx.save();
            ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
            ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
            ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
            ctx.closePath(); ctx.fill();
            ctx.restore();
        }

        function drawSub(base, sub, x, y, col, align = 'left', baseSize = 15, subSize = 12.5) {
            ctx.save();
            ctx.font = `800 ${baseSize}px "Plus Jakarta Sans", system-ui, sans-serif`;
            const bw = ctx.measureText(base).width;
            ctx.font = `800 ${subSize}px "Plus Jakarta Sans", system-ui, sans-serif`;
            const sw = ctx.measureText(sub).width;
            let sx = x;
            if (align === 'center') sx = x - (bw + sw) / 2;
            else if (align === 'right') sx = x - (bw + sw);
            ctx.fillStyle = col;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.font = `800 ${baseSize}px "Plus Jakarta Sans", system-ui, sans-serif`;
            ctx.fillText(base, sx, y);
            ctx.font = `800 ${subSize}px "Plus Jakarta Sans", system-ui, sans-serif`;
            ctx.fillText(sub, sx + bw + 1, y + 5);
            ctx.restore();
            return bw + sw + 1;
        }

        ctx.save();
        const title = 'RÓT NƯỚC QUA LẠI GIỮA HAI BÌNH CÁCH NHIỆT';
        ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
        const titleW = ctx.measureText(title).width + 22;
        roundBox(14, 10, titleW, 28, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
        ctx.fillStyle = '#38bdf8';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(title, 25, 24);
        ctx.restore();

        const saw = (t * 0.14) % 1;
        const phase2 = saw >= 0.5;
        const pRatio = phase2 ? (saw - 0.5) / 0.5 : saw / 0.5;

        // Bình 1 (trái, 3 kg nước nóng 80°C)
        const b1x = 42, b1y = 112, bw = 132, bh = 138;
        drawOpenCup(b1x - 7, b1y, bw + 14, bh + 7, '#64748b', 2.4);
        const h1 = phase2 ? (60 + pRatio * 14) : (74 - pRatio * 14);
        ctx.fillStyle = 'rgba(249, 115, 22, 0.45)';
        ctx.fillRect(b1x + 2, b1y + bh - h1, bw - 4, h1 - 1);
        drawOpenCup(b1x, b1y, bw, bh, '#f97316', 3);

        // Bình 2 (phải, 5 kg nước nguội 20°C - mực cao hơn)
        const b2x = 278, b2y = 112;
        drawOpenCup(b2x - 7, b2y, bw + 14, bh + 7, '#64748b', 2.4);
        const h2 = phase2 ? (110 - pRatio * 14) : (96 + pRatio * 14);
        ctx.fillStyle = 'rgba(56, 189, 248, 0.42)';
        ctx.fillRect(b2x + 2, b2y + bh - h2, bw - 4, h2 - 1);
        drawOpenCup(b2x, b2y, bw, bh, '#38bdf8', 3);

        // Nhãn trong và dưới 2 bình
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillStyle = '#fdba74';
        ctx.fillText('3 kg · 80 °C', b1x + bw / 2, b1y + bh - 32);
        ctx.fillStyle = '#f8fafc';
        ctx.fillText('Bình thứ nhất', b1x + bw / 2, 276);

        ctx.fillStyle = '#bae6fd';
        ctx.fillText('5 kg · 20 °C', b2x + bw / 2, b2y + bh - 48);
        ctx.fillStyle = '#f8fafc';
        ctx.fillText('Bình thứ hai', b2x + bw / 2, 276);

        // Cốc rót m chuyển động 1 chiều giữa 2 bình
        const cupX = phase2 ? (316 - pRatio * 204) : (112 + pRatio * 204);
        roundBox(cupX - 18, 66, 36, 28, 4, 'rgba(56, 189, 248, 0.35)', '#e2e8f0', 2);
        ctx.fillStyle = '#fbbf24';
        ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('m', cupX, 80);

        if (!phase2) {
            arrowLine(184, 80, 268, 80, '#f97316', 2.8, 8);
        } else {
            arrowLine(268, 80, 184, 80, '#38bdf8', 2.8, 8);
        }

        // Card phải thông số đề bài (Zero Data Leakage: không lộ 21,8 °C, 22 °C hay 155 g)
        roundBox(454, 12, 312, 280, 10, '#0f172a', '#38bdf8', 2);
        ctx.textAlign = 'left';
        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 15.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('HAI BƯỚC RÓT CÂN BẰNG', 472, 38);

        ctx.fillStyle = '#f97316';
        ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('Lần 1: Rót m (Bình 1 → Bình 2)', 472, 76);
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('• Nhiệt độ cân bằng Bình 2:', 486, 104);
        const wcb2 = drawSub('t', 'cb', 486, 130, '#38bdf8');
        ctx.fillStyle = '#f8fafc';
        ctx.fillText('= ? °C', 486 + wcb2 + 4, 130);

        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('Lần 2: Rót m (Bình 2 → Bình 1)', 472, 168);
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('• Nhiệt độ cân bằng Bình 1:', 486, 196);
        ctx.fillStyle = '#fbbf24';
        ctx.font = '800 15px "DM Mono", monospace';
        ctx.fillText('t₁\' = 77 °C', 486, 222);

        roundBox(472, 244, 276, 32, 7, '#1e293b', phase2 ? '#38bdf8' : '#f97316', 1.8);
        ctx.fillStyle = phase2 ? '#7dd3fc' : '#fdba74';
        ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(phase2 ? 'Đang mô phỏng: Rót lần 2 (2 → 1)' : 'Đang mô phỏng: Rót lần 1 (1 → 2)', 610, 260);
    });

    // =========================================================================
    // CÂU 25 (MH-STAGING-C1-25 · VLXT-DS-VD28-025): So sánh bay hơi và cân bằng động ngưng tụ ở ly nước không đậy và ly đậy màng bọc thực phẩm
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C1-25', function(ctx, w, h, t) {
        ctx.clearRect(0, 0, w, h);
        const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
        bgGrad.addColorStop(0, '#060b19');
        bgGrad.addColorStop(1, '#0a1226');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.save();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
        ctx.lineWidth = 1;
        for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
        for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
        ctx.restore();

        function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2.2) {
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(x, y, bw, bh, r);
            if (fill) { ctx.fillStyle = fill; ctx.fill(); }
            if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
            ctx.restore();
        }

        function drawOpenCup(x, y, cw, ch, col, lw = 3) {
            ctx.save();
            ctx.strokeStyle = col;
            ctx.lineWidth = lw;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + ch);
            ctx.lineTo(x + cw, y + ch);
            ctx.lineTo(x + cw, y);
            ctx.stroke();
            ctx.restore();
        }

        function arrowLine(x1, y1, x2, y2, col, lw = 2.4, hl = 7) {
            const ang = Math.atan2(y2 - y1, x2 - x1);
            ctx.save();
            ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
            ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
            ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
            ctx.closePath(); ctx.fill();
            ctx.restore();
        }

        ctx.save();
        const title = 'BAY HƠI & NGƯNG TỤ Ở LY KHÔNG ĐẬY vs LY ĐẬY MÀNG BỌC';
        ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
        const titleW = ctx.measureText(title).width + 22;
        roundBox(14, 10, titleW, 28, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
        ctx.fillStyle = '#38bdf8';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(title, 25, 24);
        ctx.restore();

        const saw = (t * 0.14) % 1;

        // 1. Khung trái: Ly không đậy
        roundBox(14, 48, 368, 244, 10, '#0f172a', '#f97316', 2);
        ctx.fillStyle = '#f97316';
        ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('LY 1: KHÔNG ĐẬY MÀNG BỌC', 198, 72);

        const c1x = 136, c1y = 126, cw = 124, ch = 124;
        const h1 = Math.max(0, (1 - saw) * 102);
        if (h1 > 1) {
            ctx.fillStyle = 'rgba(56, 189, 248, 0.42)';
            ctx.fillRect(c1x + 2, c1y + ch - h1, cw - 4, h1 - 1);
        }
        drawOpenCup(c1x, c1y, cw, ch, '#e2e8f0', 3.2);

        // Mũi tên & hạt hơi nước thoát ra không khí
        for (let i = 0; i < 4; i++) {
            const vp = (t * 0.65 + i * 0.25) % 1;
            const vx = c1x + 22 + i * 26;
            const vy = c1y + 10 - vp * 34;
            arrowLine(vx, vy + 14, vx, vy, `rgba(125, 211, 252, ${(1 - vp).toFixed(2)})`, 2.2, 6);
        }
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('Hơi nước thoát ra phòng (cạn dần)', 198, 272);

        // 2. Khung phải: Ly đậy kín màng bọc
        roundBox(398, 48, 368, 244, 10, '#0f172a', '#38bdf8', 2);
        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('LY 2: ĐẬY KÍN MÀNG BỌC THỰC PHẨM', 582, 72);

        const c2x = 520, c2y = 126;
        const h2 = 96; // mực nước gần đầy, hầu như không đổi
        ctx.fillStyle = 'rgba(56, 189, 248, 0.42)';
        ctx.fillRect(c2x + 2, c2y + ch - h2, cw - 4, h2 - 1);
        drawOpenCup(c2x, c2y, cw, ch, '#e2e8f0', 3.2);

        // Lớp màng bọc căng phủ miệng ly
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(c2x - 6, c2y + 4);
        ctx.quadraticCurveTo(c2x + cw / 2, c2y - 4, c2x + cw + 6, c2y + 4);
        ctx.stroke();

        // Các giọt nước đọng bên dưới mặt trong màng bọc
        [540, 560, 582, 604, 624].forEach((dx, idx) => {
            ctx.fillStyle = '#bae6fd';
            ctx.beginPath(); ctx.arc(dx, c2y + 6 + (idx % 2), 3.4, 0, Math.PI * 2); ctx.fill();
        });

        // Mũi tên bay lên & rơi xuống trong khoảng không dưới màng bọc
        const ap = (t * 0.7) % 1;
        arrowLine(550, c2y + 26, 550, c2y + 12, '#7dd3fc', 2.2, 6);
        arrowLine(614, c2y + 12, 614, c2y + 26, '#fbbf24', 2.2, 6);
        ctx.fillStyle = '#bae6fd';
        ctx.beginPath(); ctx.arc(582, c2y + 8 + ap * 18, 2.8, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#e2e8f0';
        ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('Có giọt đọng trên màng bọc · Mực giữ ổn định', 582, 272);
    });

    // =========================================================================
    // CÂU 26 (MH-STAGING-C1-26 · VLXT-DS-VD28-026): Hoạt động nóng chảy ngắt mạch của cầu chì ống (dây chì 2 g)
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C1-26', function(ctx, w, h, t) {
        ctx.clearRect(0, 0, w, h);
        const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
        bgGrad.addColorStop(0, '#060b19');
        bgGrad.addColorStop(1, '#0a1226');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.save();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
        ctx.lineWidth = 1;
        for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
        for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
        ctx.restore();

        function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2.2) {
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(x, y, bw, bh, r);
            if (fill) { ctx.fillStyle = fill; ctx.fill(); }
            if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
            ctx.restore();
        }

        function arrowLine(x1, y1, x2, y2, col, lw = 2.6, hl = 7) {
            const ang = Math.atan2(y2 - y1, x2 - x1);
            ctx.save();
            ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
            ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
            ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
            ctx.closePath(); ctx.fill();
            ctx.restore();
        }

        function calloutTag(tx, ty, bx, by, label, col) {
            ctx.save();
            ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            const padX = 10, boxH = 28;
            const boxW = ctx.measureText(label).width + padX * 2;
            const safeBx = Math.min(w - 10 - boxW, Math.max(10, bx));
            const safeBy = Math.min(h - 10 - boxH, Math.max(10, by));
            const ax = (safeBx + boxW / 2 < tx) ? (safeBx + boxW) : safeBx;
            const ay = safeBy + boxH / 2;

            ctx.strokeStyle = col; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(ax, ay); ctx.stroke();
            ctx.fillStyle = col;
            ctx.beginPath(); ctx.arc(tx, ty, 3.6, 0, Math.PI * 2); ctx.fill();

            roundBox(safeBx, safeBy, boxW, boxH, 7, '#0f172a', col, 2);
            ctx.fillStyle = '#f8fafc';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(label, safeBx + boxW / 2, safeBy + boxH / 2);
            ctx.restore();
        }

        ctx.save();
        const title = 'CẦU CHÌ ỐNG BẢO VỆ QUÁ TẢI (DÂY CHÌ m = 2 g)';
        ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
        const titleW = ctx.measureText(title).width + 22;
        roundBox(14, 10, titleW, 28, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
        ctx.fillStyle = '#38bdf8';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(title, 25, 24);
        ctx.restore();

        // Chu kỳ sawtooth: 0..0.65 dây nóng dần từ 27°C -> 327°C; 0.65..1.0 nóng chảy đứt mạch
        const saw = (t * 0.16) % 1;
        const isMelted = saw >= 0.65;
        const heatR = isMelted ? 1 : (saw / 0.65);
        const meltP = isMelted ? (saw - 0.65) / 0.35 : 0;
        const curTemp = Math.round(27 + 300 * heatR);

        // Dây dẫn 2 đầu cầu chì
        ctx.strokeStyle = isMelted ? '#64748b' : '#fbbf24';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(16, 146); ctx.lineTo(54, 146);
        ctx.moveTo(398, 146); ctx.lineTo(442, 146);
        ctx.stroke();

        if (!isMelted) {
            arrowLine(20, 130, 50, 130, '#fbbf24', 2.4, 7);
            arrowLine(402, 130, 434, 130, '#fbbf24', 2.4, 7);
            ctx.fillStyle = '#fbbf24';
            ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText('I quá tải', 16, 110);
        }

        // Thân ống thủy tinh cầu chì
        roundBox(96, 114, 260, 64, 4, 'rgba(148, 163, 184, 0.12)', '#cbd5e1', 2.6);
        // Hai đầu chụp kim loại
        roundBox(52, 108, 54, 76, 8, '#475569', '#e2e8f0', 2.4);
        roundBox(346, 108, 54, 76, 8, '#475569', '#e2e8f0', 2.4);

        // Dây chì hình trụ bên trong ống
        const wireCol = isMelted ? '#f97316' : `rgb(${Math.round(148 + 107 * heatR)}, ${Math.round(163 - 65 * heatR)}, ${Math.round(184 - 160 * heatR)})`;
        ctx.strokeStyle = wireCol;
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        if (!isMelted) {
            ctx.beginPath(); ctx.moveTo(106, 146); ctx.lineTo(346, 146); ctx.stroke();
        } else {
            const gap = 14 + meltP * 24;
            ctx.beginPath();
            ctx.moveTo(106, 146); ctx.lineTo(226 - gap, 146 + meltP * 6);
            ctx.moveTo(346, 146); ctx.lineTo(226 + gap, 146 + meltP * 6);
            ctx.stroke();
            // Giọt chì nóng chảy nhỏ xuống đáy ống thủy tinh
            const dropY = 152 + Math.min(20, meltP * 28);
            ctx.fillStyle = '#f97316';
            ctx.beginPath(); ctx.arc(226, dropY, 4.5, 0, Math.PI * 2); ctx.fill();
        }

        // Nhãn callout cho bộ phận cầu chì
        calloutTag(130, 114, 24, 58, 'Ống thủy tinh', '#38bdf8');
        calloutTag(226, 146, 186, 210, 'Dây chì (m = 2 g)', '#f97316');
        calloutTag(372, 108, 294, 58, 'Đầu chụp kim loại', '#cbd5e1');

        // Thanh nhiệt độ dây chì ở đáy trái
        roundBox(18, 250, 424, 38, 8, '#0f172a', isMelted ? '#ef4444' : '#f59e0b', 1.8);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText('Nhiệt độ dây chì: ' + curTemp + ' °C', 32, 269);
        ctx.textAlign = 'right';
        ctx.fillStyle = isMelted ? '#f87171' : '#fbbf24';
        ctx.fillText(isMelted ? 'ĐÃ NÓNG CHẢY NGẮT MẠCH' : 'Đang nóng lên...', 428, 269);

        // Card phải thông số đề bài (Zero Data Leakage)
        roundBox(472, 12, 294, 280, 10, '#0f172a', '#38bdf8', 2);
        ctx.textAlign = 'left';
        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 15.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('THÔNG SỐ CẦU CHÌ', 490, 38);

        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('• Vật liệu: Chì (Pb)', 490, 74);
        ctx.fillText('• Khối lượng dây: m = 2 g', 490, 106);
        ctx.fillStyle = '#7dd3fc';
        ctx.fillText('• Nhiệt độ phòng: 27 °C', 490, 138);
        ctx.fillStyle = '#fbbf24';
        ctx.fillText('• Nhiệt độ nóng chảy: 327 °C', 490, 170);
        ctx.fillStyle = '#e2e8f0';
        ctx.fillText('• c = 130 J/(kg·K)', 490, 204);
        ctx.fillText('• λ = 0,25·10⁵ J/kg', 490, 236);
    });

    // =========================================================================
    // CÂU 27 (MH-STAGING-C1-27 · VLXT-DS-VD28-027): Lò điện công suất 2,5 kW (hiệu suất 60%) nấu chảy hợp kim đồng 0,8 kg và bạc 0,2 kg
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C1-27', function(ctx, w, h, t) {
        ctx.clearRect(0, 0, w, h);
        const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
        bgGrad.addColorStop(0, '#060b19');
        bgGrad.addColorStop(1, '#0a1226');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.save();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
        ctx.lineWidth = 1;
        for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
        for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
        ctx.restore();

        function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2.2) {
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(x, y, bw, bh, r);
            if (fill) { ctx.fillStyle = fill; ctx.fill(); }
            if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
            ctx.restore();
        }

        function drawOpenCrucible(x, y, cw, ch, col, lw = 3.2, flare = 8) {
            ctx.save();
            ctx.strokeStyle = col;
            ctx.lineWidth = lw;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(x - flare, y);
            ctx.lineTo(x, y + 8);
            ctx.lineTo(x, y + ch);
            ctx.lineTo(x + cw, y + ch);
            ctx.lineTo(x + cw, y + 8);
            ctx.lineTo(x + cw + flare, y);
            ctx.stroke();
            ctx.restore();
        }

        function arrowLine(x1, y1, x2, y2, col, lw = 2.4, hl = 7) {
            const ang = Math.atan2(y2 - y1, x2 - x1);
            ctx.save();
            ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
            ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
            ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
            ctx.closePath(); ctx.fill();
            ctx.restore();
        }

        function drawSub(base, sub, x, y, col, align = 'left', baseSize = 15, subSize = 12.5) {
            ctx.save();
            ctx.font = `800 ${baseSize}px "Plus Jakarta Sans", system-ui, sans-serif`;
            const bw = ctx.measureText(base).width;
            ctx.font = `800 ${subSize}px "Plus Jakarta Sans", system-ui, sans-serif`;
            const sw = ctx.measureText(sub).width;
            let sx = x;
            if (align === 'center') sx = x - (bw + sw) / 2;
            else if (align === 'right') sx = x - (bw + sw);
            ctx.fillStyle = col;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.font = `800 ${baseSize}px "Plus Jakarta Sans", system-ui, sans-serif`;
            ctx.fillText(base, sx, y);
            ctx.font = `800 ${subSize}px "Plus Jakarta Sans", system-ui, sans-serif`;
            ctx.fillText(sub, sx + bw + 1, y + 5);
            ctx.restore();
            return bw + sw + 1;
        }

        ctx.save();
        const title = 'LÒ ĐIỆN NẤU CHẢY HỢP KIM ĐỒNG – BẠC';
        ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
        const titleW = ctx.measureText(title).width + 22;
        roundBox(14, 10, titleW, 28, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
        ctx.fillStyle = '#38bdf8';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(title, 25, 24);
        ctx.restore();

        const saw = (t * 0.14) % 1;
        const temp = 27 + saw * (1120 - 27);

        // Chén nung hở miệng trên (U-shape)
        const cx = 64, cy = 96, cw = 186, ch = 128;

        // Trạng thái chảy lỏng của Bạc (t_nc = 960°C) và Đồng (t_nc = 1084°C)
        const agMelt = Math.max(0, Math.min(1, (temp - 960) / 70));
        const cuMelt = Math.max(0, Math.min(1, (temp - 1084) / 36));

        // Lớp kim loại nóng chảy ở đáy nồi
        const poolH = agMelt * 16 + cuMelt * 34;
        if (poolH > 1) {
            ctx.fillStyle = cuMelt > 0.3 ? 'rgba(245, 158, 11, 0.72)' : 'rgba(203, 213, 225, 0.78)';
            ctx.fillRect(cx + 2, cy + ch - poolH, cw - 4, poolH - 1);
        }

        // Khối Đồng (0,8 kg)
        if (cuMelt < 0.95) {
            const cuH = 66 * (1 - cuMelt * 0.65);
            roundBox(cx + 18, cy + ch - cuH - 4, 84, cuH, 6, '#b45309', '#fbbf24', 2);
            ctx.fillStyle = '#fef3c7';
            ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Cu (0,8 kg)', cx + 60, cy + ch - cuH / 2 - 4);
        }

        // Khối Bạc (0,2 kg)
        if (agMelt < 0.95) {
            const agH = 44 * (1 - agMelt * 0.7);
            roundBox(cx + 114, cy + ch - agH - 4, 58, agH, 6, '#64748b', '#e2e8f0', 2);
            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Ag', cx + 143, cy + ch - agH / 2 - 4);
        }

        drawOpenCrucible(cx, cy, cw, ch, '#cbd5e1', 3.4, 8);

        // Đế gia nhiệt lò điện
        roundBox(cx - 10, cy + ch + 10, cw + 20, 14, 4, '#ea580c', '#fdba74', 2);
        arrowLine(cx + 35, cy + ch + 10, cx + 35, cy + ch - 2, '#fb923c', 2.4, 6);
        arrowLine(cx + 93, cy + ch + 10, cx + 93, cy + ch - 2, '#fb923c', 2.4, 6);
        arrowLine(cx + 151, cy + ch + 10, cx + 151, cy + ch - 2, '#fb923c', 2.4, 6);

        ctx.fillStyle = '#fdba74';
        ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Lò điện: P = 2,5 kW · H = 60%', cx + cw / 2, 276);

        // Nhiệt kế bên phải chén nung
        const tx = 294, ty = 78, th = 152;
        roundBox(tx - 6, ty, 12, th, 6, '#0f172a', '#cbd5e1', 2);
        ctx.fillStyle = '#ef4444';
        ctx.beginPath(); ctx.arc(tx, ty + th + 4, 9, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 2; ctx.stroke();

        const mercRatio = (temp - 27) / (1120 - 27);
        const mH = 12 + mercRatio * (th - 22);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(tx - 3, ty + th - mH, 6, mH + 2);

        ctx.textAlign = 'left';
        ctx.font = '800 14.5px "DM Mono", monospace';
        ctx.fillStyle = '#f59e0b';
        ctx.fillText('1084 °C (Cu)', tx + 14, ty + 16);
        ctx.fillStyle = '#e2e8f0';
        ctx.fillText('960 °C (Ag)', tx + 14, ty + 48);
        ctx.fillStyle = '#7dd3fc';
        ctx.fillText('27 °C', tx + 14, ty + th - 14);

        // Card phải thông số đề bài (Zero Data Leakage)
        roundBox(448, 12, 318, 280, 10, '#0f172a', '#38bdf8', 2);
        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 15.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('THÔNG SỐ HỢP KIM & LÒ', 466, 38);

        ctx.fillStyle = '#f59e0b';
        ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        const cuLabel = '• Đồng (0,8 kg): ';
        ctx.fillText(cuLabel, 466, 72);
        const cuX = 466 + ctx.measureText(cuLabel).width;
        const wCuSub = drawSub('t', 'nc', cuX, 72, '#f59e0b');
        ctx.fillStyle = '#f59e0b';
        ctx.fillText(' = 1084 °C', cuX + wCuSub, 72);

        ctx.fillStyle = '#e2e8f0';
        ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('  c = 380 J/(kg·K) · λ = 1,80·10⁵', 466, 98);

        ctx.fillStyle = '#cbd5e1';
        ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        const agLabel = '• Bạc (0,2 kg): ';
        ctx.fillText(agLabel, 466, 134);
        const agX = 466 + ctx.measureText(agLabel).width;
        const wAgSub = drawSub('t', 'nc', agX, 134, '#cbd5e1');
        ctx.fillStyle = '#cbd5e1';
        ctx.fillText(' = 960 °C', agX + wAgSub, 134);
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('  c = 235 J/(kg·K) · λ = 1,05·10⁵', 466, 160);

        ctx.fillStyle = '#7dd3fc';
        ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('• Nhiệt độ ban đầu: 27 °C', 466, 198);
        ctx.fillText('• Lò điện: P = 2,5 kW ; H = 60%', 466, 224);

        roundBox(466, 244, 282, 34, 7, '#1e293b', '#f97316', 1.8);
        ctx.fillStyle = '#fbbf24';
        ctx.font = '800 15px "DM Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('Nhiệt độ lò: ' + Math.round(temp) + ' °C', 607, 261);
    });

    // =========================================================================
    // CÂU 28 (MH-STAGING-C1-28 · VLXT-DS-VD28-028): Khảo sát tốc độ làm nguội nước nóng trong hai chậu: để nguội tự nhiên (không gió) và thổi quạt gió
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C1-28', function(ctx, w, h, t) {
        ctx.clearRect(0, 0, w, h);
        const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
        bgGrad.addColorStop(0, '#060b19');
        bgGrad.addColorStop(1, '#0a1226');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.save();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
        ctx.lineWidth = 1;
        for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
        for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
        ctx.restore();

        function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2.2) {
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(x, y, bw, bh, r);
            if (fill) { ctx.fillStyle = fill; ctx.fill(); }
            if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
            ctx.restore();
        }

        function drawOpenCup(x, y, cw, ch, col, lw = 3) {
            ctx.save();
            ctx.strokeStyle = col;
            ctx.lineWidth = lw;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + ch);
            ctx.lineTo(x + cw, y + ch);
            ctx.lineTo(x + cw, y);
            ctx.stroke();
            ctx.restore();
        }

        ctx.save();
        const title = 'LÀM NGUỘI NƯỚC (2 kg · 50 °C): KHÔNG GIÓ vs CÓ QUẠT';
        ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
        const titleW = ctx.measureText(title).width + 22;
        roundBox(14, 10, titleW, 28, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
        ctx.fillStyle = '#38bdf8';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(title, 25, 24);

        roundBox(552, 10, 214, 28, 7, '#0f172a', '#475569', 1.8);
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Nhiệt độ phòng: 25 °C', 659, 24);
        ctx.restore();

        const saw = (t * 0.14) % 1;
        const temp1 = 50 - (50 - 39) * saw;
        const temp2 = 50 - (50 - 32.3) * saw;

        // Vách ngăn giữa 2 chậu (giống tranh 028.png)
        roundBox(14, 48, 366, 244, 10, '#0f172a', '#f59e0b', 2);
        roundBox(396, 48, 370, 244, 10, '#0f172a', '#38bdf8', 2);

        // --- CHẬU 1 (KHÔNG GIÓ) ---
        ctx.fillStyle = '#fbbf24';
        ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('CHẬU 1: NGUỘI TỰ NHIÊN (KHÔNG GIÓ)', 197, 72);

        const b1x = 74, b1y = 136, bw = 166, bh = 96;
        ctx.fillStyle = 'rgba(249, 115, 22, 0.32)';
        ctx.fillRect(b1x + 2, b1y + 26, bw - 4, bh - 27);
        drawOpenCup(b1x, b1y, bw, bh, '#e2e8f0', 3);

        // Que khuấy nhẹ
        const stir1 = Math.sin(t * 4) * 14;
        ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(b1x + 70 + stir1, b1y - 16); ctx.lineTo(b1x + 62 + stir1 * 0.5, b1y + bh - 12); ctx.stroke();

        // Nhiệt kế chậu 1
        roundBox(266, 118, 12, 112, 6, '#09111f', '#cbd5e1', 2);
        ctx.fillStyle = '#ef4444';
        ctx.beginPath(); ctx.arc(272, 234, 8, 0, Math.PI * 2); ctx.fill();
        const h1 = 36 + ((temp1 - 25) / 25) * 62;
        ctx.fillRect(269, 230 - h1, 6, h1 + 2);
        ctx.fillStyle = '#fbbf24';
        ctx.font = '800 15px "DM Mono", monospace';
        ctx.textAlign = 'left';
        ctx.fillText(temp1.toFixed(1).replace('.', ',') + ' °C', 286, 168);

        ctx.fillStyle = '#e2e8f0';
        ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('2 kg nước · 50 °C → 39,0 °C (sau 5 phút)', 197, 270);

        // --- CHẬU 2 (CÓ QUẠT THỔI GIÓ) ---
        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('CHẬU 2: CÓ QUẠT THỔI QUA MẶT THOÁNG', 581, 72);

        const b2x = 420, b2y = 136;
        ctx.fillStyle = 'rgba(56, 189, 248, 0.34)';
        ctx.fillRect(b2x + 2, b2y + 26, bw - 4, bh - 27);
        drawOpenCup(b2x, b2y, bw, bh, '#e2e8f0', 3);

        const stir2 = Math.sin(t * 4.2 + 1) * 14;
        ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(b2x + 70 + stir2, b2y - 16); ctx.lineTo(b2x + 62 + stir2 * 0.5, b2y + bh - 12); ctx.stroke();

        // Nhiệt kế chậu 2
        roundBox(604, 118, 12, 112, 6, '#09111f', '#cbd5e1', 2);
        ctx.fillStyle = '#ef4444';
        ctx.beginPath(); ctx.arc(610, 234, 8, 0, Math.PI * 2); ctx.fill();
        const h2 = 36 + ((temp2 - 25) / 25) * 62;
        ctx.fillRect(607, 230 - h2, 6, h2 + 2);
        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 15px "DM Mono", monospace';
        ctx.textAlign = 'left';
        ctx.fillText(temp2.toFixed(1).replace('.', ',') + ' °C', 624, 210);

        // Quạt điện thổi gió sang trái qua mặt thoáng chậu 2
        const fx = 718, fy = 148;
        ctx.strokeStyle = '#64748b'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(fx, fy + 26); ctx.lineTo(fx, 232); ctx.moveTo(fx - 22, 232); ctx.lineTo(fx + 22, 232); ctx.stroke();
        ctx.fillStyle = '#0f172a'; ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2.4;
        ctx.beginPath(); ctx.arc(fx, fy, 28, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.save();
        ctx.translate(fx, fy);
        ctx.rotate(t * 9);
        ctx.fillStyle = '#38bdf8';
        for (let b = 0; b < 3; b++) {
            ctx.rotate((Math.PI * 2) / 3);
            ctx.beginPath(); ctx.ellipse(0, -12, 5, 11, 0, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();

        // Đường luồng gió từ quạt thổi ngang mặt thoáng
        for (let wv = 0; wv < 3; wv++) {
            const wp = (t * 1.4 + wv * 0.33) % 1;
            const wx = 682 - wp * 210;
            const wy = 132 + wv * 11;
            ctx.strokeStyle = `rgba(125, 211, 252, ${(1 - wp).toFixed(2)})`;
            ctx.lineWidth = 2.2;
            ctx.beginPath(); ctx.moveTo(wx, wy); ctx.lineTo(wx - 28, wy); ctx.stroke();
        }

        ctx.fillStyle = '#e2e8f0';
        ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('2 kg nước · 50 °C → 32,3 °C (sau 5 phút)', 581, 270);
    });

    // =========================================================================
    // CÂU 29 (MH-STAGING-C1-29 · VLXT-DS-VD28-029): Thí nghiệm làm tan chảy đá vụn trong phễu bằng nguồn nóng 17 W và cân điện tử
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C1-29', function(ctx, w, h, t) {
        ctx.clearRect(0, 0, w, h);
        const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
        bgGrad.addColorStop(0, '#060b19');
        bgGrad.addColorStop(1, '#0a1226');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.save();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
        ctx.lineWidth = 1;
        for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
        for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
        ctx.restore();

        function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2.2) {
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(x, y, bw, bh, r);
            if (fill) { ctx.fillStyle = fill; ctx.fill(); }
            if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
            ctx.restore();
        }

        function drawOpenCup(x, y, cw, ch, col, lw = 3) {
            ctx.save();
            ctx.strokeStyle = col;
            ctx.lineWidth = lw;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + ch);
            ctx.lineTo(x + cw, y + ch);
            ctx.lineTo(x + cw, y);
            ctx.stroke();
            ctx.restore();
        }

        function calloutTag(tx, ty, bx, by, label, col) {
            ctx.save();
            ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            const padX = 10, boxH = 28;
            const boxW = ctx.measureText(label).width + padX * 2;
            const safeBx = Math.min(w - 10 - boxW, Math.max(10, bx));
            const safeBy = Math.min(h - 10 - boxH, Math.max(10, by));
            const ax = (safeBx + boxW / 2 < tx) ? (safeBx + boxW) : safeBx;
            const ay = safeBy + boxH / 2;

            ctx.strokeStyle = col; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(ax, ay); ctx.stroke();
            ctx.fillStyle = col;
            ctx.beginPath(); ctx.arc(tx, ty, 3.6, 0, Math.PI * 2); ctx.fill();

            roundBox(safeBx, safeBy, boxW, boxH, 7, '#0f172a', col, 2);
            ctx.fillStyle = '#f8fafc';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(label, safeBx + boxW / 2, safeBy + boxH / 2);
            ctx.restore();
        }

        ctx.save();
        const title = 'PHỄU LÀM TAN ĐÁ VỤN BẰNG NGUỒN NÓNG 17 W';
        ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
        const titleW = ctx.measureText(title).width + 22;
        roundBox(14, 10, titleW, 28, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
        ctx.fillStyle = '#38bdf8';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(title, 25, 24);
        ctx.restore();

        const saw = (t * 0.14) % 1;
        const step2 = saw >= 0.40;
        const prog = step2 ? (saw - 0.40) / 0.60 : saw / 0.40;
        const massVal = step2 ? (2 + 18 * prog) : (2 * prog);

        const cx = 310;
        // Phễu thủy tinh hở miệng trên
        ctx.fillStyle = 'rgba(226, 232, 240, 0.25)';
        ctx.beginPath();
        ctx.moveTo(cx - 56, 66); ctx.lineTo(cx + 56, 66);
        ctx.lineTo(cx + 10, 134); ctx.lineTo(cx - 10, 134);
        ctx.closePath(); ctx.fill();

        // Đá vụn trong phễu
        [
            [cx - 32, 78], [cx - 8, 74], [cx + 16, 78], [cx - 20, 96], [cx + 6, 98], [cx - 6, 114]
        ].forEach(([ix, iy]) => {
            roundBox(ix, iy, 16, 13, 3, 'rgba(226, 232, 240, 0.85)', '#7dd3fc', 1.5);
        });

        // Cuộn dây nguồn nóng 17 W nghiêng trong phễu + dây nối
        ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2.6;
        ctx.beginPath(); ctx.moveTo(cx - 64, 48); ctx.quadraticCurveTo(cx - 46, 56, cx - 38, 70); ctx.stroke();
        ctx.strokeStyle = step2 ? '#f97316' : '#64748b'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(cx - 38, 70); ctx.lineTo(cx - 10, 126); ctx.stroke();

        // Thành phễu hở miệng trên + cuống phễu
        ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 3; ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(cx - 58, 62); ctx.lineTo(cx - 10, 134); ctx.lineTo(cx - 8, 158);
        ctx.moveTo(cx + 58, 62); ctx.lineTo(cx + 10, 134); ctx.lineTo(cx + 8, 158);
        ctx.stroke();

        // Giọt nước nhỏ xuống cốc
        const dropP = (t * (step2 ? 1.8 : 0.7)) % 1;
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath(); ctx.arc(cx, 160 + dropP * 32, 3.2, 0, Math.PI * 2); ctx.fill();

        // Cốc đựng nước (hở miệng trên)
        const cupX = cx - 34, cupY = 186, cupW = 68, cupH = 52;
        const wH = 4 + (massVal / 20) * 34;
        ctx.fillStyle = 'rgba(56, 189, 248, 0.42)';
        ctx.fillRect(cupX + 2, cupY + cupH - wH, cupW - 4, wH - 1);
        drawOpenCup(cupX, cupY, cupW, cupH, '#e2e8f0', 2.8);

        // Cân điện tử
        roundBox(cx - 56, 240, 112, 6, 2, '#94a3b8', '#e2e8f0', 1.5);
        ctx.fillStyle = '#1e293b'; ctx.strokeStyle = '#64748b'; ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(cx - 66, 246); ctx.lineTo(cx + 66, 246);
        ctx.lineTo(cx + 76, 288); ctx.lineTo(cx - 76, 288);
        ctx.closePath(); ctx.fill(); ctx.stroke();

        roundBox(cx - 46, 253, 92, 26, 4, '#09111f', '#38bdf8', 1.6);
        ctx.fillStyle = '#34d399';
        ctx.font = '800 15.5px "DM Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(massVal.toFixed(1).replace('.', ',') + ' g', cx, 266);

        calloutTag(cx - 24, 96, 14, 58, 'Nguồn nóng (17 W)', '#f97316');
        calloutTag(cx - 38, 112, 14, 118, 'Phễu & Đá vụn', '#7dd3fc');
        calloutTag(cupX, 212, 14, 182, 'Cốc đựng nước', '#38bdf8');
        calloutTag(cx - 70, 266, 14, 246, 'Cân điện tử', '#10b981');

        // Card phải thông số đề bài (Zero Data Leakage)
        roundBox(468, 12, 298, 280, 10, '#0f172a', '#38bdf8', 2);
        ctx.textAlign = 'left';
        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 15.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('SỐ LIỆU ĐỀ BÀI', 486, 38);

        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('• Công suất nguồn nóng: 17 W', 486, 74);
        ctx.fillText('• Bước 1 (5 phút, tắt nguồn):', 486, 112);
        ctx.fillStyle = '#7dd3fc';
        ctx.fillText('   Số chỉ cân: 2 g', 486, 138);
        ctx.fillStyle = '#f8fafc';
        ctx.fillText('• Bước 2 (5 phút, bật nguồn):', 486, 176);
        ctx.fillStyle = '#fbbf24';
        ctx.fillText('   Số chỉ cân: 20 g', 486, 202);

        roundBox(486, 238, 262, 36, 7, '#1e293b', step2 ? '#f97316' : '#38bdf8', 1.8);
        ctx.fillStyle = step2 ? '#fdba74' : '#7dd3fc';
        ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(step2 ? 'Bước 2: Bật nguồn nóng 17 W' : 'Bước 1: Chưa bật nguồn điện', 617, 256);
    });

    // =========================================================================
    // CÂU 30 (MH-STAGING-C1-30 · VLXT-DS-VD28-030): Thả liên tiếp hai quả cầu kim loại (210 °C và 150 °C) vào nhiệt lượng kế chứa nước ở 20 °C
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C1-30', function(ctx, w, h, t) {
        ctx.clearRect(0, 0, w, h);
        const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
        bgGrad.addColorStop(0, '#060b19');
        bgGrad.addColorStop(1, '#0a1226');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.save();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
        ctx.lineWidth = 1;
        for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
        for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
        ctx.restore();

        function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2.2) {
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(x, y, bw, bh, r);
            if (fill) { ctx.fillStyle = fill; ctx.fill(); }
            if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
            ctx.restore();
        }

        function arrowLine(x1, y1, x2, y2, col, lw = 2.6, hl = 8) {
            const ang = Math.atan2(y2 - y1, x2 - x1);
            ctx.save();
            ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
            ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
            ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
            ctx.closePath(); ctx.fill();
            ctx.restore();
        }

        // Tiêu đề bên trái
        const title = 'CÂN BẰNG NHIỆT: THẢ 2 QUẢ CẦU VÀO BÌNH NƯỚC';
        ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        roundBox(14, 12, 434, 30, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
        ctx.fillStyle = '#38bdf8';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(title, 26, 27);

        // Khung mô phỏng bình nhiệt lượng kế hở miệng
        roundBox(14, 50, 434, 242, 10, '#0f172a', '#334155', 1.8);

        const saw = (t * 0.18) % 1;
        const phase2 = saw >= 0.45;
        const p1Frac = Math.min(1, saw / 0.36);
        const p2Frac = phase2 ? Math.min(1, (saw - 0.45) / 0.36) : 0;

        // Thành cách nhiệt ngoài (hở miệng trên)
        const outX = 76, outY = 104, outW = 196, outH = 148;
        ctx.save();
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(outX - 8, outY);
        ctx.lineTo(outX, outY + 6);
        ctx.lineTo(outX, outY + outH);
        ctx.lineTo(outX + outW, outY + outH);
        ctx.lineTo(outX + outW, outY + 6);
        ctx.lineTo(outX + outW + 8, outY);
        ctx.stroke();

        // Lòng bình nhiệt lượng kế bên trong (hở miệng trên)
        const inX = 94, inY = 112, inW = 160, inH = 128;
        ctx.fillStyle = phase2 ? 'rgba(56, 189, 248, 0.36)' : `rgba(14, 165, 233, ${(0.22 + 0.14 * p1Frac).toFixed(2)})`;
        ctx.fillRect(inX + 2, inY + 42, inW - 4, inH - 44);

        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.moveTo(inX, inY);
        ctx.lineTo(inX, inY + inH);
        ctx.lineTo(inX + inW, inY + inH);
        ctx.lineTo(inX + inW, inY);
        ctx.stroke();

        // Nhiệt kế bên phải trong nước
        const thX = 236;
        roundBox(thX - 4, 80, 8, 134, 4, '#1e293b', '#cbd5e1', 1.6);
        const mercTop = phase2 ? 120 : (178 - p1Frac * 44);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(thX - 2, mercTop, 4, 214 - mercTop);
        ctx.beginPath(); ctx.arc(thX, 216, 7, 0, Math.PI * 2); ctx.fill();

        // Nhãn nước & nhiệt kế bên cạnh bình
        ctx.textAlign = 'left';
        ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillStyle = '#7dd3fc';
        ctx.fillText(phase2 ? 'Nước + (1): 60 °C' : (p1Frac > 0.7 ? 'Đạt cân bằng: 60 °C' : 'Nước ban đầu: 20 °C'), 292, 164);

        // Quả cầu (1): 210 °C
        const b1X = 136;
        const b1Y = phase2 ? 214 : (78 + p1Frac * (214 - 78));
        ctx.fillStyle = phase2 ? '#f59e0b' : (p1Frac > 0.7 ? '#fb923c' : '#ef4444');
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(b1X, b1Y, 17, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('1', b1X, b1Y + 1);

        if (!phase2) {
            arrowLine(b1X + 20, b1Y, b1X + 42, b1Y - 12, '#fb923c', 2.4, 7);
            ctx.textAlign = 'left';
            ctx.fillStyle = '#fca5a5';
            ctx.fillText('Cầu (1): 210 °C', 292, 118);
        } else {
            // Quả cầu (2): 150 °C hạ vào bình
            const b2X = 192;
            const b2Y = 78 + p2Frac * (214 - 78);
            ctx.fillStyle = '#ef4444';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(b2X, b2Y, 17, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#ffffff';
            ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('2', b2X, b2Y + 1);

            if (p2Frac > 0.35) {
                arrowLine(b2X - 20, b2Y, b1X + 21, b1Y, '#fbbf24', 2.4, 7);
                arrowLine(b2X + 18, b2Y - 10, b2X + 36, b2Y - 26, '#fbbf24', 2.4, 7);
            } else {
                arrowLine(b2X, b2Y + 20, b2X, b2Y + 42, '#fbbf24', 2.6, 8);
            }
            ctx.textAlign = 'left';
            ctx.fillStyle = '#fdba74';
            ctx.fillText('Cầu (2): 150 °C', 292, 118);
            ctx.fillStyle = '#cbd5e1';
            ctx.fillText('Truyền cho cả nước & (1)', 292, 206);
        }

        // Chú thích pha phía dưới bình
        ctx.fillStyle = phase2 ? '#fde68a' : '#7dd3fc';
        ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(
            phase2 ? 'Lần 2: Thả tiếp cầu (2) ở 150 °C vào nhiệt lượng kế' : 'Lần 1: Thả cầu (1) ở 210 °C vào nước ở 20 °C',
            231,
            274
        );
        ctx.restore();

        // Cột phải: Thông số đề bài (Zero Data Leakage)
        ctx.save();
        roundBox(458, 12, 308, 280, 10, '#0f172a', '#38bdf8', 2);
        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 15.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText('DỮ KIỆN ĐỀ BÀI', 476, 40);

        ctx.fillStyle = '#7dd3fc';
        ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('• Nước ban đầu: t₀ = 20 °C', 476, 76);

        ctx.fillStyle = '#fca5a5';
        ctx.fillText('• Quả cầu (1): t₁ = 210 °C', 476, 108);

        ctx.fillStyle = '#fbbf24';
        ctx.fillText('• Cân bằng lần 1: t₁′ = 60 °C', 476, 140);

        ctx.fillStyle = '#fdba74';
        ctx.fillText('• Quả cầu (2): t₂ = 150 °C', 476, 172);

        ctx.fillStyle = '#f8fafc';
        ctx.fillText('• c (kim loại) = 460 J/(kg·K)', 476, 206);
        ctx.fillText('• c (nước) = 4200 J/(kg·K)', 476, 236);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('• Bỏ qua hao phí & chuyển thể', 476, 268);
        ctx.restore();
    });

    // =========================================================================
    // CÂU 31 (MH-STAGING-C1-31 · VLXT-DS-VD28-031): Khảo sát nhiệt độ theo thời gian của mẫu chất rắn được cấp nhiệt liên tục công suất 200 W
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C1-31', function(ctx, w, h, t) {
        ctx.clearRect(0, 0, w, h);
        const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
        bgGrad.addColorStop(0, '#060b19');
        bgGrad.addColorStop(1, '#0a1226');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.save();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
        ctx.lineWidth = 1;
        for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
        for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
        ctx.restore();

        function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2.2) {
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(x, y, bw, bh, r);
            if (fill) { ctx.fillStyle = fill; ctx.fill(); }
            if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
            ctx.restore();
        }

        function arrowLine(x1, y1, x2, y2, col, lw = 2.6, hl = 8) {
            const ang = Math.atan2(y2 - y1, x2 - x1);
            ctx.save();
            ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
            ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
            ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
            ctx.closePath(); ctx.fill();
            ctx.restore();
        }

        function drawOpenBeaker(x, y, bw, bh, col, lw = 3, flare = 6) {
            ctx.save();
            ctx.strokeStyle = col;
            ctx.lineWidth = lw;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(x - flare, y);
            ctx.lineTo(x, y + 6);
            ctx.lineTo(x, y + bh);
            ctx.lineTo(x + bw, y + bh);
            ctx.lineTo(x + bw, y + 6);
            ctx.lineTo(x + bw + flare, y);
            ctx.stroke();
            ctx.restore();
        }

        // Tiêu đề trên trái
        roundBox(14, 12, 452, 30, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText('KHẢO SÁT NHIỆT ĐỘ MẪU CHẤT (CÔNG SUẤT 200 W)', 26, 27);

        // Đồ thị t (°C) theo τ (phút) đúng theo 12 mốc bảng số liệu
        const ox = 80, y0 = 206;
        const dx = 30, scaleY = 8; // 0..11 phút -> x = 80..410 ; -8..12 °C -> y = 270..110
        const dataPts = [
            [0, -8], [1, -4], [2, 0], [3, 0], [4, 0], [5, 0],
            [6, 2], [7, 4], [8, 6], [9, 8], [10, 10], [11, 12]
        ];
        const px = (tau) => ox + tau * dx;
        const py = (temp) => y0 - temp * scaleY;

        ctx.save();
        arrowLine(ox, 286, ox, 54, '#f1f5f9', 2.8, 8);
        arrowLine(54, y0, 464, y0, '#f1f5f9', 2.8, 8);

        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText('t (°C)', ox + 10, 62);
        ctx.textAlign = 'center';
        ctx.fillText('τ (phút)', 436, y0 - 20);

        // Nhãn trục tung: -8, -4, 0, 4, 8, 12
        ctx.font = '800 14.5px "DM Mono", monospace';
        ctx.textAlign = 'right';
        ctx.fillStyle = '#e2e8f0';
        [-8, -4, 4, 8, 12].forEach(val => {
            ctx.fillText(String(val), ox - 10, py(val));
            ctx.strokeStyle = 'rgba(148, 163, 184, 0.22)';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(ox, py(val)); ctx.lineTo(430, py(val)); ctx.stroke();
        });
        ctx.fillText('0', ox - 12, y0 + 16);

        // Nhãn trục hoành tránh đè đường cong
        ctx.textAlign = 'center';
        ctx.fillText('2', px(2), y0 - 18);
        [5, 8, 11].forEach(tau => {
            ctx.fillText(String(tau), px(tau), y0 + 22);
        });

        // Đường gióng từ điểm (11, 12)
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1.6;
        ctx.setLineDash([5, 4]);
        ctx.beginPath();
        ctx.moveTo(ox, py(12)); ctx.lineTo(px(11), py(12)); ctx.lineTo(px(11), y0);
        ctx.stroke();
        ctx.setLineDash([]);

        // Vẽ 3 đoạn đồ thị rõ nét
        ctx.lineWidth = 3.6;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#38bdf8';
        ctx.beginPath(); ctx.moveTo(px(0), py(-8)); ctx.lineTo(px(2), py(0)); ctx.stroke();

        ctx.strokeStyle = '#fbbf24';
        ctx.beginPath(); ctx.moveTo(px(2), py(0)); ctx.lineTo(px(5), py(0)); ctx.stroke();

        ctx.strokeStyle = '#f97316';
        ctx.beginPath(); ctx.moveTo(px(5), py(0)); ctx.lineTo(px(11), py(12)); ctx.stroke();

        // 12 điểm đo từ bảng
        dataPts.forEach(([tau, temp]) => {
            ctx.fillStyle = tau < 2 ? '#38bdf8' : (tau <= 5 ? '#fbbf24' : '#f97316');
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.6;
            ctx.beginPath(); ctx.arc(px(tau), py(temp), 4.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        });

        // Điểm quét 1 chiều sawtooth trên bảng đo 0 -> 11 phút
        const saw = (t * 0.14) % 1;
        const curTau = saw * 11;
        let curTemp;
        if (curTau <= 2) curTemp = -8 + 4 * curTau;
        else if (curTau <= 5) curTemp = 0;
        else curTemp = 2 * (curTau - 5);

        ctx.fillStyle = '#22c55e';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.2;
        ctx.beginPath(); ctx.arc(px(curTau), py(curTemp), 6.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.restore();

        // Cột phải: Bình nung hở miệng công suất P = 200 W & đồng hồ đo sống động (Zero Data Leakage)
        ctx.save();
        roundBox(478, 12, 288, 280, 10, '#0f172a', '#38bdf8', 2);
        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('MẪU CHẤT & BỘ CẤP NHIỆT', 622, 36);

        const bx = 562, by = 66, bw = 112, bh = 86;
        // Thể chất trong bình theo nhiệt độ
        if (curTau <= 2) {
            roundBox(bx + 14, by + 26, bw - 28, 54, 6, 'rgba(56, 189, 248, 0.38)', '#7dd3fc', 1.8);
        } else if (curTau <= 5) {
            const melt = (curTau - 2) / 3;
            roundBox(bx + 6, by + 32, bw - 12, 48, 6, 'rgba(251, 191, 36, 0.25)', '#fbbf24', 1.5);
            const sw = Math.max(18, (bw - 28) * (1 - 0.7 * melt));
            roundBox(bx + (bw - sw) / 2, by + 40, sw, 36, 5, 'rgba(125, 211, 252, 0.55)', '#e0f2fe', 1.5);
        } else {
            roundBox(bx + 4, by + 28, bw - 8, 52, 6, 'rgba(249, 115, 22, 0.35)', '#fb923c', 1.8);
        }
        drawOpenBeaker(bx, by, bw, bh, '#cbd5e1', 3.2, 6);

        // Nhiệt kế nhúng vào mẫu
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(bx + bw - 22, by - 10, 6, 74);
        ctx.fillStyle = '#ef4444';
        ctx.beginPath(); ctx.arc(bx + bw - 19, by + 64, 5.5, 0, Math.PI * 2); ctx.fill();

        // Đế gia nhiệt P = 200 W (cân đối 2 biên chữ)
        roundBox(528, by + bh + 6, 188, 26, 6, 'rgba(249, 115, 22, 0.22)', '#fb923c', 1.8);
        ctx.fillStyle = '#fdba74';
        ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('P = 200 W (không đổi)', 622, by + bh + 19);

        // Thẻ đọc số liệu tức thời (Zero Data Leakage)
        roundBox(494, 194, 256, 84, 8, '#1e293b', '#475569', 1.6);
        ctx.textAlign = 'left';
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText(`• Thời điểm τ = ${curTau.toFixed(1).replace('.', ',')} phút`, 510, 214);
        ctx.fillStyle = curTau < 2 ? '#7dd3fc' : (curTau <= 5 ? '#fde68a' : '#fdba74');
        ctx.font = '800 15.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText(`• Nhiệt độ đo: t = ${curTemp.toFixed(1).replace('.', ',')} °C`, 510, 240);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('• Nguồn bảng số liệu (0 → 11 phút)', 510, 264);
        ctx.restore();
    });

    // =========================================================================
    // CÂU 32 (MH-STAGING-C1-32 · VLXT-DS-VD28-032): Đồ thị nhiệt độ theo thời gian của nước khi đun nóng đến sôi và để nguội (0 đến 20 phút)
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C1-32', function(ctx, w, h, t) {
        ctx.clearRect(0, 0, w, h);
        const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
        bgGrad.addColorStop(0, '#060b19');
        bgGrad.addColorStop(1, '#0a1226');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.save();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
        ctx.lineWidth = 1;
        for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
        for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
        ctx.restore();

        function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2.2) {
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(x, y, bw, bh, r);
            if (fill) { ctx.fillStyle = fill; ctx.fill(); }
            if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
            ctx.restore();
        }

        function drawOpenCup(x, y, cw, ch, col, lw = 3) {
            ctx.save();
            ctx.strokeStyle = col;
            ctx.lineWidth = lw;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + ch);
            ctx.lineTo(x + cw, y + ch);
            ctx.lineTo(x + cw, y);
            ctx.stroke();
            ctx.restore();
        }

        function arrowLine(x1, y1, x2, y2, col, lw = 2.6, hl = 8) {
            const ang = Math.atan2(y2 - y1, x2 - x1);
            ctx.save();
            ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
            ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
            ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
            ctx.closePath(); ctx.fill();
            ctx.restore();
        }

        // Hệ lưới 10 x 5 ô khớp 100% ảnh gốc 032.png
        const ox = 78, oy = 250;
        const cellX = 36, cellY = 36; // 10 ô ngang = 360px (20 phút -> 2 phút/ô); 5 ô dọc = 180px (100°C -> 20°C/ô)
        const gridW = 360, gridH = 180;

        ctx.save();
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.32)';
        ctx.lineWidth = 1.2;
        for (let c = 1; c <= 10; c++) {
            const gx = ox + c * cellX;
            ctx.beginPath(); ctx.moveTo(gx, oy - gridH); ctx.lineTo(gx, oy); ctx.stroke();
        }
        for (let r = 1; r <= 5; r++) {
            const gy = oy - r * cellY;
            ctx.beginPath(); ctx.moveTo(ox, gy); ctx.lineTo(ox + gridW, gy); ctx.stroke();
        }
        ctx.restore();

        arrowLine(ox, oy + 6, ox, 26, '#f1f5f9', 2.8, 8);
        arrowLine(ox - 6, oy, ox + gridW + 34, oy, '#f1f5f9', 2.8, 8);

        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 15.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText('Nhiệt độ (°C)', ox + 12, 34);

        ctx.textAlign = 'center';
        ctx.fillText('Thời gian (phút)', 390, oy + 40);

        ctx.font = '800 14.5px "DM Mono", monospace';
        ctx.fillStyle = '#e2e8f0';
        ctx.textAlign = 'right';
        [20, 40, 60, 80, 100].forEach((val, idx) => {
            ctx.fillText(String(val), ox - 10, oy - (idx + 1) * cellY);
        });
        ctx.fillText('0', ox - 8, oy + 18);

        ctx.textAlign = 'center';
        ctx.fillText('10', ox + 5 * cellX, oy + 20);
        ctx.fillText('20', ox + 10 * cellX, oy + 20);

        // Điểm A(0;0), B(10;100), C(14;100), D(20; ~26) khớp hình gốc 032.png
        const pA = { x: ox, y: oy };
        const pB = { x: ox + 5 * cellX, y: oy - 5 * cellY };
        const pC = { x: ox + 7 * cellX, y: oy - 5 * cellY };
        const pD = { x: ox + 10 * cellX, y: oy - 1.3 * cellY };

        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3.8;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(pA.x, pA.y); ctx.lineTo(pB.x, pB.y); ctx.lineTo(pC.x, pC.y); ctx.lineTo(pD.x, pD.y);
        ctx.stroke();

        [
            { p: pA, l: 'A', dx: -18, dy: -12 },
            { p: pB, l: 'B', dx: -8, dy: -16 },
            { p: pC, l: 'C', dx: 8, dy: -16 },
            { p: pD, l: 'D', dx: 16, dy: 0 }
        ].forEach(m => {
            ctx.fillStyle = '#fbbf24';
            ctx.font = '800 16px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(m.l, m.p.x + m.dx, m.p.y + m.dy);
        });

        // Điểm chạy động sawtooth dọc A -> B -> C -> D
        const saw = (t * 0.16) % 1;
        let dotX, dotY, phaseTitle, phaseCol;
        if (saw < 0.5) {
            const r = saw / 0.5;
            dotX = pA.x + (pB.x - pA.x) * r;
            dotY = pA.y + (pB.y - pA.y) * r;
            phaseTitle = 'Đoạn AB: Đun nóng nước';
            phaseCol = '#fbbf24';
        } else if (saw < 0.7) {
            const r = (saw - 0.5) / 0.2;
            dotX = pB.x + (pC.x - pB.x) * r;
            dotY = pB.y;
            phaseTitle = 'Đoạn BC: Nước đang sôi';
            phaseCol = '#f97316';
        } else {
            const r = (saw - 0.7) / 0.3;
            dotX = pC.x + (pD.x - pC.x) * r;
            dotY = pC.y + (pD.y - pC.y) * r;
            phaseTitle = 'Đoạn CD: Để nguội nước';
            phaseCol = '#38bdf8';
        }

        ctx.fillStyle = '#f97316'; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2.2;
        ctx.beginPath(); ctx.arc(dotX, dotY, 6.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

        // Cột phải: Minh họa cốc nước tương ứng pha hiện tại (Zero Data Leakage)
        roundBox(498, 12, 268, 280, 10, '#0f172a', '#38bdf8', 2);
        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 15.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('MINH HỌA QUÁ TRÌNH', 632, 38);

        const cupX = 576, cupY = 78, cupW = 112, cupH = 110;
        const warmFactor = (oy - dotY) / gridH;
        const wR = Math.round(30 + warmFactor * 210);
        const wG = Math.round(145 - warmFactor * 45);
        const wB = Math.round(235 - warmFactor * 185);
        ctx.fillStyle = `rgba(${wR}, ${wG}, ${wB}, 0.55)`;
        ctx.fillRect(cupX + 2, cupY + 26, cupW - 4, cupH - 27);
        drawOpenCup(cupX, cupY, cupW, cupH, '#e2e8f0', 3);

        // Đế nung chỉ sáng khi đang đun (AB và BC)
        const isHeating = saw < 0.7;
        roundBox(cupX + 8, cupY + cupH + 6, cupW - 16, 10, 4, isHeating ? '#f97316' : '#334155', isHeating ? '#fde047' : '#64748b', 1.8);

        roundBox(514, 224, 236, 48, 8, '#1e293b', phaseCol, 1.8);
        ctx.fillStyle = phaseCol;
        ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText(phaseTitle, 632, 248);
    });

    // =========================================================================
    // CÂU 33 (MH-STAGING-C1-33 · VLXT-DS-VD28-033): Thí nghiệm đo nhiệt nóng chảy riêng của nước đá với nguồn nhiệt 56 W và bảng số liệu cân trong 485 s
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C1-33', function(ctx, w, h, t) {
        ctx.clearRect(0, 0, w, h);
        const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
        bgGrad.addColorStop(0, '#060b19');
        bgGrad.addColorStop(1, '#0a1226');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.save();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
        ctx.lineWidth = 1;
        for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
        for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
        ctx.restore();

        function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2.2) {
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(x, y, bw, bh, r);
            if (fill) { ctx.fillStyle = fill; ctx.fill(); }
            if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
            ctx.restore();
        }

        function drawOpenCup(x, y, cw, ch, col, lw = 3) {
            ctx.save();
            ctx.strokeStyle = col;
            ctx.lineWidth = lw;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + ch);
            ctx.lineTo(x + cw, y + ch);
            ctx.lineTo(x + cw, y);
            ctx.stroke();
            ctx.restore();
        }

        function calloutTag(tx, ty, bx, by, label, col) {
            ctx.save();
            ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            const padX = 10, boxH = 28;
            const boxW = ctx.measureText(label).width + padX * 2;
            const safeBx = Math.min(w - 10 - boxW, Math.max(10, bx));
            const safeBy = Math.min(h - 10 - boxH, Math.max(10, by));
            const ax = (safeBx + boxW / 2 < tx) ? (safeBx + boxW) : safeBx;
            const ay = safeBy + boxH / 2;

            ctx.strokeStyle = col; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(ax, ay); ctx.stroke();
            ctx.fillStyle = col;
            ctx.beginPath(); ctx.arc(tx, ty, 3.6, 0, Math.PI * 2); ctx.fill();

            roundBox(safeBx, safeBy, boxW, boxH, 7, '#0f172a', col, 2);
            ctx.fillStyle = '#f8fafc';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(label, safeBx + boxW / 2, safeBy + boxH / 2);
            ctx.restore();
        }

        ctx.save();
        const title = 'THÍ NGHIỆM ĐO NHIỆT NÓNG CHẢY RIÊNG (56 W)';
        ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
        const titleW = ctx.measureText(title).width + 22;
        roundBox(14, 10, titleW, 28, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
        ctx.fillStyle = '#38bdf8';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(title, 25, 24);
        ctx.restore();

        const saw = (t * 0.14) % 1;
        const isOn = saw >= 0.42;
        const pRatio = isOn ? (saw - 0.42) / 0.58 : saw / 0.42;
        const massVal = isOn ? (124.6 + (215 - 124.6) * pRatio) : (116.5 + (124.6 - 116.5) * pRatio);

        // 1. Giá đỡ (khớp ảnh thật 033_p2.png: đế xanh lam + trụ đứng + kẹp phễu)
        const cx = 290, rodX = 398;
        roundBox(cx - 102, 274, 240, 14, 4, '#1d4ed8', '#60a5fa', 2);
        roundBox(rodX - 5, 58, 10, 216, 3, '#94a3b8', '#e2e8f0', 1.6);
        ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 4.5;
        ctx.beginPath(); ctx.moveTo(rodX, 146); ctx.lineTo(cx + 12, 146); ctx.stroke();
        roundBox(cx - 12, 138, 24, 14, 3, '#2563eb', '#93c5fd', 1.8);

        // 2. Phễu nước đá hở miệng trên
        ctx.fillStyle = 'rgba(148, 163, 184, 0.35)';
        ctx.beginPath();
        ctx.moveTo(cx - 56, 86); ctx.lineTo(cx + 56, 86);
        ctx.lineTo(cx + 10, 138); ctx.lineTo(cx - 10, 138);
        ctx.closePath(); ctx.fill();

        // Viên đá trong phễu
        [[cx - 32, 78], [cx - 4, 74], [cx + 22, 80], [cx - 18, 96], [cx + 8, 98]].forEach(([ix, iy]) => {
            roundBox(ix, iy, 16, 13, 3, 'rgba(226, 232, 240, 0.88)', '#7dd3fc', 1.5);
        });
        ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx - 58, 84); ctx.lineTo(cx - 10, 138); ctx.lineTo(cx - 8, 168);
        ctx.moveTo(cx + 58, 84); ctx.lineTo(cx + 10, 138); ctx.lineTo(cx + 8, 168);
        ctx.stroke();

        // 3. Nguồn nhiệt cắm từ trên vào phễu
        roundBox(cx - 7, 50, 14, 14, 3, '#2563eb', '#93c5fd', 1.6);
        roundBox(cx - 4, 64, 8, 86, 3, isOn ? '#f97316' : '#475569', isOn ? '#fde047' : '#94a3b8', 1.8);
        ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(cx, 50); ctx.quadraticCurveTo(cx + 60, 42, rodX + 12, 120); ctx.stroke();

        // Giọt nước rơi vào cốc
        const dropP = (t * (isOn ? 1.8 : 0.7)) % 1;
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath(); ctx.arc(cx, 170 + dropP * 26, 3, 0, Math.PI * 2); ctx.fill();

        // 4. Cốc nước (hở miệng trên) đặt trên cân điện tử
        const cupX = cx - 34, cupY = 186, cupW = 68, cupH = 48;
        const wH = 14 + ((massVal - 116.5) / (215 - 116.5)) * 24;
        ctx.fillStyle = 'rgba(56, 189, 248, 0.42)';
        ctx.fillRect(cupX + 2, cupY + cupH - wH, cupW - 4, wH - 1);
        drawOpenCup(cupX, cupY, cupW, cupH, '#e2e8f0', 2.8);

        // Cân điện tử
        roundBox(cx - 56, 236, 112, 6, 2, '#94a3b8', '#e2e8f0', 1.5);
        roundBox(cx - 64, 242, 128, 32, 5, '#1e293b', '#64748b', 2.2);
        roundBox(cx - 48, 247, 96, 22, 4, '#09111f', '#38bdf8', 1.5);
        ctx.fillStyle = '#34d399';
        ctx.font = '800 14.5px "DM Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(massVal.toFixed(1).replace('.', ',') + ' g', cx, 258);

        calloutTag(cx - 6, 62, 14, 52, 'Nguồn nhiệt 56 W', '#f97316');
        calloutTag(cx - 42, 108, 14, 110, 'Phễu nước đá', '#7dd3fc');
        calloutTag(cupX, 208, 14, 174, 'Cốc nước', '#38bdf8');
        calloutTag(cx - 64, 258, 14, 240, 'Cân điện tử', '#10b981');

        // Card phải bảng số liệu đề bài (Zero Data Leakage)
        roundBox(460, 12, 306, 280, 10, '#0f172a', '#38bdf8', 2);
        ctx.textAlign = 'left';
        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 15.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('KẾT QUẢ THÍ NGHIỆM', 478, 38);

        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('• Nguồn nhiệt: P = 56 W', 478, 70);
        ctx.fillText('• Thời gian mỗi bước: t = 485 s', 478, 98);

        ctx.fillStyle = '#7dd3fc';
        ctx.fillText('• Tắt nguồn nhiệt:', 478, 134);
        ctx.fillStyle = '#e2e8f0';
        ctx.fillText('   116,5 g  →  124,6 g', 478, 160);

        ctx.fillStyle = '#fbbf24';
        ctx.fillText('• Bật nguồn nhiệt:', 478, 194);
        ctx.fillStyle = '#e2e8f0';
        ctx.fillText('   124,6 g  →  215 g', 478, 220);

        roundBox(478, 244, 270, 34, 7, '#1e293b', isOn ? '#f97316' : '#38bdf8', 1.8);
        ctx.fillStyle = isOn ? '#fdba74' : '#7dd3fc';
        ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(isOn ? 'Chế độ: Bật nguồn 56 W' : 'Chế độ: Tắt nguồn nhiệt', 613, 261);
    });

    // =========================================================================
    // CÂU 34 (MH-STAGING-C2-01 · VLXT-DS-VD28-034): Thí nghiệm đo áp suất khí quyển bằng ống thủy tinh có nút kín N và khóa đáy k
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C2-01', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
            bgGrad.addColorStop(0, '#060b19');
            bgGrad.addColorStop(1, '#0a1226');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
            for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2.2) {
                ctx.save();
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(x, y, bw, bh, r);
                else ctx.rect(x, y, bw, bh);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function arrowLine(x1, y1, x2, y2, col, lw = 2.6, hl = 8) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }

            function drawSub(base, sub, x, y, opts = {}) {
                const fs = Math.max(15.5, opts.fontSize || 16);
                const ss = Math.max(12.5, Math.round(fs * 0.78));
                const wt = opts.weight || '800';
                const col = opts.color || '#f8fafc';
                const align = opts.align || 'left';
                ctx.save();
                ctx.fillStyle = col;
                ctx.textAlign = 'left';
                ctx.textBaseline = 'alphabetic';
                ctx.font = `${wt} ${fs}px "Plus Jakarta Sans", system-ui, sans-serif`;
                const bw = ctx.measureText(base).width;
                ctx.font = `${wt} ${ss}px "Plus Jakarta Sans", system-ui, sans-serif`;
                const sw = sub ? ctx.measureText(sub).width : 0;
                const tw = bw + sw;
                let sx = x;
                if (align === 'center') sx = x - tw / 2;
                else if (align === 'right') sx = x - tw;
                ctx.font = `${wt} ${fs}px "Plus Jakarta Sans", system-ui, sans-serif`;
                ctx.fillText(base, sx, y);
                if (sub) {
                    ctx.font = `${wt} ${ss}px "Plus Jakarta Sans", system-ui, sans-serif`;
                    ctx.fillText(sub, sx + bw + 1, y + Math.round(fs * 0.24));
                }
                ctx.restore();
                return tw;
            }

            function drawInlineSub(prefix, base, sub, suffix, x, y, prefixCol, subCol) {
                ctx.save();
                ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
                ctx.fillStyle = prefixCol;
                ctx.textAlign = 'left';
                ctx.textBaseline = 'alphabetic';
                ctx.fillText(prefix, x, y);
                const pw = ctx.measureText(prefix).width;
                const tw = drawSub(base, sub, x + pw, y, { fontSize: 15.5, color: subCol });
                if (suffix) {
                    ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
                    ctx.fillStyle = prefixCol;
                    ctx.fillText(suffix, x + pw + tw + 4, y);
                }
                ctx.restore();
            }

            // Hộp tiêu đề góc trên trái
            ctx.save();
            const title = 'ĐO ÁP SUẤT KHÍ QUYỂN BẰNG ỐNG THỦY TINH (T = const)';
            ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            const titleW = ctx.measureText(title).width + 24;
            roundBox(16, 12, titleW, 28, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, 28, 26);
            ctx.restore();

            // Chu kỳ 1 chiều sawtooth: 0..0.72 nước chảy ra dần từ L1 -> L2; 0.72..1.0 cân bằng ngừng chảy
            const saw = (t * 0.16) % 1;
            const flowP = Math.min(1, saw / 0.72);
            const stopped = saw >= 0.72;

            const topY = 82;
            const botY = 248;
            const tubeW = 52;
            const l1Top = topY + 36; // L1
            const l2Top = topY + 102; // L2

            function drawTubeUnit(cx, waterTopY, isOpenTap, stageLabel) {
                const tx = cx - tubeW / 2;
                const wallW = 3.2;

                ctx.save();
                // Nước bên trong sát thành ống
                const wGrad = ctx.createLinearGradient(0, waterTopY, 0, botY);
                wGrad.addColorStop(0, 'rgba(56, 189, 248, 0.48)');
                wGrad.addColorStop(1, 'rgba(14, 116, 144, 0.72)');
                ctx.fillStyle = wGrad;
                ctx.fillRect(tx + wallW * 0.4, waterTopY, tubeW - wallW * 0.8, botY - waterTopY - wallW * 0.4);

                // Mặt thoáng nước
                ctx.strokeStyle = '#7dd3fc';
                ctx.lineWidth = 2.2;
                ctx.beginPath();
                ctx.moveTo(tx + wallW * 0.4, waterTopY);
                ctx.lineTo(tx + tubeW - wallW * 0.4, waterTopY);
                ctx.stroke();

                // Khí bị giữ phía trên nước
                ctx.fillStyle = 'rgba(251, 191, 36, 0.12)';
                ctx.fillRect(tx + wallW * 0.4, topY + 6, tubeW - wallW * 0.8, waterTopY - (topY + 6));

                // Các phân tử khí chuyển động
                const airH = waterTopY - (topY + 14);
                ctx.fillStyle = '#fbbf24';
                for (let i = 0; i < 6; i++) {
                    const px = tx + 10 + ((i * 19 + Math.sin(t * 3 + i) * 6) % (tubeW - 20));
                    const py = topY + 14 + ((i * 23 + Math.cos(t * 3.4 + i) * 5) % Math.max(10, airH - 6));
                    ctx.beginPath();
                    ctx.arc(px, py, 2.5, 0, Math.PI * 2);
                    ctx.fill();
                }

                // Thành ống thủy tinh kín hai bên và đáy, nhánh vòi nhỏ ở đáy phải
                ctx.strokeStyle = '#cbd5e1';
                ctx.lineWidth = wallW;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.beginPath();
                ctx.moveTo(tx, topY);
                ctx.lineTo(tx, botY);
                ctx.lineTo(tx + tubeW, botY);
                ctx.moveTo(tx + tubeW, topY);
                ctx.lineTo(tx + tubeW, botY - 12);
                ctx.lineTo(tx + tubeW + 18, botY - 12);
                ctx.lineTo(tx + tubeW + 18, botY - 2);
                ctx.moveTo(tx + tubeW, botY);
                ctx.lineTo(tx + tubeW + 12, botY);
                ctx.lineTo(tx + tubeW + 12, botY - 2);
                ctx.stroke();

                // Nút cao su N bịt kín đỉnh ống
                roundBox(tx + 2, topY - 8, tubeW - 4, 15, 3, '#f97316', '#fed7aa', 2);

                // Nhãn N trên nút cao su
                roundBox(cx - 14, topY - 34, 28, 22, 5, '#0f172a', '#f97316', 1.8);
                ctx.fillStyle = '#fed7aa';
                ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('N', cx, topY - 23);

                // Khóa k tại vòi đáy
                const vx = tx + tubeW + 8;
                const vy = botY - 6;
                ctx.strokeStyle = isOpenTap ? '#10b981' : '#ef4444';
                ctx.lineWidth = 3.6;
                ctx.beginPath();
                if (isOpenTap) {
                    ctx.moveTo(vx - 6, vy - 10);
                    ctx.lineTo(vx + 6, vy - 10);
                } else {
                    ctx.moveTo(vx, vy - 13);
                    ctx.lineTo(vx, vy + 3);
                }
                ctx.stroke();

                ctx.fillStyle = isOpenTap ? '#6ee7b7' : '#fca5a5';
                ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
                ctx.textAlign = 'left';
                ctx.fillText('k', tx + tubeW + 22, botY - 10);

                // Nhãn giai đoạn đặt gọn dưới đáy ống (tránh xa tia nước vòi phải)
                ctx.fillStyle = '#e2e8f0';
                ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(stageLabel, cx, 276);
                ctx.restore();
            }

            // Ống 1 (Trái): Đổ nước tới L1, nút kín N, khóa k đóng
            drawTubeUnit(140, l1Top, false, 'Bước 1');

            // Thước đo L0 bên trái ống 1 & L1 bên phải ống 1 (tách xa khóa k)
            ctx.save();
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.moveTo(74, topY); ctx.lineTo(104, topY);
            ctx.moveTo(74, botY); ctx.lineTo(104, botY);
            ctx.stroke();
            arrowLine(84, (topY + botY) / 2 - 14, 84, topY + 2, '#94a3b8', 2, 6);
            arrowLine(84, (topY + botY) / 2 + 14, 84, botY - 2, '#94a3b8', 2, 6);
            drawSub('L', '0', 64, (topY + botY) / 2 + 5, { fontSize: 16, color: '#e2e8f0', align: 'center' });

            ctx.strokeStyle = '#38bdf8';
            ctx.beginPath();
            ctx.moveTo(192, l1Top); ctx.lineTo(220, l1Top);
            ctx.moveTo(202, botY); ctx.lineTo(220, botY);
            ctx.stroke();
            arrowLine(210, (l1Top + botY) / 2 - 14, 210, l1Top + 2, '#38bdf8', 2, 6);
            arrowLine(210, (l1Top + botY) / 2 + 14, 210, botY - 2, '#38bdf8', 2, 6);
            drawSub('L', '1', 230, (l1Top + botY) / 2 + 5, { fontSize: 16, color: '#7dd3fc', align: 'center' });
            ctx.restore();

            // Mũi tên chuyển trạng thái giữa 2 ống
            arrowLine(246, 160, 282, 160, '#fbbf24', 3.2, 9);

            // Ống 2 (Giữa): Mở khóa k, mực nước hạ 1 chiều từ L1 -> L2 rồi dừng chảy
            const curWaterTop = l1Top + flowP * (l2Top - l1Top);
            drawTubeUnit(360, curWaterTop, true, 'Bước 2');

            // Tia nước chảy ra khi saw < 0.72 và cốc hứng nước hở miệng bên dưới vòi (x = 401)
            const spoutX = 360 + tubeW / 2 + 15;
            if (!stopped) {
                ctx.save();
                ctx.strokeStyle = '#38bdf8';
                ctx.lineWidth = 3;
                ctx.setLineDash([5, 4]);
                ctx.beginPath();
                ctx.moveTo(spoutX, botY - 2);
                ctx.lineTo(spoutX, 276);
                ctx.stroke();
                ctx.setLineDash([]);
                ctx.restore();
            }
            // Cốc hứng nước hở miệng trên (Open-Top U-shape) nằm hẳn bên phải chữ "Bước 2"
            ctx.save();
            const cupX = spoutX - 14, cupY = 264, cupW = 30, cupH = 22;
            ctx.fillStyle = 'rgba(56, 189, 248, 0.38)';
            ctx.fillRect(cupX + 2, cupY + 8, cupW - 4, cupH - 10);
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 2.4;
            ctx.beginPath();
            ctx.moveTo(cupX, cupY); ctx.lineTo(cupX, cupY + cupH);
            ctx.lineTo(cupX + cupW, cupY + cupH); ctx.lineTo(cupX + cupW, cupY);
            ctx.stroke();
            ctx.restore();

            // Thước đo L2 bên trái ống 2
            ctx.save();
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.moveTo(304, l2Top); ctx.lineTo(332, l2Top);
            ctx.moveTo(304, botY); ctx.lineTo(332, botY);
            ctx.stroke();
            arrowLine(314, (l2Top + botY) / 2 - 12, 314, l2Top + 2, '#10b981', 2, 6);
            arrowLine(314, (l2Top + botY) / 2 + 12, 314, botY - 2, '#10b981', 2, 6);
            drawSub('L', '2', 294, (l2Top + botY) / 2 + 5, { fontSize: 16, color: '#6ee7b7', align: 'center' });
            ctx.restore();

            // Thẻ thông số đề dẫn bên phải (Zero Data Leakage, đo khít chữ bằng measureText)
            roundBox(468, 56, 294, 224, 10, '#0f172a', '#38bdf8', 2);
            ctx.save();
            ctx.fillStyle = '#38bdf8';
            ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText('THÔNG SỐ THÍ NGHIỆM', 486, 82);

            drawInlineSub('• Chiều dài ống trụ: ', 'L', '0', '', 486, 118, '#f8fafc', '#f8fafc');
            drawInlineSub('• Đổ nước mức đầu: ', 'L', '1', '', 486, 148, '#f8fafc', '#7dd3fc');
            drawInlineSub('• Ngừng chảy còn mức: ', 'L', '2', '', 486, 178, '#f8fafc', '#6ee7b7');
            drawInlineSub('• Biết D, g và ', 'p', '0', ' khí quyển', 486, 208, '#f8fafc', '#fbbf24');

            ctx.fillStyle = '#94a3b8';
            ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillText('• Giữ nhiệt độ không đổi', 486, 236);
            ctx.fillStyle = stopped ? '#6ee7b7' : '#fbbf24';
            ctx.fillText(stopped ? '• Trạng thái: Đã ngừng chảy' : '• Trạng thái: Nước đang chảy', 486, 262);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 35 (MH-STAGING-C2-02 · VLXT-DS-VD28-035): Thí nghiệm kiểm chứng định luật Charles với giọt acid sulfuric trong ống thủy tinh
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C2-02', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
            bgGrad.addColorStop(0, '#060b19');
            bgGrad.addColorStop(1, '#0a1226');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
            for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2.2) {
                ctx.save();
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(x, y, bw, bh, r);
                else ctx.rect(x, y, bw, bh);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function drawOpenCup(x, y, cw, ch, wallColor, wallW) {
                ctx.save();
                ctx.strokeStyle = wallColor;
                ctx.lineWidth = wallW;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.beginPath();
                ctx.moveTo(x - 5, y);
                ctx.lineTo(x, y + 6);
                ctx.lineTo(x, y + ch);
                ctx.lineTo(x + cw, y + ch);
                ctx.lineTo(x + cw, y + 6);
                ctx.lineTo(x + cw + 5, y);
                ctx.stroke();
                ctx.restore();
            }

            function calloutTag(tx, ty, bx, by, label, col) {
                ctx.save();
                ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
                const tw = ctx.measureText(label).width;
                const boxW = tw + 22, boxH = 28;
                const ax = (bx + boxW / 2 < tx) ? (bx + boxW) : bx;
                const ay = by + boxH / 2;
                ctx.strokeStyle = col;
                ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(ax, ay); ctx.stroke();
                ctx.fillStyle = col;
                ctx.beginPath(); ctx.arc(tx, ty, 3.8, 0, Math.PI * 2); ctx.fill();
                roundBox(bx, by, boxW, boxH, 7, '#0f172a', col, 1.8);
                ctx.fillStyle = '#f8fafc';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(label, bx + boxW / 2, by + boxH / 2);
                ctx.restore();
            }

            // Tiêu đề
            ctx.save();
            const title = 'THÍ NGHIỆM KIỂM CHỨNG ĐỊNH LUẬT CHARLES (P = const)';
            ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            const titleW = ctx.measureText(title).width + 24;
            roundBox(16, 12, titleW, 28, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, 28, 26);
            ctx.restore();

            // Biến thiên 1 chiều sawtooth: nhiệt độ tăng 25 -> 65°C, giọt acid sulfuric dâng lên
            const saw = (t * 0.16) % 1;

            // Giá đỡ & thanh kẹp
            ctx.save();
            roundBox(142, 276, 86, 12, 3, '#334155', '#94a3b8', 2);
            ctx.fillStyle = '#94a3b8';
            ctx.fillRect(160, 56, 8, 220);
            roundBox(154, 72, 134, 8, 3, '#475569', '#cbd5e1', 1.6);
            roundBox(154, 100, 222, 8, 3, '#475569', '#cbd5e1', 1.6);

            // Kiềng 3 chân & Đèn cồn bên dưới cốc nước
            const cupX = 228, cupY = 118, cupW = 166, cupH = 122, wallW = 3.2;
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(cupX - 10, cupY + cupH + 2); ctx.lineTo(cupX + cupW + 10, cupY + cupH + 2);
            ctx.moveTo(cupX + 8, cupY + cupH + 2); ctx.lineTo(cupX - 4, 290);
            ctx.moveTo(cupX + cupW - 8, cupY + cupH + 2); ctx.lineTo(cupX + cupW + 4, 290);
            ctx.stroke();

            // Đèn cồn có cổ chụp & ngọn lửa 2 lớp rõ nét
            roundBox(290, 272, 44, 18, 5, '#1e293b', '#cbd5e1', 2);
            roundBox(304, 265, 16, 8, 2, '#cbd5e1', '#94a3b8', 1.5);
            const sway = Math.sin(t * 11) * 1.6;
            const fh = 20 + Math.sin(t * 14) * 2.5;
            ctx.fillStyle = '#f97316';
            ctx.beginPath();
            ctx.moveTo(306, 265);
            ctx.quadraticCurveTo(304, 254, 312 + sway, 265 - fh);
            ctx.quadraticCurveTo(320, 254, 318, 265);
            ctx.closePath(); ctx.fill();
            ctx.fillStyle = '#fde047';
            ctx.beginPath();
            ctx.moveTo(309, 265);
            ctx.quadraticCurveTo(308, 258, 312 + sway * 0.5, 265 - fh * 0.62);
            ctx.quadraticCurveTo(316, 258, 315, 265);
            ctx.closePath(); ctx.fill();

            // Nước trong cốc tràn sát 2 thành bên
            const waterTop = cupY + 22;
            const wGrad = ctx.createLinearGradient(0, waterTop, 0, cupY + cupH);
            wGrad.addColorStop(0, `rgba(56, 189, 248, ${(0.28 + saw * 0.14).toFixed(2)})`);
            wGrad.addColorStop(1, `rgba(249, 115, 22, ${(0.12 + saw * 0.22).toFixed(2)})`);
            ctx.fillStyle = wGrad;
            ctx.fillRect(cupX + wallW * 0.4, waterTop, cupW - wallW * 0.8, cupH - 22 - wallW * 0.4);
            ctx.strokeStyle = '#7dd3fc';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(cupX + wallW * 0.4, waterTop);
            ctx.lineTo(cupX + cupW - wallW * 0.4, waterTop);
            ctx.stroke();

            // Cốc hở miệng trên
            drawOpenCup(cupX, cupY, cupW, cupH, '#cbd5e1', wallW);

            // Nhiệt kế trong nước (cột đỏ tăng 1 chiều sawtooth)
            const tx = 264, tyTop = 58, tyBot = 206;
            roundBox(tx - 6, tyTop, 12, tyBot - tyTop, 5, '#0f172a', '#cbd5e1', 2.2);
            ctx.fillStyle = '#ef4444';
            ctx.beginPath(); ctx.arc(tx, tyBot + 6, 7.5, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 2; ctx.stroke();
            const colRatio = 0.26 + saw * 0.58;
            const colY = tyBot - (tyBot - tyTop - 12) * colRatio;
            ctx.fillRect(tx - 3, colY, 6, tyBot - colY + 2);

            // Thước đo chiều cao cột khí
            const rx = 304, ryTop = 60, ryBot = 226;
            roundBox(rx, ryTop, 22, ryBot - ryTop, 3, 'rgba(30, 41, 59, 0.72)', '#94a3b8', 1.8);
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 1.4;
            for (let yy = ryTop + 10; yy < ryBot - 6; yy += 8) {
                const major = ((yy - ryTop - 10) % 24 === 0);
                ctx.beginPath();
                ctx.moveTo(rx + 22, yy);
                ctx.lineTo(rx + 22 - (major ? 10 : 5), yy);
                ctx.stroke();
            }

            // Ống thủy tinh đầu dưới bịt kín, đầu trên hở
            const gx = 344, gw = 16, gyTop = 76, gyBot = 224;
            const plugY = 174 - saw * 28; // Giọt acid sulfuric đi lên đều
            ctx.fillStyle = 'rgba(125, 211, 252, 0.34)';
            ctx.fillRect(gx + 2, plugY + 12, gw - 4, gyBot - (plugY + 12) - 2);
            ctx.fillStyle = '#fbbf24';
            for (let i = 0; i < 6; i++) {
                const mx = gx + 5 + ((i * 5) % 7);
                const my = plugY + 18 + ((i * 11 + Math.sin(t * 4 + i) * 3) % Math.max(8, gyBot - plugY - 24));
                ctx.beginPath(); ctx.arc(mx, my, 2, 0, Math.PI * 2); ctx.fill();
            }
            ctx.fillStyle = '#0f172a';
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 1.8;
            ctx.fillRect(gx + 2, plugY, gw - 4, 12);
            ctx.strokeRect(gx + 2, plugY, gw - 4, 12);
            ctx.strokeStyle = '#f8fafc';
            ctx.lineWidth = 2.6;
            ctx.beginPath();
            ctx.moveTo(gx, gyTop);
            ctx.lineTo(gx, gyBot);
            ctx.lineTo(gx + gw, gyBot);
            ctx.lineTo(gx + gw, gyTop);
            ctx.stroke();
            ctx.restore();

            // Nhãn callout rõ nét, hoàn toàn không đè nét (Zero Data Leakage)
            calloutTag(258, 86, 20, 74, 'Nhiệt kế', '#ef4444');
            calloutTag(228, 194, 20, 180, 'Nước đun nóng', '#38bdf8');
            calloutTag(326, 86, 456, 62, 'Thước đo chiều cao cột khí', '#94a3b8');
            calloutTag(360, 118, 456, 118, 'Ống thuỷ tinh (trên hở, dưới kín)', '#e2e8f0');
            calloutTag(360, plugY + 6, 456, 174, 'Giọt acid sulfuric ngăn khí', '#fbbf24');
            calloutTag(360, 210, 456, 232, 'Cột không khí (áp suất p = const)', '#38bdf8');
        });

    // =========================================================================
    // CÂU 36 (MH-STAGING-C2-03 · VLXT-DS-VD28-036): Hơ nóng chậm khí lí tưởng trong xilanh nằm ngang có pít-tông chuyển động tự do sang phải
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C2-03', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
            bgGrad.addColorStop(0, '#060b19');
            bgGrad.addColorStop(1, '#0a1226');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
            for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2.2) {
                ctx.save();
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(x, y, bw, bh, r);
                else ctx.rect(x, y, bw, bh);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function arrowLine(x1, y1, x2, y2, col, lw = 2.8, hl = 9) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }

            function calloutTag(tx, ty, bx, by, label, col) {
                ctx.save();
                ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
                const tw = ctx.measureText(label).width;
                const boxW = tw + 22, boxH = 28;
                const ax = (bx + boxW / 2 < tx) ? (bx + boxW) : bx;
                const ay = by + boxH / 2;
                ctx.strokeStyle = col; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(ax, ay); ctx.stroke();
                ctx.fillStyle = col;
                ctx.beginPath(); ctx.arc(tx, ty, 3.8, 0, Math.PI * 2); ctx.fill();
                roundBox(bx, by, boxW, boxH, 7, '#0f172a', col, 1.8);
                ctx.fillStyle = '#f8fafc';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(label, bx + boxW / 2, by + boxH / 2);
                ctx.restore();
            }

            // Tiêu đề
            ctx.save();
            const title = 'HƠ NÓNG CHẬM KHÍ LÍ TƯỞNG TRONG XILANH NẰM NGANG';
            ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            const titleW = ctx.measureText(title).width + 24;
            roundBox(16, 12, titleW, 28, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, 28, 26);
            ctx.restore();

            // Pít-tông chuyển động từ từ 1 chiều sang phải (sawtooth)
            const saw = (t * 0.16) % 1;
            const cylX = 166, cylY = 90, cylW = 292, cylH = 100;
            const pisX = 286 + saw * 108;

            ctx.save();
            // Khối khí bên trong xilanh
            const gGrad = ctx.createLinearGradient(cylX, cylY, pisX, cylY);
            gGrad.addColorStop(0, `rgba(249, 115, 22, ${(0.22 + saw * 0.22).toFixed(2)})`);
            gGrad.addColorStop(1, `rgba(56, 189, 248, ${(0.24 + saw * 0.12).toFixed(2)})`);
            ctx.fillStyle = gGrad;
            ctx.fillRect(cylX + 3, cylY + 3, pisX - cylX - 3, cylH - 6);

            // 16 phân tử khí chuyển động nhiệt nhanh dần
            const spd = 1 + saw * 1.4;
            ctx.fillStyle = '#7dd3fc';
            for (let i = 0; i < 16; i++) {
                const baseX = cylX + 14 + ((i * 41) % Math.max(40, Math.round(pisX - cylX - 28)));
                const baseY = cylY + 14 + ((i * 29) % (cylH - 28));
                const px = Math.max(cylX + 8, Math.min(pisX - 6, baseX + Math.sin(t * 3.5 * spd + i) * 7));
                const py = Math.max(cylY + 8, Math.min(cylY + cylH - 8, baseY + Math.cos(t * 4.2 * spd + i * 1.3) * 6));
                ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI * 2); ctx.fill();
            }

            // Thành xilanh kín bên trái, hở bên phải
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 3.5;
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(cylX + cylW, cylY);
            ctx.lineTo(cylX, cylY);
            ctx.lineTo(cylX, cylY + cylH);
            ctx.lineTo(cylX + cylW, cylY + cylH);
            ctx.stroke();

            // Pít-tông động & cần pít-tông
            roundBox(pisX, cylY + 3, 18, cylH - 6, 3, '#94a3b8', '#f8fafc', 2.2);
            roundBox(pisX + 18, cylY + cylH / 2 - 6, 128, 12, 3, '#64748b', '#e2e8f0', 2);

            // Mũi tên & nhãn chỉ chiều chuyển động sang phải (hoàn toàn thoáng không vướng nét nào)
            arrowLine(pisX + 34, cylY + 18, pisX + 108, cylY + 18, '#10b981', 3.4, 10);
            ctx.fillStyle = '#6ee7b7';
            ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Chuyển động sang phải', pisX + 74, cylY - 16);

            // Ngọn nến hơ nóng bên dưới xilanh
            const cx = 274, cyCandle = 240;
            roundBox(cx - 14, cyCandle, 28, 48, 4, '#e2e8f0', '#94a3b8', 2);
            ctx.strokeStyle = '#475569'; ctx.lineWidth = 2.4;
            ctx.beginPath(); ctx.moveTo(cx, cyCandle); ctx.lineTo(cx, cyCandle - 7); ctx.stroke();
            const sway = Math.sin(t * 10) * 2;
            const fh = 24 + Math.sin(t * 14) * 2.5;
            ctx.fillStyle = '#f97316';
            ctx.beginPath();
            ctx.moveTo(cx - 8, cyCandle - 7);
            ctx.quadraticCurveTo(cx - 11, cyCandle - 21, cx + sway, cyCandle - 7 - fh);
            ctx.quadraticCurveTo(cx + 11, cyCandle - 21, cx + 8, cyCandle - 7);
            ctx.closePath(); ctx.fill();
            ctx.fillStyle = '#fde047';
            ctx.beginPath();
            ctx.moveTo(cx - 4, cyCandle - 7);
            ctx.quadraticCurveTo(cx - 5, cyCandle - 16, cx + sway * 0.5, cyCandle - 7 - fh * 0.6);
            ctx.quadraticCurveTo(cx + 5, cyCandle - 16, cx + 4, cyCandle - 7);
            ctx.closePath(); ctx.fill();

            arrowLine(cx - 16, 208, cx - 12, 193, '#fb923c', 2.4, 6);
            arrowLine(cx + 16, 208, cx + 12, 193, '#fb923c', 2.4, 6);
            ctx.restore();

            // Nhãn callout rõ nét (Zero Overlap & Zero Data Leakage)
            calloutTag(166, 98, 18, 62, 'Xilanh nằm ngang', '#cbd5e1');
            calloutTag(204, 146, 18, 134, 'Khí lí tưởng', '#38bdf8');
            calloutTag(pisX + 9, 166, 540, 178, 'Pít-tông động', '#fbbf24');
            calloutTag(cx + 14, 258, 540, 242, 'Ngọn lửa hơ nóng chậm', '#f97316');
        });

    // =========================================================================
    // CÂU 37 (MH-STAGING-C2-04 · VLXT-DS-VD28-037): Chu trình 1–2–3–4–1 của khí Helium trên đồ thị (P, V) với P₀ = 10⁵ Pa, V₀ = 2 lít
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C2-04', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
            bgGrad.addColorStop(0, '#060b19');
            bgGrad.addColorStop(1, '#0a1226');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
            for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2.2) {
                ctx.save();
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(x, y, bw, bh, r);
                else ctx.rect(x, y, bw, bh);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function arrowLine(x1, y1, x2, y2, col, lw = 2.8, hl = 9) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }

            function drawSub(base, sub, x, y, opts = {}) {
                const fs = Math.max(15.5, opts.fontSize || 16);
                const ss = Math.max(12.5, Math.round(fs * 0.78));
                const wt = opts.weight || '800';
                const col = opts.color || '#f8fafc';
                const align = opts.align || 'left';
                ctx.save();
                ctx.fillStyle = col;
                ctx.textAlign = 'left';
                ctx.textBaseline = 'alphabetic';
                ctx.font = `${wt} ${fs}px "Plus Jakarta Sans", system-ui, sans-serif`;
                const bw = ctx.measureText(base).width;
                ctx.font = `${wt} ${ss}px "Plus Jakarta Sans", system-ui, sans-serif`;
                const sw = sub ? ctx.measureText(sub).width : 0;
                const tw = bw + sw;
                let sx = x;
                if (align === 'center') sx = x - tw / 2;
                else if (align === 'right') sx = x - tw;
                ctx.font = `${wt} ${fs}px "Plus Jakarta Sans", system-ui, sans-serif`;
                ctx.fillText(base, sx, y);
                if (sub) {
                    ctx.font = `${wt} ${ss}px "Plus Jakarta Sans", system-ui, sans-serif`;
                    ctx.fillText(sub, sx + bw + 1, y + Math.round(fs * 0.24));
                }
                ctx.restore();
            }

            // Tiêu đề
            ctx.save();
            const title = 'CHU TRÌNH KHÍ HELIUM 1–2–3–4–1 TRÊN ĐỒ THỊ (P, V)';
            ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            const titleW = ctx.measureText(title).width + 24;
            roundBox(16, 12, titleW, 28, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, 28, 26);
            ctx.restore();

            // Hệ trục P-V khớp hoàn toàn hình gốc
            const ox = 98, oy = 252;
            const xV1 = 192, xV2 = 328;
            const yP1 = 196, yP2 = 104;

            ctx.save();
            arrowLine(ox, oy + 6, ox, 54, '#f1f5f9', 2.8, 9);
            arrowLine(ox - 6, oy, 398, oy, '#f1f5f9', 2.8, 9);

            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 16.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            ctx.fillText('P', ox - 12, 62);
            ctx.textAlign = 'center';
            ctx.fillText('V', 392, oy + 24);
            ctx.fillText('O', ox - 14, oy + 20);

            drawSub('V', '0', xV1, oy + 24, { fontSize: 16, color: '#e2e8f0', align: 'center' });
            drawSub('2V', '0', xV2, oy + 24, { fontSize: 16, color: '#e2e8f0', align: 'center' });
            drawSub('P', '0', ox - 12, yP1 + 5, { fontSize: 16, color: '#e2e8f0', align: 'right' });
            drawSub('2P', '0', ox - 12, yP2 + 5, { fontSize: 16, color: '#e2e8f0', align: 'right' });

            // Đường gióng nét đứt
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 1.6;
            ctx.setLineDash([5, 4]);
            ctx.beginPath();
            ctx.moveTo(ox, yP2); ctx.lineTo(xV1, yP2);
            ctx.moveTo(ox, yP1); ctx.lineTo(xV1, yP1);
            ctx.moveTo(xV1, yP1); ctx.lineTo(xV1, oy);
            ctx.moveTo(xV2, yP1); ctx.lineTo(xV2, oy);
            ctx.stroke();
            ctx.setLineDash([]);

            // Vùng diện tích chu trình
            ctx.fillStyle = 'rgba(56, 189, 248, 0.14)';
            ctx.fillRect(xV1, yP2, xV2 - xV1, yP1 - yP2);

            // 4 cạnh chu trình theo chiều kim đồng hồ 1 -> 2 -> 3 -> 4 -> 1
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 3.6;
            ctx.strokeRect(xV1, yP2, xV2 - xV1, yP1 - yP2);

            arrowLine(xV1 + 30, yP2, (xV1 + xV2) / 2 + 10, yP2, '#38bdf8', 3.2, 9);
            arrowLine(xV2, yP2 + 22, xV2, (yP2 + yP1) / 2 + 10, '#38bdf8', 3.2, 9);
            arrowLine(xV2 - 30, yP1, (xV1 + xV2) / 2 - 10, yP1, '#38bdf8', 3.2, 9);
            arrowLine(xV1, yP1 - 22, xV1, (yP2 + yP1) / 2 - 10, '#38bdf8', 3.2, 9);

            const pts = [
                { x: xV1, y: yP2, lbl: '1', lx: xV1 - 16, ly: yP2 - 16 },
                { x: xV2, y: yP2, lbl: '2', lx: xV2 + 16, ly: yP2 - 16 },
                { x: xV2, y: yP1, lbl: '3', lx: xV2 + 16, ly: yP1 + 18 },
                { x: xV1, y: yP1, lbl: '4', lx: xV1 - 16, ly: yP1 + 18 }
            ];
            pts.forEach(p => {
                ctx.fillStyle = '#fbbf24';
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.beginPath(); ctx.arc(p.x, p.y, 5.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                ctx.fillStyle = '#fbbf24';
                ctx.font = '800 17px "Plus Jakarta Sans", system-ui, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(p.lbl, p.lx, p.ly);
            });

            // Điểm chạy 1 chiều sawtooth theo chu trình
            const saw = (t * 0.20) % 1;
            let dotX, dotY, vNorm, pNorm;
            if (saw < 0.25) {
                const r = saw / 0.25;
                dotX = xV1 + (xV2 - xV1) * r; dotY = yP2; vNorm = 1 + r; pNorm = 2;
            } else if (saw < 0.5) {
                const r = (saw - 0.25) / 0.25;
                dotX = xV2; dotY = yP2 + (yP1 - yP2) * r; vNorm = 2; pNorm = 2 - r;
            } else if (saw < 0.75) {
                const r = (saw - 0.5) / 0.25;
                dotX = xV2 - (xV2 - xV1) * r; dotY = yP1; vNorm = 2 - r; pNorm = 1;
            } else {
                const r = (saw - 0.75) / 0.25;
                dotX = xV1; dotY = yP1 - (yP1 - yP2) * r; vNorm = 1; pNorm = 1 + r;
            }
            ctx.fillStyle = '#f97316';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2.4;
            ctx.beginPath(); ctx.arc(dotX, dotY, 7, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

            // CỘT PHẢI: Xilanh Helium nối liền mạch với Áp kế + Thẻ đề dẫn
            const cylX = 446, cylY = 90, cylW = 200, cylH = 74;
            const pisX = cylX + 74 * vNorm;
            ctx.fillStyle = `rgba(56, 189, 248, ${(0.18 + (pNorm - 1) * 0.24).toFixed(2)})`;
            ctx.fillRect(cylX + 3, cylY + 3, pisX - cylX - 3, cylH - 6);

            // Phân tử khí Helium bên trong xilanh
            ctx.fillStyle = '#7dd3fc';
            for (let i = 0; i < 10; i++) {
                const hx = cylX + 12 + ((i * 29) % Math.max(24, Math.round(pisX - cylX - 20)));
                const hy = cylY + 14 + ((i * 19) % (cylH - 28));
                ctx.beginPath(); ctx.arc(hx, hy, 2.6, 0, Math.PI * 2); ctx.fill();
            }

            // Thành xilanh (chừa lỗ nối ống lên áp kế ở thành trên tại x = 472..480)
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(cylX + cylW, cylY);
            ctx.lineTo(480, cylY);
            ctx.moveTo(472, cylY);
            ctx.lineTo(cylX, cylY);
            ctx.lineTo(cylX, cylY + cylH);
            ctx.lineTo(cylX + cylW, cylY + cylH);
            ctx.stroke();

            // Ống dẫn kín nối thông từ nóc xilanh sang chân áp kế (714, 112)
            const gx = 714, gy = 112, gr = 28;
            ctx.fillStyle = 'rgba(56, 189, 248, 0.30)';
            ctx.beginPath();
            ctx.moveTo(472, cylY); ctx.lineTo(472, 64); ctx.lineTo(gx + 4, 64); ctx.lineTo(gx + 4, gy - gr);
            ctx.lineTo(gx - 4, gy - gr); ctx.lineTo(gx - 4, 72); ctx.lineTo(480, 72); ctx.lineTo(480, cylY);
            ctx.closePath(); ctx.fill();
            ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 2.4;
            ctx.beginPath();
            ctx.moveTo(472, cylY); ctx.lineTo(472, 64); ctx.lineTo(gx + 4, 64); ctx.lineTo(gx + 4, gy - gr);
            ctx.moveTo(480, cylY); ctx.lineTo(480, 72); ctx.lineTo(gx - 4, 72); ctx.lineTo(gx - 4, gy - gr);
            ctx.stroke();

            roundBox(pisX, cylY + 3, 14, cylH - 6, 3, '#94a3b8', '#f8fafc', 2);
            roundBox(pisX + 14, cylY + cylH / 2 - 4, 58, 8, 2, '#64748b', '#e2e8f0', 1.6);

            // Áp kế
            ctx.fillStyle = '#0f172a'; ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 2.8;
            ctx.beginPath(); ctx.arc(gx, gy, gr, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            const nAng = Math.PI * 0.9 + (pNorm - 1) * Math.PI * 0.9;
            ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2.8;
            ctx.beginPath();
            ctx.moveTo(gx, gy);
            ctx.lineTo(gx + Math.cos(nAng) * (gr - 8), gy + Math.sin(nAng) * (gr - 8));
            ctx.stroke();
            ctx.fillStyle = '#f8fafc'; ctx.beginPath(); ctx.arc(gx, gy, 3.5, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#38bdf8';
            ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Áp kế', gx, gy + gr + 16);

            // Thẻ thông số đề dẫn (Zero Data Leakage)
            roundBox(446, 184, 314, 96, 10, '#0f172a', '#fbbf24', 2);
            ctx.fillStyle = '#fbbf24';
            ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('DỮ LIỆU CHU TRÌNH HELIUM', 464, 210);
            ctx.fillStyle = '#f8fafc';
            ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillText('• Áp suất chuẩn: P₀ = 10⁵ Pa', 464, 238);
            ctx.fillText('• Thể tích chuẩn: V₀ = 2 lít', 464, 264);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 38 (MH-STAGING-C2-05 · VLXT-DS-VD28-038): Hệ thống túi khí an toàn ô tô bơm căng khí N₂ (V ≈ 60 lít, t = 25°C, áp suất tối đa 5 psi)
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C2-05', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
            bgGrad.addColorStop(0, '#060b19');
            bgGrad.addColorStop(1, '#0a1226');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
            for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2.2) {
                ctx.save();
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(x, y, bw, bh, r);
                else ctx.rect(x, y, bw, bh);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function arrowLine(x1, y1, x2, y2, col, lw = 3, hl = 9) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }

            // Tiêu đề
            ctx.save();
            const title = 'TÚI KHÍ AN TOÀN Ô TÔ (KHÍ N₂ · V ≈ 60 lít · 25°C · TỐI ĐA 5 psi)';
            ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            const titleW = ctx.measureText(title).width + 24;
            roundBox(16, 12, titleW, 28, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, 28, 26);
            ctx.restore();

            // Chu kỳ 1 chiều: bơm phồng túi khí nhanh -> xì nhẹ qua lỗ thoát khí -> reset
            const saw = (t * 0.22) % 1;
            const bagR = 22 + saw * 52;

            ctx.save();
            // 1. Hệ thống cảm biến va chạm
            roundBox(24, 128, 128, 66, 9, '#0f172a', '#ef4444', 2.4);
            ctx.fillStyle = '#fca5a5';
            ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('CẢM BIẾN', 88, 150);
            ctx.fillText('VA CHẠM', 88, 172);

            arrowLine(154, 161, 214, 161, '#fbbf24', 3.2, 9);
            ctx.fillStyle = '#fbbf24';
            ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillText('Tín hiệu', 184, 138);

            // 2. Bộ phận kích nổ & tạo khí N2
            roundBox(218, 122, 124, 78, 10, '#1e293b', '#f97316', 2.6);
            const pulse = 0.5 + 0.5 * Math.sin(t * 14) ** 2;
            ctx.fillStyle = `rgba(251, 191, 36, ${pulse.toFixed(2)})`;
            ctx.beginPath(); ctx.arc(280, 161, 18, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#fed7aa';
            ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillText('BỘ KÍCH NỔ', 280, 104);

            arrowLine(344, 161, 386, 161, '#38bdf8', 3.2, 8);

            // 3. Túi khí phồng lên
            const bagCX = 392 + bagR * 0.88;
            const bagCY = 161;
            const bGrad = ctx.createRadialGradient(bagCX - bagR * 0.2, bagCY - bagR * 0.2, 8, bagCX, bagCY, bagR);
            bGrad.addColorStop(0, 'rgba(248, 250, 252, 0.55)');
            bGrad.addColorStop(1, 'rgba(56, 189, 248, 0.32)');
            ctx.fillStyle = bGrad;
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 3.2;
            ctx.beginPath();
            ctx.ellipse(bagCX, bagCY, bagR * 0.88, bagR * 1.02, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#6ee7b7';
            for (let i = 0; i < 14; i++) {
                const ang = i * 0.52 + t * 2.4;
                const dist = ((i * 19) % 100) / 100 * (bagR * 0.60);
                ctx.beginPath();
                ctx.arc(bagCX + Math.cos(ang) * dist, bagCY + Math.sin(ang) * dist, 3, 0, Math.PI * 2);
                ctx.fill();
            }

            if (saw > 0.6) {
                arrowLine(bagCX, bagCY - bagR * 1.02 - 2, bagCX, bagCY - bagR * 1.02 - 18, '#94a3b8', 2.2, 6);
                ctx.fillStyle = '#cbd5e1';
                ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
                ctx.fillText('Lỗ thoát khí', bagCX, 56);
            }

            ctx.fillStyle = '#7dd3fc';
            ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillText('Túi khí (N₂)', 436, 266);

            // Thẻ thông số đề dẫn bên phải (Zero Data Leakage)
            roundBox(542, 62, 222, 214, 10, '#0f172a', '#38bdf8', 2);
            ctx.fillStyle = '#38bdf8';
            ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('TÚI KHÍ TIÊU CHUẨN', 558, 88);

            ctx.fillStyle = '#f8fafc';
            ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillText('• Khí bơm: Nitơ (N₂)', 558, 122);
            ctx.fillText('• Thể tích: V ≈ 60 lít', 558, 152);
            ctx.fillText('• Nhiệt độ: t = 25°C', 558, 182);
            ctx.fillText('• Chịu tối đa: 5 psi', 558, 212);
            ctx.fillStyle = '#fbbf24';
            ctx.fillText('• 1 psi ≈ 6,895 kPa', 558, 242);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 39 (MH-STAGING-C2-06 · VLXT-DS-VD28-039): Sơ đồ thí nghiệm nghiên cứu mối liên hệ giữa áp suất và thể tích ở nhiệt độ không đổi
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C2-06', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
            bgGrad.addColorStop(0, '#060b19');
            bgGrad.addColorStop(1, '#0a1226');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
            for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2.2) {
                ctx.save();
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(x, y, bw, bh, r);
                else ctx.rect(x, y, bw, bh);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function arrowLine(x1, y1, x2, y2, col, lw = 2.4, hl = 7) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }

            // Tiêu đề
            ctx.save();
            const title = 'THÍ NGHIỆM KHẢO SÁT ÁP SUẤT – THỂ TÍCH (T KHÔNG ĐỔI)';
            ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            const titleW = ctx.measureText(title).width + 24;
            roundBox(16, 12, titleW, 28, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, 28, 26);
            ctx.restore();

            // Nén khí 1 chiều sawtooth: V từ 20 cm3 -> 4 cm3
            const saw = (t * 0.16) % 1;
            const cylX = 216, cylY = 66, cylW = 248, cylH = 62;
            const vMaxX = cylX + 204;
            const vMinX = cylX + 46;
            const pisX = vMaxX - saw * (vMaxX - vMinX);

            ctx.save();
            // 1. Thiết bị thí nghiệm A (Zero Data Leakage: chỉ ghi "A")
            roundBox(42, 66, 114, 62, 8, '#0f172a', '#fbbf24', 2.6);
            ctx.fillStyle = '#fbbf24';
            ctx.font = '800 18px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('A', 99, 97);

            // Khớp nối kín liền mạch giữa thiết bị A và lòng xilanh (không có vách hở)
            const gasCol = `rgba(56, 189, 248, ${(0.22 + saw * 0.32).toFixed(2)})`;
            ctx.fillStyle = gasCol;
            ctx.fillRect(156, 89, 64, 16);
            ctx.fillRect(cylX + 2, cylY + 2, pisX - cylX - 2, cylH - 4);
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 2.8;
            ctx.beginPath();
            ctx.moveTo(156, 89); ctx.lineTo(216, 89);
            ctx.moveTo(156, 105); ctx.lineTo(216, 105);
            ctx.stroke();
            roundBox(174, 83, 24, 28, 5, '#334155', '#e2e8f0', 2);

            // Các phân tử khí bên trong xilanh
            ctx.fillStyle = '#7dd3fc';
            for (let i = 0; i < 10; i++) {
                const px = cylX + 10 + ((i * 29) % Math.max(20, Math.round(pisX - cylX - 18)));
                const py = cylY + 12 + ((i * 19) % (cylH - 26));
                ctx.beginPath(); ctx.arc(px, py, 2.4, 0, Math.PI * 2); ctx.fill();
            }

            // Thành xilanh (hở tại ống nối trái y=89..105)
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(cylX + cylW, cylY); ctx.lineTo(cylX, cylY);
            ctx.lineTo(cylX, 89);
            ctx.moveTo(cylX, 105);
            ctx.lineTo(cylX, cylY + cylH); ctx.lineTo(cylX + cylW, cylY + cylH);
            ctx.stroke();

            // Vạch chia thể tích
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 1.6;
            for (let vx = cylX + 20; vx <= cylX + 216; vx += 14) {
                const maj = ((vx - (cylX + 20)) % 42 === 0);
                ctx.beginPath();
                ctx.moveTo(vx, cylY + cylH);
                ctx.lineTo(vx, cylY + cylH - (maj ? 14 : 8));
                ctx.stroke();
            }

            // Pít-tông & tay cầm
            roundBox(pisX, cylY + 2, 14, cylH - 4, 2, '#94a3b8', '#f8fafc', 2);
            roundBox(pisX + 14, cylY + cylH / 2 - 8, 72, 16, 2, '#475569', '#cbd5e1', 1.8);
            roundBox(pisX + 86, cylY + 4, 12, cylH - 8, 3, '#cbd5e1', '#f8fafc', 2);

            // Dây nối từ thiết bị A -> Bộ thu dữ liệu -> Máy tính
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2.8;
            ctx.beginPath();
            ctx.moveTo(74, 128);
            ctx.quadraticCurveTo(32, 165, 58, 212);
            ctx.stroke();

            // 3. Bộ thu dữ liệu
            roundBox(58, 178, 186, 72, 9, '#0f172a', '#38bdf8', 2.4);
            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 15.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Bộ thu dữ liệu', 151, 214);

            ctx.strokeStyle = '#38bdf8';
            ctx.beginPath();
            ctx.moveTo(244, 224);
            ctx.quadraticCurveTo(278, 248, 304, 248);
            ctx.stroke();

            // 4. Máy tính hiển thị đồ thị p-V trực tiếp
            roundBox(304, 152, 180, 96, 10, '#0f172a', '#cbd5e1', 2.4);
            roundBox(314, 162, 160, 76, 5, '#070d1c', '#334155', 1.5);
            arrowLine(328, 228, 328, 170, '#94a3b8', 1.8, 5);
            arrowLine(324, 224, 462, 224, '#94a3b8', 1.8, 5);
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 2.4;
            ctx.beginPath();
            for (let k = 0; k <= 20; k++) {
                const vr = 0.2 + (k / 20) * 0.8;
                const px = 334 + vr * 116;
                const py = 222 - (0.18 / vr) * 44;
                if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            ctx.stroke();
            const curV = 1 - saw * 0.78;
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath();
            ctx.arc(334 + curV * 116, 222 - (0.18 / curV) * 44, 4.5, 0, Math.PI * 2);
            ctx.fill();

            roundBox(372, 248, 44, 14, 2, '#475569', '#94a3b8', 1.6);
            roundBox(304, 262, 180, 26, 6, '#1e293b', '#cbd5e1', 2);
            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillText('Máy tính', 394, 275);

            // Thẻ thông số đề dẫn bên phải (Zero Data Leakage)
            roundBox(516, 66, 246, 220, 10, '#0f172a', '#fbbf24', 2);
            ctx.fillStyle = '#fbbf24';
            ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('THÔNG SỐ THÍ NGHIỆM', 534, 94);
            ctx.fillStyle = '#f8fafc';
            ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillText('• Thiết bị thí nghiệm A', 534, 128);
            ctx.fillText('• Thể tích đầu: 10 cm³', 534, 158);
            ctx.fillText('• Áp suất đầu: p₀', 534, 188);
            ctx.fillText('• Miền thay đổi V:', 534, 218);
            ctx.fillStyle = '#7dd3fc';
            ctx.fillText('  từ 4 cm³ đến 20 cm³', 534, 244);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 40 (MH-STAGING-C2-07 · VLXT-DS-VD28-040): Bóng thám không bơm khí Hydrogen (d = 3 m; m_vỏ = 4 kg) bay lên cân bằng ở độ cao h
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C2-07', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
            bgGrad.addColorStop(0, '#060b19');
            bgGrad.addColorStop(1, '#0a1226');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
            for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2.2) {
                ctx.save();
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(x, y, bw, bh, r);
                else ctx.rect(x, y, bw, bh);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function arrowLine(x1, y1, x2, y2, col, lw = 2.6, hl = 8) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }

            function calloutTag(tx, ty, bx, by, label, col) {
                ctx.save();
                ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
                const tw = ctx.measureText(label).width;
                const boxW = tw + 20, boxH = 28;
                const ax = (bx + boxW / 2 < tx) ? (bx + boxW) : bx;
                const ay = by + boxH / 2;
                ctx.strokeStyle = col; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(ax, ay); ctx.stroke();
                ctx.fillStyle = col;
                ctx.beginPath(); ctx.arc(tx, ty, 3.8, 0, Math.PI * 2); ctx.fill();
                roundBox(bx, by, boxW, boxH, 7, '#0f172a', col, 1.8);
                ctx.fillStyle = '#f8fafc';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(label, bx + boxW / 2, by + boxH / 2);
                ctx.restore();
            }

            // Tiêu đề
            ctx.save();
            const title = 'BÓNG THÁM KHÔNG KHÍ HYDROGEN (d₁ = 3 m → d₂ = 3d₁)';
            ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            const titleW = ctx.measureText(title).width + 24;
            roundBox(16, 12, titleW, 28, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, 28, 26);
            ctx.restore();

            // Sawtooth 1 chiều: bay từ mặt đất lên độ cao h và phình to dần
            const saw = (t * 0.16) % 1;
            const cx = 332;
            const cy = 178 - saw * 48;
            const R = 30 + saw * 36; // 30px -> 66px

            ctx.save();
            ctx.strokeStyle = 'rgba(148, 163, 184, 0.28)';
            ctx.setLineDash([5, 5]);
            ctx.lineWidth = 1.6;
            ctx.beginPath();
            ctx.moveTo(22, 62); ctx.lineTo(445, 62);
            ctx.moveTo(22, 268); ctx.lineTo(445, 268);
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.fillStyle = '#fbbf24';
            ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('Độ cao h: d₂ = 3d₁ (-55°C)', 22, 54);
            ctx.fillStyle = '#94a3b8';
            ctx.fillText('Mặt đất: d₁ = 3 m (27°C)', 22, 286);

            // Vỏ bóng đàn hồi phình to
            const bGrad = ctx.createRadialGradient(cx - R * 0.25, cy - R * 0.25, 6, cx, cy, R);
            bGrad.addColorStop(0, 'rgba(224, 242, 254, 0.44)');
            bGrad.addColorStop(1, 'rgba(14, 165, 233, 0.28)');
            ctx.fillStyle = bGrad;
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 3.2;
            ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

            // 8 mũi tên áp suất hướng từ tâm ra ép vuông góc vào mặt trong vỏ bóng
            for (let i = 0; i < 8; i++) {
                const ang = (i * Math.PI * 2) / 8 + Math.PI / 8;
                const rIn = Math.max(8, R * 0.28);
                const rOut = R - 5;
                arrowLine(cx + Math.cos(ang) * rIn, cy + Math.sin(ang) * rIn, cx + Math.cos(ang) * rOut, cy + Math.sin(ang) * rOut, '#fbbf24', 2.4, 7);
            }

            // Cổ buộc, dù thu gọn & hộp cảm biến KÍCH THƯỚC CỐ ĐỊNH TUYỆT ĐỐI
            const neckY = cy + R;
            ctx.fillStyle = '#cbd5e1';
            ctx.fillRect(cx - 5, neckY - 2, 10, 6);
            const chuteY = neckY + 14;
            // Dù nhỏ cố định
            ctx.fillStyle = 'rgba(251, 191, 36, 0.25)';
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(cx, chuteY, 13, Math.PI, 0, false);
            ctx.closePath(); ctx.fill(); ctx.stroke();

            const boxTopY = neckY + 28;
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(cx, neckY + 4); ctx.lineTo(cx, chuteY - 13);
            ctx.moveTo(cx - 11, chuteY); ctx.lineTo(cx, boxTopY);
            ctx.moveTo(cx + 11, chuteY); ctx.lineTo(cx, boxTopY);
            ctx.stroke();

            // Hộp cảm biến cố định 48 x 26 px
            const boxW = 48, boxH = 26;
            roundBox(cx - boxW / 2, boxTopY, boxW, boxH, 5, '#1e293b', '#10b981', 2.4);
            ctx.fillStyle = '#6ee7b7';
            ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('ĐO', cx, boxTopY + boxH / 2);
            ctx.restore();

            // Callout nhãn trái
            calloutTag(cx - R * 0.72, cy - R * 0.72, 20, 88, 'Vỏ bóng đàn hồi', '#38bdf8');
            calloutTag(cx - boxW / 2, boxTopY + boxH / 2, 20, 202, 'Dù & thiết bị đo (cố định)', '#10b981');

            // Thẻ thông số đề dẫn bên phải (Zero Data Leakage)
            roundBox(468, 56, 294, 224, 10, '#0f172a', '#fbbf24', 2);
            ctx.save();
            ctx.fillStyle = '#fbbf24';
            ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText('THÔNG SỐ BÓNG HYDROGEN', 486, 84);
            ctx.fillStyle = '#f8fafc';
            ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillText('• Vỏ, dù, thiết bị: 4 kg', 486, 118);
            ctx.fillText('• Mặt đất: d₁ = 3 m; 27°C', 486, 148);
            ctx.fillText('  p₀ = 1,013·10⁵ Pa', 486, 174);
            ctx.fillText('• Độ cao h: d₂ = 3d₁; -55°C', 486, 206);
            ctx.fillStyle = '#7dd3fc';
            ctx.fillText('• M(kk) = 29 g/mol', 486, 236);
            ctx.fillText('• M(H₂) = 2 g/mol', 486, 262);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 41 (MH-STAGING-C2-08 · VLXT-DS-VD28-041): Truyền động đĩa–líp xe đạp và bơm tay bơm khí đẳng nhiệt vào xăm xe
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C2-08', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
            bgGrad.addColorStop(0, '#060b19');
            bgGrad.addColorStop(1, '#0a1226');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
            for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2.2) {
                ctx.save();
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(x, y, bw, bh, r);
                else ctx.rect(x, y, bw, bh);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function arrowLine(x1, y1, x2, y2, col, lw = 2.8, hl = 8) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }

            function calloutTag(tx, ty, bx, by, label, col) {
                ctx.save();
                ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
                const tw = ctx.measureText(label).width;
                const boxW = tw + 20, boxH = 28;
                const ax = (bx + boxW / 2 < tx) ? (bx + boxW) : bx;
                const ay = by + boxH / 2;
                ctx.strokeStyle = col; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(ax, ay); ctx.stroke();
                ctx.fillStyle = col;
                ctx.beginPath(); ctx.arc(tx, ty, 3.8, 0, Math.PI * 2); ctx.fill();
                roundBox(bx, by, boxW, boxH, 7, '#0f172a', col, 1.8);
                ctx.fillStyle = '#f8fafc';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(label, bx + boxW / 2, by + boxH / 2);
                ctx.restore();
            }

            // Tiêu đề
            ctx.save();
            const title = 'TRUYỀN ĐỘNG ĐĨA–LÍP XE ĐẠP & BƠM TAY LỐP XE';
            ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            const titleW = ctx.measureText(title).width + 24;
            roundBox(16, 12, titleW, 28, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, 28, 26);
            ctx.restore();

            // Mặt đường
            const roadY = 256;
            ctx.save();
            ctx.strokeStyle = '#64748b';
            ctx.lineWidth = 3;
            ctx.beginPath(); ctx.moveTo(24, roadY); ctx.lineTo(448, roadY); ctx.stroke();
            ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
            ctx.lineWidth = 1.6;
            for (let hx = 34; hx < 440; hx += 16) {
                ctx.beginPath(); ctx.moveTo(hx, roadY); ctx.lineTo(hx - 8, roadY + 10); ctx.stroke();
            }

            // 1. Bánh xe sau quay lăn không trượt + Líp nhiều tầng + Đĩa + Xích
            const wx = 196, wy = 166, wR = 90;
            const cx = 382, cy = 180, dR = 36, lR = 20;
            const ang = t * 2.4;

            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 5;
            ctx.beginPath(); ctx.arc(wx, wy, wR - 3, 0, Math.PI * 2); ctx.stroke();
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 2.4;
            ctx.beginPath(); ctx.arc(wx, wy, wR - 11, 0, Math.PI * 2); ctx.stroke();

            ctx.strokeStyle = 'rgba(203, 213, 225, 0.55)';
            ctx.lineWidth = 1.6;
            for (let i = 0; i < 8; i++) {
                const sa = ang + (i * Math.PI) / 4;
                ctx.beginPath();
                ctx.moveTo(wx, wy);
                ctx.lineTo(wx + Math.cos(sa) * (wR - 12), wy + Math.sin(sa) * (wR - 12));
                ctx.stroke();
            }

            [24, 18, 12].forEach((rr, idx) => {
                ctx.fillStyle = idx === 0 ? '#1e293b' : '#334155';
                ctx.strokeStyle = '#fbbf24';
                ctx.lineWidth = 2;
                ctx.beginPath(); ctx.arc(wx, wy, rr, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            });

            // Đĩa trước & pê-đan
            ctx.fillStyle = '#1e293b';
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 2.6;
            ctx.beginPath(); ctx.arc(cx, cy, dR, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            const pedalAng = ang * 0.55;
            ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + Math.cos(pedalAng) * 44, cy + Math.sin(pedalAng) * 44);
            ctx.stroke();
            roundBox(cx + Math.cos(pedalAng) * 44 - 8, cy + Math.sin(pedalAng) * 44 - 4, 16, 8, 2, '#fbbf24', '#f8fafc', 1.6);

            // Dây xích nối tiếp tuyến
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 2.8;
            ctx.beginPath();
            ctx.moveTo(wx, wy - lR); ctx.lineTo(cx, cy - dR);
            ctx.moveTo(wx, wy + lR); ctx.lineTo(cx, cy + dR);
            ctx.stroke();
            arrowLine(wx + 55, wy - lR - 8, wx + 115, wy - lR - 4, '#fbbf24', 2.4, 7);

            // 2. Bơm tay & Áp kế bên phải (1 chiều sawtooth)
            const saw = (t * 0.24) % 1;
            const px = 568, py = 126, pw = 48, ph = 116;
            const pisY = py + 18 + saw * 62;
            ctx.fillStyle = `rgba(56, 189, 248, ${(0.18 + saw * 0.26).toFixed(2)})`;
            ctx.fillRect(px + 2, pisY + 12, pw - 4, py + ph - (pisY + 12) - 2);
            ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 2.8;
            ctx.strokeRect(px, py, pw, ph);
            roundBox(px + 3, pisY, pw - 6, 12, 2, '#94a3b8', '#f8fafc', 1.8);
            ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 4.2;
            ctx.beginPath();
            ctx.moveTo(px + pw / 2, pisY); ctx.lineTo(px + pw / 2, pisY - 34);
            ctx.stroke();
            roundBox(px + 4, pisY - 42, pw - 8, 10, 4, '#f97316', '#fed7aa', 1.8);

            ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(px + pw, py + ph - 12);
            ctx.lineTo(px + pw + 74, py + ph - 12);
            ctx.lineTo(px + pw + 74, 152);
            ctx.stroke();

            const gx = 692, gy = 120, gr = 32;
            ctx.fillStyle = '#0f172a'; ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 2.8;
            ctx.beginPath(); ctx.arc(gx, gy, gr, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            const nAng = Math.PI * 0.85 + saw * Math.PI * 0.85;
            ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2.8;
            ctx.beginPath();
            ctx.moveTo(gx, gy);
            ctx.lineTo(gx + Math.cos(nAng) * (gr - 8), gy + Math.sin(nAng) * (gr - 8));
            ctx.stroke();
            ctx.fillStyle = '#f8fafc'; ctx.beginPath(); ctx.arc(gx, gy, 3.5, 0, Math.PI * 2); ctx.fill();
            ctx.restore();

            // Nhãn callout rõ nét (Zero Data Leakage)
            calloutTag(146, 106, 20, 62, 'Bánh xe sau', '#38bdf8');
            calloutTag(172, 166, 20, 154, 'Líp nhiều tầng', '#fbbf24');
            calloutTag(382, 144, 294, 58, 'Đĩa & Dây xích', '#10b981');
            calloutTag(568, 186, 486, 260, 'Bơm tay lốp xe', '#f97316');
            calloutTag(692, 88, 616, 48, 'Áp kế đo áp suất', '#38bdf8');
        });

    // =========================================================================
    // CÂU 42 (MH-STAGING-C2-09 · VLXT-DS-VD28-042): Không khí trong ngôi nhà V = 40 m³ nóng lên từ 20°C đến 25°C ở áp suất 1 atm
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C2-09', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
            bgGrad.addColorStop(0, '#060b19');
            bgGrad.addColorStop(1, '#0a1226');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
            for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2.2) {
                ctx.save();
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(x, y, bw, bh, r);
                else ctx.rect(x, y, bw, bh);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function arrowLine(x1, y1, x2, y2, col, lw = 2.8, hl = 8) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }

            // Tiêu đề
            ctx.save();
            const title = 'KHÔNG KHÍ TRONG NGÔI NHÀ (V = 40 m³ · 20°C → 25°C · p = 1 atm)';
            ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            const titleW = ctx.measureText(title).width + 24;
            roundBox(16, 12, titleW, 28, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, 28, 26);
            ctx.restore();

            // Chu kỳ 1 chiều: sáng sớm 20°C -> giữa trưa 25°C, một phần không khí thoát ra ngoài
            const saw = (t * 0.16) % 1;
            const curTemp = (20 + saw * 5).toFixed(1).replace('.', ',');

            const hx1 = 68, hx2 = 344, hyTop = 128, hyBot = 264, roofPeakY = 66;
            const ventTop = 156, ventBot = 216;

            ctx.save();
            ctx.fillStyle = `rgba(56, 189, 248, ${(0.20 - saw * 0.05).toFixed(2)})`;
            ctx.beginPath();
            ctx.moveTo(hx1, hyBot);
            ctx.lineTo(hx1, hyTop);
            ctx.lineTo((hx1 + hx2) / 2, roofPeakY);
            ctx.lineTo(hx2, hyTop);
            ctx.lineTo(hx2, hyBot);
            ctx.closePath();
            ctx.fill();

            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 3.5;
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(hx2, ventTop);
            ctx.lineTo(hx2, hyTop);
            ctx.lineTo((hx1 + hx2) / 2, roofPeakY);
            ctx.lineTo(hx1, hyTop);
            ctx.lineTo(hx1, hyBot);
            ctx.lineTo(hx2, hyBot);
            ctx.lineTo(hx2, ventBot);
            ctx.stroke();

            ctx.strokeStyle = '#f97316';
            ctx.lineWidth = 4.5;
            ctx.beginPath();
            ctx.moveTo(hx1 - 16, hyTop + 6);
            ctx.lineTo((hx1 + hx2) / 2, roofPeakY - 2);
            ctx.lineTo(hx2 + 16, hyTop + 6);
            ctx.stroke();

            // Nhiệt kế treo tường bên trái trong nhà
            const tx = 104, tyTop = 144, tyBot = 242;
            roundBox(tx - 6, tyTop, 12, tyBot - tyTop, 5, '#0f172a', '#cbd5e1', 2);
            ctx.fillStyle = '#ef4444';
            ctx.beginPath(); ctx.arc(tx, tyBot + 6, 7.5, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 2; ctx.stroke();
            const colY = tyBot - (tyBot - tyTop - 10) * (0.45 + saw * 0.42);
            ctx.fillRect(tx - 3, colY, 6, tyBot - colY + 2);

            roundBox(124, 146, 94, 30, 6, '#0f172a', '#ef4444', 1.8);
            ctx.fillStyle = '#fca5a5';
            ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${curTemp}°C`, 171, 161);

            const spd = 1 + saw * 0.8;
            ctx.fillStyle = '#7dd3fc';
            for (let i = 0; i < 16; i++) {
                const px = 145 + ((i * 39 + Math.sin(t * 3 * spd + i) * 10) % 178);
                const py = 186 + ((i * 23 + Math.cos(t * 3.5 * spd + i) * 8) % 66);
                ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI * 2); ctx.fill();
            }

            const escX = hx2 + 8 + saw * 54;
            arrowLine(hx2 - 8, 174, hx2 + 54, 174, '#fb923c', 2.8, 8);
            arrowLine(hx2 - 8, 198, hx2 + 54, 198, '#fb923c', 2.8, 8);
            ctx.fillStyle = '#fb923c';
            ctx.beginPath(); ctx.arc(escX, 174, 3.5, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(escX - 12, 198, 3.5, 0, Math.PI * 2); ctx.fill();

            roundBox(352, 126, 98, 30, 6, '#0f172a', '#fb923c', 1.8);
            ctx.fillStyle = '#fed7aa';
            ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillText('Khí thoát', 401, 141);

            roundBox(470, 62, 290, 214, 10, '#0f172a', '#38bdf8', 2);
            ctx.fillStyle = '#38bdf8';
            ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('THÔNG SỐ NGÔI NHÀ', 488, 88);
            ctx.fillStyle = '#f8fafc';
            ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillText('• Thể tích trong: V = 40 m³', 488, 122);
            ctx.fillText('• Sáng sớm: t₁ = 20°C', 488, 152);
            ctx.fillText('• Giữa trưa: t₂ = 25°C', 488, 182);
            ctx.fillText('• p = 1 atm = 1,013·10⁵ Pa', 488, 212);
            ctx.fillStyle = '#fbbf24';
            ctx.fillText('• Khối lượng mol: 29 g/mol', 488, 242);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 43 (MH-STAGING-C2-10 · VLXT-DS-VD28-043): Túi khí tay lái ô tô phân hủy 87 g NaN₃ giải phóng khí N₂ làm phồng túi
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C2-10', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
            bgGrad.addColorStop(0, '#060b19');
            bgGrad.addColorStop(1, '#0a1226');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
            for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2.2) {
                ctx.save();
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(x, y, bw, bh, r);
                else ctx.rect(x, y, bw, bh);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function arrowLine(x1, y1, x2, y2, col, lw = 2.8, hl = 8) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }

            function calloutTag(tx, ty, bx, by, label, col) {
                ctx.save();
                ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
                const tw = ctx.measureText(label).width;
                const boxW = tw + 20, boxH = 28;
                const ax = (bx + boxW / 2 < tx) ? (bx + boxW) : bx;
                const ay = by + boxH / 2;
                ctx.strokeStyle = col; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(ax, ay); ctx.stroke();
                ctx.fillStyle = col;
                ctx.beginPath(); ctx.arc(tx, ty, 3.8, 0, Math.PI * 2); ctx.fill();
                roundBox(bx, by, boxW, boxH, 7, '#0f172a', col, 1.8);
                ctx.fillStyle = '#f8fafc';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(label, bx + boxW / 2, by + boxH / 2);
                ctx.restore();
            }

            // Tiêu đề
            ctx.save();
            const title = 'TÚI KHÍ TAY LÁI Ô TÔ (87 g NaN₃ PHÂN HỦY TẠO Na & KHÍ N₂)';
            ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            const titleW = ctx.measureText(title).width + 24;
            roundBox(16, 12, titleW, 28, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, 28, 26);
            ctx.restore();

            // Chu kỳ 1 chiều: va chạm -> phân hủy NaN3 -> khí N2 làm phồng túi khí vô-lăng
            const saw = (t * 0.22) % 1;
            const bagP = Math.max(0, (saw - 0.12) / 0.88);
            const bagR = 20 + bagP * 68;

            ctx.save();
            // Trục lái & vành vô-lăng hạ thấp gọn dưới callout (y = 104..248)
            roundBox(96, 154, 78, 28, 4, '#334155', '#94a3b8', 2.2);
            roundBox(174, 102, 16, 142, 6, '#475569', '#cbd5e1', 2.4);

            // Hộp cảm biến va chạm dưới vô-lăng
            roundBox(24, 214, 128, 56, 8, '#0f172a', '#ef4444', 2.4);
            ctx.fillStyle = '#fca5a5';
            ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('CẢM BIẾN', 88, 232);
            ctx.fillText('VA CHẠM', 88, 252);

            ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2.6;
            ctx.beginPath(); ctx.moveTo(152, 242); ctx.lineTo(208, 242); ctx.lineTo(208, 204); ctx.stroke();

            // Ngòi kích nổ chứa 87 g NaN3 ở tâm vô-lăng
            roundBox(182, 134, 56, 70, 8, '#1e293b', '#f97316', 2.6);
            const pelletCount = Math.max(1, Math.round((1 - bagP * 0.75) * 6));
            ctx.fillStyle = '#fde047';
            for (let i = 0; i < pelletCount; i++) {
                ctx.beginPath();
                ctx.arc(198 + (i % 2) * 18, 152 + Math.floor(i / 2) * 16, 5, 0, Math.PI * 2);
                ctx.fill();
            }

            // Luồng khí Nitơ sinh ra thổi phồng túi khí sang phải
            arrowLine(238, 169, 276, 169, '#38bdf8', 3.2, 8);

            const bagCX = 280 + bagR * 0.85;
            const bagCY = 166;
            const bGrad = ctx.createRadialGradient(bagCX - bagR * 0.2, bagCY - bagR * 0.2, 8, bagCX, bagCY, bagR);
            bGrad.addColorStop(0, 'rgba(248, 250, 252, 0.56)');
            bGrad.addColorStop(1, 'rgba(56, 189, 248, 0.30)');
            ctx.fillStyle = bGrad;
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 3.2;
            ctx.beginPath();
            ctx.ellipse(bagCX, bagCY, bagR * 0.85, bagR * 1.0, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#6ee7b7';
            const nDots = 4 + Math.round(bagP * 14);
            for (let i = 0; i < nDots; i++) {
                const ang = i * 0.6 + t * 2.5;
                const dist = ((i * 23) % 100) / 100 * (bagR * 0.58);
                ctx.beginPath();
                ctx.arc(bagCX + Math.cos(ang) * dist, bagCY + Math.sin(ang) * dist, 3, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();

            // Callouts rõ nét (tách hẳn khỏi vành vô-lăng)
            calloutTag(206, 134, 20, 62, 'Ngòi chứa 87 g NaN₃', '#f97316');
            calloutTag(bagCX, bagCY + bagR * 0.78, 254, 256, 'Khí Nitơ làm phồng túi khí', '#38bdf8');

            roundBox(498, 62, 264, 214, 10, '#0f172a', '#fbbf24', 2);
            ctx.save();
            ctx.fillStyle = '#fbbf24';
            ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText('CẤU TẠO TÚI KHÍ LÁI', 516, 88);
            ctx.fillStyle = '#f8fafc';
            ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillText('• Chất rắn đầu: 87 g NaN₃', 516, 122);
            ctx.fillText('• Khi va chạm mạnh:', 516, 152);
            ctx.fillText('  Cảm biến kích thích', 516, 178);
            ctx.fillText('  phân hủy thành Na & N₂', 516, 204);
            ctx.fillStyle = '#6ee7b7';
            ctx.fillText('• Khí N₂ làm phồng túi khí', 516, 238);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 44 (MH-STAGING-C2-11 · VLXT-DS-VD28-044): Bình áp chứa nước gia dụng 360 lít (h₁ = 13,5 m; h₂ = 1 m; p₀ = 10 m cột nước)
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C2-11', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
            bgGrad.addColorStop(0, '#060b19');
            bgGrad.addColorStop(1, '#0a1226');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
            for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2.2) {
                ctx.save();
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(x, y, bw, bh, r);
                else ctx.rect(x, y, bw, bh);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function arrowLine(x1, y1, x2, y2, col, lw = 2.4, hl = 7) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }

            // Tiêu đề
            ctx.save();
            const title = 'BÌNH ÁP CHỨA NƯỚC GIA DỤNG (V₀ = 360 lít; h₁ = 13,5 m; h₂ = 1 m)';
            ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            const titleW = ctx.measureText(title).width + 24;
            roundBox(16, 12, titleW, 28, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, 28, 26);
            ctx.restore();

            // Chu kỳ 2 giai đoạn 1 chiều
            const saw = (t * 0.14) % 1;
            const isPumpPhase = saw < 0.46;
            const pRatio = isPumpPhase ? (saw / 0.46) : Math.max(0, 1 - (saw - 0.46) / 0.46);
            const stoppedFlow = saw >= 0.92;
            const waterFill = isPumpPhase ? (0.08 + (saw / 0.46) * 0.72) : (0.80 - Math.min(1, (saw - 0.46) / 0.46) * 0.34);

            const tx = 186, ty = 112, tw = 128, th = 140;
            const wallW = 3;
            const cx = tx + tw / 2;
            const inPipeX = tx + 32, outPipeX = tx + tw - 32;

            ctx.save();
            // Mực nước trong bình tràn sát 2 thành bên
            const wH = (th - 16) * waterFill;
            const wTop = ty + th - wallW * 0.4 - wH;
            const wGrad = ctx.createLinearGradient(0, wTop, 0, ty + th);
            wGrad.addColorStop(0, 'rgba(56, 189, 248, 0.50)');
            wGrad.addColorStop(1, 'rgba(14, 116, 144, 0.78)');
            ctx.fillStyle = wGrad;
            ctx.fillRect(tx + wallW * 0.4, wTop, tw - wallW * 0.8, wH);
            ctx.strokeStyle = '#7dd3fc'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(tx + wallW * 0.4, wTop); ctx.lineTo(tx + tw - wallW * 0.4, wTop); ctx.stroke();

            // Khí nén phía trên nước (bao gồm phần cổ vòm lên áp kế)
            ctx.fillStyle = `rgba(251, 191, 36, ${(0.10 + pRatio * 0.16).toFixed(2)})`;
            ctx.beginPath();
            ctx.moveTo(cx - 10, ty - 14);
            ctx.quadraticCurveTo(cx - 12, ty, tx + wallW * 0.4, ty);
            ctx.lineTo(tx + wallW * 0.4, wTop);
            ctx.lineTo(tx + tw - wallW * 0.4, wTop);
            ctx.lineTo(tx + tw - wallW * 0.4, ty);
            ctx.quadraticCurveTo(cx + 12, ty, cx + 10, ty - 14);
            ctx.closePath(); ctx.fill();

            // Đường bao bình áp + cổ nối liền mạch lên áp kế + 2 ống đáy
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = wallW;
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(cx - 10, ty - 14);
            ctx.quadraticCurveTo(cx - 12, ty, tx, ty);
            ctx.lineTo(tx, ty + th);
            ctx.lineTo(inPipeX - 6, ty + th);
            ctx.moveTo(inPipeX + 6, ty + th);
            ctx.lineTo(outPipeX - 6, ty + th);
            ctx.moveTo(outPipeX + 6, ty + th);
            ctx.lineTo(tx + tw, ty + th);
            ctx.lineTo(tx + tw, ty);
            ctx.quadraticCurveTo(cx + 12, ty, cx + 10, ty - 14);
            ctx.stroke();

            // Áp kế gắn kín cổ bình
            const gx = cx, gy = 78, gr = 24;
            ctx.fillStyle = '#0f172a'; ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 2.6;
            ctx.beginPath(); ctx.arc(gx, gy, gr, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            const nAng = Math.PI * 0.85 + pRatio * Math.PI * 1.1;
            ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2.6;
            ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx + Math.cos(nAng) * (gr - 6), gy + Math.sin(nAng) * (gr - 6)); ctx.stroke();
            ctx.fillStyle = '#f8fafc'; ctx.beginPath(); ctx.arc(gx, gy, 3.2, 0, Math.PI * 2); ctx.fill();

            // Ống vào bên trái tô một đa giác liền mạch (không đè góc double-alpha)
            ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
            ctx.beginPath();
            ctx.moveTo(42, 267); ctx.lineTo(inPipeX - 6, 267); ctx.lineTo(inPipeX - 6, ty + th);
            ctx.lineTo(inPipeX + 6, ty + th); ctx.lineTo(inPipeX + 6, 277); ctx.lineTo(42, 277);
            ctx.closePath(); ctx.fill();
            ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 2.4;
            ctx.beginPath();
            ctx.moveTo(42, 267); ctx.lineTo(inPipeX - 6, 267); ctx.lineTo(inPipeX - 6, ty + th);
            ctx.moveTo(42, 277); ctx.lineTo(inPipeX + 6, 277); ctx.lineTo(inPipeX + 6, ty + th);
            ctx.stroke();
            roundBox(78, 254, 48, 30, 5, isPumpPhase ? '#0284c7' : '#334155', isPumpPhase ? '#7dd3fc' : '#94a3b8', 2.2);

            // Ống ra bên phải tô một đa giác liền mạch (không đè góc double-alpha)
            const pipeRX = 368, tapY = 74;
            ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
            ctx.beginPath();
            ctx.moveTo(outPipeX - 6, ty + th); ctx.lineTo(outPipeX - 6, 277);
            ctx.lineTo(pipeRX + 6, 277); ctx.lineTo(pipeRX + 6, tapY + 10);
            ctx.lineTo(pipeRX + 38, tapY + 10); ctx.lineTo(pipeRX + 38, tapY);
            ctx.lineTo(pipeRX - 6, tapY); ctx.lineTo(pipeRX - 6, 267);
            ctx.lineTo(outPipeX + 6, 267); ctx.lineTo(outPipeX + 6, ty + th);
            ctx.closePath(); ctx.fill();
            ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 2.4;
            ctx.beginPath();
            ctx.moveTo(outPipeX - 6, ty + th); ctx.lineTo(outPipeX - 6, 277); ctx.lineTo(pipeRX + 6, 277); ctx.lineTo(pipeRX + 6, tapY + 10); ctx.lineTo(pipeRX + 38, tapY + 10);
            ctx.moveTo(outPipeX + 6, ty + th); ctx.lineTo(outPipeX + 6, 267); ctx.lineTo(pipeRX - 6, 267); ctx.lineTo(pipeRX - 6, tapY); ctx.lineTo(pipeRX + 42, tapY);
            ctx.stroke();

            // Van khóa nước trên đỉnh ống ra
            const valX = pipeRX + 18;
            ctx.strokeStyle = isPumpPhase ? '#ef4444' : '#10b981';
            ctx.lineWidth = 3.2;
            ctx.beginPath();
            ctx.moveTo(valX, tapY); ctx.lineTo(valX, tapY - 12);
            ctx.moveTo(valX - 9, tapY - 12); ctx.lineTo(valX + 9, tapY - 12);
            ctx.stroke();

            if (!isPumpPhase && !stoppedFlow) {
                ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2.6; ctx.setLineDash([4, 4]);
                ctx.beginPath();
                ctx.moveTo(pipeRX + 40, tapY + 12); ctx.lineTo(pipeRX + 48, tapY + 56);
                ctx.moveTo(pipeRX + 38, tapY + 12); ctx.lineTo(pipeRX + 34, tapY + 56);
                ctx.stroke(); ctx.setLineDash([]);
            }

            // Thước đo độ cao h1 = 13,5 m so với đáy bình
            ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1.6; ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(pipeRX + 42, tapY + 5); ctx.lineTo(448, tapY + 5);
            ctx.moveTo(tx + tw, ty + th); ctx.lineTo(448, ty + th);
            ctx.stroke(); ctx.setLineDash([]);
            arrowLine(438, 144, 438, tapY + 7, '#fbbf24', 2, 6);
            arrowLine(438, 178, 438, ty + th - 2, '#fbbf24', 2, 6);
            ctx.fillStyle = '#fbbf24';
            ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('h₁ = 13,5 m', 438, 161);

            ctx.fillStyle = '#f8fafc';
            ctx.fillText('Khí', cx, ty + 24);
            ctx.fillStyle = '#e2e8f0';
            ctx.fillText('Áp kế', 132, 78);
            ctx.fillStyle = '#7dd3fc';
            ctx.fillText('Máy bơm', 102, 238);
            ctx.fillStyle = '#6ee7b7';
            ctx.fillText('Khóa nước', 322, 56);

            roundBox(498, 56, 264, 224, 10, '#0f172a', '#38bdf8', 2);
            ctx.fillStyle = '#38bdf8';
            ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('THÔNG SỐ BÌNH ÁP', 516, 84);
            ctx.fillStyle = '#f8fafc';
            ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillText('• Dung tích bình: 360 lít', 516, 118);
            ctx.fillText('• Đầu: p₀ | Bơm ngắt: 6p₀', 516, 148);
            ctx.fillText('• Độ cao vòi: h₁ = 13,5 m', 516, 178);
            ctx.fillText('• Còn lại ở đáy: h₂ = 1 m', 516, 208);
            ctx.fillStyle = '#fbbf24';
            ctx.fillText('• p₀ = 10 m cột nước', 516, 238);
            ctx.fillStyle = '#94a3b8';
            ctx.fillText('• Nhiệt độ khí không đổi', 516, 264);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 45 (MH-STAGING-C2-12 · VLXT-DS-VD28-045): Đồ thị chu trình biến đổi trạng thái (1) – (2) – (3) trong hệ tọa độ V – T
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C2-12', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
            for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(x, y, bw, bh, r);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function arrowLine(x1, y1, x2, y2, col, lw = 2.8, hl = 9) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }

            function drawSub(base, sub, x, y, col = '#f8fafc', baseSz = 16, align = 'left') {
                const subSz = Math.max(13, Math.round(baseSz * 0.78));
                ctx.save();
                ctx.fillStyle = col;
                ctx.textAlign = 'left';
                ctx.textBaseline = 'alphabetic';
                ctx.font = `800 ${baseSz}px "Plus Jakarta Sans", system-ui, sans-serif`;
                const bw = ctx.measureText(base).width;
                ctx.font = `800 ${subSz}px "Plus Jakarta Sans", system-ui, sans-serif`;
                const sw = sub ? ctx.measureText(sub).width : 0;
                const tot = bw + sw;
                let sx = x;
                if (align === 'center') sx = x - tot / 2;
                else if (align === 'right') sx = x - tot;
                ctx.font = `800 ${baseSz}px "Plus Jakarta Sans", system-ui, sans-serif`;
                ctx.fillText(base, sx, y);
                if (sub) {
                    ctx.font = `800 ${subSz}px "Plus Jakarta Sans", system-ui, sans-serif`;
                    ctx.fillText(sub, sx + bw + 1, y + 4);
                }
                ctx.restore();
            }

            // Tiêu đề góc trên trái
            ctx.save();
            const title = 'CHU TRÌNH BIẾN ĐỔI KHÍ LÝ TƯỞNG TRONG HỆ V – T';
            ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            const titleW = Math.min(740, ctx.measureText(title).width + 24);
            roundBox(14, 12, titleW, 30, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, 26, 27);
            ctx.restore();

            // Hệ trục V (lít) - T (K) bên trái (khớp 100% ảnh gốc 045.png)
            const ox = 86, oy = 266;
            arrowLine(ox, oy + 4, ox, 52, '#f1f5f9', 2.8, 9);
            arrowLine(ox - 4, oy, 444, oy, '#f1f5f9', 2.8, 9);

            ctx.save();
            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 16px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText('V (lít)', ox + 10, 62);
            ctx.textAlign = 'center';
            ctx.fillText('T (K)', 420, oy + 20);
            ctx.fillText('O', ox - 16, oy + 16);

            // Tọa độ chính xác theo toán học T = aV^2 và đường thẳng (3)-(1) đi qua O:
            // V1 = 88px -> (1): x1 = 86 + 76 = 162, y1 = 266 - 88 = 178
            // V2 = 176px (2*V1): (3) trên tia O-(1) -> x3 = 86 + 152 = 238, y3 = 266 - 176 = 90
            // (2) trên parabol T = aV^2 -> T2 = 4*T1 -> x2 = 86 + 304 = 390, y2 = 90
            const p1 = { x: 162, y: 178 };
            const p2 = { x: 390, y: 90 };
            const p3 = { x: 238, y: 90 };

            // Đường kéo dài nét đứt từ O đến (1) + vòng tròn nhỏ gần O như ảnh gốc
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 2;
            ctx.setLineDash([6, 5]);
            ctx.beginPath();
            ctx.moveTo(ox, oy);
            ctx.lineTo(p1.x, p1.y);
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.fillStyle = '#0a1226';
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(ox + 16, oy - 18.5, 4.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Đoạn (1) -> (2): nhánh Parabol T = aV^2
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 3.4;
            ctx.beginPath();
            const steps = 40;
            for (let i = 0; i <= steps; i++) {
                const frac = i / steps;
                const vv = 88 + frac * 88;
                const tt = 76 * (vv / 88) * (vv / 88);
                const px = ox + tt;
                const py = oy - vv;
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.stroke();

            // Mũi tên chỉ hướng trên (1) -> (2)
            const vMid12 = 88 + 0.52 * 88;
            const tMid12 = 76 * (vMid12 / 88) * (vMid12 / 88);
            const mx12 = ox + tMid12, my12 = oy - vMid12;
            const vNext = vMid12 + 4, tNext = 76 * (vNext / 88) * (vNext / 88);
            arrowLine(mx12, my12, ox + tNext, oy - vNext, '#38bdf8', 3, 9);

            // Đoạn (2) -> (3): đoạn thẳng ngang vuông góc trục OV
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 3.4;
            ctx.beginPath();
            ctx.moveTo(p2.x, p2.y);
            ctx.lineTo(p3.x, p3.y);
            ctx.stroke();
            arrowLine(326, 90, 304, 90, '#fbbf24', 3, 9);

            // Đoạn (3) -> (1): đoạn thẳng hướng về gốc O
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 3.4;
            ctx.beginPath();
            ctx.moveTo(p3.x, p3.y);
            ctx.lineTo(p1.x, p1.y);
            ctx.stroke();
            arrowLine(206, 127, 192, 143, '#10b981', 3, 9);

            // Điểm chạy 1 chiều sawtooth dọc chu trình (1) -> (2) -> (3) -> (1)
            const saw = (t * 0.16) % 1;
            let dx, dy, dCol;
            if (saw < 0.42) {
                const f = saw / 0.42;
                const vv = 88 + f * 88;
                const tt = 76 * (vv / 88) * (vv / 88);
                dx = ox + tt; dy = oy - vv; dCol = '#38bdf8';
            } else if (saw < 0.72) {
                const f = (saw - 0.42) / 0.30;
                dx = p2.x + (p3.x - p2.x) * f;
                dy = p2.y;
                dCol = '#fbbf24';
            } else {
                const f = (saw - 0.72) / 0.28;
                dx = p3.x + (p1.x - p3.x) * f;
                dy = p3.y + (p1.y - p3.y) * f;
                dCol = '#10b981';
            }
            ctx.fillStyle = dCol;
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2.4;
            ctx.beginPath();
            ctx.arc(dx, dy, 6.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // 3 điểm trạng thái (1), (2), (3)
            const pts = [
                { p: p1, lbl: '(1)', lx: p1.x + 4, ly: p1.y + 22 },
                { p: p2, lbl: '(2)', lx: p2.x + 20, ly: p2.y },
                { p: p3, lbl: '(3)', lx: p3.x - 20, ly: p3.y - 12 }
            ];
            pts.forEach(pt => {
                ctx.fillStyle = '#f8fafc';
                ctx.strokeStyle = '#0f172a';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(pt.p.x, pt.p.y, 5.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = '#f8fafc';
                ctx.font = '800 16.5px "Plus Jakarta Sans", system-ui, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(pt.lbl, pt.lx, pt.ly);
            });

            // Bảng dữ kiện đề bài bên phải (Zero Data Leakage)
            roundBox(454, 48, 314, 240, 10, '#0f172a', '#38bdf8', 2);
            ctx.fillStyle = '#38bdf8';
            ctx.font = '800 15.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText('DỮ KIỆN CHU TRÌNH (1 mol)', 472, 74);

            ctx.fillStyle = '#f8fafc';
            ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            drawSub('• p', '1', 472, 108, '#f8fafc', 16);
            ctx.fillText('= 8,31·10⁵ Pa;  T₁ = 300 K', 506, 104);
            drawSub('• p', '2', 472, 138, '#f8fafc', 16);
            ctx.fillText('= 13,85·10⁵ Pa', 506, 134);

            ctx.fillStyle = '#7dd3fc';
            ctx.fillText('• (1) → (2): Parabol T = aV²', 472, 168);
            ctx.fillStyle = '#94a3b8';
            ctx.fillText('   (đỉnh tại gốc O, a tính K/m⁶)', 472, 192);

            ctx.fillStyle = '#fde68a';
            ctx.fillText('• (2) → (3): Đoạn thẳng ⊥ OV', 472, 224);
            ctx.fillStyle = '#6ee7b7';
            ctx.fillText('• (3) → (1): Đoạn thẳng qua O', 472, 256);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 46 (MH-STAGING-C2-13 · VLXT-DS-VD28-046): Xi lanh thép nằm ngang có ma sát pít-tông: dãn nở 30 cm rồi co lại 25 cm
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C2-13', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
            for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(x, y, bw, bh, r);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function arrowLine(x1, y1, x2, y2, col, lw = 2.8, hl = 8) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }

            function drawSub(base, sub, x, y, col = '#f8fafc', baseSz = 16, align = 'left') {
                const subSz = Math.max(13, Math.round(baseSz * 0.78));
                ctx.save();
                ctx.fillStyle = col;
                ctx.textAlign = 'left';
                ctx.textBaseline = 'alphabetic';
                ctx.font = `800 ${baseSz}px "Plus Jakarta Sans", system-ui, sans-serif`;
                const bw = ctx.measureText(base).width;
                ctx.font = `800 ${subSz}px "Plus Jakarta Sans", system-ui, sans-serif`;
                const sw = sub ? ctx.measureText(sub).width : 0;
                const tot = bw + sw;
                let sx = x;
                if (align === 'center') sx = x - tot / 2;
                else if (align === 'right') sx = x - tot;
                ctx.font = `800 ${baseSz}px "Plus Jakarta Sans", system-ui, sans-serif`;
                ctx.fillText(base, sx, y);
                if (sub) {
                    ctx.font = `800 ${subSz}px "Plus Jakarta Sans", system-ui, sans-serif`;
                    ctx.fillText(sub, sx + bw + 1, y + 4);
                }
                ctx.restore();
            }

            // Tiêu đề
            ctx.save();
            const title = 'XI LANH THÉP NẰM NGANG CÓ MA SÁT PÍT-TÔNG (D = 6 cm)';
            ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            const titleW = Math.min(740, ctx.measureText(title).width + 24);
            roundBox(14, 12, titleW, 30, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, 26, 27);
            ctx.restore();

            // Chu kỳ 2 pha 1 chiều sawtooth:
            // Pha 1 (0..0.52): Truyền nhiệt -> đẩy pít-tông sang phải 30 cm
            // Pha 2 (0.52..1.0): Nguội dần -> co lại vào trong 25 cm
            const cyc = (t * 0.14) % 1;
            const isExpand = cyc < 0.52;
            const pProg = isExpand ? (cyc / 0.52) : ((cyc - 0.52) / 0.48);

            const cylX = 74, cylY = 104, cylW = 368, cylH = 98;
            const xStart = 188, xPeak = 342, xEnd = 214; // 30 cm -> 25 cm tỷ lệ chuẩn (154px vs 128px)
            const pisX = isExpand ? (xStart + pProg * (xPeak - xStart)) : (xPeak - pProg * (xPeak - xEnd));
            const pisW = 16;

            ctx.save();
            // Huy hiệu giai đoạn hoạt động góc trên trái dưới tiêu đề
            const stColor = isExpand ? '#f97316' : '#38bdf8';
            const stText = isExpand ? 'GIAI ĐOẠN 1: NHẬN NHIỆT, DÃN NỞ (+30 cm)' : 'GIAI ĐOẠN 2: NGUỘI ĐI, CO LẠI (-25 cm)';
            ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            const stW = ctx.measureText(stText).width + 22;
            roundBox(54, 52, stW, 28, 6, '#0f172a', stColor, 1.8);
            ctx.fillStyle = stColor;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(stText, 65, 66);

            // Nền khí bên trong xi lanh
            const gasAlpha = isExpand ? (0.20 + pProg * 0.18) : (0.36 - pProg * 0.18);
            ctx.fillStyle = isExpand ? `rgba(249, 115, 22, ${gasAlpha.toFixed(2)})` : `rgba(56, 189, 248, ${gasAlpha.toFixed(2)})`;
            ctx.fillRect(cylX + 2, cylY + 2, pisX - cylX - 2, cylH - 4);

            // Phân tử khí chuyển động nhiệt (phân bố đều không kết chuỗi)
            const spd = isExpand ? (2.2 + pProg * 2.0) : (4.0 - pProg * 2.2);
            ctx.fillStyle = isExpand ? '#fdba74' : '#7dd3fc';
            for (let i = 0; i < 16; i++) {
                const span = Math.max(24, pisX - cylX - 18);
                const rx = ((i * 73 + 19) % 100) / 100;
                const ry = ((i * 47 + 31) % 100) / 100;
                const mx = cylX + 10 + rx * span + Math.sin(t * spd + i * 1.4) * 5;
                const my = cylY + 14 + ry * (cylH - 28) + Math.cos(t * (spd * 1.1) + i * 1.9) * 5;
                ctx.beginPath();
                ctx.arc(Math.min(pisX - 6, Math.max(cylX + 7, mx)), my, 3.2, 0, Math.PI * 2);
                ctx.fill();
            }

            // Thành xi lanh thép (kín bên trái, hở miệng phải)
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 4;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(cylX + cylW, cylY);
            ctx.lineTo(cylX, cylY);
            ctx.lineTo(cylX, cylY + cylH);
            ctx.lineTo(cylX + cylW, cylY + cylH);
            ctx.stroke();

            // Ký hiệu đường kính D = 6 cm bên trái xi lanh
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 1.8;
            ctx.setLineDash([4, 3]);
            ctx.beginPath();
            ctx.moveTo(cylX, cylY); ctx.lineTo(30, cylY);
            ctx.moveTo(cylX, cylY + cylH); ctx.lineTo(30, cylY + cylH);
            ctx.stroke();
            ctx.setLineDash([]);
            arrowLine(38, cylY + cylH / 2, 38, cylY + 3, '#cbd5e1', 2.2, 7);
            arrowLine(38, cylY + cylH / 2, 38, cylY + cylH - 3, '#cbd5e1', 2.2, 7);
            roundBox(14, cylY + cylH / 2 - 15, 52, 30, 6, '#0f172a', '#94a3b8', 1.8);
            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('6 cm', 40, cylY + cylH / 2);

            // Pít-tông sát khít thành trên/dưới
            roundBox(pisX, cylY + 2, pisW, cylH - 4, 2, '#94a3b8', '#f8fafc', 2.2);

            // Các mũi tên lực & chiều chuyển động quanh pít-tông (kèm pill nền tối chống đè chấm)
            if (isExpand) {
                for (let qx = 112; qx <= 176; qx += 32) {
                    arrowLine(qx, 232, qx, 208, '#f97316', 2.6, 7);
                }
                ctx.fillStyle = '#fb923c';
                ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('Truyền nhiệt Q', 144, 248);

                arrowLine(pisX - 38, cylY + 28, pisX - 4, cylY + 28, '#fbbf24', 3, 8);
                roundBox(pisX - 88, cylY + 14, 46, 28, 6, '#0f172a', '#fbbf24', 1.6);
                drawSub('F', 'khí', pisX - 65, cylY + 33, '#fbbf24', 16, 'center');

                arrowLine(pisX + pisW + 46, cylY + 28, pisX + pisW + 6, cylY + 28, '#38bdf8', 3, 8);
                roundBox(pisX + pisW + 50, cylY + 14, 34, 28, 6, '#0f172a', '#38bdf8', 1.6);
                drawSub('F', '0', pisX + pisW + 67, cylY + 33, '#38bdf8', 16, 'center');

                arrowLine(pisX + 8, cylY + cylH - 18, pisX - 34, cylY + cylH - 18, '#ef4444', 3, 8);
                roundBox(pisX - 88, cylY + cylH - 32, 50, 28, 6, '#0f172a', '#ef4444', 1.6);
                drawSub('F', 'ms', pisX - 63, cylY + cylH - 13, '#fca5a5', 16, 'center');

                ctx.strokeStyle = '#fbbf24';
                ctx.lineWidth = 1.8;
                ctx.setLineDash([4, 4]);
                ctx.beginPath();
                ctx.moveTo(xStart, cylY + cylH); ctx.lineTo(xStart, 232);
                ctx.moveTo(xPeak, cylY + cylH); ctx.lineTo(xPeak, 232);
                ctx.stroke();
                ctx.setLineDash([]);
                arrowLine(xStart + 4, 224, xPeak - 4, 224, '#fbbf24', 2.4, 7);
                roundBox((xStart + xPeak) / 2 - 42, 234, 84, 28, 6, '#0f172a', '#fbbf24', 1.8);
                ctx.fillStyle = '#fde68a';
                ctx.font = '800 14.5px "DM Mono", monospace';
                ctx.textAlign = 'center';
                ctx.fillText('30 cm', (xStart + xPeak) / 2, 248);
            } else {
                for (let qx = 112; qx <= 176; qx += 32) {
                    arrowLine(qx, 208, qx, 232, '#38bdf8', 2.6, 7);
                }
                ctx.fillStyle = '#7dd3fc';
                ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('Tỏa nhiệt ra ngoài', 144, 248);

                arrowLine(pisX + pisW + 46, cylY + 28, pisX + pisW + 6, cylY + 28, '#38bdf8', 3, 8);
                roundBox(pisX + pisW + 50, cylY + 14, 34, 28, 6, '#0f172a', '#38bdf8', 1.6);
                drawSub('F', '0', pisX + pisW + 67, cylY + 33, '#38bdf8', 16, 'center');

                arrowLine(pisX - 38, cylY + 28, pisX - 4, cylY + 28, '#fbbf24', 3, 8);
                roundBox(pisX - 88, cylY + 14, 46, 28, 6, '#0f172a', '#fbbf24', 1.6);
                drawSub('F', 'khí', pisX - 65, cylY + 33, '#fbbf24', 16, 'center');

                arrowLine(pisX + 8, cylY + cylH - 18, pisX + 52, cylY + cylH - 18, '#ef4444', 3, 8);
                roundBox(pisX + 56, cylY + cylH - 32, 50, 28, 6, '#0f172a', '#ef4444', 1.6);
                drawSub('F', 'ms', pisX + 81, cylY + cylH - 13, '#fca5a5', 16, 'center');

                ctx.strokeStyle = '#38bdf8';
                ctx.lineWidth = 1.8;
                ctx.setLineDash([4, 4]);
                ctx.beginPath();
                ctx.moveTo(xEnd, cylY + cylH); ctx.lineTo(xEnd, 232);
                ctx.moveTo(xPeak, cylY + cylH); ctx.lineTo(xPeak, 232);
                ctx.stroke();
                ctx.setLineDash([]);
                arrowLine(xPeak - 4, 224, xEnd + 4, 224, '#38bdf8', 2.4, 7);
                roundBox((xEnd + xPeak) / 2 - 42, 234, 84, 28, 6, '#0f172a', '#38bdf8', 1.8);
                ctx.fillStyle = '#7dd3fc';
                ctx.font = '800 14.5px "DM Mono", monospace';
                ctx.textAlign = 'center';
                ctx.fillText('25 cm', (xEnd + xPeak) / 2, 248);
            }

            // Bảng thông số đề bài bên phải (Zero Data Leakage)
            roundBox(470, 48, 298, 240, 10, '#0f172a', '#cbd5e1', 2);
            ctx.fillStyle = '#38bdf8';
            ctx.font = '800 15.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('THÔNG SỐ XI LANH THÉP', 488, 74);

            ctx.fillStyle = '#f8fafc';
            ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillText('• Đường kính: D = 6 cm', 488, 106);
            drawSub('• F', 'ms cực đại', 488, 140, '#fca5a5', 16);
            ctx.fillText('= trượt = 35 N', 588, 136);
            drawSub('• p', '0', 488, 172, '#f8fafc', 16);
            ctx.fillText(' = 101 325 Pa (bên ngoài)', 524, 168);
            ctx.fillStyle = '#fb923c';
            ctx.fillText('• Dãn nở đẩy ra đều: 30 cm', 488, 204);
            ctx.fillStyle = '#7dd3fc';
            ctx.fillText('• Nguội dần co vào: 25 cm', 488, 234);
            ctx.fillStyle = '#94a3b8';
            ctx.fillText('• Pít-tông rất nhẹ, hình trụ mỏng', 488, 264);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 47 (MH-STAGING-C2-14 · VLXT-DS-VD28-047): Nén đẳng nhiệt 0,1 mol khí Helium trong xi lanh đứng bằng quả nặng 15 kg
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C2-14', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
            for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(x, y, bw, bh, r);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function arrowLine(x1, y1, x2, y2, col, lw = 2.6, hl = 8) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }

            function drawOpenCylinder(x, yTop, cw, ch) {
                ctx.save();
                ctx.strokeStyle = '#cbd5e1';
                ctx.lineWidth = 3.4;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.beginPath();
                ctx.moveTo(x, yTop);
                ctx.lineTo(x, yTop + ch);
                ctx.lineTo(x + cw, yTop + ch);
                ctx.lineTo(x + cw, yTop);
                ctx.stroke();
                ctx.restore();
            }

            // Tiêu đề
            ctx.save();
            const title = 'NÉN ĐẲNG NHIỆT KHÍ HELIUM BẰNG QUẢ NẶNG 15 kg (t = 27°C)';
            ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            const titleW = Math.min(740, ctx.measureText(title).width + 24);
            roundBox(14, 12, titleW, 30, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, 26, 27);
            ctx.restore();

            // Chu kỳ 1 chiều sawtooth: đặt quả nặng -> nén xuống đoạn d -> reset
            const saw = (t * 0.2) % 1;
            const dropFrac = Math.min(1, saw / 0.25);
            const compFrac = saw > 0.25 ? Math.min(1, (saw - 0.25) / 0.55) : 0;

            const c1x = 56, c2x = 242, cw = 118, yTop = 86, ch = 170;
            const yBot = yTop + ch; // 256
            const pisH = 16;
            const yPis1 = 144;
            const yPis2 = yPis1 + compFrac * 36; // xuống tới 180

            ctx.save();
            // --- XI LANH TRÁI: TRẠNG THÁI BAN ĐẦU ---
            ctx.fillStyle = 'rgba(56, 189, 248, 0.22)';
            ctx.fillRect(c1x + 2, yPis1 + pisH, cw - 4, yBot - (yPis1 + pisH) - 2);
            // Phân tử khí He
            ctx.fillStyle = '#7dd3fc';
            for (let i = 0; i < 14; i++) {
                const px = c1x + 14 + ((i * 29) % (cw - 28)) + Math.sin(t * 2.8 + i) * 3.5;
                const py = yPis1 + pisH + 12 + ((i * 19) % 74) + Math.cos(t * 3.1 + i) * 3.5;
                ctx.beginPath(); ctx.arc(px, py, 3.2, 0, Math.PI * 2); ctx.fill();
            }
            // Pít-tông sát thành trong
            roundBox(c1x + 2, yPis1, cw - 4, pisH, 2, '#475569', '#f8fafc', 2.2);
            drawOpenCylinder(c1x, yTop, cw, ch);

            // Áp suất khí quyển p0 tác dụng xuống mặt trên pít-tông
            arrowLine(c1x + cw / 2, 56, c1x + cw / 2, 86, '#38bdf8', 2.6, 7);
            ctx.fillStyle = '#7dd3fc';
            ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('p₀', c1x + cw / 2 + 16, 68);

            roundBox(c1x - 10, 264, cw + 20, 26, 6, '#0f172a', '#64748b', 1.6);
            ctx.fillStyle = '#e2e8f0';
            ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillText('TRẠNG THÁI ĐẦU', c1x + cw / 2, 277);

            // Mũi tên chuyển trạng thái ở giữa
            arrowLine(186, 170, 228, 170, '#fbbf24', 3, 8);

            // --- XI LANH PHẢI: ĐẶT QUẢ NẶNG 15 kg ---
            ctx.fillStyle = `rgba(56, 189, 248, ${(0.22 + compFrac * 0.2).toFixed(2)})`;
            ctx.fillRect(c2x + 2, yPis2 + pisH, cw - 4, yBot - (yPis2 + pisH) - 2);

            // Phân tử khí He bị nén dày đặc hơn
            ctx.fillStyle = '#fde047';
            const availH = Math.max(26, yBot - (yPis2 + pisH) - 22);
            for (let i = 0; i < 14; i++) {
                const px = c2x + 14 + ((i * 29) % (cw - 28)) + Math.sin(t * 2.8 + i) * 3.5;
                const py = yPis2 + pisH + 10 + ((i * 17) % availH) + Math.cos(t * 3.1 + i) * 3;
                ctx.beginPath(); ctx.arc(px, py, 3.2, 0, Math.PI * 2); ctx.fill();
            }

            // Pít-tông phải
            roundBox(c2x + 2, yPis2, cw - 4, pisH, 2, '#475569', '#f8fafc', 2.2);

            // Quả nặng bậc thang khớp hình gốc 047.png đặt lên pít-tông
            const wtY = 96 + dropFrac * (yPis2 - 96);
            // Đế lớn quả nặng
            roundBox(c2x + 18, wtY - 26, cw - 36, 25, 3, '#334155', '#e2e8f0', 2);
            // Núm cầm quả nặng phía trên
            roundBox(c2x + 40, wtY - 36, cw - 80, 10, 2, '#64748b', '#e2e8f0', 1.8);
            roundBox(c2x + 32, wtY - 45, cw - 64, 9, 3, '#94a3b8', '#f8fafc', 1.8);
            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('15 kg', c2x + cw / 2, wtY - 13);

            drawOpenCylinder(c2x, yTop, cw, ch);

            // Đường gióng chỉ độ dịch chuyển d ở bên phải xi lanh 2
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 1.6;
            ctx.setLineDash([4, 3]);
            ctx.beginPath();
            ctx.moveTo(c2x + cw, yPis1); ctx.lineTo(c2x + cw + 34, yPis1);
            ctx.moveTo(c2x + cw, yPis2); ctx.lineTo(c2x + cw + 34, yPis2);
            ctx.stroke();
            ctx.setLineDash([]);
            if (yPis2 - yPis1 > 10) {
                arrowLine(c2x + cw + 20, yPis1 + 2, c2x + cw + 20, yPis2 - 2, '#fbbf24', 2.4, 6);
            }
            ctx.fillStyle = '#fbbf24';
            ctx.font = 'italic 800 16px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('d', c2x + cw + 36, (yPis1 + yPis2) / 2 + 1);

            roundBox(c2x - 10, 264, cw + 20, 26, 6, '#0f172a', '#fbbf24', 1.6);
            ctx.fillStyle = '#fde68a';
            ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('ĐẶT QUẢ NẶNG', c2x + cw / 2, 277);

            // Thẻ thông số đề dẫn bên phải (Zero Data Leakage)
            roundBox(424, 48, 342, 240, 10, '#0f172a', '#38bdf8', 2);
            ctx.fillStyle = '#38bdf8';
            ctx.font = '800 15.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('THÔNG SỐ NÉN ĐẲNG NHIỆT (He)', 442, 74);

            ctx.fillStyle = '#f8fafc';
            ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillText('• Số mol khí Helium: n = 0,1 mol', 442, 108);
            ctx.fillText('• Nhiệt độ không đổi: t = 27°C', 442, 138);
            ctx.fillText('• Áp suất khí quyển: p₀ = 10⁵ Pa', 442, 168);
            ctx.fillText('• Tiết diện pít-tông: S = 1,25 dm²', 442, 198);
            ctx.fillStyle = '#fde68a';
            ctx.fillText('• Quả nặng đặt thêm: m = 15 kg', 442, 228);
            ctx.fillStyle = '#94a3b8';
            ctx.fillText('• g = 10 m/s² (bỏ qua m pít-tông)', 442, 258);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 48 (MH-STAGING-C2-15 · VLXT-DS-VD28-048): Hệ thống cảnh báo nhiệt độ kho lạnh bằng xi lanh khí, đòn bẩy AOB và cân điện tử
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C2-15', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
            for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(x, y, bw, bh, r);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function drawSub(base, sub, x, y, col = '#f8fafc', baseSz = 16, align = 'left') {
                const subSz = Math.max(13, Math.round(baseSz * 0.78));
                ctx.save();
                ctx.fillStyle = col;
                ctx.textAlign = 'left';
                ctx.textBaseline = 'alphabetic';
                ctx.font = `800 ${baseSz}px "Plus Jakarta Sans", system-ui, sans-serif`;
                const bw = ctx.measureText(base).width;
                ctx.font = `800 ${subSz}px "Plus Jakarta Sans", system-ui, sans-serif`;
                const sw = sub ? ctx.measureText(sub).width : 0;
                const tot = bw + sw;
                let sx = x;
                if (align === 'center') sx = x - tot / 2;
                else if (align === 'right') sx = x - tot;
                ctx.font = `800 ${baseSz}px "Plus Jakarta Sans", system-ui, sans-serif`;
                ctx.fillText(base, sx, y);
                if (sub) {
                    ctx.font = `800 ${subSz}px "Plus Jakarta Sans", system-ui, sans-serif`;
                    ctx.fillText(sub, sx + bw + 1, y + 4);
                }
                ctx.restore();
            }

            // Tiêu đề
            ctx.save();
            const title = 'HỆ THỐNG CẢNH BÁO KHO LẠNH (ĐÒN BẨY AOB & CÂN ĐIỆN TỬ)';
            ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            const titleW = Math.min(740, ctx.measureText(title).width + 24);
            roundBox(14, 12, titleW, 30, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, 26, 27);
            ctx.restore();

            // Chu kỳ làm lạnh 1 chiều sawtooth: T giảm dần -> cân điện tử giảm về 00.00 -> loa báo động kêu
            const saw = (t * 0.16) % 1;
            const coolFrac = Math.min(1, saw / 0.82);
            const alarmOn = saw >= 0.82;

            // Mặt sàn cố định
            const floorY = 276;
            ctx.save();
            ctx.strokeStyle = '#475569';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(22, floorY);
            ctx.lineTo(466, floorY);
            ctx.stroke();

            // 1. XI LANH KÍN ĐẶT TRÊN SÀN (TRÁI)
            const cx = 48, cyTop = 140, cw = 108, ch = floorY - cyTop; // 136px
            const pisY = 182;
            const pisH = 24;
            // Khoang khí trong xi lanh (xanh lạnh hơn khi coolFrac tăng)
            ctx.fillStyle = `rgba(56, 189, 248, ${(0.22 + coolFrac * 0.16).toFixed(2)})`;
            ctx.fillRect(cx + 2, pisY + pisH, cw - 4, floorY - (pisY + pisH) - 2);

            // Phân tử khí chuyển động chậm dần khi kho lạnh giảm nhiệt độ (phân bố đều)
            const spd = 3.2 - coolFrac * 1.8;
            ctx.fillStyle = '#bae6fd';
            for (let i = 0; i < 14; i++) {
                const rx = ((i * 73 + 17) % 100) / 100;
                const ry = ((i * 47 + 29) % 100) / 100;
                const mx = cx + 12 + rx * (cw - 24) + Math.sin(t * spd + i * 1.3) * 3;
                const my = pisY + pisH + 10 + ry * 32 + Math.cos(t * spd + i * 1.7) * 3;
                ctx.beginPath(); ctx.arc(mx, my, 2.8, 0, Math.PI * 2); ctx.fill();
            }

            // Thành xi lanh hở miệng trên (U-shape)
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 3.4;
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(cx, cyTop);
            ctx.lineTo(cx, floorY);
            ctx.lineTo(cx + cw, floorY);
            ctx.lineTo(cx + cw, cyTop);
            ctx.stroke();

            // Pít-tông m1 sát thành trong (cao 24px để m₁ nằm gọn hoàn toàn bên trong)
            roundBox(cx + 2, pisY, cw - 4, pisH, 2, '#334155', '#f8fafc', 2.2);
            drawSub('m', '1', cx + cw / 2, pisY + 17, '#f8fafc', 16, 'center');

            // Nhãn chiều cao 40 cm
            roundBox(cx + cw / 2 - 32, floorY - 28, 64, 22, 5, '#0f172a', '#38bdf8', 1.4);
            ctx.fillStyle = '#7dd3fc';
            ctx.font = '800 14.5px "DM Mono", monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('40 cm', cx + cw / 2, floorY - 17);

            // 2. ĐÒN BẨY CỨNG AB & TRỤC QUAY CỐ ĐỊNH O (OA = OB)
            const ax = cx + cw / 2; // 102
            const bx = 408;
            const ox = (ax + bx) / 2; // 255
            const barY = 82;

            // Trụ đỡ & khớp tròn tâm O
            ctx.fillStyle = '#334155';
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 2.6;
            ctx.beginPath();
            ctx.arc(ox, barY + 20, 17, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Thanh cứng AB nằm ngang
            roundBox(ax - 3, barY - 6, bx - ax + 6, 8, 2, '#cbd5e1', '#f8fafc', 1.8);
            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 16px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('A', ax, barY - 18);
            ctx.fillText('O', ox, barY - 18);
            ctx.fillText('B', bx, barY - 18);

            // Sợi dây đầu A nối xuống pít-tông m1
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 2.6;
            ctx.beginPath();
            ctx.moveTo(ax, barY + 2);
            ctx.lineTo(ax, pisY);
            ctx.stroke();

            // Sợi dây đầu B nối xuống vật nặng m2
            const m2TopY = alarmOn ? 168 : 174;
            ctx.beginPath();
            ctx.moveTo(bx, barY + 2);
            ctx.lineTo(bx, m2TopY);
            ctx.stroke();

            // 3. VẬT NẶNG m2 & CÂN ĐIỆN TỬ (PHẢI)
            roundBox(bx - 30, m2TopY, 60, 34, 4, '#1e293b', '#f8fafc', 2.4);
            drawSub('m', '2', bx, m2TopY + 23, '#f8fafc', 16, 'center');

            // Mặt cân điện tử & thân cân
            const panY = 212;
            roundBox(bx - 48, panY, 96, 8, 3, '#cbd5e1', '#f8fafc', 1.6);
            roundBox(bx - 16, panY + 8, 32, 8, 2, '#64748b', '#94a3b8', 1.4);
            // Thân hình thang cân điện tử
            ctx.fillStyle = '#475569';
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 2.2;
            ctx.beginPath();
            ctx.moveTo(bx - 36, panY + 16);
            ctx.lineTo(bx + 36, panY + 16);
            ctx.lineTo(bx + 46, floorY);
            ctx.lineTo(bx - 46, floorY);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Màn hình LCD cân điện tử (giảm dần về 00.00 mà không lộ số trung gian)
            roundBox(bx - 34, panY + 24, 68, 28, 4, '#0f172a', alarmOn ? '#ef4444' : '#38bdf8', 1.8);
            if (alarmOn) {
                ctx.fillStyle = '#fca5a5';
                ctx.font = '800 15px "DM Mono", monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('00.00', bx, panY + 38);
            } else {
                // Thanh mức lực nén N2 giảm dần 1 chiều về 0
                const barW = Math.max(4, (1 - coolFrac) * 52);
                ctx.fillStyle = '#38bdf8';
                ctx.fillRect(bx - 26, panY + 32, barW, 12);
            }

            // Chỉ thị nhiệt độ kho lạnh giảm & Loa báo động khi về 0.00
            roundBox(182, 148, 146, 54, 8, '#0f172a', alarmOn ? '#ef4444' : '#38bdf8', 2);
            ctx.fillStyle = alarmOn ? '#fca5a5' : '#7dd3fc';
            ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(alarmOn ? 'CÂN = 0,00' : 'NHIỆT ĐỘ KHO ↓', 255, 166);
            ctx.fillStyle = alarmOn ? '#ef4444' : '#cbd5e1';
            ctx.fillText(alarmOn ? 'LOA BÁO ĐỘNG!' : 'T giảm từ 27°C', 255, 187);

            // Thẻ thông số đề dẫn bên phải (Zero Data Leakage)
            roundBox(476, 48, 290, 240, 10, '#0f172a', '#38bdf8', 2);
            ctx.fillStyle = '#38bdf8';
            ctx.font = '800 15.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('THÔNG SỐ HỆ CẢNH BÁO', 492, 74);

            ctx.fillStyle = '#f8fafc';
            ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillText('• Xi lanh: S = 50 cm²; h = 40 cm', 492, 108);
            ctx.fillText('• Pít-tông: m₁ = 1,5 kg', 492, 138);
            ctx.fillText('• Thanh cứng OA = OB', 492, 168);
            ctx.fillText('• Vật trên cân: m₂ = 6,0 kg', 492, 198);
            ctx.fillText('• Ở 27°C: p = 98 750 Pa', 492, 228);
            ctx.fillStyle = '#94a3b8';
            ctx.fillText('• p₀ = 10⁵ Pa; g = 10 m/s²', 492, 258);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 49 (MH-STAGING-C2-16 · VLXT-DS-VD28-049): Đun nóng từ từ khối khí trong xi lanh thẳng đứng từ 27°C đến 97°C (quá trình đẳng áp)
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C2-16', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
            for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(x, y, bw, bh, r);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function arrowLine(x1, y1, x2, y2, col, lw = 2.6, hl = 8) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }

            // Tiêu đề
            ctx.save();
            const title = 'ĐUN NÓNG TỪ TỪ KHÍ TRONG XI LANH ĐỨNG (27°C → 97°C)';
            ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            const titleW = Math.min(740, ctx.measureText(title).width + 24);
            roundBox(14, 12, titleW, 30, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, 26, 27);
            ctx.restore();

            // Biến thiên 1 chiều sawtooth: nung từ 27°C -> 97°C, chiều cao cột khí h tăng ~23%
            const saw = (t * 0.18) % 1;
            const cx = 148, cw = 104, yTop = 58, yBase = 194;
            const h1 = 62, h2 = Math.round(62 * (370 / 300)); // ~76px
            const colH = h1 + saw * (h2 - h1);
            const pisBotY = yBase - colH;

            ctx.save();
            // Bàn & Giá kiềng đỡ xi lanh
            ctx.strokeStyle = '#64748b';
            ctx.lineWidth = 3.2;
            ctx.beginPath();
            ctx.moveTo(116, yBase + 3); ctx.lineTo(284, yBase + 3);
            ctx.moveTo(126, yBase + 3); ctx.lineTo(126, 286);
            ctx.moveTo(274, yBase + 3); ctx.lineTo(274, 286);
            ctx.moveTo(96, 286); ctx.lineTo(304, 286);
            ctx.stroke();

            // Đèn cồn bên dưới đáy xi lanh (khớp ảnh gốc 049.png)
            const bx = cx + cw / 2; // 200
            roundBox(bx - 30, 248, 60, 38, 12, 'rgba(30, 41, 59, 0.85)', '#cbd5e1', 2.4);
            roundBox(bx - 12, 236, 24, 12, 3, '#e2e8f0', '#94a3b8', 1.8);
            ctx.strokeStyle = '#f8fafc';
            ctx.lineWidth = 2.6;
            ctx.beginPath();
            ctx.moveTo(bx, 236); ctx.quadraticCurveTo(bx - 4, 260, bx - 12, 278);
            ctx.stroke();

            // Ngọn lửa đèn cồn 2 lớp
            const sway = Math.sin(t * 11) * 1.8;
            const fh = 24 + Math.sin(t * 15) * 2.5;
            ctx.fillStyle = '#f97316';
            ctx.beginPath();
            ctx.moveTo(bx - 8, 236);
            ctx.quadraticCurveTo(bx - 11, 218, bx + sway, 236 - fh);
            ctx.quadraticCurveTo(bx + 11, 218, bx + 8, 236);
            ctx.closePath(); ctx.fill();
            ctx.fillStyle = '#fde047';
            ctx.beginPath();
            ctx.moveTo(bx - 4, 236);
            ctx.quadraticCurveTo(bx - 5, 223, bx + sway * 0.6, 236 - fh * 0.6);
            ctx.quadraticCurveTo(bx + 5, 223, bx + 4, 236);
            ctx.closePath(); ctx.fill();

            // Cột khí bên trong xi lanh (ấm dần theo saw)
            const gasGrad = ctx.createLinearGradient(0, pisBotY, 0, yBase);
            gasGrad.addColorStop(0, 'rgba(56, 189, 248, 0.24)');
            gasGrad.addColorStop(1, `rgba(249, 115, 22, ${(0.22 + saw * 0.26).toFixed(2)})`);
            ctx.fillStyle = gasGrad;
            ctx.fillRect(cx + 2, pisBotY, cw - 4, yBase - pisBotY - 2);

            // Phân tử khí chuyển động nhanh dần khi nung (phân bố đều)
            const spd = 2.6 + saw * 2.4;
            ctx.fillStyle = '#fde68a';
            for (let i = 0; i < 12; i++) {
                const rx = ((i * 73 + 17) % 100) / 100;
                const ry = ((i * 47 + 23) % 100) / 100;
                const px = cx + 12 + rx * (cw - 24) + Math.sin(t * spd + i * 1.4) * 3.5;
                const py = pisBotY + 10 + ry * Math.max(20, colH - 20) + Math.cos(t * spd + i * 1.9) * 3.5;
                ctx.beginPath(); ctx.arc(px, py, 2.8, 0, Math.PI * 2); ctx.fill();
            }

            // Pít-tông + trục đẩy lên trên (khớp 049.png)
            const pisH = 22;
            roundBox(cx + 2, pisBotY - pisH, cw - 4, pisH, 2, '#64748b', '#f8fafc', 2.2);
            ctx.fillStyle = '#cbd5e1';
            ctx.fillRect(bx - 4, 48, 8, pisBotY - pisH - 48);

            // Thành xi lanh hở miệng trên
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 3.4;
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(cx, yTop);
            ctx.lineTo(cx, yBase);
            ctx.lineTo(cx + cw, yBase);
            ctx.lineTo(cx + cw, yTop);
            ctx.stroke();

            // Đường gióng & mũi tên 2 đầu h bên phải (khớp 049.png)
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 1.6;
            ctx.setLineDash([4, 3]);
            ctx.beginPath();
            ctx.moveTo(cx + cw, pisBotY); ctx.lineTo(316, pisBotY);
            ctx.moveTo(cx + cw, yBase); ctx.lineTo(316, yBase);
            ctx.stroke();
            ctx.setLineDash([]);
            arrowLine(302, (pisBotY + yBase) / 2, 302, pisBotY + 3, '#fbbf24', 2.4, 7);
            arrowLine(302, (pisBotY + yBase) / 2, 302, yBase - 3, '#fbbf24', 2.4, 7);
            ctx.fillStyle = '#fbbf24';
            ctx.font = 'italic 800 17px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText('h', 318, (pisBotY + yBase) / 2);

            // Nhiệt kế bên trái hiển thị nhiệt độ tăng 1 chiều 27°C -> 97°C
            const tx = 66, tyTop = 76, tyBot = 216;
            roundBox(tx - 7, tyTop, 14, tyBot - tyTop, 7, '#0f172a', '#cbd5e1', 2.2);
            ctx.fillStyle = '#ef4444';
            ctx.beginPath(); ctx.arc(tx, tyBot + 7, 11, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            const fillH = 38 + saw * 78;
            ctx.fillRect(tx - 3.5, tyBot - fillH, 7, fillH + 4);
            const curT = Math.round(27 + saw * 70);
            roundBox(26, 238, 80, 30, 6, '#0f172a', '#ef4444', 1.8);
            ctx.fillStyle = '#fca5a5';
            ctx.font = '800 15px "DM Mono", monospace';
            ctx.textAlign = 'center';
            ctx.fillText(`${curT}°C`, 66, 253);

            // Thẻ thông số đề dẫn bên phải (Zero Data Leakage)
            roundBox(404, 48, 362, 240, 10, '#0f172a', '#f97316', 2);
            ctx.fillStyle = '#fb923c';
            ctx.font = '800 15.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('ĐUN NÓNG TỪ TỪ TRONG XI LANH', 422, 74);

            ctx.fillStyle = '#f8fafc';
            ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillText('• Pít-tông không ma sát:', 422, 106);
            ctx.fillText('  m = 100 g;  S = 20 cm²', 422, 134);
            ctx.fillText('• Ban đầu: h₀ = 10 cm;  t₁ = 27°C', 422, 166);
            ctx.fillStyle = '#fde68a';
            ctx.fillText('• Đun nóng từ từ đến: t₂ = 97°C', 422, 198);
            ctx.fillStyle = '#f8fafc';
            ctx.fillText('• Áp suất khí quyển: p₀ = 10⁵ Pa', 422, 230);
            ctx.fillStyle = '#94a3b8';
            ctx.fillText('• Gia tốc trọng trường: g = 10 m/s²', 422, 260);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 50 (MH-STAGING-C2-17 · VLXT-DS-VD28-050): Đồ thị chu trình p – V gồm đẳng áp (1–2), đẳng nhiệt (2–3), đẳng tích (3–4) và đẳng nhiệt (4–1)
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C2-17', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
            for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(x, y, bw, bh, r);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function arrowLine(x1, y1, x2, y2, col, lw = 2.8, hl = 9) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }

            function drawSub(base, sub, x, y, col = '#f8fafc', baseSz = 16, align = 'left') {
                const subSz = Math.max(13, Math.round(baseSz * 0.78));
                ctx.save();
                ctx.fillStyle = col;
                ctx.textAlign = 'left';
                ctx.textBaseline = 'alphabetic';
                ctx.font = `800 ${baseSz}px "Plus Jakarta Sans", system-ui, sans-serif`;
                const bw = ctx.measureText(base).width;
                ctx.font = `800 ${subSz}px "Plus Jakarta Sans", system-ui, sans-serif`;
                const sw = sub ? ctx.measureText(sub).width : 0;
                const tot = bw + sw;
                let sx = x;
                if (align === 'center') sx = x - tot / 2;
                else if (align === 'right') sx = x - tot;
                ctx.font = `800 ${baseSz}px "Plus Jakarta Sans", system-ui, sans-serif`;
                ctx.fillText(base, sx, y);
                if (sub) {
                    ctx.font = `800 ${subSz}px "Plus Jakarta Sans", system-ui, sans-serif`;
                    ctx.fillText(sub, sx + bw + 1, y + 4);
                }
                ctx.restore();
            }

            // Tiêu đề
            ctx.save();
            const title = 'CHU TRÌNH p – V CỦA KHÍ LÝ TƯỞNG (2 ĐẲNG NHIỆT)';
            ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            const titleW = Math.min(740, ctx.measureText(title).width + 24);
            roundBox(14, 12, titleW, 30, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, 26, 27);
            ctx.restore();

            // Hệ trục p - V bên trái (khớp 100% ảnh gốc 050.png và tỉ lệ 1,5 V2 = 4,8 V1)
            const ox = 86, oy = 256;
            arrowLine(ox, oy + 4, ox, 48, '#f1f5f9', 2.8, 9);
            arrowLine(ox - 4, oy, 444, oy, '#f1f5f9', 2.8, 9);

            ctx.save();
            ctx.fillStyle = '#f8fafc';
            ctx.font = 'italic 800 17px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            ctx.fillText('p', ox - 12, 56);
            ctx.textAlign = 'center';
            ctx.fillText('V', 432, oy + 20);
            ctx.font = '800 16px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillText('O', ox - 16, oy + 16);

            // Tọa độ chính xác theo hyperbol đẳng nhiệt p*V = const & V2 = 3.2 * V1:
            const vx1 = 54, vx2 = 173, vx4 = 294;
            const py1 = 174;
            const k23 = vx2 * py1;
            const k41 = vx1 * py1;
            const py3 = k23 / vx4; // 102.4
            const py4 = k41 / vx4; // 32.0

            const p1 = { x: ox + vx1, y: oy - py1 }; // (140, 82)
            const p2 = { x: ox + vx2, y: oy - py1 }; // (259, 82)
            const p3 = { x: ox + vx4, y: oy - py3 }; // (380, 153.6)
            const p4 = { x: ox + vx4, y: oy - py4 }; // (380, 224)

            // Đường gióng nét đứt tới hai trục
            ctx.strokeStyle = '#64748b';
            ctx.lineWidth = 1.6;
            ctx.setLineDash([5, 4]);
            ctx.beginPath();
            ctx.moveTo(ox, p1.y); ctx.lineTo(p2.x, p1.y);
            ctx.moveTo(ox, p3.y); ctx.lineTo(p3.x, p3.y);
            ctx.moveTo(ox, p4.y); ctx.lineTo(p4.x, p4.y);
            ctx.moveTo(p1.x, p1.y); ctx.lineTo(p1.x, oy);
            ctx.moveTo(p2.x, p2.y); ctx.lineTo(p2.x, oy);
            ctx.moveTo(p4.x, p4.y); ctx.lineTo(p4.x, oy);
            ctx.stroke();
            ctx.setLineDash([]);

            // Nhãn giá trị trên 2 trục
            drawSub('p', '1', ox - 10, p1.y + 5, '#e2e8f0', 15.5, 'right');
            drawSub('p', '3', ox - 10, p3.y + 5, '#e2e8f0', 15.5, 'right');
            drawSub('p', '4', ox - 10, p4.y + 5, '#e2e8f0', 15.5, 'right');
            drawSub('V', '1', p1.x, oy + 20, '#e2e8f0', 15.5, 'center');
            drawSub('V', '2', p2.x, oy + 20, '#e2e8f0', 15.5, 'center');
            drawSub('V', '4', p4.x, oy + 20, '#e2e8f0', 15.5, 'center');

            // 1) Đường (1) -> (2) ngang
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 3.4;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
            arrowLine((p1.x + p2.x) / 2 - 12, p1.y, (p1.x + p2.x) / 2 + 12, p1.y, '#38bdf8', 3, 8);

            // 2) Đường (2) -> (3) hypebol đẳng nhiệt
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 3.4;
            ctx.beginPath();
            for (let i = 0; i <= 36; i++) {
                const vx = vx2 + (vx4 - vx2) * (i / 36);
                const py = k23 / vx;
                const px = ox + vx, yy = oy - py;
                if (i === 0) ctx.moveTo(px, yy);
                else ctx.lineTo(px, yy);
            }
            ctx.stroke();
            const vm23 = (vx2 + vx4) / 2;
            arrowLine(ox + vm23, oy - k23 / vm23, ox + vm23 + 10, oy - k23 / (vm23 + 10), '#fbbf24', 3, 8);

            // 3) Đường (3) -> (4) thẳng đứng
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 3.4;
            ctx.beginPath();
            ctx.moveTo(p3.x, p3.y);
            ctx.lineTo(p4.x, p4.y);
            ctx.stroke();
            arrowLine(p3.x, (p3.y + p4.y) / 2 - 10, p3.x, (p3.y + p4.y) / 2 + 10, '#10b981', 3, 8);

            // 4) Đường (4) -> (1) hypebol đẳng nhiệt
            ctx.strokeStyle = '#f97316';
            ctx.lineWidth = 3.4;
            ctx.beginPath();
            for (let i = 0; i <= 42; i++) {
                const vx = vx4 - (vx4 - vx1) * (i / 42);
                const py = k41 / vx;
                const px = ox + vx, yy = oy - py;
                if (i === 0) ctx.moveTo(px, yy);
                else ctx.lineTo(px, yy);
            }
            ctx.stroke();
            const vm41 = 128;
            arrowLine(ox + vm41, oy - k41 / vm41, ox + vm41 - 10, oy - k41 / (vm41 - 10), '#f97316', 3, 8);

            // Điểm chạy 1 chiều sawtooth trên chu trình
            const saw = (t * 0.14) % 1;
            let dx, dy, dCol;
            if (saw < 0.25) {
                const f = saw / 0.25;
                dx = p1.x + (p2.x - p1.x) * f; dy = p1.y; dCol = '#38bdf8';
            } else if (saw < 0.55) {
                const f = (saw - 0.25) / 0.30;
                const vx = vx2 + (vx4 - vx2) * f;
                dx = ox + vx; dy = oy - k23 / vx; dCol = '#fbbf24';
            } else if (saw < 0.72) {
                const f = (saw - 0.55) / 0.17;
                dx = p3.x; dy = p3.y + (p4.y - p3.y) * f; dCol = '#10b981';
            } else {
                const f = (saw - 0.72) / 0.28;
                const vx = vx4 - (vx4 - vx1) * f;
                dx = ox + vx; dy = oy - k41 / vx; dCol = '#f97316';
            }
            ctx.fillStyle = dCol;
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2.2;
            ctx.beginPath();
            ctx.arc(dx, dy, 6.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // 4 đỉnh trạng thái
            const pts = [
                { p: p1, lbl: '(1)', lx: p1.x, ly: p1.y - 18 },
                { p: p2, lbl: '(2)', lx: p2.x, ly: p2.y - 18 },
                { p: p3, lbl: '(3)', lx: p3.x + 20, ly: p3.y },
                { p: p4, lbl: '(4)', lx: p4.x + 20, ly: p4.y }
            ];
            pts.forEach(pt => {
                ctx.fillStyle = '#f8fafc';
                ctx.strokeStyle = '#0f172a';
                ctx.lineWidth = 2;
                ctx.beginPath(); ctx.arc(pt.p.x, pt.p.y, 5.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

                ctx.fillStyle = '#f8fafc';
                ctx.font = '800 16px "Plus Jakarta Sans", system-ui, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(pt.lbl, pt.lx, pt.ly);
            });

            // Thẻ dữ kiện bên phải (Zero Data Leakage)
            roundBox(454, 48, 314, 240, 10, '#0f172a', '#38bdf8', 2);
            ctx.fillStyle = '#38bdf8';
            ctx.font = '800 15.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('DỮ KIỆN CHU TRÌNH p – V', 472, 74);

            ctx.fillStyle = '#f8fafc';
            ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillText('• Một khối khí lý tưởng kín', 472, 108);
            ctx.fillStyle = '#fde68a';
            ctx.fillText('• (2) → (3): Quá trình đẳng nhiệt', 472, 140);
            ctx.fillStyle = '#fdba74';
            ctx.fillText('• (4) → (1): Quá trình đẳng nhiệt', 472, 170);
            ctx.fillStyle = '#cbd5e1';
            ctx.fillText('• Các đoạn (1)–(2), (3)–(4) thẳng', 472, 200);
            ctx.fillStyle = '#7dd3fc';
            ctx.fillText('• Hệ thức cho biết:', 472, 232);
            ctx.font = '800 16px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillText('  1,5·V₂ = 4,8·V₁', 472, 260);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 51 (MH-STAGING-C2-18 · VLXT-DS-VD28-051): Quá trình biến đổi đoạn thẳng p – V từ (1) đến (2) của 1 mol khí Helium
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C2-18', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
            for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(x, y, bw, bh, r);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function arrowLine(x1, y1, x2, y2, col, lw = 2.8, hl = 9) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }

            // Tiêu đề
            ctx.save();
            const title = 'BIẾN ĐỔI CHẬM 1 mol KHÍ HELIUM THEO ĐỒ THỊ p – V';
            ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            const titleW = Math.min(740, ctx.measureText(title).width + 24);
            roundBox(14, 12, titleW, 30, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, 26, 27);
            ctx.restore();

            const saw = (t * 0.18) % 1;

            // CỘT TRÁI: ĐỒ THỊ p (atm) - V (ℓ) KHỚP 100% ẢNH GỐC 051.png
            const ox = 86, oy = 258;
            arrowLine(ox, oy + 4, ox, 52, '#f1f5f9', 2.8, 9);
            arrowLine(ox - 4, oy, 404, oy, '#f1f5f9', 2.8, 9);

            ctx.save();
            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 15.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText('p (atm)', ox + 10, 60);
            ctx.textAlign = 'center';
            ctx.fillText('V (ℓ)', 386, oy + 20);
            ctx.fillText('O', ox - 16, oy + 16);

            const x10 = 166, x30 = 326;
            const y5 = 200, y15 = 92;

            // Đường gióng nét đứt
            ctx.strokeStyle = '#64748b';
            ctx.lineWidth = 1.6;
            ctx.setLineDash([5, 4]);
            ctx.beginPath();
            ctx.moveTo(ox, y15); ctx.lineTo(x10, y15); ctx.lineTo(x10, oy);
            ctx.moveTo(ox, y5); ctx.lineTo(x30, y5); ctx.lineTo(x30, oy);
            ctx.stroke();
            ctx.setLineDash([]);

            // Mốc giá trị trên trục
            ctx.fillStyle = '#e2e8f0';
            ctx.font = '800 15px "DM Mono", monospace';
            ctx.textAlign = 'right';
            ctx.fillText('15', ox - 10, y15);
            ctx.fillText('5', ox - 10, y5);
            ctx.textAlign = 'center';
            ctx.fillText('10', x10, oy + 20);
            ctx.fillText('30', x30, oy + 20);

            // Đoạn thẳng (1) -> (2) + mũi tên ở giữa
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 3.8;
            ctx.beginPath();
            ctx.moveTo(x30, y5);
            ctx.lineTo(x10, y15);
            ctx.stroke();
            arrowLine(254, 151.4, 232, 136.6, '#38bdf8', 3.4, 10);

            // Điểm chạy 1 chiều sawtooth từ (1) -> (2)
            const dotX = x30 + (x10 - x30) * saw;
            const dotY = y5 + (y15 - y5) * saw;
            ctx.fillStyle = '#fbbf24';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2.4;
            ctx.beginPath(); ctx.arc(dotX, dotY, 6.8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

            // Điểm (1) và (2)
            [{ x: x30, y: y5, lbl: '(1)', lx: x30 + 20, ly: y5 },
             { x: x10, y: y15, lbl: '(2)', lx: x10, ly: y15 - 20 }].forEach(pt => {
                ctx.fillStyle = '#f8fafc';
                ctx.strokeStyle = '#0f172a';
                ctx.lineWidth = 2;
                ctx.beginPath(); ctx.arc(pt.x, pt.y, 5.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

                ctx.fillStyle = '#f8fafc';
                ctx.font = '800 16.5px "Plus Jakarta Sans", system-ui, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(pt.lbl, pt.lx, pt.ly);
            });

            // CỘT PHẢI TRÊN: XI LANH HELIUM ĐỒNG BỘ (V giảm 30 ℓ -> 10 ℓ)
            roundBox(424, 48, 342, 114, 10, '#0f172a', '#38bdf8', 2);
            const cylX = 446, cylY = 82, cylW = 240, cylH = 62;
            const pisX = cylX + 208 - saw * 124; // nén từ 30 ℓ về 10 ℓ
            ctx.fillStyle = `rgba(56, 189, 248, ${(0.18 + saw * 0.25).toFixed(2)})`;
            ctx.fillRect(cylX + 2, cylY + 2, pisX - cylX - 2, cylH - 4);

            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(cylX + cylW, cylY);
            ctx.lineTo(cylX, cylY);
            ctx.lineTo(cylX, cylY + cylH);
            ctx.lineTo(cylX + cylW, cylY + cylH);
            ctx.stroke();

            roundBox(pisX, cylY + 2, 14, cylH - 4, 2, '#94a3b8', '#f8fafc', 2);
            // Cán pít-tông đẩy sang trái
            ctx.fillStyle = '#cbd5e1';
            ctx.fillRect(pisX + 14, cylY + cylH / 2 - 4, 704 - (pisX + 14), 8);
            roundBox(702, cylY + cylH / 2 - 14, 8, 28, 3, '#cbd5e1', '#f8fafc', 1.6);
            arrowLine(752, cylY + cylH / 2, 714, cylY + cylH / 2, '#fbbf24', 2.8, 7);

            ctx.fillStyle = '#38bdf8';
            ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('XI LANH NÉN KHÍ He (30 ℓ → 10 ℓ)', 446, 66);

            // CỘT PHẢI DƯỚI: THÔNG SỐ ĐỀ DẪN (Zero Data Leakage)
            roundBox(424, 174, 342, 114, 10, '#0f172a', '#475569', 2);
            ctx.fillStyle = '#fbbf24';
            ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('DỮ KIỆN ĐỀ BÀI (1 mol He)', 442, 198);

            ctx.fillStyle = '#f8fafc';
            ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillText('• R = 0,082 ℓ·atm/(mol·K)', 442, 226);
            ctx.fillText('• Khối lượng mol He: M = 4 g/mol', 442, 252);
            ctx.fillStyle = '#7dd3fc';
            ctx.fillText('• Biến đổi chậm đoạn thẳng (1) → (2)', 442, 276);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 52 (MH-STAGING-C2-19 · VLXT-DS-VD28-052): Ống chữ U chứa thủy ngân nối bình khí nén Kripton (5 atm) ở nhánh trái bịt kín
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C2-19', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
            for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(x, y, bw, bh, r);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function arrowLine(x1, y1, x2, y2, col, lw = 2.4, hl = 7) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }

            // Tiêu đề
            ctx.save();
            const title = 'ỐNG CHỮ U THỦY NGÂN NỐI BÌNH KHÍ KRIPTON (5 atm)';
            ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            const titleW = Math.min(740, ctx.measureText(title).width + 24);
            roundBox(14, 12, titleW, 30, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, 26, 27);
            ctx.restore();

            // Chu kỳ 1 chiều sawtooth: xả khí Kr vào -> mực Hg nhánh trái hạ 4 cm, nhánh phải dâng 4 cm
            const saw = (t * 0.18) % 1;
            const shiftFrac = saw < 0.2 ? 0 : Math.min(1, (saw - 0.2) / 0.65);

            ctx.save();
            // 1. BÌNH KHÍ NÉN KRIPTON (TRÁI)
            const tx = 30, ty = 56, tw = 82, th = 226;
            const tGrad = ctx.createLinearGradient(tx, ty, tx + tw, ty);
            tGrad.addColorStop(0, '#1e293b');
            tGrad.addColorStop(0.5, '#334155');
            tGrad.addColorStop(1, '#0f172a');
            roundBox(tx, ty, tw, th, 16, tGrad, '#cbd5e1', 2.8);
            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 18px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Kr', tx + tw / 2, ty + th / 2 - 12);
            ctx.fillStyle = '#7dd3fc';
            ctx.font = '800 14.5px "DM Mono", monospace';
            ctx.fillText('5 atm', tx + tw / 2, ty + th / 2 + 16);

            // 2. ỐNG CHỮ U CHỨA THỦY NGÂN (GIỮA) — LÒNG KÍN KHÍT 100%
            const uLeftCX = 228, uRightCX = 368;
            const uMidX = (uLeftCX + uRightCX) / 2; // 298
            const uR = (uRightCX - uLeftCX) / 2;    // 70
            const tubeHalf = 13;                    // đường kính lòng ống 26px
            const yBotCenter = 204;                 // đáy ngoài = 204 + 70 + 13 = 287 <= 295!
            const yTopL = 56, yTopR = 64;
            const yCorkBot = 74;
            const yRef = 152;                       // mực cân bằng ban đầu
            const yHgL = yRef + shiftFrac * 34;     // hạ xuống 186
            const yHgR = yRef - shiftFrac * 34;     // dâng lên 118

            // Lòng khí bên trái (từ dưới nút bấc đến mặt thủy ngân nhánh trái)
            ctx.fillStyle = `rgba(56, 189, 248, ${(0.18 + shiftFrac * 0.22).toFixed(2)})`;
            ctx.fillRect(uLeftCX - tubeHalf, yCorkBot, tubeHalf * 2, yHgL - yCorkBot);

            // Thủy ngân lấp kín 100% lòng ống chữ U (KHÔNG HỞ VIỀN SÁT THÀNH)
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = tubeHalf * 2;
            ctx.lineCap = 'butt';
            ctx.beginPath();
            ctx.moveTo(uLeftCX, yHgL);
            ctx.lineTo(uLeftCX, yBotCenter);
            ctx.arc(uMidX, yBotCenter, uR, Math.PI, 0, true);
            ctx.lineTo(uRightCX, yHgR);
            ctx.stroke();

            // Bóng sáng dọc cột thủy ngân & mặt khum meniscus
            ctx.strokeStyle = 'rgba(226, 232, 240, 0.35)';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(uLeftCX - 4, yHgL);
            ctx.lineTo(uLeftCX - 4, yBotCenter);
            ctx.moveTo(uRightCX - 4, yHgR);
            ctx.lineTo(uRightCX - 4, yBotCenter);
            ctx.stroke();

            ctx.fillStyle = '#cbd5e1';
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 1.6;
            ctx.beginPath(); ctx.ellipse(uLeftCX, yHgL, tubeHalf - 1, 3.5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.beginPath(); ctx.ellipse(uRightCX, yHgR, tubeHalf - 1, 3.5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

            // Ống dẫn ngang nối bình Kr xuyên kín khít vào nhánh trái (y = 108..122)
            const pipeY1 = 108, pipeY2 = 122;
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(tx + tw - 2, pipeY1, (uLeftCX - tubeHalf) - (tx + tw) + 6, pipeY2 - pipeY1);
            ctx.fillStyle = 'rgba(56, 189, 248, 0.30)';
            ctx.fillRect(tx + tw - 2, pipeY1, (uLeftCX - tubeHalf) - (tx + tw) + 6, pipeY2 - pipeY1);

            // Thành ngoài & thành trong ống chữ U (chừa khe nối ống dẫn khí bên trái!)
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 2.8;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            // Thành ngoài nhánh trái từ trên xuống tới mép ống dẫn
            ctx.moveTo(uLeftCX - tubeHalf, yTopL);
            ctx.lineTo(uLeftCX - tubeHalf, pipeY1);
            ctx.lineTo(tx + tw, pipeY1);
            // Từ mép dưới ống dẫn xuống đáy vòng sang phải
            ctx.moveTo(tx + tw, pipeY2);
            ctx.lineTo(uLeftCX - tubeHalf, pipeY2);
            ctx.lineTo(uLeftCX - tubeHalf, yBotCenter);
            ctx.arc(uMidX, yBotCenter, uR + tubeHalf, Math.PI, 0, true);
            ctx.lineTo(uRightCX + tubeHalf, yTopR);
            // Thành trong chữ U
            ctx.moveTo(uLeftCX + tubeHalf, yTopL);
            ctx.lineTo(uLeftCX + tubeHalf, yBotCenter);
            ctx.arc(uMidX, yBotCenter, uR - tubeHalf, Math.PI, 0, true);
            ctx.lineTo(uRightCX - tubeHalf, yTopR);
            ctx.stroke();

            // Van chữ T trên ống nối & luồng khí Kr
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(164, pipeY1); ctx.lineTo(164, pipeY1 - 14);
            ctx.moveTo(150, pipeY1 - 14); ctx.lineTo(178, pipeY1 - 14);
            ctx.stroke();
            if (saw < 0.55) {
                arrowLine(132, 115, 206, 115, '#7dd3fc', 2.4, 7);
            }

            // Nút bấc bịt kín đầu nhánh trái (cố định)
            roundBox(uLeftCX - tubeHalf + 1, yTopL - 6, tubeHalf * 2 - 2, yCorkBot - yTopL + 6, 3, '#f97316', '#fed7aa', 2);

            // Đường chuẩn mực thủy ngân ban đầu (nét đứt)
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 1.6;
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(uLeftCX - tubeHalf, yRef); ctx.lineTo(uLeftCX + tubeHalf + 14, yRef);
            ctx.moveTo(uRightCX - tubeHalf, yRef); ctx.lineTo(uRightCX + tubeHalf + 14, yRef);
            ctx.stroke();
            ctx.setLineDash([]);

            // Kích thước 5 cm và 4 cm bên phải nhánh trái (không đè thành ống)
            const dimL = uLeftCX + tubeHalf + 16; // 257
            arrowLine(dimL, (yCorkBot + yRef) / 2, dimL, yCorkBot + 2, '#38bdf8', 2.2, 6);
            arrowLine(dimL, (yCorkBot + yRef) / 2, dimL, yRef - 2, '#38bdf8', 2.2, 6);
            ctx.fillStyle = '#7dd3fc';
            ctx.font = '800 14.5px "DM Mono", monospace';
            ctx.textAlign = 'left';
            ctx.fillText('5 cm', dimL + 6, (yCorkBot + yRef) / 2);

            if (yHgL - yRef > 8) {
                arrowLine(dimL, (yRef + yHgL) / 2, dimL, yRef + 2, '#fbbf24', 2.2, 6);
                arrowLine(dimL, (yRef + yHgL) / 2, dimL, yHgL - 2, '#fbbf24', 2.2, 6);
            }
            ctx.fillStyle = '#fde68a';
            ctx.fillText('4 cm', dimL + 6, (yRef + Math.max(yRef + 24, yHgL)) / 2);

            // Kích thước 4 cm bên phải nhánh phải
            const dimR = uRightCX + tubeHalf + 16; // 397
            if (yRef - yHgR > 8) {
                arrowLine(dimR, (yRef + yHgR) / 2, dimR, yHgR + 2, '#fbbf24', 2.2, 6);
                arrowLine(dimR, (yRef + yHgR) / 2, dimR, yRef - 2, '#fbbf24', 2.2, 6);
            }
            ctx.fillStyle = '#fde68a';
            ctx.fillText('4 cm', dimR + 6, (yRef + Math.min(yRef - 24, yHgR)) / 2);

            // Nhãn miệng phải hở (p0)
            ctx.fillStyle = '#cbd5e1';
            ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Hở (p₀)', uRightCX, yTopR - 14);

            // Thẻ thông số đề dẫn bên phải (Zero Data Leakage)
            roundBox(486, 48, 280, 240, 10, '#0f172a', '#38bdf8', 2);
            ctx.fillStyle = '#38bdf8';
            ctx.font = '800 15.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('DỮ KIỆN ỐNG CHỮ U', 504, 74);

            ctx.fillStyle = '#f8fafc';
            ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillText('• Tiết diện đều: S = 3 cm²', 504, 108);
            ctx.fillText('• Áp suất khí quyển:', 504, 138);
            ctx.fillStyle = '#7dd3fc';
            ctx.fillText('  p₀ = 1 atm = 760 mmHg', 504, 164);
            ctx.fillStyle = '#f8fafc';
            ctx.fillText('• Khí Kripton nén: 5 atm', 504, 196);
            ctx.fillStyle = '#fde68a';
            ctx.fillText('• Nhiệt độ không đổi (T = const)', 504, 228);
            ctx.fillStyle = '#94a3b8';
            ctx.fillText('• Nút bấc cố định kín khít', 504, 258);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 53 (MH-STAGING-C2-20 · VLXT-DS-VD28-053): Khí quyển trên đỉnh Everest: so sánh động năng phân tử, tốc độ căn quân phương và mật độ khí
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C2-20', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
            for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(x, y, bw, bh, r);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function arrowLine(x1, y1, x2, y2, col, lw = 2.6, hl = 8) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }

            // Tiêu đề
            ctx.save();
            const title = 'KHÍ QUYỂN TRÊN ĐỈNH EVEREST & HÔ HẤP Ở ĐỘ CAO LỚN';
            ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            const titleW = Math.min(740, ctx.measureText(title).width + 24);
            roundBox(14, 12, titleW, 30, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, 26, 27);
            ctx.restore();

            const saw = (t * 0.16) % 1;

            ctx.save();
            // 1. THẺ ĐỈNH EVEREST (TRÊN TRÁI) & NƠI CẮM TRẠI (DƯỚI TRÁI) — KHÔNG CHE SƯỜN NÚI
            // Ngọn núi đặt gọn vùng x = 224..422
            const mGrad = ctx.createLinearGradient(0, 72, 0, 284);
            mGrad.addColorStop(0, '#334155');
            mGrad.addColorStop(1, '#0f172a');
            ctx.fillStyle = mGrad;
            ctx.strokeStyle = '#64748b';
            ctx.lineWidth = 2.6;
            ctx.beginPath();
            ctx.moveTo(222, 284);
            ctx.lineTo(318, 74);
            ctx.lineTo(422, 284);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Chỏm tuyết đỉnh núi
            ctx.fillStyle = '#e2e8f0';
            ctx.beginPath();
            ctx.moveTo(318, 74);
            ctx.lineTo(288, 138);
            ctx.lineTo(304, 130);
            ctx.lineTo(318, 144);
            ctx.lineTo(334, 132);
            ctx.lineTo(348, 140);
            ctx.closePath();
            ctx.fill();

            // Đường leo 1 chiều dọc sườn trái lên đỉnh (từ trại 236, 252 lên đỉnh 318, 74)
            const cx = 236 + saw * (318 - 236);
            const cy = 252 + saw * (74 - 252);
            arrowLine(242, 240, 310, 90, 'rgba(251, 191, 36, 0.65)', 2.4, 8);
            ctx.fillStyle = '#fbbf24';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2.2;
            ctx.beginPath(); ctx.arc(cx, cy, 6.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

            // Thẻ Đỉnh Everest (TRÊN TRÁI — tương ứng đỉnh cao)
            roundBox(18, 52, 188, 108, 9, '#0f172a', '#38bdf8', 2);
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(206, 76); ctx.lineTo(314, 76); ctx.stroke();
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath(); ctx.arc(318, 76, 4.2, 0, Math.PI * 2); ctx.fill();

            ctx.fillStyle = '#7dd3fc';
            ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('ĐỈNH EVEREST', 32, 74);
            ctx.fillStyle = '#f8fafc';
            ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillText('• p₂ = 33 kPa', 32, 100);
            ctx.fillText('• t₂ = -23°C', 32, 124);
            // Mật độ phân tử loãng hơn ở đỉnh núi
            ctx.fillStyle = '#38bdf8';
            for (let i = 0; i < 6; i++) {
                const px = 36 + i * 28 + Math.sin(t * 2.2 + i) * 3;
                const py = 144 + ((i * 7) % 6) - 3 + Math.cos(t * 2.2 + i) * 2.5;
                ctx.beginPath(); ctx.arc(px, py, 2.5, 0, Math.PI * 2); ctx.fill();
            }

            // Thẻ Nơi cắm trại (DƯỚI TRÁI — tương ứng chân núi)
            roundBox(18, 174, 188, 110, 9, '#0f172a', '#10b981', 2);
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(206, 252); ctx.lineTo(234, 252); ctx.stroke();
            ctx.fillStyle = '#10b981';
            ctx.beginPath(); ctx.arc(236, 252, 4.2, 0, Math.PI * 2); ctx.fill();

            ctx.fillStyle = '#6ee7b7';
            ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillText('NƠI CẮM TRẠI', 32, 196);
            ctx.fillStyle = '#f8fafc';
            ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillText('• p₁ = 54 kPa', 32, 222);
            ctx.fillText('• t₁ = -3°C', 32, 246);
            // Mật độ phân tử dày đặc hơn ở trại (phân bố đều)
            ctx.fillStyle = '#34d399';
            for (let i = 0; i < 14; i++) {
                const rx = ((i * 73 + 11) % 100) / 100;
                const ry = ((i * 41 + 7) % 100) / 100;
                const px = 34 + rx * 148 + Math.sin(t * 3 + i) * 2.5;
                const py = 262 + ry * 14 + Math.cos(t * 3 + i) * 2;
                ctx.beginPath(); ctx.arc(px, py, 2.5, 0, Math.PI * 2); ctx.fill();
            }

            // 2. KHUNG PHỔI & HẰNG SỐ BÊN PHẢI (Zero Data Leakage)
            roundBox(434, 48, 332, 240, 10, '#0f172a', '#f97316', 2);
            ctx.fillStyle = '#fb923c';
            ctx.font = '800 15.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillText('HÔ HẤP & HẰNG SỐ KHÍ', 452, 74);

            // Hình minh họa 2 lá phổi đơn giản sắc nét (làm ấm khí lên 37°C)
            const lx = 598, ly = 128;
            ctx.strokeStyle = '#fb7185';
            ctx.fillStyle = 'rgba(251, 113, 133, 0.22)';
            ctx.lineWidth = 2.4;
            // Khí quản
            ctx.beginPath(); ctx.moveTo(lx, ly - 32); ctx.lineTo(lx, ly - 10); ctx.stroke();
            // Hai lá phổi
            ctx.beginPath(); ctx.ellipse(lx - 22, ly + 4, 18, 24, 0.15, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.beginPath(); ctx.ellipse(lx + 22, ly + 4, 18, 24, -0.15, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

            ctx.fillStyle = '#fda4af';
            ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Phổi: V = 5,0 lít (37°C)', lx, ly + 44);

            ctx.fillStyle = '#f8fafc';
            ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('• Không khí: M = 29 g/mol', 452, 210);
            ctx.fillText('• Hằng số Boltzmann:', 452, 238);
            ctx.fillStyle = '#fde68a';
            ctx.fillText('  k = 1,38·10⁻²³ J/K', 452, 264);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 54 (MH-STAGING-C2-21 · VLXT-DS-VD28-054): Bình khí nén sửa xe máy đặt ngoài trời nắng: nung nóng đẳng tích từ 300 K lên 360 K
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C2-21', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
            for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(x, y, bw, bh, r);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function arrowLine(x1, y1, x2, y2, col, lw = 2.6, hl = 8) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }

            // Tiêu đề
            ctx.save();
            const title = 'BÌNH KHÍ NÉN ĐỂ NGOÀI TRỜI NẮNG (ĐẲNG TÍCH 300 K → 360 K)';
            ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            const titleW = Math.min(740, ctx.measureText(title).width + 24);
            roundBox(14, 12, titleW, 30, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, 26, 27);
            ctx.restore();

            // Chu kỳ nung nóng ngoài nắng 1 chiều sawtooth
            const saw = (t * 0.18) % 1;

            ctx.save();
            // 1. MẶT TRỜI & TIA NẮNG CHIẾU VÀO BÌNH
            const sunX = 68, sunY = 92;
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath(); ctx.arc(sunX, sunY, 20, 0, Math.PI * 2); ctx.fill();
            for (let i = 0; i < 8; i++) {
                const ang = (i * Math.PI) / 4;
                ctx.strokeStyle = '#fbbf24';
                ctx.lineWidth = 2.6;
                ctx.beginPath();
                ctx.moveTo(sunX + Math.cos(ang) * 25, sunY + Math.sin(ang) * 25);
                ctx.lineTo(sunX + Math.cos(ang) * 33, sunY + Math.sin(ang) * 33);
                ctx.stroke();
            }
            arrowLine(98, 108, 150, 134, '#f97316', 2.6, 8);
            arrowLine(90, 126, 146, 160, '#f97316', 2.6, 8);

            // 2. BÌNH KHÍ NÉN SỬA XE MÁY ĐỨNG (khớp ảnh gốc 054.png)
            const tx = 166, ty = 72, tw = 114, th = 178;
            // Chân bình & mặt sàn
            ctx.strokeStyle = '#475569';
            ctx.lineWidth = 3;
            ctx.beginPath(); ctx.moveTo(132, 276); ctx.lineTo(346, 276); ctx.stroke();
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(tx + 24, ty + th - 8); ctx.lineTo(tx + 12, 275);
            ctx.moveTo(tx + tw - 24, ty + th - 8); ctx.lineTo(tx + tw - 12, 275);
            ctx.stroke();

            // Thân bình thép kín
            const tankGrad = ctx.createLinearGradient(tx, ty, tx + tw, ty);
            tankGrad.addColorStop(0, '#334155');
            tankGrad.addColorStop(0.45, '#64748b');
            tankGrad.addColorStop(1, '#1e293b');
            roundBox(tx, ty, tw, th, 36, tankGrad, '#cbd5e1', 3);

            // Van khóa trên trái bình (khớp ảnh gốc 054.png)
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(tx + 2, 108); ctx.lineTo(tx - 18, 108);
            ctx.moveTo(tx - 18, 98); ctx.lineTo(tx - 18, 118);
            ctx.stroke();

            // Cửa sổ quan sát phân tử khí bên trong bình (tăng tốc độ khi T tăng, phân bố đều)
            roundBox(tx + 16, ty + 48, tw - 32, 92, 10, '#0f172a', '#94a3b8', 2);
            const molSpd = 2.0 + saw * 3.4;
            ctx.fillStyle = saw > 0.6 ? '#fb923c' : '#38bdf8';
            for (let i = 0; i < 14; i++) {
                const rx = ((i * 73 + 13) % 100) / 100;
                const ry = ((i * 47 + 29) % 100) / 100;
                const mx = tx + 26 + rx * (tw - 52) + Math.sin(t * molSpd + i * 1.6) * 4.5;
                const my = ty + 60 + ry * 68 + Math.cos(t * molSpd + i * 2.1) * 4.5;
                ctx.beginPath(); ctx.arc(mx, my, 3, 0, Math.PI * 2); ctx.fill();
            }

            // 3. ÁP KẾ GẮN NỐI KÍN KHÍT VÀO THÂN BÌNH (PHẢI)
            const gx = 338, gy = 114, gr = 36;
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(tx + tw, 114);
            ctx.lineTo(gx - gr, 114);
            ctx.stroke();

            // Mặt đồng hồ áp kế + vạch chia độ
            ctx.fillStyle = '#0f172a';
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 3;
            ctx.beginPath(); ctx.arc(gx, gy, gr, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

            ctx.strokeStyle = '#64748b';
            ctx.lineWidth = 1.6;
            for (let i = 0; i <= 8; i++) {
                const ang = Math.PI * 0.8 + (i / 8) * Math.PI * 1.4;
                ctx.beginPath();
                ctx.moveTo(gx + Math.cos(ang) * (gr - 6), gy + Math.sin(ang) * (gr - 6));
                ctx.lineTo(gx + Math.cos(ang) * (gr - 12), gy + Math.sin(ang) * (gr - 12));
                ctx.stroke();
            }

            // Cung cảnh báo áp suất cao màu đỏ
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 4.5;
            ctx.beginPath();
            ctx.arc(gx, gy, gr - 8, -0.35, 0.72);
            ctx.stroke();

            // Kim áp kế quay tăng 1 chiều theo T (không ghi đáp số 2,4 MPa -> Zero Data Leakage)
            const nAng = Math.PI * 0.95 + saw * Math.PI * 0.65;
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(gx, gy);
            ctx.lineTo(gx + Math.cos(nAng) * (gr - 10), gy + Math.sin(nAng) * (gr - 10));
            ctx.stroke();
            ctx.fillStyle = '#f8fafc';
            ctx.beginPath(); ctx.arc(gx, gy, 4.2, 0, Math.PI * 2); ctx.fill();

            // Nhãn áp kế & nhiệt độ tức thời
            const curK = Math.round(300 + saw * 60);
            roundBox(294, 166, 92, 54, 8, '#0f172a', '#fbbf24', 1.8);
            ctx.fillStyle = '#fde68a';
            ctx.font = '800 15px "DM Mono", monospace';
            ctx.textAlign = 'center';
            ctx.fillText(`T = ${curK} K`, 340, 184);
            ctx.fillStyle = '#fca5a5';
            ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillText('p tăng ↑', 340, 206);

            // 4. THẺ THÔNG SỐ ĐỀ DẪN BÊN PHẢI (Zero Data Leakage)
            roundBox(406, 48, 360, 240, 10, '#0f172a', '#fbbf24', 2);
            ctx.fillStyle = '#fbbf24';
            ctx.font = '800 15.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('THÔNG SỐ BÌNH KHÍ NÉN', 424, 74);

            ctx.fillStyle = '#f8fafc';
            ctx.font = '700 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillText('• Thể tích bình không đổi (V = const)', 424, 108);
            ctx.fillText('• Không có sự rò rỉ khí ra ngoài', 424, 138);
            ctx.fillStyle = '#7dd3fc';
            ctx.fillText('• Ban đầu: p₁ = 2 MPa;  T₁ = 300 K', 424, 170);
            ctx.fillStyle = '#fdba74';
            ctx.fillText('• Để ngoài nắng: T₂ = 360 K', 424, 202);
            ctx.fillStyle = '#94a3b8';
            ctx.fillText('• Coi không khí là khí lí tưởng', 424, 234);
            ctx.fillText('• Động năng & áp suất thay đổi theo T', 424, 262);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 55 (MH-STAGING-C3-01 · VLXT-DS-VD28-055): Thí nghiệm đo cảm ứng từ bằng lực kế treo khung dây có đoạn PQ giữa hai cực nam châm
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C3-01', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
            for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(x, y, bw, bh, r);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function drawSub(base, sub, x, y, col = '#f8fafc', baseSz = 16, align = 'left') {
                const subSz = Math.max(13, Math.round(baseSz * 0.78));
                ctx.save();
                ctx.fillStyle = col;
                ctx.textAlign = 'left';
                ctx.textBaseline = 'alphabetic';
                ctx.font = `800 ${baseSz}px 'Segoe UI', system-ui, sans-serif`;
                const bw = ctx.measureText(base).width;
                ctx.font = `800 ${subSz}px 'Segoe UI', system-ui, sans-serif`;
                const sw = sub ? ctx.measureText(sub).width : 0;
                const tot = bw + sw;
                let sx = x;
                if (align === 'center') sx = x - tot / 2;
                else if (align === 'right') sx = x - tot;
                ctx.font = `800 ${baseSz}px 'Segoe UI', system-ui, sans-serif`;
                ctx.fillText(base, sx, y);
                if (sub) {
                    ctx.font = `800 ${subSz}px 'Segoe UI', system-ui, sans-serif`;
                    ctx.fillText(sub, sx + bw + 1, y + 4);
                }
                ctx.restore();
            }

            function drawPill(x, y, text, col = '#f8fafc', border = '#38bdf8') {
                ctx.save();
                ctx.font = `800 15px 'Segoe UI', system-ui, sans-serif`;
                const tw = ctx.measureText(text).width;
                const pw = tw + 18, ph = 26;
                roundBox(x - pw / 2, y - ph / 2, pw, ph, 6, '#0f172a', border, 1.8);
                ctx.fillStyle = col;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(text, x, y);
                ctx.restore();
            }

            // Tiêu đề góc trên trái
            ctx.save();
            const title = 'THÍ NGHIỆM KHẢO SÁT LỰC TỪ LÊN ĐOẠN DÂY PQ';
            ctx.font = `800 14.5px 'Segoe UI', system-ui, sans-serif`;
            const titleW = Math.min(750, ctx.measureText(title).width + 26);
            roundBox(14, 10, titleW, 28, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, 27, 24);
            ctx.restore();

            // Chu kỳ sawtooth 1 chiều: 0..0.42 là khi chưa có dòng (F0), 0.42..1.0 là bật dòng I (F1 > F0)
            const saw = (t * 0.22) % 1;
            const hasCurrent = saw >= 0.42;
            const dropPx = hasCurrent ? 5 : 0;

            ctx.save();
            // 1. Giá treo & Lực kế tròn phía trên
            const gx = 225, gy = 92, gr = 32;
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 3.5;
            ctx.beginPath();
            ctx.moveTo(gx - 38, 46);
            ctx.lineTo(gx + 38, 46);
            ctx.stroke();
            ctx.lineWidth = 2.4;
            ctx.beginPath();
            ctx.moveTo(gx, 46);
            ctx.lineTo(gx, gy - gr);
            ctx.stroke();

            // Mặt đồng hồ lực kế tròn
            ctx.fillStyle = '#f8fafc';
            ctx.strokeStyle = '#475569';
            ctx.lineWidth = 3.2;
            ctx.beginPath();
            ctx.arc(gx, gy, gr, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            for (let i = 0; i <= 10; i++) {
                const ang = -Math.PI * 1.2 + (i / 10) * Math.PI * 1.4;
                const rIn = (i % 2 === 0) ? gr - 9 : gr - 6;
                ctx.strokeStyle = '#334155';
                ctx.lineWidth = (i % 2 === 0) ? 2 : 1.2;
                ctx.beginPath();
                ctx.moveTo(gx + Math.cos(ang) * rIn, gy + Math.sin(ang) * rIn);
                ctx.lineTo(gx + Math.cos(ang) * (gr - 3), gy + Math.sin(ang) * (gr - 3));
                ctx.stroke();
            }
            ctx.fillStyle = '#0f172a';
            ctx.font = `800 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('N', gx, gy + 16);

            const needleAng = hasCurrent ? 0.08 : -0.65;
            ctx.strokeStyle = hasCurrent ? '#ef4444' : '#0284c7';
            ctx.lineWidth = 2.8;
            ctx.beginPath();
            ctx.moveTo(gx - Math.cos(needleAng) * 6, gy - Math.sin(needleAng) * 6);
            ctx.lineTo(gx + Math.cos(needleAng) * (gr - 9), gy + Math.sin(needleAng) * (gr - 9));
            ctx.stroke();
            ctx.fillStyle = '#0f172a';
            ctx.beginPath();
            ctx.arc(gx, gy, 3.6, 0, Math.PI * 2);
            ctx.fill();

            roundBox(20, 68, 150, 50, 8, '#0f172a', hasCurrent ? '#fbbf24' : '#38bdf8', 2);
            ctx.fillStyle = '#cbd5e1';
            ctx.font = `700 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText(hasCurrent ? 'Có dòng điện I' : 'Chưa có dòng điện', 95, 84);
            drawSub('Số chỉ: F', hasCurrent ? '1' : '0', 95, 108, hasCurrent ? '#fbbf24' : '#7dd3fc', 16, 'center');

            // 2. Nam châm hình chữ U lớn đặt phía dưới (Cực N bên trái màu đỏ, cực S bên phải màu xanh)
            roundBox(76, 260, 298, 22, 4, '#334155', '#64748b', 2.2);
            roundBox(76, 174, 34, 92, 4, '#475569', '#94a3b8', 2);
            roundBox(340, 174, 34, 92, 4, '#475569', '#94a3b8', 2);

            roundBox(110, 188, 62, 62, 6, '#ef4444', '#fca5a5', 2.4);
            ctx.fillStyle = '#ffffff';
            ctx.font = `800 18px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('N', 141, 219);

            roundBox(278, 188, 62, 62, 6, '#3b82f6', '#93c5fd', 2.4);
            ctx.fillStyle = '#ffffff';
            ctx.fillText('S', 309, 219);

            ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
            ctx.lineWidth = 1.6;
            ctx.setLineDash([4, 4]);
            for (let yy = 202; yy <= 236; yy += 17) {
                ctx.beginPath();
                ctx.moveTo(174, yy);
                ctx.lineTo(276, yy);
                ctx.stroke();
            }
            ctx.setLineDash([]);

            // 3. Khung dây hình chữ nhật treo thẳng đứng (chỉ cạnh dưới PQ nằm giữa 2 cực)
            const px = 204, py = 232 + dropPx;
            const qx = 248, qy = 202 + dropPx;
            const topPx = 204, topPy = 160 + dropPx;
            const topQx = 248, topQy = 136 + dropPx;
            const midTopX = (topPx + topQx) / 2;
            const midTopY = (topPy + topQy) / 2;

            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 2.6;
            ctx.beginPath();
            ctx.moveTo(gx, gy + gr);
            ctx.lineTo(midTopX, midTopY);
            ctx.stroke();

            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 2.2;
            ctx.beginPath();
            ctx.moveTo(topPx, topPy);
            ctx.quadraticCurveTo(132, 165, 118, 118);
            ctx.moveTo(topQx, topQy);
            ctx.quadraticCurveTo(318, 148, 336, 108);
            ctx.stroke();

            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 3.4;
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(topPx, topPy);
            ctx.lineTo(topQx, topQy);
            ctx.lineTo(qx, qy);
            ctx.stroke();

            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 4.5;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(qx, qy);
            ctx.stroke();

            drawPill(188, 250, 'P', '#fbbf24', '#fbbf24');
            drawPill(262, 182, 'Q', '#fbbf24', '#fbbf24');

            // 4. Bảng dữ kiện đề bài bên phải (Zero Data Leakage)
            roundBox(454, 44, 314, 246, 10, '#0f172a', '#38bdf8', 2);
            ctx.fillStyle = '#38bdf8';
            ctx.font = `800 15.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText('DỮ KIỆN THÍ NGHIỆM', 472, 70);

            ctx.fillStyle = '#f8fafc';
            ctx.font = `700 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('• Khung chữ nhật treo vào lực kế', 472, 104);
            ctx.fillText('• Chỉ cạnh PQ trong từ trường đều', 472, 134);
            ctx.fillStyle = '#7dd3fc';
            ctx.fillText('• Đường sức từ có phương ngang', 472, 164);
            ctx.fillStyle = '#f8fafc';
            ctx.fillText('• Ban đầu PQ ⊥ đường sức từ', 472, 194);
            ctx.fillStyle = '#fde68a';
            ctx.fillText('• Chưa có dòng điện: lực kế chỉ F₀', 472, 226);
            ctx.fillStyle = '#fca5a5';
            ctx.fillText('• Có dòng điện I: chỉ F₁ (F₁ > F₀)', 472, 258);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 56 (MH-STAGING-C3-02 · VLXT-DS-VD28-056): Khung dây chữ nhật ABCD mang dòng điện quay trong từ trường đều (ngẫu lực từ)
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C3-02', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
            for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(x, y, bw, bh, r);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function arrowLine(x1, y1, x2, y2, col, lw = 2.8, hl = 9) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }

            function drawVectorB(x, y, col = '#38bdf8', sz = 17) {
                ctx.save();
                ctx.fillStyle = col;
                ctx.font = `italic 800 ${sz}px 'Segoe UI', system-ui, sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('B', x, y);
                ctx.strokeStyle = col;
                ctx.lineWidth = 1.8;
                const vy = y - 12;
                ctx.beginPath();
                ctx.moveTo(x - 7, vy); ctx.lineTo(x + 8, vy);
                ctx.lineTo(x + 4, vy - 3);
                ctx.moveTo(x + 8, vy);
                ctx.lineTo(x + 4, vy + 3);
                ctx.stroke();
                ctx.restore();
            }

            // Tiêu đề
            ctx.save();
            const title = 'KHUNG DÂY CHỮ NHẬT ABCD TRONG TỪ TRƯỜNG ĐỀU';
            ctx.font = `800 14.5px 'Segoe UI', system-ui, sans-serif`;
            const titleW = Math.min(750, ctx.measureText(title).width + 26);
            roundBox(14, 10, titleW, 28, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, 27, 24);
            ctx.restore();

            // Pha sawtooth: 0..0.34 giữ ở t=0, 0.34..1.0 quay góc 0..78 độ quanh OO'
            const saw = (t * 0.22) % 1;
            const rotAngle = saw < 0.34 ? 0 : ((saw - 0.34) / 0.66) * (Math.PI * 0.42);
            const cosA = Math.cos(rotAngle);
            const sinA = Math.sin(rotAngle);

            ctx.save();
            // Nhãn trạng thái đặt riêng ở góc trên trái (y = 46..72, hoàn toàn phía trên đường sức y >= 88)
            roundBox(16, 46, 152, 26, 6, '#0f172a', rotAngle === 0 ? '#10b981' : '#fbbf24', 1.8);
            ctx.fillStyle = rotAngle === 0 ? '#6ee7b7' : '#fde68a';
            ctx.font = `800 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(rotAngle === 0 ? 'Thời điểm t = 0' : 'Khung đang quay', 92, 59);

            // 4 đường sức từ B song song nằm ngang từ trái sang phải (y từ 88 đến 268)
            const bYs = [88, 148, 208, 268];
            bYs.forEach(by => {
                arrowLine(24, by, 424, by, 'rgba(56, 189, 248, 0.72)', 2.4, 9);
            });
            drawVectorB(392, 122, '#38bdf8', 18);

            // Trục quay thẳng đứng OO' nét đứt
            const cx = 224, cy = 178;
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(cx, 66);
            ctx.lineTo(cx, 286);
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.fillStyle = '#cbd5e1';
            ctx.font = `800 15.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('O', cx + 14, 66);
            ctx.fillText("O'", cx + 16, 284);

            // Khung dây hình chữ nhật ABCD với phối cảnh nghiêng 3D khi quay góc rotAngle
            const halfW = 82 * cosA;
            const skewY = 12 * sinA; // Tạo độ sâu 3D rõ ràng khi quay
            const halfH = 54;

            const ax = cx - halfW, ay = cy - halfH - skewY;
            const bx = cx + halfW, by = cy - halfH + skewY;
            const ddx = cx - halfW, ddy = cy + halfH - skewY;
            const ccx = cx + halfW, ccy = cy + halfH + skewY;

            const gap = Math.max(4, 9 * cosA);
            const topMidY = cy - halfH;

            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 4;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(cx - gap, topMidY - 12);
            ctx.lineTo(cx - gap, topMidY);
            ctx.lineTo(ax, ay);
            ctx.lineTo(ddx, ddy);
            ctx.lineTo(ccx, ccy);
            ctx.lineTo(bx, by);
            ctx.lineTo(cx + gap, topMidY);
            ctx.lineTo(cx + gap, topMidY - 12);
            ctx.stroke();

            // Mũi tên dòng điện I trên đoạn giữa khe hở tới B (rõ ràng khi mặt khung đủ rộng)
            if (halfW > 32) {
                const mx1 = cx + gap + 6;
                const my1 = topMidY + (by - topMidY) * 0.14;
                const mx2 = cx + gap + 0.56 * (halfW - gap);
                const my2 = topMidY + (by - topMidY) * 0.62;
                arrowLine(mx1, my1, mx2, my2, '#f59e0b', 3.4, 9);
                ctx.fillStyle = '#fbbf24';
                ctx.font = `800 16px 'Segoe UI', system-ui, sans-serif`;
                ctx.fillText('I', (mx1 + mx2) / 2, (my1 + my2) / 2 + 18);
            }

            // Nhãn 4 đỉnh A, B, C, D rõ ràng không đè đường sức hay hộp trạng thái
            ctx.fillStyle = '#f8fafc';
            ctx.font = `800 16px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText('A', ax - 15, ay - 6);
            ctx.fillText('B', bx + 15, by - 6);
            ctx.fillText('D', ddx - 15, ddy + 10);
            ctx.fillText('C', ccx + 15, ccy + 10);

            // Bảng thông số bên phải (Zero Data Leakage)
            roundBox(454, 44, 314, 246, 10, '#0f172a', '#38bdf8', 2);
            ctx.fillStyle = '#38bdf8';
            ctx.font = `800 15.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'left';
            ctx.fillText('DỮ KIỆN ĐỘNG CƠ ĐIỆN', 472, 70);

            ctx.fillStyle = '#f8fafc';
            ctx.font = `700 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('• AB = CD = 10 cm;  BC = DA = 20 cm', 472, 104);
            ctx.fillText('• Cảm ứng từ đều: B = 2·10⁻⁴ T', 472, 134);
            ctx.fillStyle = '#fde68a';
            ctx.fillText('• Cường độ dòng điện: I = 4 A', 472, 164);
            ctx.fillStyle = '#7dd3fc';
            ctx.fillText('• Tại t = 0: vectơ B // cạnh CD', 472, 194);
            ctx.fillStyle = '#f8fafc';
            ctx.fillText("• Trục quay đối xứng: OO'", 472, 226);
            ctx.fillStyle = '#6ee7b7';
            ctx.fillText('• Động cơ điện: P = 110 W; Pᵢ = 88 W', 472, 258);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 57 (MH-STAGING-C3-03 · VLXT-DS-VD28-057): Bộ thu (pickup) của đàn ghi-ta điện: dây kim loại nhiễm từ dao động trên cuộn dây
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C3-03', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
            for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(x, y, bw, bh, r);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function drawCallout(tx, ty, bx, by, bw, bh, text, col = '#38bdf8') {
                ctx.save();
                const ax = (bx + bw < tx) ? (bx + bw) : (bx > tx ? bx : bx + bw / 2);
                const ay = by + bh / 2;
                ctx.strokeStyle = col;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(tx, ty);
                ctx.lineTo(ax, ay);
                ctx.stroke();
                ctx.fillStyle = col;
                ctx.beginPath();
                ctx.arc(tx, ty, 3.8, 0, Math.PI * 2);
                ctx.fill();
                roundBox(bx, by, bw, bh, 6, '#0f172a', col, 1.8);
                ctx.fillStyle = '#f8fafc';
                ctx.font = `700 14.5px 'Segoe UI', system-ui, sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(text, bx + bw / 2, by + bh / 2);
                ctx.restore();
            }

            // Tiêu đề
            ctx.save();
            const title = 'NGUYÊN LÝ BỘ THU (PICKUP) ĐÀN GHI-TA ĐIỆN';
            ctx.font = `800 14.5px 'Segoe UI', system-ui, sans-serif`;
            const titleW = Math.min(750, ctx.measureText(title).width + 26);
            roundBox(14, 10, titleW, 28, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, 27, 24);
            ctx.restore();

            const vib = Math.sin(t * 9.5);
            const vibAmp = 7 * vib;

            ctx.save();
            // 1. Dây guitar kim loại nhiễm từ phía trên
            const sX1 = 38, sX2 = 414, sY = 98;
            roundBox(26, sY - 8, 12, 16, 3, '#475569', '#94a3b8', 1.8);
            roundBox(sX2, sY - 8, 12, 16, 3, '#475569', '#94a3b8', 1.8);

            ctx.strokeStyle = '#d97706';
            ctx.lineWidth = 7.5;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(sX1, sY);
            for (let x = sX1; x <= sX2; x += 6) {
                const p = (x - sX1) / (sX2 - sX1);
                const yy = sY - Math.sin(p * Math.PI) * vibAmp;
                ctx.lineTo(x, yy);
            }
            ctx.stroke();

            ctx.strokeStyle = '#fcd34d';
            ctx.lineWidth = 2.2;
            ctx.beginPath();
            ctx.moveTo(sX1, sY - 1.5);
            for (let x = sX1; x <= sX2; x += 6) {
                const p = (x - sX1) / (sX2 - sX1);
                const yy = sY - 1.5 - Math.sin(p * Math.PI) * vibAmp;
                ctx.lineTo(x, yy);
            }
            ctx.stroke();

            // Điểm chạm dây đàn cho callout trái
            const pTouch = (104 - sX1) / (sX2 - sX1);
            const yTouch = sY - Math.sin(pTouch * Math.PI) * vibAmp;

            // Vùng nhiễm từ trên dây đàn ngay phía trên nam châm (N trên, S dưới)
            const midY = sY - vibAmp;
            roundBox(197, midY - 18, 38, 36, 5, '#0f172a', '#fbbf24', 1.8);
            ctx.fillStyle = '#fca5a5';
            ctx.font = `800 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('N', 216, midY - 8);
            ctx.fillStyle = '#93c5fd';
            ctx.fillText('S', 216, midY + 9);

            // 2. Đường sức từ biến thiên giữa nam châm và dây đàn
            const magAlpha = 0.35 + 0.35 * Math.abs(vib);
            ctx.strokeStyle = `rgba(56, 189, 248, ${magAlpha.toFixed(2)})`;
            ctx.lineWidth = 2;
            ctx.setLineDash([4, 4]);
            for (const dx of [-26, 0, 26]) {
                ctx.beginPath();
                ctx.moveTo(216 + dx, 148);
                ctx.quadraticCurveTo(216 + dx * 1.4, 128, 216 + dx * 0.7, midY + 18);
                ctx.stroke();
            }
            ctx.setLineDash([]);

            // 3. Nam châm vĩnh cửu thẳng đứng & Cuộn dây đồng
            const mx = 176, mw = 80;
            roundBox(mx, 144, mw, 34, 5, '#ef4444', '#fca5a5', 2.2);
            ctx.fillStyle = '#ffffff';
            ctx.font = `800 17px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('N', 216, 161);

            roundBox(mx, 240, mw, 34, 5, '#3b82f6', '#93c5fd', 2.2);
            ctx.fillStyle = '#ffffff';
            ctx.fillText('S', 216, 257);

            roundBox(mx - 12, 176, mw + 24, 66, 6, '#334155', '#94a3b8', 2.2);
            const gradCu = ctx.createLinearGradient(mx - 8, 0, mx + mw + 8, 0);
            gradCu.addColorStop(0, '#9a3412');
            gradCu.addColorStop(0.5, '#f59e0b');
            gradCu.addColorStop(1, '#7c2d12');
            roundBox(mx - 8, 180, mw + 16, 58, 4, gradCu, '#fde68a', 1.8);

            ctx.strokeStyle = 'rgba(67, 20, 7, 0.75)';
            ctx.lineWidth = 2;
            for (let yy = 187; yy <= 232; yy += 6.5) {
                ctx.beginPath();
                ctx.moveTo(mx - 7, yy);
                ctx.lineTo(mx + mw + 7, yy);
                ctx.stroke();
            }

            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 2.8;
            ctx.beginPath();
            ctx.moveTo(mx + mw + 8, 194); ctx.lineTo(318, 194);
            ctx.moveTo(mx + mw + 8, 226); ctx.lineTo(318, 226);
            ctx.stroke();

            roundBox(318, 182, 120, 56, 8, '#0f172a', '#10b981', 2);
            ctx.fillStyle = '#6ee7b7';
            ctx.font = `800 15px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText('Đến Ampli', 378, 200);
            ctx.strokeStyle = '#34d399';
            ctx.lineWidth = 2;
            ctx.beginPath();
            for (let xx = 0; xx <= 88; xx += 4) {
                const sx = 334 + xx;
                const sy = 221 + Math.sin(xx * 0.28 + t * 8) * 6;
                if (xx === 0) ctx.moveTo(sx, sy);
                else ctx.lineTo(sx, sy);
            }
            ctx.stroke();

            // Callout nhãn sạch sẽ (chạm chính xác vào dây đàn)
            drawCallout(104, yTouch, 22, 46, 174, 26, 'Dây guitar kim loại', '#fbbf24');
            drawCallout(256, 158, 286, 134, 134, 28, 'Nam châm', '#ef4444');
            drawCallout(168, 210, 22, 198, 118, 28, 'Cuộn dây', '#f59e0b');

            // 4. Bảng thông số bên phải (Zero Data Leakage)
            roundBox(454, 44, 314, 246, 10, '#0f172a', '#38bdf8', 2);
            ctx.fillStyle = '#38bdf8';
            ctx.font = `800 15.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'left';
            ctx.fillText('THÔNG SỐ BỘ THU (PICKUP)', 472, 70);

            ctx.fillStyle = '#f8fafc';
            ctx.font = `700 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('• Số vòng cuộn dây: N = 500 vòng', 472, 104);
            ctx.fillText('• Diện tích vòng: S = 0,0005 m²', 472, 134);
            ctx.fillStyle = '#fde68a';
            ctx.fillText('• Tần số dao động: f = 460 Hz', 472, 166);
            ctx.fillStyle = '#7dd3fc';
            ctx.fillText('• Độ lớn cảm ứng từ: B = 0,02 T', 472, 198);
            ctx.fillStyle = '#cbd5e1';
            ctx.fillText('• Dây đàn nhiễm từ dao động', 472, 232);
            ctx.fillText('  tạo từ trường biến thiên qua cuộn', 472, 258);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 58 (MH-STAGING-C3-04 · VLXT-DS-VD28-058): Cấu tạo loa điện động (hình a) và đồ thị điện áp tín hiệu âm thanh theo thời gian (hình b)
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C3-04', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
            for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(x, y, bw, bh, r);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function arrowLine(x1, y1, x2, y2, col, lw = 2.4, hl = 8) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }

            // Tiêu đề
            ctx.save();
            const title = 'MÔ HÌNH LOA ĐIỆN ĐỘNG (HÌNH a) & ĐỒ THỊ ĐIỆN ÁP TÍN HIỆU (HÌNH b)';
            ctx.font = `800 14.5px 'Segoe UI', system-ui, sans-serif`;
            const titleW = Math.min(752, ctx.measureText(title).width + 26);
            roundBox(14, 10, titleW, 28, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, 27, 24);
            ctx.restore();

            const saw = (t * 0.16) % 1;
            const tCur = saw * 30;
            const uCur = 4 * Math.cos((2 * Math.PI / 7.5) * tCur);
            const disp = (uCur / 4) * 6;

            ctx.save();
            // === PANEL TRÁI: HÌNH a — LOA ĐIỆN ĐỘNG ===
            roundBox(14, 46, 344, 248, 10, 'rgba(15, 23, 42, 0.7)', 'rgba(56, 189, 248, 0.35)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.font = `800 15px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText('Hình a: Loa điện động', 26, 65);

            const lx = 152, ly = 166;
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 3.2;
            ctx.beginPath();
            ctx.moveTo(lx - 92, ly - 50);
            ctx.lineTo(lx - 46, ly + 22);
            ctx.lineTo(lx - 46, ly + 66);
            ctx.lineTo(lx + 46, ly + 66);
            ctx.lineTo(lx + 46, ly + 22);
            ctx.lineTo(lx + 92, ly - 50);
            ctx.stroke();

            roundBox(lx - 58, ly + 30, 34, 42, 4, '#3b82f6', '#93c5fd', 1.8);
            roundBox(lx + 24, ly + 30, 34, 42, 4, '#3b82f6', '#93c5fd', 1.8);
            roundBox(lx - 14, ly + 26, 28, 46, 3, '#ef4444', '#fca5a5', 1.8);
            roundBox(lx - 58, ly + 64, 116, 14, 3, '#475569', '#94a3b8', 1.8);

            const cyOff = disp;
            roundBox(lx - 22, ly + 12 + cyOff, 44, 38, 4, '#b45309', '#fbbf24', 2);
            ctx.strokeStyle = '#fde68a';
            ctx.lineWidth = 1.6;
            for (let yy = ly + 18 + cyOff; yy <= ly + 44 + cyOff; yy += 5) {
                ctx.beginPath();
                ctx.moveTo(lx - 20, yy);
                ctx.lineTo(lx + 20, yy);
                ctx.stroke();
            }

            ctx.fillStyle = 'rgba(226, 232, 240, 0.22)';
            ctx.strokeStyle = '#f8fafc';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(lx - 88, ly - 48 + cyOff);
            ctx.lineTo(lx - 22, ly + 14 + cyOff);
            ctx.lineTo(lx + 22, ly + 14 + cyOff);
            ctx.lineTo(lx + 88, ly - 48 + cyOff);
            ctx.fill();
            ctx.stroke();

            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 2.4;
            ctx.beginPath();
            ctx.moveTo(lx + 22, ly + 20 + cyOff); ctx.lineTo(lx + 62, ly + 4);
            ctx.moveTo(lx + 22, ly + 30 + cyOff); ctx.lineTo(lx + 62, ly + 16);
            ctx.stroke();
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath(); ctx.arc(lx + 62, ly + 4, 4, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(lx + 62, ly + 16, 4, 0, Math.PI * 2); ctx.fill();

            ctx.fillStyle = '#f8fafc';
            ctx.font = `700 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText('Màng loa', lx, ly - 62 + cyOff);

            ctx.textAlign = 'left';
            ctx.fillStyle = '#fde68a';
            ctx.fillText('Tín hiệu', lx + 74, ly + 2);
            ctx.fillText('vào loa', lx + 74, ly + 20);

            // Đường chỉ dẫn gọn từ chữ "Cuộn dây" tới thân cuộn dây
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.moveTo(lx - 58, ly + 18);
            ctx.lineTo(lx - 22, ly + 28 + cyOff);
            ctx.stroke();
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath(); ctx.arc(lx - 22, ly + 28 + cyOff, 3.2, 0, Math.PI * 2); ctx.fill();
            ctx.textAlign = 'right';
            ctx.fillText('Cuộn dây', lx - 62, ly + 18);

            ctx.textAlign = 'center';
            ctx.fillStyle = '#93c5fd';
            ctx.fillText('Nam châm vĩnh cửu', lx, ly + 96);

            // === PANEL PHẢI: HÌNH b — ĐỒ THỊ u(V) - t(10^-5 s) ===
            roundBox(370, 46, 396, 248, 10, '#0f172a', 'rgba(56, 189, 248, 0.45)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.font = `800 15px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'left';
            ctx.fillText('Hình b: Đồ thị điện áp tín hiệu', 384, 65);

            const ox = 418, oy = 178;
            const tScale = 9.4;
            const uScale = 17.5;

            ctx.strokeStyle = 'rgba(148, 163, 184, 0.24)';
            ctx.lineWidth = 1;
            ctx.setLineDash([3, 3]);
            for (let uv = -4; uv <= 4; uv++) {
                const yy = oy - uv * uScale;
                ctx.beginPath();
                ctx.moveTo(ox, yy);
                ctx.lineTo(ox + 33 * tScale, yy);
                ctx.stroke();
            }
            for (let tv = 5; tv <= 30; tv += 5) {
                const xx = ox + tv * tScale;
                ctx.beginPath();
                ctx.moveTo(xx, oy - 4.4 * uScale);
                ctx.lineTo(xx, oy + 4.4 * uScale);
                ctx.stroke();
            }
            ctx.setLineDash([]);

            arrowLine(ox, oy + 4.5 * uScale, ox, oy - 5.1 * uScale, '#f1f5f9', 2.4, 8);
            arrowLine(ox - 4, oy, ox + 34.5 * tScale, oy, '#f1f5f9', 2.4, 8);

            ctx.fillStyle = '#f8fafc';
            ctx.font = `800 15px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'left';
            ctx.fillText('u (V)', ox + 10, oy - 5.1 * uScale + 8);
            ctx.textAlign = 'right';
            ctx.fillText('t (10⁻⁵ s)', 754, oy - 16);

            ctx.textAlign = 'right';
            ctx.fillText('4', ox - 8, oy - 4 * uScale);
            ctx.fillText('O', ox - 8, oy + 4);
            ctx.fillText('-4', ox - 8, oy + 4 * uScale);

            ctx.strokeStyle = '#22c55e';
            ctx.lineWidth = 3;
            ctx.beginPath();
            for (let tt = 0; tt <= 30.8; tt += 0.2) {
                const px = ox + tt * tScale;
                const py = oy - 4 * Math.cos((2 * Math.PI / 7.5) * tt) * uScale;
                if (tt === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.stroke();

            ctx.font = `800 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'center';
            for (const tv of [5, 10, 15, 20, 25, 30]) {
                const xx = ox + tv * tScale;
                ctx.fillStyle = '#ef4444';
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 1.4;
                ctx.beginPath();
                ctx.arc(xx, oy, 3.6, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = '#cbd5e1';
                ctx.fillText(String(tv), xx, oy + 18);
            }

            const curX = ox + tCur * tScale;
            const curY = oy - uCur * uScale;
            ctx.fillStyle = '#fbbf24';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2.2;
            ctx.beginPath();
            ctx.arc(curX, curY, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        });

    // =========================================================================
    // CÂU 59 (MH-STAGING-C3-05 · VLXT-DS-VD28-059): Từ trường quanh dây dẫn thẳng dài mang dòng điện hướng ra mặt phẳng hình vẽ
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C3-05', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
            for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(x, y, bw, bh, r);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function arrowLine(x1, y1, x2, y2, col, lw = 3, hl = 10) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }

            function drawDotI(x, y, r, col) {
                ctx.save();
                ctx.fillStyle = '#0f172a';
                ctx.strokeStyle = col;
                ctx.lineWidth = 3;
                ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                ctx.fillStyle = col;
                ctx.beginPath(); ctx.arc(x, y, r * 0.34, 0, Math.PI * 2); ctx.fill();
                ctx.restore();
            }

            function drawSubVec(base, sub, x, y, col = '#f8fafc', baseSz = 17) {
                const subSz = Math.max(13, Math.round(baseSz * 0.78));
                ctx.save();
                ctx.fillStyle = col;
                ctx.textAlign = 'left';
                ctx.textBaseline = 'alphabetic';
                ctx.font = `italic 800 ${baseSz}px 'Segoe UI', system-ui, sans-serif`;
                const bw = ctx.measureText(base).width;
                ctx.fillText(base, x, y);
                if (sub) {
                    ctx.font = `800 ${subSz}px 'Segoe UI', system-ui, sans-serif`;
                    ctx.fillText(sub, x + bw + 2, y + 4);
                }
                const vy = y - baseSz + 1;
                ctx.strokeStyle = col;
                ctx.lineWidth = 1.8;
                ctx.beginPath();
                ctx.moveTo(x, vy); ctx.lineTo(x + bw + 3, vy);
                ctx.lineTo(x + bw - 1, vy - 3);
                ctx.moveTo(x + bw + 3, vy);
                ctx.lineTo(x + bw - 1, vy + 3);
                ctx.stroke();
                ctx.restore();
            }

            // Tiêu đề: mở rộng tự động vừa khít chữ
            ctx.save();
            const title = 'BIỂU DIỄN TỪ TRƯỜNG CỦA DÒNG ĐIỆN THẲNG DÀI I TẠI ĐIỂM M';
            ctx.font = `800 14.5px 'Segoe UI', system-ui, sans-serif`;
            const titleW = Math.min(750, ctx.measureText(title).width + 26);
            roundBox(14, 10, titleW, 28, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, 27, 24);
            ctx.restore();

            const saw = (t * 0.35) % 1;

            ctx.save();
            roundBox(20, 48, 396, 242, 10, 'rgba(15, 23, 42, 0.65)', 'rgba(148, 163, 184, 0.35)', 1.8);

            const ix = 292, iy = 122;
            const mx = 148, my = 186;

            // Giới hạn bán kính tối đa để vòng tròn tỏa ra nằm gọn bên trong khung trái
            for (let k = 0; k < 3; k++) {
                const p = (saw + k / 3) % 1;
                const r = 24 + p * 84;
                const alpha = Math.max(0.05, 0.34 * (1 - p));
                ctx.strokeStyle = `rgba(56, 189, 248, ${alpha.toFixed(2)})`;
                ctx.lineWidth = 1.6;
                ctx.setLineDash([5, 5]);
                ctx.beginPath();
                ctx.arc(ix, iy, r, 0, Math.PI * 2);
                ctx.stroke();
            }
            ctx.setLineDash([]);

            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 2.4;
            ctx.setLineDash([7, 5]);
            ctx.beginPath();
            ctx.moveTo(ix, iy);
            ctx.lineTo(mx, my);
            ctx.stroke();
            ctx.setLineDash([]);

            drawDotI(ix, iy, 17, '#fbbf24');
            ctx.fillStyle = '#fbbf24';
            ctx.font = `800 18px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText('I', ix + 26, iy);

            ctx.fillStyle = '#f8fafc';
            ctx.beginPath();
            ctx.arc(mx, my, 5.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.font = `800 17px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'right';
            ctx.fillText('M', mx - 12, my - 10);

            arrowLine(mx, my, mx, my + 72, '#38bdf8', 3.2, 10);
            drawSubVec('B', 'M', mx + 14, my + 54, '#38bdf8', 18);

            ctx.fillStyle = '#cbd5e1';
            ctx.font = `700 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText('Hình vẽ đề bài cần kiểm chứng', 218, 272);

            roundBox(434, 48, 332, 242, 10, '#0f172a', '#38bdf8', 2);
            ctx.fillStyle = '#38bdf8';
            ctx.font = `800 15.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'left';
            ctx.fillText('DỮ KIỆN XÉT TỪ TRƯỜNG', 454, 76);

            ctx.fillStyle = '#f8fafc';
            ctx.font = `700 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('• Từ trường tồn tại quanh nam châm', 454, 112);
            ctx.fillText('  và quanh dòng điện', 454, 138);
            ctx.fillStyle = '#fde68a';
            ctx.fillText('• Dây dẫn thẳng dài vô hạn mang dòng I', 454, 174);
            ctx.fillText('  hướng vuông góc ra ngoài (⊙)', 454, 200);
            ctx.fillStyle = '#7dd3fc';
            ctx.fillText('• Xét biểu diễn cảm ứng từ tại điểm M', 454, 236);
            ctx.fillStyle = '#cbd5e1';
            ctx.fillText('  và tính chất đường sức từ', 454, 262);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 60 (MH-STAGING-C3-06 · VLXT-DS-VD28-060): Đưa cực Bắc thanh nam châm lại gần cuộn dây nối điện kế (định luật Lenz)
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C3-06', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
            for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(x, y, bw, bh, r);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function arrowLine(x1, y1, x2, y2, col, lw = 3, hl = 10) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }

            // Tiêu đề: mở rộng vừa khít chữ
            ctx.save();
            const title = 'THÍ NGHIỆM CẢM ỨNG ĐIỆN TỪ (ĐƯA NAM CHÂM LẠI GẦN CUỘN DÂY)';
            ctx.font = `800 14.5px 'Segoe UI', system-ui, sans-serif`;
            const titleW = Math.min(750, ctx.measureText(title).width + 26);
            roundBox(14, 10, titleW, 28, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, 27, 24);
            ctx.restore();

            const saw = (t * 0.24) % 1;
            const magX = 338 - saw * 72;

            ctx.save();
            const cx = 42, cy = 84, cw = 186, ch = 58;
            const gradCore = ctx.createLinearGradient(0, cy, 0, cy + ch);
            gradCore.addColorStop(0, '#cbd5e1');
            gradCore.addColorStop(0.5, '#f8fafc');
            gradCore.addColorStop(1, '#94a3b8');
            roundBox(cx, cy, cw, ch, 8, gradCore, '#64748b', 2);

            ctx.strokeStyle = '#b45309';
            ctx.lineWidth = 3.2;
            const turns = 11;
            for (let i = 0; i < turns; i++) {
                const tx = cx + 16 + i * 14.5;
                ctx.beginPath();
                ctx.ellipse(tx, cy + ch / 2, 5, ch / 2 + 2, 0, -Math.PI * 0.55, Math.PI * 0.55);
                ctx.stroke();
            }

            ctx.fillStyle = '#fbbf24';
            ctx.font = `800 18px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('X', cx + cw + 8, cy - 12);

            const gx = 135, gy = 224, gr = 38;
            ctx.strokeStyle = '#d97706';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(cx + 16, cy + ch);
            ctx.lineTo(cx + 16, gy);
            ctx.lineTo(gx - gr, gy);
            ctx.moveTo(cx + 16 + (turns - 1) * 14.5, cy + ch);
            ctx.lineTo(cx + 16 + (turns - 1) * 14.5, gy);
            ctx.lineTo(gx + gr, gy);
            ctx.stroke();

            ctx.fillStyle = '#f8fafc';
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 3.2;
            ctx.beginPath();
            ctx.arc(gx, gy, gr, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Tách hẳn tâm kim (gy + 4) và nhãn G (gy + 22) để không chạm nhau
            const pivotY = gy + 4;
            ctx.strokeStyle = '#334155';
            ctx.lineWidth = 1.6;
            ctx.beginPath();
            ctx.arc(gx, pivotY, gr - 12, -Math.PI * 0.82, -Math.PI * 0.18);
            ctx.stroke();
            for (let i = -3; i <= 3; i++) {
                const a = -Math.PI / 2 + i * 0.22;
                ctx.beginPath();
                ctx.moveTo(gx + Math.cos(a) * (gr - 14), pivotY + Math.sin(a) * (gr - 14));
                ctx.lineTo(gx + Math.cos(a) * (gr - 8), pivotY + Math.sin(a) * (gr - 8));
                ctx.stroke();
            }
            ctx.fillStyle = '#0f172a';
            ctx.font = `800 15px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('G', gx, gy + 22);

            const nang = -Math.PI / 2 - 0.52;
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 2.8;
            ctx.beginPath();
            ctx.moveTo(gx, pivotY);
            ctx.lineTo(gx + Math.cos(nang) * (gr - 10), pivotY + Math.sin(nang) * (gr - 10));
            ctx.stroke();
            ctx.fillStyle = '#334155';
            ctx.beginPath();
            ctx.arc(gx, pivotY, 4, 0, Math.PI * 2);
            ctx.fill();

            const my = 96, mw = 136, mh = 36;
            roundBox(magX, my, mw / 2, mh, 4, '#ef4444', '#fca5a5', 2);
            roundBox(magX + mw / 2, my, mw / 2, mh, 4, '#3b82f6', '#93c5fd', 2);
            ctx.fillStyle = '#ffffff';
            ctx.font = `800 17px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('N', magX + mw * 0.25, my + mh / 2);
            ctx.fillText('S', magX + mw * 0.75, my + mh / 2);

            arrowLine(magX + mw * 0.72, my - 18, magX + mw * 0.25, my - 18, '#fbbf24', 3, 9);
            ctx.fillStyle = '#fde68a';
            ctx.font = `italic 800 15.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('v', magX + mw * 0.48, my - 30);

            roundBox(486, 44, 282, 246, 10, '#0f172a', '#38bdf8', 2);
            ctx.fillStyle = '#38bdf8';
            ctx.font = `800 15.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'left';
            ctx.fillText('THÍ NGHIỆM CẢM ỨNG', 504, 72);

            ctx.fillStyle = '#f8fafc';
            ctx.font = `700 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('• Cuộn dây kín nối điện kế G', 504, 108);
            ctx.fillText('• Đầu phải cuộn dây: mặt X', 504, 140);
            ctx.fillStyle = '#fca5a5';
            ctx.fillText('• Đưa cực Bắc (N) nam châm', 504, 174);
            ctx.fillText('  tiến lại gần cuộn dây (←)', 504, 200);
            ctx.fillStyle = '#7dd3fc';
            ctx.fillText('• Quan sát kim điện kế G lệch', 504, 234);
            ctx.fillStyle = '#cbd5e1';
            ctx.fillText('  trong lúc nam châm dịch chuyển', 504, 260);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 61 (MH-STAGING-C3-07 · VLXT-DS-VD28-061): Tương tác từ hút nhau giữa hai dây dẫn song song mang dòng điện cùng chiều
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C3-07', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
            for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(x, y, bw, bh, r);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            // Tiêu đề: mở rộng vừa khít chữ
            ctx.save();
            const title = 'TƯƠNG TÁC TỪ GIỮA HAI DÂY DẪN THẲNG MẮC SONG SONG';
            ctx.font = `800 14.5px 'Segoe UI', system-ui, sans-serif`;
            const titleW = Math.min(750, ctx.measureText(title).width + 26);
            roundBox(14, 10, titleW, 28, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, 27, 24);
            ctx.restore();

            const saw = (t * 0.24) % 1;
            const bendFrac = saw < 0.28 ? 0 : Math.min(1, (saw - 0.28) / 0.45);
            const pull = bendFrac * 18;

            ctx.save();
            const bx = 132, by = 50, bw = 166, bh = 238;
            roundBox(bx, by, bw, bh, 10, '#1e293b', '#64748b', 2.4);

            roundBox(bx + 24, by + 12, bw - 48, 14, 4, '#f8fafc', '#94a3b8', 1.8);

            const xL = bx + 52, xR = bx + bw - 52;
            const topY = by + 26, botY = by + bh - 22;

            ctx.fillStyle = '#f8fafc';
            ctx.beginPath(); ctx.arc(xL, botY, 7, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(xR, botY, 7, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#0f172a';
            ctx.beginPath(); ctx.arc(xL, botY, 3, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(xR, botY, 3, 0, Math.PI * 2); ctx.fill();

            ctx.lineCap = 'round';
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 3.8;
            ctx.beginPath();
            ctx.moveTo(xL, topY);
            ctx.bezierCurveTo(xL + pull * 1.1, topY + 60, xL + pull * 1.1, botY - 60, xL, botY);
            ctx.stroke();

            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 3.8;
            ctx.beginPath();
            ctx.moveTo(xR, topY);
            ctx.bezierCurveTo(xR - pull * 1.1, topY + 60, xR - pull * 1.1, botY - 60, xR, botY);
            ctx.stroke();

            // Nhãn trạng thái bên trái
            roundBox(16, 128, 106, 52, 8, '#0f172a', bendFrac > 0.1 ? '#10b981' : '#94a3b8', 1.8);
            ctx.fillStyle = bendFrac > 0.1 ? '#6ee7b7' : '#cbd5e1';
            ctx.font = `800 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(bendFrac > 0.1 ? 'Có dòng điện' : 'Ban đầu', 69, 144);
            ctx.fillText(bendFrac > 0.1 ? '→ Hút nhau' : 'Song song', 69, 165);

            // Callout chỉ rõ Giá treo và Hai dây dẫn
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.moveTo(bx + bw - 24, by + 19);
            ctx.lineTo(314, by + 19);
            ctx.stroke();
            roundBox(314, by + 6, 84, 26, 6, '#0f172a', '#94a3b8', 1.8);
            ctx.fillStyle = '#f8fafc';
            ctx.font = `700 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('Giá treo', 356, by + 19);

            const midWireX = xR - pull * 0.82;
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.moveTo(midWireX, by + 132);
            ctx.lineTo(312, by + 132);
            ctx.stroke();
            ctx.fillStyle = '#ef4444';
            ctx.beginPath(); ctx.arc(midWireX, by + 132, 3.5, 0, Math.PI * 2); ctx.fill();
            roundBox(312, by + 108, 118, 48, 6, '#0f172a', '#ef4444', 1.8);
            ctx.fillStyle = '#fca5a5';
            ctx.fillText('Hai dây dẫn', 371, by + 123);
            ctx.fillText('song song', 371, by + 143);

            // Bảng dữ kiện đề bài bên phải (Zero Data Leakage)
            roundBox(442, 46, 326, 244, 10, '#0f172a', '#38bdf8', 2);
            ctx.fillStyle = '#38bdf8';
            ctx.font = `800 15.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'left';
            ctx.fillText('THÍ NGHIỆM TƯƠNG TÁC TỪ', 462, 74);

            ctx.fillStyle = '#f8fafc';
            ctx.font = `700 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('• Hai dây dẫn thẳng, nhẹ đặt', 462, 110);
            ctx.fillText('  song song gần nhau trên giá treo', 462, 136);
            ctx.fillStyle = '#fde68a';
            ctx.fillText('• Cho dòng điện đi qua hai dây', 462, 172);
            ctx.fillStyle = '#6ee7b7';
            ctx.fillText('• Trạng thái quan sát: hai dây', 462, 206);
            ctx.fillText('  kéo cong hút lại gần nhau', 462, 232);
            ctx.fillStyle = '#cbd5e1';
            ctx.fillText('• Khảo sát chiều & tương tác từ', 462, 266);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 62 (MH-STAGING-C3-08 · VLXT-DS-VD28-062): Con lăn kim loại trên hai thanh ray nằm trong khe nam châm chữ U nối nguồn một chiều
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C3-08', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
            for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(x, y, bw, bh, r);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function drawCallout(tx, ty, bx, by, bw, bh, text, col = '#38bdf8') {
                ctx.save();
                const ax = (bx + bw < tx) ? (bx + bw) : (bx > tx ? bx : bx + bw / 2);
                const ay = (by + bh < ty) ? (by + bh) : (by > ty ? by : by + bh / 2);
                ctx.strokeStyle = col;
                ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(ax, ay); ctx.stroke();
                ctx.fillStyle = col;
                ctx.beginPath(); ctx.arc(tx, ty, 3.6, 0, Math.PI * 2); ctx.fill();
                roundBox(bx, by, bw, bh, 6, '#0f172a', col, 1.8);
                ctx.fillStyle = '#f8fafc';
                ctx.font = `700 14.5px 'Segoe UI', system-ui, sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(text, bx + bw / 2, by + bh / 2);
                ctx.restore();
            }

            // Tiêu đề: mở rộng vừa khít chữ
            ctx.save();
            const title = 'MÔ HÌNH CON LĂN KIM LOẠI TRÊN HAI THANH RAY TRONG TỪ TRƯỜNG';
            ctx.font = `800 14.5px 'Segoe UI', system-ui, sans-serif`;
            const titleW = Math.min(750, ctx.measureText(title).width + 26);
            roundBox(14, 10, titleW, 28, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, 27, 24);
            ctx.restore();

            const saw = (t * 0.35) % 1;
            const pulseAlpha = 0.4 + 0.6 * (1 - saw);

            ctx.save();
            ctx.fillStyle = '#1e293b';
            ctx.strokeStyle = '#64748b';
            ctx.lineWidth = 2.2;
            ctx.beginPath();
            ctx.moveTo(22, 232);
            ctx.lineTo(382, 262);
            ctx.lineTo(426, 238);
            ctx.lineTo(74, 208);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Nam châm chữ U nằm ngang: S trên, N dưới
            roundBox(96, 86, 54, 134, 6, '#475569', '#94a3b8', 2.2);
            roundBox(132, 184, 146, 36, 6, '#ef4444', '#fca5a5', 2.2);
            ctx.fillStyle = '#ffffff';
            ctx.font = `800 18px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('N', 254, 202);

            roundBox(54, 132, 20, 96, 4, '#78350f', '#d97706', 2);

            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(46, 154);
            ctx.lineTo(364, 178);
            ctx.stroke();

            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 5.5;
            ctx.beginPath();
            ctx.moveTo(46, 174);
            ctx.lineTo(364, 198);
            ctx.stroke();

            const rBackX = 232, rBackY = 168;
            const rFrontX = 202, rFrontY = 186;
            ctx.fillStyle = '#94a3b8';
            ctx.strokeStyle = '#f8fafc';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.ellipse(rBackX, rBackY, 9, 13, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            ctx.strokeStyle = `rgba(251, 191, 36, ${pulseAlpha.toFixed(2)})`;
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.moveTo(rBackX, rBackY);
            ctx.lineTo(rFrontX, rFrontY);
            ctx.stroke();

            ctx.fillStyle = '#cbd5e1';
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 2.2;
            ctx.beginPath();
            ctx.ellipse(rFrontX, rFrontY, 10, 14, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            roundBox(132, 86, 146, 40, 6, '#3b82f6', '#93c5fd', 2.4);
            ctx.fillStyle = '#ffffff';
            ctx.font = `800 18px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('S', 254, 106);

            roundBox(344, 152, 24, 96, 4, '#334155', '#94a3b8', 2);

            roundBox(364, 172, 18, 12, 3, '#3b82f6', '#93c5fd', 1.8);
            ctx.strokeStyle = '#93c5fd';
            ctx.lineWidth = 2.6;
            ctx.beginPath();
            ctx.moveTo(382, 178);
            ctx.quadraticCurveTo(416, 188, 434, 180);
            ctx.stroke();
            ctx.fillStyle = '#93c5fd';
            ctx.font = `800 18px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('–', 446, 180);

            roundBox(364, 192, 18, 12, 3, '#ef4444', '#fca5a5', 1.8);
            ctx.strokeStyle = '#fca5a5';
            ctx.lineWidth = 2.6;
            ctx.beginPath();
            ctx.moveTo(382, 198);
            ctx.quadraticCurveTo(412, 224, 434, 214);
            ctx.stroke();
            ctx.fillStyle = '#fca5a5';
            ctx.fillText('+', 446, 214);

            // Callout sạch sẽ: không đi cắt ngang cực S hay chữ N
            drawCallout(64, 134, 16, 50, 90, 26, 'Tấm gỗ', '#d97706');
            drawCallout(96, 178, 22, 256, 146, 26, 'Thanh kim loại', '#cbd5e1');
            drawCallout(202, 199, 194, 256, 94, 26, 'Con lăn', '#fbbf24');

            // Bảng dữ kiện đề dẫn bên phải (Zero Data Leakage)
            roundBox(476, 44, 292, 246, 10, '#0f172a', '#38bdf8', 2);
            ctx.fillStyle = '#38bdf8';
            ctx.font = `800 15.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'left';
            ctx.fillText('MÔ HÌNH CON LĂN TỪ', 494, 72);

            ctx.fillStyle = '#f8fafc';
            ctx.font = `700 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('• Hai thanh kim loại song song', 494, 108);
            ctx.fillText('• Con lăn chạm cả hai thanh', 494, 136);
            ctx.fillText('  làm thành mạch điện kín', 494, 162);
            ctx.fillStyle = '#7dd3fc';
            ctx.fillText('• Nam châm chữ U: S trên, N dưới', 494, 196);
            ctx.fillStyle = '#fde68a';
            ctx.fillText('• Thanh trước (+), thanh sau (–)', 494, 228);
            ctx.fillStyle = '#cbd5e1';
            ctx.fillText('• Khảo sát lực từ & cảm ứng từ', 494, 260);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 63 (MH-STAGING-C3-09 · VLXT-DS-VD28-063): Máy phát điện xoay chiều gia đình (220 V hiệu dụng) và quy tắc an toàn vận hành
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C3-09', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
            for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(x, y, bw, bh, r);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            // Tiêu đề: mở rộng vừa khít chữ
            ctx.save();
            const title = 'MÁY PHÁT ĐIỆN XOAY CHIỀU GIA ĐÌNH & AN TOÀN SỬ DỤNG';
            ctx.font = `800 14.5px 'Segoe UI', system-ui, sans-serif`;
            const titleW = Math.min(750, ctx.measureText(title).width + 26);
            roundBox(14, 10, titleW, 28, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, 27, 24);
            ctx.restore();

            const saw = (t * 0.35) % 1;
            const rot = t * 5.0;

            ctx.save();
            const gx = 98, gy = 68, gw = 312, gh = 206;
            roundBox(gx, gy, gw, gh, 16, 'rgba(30, 41, 59, 0.45)', '#cbd5e1', 6);
            roundBox(gx, gy, gw, gh, 16, null, '#475569', 2.2);

            roundBox(gx + 34, gy + 10, gw - 68, 36, 8, '#dc2626', '#fca5a5', 2);
            roundBox(gx + 54, gy + 4, 24, 8, 3, '#334155', '#94a3b8', 1.6);

            roundBox(gx + 18, gy + 46, gw - 36, 48, 6, '#ef4444', '#fca5a5', 2);
            ctx.fillStyle = '#ffffff';
            ctx.font = `800 15px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText('AC GENERATOR', gx + 34, gy + 70);

            roundBox(gx + 26, gy + 104, 114, 86, 8, '#334155', '#94a3b8', 2);
            const fx = gx + 82, fy = gy + 148;
            ctx.fillStyle = '#1e293b';
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 3;
            ctx.beginPath(); ctx.arc(fx, fy, 28, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.save();
            ctx.translate(fx, fy);
            ctx.rotate(rot);
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 3;
            for (let k = 0; k < 3; k++) {
                const a = (k * Math.PI * 2) / 3;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(Math.cos(a) * 24, Math.sin(a) * 24);
                ctx.stroke();
            }
            ctx.restore();

            roundBox(gx + 152, gy + 104, 134, 86, 8, '#0f172a', '#64748b', 2);
            roundBox(gx + 168, gy + 122, 42, 42, 6, '#1e293b', '#94a3b8', 1.8);
            ctx.fillStyle = '#f8fafc';
            ctx.beginPath(); ctx.arc(gx + 181, gy + 143, 3.5, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(gx + 197, gy + 143, 3.5, 0, Math.PI * 2); ctx.fill();

            roundBox(gx + 220, gy + 122, 56, 42, 5, '#050811', '#10b981', 1.8);
            ctx.fillStyle = '#6ee7b7';
            ctx.font = `800 15px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText('220 V', gx + 248, gy + 136);
            ctx.fillStyle = '#cbd5e1';
            ctx.font = `700 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('~ AC', gx + 248, gy + 154);

            // Ống xả & Luồng khí thải (sawtooth 1 chiều)
            roundBox(gx - 18, gy + 120, 22, 24, 4, '#475569', '#94a3b8', 2);
            for (let k = 0; k < 4; k++) {
                const p = (saw + k / 4) % 1;
                const px = gx - 24 - p * 54;
                const py = gy + 132 - p * 36;
                const pr = 6 + p * 12;
                const al = Math.max(0.05, 0.55 * (1 - p));
                ctx.fillStyle = `rgba(148, 163, 184, ${al.toFixed(2)})`;
                ctx.beginPath();
                ctx.arc(px, py, pr, 0, Math.PI * 2);
                ctx.fill();
            }
            roundBox(14, 92, 76, 48, 7, '#0f172a', '#ef4444', 1.8);
            ctx.fillStyle = '#fca5a5';
            ctx.font = `800 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText('Khí thải', 52, 108);
            ctx.fillText('động cơ', 52, 126);

            // Bảng dữ kiện đề dẫn bên phải (Zero Data Leakage)
            roundBox(434, 46, 334, 244, 10, '#0f172a', '#38bdf8', 2);
            ctx.fillStyle = '#38bdf8';
            ctx.font = `800 15.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'left';
            ctx.fillText('VẬN HÀNH MÁY PHÁT ĐIỆN', 454, 74);

            ctx.fillStyle = '#f8fafc';
            ctx.font = `700 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('• Nguồn điện dự phòng khi mất điện', 454, 108);
            ctx.fillStyle = '#fde68a';
            ctx.fillText('• Động cơ đốt trong đốt nhiên liệu', 454, 140);
            ctx.fillStyle = '#6ee7b7';
            ctx.fillText('• Điện áp hiệu dụng đầu ra: 220 V', 454, 172);
            ctx.fillStyle = '#fca5a5';
            ctx.fillText('• Lưu ý an toàn: tránh phòng kín,', 454, 206);
            ctx.fillText('  trời mưa tạt và nơi ẩm ướt', 454, 232);
            ctx.fillStyle = '#cbd5e1';
            ctx.fillText('• Đặt máy nơi khô ráo, thoáng khí', 454, 264);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 64 (MH-STAGING-C3-10 · VLXT-DS-VD28-064): Đồ thị từ thông Φ(t) và suất điện động e(t) của khung dây 500 vòng quay đều
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C3-10', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
            for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(x, y, bw, bh, r);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function arrowLine(x1, y1, x2, y2, col, lw = 2.6, hl = 8) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }

            function drawStackedFrac(cx, cy, numStr, denStr, col, hasNeg) {
                ctx.save();
                ctx.fillStyle = col;
                ctx.font = '800 14.5px "Segoe UI", system-ui, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                if (hasNeg) {
                    ctx.fillText('−', cx - 26, cy);
                }
                ctx.fillText(numStr, cx, cy - 11);
                ctx.strokeStyle = col;
                ctx.lineWidth = 1.8;
                ctx.beginPath();
                ctx.moveTo(cx - 16, cy);
                ctx.lineTo(cx + 16, cy);
                ctx.stroke();
                ctx.fillText(denStr, cx, cy + 12);
                ctx.restore();
            }

            // Title badge
            ctx.save();
            const title = 'ĐỒ THỊ TỪ THÔNG Φ(t) VÀ SUẤT ĐIỆN ĐỘNG e(t) — KHUNG 500 VÒNG (S = 50 cm²)';
            ctx.font = '800 14.5px "Segoe UI", system-ui, sans-serif';
            const titleW = Math.min(752, ctx.measureText(title).width + 24);
            roundBox(14, 10, titleW, 30, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, 26, 25);
            ctx.restore();

            const saw = (t * 0.18) % 1;

            // Card trái: Hình (a) - Đồ thị Φ(Wb) theo t(ms)
            roundBox(14, 48, 370, 246, 10, 'rgba(15, 23, 42, 0.78)', 'rgba(56, 189, 248, 0.35)', 1.8);
            const ox1 = 104, oy1 = 178, amp1 = 72, per1 = 216;

            // Lưới phụ Hình (a)
            ctx.save();
            ctx.setLineDash([4, 4]);
            ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
            ctx.lineWidth = 1.3;
            for (let k = 1; k <= 4; k++) {
                const gx = ox1 + (k / 4) * per1;
                ctx.beginPath(); ctx.moveTo(gx, oy1 - amp1); ctx.lineTo(gx, oy1 + amp1); ctx.stroke();
            }
            [oy1 - amp1, oy1 + amp1].forEach(gy => {
                ctx.beginPath(); ctx.moveTo(ox1, gy); ctx.lineTo(ox1 + per1, gy); ctx.stroke();
            });
            ctx.restore();

            // Trục tọa độ Hình (a)
            arrowLine(ox1, oy1 + amp1 + 14, ox1, 60, '#e2e8f0', 2.4, 8);
            arrowLine(ox1 - 10, oy1, ox1 + per1 + 44, oy1, '#e2e8f0', 2.4, 8);

            ctx.save();
            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 15.5px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText('Φ (Wb)', ox1 + 10, 68);
            ctx.fillStyle = '#fbbf24';
            ctx.textAlign = 'center';
            ctx.fillText('Hình (a)', 258, 68);

            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 15px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText('O', ox1 - 10, oy1 + 16);
            ctx.textAlign = 'center';
            ctx.fillText('5', ox1 + per1 * 0.5, oy1 + 18);
            ctx.textAlign = 'right';
            ctx.fillText('t (ms)', 374, oy1 - 16);
            ctx.restore();

            drawStackedFrac(64, oy1 - amp1, '1,2', 'π', '#e2e8f0', false);
            drawStackedFrac(68, oy1 + amp1, '1,2', 'π', '#e2e8f0', true);

            // Đường cong cos Hình (a)
            ctx.save();
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 3.2;
            ctx.beginPath();
            for (let i = 0; i <= 80; i++) {
                const u = i / 80;
                const px = ox1 + u * per1;
                const py = oy1 - amp1 * Math.cos(2 * Math.PI * u);
                if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            ctx.stroke();

            // Chấm động + gióng trên Hình (a)
            const x1Dot = ox1 + saw * per1;
            const y1Dot = oy1 - amp1 * Math.cos(2 * Math.PI * saw);
            ctx.strokeStyle = 'rgba(251, 191, 36, 0.45)';
            ctx.lineWidth = 1.6;
            ctx.setLineDash([3, 3]);
            ctx.beginPath(); ctx.moveTo(x1Dot, oy1); ctx.lineTo(x1Dot, y1Dot); ctx.stroke();
            ctx.setLineDash([]);
            ctx.fillStyle = '#fbbf24';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(x1Dot, y1Dot, 6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.restore();

            // Card phải: Hình (b) - Đồ thị e(V) theo t(ms)
            roundBox(396, 48, 370, 246, 10, 'rgba(15, 23, 42, 0.78)', 'rgba(56, 189, 248, 0.35)', 1.8);
            const ox2 = 478, oy2 = 178, amp2 = 72, per2 = 216;

            ctx.save();
            ctx.setLineDash([4, 4]);
            ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
            ctx.lineWidth = 1.3;
            for (let k = 1; k <= 4; k++) {
                const gx = ox2 + (k / 4) * per2;
                ctx.beginPath(); ctx.moveTo(gx, oy2 - amp2); ctx.lineTo(gx, oy2 + amp2); ctx.stroke();
            }
            [oy2 - amp2, oy2 + amp2].forEach(gy => {
                ctx.beginPath(); ctx.moveTo(ox2, gy); ctx.lineTo(ox2 + per2, gy); ctx.stroke();
            });
            ctx.restore();

            arrowLine(ox2, oy2 + amp2 + 14, ox2, 60, '#e2e8f0', 2.4, 8);
            arrowLine(ox2 - 10, oy2, ox2 + per2 + 44, oy2, '#e2e8f0', 2.4, 8);

            ctx.save();
            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 15.5px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText('e (V)', ox2 + 10, 68);
            ctx.fillStyle = '#10b981';
            ctx.textAlign = 'center';
            ctx.fillText('Hình (b)', 640, 68);

            ctx.fillStyle = '#e2e8f0';
            ctx.font = '800 15px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText('240', ox2 - 10, oy2 - amp2);
            ctx.fillText('O', ox2 - 10, oy2 + 16);
            ctx.fillText('−240', ox2 - 10, oy2 + amp2);

            // Số 5 đặt hơi lệch trái điểm cắt trục t = T/2 để không đè lên đường cong cắt qua trục
            ctx.textAlign = 'right';
            ctx.fillText('5', ox2 + per2 * 0.5 - 8, oy2 + 18);
            ctx.fillText('t (ms)', 756, oy2 - 16);
            ctx.restore();

            // Đường cong sin Hình (b)
            ctx.save();
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 3.2;
            ctx.beginPath();
            for (let i = 0; i <= 80; i++) {
                const u = i / 80;
                const px = ox2 + u * per2;
                const py = oy2 - amp2 * Math.sin(2 * Math.PI * u);
                if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            ctx.stroke();

            const x2Dot = ox2 + saw * per2;
            const y2Dot = oy2 - amp2 * Math.sin(2 * Math.PI * saw);
            ctx.strokeStyle = 'rgba(251, 191, 36, 0.45)';
            ctx.lineWidth = 1.6;
            ctx.setLineDash([3, 3]);
            ctx.beginPath(); ctx.moveTo(x2Dot, oy2); ctx.lineTo(x2Dot, y2Dot); ctx.stroke();
            ctx.setLineDash([]);
            ctx.fillStyle = '#fbbf24';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(x2Dot, y2Dot, 6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.restore();
        });

    // =========================================================================
    // CÂU 65 (MH-STAGING-C3-11 · VLXT-DS-VD28-065): Sự lan truyền của sóng điện từ (E, B dao động vuông góc và cùng pha)
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C3-11', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
            for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(x, y, bw, bh, r);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function arrowLine(x1, y1, x2, y2, col, lw = 2.4, hl = 8) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }

            function drawVecLabel(ch, x, y, col) {
                ctx.save();
                ctx.fillStyle = col;
                ctx.font = 'italic 800 17px "Segoe UI", system-ui, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(ch, x, y);
                const vy = y - 13;
                ctx.strokeStyle = col;
                ctx.lineWidth = 1.8;
                ctx.beginPath();
                ctx.moveTo(x - 6, vy); ctx.lineTo(x + 7, vy);
                ctx.lineTo(x + 3, vy - 3);
                ctx.moveTo(x + 7, vy); ctx.lineTo(x + 3, vy + 3);
                ctx.stroke();
                ctx.restore();
            }

            // Title badge
            ctx.save();
            const title = 'SỰ LAN TRUYỀN CỦA SÓNG ĐIỆN TỪ TRONG KHÔNG GIAN';
            ctx.font = '800 14.5px "Segoe UI", system-ui, sans-serif';
            const titleW = Math.min(752, ctx.measureText(title).width + 24);
            roundBox(14, 10, titleW, 30, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, 26, 25);
            ctx.restore();

            // Khung lớn trình diễn 3D
            roundBox(14, 48, 752, 246, 10, 'rgba(15, 23, 42, 0.72)', 'rgba(56, 189, 248, 0.3)', 1.6);

            const ox = 136, oy = 174;
            const lam = 236;
            const maxDx = 548;
            const saw = (t * 0.36) % 1;
            const phaseShift = saw * Math.PI * 2;
            const ampE = 70;
            const ampB = 72;
            const zCos = -0.62, zSin = 0.62;

            // Mặt phẳng xOz đứt nét (tạo cảm giác 3D)
            ctx.save();
            ctx.setLineDash([4, 4]);
            ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.moveTo(ox + zCos * ampB, oy + zSin * ampB);
            ctx.lineTo(ox + maxDx + zCos * ampB, oy + zSin * ampB);
            ctx.moveTo(ox - zCos * ampB, oy - zSin * ampB);
            ctx.lineTo(ox + maxDx - zCos * ampB, oy - zSin * ampB);
            ctx.stroke();
            ctx.restore();

            // Trục tọa độ Oxyz
            arrowLine(ox, oy, ox, 62, '#e2e8f0', 2.4, 8); // Oy
            arrowLine(ox, oy, ox + maxDx + 38, oy, '#e2e8f0', 2.4, 8); // Ox
            arrowLine(ox, oy, ox + zCos * 124, oy + zSin * 124, '#e2e8f0', 2.4, 8); // Oz

            ctx.save();
            ctx.fillStyle = '#f8fafc';
            ctx.font = 'italic 800 16px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            ctx.fillText('y', ox - 10, 68);
            ctx.fillText('O', ox - 10, oy - 12);
            ctx.fillText('z', ox + zCos * 130 - 8, oy + zSin * 130);
            ctx.textAlign = 'left';
            ctx.fillText('x', ox + maxDx + 44, oy + 4);
            ctx.restore();

            // Vùng tô sóng từ trường B (mặt phẳng xOz)
            ctx.save();
            ctx.fillStyle = 'rgba(56, 189, 248, 0.16)';
            ctx.beginPath();
            ctx.moveTo(ox, oy);
            for (let dx = 0; dx <= maxDx; dx += 4) {
                const s = Math.sin((2 * Math.PI * dx) / lam - phaseShift);
                ctx.lineTo(ox + dx + zCos * ampB * s, oy + zSin * ampB * s);
            }
            ctx.lineTo(ox + maxDx, oy);
            ctx.closePath();
            ctx.fill();

            // Đường bao B
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2.6;
            ctx.beginPath();
            for (let dx = 0; dx <= maxDx; dx += 3) {
                const s = Math.sin((2 * Math.PI * dx) / lam - phaseShift);
                const px = ox + dx + zCos * ampB * s;
                const py = oy + zSin * ampB * s;
                if (dx === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            ctx.stroke();

            // Các vectơ B
            for (let dx = 14; dx <= maxDx - 6; dx += 18) {
                const s = Math.sin((2 * Math.PI * dx) / lam - phaseShift);
                const mag = ampB * s;
                if (Math.abs(mag) > 10) {
                    arrowLine(ox + dx, oy, ox + dx + zCos * mag, oy + zSin * mag, 'rgba(56, 189, 248, 0.85)', 1.8, 6);
                }
            }
            ctx.restore();

            // Vùng tô sóng điện trường E (mặt phẳng xOy)
            ctx.save();
            ctx.fillStyle = 'rgba(249, 115, 22, 0.18)';
            ctx.beginPath();
            ctx.moveTo(ox, oy);
            for (let dx = 0; dx <= maxDx; dx += 4) {
                const s = Math.sin((2 * Math.PI * dx) / lam - phaseShift);
                ctx.lineTo(ox + dx, oy - ampE * s);
            }
            ctx.lineTo(ox + maxDx, oy);
            ctx.closePath();
            ctx.fill();

            // Đường bao E
            ctx.strokeStyle = '#fb923c';
            ctx.lineWidth = 2.8;
            ctx.beginPath();
            for (let dx = 0; dx <= maxDx; dx += 3) {
                const s = Math.sin((2 * Math.PI * dx) / lam - phaseShift);
                const px = ox + dx;
                const py = oy - ampE * s;
                if (dx === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            ctx.stroke();

            // Các vectơ E
            for (let dx = 14; dx <= maxDx - 6; dx += 18) {
                const s = Math.sin((2 * Math.PI * dx) / lam - phaseShift);
                const mag = ampE * s;
                if (Math.abs(mag) > 10) {
                    arrowLine(ox + dx, oy, ox + dx, oy - mag, '#fb923c', 2, 6);
                }
            }
            ctx.restore();

            // Gắn nhãn E và B tại 2 đỉnh dương và âm đang xuất hiện rõ trong vùng [180..620]
            let peakDx = lam * (0.25 + saw);
            if (peakDx > lam) peakDx -= lam;
            while (peakDx < 80) peakDx += lam;
            if (peakDx <= maxDx - 30) {
                drawVecLabel('E', ox + peakDx, oy - ampE - 16, '#fb923c');
            }
            let troughDx = peakDx + lam * 0.5;
            if (troughDx > maxDx - 40) troughDx = peakDx - lam * 0.5;
            if (troughDx >= 60 && troughDx <= maxDx - 30) {
                // Tại trough thì sin = -1 => B hướng lên-phải (z < 0), đặt nhãn cạnh mũi tên
                drawVecLabel('B', ox + troughDx - zCos * ampB + 14, oy - zSin * ampB - 12, '#38bdf8');
            }

            // Mũi tên Phương truyền sóng trên góc phải
            ctx.save();
            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 15px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Phương truyền sóng', 595, 64);
            arrowLine(505, 82, 685, 82, '#10b981', 3.2, 10);
            ctx.restore();

            // Đoạn đánh dấu Bước sóng giữa 2 đỉnh cùng pha liên tiếp nằm trong [180..680]
            const p1 = ox + peakDx;
            const p2 = p1 + lam <= ox + maxDx ? p1 + lam : p1 - lam;
            const leftP = Math.min(p1, p2);
            const rightP = Math.max(p1, p2);
            if (leftP >= ox + 10 && rightP <= ox + maxDx + 10) {
                ctx.save();
                ctx.setLineDash([4, 4]);
                ctx.strokeStyle = 'rgba(251, 191, 36, 0.7)';
                ctx.lineWidth = 1.6;
                ctx.beginPath();
                ctx.moveTo(leftP, oy + zSin * ampB); ctx.lineTo(leftP, 268);
                ctx.moveTo(rightP, oy + zSin * ampB); ctx.lineTo(rightP, 268);
                ctx.stroke();
                ctx.restore();

                arrowLine((leftP + rightP) / 2, 266, leftP, 266, '#fbbf24', 2.4, 8);
                arrowLine((leftP + rightP) / 2, 266, rightP, 266, '#fbbf24', 2.4, 8);
                roundBox((leftP + rightP) / 2 - 54, 254, 108, 26, 5, '#0f172a', '#fbbf24', 1.6);
                ctx.save();
                ctx.fillStyle = '#fbbf24';
                ctx.font = '800 14.5px "Segoe UI", system-ui, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('Bước sóng', (leftP + rightP) / 2, 267);
                ctx.restore();
            }
        });

    // =========================================================================
    // CÂU 66 (MH-STAGING-C3-12 · VLXT-DS-VD28-066): Thiết bị cân từ trường cân bằng lực từ trên cuộn dây 50 vòng (d = 5 cm)
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C3-12', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
            for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(x, y, bw, bh, r);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function arrowLine(x1, y1, x2, y2, col, lw = 2.4, hl = 8) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }

            function drawDotB(x, y, r = 6.5, col = '#38bdf8') {
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 1.8;
                ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke();
                ctx.beginPath(); ctx.arc(x, y, 2.5, 0, Math.PI * 2); ctx.fill();
                ctx.restore();
            }

            function drawVecText(ch, x, y, col) {
                ctx.save();
                ctx.fillStyle = col;
                ctx.font = 'italic 800 17px "Segoe UI", system-ui, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(ch, x, y);
                const vy = y - 13;
                ctx.strokeStyle = col;
                ctx.lineWidth = 1.8;
                ctx.beginPath();
                ctx.moveTo(x - 6, vy); ctx.lineTo(x + 7, vy);
                ctx.lineTo(x + 3, vy - 3);
                ctx.moveTo(x + 7, vy); ctx.lineTo(x + 3, vy + 3);
                ctx.stroke();
                ctx.restore();
            }

            // Title badge
            ctx.save();
            const title = 'THIẾT BỊ CÂN TỪ TRƯỜNG (CUỘN DÂY 50 VÒNG; d = 5 cm; B = 0,2 T)';
            ctx.font = '800 14.5px "Segoe UI", system-ui, sans-serif';
            const titleW = Math.min(752, ctx.measureText(title).width + 24);
            roundBox(14, 10, titleW, 30, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, 26, 25);
            ctx.restore();

            // Chu kỳ: K mở (cân lệch nhẹ sang phải vì đặt m) -> K đóng (dòng điện tăng làm cân thăng bằng)
            const saw = (t * 0.16) % 1;
            const isClosed = saw >= 0.42;
            let tilt = 0.055;
            if (saw >= 0.42 && saw < 0.62) {
                tilt = 0.055 * (1 - (saw - 0.42) / 0.20);
            } else if (saw >= 0.62) {
                tilt = 0;
            }

            // Khung sơ đồ bên trái
            roundBox(14, 48, 536, 246, 10, 'rgba(15, 23, 42, 0.72)', 'rgba(56, 189, 248, 0.3)', 1.6);

            // Vùng từ trường B chấm tròn hướng ra (dưới trái)
            const bx0 = 88, by0 = 188;
            for (let r = 0; r < 3; r++) {
                for (let c = 0; c < 4; c++) {
                    if (r === 2 && (c === 1 || c === 2)) continue; // chừa khoảng trống dưới đáy cho kích thước d
                    drawDotB(bx0 + c * 32, by0 + r * 38, 6.2, 'rgba(56, 189, 248, 0.8)');
                }
            }
            drawVecText('B', 50, 226, '#38bdf8');

            // Trụ đỡ tam giác
            const pivX = 312, pivY = 82;
            ctx.save();
            ctx.fillStyle = '#475569';
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 2.2;
            ctx.beginPath();
            ctx.moveTo(pivX, pivY + 4);
            ctx.lineTo(pivX - 18, pivY + 34);
            ctx.lineTo(pivX + 18, pivY + 34);
            ctx.closePath();
            ctx.fill(); ctx.stroke();

            // Thanh đòn cân quay quanh (pivX, pivY)
            const armL = 176, armR = 178;
            const lx = pivX - armL * Math.cos(tilt), ly = pivY - armL * Math.sin(tilt);
            const rx = pivX + armR * Math.cos(tilt), ry = pivY + armR * Math.sin(tilt);

            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 7;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(lx, ly);
            ctx.lineTo(rx, ry);
            ctx.stroke();

            // Đầu trái: Dây cách điện + Khung dây 50 vòng
            const coilW = 66, coilH = 84;
            const coilX = lx - coilW / 2;
            const coilY = ly + 52;
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 2.4;
            ctx.beginPath();
            ctx.moveTo(lx, ly + 2);
            ctx.lineTo(lx, coilY);
            ctx.stroke();

            roundBox(coilX, coilY, coilW, coilH, 5, 'rgba(30, 41, 59, 0.72)', '#fbbf24', 4);
            // Nhãn Dây cách điện & Khung dây
            ctx.fillStyle = '#e2e8f0';
            ctx.font = '700 14.5px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            ctx.fillText('Dây cách điện', lx - 22, ly + 26);
            arrowLine(lx - 18, ly + 26, lx - 3, ly + 26, '#cbd5e1', 1.8, 6);

            ctx.textAlign = 'left';
            ctx.fillText('Khung dây', lx + 30, coilY - 18);
            arrowLine(lx + 26, coilY - 12, lx + 14, coilY, '#cbd5e1', 1.8, 6);

            // Kích thước d bên dưới cạnh đáy khung (nằm trong khoảng trống đã chừa sạch dấu ⊙)
            const dimY = coilY + coilH + 22;
            ctx.strokeStyle = '#f8fafc';
            ctx.lineWidth = 1.6;
            ctx.beginPath();
            ctx.moveTo(coilX, coilY + coilH + 4); ctx.lineTo(coilX, dimY + 6);
            ctx.moveTo(coilX + coilW, coilY + coilH + 4); ctx.lineTo(coilX + coilW, dimY + 6);
            ctx.stroke();
            arrowLine(coilX + coilW / 2 - 12, dimY, coilX + 2, dimY, '#f8fafc', 1.8, 6);
            arrowLine(coilX + coilW / 2 + 12, dimY, coilX + coilW - 2, dimY, '#f8fafc', 1.8, 6);
            roundBox(coilX + coilW / 2 - 11, dimY - 11, 22, 22, 4, '#0f172a', null, 0);
            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 15.5px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('d', coilX + coilW / 2, dimY);

            // Mạch điện nối từ khung sang phải: Khóa K, chốt A, B, điện trở R
            const wTopY = coilY + 22, wBotY = coilY + 60;
            ctx.strokeStyle = isClosed ? '#fbbf24' : '#94a3b8';
            ctx.lineWidth = 2.6;
            ctx.beginPath();
            ctx.moveTo(coilX + coilW, wTopY);
            ctx.lineTo(256, wTopY);
            ctx.moveTo(298, wTopY);
            ctx.lineTo(354, wTopY);
            ctx.lineTo(354, wTopY + 14);

            ctx.moveTo(coilX + coilW, wBotY);
            ctx.lineTo(234, wBotY);
            ctx.lineTo(234, wBotY + 36);
            ctx.lineTo(266, wBotY + 36);
            ctx.moveTo(320, wBotY + 36);
            ctx.lineTo(354, wBotY + 36);
            ctx.lineTo(354, wBotY + 8);
            ctx.stroke();

            // Công tắc K
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath();
            ctx.arc(256, wTopY, 4, 0, Math.PI * 2);
            ctx.arc(298, wTopY, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = isClosed ? '#10b981' : '#f8fafc';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(256, wTopY);
            ctx.lineTo(298, isClosed ? wTopY : wTopY - 22);
            ctx.stroke();

            // Chốt A, B & Điện trở R
            ctx.fillStyle = '#f8fafc';
            ctx.beginPath();
            ctx.arc(354, wTopY + 14, 4.2, 0, Math.PI * 2);
            ctx.arc(354, wBotY + 8, 4.2, 0, Math.PI * 2);
            ctx.fill();

            roundBox(266, wBotY + 25, 54, 22, 4, '#0f172a', '#e2e8f0', 2);

            ctx.fillStyle = '#fbbf24';
            ctx.font = '800 15.5px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('K', 274, wTopY - 26);
            ctx.fillStyle = '#f8fafc';
            ctx.textAlign = 'left';
            ctx.fillText('A', 364, wTopY + 14);
            ctx.fillText('B', 364, wBotY + 8);
            ctx.textAlign = 'center';
            ctx.fillText('R', 293, wBotY + 62);

            // Đầu phải: Đĩa cân treo vật nặng m
            const panY = ry + 132;
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 2.4;
            ctx.beginPath();
            ctx.moveTo(rx, ry + 2);
            ctx.lineTo(rx, panY - 62);
            ctx.stroke();

            // Quang treo đĩa cân
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 2.6;
            ctx.beginPath();
            ctx.moveTo(rx - 40, panY);
            ctx.quadraticCurveTo(rx - 34, panY - 62, rx, panY - 62);
            ctx.quadraticCurveTo(rx + 34, panY - 62, rx + 40, panY);
            ctx.stroke();
            roundBox(rx - 48, panY, 96, 10, 3, '#475569', '#cbd5e1', 1.8);

            // Quả nặng m trên đĩa cân
            roundBox(rx - 22, panY - 28, 44, 28, 5, '#b45309', '#fde047', 2);
            ctx.fillStyle = '#ffffff';
            ctx.font = '800 16px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('m', rx, panY - 40);
            ctx.restore();

            // Thẻ thông số bên phải (Zero Data Leakage)
            roundBox(562, 48, 204, 246, 10, '#0f172a', '#38bdf8', 2);
            ctx.save();
            ctx.fillStyle = '#38bdf8';
            ctx.font = '800 15px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText('THÔNG SỐ CÂN TỪ', 578, 76);

            ctx.fillStyle = '#f8fafc';
            ctx.font = '700 14.5px "Segoe UI", system-ui, sans-serif';
            ctx.fillText('• Số vòng: N = 50', 578, 114);
            ctx.fillText('• Chiều rộng: d = 5 cm', 578, 146);
            ctx.fillText('• Cảm ứng: B = 0,2 T', 578, 178);
            ctx.fillText('• Lấy g = 10 m/s²', 578, 210);
            ctx.fillStyle = isClosed ? '#6ee7b7' : '#fbbf24';
            ctx.fillText(isClosed ? '• Khóa K: Đang đóng' : '• Khóa K: Đang mở', 578, 248);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 67 (MH-STAGING-C3-13 · VLXT-DS-VD28-067): Hệ thống phanh tái sinh xe điện (Chế độ lái động cơ ↔ Chế độ tái sinh máy phát)
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C3-13', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
            for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(x, y, bw, bh, r);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function arrowLine(x1, y1, x2, y2, col, lw = 2.6, hl = 8) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }

            // Title badge
            ctx.save();
            const title = 'NGUYÊN LÝ HỆ THỐNG PHANH TÁI SINH TRÊN Ô TÔ ĐIỆN';
            ctx.font = '800 14.5px "Segoe UI", system-ui, sans-serif';
            const titleW = Math.min(752, ctx.measureText(title).width + 24);
            roundBox(14, 10, titleW, 30, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, 26, 25);
            ctx.restore();

            // Chu kỳ 2 giai đoạn 1 chiều sawtooth: 0..0.5 GĐ lái (nhanh dần), 0.5..1.0 GĐ tái sinh (chậm dần)
            const saw = (t * 0.14) % 1;
            const isDrive = saw < 0.5;
            const rotAngle = isDrive
                ? (saw / 0.5) * (saw / 0.5) * 6.5
                : 6.5 + (1 - Math.pow(1 - (saw - 0.5) / 0.5, 2)) * 5.2;

            // Cột trái: Sơ đồ khối hệ thống phanh tái sinh (khớp ảnh gốc 067.png)
            roundBox(14, 48, 378, 246, 10, 'rgba(15, 23, 42, 0.78)', 'rgba(56, 189, 248, 0.35)', 1.8);

            // Đường nối giữa các khối
            ctx.save();
            ctx.fillStyle = '#475569';
            ctx.fillRect(166, 94, 10, 84);
            ctx.fillRect(230, 94, 10, 84);
            ctx.restore();

            // 3 khối chính
            roundBox(128, 60, 150, 36, 7, '#1e293b', isDrive ? '#f59e0b' : '#10b981', 2.2);
            roundBox(112, 114, 182, 38, 7, '#334155', '#94a3b8', 2);
            roundBox(112, 168, 182, 38, 7, '#1e293b', '#38bdf8', 2.2);

            ctx.save();
            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 15px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Bộ pin', 203, 78);
            ctx.fillText('Điều khiển động cơ', 203, 133);
            ctx.fillText('Động cơ / Máy phát', 203, 187);
            ctx.restore();

            // Trục truyền động & hai bánh xe bên dưới
            ctx.save();
            ctx.fillStyle = '#475569';
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 1.6;
            ctx.fillRect(66, 244, 274, 12);
            ctx.strokeRect(66, 244, 274, 12);
            roundBox(136, 232, 134, 36, 14, '#0f172a', '#cbd5e1', 2);
            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 14.5px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('TRUYỀN ĐỘNG', 203, 250);

            [54, 352].forEach(wx => {
                ctx.fillStyle = '#1e293b';
                ctx.strokeStyle = '#e2e8f0';
                ctx.lineWidth = 3;
                ctx.beginPath(); ctx.arc(wx, 250, 28, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                for (let k = 0; k < 4; k++) {
                    const a = rotAngle + k * (Math.PI / 2);
                    ctx.strokeStyle = '#94a3b8';
                    ctx.lineWidth = 2.2;
                    ctx.beginPath();
                    ctx.moveTo(wx, 250);
                    ctx.lineTo(wx + Math.cos(a) * 24, 250 + Math.sin(a) * 24);
                    ctx.stroke();
                }
                ctx.fillStyle = '#38bdf8';
                ctx.beginPath(); ctx.arc(wx, 250, 5, 0, Math.PI * 2); ctx.fill();
            });
            ctx.restore();

            // Hai mũi tên năng lượng hai bên khối
            const driveCol = isDrive ? '#f59e0b' : 'rgba(148, 163, 184, 0.35)';
            const regenCol = !isDrive ? '#10b981' : 'rgba(148, 163, 184, 0.35)';
            arrowLine(82, 72, 82, 198, driveCol, isDrive ? 4.2 : 2.2, 10);
            arrowLine(324, 198, 324, 72, regenCol, !isDrive ? 4.2 : 2.2, 10);

            ctx.save();
            ctx.font = '800 14.5px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = isDrive ? '#fbbf24' : '#64748b';
            ctx.fillText('Chế độ', 48, 122);
            ctx.fillText('lái', 48, 142);
            ctx.fillStyle = !isDrive ? '#6ee7b7' : '#64748b';
            ctx.fillText('Tái', 358, 122);
            ctx.fillText('sinh', 358, 142);
            ctx.restore();

            // Cột phải: Mô hình Stator (Nam châm) & Rotor (Khung dây quay)
            roundBox(406, 48, 360, 246, 10, '#0f172a', isDrive ? '#f59e0b' : '#10b981', 2);

            roundBox(422, 60, 328, 34, 7, '#1e293b', isDrive ? '#f59e0b' : '#10b981', 1.6);
            ctx.save();
            ctx.fillStyle = isDrive ? '#fbbf24' : '#6ee7b7';
            ctx.font = '800 14.5px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(isDrive ? 'GĐ 1: XE DI CHUYỂN (ĐỘNG CƠ)' : 'GĐ 2: XE GIẢM TỐC (MÁY PHÁT)', 586, 77);
            ctx.restore();

            // Nam châm Stator N - S đứng yên
            roundBox(434, 114, 62, 108, 8, '#dc2626', '#fca5a5', 2.2);
            roundBox(676, 114, 62, 108, 8, '#2563eb', '#93c5fd', 2.2);
            ctx.save();
            ctx.fillStyle = '#ffffff';
            ctx.font = '800 22px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('N', 465, 168);
            ctx.fillText('S', 707, 168);
            ctx.restore();

            // Đường sức từ trường Stator
            for (let yy = 132; yy <= 204; yy += 24) {
                arrowLine(502, yy, 668, yy, 'rgba(56, 189, 248, 0.38)', 2, 7);
            }

            // Rotor: Khung dây quay quanh trục ngang
            const rcx = 586, rcy = 168;
            const proj = Math.cos(rotAngle * 0.8);
            const rh = 38 * proj;
            ctx.save();
            ctx.strokeStyle = isDrive ? '#fbbf24' : '#34d399';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(rcx - 58, rcy - rh);
            ctx.lineTo(rcx + 58, rcy - rh);
            ctx.lineTo(rcx + 58, rcy + rh);
            ctx.lineTo(rcx - 58, rcy + rh);
            ctx.closePath();
            ctx.stroke();

            // Trục nối bánh xe
            ctx.strokeStyle = '#94a3b8';
            ctx.setLineDash([4, 4]);
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(506, rcy); ctx.lineTo(666, rcy); ctx.stroke();
            ctx.setLineDash([]);

            ctx.fillStyle = '#e2e8f0';
            ctx.font = '700 14.5px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Stator: Nam châm  |  Rotor: Khung dây', 586, 244);
            ctx.fillStyle = isDrive ? '#fde68a' : '#a7f3d0';
            ctx.fillText(isDrive ? 'Pin cấp điện → khung quay bánh xe' : 'Quán tính quay khung → nạp pin', 586, 270);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 68 (MH-STAGING-C3-14 · VLXT-DS-VD28-068): Ngẫu lực từ tác dụng lên khung dây chữ nhật ABCD (L × d) trong từ trường đều
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C3-14', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
            for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(x, y, bw, bh, r);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function arrowLine(x1, y1, x2, y2, col, lw = 2.6, hl = 8) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }

            function drawSubVec(base, sub, x, y, col, vec = false) {
                const baseSz = 16.5;
                const subSz = 13;
                ctx.save();
                ctx.fillStyle = col;
                ctx.textAlign = 'left';
                ctx.textBaseline = 'alphabetic';
                ctx.font = `italic 800 ${baseSz}px "Segoe UI", system-ui, sans-serif`;
                const bw = ctx.measureText(base).width;
                ctx.fillText(base, x, y);
                if (sub) {
                    ctx.font = `800 ${subSz}px "Segoe UI", system-ui, sans-serif`;
                    ctx.fillText(sub, x + bw + 1, y + 4);
                }
                if (vec) {
                    const vy = y - baseSz;
                    ctx.strokeStyle = col;
                    ctx.lineWidth = 1.8;
                    ctx.beginPath();
                    ctx.moveTo(x, vy); ctx.lineTo(x + bw + 2, vy);
                    ctx.lineTo(x + bw - 2, vy - 3);
                    ctx.moveTo(x + bw + 2, vy); ctx.lineTo(x + bw - 2, vy + 3);
                    ctx.stroke();
                }
                ctx.restore();
            }

            // Title badge
            ctx.save();
            const title = 'NGẪU LỰC TỪ TÁC DỤNG LÊN KHUNG DÂY CHỮ NHẬT ABCD (L × d)';
            ctx.font = '800 14.5px "Segoe UI", system-ui, sans-serif';
            const titleW = Math.min(752, ctx.measureText(title).width + 24);
            roundBox(14, 10, titleW, 30, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, 26, 25);
            ctx.restore();

            const saw = (t * 0.45) % 1;

            // Khung sơ đồ bên trái (khớp 1-1 ảnh gốc VLXT-DS-VD28-068_p3.png)
            roundBox(14, 48, 486, 246, 10, 'rgba(15, 23, 42, 0.75)', 'rgba(56, 189, 248, 0.35)', 1.8);

            // 4 đường sức từ B song song chếch lên phải (góc giống hệt 068_p3.png)
            const slope = -66 / 234;
            for (let k = 0; k < 4; k++) {
                const x1 = 68;
                const y1 = 152 + k * 44;
                const x2 = 426;
                const y2 = y1 + (x2 - x1) * slope;
                arrowLine(x1, y1, x2, y2, 'rgba(56, 189, 248, 0.65)', 2.2, 8);
            }
            drawSubVec('B', '', 434, 66, '#38bdf8', true);

            // Khung chữ nhật ABCD (AB // B, BC đứng)
            const Ax = 132, Ay = 140;
            const Bx = 366, By = 140 + (366 - 132) * slope; // (366, 74)
            const Cx = 366, Cy = By + 132; // (366, 206)
            const Dx = 132, Dy = Ay + 132; // (132, 272)

            ctx.save();
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 3.8;
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(Ax, Ay);
            ctx.lineTo(Bx, By);
            ctx.lineTo(Cx, Cy);
            ctx.lineTo(Dx, Dy);
            ctx.closePath();
            ctx.stroke();

            // Mũi tên chiều dòng điện A -> B -> C -> D -> A
            arrowLine(Ax + (Bx - Ax) * 0.45, Ay + (By - Ay) * 0.45, Ax + (Bx - Ax) * 0.56, Ay + (By - Ay) * 0.56, '#fde047', 3, 8);
            arrowLine(Bx, By + (Cy - By) * 0.42, Cx, By + (Cy - By) * 0.58, '#fde047', 3, 8);
            arrowLine(Cx + (Dx - Cx) * 0.45, Cy + (Dy - Cy) * 0.45, Cx + (Dx - Cx) * 0.56, Cy + (Dy - Cy) * 0.56, '#fde047', 3, 8);
            arrowLine(Dx, Dy + (Ay - Dy) * 0.42, Ax, Dy + (Ay - Dy) * 0.58, '#fde047', 3, 8);

            // Các hạt xung dòng điện chạy 1 chiều sawtooth theo chu vi khung
            const pts = [{ x: Ax, y: Ay }, { x: Bx, y: By }, { x: Cx, y: Cy }, { x: Dx, y: Dy }];
            const lens = [
                Math.hypot(Bx - Ax, By - Ay),
                Math.hypot(Cx - Bx, Cy - By),
                Math.hypot(Dx - Cx, Dy - Cy),
                Math.hypot(Ax - Dx, Ay - Dy)
            ];
            const totL = lens[0] + lens[1] + lens[2] + lens[3];
            for (let p = 0; p < 8; p++) {
                let d = ((saw + p / 8) % 1) * totL;
                let px, py;
                for (let s = 0; s < 4; s++) {
                    if (d <= lens[s] || s === 3) {
                        const k = d / lens[s];
                        const p1 = pts[s], p2 = pts[(s + 1) % 4];
                        px = p1.x + (p2.x - p1.x) * k;
                        py = p1.y + (p2.y - p1.y) * k;
                        break;
                    }
                    d -= lens[s];
                }
                ctx.fillStyle = '#ffffff';
                ctx.beginPath(); ctx.arc(px, py, 3.2, 0, Math.PI * 2); ctx.fill();
            }
            ctx.restore();

            // Kích thước L (trên cạnh AB) và d (bên phải cạnh BC)
            const offL = -13;
            arrowLine(Ax + 100, Ay + offL + 100 * slope, Ax + 2, Ay + offL + 2 * slope, '#cbd5e1', 1.8, 7);
            arrowLine(Bx - 100, By + offL - 100 * slope, Bx - 2, By + offL - 2 * slope, '#cbd5e1', 1.8, 7);
            ctx.save();
            ctx.fillStyle = '#f8fafc';
            ctx.font = 'italic 800 16px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('L', (Ax + Bx) / 2 - 4, (Ay + By) / 2 - 22);

            arrowLine(Bx + 14, By + 56, Bx + 14, By + 2, '#cbd5e1', 1.8, 7);
            arrowLine(Cx + 14, Cy - 56, Cx + 14, Cy - 2, '#cbd5e1', 1.8, 7);
            ctx.textAlign = 'left';
            ctx.fillText('d', Bx + 24, (By + Cy) / 2 - 14);
            ctx.restore();

            // Nhãn 4 đỉnh A, B, C, D
            ctx.save();
            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 15.5px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('A', Ax - 14, Ay - 12);
            ctx.fillText('B', Bx + 2, By - 14);
            ctx.fillText('C', Cx + 10, Cy + 16);
            ctx.fillText('D', Dx - 10, Dy + 14);
            ctx.restore();

            // Hai vectơ lực từ F1 (trên BC) và F2 (trên AD) khớp ảnh gốc 068_p3.png
            const midBCx = (Bx + Cx) / 2, midBCy = (By + Cy) / 2;
            const midADx = (Ax + Dx) / 2, midADy = (Ay + Dy) / 2;
            arrowLine(midBCx, midBCy, midBCx + 68, midBCy + 36, '#10b981', 3.4, 9);
            drawSubVec('F', '1', midBCx + 74, midBCy + 42, '#6ee7b7', true);

            arrowLine(midADx, midADy, midADx - 68, midADy - 36, '#f43f5e', 3.4, 9);
            drawSubVec('F', '2', midADx - 94, midADy - 44, '#fda4af', true);

            // Thẻ thông số đề bài bên phải (Zero Data Leakage)
            roundBox(514, 48, 252, 246, 10, '#0f172a', '#38bdf8', 2);
            ctx.save();
            ctx.fillStyle = '#38bdf8';
            ctx.font = '800 15px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText('THÔNG SỐ KHUNG DÂY', 530, 76);

            ctx.fillStyle = '#f8fafc';
            ctx.font = '700 14.5px "Segoe UI", system-ui, sans-serif';
            ctx.fillText('• Khung chữ nhật ABCD', 530, 114);
            ctx.fillText('• Kích thước: L × d', 530, 146);
            ctx.fillText('• Cường độ dòng điện: I', 530, 178);
            ctx.fillText('• Từ trường đều B // (ABCD)', 530, 210);
            ctx.fillStyle = '#fbbf24';
            ctx.fillText('• Dòng chạy: A → B → C → D', 530, 246);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 69 (MH-STAGING-C3-15 · VLXT-DS-VD28-069): Vòng dây tròn bán kính 25 cm đặt vuông góc từ trường biến thiên B = kt
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C3-15', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
            for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(x, y, bw, bh, r);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function arrowLine(x1, y1, x2, y2, col, lw = 2.4, hl = 8) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }

            function drawCrossB(x, y, r, col, lw) {
                ctx.save();
                ctx.strokeStyle = col;
                ctx.lineWidth = lw;
                ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke();
                const d = r * 0.62;
                ctx.beginPath();
                ctx.moveTo(x - d, y - d); ctx.lineTo(x + d, y + d);
                ctx.moveTo(x + d, y - d); ctx.lineTo(x - d, y + d);
                ctx.stroke();
                ctx.restore();
            }

            function drawVecText(ch, x, y, col) {
                ctx.save();
                ctx.fillStyle = col;
                ctx.font = 'italic 800 17px "Segoe UI", system-ui, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(ch, x, y);
                const vy = y - 13;
                ctx.strokeStyle = col;
                ctx.lineWidth = 1.8;
                ctx.beginPath();
                ctx.moveTo(x - 6, vy); ctx.lineTo(x + 7, vy);
                ctx.lineTo(x + 3, vy - 3);
                ctx.moveTo(x + 7, vy); ctx.lineTo(x + 3, vy + 3);
                ctx.stroke();
                ctx.restore();
            }

            // Title badge
            ctx.save();
            const title = 'VÒNG DÂY TRÒN (r = 25 cm) TRONG TỪ TRƯỜNG BIẾN THIÊN B = kt';
            ctx.font = '800 14.5px "Segoe UI", system-ui, sans-serif';
            const titleW = Math.min(752, ctx.measureText(title).width + 24);
            roundBox(14, 10, titleW, 30, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, 26, 25);
            ctx.restore();

            // Chu kỳ sawtooth 1 chiều: t = 0 -> 10 s, B = 0,1*t = 0 -> 1,0 T
            const saw = (t * 0.20) % 1;
            const curT = saw * 10.0;
            const curB = 0.1 * curT;

            // Cột trái: Vòng dây tròn trong lưới từ trường ⊗ B tăng đều
            roundBox(14, 48, 396, 246, 10, 'rgba(15, 23, 42, 0.78)', 'rgba(56, 189, 248, 0.35)', 1.8);

            const bAlpha = 0.3 + 0.65 * saw;
            const bLW = 1.5 + 1.3 * saw;
            for (let r = 0; r < 4; r++) {
                for (let c = 0; c < 6; c++) {
                    drawCrossB(66 + c * 58, 86 + r * 54, 8, `rgba(56, 189, 248, ${bAlpha.toFixed(2)})`, bLW);
                }
            }
            drawVecText('B', 38, 84, '#38bdf8');

            // Vòng dây tròn bán kính r = 25 cm
            const cx = 212, cy = 172, rad = 82;
            ctx.save();
            ctx.fillStyle = 'rgba(251, 191, 36, 0.08)';
            ctx.beginPath(); ctx.arc(cx, cy, rad, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 4.6;
            ctx.beginPath(); ctx.arc(cx, cy, rad, 0, Math.PI * 2); ctx.stroke();

            // Tâm O và bán kính r
            ctx.fillStyle = '#f8fafc';
            ctx.beginPath(); ctx.arc(cx, cy, 4.2, 0, Math.PI * 2); ctx.fill();
            const rAng = -0.32;
            arrowLine(cx, cy, cx + rad * Math.cos(rAng), cy + rad * Math.sin(rAng), '#10b981', 2.8, 9);

            // Hộp nhãn bán kính không đè lên dấu ⊗
            roundBox(cx + 8, cy - 42, 90, 26, 6, '#0f172a', '#10b981', 1.6);
            ctx.fillStyle = '#6ee7b7';
            ctx.font = '800 14.5px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('r = 25 cm', cx + 53, cy - 29);

            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 15px "Segoe UI", system-ui, sans-serif';
            ctx.fillText('O', cx - 14, cy + 12);
            ctx.restore();

            // Cột phải trên: Đồ thị B(t) = kt
            roundBox(424, 48, 342, 126, 10, '#0f172a', '#38bdf8', 1.8);
            const gox = 480, goy = 148, gw = 152, gh = 78;
            arrowLine(gox, goy + 4, gox, goy - gh, '#e2e8f0', 2.2, 7);
            arrowLine(gox - 4, goy, gox + gw, goy, '#e2e8f0', 2.2, 7);

            ctx.save();
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(gox, goy);
            ctx.lineTo(gox + 126, goy - 62);
            ctx.stroke();

            const gxDot = gox + saw * 126;
            const gyDot = goy - saw * 62;
            ctx.fillStyle = '#fbbf24';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.8;
            ctx.beginPath(); ctx.arc(gxDot, gyDot, 5.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 14.5px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            ctx.fillText('B', gox - 8, goy - gh + 8);
            ctx.fillText('O', gox - 8, goy + 10);
            ctx.textAlign = 'left';
            ctx.fillText('t', gox + gw + 6, goy);

            ctx.fillStyle = '#38bdf8';
            ctx.fillText('B = k·t', 648, 82);
            ctx.fillStyle = '#fde68a';
            ctx.fillText(`t = ${curT.toFixed(1).replace('.', ',')} s`, 648, 110);
            ctx.fillStyle = '#7dd3fc';
            ctx.fillText(`B = ${curB.toFixed(2).replace('.', ',')} T`, 648, 138);
            ctx.restore();

            // Cột phải dưới: Thẻ thông số đề bài (Zero Data Leakage)
            roundBox(424, 184, 342, 110, 10, '#0f172a', '#fbbf24', 1.8);
            ctx.save();
            ctx.fillStyle = '#fbbf24';
            ctx.font = '800 14.5px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText('THÔNG SỐ VÒNG DÂY (1 VÒNG)', 440, 206);

            ctx.fillStyle = '#f8fafc';
            ctx.font = '700 14.5px "Segoe UI", system-ui, sans-serif';
            ctx.fillText('• s = 1 mm²;  ρ = 2·10⁻⁸ Ω·m', 440, 232);
            ctx.fillText('• Bán kính: r = 25 cm;  (n, B) = 0°', 440, 256);
            ctx.fillStyle = '#6ee7b7';
            ctx.fillText('• Tốc độ biến thiên: k = 0,1 T/s', 440, 280);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 70 (MH-STAGING-C3-16 · VLXT-DS-VD28-070): Máy phát điện xoay chiều một pha & đồ thị suất điện động e(t)
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C3-16', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
            for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(x, y, bw, bh, r);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function arrowLine(x1, y1, x2, y2, col, lw = 2.4, hl = 8) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }

            function drawVecText(ch, x, y, col) {
                ctx.save();
                ctx.fillStyle = col;
                ctx.font = 'italic 800 17px "Segoe UI", system-ui, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(ch, x, y);
                const vy = y - 13;
                ctx.strokeStyle = col;
                ctx.lineWidth = 1.8;
                ctx.beginPath();
                ctx.moveTo(x - 6, vy); ctx.lineTo(x + 7, vy);
                ctx.lineTo(x + 3, vy - 3);
                ctx.moveTo(x + 7, vy); ctx.lineTo(x + 3, vy + 3);
                ctx.stroke();
                ctx.restore();
            }

            // Title badge
            ctx.save();
            const title = 'MÁY PHÁT ĐIỆN XOAY CHIỀU 1 PHA & ĐỒ THỊ SUẤT ĐIỆN ĐỘNG e(t)';
            ctx.font = '800 14.5px "Segoe UI", system-ui, sans-serif';
            const titleW = Math.min(752, ctx.measureText(title).width + 24);
            roundBox(14, 10, titleW, 30, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, 26, 25);
            ctx.restore();

            // Chu kỳ sawtooth: t chạy từ 0 đến 30 ms (1,5 chu kỳ T = 20 ms -> góc quay 3π)
            const saw = (t * 0.16) % 1;
            const tMs = saw * 30.0;
            const phase = (2 * Math.PI * tMs) / 20.0; // tại t=0: e = 80*sin(0) = 0 (khớp 100% ảnh gốc)

            // Cột trái: Máy phát điện N - S + Khung dây quay + Vành khuyên (1), (2)
            roundBox(14, 48, 330, 246, 10, 'rgba(15, 23, 42, 0.78)', 'rgba(56, 189, 248, 0.35)', 1.8);

            // Hai cực nam châm N (đỏ) & S (xanh dương)
            roundBox(28, 78, 56, 98, 8, '#dc2626', '#fca5a5', 2.2);
            roundBox(272, 78, 56, 98, 8, '#2563eb', '#93c5fd', 2.2);
            ctx.save();
            ctx.fillStyle = '#ffffff';
            ctx.font = '800 22px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('N', 56, 127);
            ctx.fillText('S', 300, 127);
            ctx.restore();

            // Đường sức từ trường B từ N sang S
            for (let yy = 94; yy <= 160; yy += 22) {
                arrowLine(90, yy, 266, yy, 'rgba(56, 189, 248, 0.4)', 2, 7);
            }
            drawVecText('B', 246, 184, '#38bdf8');

            // Trục quay nghiêng nhẹ & Khung dây quay đồng bộ theo pha
            const cx = 178, cy = 127;
            ctx.save();
            ctx.strokeStyle = '#94a3b8';
            ctx.setLineDash([5, 4]);
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(212, 62); ctx.lineTo(132, 238); ctx.stroke();
            ctx.setLineDash([]);

            // Mũi tên chiều quay trên đỉnh khung
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 2.2;
            ctx.beginPath();
            ctx.arc(204, 72, 16, -Math.PI * 0.85, Math.PI * 0.15);
            ctx.stroke();
            arrowLine(216, 66, 220, 74, '#fbbf24', 2.2, 6);

            // Tại t = 0: e = 0 => từ thông cực đại => mặt phẳng khung vuông góc B (sin(phase) = 0 -> proj ~ sin(phase) để nhìn nghiêng mở theo sin)
            const halfW = 36;
            const open = 22 * Math.sin(phase);
            const ax = cx - 18 + open, ay = cy - halfW;
            const bx = cx + 18 + open, by = cy - halfW;
            const cx2 = cx + 12 - open, cy2 = cy + halfW;
            const dx = cx - 24 - open, dy = cy + halfW;

            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 3.6;
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.lineTo(cx2, cy2); ctx.lineTo(dx, dy);
            ctx.closePath();
            ctx.stroke();

            // 2 vành khuyên & chổi quét (1), (2)
            const r1x = 152, r1y = 194, r2x = 138, r2y = 224;
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 3.4;
            ctx.beginPath(); ctx.ellipse(r1x, r1y, 13, 8, -0.35, 0, Math.PI * 2); ctx.stroke();
            ctx.beginPath(); ctx.ellipse(r2x, r2y, 13, 8, -0.35, 0, Math.PI * 2); ctx.stroke();

            roundBox(r1x - 24, r1y - 4, 14, 8, 2, '#94a3b8', '#f8fafc', 1.4);
            roundBox(r2x - 24, r2y - 4, 14, 8, 2, '#94a3b8', '#f8fafc', 1.4);
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(r1x - 24, r1y); ctx.lineTo(84, r1y);
            ctx.moveTo(r2x - 24, r2y); ctx.lineTo(72, r2y);
            ctx.stroke();

            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 14.5px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            ctx.fillText('(1)', 78, r1y);
            ctx.fillText('(2)', 66, r2y);

            // Thông số đề ở đáy thẻ trái (Zero Data Leakage)
            roundBox(26, 250, 306, 32, 6, '#0f172a', '#38bdf8', 1.5);
            ctx.fillStyle = '#e2e8f0';
            ctx.textAlign = 'center';
            ctx.fillText('B = 0,4 T;  r = 5 Ω;  R = 20 Ω', 179, 266);
            ctx.restore();

            // Cột phải: Đồ thị e (V) theo t (ms) khớp 100% ảnh gốc 070.png
            roundBox(358, 48, 408, 246, 10, 'rgba(15, 23, 42, 0.78)', 'rgba(56, 189, 248, 0.35)', 1.8);
            const gox = 426, goy = 178, amp = 72, wPlot = 282; // 30 ms -> 47px mỗi 5 ms

            // Lưới tọa độ 6 x 4 ô
            ctx.save();
            ctx.strokeStyle = 'rgba(148, 163, 184, 0.28)';
            ctx.lineWidth = 1.2;
            for (let k = 1; k <= 6; k++) {
                const gx = gox + (k / 6) * wPlot;
                ctx.beginPath(); ctx.moveTo(gx, goy - amp); ctx.lineTo(gx, goy + amp); ctx.stroke();
            }
            [-1, -0.5, 0.5, 1].forEach(f => {
                const gy = goy - f * amp;
                ctx.beginPath(); ctx.moveTo(gox, gy); ctx.lineTo(gox + wPlot, gy); ctx.stroke();
            });
            ctx.restore();

            arrowLine(gox, goy + amp + 14, gox, 60, '#e2e8f0', 2.4, 8);
            arrowLine(gox - 8, goy, gox + wPlot + 36, goy, '#e2e8f0', 2.4, 8);

            ctx.save();
            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 15.5px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText('e (V)', gox + 12, 68);
            ctx.textAlign = 'center';
            ctx.fillText('t (ms)', 740, goy - 18);

            ctx.fillStyle = '#e2e8f0';
            ctx.font = '800 14.5px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText('80', gox - 8, goy - amp);
            ctx.fillText('40', gox - 8, goy - amp * 0.5);
            ctx.fillText('0', gox - 8, goy);
            ctx.fillText('−40', gox - 8, goy + amp * 0.5);
            ctx.fillText('−80', gox - 8, goy + amp);

            ctx.textAlign = 'center';
            [0, 5, 10, 15, 20, 25, 30].forEach((val, idx) => {
                const tx = gox + (idx / 6) * wPlot;
                const ty = val === 0 ? goy + 18 : goy + amp + 18;
                ctx.fillText(String(val), val === 0 ? tx + 10 : tx, ty);
            });
            ctx.restore();

            // Đường cong e(t) = 80 sin(2π t / 20)
            ctx.save();
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 3.2;
            ctx.beginPath();
            for (let i = 0; i <= 120; i++) {
                const u = i / 120;
                const tCur = u * 30.0;
                const px = gox + u * wPlot;
                const py = goy - amp * Math.sin((2 * Math.PI * tCur) / 20.0);
                if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            ctx.stroke();

            // Chấm chạy đồng bộ trên đồ thị
            const pxDot = gox + saw * wPlot;
            const pyDot = goy - amp * Math.sin(phase);
            ctx.strokeStyle = 'rgba(251, 191, 36, 0.45)';
            ctx.lineWidth = 1.6;
            ctx.setLineDash([3, 3]);
            ctx.beginPath(); ctx.moveTo(pxDot, goy); ctx.lineTo(pxDot, pyDot); ctx.stroke();
            ctx.setLineDash([]);

            ctx.fillStyle = '#fbbf24';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(pxDot, pyDot, 6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.restore();
        });

    // =========================================================================
    // CÂU 71 (MH-STAGING-C3-17 · VLXT-DS-VD28-071): Thanh dẫn MN trượt đều trên khung chữ nhật kín ABCD trong từ trường B
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C3-17', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
            for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(x, y, bw, bh, r);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function arrowLine(x1, y1, x2, y2, col, lw = 2.6, hl = 8) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }

            function drawSub(base, sub, x, y, col, baseSz = 16) {
                const subSz = Math.max(13, Math.round(baseSz * 0.78));
                ctx.save();
                ctx.fillStyle = col;
                ctx.textAlign = 'left';
                ctx.textBaseline = 'alphabetic';
                ctx.font = `700 ${baseSz}px "Segoe UI", system-ui, sans-serif`;
                const bw = ctx.measureText(base).width;
                ctx.fillText(base, x, y);
                let sw = 0;
                if (sub) {
                    ctx.font = `700 ${subSz}px "Segoe UI", system-ui, sans-serif`;
                    sw = ctx.measureText(sub).width;
                    ctx.fillText(sub, x + bw + 1, y + 4);
                }
                ctx.restore();
                return bw + sw + 2;
            }

            function drawVecText(ch, x, y, col) {
                ctx.save();
                ctx.fillStyle = col;
                ctx.font = 'italic 800 17px "Segoe UI", system-ui, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(ch, x, y);
                const vy = y - 13;
                ctx.strokeStyle = col;
                ctx.lineWidth = 1.8;
                ctx.beginPath();
                ctx.moveTo(x - 6, vy); ctx.lineTo(x + 7, vy);
                ctx.lineTo(x + 3, vy - 3);
                ctx.moveTo(x + 7, vy); ctx.lineTo(x + 3, vy + 3);
                ctx.stroke();
                ctx.restore();
            }

            // Title badge
            ctx.save();
            const title = 'THANH DẪN MN TRƯỢT ĐỀU TRÊN KHUNG KÍN ABCD (B = 0,4 T; v = 10,0 m/s)';
            ctx.font = '800 14.5px "Segoe UI", system-ui, sans-serif';
            const titleW = Math.min(752, ctx.measureText(title).width + 24);
            roundBox(14, 10, titleW, 30, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, 26, 25);
            ctx.restore();

            const saw = (t * 0.22) % 1;
            const frac = 0.16 + saw * 0.66;

            // Cột trái: Khung ABCD + Thanh MN trượt sang phải + Vectơ B thẳng đứng xuống
            roundBox(14, 48, 452, 246, 10, 'rgba(15, 23, 42, 0.78)', 'rgba(56, 189, 248, 0.35)', 1.8);

            const Ax = 148, Ay = 110;
            const Dx = 418, Dy = 110;
            const Bx = 54, By = 246;
            const Cx = 324, Cy = 246;

            // Vùng tô mờ mặt phẳng khung
            ctx.save();
            ctx.fillStyle = 'rgba(56, 189, 248, 0.08)';
            ctx.beginPath();
            ctx.moveTo(Ax, Ay); ctx.lineTo(Dx, Dy); ctx.lineTo(Cx, Cy); ctx.lineTo(Bx, By);
            ctx.closePath();
            ctx.fill();

            // Hai đường sức phụ mờ
            arrowLine(156, 68, 156, 274, 'rgba(56, 189, 248, 0.28)', 1.8, 6);
            arrowLine(334, 68, 334, 274, 'rgba(56, 189, 248, 0.28)', 1.8, 6);

            // Khung chữ nhật ABCD nét đậm
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 4;
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(Ax, Ay); ctx.lineTo(Dx, Dy); ctx.lineTo(Cx, Cy); ctx.lineTo(Bx, By);
            ctx.closePath();
            ctx.stroke();

            // Thanh dẫn MN trượt đều sang phải (KHÔNG vẽ chiều dòng cảm ứng -> Zero Leakage)
            const Mx = Ax + frac * (Dx - Ax), My = Ay;
            const Nx = Bx + frac * (Cx - Bx), Ny = By;

            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 6;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(Mx, My);
            ctx.lineTo(Nx, Ny);
            ctx.stroke();

            // Mũi tên vận tốc v tại trung điểm MN
            const midX = (Mx + Nx) / 2, midY = (My + Ny) / 2;
            arrowLine(midX + 6, midY, midX + 58, midY, '#10b981', 3, 9);
            drawVecText('v', midX + 36, midY - 18, '#6ee7b7');

            // Vectơ cảm ứng từ B chính ở giữa khung (nét đứt phần bị khung che giống ảnh gốc 071.png)
            const bx = 252;
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2.6;
            ctx.beginPath(); ctx.moveTo(bx, 60); ctx.lineTo(bx, 186); ctx.stroke();

            ctx.setLineDash([6, 4]);
            ctx.beginPath(); ctx.moveTo(bx, 186); ctx.lineTo(bx, Cy); ctx.stroke();
            ctx.setLineDash([]);

            arrowLine(bx, Cy, bx, 282, '#38bdf8', 2.6, 8);
            drawVecText('B', bx + 20, 82, '#38bdf8');

            // Nhãn đỉnh A, B, C, D, M, N
            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 15.5px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('A', Ax - 12, Ay - 14);
            ctx.fillText('D', Dx + 12, Dy - 14);
            ctx.fillText('B', Bx - 14, By + 16);
            ctx.fillText('C', Cx + 14, Cy + 16);

            ctx.fillStyle = '#fbbf24';
            ctx.fillText('M', Mx, My - 18);
            ctx.fillText('N', Nx, Ny + 20);
            ctx.restore();

            // Cột phải: Thẻ thông số đề bài (Zero Data Leakage)
            roundBox(480, 48, 286, 246, 10, '#0f172a', '#38bdf8', 2);
            ctx.save();
            ctx.fillStyle = '#38bdf8';
            ctx.font = '800 15px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText('THÔNG SỐ KHUNG – THANH MN', 496, 76);

            ctx.fillStyle = '#f8fafc';
            ctx.font = '700 14.5px "Segoe UI", system-ui, sans-serif';
            ctx.fillText('• Cảm ứng từ đều: B = 0,4 T', 496, 114);
            ctx.fillText('• Vận tốc thanh MN: v = 10,0 m/s', 496, 144);
            ctx.fillText('• Chiều dài: MN = AB = 20 cm', 496, 174);
            ctx.restore();

            const wR = drawSub('• Khung: R', 'ABCD', 496, 212, '#fde68a', 15.5);
            ctx.save();
            ctx.fillStyle = '#fde68a';
            ctx.font = '700 15px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'alphabetic';
            ctx.fillText(' = 16,0 Ω', 496 + wR, 212);
            ctx.restore();

            const wr = drawSub('• Thanh: r', 'MN', 496, 246, '#6ee7b7', 15.5);
            ctx.save();
            ctx.fillStyle = '#6ee7b7';
            ctx.font = '700 15px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'alphabetic';
            ctx.fillText(' = 1,0 Ω', 496 + wr, 246);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 72 (MH-STAGING-C3-18 · VLXT-DS-VD28-072): Thí nghiệm đo cảm ứng từ nam châm chữ U trên cân điện tử & đồ thị m(I)
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C3-18', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
            for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(x, y, bw, bh, r);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function arrowLine(x1, y1, x2, y2, col, lw = 2.4, hl = 8) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }

            // Title badge
            ctx.save();
            const title = 'THÍ NGHIỆM ĐO B NAM CHÂM CHỮ U TRÊN CÂN ĐIỆN TỬ (l = 15 cm; g = 10 m/s²)';
            ctx.font = '800 14.5px "Segoe UI", system-ui, sans-serif';
            const titleW = Math.min(752, ctx.measureText(title).width + 24);
            roundBox(14, 10, titleW, 30, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, 26, 25);
            ctx.restore();

            // Chu kỳ sawtooth: I tăng từ 0 -> 5 A, m tăng tuyến tính từ 80.0 g -> 82.9 g
            const saw = (t * 0.20) % 1;
            const curI = saw * 5.0;
            const curM = 80.0 + curI * Math.tan(Math.PI / 6);

            // Cột trái: Sơ đồ bộ thí nghiệm cân điện tử + nam châm chữ U + mạch biến trở & Ampe kế
            roundBox(14, 48, 412, 246, 10, 'rgba(15, 23, 42, 0.78)', 'rgba(56, 189, 248, 0.35)', 1.8);

            // Cân điện tử (đặt dịch sang phải để chừa khoảng trống thoáng bên trái cho nhãn Cân điện tử)
            roundBox(152, 176, 180, 52, 8, '#1e293b', '#94a3b8', 2.4);
            roundBox(170, 166, 144, 10, 3, '#475569', '#cbd5e1', 1.8);
            roundBox(176, 186, 132, 32, 5, '#050811', '#10b981', 1.8);
            ctx.save();
            ctx.fillStyle = '#6ee7b7';
            ctx.font = '800 16px "DM Mono", monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${curM.toFixed(1).replace('.', ',')} g`, 242, 202);
            ctx.restore();

            // Nam châm chữ U đặt trên đĩa cân (S phía sau xanh nâng cao, N phía trước đỏ -> chừa khe thoáng ở giữa cho dây dẫn)
            const mx = 186, my = 86;
            roundBox(mx + 14, my, 96, 36, 5, '#2563eb', '#93c5fd', 2);
            ctx.save();
            ctx.fillStyle = '#ffffff';
            ctx.font = '800 16px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('S', mx + 62, my + 16);
            ctx.restore();

            // Đáy nam châm chữ U & Cực N phía trước
            ctx.save();
            ctx.fillStyle = '#64748b';
            ctx.fillRect(mx + 14, my + 36, 16, 44);
            ctx.fillRect(mx + 14, my + 70, 96, 10);
            ctx.restore();
            roundBox(mx + 6, my + 38, 96, 36, 5, '#dc2626', '#fca5a5', 2.2);
            ctx.save();
            ctx.fillStyle = '#ffffff';
            ctx.font = '800 16px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('N', mx + 54, my + 56);
            ctx.restore();

            // Hai trụ giá đỡ cố định hai bên ngoài cân (trái ở x=44, phải ở x=384)
            ctx.save();
            ctx.fillStyle = '#94a3b8';
            ctx.fillRect(44, 96, 8, 122);
            ctx.fillRect(382, 96, 8, 122);
            roundBox(36, 214, 24, 10, 3, '#334155', '#94a3b8', 1.6);
            roundBox(374, 214, 24, 10, 3, '#334155', '#94a3b8', 1.6);
            ctx.restore();

            // Đoạn dây dẫn nằm ngang xuyên chính giữa khe hở giữa cực S và N (y = 122)
            ctx.save();
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 4.2;
            ctx.beginPath();
            ctx.moveTo(48, 122);
            ctx.lineTo(386, 122);
            ctx.stroke();

            // Mạch điện vòng dưới gồm Biến trở, Nguồn điện, Ampe kế (A)
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 2.6;
            ctx.beginPath();
            ctx.moveTo(48, 122);
            ctx.quadraticCurveTo(22, 188, 44, 264);
            ctx.lineTo(136, 264);
            ctx.moveTo(196, 264);
            ctx.lineTo(242, 264);
            ctx.moveTo(278, 264);
            ctx.lineTo(320, 264);
            ctx.moveTo(334, 264);
            ctx.lineTo(392, 264);
            ctx.quadraticCurveTo(414, 188, 386, 122);
            ctx.stroke();

            // Biến trở & con chạy
            roundBox(136, 254, 60, 20, 4, '#0f172a', '#fbbf24', 1.8);
            const slidX = 144 + saw * 44;
            arrowLine(slidX, 240, slidX, 254, '#fbbf24', 2.2, 6);

            // Ampe kế (A)
            ctx.fillStyle = '#0f172a';
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2.2;
            ctx.beginPath(); ctx.arc(260, 264, 18, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#38bdf8';
            ctx.font = '800 15px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('A', 260, 264);

            // Nguồn điện 1 chiều
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 2.6;
            ctx.beginPath(); ctx.moveTo(320, 248); ctx.lineTo(320, 280); ctx.stroke();
            ctx.lineWidth = 4.5;
            ctx.beginPath(); ctx.moveTo(334, 255); ctx.lineTo(334, 273); ctx.stroke();
            ctx.restore();

            // Nhãn gọi tên sạch sẽ: Nam châm chữ U & Cân điện tử (nằm hoàn toàn trong vùng trống!)
            ctx.save();
            ctx.fillStyle = '#e2e8f0';
            ctx.font = '700 14.5px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText('Nam châm chữ U', 34, 68);
            arrowLine(154, 68, 198, 92, '#93c5fd', 1.8, 6);

            ctx.fillStyle = '#6ee7b7';
            ctx.fillText('Cân điện tử', 58, 154);
            arrowLine(126, 166, 150, 186, '#6ee7b7', 1.8, 6);
            ctx.restore();

            // Cột phải: Đồ thị m (g) theo I (A) khớp 100% ảnh gốc
            roundBox(440, 48, 326, 246, 10, 'rgba(15, 23, 42, 0.78)', 'rgba(56, 189, 248, 0.35)', 1.8);
            const gox = 496, goy = 264;
            const y80 = 210;
            const dxEnd = 228;
            const dySlope = dxEnd * Math.tan(Math.PI / 6); // đúng góc 30°

            arrowLine(gox, goy + 6, gox, 60, '#e2e8f0', 2.4, 8);
            arrowLine(gox - 8, goy, 750, goy, '#e2e8f0', 2.4, 8);

            // Đường ngang nét đứt qua 80 và lưới gióng các điểm đo
            ctx.save();
            ctx.setLineDash([4, 4]);
            ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
            ctx.lineWidth = 1.6;
            ctx.beginPath(); ctx.moveTo(gox, y80); ctx.lineTo(732, y80); ctx.stroke();
            for (let k = 1; k <= 4; k++) {
                const gx = gox + k * 48;
                const gy = y80 - k * 48 * Math.tan(Math.PI / 6);
                ctx.beginPath();
                ctx.moveTo(gox, gy); ctx.lineTo(gx, gy); ctx.lineTo(gx, goy);
                ctx.stroke();
            }
            ctx.restore();

            // Đường đồ thị thẳng từ (0, 80) hợp góc α = 30°
            ctx.save();
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 3.2;
            ctx.beginPath();
            ctx.moveTo(gox, y80);
            ctx.lineTo(gox + dxEnd, y80 - dySlope);
            ctx.stroke();

            // Cung góc α = 30°
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(gox, y80, 44, -Math.PI / 6, 0);
            ctx.stroke();
            ctx.fillStyle = '#fbbf24';
            ctx.font = '800 15px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText('α = 30°', gox + 50, y80 - 14);

            // Nhãn trục m(g), I(A), O, 80
            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 15.5px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('m (g)', gox + 12, 68);
            ctx.textAlign = 'right';
            ctx.fillText('80', gox - 10, y80);
            ctx.fillText('O', gox - 10, goy + 16);
            ctx.textAlign = 'center';
            ctx.fillText('I (A)', 732, goy - 18);

            // Chấm chạy đồng bộ trên đồ thị m(I)
            const dotX = gox + saw * 204;
            const dotY = y80 - saw * 204 * Math.tan(Math.PI / 6);
            ctx.fillStyle = '#fbbf24';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(dotX, dotY, 6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

            ctx.fillStyle = '#7dd3fc';
            ctx.font = '800 14.5px "DM Mono", monospace';
            ctx.textAlign = 'right';
            ctx.fillText(`I = ${curI.toFixed(1).replace('.', ',')} A`, 746, 74);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 73 (MH-STAGING-C4-01 · VLXT-DS-VD28-073): So sánh cấu tạo và năng lượng liên kết riêng của Uranium, Calcium và Iron
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C4-01', function(ctx, w, h, t) {
            function clearBg() {
                ctx.clearRect(0, 0, w, h);
                const g = ctx.createLinearGradient(0, 0, 0, h);
                g.addColorStop(0, '#060b19');
                g.addColorStop(1, '#0a1226');
                ctx.fillStyle = g;
                ctx.fillRect(0, 0, w, h);
                ctx.save();
                ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
                ctx.lineWidth = 1;
                for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
                for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
                ctx.restore();
            }
            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(x, y, bw, bh, r); else ctx.rect(x, y, bw, bh);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }
            function drawTitle(txt) {
                ctx.save();
                ctx.font = '800 14.5px "Segoe UI", system-ui, sans-serif';
                const tw = Math.min(752, ctx.measureText(txt).width + 24);
                roundBox(14, 10, tw, 30, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
                ctx.fillStyle = '#38bdf8';
                ctx.textAlign = 'left';
                ctx.textBaseline = 'middle';
                ctx.fillText(txt, 26, 25);
                ctx.restore();
            }
            function drawSub(base, sub, x, y, col, fs = 16, align = 'left') {
                const subSz = Math.max(12.5, Math.round(fs * 0.78));
                ctx.save();
                ctx.fillStyle = col;
                ctx.textAlign = 'left';
                ctx.textBaseline = 'alphabetic';
                ctx.font = `800 ${fs}px "Segoe UI", system-ui, sans-serif`;
                const bw = ctx.measureText(base).width;
                ctx.font = `800 ${subSz}px "Segoe UI", system-ui, sans-serif`;
                const sw = sub ? ctx.measureText(sub).width : 0;
                const tot = bw + sw;
                let sx = x;
                if (align === 'center') sx = x - tot / 2;
                else if (align === 'right') sx = x - tot;
                ctx.font = `800 ${fs}px "Segoe UI", system-ui, sans-serif`;
                ctx.fillText(base, sx, y);
                if (sub) {
                    ctx.font = `800 ${subSz}px "Segoe UI", system-ui, sans-serif`;
                    ctx.fillText(sub, sx + bw + 1, y + 4);
                }
                ctx.restore();
            }

            clearBg();
            drawTitle('CẤU TẠO & NĂNG LƯỢNG LIÊN KẾT: URANIUM (U), CALCIUM (Ca), IRON (Fe)');

            const saw = (t * 0.22) % 1;
            const activeIdx = saw < 0.333 ? 0 : (saw < 0.666 ? 1 : 2);
            const nucs = [
                { name: 'Uranium (U)', Z: 92, N: 143, wlk: 1786, r: 34, col: '#f59e0b', count: 22 },
                { name: 'Calcium (Ca)', Z: 20, N: 20, wlk: 234, r: 22, col: '#38bdf8', count: 12 },
                { name: 'Iron (Fe)', Z: 26, N: 30, wlk: 493, r: 25, col: '#10b981', count: 15 }
            ];

            ctx.save();
            // Bên trái: 3 thẻ hạt nhân trực quan với cụm proton/neutron (Zero Data Leakage)
            nucs.forEach((n, idx) => {
                const cx = 82 + idx * 138;
                const cy = 154;
                const isAct = idx === activeIdx;
                roundBox(cx - 60, 56, 120, 232, 10, '#0f172a', isAct ? n.col : 'rgba(148,163,184,0.35)', isAct ? 2.6 : 1.6);

                // Vỏ nguyên tử & nhân ở giữa
                ctx.strokeStyle = isAct ? 'rgba(248, 250, 252, 0.38)' : 'rgba(148, 163, 184, 0.2)';
                ctx.lineWidth = 1.6;
                ctx.beginPath(); ctx.ellipse(cx, 122, 46, 22, 0.45, 0, Math.PI * 2); ctx.stroke();
                ctx.beginPath(); ctx.ellipse(cx, 122, 46, 22, -0.45, 0, Math.PI * 2); ctx.stroke();

                // Vẽ các nucleon trong hạt nhân
                for (let k = 0; k < n.count; k++) {
                    const ang = k * 2.39996 + (isAct ? t * 0.6 : 0);
                    const rad = (n.r - 6) * Math.sqrt((k + 0.5) / n.count);
                    const nx = cx + Math.cos(ang) * rad;
                    const ny = 122 + Math.sin(ang) * rad;
                    ctx.fillStyle = (k % 2 === 0) ? '#ef4444' : '#38bdf8';
                    ctx.beginPath(); ctx.arc(nx, ny, 4.6, 0, Math.PI * 2); ctx.fill();
                }

                ctx.fillStyle = n.col;
                ctx.font = '800 15px "Segoe UI", system-ui, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(n.name, cx, 182);

                ctx.fillStyle = '#e2e8f0';
                ctx.font = '700 14.5px "Segoe UI", system-ui, sans-serif';
                ctx.fillText(`p: ${n.Z}`, cx, 212);
                ctx.fillText(`n: ${n.N}`, cx, 238);
                ctx.fillStyle = '#fde68a';
                ctx.fillText(`${n.wlk} MeV`, cx, 266);
            });

            // Bên phải: Biểu đồ cột năng lượng liên kết toàn phần W_lk (MeV)
            roundBox(444, 56, 322, 232, 10, '#0f172a', '#38bdf8', 2);
            drawSub('W', 'lk', 462, 82, '#38bdf8', 16, 'left');
            ctx.fillStyle = '#38bdf8';
            ctx.font = '800 15px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText('TOÀN PHẦN (MeV)', 502, 77);

            const maxBarW = 195;
            nucs.forEach((n, idx) => {
                const by = 112 + idx * 54;
                const bw = Math.max(24, (n.wlk / 1786) * maxBarW);
                const isAct = idx === activeIdx;

                ctx.fillStyle = '#f8fafc';
                ctx.font = '800 15px "Segoe UI", system-ui, sans-serif';
                ctx.textAlign = 'left';
                ctx.fillText(n.name.split(' ')[1].replace(/[()]/g, ''), 462, by + 13);

                roundBox(500, by, maxBarW + 10, 26, 5, '#1e293b', 'rgba(148,163,184,0.25)', 1);
                const fillRatio = isAct ? Math.min(1, ((saw * 3) % 1) / 0.35 + 0.35) : 1;
                roundBox(500, by, bw * fillRatio, 26, 5, n.col, isAct ? '#ffffff' : n.col, isAct ? 2 : 1);

                ctx.fillStyle = '#f8fafc';
                ctx.font = '800 14.5px "Segoe UI", system-ui, sans-serif';
                ctx.fillText(`${n.wlk}`, 712, by + 13);
            });

            // Chú thích hạt nucleon góc dưới phải
            ctx.fillStyle = '#ef4444';
            ctx.beginPath(); ctx.arc(470, 268, 5, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#cbd5e1';
            ctx.font = '700 14.5px "Segoe UI", system-ui, sans-serif';
            ctx.fillText('Proton (+)', 482, 268);

            ctx.fillStyle = '#38bdf8';
            ctx.beginPath(); ctx.arc(595, 268, 5, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#cbd5e1';
            ctx.fillText('Neutron (0)', 607, 268);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 74 (MH-STAGING-C4-02 · VLXT-DS-VD28-074): Độ hụt khối và năng lượng liên kết riêng của hạt nhân bán dẫn Silicon-28
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C4-02', function(ctx, w, h, t) {
            function clearBg() {
                ctx.clearRect(0, 0, w, h);
                const g = ctx.createLinearGradient(0, 0, 0, h);
                g.addColorStop(0, '#060b19');
                g.addColorStop(1, '#0a1226');
                ctx.fillStyle = g;
                ctx.fillRect(0, 0, w, h);
                ctx.save();
                ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
                ctx.lineWidth = 1;
                for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
                for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
                ctx.restore();
            }
            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(x, y, bw, bh, r); else ctx.rect(x, y, bw, bh);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }
            function arrowLine(x1, y1, x2, y2, col, lw = 2.8, hl = 8) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }
            function drawNuclide(A, Z, sym, x, y, opts = {}) {
                const fs = Math.max(16, opts.fontSize || 18);
                const idxSize = Math.max(12.5, Math.round(fs * 0.72));
                const col = opts.color || '#f8fafc';
                const align = opts.align || 'left';
                ctx.save();
                ctx.textBaseline = 'middle';
                ctx.font = `800 ${idxSize}px "Segoe UI", system-ui, sans-serif`;
                const wA = ctx.measureText(String(A)).width;
                const wZ = ctx.measureText(String(Z)).width;
                const idxW = Math.max(wA, wZ);
                ctx.font = `800 ${fs}px "Segoe UI", system-ui, sans-serif`;
                const symW = ctx.measureText(sym).width;
                const tot = idxW + 2 + symW;
                let sx = x;
                if (align === 'center') sx = x - tot / 2;
                else if (align === 'right') sx = x - tot;
                ctx.fillStyle = col;
                ctx.textAlign = 'right';
                ctx.font = `800 ${idxSize}px "Segoe UI", system-ui, sans-serif`;
                ctx.fillText(String(A), sx + idxW, y - Math.round(fs * 0.36));
                ctx.fillText(String(Z), sx + idxW, y + Math.round(fs * 0.38));
                ctx.textAlign = 'left';
                ctx.font = `800 ${fs}px "Segoe UI", system-ui, sans-serif`;
                ctx.fillText(sym, sx + idxW + 2, y);
                ctx.restore();
            }
            function drawGammaRay(x1, y1, x2, y2, col) {
                const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy);
                if (len < 12) return;
                const ang = Math.atan2(dy, dx);
                ctx.save();
                ctx.translate(x1, y1);
                ctx.rotate(ang);
                ctx.strokeStyle = col; ctx.lineWidth = 2.6;
                ctx.beginPath(); ctx.moveTo(0, 0);
                const bodyLen = len - 9, waves = Math.max(2, Math.floor(len / 14));
                for (let i = 0; i <= waves * 4; i++) {
                    ctx.lineTo((i / (waves * 4)) * bodyLen, Math.sin((i / 4) * Math.PI * 2) * 4);
                }
                ctx.lineTo(len, 0); ctx.stroke();
                ctx.fillStyle = col;
                ctx.beginPath(); ctx.moveTo(len, 0); ctx.lineTo(len - 8, -4); ctx.lineTo(len - 8, 4); ctx.closePath(); ctx.fill();
                ctx.restore();
            }
            function drawTitle(txt) {
                ctx.save();
                ctx.font = '800 14.5px "Segoe UI", system-ui, sans-serif';
                const tw = Math.min(752, ctx.measureText(txt).width + 24);
                roundBox(14, 10, tw, 30, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
                ctx.fillStyle = '#38bdf8'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                ctx.fillText(txt, 26, 25);
                ctx.restore();
            }

            clearBg();
            drawTitle('ĐỘ HỤT KHỐI & NĂNG LƯỢNG LIÊN KẾT CỦA HẠT NHÂN SILICON');

            const saw = (t * 0.25) % 1;
            const mergeP = Math.min(1, saw / 0.65);

            ctx.save();
            // Bên trái: Các nucleon tự do (trái) kết hợp thành hạt nhân Si-28 (phải)
            roundBox(16, 54, 412, 236, 10, '#0f172a', 'rgba(56, 189, 248, 0.45)', 2);
            const startCx = 104, endCx = 326, cy = 152;
            const count = 16;

            // Vẽ cố định các nucleon tự do bên trái để không trống khung ở cuối pha
            for (let i = 0; i < count; i++) {
                const ang = i * 2.39996;
                const r0 = 42 * Math.sqrt((i + 0.5) / count);
                ctx.fillStyle = (i % 2 === 0) ? 'rgba(239,68,68,0.85)' : 'rgba(56,189,248,0.85)';
                ctx.beginPath(); ctx.arc(startCx + Math.cos(ang) * r0, cy + Math.sin(ang) * r0, 5, 0, Math.PI * 2); ctx.fill();
            }

            // Vẽ cụm hạt nhân Si-28 kết hợp bên phải
            for (let i = 0; i < count; i++) {
                const ang = i * 2.39996 + t * 0.4;
                const r0 = 22 * Math.sqrt((i + 0.5) / count);
                ctx.fillStyle = (i % 2 === 0) ? '#ef4444' : '#38bdf8';
                ctx.beginPath(); ctx.arc(endCx + Math.cos(ang) * r0, cy + Math.sin(ang) * r0, 5.2, 0, Math.PI * 2); ctx.fill();
            }

            // Mũi tên chuyển động 1 chiều sawtooth từ cụm rời -> hạt nhân
            arrowLine(162, 152, 276, 152, '#fbbf24', 2.8, 8);
            const pDotX = 166 + saw * 102;
            ctx.fillStyle = '#fef08a';
            ctx.beginPath(); ctx.arc(pDotX, 152, 5, 0, Math.PI * 2); ctx.fill();

            ctx.fillStyle = '#cbd5e1';
            ctx.font = '800 14.5px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Các nucleon rời', 104, 224);
            ctx.fillText('Hạt nhân', 298, 224);
            drawNuclide('28', '14', 'Si', 352, 222, { fontSize: 18, color: '#fbbf24', align: 'left' });

            // Tia gamma tỏa năng lượng liên kết phát ra ngoài biên hạt nhân (không đè nucleon)
            const gProg = 0.4 + 0.6 * saw;
            drawGammaRay(endCx + 22, cy - 22, endCx + 22 + 38 * gProg, cy - 22 - 34 * gProg, '#a855f7');
            ctx.fillStyle = '#d8b4fe';
            ctx.font = '800 14.5px "Segoe UI", system-ui, sans-serif';
            ctx.fillText('Tỏa ΔE', endCx + 52, cy - 72);

            ctx.fillStyle = '#fde68a';
            ctx.font = '800 15px "Segoe UI", system-ui, sans-serif';
            ctx.fillText('Δm = ∑m(nucleon) − m(Si) > 0', 222, 266);

            // Bên phải: Thẻ thông số đề bài (Zero Data Leakage)
            roundBox(444, 54, 322, 236, 10, '#0f172a', '#fbbf24', 2);
            ctx.fillStyle = '#fbbf24';
            ctx.font = '800 15.5px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('DỮ KIỆN HẠT NHÂN Si-28', 462, 82);

            drawNuclide('28', '14', 'Si', 462, 118, { fontSize: 18, color: '#38bdf8' });
            ctx.fillStyle = '#f8fafc';
            ctx.font = '700 14.5px "Segoe UI", system-ui, sans-serif';
            ctx.fillText(': m = 27,9769 amu', 514, 118);
            ctx.fillText('• Khối lượng p: 1,0073 amu', 462, 152);
            ctx.fillText('• Khối lượng n: 1,0087 amu', 462, 184);
            ctx.fillText('• 1 amu = 931,5 MeV/c²', 462, 216);
            ctx.fillStyle = '#6ee7b7';
            ctx.fillText('• Vật liệu bán dẫn điện tử', 462, 252);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 75 (MH-STAGING-C4-03 · VLXT-DS-VD28-075): Liệu trình xạ trị ung thư tuyến giáp bằng đồng vị phóng xạ Iodine-131 (50 mg; T = 8 ngày)
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C4-03', function(ctx, w, h, t) {
            function clearBg() {
                ctx.clearRect(0, 0, w, h);
                const g = ctx.createLinearGradient(0, 0, 0, h);
                g.addColorStop(0, '#060b19');
                g.addColorStop(1, '#0a1226');
                ctx.fillStyle = g;
                ctx.fillRect(0, 0, w, h);
                ctx.save();
                ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
                ctx.lineWidth = 1;
                for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
                for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
                ctx.restore();
            }
            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(x, y, bw, bh, r); else ctx.rect(x, y, bw, bh);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }
            function arrowLine(x1, y1, x2, y2, col, lw = 2.6, hl = 8) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }
            function drawNuclide(A, Z, sym, x, y, opts = {}) {
                const fs = Math.max(16, opts.fontSize || 18);
                const idxSize = Math.max(12.5, Math.round(fs * 0.72));
                const col = opts.color || '#f8fafc';
                ctx.save();
                ctx.textBaseline = 'middle';
                ctx.font = `800 ${idxSize}px "Segoe UI", system-ui, sans-serif`;
                const idxW = Math.max(ctx.measureText(String(A)).width, ctx.measureText(String(Z)).width);
                ctx.fillStyle = col;
                ctx.textAlign = 'right';
                ctx.fillText(String(A), x + idxW, y - Math.round(fs * 0.36));
                ctx.fillText(String(Z), x + idxW, y + Math.round(fs * 0.38));
                ctx.textAlign = 'left';
                ctx.font = `800 ${fs}px "Segoe UI", system-ui, sans-serif`;
                ctx.fillText(sym, x + idxW + 2, y);
                ctx.restore();
            }
            function drawTitle(txt) {
                ctx.save();
                ctx.font = '800 14.5px "Segoe UI", system-ui, sans-serif';
                const tw = Math.min(752, ctx.measureText(txt).width + 24);
                roundBox(14, 10, tw, 30, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
                ctx.fillStyle = '#38bdf8'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                ctx.fillText(txt, 26, 25);
                ctx.restore();
            }

            clearBg();
            drawTitle('XẠ TRỊ TUYẾN GIÁP BẰNG ĐỒNG VỊ IODINE-131 (m₀ = 50 mg; T = 8 ngày)');

            const saw = (t * 0.22) % 1;
            ctx.save();
            // Bên trái: Tuyến giáp hấp thụ liều 50 mg I-131 và phân rã sang Xe-131
            roundBox(16, 54, 344, 236, 10, '#0f172a', '#f472b6', 2);
            const tx = 188, ty = 126;
            ctx.fillStyle = 'rgba(244, 114, 182, 0.25)';
            ctx.strokeStyle = '#f472b6';
            ctx.lineWidth = 2.8;
            ctx.beginPath(); ctx.ellipse(tx - 26, ty, 22, 42, -0.18, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.beginPath(); ctx.ellipse(tx + 26, ty, 22, 42, 0.18, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.fillRect(tx - 12, ty - 8, 24, 16);

            // Tia phóng xạ phát ra từ mô tuyến giáp (1 chiều sawtooth, không lộ tên tia)
            for (let i = 0; i < 6; i++) {
                const ang = (i * Math.PI * 2) / 6 + 0.25;
                const r = saw * 36;
                ctx.fillStyle = '#fbbf24';
                ctx.beginPath(); ctx.arc(tx + Math.cos(ang) * r, ty + Math.sin(ang) * r, 4, 0, Math.PI * 2); ctx.fill();
            }

            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 14.5px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Tuyến giáp (50 mg I-131)', tx, 186);

            // Hộp sơ đồ biến đổi hạt nhân (Zero Data Leakage: không lộ tia beta-)
            roundBox(34, 212, 308, 62, 8, '#1e293b', 'rgba(56,189,248,0.45)', 1.6);
            drawNuclide('131', '53', 'I', 58, 244, { fontSize: 18, color: '#fbbf24' });
            arrowLine(112, 244, 166, 244, '#38bdf8', 2.8, 8);
            drawNuclide('131', '54', 'Xe', 180, 244, { fontSize: 18, color: '#6ee7b7' });
            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 15px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('+ Tia ?', 252, 244);

            // Bên phải: Đồ thị phân rã N(t) = N0 * 2^(-t/T) với T = 8 ngày
            roundBox(378, 54, 388, 236, 10, '#0f172a', '#38bdf8', 2);
            const ox = 446, oy = 248, gx = 290, gy = 152;
            arrowLine(ox, oy + 4, ox, oy - gy, '#f1f5f9', 2.6, 8);
            arrowLine(ox - 4, oy, ox + gx, oy, '#f1f5f9', 2.6, 8);

            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 15px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('N(t)', ox + 8, oy - gy + 6);
            ctx.textAlign = 'center';
            ctx.fillText('t (ngày)', ox + gx - 28, oy + 24);
            ctx.textAlign = 'right';
            ctx.fillText('N₀', ox - 8, oy - 124);
            ctx.fillText('N₀/2', ox - 8, oy - 62);
            ctx.fillText('O', ox - 8, oy + 20);

            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 3.2;
            ctx.beginPath();
            for (let u = 0; u <= 1; u += 0.025) {
                const px = ox + u * 246;
                const py = oy - 124 * Math.pow(0.5, u * 2.15);
                if (u === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            ctx.stroke();

            const xT = ox + 246 / 2.15;
            const yHalf = oy - 62;
            ctx.strokeStyle = '#64748b';
            ctx.setLineDash([5, 4]);
            ctx.lineWidth = 1.8;
            ctx.beginPath(); ctx.moveTo(ox, yHalf); ctx.lineTo(xT, yHalf); ctx.lineTo(xT, oy); ctx.stroke();
            ctx.setLineDash([]);

            ctx.fillStyle = '#38bdf8';
            ctx.font = '800 14.5px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('T = 8', xT, oy + 22);

            const dotX = ox + saw * 240;
            const dotY = oy - 124 * Math.pow(0.5, saw * 2.15 * (240 / 246));
            ctx.fillStyle = '#ef4444';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(dotX, dotY, 6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.restore();
        });

    // =========================================================================
    // CÂU 76 (MH-STAGING-C4-04 · VLXT-DS-VD28-076): Phương pháp pha loãng đồng vị phóng xạ Sodium-24 xác định thể tích bình kín cổ đại
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C4-04', function(ctx, w, h, t) {
            function clearBg() {
                ctx.clearRect(0, 0, w, h);
                const g = ctx.createLinearGradient(0, 0, 0, h);
                g.addColorStop(0, '#060b19');
                g.addColorStop(1, '#0a1226');
                ctx.fillStyle = g;
                ctx.fillRect(0, 0, w, h);
                ctx.save();
                ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
                ctx.lineWidth = 1;
                for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
                for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
                ctx.restore();
            }
            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(x, y, bw, bh, r); else ctx.rect(x, y, bw, bh);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }
            function arrowLine(x1, y1, x2, y2, col, lw = 2.6, hl = 8) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }
            function drawNuclide(A, Z, sym, x, y, opts = {}) {
                const fs = Math.max(16, opts.fontSize || 17);
                const idxSize = Math.max(12.5, Math.round(fs * 0.72));
                const col = opts.color || '#f8fafc';
                ctx.save();
                ctx.textBaseline = 'middle';
                ctx.font = `800 ${idxSize}px "Segoe UI", system-ui, sans-serif`;
                const idxW = Math.max(ctx.measureText(String(A)).width, ctx.measureText(String(Z)).width);
                ctx.fillStyle = col;
                ctx.textAlign = 'right';
                ctx.fillText(String(A), x + idxW, y - Math.round(fs * 0.36));
                ctx.fillText(String(Z), x + idxW, y + Math.round(fs * 0.38));
                ctx.textAlign = 'left';
                ctx.font = `800 ${fs}px "Segoe UI", system-ui, sans-serif`;
                ctx.fillText(sym, x + idxW + 2, y);
                ctx.restore();
            }
            function drawTitle(txt) {
                ctx.save();
                ctx.font = '800 14.5px "Segoe UI", system-ui, sans-serif';
                const tw = Math.min(752, ctx.measureText(txt).width + 24);
                roundBox(14, 10, tw, 30, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
                ctx.fillStyle = '#38bdf8'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                ctx.fillText(txt, 26, 25);
                ctx.restore();
            }

            clearBg();
            drawTitle('XÁC ĐỊNH THỂ TÍCH BÌNH KÍN CỔ ĐẠI BẰNG ĐỒNG VỊ SODIUM-24');

            const saw = (t * 0.18) % 1;
            ctx.save();
            // 1. Cốc pha dung dịch chuẩn 1500 cm3 bên trái
            const bx = 34, by = 112, bw = 110, bh = 128;
            ctx.fillStyle = 'rgba(251, 191, 36, 0.25)';
            ctx.fillRect(bx + 2, by + 32, bw - 4, bh - 34);
            ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 3;
            ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx, by + bh); ctx.lineTo(bx + bw, by + bh); ctx.lineTo(bx + bw, by); ctx.stroke();
            drawNuclide('24', '11', 'Na', bx + 26, by + 76, { fontSize: 17, color: '#fbbf24' });
            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 14.5px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('1500 cm³', bx + bw / 2, by - 16);
            ctx.fillText('Bình pha chuẩn', bx + bw / 2, by + bh + 20);

            // Mũi tên bơm 15 cm3 xuyên qua nút niêm phong vào bình cổ
            arrowLine(152, 182, 224, 182, '#fbbf24', 2.8, 8);
            roundBox(146, 134, 88, 28, 6, '#0f172a', '#fbbf24', 1.6);
            ctx.fillStyle = '#fde68a';
            ctx.fillText('15 cm³', 190, 148);

            // 2. Bình kín cổ đại ở giữa (cổ hẹp có nút niêm phong, chất lỏng đầy bình)
            const vx = 232, vy = 104, vw = 162, vh = 148;
            roundBox(vx, vy + 24, vw, vh - 24, 34, 'rgba(56, 189, 248, 0.20)', '#d97706', 3.2);
            roundBox(vx + 52, vy, 58, 28, 4, '#1e293b', '#d97706', 2.8);
            // Nút niêm phong đỏ nâu trên cổ bình
            roundBox(vx + 48, vy - 10, 66, 16, 4, '#92400e', '#fbbf24', 2);
            // Kim bơm đâm xuyên qua nút niêm phong (Zero-Gap Topology)
            ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 3;
            ctx.beginPath(); ctx.moveTo(vx + 81, vy - 28); ctx.lineTo(vx + 81, vy + 44); ctx.stroke();

            // Chuyển động 1 chiều (hoặc phân bố động đều) của các hạt Na-24 trong nước
            ctx.fillStyle = '#fbbf24';
            for (let i = 0; i < 12; i++) {
                const rx = ((i * 37 + 13) % 100) / 100;
                const ry = ((i * 53 + 29) % 100) / 100;
                const px = vx + 26 + rx * (vw - 52) + Math.sin(t * 2.5 + i) * 4;
                const py = vy + 52 + ry * (vh - 82) + Math.cos(t * 2.3 + i) * 4;
                ctx.beginPath(); ctx.arc(px, py, 3.8, 0, Math.PI * 2); ctx.fill();
            }
            // Dòng giọt bơm vào khi saw < 0.4
            if (saw < 0.45) {
                const dy = vy + 44 + (saw / 0.45) * 62;
                ctx.fillStyle = '#fde047';
                ctx.beginPath(); ctx.arc(vx + 81, dy, 4.5, 0, Math.PI * 2); ctx.fill();
            }

            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 15px "Segoe UI", system-ui, sans-serif';
            ctx.fillText('Bình kín cổ đại (V = ?)', vx + vw / 2, vy + vh + 22);

            // 3. Thẻ dữ kiện đề dẫn bên phải (Zero Data Leakage)
            roundBox(424, 54, 342, 236, 10, '#0f172a', '#38bdf8', 2);
            ctx.fillStyle = '#38bdf8';
            ctx.font = '800 15.5px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('THÔNG SỐ THÍ NGHIỆM', 442, 82);

            ctx.fillStyle = '#f8fafc';
            ctx.font = '700 14.5px "Segoe UI", system-ui, sans-serif';
            ctx.fillText('• Đồng vị: ²⁴₁₁Na (phóng xạ β⁻)', 442, 114);
            ctx.fillText('• Chu kì bán rã: T = 14,8 giờ', 442, 144);
            ctx.fillText('• Trộn 3,0·10⁻¹⁰ g vào 1500 cm³', 442, 174);
            ctx.fillText('• Bơm 15 cm³ vào bình & lắc đều', 442, 204);
            ctx.fillStyle = '#6ee7b7';
            ctx.fillText('• Sau 3,5 h rút 15 cm³: 3600 Bq', 442, 234);
            ctx.fillStyle = '#fbbf24';
            ctx.fillText('• Cần tìm: Thể tích V trong bình', 442, 264);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 77 (MH-STAGING-C4-05 · VLXT-DS-VD28-077): Máy cán lá thép tự động điều chỉnh độ dày dựa trên tính chất đâm xuyên của tia phóng xạ beta
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C4-05', function(ctx, w, h, t) {
            function clearBg() {
                ctx.clearRect(0, 0, w, h);
                const g = ctx.createLinearGradient(0, 0, 0, h);
                g.addColorStop(0, '#060b19');
                g.addColorStop(1, '#0a1226');
                ctx.fillStyle = g;
                ctx.fillRect(0, 0, w, h);
                ctx.save();
                ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
                ctx.lineWidth = 1;
                for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
                for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
                ctx.restore();
            }
            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(x, y, bw, bh, r); else ctx.rect(x, y, bw, bh);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }
            function arrowLine(x1, y1, x2, y2, col, lw = 2.6, hl = 8) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }
            function drawTitle(txt) {
                ctx.save();
                ctx.font = '800 14.5px "Segoe UI", system-ui, sans-serif';
                const tw = Math.min(752, ctx.measureText(txt).width + 24);
                roundBox(14, 10, tw, 30, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
                ctx.fillStyle = '#38bdf8'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                ctx.fillText(txt, 26, 25);
                ctx.restore();
            }

            clearBg();
            drawTitle('MÁY CÁN TỰ ĐỘNG ĐIỀU CHỈNH ĐỘ DÀY LÁ THÉP BẰNG TIA PHÓNG XẠ β⁻');

            const saw = (t * 0.35) % 1;
            ctx.save();
            // 1. Khối lá vật liệu thô (trái) đi qua 2 con quay cán -> lá mỏng (phải)
            const rollX = 152, sheetY = 178;
            ctx.fillStyle = '#475569';
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 2.2;
            // Vật liệu thô dày
            ctx.fillRect(28, sheetY - 22, rollX - 28, 44);
            ctx.strokeRect(28, sheetY - 22, rollX - 28, 44);
            // Lá thép đã cán
            ctx.fillStyle = '#64748b';
            ctx.fillRect(rollX, sheetY - 7, 294, 14);
            ctx.strokeRect(rollX, sheetY - 7, 294, 14);
            arrowLine(52, sheetY, 108, sheetY, '#38bdf8', 2.8, 8);

            // Hai con quay cán vật liệu (trên & dưới)
            [sheetY - 25, sheetY + 25].forEach((ry, idx) => {
                ctx.fillStyle = '#1d4ed8';
                ctx.strokeStyle = '#93c5fd';
                ctx.lineWidth = 2.6;
                ctx.beginPath(); ctx.arc(rollX, ry, 18, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                // Nan hoa quay
                const dir = idx === 0 ? 1 : -1;
                const a = t * 2.5 * dir;
                ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(rollX + Math.cos(a) * 10, ry + Math.sin(a) * 10);
                ctx.lineTo(rollX - Math.cos(a) * 10, ry - Math.sin(a) * 10);
                ctx.stroke();
            });

            ctx.fillStyle = '#cbd5e1';
            ctx.font = '800 14.5px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Con quay cán', 120, 232);
            ctx.fillText('Lá thép (d₀)', 258, 206);

            // 2. Nguồn phóng xạ beta- bên dưới lá thép -> Đầu thu phía trên
            const beamX = 368;
            roundBox(beamX - 24, 224, 48, 36, 5, '#1e293b', '#fbbf24', 2.2);
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath(); ctx.arc(beamX, 242, 7, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#fde68a';
            ctx.fillText('Nguồn β⁻', beamX, 276);

            // Đầu thu phía trên lá thép
            roundBox(beamX - 18, 108, 36, 36, 5, '#0f172a', '#10b981', 2.2);
            ctx.fillStyle = '#6ee7b7';
            ctx.fillText('Đầu thu', beamX + 58, 126);

            // Chùm tia phóng xạ đi 1 chiều sawtooth từ nguồn lên đầu thu xuyên qua lá thép
            ctx.strokeStyle = 'rgba(251, 191, 36, 0.45)';
            ctx.setLineDash([4, 4]); ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(beamX, 224); ctx.lineTo(beamX, 144); ctx.stroke();
            ctx.setLineDash([]);
            const pY = 224 - saw * (224 - 144);
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath(); ctx.arc(beamX, pY, 4.5, 0, Math.PI * 2); ctx.fill();

            // 3. Bộ điều khiển máy tính bên trên nối đầu thu & con quay
            roundBox(222, 54, 112, 46, 7, '#7c2d12', '#fb923c', 2.2);
            // Mặt đồng hồ tín hiệu trên bộ điều khiển
            ctx.fillStyle = '#f8fafc';
            ctx.beginPath(); ctx.arc(278, 84, 18, Math.PI, 0); ctx.fill();
            ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2.4;
            ctx.beginPath(); ctx.moveTo(278, 84); ctx.lineTo(278 + Math.cos(-Math.PI / 2 + Math.sin(t * 2) * 0.3) * 14, 84 + Math.sin(-Math.PI / 2) * 14); ctx.stroke();

            // Dây nối đầu thu -> Bộ điều khiển -> Con quay
            ctx.strokeStyle = '#10b981'; ctx.lineWidth = 2.4;
            ctx.beginPath(); ctx.moveTo(beamX, 108); ctx.lineTo(beamX, 76); ctx.lineTo(334, 76); ctx.stroke();
            ctx.strokeStyle = '#38bdf8';
            ctx.beginPath(); ctx.moveTo(222, 76); ctx.lineTo(rollX, 76); ctx.lineTo(rollX, sheetY - 43); ctx.stroke();
            arrowLine(rollX, 100, rollX, sheetY - 46, '#38bdf8', 2.4, 7);

            // 4. Thẻ công thức đề dẫn bên phải (Zero Data Leakage)
            roundBox(476, 54, 290, 236, 10, '#0f172a', '#38bdf8', 2);
            ctx.fillStyle = '#38bdf8';
            ctx.font = '800 15.5px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('QUY LUẬT ĐÂM XUYÊN', 494, 82);

            ctx.fillStyle = '#f8fafc';
            ctx.font = '700 14.5px "Segoe UI", system-ui, sans-serif';
            ctx.fillText('• Độ dày chuẩn: d₀ = 4 mm', 494, 116);
            ctx.fillText('• Độ giảm chuẩn: n₀ = 4 lần', 494, 148);
            ctx.fillStyle = '#fde68a';
            ctx.font = '800 16px "Segoe UI", system-ui, sans-serif';
            ctx.fillText('• Độ dày d₁: n₁ = n₀^(d₁/d₀)', 494, 186);
            ctx.fillStyle = '#cbd5e1';
            ctx.font = '700 14.5px "Segoe UI", system-ui, sans-serif';
            ctx.fillText('• Đầu thu ổn định → không', 494, 224);
            ctx.fillText('  điều chỉnh vị trí con lăn', 494, 248);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 78 (MH-STAGING-C4-06 · VLXT-DS-VD28-078): Mô hình phản ứng tổng hợp hạt nhân D + T tạo Helium và neutron
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C4-06', function(ctx, w, h, t) {
            function clearBg() {
                ctx.clearRect(0, 0, w, h);
                const g = ctx.createLinearGradient(0, 0, 0, h);
                g.addColorStop(0, '#060b19');
                g.addColorStop(1, '#0a1226');
                ctx.fillStyle = g;
                ctx.fillRect(0, 0, w, h);
                ctx.save();
                ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
                ctx.lineWidth = 1;
                for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
                for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
                ctx.restore();
            }
            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(x, y, bw, bh, r); else ctx.rect(x, y, bw, bh);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }
            function arrowLine(x1, y1, x2, y2, col, lw = 3, hl = 9) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }
            function drawBall(x, y, isProton) {
                ctx.save();
                ctx.fillStyle = isProton ? '#f8fafc' : '#64748b';
                ctx.strokeStyle = isProton ? '#38bdf8' : '#cbd5e1';
                ctx.lineWidth = 2.4;
                ctx.beginPath(); ctx.arc(x, y, 16, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                ctx.fillStyle = isProton ? '#0f172a' : '#ffffff';
                ctx.font = isProton ? 'italic 800 16px "Segoe UI", system-ui, sans-serif' : '800 16px "Segoe UI", system-ui, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(isProton ? 'p' : 'n', x, y + 1);
                ctx.restore();
            }
            function drawTitle(txt) {
                ctx.save();
                ctx.font = '800 14.5px "Segoe UI", system-ui, sans-serif';
                const tw = Math.min(752, ctx.measureText(txt).width + 24);
                roundBox(14, 10, tw, 30, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
                ctx.fillStyle = '#38bdf8'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                ctx.fillText(txt, 26, 25);
                ctx.restore();
            }

            clearBg();
            drawTitle('SƠ ĐỒ PHẢN ỨNG HẠT NHÂN MINH HỌA (TỎA NĂNG LƯỢNG 17,3 MeV)');

            const saw = (t * 0.25) % 1;
            ctx.save();
            // Khớp 100% ảnh gốc VLXT-DS-VD28-078.png (Zero Data Leakage: chỉ vẽ p, n; không ghi tên phản ứng hay đồng vị)
            roundBox(16, 54, 748, 236, 10, '#0f172a', 'rgba(56, 189, 248, 0.45)', 2);

            const yMid = 148;
            // Hạt 1 (1p + 1n)
            drawBall(74, yMid - 17, true);
            drawBall(74, yMid + 17, false);

            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 22px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('+', 132, yMid);

            // Hạt 2 (1p + 2n)
            drawBall(198, yMid - 15, true);
            drawBall(181, yMid + 16, false);
            drawBall(215, yMid + 16, false);

            // Mũi tên phản ứng kèm xung sáng chạy 1 chiều sawtooth
            arrowLine(262, yMid, 336, yMid, '#fbbf24', 3.4, 10);
            const pulseX = 264 + saw * 66;
            ctx.fillStyle = '#fef08a';
            ctx.beginPath(); ctx.arc(pulseX, yMid, 5, 0, Math.PI * 2); ctx.fill();

            // Sản phẩm 1 (2p + 2n)
            drawBall(384, yMid - 17, true);
            drawBall(418, yMid - 17, true);
            drawBall(384, yMid + 17, false);
            drawBall(418, yMid + 17, false);

            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 22px "Segoe UI", system-ui, sans-serif';
            ctx.fillText('+', 466, yMid);

            // Sản phẩm 2 (1n)
            drawBall(518, yMid, false);

            // Bảng chú thích bên phải giống ảnh gốc
            roundBox(574, 82, 168, 124, 8, '#1e293b', '#38bdf8', 1.8);
            drawBall(604, 118, true);
            drawBall(604, 170, false);
            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 15.5px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('p: proton', 632, 118);
            ctx.fillText('n: neutron', 632, 170);

            // Thanh dữ kiện năng lượng dưới đáy (Zero Data Leakage)
            roundBox(48, 224, 694, 46, 8, '#1e293b', '#fbbf24', 1.8);
            ctx.fillStyle = '#fde68a';
            ctx.font = '800 15.5px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Năng lượng tỏa ra của mỗi phản ứng trên là ΔE = 17,3 MeV', 395, 247);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 79 (MH-STAGING-C4-07 · VLXT-DS-VD28-079): Các định luật bảo toàn và sự biến đổi nguyên tố trong phản ứng hạt nhân
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C4-07', function(ctx, w, h, t) {
            function clearBg() {
                ctx.clearRect(0, 0, w, h);
                const g = ctx.createLinearGradient(0, 0, 0, h);
                g.addColorStop(0, '#060b19');
                g.addColorStop(1, '#0a1226');
                ctx.fillStyle = g;
                ctx.fillRect(0, 0, w, h);
                ctx.save();
                ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
                ctx.lineWidth = 1;
                for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
                for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
                ctx.restore();
            }
            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(x, y, bw, bh, r); else ctx.rect(x, y, bw, bh);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }
            function arrowLine(x1, y1, x2, y2, col, lw = 2.8, hl = 8) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }
            function drawNuclide(A, Z, sym, x, y, opts = {}) {
                const fs = Math.max(16, opts.fontSize || 18);
                const idxSize = Math.max(12.5, Math.round(fs * 0.72));
                const col = opts.color || '#f8fafc';
                const align = opts.align || 'left';
                ctx.save();
                ctx.textBaseline = 'middle';
                ctx.font = `800 ${idxSize}px "Segoe UI", system-ui, sans-serif`;
                const idxW = Math.max(ctx.measureText(String(A)).width, ctx.measureText(String(Z)).width);
                ctx.font = `800 ${fs}px "Segoe UI", system-ui, sans-serif`;
                const symW = ctx.measureText(sym).width;
                const tot = idxW + 2 + symW;
                let sx = x;
                if (align === 'center') sx = x - tot / 2;
                ctx.fillStyle = col;
                ctx.textAlign = 'right';
                ctx.font = `800 ${idxSize}px "Segoe UI", system-ui, sans-serif`;
                ctx.fillText(String(A), sx + idxW, y - Math.round(fs * 0.36));
                ctx.fillText(String(Z), sx + idxW, y + Math.round(fs * 0.38));
                ctx.textAlign = 'left';
                ctx.font = `800 ${fs}px "Segoe UI", system-ui, sans-serif`;
                ctx.fillText(sym, sx + idxW + 2, y);
                ctx.restore();
            }
            function drawCluster(cx, cy, count, r, seed) {
                for (let k = 0; k < count; k++) {
                    const ang = k * 2.39996 + seed;
                    const rad = (r - 5) * Math.sqrt((k + 0.5) / count);
                    ctx.fillStyle = (k % 2 === 0) ? '#ef4444' : '#38bdf8';
                    ctx.beginPath(); ctx.arc(cx + Math.cos(ang) * rad, cy + Math.sin(ang) * rad, 4.4, 0, Math.PI * 2); ctx.fill();
                }
            }
            function drawTitle(txt) {
                ctx.save();
                ctx.font = '800 14.5px "Segoe UI", system-ui, sans-serif';
                const tw = Math.min(752, ctx.measureText(txt).width + 24);
                roundBox(14, 10, tw, 30, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
                ctx.fillStyle = '#38bdf8'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                ctx.fillText(txt, 26, 25);
                ctx.restore();
            }

            clearBg();
            drawTitle('MÔ HÌNH TỔNG QUÁT PHẢN ỨNG HẠT NHÂN TRONG CÔNG NGHIỆP HẠT NHÂN');

            const saw = (t * 0.25) % 1;
            ctx.save();
            // Khung trên: Sơ đồ biến đổi tổng quát A + B -> C + D (Zero Data Leakage)
            roundBox(16, 52, 748, 152, 10, '#0f172a', '#38bdf8', 2);

            const cy = 112;
            const shiftL = saw < 0.5 ? (saw / 0.5) * 18 : 0;
            const shiftR = saw >= 0.5 ? ((saw - 0.5) / 0.5) * 18 : 0;

            // Vế trái: Hạt nhân A + Hạt nhân B
            drawCluster(118 + shiftL, cy, 9, 20, 0.2);
            drawNuclide('A₁', 'Z₁', 'A', 118, cy + 44, { fontSize: 17, color: '#fbbf24', align: 'center' });
            drawCluster(286 - shiftL, cy, 5, 15, 1.4);
            drawNuclide('A₂', 'Z₂', 'B', 286, cy + 44, { fontSize: 17, color: '#38bdf8', align: 'center' });

            // Vế phải: Hạt nhân C + Hạt nhân D
            drawCluster(510 + shiftR, cy - 4, 8, 19, 0.9);
            drawNuclide('A₃', 'Z₃', 'C', 510, cy + 44, { fontSize: 17, color: '#10b981', align: 'center' });
            drawCluster(670 + shiftR, cy + 4, 6, 16, 2.2);
            drawNuclide('A₄', 'Z₄', 'D', 670, cy + 44, { fontSize: 17, color: '#f472b6', align: 'center' });

            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 18px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('+', 202, cy + 44);
            arrowLine(334, cy, 444, cy, '#fbbf24', 3.2, 9);
            const pulseX = 338 + saw * 98;
            ctx.fillStyle = '#fef08a';
            ctx.beginPath(); ctx.arc(pulseX, cy, 5, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#fde68a';
            ctx.font = '800 14.5px "Segoe UI", system-ui, sans-serif';
            ctx.fillText('Tương tác hạt nhân', 389, cy - 22);
            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 18px "Segoe UI", system-ui, sans-serif';
            ctx.fillText('+', 594, cy + 44);

            // Khung dưới: So sánh đối chiếu trực quan 2 cấp độ cấu trúc (không lộ kết luận đáp án)
            roundBox(16, 218, 366, 72, 10, '#1e293b', '#fbbf24', 1.8);
            ctx.fillStyle = '#fbbf24';
            ctx.font = '800 15px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('PHẢN ỨNG HẠT NHÂN', 34, 242);
            ctx.fillStyle = '#f8fafc';
            ctx.font = '700 14.5px "Segoe UI", system-ui, sans-serif';
            ctx.fillText('Xảy ra ở tâm hạt nhân (p, n)', 34, 268);

            roundBox(398, 218, 366, 72, 10, '#1e293b', '#10b981', 1.8);
            ctx.fillStyle = '#6ee7b7';
            ctx.font = '800 15px "Segoe UI", system-ui, sans-serif';
            ctx.fillText('PHẢN ỨNG HÓA HỌC', 416, 242);
            ctx.fillStyle = '#f8fafc';
            ctx.font = '700 14.5px "Segoe UI", system-ui, sans-serif';
            ctx.fillText('Tái tổ hợp lớp vỏ electron', 416, 268);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 80 (MH-STAGING-C4-08 · VLXT-DS-VD28-080): Thí nghiệm tách tia phóng xạ alpha, beta, gamma trong điện trường đều qua tờ giấy G tới màn huỳnh quang F
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C4-08', function(ctx, w, h, t) {
            function clearBg() {
                ctx.clearRect(0, 0, w, h);
                const g = ctx.createLinearGradient(0, 0, 0, h);
                g.addColorStop(0, '#060b19');
                g.addColorStop(1, '#0a1226');
                ctx.fillStyle = g;
                ctx.fillRect(0, 0, w, h);
                ctx.save();
                ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
                ctx.lineWidth = 1;
                for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
                for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
                ctx.restore();
            }
            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(x, y, bw, bh, r); else ctx.rect(x, y, bw, bh);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }
            function drawTitle(txt) {
                ctx.save();
                ctx.font = '800 14.5px "Segoe UI", system-ui, sans-serif';
                const tw = Math.min(752, ctx.measureText(txt).width + 24);
                roundBox(14, 10, tw, 30, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
                ctx.fillStyle = '#38bdf8'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                ctx.fillText(txt, 26, 25);
                ctx.restore();
            }

            clearBg();
            drawTitle('CHÙM TIA PHÓNG XẠ TRONG ĐIỆN TRƯỜNG ĐỀU (CHÂN KHÔNG)');

            const saw = (t * 0.28) % 1;
            ctx.save();
            // Khớp 100% bố cục ảnh gốc VLXT-DS-VD28-080.png (Zero Data Leakage: không gắn tên tia lên T, S, Q)
            // Hai bản kim loại phẳng song song: trên (+), dưới (-)
            roundBox(26, 52, 464, 24, 4, 'rgba(239, 68, 68, 0.22)', '#ef4444', 2.2);
            roundBox(26, 260, 464, 24, 4, 'rgba(59, 130, 246, 0.22)', '#3b82f6', 2.2);
            ctx.fillStyle = '#fca5a5';
            ctx.font = '800 16px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('+   +   +   +   +   +   +   +   +', 258, 64);
            ctx.fillStyle = '#93c5fd';
            ctx.fillText('–   –   –   –   –   –   –   –   –', 258, 272);

            // Khối Chì chứa mẫu phóng xạ N bên trái (hở khe bên phải)
            const bx = 42, by = 122, bw = 154, bh = 94;
            ctx.fillStyle = '#334155';
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 2.6;
            ctx.beginPath();
            ctx.moveTo(bx, by); ctx.lineTo(bx + bw, by); ctx.lineTo(bx + bw, by + 38);
            ctx.lineTo(bx + 106, by + 38); ctx.lineTo(bx + 106, by + 26); ctx.lineTo(bx + 42, by + 26);
            ctx.lineTo(bx + 42, by + bh - 26); ctx.lineTo(bx + 106, by + bh - 26);
            ctx.lineTo(bx + 106, by + bh - 38); ctx.lineTo(bx + bw, by + bh - 38);
            ctx.lineTo(bx + bw, by + bh); ctx.lineTo(bx, by + bh);
            ctx.closePath();
            ctx.fill(); ctx.stroke();

            // Mẫu phóng xạ N nằm trong hốc chì
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath(); ctx.arc(bx + 74, by + bh / 2, 12, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 16px "Segoe UI", system-ui, sans-serif';
            ctx.fillText('Chì', bx + 22, by + 16);
            ctx.fillText('N', bx + 74, by + bh + 18);

            // Tờ giấy G nét đứt đứng giữa bản dương và bản âm
            const gx = 294;
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 3.2;
            ctx.setLineDash([9, 7]);
            ctx.beginPath(); ctx.moveTo(gx, 78); ctx.lineTo(gx, 258); ctx.stroke();
            ctx.setLineDash([]);
            roundBox(gx - 34, 86, 68, 26, 5, '#0f172a', '#94a3b8', 1.6);
            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 14.5px "Segoe UI", system-ui, sans-serif';
            ctx.fillText('Giấy G', gx, 99);

            // Màn huỳnh quang F bên phải với 3 chấm sáng T, S, Q
            const fx = 436, yS = by + bh / 2, yT = 92, yQ = 240;
            ctx.strokeStyle = '#6ee7b7';
            ctx.lineWidth = 3.2;
            ctx.beginPath(); ctx.moveTo(fx, 78); ctx.lineTo(fx, 258); ctx.stroke();
            ctx.fillStyle = '#6ee7b7';
            ctx.font = '800 16px "Segoe UI", system-ui, sans-serif';
            ctx.fillText('Màn F', fx + 30, 128);

            // Đường quỹ đạo từ khe N -> T, S, Q
            ctx.strokeStyle = 'rgba(248, 250, 252, 0.45)';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 4]);
            ctx.beginPath(); ctx.moveTo(bx + bw, yS); ctx.lineTo(fx, yS); ctx.stroke();
            ctx.setLineDash([]);

            ctx.strokeStyle = 'rgba(251, 191, 36, 0.65)';
            ctx.lineWidth = 2.4;
            ctx.beginPath(); ctx.moveTo(bx + bw, yS); ctx.quadraticCurveTo(320, yS, fx, yT); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(bx + bw, yS); ctx.quadraticCurveTo(320, yS, fx, yQ); ctx.stroke();

            // Hạt chuyển động 1 chiều sawtooth trên 3 nhánh
            const u = saw;
            const pxS = (bx + bw) + u * (fx - bx - bw);
            const pxT = (1 - u) * (1 - u) * (bx + bw) + 2 * (1 - u) * u * 320 + u * u * fx;
            const pxQ = pxT;
            const pyT = (1 - u) * (1 - u) * yS + 2 * (1 - u) * u * yS + u * u * yT;
            const pyQ = (1 - u) * (1 - u) * yS + 2 * (1 - u) * u * yS + u * u * yQ;

            [[pxS, yS, '#a855f7'], [pxT, pyT, '#38bdf8'], [pxQ, pyQ, '#fbbf24']].forEach(([px, py, col]) => {
                ctx.fillStyle = col;
                ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fill();
            });

            // 3 chấm sáng T, S, Q trên màn F
            [[yT, 'T'], [yS, 'S'], [yQ, 'Q']].forEach(([py, lbl]) => {
                ctx.fillStyle = '#fef08a';
                ctx.beginPath(); ctx.arc(fx, py, 5.5, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#f8fafc';
                ctx.font = '800 16px "Segoe UI", system-ui, sans-serif';
                ctx.fillText(lbl, fx + 18, py);
            });

            // Bảng ký hiệu đề bài bên phải (Zero Data Leakage)
            roundBox(510, 52, 256, 232, 10, '#0f172a', '#38bdf8', 2);
            ctx.fillStyle = '#38bdf8';
            ctx.font = '800 15.5px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('THÀNH PHẦN THÍ NGHIỆM', 526, 80);

            ctx.fillStyle = '#f8fafc';
            ctx.font = '700 14.5px "Segoe UI", system-ui, sans-serif';
            ctx.fillText('• N: Mẫu phóng xạ trong chì', 526, 114);
            ctx.fillText('• Hai bản phẳng tích điện', 526, 144);
            ctx.fillText('  trái dấu (điện trường đều)', 526, 168);
            ctx.fillText('• G: Tờ giấy đặt chắn ngang', 526, 200);
            ctx.fillText('• F: Màn huỳnh quang (T,S,Q)', 526, 232);
            ctx.fillStyle = '#6ee7b7';
            ctx.fillText('• Môi trường: Chân không', 526, 264);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 81 (MH-STAGING-C4-09 · VLXT-DS-VD28-081): Phản ứng phân hạch dây chuyền của Uranium-235 tạo Y-95 và I-138
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C4-09', function(ctx, w, h, t) {
            function clearBg() {
                ctx.clearRect(0, 0, w, h);
                const g = ctx.createLinearGradient(0, 0, 0, h);
                g.addColorStop(0, '#060b19');
                g.addColorStop(1, '#0a1226');
                ctx.fillStyle = g;
                ctx.fillRect(0, 0, w, h);
                ctx.save();
                ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
                ctx.lineWidth = 1;
                for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
                for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
                ctx.restore();
            }
            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(x, y, bw, bh, r); else ctx.rect(x, y, bw, bh);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }
            function arrowLine(x1, y1, x2, y2, col, lw = 2.6, hl = 8) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }
            function drawNuclide(A, Z, sym, x, y, opts = {}) {
                const fs = Math.max(16, opts.fontSize || 16);
                const idxSize = Math.max(12.5, Math.round(fs * 0.78));
                const col = opts.color || '#f8fafc';
                const align = opts.align || 'left';
                ctx.save();
                ctx.textBaseline = 'middle';
                ctx.font = `800 ${idxSize}px "Segoe UI", system-ui, sans-serif`;
                const idxW = Math.max(ctx.measureText(String(A)).width, ctx.measureText(String(Z)).width);
                ctx.font = `800 ${fs}px "Segoe UI", system-ui, sans-serif`;
                const symW = ctx.measureText(sym).width;
                const tot = idxW + 2 + symW;
                let sx = x;
                if (align === 'center') sx = x - tot / 2;
                ctx.fillStyle = col;
                ctx.textAlign = 'right';
                ctx.font = `800 ${idxSize}px "Segoe UI", system-ui, sans-serif`;
                ctx.fillText(String(A), sx + idxW, y - Math.round(fs * 0.36));
                ctx.fillText(String(Z), sx + idxW, y + Math.round(fs * 0.38));
                ctx.textAlign = 'left';
                ctx.font = `800 ${fs}px "Segoe UI", system-ui, sans-serif`;
                ctx.fillText(sym, sx + idxW + 2, y);
                ctx.restore();
            }
            function drawTitle(txt) {
                ctx.save();
                ctx.font = '800 14.5px "Segoe UI", system-ui, sans-serif';
                const tw = Math.min(752, ctx.measureText(txt).width + 24);
                roundBox(14, 10, tw, 30, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
                ctx.fillStyle = '#38bdf8'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                ctx.fillText(txt, 26, 25);
                ctx.restore();
            }

            clearBg();
            drawTitle('PHẢN ỨNG PHÂN HẠCH DÂY CHUYỀN URANIUM-235 TẠO Y-95 & I-138');

            const saw = (t * 0.28) % 1;
            ctx.save();
            roundBox(16, 54, 424, 236, 10, '#0f172a', '#fbbf24', 2);

            const uy = 168;
            // Vế trái cố định: n + U-235
            const nx = 46 + (saw < 0.5 ? (saw / 0.5) * 44 : 0);
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath(); ctx.arc(nx, uy, 8, 0, Math.PI * 2); ctx.fill();
            drawNuclide('1', '0', 'n', nx, uy - 26, { fontSize: 16, color: '#38bdf8', align: 'center' });

            ctx.fillStyle = 'rgba(245, 158, 11, 0.35)';
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 3;
            ctx.beginPath(); ctx.arc(136, uy, 28, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            drawNuclide('235', '92', 'U', 136, uy, { fontSize: 16, color: '#ffffff', align: 'center' });

            // Mũi tên phân hạch ở giữa
            arrowLine(176, uy, 232, uy, '#fbbf24', 3, 8);

            // Vế phải: Y-95 (trên), I-138 (dưới), và k neutron mới (giữa bên phải, không chạm vòng tròn)
            const pOut = saw >= 0.45 ? ((saw - 0.45) / 0.55) : 0;
            const yx = 286 + pOut * 18, yy = 104;
            const ix = 286 + pOut * 18, iy = 232;

            ctx.fillStyle = 'rgba(16, 185, 129, 0.32)';
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 2.4;
            ctx.beginPath(); ctx.arc(yx, yy, 24, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            drawNuclide('95', '39', 'Y', yx, yy, { fontSize: 16, color: '#ffffff', align: 'center' });

            ctx.fillStyle = 'rgba(56, 189, 248, 0.32)';
            ctx.strokeStyle = '#38bdf8';
            ctx.beginPath(); ctx.arc(ix, iy, 26, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            drawNuclide('138', '53', 'I', ix, iy, { fontSize: 16, color: '#ffffff', align: 'center' });

            // Nhãn & mũi tên k neutron mới nằm gọn ở khoảng trống giữa Y và I
            arrowLine(246, uy, 338 + pOut * 84, uy, '#fbbf24', 2.4, 7);
            roundBox(262, uy - 34, 152, 26, 6, '#0f172a', '#fbbf24', 1.6);
            ctx.fillStyle = '#fde68a';
            ctx.font = '800 14.5px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('k neutron mới', 338, uy - 21);

            // Thẻ dữ kiện đề bài bên phải (Zero Data Leakage)
            roundBox(456, 54, 310, 236, 10, '#0f172a', '#38bdf8', 2);
            ctx.fillStyle = '#38bdf8';
            ctx.font = '800 15.5px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText('THÔNG SỐ ĐỀ BÀI', 474, 82);

            ctx.fillStyle = '#f8fafc';
            ctx.font = '700 14.5px "Segoe UI", system-ui, sans-serif';
            ctx.fillText('• Hạt nhân bia: ²³⁵₉₂U + ¹₀n', 474, 118);
            ctx.fillText('• Sản phẩm: ⁹⁵₃₉Y + ¹³⁸₅₃I + k·¹₀n', 474, 150);
            ctx.fillText('• Độ hụt khối: Δm = 0,181 amu', 474, 184);
            ctx.fillText('• 1 amu = 931,5 MeV/c²', 474, 216);
            ctx.fillStyle = '#fbbf24';
            ctx.fillText('• Số hạt kích thích đầu: 10¹⁰', 474, 250);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 82 (MH-STAGING-C4-10 · VLXT-DS-VD28-082): Lịch trình chiếu xạ tia gamma điều trị ung thư theo chu kỳ 1 tháng (T = 4 tháng)
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C4-10', function(ctx, w, h, t) {
            function clearBg() {
                ctx.clearRect(0, 0, w, h);
                const g = ctx.createLinearGradient(0, 0, 0, h);
                g.addColorStop(0, '#060b19');
                g.addColorStop(1, '#0a1226');
                ctx.fillStyle = g;
                ctx.fillRect(0, 0, w, h);
                ctx.save();
                ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
                ctx.lineWidth = 1;
                for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
                for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
                ctx.restore();
            }
            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(x, y, bw, bh, r); else ctx.rect(x, y, bw, bh);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }
            function arrowLine(x1, y1, x2, y2, col, lw = 2.6, hl = 8) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }
            function drawGammaRay(x1, y1, x2, y2, col) {
                const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy);
                if (len < 12) return;
                const ang = Math.atan2(dy, dx);
                ctx.save();
                ctx.translate(x1, y1);
                ctx.rotate(ang);
                ctx.strokeStyle = col; ctx.lineWidth = 2.4;
                ctx.beginPath(); ctx.moveTo(0, 0);
                const bodyLen = len - 9, waves = Math.max(2, Math.floor(len / 14));
                for (let i = 0; i <= waves * 4; i++) {
                    ctx.lineTo((i / (waves * 4)) * bodyLen, Math.sin((i / 4) * Math.PI * 2) * 4);
                }
                ctx.lineTo(len, 0); ctx.stroke();
                ctx.fillStyle = col;
                ctx.beginPath(); ctx.moveTo(len, 0); ctx.lineTo(len - 8, -4); ctx.lineTo(len - 8, 4); ctx.closePath(); ctx.fill();
                ctx.restore();
            }
            function drawTitle(txt) {
                ctx.save();
                ctx.font = '800 14.5px "Segoe UI", system-ui, sans-serif';
                const tw = Math.min(752, ctx.measureText(txt).width + 24);
                roundBox(14, 10, tw, 30, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
                ctx.fillStyle = '#38bdf8'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                ctx.fillText(txt, 26, 25);
                ctx.restore();
            }

            clearBg();
            drawTitle('XẠ TRỊ BẰNG NGUỒN PHÓNG XẠ TIA GAMMA (T = 4 THÁNG)');

            const saw = (t * 0.25) % 1;
            ctx.save();
            // Bên trái: Đầu chiếu xạ phát tia gamma tới khối mô bệnh lý
            roundBox(16, 54, 332, 236, 10, '#0f172a', '#a855f7', 2);
            roundBox(38, 104, 72, 108, 8, '#1e293b', '#94a3b8', 2.4);
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath(); ctx.arc(74, 158, 16, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 14.5px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Nguồn γ', 74, 230);

            // Mô bệnh nhân bên phải
            const tumX = 278, tumY = 158;
            ctx.fillStyle = 'rgba(244, 114, 182, 0.16)';
            ctx.strokeStyle = '#f472b6';
            ctx.lineWidth = 2.2;
            ctx.beginPath(); ctx.ellipse(tumX, tumY, 44, 68, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.fillStyle = 'rgba(239, 68, 68, 0.35)';
            ctx.strokeStyle = '#ef4444';
            ctx.beginPath(); ctx.arc(tumX, tumY, 18, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#fca5a5';
            ctx.fillText('Tế bào bệnh', tumX, 244);

            // Chùm tia gamma bay 1 chiều sawtooth từ nguồn -> khối u
            [-22, 0, 22].forEach(dy => {
                const xEnd = 114 + saw * (tumX - 114);
                drawGammaRay(112, 158 + dy, xEnd, 158 + dy * 0.4, '#a855f7');
            });

            // Bên phải: Đồ thị suy giảm độ phóng xạ nguồn theo tháng & mốc 4 lần chiếu
            roundBox(366, 54, 400, 236, 10, '#0f172a', '#38bdf8', 2);
            const ox = 434, oy = 242, gx = 304, gy = 148;
            arrowLine(ox, oy + 4, ox, oy - gy, '#f1f5f9', 2.6, 8);
            arrowLine(ox - 4, oy, ox + gx, oy, '#f1f5f9', 2.6, 8);

            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 14.5px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('H(t)', ox + 8, oy - gy + 6);
            ctx.textAlign = 'center';
            ctx.fillText('t (tháng)', ox + gx - 34, oy + 24);
            ctx.textAlign = 'right';
            ctx.fillText('H₀', ox - 8, oy - 122);
            ctx.fillText('H₀/2', ox - 8, oy - 61);
            ctx.fillText('O', ox - 8, oy + 20);

            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 3.2;
            ctx.beginPath();
            for (let u = 0; u <= 1; u += 0.025) {
                const px = ox + u * 256;
                const py = oy - 122 * Math.pow(0.5, u * 1.15);
                if (u === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            ctx.stroke();

            // Các mốc lần 1 (0), lần 2 (1), lần 3 (2), lần 4 (3), T = 4 tháng
            [0, 1, 2, 3, 4].forEach(m => {
                const mx = ox + (m / 4.6) * 256;
                const my = oy - 122 * Math.pow(0.5, m / 4);
                ctx.fillStyle = m === 0 ? '#10b981' : (m === 3 ? '#ef4444' : '#38bdf8');
                ctx.beginPath(); ctx.arc(mx, my, 4.5, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#cbd5e1';
                ctx.font = '800 14.5px "Segoe UI", system-ui, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(String(m), mx, oy + 20);
            });

            // Thẻ thông tin lần đầu (Zero Data Leakage: không lộ 33,6 phút)
            roundBox(554, 72, 198, 60, 7, '#1e293b', '#10b981', 1.6);
            ctx.fillStyle = '#6ee7b7';
            ctx.font = '800 14.5px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('Lần 1 (t=0): 20 phút', 566, 92);
            ctx.fillStyle = '#fde68a';
            ctx.fillText('Chu kỳ tái: 1 tháng', 566, 116);

            const dotX = ox + saw * (3 / 4.6) * 256;
            const dotY = oy - 122 * Math.pow(0.5, (saw * 3) / 4);
            ctx.fillStyle = '#ef4444';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(dotX, dotY, 6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.restore();
        });

    // =========================================================================
    // CÂU 83 (MH-STAGING-C4-11 · VLXT-DS-VD28-083): Theo dõi dòng chảy nước ngầm bằng đồng vị đánh dấu Tritium (³₁H)
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C4-11', function(ctx, w, h, t) {
            function clearBg() {
                ctx.clearRect(0, 0, w, h);
                const g = ctx.createLinearGradient(0, 0, 0, h);
                g.addColorStop(0, '#060b19');
                g.addColorStop(1, '#0a1226');
                ctx.fillStyle = g;
                ctx.fillRect(0, 0, w, h);
                ctx.save();
                ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
                ctx.lineWidth = 1;
                for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
                for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
                ctx.restore();
            }
            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(x, y, bw, bh, r); else ctx.rect(x, y, bw, bh);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }
            function arrowLine(x1, y1, x2, y2, col, lw = 2.6, hl = 8) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }
            function drawTitle(txt) {
                ctx.save();
                ctx.font = '800 14.5px "Segoe UI", system-ui, sans-serif';
                const tw = Math.min(752, ctx.measureText(txt).width + 24);
                roundBox(14, 10, tw, 30, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
                ctx.fillStyle = '#38bdf8'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                ctx.fillText(txt, 26, 25);
                ctx.restore();
            }

            clearBg();
            drawTitle('THEO DÕI DÒNG CHẢY NƯỚC NGẦM BẰNG ĐỒNG VỊ TRITIUM (³H)');

            const saw = (t * 0.22) % 1;
            ctx.save();
            // Khớp ảnh gốc VLXT-DS-VD28-083.png: Mặt đất, Sông, Giếng A, Tầng nước ngầm, Điểm lấy mẫu M (600 m)
            // Mặt cỏ trên
            ctx.fillStyle = 'rgba(16, 185, 129, 0.28)';
            ctx.fillRect(16, 104, 464, 18);
            // Sông bên trái
            ctx.fillStyle = '#0284c7';
            ctx.beginPath(); ctx.ellipse(74, 114, 42, 14, 0, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#e0f2fe';
            ctx.font = '800 14.5px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Sông', 74, 88);

            // Lớp đất phía trên và dưới tầng nước ngầm
            ctx.fillStyle = 'rgba(146, 64, 14, 0.42)';
            ctx.fillRect(16, 122, 464, 62);
            ctx.fillRect(16, 236, 464, 48);

            // Tầng mạch nước ngầm chảy từ trái sang phải
            ctx.fillStyle = 'rgba(14, 165, 233, 0.35)';
            ctx.fillRect(16, 184, 464, 52);
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(16, 184); ctx.lineTo(480, 184); ctx.moveTo(16, 236); ctx.lineTo(480, 236); ctx.stroke();

            // Giếng thử nghiệm tại A và giếng lấy mẫu tại M
            const ax = 186, mx = 426;
            roundBox(ax - 12, 86, 24, 112, 3, '#1e293b', '#e2e8f0', 2.2);
            roundBox(mx - 12, 86, 24, 112, 3, '#1e293b', '#10b981', 2.2);
            ctx.fillStyle = '#fbbf24';
            ctx.font = '800 15.5px "Segoe UI", system-ui, sans-serif';
            ctx.fillText('Giếng A', ax, 68);
            ctx.fillStyle = '#6ee7b7';
            ctx.fillText('Điểm M', mx, 68);

            // Dòng hạt đánh dấu Tritium 3H trôi 1 chiều sawtooth từ A -> M trong tầng nước ngầm
            for (let k = 0; k < 4; k++) {
                const p = (saw + k * 0.25) % 1;
                const px = ax + p * (mx - ax);
                const py = 210 + Math.sin(k * 2.1) * 10;
                ctx.fillStyle = '#fef08a';
                ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fill();
            }
            arrowLine(ax + 18, 210, mx - 18, 210, '#7dd3fc', 2.4, 7);

            // Đoạn khoảng cách s = 600 m giữa A và M
            arrowLine(ax, 256, mx, 256, '#fbbf24', 2.2, 7);
            arrowLine(mx, 256, ax, 256, '#fbbf24', 2.2, 7);
            roundBox((ax + mx) / 2 - 44, 243, 88, 26, 6, '#0f172a', '#fbbf24', 1.6);
            ctx.fillStyle = '#fde68a';
            ctx.font = '800 14.5px "Segoe UI", system-ui, sans-serif';
            ctx.fillText('600 m', (ax + mx) / 2, 256);

            // Thẻ thông số đề dẫn bên phải (Zero Data Leakage)
            roundBox(496, 54, 270, 230, 10, '#0f172a', '#38bdf8', 2);
            ctx.fillStyle = '#38bdf8';
            ctx.font = '800 15.5px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('DỮ KIỆN ĐỒNG VỊ ³H', 514, 82);

            ctx.fillStyle = '#f8fafc';
            ctx.font = '700 14.5px "Segoe UI", system-ui, sans-serif';
            ctx.fillText('• Chất đánh dấu: Tritium (³H)', 514, 118);
            ctx.fillText('• Bức xạ phát ra: Tia beta yếu', 514, 150);
            ctx.fillText('• Chu kỳ bán rã: T = 12,3 năm', 514, 182);
            ctx.fillText('• Bơm tại A: m₀ = 2,00 mg', 514, 214);
            ctx.fillStyle = '#6ee7b7';
            ctx.fillText('• Khoảng cách AM = 600 m', 514, 246);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 84 (MH-STAGING-C4-12 · VLXT-DS-VD28-084): Phân rã beta trừ của 15,0 g Cobalt-60 tạo hạt nhân bền Nickel-60
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C4-12', function(ctx, w, h, t) {
            function clearBg() {
                ctx.clearRect(0, 0, w, h);
                const g = ctx.createLinearGradient(0, 0, 0, h);
                g.addColorStop(0, '#060b19');
                g.addColorStop(1, '#0a1226');
                ctx.fillStyle = g;
                ctx.fillRect(0, 0, w, h);
                ctx.save();
                ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
                ctx.lineWidth = 1;
                for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
                for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
                ctx.restore();
            }
            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(x, y, bw, bh, r); else ctx.rect(x, y, bw, bh);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }
            function arrowLine(x1, y1, x2, y2, col, lw = 2.6, hl = 8) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }
            function drawNuclide(A, Z, sym, x, y, opts = {}) {
                const fs = Math.max(16, opts.fontSize || 18);
                const idxSize = Math.max(12.5, Math.round(fs * 0.72));
                const col = opts.color || '#f8fafc';
                ctx.save();
                ctx.textBaseline = 'middle';
                ctx.font = `800 ${idxSize}px "Segoe UI", system-ui, sans-serif`;
                const idxW = Math.max(ctx.measureText(String(A)).width, ctx.measureText(String(Z)).width);
                ctx.fillStyle = col;
                ctx.textAlign = 'right';
                ctx.fillText(String(A), x + idxW, y - Math.round(fs * 0.36));
                ctx.fillText(String(Z), x + idxW, y + Math.round(fs * 0.38));
                ctx.textAlign = 'left';
                ctx.font = `800 ${fs}px "Segoe UI", system-ui, sans-serif`;
                ctx.fillText(sym, x + idxW + 2, y);
                ctx.restore();
            }
            function drawTitle(txt) {
                ctx.save();
                ctx.font = '800 14.5px "Segoe UI", system-ui, sans-serif';
                const tw = Math.min(752, ctx.measureText(txt).width + 24);
                roundBox(14, 10, tw, 30, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
                ctx.fillStyle = '#38bdf8'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                ctx.fillText(txt, 26, 25);
                ctx.restore();
            }

            clearBg();
            drawTitle('PHÂN RÃ MẪU COBALT-60 (m₀ = 15,0 g; T = 5,27 năm) TẠO NICKEL-60');

            const saw = (t * 0.22) % 1;
            ctx.save();
            // Bên trái: Mẫu kim loại 15,0 g biến đổi dần tỉ lệ mẹ Co-60 -> con Ni-60 (Zero Data Leakage: không ghi tia beta-)
            roundBox(16, 54, 302, 236, 10, '#0f172a', '#fbbf24', 2);
            drawNuclide('60', '27', 'Co', 56, 86, { fontSize: 18, color: '#fbbf24' });
            arrowLine(126, 86, 178, 86, '#38bdf8', 2.8, 8);
            drawNuclide('60', '28', 'Ni', 194, 86, { fontSize: 18, color: '#6ee7b7' });
            ctx.fillStyle = '#cbd5e1';
            ctx.font = '800 14.5px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText('+ Tia ?', 252, 86);

            // Thanh khối lượng chia tỷ lệ Co còn lại & Ni tạo thành (m0 = 15,0 g)
            const fracCo = Math.pow(0.5, saw * 2.0);
            const barX = 42, barY = 136, barW = 248, barH = 44;
            roundBox(barX, barY, barW, barH, 6, '#1e293b', '#94a3b8', 2);
            ctx.fillStyle = '#f59e0b';
            ctx.fillRect(barX + 2, barY + 2, Math.max(0, (barW - 4) * fracCo), barH - 4);
            ctx.fillStyle = '#10b981';
            ctx.fillRect(barX + 2 + (barW - 4) * fracCo, barY + 2, (barW - 4) * (1 - fracCo), barH - 4);

            ctx.fillStyle = '#fde68a';
            ctx.font = '800 14.5px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('Co-60 còn lại', 42, 206);
            ctx.fillStyle = '#6ee7b7';
            ctx.textAlign = 'right';
            ctx.fillText('Ni-60 tạo thành', 290, 206);

            ctx.fillStyle = '#f8fafc';
            ctx.textAlign = 'center';
            ctx.fillText('Tổng m₀ = 15,0 g · T = 5,27 năm', 167, 252);

            // Bên phải: Đồ thị khối lượng m_Co(t) giảm & m_Ni(t) tăng giao nhau tại T = 5,27 năm
            roundBox(334, 54, 432, 236, 10, '#0f172a', '#38bdf8', 2);
            const ox = 406, oy = 244, gx = 326, gy = 148;
            arrowLine(ox, oy + 4, ox, oy - gy, '#f1f5f9', 2.6, 8);
            arrowLine(ox - 4, oy, ox + gx, oy, '#f1f5f9', 2.6, 8);

            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 14.5px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('m (g)', ox + 8, oy - gy + 6);
            ctx.textAlign = 'center';
            ctx.fillText('t (năm)', ox + gx - 28, oy + 22);
            ctx.textAlign = 'right';
            ctx.fillText('15,0', ox - 8, oy - 120);
            ctx.fillText('7,5', ox - 8, oy - 60);
            ctx.fillText('O', ox - 8, oy + 20);

            // Đường cong m_Co(t)
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 3;
            ctx.beginPath();
            for (let u = 0; u <= 1; u += 0.025) {
                const px = ox + u * 276;
                const py = oy - 120 * Math.pow(0.5, u * 2.0);
                if (u === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            ctx.stroke();

            // Đường cong m_Ni(t)
            ctx.strokeStyle = '#10b981';
            ctx.beginPath();
            for (let u = 0; u <= 1; u += 0.025) {
                const px = ox + u * 276;
                const py = oy - 120 * (1 - Math.pow(0.5, u * 2.0));
                if (u === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            ctx.stroke();

            const xT = ox + 138;
            ctx.strokeStyle = '#64748b';
            ctx.setLineDash([5, 4]);
            ctx.lineWidth = 1.6;
            ctx.beginPath(); ctx.moveTo(ox, oy - 60); ctx.lineTo(xT, oy - 60); ctx.lineTo(xT, oy); ctx.stroke();
            ctx.setLineDash([]);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'center';
            ctx.fillText('T = 5,27', xT, oy + 22);

            const dotX = ox + saw * 276;
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath(); ctx.arc(dotX, oy - 120 * fracCo, 5.5, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#10b981';
            ctx.beginPath(); ctx.arc(dotX, oy - 120 * (1 - fracCo), 5.5, 0, Math.PI * 2); ctx.fill();
            ctx.restore();
        });

    // =========================================================================
    // CÂU 85 (MH-STAGING-C4-13 · VLXT-DS-VD28-085): Phản ứng hạt nhân dùng proton bắn phá Lithium-7 tạo hai hạt nhân X
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C4-13', function(ctx, w, h, t) {
            function clearBg() {
                ctx.clearRect(0, 0, w, h);
                const g = ctx.createLinearGradient(0, 0, 0, h);
                g.addColorStop(0, '#060b19');
                g.addColorStop(1, '#0a1226');
                ctx.fillStyle = g;
                ctx.fillRect(0, 0, w, h);
                ctx.save();
                ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
                ctx.lineWidth = 1;
                for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
                for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
                ctx.restore();
            }
            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(x, y, bw, bh, r); else ctx.rect(x, y, bw, bh);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }
            function arrowLine(x1, y1, x2, y2, col, lw = 2.6, hl = 8) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }
            function drawNuclide(A, Z, sym, x, y, opts = {}) {
                const fs = Math.max(16, opts.fontSize || 17);
                const idxSize = Math.max(12.5, Math.round(fs * 0.72));
                const col = opts.color || '#f8fafc';
                const align = opts.align || 'left';
                ctx.save();
                ctx.textBaseline = 'middle';
                ctx.font = `800 ${idxSize}px "Segoe UI", system-ui, sans-serif`;
                const idxW = Math.max(ctx.measureText(String(A)).width, ctx.measureText(String(Z)).width);
                ctx.font = `800 ${fs}px "Segoe UI", system-ui, sans-serif`;
                const symW = ctx.measureText(sym).width;
                const tot = idxW + 2 + symW;
                let sx = x;
                if (align === 'center') sx = x - tot / 2;
                ctx.fillStyle = col;
                ctx.textAlign = 'right';
                ctx.font = `800 ${idxSize}px "Segoe UI", system-ui, sans-serif`;
                ctx.fillText(String(A), sx + idxW, y - Math.round(fs * 0.36));
                ctx.fillText(String(Z), sx + idxW, y + Math.round(fs * 0.38));
                ctx.textAlign = 'left';
                ctx.font = `800 ${fs}px "Segoe UI", system-ui, sans-serif`;
                ctx.fillText(sym, sx + idxW + 2, y);
                ctx.restore();
            }
            function drawTitle(txt) {
                ctx.save();
                ctx.font = '800 14.5px "Segoe UI", system-ui, sans-serif';
                const tw = Math.min(752, ctx.measureText(txt).width + 24);
                roundBox(14, 10, tw, 30, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
                ctx.fillStyle = '#38bdf8'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                ctx.fillText(txt, 26, 25);
                ctx.restore();
            }

            clearBg();
            drawTitle('PHẢN ỨNG PROTON BẮN PHÁ HẠT NHÂN LITHIUM-7 ĐỨNG YÊN: ¹₁p + ⁷₃Li → 2X');

            const saw = (t * 0.28) % 1;
            ctx.save();
            roundBox(16, 54, 412, 236, 10, '#0f172a', '#fbbf24', 2);

            const cy = 166;
            // Vế trái cố định & chuyển động 1 chiều sawtooth: Proton 1_1 p -> Li-7
            const pIn = saw < 0.5 ? (saw / 0.5) : 0;
            const px = 48 + pIn * 44;
            ctx.fillStyle = '#ef4444';
            ctx.beginPath(); ctx.arc(px, cy, 9, 0, Math.PI * 2); ctx.fill();
            drawNuclide('1', '1', 'p', px, cy - 26, { fontSize: 16, color: '#fca5a5', align: 'center' });

            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 18px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('+', 106, cy);

            // Hạt nhân Li-7 đứng yên (3p + 4n)
            const lix = 160;
            for (let k = 0; k < 7; k++) {
                const ang = k * 2.39996;
                const rad = 14 * Math.sqrt((k + 0.5) / 7);
                ctx.fillStyle = k < 3 ? '#ef4444' : '#38bdf8';
                ctx.beginPath(); ctx.arc(lix + Math.cos(ang) * rad, cy + Math.sin(ang) * rad, 5.4, 0, Math.PI * 2); ctx.fill();
            }
            drawNuclide('7', '3', 'Li', lix, cy + 38, { fontSize: 17, color: '#fbbf24', align: 'center' });

            // Mũi tên phản ứng ở giữa kèm xung chạy sawtooth
            arrowLine(196, cy, 268, cy, '#fbbf24', 3, 8);
            ctx.fillStyle = '#fef08a';
            ctx.beginPath(); ctx.arc(200 + saw * 62, cy, 4.5, 0, Math.PI * 2); ctx.fill();

            // Vế phải: Tạo 2 hạt nhân X đối xứng (Zero Data Leakage: không lộ He-4)
            const pOut = saw >= 0.48 ? ((saw - 0.48) / 0.52) : 0;
            const xOff = 336 + pOut * 28;
            [[xOff, cy - 42 - pOut * 16], [xOff, cy + 42 + pOut * 16]].forEach(([hx, hy]) => {
                ctx.fillStyle = 'rgba(16, 185, 129, 0.28)';
                ctx.strokeStyle = '#10b981';
                ctx.lineWidth = 2.6;
                ctx.beginPath(); ctx.arc(hx, hy, 22, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                ctx.fillStyle = '#6ee7b7';
                ctx.font = '800 17px "Segoe UI", system-ui, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('X', hx, hy);
            });
            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 16px "Segoe UI", system-ui, sans-serif';
            ctx.fillText('2X', 292, cy - 22);

            // Thẻ dữ kiện đề bài bên phải (Zero Data Leakage)
            roundBox(444, 54, 322, 236, 10, '#0f172a', '#38bdf8', 2);
            ctx.fillStyle = '#38bdf8';
            ctx.font = '800 15.5px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText('THÔNG SỐ PHẢN ỨNG', 462, 82);

            ctx.fillStyle = '#f8fafc';
            ctx.font = '700 14.5px "Segoe UI", system-ui, sans-serif';
            ctx.fillText('• Phương trình: ¹₁p + ⁷₃Li → 2X', 462, 116);
            ctx.fillText('• m(¹₁H) = 1,0073 u; m(n) = 1,0087 u', 462, 148);
            ctx.fillText('• m(⁷₃Li) = 7,0144 u', 462, 180);
            ctx.fillText('• 1 u = 931,5 MeV/c²', 462, 212);
            ctx.fillStyle = '#6ee7b7';
            ctx.fillText('• E_lkr(X) = 7,1 MeV/nucleon', 462, 246);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 86 (MH-STAGING-C4-14 · VLXT-DS-VD28-086): So sánh tốc độ phân rã của đồng vị U-235 và U-238 từ khi Trái Đất hình thành
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C4-14', function(ctx, w, h, t) {
            function clearBg() {
                ctx.clearRect(0, 0, w, h);
                const g = ctx.createLinearGradient(0, 0, 0, h);
                g.addColorStop(0, '#060b19');
                g.addColorStop(1, '#0a1226');
                ctx.fillStyle = g;
                ctx.fillRect(0, 0, w, h);
                ctx.save();
                ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
                ctx.lineWidth = 1;
                for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
                for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
                ctx.restore();
            }
            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(x, y, bw, bh, r); else ctx.rect(x, y, bw, bh);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }
            function arrowLine(x1, y1, x2, y2, col, lw = 2.6, hl = 8) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }
            function drawTitle(txt) {
                ctx.save();
                ctx.font = '800 14.5px "Segoe UI", system-ui, sans-serif';
                const tw = Math.min(752, ctx.measureText(txt).width + 24);
                roundBox(14, 10, tw, 30, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
                ctx.fillStyle = '#38bdf8'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                ctx.fillText(txt, 26, 25);
                ctx.restore();
            }

            clearBg();
            drawTitle('NGUỒN GỐC ĐỒNG VỊ URANIUM-235 & URANIUM-238 TRÊN TRÁI ĐẤT');

            const saw = (t * 0.22) % 1;
            ctx.save();
            // Bên trái: Siêu tân tinh -> Lớp vỏ Trái Đất sơ khai (N0(U-235) = N0(U-238))
            roundBox(16, 54, 312, 236, 10, '#0f172a', '#fbbf24', 2);

            // Vụ nổ siêu tân tinh góc trên trái
            const sx = 86, sy = 124;
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 2.2;
            for (let k = 0; k < 8; k++) {
                const ang = (k * Math.PI * 2) / 8 + 0.2;
                const r1 = 14, r2 = 22 + saw * 22;
                ctx.beginPath();
                ctx.moveTo(sx + Math.cos(ang) * r1, sy + Math.sin(ang) * r1);
                ctx.lineTo(sx + Math.cos(ang) * r2, sy + Math.sin(ang) * r2);
                ctx.stroke();
            }
            ctx.fillStyle = '#fef08a';
            ctx.beginPath(); ctx.arc(sx, sy, 12, 0, Math.PI * 2); ctx.fill();

            arrowLine(124, 124, 198, 124, '#38bdf8', 2.8, 8);

            // Hành tinh Trái Đất sơ khai
            const ex = 256, ey = 124;
            ctx.fillStyle = 'rgba(14, 165, 233, 0.28)';
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2.8;
            ctx.beginPath(); ctx.arc(ex, ey, 34, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#10b981';
            ctx.beginPath(); ctx.arc(ex - 10, ey - 8, 10, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(ex + 12, ey + 10, 8, 0, Math.PI * 2); ctx.fill();

            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 14.5px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Siêu tân tinh', sx, 178);
            ctx.fillText('Trái Đất sơ khai', ex, 178);

            roundBox(32, 202, 280, 74, 8, '#1e293b', 'rgba(56,189,248,0.45)', 1.6);
            ctx.fillStyle = '#fde68a';
            ctx.fillText('Lúc mới hình thành (t = 0):', 172, 224);
            ctx.fillStyle = '#f8fafc';
            ctx.fillText('N₀(²³⁵₉₂U) = N₀(²³⁸₉₂U)', 172, 254);

            // Bên phải: Đồ thị phân rã 2 đồng vị theo thời gian (tỉ năm)
            roundBox(344, 54, 422, 236, 10, '#0f172a', '#38bdf8', 2);
            const ox = 408, oy = 246, gx = 326, gy = 152;
            arrowLine(ox, oy + 4, ox, oy - gy, '#f1f5f9', 2.6, 8);
            arrowLine(ox - 4, oy, ox + gx, oy, '#f1f5f9', 2.6, 8);

            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 14.5px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('N(t)', ox + 8, oy - gy + 6);
            ctx.textAlign = 'center';
            ctx.fillText('t (tỉ năm)', ox + gx - 34, oy + 22);
            ctx.textAlign = 'right';
            ctx.fillText('N₀', ox - 8, oy - 120);
            ctx.fillText('O', ox - 8, oy + 20);

            // Đường U-238 (T = 4,47 tỉ năm)
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 3;
            ctx.beginPath();
            for (let u = 0; u <= 1; u += 0.025) {
                const tYr = u * 5.0;
                const px = ox + u * 276;
                const py = oy - 120 * Math.pow(0.5, tYr / 4.47);
                if (u === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            ctx.stroke();

            // Đường U-235 (T = 0,704 tỉ năm)
            ctx.strokeStyle = '#ef4444';
            ctx.beginPath();
            for (let u = 0; u <= 1; u += 0.025) {
                const tYr = u * 5.0;
                const px = ox + u * 276;
                const py = oy - 120 * Math.pow(0.5, tYr / 0.704);
                if (u === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            ctx.stroke();

            const dotX = ox + saw * 276;
            const tCur = saw * 5.0;
            ctx.fillStyle = '#10b981';
            ctx.beginPath(); ctx.arc(dotX, oy - 120 * Math.pow(0.5, tCur / 4.47), 5.5, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#ef4444';
            ctx.beginPath(); ctx.arc(dotX, oy - 120 * Math.pow(0.5, tCur / 0.704), 5.5, 0, Math.PI * 2); ctx.fill();

            // Chú thích 2 đường (Zero Data Leakage: chỉ nêu T trong đề bài)
            roundBox(498, 68, 250, 62, 7, '#1e293b', '#64748b', 1.6);
            ctx.fillStyle = '#6ee7b7';
            ctx.textAlign = 'left';
            ctx.fillText('U-238: T = 4,47 tỉ năm', 512, 88);
            ctx.fillStyle = '#fca5a5';
            ctx.fillText('U-235: T = 0,704 tỉ năm', 512, 114);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 87 (MH-STAGING-C4-15 · VLXT-DS-VD28-087): Pin hạt nhân Carbon-14 hoạt động dài hạn (H₀ = 10 mCi; T = 5730 năm)
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C4-15', function(ctx, w, h, t) {
            function clearBg() {
                ctx.clearRect(0, 0, w, h);
                const g = ctx.createLinearGradient(0, 0, 0, h);
                g.addColorStop(0, '#060b19');
                g.addColorStop(1, '#0a1226');
                ctx.fillStyle = g;
                ctx.fillRect(0, 0, w, h);
                ctx.save();
                ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
                ctx.lineWidth = 1;
                for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
                for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
                ctx.restore();
            }
            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(x, y, bw, bh, r); else ctx.rect(x, y, bw, bh);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }
            function arrowLine(x1, y1, x2, y2, col, lw = 2.6, hl = 8) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }
            function drawNuclide(A, Z, sym, x, y, opts = {}) {
                const fs = Math.max(16, opts.fontSize || 18);
                const idxSize = Math.max(12.5, Math.round(fs * 0.72));
                const col = opts.color || '#f8fafc';
                const align = opts.align || 'left';
                ctx.save();
                ctx.textBaseline = 'middle';
                ctx.font = `800 ${idxSize}px "Segoe UI", system-ui, sans-serif`;
                const idxW = Math.max(ctx.measureText(String(A)).width, ctx.measureText(String(Z)).width);
                ctx.font = `800 ${fs}px "Segoe UI", system-ui, sans-serif`;
                const symW = ctx.measureText(sym).width;
                const tot = idxW + 2 + symW;
                let sx = x;
                if (align === 'center') sx = x - tot / 2;
                ctx.fillStyle = col;
                ctx.textAlign = 'right';
                ctx.font = `800 ${idxSize}px "Segoe UI", system-ui, sans-serif`;
                ctx.fillText(String(A), sx + idxW, y - Math.round(fs * 0.36));
                ctx.fillText(String(Z), sx + idxW, y + Math.round(fs * 0.38));
                ctx.textAlign = 'left';
                ctx.font = `800 ${fs}px "Segoe UI", system-ui, sans-serif`;
                ctx.fillText(sym, sx + idxW + 2, y);
                ctx.restore();
            }
            function drawTitle(txt) {
                ctx.save();
                ctx.font = '800 14.5px "Segoe UI", system-ui, sans-serif';
                const tw = Math.min(752, ctx.measureText(txt).width + 24);
                roundBox(14, 10, tw, 30, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
                ctx.fillStyle = '#38bdf8'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                ctx.fillText(txt, 26, 25);
                ctx.restore();
            }

            clearBg();
            drawTitle('PIN HẠT NHÂN CARBON-14 (H₀ = 10 mCi; T = 5730 NĂM)');

            const saw = (t * 0.28) % 1;
            ctx.save();
            // Bên trái: Mô-đun pin Betavolt với lớp nguồn C-14 phóng tia beta- vào lớp bán dẫn
            const px = 34, py = 66, pw = 326, ph = 212;
            roundBox(px, py, pw, ph, 14, '#1e293b', '#94a3b8', 3);

            roundBox(px + 20, py + 16, pw - 40, 38, 6, '#0f172a', '#fbbf24', 1.8);
            ctx.fillStyle = '#fbbf24';
            ctx.font = '800 15.5px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('BETAVOLT · PIN HẠT NHÂN C-14', px + pw / 2, py + 35);

            // Lớp nguồn đồng vị C-14 (trái)
            roundBox(px + 22, py + 72, 104, 118, 8, 'rgba(245, 158, 11, 0.20)', '#f59e0b', 2);
            drawNuclide('14', '6', 'C', px + 74, py + 114, { fontSize: 19, color: '#fbbf24', align: 'center' });
            ctx.fillStyle = '#fde68a';
            ctx.font = '800 14.5px "Segoe UI", system-ui, sans-serif';
            ctx.fillText('Nguồn β⁻', px + 74, py + 158);

            // Lớp bán dẫn thu nhận hạt beta- sinh dòng điện (phải)
            roundBox(px + 196, py + 72, 108, 118, 8, 'rgba(56, 189, 248, 0.20)', '#38bdf8', 2);
            ctx.fillStyle = '#7dd3fc';
            ctx.fillText('Bán dẫn', px + 250, py + 116);
            ctx.fillStyle = '#6ee7b7';
            ctx.fillText('Tạo dòng điện', px + 250, py + 148);

            // Dòng hạt beta- phóng 1 chiều sawtooth từ lớp C-14 sang lớp bán dẫn
            [py + 96, py + 130, py + 164].forEach((by, idx) => {
                const p = (saw + idx * 0.2) % 1;
                const bx = px + 130 + p * 62;
                arrowLine(px + 128, by, px + 190, by, '#fbbf24', 2.2, 6);
                ctx.fillStyle = '#10b981';
                ctx.beginPath(); ctx.arc(bx, by, 4.5, 0, Math.PI * 2); ctx.fill();
            });

            // Xung dòng điện ra mạch ngoài
            arrowLine(px + pw, py + 130, px + pw + 44, py + 130, '#38bdf8', 3, 9);
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath(); ctx.arc(px + pw + 6 + saw * 30, py + 130, 4.5, 0, Math.PI * 2); ctx.fill();

            // Bên phải: Thẻ dữ kiện đề bài (Zero Data Leakage)
            roundBox(424, 54, 342, 236, 10, '#0f172a', '#10b981', 2);
            ctx.fillStyle = '#6ee7b7';
            ctx.font = '800 15.5px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('THÔNG SỐ PIN HẠT NHÂN', 442, 82);

            ctx.fillStyle = '#f8fafc';
            ctx.font = '700 14.5px "Segoe UI", system-ui, sans-serif';
            ctx.fillText('• Đồng vị sử dụng: ¹⁴₆C (phóng xạ β⁻)', 442, 118);
            ctx.fillText('• Chu kì bán rã: T = 5730 năm', 442, 150);
            ctx.fillText('• Độ phóng xạ đầu: H₀ = 10 mCi', 442, 182);
            ctx.fillText('• 1 Ci = 3,7·10¹⁰ Bq; 1 năm = 365 ngày', 442, 214);
            ctx.fillStyle = '#fde68a';
            ctx.fillText('• Ứng dụng: Máy tạo nhịp tim, vũ trụ', 442, 248);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 88 (MH-STAGING-C4-16 · VLXT-DS-VD28-088): Xác định tuổi cổ vật gỗ bằng phương pháp đồng vị phóng xạ Carbon-14
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C4-16', function(ctx, w, h, t) {
            function clearBg() {
                ctx.clearRect(0, 0, w, h);
                const g = ctx.createLinearGradient(0, 0, 0, h);
                g.addColorStop(0, '#060b19');
                g.addColorStop(1, '#0a1226');
                ctx.fillStyle = g;
                ctx.fillRect(0, 0, w, h);
                ctx.save();
                ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
                ctx.lineWidth = 1;
                for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
                for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
                ctx.restore();
            }
            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(x, y, bw, bh, r); else ctx.rect(x, y, bw, bh);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }
            function arrowLine(x1, y1, x2, y2, col, lw = 2.6, hl = 8) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }
            function drawTitle(txt) {
                ctx.save();
                ctx.font = '800 14.5px "Segoe UI", system-ui, sans-serif';
                const tw = Math.min(752, ctx.measureText(txt).width + 24);
                roundBox(14, 10, tw, 30, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
                ctx.fillStyle = '#38bdf8'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                ctx.fillText(txt, 26, 25);
                ctx.restore();
            }

            clearBg();
            drawTitle('XÁC ĐỊNH TUỔI CỔ VẬT GỖ BẰNG CARBON-14 (T = 5730 NĂM)');

            const saw = (t * 0.22) % 1;
            ctx.save();
            // Bên trái: Cây sống trao đổi C-14 ổn định -> Khúc gỗ cổ vật suy giảm hoạt độ
            roundBox(16, 54, 312, 236, 10, '#0f172a', '#10b981', 2);

            // Cây sống
            ctx.fillStyle = '#92400e';
            ctx.fillRect(68, 124, 16, 42);
            ctx.fillStyle = 'rgba(16, 185, 129, 0.35)';
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 2.4;
            ctx.beginPath(); ctx.arc(76, 104, 28, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#6ee7b7';
            ctx.font = '800 14.5px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Gỗ mới chặt', 76, 186);
            ctx.fillStyle = '#f8fafc';
            ctx.fillText('921 / giờ', 76, 210);

            arrowLine(122, 126, 198, 126, '#fbbf24', 2.8, 8);
            ctx.fillStyle = '#fde68a';
            ctx.fillText('Thời gian t', 160, 106);

            // Cổ vật gỗ
            roundBox(218, 122, 82, 34, 8, '#78350f', '#fbbf24', 2.2);
            ctx.fillStyle = '#fde68a';
            ctx.fillText('Cổ vật gỗ', 259, 186);
            ctx.fillStyle = '#f8fafc';
            ctx.fillText('497 / giờ', 259, 210);

            ctx.fillStyle = '#cbd5e1';
            ctx.fillText('¹⁴₆C → X + β⁻ (T = 5730 năm)', 172, 258);

            // Bên phải: Đồ thị hàm mũ H(t) từ 921 về 497 phân rã/giờ
            roundBox(344, 54, 422, 236, 10, '#0f172a', '#38bdf8', 2);
            const ox = 418, oy = 244, gx = 314, gy = 148;
            arrowLine(ox, oy + 4, ox, oy - gy, '#f1f5f9', 2.6, 8);
            arrowLine(ox - 4, oy, ox + gx, oy, '#f1f5f9', 2.6, 8);

            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 14.5px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('H (p.rã/h)', ox + 8, oy - gy + 6);
            ctx.textAlign = 'center';
            ctx.fillText('t (năm)', ox + gx - 28, oy + 22);
            ctx.textAlign = 'right';
            ctx.fillText('921', ox - 8, oy - 120);
            ctx.fillText('497', ox - 8, oy - 65);
            ctx.fillText('O', ox - 8, oy + 20);

            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 3.2;
            ctx.beginPath();
            for (let u = 0; u <= 1; u += 0.025) {
                const px = ox + u * 268;
                const py = oy - 120 * Math.pow(0.5, u * 1.5);
                if (u === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            ctx.stroke();

            // Mốc 497 (tương ứng 497/921 = 0.5396 = 2^(-0.89))
            const uC = 0.89 / 1.5;
            const xC = ox + uC * 268;
            const yC = oy - 120 * (497 / 921);
            ctx.strokeStyle = '#64748b';
            ctx.setLineDash([5, 4]);
            ctx.lineWidth = 1.6;
            ctx.beginPath(); ctx.moveTo(ox, yC); ctx.lineTo(xC, yC); ctx.lineTo(xC, oy); ctx.stroke();
            ctx.setLineDash([]);
            ctx.fillStyle = '#10b981';
            ctx.textAlign = 'center';
            ctx.fillText('t = ?', xC, oy + 22);

            const dotX = ox + saw * uC * 268;
            const dotY = oy - 120 * Math.pow(0.5, saw * uC * 1.5);
            ctx.fillStyle = '#ef4444';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(dotX, dotY, 6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.restore();
        });

    // =========================================================================
    // CÂU 89 (MH-STAGING-C4-17 · VLXT-DS-VD28-089): Nghiên cứu hấp thụ phân bón trong cây khoai tây bằng đồng vị Phosphorus-32
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C4-17', function(ctx, w, h, t) {
            function clearBg() {
                ctx.clearRect(0, 0, w, h);
                const g = ctx.createLinearGradient(0, 0, 0, h);
                g.addColorStop(0, '#060b19');
                g.addColorStop(1, '#0a1226');
                ctx.fillStyle = g;
                ctx.fillRect(0, 0, w, h);
                ctx.save();
                ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
                ctx.lineWidth = 1;
                for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
                for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
                ctx.restore();
            }
            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(x, y, bw, bh, r); else ctx.rect(x, y, bw, bh);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }
            function arrowLine(x1, y1, x2, y2, col, lw = 2.6, hl = 8) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }
            function drawTitle(txt) {
                ctx.save();
                ctx.font = '800 14.5px "Segoe UI", system-ui, sans-serif';
                const tw = Math.min(752, ctx.measureText(txt).width + 24);
                roundBox(14, 10, tw, 30, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
                ctx.fillStyle = '#38bdf8'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                ctx.fillText(txt, 26, 25);
                ctx.restore();
            }

            clearBg();
            drawTitle('THEO DÕI HẤP THỤ PHÂN BÓN TRONG CÂY KHOAI TÂY BẰNG ³²₁₅P');

            const saw = (t * 0.28) % 1;
            ctx.save();
            // Bên trái: Cây khoai tây, dung dịch P-32 tưới vào rễ, mạch dẫn lên lá & đầu dò đo lá
            roundBox(16, 54, 404, 236, 10, '#0f172a', '#10b981', 2);

            // Nền đất trồng cây
            ctx.fillStyle = 'rgba(146, 64, 14, 0.45)';
            ctx.fillRect(32, 224, 252, 46);
            ctx.strokeStyle = '#d97706';
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(32, 224); ctx.lineTo(284, 224); ctx.stroke();

            // Thân cây & rễ & lá
            const stemX = 164;
            ctx.strokeStyle = '#22c55e';
            ctx.lineWidth = 6;
            ctx.beginPath(); ctx.moveTo(stemX, 224); ctx.lineTo(stemX, 114); ctx.stroke();

            // Rễ cây trong đất
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 2.4;
            ctx.beginPath();
            ctx.moveTo(stemX, 224); ctx.lineTo(stemX - 28, 252);
            ctx.moveTo(stemX, 224); ctx.lineTo(stemX + 26, 254);
            ctx.moveTo(stemX, 224); ctx.lineTo(stemX, 260);
            ctx.stroke();

            // Lá trái & lá phải (ngắt đo độ phóng xạ)
            ctx.fillStyle = 'rgba(34, 197, 94, 0.35)';
            ctx.strokeStyle = '#22c55e';
            ctx.lineWidth = 2.4;
            ctx.beginPath(); ctx.ellipse(stemX - 42, 148, 34, 14, -0.35, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.beginPath(); ctx.ellipse(stemX + 46, 128, 36, 15, 0.25, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

            // Bình tưới dung dịch P-32 bên trái
            roundBox(36, 168, 76, 36, 6, '#1e293b', '#fbbf24', 2);
            ctx.fillStyle = '#fde68a';
            ctx.font = '800 14.5px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('3,12 μg P', 74, 186);
            arrowLine(112, 198, 144, 222, '#fbbf24', 2.4, 7);

            // Hạt P-32 chuyển động 1 chiều sawtooth từ rễ lên thân -> ra lá
            const pY = 248 - saw * 120;
            const pX = stemX + (saw > 0.7 ? (saw - 0.7) / 0.3 * 42 : 0);
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath(); ctx.arc(pX, pY, 5, 0, Math.PI * 2); ctx.fill();

            // Đầu dò đo chiếc lá
            roundBox(278, 102, 126, 56, 8, '#1e293b', '#38bdf8', 2);
            ctx.fillStyle = '#7dd3fc';
            ctx.fillText('Đo lá cây:', 341, 119);
            ctx.fillStyle = '#f8fafc';
            ctx.fillText('4,56·10⁹ Bq', 341, 142);
            arrowLine(252, 128, 276, 128, '#38bdf8', 2.4, 7);

            // Thẻ dữ kiện đề bài bên phải (Zero Data Leakage)
            roundBox(436, 54, 330, 236, 10, '#0f172a', '#fbbf24', 2);
            ctx.fillStyle = '#fbbf24';
            ctx.font = '800 15.5px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('THÔNG SỐ THÍ NGHIỆM', 454, 82);

            ctx.fillStyle = '#f8fafc';
            ctx.font = '700 14.5px "Segoe UI", system-ui, sans-serif';
            ctx.fillText('• Đồng vị phân bón: ³²₁₅P (tia β⁻)', 454, 118);
            ctx.fillText('• Chu kì bán rã: T = 14,28 ngày', 454, 150);
            ctx.fillText('• Lượng tưới gốc: 3,12 μg ³²₁₅P', 454, 182);
            ctx.fillText('• Độ phóng xạ lá đo: 4,56·10⁹ Bq', 454, 214);
            ctx.fillStyle = '#6ee7b7';
            ctx.fillText('• 1 ngày = 86 400 s', 454, 248);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 90 (MH-STAGING-C4-18 · VLXT-DS-VD28-090): Định tuổi chiếc thuyền cổ bằng đồng vị phóng xạ ¹⁴₆C (mẫu gỗ tươi và mẫu gỗ cổ)
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C4-18', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
            for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(x, y, bw, bh, r);
                else ctx.rect(x, y, bw, bh);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function arrowLine(x1, y1, x2, y2, col, lw = 2.8, hl = 9) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }

            function drawNuclide(A, Z, sym, x, y, col = '#f8fafc', fontSize = 17, align = 'left') {
                const idxSize = Math.max(13, Math.round(fontSize * 0.74));
                ctx.save();
                ctx.textBaseline = 'middle';
                ctx.font = `800 ${idxSize}px 'Segoe UI', system-ui, sans-serif`;
                const wA = A !== '' ? ctx.measureText(String(A)).width : 0;
                const wZ = Z !== '' ? ctx.measureText(String(Z)).width : 0;
                const idxW = Math.max(wA, wZ);
                const gap = idxW > 0 ? 2 : 0;
                ctx.font = `800 ${fontSize}px 'Segoe UI', system-ui, sans-serif`;
                const symW = ctx.measureText(sym).width;
                const totalW = idxW + gap + symW;
                let sx = x;
                if (align === 'center') sx = x - totalW / 2;
                else if (align === 'right') sx = x - totalW;
                ctx.fillStyle = col;
                ctx.textAlign = 'right';
                ctx.font = `800 ${idxSize}px 'Segoe UI', system-ui, sans-serif`;
                if (wA > 0) ctx.fillText(String(A), sx + idxW, y - Math.round(fontSize * 0.34));
                if (wZ > 0) ctx.fillText(String(Z), sx + idxW, y + Math.round(fontSize * 0.36));
                ctx.textAlign = 'left';
                ctx.font = `800 ${fontSize}px 'Segoe UI', system-ui, sans-serif`;
                ctx.fillText(sym, sx + idxW + gap, y);
                ctx.restore();
                return totalW;
            }

            function drawSub(base, sub, x, y, col = '#f8fafc', baseSz = 16, align = 'left') {
                const subSz = Math.max(13, Math.round(baseSz * 0.78));
                ctx.save();
                ctx.fillStyle = col;
                ctx.textAlign = 'left';
                ctx.textBaseline = 'alphabetic';
                ctx.font = `800 ${baseSz}px 'Segoe UI', system-ui, sans-serif`;
                const bw = ctx.measureText(base).width;
                ctx.font = `800 ${subSz}px 'Segoe UI', system-ui, sans-serif`;
                const sw = sub ? ctx.measureText(sub).width : 0;
                const tot = bw + sw;
                let sx = x;
                if (align === 'center') sx = x - tot / 2;
                else if (align === 'right') sx = x - tot;
                ctx.font = `800 ${baseSz}px 'Segoe UI', system-ui, sans-serif`;
                ctx.fillText(base, sx, y);
                if (sub) {
                    ctx.font = `800 ${subSz}px 'Segoe UI', system-ui, sans-serif`;
                    ctx.fillText(sub, sx + bw + 1, y + 4);
                }
                ctx.restore();
            }

            function drawPillLabel(text, x, y, bgCol, bdCol, txtCol) {
                ctx.save();
                ctx.font = `800 14.5px 'Segoe UI', system-ui, sans-serif`;
                const pw = ctx.measureText(text).width + 20;
                roundBox(x - pw / 2, y - 14, pw, 28, 7, bgCol, bdCol, 1.8);
                ctx.fillStyle = txtCol;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(text, x, y);
                ctx.restore();
            }

            // Tiêu đề góc trên trái
            ctx.save();
            const title = 'ĐỊNH TUỔI THUYỀN CỔ BẰNG ĐỒNG VỊ PHÓNG XẠ CARBON-14';
            ctx.font = `800 15px 'Segoe UI', system-ui, sans-serif`;
            const titleW = Math.min(750, ctx.measureText(title).width + 24);
            roundBox(14, 10, titleW, 30, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, 26, 25);
            ctx.restore();

            const saw = (t * 0.25) % 1;

            // 1. Mẫu gỗ tươi (bên trái trên)
            roundBox(14, 52, 168, 114, 10, '#0f172a', '#10b981', 2.2);
            drawPillLabel('Mẫu gỗ tươi', 98, 68, '#064e3b', '#10b981', '#6ee7b7');
            // Khối gỗ tươi
            roundBox(26, 92, 144, 32, 6, '#78350f', '#fbbf24', 2);
            ctx.strokeStyle = '#d97706';
            ctx.lineWidth = 1.6;
            ctx.beginPath();
            ctx.ellipse(38, 108, 6, 12, 0, 0, Math.PI * 2);
            ctx.stroke();
            // Các hạt C-14 phát bức xạ trong gỗ tươi (nhiều hạt)
            for (let i = 0; i < 5; i++) {
                const px = 54 + i * 24;
                const py = 108 + (i % 2 === 0 ? -4 : 4);
                ctx.fillStyle = '#38bdf8';
                ctx.beginPath(); ctx.arc(px, py, 3.8, 0, Math.PI * 2); ctx.fill();
                const emitP = (saw + i * 0.2) % 1;
                ctx.fillStyle = '#fbbf24';
                ctx.beginPath(); ctx.arc(px + emitP * 14, py - emitP * 16, 2.5, 0, Math.PI * 2); ctx.fill();
            }
            ctx.fillStyle = '#e2e8f0';
            ctx.font = `700 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText('N(C) = 3·10²³ hạt', 98, 146);

            // Mũi tên thời gian phân rã t
            arrowLine(188, 108, 254, 108, '#fbbf24', 3, 9);
            ctx.fillStyle = '#fde68a';
            ctx.font = `800 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText('t (năm)', 221, 88);

            // 2. Mẫu gỗ thuyền cổ (giữa trên)
            roundBox(260, 52, 172, 114, 10, '#0f172a', '#f59e0b', 2.2);
            drawPillLabel('Mẫu thuyền cổ', 346, 68, '#451a03', '#f59e0b', '#fde68a');
            // Mặt cắt thuyền gỗ trong hố khai quật
            ctx.fillStyle = '#475569';
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 2.4;
            ctx.beginPath();
            ctx.moveTo(282, 98);
            ctx.lineTo(410, 98);
            ctx.lineTo(392, 126);
            ctx.lineTo(300, 126);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            // Ít hạt C-14 hơn đang phân rã
            [322, 370].forEach((cx, idx) => {
                ctx.fillStyle = '#38bdf8';
                ctx.beginPath(); ctx.arc(cx, 112, 3.8, 0, Math.PI * 2); ctx.fill();
                const ep = (saw + idx * 0.5) % 1;
                ctx.fillStyle = '#ef4444';
                ctx.beginPath(); ctx.arc(cx, 112 - ep * 18, 2.5, 0, Math.PI * 2); ctx.fill();
            });
            ctx.fillStyle = '#fca5a5';
            ctx.font = `800 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('H = 0,65 Bq', 346, 148);

            // 3. Đồ thị phân rã H(t) (dưới trái)
            const ox = 56, oy = 266, gxW = 356, gyH = 78;
            arrowLine(ox, oy + 4, ox, oy - gyH - 8, '#cbd5e1', 2.4, 8);
            arrowLine(ox - 4, oy, ox + gxW + 10, oy, '#cbd5e1', 2.4, 8);
            ctx.fillStyle = '#f8fafc';
            ctx.font = `800 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'left';
            ctx.fillText('H (Bq)', ox + 8, oy - gyH - 4);
            ctx.textAlign = 'right';
            ctx.fillText('t', ox + gxW + 8, oy + 20);
            ctx.fillText('0,65', ox - 6, oy - 36);
            drawSub('H', '0', ox - 10, oy - 68, '#6ee7b7', 15, 'right');

            // Đường cong mũ phân rã 1 chiều
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 3;
            ctx.beginPath();
            for (let u = 0; u <= 1; u += 0.03) {
                const px = ox + u * 310;
                const py = oy - 72 * Math.pow(0.5, u * 1.6);
                if (u === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            ctx.stroke();

            // Điểm chạy 1 chiều sawtooth trên đường cong phân rã
            const dotU = saw * 0.72;
            const dotX = ox + dotU * 310;
            const dotY = oy - 72 * Math.pow(0.5, dotU * 1.6);
            ctx.fillStyle = '#fbbf24';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(dotX, dotY, 5.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

            // 4. Bảng dữ kiện đề bài bên phải (Zero Data Leakage)
            roundBox(446, 52, 320, 240, 10, '#0f172a', '#38bdf8', 2);
            ctx.fillStyle = '#38bdf8';
            ctx.font = `800 15.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'left';
            ctx.fillText('DỮ KIỆN MẪU GỖ', 464, 78);

            drawNuclide('14', '6', 'C', 466, 112, '#fbbf24', 17, 'left');
            ctx.fillStyle = '#f8fafc';
            ctx.font = `700 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText(': đồng vị phóng xạ', 506, 114);

            ctx.fillText('• Gỗ tươi: 3·10²³ nguyên tử C', 464, 146);
            ctx.fillText('• Tỉ lệ C-14: 1 / 10¹² nguyên tử C', 464, 176);
            ctx.fillStyle = '#7dd3fc';
            ctx.fillText('• Hằng số λ = 3,84·10⁻¹² s⁻¹', 464, 206);
            ctx.fillStyle = '#f8fafc';
            ctx.fillText('• Quy ước: 1 năm = 365 ngày', 464, 236);
            ctx.fillStyle = '#fca5a5';
            ctx.fillText('• Gỗ thuyền cổ: H = 0,65 Bq', 464, 266);
        });

    // =========================================================================
    // CÂU 91 (MH-STAGING-C4-19 · VLXT-DS-VD28-091): Đồ thị phụ thuộc của ln(R) theo thời gian t (phút) khi đo độ phóng xạ đồng vị ¹²⁸₅₃I
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C4-19', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
            for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(x, y, bw, bh, r);
                else ctx.rect(x, y, bw, bh);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function arrowLine(x1, y1, x2, y2, col, lw = 2.6, hl = 8) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }

            function drawNuclide(A, Z, sym, x, y, col = '#f8fafc', fontSize = 17, align = 'left') {
                const idxSize = Math.max(13, Math.round(fontSize * 0.74));
                ctx.save();
                ctx.textBaseline = 'middle';
                ctx.font = `800 ${idxSize}px 'Segoe UI', system-ui, sans-serif`;
                const wA = A !== '' ? ctx.measureText(String(A)).width : 0;
                const wZ = Z !== '' ? ctx.measureText(String(Z)).width : 0;
                const idxW = Math.max(wA, wZ);
                const gap = idxW > 0 ? 2 : 0;
                ctx.font = `800 ${fontSize}px 'Segoe UI', system-ui, sans-serif`;
                const symW = ctx.measureText(sym).width;
                const totalW = idxW + gap + symW;
                let sx = x;
                if (align === 'center') sx = x - totalW / 2;
                else if (align === 'right') sx = x - totalW;
                ctx.fillStyle = col;
                ctx.textAlign = 'right';
                ctx.font = `800 ${idxSize}px 'Segoe UI', system-ui, sans-serif`;
                if (wA > 0) ctx.fillText(String(A), sx + idxW, y - Math.round(fontSize * 0.34));
                if (wZ > 0) ctx.fillText(String(Z), sx + idxW, y + Math.round(fontSize * 0.36));
                ctx.textAlign = 'left';
                ctx.font = `800 ${fontSize}px 'Segoe UI', system-ui, sans-serif`;
                ctx.fillText(sym, sx + idxW + gap, y);
                ctx.restore();
            }

            // Tiêu đề
            ctx.save();
            const title = 'ĐỒ THỊ PHỤ THUỘC ln(R) THEO THỜI GIAN t CỦA ĐỒNG VỊ I-128';
            ctx.font = `800 15px 'Segoe UI', system-ui, sans-serif`;
            const titleW = Math.min(750, ctx.measureText(title).width + 24);
            roundBox(14, 10, titleW, 30, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, 26, 25);
            ctx.restore();

            // 1. Đồ thị lưới chính xác như ảnh gốc 091.png (bên trái)
            const ox = 68, oy = 264;
            const gW = 360; // 10 ô * 36px = 250 phút (mỗi ô 25 phút)
            const gH = 189; // 7 ô * 27px = 7 đơn vị ln(R)
            const toX = (tVal) => ox + (tVal / 250) * gW;
            const toY = (lnVal) => oy - (lnVal / 7) * gH;

            // Lưới tọa độ 10x7
            ctx.save();
            for (let i = 0; i <= 10; i++) {
                const gx = ox + i * 36;
                ctx.strokeStyle = i % 2 === 0 ? 'rgba(148, 163, 184, 0.35)' : 'rgba(148, 163, 184, 0.16)';
                ctx.lineWidth = i % 2 === 0 ? 1.4 : 1;
                ctx.beginPath(); ctx.moveTo(gx, oy - gH); ctx.lineTo(gx, oy); ctx.stroke();
            }
            for (let j = 0; j <= 7; j++) {
                const gy = oy - j * 27;
                ctx.strokeStyle = 'rgba(148, 163, 184, 0.28)';
                ctx.lineWidth = 1.2;
                ctx.beginPath(); ctx.moveTo(ox, gy); ctx.lineTo(ox + gW, gy); ctx.stroke();
            }
            ctx.restore();

            // Trục tọa độ
            arrowLine(ox, oy + 4, ox, oy - gH - 18, '#f8fafc', 2.6, 8);
            arrowLine(ox - 4, oy, ox + gW + 20, oy, '#f8fafc', 2.6, 8);

            ctx.save();
            ctx.fillStyle = '#f8fafc';
            ctx.font = `800 15px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText('ln(R)', ox + 8, oy - gH - 14);
            ctx.textAlign = 'right';
            ctx.fillText('t (phút)', ox + gW + 10, oy - 16);

            // Nhãn số trục y (0..7)
            ctx.textAlign = 'right';
            ctx.font = `700 14.5px 'Segoe UI', system-ui, sans-serif`;
            for (let j = 0; j <= 7; j++) {
                ctx.fillText(String(j), ox - 8, oy - j * 27);
            }
            // Nhãn số trục x (0, 50, 100, 150, 200, 250)
            ctx.textAlign = 'center';
            for (let tVal = 0; tVal <= 250; tVal += 50) {
                ctx.fillText(String(tVal), toX(tVal), oy + 18);
            }

            // Đường thẳng khớp hai điểm (t=75, lnR=4) và (t=200, lnR=0.5): lnR = 6.1 - 0.028*t
            // Cắt trục tại t=0 -> 6.1 và lnR=0 -> t=217.86
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 3.2;
            ctx.beginPath();
            ctx.moveTo(toX(0), toY(6.1));
            ctx.lineTo(toX(217.86), toY(0));
            ctx.stroke();

            // Các chấm thực nghiệm trên đường thẳng giống ảnh gốc
            const pts = [[4, 5.99], [38, 5.05], [68, 4.25], [101, 3.22], [133, 2.34], [168, 1.38], [218, 0.02]];
            pts.forEach(([pt, py]) => {
                ctx.fillStyle = '#f8fafc';
                ctx.beginPath(); ctx.arc(toX(pt), toY(py), 4, 0, Math.PI * 2); ctx.fill();
            });

            // Hai dấu + chuẩn xác tại (75, 4) và (200, 0.5) như ảnh gốc
            [[75, 4], [200, 0.5]].forEach(([ct, cy]) => {
                const px = toX(ct), py = toY(cy);
                ctx.strokeStyle = '#fbbf24';
                ctx.lineWidth = 2.2;
                ctx.beginPath();
                ctx.moveTo(px - 6, py); ctx.lineTo(px + 6, py);
                ctx.moveTo(px, py - 6); ctx.lineTo(px, py + 6);
                ctx.stroke();
            });

            // Điểm quét chạy 1 chiều sawtooth theo t từ 0 -> 217.86 phút
            const saw = (t * 0.22) % 1;
            const curT = saw * 217.86;
            const curLn = 6.1 - 0.028 * curT;
            ctx.fillStyle = '#10b981';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(toX(curT), toY(curLn), 6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

            // 2. Thiết bị đầu dò + Thẻ thông số đề bài bên phải (Zero Data Leakage)
            roundBox(476, 50, 290, 96, 10, '#0f172a', '#fbbf24', 2);
            // Mẫu I-128 phát tia beta- về phía đầu dò
            ctx.fillStyle = 'rgba(245, 158, 11, 0.25)';
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 2.2;
            ctx.beginPath(); ctx.arc(522, 98, 22, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            drawNuclide('128', '53', 'I', 522, 98, '#fde68a', 17, 'center');

            // Đầu dò phóng xạ
            roundBox(628, 74, 116, 48, 8, '#1e293b', '#38bdf8', 2.2);
            ctx.fillStyle = '#7dd3fc';
            ctx.font = `800 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText('Đầu dò (R)', 686, 98);

            // Tia beta- bay 1 chiều từ mẫu sang đầu dò
            const bx = 548 + saw * 72;
            ctx.fillStyle = '#10b981';
            ctx.beginPath(); ctx.arc(bx, 98, 4.5, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#6ee7b7';
            ctx.font = `800 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('β⁻', bx, 76);

            // Thẻ thông số
            roundBox(476, 158, 290, 134, 10, '#0f172a', '#38bdf8', 2);
            ctx.fillStyle = '#38bdf8';
            ctx.font = `800 15.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'left';
            ctx.fillText('THÔNG SỐ THỰC NGHIỆM', 494, 182);
            ctx.fillStyle = '#f8fafc';
            ctx.font = `700 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('• Nguồn phóng xạ: β⁻ (I-128, Z = 53)', 494, 212);
            ctx.fillText('• Số đếm/giây: R tỉ lệ thuận H', 494, 240);
            ctx.fillStyle = '#fde68a';
            ctx.fillText('• Trục hoành t tính bằng phút', 494, 268);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 92 (MH-STAGING-C4-20 · VLXT-DS-VD28-092): Sơ đồ nguyên lý nhà máy điện hạt nhân và chu trình chuyển hóa năng lượng
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C4-20', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
            for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(x, y, bw, bh, r);
                else ctx.rect(x, y, bw, bh);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function arrowLine(x1, y1, x2, y2, col, lw = 2.8, hl = 8) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }

            // Tiêu đề
            ctx.save();
            const title = 'SƠ ĐỒ NGUYÊN LÝ NHÀ MÁY ĐIỆN HẠT NHÂN';
            ctx.font = `800 15px 'Segoe UI', system-ui, sans-serif`;
            const titleW = ctx.measureText(title).width + 24;
            roundBox(14, 10, titleW, 30, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, 26, 25);
            ctx.restore();

            const saw = (t * 0.28) % 1;

            ctx.save();
            // 1. Lò phản ứng hạt nhân (trái)
            roundBox(22, 66, 178, 172, 12, '#0f172a', '#ef4444', 2.8);
            // Vùng lõi nhiên liệu
            roundBox(42, 102, 138, 118, 8, '#1e293b', '#f59e0b', 2);
            [66, 98, 130, 160].forEach((fx, idx) => {
                roundBox(fx - 6, 122, 12, 86, 3, '#f97316', '#fde047', 1.5);
                if (idx < 3) {
                    // Thanh điều khiển cắm từ nắp lò xuống
                    roundBox(fx + 10, 76, 8, 62, 2, '#64748b', '#cbd5e1', 1.4);
                }
            });
            ctx.fillStyle = '#fca5a5';
            ctx.font = `800 15px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText('Lò phản ứng', 111, 260);
            ctx.fillStyle = '#fde68a';
            ctx.font = `700 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('Thanh điều khiển', 111, 282);

            // Đường ống tuần hoàn sơ cấp nối Lò phản ứng -> Bộ sinh hơi
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 5;
            ctx.beginPath(); ctx.moveTo(200, 118); ctx.lineTo(260, 118); ctx.stroke();
            ctx.strokeStyle = '#38bdf8';
            ctx.beginPath(); ctx.moveTo(260, 206); ctx.lineTo(200, 206); ctx.stroke();
            arrowLine(206 + saw * 42, 118, 224 + saw * 42, 118, '#fbbf24', 2.8, 7);
            arrowLine(254 - saw * 42, 206, 236 - saw * 42, 206, '#7dd3fc', 2.8, 7);

            // 2. Bộ trao đổi nhiệt / Sinh hơi (giữa trái)
            roundBox(262, 82, 128, 148, 10, '#0f172a', '#fbbf24', 2.4);
            ctx.fillStyle = 'rgba(56, 189, 248, 0.22)';
            ctx.fillRect(265, 160, 122, 67);
            // Ống xoắn trao đổi nhiệt
            ctx.strokeStyle = '#f97316';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(262, 118);
            for (let k = 0; k < 4; k++) {
                ctx.lineTo(352, 118 + k * 22);
                ctx.lineTo(286, 129 + k * 22);
            }
            ctx.lineTo(262, 206);
            ctx.stroke();
            ctx.fillStyle = '#fde68a';
            ctx.font = `800 15px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('Bộ sinh hơi', 326, 256);

            // Đường hơi nước nối Bộ sinh hơi -> Tua-bin
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 4.5;
            ctx.beginPath(); ctx.moveTo(390, 108); ctx.lineTo(448, 108); ctx.stroke();
            arrowLine(394 + saw * 42, 108, 412 + saw * 42, 108, '#f8fafc', 2.6, 7);

            // 3. Tua-bin & Máy phát điện (giữa phải)
            roundBox(450, 82, 140, 148, 10, '#0f172a', '#38bdf8', 2.4);
            // Cánh tua-bin quay 1 chiều
            const tcx = 492, tcy = 148;
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2.6;
            ctx.beginPath(); ctx.arc(tcx, tcy, 24, 0, Math.PI * 2); ctx.stroke();
            for (let b = 0; b < 6; b++) {
                const a = saw * Math.PI * 2 + (b * Math.PI) / 3;
                ctx.beginPath();
                ctx.moveTo(tcx, tcy);
                ctx.lineTo(tcx + Math.cos(a) * 22, tcy + Math.sin(a) * 22);
                ctx.stroke();
            }
            // Máy phát điện
            roundBox(532, 126, 44, 44, 6, '#1e293b', '#10b981', 2.2);
            ctx.fillStyle = '#6ee7b7';
            ctx.font = `800 16px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('G', 554, 149);
            ctx.fillStyle = '#7dd3fc';
            ctx.font = `800 15px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('Tua-bin &', 520, 254);
            ctx.fillText('Máy phát', 520, 276);

            // Đường dây tải điện sang Lưới điện (phải)
            arrowLine(590, 148, 634, 148, '#10b981', 3.2, 9);
            roundBox(638, 92, 126, 122, 10, '#0f172a', '#10b981', 2.4);
            // Cột điện cách điệu
            ctx.strokeStyle = '#6ee7b7';
            ctx.lineWidth = 2.6;
            ctx.beginPath();
            ctx.moveTo(701, 114); ctx.lineTo(682, 194);
            ctx.moveTo(701, 114); ctx.lineTo(720, 194);
            ctx.moveTo(676, 138); ctx.lineTo(726, 138);
            ctx.moveTo(680, 162); ctx.lineTo(722, 162);
            ctx.stroke();
            ctx.fillStyle = '#6ee7b7';
            ctx.font = `800 15px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('Lưới điện', 701, 254);
            ctx.fillStyle = '#94a3b8';
            ctx.font = `700 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('Phát thải thấp', 701, 276);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 93 (MH-STAGING-C4-21 · VLXT-DS-VD28-093): Thí nghiệm dùng máy đếm electron đo số hạt phát ra trong 1 phút ở thời điểm đầu và sau 5 giờ
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C4-21', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
            for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(x, y, bw, bh, r);
                else ctx.rect(x, y, bw, bh);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function arrowLine(x1, y1, x2, y2, col, lw = 2.8, hl = 8) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }

            // Tiêu đề
            ctx.save();
            const title = 'MÁY ĐẾM ELECTRON ĐO HOẠT ĐỘ PHÓNG XẠ MẪU X';
            ctx.font = `800 15px 'Segoe UI', system-ui, sans-serif`;
            const titleW = ctx.measureText(title).width + 24;
            roundBox(14, 10, titleW, 30, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, 26, 25);
            ctx.restore();

            const saw = (t * 0.22) % 1;
            const isPhase2 = saw >= 0.5;
            const pProg = isPhase2 ? (saw - 0.5) / 0.5 : saw / 0.5;
            const curCount = Math.round((isPhase2 ? 344 : 355) * pProg);

            ctx.save();
            // 1. Mẫu chất phóng xạ X bên trái
            roundBox(24, 96, 88, 108, 10, '#1e293b', '#f59e0b', 2.4);
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath(); ctx.arc(68, 146, 20, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#0f172a';
            ctx.font = `800 18px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('X', 68, 147);
            ctx.fillStyle = '#fde68a';
            ctx.font = `800 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('Mẫu X', 68, 224);

            // Chùm electron bắn từ mẫu X sang đầu dò (1 chiều sawtooth)
            for (let i = 0; i < 4; i++) {
                const ep = (t * 0.8 + i * 0.25) % 1;
                const ex = 92 + ep * 124;
                const ey = 146 + (i - 1.5) * 12;
                ctx.fillStyle = '#38bdf8';
                ctx.beginPath(); ctx.arc(ex, ey, 4.5, 0, Math.PI * 2); ctx.fill();
            }
            ctx.fillStyle = '#7dd3fc';
            ctx.font = `800 15px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('e⁻', 154, 104);

            // 2. Đầu thu & Máy đếm electron (giữa)
            roundBox(220, 88, 190, 128, 10, '#0f172a', '#38bdf8', 2.4);
            // Cửa sổ thu electron
            roundBox(212, 118, 14, 68, 4, '#334155', '#94a3b8', 2);
            ctx.fillStyle = '#38bdf8';
            ctx.font = `800 15px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('MÁY ĐẾM ELECTRON', 318, 112);

            // Màn hình số đếm
            roundBox(240, 128, 152, 46, 6, '#020617', '#10b981', 2);
            ctx.fillStyle = '#34d399';
            ctx.font = `800 18px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText(String(curCount).padStart(3, '0') + ' hạt', 316, 152);

            ctx.fillStyle = '#e2e8f0';
            ctx.font = `700 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText(isPhase2 ? 'Lần 2 (sau 5 giờ)' : 'Lần 1 (t = 0)', 316, 196);

            // 3. Dòng thời gian 2 lần đo bên phải (Zero Data Leakage)
            roundBox(436, 52, 330, 240, 10, '#0f172a', '#38bdf8', 2);
            ctx.fillStyle = '#38bdf8';
            ctx.font = `800 15.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'left';
            ctx.fillText('KẾT QUẢ ĐẾM TRONG 1 PHÚT', 454, 78);

            roundBox(454, 98, 294, 56, 8, '#1e293b', !isPhase2 ? '#fbbf24' : '#475569', 2);
            ctx.fillStyle = '#fde68a';
            ctx.font = `800 15px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('Lần 1 (trong 1 phút):', 468, 118);
            ctx.fillStyle = '#f8fafc';
            ctx.fillText('355 electron bắn ra', 468, 140);

            arrowLine(601, 156, 601, 182, '#fbbf24', 2.8, 7);
            ctx.fillStyle = '#fbbf24';
            ctx.font = `800 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('+ 5 giờ', 614, 170);

            roundBox(454, 186, 294, 56, 8, '#1e293b', isPhase2 ? '#fbbf24' : '#475569', 2);
            ctx.fillStyle = '#7dd3fc';
            ctx.font = `800 15px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('Lần 2 (trong 1 phút):', 468, 206);
            ctx.fillStyle = '#f8fafc';
            ctx.fillText('344 electron bắn ra', 468, 228);

            ctx.fillStyle = '#6ee7b7';
            ctx.font = `700 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('• Hỏi độ phóng xạ sau 5 giờ nữa', 454, 268);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 94 (MH-STAGING-C4-22 · VLXT-DS-VD28-094): Chẩn đoán hình ảnh y học hạt nhân bằng đồng vị ⁹⁹₄₃Tc và Gamma Camera
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C4-22', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
            for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(x, y, bw, bh, r);
                else ctx.rect(x, y, bw, bh);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function drawGammaRay(x1, y1, x2, y2, color = '#fbbf24') {
                const dx = x2 - x1, dy = y2 - y1;
                const len = Math.hypot(dx, dy);
                if (len < 12) return;
                const ang = Math.atan2(dy, dx);
                ctx.save();
                ctx.translate(x1, y1);
                ctx.rotate(ang);
                ctx.strokeStyle = color;
                ctx.lineWidth = 2.6;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                const waves = Math.max(2, Math.floor(len / 14));
                const bodyLen = len - 9;
                for (let i = 0; i <= waves * 4; i++) {
                    const px = (i / (waves * 4)) * bodyLen;
                    const py = Math.sin((i / 4) * Math.PI * 2) * 4;
                    ctx.lineTo(px, py);
                }
                ctx.lineTo(len, 0);
                ctx.stroke();
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.moveTo(len, 0);
                ctx.lineTo(len - 8, -4.5);
                ctx.lineTo(len - 8, 4.5);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            }

            function drawNuclide(A, Z, sym, x, y, col = '#f8fafc', fontSize = 17, align = 'left') {
                const idxSize = Math.max(13, Math.round(fontSize * 0.74));
                ctx.save();
                ctx.textBaseline = 'middle';
                ctx.font = `800 ${idxSize}px 'Segoe UI', system-ui, sans-serif`;
                const wA = A !== '' ? ctx.measureText(String(A)).width : 0;
                const wZ = Z !== '' ? ctx.measureText(String(Z)).width : 0;
                const idxW = Math.max(wA, wZ);
                const gap = idxW > 0 ? 2 : 0;
                ctx.font = `800 ${fontSize}px 'Segoe UI', system-ui, sans-serif`;
                const symW = ctx.measureText(sym).width;
                const totalW = idxW + gap + symW;
                let sx = x;
                if (align === 'center') sx = x - totalW / 2;
                else if (align === 'right') sx = x - totalW;
                ctx.fillStyle = col;
                ctx.textAlign = 'right';
                ctx.font = `800 ${idxSize}px 'Segoe UI', system-ui, sans-serif`;
                if (wA > 0) ctx.fillText(String(A), sx + idxW, y - Math.round(fontSize * 0.34));
                if (wZ > 0) ctx.fillText(String(Z), sx + idxW, y + Math.round(fontSize * 0.36));
                ctx.textAlign = 'left';
                ctx.font = `800 ${fontSize}px 'Segoe UI', system-ui, sans-serif`;
                ctx.fillText(sym, sx + idxW + gap, y);
                ctx.restore();
            }

            function drawSub(base, sub, x, y, col = '#f8fafc', baseSz = 16, align = 'left') {
                const subSz = Math.max(13, Math.round(baseSz * 0.78));
                ctx.save();
                ctx.fillStyle = col;
                ctx.textAlign = 'left';
                ctx.textBaseline = 'alphabetic';
                ctx.font = `800 ${baseSz}px 'Segoe UI', system-ui, sans-serif`;
                const bw = ctx.measureText(base).width;
                ctx.font = `800 ${subSz}px 'Segoe UI', system-ui, sans-serif`;
                const sw = sub ? ctx.measureText(sub).width : 0;
                const tot = bw + sw;
                let sx = x;
                if (align === 'center') sx = x - tot / 2;
                else if (align === 'right') sx = x - tot;
                ctx.font = `800 ${baseSz}px 'Segoe UI', system-ui, sans-serif`;
                ctx.fillText(base, sx, y);
                if (sub) {
                    ctx.font = `800 ${subSz}px 'Segoe UI', system-ui, sans-serif`;
                    ctx.fillText(sub, sx + bw + 1, y + 4);
                }
                ctx.restore();
            }

            // Tiêu đề
            ctx.save();
            const title = 'CHẨN ĐOÁN HÌNH ẢNH Y HỌC HẠT NHÂN BẰNG TECHNETIUM-99';
            ctx.font = `800 15px 'Segoe UI', system-ui, sans-serif`;
            const titleW = Math.min(750, ctx.measureText(title).width + 24);
            roundBox(14, 10, titleW, 30, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, 26, 25);
            ctx.restore();

            const saw = (t * 0.32) % 1;

            ctx.save();
            // 1. Đầu thu Gamma Camera phía trên
            roundBox(112, 54, 214, 48, 8, '#1e293b', '#38bdf8', 2.4);
            ctx.fillStyle = '#38bdf8';
            ctx.font = `800 15.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('GAMMA CAMERA', 219, 78);

            // Khung hiển thị kết quả quét nhỏ ở góc trái
            roundBox(20, 62, 76, 62, 8, '#0f172a', '#10b981', 2);
            ctx.fillStyle = '#6ee7b7';
            ctx.font = `800 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('Ảnh', 58, 84);
            ctx.fillText('xạ hình', 58, 104);

            // 2. Bàn bệnh nhân & mô bệnh tập trung Tc-99
            roundBox(36, 242, 364, 24, 6, '#334155', '#94a3b8', 2.2);
            // Cơ thể bệnh nhân nằm ngang (cách điệu rõ ràng)
            roundBox(54, 200, 56, 40, 18, '#1e293b', '#cbd5e1', 2.2); // đầu
            roundBox(114, 190, 252, 50, 14, '#1e293b', '#cbd5e1', 2.2); // thân

            // Mô bệnh tập trung dược chất Tc-99
            ctx.fillStyle = 'rgba(244, 114, 182, 0.28)';
            ctx.strokeStyle = '#f472b6';
            ctx.lineWidth = 2.4;
            ctx.beginPath(); ctx.ellipse(219, 215, 36, 18, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            drawNuclide('99', '43', 'Tc', 219, 215, '#fde68a', 17, 'center');

            // 3 tia gamma đi từ mô bệnh hướng lên Gamma Camera (1 chiều sawtooth)
            [-42, 0, 42].forEach((dx, idx) => {
                const prog = (saw + idx * 0.15) % 1;
                const sy = 195;
                const ey = 195 - prog * 90;
                drawGammaRay(219 + dx * 0.4, sy, 219 + dx, ey, '#fbbf24');
            });
            ctx.fillStyle = '#fde68a';
            ctx.font = `800 15px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('Tia γ', 302, 148);
            ctx.fillStyle = '#f472b6';
            ctx.fillText('Mô bệnh tập trung thuốc', 218, 282);

            // 3. Thẻ thông số đề bài bên phải (Zero Data Leakage)
            roundBox(430, 52, 336, 240, 10, '#0f172a', '#f472b6', 2);
            ctx.fillStyle = '#f472b6';
            ctx.font = `800 15.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'left';
            ctx.fillText('THÔNG SỐ LIỀU DƯỢC CHẤT', 448, 78);

            drawNuclide('99', '43', 'Tc', 450, 112, '#fde68a', 17, 'left');
            ctx.fillStyle = '#f8fafc';
            ctx.font = `700 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('phát tia gamma (γ)', 498, 114);

            ctx.fillText('• Chu kì bán rã: T = 6,0 giờ', 448, 148);
            drawSub('• Ban đầu (8h00): H', '0', 448, 182, '#7dd3fc', 15);
            ctx.fillStyle = '#7dd3fc';
            ctx.fillText('= 740 MBq', 606, 179);

            ctx.fillStyle = '#f8fafc';
            ctx.fillText('• Thời điểm xét: 20h00 cùng ngày', 448, 214);
            ctx.fillStyle = '#94a3b8';
            ctx.fillText('• Giả sử chưa bài tiết sinh học', 448, 244);
            ctx.fillStyle = '#6ee7b7';
            ctx.fillText('• M = 99 g/mol', 448, 272);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 95 (MH-STAGING-C4-23 · VLXT-DS-VD28-095): Đo tốc độ phân rã 240 phân rã/phút của mẫu gỗ cổ vật chứa 25 g carbon
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C4-23', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
            for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(x, y, bw, bh, r);
                else ctx.rect(x, y, bw, bh);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function drawNuclide(A, Z, sym, x, y, col = '#f8fafc', fontSize = 17, align = 'left') {
                const idxSize = Math.max(13, Math.round(fontSize * 0.74));
                ctx.save();
                ctx.textBaseline = 'middle';
                ctx.font = `800 ${idxSize}px 'Segoe UI', system-ui, sans-serif`;
                const wA = A !== '' ? ctx.measureText(String(A)).width : 0;
                const wZ = Z !== '' ? ctx.measureText(String(Z)).width : 0;
                const idxW = Math.max(wA, wZ);
                const gap = idxW > 0 ? 2 : 0;
                ctx.font = `800 ${fontSize}px 'Segoe UI', system-ui, sans-serif`;
                const symW = ctx.measureText(sym).width;
                const totalW = idxW + gap + symW;
                let sx = x;
                if (align === 'center') sx = x - totalW / 2;
                else if (align === 'right') sx = x - totalW;
                ctx.fillStyle = col;
                ctx.textAlign = 'right';
                ctx.font = `800 ${idxSize}px 'Segoe UI', system-ui, sans-serif`;
                if (wA > 0) ctx.fillText(String(A), sx + idxW, y - Math.round(fontSize * 0.34));
                if (wZ > 0) ctx.fillText(String(Z), sx + idxW, y + Math.round(fontSize * 0.36));
                ctx.textAlign = 'left';
                ctx.font = `800 ${fontSize}px 'Segoe UI', system-ui, sans-serif`;
                ctx.fillText(sym, sx + idxW + gap, y);
                ctx.restore();
            }

            // Tiêu đề
            ctx.save();
            const title = 'ĐO ĐỘ PHÓNG XẠ MẪU GỖ CỔ VẬT 25 g CARBON';
            ctx.font = `800 15px 'Segoe UI', system-ui, sans-serif`;
            const titleW = ctx.measureText(title).width + 24;
            roundBox(14, 10, titleW, 30, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, 26, 25);
            ctx.restore();

            const saw = (t * 0.25) % 1;

            ctx.save();
            // 1. Máy đo phóng xạ phía trên mẫu gỗ cổ
            roundBox(84, 52, 262, 54, 8, '#1e293b', '#38bdf8', 2.4);
            ctx.fillStyle = '#34d399';
            ctx.font = `800 16px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('240 phân rã / phút', 215, 79);

            // Đầu thu từ máy đo hướng xuống mẫu gỗ
            roundBox(182, 106, 66, 22, 4, '#334155', '#94a3b8', 2);

            // Tia phóng xạ đi lên đầu thu (1 chiều sawtooth)
            [-22, 0, 22].forEach((dx, idx) => {
                const p = (saw + idx * 0.33) % 1;
                const py = 186 - p * 54;
                ctx.fillStyle = '#fbbf24';
                ctx.beginPath(); ctx.arc(215 + dx, py, 4, 0, Math.PI * 2); ctx.fill();
            });

            // 2. Mẫu gỗ cổ vật 25 g C bên dưới
            roundBox(62, 184, 306, 68, 12, '#451a03', '#d97706', 2.8);
            // Vân gỗ
            ctx.strokeStyle = 'rgba(251, 191, 36, 0.35)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(82, 206); ctx.quadraticCurveTo(215, 198, 348, 208);
            ctx.moveTo(82, 232); ctx.quadraticCurveTo(215, 240, 348, 230);
            ctx.stroke();

            // Hai thẻ đồng vị C-12 và C-14 bên trong mẫu gỗ
            roundBox(80, 196, 120, 44, 7, '#0f172a', '#64748b', 1.8);
            drawNuclide('12', '6', 'C', 112, 218, '#e2e8f0', 17, 'center');
            ctx.fillStyle = '#cbd5e1';
            ctx.font = `700 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'left';
            ctx.fillText('Bền', 142, 220);

            roundBox(222, 196, 126, 44, 7, '#0f172a', '#f59e0b', 1.8);
            drawNuclide('14', '6', 'C', 252, 218, '#fbbf24', 17, 'center');
            ctx.fillStyle = '#fde68a';
            ctx.fillText('Phóng xạ', 278, 220);

            ctx.fillStyle = '#f8fafc';
            ctx.font = `800 15px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText('Mẫu gỗ cổ chứa 25 g Carbon', 215, 276);

            // 3. Thẻ thông số đề bài bên phải (Zero Data Leakage)
            roundBox(418, 52, 348, 240, 10, '#0f172a', '#fbbf24', 2);
            ctx.fillStyle = '#fbbf24';
            ctx.font = `800 15.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'left';
            ctx.fillText('DỮ KIỆN ĐO ĐẠC MẪU GỖ', 436, 78);

            ctx.fillStyle = '#f8fafc';
            ctx.font = `700 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('• Tổng lượng C: m = 25 g', 436, 112);
            ctx.fillText('• Tốc độ đếm: 240 phân rã/phút', 436, 144);
            ctx.fillText('• Chu kì bán rã C-14: T = 5 730 năm', 436, 176);
            ctx.fillStyle = '#7dd3fc';
            ctx.fillText('• Tỉ lệ lúc sống (¹²C : ¹⁴C) = 10¹² : 1', 436, 208);
            ctx.fillStyle = '#f8fafc';
            ctx.fillText('• Quy ước: 1 năm = 365 ngày', 436, 240);
            ctx.fillStyle = '#6ee7b7';
            ctx.fillText('• Xác định độ tuổi mẫu cổ vật', 436, 270);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 96 (MH-STAGING-C4-24 · VLXT-DS-VD28-096): Pin hạt nhân Betavolt dùng đồng vị ⁶³₂₈Ni (T = 100 năm) cấp nguồn cho máy tạo nhịp tim
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C4-24', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
            for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(x, y, bw, bh, r);
                else ctx.rect(x, y, bw, bh);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function arrowLine(x1, y1, x2, y2, col, lw = 2.8, hl = 8) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }

            function drawNuclide(A, Z, sym, x, y, col = '#f8fafc', fontSize = 17, align = 'left') {
                const idxSize = Math.max(13, Math.round(fontSize * 0.74));
                ctx.save();
                ctx.textBaseline = 'middle';
                ctx.font = `800 ${idxSize}px 'Segoe UI', system-ui, sans-serif`;
                const wA = A !== '' ? ctx.measureText(String(A)).width : 0;
                const wZ = Z !== '' ? ctx.measureText(String(Z)).width : 0;
                const idxW = Math.max(wA, wZ);
                const gap = idxW > 0 ? 2 : 0;
                ctx.font = `800 ${fontSize}px 'Segoe UI', system-ui, sans-serif`;
                const symW = ctx.measureText(sym).width;
                const totalW = idxW + gap + symW;
                let sx = x;
                if (align === 'center') sx = x - totalW / 2;
                else if (align === 'right') sx = x - totalW;
                ctx.fillStyle = col;
                ctx.textAlign = 'right';
                ctx.font = `800 ${idxSize}px 'Segoe UI', system-ui, sans-serif`;
                if (wA > 0) ctx.fillText(String(A), sx + idxW, y - Math.round(fontSize * 0.34));
                if (wZ > 0) ctx.fillText(String(Z), sx + idxW, y + Math.round(fontSize * 0.36));
                ctx.textAlign = 'left';
                ctx.font = `800 ${fontSize}px 'Segoe UI', system-ui, sans-serif`;
                ctx.fillText(sym, sx + idxW + gap, y);
                ctx.restore();
            }

            function drawSub(base, sub, x, y, col = '#f8fafc', baseSz = 16, align = 'left') {
                const subSz = Math.max(13, Math.round(baseSz * 0.78));
                ctx.save();
                ctx.fillStyle = col;
                ctx.textAlign = 'left';
                ctx.textBaseline = 'alphabetic';
                ctx.font = `800 ${baseSz}px 'Segoe UI', system-ui, sans-serif`;
                const bw = ctx.measureText(base).width;
                ctx.font = `800 ${subSz}px 'Segoe UI', system-ui, sans-serif`;
                const sw = sub ? ctx.measureText(sub).width : 0;
                const tot = bw + sw;
                let sx = x;
                if (align === 'center') sx = x - tot / 2;
                else if (align === 'right') sx = x - tot;
                ctx.font = `800 ${baseSz}px 'Segoe UI', system-ui, sans-serif`;
                ctx.fillText(base, sx, y);
                if (sub) {
                    ctx.font = `800 ${subSz}px 'Segoe UI', system-ui, sans-serif`;
                    ctx.fillText(sub, sx + bw + 1, y + 4);
                }
                ctx.restore();
            }

            // Tiêu đề
            ctx.save();
            const title = 'PIN HẠT NHÂN BETAVOLT ⁶³₂₈Ni — NGUỒN MÁY TẠO NHỊP TIM';
            ctx.font = `800 15px 'Segoe UI', system-ui, sans-serif`;
            const titleW = Math.min(750, ctx.measureText(title).width + 24);
            roundBox(14, 10, titleW, 30, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, 26, 25);
            ctx.restore();

            const saw = (t * 0.28) % 1;

            ctx.save();
            // 1. Mô-đun pin hạt nhân siêu nhỏ Betavolt bên trái (khớp ảnh thật 096.png)
            roundBox(24, 56, 254, 152, 14, '#1e293b', '#94a3b8', 3);
            roundBox(40, 70, 222, 34, 6, '#0f172a', '#fbbf24', 1.8);
            ctx.fillStyle = '#fde68a';
            ctx.font = `800 15px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('BETAVOLT · Ni-63 · 3V', 151, 87);

            // Lớp nguồn phóng xạ Ni-63 và lớp bán dẫn thu dòng beta-
            roundBox(42, 118, 86, 72, 8, 'rgba(245, 158, 11, 0.22)', '#f59e0b', 2);
            drawNuclide('63', '28', 'Ni', 85, 144, '#fde68a', 17, 'center');
            ctx.fillStyle = '#fbbf24';
            ctx.font = `700 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('Tia β⁻', 85, 174);

            roundBox(162, 118, 100, 72, 8, 'rgba(16, 185, 129, 0.2)', '#10b981', 2);
            ctx.fillStyle = '#6ee7b7';
            ctx.font = `800 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('Bán dẫn', 212, 144);
            ctx.fillText('tạo dòng điện', 212, 168);

            // Dòng beta- bay 1 chiều từ Ni-63 sang lớp bán dẫn
            const bx = 130 + saw * 30;
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath(); ctx.arc(bx, 154, 4.5, 0, Math.PI * 2); ctx.fill();

            // Dây dẫn cấp điện cho máy tạo nhịp tim bên dưới
            arrowLine(151, 208, 151, 238, '#10b981', 3, 8);
            roundBox(36, 240, 230, 48, 10, '#0f172a', '#ef4444', 2.2);
            ctx.fillStyle = '#fca5a5';
            ctx.font = `800 15px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('Máy tạo nhịp tim (P ≥ 75%)', 151, 264);

            // 2. Đồ thị suy giảm công suất P(t)/P0 (giữa) + Thông số (phải)
            roundBox(298, 56, 468, 232, 10, '#0f172a', '#38bdf8', 2);
            const ox = 348, oy = 248, gxW = 180, gyH = 150;
            arrowLine(ox, oy + 4, ox, oy - gyH - 8, '#cbd5e1', 2.2, 7);
            arrowLine(ox - 4, oy, ox + gxW + 10, oy, '#cbd5e1', 2.2, 7);

            ctx.fillStyle = '#f8fafc';
            ctx.font = `800 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'left';
            drawSub('P/P', '0', ox + 8, oy - gyH, '#f8fafc', 15);
            ctx.fillText('t', ox + gxW + 4, oy + 18);

            ctx.textAlign = 'right';
            ctx.fillText('100%', ox - 6, oy - 130);
            ctx.fillStyle = '#6ee7b7';
            ctx.fillText('75%', ox - 6, oy - 97);
            ctx.fillStyle = '#fbbf24';
            ctx.fillText('50%', ox - 6, oy - 65);

            // Đường ngưỡng 75% nét đứt
            ctx.strokeStyle = '#10b981';
            ctx.setLineDash([5, 4]);
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(ox, oy - 97); ctx.lineTo(ox + gxW - 10, oy - 97); ctx.stroke();
            ctx.setLineDash([]);

            // Đường cong P(t)/P0 = 2^(-t/100)
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 3;
            ctx.beginPath();
            for (let u = 0; u <= 1; u += 0.03) {
                const px = ox + u * 165;
                const py = oy - 130 * Math.pow(0.5, u * 1.4);
                if (u === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            ctx.stroke();

            // Điểm chạy 1 chiều sawtooth
            const dotX = ox + saw * 150;
            const dotY = oy - 130 * Math.pow(0.5, saw * (150 / 165) * 1.4);
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath(); ctx.arc(dotX, dotY, 5.5, 0, Math.PI * 2); ctx.fill();

            // Chữ thông số đề dẫn bên phải đồ thị
            ctx.fillStyle = '#fbbf24';
            ctx.font = `800 15.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'left';
            ctx.fillText('THÔNG SỐ PIN', 548, 86);
            ctx.fillStyle = '#f8fafc';
            ctx.font = `700 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('• Chất nguồn: ⁶³₂₈Ni', 548, 120);
            ctx.fillText('• Chu kì: T = 100 năm', 548, 152);
            ctx.fillText('• Hạt nhân con: Đồng bền', 548, 184);
            ctx.fillStyle = '#6ee7b7';
            ctx.fillText('• Cần: P ≥ 75% ban đầu', 548, 216);
            ctx.fillStyle = '#fca5a5';
            ctx.fillText('• Bệnh nhân cấy: 50 tuổi', 548, 248);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 97 (MH-STAGING-C4-25 · VLXT-DS-VD28-097): Các ứng dụng thực tế của tia phóng xạ trong y học hạt nhân và bảo quản nông sản
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C4-25', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
            for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(x, y, bw, bh, r);
                else ctx.rect(x, y, bw, bh);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function drawGammaRay(x1, y1, x2, y2, color = '#a855f7') {
                const dx = x2 - x1, dy = y2 - y1;
                const len = Math.hypot(dx, dy);
                if (len < 10) return;
                const ang = Math.atan2(dy, dx);
                ctx.save();
                ctx.translate(x1, y1);
                ctx.rotate(ang);
                ctx.strokeStyle = color;
                ctx.lineWidth = 2.4;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                const waves = Math.max(2, Math.floor(len / 12));
                const bodyLen = len - 8;
                for (let i = 0; i <= waves * 4; i++) {
                    const px = (i / (waves * 4)) * bodyLen;
                    const py = Math.sin((i / 4) * Math.PI * 2) * 3.5;
                    ctx.lineTo(px, py);
                }
                ctx.lineTo(len, 0);
                ctx.stroke();
                ctx.fillStyle = color;
                ctx.beginPath(); ctx.moveTo(len, 0); ctx.lineTo(len - 7, -4); ctx.lineTo(len - 7, 4); ctx.closePath(); ctx.fill();
                ctx.restore();
            }

            // Tiêu đề
            ctx.save();
            const title = 'PHÓNG XẠ HẠT NHÂN & ỨNG DỤNG Y HỌC – NÔNG NGHIỆP';
            ctx.font = `800 15px 'Segoe UI', system-ui, sans-serif`;
            const titleW = ctx.measureText(title).width + 24;
            roundBox(14, 10, titleW, 30, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, 26, 25);
            ctx.restore();

            const saw = (t * 0.28) % 1;

            ctx.save();
            // Khung 1: Biến đổi hạt nhân tự phát (trái)
            roundBox(18, 54, 236, 236, 10, '#0f172a', '#fbbf24', 2.2);
            ctx.fillStyle = '#fbbf24';
            ctx.font = `800 15.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('1. PHÂN RÃ HẠT NHÂN', 136, 80);

            // Hạt nhân phóng xạ ở tâm
            const ncx = 136, ncy = 160;
            for (let k = 0; k < 8; k++) {
                const a = (k * Math.PI) / 4;
                ctx.fillStyle = k % 2 === 0 ? '#ef4444' : '#38bdf8';
                ctx.beginPath(); ctx.arc(ncx + Math.cos(a) * 12, ncy + Math.sin(a) * 12, 8, 0, Math.PI * 2); ctx.fill();
            }
            // Tia phóng xạ tỏa ra (1 chiều sawtooth)
            const rRay = 26 + saw * 42;
            drawGammaRay(ncx + 18, ncy - 12, ncx + rRay, ncy - rRay * 0.7, '#a855f7');
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath(); ctx.arc(ncx - 20 - saw * 36, ncy + 10 + saw * 24, 5, 0, Math.PI * 2); ctx.fill();

            ctx.fillStyle = '#f8fafc';
            ctx.font = `700 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('Biến đổi tự phát từ hạt nhân', 136, 238);
            ctx.fillStyle = '#cbd5e1';
            ctx.fillText('Điều kiện ngoài: T, p?', 136, 264);

            // Khung 2: Điều trị ung thư trong Y học (giữa)
            roundBox(272, 54, 236, 236, 10, '#0f172a', '#f472b6', 2.2);
            ctx.fillStyle = '#f472b6';
            ctx.font = `800 15.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('2. ĐIỀU TRỊ UNG THƯ', 390, 80);

            // Ống tiêm dược chất phóng xạ
            roundBox(318, 128, 92, 26, 5, 'rgba(244, 114, 182, 0.25)', '#f472b6', 2.2);
            ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 3;
            ctx.beginPath(); ctx.moveTo(298, 141); ctx.lineTo(318, 141); ctx.stroke(); // pít-tông
            ctx.beginPath(); ctx.moveTo(410, 141); ctx.lineTo(436, 141); ctx.stroke(); // kim tiêm
            // Cụm tế bào u
            ctx.fillStyle = 'rgba(239, 68, 68, 0.35)';
            ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(458, 141, 18, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

            ctx.fillStyle = '#f8fafc';
            ctx.font = `700 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('Uống hoặc tiêm dược chất', 390, 214);
            ctx.fillStyle = '#f9a8d4';
            ctx.fillText('Chứa đồng vị phóng xạ', 390, 240);
            ctx.fillStyle = '#6ee7b7';
            ctx.fillText('Tiêu diệt tế bào bệnh', 390, 266);

            // Khung 3: Chiếu xạ bảo quản thực phẩm & nông sản (phải)
            roundBox(526, 54, 240, 236, 10, '#0f172a', '#10b981', 2.2);
            ctx.fillStyle = '#10b981';
            ctx.font = `800 15.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('3. BẢO QUẢN NÔNG SẢN', 646, 80);

            // Nguồn chiếu tia phóng xạ phía trên băng chuyền
            roundBox(612, 104, 68, 22, 4, '#334155', '#a855f7', 2);
            drawGammaRay(632, 128, 632, 166, '#a855f7');
            drawGammaRay(660, 128, 660, 166, '#a855f7');

            // Băng chuyền & kiện thực phẩm chạy 1 chiều sawtooth
            ctx.strokeStyle = '#64748b'; ctx.lineWidth = 4;
            ctx.beginPath(); ctx.moveTo(552, 198); ctx.lineTo(740, 198); ctx.stroke();
            const boxX = 562 + saw * 130;
            roundBox(boxX, 170, 38, 26, 4, '#ca8a04', '#fde047', 1.8);

            ctx.fillStyle = '#f8fafc';
            ctx.font = `700 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('Chiếu tia diệt vi trùng', 646, 234);
            ctx.fillStyle = '#6ee7b7';
            ctx.fillText('Bảo quản thực phẩm', 646, 262);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 98 (MH-STAGING-C4-26 · VLXT-DS-VD28-098): Hệ thống băng chuyền chiếu xạ tia gamma nguồn ⁶⁰₂₇Co (2000 Ci) khử trùng nhộng ruồi (kỹ thuật SIT)
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C4-26', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
            for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(x, y, bw, bh, r);
                else ctx.rect(x, y, bw, bh);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function arrowLine(x1, y1, x2, y2, col, lw = 2.4, hl = 7) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }

            // Tiêu đề
            ctx.save();
            const title = 'CHIẾU XẠ TIA GAMMA (⁶⁰Co) THEO KỸ THUẬT SIT';
            roundBox(14, 12, 424, 30, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.font = `800 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, 26, 27);

            // Buồng mô phỏng bên trái
            roundBox(14, 52, 424, 240, 10, '#0f172a', '#334155', 1.8);

            // Hộp chắn chì chứa nguồn Co-60 ở phía trên
            const sx = 226;
            roundBox(sx - 96, 66, 192, 52, 8, '#1e293b', '#94a3b8', 2.4);
            // Cửa phát hướng xuống ở đáy hộp chì
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(sx - 44, 114, 88, 6);
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath(); ctx.arc(sx - 58, 92, 11, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#f8fafc';
            ctx.font = `800 15px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'left';
            ctx.fillText('Nguồn ⁶⁰₂₇Co', sx - 36, 92);

            // Chùm tia gamma chiếu từ hộp nguồn xuống băng chuyền (lệch nhấp nháy nhẹ + mũi tên)
            const waveOffset = (t * 28) % 24;
            [-36, 0, 36].forEach(dx => {
                ctx.strokeStyle = 'rgba(250, 204, 21, 0.85)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                for (let ry = 122; ry <= 178; ry += 4) {
                    const rx = sx + dx + Math.sin((ry - waveOffset) * 0.28) * 3.5;
                    if (ry === 122) ctx.moveTo(rx, ry); else ctx.lineTo(rx, ry);
                }
                ctx.stroke();
                arrowLine(sx + dx, 174, sx + dx, 188, '#fbbf24', 2.2, 6);
            });
            ctx.fillStyle = '#fde68a';
            ctx.font = `800 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'left';
            ctx.fillText('Chùm tia γ', sx + 54, 152);

            // Băng chuyền & con lăn
            const beltY = 232;
            roundBox(42, beltY, 368, 16, 8, '#1e293b', '#64748b', 2);
            const saw = (t * 0.22) % 1;
            const rot = saw * Math.PI * 4;
            for (let rx = 62; rx <= 390; rx += 54) {
                ctx.fillStyle = '#475569';
                ctx.strokeStyle = '#cbd5e1';
                ctx.lineWidth = 1.6;
                ctx.beginPath(); ctx.arc(rx, beltY + 8, 5.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(rx, beltY + 8);
                ctx.lineTo(rx + Math.cos(rot) * 5, beltY + 8 + Math.sin(rot) * 5);
                ctx.stroke();
            }

            // Khay nhộng 5 kg chạy 1 chiều sawtooth trên băng chuyền
            const trayX = 60 + saw * 240;
            const trayY = 196;
            const inBeam = Math.abs(trayX + 46 - sx) < 58;
            roundBox(trayX, trayY, 92, 34, 6, inBeam ? 'rgba(245, 158, 11, 0.28)' : 'rgba(56, 189, 248, 0.16)', inBeam ? '#fbbf24' : '#38bdf8', 2.2);
            ctx.fillStyle = '#f8fafc';
            ctx.font = `800 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText('m = 5 kg', trayX + 46, trayY + 18);

            // Chú thích phía dưới băng chuyền
            ctx.fillStyle = '#7dd3fc';
            ctx.font = `700 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText('Khay nhộng di chuyển qua vùng chiếu xạ →', 226, 272);
            ctx.restore();

            // Bảng dữ kiện bên phải (Zero Data Leakage — rộng 320px thoáng viền phải)
            ctx.save();
            roundBox(448, 12, 320, 280, 10, '#0f172a', '#fbbf24', 2);
            ctx.fillStyle = '#fbbf24';
            ctx.font = `800 15.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText('THÔNG SỐ HỆ THỐNG SIT', 464, 40);

            ctx.fillStyle = '#f8fafc';
            ctx.font = `700 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('• Nguồn gamma: ⁶⁰₂₇Co', 464, 76);
            ctx.fillText('• Độ phóng xạ: H₀ = 2000 Ci', 464, 106);
            ctx.fillText('• Chu kì bán rã: T = 5,27 năm', 464, 136);
            ctx.fillStyle = '#7dd3fc';
            ctx.fillText('• Năng lượng: E₀ = 2,5 MeV/phân rã', 464, 168);
            ctx.fillStyle = '#6ee7b7';
            ctx.fillText('• Khay nhộng: m = 5 kg', 464, 200);
            ctx.fillText('• Liều hấp thụ: 100 J/kg | H = 20%', 464, 230);
            ctx.fillStyle = '#cbd5e1';
            ctx.fillText('• 1 Ci = 3,7·10¹⁰ Bq ; 1 MeV = 1,6·10⁻¹³ J', 464, 264);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 99 (MH-STAGING-C4-27 · VLXT-DS-VD28-099): Quá trình phân rã mẫu 15,0 g Cobalt ⁶⁰₂₇Co tạo thành hạt nhân bền ⁶⁰₂₈Ni
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C4-27', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
            for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(x, y, bw, bh, r);
                else ctx.rect(x, y, bw, bh);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function arrowLine(x1, y1, x2, y2, col, lw = 2.8, hl = 8) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }

            function drawNuclide(A, Z, sym, x, y, col = '#f8fafc', fontSize = 18, align = 'left') {
                const idxSize = Math.max(13, Math.round(fontSize * 0.74));
                ctx.save();
                ctx.textBaseline = 'middle';
                ctx.font = `800 ${idxSize}px 'Segoe UI', system-ui, sans-serif`;
                const wA = A !== '' ? ctx.measureText(String(A)).width : 0;
                const wZ = Z !== '' ? ctx.measureText(String(Z)).width : 0;
                const idxW = Math.max(wA, wZ);
                const gap = idxW > 0 ? 2 : 0;
                ctx.font = `800 ${fontSize}px 'Segoe UI', system-ui, sans-serif`;
                const symW = ctx.measureText(sym).width;
                const totalW = idxW + gap + symW;
                let sx = x;
                if (align === 'center') sx = x - totalW / 2;
                else if (align === 'right') sx = x - totalW;
                ctx.fillStyle = col;
                ctx.textAlign = 'right';
                ctx.font = `800 ${idxSize}px 'Segoe UI', system-ui, sans-serif`;
                if (wA > 0) ctx.fillText(String(A), sx + idxW, y - Math.round(fontSize * 0.34));
                if (wZ > 0) ctx.fillText(String(Z), sx + idxW, y + Math.round(fontSize * 0.36));
                ctx.textAlign = 'left';
                ctx.font = `800 ${fontSize}px 'Segoe UI', system-ui, sans-serif`;
                ctx.fillText(sym, sx + idxW + gap, y);
                ctx.restore();
            }

            function drawSub(base, sub, x, y, col = '#f8fafc', baseSz = 16, align = 'left') {
                const subSz = Math.max(13, Math.round(baseSz * 0.78));
                ctx.save();
                ctx.fillStyle = col;
                ctx.textAlign = 'left';
                ctx.textBaseline = 'alphabetic';
                ctx.font = `800 ${baseSz}px 'Segoe UI', system-ui, sans-serif`;
                const bw = ctx.measureText(base).width;
                ctx.font = `800 ${subSz}px 'Segoe UI', system-ui, sans-serif`;
                const sw = sub ? ctx.measureText(sub).width : 0;
                const tot = bw + sw;
                let sx = x;
                if (align === 'center') sx = x - tot / 2;
                else if (align === 'right') sx = x - tot;
                ctx.font = `800 ${baseSz}px 'Segoe UI', system-ui, sans-serif`;
                ctx.fillText(base, sx, y);
                if (sub) {
                    ctx.font = `800 ${subSz}px 'Segoe UI', system-ui, sans-serif`;
                    ctx.fillText(sub, sx + bw + 1, y + 4);
                }
                ctx.restore();
            }

            // Tiêu đề
            ctx.save();
            const title = 'PHÂN RÃ PHÓNG XẠ COBALT-60 TẠO HẠT NHÂN BỀN NICKEL-60';
            ctx.font = `800 15px 'Segoe UI', system-ui, sans-serif`;
            const titleW = Math.min(750, ctx.measureText(title).width + 24);
            roundBox(14, 10, titleW, 30, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, 26, 25);
            ctx.restore();

            const saw = (t * 0.24) % 1;
            const fracRem = Math.pow(0.5, saw * 2); // giảm dần từ 1 -> 0.25
            const fracDaughter = 1 - fracRem;

            ctx.save();
            // 1. Sơ đồ biến đổi hạt nhân (trên trái)
            roundBox(18, 52, 412, 92, 10, '#0f172a', '#38bdf8', 2);
            roundBox(30, 68, 78, 60, 8, 'rgba(245, 158, 11, 0.2)', '#f59e0b', 2);
            drawNuclide('60', '27', 'Co', 69, 98, '#fde68a', 18, 'center');

            arrowLine(116, 106, 200, 106, '#38bdf8', 3, 8);
            ctx.fillStyle = '#7dd3fc';
            ctx.font = `700 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('T = 5,27 năm', 158, 80);

            roundBox(208, 68, 78, 60, 8, 'rgba(16, 185, 129, 0.2)', '#10b981', 2);
            drawNuclide('60', '28', 'Ni', 247, 98, '#6ee7b7', 18, 'center');

            ctx.fillStyle = '#f8fafc';
            ctx.font = `800 16px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('+', 304, 98);
            roundBox(322, 72, 92, 52, 8, '#1e293b', '#ef4444', 2);
            ctx.fillStyle = '#fca5a5';
            ctx.font = `800 15.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('Tia ?', 368, 98);

            // 2. Biểu đồ tỉ phần khối lượng mẫu (dưới trái)
            roundBox(18, 156, 412, 136, 10, '#0f172a', '#64748b', 2);
            ctx.fillStyle = '#f8fafc';
            ctx.font = `800 15px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'left';
            ctx.fillText('DIỄN BIẾN KHỐI LƯỢNG MẪU (15,0 g)', 36, 180);

            // Thanh Co-60 (chất mẹ giảm 1 chiều sawtooth)
            ctx.fillStyle = '#fde68a';
            ctx.font = `800 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('Co-60 còn lại:', 36, 214);
            roundBox(176, 200, 232, 26, 6, '#1e293b', '#475569', 1.6);
            roundBox(178, 202, Math.max(8, 228 * fracRem), 22, 4, '#f59e0b', null, 0);

            // Thanh Ni-60 (chất con tăng 1 chiều sawtooth)
            ctx.fillStyle = '#6ee7b7';
            ctx.fillText('Ni-60 tạo thành:', 36, 256);
            roundBox(176, 242, 232, 26, 6, '#1e293b', '#475569', 1.6);
            if (fracDaughter > 0.02) {
                roundBox(178, 244, Math.max(8, 228 * fracDaughter), 22, 4, '#10b981', null, 0);
            }

            // 3. Thẻ dữ kiện đề bài bên phải (Zero Data Leakage)
            roundBox(446, 52, 320, 240, 10, '#0f172a', '#fbbf24', 2);
            ctx.fillStyle = '#fbbf24';
            ctx.font = `800 15.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'left';
            ctx.fillText('THÔNG SỐ MẪU COBALT', 464, 78);

            drawSub('• Khối lượng đầu: m', '0', 464, 118, '#f8fafc', 15);
            ctx.fillStyle = '#f8fafc';
            ctx.font = `700 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('= 15,0 g', 626, 115);

            ctx.fillText('• Hạt nhân mẹ: ⁶⁰₂₇Co', 464, 150);
            ctx.fillText('• Chu kì bán rã: T = 5,27 năm', 464, 182);
            ctx.fillStyle = '#6ee7b7';
            ctx.fillText('• Hạt nhân con bền: ⁶⁰₂₈Ni', 464, 214);
            ctx.fillStyle = '#7dd3fc';
            ctx.fillText('• Mốc xét: t = 2,56 năm; 7,25 năm', 464, 246);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 100 (MH-STAGING-C4-28 · VLXT-DS-VD28-100): So sánh cấu tạo nucleon và độ hụt khối của hai hạt nhân A và B
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C4-28', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
            for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(x, y, bw, bh, r);
                else ctx.rect(x, y, bw, bh);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function drawSub(base, sub, x, y, col = '#f8fafc', baseSz = 16, align = 'left') {
                const subSz = Math.max(13, Math.round(baseSz * 0.78));
                ctx.save();
                ctx.fillStyle = col;
                ctx.textAlign = 'left';
                ctx.textBaseline = 'alphabetic';
                ctx.font = `800 ${baseSz}px 'Segoe UI', system-ui, sans-serif`;
                const bw = ctx.measureText(base).width;
                ctx.font = `800 ${subSz}px 'Segoe UI', system-ui, sans-serif`;
                const sw = sub ? ctx.measureText(sub).width : 0;
                const tot = bw + sw;
                let sx = x;
                if (align === 'center') sx = x - tot / 2;
                else if (align === 'right') sx = x - tot;
                ctx.font = `800 ${baseSz}px 'Segoe UI', system-ui, sans-serif`;
                ctx.fillText(base, sx, y);
                if (sub) {
                    ctx.font = `800 ${subSz}px 'Segoe UI', system-ui, sans-serif`;
                    ctx.fillText(sub, sx + bw + 1, y + 4);
                }
                ctx.restore();
            }

            function drawNucleusCluster(cx, cy, rOuter, seed, sawPhase, label, col) {
                // Vòng hạt nhân
                ctx.save();
                const pulse = 1 + 0.04 * sawPhase;
                ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
                ctx.strokeStyle = col;
                ctx.lineWidth = 2.6;
                ctx.beginPath(); ctx.arc(cx, cy, rOuter * pulse, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                // Các nucleon (proton đỏ + neutron xanh)
                for (let ring = 0; ring < 2; ring++) {
                    const cnt = ring === 0 ? 6 : 12;
                    const rr = ring === 0 ? 12 : 26;
                    for (let i = 0; i < cnt; i++) {
                        const ang = (i * Math.PI * 2) / cnt + seed + ring * 0.3;
                        const nx = cx + Math.cos(ang) * rr;
                        const ny = cy + Math.sin(ang) * rr;
                        ctx.fillStyle = (i + ring) % 2 === 0 ? '#ef4444' : '#38bdf8';
                        ctx.beginPath(); ctx.arc(nx, ny, 5.5, 0, Math.PI * 2); ctx.fill();
                    }
                }
                ctx.fillStyle = '#ef4444';
                ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI * 2); ctx.fill();
                // Nhãn tên hạt nhân
                roundBox(cx - 22, cy - rOuter - 28, 44, 24, 6, '#0f172a', col, 1.8);
                ctx.fillStyle = col;
                ctx.font = `800 16px 'Segoe UI', system-ui, sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(label, cx, cy - rOuter - 16);
                ctx.restore();
            }

            // Tiêu đề
            ctx.save();
            const title = 'SO SÁNH CẤU TẠO NUCLEON & ĐỘ HỤT KHỐI HAI HẠT NHÂN A, B';
            ctx.font = `800 15px 'Segoe UI', system-ui, sans-serif`;
            const titleW = Math.min(750, ctx.measureText(title).width + 24);
            roundBox(14, 10, titleW, 30, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, 26, 25);
            ctx.restore();

            const saw = (t * 0.35) % 1;

            ctx.save();
            // Thẻ Hạt nhân A (trái)
            roundBox(20, 52, 360, 238, 12, '#0f172a', '#38bdf8', 2.2);
            drawNucleusCluster(112, 162, 42, 0.2, saw, 'A', '#38bdf8');
            ctx.fillStyle = '#7dd3fc';
            ctx.font = `800 16px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText('HẠT NHÂN A', 180, 94);
            ctx.fillStyle = '#f8fafc';
            ctx.font = `700 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('• Số khối: 202 nucleon', 180, 134);
            ctx.fillText('• Gồm: 122 neutron', 180, 166);
            drawSub('• Độ hụt khối: Δm', 'A', 180, 202, '#fbbf24', 15);
            ctx.fillStyle = '#fbbf24';
            ctx.fillText('= 1,71228 u', 194, 230);

            // Chú thích màu nucleon góc dưới trái thẻ A
            ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(54, 264, 5.5, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#cbd5e1'; ctx.font = `700 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('Proton', 66, 265);
            ctx.fillStyle = '#38bdf8'; ctx.beginPath(); ctx.arc(146, 264, 5.5, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#cbd5e1';
            ctx.fillText('Neutron', 158, 265);

            // Thẻ Hạt nhân B (phải)
            roundBox(400, 52, 366, 238, 12, '#0f172a', '#10b981', 2.2);
            drawNucleusCluster(494, 162, 44, 0.9, saw, 'B', '#10b981');
            ctx.fillStyle = '#6ee7b7';
            ctx.font = `800 16px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'left';
            ctx.fillText('HẠT NHÂN B', 562, 94);
            ctx.fillStyle = '#f8fafc';
            ctx.font = `700 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('• Số khối: 204 nucleon', 562, 134);
            ctx.fillText('• Gồm: 80 proton', 562, 166);
            drawSub('• Độ hụt khối: Δm', 'B', 562, 202, '#fbbf24', 15);
            ctx.fillStyle = '#fbbf24';
            ctx.fillText('= 1,72675 u', 576, 230);

            ctx.fillStyle = '#cbd5e1';
            ctx.fillText('• 1 uc² = 931,5 MeV', 432, 265);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 101 (MH-STAGING-C4-29 · VLXT-DS-VD28-101): Quá trình phóng xạ α của đồng vị Uranium ²³⁸₉₂U (λ = 4,916·10⁻¹⁸ s⁻¹)
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C4-29', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
            for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(x, y, bw, bh, r);
                else ctx.rect(x, y, bw, bh);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function drawAlphaCluster(cx, cy, r = 6) {
                ctx.save();
                [[-r * 0.65, -r * 0.55, '#ef4444'], [r * 0.65, r * 0.55, '#ef4444'], [r * 0.65, -r * 0.55, '#38bdf8'], [-r * 0.65, r * 0.55, '#38bdf8']].forEach(([ox, oy, col]) => {
                    ctx.fillStyle = col;
                    ctx.beginPath(); ctx.arc(cx + ox, cy + oy, r, 0, Math.PI * 2); ctx.fill();
                });
                ctx.restore();
            }

            function drawNuclide(A, Z, sym, x, y, col = '#f8fafc', fontSize = 18, align = 'left') {
                const idxSize = Math.max(13, Math.round(fontSize * 0.74));
                ctx.save();
                ctx.textBaseline = 'middle';
                ctx.font = `800 ${idxSize}px 'Segoe UI', system-ui, sans-serif`;
                const wA = A !== '' ? ctx.measureText(String(A)).width : 0;
                const wZ = Z !== '' ? ctx.measureText(String(Z)).width : 0;
                const idxW = Math.max(wA, wZ);
                const gap = idxW > 0 ? 2 : 0;
                ctx.font = `800 ${fontSize}px 'Segoe UI', system-ui, sans-serif`;
                const symW = ctx.measureText(sym).width;
                const totalW = idxW + gap + symW;
                let sx = x;
                if (align === 'center') sx = x - totalW / 2;
                else if (align === 'right') sx = x - totalW;
                ctx.fillStyle = col;
                ctx.textAlign = 'right';
                ctx.font = `800 ${idxSize}px 'Segoe UI', system-ui, sans-serif`;
                if (wA > 0) ctx.fillText(String(A), sx + idxW, y - Math.round(fontSize * 0.34));
                if (wZ > 0) ctx.fillText(String(Z), sx + idxW, y + Math.round(fontSize * 0.36));
                ctx.textAlign = 'left';
                ctx.font = `800 ${fontSize}px 'Segoe UI', system-ui, sans-serif`;
                ctx.fillText(sym, sx + idxW + gap, y);
                ctx.restore();
            }

            function drawSub(base, sub, x, y, col = '#f8fafc', baseSz = 16, align = 'left') {
                const subSz = Math.max(13, Math.round(baseSz * 0.78));
                ctx.save();
                ctx.fillStyle = col;
                ctx.textAlign = 'left';
                ctx.textBaseline = 'alphabetic';
                ctx.font = `800 ${baseSz}px 'Segoe UI', system-ui, sans-serif`;
                const bw = ctx.measureText(base).width;
                ctx.font = `800 ${subSz}px 'Segoe UI', system-ui, sans-serif`;
                const sw = sub ? ctx.measureText(sub).width : 0;
                const tot = bw + sw;
                let sx = x;
                if (align === 'center') sx = x - tot / 2;
                else if (align === 'right') sx = x - tot;
                ctx.font = `800 ${baseSz}px 'Segoe UI', system-ui, sans-serif`;
                ctx.fillText(base, sx, y);
                if (sub) {
                    ctx.font = `800 ${subSz}px 'Segoe UI', system-ui, sans-serif`;
                    ctx.fillText(sub, sx + bw + 1, y + 4);
                }
                ctx.restore();
            }

            // Tiêu đề
            ctx.save();
            const title = 'PHÂN RÃ PHÓNG XẠ ALPHA CỦA URANIUM ²³⁸₉₂U';
            ctx.font = `800 15px 'Segoe UI', system-ui, sans-serif`;
            const titleW = ctx.measureText(title).width + 24;
            roundBox(14, 10, titleW, 30, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, 26, 25);
            ctx.restore();

            const saw = (t * 0.28) % 1;
            const cx = 192, cy = 152;

            ctx.save();
            roundBox(18, 52, 396, 238, 12, '#0f172a', '#10b981', 2);
            if (saw < 0.36) {
                // Giai đoạn trước phóng xạ: U-238
                ctx.fillStyle = 'rgba(245, 158, 11, 0.25)';
                ctx.strokeStyle = '#fbbf24';
                ctx.lineWidth = 3;
                ctx.beginPath(); ctx.arc(cx, cy, 40, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                drawNuclide('238', '92', 'U', cx, cy, '#ffffff', 19, 'center');
                ctx.fillStyle = '#fde68a';
                ctx.font = `800 15px 'Segoe UI', system-ui, sans-serif`;
                ctx.textAlign = 'center';
                ctx.fillText('Hạt nhân mẹ U-238', cx, cy + 68);
            } else {
                const p = (saw - 0.36) / 0.64;
                // Hạt nhân con X giật lùi nhẹ sang trái
                const xx = cx - 22 - p * 46;
                ctx.fillStyle = 'rgba(16, 185, 129, 0.25)';
                ctx.strokeStyle = '#10b981';
                ctx.lineWidth = 2.8;
                ctx.beginPath(); ctx.arc(xx, cy, 34, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                ctx.fillStyle = '#ffffff';
                ctx.font = `800 18px 'Segoe UI', system-ui, sans-serif`;
                ctx.textAlign = 'center';
                ctx.fillText('Hạt X', xx, cy);

                // Hạt alpha (cụm 2p + 2n) bay sang phải
                const ax = cx + 28 + p * 126;
                drawAlphaCluster(ax, cy, 6.5);
                ctx.fillStyle = '#fca5a5';
                ctx.font = `800 15.5px 'Segoe UI', system-ui, sans-serif`;
                ctx.fillText('Tia α', ax, cy - 28);

                ctx.fillStyle = '#6ee7b7';
                ctx.font = `800 15px 'Segoe UI', system-ui, sans-serif`;
                ctx.fillText('²³⁸₉₂U → X + α', cx, cy + 68);
            }
            ctx.fillStyle = '#94a3b8';
            ctx.font = `700 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText('Mẫu địa chất chứa Uranium-238', 216, 266);

            // Thẻ thông số đề bài bên phải (Zero Data Leakage)
            roundBox(430, 52, 336, 238, 10, '#0f172a', '#fbbf24', 2);
            ctx.fillStyle = '#fbbf24';
            ctx.font = `800 15.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'left';
            ctx.fillText('DỮ KIỆN PHÓNG XẠ U-238', 448, 78);

            drawNuclide('238', '92', 'U', 450, 114, '#fde68a', 17, 'left');
            ctx.fillStyle = '#f8fafc';
            ctx.font = `700 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('xảy ra phóng xạ α → X', 498, 116);

            ctx.fillText('• Hằng số λ = 4,916·10⁻¹⁸ s⁻¹', 448, 152);
            drawSub('• Khối lượng mẫu đầu: m', '0', 448, 186, '#7dd3fc', 15);
            ctx.fillStyle = '#7dd3fc';
            ctx.fillText('= 0,1 g', 650, 183);

            ctx.fillStyle = '#f8fafc';
            ctx.fillText('• Thời gian: t = 100 triệu năm', 448, 218);
            ctx.fillStyle = '#cbd5e1';
            ctx.fillText('• Quy ước: 1 năm = 365 ngày', 448, 250);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 102 (MH-STAGING-C4-30 · VLXT-DS-VD28-102): Định tuổi mẫu gỗ cổ theo phương pháp Carbon-14 của Willard F. Libby (N = N₀/3)
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C4-30', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
            for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(x, y, bw, bh, r);
                else ctx.rect(x, y, bw, bh);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function arrowLine(x1, y1, x2, y2, col, lw = 2.6, hl = 8) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }

            function drawSub(base, sub, x, y, col = '#f8fafc', baseSz = 16, align = 'left') {
                const subSz = Math.max(13, Math.round(baseSz * 0.78));
                ctx.save();
                ctx.fillStyle = col;
                ctx.textAlign = 'left';
                ctx.textBaseline = 'alphabetic';
                ctx.font = `800 ${baseSz}px 'Segoe UI', system-ui, sans-serif`;
                const bw = ctx.measureText(base).width;
                ctx.font = `800 ${subSz}px 'Segoe UI', system-ui, sans-serif`;
                const sw = sub ? ctx.measureText(sub).width : 0;
                const tot = bw + sw;
                let sx = x;
                if (align === 'center') sx = x - tot / 2;
                else if (align === 'right') sx = x - tot;
                ctx.font = `800 ${baseSz}px 'Segoe UI', system-ui, sans-serif`;
                ctx.fillText(base, sx, y);
                if (sub) {
                    ctx.font = `800 ${subSz}px 'Segoe UI', system-ui, sans-serif`;
                    ctx.fillText(sub, sx + bw + 1, y + 4);
                }
                ctx.restore();
            }

            // Tiêu đề
            ctx.save();
            const title = 'PHƯƠNG PHÁP ĐỊNH TUỔI CARBON-14 CỦA WILLARD F. LIBBY (N = N₀/3)';
            ctx.font = `800 15px 'Segoe UI', system-ui, sans-serif`;
            const titleW = Math.min(750, ctx.measureText(title).width + 24);
            roundBox(14, 10, titleW, 30, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, 26, 25);
            ctx.restore();

            const saw = (t * 0.24) % 1;

            ctx.save();
            // 1. Đồ thị suy giảm N(t) từ N0 -> N0/3 bên trái
            const ox = 72, oy = 258, gxW = 304, gyH = 176;
            arrowLine(ox, oy + 4, ox, oy - gyH - 12, '#f8fafc', 2.6, 8);
            arrowLine(ox - 4, oy, ox + gxW + 14, oy, '#f8fafc', 2.6, 8);

            ctx.fillStyle = '#f8fafc';
            ctx.font = `800 15px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText('N(¹⁴C)', ox + 8, oy - gyH - 8);
            ctx.textAlign = 'right';
            ctx.fillText('t (năm)', ox + gxW + 10, oy - 16);

            drawSub('N', '0', ox - 10, oy - 150, '#6ee7b7', 16, 'right');
            drawSub('N', '0', ox - 28, oy - 50, '#fbbf24', 15, 'right');
            ctx.fillStyle = '#fbbf24';
            ctx.font = `800 15px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'right';
            ctx.fillText('/3', ox - 8, oy - 50);

            // Đường cong mũ N(t) = N0 * 2^(-t/T)
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 3.4;
            ctx.beginPath();
            for (let u = 0; u <= 1; u += 0.025) {
                const px = ox + u * 270;
                const py = oy - 150 * Math.pow(0.5, u * 2.2);
                if (u === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            ctx.stroke();

            // Điểm khảo sát N = N0/3 (t/T = log2(3) ≈ 1.585 -> u = 1.585/2.2 = 0.72)
            const uEnd = Math.log2(3) / 2.2;
            const xEnd = ox + uEnd * 270;
            const yEnd = oy - 50;
            ctx.strokeStyle = '#fbbf24';
            ctx.setLineDash([5, 4]);
            ctx.lineWidth = 1.8;
            ctx.beginPath(); ctx.moveTo(ox, yEnd); ctx.lineTo(xEnd, yEnd); ctx.lineTo(xEnd, oy); ctx.stroke();
            ctx.setLineDash([]);
            ctx.fillStyle = '#fbbf24';
            ctx.textAlign = 'center';
            ctx.fillText('t (cần tìm)', xEnd, oy + 20);

            // Chấm chạy 1 chiều từ N0 xuống N0/3
            const uCur = saw * uEnd;
            const dotX = ox + uCur * 270;
            const dotY = oy - 150 * Math.pow(0.5, uCur * 2.2);
            ctx.fillStyle = '#10b981';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(dotX, dotY, 6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

            // 2. Sơ đồ cây sống -> mẫu gỗ cổ + Thông số bên phải (Zero Data Leakage)
            roundBox(436, 52, 330, 90, 10, '#0f172a', '#10b981', 2);
            ctx.fillStyle = '#6ee7b7';
            ctx.font = `800 15px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText('Cây sống (cân bằng khí quyển)', 601, 76);
            ctx.fillStyle = '#f8fafc';
            ctx.font = `700 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('Trao đổi ¹⁴₆C liên tục → Lượng N₀', 601, 108);

            roundBox(436, 154, 330, 138, 10, '#0f172a', '#fbbf24', 2);
            ctx.fillStyle = '#fbbf24';
            ctx.font = `800 15.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'left';
            ctx.fillText('THÔNG SỐ MẪU GỖ CỔ', 454, 180);
            ctx.fillStyle = '#f8fafc';
            ctx.font = `700 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('• Chu kì bán rã ¹⁴₆C: T = 5 730 năm', 454, 212);
            ctx.fillText('• Mẫu gỗ cổ còn lại: N = N₀ / 3', 454, 242);
            ctx.fillStyle = '#7dd3fc';
            ctx.fillText('• Quy ước: 1 năm = 365 ngày', 454, 272);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 103 (MH-STAGING-C4-31 · VLXT-DS-VD28-103): Khảo sát phân rã mẫu 125 g đồng vị phóng xạ Iodine ¹³¹₅₃I sau 14 ngày
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C4-31', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
            for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(x, y, bw, bh, r);
                else ctx.rect(x, y, bw, bh);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function arrowLine(x1, y1, x2, y2, col, lw = 2.6, hl = 8) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }

            function drawNuclide(A, Z, sym, x, y, col = '#f8fafc', fontSize = 18, align = 'left') {
                const idxSize = Math.max(13, Math.round(fontSize * 0.74));
                ctx.save();
                ctx.textBaseline = 'middle';
                ctx.font = `800 ${idxSize}px 'Segoe UI', system-ui, sans-serif`;
                const wA = A !== '' ? ctx.measureText(String(A)).width : 0;
                const wZ = Z !== '' ? ctx.measureText(String(Z)).width : 0;
                const idxW = Math.max(wA, wZ);
                const gap = idxW > 0 ? 2 : 0;
                ctx.font = `800 ${fontSize}px 'Segoe UI', system-ui, sans-serif`;
                const symW = ctx.measureText(sym).width;
                const totalW = idxW + gap + symW;
                let sx = x;
                if (align === 'center') sx = x - totalW / 2;
                else if (align === 'right') sx = x - totalW;
                ctx.fillStyle = col;
                ctx.textAlign = 'right';
                ctx.font = `800 ${idxSize}px 'Segoe UI', system-ui, sans-serif`;
                if (wA > 0) ctx.fillText(String(A), sx + idxW, y - Math.round(fontSize * 0.34));
                if (wZ > 0) ctx.fillText(String(Z), sx + idxW, y + Math.round(fontSize * 0.36));
                ctx.textAlign = 'left';
                ctx.font = `800 ${fontSize}px 'Segoe UI', system-ui, sans-serif`;
                ctx.fillText(sym, sx + idxW + gap, y);
                ctx.restore();
            }

            // Tiêu đề
            ctx.save();
            const title = 'MẪU ĐỒNG VỊ PHÓNG XẠ IODINE ¹³¹₅₃I (125 g · T = 8,02 NGÀY)';
            ctx.font = `800 15px 'Segoe UI', system-ui, sans-serif`;
            const titleW = ctx.measureText(title).width + 24;
            roundBox(14, 10, titleW, 30, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, 26, 25);
            ctx.restore();

            const saw = (t * 0.25) % 1;
            const curDay = saw * 14;
            const remainFrac = Math.pow(0.5, curDay / 8.02);

            ctx.save();
            // 1. Lọ mẫu dược chất phóng xạ I-131 trong hộp bảo vệ chì (trái)
            roundBox(26, 54, 180, 236, 10, '#0f172a', '#f472b6', 2);
            // Nắp lọ & thân lọ thủy tinh
            roundBox(86, 72, 60, 18, 4, '#64748b', '#cbd5e1', 2);
            roundBox(64, 90, 104, 118, 12, '#1e293b', '#94a3b8', 2.4);
            // Phần I-131 còn lại bên trong lọ co giảm theo thời gian t (0 -> 14 ngày)
            const fillH = Math.round(88 * remainFrac);
            ctx.fillStyle = 'rgba(244, 114, 182, 0.45)';
            ctx.fillRect(67, 205 - fillH, 98, fillH);
            drawNuclide('131', '53', 'I', 116, 148, '#fde68a', 20, 'center');

            // Hiển thị đồng hồ đếm ngày
            roundBox(46, 224, 140, 46, 8, '#020617', '#38bdf8', 1.8);
            ctx.fillStyle = '#7dd3fc';
            ctx.font = `800 15.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('t = ' + curDay.toFixed(1).replace('.', ',') + ' ngày', 116, 247);

            // 2. Đường cong phân rã 0 -> 14 ngày (giữa)
            const ox = 250, oy = 254, gxW = 180, gyH = 166;
            arrowLine(ox, oy + 4, ox, oy - gyH - 8, '#cbd5e1', 2.2, 7);
            arrowLine(ox - 4, oy, ox + gxW + 10, oy, '#cbd5e1', 2.2, 7);
            ctx.fillStyle = '#f8fafc';
            ctx.font = `800 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'left';
            ctx.fillText('H(t)', ox + 8, oy - gyH - 4);
            ctx.textAlign = 'right';
            ctx.fillText('t (ngày)', ox + gxW + 8, oy - 16);
            ctx.fillText('100%', ox - 6, oy - 140);

            ctx.strokeStyle = '#f472b6';
            ctx.lineWidth = 3;
            ctx.beginPath();
            for (let u = 0; u <= 1; u += 0.03) {
                const px = ox + u * 165;
                const py = oy - 140 * Math.pow(0.5, (u * 14) / 8.02);
                if (u === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            ctx.stroke();

            const dotX = ox + (curDay / 14) * 165;
            const dotY = oy - 140 * remainFrac;
            ctx.fillStyle = '#fbbf24';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(dotX, dotY, 5.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

            ctx.fillStyle = '#fbbf24';
            ctx.textAlign = 'center';
            ctx.fillText('14', ox + 165, oy + 20);

            // 3. Thẻ thông số đề bài bên phải (Zero Data Leakage)
            roundBox(454, 54, 312, 236, 10, '#0f172a', '#38bdf8', 2);
            ctx.fillStyle = '#38bdf8';
            ctx.font = `800 15.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'left';
            ctx.fillText('THÔNG SỐ MẪU IODINE', 472, 80);

            ctx.fillStyle = '#f8fafc';
            ctx.font = `700 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('• Đồng vị nguyên chất: ¹³¹₅₃I', 472, 114);
            ctx.fillText('• Khối lượng ban đầu: 125 g', 472, 146);
            ctx.fillText('• Chu kì bán rã: T = 8,02 ngày', 472, 178);
            ctx.fillText('• Khối lượng mol: M = 131 g/mol', 472, 210);
            ctx.fillStyle = '#f9a8d4';
            ctx.fillText('• Thời điểm xét: t = 14 ngày', 472, 242);
            ctx.fillStyle = '#6ee7b7';
            ctx.fillText('• Điều trị ung thư tuyến giáp', 472, 270);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 104 (MH-STAGING-C4-32 · VLXT-DS-VD28-104): Quá trình tổng hợp ba hạt nhân Helium ⁴₂He tạo thành Carbon ¹²₆C trong lõi ngôi sao
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C4-32', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
            for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(x, y, bw, bh, r);
                else ctx.rect(x, y, bw, bh);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function drawAlphaCluster(cx, cy, r = 6) {
                ctx.save();
                [[-r * 0.65, -r * 0.55, '#ef4444'], [r * 0.65, r * 0.55, '#ef4444'], [r * 0.65, -r * 0.55, '#38bdf8'], [-r * 0.65, r * 0.55, '#38bdf8']].forEach(([ox, oy, col]) => {
                    ctx.fillStyle = col;
                    ctx.beginPath(); ctx.arc(cx + ox, cy + oy, r, 0, Math.PI * 2); ctx.fill();
                });
                ctx.restore();
            }

            function drawNuclide(A, Z, sym, x, y, col = '#f8fafc', fontSize = 18, align = 'left') {
                const idxSize = Math.max(13, Math.round(fontSize * 0.74));
                ctx.save();
                ctx.textBaseline = 'middle';
                ctx.font = `800 ${idxSize}px 'Segoe UI', system-ui, sans-serif`;
                const wA = A !== '' ? ctx.measureText(String(A)).width : 0;
                const wZ = Z !== '' ? ctx.measureText(String(Z)).width : 0;
                const idxW = Math.max(wA, wZ);
                const gap = idxW > 0 ? 2 : 0;
                ctx.font = `800 ${fontSize}px 'Segoe UI', system-ui, sans-serif`;
                const symW = ctx.measureText(sym).width;
                const totalW = idxW + gap + symW;
                let sx = x;
                if (align === 'center') sx = x - totalW / 2;
                else if (align === 'right') sx = x - totalW;
                ctx.fillStyle = col;
                ctx.textAlign = 'right';
                ctx.font = `800 ${idxSize}px 'Segoe UI', system-ui, sans-serif`;
                if (wA > 0) ctx.fillText(String(A), sx + idxW, y - Math.round(fontSize * 0.34));
                if (wZ > 0) ctx.fillText(String(Z), sx + idxW, y + Math.round(fontSize * 0.36));
                ctx.textAlign = 'left';
                ctx.font = `800 ${fontSize}px 'Segoe UI', system-ui, sans-serif`;
                ctx.fillText(sym, sx + idxW + gap, y);
                ctx.restore();
            }

            // Tiêu đề
            ctx.save();
            const title = 'PHẢN ỨNG TỔNG HỢP HELIUM THÀNH CARBON TRONG NGÔI SAO';
            ctx.font = `800 15px 'Segoe UI', system-ui, sans-serif`;
            const titleW = Math.min(750, ctx.measureText(title).width + 24);
            roundBox(14, 10, titleW, 30, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, 26, 25);
            ctx.restore();

            const saw = (t * 0.3) % 1;
            const cx = 212, cy = 170;

            ctx.save();
            // Lõi ngôi sao bên trái
            ctx.fillStyle = 'rgba(245, 158, 11, 0.14)';
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 2.4;
            ctx.beginPath(); ctx.arc(cx, cy, 112, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

            if (saw < 0.55) {
                // 3 hạt He-4 lao vào tâm hợp nhất
                const p = saw / 0.55;
                const r = 74 * (1 - p * 0.78);
                const angles = [-Math.PI / 2, Math.PI / 6, (5 * Math.PI) / 6];
                angles.forEach((a) => {
                    const hx = cx + Math.cos(a) * r;
                    const hy = cy + Math.sin(a) * r;
                    drawAlphaCluster(hx, hy, 5.5);
                    drawNuclide('4', '2', 'He', hx, hy - 22, '#fde68a', 16, 'center');
                });
            } else {
                // Tạo thành hạt nhân C-12 + 7,27 MeV
                const p = (saw - 0.55) / 0.45;
                ctx.fillStyle = `rgba(254, 240, 138, ${(0.38 * (1 - p)).toFixed(2)})`;
                ctx.beginPath(); ctx.arc(cx, cy, 26 + p * 44, 0, Math.PI * 2); ctx.fill();

                ctx.fillStyle = 'rgba(16, 185, 129, 0.32)';
                ctx.strokeStyle = '#10b981';
                ctx.lineWidth = 2.8;
                ctx.beginPath(); ctx.arc(cx, cy, 28, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                drawNuclide('12', '6', 'C', cx, cy, '#ffffff', 18, 'center');

                ctx.fillStyle = '#fbbf24';
                ctx.font = `800 15.5px 'Segoe UI', system-ui, sans-serif`;
                ctx.textAlign = 'center';
                ctx.fillText('+ 7,27 MeV', cx, cy - 52);
            }

            // Thẻ thông số ngôi sao bên phải (Zero Data Leakage)
            roundBox(414, 52, 352, 240, 10, '#0f172a', '#fbbf24', 2);
            ctx.fillStyle = '#fbbf24';
            ctx.font = `800 15.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'left';
            ctx.fillText('THÔNG SỐ QUÁ TRÌNH TRONG SAO', 432, 78);

            ctx.fillStyle = '#f8fafc';
            ctx.font = `700 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('• Phản ứng: ⁴₂He + ⁴₂He + ⁴₂He → ¹²₆C', 432, 114);
            ctx.fillStyle = '#fde68a';
            ctx.fillText('  kèm năng lượng 7,27 MeV', 432, 142);
            ctx.fillStyle = '#f8fafc';
            ctx.fillText('• Khối lượng ⁴₂He: 4,6·10³² kg', 432, 176);
            ctx.fillStyle = '#7dd3fc';
            ctx.fillText('• Công suất bức xạ: P = 5,3·10³⁰ W', 432, 208);
            ctx.fillStyle = '#f8fafc';
            ctx.fillText('• Khối lượng mol ⁴₂He: 4 g/mol', 432, 240);
            ctx.fillStyle = '#6ee7b7';
            ctx.fillText('• Quy ước: 1 năm = 365,25 ngày', 432, 270);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 105 (MH-STAGING-C4-33 · VLXT-DS-VD28-105): Chuỗi chuyển hóa năng lượng hạt nhân ²³⁵₉₂U thành điện năng 500 MW với hiệu suất 20%
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C4-33', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
            for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(x, y, bw, bh, r);
                else ctx.rect(x, y, bw, bh);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function arrowLine(x1, y1, x2, y2, col, lw = 2.8, hl = 8) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }

            function drawNuclide(A, Z, sym, x, y, col = '#f8fafc', fontSize = 18, align = 'left') {
                const idxSize = Math.max(13, Math.round(fontSize * 0.74));
                ctx.save();
                ctx.textBaseline = 'middle';
                ctx.font = `800 ${idxSize}px 'Segoe UI', system-ui, sans-serif`;
                const wA = A !== '' ? ctx.measureText(String(A)).width : 0;
                const wZ = Z !== '' ? ctx.measureText(String(Z)).width : 0;
                const idxW = Math.max(wA, wZ);
                const gap = idxW > 0 ? 2 : 0;
                ctx.font = `800 ${fontSize}px 'Segoe UI', system-ui, sans-serif`;
                const symW = ctx.measureText(sym).width;
                const totalW = idxW + gap + symW;
                let sx = x;
                if (align === 'center') sx = x - totalW / 2;
                else if (align === 'right') sx = x - totalW;
                ctx.fillStyle = col;
                ctx.textAlign = 'right';
                ctx.font = `800 ${idxSize}px 'Segoe UI', system-ui, sans-serif`;
                if (wA > 0) ctx.fillText(String(A), sx + idxW, y - Math.round(fontSize * 0.34));
                if (wZ > 0) ctx.fillText(String(Z), sx + idxW, y + Math.round(fontSize * 0.36));
                ctx.textAlign = 'left';
                ctx.font = `800 ${fontSize}px 'Segoe UI', system-ui, sans-serif`;
                ctx.fillText(sym, sx + idxW + gap, y);
                ctx.restore();
            }

            // Tiêu đề
            ctx.save();
            const title = 'CHUYỂN HÓA NĂNG LƯỢNG NHÀ MÁY ĐIỆN HẠT NHÂN 500 MW';
            ctx.font = `800 15px 'Segoe UI', system-ui, sans-serif`;
            const titleW = ctx.measureText(title).width + 24;
            roundBox(14, 10, titleW, 30, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, 26, 25);
            ctx.restore();

            const saw = (t * 0.28) % 1;

            ctx.save();
            // 1. Sơ đồ dòng chuyển hóa năng lượng (bên trái)
            // Hộp 1: Nhiên liệu U-235
            roundBox(20, 68, 120, 104, 10, '#0f172a', '#f59e0b', 2.4);
            drawNuclide('235', '92', 'U', 80, 104, '#fde68a', 20, 'center');
            ctx.fillStyle = '#f8fafc';
            ctx.font = `700 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Phân hạch', 80, 144);

            arrowLine(142, 120, 178, 120, '#fbbf24', 3, 8);

            // Hộp 2: Lò phản ứng & Tua-bin (H = 20%)
            roundBox(182, 68, 124, 104, 10, '#0f172a', '#38bdf8', 2.4);
            ctx.fillStyle = '#38bdf8';
            ctx.font = `800 15px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('Tổ máy phát', 244, 102);
            ctx.fillStyle = '#7dd3fc';
            ctx.fillText('H = 20%', 244, 138);

            // Nhánh nhiệt hao phí 80% đi xuống
            arrowLine(244, 174, 244, 226, '#ef4444', 2.6, 8);
            roundBox(176, 228, 136, 50, 8, '#1e293b', '#ef4444', 2);
            ctx.fillStyle = '#fca5a5';
            ctx.font = `700 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('Tỏa nhiệt làm mát', 244, 253);

            arrowLine(308, 120, 344, 120, '#10b981', 3, 8);

            // Hộp 3: Công suất điện phát 500 MW
            roundBox(348, 68, 94, 104, 10, '#0f172a', '#10b981', 2.4);
            ctx.fillStyle = '#6ee7b7';
            ctx.font = `800 15.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('Điện năng', 395, 102);
            ctx.fillStyle = '#fbbf24';
            ctx.fillText('500 MW', 395, 138);

            // Hạt xung năng lượng chạy 1 chiều sawtooth trên các mũi tên nối khối
            ctx.fillStyle = '#fef08a';
            ctx.beginPath(); ctx.arc(144 + saw * 30, 120, 4.5, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(310 + saw * 30, 120, 4.5, 0, Math.PI * 2); ctx.fill();

            // 2. Thẻ thông số đề bài bên phải (Zero Data Leakage)
            roundBox(458, 52, 308, 240, 10, '#0f172a', '#fbbf24', 2);
            ctx.fillStyle = '#fbbf24';
            ctx.font = `800 15.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'left';
            ctx.fillText('THÔNG SỐ NHÀ MÁY', 476, 78);

            ctx.fillStyle = '#f8fafc';
            ctx.font = `700 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('• Nhiên liệu: ²³⁵₉₂U (235 g/mol)', 476, 114);
            ctx.fillText('• Công suất điện: P = 500 MW', 476, 146);
            ctx.fillStyle = '#7dd3fc';
            ctx.fillText('• Hiệu suất: H = 20%', 476, 178);
            ctx.fillStyle = '#fde68a';
            ctx.fillText('• 1 phân hạch: 3,20·10⁻¹¹ J', 476, 210);
            ctx.fillStyle = '#6ee7b7';
            ctx.fillText('• Các mốc: 1 giờ; 1 g; 365 ngày', 476, 244);
            ctx.restore();
        });

    // =========================================================================
    // CÂU 106 (MH-STAGING-C4-34 · VLXT-DS-VD28-106): Thí nghiệm tán xạ hạt α bắn qua lá vàng mỏng và các góc lệch lớn hơn 90°
    // =========================================================================
    window.VLXTModels.register('MH-STAGING-C4-34', function(ctx, w, h, t) {
            ctx.clearRect(0, 0, w, h);
            const bg = ctx.createLinearGradient(0, 0, 0, h);
            bg.addColorStop(0, '#060b19');
            bg.addColorStop(1, '#0a1226');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);

            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
            ctx.lineWidth = 1;
            for (let gx = 20; gx < w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
            for (let gy = 20; gy < h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
            ctx.restore();

            function roundBox(x, y, bw, bh, r, fill, stroke, lw = 2) {
                ctx.save();
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(x, y, bw, bh, r);
                else ctx.rect(x, y, bw, bh);
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
                ctx.restore();
            }

            function arrowLine(x1, y1, x2, y2, col, lw = 2.6, hl = 8) {
                const ang = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
                ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
                ctx.closePath(); ctx.fill();
                ctx.restore();
            }

            function drawAlphaCluster(cx, cy, r = 4.5) {
                ctx.save();
                [[-r * 0.65, -r * 0.55, '#ef4444'], [r * 0.65, r * 0.55, '#ef4444'], [r * 0.65, -r * 0.55, '#38bdf8'], [-r * 0.65, r * 0.55, '#38bdf8']].forEach(([ox, oy, col]) => {
                    ctx.fillStyle = col;
                    ctx.beginPath(); ctx.arc(cx + ox, cy + oy, r, 0, Math.PI * 2); ctx.fill();
                });
                ctx.restore();
            }

            // Tiêu đề
            ctx.save();
            const title = 'THÍ NGHIỆM TÁN XẠ HẠT ALPHA BẮN QUA LÁ VÀNG MỎNG';
            ctx.font = `800 15px 'Segoe UI', system-ui, sans-serif`;
            const titleW = ctx.measureText(title).width + 24;
            roundBox(14, 10, titleW, 30, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(title, 26, 25);
            ctx.restore();

            const saw = (t * 0.3) % 1;

            ctx.save();
            // 1. Sơ đồ thí nghiệm vĩ mô (bên trái)
            const foilX = 248, foilY = 166;
            // Hộp chì chứa nguồn hạt alpha
            roundBox(26, foilY - 26, 78, 52, 6, '#334155', '#94a3b8', 2.4);
            ctx.fillStyle = '#060b19'; ctx.fillRect(88, foilY - 8, 18, 16);
            ctx.fillStyle = '#f59e0b';
            ctx.beginPath(); ctx.arc(62, foilY, 10, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#fde68a';
            ctx.font = `800 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Nguồn α', 65, foilY - 42);

            // Màn huỳnh quang ZnS vòng cung
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.arc(foilX, foilY, 84, -Math.PI * 0.76, Math.PI * 0.76, false);
            ctx.stroke();

            // Lá vàng mỏng + nhãn đặt ngoài cung ZnS có đường chỉ dẫn (Zero Text-Line Overlap)
            ctx.fillStyle = '#fbbf24';
            ctx.fillRect(foilX - 3, foilY - 34, 6, 68);
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 1.8;
            ctx.beginPath(); ctx.moveTo(foilX, foilY - 34); ctx.lineTo(foilX + 52, foilY - 98); ctx.stroke();
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath(); ctx.arc(foilX, foilY - 34, 3.5, 0, Math.PI * 2); ctx.fill();
            roundBox(foilX + 46, foilY - 114, 118, 28, 6, '#0f172a', '#fbbf24', 1.8);
            ctx.fillStyle = '#fde68a';
            ctx.fillText('Lá vàng mỏng', foilX + 105, foilY - 100);

            // Chùm tia đi thẳng & tán xạ góc nhỏ & bật ngược > 90 độ
            ctx.strokeStyle = 'rgba(16, 185, 129, 0.85)';
            ctx.lineWidth = 2.6;
            ctx.beginPath(); ctx.moveTo(98, foilY); ctx.lineTo(foilX + 80, foilY); ctx.stroke();

            ctx.strokeStyle = '#fbbf24';
            ctx.beginPath();
            ctx.moveTo(foilX, foilY); ctx.lineTo(foilX + 64, foilY - 54);
            ctx.moveTo(foilX, foilY); ctx.lineTo(foilX + 64, foilY + 54);
            ctx.stroke();

            ctx.strokeStyle = '#ef4444';
            ctx.beginPath();
            ctx.moveTo(foilX, foilY); ctx.lineTo(foilX - 54, foilY - 62);
            ctx.stroke();

            // Hạt alpha chuyển động 1 chiều sawtooth
            const ax = 98 + saw * (foilX + 74 - 98);
            drawAlphaCluster(ax, foilY, 4.2);

            ctx.fillStyle = '#fca5a5';
            ctx.font = `800 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('Góc lệch > 90°', foilX - 102, foilY - 96);
            ctx.fillStyle = '#7dd3fc';
            ctx.fillText('Màn ZnS', foilX + 78, foilY + 102);

            // 2. Góc nhìn vi mô tương tác Coulomb với hạt nhân vàng (bên phải)
            roundBox(414, 52, 352, 238, 12, '#0f172a', '#fbbf24', 2);
            ctx.fillStyle = '#fbbf24';
            ctx.font = `800 15px 'Segoe UI', system-ui, sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText('TƯƠNG TÁC TĨNH ĐIỆN TRONG NGUYÊN TỬ', 590, 76);

            const auX = 612, auY = 176;
            // Vùng nguyên tử vàng nét đứt
            ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
            ctx.setLineDash([5, 4]);
            ctx.lineWidth = 1.6;
            ctx.beginPath(); ctx.arc(auX, auY, 76, 0, Math.PI * 2); ctx.stroke();
            ctx.setLineDash([]);

            // Hạt nhân mang điện dương
            ctx.fillStyle = '#ef4444';
            ctx.strokeStyle = '#fca5a5';
            ctx.lineWidth = 2.4;
            ctx.beginPath(); ctx.arc(auX, auY, 15, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#ffffff';
            ctx.font = `800 15px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('+', auX, auY + 1);

            // Quỹ đạo các hạt alpha: xa đi thẳng, gần lệch cong, trực diện bật ngược
            arrowLine(444, auY - 56, 730, auY - 56, '#10b981', 2.4, 7);
            arrowLine(444, auY + 56, 730, auY + 56, '#10b981', 2.4, 7);

            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 2.4;
            ctx.beginPath();
            ctx.moveTo(444, auY - 22);
            ctx.quadraticCurveTo(auX - 24, auY - 22, auX + 76, auY - 82);
            ctx.stroke();

            // Hạt trực diện tiến sát và bật ngược (1 chiều sawtooth)
            const hx = saw < 0.5 ? (444 + (saw / 0.5) * (auX - 28 - 444)) : ((auX - 28) - ((saw - 0.5) / 0.5) * (auX - 28 - 444));
            ctx.strokeStyle = '#ef4444';
            ctx.setLineDash([4, 3]);
            ctx.beginPath(); ctx.moveTo(444, auY); ctx.lineTo(auX - 28, auY); ctx.stroke();
            ctx.setLineDash([]);
            drawAlphaCluster(hx, auY, 4);

            ctx.fillStyle = '#e2e8f0';
            ctx.font = `700 14.5px 'Segoe UI', system-ui, sans-serif`;
            ctx.fillText('Đa số đi thẳng · Rất ít bật ngược', 590, 272);
            ctx.restore();
        });

    console.log('[VLXT] Registered 106/106 Bespoke Self-Contained Staging Canvas Models.');

    // Captions chuẩn tiếng Việt cho 106 mô hình Đúng/Sai đợt mới
    window.VLXT_DS106_CAPTIONS = {
    "MH-STAGING-C1-01": "Thí nghiệm hơ nóng ống nghiệm đậy nút bấc trên giá đỡ (4 dụng cụ)",
    "MH-STAGING-C1-02": "Đồ thị nhiệt độ t (°C) theo thời gian τ (phút) khi nung nóng thỏi chì 1 kg",
    "MH-STAGING-C1-03": "Hệ thống sấy lạnh & sấy thăng hoa đông trùng hạ thảo",
    "MH-STAGING-C1-04": "Đồ thị nung chảy khối kim loại 13,2 kg bằng lò hồ quang điện",
    "MH-STAGING-C1-05": "Thí nghiệm so sánh sự bay hơi (nắng gió) và sự đun sôi nước tới cạn",
    "MH-STAGING-C1-06": "Hai nhiệt kế thủy ngân giống nhau nhúng trong hai cốc nước A và B",
    "MH-STAGING-C1-07": "Nhiệt kế phòng chia hai thang đo Celsius (°C) và Fahrenheit (°F)",
    "MH-STAGING-C1-08": "Đồ thị nhiệt độ – thời gian khi đun nóng chất lỏng đến nhiệt độ sôi 80 °C",
    "MH-STAGING-C1-09": "Máy hàn điện xung có biến áp hạ áp làm nóng chảy cuộn dây thiếc – chì",
    "MH-STAGING-C1-10": "Đồ thị trao đổi nhiệt giữa 200 g nước đá (−8 °C) và nước (35 °C)",
    "MH-STAGING-C1-11": "Khảo sát tốc độ giảm nhiệt độ của 2 kg nước theo 3 chế độ gió",
    "MH-STAGING-C1-12": "Bộ thí nghiệm đo nhiệt nóng chảy riêng của nước đá (có bù nhiệt môi trường)",
    "MH-STAGING-C1-13": "Thí nghiệm đun cách thủy và đồ thị nóng chảy của băng phiến (60 °C – 86 °C)",
    "MH-STAGING-C1-14": "Quạt hơi nước làm mát không khí trong phòng kín (4 m × 5 m × 4 m)",
    "MH-STAGING-C1-15": "So sánh cơ chế bay hơi trên mặt thoáng và sôi trong lòng chất lỏng",
    "MH-STAGING-C1-16": "Đồ thị nhiệt độ – thời gian của chì qua hai giai đoạn nóng chảy (327 °C) và sôi (1749 °C)",
    "MH-STAGING-C1-17": "Cân bằng nhiệt giữa 0,5 kg nước đá (−20 °C) và 0,5 kg nước (30 °C)",
    "MH-STAGING-C1-18": "Thí nghiệm xác định nhiệt nóng chảy riêng của nước đá với nguồn nhiệt 25 W và cân điện tử",
    "MH-STAGING-C1-19": "Bảng nhiệt dung riêng một số chất & So sánh độ tăng nhiệt độ khi cấp cùng nhiệt lượng",
    "MH-STAGING-C1-20": "Đo nhiệt dung riêng và nhiệt nóng chảy riêng của nước đá bằng hai lần trao đổi nhiệt",
    "MH-STAGING-C1-21": "Đun nóng đẳng tích khối khí Helium lý tưởng trong bình kín 2 lít",
    "MH-STAGING-C1-22": "Thí nghiệm đo nhiệt hóa hơi riêng của nước với bộ đun nhúng 100 W trên cân điện tử",
    "MH-STAGING-C1-23": "Cân bằng nhiệt khi pha chế ly trà sữa từ 3 nguyên liệu (trà ô long, nước đường, sữa tươi)",
    "MH-STAGING-C1-24": "Truyền nhiệt & cân bằng nhiệt qua 2 lần rót nước giữa hai bình cách nhiệt",
    "MH-STAGING-C1-25": "So sánh bay hơi và cân bằng động ngưng tụ ở ly nước không đậy và ly đậy màng bọc thực phẩm",
    "MH-STAGING-C1-26": "Hoạt động nóng chảy ngắt mạch của cầu chì ống (dây chì 2 g)",
    "MH-STAGING-C1-27": "Lò điện công suất 2,5 kW (hiệu suất 60%) nấu chảy hợp kim đồng 0,8 kg và bạc 0,2 kg",
    "MH-STAGING-C1-28": "Khảo sát tốc độ làm nguội nước nóng trong hai chậu: để nguội tự nhiên (không gió) và thổi quạt gió",
    "MH-STAGING-C1-29": "Thí nghiệm làm tan chảy đá vụn trong phễu bằng nguồn nóng 17 W và cân điện tử",
    "MH-STAGING-C1-30": "Thả liên tiếp hai quả cầu kim loại (210 °C và 150 °C) vào nhiệt lượng kế chứa nước ở 20 °C",
    "MH-STAGING-C1-31": "Khảo sát nhiệt độ theo thời gian của mẫu chất rắn được cấp nhiệt liên tục công suất 200 W",
    "MH-STAGING-C1-32": "Đồ thị nhiệt độ theo thời gian của nước khi đun nóng đến sôi và để nguội (0 đến 20 phút)",
    "MH-STAGING-C1-33": "Thí nghiệm đo nhiệt nóng chảy riêng của nước đá với nguồn nhiệt 56 W và bảng số liệu cân trong 485 s",
    "MH-STAGING-C2-01": "Thí nghiệm đo áp suất khí quyển bằng ống thủy tinh có nút kín N và khóa đáy k",
    "MH-STAGING-C2-02": "Thí nghiệm kiểm chứng định luật Charles với giọt acid sulfuric trong ống thủy tinh",
    "MH-STAGING-C2-03": "Hơ nóng chậm khí lí tưởng trong xilanh nằm ngang có pít-tông chuyển động tự do sang phải",
    "MH-STAGING-C2-04": "Chu trình 1–2–3–4–1 của khí Helium trên đồ thị (P, V) với P₀ = 10⁵ Pa, V₀ = 2 lít",
    "MH-STAGING-C2-05": "Hệ thống túi khí an toàn ô tô bơm căng khí N₂ (V ≈ 60 lít, t = 25°C, áp suất tối đa 5 psi)",
    "MH-STAGING-C2-06": "Sơ đồ thí nghiệm nghiên cứu mối liên hệ giữa áp suất và thể tích ở nhiệt độ không đổi",
    "MH-STAGING-C2-07": "Bóng thám không bơm khí Hydrogen (d = 3 m; m_vỏ = 4 kg) bay lên cân bằng ở độ cao h",
    "MH-STAGING-C2-08": "Truyền động đĩa–líp xe đạp và bơm tay bơm khí đẳng nhiệt vào xăm xe",
    "MH-STAGING-C2-09": "Không khí trong ngôi nhà V = 40 m³ nóng lên từ 20°C đến 25°C ở áp suất 1 atm",
    "MH-STAGING-C2-10": "Túi khí tay lái ô tô phân hủy 87 g NaN₃ giải phóng khí N₂ làm phồng túi",
    "MH-STAGING-C2-11": "Bình áp chứa nước gia dụng 360 lít (h₁ = 13,5 m; h₂ = 1 m; p₀ = 10 m cột nước)",
    "MH-STAGING-C2-12": "Đồ thị chu trình biến đổi trạng thái (1) – (2) – (3) trong hệ tọa độ V – T",
    "MH-STAGING-C2-13": "Xi lanh thép nằm ngang có ma sát pít-tông: dãn nở 30 cm rồi co lại 25 cm",
    "MH-STAGING-C2-14": "Nén đẳng nhiệt 0,1 mol khí Helium trong xi lanh đứng bằng quả nặng 15 kg",
    "MH-STAGING-C2-15": "Hệ thống cảnh báo nhiệt độ kho lạnh bằng xi lanh khí, đòn bẩy AOB và cân điện tử",
    "MH-STAGING-C2-16": "Đun nóng từ từ khối khí trong xi lanh thẳng đứng từ 27°C đến 97°C (quá trình đẳng áp)",
    "MH-STAGING-C2-17": "Đồ thị chu trình p – V gồm đẳng áp (1–2), đẳng nhiệt (2–3), đẳng tích (3–4) và đẳng nhiệt (4–1)",
    "MH-STAGING-C2-18": "Quá trình biến đổi đoạn thẳng p – V từ (1) đến (2) của 1 mol khí Helium",
    "MH-STAGING-C2-19": "Ống chữ U chứa thủy ngân nối bình khí nén Kripton (5 atm) ở nhánh trái bịt kín",
    "MH-STAGING-C2-20": "Khí quyển trên đỉnh Everest: so sánh động năng phân tử, tốc độ căn quân phương và mật độ khí",
    "MH-STAGING-C2-21": "Bình khí nén sửa xe máy đặt ngoài trời nắng: nung nóng đẳng tích từ 300 K lên 360 K",
    "MH-STAGING-C3-01": "Thí nghiệm đo cảm ứng từ bằng lực kế treo khung dây có đoạn PQ giữa hai cực nam châm",
    "MH-STAGING-C3-02": "Khung dây chữ nhật ABCD mang dòng điện quay trong từ trường đều (ngẫu lực từ)",
    "MH-STAGING-C3-03": "Bộ thu (pickup) của đàn ghi-ta điện: dây kim loại nhiễm từ dao động trên cuộn dây",
    "MH-STAGING-C3-04": "Cấu tạo loa điện động (hình a) và đồ thị điện áp tín hiệu âm thanh theo thời gian (hình b)",
    "MH-STAGING-C3-05": "Từ trường quanh dây dẫn thẳng dài mang dòng điện hướng ra mặt phẳng hình vẽ",
    "MH-STAGING-C3-06": "Đưa cực Bắc thanh nam châm lại gần cuộn dây nối điện kế (định luật Lenz)",
    "MH-STAGING-C3-07": "Tương tác từ hút nhau giữa hai dây dẫn song song mang dòng điện cùng chiều",
    "MH-STAGING-C3-08": "Con lăn kim loại trên hai thanh ray nằm trong khe nam châm chữ U nối nguồn một chiều",
    "MH-STAGING-C3-09": "Máy phát điện xoay chiều gia đình (220 V hiệu dụng) và quy tắc an toàn vận hành",
    "MH-STAGING-C3-10": "Đồ thị từ thông Φ(t) và suất điện động e(t) của khung dây 500 vòng quay đều",
    "MH-STAGING-C3-11": "Sự lan truyền của sóng điện từ (E, B dao động vuông góc và cùng pha)",
    "MH-STAGING-C3-12": "Thiết bị cân từ trường cân bằng lực từ trên cuộn dây 50 vòng (d = 5 cm)",
    "MH-STAGING-C3-13": "Hệ thống phanh tái sinh xe điện (Chế độ lái động cơ ↔ Chế độ tái sinh máy phát)",
    "MH-STAGING-C3-14": "Ngẫu lực từ tác dụng lên khung dây chữ nhật ABCD (L × d) trong từ trường đều",
    "MH-STAGING-C3-15": "Vòng dây tròn bán kính 25 cm đặt vuông góc từ trường biến thiên B = kt",
    "MH-STAGING-C3-16": "Máy phát điện xoay chiều một pha & đồ thị suất điện động e(t)",
    "MH-STAGING-C3-17": "Thanh dẫn MN trượt đều trên khung chữ nhật kín ABCD trong từ trường B",
    "MH-STAGING-C3-18": "Thí nghiệm đo cảm ứng từ nam châm chữ U trên cân điện tử & đồ thị m(I)",
    "MH-STAGING-C4-01": "So sánh cấu tạo và năng lượng liên kết riêng của Uranium, Calcium và Iron",
    "MH-STAGING-C4-02": "Độ hụt khối và năng lượng liên kết riêng của hạt nhân bán dẫn Silicon-28",
    "MH-STAGING-C4-03": "Liệu trình xạ trị ung thư tuyến giáp bằng đồng vị phóng xạ Iodine-131 (50 mg; T = 8 ngày)",
    "MH-STAGING-C4-04": "Phương pháp pha loãng đồng vị phóng xạ Sodium-24 xác định thể tích bình kín cổ đại",
    "MH-STAGING-C4-05": "Máy cán lá thép tự động điều chỉnh độ dày dựa trên tính chất đâm xuyên của tia phóng xạ beta",
    "MH-STAGING-C4-06": "Mô hình phản ứng tổng hợp hạt nhân D + T tạo Helium và neutron",
    "MH-STAGING-C4-07": "Các định luật bảo toàn và sự biến đổi nguyên tố trong phản ứng hạt nhân",
    "MH-STAGING-C4-08": "Thí nghiệm tách tia phóng xạ alpha, beta, gamma trong điện trường đều qua tờ giấy G tới màn huỳnh quang F",
    "MH-STAGING-C4-09": "Phản ứng phân hạch dây chuyền của Uranium-235 tạo Y-95 và I-138",
    "MH-STAGING-C4-10": "Lịch trình chiếu xạ tia gamma điều trị ung thư theo chu kỳ 1 tháng (T = 4 tháng)",
    "MH-STAGING-C4-11": "Theo dõi dòng chảy nước ngầm bằng đồng vị đánh dấu Tritium (³₁H)",
    "MH-STAGING-C4-12": "Phân rã beta trừ của 15,0 g Cobalt-60 tạo hạt nhân bền Nickel-60",
    "MH-STAGING-C4-13": "Phản ứng hạt nhân dùng proton bắn phá Lithium-7 tạo hai hạt nhân X",
    "MH-STAGING-C4-14": "So sánh tốc độ phân rã của đồng vị U-235 và U-238 từ khi Trái Đất hình thành",
    "MH-STAGING-C4-15": "Pin hạt nhân Carbon-14 hoạt động dài hạn (H₀ = 10 mCi; T = 5730 năm)",
    "MH-STAGING-C4-16": "Xác định tuổi cổ vật gỗ bằng phương pháp đồng vị phóng xạ Carbon-14",
    "MH-STAGING-C4-17": "Nghiên cứu hấp thụ phân bón trong cây khoai tây bằng đồng vị Phosphorus-32",
    "MH-STAGING-C4-18": "Định tuổi chiếc thuyền cổ bằng đồng vị phóng xạ ¹⁴₆C (mẫu gỗ tươi và mẫu gỗ cổ)",
    "MH-STAGING-C4-19": "Đồ thị phụ thuộc của ln(R) theo thời gian t (phút) khi đo độ phóng xạ đồng vị ¹²⁸₅₃I",
    "MH-STAGING-C4-20": "Sơ đồ nguyên lý nhà máy điện hạt nhân và chu trình chuyển hóa năng lượng",
    "MH-STAGING-C4-21": "Thí nghiệm dùng máy đếm electron đo số hạt phát ra trong 1 phút ở thời điểm đầu và sau 5 giờ",
    "MH-STAGING-C4-22": "Chẩn đoán hình ảnh y học hạt nhân bằng đồng vị ⁹⁹₄₃Tc và Gamma Camera",
    "MH-STAGING-C4-23": "Đo tốc độ phân rã 240 phân rã/phút của mẫu gỗ cổ vật chứa 25 g carbon",
    "MH-STAGING-C4-24": "Pin hạt nhân Betavolt dùng đồng vị ⁶³₂₈Ni (T = 100 năm) cấp nguồn cho máy tạo nhịp tim",
    "MH-STAGING-C4-25": "Các ứng dụng thực tế của tia phóng xạ trong y học hạt nhân và bảo quản nông sản",
    "MH-STAGING-C4-26": "Hệ thống băng chuyền chiếu xạ tia gamma nguồn ⁶⁰₂₇Co (2000 Ci) khử trùng nhộng ruồi (kỹ thuật SIT)",
    "MH-STAGING-C4-27": "Quá trình phân rã mẫu 15,0 g Cobalt ⁶⁰₂₇Co tạo thành hạt nhân bền ⁶⁰₂₈Ni",
    "MH-STAGING-C4-28": "So sánh cấu tạo nucleon và độ hụt khối của hai hạt nhân A và B",
    "MH-STAGING-C4-29": "Quá trình phóng xạ α của đồng vị Uranium ²³⁸₉₂U (λ = 4,916·10⁻¹⁸ s⁻¹)",
    "MH-STAGING-C4-30": "Định tuổi mẫu gỗ cổ theo phương pháp Carbon-14 của Willard F. Libby (N = N₀/3)",
    "MH-STAGING-C4-31": "Khảo sát phân rã mẫu 125 g đồng vị phóng xạ Iodine ¹³¹₅₃I sau 14 ngày",
    "MH-STAGING-C4-32": "Quá trình tổng hợp ba hạt nhân Helium ⁴₂He tạo thành Carbon ¹²₆C trong lõi ngôi sao",
    "MH-STAGING-C4-33": "Chuỗi chuyển hóa năng lượng hạt nhân ²³⁵₉₂U thành điện năng 500 MW với hiệu suất 20%",
    "MH-STAGING-C4-34": "Thí nghiệm tán xạ hạt α bắn qua lá vàng mỏng và các góc lệch lớn hơn 90°"
};

})(window);
