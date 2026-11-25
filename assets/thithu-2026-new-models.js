/*!
 * VLXT Bộ 5 Đề Thi Thử Chuẩn Bộ 2025–2026 — 30 Mô Hình Canvas 60 FPS Độc Bản
 * Quy chuẩn EdTech phẳng, sắc nét (780x305), tương phản cao, chữ >= 13.5px, 0 AI Glow.
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

    window.VLXT_THITHU26_CAPTIONS = {
        'MH-TT26-D1-P1-01': 'Đồ thị nhiệt độ theo thời gian khi nung chất rắn kết tinh và chất rắn vô định hình',
        'MH-TT26-D1-P1-02': 'Độ lệch của chùm tia phóng xạ alpha, beta và gamma trong điện trường đều',
        'MH-TT26-D1-P2-C1': 'Bộ thí nghiệm đo nhiệt dung riêng của dầu thực vật bằng nhiệt lượng kế và oát kế',
        'MH-TT26-D1-P2-C2': 'Xilanh cách nhiệt hai ngăn chứa khí lí tưởng ngăn cách bởi pit-tông di động',
        'MH-TT26-D1-P2-C3': 'Đoạn dây dẫn mang dòng điện nằm ngang thay đổi góc hợp với vectơ cảm ứng từ',
        'MH-TT26-D1-P2-C4': 'Thí nghiệm tán xạ hạt alpha lên lá vàng mỏng và kính hiển vi màn ZnS',
        'MH-TT26-D2-P1-01': 'Hệ 3 đồ thị chuẩn biểu diễn quá trình đẳng nhiệt của một lượng khí lí tưởng',
        'MH-TT26-D2-P1-02': 'Thí nghiệm định luật Lenz: đưa cực Bắc nam châm lại gần vòng nhôm kín',
        'MH-TT26-D2-P2-C1': 'Bộ thí nghiệm phễu nước đá và cân điện tử đo nhiệt nóng chảy riêng của nước đá',
        'MH-TT26-D2-P2-C2': 'Xilanh chia độ gắn áp kế điện tử khảo sát định luật Boyle ở nhiệt độ không đổi',
        'MH-TT26-D2-P2-C3': 'Cân điện tử đo lực từ tác dụng lên đoạn dây dẫn đặt trong khe nam châm chữ U',
        'MH-TT26-D2-P2-C4': 'Đầu đo nhấp nháy ống chuẩn trực chì theo dõi đồng vị I-131 điều trị tuyến giáp',
        'MH-TT26-D3-P1-01': 'Hai phương thức làm biến đổi nội năng: thực hiện công cơ học và truyền nhiệt lượng',
        'MH-TT26-D3-P1-02': 'Đồ thị năng lượng liên kết riêng theo số khối A và hai vùng phản ứng tỏa năng lượng',
        'MH-TT26-D3-P2-C1': 'Bình đun nước sôi đặt trên cân điện tử và oát kế đo nhiệt hóa hơi riêng của nước',
        'MH-TT26-D3-P2-C2': 'Sự giãn nở của bóng thám không chứa khí Helium khi bay lên tầng bình lưu',
        'MH-TT26-D3-P2-C3': 'Lan truyền sóng điện từ phẳng với vectơ cường độ điện trường E và cảm ứng từ B đồng pha',
        'MH-TT26-D3-P2-C4': 'Sơ đồ nguyên lý lò phản ứng phân hạch hạt nhân nước áp lực dùng nhiên liệu U-235',
        'MH-TT26-D4-P1-01': 'Khung dây quay đều trong từ trường đều tạo suất điện động xoay chiều hình sin',
        'MH-TT26-D4-P1-02': 'Đường đẳng tích trong hệ tọa độ (p, t°C) và ngoại suy độ không tuyệt đối -273,15°C',
        'MH-TT26-D4-P2-C1': 'Cấu tạo bình giữ nhiệt chân không hai lớp tráng bạc hạn chế truyền nhiệt',
        'MH-TT26-D4-P2-C2': 'Cột khí giam bởi giọt thủy ngân ngâm trong bể điều nhiệt khảo sát định luật Charles',
        'MH-TT26-D4-P2-C3': 'Khối phổ kế sử dụng bộ lọc vận tốc và buồng từ trường tách các đồng vị ion dương',
        'MH-TT26-D4-P2-C4': 'Nguyên lý hoạt động của đầu báo khói ion hóa sử dụng nguồn phóng xạ Am-241',
        'MH-TT26-D5-P1-01': 'Đường sức từ của ống dây điện hình trụ và sự định hướng của các kim nam châm thử',
        'MH-TT26-D5-P1-02': 'Đồ thị phân rã phóng xạ số hạt còn lại N(t) và số hạt đã phân rã theo chu kì bán rã T',
        'MH-TT26-D5-P2-C1': 'Hệ thống làm mát tuần hoàn bằng chất lỏng cho cụm máy chủ công suất cao',
        'MH-TT26-D5-P2-C2': 'Van đối trọng an toàn của nồi áp suất khống chế áp suất hơi bão hòa bên trong',
        'MH-TT26-D5-P2-C3': 'Thí nghiệm phanh dòng Foucault với con lắc tấm nhôm liền khối và tấm nhôm xẻ rãnh',
        'MH-TT26-D5-P2-C4': 'Chu trình hấp thụ và phân rã đồng vị C-14 ứng dụng định tuổi mẫu gỗ khảo cổ'
    };

    function reg(id, drawBody) {
        window.VLXTModels.register(id, function(ctx, w, h, t) {
            ctx.save();
            ctx.clearRect(0, 0, w, h);
            const sx = w / 780;
            const sy = h / 305;
            ctx.scale(sx, sy);
            drawTechBg(ctx, 780, 305);
            drawBody(ctx, 780, 305, t || 0);
            ctx.restore();
        });
    }

    function drawTechBg(ctx, w, h) {
        const g = ctx.createLinearGradient(0, 0, 0, h);
        g.addColorStop(0, '#060b19');
        g.addColorStop(1, '#0b1326');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
        ctx.save();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.05)';
        ctx.lineWidth = 1;
        for (let x = 24; x < w; x += 28) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
        }
        for (let y = 24; y < h; y += 28) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
        }
        ctx.restore();
    }

    function roundBox(ctx, x, y, bw, bh, r, fill, stroke, lw) {
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(x, y, bw, bh, r);
        if (fill) { ctx.fillStyle = fill; ctx.fill(); }
        if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 1.8; ctx.stroke(); }
        ctx.restore();
    }

    function drawTitle(ctx, title, accent) {
        ctx.save();
        ctx.font = '800 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        const tw = ctx.measureText(title).width + 24;
        const col = accent || '#38bdf8';
        roundBox(ctx, 16, 12, Math.min(tw, 748), 28, 7, '#0f172a', col, 1.6);
        ctx.fillStyle = col;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(title, 28, 26);
        ctx.restore();
    }

    function labelPill(ctx, x, y, text, fg, bg, border, align) {
        ctx.save();
        ctx.font = '700 13px "Plus Jakarta Sans", system-ui, sans-serif';
        const tw = ctx.measureText(text).width + 18;
        const bx = align === 'center' ? x - tw / 2 : (align === 'right' ? x - tw : x);
        roundBox(ctx, bx, y, tw, 25, 6, bg || '#0f172a', border || '#334155', 1.4);
        ctx.fillStyle = fg || '#f8fafc';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, bx + tw / 2, y + 12.5);
        ctx.restore();
    }

    function arrowLine(ctx, x1, y1, x2, y2, col, lw, hl) {
        const ang = Math.atan2(y2 - y1, x2 - x1);
        const hLen = hl || 8;
        ctx.save();
        ctx.strokeStyle = col;
        ctx.fillStyle = col;
        ctx.lineWidth = lw || 2.4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - hLen * Math.cos(ang - Math.PI / 6), y2 - hLen * Math.sin(ang - Math.PI / 6));
        ctx.lineTo(x2 - hLen * Math.cos(ang + Math.PI / 6), y2 - hLen * Math.sin(ang + Math.PI / 6));
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    function txt(ctx, s, x, y, col, font, align) {
        ctx.save();
        ctx.fillStyle = col || '#e2e8f0';
        ctx.font = font || '600 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = align || 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(s, x, y);
        ctx.restore();
    }

    // 1. MH-TT26-D1-P1-01: Kết tinh vs Vô định hình
    reg('MH-TT26-D1-P1-01', function(ctx, w, h, t) {
        drawTitle(ctx, 'ĐỒ THỊ NUNG NÓNG CHẤT RẮN KẾT TINH & VÔ ĐỊNH HÌNH', '#f59e0b');
        const panels = [
            { x0: 55, title: 'Đường (1): Chất rắn kết tinh', col: '#38bdf8', crystalline: true },
            { x0: 425, title: 'Đường (2): Chất rắn vô định hình', col: '#f59e0b', crystalline: false }
        ];
        const phase = (t * 0.25) % 1;
        panels.forEach(p => {
            roundBox(ctx, p.x0 - 25, 52, 330, 234, 10, '#0f172a', '#1e293b', 1.5);
            txt(ctx, p.title, p.x0 + 140, 70, p.col, '800 14px "Plus Jakarta Sans", sans-serif', 'center');
            const ox = p.x0 + 25, oy = 250;
            arrowLine(ctx, ox, oy, ox, 92, '#94a3b8', 2, 7);
            arrowLine(ctx, ox, oy, ox + 250, oy, '#94a3b8', 2, 7);
            txt(ctx, 't (°C)', ox - 4, 88, '#cbd5e1', '700 13px sans-serif', 'right');
            txt(ctx, 'τ (phút)', ox + 245, oy + 16, '#cbd5e1', '700 13px sans-serif', 'right');
            ctx.save();
            ctx.strokeStyle = p.col;
            ctx.lineWidth = 3.2;
            ctx.beginPath();
            if (p.crystalline) {
                ctx.moveTo(ox, 232);
                ctx.lineTo(ox + 80, 168);
                ctx.lineTo(ox + 165, 168);
                ctx.lineTo(ox + 235, 110);
                ctx.stroke();
                ctx.setLineDash([4, 4]);
                ctx.strokeStyle = 'rgba(148,163,184,0.6)';
                ctx.lineWidth = 1.4;
                ctx.beginPath(); ctx.moveTo(ox, 168); ctx.lineTo(ox + 80, 168); ctx.stroke();
                ctx.setLineDash([]);
                txt(ctx, 't_nc', ox - 8, 168, '#38bdf8', '700 13px sans-serif', 'right');
                txt(ctx, 'Nóng chảy (t = const)', ox + 122, 152, '#bae6fd', '700 12.5px sans-serif', 'center');
            } else {
                ctx.moveTo(ox, 232);
                ctx.bezierCurveTo(ox + 70, 206, ox + 150, 162, ox + 235, 112);
                ctx.stroke();
                txt(ctx, 'Mềm dần liên tục', ox + 145, 194, '#fde68a', '700 12.5px sans-serif', 'center');
            }
            ctx.restore();
            // Moving tracer dot
            let px, py;
            if (p.crystalline) {
                if (phase < 0.34) {
                    const u = phase / 0.34;
                    px = ox + 80 * u; py = 232 - 64 * u;
                } else if (phase < 0.72) {
                    const u = (phase - 0.34) / 0.38;
                    px = ox + 80 + 85 * u; py = 168;
                } else {
                    const u = (phase - 0.72) / 0.28;
                    px = ox + 165 + 70 * u; py = 168 - 58 * u;
                }
            } else {
                const u = phase;
                const mt = 1 - u;
                px = mt*mt*mt*ox + 3*mt*mt*u*(ox+70) + 3*mt*u*u*(ox+150) + u*u*u*(ox+235);
                py = mt*mt*mt*232 + 3*mt*mt*u*206 + 3*mt*u*u*162 + u*u*u*112;
            }
            ctx.save();
            ctx.fillStyle = '#ffffff';
            ctx.strokeStyle = p.col;
            ctx.lineWidth = 3;
            ctx.beginPath(); ctx.arc(px, py, 5.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.restore();
        });
    });

    // 2. MH-TT26-D1-P1-02: Chùm tia alpha, beta-, gamma trong điện trường
    reg('MH-TT26-D1-P1-02', function(ctx, w, h, t) {
        drawTitle(ctx, 'CHÙM TIA PHÓNG XẠ α, β⁻, γ ĐI QUA ĐIỆN TRƯỜNG ĐỀU', '#38bdf8');
        // Nguồn phóng xạ chì
        roundBox(ctx, 42, 130, 86, 86, 8, '#1e293b', '#64748b', 2);
        roundBox(ctx, 96, 163, 34, 20, 3, '#060b19', '#475569', 1.2);
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath(); ctx.arc(76, 173, 12, 0, Math.PI * 2); ctx.fill();
        txt(ctx, 'Nguồn phóng xạ', 85, 234, '#cbd5e1', '700 13px sans-serif', 'center');

        // Hai bản tụ phẳng trên (+) dưới (-)
        roundBox(ctx, 210, 72, 260, 18, 4, '#7f1d1d', '#ef4444', 1.8);
        roundBox(ctx, 210, 256, 260, 18, 4, '#1e3a8a', '#3b82f6', 1.8);
        txt(ctx, '+   +   +   +   Bản dương (+)', 340, 81, '#fecaca', '800 13px sans-serif', 'center');
        txt(ctx, '−   −   −   −   Bản âm (−)', 340, 265, '#bfdbfe', '800 13px sans-serif', 'center');

        // Điện trường hướng xuống
        for (let ex = 245; ex <= 440; ex += 65) {
            arrowLine(ctx, ex, 100, ex, 135, 'rgba(148,163,184,0.38)', 1.5, 6);
        }
        txt(ctx, 'E', 455, 118, '#94a3b8', '700 14px sans-serif', 'left');

        // Đường truyền 3 tia từ x = 130 -> 210 thẳng, 210 -> 580 lệch
        function drawRay(pts, col, dashed) {
            ctx.save();
            ctx.strokeStyle = col;
            ctx.lineWidth = 3;
            if (dashed) ctx.setLineDash([7, 5]);
            ctx.beginPath();
            ctx.moveTo(130, 173);
            ctx.lineTo(210, 173);
            if (pts.cpY !== undefined) {
                ctx.quadraticCurveTo(340, pts.cpY, pts.endX, pts.endY);
            } else {
                ctx.lineTo(pts.endX, pts.endY);
            }
            ctx.stroke();
            ctx.restore();
        }
        drawRay({ cpY: 168, endX: 465, endY: 96 }, '#34d399', false); // Tia 1 (beta-) lệch mạnh về bản (+)
        drawRay({ endX: 590, endY: 173 }, '#fbbf24', true);            // Tia 2 (gamma) đi thẳng
        drawRay({ cpY: 178, endX: 550, endY: 245 }, '#f43f5e', false); // Tia 3 (alpha) lệch ít hơn về bản (-)

        // Hạt chuyển động
        const ph = (t * 0.55) % 1;
        function dotAlong(p1y, cpY, endX, endY, col) {
            let x, y;
            if (ph < 0.22) {
                const u = ph / 0.22; x = 130 + 80 * u; y = 173;
            } else {
                const u = (ph - 0.22) / 0.78;
                const mt = 1 - u;
                x = mt*mt*210 + 2*mt*u*340 + u*u*endX;
                y = mt*mt*173 + 2*mt*u*(cpY ?? 173) + u*u*endY;
            }
            ctx.save();
            ctx.fillStyle = col;
            ctx.beginPath(); ctx.arc(x, y, 4.8, 0, Math.PI * 2); ctx.fill();
            ctx.restore();
        }
        dotAlong(173, 168, 465, 96, '#34d399');
        dotAlong(173, 173, 590, 173, '#fbbf24');
        dotAlong(173, 178, 550, 245, '#f43f5e');

        labelPill(ctx, 480, 92, 'Tia (1) — Lệch mạnh về (+)', '#34d399', '#064e3b', '#10b981');
        labelPill(ctx, 596, 160, 'Tia (2) — Không lệch', '#fde68a', '#451a03', '#f59e0b');
        labelPill(ctx, 560, 224, 'Tia (3) — Lệch về (−)', '#fda4af', '#4c0519', '#f43f5e');
    });

    // 3. MH-TT26-D1-P2-C1: Thí nghiệm đo nhiệt dung riêng dầu thực vật
    reg('MH-TT26-D1-P2-C1', function(ctx, w, h, t) {
        drawTitle(ctx, 'THÍ NGHIỆM KIỂM TRA NHIỆT DUNG RIÊNG DẦU Ô-LIU (2 MẪU KHỐI LƯỢNG)', '#38bdf8');
        const temp = 25 + Math.min(28, ((t * 4) % 30));
        const pots = [
            { cx: 185, label: 'Mẫu 1: m₁ = 150 g', fillH: 64, tShow: (25 + (temp - 25)).toFixed(1) },
            { cx: 430, label: 'Mẫu 2: m₂ = 300 g', fillH: 98, tShow: (25 + (temp - 25) * 0.5).toFixed(1) }
        ];
        pots.forEach(p => {
            roundBox(ctx, p.cx - 64, 118, 128, 134, 8, '#0f172a', '#64748b', 2.4);
            // Dầu ô-liu màu vàng hổ phách
            roundBox(ctx, p.cx - 58, 248 - p.fillH, 116, p.fillH, 4, 'rgba(234, 179, 8, 0.35)', '#eab308', 1.4);
            // Dây điện trở đun nóng
            ctx.save();
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 3;
            ctx.beginPath();
            for (let rx = -34; rx <= 34; rx += 8) {
                ctx.lineTo(p.cx + rx, 225 + (rx % 16 === 0 ? -7 : 7));
            }
            ctx.stroke();
            ctx.restore();
            // Nhiệt kế
            roundBox(ctx, p.cx + 22, 84, 14, 140, 7, '#1e293b', '#94a3b8', 1.4);
            const mercH = 30 + (parseFloat(p.tShow) - 25) * 2.2;
            roundBox(ctx, p.cx + 26, 218 - mercH, 6, mercH, 3, '#ef4444', null);
            labelPill(ctx, p.cx, 262, p.label + ' (' + p.tShow + '°C)', '#f8fafc', '#1e293b', '#38bdf8', 'center');
        });
        // Oát kế + Nguồn điện P = const
        roundBox(ctx, 565, 92, 185, 165, 10, '#0f172a', '#38bdf8', 2);
        txt(ctx, 'OÁT KẾ & NGUỒN ĐIỆN', 657, 114, '#38bdf8', '800 13px sans-serif', 'center');
        roundBox(ctx, 585, 132, 145, 44, 6, '#020617', '#0284c7', 1.4);
        txt(ctx, 'P = 20,0 W', 657, 154, '#34d399', '800 18px "DM Mono", monospace', 'center');
        txt(ctx, 'Cùng công suất đun P', 657, 198, '#cbd5e1', '600 13px sans-serif', 'center');
        txt(ctx, 'cùng hiệu suất truyền', 657, 218, '#cbd5e1', '600 13px sans-serif', 'center');
        txt(ctx, 'ΔT₂ ≈ ½ ΔT₁', 657, 238, '#fbbf24', '800 14px sans-serif', 'center');
    });

    // 4. MH-TT26-D1-P2-C2: Xilanh cách nhiệt 2 ngăn A-B
    reg('MH-TT26-D1-P2-C2', function(ctx, w, h, t) {
        drawTitle(ctx, 'XILANH CÁCH NHIỆT HAI NGĂN CÓ PIT-TÔNG DI ĐỘNG & DÂY NUNG', '#f59e0b');
        const shift = Math.sin(t * 1.4) * 32 + 28; // pit-tông dịch sang phải nén B
        const cylX = 85, cylY = 92, cylW = 590, cylH = 148;
        roundBox(ctx, cylX, cylY, cylW, cylH, 10, '#0f172a', '#94a3b8', 5);
        const px = cylX + 275 + shift;

        // Ngăn A (nóng dần) & Ngăn B (bị nén)
        roundBox(ctx, cylX + 5, cylY + 5, px - cylX - 5, cylH - 10, 4, 'rgba(239, 68, 68, 0.16)', null);
        roundBox(ctx, px + 18, cylY + 5, cylX + cylW - px - 23, cylH - 10, 4, 'rgba(56, 189, 248, 0.16)', null);

        // Dây nung ở ngăn A
        ctx.save();
        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        for (let yy = cylY + 35; yy <= cylY + 115; yy += 10) {
            ctx.lineTo(cylX + 38 + ((yy % 20 === 0) ? 14 : 0), yy);
        }
        ctx.stroke();
        ctx.restore();
        txt(ctx, 'Dây nung Q', cylX + 46, cylY + 132, '#fdba74', '700 12.5px sans-serif', 'center');

        // Pit-tông cách nhiệt
        roundBox(ctx, px, cylY + 4, 20, cylH - 8, 3, '#64748b', '#e2e8f0', 2);
        arrowLine(ctx, px + 26, cylY + cylH / 2, px + 76, cylY + cylH / 2, '#fbbf24', 3, 9);
        txt(ctx, 'A (đẩy)', px + 52, cylY + cylH / 2 - 18, '#fbbf24', '800 13px sans-serif', 'center');

        // Hạt khí chuyển động
        for (let i = 0; i < 12; i++) {
            const ax = cylX + 75 + ((i * 47 + t * 80) % Math.max(40, px - cylX - 95));
            const ay = cylY + 22 + ((i * 31 + t * 50) % (cylH - 44));
            ctx.fillStyle = '#fca5a5';
            ctx.beginPath(); ctx.arc(ax, ay, 3.6, 0, Math.PI * 2); ctx.fill();
        }
        for (let i = 0; i < 12; i++) {
            const bx = px + 32 + ((i * 39 + t * 65) % Math.max(40, cylX + cylW - px - 52));
            const by = cylY + 22 + ((i * 29 + t * 45) % (cylH - 44));
            ctx.fillStyle = '#7dd3fc';
            ctx.beginPath(); ctx.arc(bx, by, 3.6, 0, Math.PI * 2); ctx.fill();
        }

        labelPill(ctx, cylX + 145, 255, 'Ngăn A: Nhận nhiệt Q & sinh công', '#fca5a5', '#450a0a', '#ef4444', 'center');
        labelPill(ctx, cylX + 470, 255, 'Ngăn B: Cách nhiệt (Q=0), bị nén (A>0)', '#bae6fd', '#0c4a6e', '#0284c7', 'center');
    });

    // 5. MH-TT26-D1-P2-C3: Đoạn dây trong từ trường thay đổi góc alpha
    reg('MH-TT26-D1-P2-C3', function(ctx, w, h, t) {
        drawTitle(ctx, 'KHẢO SÁT LỰC TỪ LÊN ĐOẠN DÂY DẪN THAY ĐỔI GÓC α TRONG TỪ TRƯỜNG ĐỀU', '#34d399');
        // Mặt bàn ngang chiếu phối cảnh
        ctx.save();
        ctx.fillStyle = 'rgba(30, 41, 59, 0.85)';
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(110, 125); ctx.lineTo(540, 125); ctx.lineTo(635, 245); ctx.lineTo(45, 245);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.restore();

        // Các đường sức từ B nằm ngang
        for (let y = 148; y <= 222; y += 36) {
            arrowLine(ctx, 130, y, 520, y, '#38bdf8', 2.2, 8);
        }
        txt(ctx, 'B (nằm ngang)', 528, 185, '#38bdf8', '800 14px sans-serif', 'left');

        // Đoạn dây xoay quanh tâm (330, 185) với góc alpha biến thiên
        const alpha = 0.25 + (Math.sin(t * 1.1) + 1) * 0.65; // ~ 14deg -> 90deg
        const len = 105;
        const cx = 330, cy = 185;
        const dx = Math.cos(alpha) * len, dy = Math.sin(alpha) * len * 0.45;
        ctx.save();
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 7;
        ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(cx - dx, cy - dy); ctx.lineTo(cx + dx, cy + dy); ctx.stroke();
        ctx.restore();
        arrowLine(ctx, cx - dx * 0.4, cy - dy * 0.4, cx + dx * 0.4, cy + dy * 0.4, '#fef08a', 2.4, 7);
        txt(ctx, 'I', cx + dx * 0.55, cy + dy * 0.55 - 12, '#fde047', '800 14px sans-serif', 'left');

        // Lực từ F thẳng đứng vuông góc mặt bàn, độ lớn tỉ lệ sin(alpha)
        const fLen = 35 + 75 * Math.sin(alpha);
        arrowLine(ctx, cx, cy, cx, cy - fLen, '#34d399', 4, 10);
        labelPill(ctx, cx + 14, cy - fLen - 8, 'F = B·I·ℓ·sin(α)', '#34d399', '#064e3b', '#10b981');
        txt(ctx, 'Góc α = ' + Math.round(alpha * 180 / Math.PI) + '°', 340, 270, '#f8fafc', '800 14px sans-serif', 'center');
    });

    // 6. MH-TT26-D1-P2-C4: Thí nghiệm tán xạ Rutherford lá vàng mỏng
    reg('MH-TT26-D1-P2-C4', function(ctx, w, h, t) {
        drawTitle(ctx, 'THÍ NGHIỆM TÁN XẠ HẠT ALPHA QUA LÁ VÀNG MỎNG (RUTHERFORD)', '#fbbf24');
        // Hộp nguồn alpha
        roundBox(ctx, 48, 134, 92, 54, 6, '#334155', '#94a3b8', 2);
        txt(ctx, 'Nguồn α', 94, 161, '#fde68a', '800 13.5px sans-serif', 'center');

        // Màn ZnS vòng cung
        const lx = 390, ly = 161;
        ctx.save();
        ctx.strokeStyle = '#22d3ee';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(lx, ly, 118, -Math.PI * 0.85, Math.PI * 0.85);
        ctx.stroke();
        ctx.restore();
        txt(ctx, 'Màn huỳnh quang ZnS', 530, 82, '#22d3ee', '800 13px sans-serif', 'left');

        // Lá vàng mỏng ở tâm
        roundBox(ctx, lx - 3, ly - 52, 6, 104, 2, '#facc15', '#fef08a', 1);
        txt(ctx, 'Lá vàng Au', lx, ly + 72, '#facc15', '800 13px sans-serif', 'center');

        // Chùm tia đi thẳng (đa số), lệch góc nhỏ, bật ngược góc lớn
        arrowLine(ctx, 140, ly, lx + 114, ly, '#34d399', 2.8, 7);
        arrowLine(ctx, 140, ly - 10, lx, ly - 10, '#34d399', 2, 0);
        arrowLine(ctx, lx, ly - 10, lx + 98, ly - 48, '#fbbf24', 2.2, 7);
        arrowLine(ctx, 140, ly + 10, lx, ly + 10, '#34d399', 2, 0);
        arrowLine(ctx, lx, ly + 10, lx - 82, ly + 66, '#f43f5e', 2.4, 7);

        const p = (t * 0.7) % 1;
        const dotX = p < 0.55 ? (140 + (lx - 140) * (p / 0.55)) : (lx + 114 * ((p - 0.55) / 0.45));
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(dotX, ly, 4.5, 0, Math.PI * 2); ctx.fill();

        labelPill(ctx, 540, 148, 'Đa số truyền thẳng (nguyên tử rỗng)', '#34d399', '#064e3b', '#10b981');
        labelPill(ctx, 540, 186, 'Rất ít bật ngược (hạt nhân dương rất nhỏ)', '#fda4af', '#4c0519', '#f43f5e');
    });

    // 7. MH-TT26-D2-P1-01: Ba đồ thị đẳng nhiệt chuẩn
    reg('MH-TT26-D2-P1-01', function(ctx, w, h, t) {
        drawTitle(ctx, 'CÁC ĐỒ THỊ BIỂU DIỄN QUÁ TRÌNH ĐẲNG NHIỆT CỦA KHÍ LÍ TƯỞNG', '#38bdf8');
        const cols = [
            { x0: 36, lblX: 'V', lblY: 'p', cap: 'Hình (1): p(V) — Hyperbol', mode: 1, col: '#38bdf8' },
            { x0: 282, lblX: '1/V', lblY: 'p', cap: 'Hình (2): p(1/V) — Qua gốc O', mode: 2, col: '#34d399' },
            { x0: 528, lblX: 'T', lblY: 'p', cap: 'Hình (3): p(T) — T = const', mode: 3, col: '#f59e0b' }
        ];
        const ph = (t * 0.35) % 1;
        cols.forEach(c => {
            roundBox(ctx, c.x0, 54, 218, 226, 10, '#0f172a', '#1e293b', 1.5);
            const ox = c.x0 + 38, oy = 232;
            arrowLine(ctx, ox, oy, ox, 86, '#94a3b8', 2, 6);
            arrowLine(ctx, ox, oy, ox + 158, oy, '#94a3b8', 2, 6);
            txt(ctx, c.lblY, ox - 8, 86, '#e2e8f0', '700 13px sans-serif', 'right');
            txt(ctx, c.lblX, ox + 156, oy + 14, '#e2e8f0', '700 13px sans-serif', 'right');
            txt(ctx, 'O', ox - 8, oy + 12, '#94a3b8', '700 12px sans-serif', 'right');
            ctx.save();
            ctx.strokeStyle = c.col;
            ctx.lineWidth = 3;
            ctx.beginPath();
            let dx = ox + 50, dy = oy - 60;
            if (c.mode === 1) {
                for (let i = 0; i <= 40; i++) {
                    const v = 22 + i * 3;
                    const y = oy - 2800 / v;
                    if (i === 0) ctx.moveTo(ox + v, y); else ctx.lineTo(ox + v, y);
                }
                const vp = 28 + ph * 105;
                dx = ox + vp; dy = oy - 2800 / vp;
            } else if (c.mode === 2) {
                ctx.setLineDash([4, 4]);
                ctx.moveTo(ox, oy); ctx.lineTo(ox + 34, oy - 30); ctx.stroke();
                ctx.setLineDash([]);
                ctx.beginPath(); ctx.moveTo(ox + 34, oy - 30); ctx.lineTo(ox + 132, oy - 118);
                dx = ox + 34 + ph * 96; dy = oy - 30 - ph * 86;
            } else {
                ctx.moveTo(ox + 80, oy - 15); ctx.lineTo(ox + 80, oy - 120);
                dx = ox + 80; dy = oy - 20 - ph * 95;
            }
            ctx.stroke();
            ctx.fillStyle = '#ffffff';
            ctx.strokeStyle = c.col;
            ctx.lineWidth = 2.6;
            ctx.beginPath(); ctx.arc(dx, dy, 5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.restore();
            txt(ctx, c.cap, c.x0 + 109, 264, c.col, '700 12.5px sans-serif', 'center');
        });
    });

    // 8. MH-TT26-D2-P1-02: Định luật Lenz nam châm lại gần vòng nhôm
    reg('MH-TT26-D2-P1-02', function(ctx, w, h, t) {
        drawTitle(ctx, 'THÍ NGHIỆM ĐỊNH LUẬT LENZ: CỰC BẮC (N) LẠI GẦN VÒNG NHÔM KÍN', '#a78bfa');
        const cycle = (t * 0.45) % 1;
        const approach = cycle < 0.7 ? cycle / 0.7 : 1 - (cycle - 0.7) / 0.3;
        const magX = 115 + approach * 145;
        // Nam châm S - N
        roundBox(ctx, magX, 134, 85, 48, 4, '#1e40af', '#60a5fa', 2);
        roundBox(ctx, magX + 85, 134, 85, 48, 4, '#991b1b', '#f87171', 2);
        txt(ctx, 'S', magX + 42, 158, '#dbeafe', '900 20px sans-serif', 'center');
        txt(ctx, 'N', magX + 128, 158, '#fee2e2', '900 20px sans-serif', 'center');
        arrowLine(ctx, magX + 60, 114, magX + 140, 114, '#f59e0b', 3, 8);
        txt(ctx, 'v (lại gần)', magX + 100, 98, '#fbbf24', '800 13px sans-serif', 'center');

        // Vòng nhôm kín treo dây mảnh lệch nhẹ sang phải khi bị đẩy
        const rx = 505 + approach * 24, ry = 158;
        ctx.save();
        ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(505, 48); ctx.lineTo(rx, ry - 54); ctx.stroke();
        ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 8;
        ctx.beginPath(); ctx.ellipse(rx, ry, 24, 54, 0, 0, Math.PI * 2); ctx.stroke();
        ctx.restore();

        // Bc chống lại B0 (hướng sang trái) & Lực đẩy sang phải
        arrowLine(ctx, rx - 30, ry, rx - 95, ry, '#34d399', 3.4, 8);
        txt(ctx, 'B_c (chống lại)', rx - 62, ry - 20, '#34d399', '800 13px sans-serif', 'center');
        arrowLine(ctx, rx + 32, ry, rx + 95, ry, '#f43f5e', 3.2, 8);
        txt(ctx, 'F đẩy lùi', rx + 65, ry - 20, '#fda4af', '800 13px sans-serif', 'center');
        labelPill(ctx, 520, 242, 'Mặt đối diện nam châm là cực Bắc (N) → Đẩy nhau', '#e2e8f0', '#1e293b', '#8b5cf6', 'center');
    });

    // 9. MH-TT26-D2-P2-C1: Phễu nước đá & cân điện tử đo nhiệt nóng chảy riêng
    reg('MH-TT26-D2-P2-C1', function(ctx, w, h, t) {
        drawTitle(ctx, 'THÍ NGHIỆM ĐO NHIỆT NÓNG CHẢY RIÊNG CỦA NƯỚC ĐÁ (PHỄU & CÂN ĐIỆN TỬ)', '#38bdf8');
        // Phễu chứa nước đá
        ctx.save();
        ctx.fillStyle = '#0f172a'; ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(115, 68); ctx.lineTo(255, 68); ctx.lineTo(198, 146); ctx.lineTo(198, 174);
        ctx.lineTo(172, 174); ctx.lineTo(172, 146); ctx.closePath();
        ctx.fill(); ctx.stroke();
        ctx.restore();
        // Đá vụn
        roundBox(ctx, 145, 80, 26, 22, 4, '#bae6fd', '#7dd3fc', 1.2);
        roundBox(ctx, 180, 82, 28, 22, 4, '#e0f2fe', '#7dd3fc', 1.2);
        roundBox(ctx, 162, 108, 28, 20, 4, '#bae6fd', '#38bdf8', 1.2);

        // Giọt nước rơi
        const dropY = 176 + ((t * 55) % 40);
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath(); ctx.arc(185, dropY, 4.2, 0, Math.PI * 2); ctx.fill();

        // Cốc hứng trên cân điện tử
        roundBox(ctx, 145, 205, 80, 44, 4, 'rgba(56,189,248,0.2)', '#94a3b8', 2);
        roundBox(ctx, 110, 250, 150, 38, 6, '#1e293b', '#38bdf8', 2);
        const mass = (12.0 + ((t * 1.4) % 18)).toFixed(1);
        txt(ctx, 'm = ' + mass + ' g', 185, 269, '#34d399', '800 15px "DM Mono", monospace', 'center');

        // Oát kế + Bảng nguyên lý
        roundBox(ctx, 325, 64, 420, 218, 10, '#0f172a', '#334155', 1.6);
        txt(ctx, 'HAI GIAI ĐOẠN LOẠI TRỪ SAI SỐ MÔI TRƯỜNG:', 535, 88, '#fbbf24', '800 13.5px sans-serif', 'center');
        labelPill(ctx, 345, 110, '1. Chưa bật điện (t₁): Nước đá chảy m₁ do môi trường', '#bae6fd', '#082f49', '#0284c7');
        labelPill(ctx, 345, 148, '2. Bật dây nung công suất P (t₂): Nước đá chảy m₂', '#fde68a', '#422006', '#d97706');
        roundBox(ctx, 345, 192, 380, 68, 8, '#020617', '#10b981', 1.5);
        txt(ctx, 'Lượng đá tan riêng do điện: Δm = m₂ − m₁ (khi t₁ = t₂)', 535, 214, '#e2e8f0', '700 13px sans-serif', 'center');
        txt(ctx, '⇒ Nhiệt nóng chảy riêng: λ = (P · Δt) / (m₂ − m₁)', 535, 240, '#34d399', '800 14.5px sans-serif', 'center');
    });

    // 10. MH-TT26-D2-P2-C2: Xilanh + Áp kế điện tử khảo sát Định luật Boyle
    reg('MH-TT26-D2-P2-C2', function(ctx, w, h, t) {
        drawTitle(ctx, 'THÍ NGHIỆM KHẢO SÁT ĐỊNH LUẬT BOYLE (T = CONST) BẰNG ÁP KẾ ĐIỆN TỬ', '#34d399');
        const u = (Math.sin(t * 1.1) + 1) / 2; // 0..1
        const V = 10 + u * 20; // 10 -> 30 cm3
        const P = 300 / V * 10; // p = 3000/V kPa -> 300 -> 100 kPa
        const pistTop = 215 - V * 4.2;

        // Xilanh thẳng đứng chia vạch
        roundBox(ctx, 95, 68, 92, 182, 6, '#0f172a', '#94a3b8', 2.6);
        roundBox(ctx, 100, pistTop + 14, 82, 246 - (pistTop + 14), 2, 'rgba(56,189,248,0.22)', null);
        roundBox(ctx, 98, pistTop, 86, 14, 2, '#64748b', '#e2e8f0', 2);
        roundBox(ctx, 136, 48, 10, pistTop - 48, 2, '#94a3b8', null);

        // Áp kế điện tử nối ống
        ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(187, 232); ctx.lineTo(245, 232); ctx.stroke();
        roundBox(ctx, 245, 194, 145, 76, 8, '#020617', '#38bdf8', 2);
        txt(ctx, 'p = ' + P.toFixed(0) + ' kPa', 317, 220, '#38bdf8', '800 16px "DM Mono", monospace', 'center');
        txt(ctx, 'V = ' + V.toFixed(1) + ' cm³', 317, 248, '#34d399', '800 15px "DM Mono", monospace', 'center');

        // Đồ thị p-V động bên phải
        const gx = 445, gy = 250;
        roundBox(ctx, 412, 56, 338, 228, 10, '#0f172a', '#1e293b', 1.6);
        arrowLine(ctx, gx, gy, gx, 78, '#94a3b8', 2, 6);
        arrowLine(ctx, gx, gy, gx + 280, gy, '#94a3b8', 2, 6);
        txt(ctx, 'p (kPa)', gx - 6, 78, '#e2e8f0', '700 12.5px sans-serif', 'right');
        txt(ctx, 'V (cm³)', gx + 282, gy + 14, '#e2e8f0', '700 12.5px sans-serif', 'right');
        ctx.save();
        ctx.strokeStyle = '#34d399'; ctx.lineWidth = 3;
        ctx.beginPath();
        for (let vx = 10; vx <= 30; vx += 1) {
            const px = gx + vx * 8.2;
            const py = gy - (3000 / vx) * 0.48;
            if (vx === 10) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
        const curX = gx + V * 8.2, curY = gy - P * 0.48;
        ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(curX, curY, 5.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.restore();
        txt(ctx, 'Tích p·V = const = 3,00 J', gx + 150, 92, '#fde68a', '800 13.5px sans-serif', 'center');
    });

    // 11. MH-TT26-D2-P2-C3: Cân điện tử đo lực từ trong nam châm chữ U
    reg('MH-TT26-D2-P2-C3', function(ctx, w, h, t) {
        drawTitle(ctx, 'CÂN ĐIỆN TỬ ĐO LỰC TỪ TÁC DỤNG LÊN ĐOẠN DÂY TRONG NAM CHÂM CHỮ U', '#f59e0b');
        const curI = 1.0 + Math.round(((Math.sin(t * 1.2) + 1) / 2) * 3) * 0.5; // 1.0 -> 2.5 A
        // Nam châm chữ U đặt trên cân điện tử
        roundBox(ctx, 90, 232, 260, 44, 6, '#1e293b', '#38bdf8', 2);
        const reading = (420.0 + curI * 12.0).toFixed(1);
        txt(ctx, 'Cân chỉ: ' + reading + ' g', 220, 254, '#34d399', '800 17px "DM Mono", monospace', 'center');

        // Khối nam châm N-S
        roundBox(ctx, 130, 128, 36, 102, 4, '#991b1b', '#f87171', 2);
        roundBox(ctx, 274, 128, 36, 102, 4, '#1e40af', '#60a5fa', 2);
        roundBox(ctx, 130, 204, 180, 26, 4, '#334155', '#64748b', 2);
        txt(ctx, 'N', 148, 165, '#fee2e2', '900 18px sans-serif', 'center');
        txt(ctx, 'S', 292, 165, '#dbeafe', '900 18px sans-serif', 'center');

        // Đoạn dây dẫn nằm ngang ở giữa khe + B từ N -> S
        arrowLine(ctx, 174, 162, 266, 162, '#38bdf8', 2.2, 7);
        txt(ctx, 'B', 220, 146, '#38bdf8', '800 13px sans-serif', 'center');
        roundBox(ctx, 206, 152, 28, 18, 9, '#f59e0b', '#fef08a', 2);
        txt(ctx, 'I = ' + curI.toFixed(1) + ' A', 220, 114, '#fde047', '800 13.5px sans-serif', 'center');

        // Lực từ đẩy nam châm xuống (+Δm) và nâng dây lên
        arrowLine(ctx, 220, 148, 220, 118, '#34d399', 3, 7);
        arrowLine(ctx, 220, 176, 220, 204, '#f43f5e', 3, 7);

        // Bảng nguyên lý bên phải
        roundBox(ctx, 390, 68, 360, 212, 10, '#0f172a', '#334155', 1.6);
        txt(ctx, 'CÂN BẰNG PHẢN LỰC LỰC TỪ', 570, 92, '#38bdf8', '800 14px sans-serif', 'center');
        labelPill(ctx, 410, 116, 'F = B · I · ℓ · sin(90°)', '#fde68a', '#422006', '#f59e0b');
        labelPill(ctx, 410, 154, 'Số chỉ cân thay đổi: Δm = F / g', '#bae6fd', '#082f49', '#0284c7');
        labelPill(ctx, 410, 192, 'Đổi chiều I ⇒ Δm đổi dấu (+ thành −)', '#fda4af', '#4c0519', '#f43f5e');
        txt(ctx, 'Phép đo trực tiếp giúp xác định cảm ứng từ B', 570, 248, '#cbd5e1', '700 13px sans-serif', 'center');
    });

    // 12. MH-TT26-D2-P2-C4: Đầu đo nhấp nháy I-131 tuyến giáp
    reg('MH-TT26-D2-P2-C4', function(ctx, w, h, t) {
        drawTitle(ctx, 'Y HỌC HẠT NHÂN: THEO DÕI ĐỒNG VỊ PHÓNG XẠ I-131 Ở TUYẾN GIÁP', '#a78bfa');
        // Phác họa cổ & tuyến giáp bệnh nhân
        roundBox(ctx, 68, 72, 185, 205, 12, '#0f172a', '#334155', 1.6);
        ctx.save();
        ctx.fillStyle = '#334155';
        ctx.beginPath(); ctx.ellipse(160, 148, 38, 52, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#f43f5e';
        ctx.beginPath(); ctx.ellipse(148, 175, 14, 18, -0.3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(172, 175, 14, 18, 0.3, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
        txt(ctx, 'Tuyến giáp (I-131)', 160, 232, '#fda4af', '800 13.5px sans-serif', 'center');

        // Tia gamma phóng từ tuyến giáp vào ống chuẩn trực chì
        const pulse = (t * 0.8) % 1;
        arrowLine(ctx, 188, 175, 290, 175, '#fbbf24', 2.4, 7);
        ctx.fillStyle = '#fde047';
        ctx.beginPath(); ctx.arc(195 + pulse * 95, 175, 4.5, 0, Math.PI * 2); ctx.fill();

        // Đầu thu chuẩn trực chì & máy đếm
        roundBox(ctx, 294, 142, 130, 66, 8, '#1e293b', '#38bdf8', 2.2);
        txt(ctx, 'Đầu đo γ', 359, 175, '#38bdf8', '800 14.5px sans-serif', 'center');

        // Bảng thông số phóng xạ
        roundBox(ctx, 456, 72, 295, 205, 10, '#0f172a', '#8b5cf6', 1.8);
        txt(ctx, 'ĐẶC TÍNH ĐỒNG VỊ ¹³¹I', 603, 98, '#c4b5fd', '800 14.5px sans-serif', 'center');
        labelPill(ctx, 474, 124, 'Phân rã: β⁻ và tia γ chẩn đoán', '#fde68a', '#422006', '#f59e0b');
        labelPill(ctx, 474, 162, 'Chu kì bán rã vật lý: T ≈ 8,02 ngày', '#bae6fd', '#082f49', '#0284c7');
        labelPill(ctx, 474, 200, 'An toàn: T đủ ngắn, giảm liều chiếu', '#34d399', '#064e3b', '#10b981');
    });

    // 13. MH-TT26-D3-P1-01: Hai phương thức biến đổi nội năng
    reg('MH-TT26-D3-P1-01', function(ctx, w, h, t) {
        drawTitle(ctx, 'HAI PHƯƠNG THỨC LÀM BIẾN ĐỔI NỘI NĂNG: THỰC HIỆN CÔNG & TRUYỀN NHIỆT', '#f59e0b');
        const u = (Math.sin(t * 1.4) + 1) / 2;
        // Khung trái: Nén pit-tông thực hiện công
        roundBox(ctx, 36, 56, 340, 226, 10, '#0f172a', '#38bdf8', 1.6);
        txt(ctx, 'CÁCH 1: THỰC HIỆN CÔNG (NÉN XILANH)', 206, 78, '#38bdf8', '800 13.5px sans-serif', 'center');
        const pY = 122 + u * 45;
        roundBox(ctx, 130, 105, 150, 132, 6, '#020617', '#64748b', 2.4);
        roundBox(ctx, 134, pY + 12, 142, 232 - (pY + 12), 2, 'rgba(56,189,248,0.22)', null);
        roundBox(ctx, 132, pY, 146, 12, 2, '#94a3b8', '#f8fafc', 1.6);
        arrowLine(ctx, 205, 92, 205, pY - 4, '#34d399', 3.2, 7);
        labelPill(ctx, 206, 248, 'Xilanh cách nhiệt: Q = 0, A > 0 ⇒ ΔU = A', '#bae6fd', '#082f49', '#0284c7', 'center');

        // Khung phải: Đun nóng truyền nhiệt đẳng tích
        roundBox(ctx, 404, 56, 340, 226, 10, '#0f172a', '#ef4444', 1.6);
        txt(ctx, 'CÁCH 2: TRUYỀN NHIỆT (ĐẲNG TÍCH)', 574, 78, '#fca5a5', '800 13.5px sans-serif', 'center');
        roundBox(ctx, 498, 105, 150, 114, 6, 'rgba(239,68,68,0.16)', '#94a3b8', 2.4);
        // Ngọn lửa dưới bình
        ctx.fillStyle = '#f97316';
        for (let fx = 526; fx <= 622; fx += 24) {
            ctx.beginPath();
            ctx.ellipse(fx, 232 - (Math.sin(t * 8 + fx) * 2), 8, 12, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        labelPill(ctx, 574, 248, 'Chốt pit-tông: A = 0, Q > 0 ⇒ ΔU = Q', '#fecaca', '#450a0a', '#ef4444', 'center');
    });

    // 14. MH-TT26-D3-P1-02: Đồ thị NLLK riêng Wlk/A theo A
    reg('MH-TT26-D3-P1-02', function(ctx, w, h, t) {
        drawTitle(ctx, 'ĐỒ THỊ NĂNG LƯỢNG LIÊN KẾT RIÊNG (W_lk / A) THEO SỐ KHỐI A', '#34d399');
        const ox = 85, oy = 256;
        arrowLine(ctx, ox, oy, ox, 62, '#94a3b8', 2.2, 7);
        arrowLine(ctx, ox, oy, 720, oy, '#94a3b8', 2.2, 7);
        txt(ctx, 'W_lk/A (MeV/nucl)', ox + 8, 66, '#cbd5e1', '700 13px sans-serif', 'left');
        txt(ctx, 'Số khối A', 722, oy - 16, '#cbd5e1', '700 13px sans-serif', 'right');

        // Vùng bền vững 50 <= A <= 80
        roundBox(ctx, ox + 115, 76, 98, 178, 4, 'rgba(16, 185, 129, 0.14)', 'rgba(16,185,129,0.5)', 1.2);
        txt(ctx, 'Vùng bền', ox + 164, 218, '#34d399', '800 12.5px sans-serif', 'center');
        txt(ctx, '50 < A < 80', ox + 164, 236, '#a7f3d0', '700 12px sans-serif', 'center');

        // Đường cong Wlk/A
        ctx.save();
        ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.moveTo(ox + 12, oy - 22);
        ctx.lineTo(ox + 34, oy - 138); // He-4 đỉnh nhọn nhỏ
        ctx.lineTo(ox + 48, oy - 110);
        ctx.quadraticCurveTo(ox + 145, oy - 162, ox + 215, oy - 156);
        ctx.lineTo(ox + 565, oy - 134); // U-235
        ctx.stroke();
        ctx.restore();

        // Chấm mốc He-4, Fe-56, U-235
        const pts = [
            { x: ox + 34, y: oy - 138, l: 'He-4', c: '#fbbf24' },
            { x: ox + 152, y: oy - 158, l: 'Fe-56 (~8,8)', c: '#34d399' },
            { x: ox + 565, y: oy - 134, l: 'U-235 (~7,6)', c: '#f43f5e' }
        ];
        pts.forEach(p => {
            ctx.fillStyle = p.c;
            ctx.beginPath(); ctx.arc(p.x, p.y, 5.2, 0, Math.PI * 2); ctx.fill();
            txt(ctx, p.l, p.x, p.y - 16, p.c, '800 12.5px sans-serif', 'center');
        });
        arrowLine(ctx, ox + 22, 224, ox + 110, 124, '#fbbf24', 2, 6);
        txt(ctx, 'Nhiệt hạch', ox + 66, 206, '#fde68a', '700 12px sans-serif', 'left');
        arrowLine(ctx, ox + 555, 160, ox + 225, 134, '#f43f5e', 2, 6);
        txt(ctx, 'Phân hạch (→ bền hơn)', ox + 395, 174, '#fda4af', '700 12.5px sans-serif', 'center');
    });

    // 15. MH-TT26-D3-P2-C1: Đun nước sôi đo nhiệt hóa hơi riêng L
    reg('MH-TT26-D3-P2-C1', function(ctx, w, h, t) {
        drawTitle(ctx, 'THÍ NGHIỆM ĐO NHIỆT HÓA HƠI RIÊNG CỦA NƯỚC Ở 100°C (MỞ NẮP)', '#f59e0b');
        roundBox(ctx, 90, 96, 180, 146, 10, '#0f172a', '#94a3b8', 2.4);
        roundBox(ctx, 96, 150, 168, 86, 4, 'rgba(56,189,248,0.28)', '#38bdf8', 1.4);
        // Hơi nước bốc lên
        for (let i = 0; i < 6; i++) {
            const hy = 138 - ((t * 36 + i * 20) % 72);
            const hx = 124 + i * 22 + Math.sin(t * 3 + i) * 5;
            ctx.fillStyle = 'rgba(226, 232, 240, 0.55)';
            ctx.beginPath(); ctx.arc(hx, hy, 4, 0, Math.PI * 2); ctx.fill();
        }
        // Cân điện tử bên dưới giảm khối lượng dần
        roundBox(ctx, 72, 246, 216, 42, 6, '#1e293b', '#38bdf8', 2);
        const curM = (250.0 - ((t * 1.8) % 24)).toFixed(1);
        txt(ctx, 'm = ' + curM + ' g (giảm)', 180, 267, '#34d399', '800 15px "DM Mono", monospace', 'center');

        // Bảng nguyên lý đo L
        roundBox(ctx, 330, 72, 418, 210, 10, '#0f172a', '#334155', 1.6);
        txt(ctx, 'ĐO NHIỆT HÓA HƠI RIÊNG Ở TRẠNG THÁI SÔI', 539, 98, '#38bdf8', '800 14px sans-serif', 'center');
        labelPill(ctx, 350, 122, 'Nhiệt độ nước luôn giữ cố định tại t = 100°C', '#bae6fd', '#082f49', '#0284c7');
        labelPill(ctx, 350, 160, 'Nhiệt điện cung cấp: Q = P · Δt (oát kế + đồng hồ)', '#fde68a', '#422006', '#f59e0b');
        labelPill(ctx, 350, 198, 'Khối lượng nước hóa hơi thoát ra: Δm = m₁ − m₂', '#fda4af', '#4c0519', '#f43f5e');
        txt(ctx, 'L = (P · Δt) / Δm  (J/kg)', 539, 250, '#34d399', '800 16px sans-serif', 'center');
    });

    // 16. MH-TT26-D3-P2-C2: Bóng thám không bay lên tầng bình lưu
    reg('MH-TT26-D3-P2-C2', function(ctx, w, h, t) {
        drawTitle(ctx, 'BÓNG THÁM KHÔNG CHỨA HELIUM GIÃN NỞ THEO ĐỘ CAO KHÍ QUYỂN', '#38bdf8');
        // Đất
        roundBox(ctx, 40, 254, 410, 34, 4, '#064e3b', '#10b981', 1.5);
        txt(ctx, 'Mặt đất (h = 0, p₀ ≈ 101 kPa, T₀ = 300 K)', 245, 271, '#a7f3d0', '700 12.5px sans-serif', 'center');

        const rise = (t * 0.25) % 1;
        const by = 216 - rise * 130;
        const br = 22 + rise * 22; // giãn nở to hơn khi lên cao
        ctx.save();
        ctx.fillStyle = 'rgba(245, 158, 11, 0.25)';
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2.6;
        ctx.beginPath(); ctx.arc(225, by, br, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(225, by + br); ctx.lineTo(225, by + br + 16); ctx.stroke();
        roundBox(ctx, 215, by + br + 16, 20, 12, 2, '#38bdf8', '#e0f2fe', 1);
        ctx.restore();
        txt(ctx, 'Khí He', 225, by, '#fde68a', '800 13px sans-serif', 'center');

        roundBox(ctx, 468, 62, 286, 224, 10, '#0f172a', '#334155', 1.6);
        txt(ctx, 'BIẾN THIÊN TRẠNG THÁI THEO ĐỘ CAO', 611, 86, '#38bdf8', '800 13px sans-serif', 'center');
        labelPill(ctx, 482, 112, 'Độ cao h ↑ ⇒ Áp suất khí quyển p ↓', '#bae6fd', '#082f49', '#0284c7');
        labelPill(ctx, 482, 150, 'Vỏ đàn hồi cho khí giãn nở: V ↑', '#fde68a', '#422006', '#f59e0b');
        labelPill(ctx, 482, 188, 'Phương trình: p₁V₁/T₁ = p₂V₂/T₂', '#34d399', '#064e3b', '#10b981');
        labelPill(ctx, 482, 226, 'Vượt giới hạn bền vỏ ⇒ Bóng nổ (~40 km)', '#fda4af', '#4c0519', '#f43f5e');
    });

    // 17. MH-TT26-D3-P2-C3: Sóng điện từ phẳng E & B cùng pha
    reg('MH-TT26-D3-P2-C3', function(ctx, w, h, t) {
        drawTitle(ctx, 'SÓNG ĐIỆN TỪ PHẲNG LAN TRUYỀN: DAO ĐỘNG ĐIỆN TRƯỜNG E & TỪ TRƯỜNG B CÙNG PHA', '#34d399');
        const oy = 175;
        arrowLine(ctx, 65, oy, 710, oy, '#94a3b8', 2.2, 8);
        txt(ctx, 'v (phương truyền Ox)', 712, oy + 18, '#e2e8f0', '800 13px sans-serif', 'right');

        // Sóng E (trục thẳng đứng Oy) và B (trục xiên Oz)
        ctx.save();
        // Vẽ E (cyan)
        ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2.6;
        ctx.beginPath();
        for (let x = 80; x <= 650; x += 4) {
            const ph = (x - 80) * 0.032 - t * 3.2;
            const ey = oy - Math.sin(ph) * 76;
            if (x === 80) ctx.moveTo(x, ey); else ctx.lineTo(x, ey);
        }
        ctx.stroke();
        // Vẽ B (amber - xiên 30 độ)
        ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2.6;
        ctx.beginPath();
        for (let x = 80; x <= 650; x += 4) {
            const ph = (x - 80) * 0.032 - t * 3.2;
            const amp = Math.sin(ph) * 44;
            const bx = x - amp * 0.65, by = oy + amp * 0.65;
            if (x === 80) ctx.moveTo(bx, by); else ctx.lineTo(bx, by);
        }
        ctx.stroke();

        // Vectơ đứng E & B tại một số điểm cùng pha
        for (let x = 128; x <= 610; x += 48) {
            const ph = (x - 80) * 0.032 - t * 3.2;
            const s = Math.sin(ph);
            if (Math.abs(s) > 0.25) {
                arrowLine(ctx, x, oy, x, oy - s * 74, 'rgba(56,189,248,0.8)', 1.8, 5);
                arrowLine(ctx, x, oy, x - s * 28, oy + s * 28, 'rgba(245,158,11,0.8)', 1.8, 5);
            }
        }
        ctx.restore();

        labelPill(ctx, 56, 62, 'E ⊥ B ⊥ v (Tam diện thuận)', '#bae6fd', '#082f49', '#0284c7');
        labelPill(ctx, 300, 62, 'E và B dao động CÙNG PHA', '#34d399', '#064e3b', '#10b981');
        labelPill(ctx, 540, 62, 'Sóng ngang truyền trong chân không', '#fde68a', '#422006', '#f59e0b');
    });

    // 18. MH-TT26-D3-P2-C4: Lò phản ứng hạt nhân nước áp lực PWR
    reg('MH-TT26-D3-P2-C4', function(ctx, w, h, t) {
        drawTitle(ctx, 'LÒ PHẢN ỨNG PHÂN HẠCH HẠT NHÂN U-235 & THANH ĐIỀU KHIỂN NEUTRON', '#f43f5e');
        // Vỏ bảo vệ lò phản ứng
        roundBox(ctx, 58, 66, 260, 214, 14, '#0f172a', '#64748b', 3.2);
        txt(ctx, 'TÂM LÒ PHẢN ỨNG', 188, 86, '#fda4af', '800 13.5px sans-serif', 'center');

        // Thanh nhiên liệu U-235
        [105, 165, 225].forEach(fx => {
            roundBox(ctx, fx, 142, 20, 112, 3, '#b91c1c', '#fca5a5', 1.6);
        });
        // Thanh điều khiển Boron lên/xuống
        const rodOff = Math.sin(t * 1.1) * 20;
        [135, 195].forEach(rx => {
            roundBox(ctx, rx, 98 + rodOff, 18, 92, 3, '#334155', '#38bdf8', 2);
        });
        txt(ctx, 'Thanh Boron', 188, 120, '#7dd3fc', '700 12px sans-serif', 'center');

        // Chấm neutron bay qua lại
        for (let i = 0; i < 6; i++) {
            const nx = 92 + ((t * 95 + i * 38) % 185);
            const ny = 158 + ((i * 29) % 85);
            ctx.fillStyle = '#fde047';
            ctx.beginPath(); ctx.arc(nx, ny, 3.8, 0, Math.PI * 2); ctx.fill();
        }

        // Bảng tóm tắt phản ứng dây chuyền
        roundBox(ctx, 348, 66, 398, 214, 10, '#0f172a', '#334155', 1.6);
        txt(ctx, 'KIỂM SOÁT HỆ SỐ NHÂN NEUTRON k = 1', 547, 94, '#38bdf8', '800 14px sans-serif', 'center');
        labelPill(ctx, 366, 120, 'Thanh nhiên liệu chứa U-235 phân hạch tỏa nhiệt', '#fecaca', '#450a0a', '#ef4444');
        labelPill(ctx, 366, 158, 'Nước làm chậm giúp neutron nhanh thành neutron chậm', '#bae6fd', '#082f49', '#0284c7');
        labelPill(ctx, 366, 196, 'Hạ thanh điều khiển (B, Cd) hấp thụ bớt n ⇒ giảm P', '#34d399', '#064e3b', '#10b981');
        txt(ctx, 'Mất kiểm soát khi k > 1 | Dừng lò khi k < 1', 547, 250, '#fbbf24', '800 13.5px sans-serif', 'center');
    });

    // 19. MH-TT26-D4-P1-01: Khung dây quay đều tạo dòng xoay chiều
    reg('MH-TT26-D4-P1-01', function(ctx, w, h, t) {
        drawTitle(ctx, 'KHUNG DÂY QUAY ĐỀU TRONG TỪ TRƯỜNG ĐỀU & ĐỒ THỊ Φ(t), e(t)', '#38bdf8');
        // Nam châm N - S & khung quay bên trái
        roundBox(ctx, 42, 118, 42, 112, 4, '#991b1b', '#f87171', 2);
        roundBox(ctx, 250, 118, 42, 112, 4, '#1e40af', '#60a5fa', 2);
        txt(ctx, 'N', 63, 174, '#fee2e2', '900 18px sans-serif', 'center');
        txt(ctx, 'S', 271, 174, '#dbeafe', '900 18px sans-serif', 'center');
        arrowLine(ctx, 94, 174, 240, 174, 'rgba(56,189,248,0.45)', 2, 7);

        const omega = 2.0;
        const ang = t * omega;
        const rProj = Math.cos(ang) * 44;
        ctx.save();
        ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 3.5;
        ctx.strokeRect(167 - Math.abs(rProj), 124, Math.max(4, Math.abs(rProj) * 2), 98);
        ctx.restore();
        txt(ctx, 'Khung N vòng, ω', 167, 252, '#fde68a', '700 13px sans-serif', 'center');

        // Đồ thị Φ(t) và e(t) bên phải
        const gx = 355, gy = 175;
        roundBox(ctx, 318, 58, 434, 224, 10, '#0f172a', '#1e293b', 1.6);
        arrowLine(ctx, gx, gy, gx, 74, '#94a3b8', 2, 6);
        arrowLine(ctx, gx, gy, 730, gy, '#94a3b8', 2, 6);
        ctx.save();
        ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2.8;
        ctx.beginPath();
        for (let dx = 0; dx <= 350; dx += 4) {
            const p = dx * 0.036 - t * omega;
            const y = gy - Math.cos(p) * 58;
            if (dx === 0) ctx.moveTo(gx + dx, y); else ctx.lineTo(gx + dx, y);
        }
        ctx.stroke();
        ctx.strokeStyle = '#34d399'; ctx.lineWidth = 2.8;
        ctx.beginPath();
        for (let dx = 0; dx <= 350; dx += 4) {
            const p = dx * 0.036 - t * omega;
            const y = gy - Math.sin(p) * 58;
            if (dx === 0) ctx.moveTo(gx + dx, y); else ctx.lineTo(gx + dx, y);
        }
        ctx.stroke();
        ctx.restore();
        labelPill(ctx, 385, 72, 'Φ(t) = Φ₀cos(ωt)', '#7dd3fc', '#082f49', '#0284c7');
        labelPill(ctx, 565, 72, 'e(t) trễ pha π/2 so với Φ(t)', '#34d399', '#064e3b', '#10b981');
    });

    // 20. MH-TT26-D4-P1-02: Đồ thị đẳng tích p(t°C) ngoại suy -273,15°C
    reg('MH-TT26-D4-P1-02', function(ctx, w, h, t) {
        drawTitle(ctx, 'ĐỒ THỊ ĐẲNG TÍCH p(t°C) VÀ NGOẠI SUY ĐỘ KHÔNG TUYỆT ĐỐI −273,15°C', '#f59e0b');
        const ox = 395, oy = 252;
        arrowLine(ctx, ox, oy, ox, 64, '#94a3b8', 2.2, 7);
        arrowLine(ctx, 88, oy, 710, oy, '#94a3b8', 2.2, 7);
        txt(ctx, 'p (kPa)', ox + 10, 68, '#e2e8f0', '700 13.5px sans-serif', 'left');
        txt(ctx, 't (°C)', 710, oy - 16, '#e2e8f0', '700 13.5px sans-serif', 'right');
        txt(ctx, 'O (0°C)', ox + 6, oy + 16, '#94a3b8', '700 12.5px sans-serif', 'left');

        const zeroX = 165;
        ctx.fillStyle = '#f43f5e';
        ctx.beginPath(); ctx.arc(zeroX, oy, 5.5, 0, Math.PI * 2); ctx.fill();
        txt(ctx, '−273,15°C (0 K)', zeroX, oy + 20, '#fda4af', '800 13.5px sans-serif', 'center');

        // Vẽ 2 đường đẳng tích V1 < V2
        [{ endY: 78, lbl: 'V₁ (nhỏ hơn)', col: '#38bdf8' }, { endY: 140, lbl: 'V₂ (lớn hơn)', col: '#34d399' }].forEach(ln => {
            const x0 = ox, y0 = oy - (oy - ln.endY) * ((ox - zeroX) / (650 - zeroX));
            ctx.save();
            ctx.strokeStyle = ln.col; ctx.lineWidth = 2.6;
            ctx.setLineDash([6, 5]);
            ctx.beginPath(); ctx.moveTo(zeroX, oy); ctx.lineTo(x0, y0); ctx.stroke();
            ctx.setLineDash([]);
            ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(650, ln.endY); ctx.stroke();
            ctx.restore();
            txt(ctx, ln.lbl, 656, ln.endY, ln.col, '800 13px sans-serif', 'left');
        });
        const dotU = (Math.sin(t * 1.2) + 1) / 2;
        const dx = ox + dotU * (630 - ox);
        const dy = oy - (oy - 78) * ((dx - zeroX) / (650 - zeroX));
        ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(dx, dy, 5, 0, Math.PI * 2); ctx.fill();
    });

    // 21. MH-TT26-D4-P2-C1: Bình giữ nhiệt chân không hai lớp tráng bạc
    reg('MH-TT26-D4-P2-C1', function(ctx, w, h, t) {
        drawTitle(ctx, 'MẶT CẮT BÌNH GIỮ NHIỆT CHÂN KHÔNG HAI LỚP TRÁNG BẠC HẠN CHẾ TRUYỀN NHIỆT', '#38bdf8');
        // Vỏ ngoài -> Lớp chân không -> Ruột trong tráng bạc -> Nước nóng
        roundBox(ctx, 110, 88, 170, 185, 16, '#1e293b', '#94a3b8', 2.4);
        roundBox(ctx, 128, 102, 134, 158, 10, '#020617', '#e2e8f0', 2); // khoảng chân không + bạc
        roundBox(ctx, 138, 112, 114, 138, 6, 'rgba(239, 68, 68, 0.25)', '#ef4444', 1.4);
        roundBox(ctx, 146, 68, 98, 28, 6, '#475569', '#cbd5e1', 2); // nắp kín

        // Tia phản xạ nhiệt bức xạ quay lại bên trong
        const p = (t * 0.7) % 1;
        arrowLine(ctx, 195, 185, 246, 152, '#f97316', 2, 6);
        arrowLine(ctx, 246, 152, 200, 126, '#fbbf24', 2, 6);
        ctx.fillStyle = '#fde047';
        ctx.beginPath(); ctx.arc(195 + p * 45, 185 - p * 30, 3.8, 0, Math.PI * 2); ctx.fill();

        txt(ctx, 'Nước nóng', 195, 208, '#fecaca', '800 13.5px sans-serif', 'center');
        txt(ctx, 'Chân không', 195, 256, '#94a3b8', '700 12px sans-serif', 'center');

        // 3 cơ chế ngăn truyền nhiệt
        roundBox(ctx, 325, 72, 420, 208, 10, '#0f172a', '#334155', 1.6);
        txt(ctx, 'NGĂN CHẶN ĐỒNG THỜI 3 CƠ CHẾ TRUYỀN NHIỆT', 535, 98, '#fbbf24', '800 13.5px sans-serif', 'center');
        labelPill(ctx, 344, 126, '1. Lớp chân không: Triệt tiêu DẪN NHIỆT & ĐỐI LƯU', '#bae6fd', '#082f49', '#0284c7');
        labelPill(ctx, 344, 166, '2. Thành ruột tráng bạc: Phản xạ tia BỨC XẠ NHIỆT', '#fde68a', '#422006', '#f59e0b');
        labelPill(ctx, 344, 206, '3. Nắp cách nhiệt kín: Giảm bay hơi & đối lưu ra ngoài', '#34d399', '#064e3b', '#10b981');
    });

    // 22. MH-TT26-D4-P2-C2: Cột khí giam bởi giọt thủy ngân định luật Charles
    reg('MH-TT26-D4-P2-C2', function(ctx, w, h, t) {
        drawTitle(ctx, 'THÍ NGHIỆM ĐỊNH LUẬT CHARLES: CỘT KHÍ GIAM BỞI GIỌT THỦY NGÂN TRONG BỂ ĐIỀU NHIỆT', '#34d399');
        const tempC = 20 + Math.round(((Math.sin(t * 0.9) + 1) / 2) * 60); // 20..80 °C
        const tk = tempC + 273;
        const lenMm = Math.round(140 * (tk / 293));

        // Bể điều nhiệt
        roundBox(ctx, 56, 78, 390, 198, 10, 'rgba(14, 165, 233, 0.14)', '#38bdf8', 2.2);
        txt(ctx, 'Bể nước điều nhiệt: t = ' + tempC + '°C (' + tk + ' K)', 251, 98, '#7dd3fc', '800 14px sans-serif', 'center');

        // Ống thủy tinh nằm ngang trong bể
        roundBox(ctx, 84, 146, 336, 36, 4, '#020617', '#cbd5e1', 2);
        roundBox(ctx, 86, 150, lenMm, 28, 2, 'rgba(52, 211, 153, 0.25)', null);
        roundBox(ctx, 86 + lenMm, 150, 26, 28, 4, '#94a3b8', '#f8fafc', 1.6); // giọt Hg
        txt(ctx, 'Không khí (L = ' + lenMm + ' mm)', 86 + lenMm / 2, 164, '#a7f3d0', '700 12.5px sans-serif', 'center');
        txt(ctx, 'Hg', 99 + lenMm, 164, '#0f172a', '900 12.5px sans-serif', 'center');
        txt(ctx, 'p = p₀ (đẳng áp)', 362, 198, '#cbd5e1', '700 12.5px sans-serif', 'center');

        // Bảng nguyên lý
        roundBox(ctx, 470, 78, 282, 198, 10, '#0f172a', '#334155', 1.6);
        txt(ctx, 'QUÁ TRÌNH ĐẲNG ÁP', 611, 102, '#34d399', '800 14px sans-serif', 'center');
        labelPill(ctx, 488, 130, 'Tiết diện S đều ⇒ V = S · L', '#bae6fd', '#082f49', '#0284c7');
        labelPill(ctx, 488, 168, 'L / T = const (T tính theo Kelvin)', '#fde68a', '#422006', '#f59e0b');
        labelPill(ctx, 488, 206, 'Không mở nút: khí luôn kín (n = const)', '#34d399', '#064e3b', '#10b981');
    });

    // 23. MH-TT26-D4-P2-C3: Khối phổ kế tách 2 đồng vị ion dương
    reg('MH-TT26-D4-P2-C3', function(ctx, w, h, t) {
        drawTitle(ctx, 'KHỐI PHỔ KẾ: BỘ LỌC VẬN TỐC (E, B₁) VÀ BUỒNG PHÂN TÁCH ĐỒNG VỊ (B₂)', '#a78bfa');
        // Nguồn & khe hẹp
        roundBox(ctx, 36, 132, 68, 46, 6, '#334155', '#94a3b8', 2);
        txt(ctx, 'Ion (+)', 70, 155, '#fde68a', '800 13px sans-serif', 'center');

        // Bộ lọc vận tốc
        roundBox(ctx, 130, 92, 156, 126, 8, 'rgba(56,189,248,0.1)', '#38bdf8', 1.8);
        txt(ctx, 'Lọc v = E/B₁', 208, 76, '#7dd3fc', '800 13px sans-serif', 'center');
        arrowLine(ctx, 104, 155, 340, 155, '#fbbf24', 2.4, 7);

        // Buồng từ B2 + tấm cảm biến
        roundBox(ctx, 340, 62, 396, 224, 10, '#0f172a', '#8b5cf6', 2);
        roundBox(ctx, 336, 68, 10, 212, 2, '#34d399', '#10b981', 1); // Tấm ghi
        txt(ctx, 'Tấm ghi (B₂ ⊗)', 540, 82, '#c4b5fd', '800 13.5px sans-serif', 'center');

        // 2 quỹ đạo bán tròn bán kính R1 < R2 (quẹo xuống dưới theo lực Lorentz)
        ctx.save();
        ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(340, 155 + 42, 42, -Math.PI / 2, Math.PI / 2); ctx.stroke();
        ctx.strokeStyle = '#f43f5e'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(340, 155 + 62, 62, -Math.PI / 2, Math.PI / 2); ctx.stroke();
        ctx.restore();

        // Ion chuyển động
        const ph = (t * 0.55) % 1;
        if (ph < 0.4) {
            const x = 104 + (ph / 0.4) * 236;
            ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(x, 155, 4.5, 0, Math.PI * 2); ctx.fill();
        } else {
            const u = (ph - 0.4) / 0.6;
            const ang = -Math.PI / 2 + u * Math.PI;
            ctx.fillStyle = '#38bdf8'; ctx.beginPath(); ctx.arc(340 + 42 * Math.cos(ang), 197 + 42 * Math.sin(ang), 4.5, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#f43f5e'; ctx.beginPath(); ctx.arc(340 + 62 * Math.cos(ang), 217 + 62 * Math.sin(ang), 4.5, 0, Math.PI * 2); ctx.fill();
        }
        labelPill(ctx, 435, 166, 'R₁ = m₁v/(qB₂) — Đồng vị nhẹ', '#7dd3fc', '#082f49', '#0284c7');
        labelPill(ctx, 435, 206, 'R₂ = m₂v/(qB₂) — Đồng vị nặng', '#fda4af', '#4c0519', '#f43f5e');
        txt(ctx, 'Khoảng cách 2 vết d = 2(R₂ − R₁)', 560, 256, '#34d399', '800 13.5px sans-serif', 'center');
    });

    // 24. MH-TT26-D4-P2-C4: Đầu báo khói ion hóa dùng nguồn Am-241
    reg('MH-TT26-D4-P2-C4', function(ctx, w, h, t) {
        drawTitle(ctx, 'CẢM BIẾN BÁO KHÓI ION HÓA SỬ DỤNG NGUỒN PHÓNG XẠ α (Am-241)', '#f43f5e');
        roundBox(ctx, 52, 74, 340, 208, 12, '#0f172a', '#64748b', 2.2);
        roundBox(ctx, 76, 94, 292, 16, 4, '#991b1b', '#f87171', 1.6);
        roundBox(ctx, 76, 246, 292, 16, 4, '#1e40af', '#60a5fa', 1.6);
        txt(ctx, 'Điện cực dương (+)', 222, 102, '#fee2e2', '700 11.5px sans-serif', 'center');
        txt(ctx, 'Điện cực âm (−)', 222, 254, '#dbeafe', '700 11.5px sans-serif', 'center');

        // Nguồn Am-241
        roundBox(ctx, 90, 158, 52, 36, 6, '#f59e0b', '#fef08a', 2);
        txt(ctx, 'Am²⁴¹', 116, 176, '#0f172a', '900 12.5px sans-serif', 'center');

        const smoky = Math.sin(t * 1.1) > 0;
        for (let i = 0; i < 6; i++) {
            const ax = 152 + ((t * 60 + i * 32) % 195);
            const ay = 135 + ((i * 23) % 85);
            ctx.fillStyle = smoky ? '#94a3b8' : '#34d399';
            ctx.beginPath(); ctx.arc(ax, ay, smoky ? 6 : 3.8, 0, Math.PI * 2); ctx.fill();
        }
        txt(ctx, smoky ? 'KHÓI VÀO → Ion bị giữ, I ↓↓' : 'SẠCH → Ion hóa mạnh, I ổn định', 222, 224, smoky ? '#fda4af' : '#34d399', '800 13px sans-serif', 'center');

        // Mạch phát hiện & còi
        roundBox(ctx, 422, 74, 326, 208, 10, '#0f172a', smoky ? '#ef4444' : '#10b981', 2);
        txt(ctx, smoky ? '🔔 CÒI BÁO CHÁY KÍCH HOẠT!' : '🟢 TRẠNG THÁI GIÁM SÁT AN TOÀN', 585, 104, smoky ? '#f87171' : '#34d399', '800 14px sans-serif', 'center');
        labelPill(ctx, 438, 134, 'Tia α có khả năng ion hóa không khí cực mạnh', '#fde68a', '#422006', '#f59e0b');
        labelPill(ctx, 438, 174, 'Bị vỏ nhựa mỏng chặn lại → An toàn ngoài buồng', '#bae6fd', '#082f49', '#0284c7');
        labelPill(ctx, 438, 214, 'Chu kì bán rã Am-241 dài (~432 năm) → Dùng bền', '#c4b5fd', '#2e1065', '#8b5cf6');
    });

    // 25. MH-TT26-D5-P1-01: Đường sức từ của ống dây Solenoid & kim nam châm thử
    reg('MH-TT26-D5-P1-01', function(ctx, w, h, t) {
        drawTitle(ctx, 'ĐƯỜNG SỨC TỪ CỦA ỐNG DÂY ĐIỆN HÌNH TRỤ (SOLENOID) & KIM NAM CHÂM THỬ', '#38bdf8');
        // Lõi ống dây + cuộn dây
        roundBox(ctx, 210, 128, 300, 68, 8, 'rgba(30,41,59,0.75)', '#64748b', 2);
        ctx.save();
        ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 4;
        for (let vx = 232; vx <= 492; vx += 26) {
            ctx.beginPath(); ctx.moveTo(vx, 125); ctx.lineTo(vx + 10, 199); ctx.stroke();
        }
        ctx.restore();
        txt(ctx, 'Đầu S', 194, 162, '#60a5fa', '900 16px sans-serif', 'right');
        txt(ctx, 'Đầu N', 526, 162, '#f87171', '900 16px sans-serif', 'left');

        // Đường sức từ dọc trục (từ trái -> phải, ra Bắc vào Nam)
        arrowLine(ctx, 90, 162, 680, 162, '#38bdf8', 2.8, 8);
        ctx.save();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)'; ctx.lineWidth = 2.2;
        [-1, 1].forEach(sg => {
            ctx.beginPath();
            ctx.ellipse(360, 162 + sg * 54, 215, 42, 0, 0, Math.PI * 2);
            ctx.stroke();
        });
        ctx.restore();

        // Kim nam châm thử định hướng (cực N chỉ hướng đường sức)
        function drawCompass(cx, cy, dir) {
            ctx.save();
            ctx.translate(cx, cy);
            const wob = Math.sin(t * 2 + cx) * 0.04;
            ctx.rotate(dir + wob);
            ctx.fillStyle = '#3b82f6'; ctx.beginPath(); ctx.moveTo(-22, 0); ctx.lineTo(0, -7); ctx.lineTo(0, 7); ctx.closePath(); ctx.fill();
            ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.moveTo(22, 0); ctx.lineTo(0, -7); ctx.lineTo(0, 7); ctx.closePath(); ctx.fill();
            ctx.restore();
        }
        drawCompass(120, 162, 0);        // Kim 1: cực N phải
        drawCompass(625, 162, 0);        // Kim 2: cực N phải
        drawCompass(360, 66, Math.PI);   // Kim 3 phía trên: hướng ngược về S (trái)
        labelPill(ctx, 390, 248, 'Quy tắc nắm tay phải: Bên ngoài vào Nam (S) ra Bắc (N)', '#bae6fd', '#082f49', '#0284c7', 'center');
    });

    // 26. MH-TT26-D5-P1-02: Đồ thị phân rã N(t) và ΔN(t)
    reg('MH-TT26-D5-P1-02', function(ctx, w, h, t) {
        drawTitle(ctx, 'ĐỒ THỊ SỐ HẠT CÒN LẠI N(t) VÀ SỐ HẠT ĐÃ PHÂN RÃ ΔN(t) THEO THỜI GIAN', '#34d399');
        const ox = 95, oy = 252, mx = 620, hh = 176;
        arrowLine(ctx, ox, oy, ox, 62, '#94a3b8', 2.2, 7);
        arrowLine(ctx, ox, oy, 690, oy, '#94a3b8', 2.2, 7);
        txt(ctx, 'Số hạt', ox + 8, 66, '#cbd5e1', '700 13px sans-serif', 'left');
        txt(ctx, 't / T', 690, oy + 14, '#cbd5e1', '700 13px sans-serif', 'right');
        txt(ctx, 'N₀', ox - 10, oy - hh, '#e2e8f0', '800 13px sans-serif', 'right');
        txt(ctx, 'N₀/2', ox - 10, oy - hh / 2, '#fbbf24', '800 13px sans-serif', 'right');

        ctx.save();
        ctx.strokeStyle = 'rgba(148,163,184,0.35)'; ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(ox, oy - hh); ctx.lineTo(mx, oy - hh); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(ox, oy - hh / 2); ctx.lineTo(ox + 150, oy - hh / 2); ctx.lineTo(ox + 150, oy); ctx.stroke();
        ctx.restore();
        txt(ctx, 'T', ox + 150, oy + 16, '#fbbf24', '800 13px sans-serif', 'center');
        txt(ctx, '2T', ox + 300, oy + 16, '#94a3b8', '700 12.5px sans-serif', 'center');
        txt(ctx, '3T', ox + 450, oy + 16, '#94a3b8', '700 12.5px sans-serif', 'center');

        // Đường N(t) & DeltaN(t)
        ctx.save();
        ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 3;
        ctx.beginPath();
        for (let k = 0; k <= 3.4; k += 0.05) {
            const px = ox + k * 150, py = oy - hh * Math.pow(2, -k);
            if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 3;
        ctx.beginPath();
        for (let k = 0; k <= 3.4; k += 0.05) {
            const px = ox + k * 150, py = oy - hh * (1 - Math.pow(2, -k));
            if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.restore();

        const ph = ((t * 0.45) % 3.2);
        ctx.fillStyle = '#38bdf8'; ctx.beginPath(); ctx.arc(ox + ph * 150, oy - hh * Math.pow(2, -ph), 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#f59e0b'; ctx.beginPath(); ctx.arc(ox + ph * 150, oy - hh * (1 - Math.pow(2, -ph)), 5, 0, Math.PI * 2); ctx.fill();

        labelPill(ctx, 435, 76, 'ΔN(t) = N₀(1 − 2⁻ᵗ/ᵀ)', '#fde68a', '#422006', '#f59e0b');
        labelPill(ctx, 435, 206, 'N(t) = N₀·2⁻ᵗ/ᵀ', '#7dd3fc', '#082f49', '#0284c7');
    });

    // 27. MH-TT26-D5-P2-C1: Hệ thống tản nhiệt nước tuần hoàn cho CPU công suất cao
    reg('MH-TT26-D5-P2-C1', function(ctx, w, h, t) {
        drawTitle(ctx, 'MÔ HÌNH TẢN NHIỆT NƯỚC TUẦN HOÀN LÀM MÁT CỤM MÁY CHỦ CÔNG SUẤT P', '#38bdf8');
        // Block đồng trên CPU
        roundBox(ctx, 64, 152, 130, 62, 8, '#9a3412', '#f97316', 2.2);
        txt(ctx, 'CPU / Chip P', 129, 183, '#ffedd5', '800 14px sans-serif', 'center');
        roundBox(ctx, 76, 114, 106, 38, 6, '#0284c7', '#7dd3fc', 2);
        txt(ctx, 'Block nước', 129, 133, '#f0f9ff', '700 12.5px sans-serif', 'center');

        // Két tản nhiệt bên phải
        roundBox(ctx, 515, 92, 195, 136, 8, '#0f172a', '#64748b', 2.2);
        for (let y = 112; y <= 208; y += 24) {
            ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 3;
            ctx.beginPath(); ctx.moveTo(532, y); ctx.lineTo(692, y); ctx.stroke();
        }
        txt(ctx, 'Két tản nhiệt gió', 612, 246, '#bae6fd', '800 13px sans-serif', 'center');

        // Ống nước nóng (trên) & nước mát (dưới)
        arrowLine(ctx, 182, 126, 512, 126, '#f43f5e', 4, 8);
        txt(ctx, 'Nước nóng t₂ (lưu lượng μ)', 347, 108, '#fda4af', '800 13px sans-serif', 'center');
        arrowLine(ctx, 512, 196, 182, 196, '#38bdf8', 4, 8);
        txt(ctx, 'Nước mát t₁ trở về', 347, 214, '#7dd3fc', '800 13px sans-serif', 'center');

        // Chấm dòng chảy
        const fp = (t * 0.7) % 1;
        ctx.fillStyle = '#fecaca'; ctx.beginPath(); ctx.arc(190 + fp * 310, 126, 4.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#bae6fd'; ctx.beginPath(); ctx.arc(500 - fp * 310, 196, 4.5, 0, Math.PI * 2); ctx.fill();
        labelPill(ctx, 390, 256, 'Cân bằng ổn định: P_tỏa = μ · c · (t₂ − t₁)', '#34d399', '#064e3b', '#10b981', 'center');
    });

    // 28. MH-TT26-D5-P2-C2: Van đối trọng an toàn của nồi áp suất
    reg('MH-TT26-D5-P2-C2', function(ctx, w, h, t) {
        drawTitle(ctx, 'VAN ĐỐI TRỌNG AN TOÀN CỦA NỒI ÁP SUẤT GIỮ ÁP SUẤT HƠI ỔN ĐỊNH', '#f59e0b');
        const lift = Math.max(0, Math.sin(t * 2.2)) * 8;
        // Thân nồi
        roundBox(ctx, 90, 134, 240, 140, 12, '#0f172a', '#94a3b8', 3);
        roundBox(ctx, 100, 190, 220, 74, 4, 'rgba(249, 115, 22, 0.25)', '#f97316', 1.4);
        txt(ctx, 'Hơi nén p = p₀ + mg/S', 210, 166, '#fde68a', '800 13.5px sans-serif', 'center');
        txt(ctx, 'Nước sôi > 100°C', 210, 228, '#fed7aa', '700 13px sans-serif', 'center');

        // Lỗ thoát & van đối trọng
        roundBox(ctx, 194, 114, 32, 22, 2, '#1e293b', '#cbd5e1', 2);
        roundBox(ctx, 186, 86 - lift, 48, 28, 6, '#f59e0b', '#fef08a', 2.2);
        txt(ctx, 'Van m', 210, 100 - lift, '#0f172a', '900 12.5px sans-serif', 'center');
        if (lift > 3) {
            arrowLine(ctx, 174, 110, 146, 86, '#e2e8f0', 2, 6);
            arrowLine(ctx, 246, 110, 274, 86, '#e2e8f0', 2, 6);
        }

        // Bảng nguyên lý bên phải
        roundBox(ctx, 370, 70, 380, 208, 10, '#0f172a', '#334155', 1.6);
        txt(ctx, 'ĐIỀU KIỆN XẢ ÁP CỦA VAN', 560, 96, '#fbbf24', '800 14px sans-serif', 'center');
        labelPill(ctx, 388, 124, 'Cân bằng lực: p · S = p₀ · S + m · g', '#fde68a', '#422006', '#f59e0b');
        labelPill(ctx, 388, 164, 'Ngưỡng mở van: p_max = p₀ + mg / S', '#bae6fd', '#082f49', '#0284c7');
        labelPill(ctx, 388, 204, 'Áp suất cao làm nhiệt độ sôi nước tăng > 100°C', '#34d399', '#064e3b', '#10b981');
    });

    // 29. MH-TT26-D5-P2-C3: Phanh dòng Foucault tấm nhôm liền vs xẻ rãnh
    reg('MH-TT26-D5-P2-C3', function(ctx, w, h, t) {
        drawTitle(ctx, 'THÍ NGHIỆM PHANH DÒNG FOUCAULT: TẤM NHÔM LIỀN KHỐI VS TẤM XẺ RÃNH', '#34d399');
        const panels = [
            { cx: 195, title: 'TẤM LIỀN KHỐI (Dòng xoáy lớn)', solid: true, col: '#f43f5e' },
            { cx: 565, title: 'TẤM XẺ RÃNH (Cản dòng xoáy)', solid: false, col: '#34d399' }
        ];
        panels.forEach(p => {
            roundBox(ctx, p.cx - 155, 56, 310, 226, 10, '#0f172a', '#1e293b', 1.6);
            txt(ctx, p.title, p.cx, 76, p.col, '800 13.5px sans-serif', 'center');
            // Vùng từ trường B vuông góc
            roundBox(ctx, p.cx - 58, 174, 116, 68, 6, 'rgba(56,189,248,0.12)', '#38bdf8', 1.6);
            txt(ctx, 'Vùng ⊗ B đều', p.cx + 62, 162, '#7dd3fc', '700 12px sans-serif', 'left');
            const amp = p.solid ? Math.max(0.06, Math.exp(-((t * 0.7) % 3) * 1.4)) * 0.42 : 0.42;
            const ang = amp * Math.sin(t * 4.2);
            ctx.save();
            ctx.translate(p.cx, 98);
            ctx.rotate(ang);
            ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 3;
            ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 88); ctx.stroke();
            roundBox(ctx, -28, 86, 56, 44, 4, '#64748b', '#e2e8f0', 1.8);
            if (!p.solid) {
                for (let sx = -16; sx <= 16; sx += 16) {
                    roundBox(ctx, sx - 2, 96, 4, 34, 1, '#0f172a', null);
                }
            } else {
                ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.arc(0, 108, 12, 0, Math.PI * 1.7); ctx.stroke();
            }
            ctx.restore();
            txt(ctx, p.solid ? 'Tắt dao động RẤT NHANH' : 'Dao động duy trì LÂU', p.cx, 260, p.col, '800 13px sans-serif', 'center');
        });
    });

    // 30. MH-TT26-D5-P2-C4: Định tuổi Carbon-14 mẫu gỗ cổ
    reg('MH-TT26-D5-P2-C4', function(ctx, w, h, t) {
        drawTitle(ctx, 'ĐỊNH TUỔI CỔ VẬT BẰNG ĐỒNG VỊ PHÓNG XẠ CARBON-14 (T = 5730 NĂM)', '#a78bfa');
        const stages = [
            { x: 42, title: '1. KHÍ QUYỂN', col: '#38bdf8', sub: 'Tia vũ trụ + ¹⁴N', line2: '→ Tạo ¹⁴CO₂ ổn định' },
            { x: 284, title: '2. CÂY ĐANG SỐNG', col: '#34d399', sub: 'Quang hợp trao đổi C', line2: 'H = H₀ (tỉ lệ không đổi)' },
            { x: 526, title: '3. MẪU GỖ KHẢO CỔ', col: '#f59e0b', sub: 'Ngừng trao đổi C', line2: 'H(t) = H₀ · 2⁻ᵗ/⁵⁷³⁰' }
        ];
        stages.forEach(s => {
            roundBox(ctx, s.x, 78, 212, 138, 10, '#0f172a', s.col, 2);
            txt(ctx, s.title, s.x + 106, 104, s.col, '800 14px sans-serif', 'center');
            txt(ctx, s.sub, s.x + 106, 146, '#e2e8f0', '700 13px sans-serif', 'center');
            txt(ctx, s.line2, s.x + 106, 180, '#fde68a', '800 13.5px sans-serif', 'center');
        });
        arrowLine(ctx, 254, 148, 282, 148, '#94a3b8', 3, 7);
        arrowLine(ctx, 496, 148, 524, 148, '#94a3b8', 3, 7);
        const dotX = 56 + ((t * 120) % 660);
        ctx.fillStyle = '#c4b5fd';
        ctx.beginPath(); ctx.arc(dotX, 240, 4.5, 0, Math.PI * 2); ctx.fill();
        labelPill(ctx, 390, 250, 'Đo H(t) hiện tại so với H₀ (cùng khối lượng mẫu tươi) ⇒ Tuổi cổ vật t', '#c4b5fd', '#2e1065', '#8b5cf6', 'center');
    });
})(window);
