/**
 * VLXT_TLN_MODELS — Thư viện Mô hình SVG Trả Lời Ngắn (Phần III)
 * Tuân thủ nghiêm ngặt AGENTS.md:
 * - Phẳng, sắc nét, tương phản cao, chuẩn EdTech quốc tế.
 * - Tuyệt đối CẤM AI GLOW / drop-shadow nhòe / neon ảo.
 */
(function() {
    window.VLXT_TLN_MODELS = window.VLXT_TLN_MODELS || {};

    window.VLXT_TLN_MODELS['MH-TLN-2026-03'] = {
        id: 'MH-TLN-2026-03',
        title: 'Thanh kim loại trượt trên hai thanh ray trong từ trường đều',
        svg: `<svg viewBox="0 0 680 320" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" style="background:#0f172a;border-radius:10px;border:1px solid #334155;display:block;margin:0 auto;max-width:680px">
            <!-- Khung bao & lưới tọa độ nhẹ -->
            <rect x="0" y="0" width="680" height="320" fill="#0f172a" rx="10"/>
            <pattern id="grid-tln" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" stroke-width="1"/>
            </pattern>
            <rect width="680" height="320" fill="url(#grid-tln)" opacity="0.6"/>

            <!-- Hai thanh ray kim loại song song -->
            <!-- Ray trên -->
            <rect x="70" y="60" width="540" height="12" fill="#94a3b8" rx="3" stroke="#475569" stroke-width="1.5"/>
            <!-- Ray dưới -->
            <rect x="70" y="240" width="540" height="12" fill="#94a3b8" rx="3" stroke="#475569" stroke-width="1.5"/>

            <!-- Dây dẫn nối bên phải tạo mạch kín -->
            <rect x="598" y="60" width="12" height="192" fill="#38bdf8" stroke="#0284c7" stroke-width="1.5"/>

            <!-- Thanh kim loại trượt thẳng đứng -->
            <g id="sliding-rod">
                <rect x="330" y="52" width="18" height="208" fill="#3b82f6" rx="4" stroke="#1d4ed8" stroke-width="2"/>
                <!-- Tiếp điểm điện -->
                <circle cx="339" cy="66" r="5" fill="#f59e0b"/>
                <circle cx="339" cy="246" r="5" fill="#f59e0b"/>
                <!-- Nhãn thanh trượt R -->
                <text x="339" y="160" fill="#ffffff" font-family="'Plus Jakarta Sans',sans-serif" font-size="13" font-weight="700" text-anchor="middle">R</text>
            </g>

            <!-- Vector vận tốc v hướng sang trái -->
            <g id="velocity-vector">
                <defs>
                    <marker id="arrow-v" viewBox="0 0 10 10" refX="2" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 10 0 L 0 5 L 10 10 z" fill="#f87171"/>
                    </marker>
                </defs>
                <line x1="320" y1="156" x2="200" y2="156" stroke="#f87171" stroke-width="3.5" marker-end="url(#arrow-v)"/>
                <text x="250" y="142" fill="#f87171" font-family="'Plus Jakarta Sans',sans-serif" font-size="18" font-weight="700" text-anchor="middle">v⃗</text>
            </g>

            <!-- Kích thước chiều dài l giữa 2 ray -->
            <g id="dimension-l">
                <line x1="120" y1="78" x2="120" y2="234" stroke="#e2e8f0" stroke-width="1.5" stroke-dasharray="3 3"/>
                <line x1="112" y1="78" x2="128" y2="78" stroke="#e2e8f0" stroke-width="2"/>
                <line x1="112" y1="234" x2="128" y2="234" stroke="#e2e8f0" stroke-width="2"/>
                <!-- Mũi tên 2 đầu -->
                <path d="M 120 86 L 116 94 L 124 94 Z" fill="#e2e8f0"/>
                <path d="M 120 226 L 116 218 L 124 218 Z" fill="#e2e8f0"/>
                <text x="100" y="162" fill="#f1f5f9" font-family="'Plus Jakarta Sans',sans-serif" font-size="20" font-weight="700" font-style="italic" text-anchor="middle">ℓ</text>
            </g>

            <!-- Vùng từ trường đều B hướng ra khỏi mặt phẳng hình vẽ (Ký hiệu vòng tròn có chấm ở tâm ⊙) -->
            <g id="magnetic-field-out">
                <!-- Hàng 1 -->
                <circle cx="430" cy="110" r="14" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
                <circle cx="430" cy="110" r="4.5" fill="#38bdf8"/>

                <circle cx="520" cy="110" r="14" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
                <circle cx="520" cy="110" r="4.5" fill="#38bdf8"/>

                <!-- Hàng 2 -->
                <circle cx="430" cy="200" r="14" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
                <circle cx="430" cy="200" r="4.5" fill="#38bdf8"/>

                <circle cx="520" cy="200" r="14" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
                <circle cx="520" cy="200" r="4.5" fill="#38bdf8"/>

                <!-- Nhãn Vector B -->
                <circle cx="500" cy="155" r="18" fill="#0284c7" stroke="#e0f2fe" stroke-width="2"/>
                <circle cx="500" cy="155" r="5" fill="#ffffff"/>
                <text x="546" y="162" fill="#38bdf8" font-family="'Plus Jakarta Sans',sans-serif" font-size="22" font-weight="700">B⃗</text>
            </g>

            <!-- Chú thích chân trang đồ họa -->
            <rect x="70" y="275" width="540" height="30" fill="#1e293b" rx="6"/>
            <text x="340" y="295" fill="#94a3b8" font-family="'Plus Jakarta Sans',sans-serif" font-size="12" font-weight="500" text-anchor="middle">
                Sơ đồ thanh ray trượt kim loại trong từ trường đều vuông góc hướng ra ngoài mặt phẳng (⊙ B⃗)
            </text>
        </svg>`
    };

    if (typeof window !== 'undefined' && window.VLXTModels && typeof window.VLXTModels.register === 'function') {
        window.VLXTModels.register('MH-TLN-2026-03', function(ctx, w, h, t) {
            const cyc = (t % 4.8) / 4.8;
            const prog = cyc < 0.88 ? (cyc / 0.88) : (1 - (cyc - 0.88) / 0.12);
            const railTop = 64;
            const railBot = 232;
            const railLeft = 105;
            const railRight = 695;
            const rodX = 560 - prog * 340;

            ctx.fillStyle = '#09111f';
            ctx.fillRect(0, 0, w, h);

            ctx.strokeStyle = '#132035';
            ctx.lineWidth = 1;
            for (let gx = 40; gx < w; gx += 40) {
                ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke();
            }
            for (let gy = 40; gy < h; gy += 40) {
                ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke();
            }

            // Vùng từ thông biến thiên bên trong mạch kín
            ctx.fillStyle = 'rgba(56, 189, 248, 0.10)';
            ctx.fillRect(rodX, railTop + 5, railRight - rodX, railBot - railTop - 5);

            // Lưới vectơ từ trường B hướng ra ngoài (⊙)
            const cols = [150, 235, 320, 405, 490, 575, 655];
            const rows = [104, 152, 200];
            cols.forEach(bx => {
                rows.forEach(by => {
                    ctx.beginPath();
                    ctx.arc(bx, by, 10, 0, Math.PI * 2);
                    ctx.fillStyle = '#0f172a';
                    ctx.fill();
                    ctx.strokeStyle = (bx >= rodX && bx <= railRight) ? '#38bdf8' : '#334155';
                    ctx.lineWidth = 1.6;
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.arc(bx, by, 3, 0, Math.PI * 2);
                    ctx.fillStyle = (bx >= rodX && bx <= railRight) ? '#38bdf8' : '#475569';
                    ctx.fill();
                });
            });

            // Nhãn B⃗ góc phải trên
            ctx.fillStyle = '#38bdf8';
            ctx.font = '700 16px "Plus Jakarta Sans", sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('⊙ B⃗ (từ trường đều hướng ra)', 455, 36);

            // Hai thanh ray song song & dây nối đầu phải
            ctx.fillStyle = '#94a3b8';
            ctx.fillRect(railLeft, railTop - 5, railRight - railLeft + 8, 10);
            ctx.fillRect(railLeft, railBot - 5, railRight - railLeft + 8, 10);
            ctx.fillStyle = '#38bdf8';
            ctx.fillRect(railRight - 4, railTop - 5, 12, railBot - railTop + 10);

            // Nhãn dây nối R=0 và kích thước l
            ctx.fillStyle = '#cbd5e1';
            ctx.font = '700 13px "Plus Jakarta Sans", sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('Dây nối', railRight + 16, 152);

            // Dimension l
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(82, railTop + 5);
            ctx.lineTo(82, railBot - 5);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.beginPath();
            ctx.moveTo(74, railTop + 5); ctx.lineTo(90, railTop + 5);
            ctx.moveTo(74, railBot - 5); ctx.lineTo(90, railBot - 5);
            ctx.stroke();
            ctx.fillStyle = '#f8fafc';
            ctx.font = 'italic 700 18px "Plus Jakarta Sans", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('ℓ', 62, 154);

            // Thanh kim loại trượt (R)
            ctx.fillStyle = '#2563eb';
            ctx.strokeStyle = '#93c5fd';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(rodX - 8, railTop - 16, 16, railBot - railTop + 32, 4);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#f59e0b';
            ctx.beginPath(); ctx.arc(rodX, railTop, 4.5, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(rodX, railBot, 4.5, 0, Math.PI * 2); ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.font = '800 14px "Plus Jakarta Sans", sans-serif';
            ctx.fillText('R', rodX, 152);

            // Vector vận tốc v⃗ hướng sang trái
            if (prog > 0.02 && prog < 0.98) {
                const vx1 = rodX - 16;
                const vx2 = rodX - 96;
                ctx.strokeStyle = '#f87171';
                ctx.lineWidth = 3.5;
                ctx.beginPath();
                ctx.moveTo(vx1, 148);
                ctx.lineTo(vx2, 148);
                ctx.stroke();
                ctx.fillStyle = '#f87171';
                ctx.beginPath();
                ctx.moveTo(vx2 - 10, 148);
                ctx.lineTo(vx2 + 4, 141);
                ctx.lineTo(vx2 + 4, 155);
                ctx.closePath();
                ctx.fill();
                ctx.font = '700 16px "Plus Jakarta Sans", sans-serif';
                ctx.fillText('v⃗', (vx1 + vx2) / 2, 134);
            }

            // Chiều dòng điện cảm ứng (theo quy tắc Lenz: từ thông ⊙ tăng -> B_c hướng ⊗ -> dòng cảm ứng thuận chiều KĐH)
            if (cyc < 0.88 && (railRight - rodX) > 90) {
                const midX = (rodX + railRight) / 2;
                ctx.fillStyle = '#10b981';
                ctx.font = '700 13px "Plus Jakarta Sans", sans-serif';
                ctx.fillText('Ic →', midX, railTop - 16);
                ctx.fillText('← Ic', midX, railBot + 24);
            }

            // Footer thanh trạng thái định tính (không lộ đáp số)
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(0, h - 38, w, 38);
            ctx.fillStyle = '#cbd5e1';
            ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('Thanh dẫn chiều dài ℓ trượt đều với vận tốc v⃗ cắt vuông góc các đường sức từ B⃗', 24, h - 14);
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'right';
            ctx.fillText(cyc < 0.88 ? 'Từ thông tăng · Xuất hiện dòng điện cảm ứng' : 'Chuẩn bị chu kỳ mới', w - 24, h - 14);
        });
    }
})();
