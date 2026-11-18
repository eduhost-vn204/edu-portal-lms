/**
 * ============================================================================
 * THƯ VIỆN HÀM TRỢ GIÚP CANVAS VẬT LÝ VLXT (CORE HELPERS CHUẨN)
 * Dùng cho Canvas Studio, Hot-Reload và Gemini Assistant
 * ============================================================================
 */
function drawSubText(ctx, base, sub, x, y, opts = {}) {
    const fontSize = opts.fontSize || 15;
    const subSize = Math.round(fontSize * 0.75);
    const weight = opts.weight || '700';
    const italic = opts.italic ? 'italic ' : '';
    const color = opts.color || '#f1f5f9';
    const align = opts.align || 'left';
    ctx.save();
    ctx.fillStyle = color;
    ctx.font = `${italic}${weight} ${fontSize}px "Plus Jakarta Sans", sans-serif`;
    const baseW = ctx.measureText(base).width;
    ctx.font = `${weight} ${subSize}px "Plus Jakarta Sans", sans-serif`;
    const subW = sub ? ctx.measureText(sub).width : 0;
    const totalW = baseW + subW;
    let startX = x;
    if (align === 'center') startX = x - totalW / 2;
    else if (align === 'right') startX = x - totalW;

    ctx.font = `${italic}${weight} ${fontSize}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText(base, startX, y);
    if (sub) {
      ctx.font = `${weight} ${subSize}px "Plus Jakarta Sans", sans-serif`;
      ctx.fillText(sub, startX + baseW + 1, y + Math.round(fontSize * 0.28));
    }
    ctx.restore();
    return totalW;
  }

function drawArrow(ctx, x1, y1, x2, y2, color = '#38bdf8', width = 2.6, headLen = 9) {
    const angle = Math.atan2(y2 - y1, x2 - x1);
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - headLen * Math.cos(angle - Math.PI / 6), y2 - headLen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(x2 - headLen * Math.cos(angle + Math.PI / 6), y2 - headLen * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

function drawRoundRect(ctx, x, y, w, h, r, fill, stroke, lineWidth = 2.2) {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth; ctx.stroke(); }
    ctx.restore();
  }

function drawOpenCup(ctx, x, y, w, h, strokeColor = '#cbd5e1', lineWidth = 3, flare = 0) {
    ctx.save();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    if (flare > 0) {
      ctx.moveTo(x - flare, y);
      ctx.lineTo(x, y + 7);
    } else {
      ctx.moveTo(x, y);
    }
    ctx.lineTo(x, y + h);
    ctx.lineTo(x + w, y + h);
    if (flare > 0) {
      ctx.lineTo(x + w, y + 7);
      ctx.lineTo(x + w + flare, y);
    } else {
      ctx.lineTo(x + w, y);
    }
    ctx.stroke();
    ctx.restore();
  }

function drawCallout(ctx, targetX, targetY, boxX, boxY, text, borderColor = '#38bdf8', textColor = '#f1f5f9') {
    ctx.save();
    ctx.font = '700 13.5px "Plus Jakarta Sans", sans-serif';
    const padX = 8, boxH = 26;
    const textW = ctx.measureText(text).width;
    const boxW = textW + padX * 2;
    const anchorX = (boxX + boxW / 2 < targetX) ? (boxX + boxW) : boxX;
    const anchorY = boxY + boxH / 2;

    // Đường gióng
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(targetX, targetY);
    ctx.lineTo(anchorX, anchorY);
    ctx.stroke();

    // Điểm chấm tại vật thể
    ctx.fillStyle = borderColor;
    ctx.beginPath();
    ctx.arc(targetX, targetY, 3, 0, Math.PI * 2);
    ctx.fill();

    // Hộp nhãn
    drawRoundRect(ctx, boxX, boxY, boxW, boxH, 6, '#0f172a', borderColor, 1.5);
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, boxX + boxW / 2, boxY + boxH / 2);
    ctx.restore();
  }

function drawThermometer(ctx, x, yTop, yBot, bulbR, fillRatio, color = '#ef4444', label = '') {
    ctx.save();
    // Thân ống thủy tinh
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.roundRect(x - 5, yTop, 10, yBot - yTop, 5);
    ctx.fill();
    ctx.stroke();

    // Bầu nhiệt kế ngập trong nước
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, yBot + bulbR - 2, bulbR, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Cột chất lỏng (biến thiên 1 chiều sawtooth)
    const ratio = Math.max(0.08, Math.min(1, fillRatio));
    const colTop = yBot - (yBot - yTop - 10) * ratio;
    ctx.fillStyle = color;
    ctx.fillRect(x - 2.5, colTop, 5, yBot - colTop + 2);

    // Vạch chia
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.2;
    for (let yy = yTop + 12; yy < yBot - 6; yy += 10) {
      ctx.beginPath();
      ctx.moveTo(x + 5, yy);
      ctx.lineTo(x + 9, yy);
      ctx.stroke();
    }

    if (label) {
      drawRoundRect(ctx, x - 34, yTop - 28, 68, 22, 5, '#0f172a', color, 1.4);
      ctx.fillStyle = '#f8fafc';
      ctx.font = '700 12.5px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(label, x, yTop - 13);
    }
    ctx.restore();
  }

function clearCanvas(ctx, w, h) {
        ctx.clearRect(0, 0, w, h);
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#060b19');
        grad.addColorStop(1, '#0a1226');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Lưới kỹ thuật mờ
        ctx.save();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
        ctx.lineWidth = 1;
        for (let x = 20; x < w; x += 26) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
        }
        for (let y = 20; y < h; y += 26) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
        }
        ctx.restore();
    }

function drawTitleBadge(ctx, text, x = 16, y = 16) {
        ctx.save();
        ctx.font = '700 12px system-ui, -apple-system, sans-serif';
        const w = ctx.measureText(text).width + 18;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.lineWidth = 1;
        drawRoundRect(ctx, x, y, w, 22, 6);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#38bdf8';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, x + 9, y + 11);
        ctx.restore();
    }

function drawPressureGauge(ctx, cx, cy, r, needleAngle, unitText, valueText, accent = '#38bdf8') {
        ctx.save();
        // Vỏ ngoài
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Vành chia độ
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1.6;
        for (let i = 0; i <= 10; i++) {
            const ang = Math.PI * 0.75 + (i / 10) * Math.PI * 1.5;
            const r1 = r - 7;
            const r2 = (i % 5 === 0) ? r - 14 : r - 11;
            ctx.beginPath();
            ctx.moveTo(cx + Math.cos(ang) * r1, cy + Math.sin(ang) * r1);
            ctx.lineTo(cx + Math.cos(ang) * r2, cy + Math.sin(ang) * r2);
            ctx.stroke();
        }

        // Kim chỉ thị
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2.8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(cx - Math.cos(needleAngle) * 6, cy - Math.sin(needleAngle) * 6);
        ctx.lineTo(cx + Math.cos(needleAngle) * (r - 10), cy + Math.sin(needleAngle) * (r - 10));
        ctx.stroke();

        // Trục tâm kim
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.arc(cx, cy, 4, 0, Math.PI * 2);
        ctx.fill();

        if (unitText) {
            ctx.fillStyle = accent;
            ctx.font = '800 11.5px "DM Mono", monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(unitText, cx, cy + r * 0.45);
        }
        if (valueText) {
            drawRoundRect(ctx, cx - 44, cy - r - 28, 88, 22, 5, '#0f172a', accent, 1.5);
            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 13px "DM Mono", monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(valueText, cx, cy - r - 17);
        }
        ctx.restore();
    }

function drawCircleNum(nx, ny, tx, ty, numStr) {
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(tx, ty);
            ctx.lineTo(nx, ny);
            ctx.stroke();
            ctx.fillStyle = '#0f172a';
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 2.4;
            ctx.beginPath();
            ctx.arc(nx, ny, 16, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#6ee7b7';
            ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(numStr, nx, ny);
        }

function drawCrossB(ctx, x, y, r = 9, color = '#38bdf8') {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.stroke();
        const d = r * 0.62;
        ctx.beginPath();
        ctx.moveTo(x - d, y - d); ctx.lineTo(x + d, y + d);
        ctx.moveTo(x + d, y - d); ctx.lineTo(x - d, y + d);
        ctx.stroke();
        ctx.restore();
    }

function drawDotB(ctx, x, y, r = 9, color = '#38bdf8') {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x, y, 2.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

function drawSpring(sx, yTop, yBot) {
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 2.4;
            ctx.beginPath();
            ctx.moveTo(sx, yTop);
            const coils = 7;
            const step = (yBot - yTop) / coils;
            for (let i = 0; i < coils; i++) {
                const yy = yTop + i * step;
                ctx.lineTo(sx + (i % 2 === 0 ? -6 : 6), yy + step / 2);
            }
            ctx.lineTo(sx, yBot);
            ctx.stroke();
        }

function drawOpenCupU(c, x, y, wBox, hBox, col) {
            c.strokeStyle = col;
            c.lineWidth = 3;
            c.beginPath();
            c.moveTo(x + wBox, y);
            c.lineTo(x, y);
            c.lineTo(x, y + hBox);
            c.lineTo(x + wBox, y + hBox);
            c.stroke();
        }

function drawSetup(offsetX, sameDir, labelTitle) {
            // Bảng nhựa cách điện
            drawRoundRect(ctx, offsetX, 66, 335, 196, 10, '#1e293b', '#64748b', 2.4);

            // Hai thanh đồng cố định (1) trên và (2) dưới
            const y1 = 112, y2 = 216;
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(offsetX + 36, y1); ctx.lineTo(offsetX + 298, y1);
            ctx.moveTo(offsetX + 36, y2); ctx.lineTo(offsetX + 298, y2);
            ctx.stroke();

            ctx.fillStyle = '#fbbf24';
            ctx.font = '800 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('(1)', offsetX + 12, y1 + 4);
            ctx.fillText('(2)', offsetX + 12, y2 + 4);

            // Hai thanh đồng mảnh (4) trái và (5) phải đặt gác lên hai thanh (1), (2)
            const x4 = offsetX + 132, x5 = offsetX + 204;
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 3.4;
            ctx.beginPath();
            ctx.moveTo(x4, y1 - 14); ctx.lineTo(x4, y2 + 14);
            ctx.moveTo(x5, y1 - 14); ctx.lineTo(x5, y2 + 14);
            ctx.stroke();

            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'center';
            ctx.fillText('(4)', x4, y1 - 22);
            ctx.fillText('(5)', x5, y1 - 22);

            // Mũi tên chiều dòng điện trên (4) và (5)
            // Hình a: cả hai dòng cùng chiều từ dưới lên trên
            // Hình b: (4) từ dưới lên trên, (5) từ trên xuống dưới (ngược chiều)
            drawArrow(ctx, x4, y2 - 18, x4, y1 + 18, '#ef4444', 2.8, 7);
            if (sameDir) {
                drawArrow(ctx, x5, y2 - 18, x5, y1 + 18, '#ef4444', 2.8, 7);
            } else {
                drawArrow(ctx, x5, y1 + 18, x5, y2 - 18, '#ef4444', 2.8, 7);
            }

            // Ký hiệu nguồn 12 V
            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillText(labelTitle, offsetX + 167, 286);
        }

function drawNuclide(ctx, A, Z, sym, x, y, opts = {}) {
        const fontSize = opts.fontSize || 16;
        const idxSize = Math.round(fontSize * 0.68);
        const weight = opts.weight || '800';
        const color = opts.color || '#f8fafc';
        const align = opts.align || 'left';

        ctx.save();
        ctx.textBaseline = 'middle';
        ctx.font = `${weight} ${idxSize}px "Plus Jakarta Sans", system-ui, sans-serif`;
        const wA = A !== '' && A !== null && A !== undefined ? ctx.measureText(String(A)).width : 0;
        const wZ = Z !== '' && Z !== null && Z !== undefined ? ctx.measureText(String(Z)).width : 0;
        const idxW = Math.max(wA, wZ);
        const gap = idxW > 0 ? 2 : 0;

        ctx.font = `${weight} ${fontSize}px "Plus Jakarta Sans", system-ui, sans-serif`;
        const symW = ctx.measureText(sym).width;
        const totalW = idxW + gap + symW;

        let startX = x;
        if (align === 'center') startX = x - totalW / 2;
        else if (align === 'right') startX = x - totalW;

        ctx.fillStyle = color;
        ctx.textAlign = 'right';
        ctx.font = `${weight} ${idxSize}px "Plus Jakarta Sans", system-ui, sans-serif`;
        if (wA > 0) ctx.fillText(String(A), startX + idxW, y - Math.round(fontSize * 0.36));
        if (wZ > 0) ctx.fillText(String(Z), startX + idxW, y + Math.round(fontSize * 0.38));

        ctx.textAlign = 'left';
        ctx.font = `${weight} ${fontSize}px "Plus Jakarta Sans", system-ui, sans-serif`;
        ctx.fillText(sym, startX + idxW + gap, y);
        ctx.restore();
        return totalW;
    }

function drawGammaRay(ctx, x1, y1, x2, y2, color = '#a855f7') {
        const dx = x2 - x1, dy = y2 - y1;
        const len = Math.hypot(dx, dy);
        const ang = Math.atan2(dy, dx);
        ctx.save();
        ctx.translate(x1, y1);
        ctx.rotate(ang);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        const waves = Math.max(3, Math.floor(len / 12));
        const bodyLen = len - 10;
        for (let i = 0; i <= waves * 4; i++) {
            const px = (i / (waves * 4)) * bodyLen;
            const py = Math.sin((i / 4) * Math.PI * 2) * 4;
            ctx.lineTo(px, py);
        }
        ctx.lineTo(len, 0);
        ctx.stroke();
        // Mũi tên ở cuối tia gamma
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(len, 0);
        ctx.lineTo(len - 8, -4);
        ctx.lineTo(len - 8, 4);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

function drawAlphaCluster(ctx, cx, cy, r = 4.5) {
        ctx.save();
        // 2 proton đỏ (#ef4444) + 2 neutron xanh xám (#38bdf8)
        const offs = [
            [-r * 0.65, -r * 0.55, '#ef4444'],
            [ r * 0.65,  r * 0.55, '#ef4444'],
            [ r * 0.65, -r * 0.55, '#38bdf8'],
            [-r * 0.65,  r * 0.55, '#38bdf8']
        ];
        offs.forEach(([ox, oy, col]) => {
            ctx.fillStyle = col;
            ctx.beginPath();
            ctx.arc(cx + ox, cy + oy, r, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.restore();
    }