/*!
 * VLXTModels v1.0.0 — Thu vien SVG Motion Graphics Mo Hinh Thuc Te Vat Ly 12
 * Chuong 1: Vat ly nhiet (17 mo hinh Dung / Sai: MH-C1-01 .. MH-C1-21)
 * Dung chung cho: prototype-100-mo-hinh-thuc-te.html, ngan-hang-de.html, baihoc.html, thithu.html
 * Khong dung AI Glow / Neon. Chi dung Ambient Observational Loop nhe nhang, sac net.
 */
(function (global) {
    'use strict';

    var VERSION = '1.0.0';
    var STYLE_ID = 'vlxt-models-shared-styles';
    var _uidCounter = 0;

    function nextUid() {
        _uidCounter += 1;
        return 'vm' + _uidCounter + '_';
    }

    function escapeHtml(str) {
        return String(str == null ? '' : str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function ensureStyles() {
        if (typeof document === 'undefined' || !document.head) return;
        if (document.getElementById(STYLE_ID)) return;
        var css = [
            '.vlxt-visual-container{margin:16px 0 18px;background:#090e1a;border:1px solid #334155;border-radius:12px;padding:16px;color:#e2e8f0;box-sizing:border-box;max-width:100%;min-width:0;overflow:hidden;}',
            '.vlxt-visual-container.centered{max-width:920px;margin-left:auto;margin-right:auto;}',
            '.vlxt-visual-container.compact{margin:10px 0 12px;padding:10px;}',
            '.vlxt-grid-2col{display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:stretch;}',
            '.vlxt-grid-2col>*{min-width:0;max-width:100%;}',
            '@media (max-width:900px){.vlxt-grid-2col{grid-template-columns:1fr;}}',
            '.vlxt-stage-wrap{position:relative;background:#050811;border:1px solid #1e293b;border-radius:10px;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:12px 14px;width:100%;max-width:100%;min-width:0;box-sizing:border-box;}',
            '.vlxt-stage-wrap svg{display:block;width:100%;max-width:100%;height:auto;font-family:"Plus Jakarta Sans","Segoe UI",Arial,sans-serif;}',
            '.vlxt-stage-wrap svg text,.vlxt-stage-wrap svg tspan{font-family:"Plus Jakarta Sans","Segoe UI",Arial,sans-serif;}',
            '.vlxt-visual-container .stage-caption{font-size:13px;font-weight:800;color:#38bdf8;margin-bottom:10px;text-align:center;letter-spacing:0.2px;display:flex;align-items:center;justify-content:center;gap:6px;flex-wrap:wrap;}',
            '.vlxt-model-slot{margin:12px 0;max-width:100%;min-width:0;}',
            '.vlxt-model-error{padding:12px 14px;border-radius:8px;border:1px dashed #64748b;background:#0f172a;color:#cbd5e1;font-size:13px;}',

            /* Bang so lieu thuc nghiem thich ung nen sang (CBT thithu, modal admin, baihoc light) */
            '.vstep-data-panel{margin:14px 0 16px;background:#f8fafc;border:1px solid #cbd5e1;border-radius:8px;padding:12px 14px;max-width:100%;min-width:0;overflow-x:auto;-webkit-overflow-scrolling:touch;color:#0f172a;box-sizing:border-box;}',
            '.vstep-data-title{font-size:13px;font-weight:800;color:#0369a1;margin-bottom:9px;display:flex;align-items:center;gap:6px;letter-spacing:0.2px;flex-wrap:wrap;}',
            '.vstep-data-table{width:100%;border-collapse:collapse;font-size:13.5px;color:#0f172a;text-align:center;background:#ffffff;}',
            '.vstep-data-table th,.vstep-data-table td{border:1px solid #cbd5e1;padding:7px 10px;}',
            '.vstep-data-table th{background:#e2e8f0;font-weight:700;color:#1e293b;font-size:12.5px;white-space:nowrap;}',
            '.vstep-data-table tbody tr:nth-child(even){background:#f8fafc;}',
            '.vstep-data-table tbody tr:hover{background:#f1f5f9;}',
            '.vstep-data-table td.text-left,.vstep-data-table th.text-left{text-align:left;font-weight:600;}',
            '@media (max-width:640px){.vlxt-visual-container{padding:10px;border-radius:10px;}.vlxt-stage-wrap{padding:8px;}.vstep-data-panel{padding:10px;}.vstep-data-table{font-size:12px;}.vstep-data-table th,.vstep-data-table td{padding:6px 7px;white-space:normal;word-break:break-word;}}',

            /* Tu dong chuyen sang theme toi trong prototype, baihoc dark mode, danh sach ngan hang admin */
            'body.dark .vstep-data-panel,body.vlxt-dark-page .vstep-data-panel,.proto-dark .vstep-data-panel,.nh-row .vstep-data-panel{background:#0b1120;border-color:#334155;color:#e2e8f0;}',
            'body.dark .vstep-data-title,body.vlxt-dark-page .vstep-data-title,.proto-dark .vstep-data-title,.nh-row .vstep-data-title{color:#38bdf8;}',
            'body.dark .vstep-data-table,body.vlxt-dark-page .vstep-data-table,.proto-dark .vstep-data-table,.nh-row .vstep-data-table{background:#0f172a;color:#e2e8f0;}',
            'body.dark .vstep-data-table th,body.dark .vstep-data-table td,body.vlxt-dark-page .vstep-data-table th,body.vlxt-dark-page .vstep-data-table td,.proto-dark .vstep-data-table th,.proto-dark .vstep-data-table td,.nh-row .vstep-data-table th,.nh-row .vstep-data-table td{border-color:#334155;}',
            'body.dark .vstep-data-table th,body.vlxt-dark-page .vstep-data-table th,.proto-dark .vstep-data-table th,.nh-row .vstep-data-table th{background:#1e293b;color:#cbd5e1;}',
            'body.dark .vstep-data-table tbody tr:nth-child(even),body.vlxt-dark-page .vstep-data-table tbody tr:nth-child(even),.proto-dark .vstep-data-table tbody tr:nth-child(even),.nh-row .vstep-data-table tbody tr:nth-child(even){background:#131c31;}',
            'body.dark .vstep-data-table tbody tr:hover,body.vlxt-dark-page .vstep-data-table tbody tr:hover,.proto-dark .vstep-data-table tbody tr:hover,.nh-row .vstep-data-table tbody tr:hover{background:#1e293b;}',

            /* Ambient Observational Animations - nhe nhang, khong choi */
            '@keyframes vlxtWaterRipples{0%,100%{transform:translateY(0);}50%{transform:translateY(-2px);}}',
            '@keyframes vlxtIceBobbing{0%,100%{transform:translateY(0);}50%{transform:translateY(2.5px);}}',
            '@keyframes vlxtStirrerMotion{0%,100%{transform:translateY(0);}50%{transform:translateY(-3.5px);}}',
            '@keyframes vlxtCircuitPulse{0%{stroke-dashoffset:40;}100%{stroke-dashoffset:0;}}',
            '@keyframes vlxtHeatArrowPulse{0%,100%{opacity:0.4;}50%{opacity:0.95;}}',
            '@keyframes vlxtSteamRise{0%{transform:translateY(2px);opacity:0.25;}50%{opacity:0.75;}100%{transform:translateY(-10px);opacity:0.1;}}',
            '@keyframes vlxtDropsFall{0%{transform:translateY(-3px);opacity:0.25;}60%{opacity:0.95;}100%{transform:translateY(7px);opacity:0.15;}}',
            '@keyframes vlxtFanSpin{0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}',
            '@keyframes vlxtPistonIdle{0%,100%{transform:translateY(0);}50%{transform:translateY(5px);}}',
            '@keyframes vlxtRayGlide{0%{stroke-dashoffset:24;}100%{stroke-dashoffset:0;}}',

            '.ambient-water-wave{animation:vlxtWaterRipples 3s ease-in-out infinite;}',
            '.ambient-ice-bob{animation:vlxtIceBobbing 3s ease-in-out infinite;}',
            '.ambient-stirrer{animation:vlxtStirrerMotion 2.4s ease-in-out infinite;}',
            '.ambient-wire-pulse{stroke-dasharray:8 8;animation:vlxtCircuitPulse 2s linear infinite;}',
            '.ambient-heat-arrow{animation:vlxtHeatArrowPulse 2.2s ease-in-out infinite;}',
            '.ambient-steam{animation:vlxtSteamRise 3.2s ease-in-out infinite;}',
            '.ambient-drops{animation:vlxtDropsFall 2s linear infinite;}',
            '.ambient-fan-spin{transform-box:fill-box;transform-origin:center;animation:vlxtFanSpin 3.6s linear infinite;}',
            '.ambient-piston{animation:vlxtPistonIdle 2.6s ease-in-out infinite;}',
            '.ambient-ray-glide{stroke-dasharray:6 6;animation:vlxtRayGlide 1.8s linear infinite;}'
        ].join('\n');
        var style = document.createElement('style');
        style.id = STYLE_ID;
        style.type = 'text/css';
        style.textContent = css;
        document.head.appendChild(style);
    }

    function captionHtml(iconClass, text) {
        return '<div class="stage-caption"><i class="' + escapeHtml(iconClass) + '"></i> ' + escapeHtml(text) + '</div>';
    }

    var MODELS = {
        'MH-C1-01': {
            id: 'MH-C1-01',
            title: 'Mô hình truyền nhiệt giữa cốc thủy tinh và cốc nhôm',
            topic: 'DS-C1.1',
            layout: 'single',
            caption: 'Mô hình cốc nhôm đặt trong cốc thủy tinh (Dòng truyền nhiệt tự nhiên)',
            alt: 'Sơ đồ thí nghiệm cốc nhôm chứa nước lạnh đặt trong cốc thủy tinh chứa nước nóng kèm hai nhiệt kế điện tử',
            build: function (u) {
                var svg =
                    '<svg viewBox="0 0 760 390" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
                    '<defs>' +
                    '<linearGradient id="' + u + 'alum" x1="0%" y1="0%" x2="100%" y2="0%">' +
                    '<stop offset="0%" stop-color="#475569"/><stop offset="50%" stop-color="#94a3b8"/><stop offset="100%" stop-color="#334155"/>' +
                    '</linearGradient>' +
                    '<linearGradient id="' + u + 'hot" x1="0%" y1="0%" x2="0%" y2="100%">' +
                    '<stop offset="0%" stop-color="rgba(249,115,22,0.28)"/><stop offset="100%" stop-color="rgba(14,165,233,0.48)"/>' +
                    '</linearGradient>' +
                    '<linearGradient id="' + u + 'cold" x1="0%" y1="0%" x2="0%" y2="100%">' +
                    '<stop offset="0%" stop-color="rgba(56,189,248,0.45)"/><stop offset="100%" stop-color="rgba(14,116,144,0.72)"/>' +
                    '</linearGradient>' +
                    '<marker id="' + u + 'arr" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">' +
                    '<path d="M 0 1 L 9 5 L 0 9 z" fill="#f59e0b"/>' +
                    '</marker>' +
                    '</defs>' +
                    '<line x1="30" y1="348" x2="730" y2="348" stroke="#334155" stroke-width="2.5"/>' +
                    '<line x1="50" y1="356" x2="710" y2="356" stroke="#1e293b" stroke-width="2"/>' +
                    '<path d="M 185 152 Q 375 148 565 152 L 555 342 Q 375 348 195 342 Z" fill="url(#' + u + 'hot)" class="ambient-water-wave"/>' +
                    '<path d="M 165 100 L 185 100 L 195 342 Q 375 348 555 342 L 565 100 L 570 100" fill="none" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>' +
                    '<path d="M 165 100 Q 150 103 158 111 L 185 111" fill="none" stroke="#38bdf8" stroke-width="2.5"/>' +
                    '<line x1="544" y1="178" x2="558" y2="178" stroke="#cbd5e1" stroke-width="2"/>' +
                    '<text x="536" y="182" fill="#e2e8f0" font-size="12" font-weight="700" font-family="DM Mono,monospace" text-anchor="end">400 mL</text>' +
                    '<line x1="547" y1="222" x2="557" y2="222" stroke="#64748b" stroke-width="1.8"/>' +
                    '<line x1="544" y1="266" x2="558" y2="266" stroke="#cbd5e1" stroke-width="2"/>' +
                    '<text x="536" y="270" fill="#e2e8f0" font-size="12" font-weight="700" font-family="DM Mono,monospace" text-anchor="end">200 mL</text>' +
                    '<rect x="280" y="122" width="190" height="220" rx="8" fill="rgba(30,41,59,0.5)" stroke="url(#' + u + 'alum)" stroke-width="3.5"/>' +
                    '<rect x="286" y="176" width="178" height="160" rx="5" fill="url(#' + u + 'cold)" class="ambient-water-wave"/>' +
                    '<line x1="286" y1="176" x2="464" y2="176" stroke="#7dd3fc" stroke-width="2" opacity="0.75"/>' +
                    '<g class="ambient-heat-arrow">' +
                    '<line x1="224" y1="215" x2="274" y2="215" stroke="#f59e0b" stroke-width="2.5" marker-end="url(#' + u + 'arr)"/>' +
                    '<line x1="228" y1="265" x2="274" y2="265" stroke="#f59e0b" stroke-width="2.5" marker-end="url(#' + u + 'arr)"/>' +
                    '<line x1="528" y1="215" x2="476" y2="215" stroke="#f59e0b" stroke-width="2.5" marker-end="url(#' + u + 'arr)"/>' +
                    '<line x1="524" y1="265" x2="476" y2="265" stroke="#f59e0b" stroke-width="2.5" marker-end="url(#' + u + 'arr)"/>' +
                    '</g>' +
                    '<g transform="translate(212,18)">' +
                    '<line x1="20" y1="98" x2="20" y2="275" stroke="#cbd5e1" stroke-width="3.5" stroke-linecap="round"/>' +
                    '<circle cx="20" cy="275" r="4.5" fill="#94a3b8"/>' +
                    '<rect x="0" y="0" width="40" height="98" rx="6" fill="#f8fafc" stroke="#475569" stroke-width="2"/>' +
                    '<rect x="4" y="20" width="32" height="34" rx="3" fill="#0f172a"/>' +
                    '<text x="20" y="43" fill="#f59e0b" font-size="14.5" font-weight="800" font-family="DM Mono,monospace" text-anchor="middle">85°</text>' +
                    '<circle cx="20" cy="74" r="4" fill="#ef4444"/>' +
                    '</g>' +
                    '<g transform="translate(355,10)">' +
                    '<line x1="20" y1="98" x2="20" y2="285" stroke="#cbd5e1" stroke-width="3.5" stroke-linecap="round"/>' +
                    '<circle cx="20" cy="285" r="4.5" fill="#94a3b8"/>' +
                    '<rect x="0" y="0" width="40" height="98" rx="6" fill="#f8fafc" stroke="#475569" stroke-width="2"/>' +
                    '<rect x="4" y="20" width="32" height="34" rx="3" fill="#0f172a"/>' +
                    '<text x="20" y="43" fill="#38bdf8" font-size="14.5" font-weight="800" font-family="DM Mono,monospace" text-anchor="middle">23°</text>' +
                    '<circle cx="20" cy="74" r="4" fill="#0284c7"/>' +
                    '</g>' +
                    '<polyline points="212,50 162,50" fill="none" stroke="#38bdf8" stroke-width="1.8" stroke-dasharray="3 3"/>' +
                    '<circle cx="212" cy="50" r="4" fill="#38bdf8"/>' +
                    '<g transform="translate(12,26)">' +
                    '<rect x="0" y="0" width="150" height="48" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>' +
                    '<text x="75" y="21" fill="#38bdf8" font-size="13" font-weight="800" text-anchor="middle">2 Nhiệt kế</text>' +
                    '<text x="75" y="38" fill="#cbd5e1" font-size="12" font-weight="600" text-anchor="middle">Đo đồng thời t (°C)</text>' +
                    '</g>' +
                    '<polyline points="188,236 162,236" fill="none" stroke="#38bdf8" stroke-width="1.8" stroke-dasharray="3 3"/>' +
                    '<circle cx="188" cy="236" r="4" fill="#38bdf8"/>' +
                    '<g transform="translate(12,212)">' +
                    '<rect x="0" y="0" width="150" height="48" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>' +
                    '<text x="75" y="21" fill="#38bdf8" font-size="13" font-weight="800" text-anchor="middle">Cốc thủy tinh</text>' +
                    '<text x="75" y="38" fill="#cbd5e1" font-size="12" font-weight="600" text-anchor="middle">Chứa nước ngoài</text>' +
                    '</g>' +
                    '<polyline points="470,136 588,136" fill="none" stroke="#f59e0b" stroke-width="1.8" stroke-dasharray="3 3"/>' +
                    '<circle cx="470" cy="136" r="4" fill="#f59e0b"/>' +
                    '<g transform="translate(588,112)">' +
                    '<rect x="0" y="0" width="158" height="48" rx="6" fill="#0f172a" stroke="#f59e0b" stroke-width="1.5"/>' +
                    '<text x="79" y="21" fill="#f59e0b" font-size="13.5" font-weight="800" text-anchor="middle">Cốc nhôm</text>' +
                    '<text x="79" y="38" fill="#cbd5e1" font-size="12" font-weight="600" text-anchor="middle">Đặt lọt bên trong</text>' +
                    '</g>' +
                    '</svg>';
                return '<div class="vlxt-visual-container centered">' +
                    '<div class="vlxt-stage-wrap">' + captionHtml('fa-solid fa-flask-vial', 'Mô hình cốc nhôm đặt trong cốc thủy tinh (Dòng truyền nhiệt tự nhiên)') + svg + '</div>' +
                    '</div>';
            }
        },
        'MH-C1-02': {
            id: 'MH-C1-02',
            title: 'Bộ thí nghiệm đo nhiệt dung riêng của nước và đồ thị t(°C) – τ(s)',
            topic: 'DS-C1.2',
            layout: '2col',
            caption: 'Hình 4.1: Bộ thí nghiệm đo nhiệt dung riêng của nước',
            caption2: 'Đồ thị thực nghiệm nhiệt độ t (°C) theo thời gian τ (s)',
            alt: 'Bộ 5 dụng cụ đo nhiệt dung riêng của nước và đồ thị thực nghiệm nhiệt độ theo thời gian qua điểm M(100; 25,6) và N(400; 33,5)',
            build: function () {
                var leftSvg =
                    '<svg viewBox="0 0 510 370" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
                    '<rect x="18" y="25" width="128" height="118" rx="8" fill="#1e293b" stroke="#475569" stroke-width="2"/>' +
                    '<g transform="translate(24,32)"><rect x="0" y="0" width="116" height="26" rx="4" fill="#0b1120" stroke="#334155"/>' +
                    '<text x="58" y="18" fill="#38bdf8" font-size="12.5" font-weight="800" text-anchor="middle">(1) Nguồn điện</text></g>' +
                    '<circle cx="82" cy="86" r="20" fill="#334155" stroke="#64748b" stroke-width="2"/>' +
                    '<line x1="82" y1="86" x2="94" y2="75" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round"/>' +
                    '<circle cx="50" cy="124" r="6" fill="#ef4444"/><circle cx="114" cy="124" r="6" fill="#0284c7"/>' +
                    '<rect x="164" y="25" width="146" height="118" rx="8" fill="#1e293b" stroke="#475569" stroke-width="2"/>' +
                    '<g transform="translate(170,32)"><rect x="0" y="0" width="134" height="26" rx="4" fill="#0b1120" stroke="#334155"/>' +
                    '<text x="67" y="18" fill="#38bdf8" font-size="12.5" font-weight="800" text-anchor="middle">(2) Oát kế</text></g>' +
                    '<rect x="171" y="61" width="132" height="50" rx="5" fill="#0b1120" stroke="#334155"/>' +
                    '<text x="237" y="82" fill="#4ade80" font-size="16" font-family="DM Mono,monospace" font-weight="800" text-anchor="middle">15.54 W</text>' +
                    '<text x="237" y="102" fill="#38bdf8" font-size="13.5" font-family="DM Mono,monospace" font-weight="700" text-anchor="middle">τ = 180 s</text>' +
                    '<circle cx="185" cy="127" r="4.5" fill="#ef4444"/><circle cx="210" cy="127" r="4.5" fill="#ef4444"/>' +
                    '<circle cx="264" cy="127" r="4.5" fill="#0284c7"/><circle cx="289" cy="127" r="4.5" fill="#0284c7"/>' +
                    '<rect x="330" y="68" width="152" height="186" rx="12" fill="#78350f" opacity="0.35" stroke="#d97706" stroke-width="2.5"/>' +
                    '<rect x="342" y="108" width="128" height="136" rx="8" fill="rgba(14,165,233,0.25)" stroke="#0284c7" stroke-width="1.8"/>' +
                    '<path d="M 360 218 Q 375 203 390 218 T 420 218 T 446 218" fill="none" stroke="#ea580c" stroke-width="3.5"/>' +
                    '<line x1="360" y1="218" x2="360" y2="72" stroke="#f97316" stroke-width="2"/>' +
                    '<line x1="446" y1="218" x2="446" y2="72" stroke="#f97316" stroke-width="2"/>' +
                    '<rect x="325" y="60" width="162" height="18" rx="4" fill="#334155" stroke="#64748b"/>' +
                    '<g transform="translate(325,268)"><rect x="0" y="0" width="162" height="34" rx="6" fill="#0f172a" stroke="#d97706" stroke-width="1.5"/>' +
                    '<text x="81" y="22" fill="#f59e0b" font-size="13" font-weight="800" text-anchor="middle">(4) Nhiệt lượng kế</text></g>' +
                    '<g transform="translate(388,6)">' +
                    '<line x1="14" y1="56" x2="14" y2="155" stroke="#cbd5e1" stroke-width="3.5"/>' +
                    '<rect x="-4" y="0" width="36" height="58" rx="5" fill="#f8fafc" stroke="#64748b" stroke-width="2"/>' +
                    '<rect x="0" y="14" width="28" height="24" rx="3" fill="#0f172a"/>' +
                    '<text x="14" y="31" fill="#4ade80" font-size="13" font-weight="800" font-family="DM Mono,monospace" text-anchor="middle">27°</text>' +
                    '<g transform="translate(40,12)"><rect x="0" y="0" width="46" height="26" rx="4" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>' +
                    '<text x="23" y="18" fill="#38bdf8" font-size="12.5" font-weight="800" text-anchor="middle">(3)</text></g>' +
                    '</g>' +
                    '<rect x="32" y="198" width="180" height="94" rx="10" fill="#1e293b" stroke="#475569" stroke-width="2"/>' +
                    '<ellipse cx="122" cy="200" rx="72" ry="10" fill="#94a3b8" stroke="#cbd5e1" stroke-width="2"/>' +
                    '<rect x="64" y="236" width="116" height="36" rx="4" fill="#0f172a" stroke="#334155"/>' +
                    '<text x="122" y="261" fill="#38bdf8" font-size="18" font-family="DM Mono,monospace" font-weight="800" text-anchor="middle">250.0 g</text>' +
                    '<g transform="translate(32,306)"><rect x="0" y="0" width="180" height="34" rx="6" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>' +
                    '<text x="90" y="22" fill="#e2e8f0" font-size="12.5" font-weight="800" text-anchor="middle">(5) Cân (m = 0,25 kg)</text></g>' +
                    '<path d="M 50 130 C 50 166 185 166 185 132" fill="none" stroke="#ef4444" stroke-width="2.5"/>' +
                    '<path d="M 210 132 C 210 182 360 182 360 72" fill="none" stroke="#ef4444" stroke-width="2.5" class="ambient-wire-pulse"/>' +
                    '<path d="M 114 130 C 114 172 264 172 264 132" fill="none" stroke="#0284c7" stroke-width="2.5"/>' +
                    '<path d="M 289 132 C 289 192 446 192 446 72" fill="none" stroke="#0284c7" stroke-width="2.5" class="ambient-wire-pulse"/>' +
                    '</svg>';

                var rightSvg =
                    '<svg viewBox="0 0 510 370" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
                    '<line x1="68" y1="245" x2="450" y2="245" stroke="#1e293b" stroke-width="1.2" stroke-dasharray="3 3"/>' +
                    '<text x="58" y="250" fill="#cbd5e1" font-size="12.5" font-family="DM Mono,monospace" font-weight="700" text-anchor="end">10</text>' +
                    '<line x1="68" y1="180" x2="450" y2="180" stroke="#1e293b" stroke-width="1.2" stroke-dasharray="3 3"/>' +
                    '<text x="58" y="185" fill="#cbd5e1" font-size="12.5" font-family="DM Mono,monospace" font-weight="700" text-anchor="end">20</text>' +
                    '<line x1="68" y1="115" x2="450" y2="115" stroke="#334155" stroke-width="1.2" stroke-dasharray="3 3"/>' +
                    '<text x="58" y="120" fill="#cbd5e1" font-size="12.5" font-family="DM Mono,monospace" font-weight="700" text-anchor="end">30</text>' +
                    '<line x1="68" y1="50" x2="450" y2="50" stroke="#1e293b" stroke-width="1.2" stroke-dasharray="3 3"/>' +
                    '<text x="58" y="55" fill="#cbd5e1" font-size="12.5" font-family="DM Mono,monospace" font-weight="700" text-anchor="end">40</text>' +
                    '<line x1="150.7" y1="50" x2="150.7" y2="310" stroke="#334155" stroke-width="1.2" stroke-dasharray="3 3"/>' +
                    '<text x="150.7" y="330" fill="#f59e0b" font-size="13" font-family="DM Mono,monospace" font-weight="800" text-anchor="middle">100</text>' +
                    '<line x1="233.3" y1="50" x2="233.3" y2="310" stroke="#334155" stroke-width="1.2" stroke-dasharray="3 3"/>' +
                    '<text x="233.3" y="330" fill="#94a3b8" font-size="12.5" font-family="DM Mono,monospace" font-weight="700" text-anchor="middle">200</text>' +
                    '<line x1="316" y1="50" x2="316" y2="310" stroke="#334155" stroke-width="1.2" stroke-dasharray="3 3"/>' +
                    '<text x="316" y="330" fill="#94a3b8" font-size="12.5" font-family="DM Mono,monospace" font-weight="700" text-anchor="middle">300</text>' +
                    '<line x1="398.7" y1="50" x2="398.7" y2="310" stroke="#334155" stroke-width="1.2" stroke-dasharray="3 3"/>' +
                    '<text x="398.7" y="330" fill="#f59e0b" font-size="13" font-family="DM Mono,monospace" font-weight="800" text-anchor="middle">400</text>' +
                    '<line x1="60" y1="310" x2="452" y2="310" stroke="#cbd5e1" stroke-width="2"/>' +
                    '<polygon points="452,310 442,306 442,314" fill="#cbd5e1"/>' +
                    '<text x="498" y="315" fill="#f8fafc" font-size="13" font-weight="800" text-anchor="end">τ (s)</text>' +
                    '<text x="58" y="330" fill="#cbd5e1" font-size="12.5" font-family="DM Mono,monospace" font-weight="700" text-anchor="end">0</text>' +
                    '<line x1="68" y1="318" x2="68" y2="34" stroke="#cbd5e1" stroke-width="2"/>' +
                    '<polygon points="68,34 64,44 72,44" fill="#cbd5e1"/>' +
                    '<text x="68" y="24" fill="#f8fafc" font-size="13.5" font-weight="800" text-anchor="middle">t (°C)</text>' +
                    '<line x1="68" y1="160.7" x2="442" y2="81" stroke="#10b981" stroke-width="2.6"/>' +
                    '<circle cx="117.6" cy="146.2" r="4.5" fill="#38bdf8" stroke="#0f172a" stroke-width="1.5"/>' +
                    '<circle cx="167.2" cy="144.9" r="4.5" fill="#38bdf8" stroke="#0f172a" stroke-width="1.5"/>' +
                    '<circle cx="216.8" cy="134.5" r="4.5" fill="#38bdf8" stroke="#0f172a" stroke-width="1.5"/>' +
                    '<circle cx="266.4" cy="123.5" r="4.5" fill="#38bdf8" stroke="#0f172a" stroke-width="1.5"/>' +
                    '<circle cx="316" cy="107.2" r="4.5" fill="#38bdf8" stroke="#0f172a" stroke-width="1.5"/>' +
                    '<circle cx="365.6" cy="100.1" r="4.5" fill="#38bdf8" stroke="#0f172a" stroke-width="1.5"/>' +
                    '<circle cx="415.2" cy="90.3" r="4.5" fill="#38bdf8" stroke="#0f172a" stroke-width="1.5"/>' +
                    '<line x1="68" y1="143.6" x2="150.7" y2="143.6" stroke="#f59e0b" stroke-width="1.6" stroke-dasharray="3 3"/>' +
                    '<line x1="150.7" y1="143.6" x2="150.7" y2="310" stroke="#f59e0b" stroke-width="1.6" stroke-dasharray="3 3"/>' +
                    '<circle cx="150.7" cy="143.6" r="5" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>' +
                    '<text x="150.7" y="122" fill="#f59e0b" font-size="13.5" font-weight="800" text-anchor="middle">M (100 ; 25,6)</text>' +
                    '<text x="58" y="148" fill="#f59e0b" font-size="13" font-family="DM Mono,monospace" font-weight="800" text-anchor="end">25,6</text>' +
                    '<line x1="68" y1="92.3" x2="398.7" y2="92.3" stroke="#f59e0b" stroke-width="1.6" stroke-dasharray="3 3"/>' +
                    '<line x1="398.7" y1="92.3" x2="398.7" y2="310" stroke="#f59e0b" stroke-width="1.6" stroke-dasharray="3 3"/>' +
                    '<circle cx="398.7" cy="92.3" r="5" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>' +
                    '<text x="398.7" y="72" fill="#f59e0b" font-size="13.5" font-weight="800" text-anchor="middle">N (400 ; 33,5)</text>' +
                    '<text x="58" y="96" fill="#f59e0b" font-size="13" font-family="DM Mono,monospace" font-weight="800" text-anchor="end">33,5</text>' +
                    '</svg>';

                return '<div class="vlxt-visual-container"><div class="vlxt-grid-2col">' +
                    '<div class="vlxt-stage-wrap">' + captionHtml('fa-solid fa-flask', 'Hình 4.1: Bộ thí nghiệm đo nhiệt dung riêng của nước') + leftSvg + '</div>' +
                    '<div class="vlxt-stage-wrap">' + captionHtml('fa-solid fa-chart-line', 'Đồ thị thực nghiệm nhiệt độ t (°C) theo thời gian τ (s)') + rightSvg + '</div>' +
                    '</div></div>';
            }
        },
        'MH-C1-03': {
            id: 'MH-C1-03',
            title: 'Bộ thí nghiệm đo nhiệt nóng chảy riêng nước đá và đồ thị ngoại suy',
            topic: 'DS-C1.3',
            layout: '2col',
            caption: 'Hình 1: Bộ đo nhiệt nóng chảy riêng của nước đá',
            caption2: 'Hình 2: Đồ thị thay đổi nhiệt độ theo thời gian',
            alt: 'Bộ 5 dụng cụ đo nhiệt nóng chảy riêng của nước đá và đồ thị gấp khúc t(°C) theo τ(s) tại mốc τ = 640 s',
            build: function () {
                var leftSvg =
                    '<svg viewBox="0 0 510 370" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
                    '<rect x="18" y="25" width="128" height="118" rx="8" fill="#1e293b" stroke="#475569" stroke-width="2"/>' +
                    '<g transform="translate(24,32)"><rect x="0" y="0" width="116" height="26" rx="4" fill="#0b1120" stroke="#334155"/>' +
                    '<text x="58" y="18" fill="#38bdf8" font-size="12.5" font-weight="800" text-anchor="middle">(1) Nguồn điện</text></g>' +
                    '<circle cx="82" cy="86" r="20" fill="#334155" stroke="#64748b" stroke-width="2"/>' +
                    '<line x1="82" y1="86" x2="94" y2="75" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round"/>' +
                    '<circle cx="50" cy="124" r="6" fill="#ef4444"/><circle cx="114" cy="124" r="6" fill="#0284c7"/>' +
                    '<rect x="164" y="25" width="146" height="118" rx="8" fill="#1e293b" stroke="#475569" stroke-width="2"/>' +
                    '<g transform="translate(170,32)"><rect x="0" y="0" width="134" height="26" rx="4" fill="#0b1120" stroke="#334155"/>' +
                    '<text x="67" y="18" fill="#38bdf8" font-size="12.5" font-weight="800" text-anchor="middle">(2) Oát kế</text></g>' +
                    '<rect x="171" y="61" width="132" height="50" rx="5" fill="#0b1120" stroke="#334155"/>' +
                    '<text x="237" y="82" fill="#4ade80" font-size="16" font-family="DM Mono,monospace" font-weight="800" text-anchor="middle">11.13 W</text>' +
                    '<text x="237" y="102" fill="#38bdf8" font-size="13.5" font-family="DM Mono,monospace" font-weight="700" text-anchor="middle">τ = 640 s</text>' +
                    '<circle cx="185" cy="127" r="4.5" fill="#ef4444"/><circle cx="210" cy="127" r="4.5" fill="#ef4444"/>' +
                    '<circle cx="264" cy="127" r="4.5" fill="#0284c7"/><circle cx="289" cy="127" r="4.5" fill="#0284c7"/>' +
                    '<rect x="330" y="68" width="156" height="186" rx="12" fill="#78350f" opacity="0.35" stroke="#d97706" stroke-width="2.5"/>' +
                    '<rect x="340" y="108" width="136" height="136" rx="8" fill="rgba(56,189,248,0.22)" stroke="#38bdf8" stroke-width="1.8"/>' +
                    '<g class="ambient-stirrer">' +
                    '<line x1="365" y1="42" x2="365" y2="226" stroke="#cbd5e1" stroke-width="3"/>' +
                    '<circle cx="365" cy="226" r="9" fill="none" stroke="#cbd5e1" stroke-width="2.5"/>' +
                    '<rect x="356" y="34" width="18" height="16" rx="3" fill="#ef4444"/>' +
                    '</g>' +
                    '<g class="ambient-ice-bob">' +
                    '<rect x="386" y="152" width="28" height="26" rx="4" fill="rgba(255,255,255,0.82)" stroke="#38bdf8" stroke-width="1.5"/>' +
                    '<rect x="422" y="166" width="24" height="22" rx="4" fill="rgba(255,255,255,0.78)" stroke="#38bdf8" stroke-width="1.5"/>' +
                    '<rect x="396" y="192" width="26" height="24" rx="4" fill="rgba(255,255,255,0.74)" stroke="#38bdf8" stroke-width="1.5"/>' +
                    '</g>' +
                    '<path d="M 380 226 Q 395 213 410 226 T 442 226" fill="none" stroke="#ea580c" stroke-width="3.5"/>' +
                    '<line x1="380" y1="226" x2="380" y2="72" stroke="#f97316" stroke-width="2"/>' +
                    '<line x1="442" y1="226" x2="442" y2="72" stroke="#f97316" stroke-width="2"/>' +
                    '<rect x="325" y="60" width="166" height="18" rx="4" fill="#334155" stroke="#64748b"/>' +
                    '<g transform="translate(325,268)"><rect x="0" y="0" width="166" height="34" rx="6" fill="#0f172a" stroke="#d97706" stroke-width="1.5"/>' +
                    '<text x="83" y="22" fill="#f59e0b" font-size="12.5" font-weight="800" text-anchor="middle">(4) Hỗn hợp nước + đá</text></g>' +
                    '<g transform="translate(410,6)">' +
                    '<line x1="14" y1="56" x2="14" y2="156" stroke="#cbd5e1" stroke-width="3.5"/>' +
                    '<rect x="-4" y="0" width="36" height="58" rx="5" fill="#f8fafc" stroke="#64748b" stroke-width="2"/>' +
                    '<rect x="0" y="14" width="28" height="24" rx="3" fill="#0f172a"/>' +
                    '<text x="14" y="31" fill="#38bdf8" font-size="12.5" font-weight="800" font-family="DM Mono,monospace" text-anchor="middle">0.0°</text>' +
                    '<g transform="translate(38,12)"><rect x="0" y="0" width="44" height="26" rx="4" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>' +
                    '<text x="22" y="18" fill="#38bdf8" font-size="12.5" font-weight="800" text-anchor="middle">(3)</text></g>' +
                    '</g>' +
                    '<rect x="28" y="198" width="192" height="94" rx="10" fill="#1e293b" stroke="#475569" stroke-width="2"/>' +
                    '<ellipse cx="124" cy="200" rx="74" ry="10" fill="#94a3b8" stroke="#cbd5e1" stroke-width="2"/>' +
                    '<rect x="66" y="236" width="116" height="36" rx="4" fill="#0f172a" stroke="#334155"/>' +
                    '<text x="124" y="261" fill="#38bdf8" font-size="18" font-family="DM Mono,monospace" font-weight="800" text-anchor="middle">20.00 g</text>' +
                    '<g transform="translate(28,306)"><rect x="0" y="0" width="192" height="34" rx="6" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>' +
                    '<text x="96" y="22" fill="#e2e8f0" font-size="12.5" font-weight="800" text-anchor="middle">(5) Cân (m<tspan dy="3" font-size="10">đá</tspan><tspan dy="-3"> = 0,02 kg)</tspan></text></g>' +
                    '<path d="M 210 132 C 210 182 380 182 380 72" fill="none" stroke="#ef4444" stroke-width="2.5" class="ambient-wire-pulse"/>' +
                    '<path d="M 289 132 C 289 192 442 192 442 72" fill="none" stroke="#0284c7" stroke-width="2.5" class="ambient-wire-pulse"/>' +
                    '</svg>';

                var rightSvg =
                    '<svg viewBox="0 0 510 370" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
                    '<line x1="68" y1="264" x2="452" y2="264" stroke="#1e293b" stroke-width="1.2" stroke-dasharray="3 3"/>' +
                    '<text x="58" y="268" fill="#cbd5e1" font-size="12" font-family="DM Mono,monospace" font-weight="700" text-anchor="end">0,2</text>' +
                    '<line x1="68" y1="228" x2="452" y2="228" stroke="#1e293b" stroke-width="1.2" stroke-dasharray="3 3"/>' +
                    '<text x="58" y="232" fill="#cbd5e1" font-size="12" font-family="DM Mono,monospace" font-weight="700" text-anchor="end">0,4</text>' +
                    '<line x1="68" y1="192" x2="452" y2="192" stroke="#334155" stroke-width="1.2" stroke-dasharray="3 3"/>' +
                    '<text x="58" y="196" fill="#cbd5e1" font-size="12" font-family="DM Mono,monospace" font-weight="700" text-anchor="end">0,6</text>' +
                    '<line x1="68" y1="156" x2="452" y2="156" stroke="#1e293b" stroke-width="1.2" stroke-dasharray="3 3"/>' +
                    '<text x="58" y="160" fill="#cbd5e1" font-size="12" font-family="DM Mono,monospace" font-weight="700" text-anchor="end">0,8</text>' +
                    '<line x1="68" y1="120" x2="452" y2="120" stroke="#334155" stroke-width="1.2" stroke-dasharray="3 3"/>' +
                    '<text x="58" y="124" fill="#cbd5e1" font-size="12" font-family="DM Mono,monospace" font-weight="700" text-anchor="end">1,0</text>' +
                    '<line x1="68" y1="84" x2="452" y2="84" stroke="#1e293b" stroke-width="1.2" stroke-dasharray="3 3"/>' +
                    '<text x="58" y="88" fill="#cbd5e1" font-size="12" font-family="DM Mono,monospace" font-weight="700" text-anchor="end">1,2</text>' +
                    '<line x1="68" y1="48" x2="452" y2="48" stroke="#1e293b" stroke-width="1.2" stroke-dasharray="3 3"/>' +
                    '<text x="58" y="52" fill="#cbd5e1" font-size="12" font-family="DM Mono,monospace" font-weight="700" text-anchor="end">1,4</text>' +
                    '<line x1="138" y1="48" x2="138" y2="300" stroke="#1e293b" stroke-width="1.2" stroke-dasharray="3 3"/>' +
                    '<text x="138" y="322" fill="#cbd5e1" font-size="12" font-family="DM Mono,monospace" font-weight="700" text-anchor="middle">200</text>' +
                    '<line x1="208" y1="48" x2="208" y2="300" stroke="#1e293b" stroke-width="1.2" stroke-dasharray="3 3"/>' +
                    '<text x="208" y="322" fill="#cbd5e1" font-size="12" font-family="DM Mono,monospace" font-weight="700" text-anchor="middle">400</text>' +
                    '<line x1="278" y1="48" x2="278" y2="300" stroke="#334155" stroke-width="1.2" stroke-dasharray="3 3"/>' +
                    '<text x="278" y="322" fill="#cbd5e1" font-size="12" font-family="DM Mono,monospace" font-weight="700" text-anchor="middle">600</text>' +
                    '<line x1="348" y1="48" x2="348" y2="300" stroke="#1e293b" stroke-width="1.2" stroke-dasharray="3 3"/>' +
                    '<text x="348" y="322" fill="#cbd5e1" font-size="12" font-family="DM Mono,monospace" font-weight="700" text-anchor="middle">800</text>' +
                    '<line x1="418" y1="48" x2="418" y2="300" stroke="#1e293b" stroke-width="1.2" stroke-dasharray="3 3"/>' +
                    '<text x="418" y="322" fill="#cbd5e1" font-size="12" font-family="DM Mono,monospace" font-weight="700" text-anchor="middle">1000</text>' +
                    '<line x1="60" y1="300" x2="454" y2="300" stroke="#cbd5e1" stroke-width="2"/>' +
                    '<polygon points="454,300 444,296 444,304" fill="#cbd5e1"/>' +
                    '<text x="498" y="305" fill="#f8fafc" font-size="13" font-weight="800" text-anchor="end">τ (s)</text>' +
                    '<text x="58" y="322" fill="#cbd5e1" font-size="12" font-family="DM Mono,monospace" font-weight="700" text-anchor="end">0</text>' +
                    '<line x1="68" y1="308" x2="68" y2="34" stroke="#cbd5e1" stroke-width="2"/>' +
                    '<polygon points="68,34 64,44 72,44" fill="#cbd5e1"/>' +
                    '<text x="68" y="24" fill="#f8fafc" font-size="13.5" font-weight="800" text-anchor="middle">t (°C)</text>' +
                    '<line x1="68" y1="300" x2="292" y2="300" stroke="#38bdf8" stroke-width="3.5"/>' +
                    '<line x1="292" y1="300" x2="432" y2="80" stroke="#10b981" stroke-width="3"/>' +
                    '<circle cx="68" cy="300" r="4" fill="#38bdf8"/>' +
                    '<circle cx="110" cy="300" r="4" fill="#38bdf8"/>' +
                    '<circle cx="152" cy="300" r="4" fill="#38bdf8"/>' +
                    '<circle cx="190.5" cy="300" r="4" fill="#38bdf8"/>' +
                    '<circle cx="236" cy="300" r="4" fill="#38bdf8"/>' +
                    '<circle cx="278" cy="300" r="4" fill="#38bdf8"/>' +
                    '<circle cx="320" cy="246" r="4.5" fill="#f59e0b" stroke="#fff" stroke-width="1.2"/>' +
                    '<circle cx="362" cy="192" r="4.5" fill="#f59e0b" stroke="#fff" stroke-width="1.2"/>' +
                    '<circle cx="404" cy="102" r="4.5" fill="#f59e0b" stroke="#fff" stroke-width="1.2"/>' +
                    '<line x1="292" y1="300" x2="292" y2="195" stroke="#f59e0b" stroke-width="1.8" stroke-dasharray="3 3"/>' +
                    '<line x1="292" y1="304" x2="292" y2="334" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="2 2"/>' +
                    '<circle cx="292" cy="300" r="5" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>' +
                    '<text x="292" y="166" fill="#f59e0b" font-size="14" font-weight="800" text-anchor="middle">τ = 640 s</text>' +
                    '<text x="292" y="185" fill="#38bdf8" font-size="12" font-weight="700" text-anchor="middle">(Đá vừa tan hết)</text>' +
                    '<text x="292" y="350" fill="#f59e0b" font-size="13" font-family="DM Mono,monospace" font-weight="800" text-anchor="middle">640</text>' +
                    '</svg>';

                return '<div class="vlxt-visual-container"><div class="vlxt-grid-2col">' +
                    '<div class="vlxt-stage-wrap">' + captionHtml('fa-solid fa-cube', 'Hình 1: Bộ đo nhiệt nóng chảy riêng của nước đá') + leftSvg + '</div>' +
                    '<div class="vlxt-stage-wrap">' + captionHtml('fa-solid fa-chart-area', 'Hình 2: Đồ thị thay đổi nhiệt độ theo thời gian') + rightSvg + '</div>' +
                    '</div></div>';
            }
        },
        'MH-C1-04': {
            id: 'MH-C1-04',
            title: 'Sơ đồ mạch đo nhiệt dung riêng chất lỏng (Biến áp – Oát kế – Nhiệt lượng kế)',
            topic: 'DS-C1.2',
            layout: 'single',
            caption: 'Sơ đồ mạch đo nhiệt dung riêng chất lỏng (Biến áp -> Oát kế -> Nhiệt lượng kế)',
            alt: 'Mạch thí nghiệm gồm biến áp nguồn, oát kế 4 W với U = 1,6 V và I = 2,5 A nối tới bình nhiệt lượng kế chứa 150 g chất lỏng',
            build: function () {
                var svg =
                    '<svg viewBox="0 0 760 410" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
                    '<g transform="translate(30,65)">' +
                    '<rect x="0" y="0" width="160" height="182" rx="10" fill="#1e293b" stroke="#475569" stroke-width="2.5"/>' +
                    '<g transform="translate(8,12)"><rect x="0" y="0" width="144" height="30" rx="5" fill="#0b1120" stroke="#334155"/>' +
                    '<text x="72" y="20" fill="#f8fafc" font-size="13.5" font-weight="800" text-anchor="middle">BIẾN ÁP NGUỒN</text></g>' +
                    '<circle cx="80" cy="85" r="30" fill="#0f172a" stroke="#334155" stroke-width="2"/>' +
                    '<path d="M 60 95 A 24 24 0 0 1 100 95" fill="none" stroke="#64748b" stroke-width="2"/>' +
                    '<line x1="80" y1="85" x2="94" y2="72" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round"/>' +
                    '<circle cx="45" cy="148" r="8" fill="#ef4444"/><text x="45" y="153" fill="#fff" font-size="13.5" font-weight="800" text-anchor="middle">+</text>' +
                    '<text x="45" y="172" fill="#fca5a5" font-size="12" font-weight="700" text-anchor="middle">1,6 V</text>' +
                    '<circle cx="115" cy="148" r="8" fill="#0284c7"/><text x="115" y="153" fill="#fff" font-size="14" font-weight="800" text-anchor="middle">-</text>' +
                    '<text x="115" y="172" fill="#7dd3fc" font-size="12" font-weight="700" text-anchor="middle">Cực âm</text>' +
                    '</g>' +
                    '<g transform="translate(238,70)">' +
                    '<rect x="0" y="0" width="188" height="176" rx="10" fill="#1e293b" stroke="#475569" stroke-width="2.5"/>' +
                    '<g transform="translate(8,12)"><rect x="0" y="0" width="172" height="30" rx="5" fill="#0b1120" stroke="#334155"/>' +
                    '<text x="86" y="20" fill="#f8fafc" font-size="13" font-weight="800" text-anchor="middle">OÁT KẾ (WATTMETER)</text></g>' +
                    '<rect x="14" y="52" width="160" height="58" rx="6" fill="#0b1120" stroke="#334155"/>' +
                    '<text x="94" y="78" fill="#4ade80" font-size="17" font-family="DM Mono,monospace" font-weight="800" text-anchor="middle">P = 4.00 W</text>' +
                    '<text x="94" y="99" fill="#38bdf8" font-size="13" font-family="DM Mono,monospace" font-weight="700" text-anchor="middle">U=1.6V | I=2.5A</text>' +
                    '<circle cx="46" cy="132" r="6" fill="#ef4444"/><circle cx="142" cy="132" r="6" fill="#ef4444"/>' +
                    '<circle cx="46" cy="158" r="6" fill="#0284c7"/><circle cx="142" cy="158" r="6" fill="#0284c7"/>' +
                    '</g>' +
                    '<g transform="translate(485,50)">' +
                    '<rect x="25" y="55" width="180" height="235" rx="14" fill="rgba(14,165,233,0.15)" stroke="#38bdf8" stroke-width="2.5"/>' +
                    '<rect x="30" y="110" width="170" height="175" rx="10" fill="rgba(2,132,199,0.35)" class="ambient-water-wave"/>' +
                    '<rect x="15" y="45" width="200" height="22" rx="6" fill="#1e3a5f" stroke="#0284c7" stroke-width="2"/>' +
                    '<line x1="75" y1="15" x2="75" y2="235" stroke="#cbd5e1" stroke-width="3.5"/>' +
                    '<line x1="75" y1="110" x2="75" y2="235" stroke="#ef4444" stroke-width="3"/>' +
                    '<circle cx="75" cy="235" r="5.5" fill="#ef4444"/>' +
                    '<g transform="translate(23,-22)"><rect x="0" y="0" width="106" height="28" rx="5" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>' +
                    '<text x="53" y="19" fill="#38bdf8" font-size="13.5" font-weight="800" text-anchor="middle">Nhiệt kế</text></g>' +
                    '<path d="M 125 255 Q 140 240 155 255 T 180 255" fill="none" stroke="#f97316" stroke-width="4"/>' +
                    '<line x1="125" y1="45" x2="125" y2="255" stroke="#ea580c" stroke-width="2.5"/>' +
                    '<line x1="180" y1="45" x2="180" y2="255" stroke="#ea580c" stroke-width="2.5"/>' +
                    '<circle cx="125" cy="45" r="6" fill="#ef4444" stroke="#fff" stroke-width="1.5"/>' +
                    '<circle cx="180" cy="45" r="6" fill="#0284c7" stroke="#fff" stroke-width="1.5"/>' +
                    '<g transform="translate(35,305)"><rect x="0" y="0" width="160" height="34" rx="6" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>' +
                    '<text x="80" y="22" fill="#f8fafc" font-size="14" font-weight="800" text-anchor="middle">Nhiệt lượng kế</text></g>' +
                    '</g>' +
                    '<path d="M 75 213 C 75 275 284 275 284 202" fill="none" stroke="#ef4444" stroke-width="2.5"/>' +
                    '<path d="M 380 202 C 440 202 510 120 610 95" fill="none" stroke="#ef4444" stroke-width="2.5" class="ambient-wire-pulse"/>' +
                    '<path d="M 145 213 C 145 300 284 300 284 228" fill="none" stroke="#0284c7" stroke-width="2.5"/>' +
                    '<path d="M 380 228 C 460 250 540 130 665 95" fill="none" stroke="#0284c7" stroke-width="2.5" class="ambient-wire-pulse"/>' +
                    '</svg>';
                return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
                    captionHtml('fa-solid fa-bolt', 'Sơ đồ mạch đo nhiệt dung riêng chất lỏng (Biến áp -> Oát kế -> Nhiệt lượng kế)') + svg +
                    '</div></div>';
            }
        },
        'MH-C1-05': {
            id: 'MH-C1-05',
            title: 'Bộ 5 dụng cụ thực hành đo nhiệt nóng chảy riêng bằng phương pháp trộn lẫn',
            topic: 'DS-C1.3',
            layout: 'single',
            caption: 'Sân khấu 5 thiết bị thực hành đo nhiệt nóng chảy riêng (Phương pháp trộn lẫn)',
            alt: 'Năm thiết bị thí nghiệm đánh số (1) Chai nước, (2) Nhiệt lượng kế có que khuấy, (3) Cốc nước đá 0°C, (4) Cân điện tử ±0,01 g, (5) Nhiệt kế ±0,1°C',
            build: function () {
                var svg =
                    '<svg viewBox="0 0 940 400" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
                    '<line x1="15" y1="308" x2="925" y2="308" stroke="#334155" stroke-width="2.5"/>' +
                    '<line x1="25" y1="315" x2="915" y2="315" stroke="#1e293b" stroke-width="2"/>' +
                    '<g transform="translate(48,62)">' +
                    '<rect x="15" y="45" width="60" height="190" rx="10" fill="rgba(14,165,233,0.22)" stroke="#38bdf8" stroke-width="2"/>' +
                    '<path d="M 15 95 Q 45 90 75 95 L 75 233 Q 45 235 15 233 Z" fill="rgba(2,132,199,0.4)"/>' +
                    '<rect x="29" y="16" width="32" height="30" rx="4" fill="rgba(56,189,248,0.3)" stroke="#38bdf8" stroke-width="1.8"/>' +
                    '<rect x="26" y="5" width="38" height="14" rx="3" fill="#0284c7"/>' +
                    '<rect x="16" y="125" width="58" height="42" fill="#1e293b" rx="3"/>' +
                    '<text x="45" y="151" fill="#38bdf8" font-size="13" font-weight="800" text-anchor="middle">H₂O</text>' +
                    '</g>' +
                    '<g transform="translate(18,323)"><rect x="0" y="0" width="154" height="54" rx="6" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>' +
                    '<text x="77" y="23" fill="#38bdf8" font-size="13.5" font-weight="800" text-anchor="middle">(1) Chai nước</text>' +
                    '<text x="77" y="42" fill="#cbd5e1" font-size="12" font-weight="600" text-anchor="middle">Nước cất tinh khiết</text></g>' +
                    '<g transform="translate(205,54)">' +
                    '<rect x="10" y="35" width="130" height="210" rx="10" fill="#1e293b" stroke="#64748b" stroke-width="2.5"/>' +
                    '<rect x="20" y="80" width="110" height="155" rx="6" fill="rgba(14,165,233,0.2)" stroke="#38bdf8" stroke-width="1.5"/>' +
                    '<rect x="5" y="25" width="140" height="18" rx="4" fill="#334155" stroke="#475569"/>' +
                    '<g class="ambient-stirrer">' +
                    '<line x1="45" y1="0" x2="45" y2="225" stroke="#cbd5e1" stroke-width="3"/>' +
                    '<circle cx="45" cy="225" r="9" fill="none" stroke="#cbd5e1" stroke-width="2.5"/>' +
                    '<rect x="36" y="-8" width="18" height="16" rx="3" fill="#ef4444"/>' +
                    '</g>' +
                    '<rect x="22" y="115" width="106" height="26" rx="3" fill="#0f172a"/>' +
                    '<text x="75" y="133" fill="#cbd5e1" font-size="12" font-family="DM Mono,monospace" font-weight="700" text-anchor="middle">BÌNH CÁCH NHIỆT</text>' +
                    '</g>' +
                    '<g transform="translate(192,323)"><rect x="0" y="0" width="170" height="54" rx="6" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>' +
                    '<text x="85" y="23" fill="#38bdf8" font-size="13.5" font-weight="800" text-anchor="middle">(2) Nhiệt lượng kế</text>' +
                    '<text x="85" y="42" fill="#cbd5e1" font-size="12" font-weight="600" text-anchor="middle">Vỏ xốp, có que khuấy</text></g>' +
                    '<g transform="translate(390,78)">' +
                    '<rect x="10" y="25" width="120" height="195" rx="8" fill="rgba(56,189,248,0.16)" stroke="#38bdf8" stroke-width="2.5"/>' +
                    '<path d="M 12 75 Q 70 70 128 75 L 126 218 Q 70 220 14 218 Z" fill="rgba(2,132,199,0.35)"/>' +
                    '<g class="ambient-ice-bob">' +
                    '<rect x="25" y="60" width="34" height="30" rx="4" fill="rgba(255,255,255,0.85)" stroke="#38bdf8" stroke-width="1.5"/>' +
                    '<rect x="68" y="70" width="32" height="28" rx="4" fill="rgba(255,255,255,0.8)" stroke="#38bdf8" stroke-width="1.5"/>' +
                    '<rect x="45" y="105" width="30" height="26" rx="4" fill="rgba(255,255,255,0.75)" stroke="#38bdf8" stroke-width="1.5"/>' +
                    '</g></g>' +
                    '<g transform="translate(382,323)"><rect x="0" y="0" width="158" height="54" rx="6" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>' +
                    '<text x="79" y="23" fill="#38bdf8" font-size="13.5" font-weight="800" text-anchor="middle">(3) Cốc nước đá</text>' +
                    '<text x="79" y="42" fill="#f59e0b" font-size="12" font-weight="700" text-anchor="middle">Nhiệt độ 0,0°C</text></g>' +
                    '<g transform="translate(565,123)">' +
                    '<rect x="5" y="45" width="165" height="130" rx="10" fill="#1e293b" stroke="#475569" stroke-width="2.5"/>' +
                    '<ellipse cx="87" cy="45" rx="72" ry="11" fill="#94a3b8" stroke="#cbd5e1" stroke-width="2"/>' +
                    '<rect x="20" y="88" width="135" height="46" rx="5" fill="#0f172a" stroke="#334155"/>' +
                    '<text x="87" y="119" fill="#4ade80" font-size="19" font-family="DM Mono,monospace" font-weight="800" text-anchor="middle">192.92 g</text>' +
                    '</g>' +
                    '<g transform="translate(560,323)"><rect x="0" y="0" width="176" height="54" rx="6" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>' +
                    '<text x="88" y="23" fill="#38bdf8" font-size="13.5" font-weight="800" text-anchor="middle">(4) Cân điện tử</text>' +
                    '<text x="88" y="42" fill="#cbd5e1" font-size="12" font-weight="600" text-anchor="middle">Độ chia nhỏ nhất 0,01 g</text></g>' +
                    '<g transform="translate(788,48)">' +
                    '<line x1="32" y1="125" x2="32" y2="255" stroke="#cbd5e1" stroke-width="3"/>' +
                    '<circle cx="32" cy="255" r="4.5" fill="#94a3b8"/>' +
                    '<rect x="12" y="20" width="40" height="105" rx="8" fill="#f8fafc" stroke="#64748b" stroke-width="2"/>' +
                    '<rect x="16" y="44" width="32" height="36" rx="3" fill="#0f172a"/>' +
                    '<text x="32" y="68" fill="#38bdf8" font-size="14" font-family="DM Mono,monospace" font-weight="800" text-anchor="middle">32°</text>' +
                    '</g>' +
                    '<g transform="translate(756,323)"><rect x="0" y="0" width="166" height="54" rx="6" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>' +
                    '<text x="83" y="23" fill="#38bdf8" font-size="13.5" font-weight="800" text-anchor="middle">(5) Nhiệt kế</text>' +
                    '<text x="83" y="42" fill="#cbd5e1" font-size="12" font-weight="600" text-anchor="middle">Độ chính xác 0,1°C</text></g>' +
                    '</svg>';
                return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
                    captionHtml('fa-solid fa-boxes-stacked', 'Sân khấu 5 thiết bị thực hành đo nhiệt nóng chảy riêng (Phương pháp trộn lẫn)') + svg +
                    '</div></div>';
            }
        },
        'MH-C1-06': {
            id: 'MH-C1-06',
            title: 'Bình nước nóng năng lượng mặt trời (Tấm hấp thụ 2 m² & Bình bảo ôn 200 lít)',
            topic: 'DS-C1.4',
            layout: 'single',
            caption: 'Mô hình bình nước nóng năng lượng mặt trời (Hấp thụ quang năng -> Nhiệt năng)',
            alt: 'Bình nước nóng năng lượng mặt trời gồm tấm thu nhiệt diện tích 2 m², bình bảo ôn 200 lít phía trên và tia bức xạ mặt trời 1370 W/m²',
            build: function (u) {
                var svg =
                    '<svg viewBox="0 0 780 390" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
                    '<defs>' +
                    '<linearGradient id="' + u + 'tank" x1="0%" y1="0%" x2="0%" y2="100%">' +
                    '<stop offset="0%" stop-color="#94a3b8"/><stop offset="40%" stop-color="#e2e8f0"/><stop offset="100%" stop-color="#475569"/>' +
                    '</linearGradient>' +
                    '<linearGradient id="' + u + 'panel" x1="0%" y1="0%" x2="100%" y2="100%">' +
                    '<stop offset="0%" stop-color="#0f172a"/><stop offset="50%" stop-color="#1e293b"/><stop offset="100%" stop-color="#0b1120"/>' +
                    '</linearGradient>' +
                    '<marker id="' + u + 'sunArr" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">' +
                    '<path d="M 0 1 L 9 5 L 0 9 z" fill="#f59e0b"/>' +
                    '</marker>' +
                    '</defs>' +
                    '<line x1="40" y1="348" x2="740" y2="348" stroke="#334155" stroke-width="2.5"/>' +
                    '<line x1="65" y1="348" x2="155" y2="348" stroke="#475569" stroke-width="4"/>' +
                    '<polyline points="200,348 250,348 345,112 480,112 495,348 530,348" fill="none" stroke="#64748b" stroke-width="4" stroke-linejoin="round"/>' +
                    '<line x1="345" y1="220" x2="486" y2="220" stroke="#475569" stroke-width="3"/>' +
                    '<g transform="translate(260,126)">' +
                    '<polygon points="0,0 185,0 115,212 -70,212" fill="url(#' + u + 'panel)" stroke="#38bdf8" stroke-width="2.5"/>' +
                    '<line x1="32" y1="0" x2="-38" y2="212" stroke="#1e3a8a" stroke-width="5"/>' +
                    '<line x1="64" y1="0" x2="-6" y2="212" stroke="#1e3a8a" stroke-width="5"/>' +
                    '<line x1="96" y1="0" x2="26" y2="212" stroke="#1e3a8a" stroke-width="5"/>' +
                    '<line x1="128" y1="0" x2="58" y2="212" stroke="#1e3a8a" stroke-width="5"/>' +
                    '<line x1="158" y1="0" x2="88" y2="212" stroke="#1e3a8a" stroke-width="5"/>' +
                    '<g class="ambient-ray-glide">' +
                    '<line x1="-18" y1="190" x2="40" y2="16" stroke="#f97316" stroke-width="2.2" stroke-dasharray="6 6"/>' +
                    '<line x1="42" y1="190" x2="100" y2="16" stroke="#f97316" stroke-width="2.2" stroke-dasharray="6 6"/>' +
                    '<line x1="102" y1="190" x2="160" y2="16" stroke="#f97316" stroke-width="2.2" stroke-dasharray="6 6"/>' +
                    '</g>' +
                    '</g>' +
                    '<g transform="translate(275,54)">' +
                    '<rect x="0" y="0" width="235" height="66" rx="33" fill="url(#' + u + 'tank)" stroke="#475569" stroke-width="2.2"/>' +
                    '<rect x="20" y="18" width="195" height="30" rx="15" fill="rgba(239,68,68,0.22)" stroke="rgba(249,115,22,0.5)" stroke-width="1.5"/>' +
                    '<text x="118" y="38" fill="#0f172a" font-size="13.5" font-weight="800" text-anchor="middle">Bình bảo ôn · V = 200 lít (25°C)</text>' +
                    '</g>' +
                    '<circle cx="118" cy="72" r="28" fill="#f59e0b"/>' +
                    '<circle cx="118" cy="72" r="36" fill="none" stroke="#fbbf24" stroke-width="2" stroke-dasharray="6 6" class="ambient-fan-spin"/>' +
                    '<g class="ambient-heat-arrow">' +
                    '<line x1="155" y1="96" x2="255" y2="152" stroke="#f59e0b" stroke-width="2.5" marker-end="url(#' + u + 'sunArr)"/>' +
                    '<line x1="142" y1="115" x2="242" y2="178" stroke="#f59e0b" stroke-width="2.5" marker-end="url(#' + u + 'sunArr)"/>' +
                    '<line x1="126" y1="132" x2="225" y2="205" stroke="#f59e0b" stroke-width="2.5" marker-end="url(#' + u + 'sunArr)"/>' +
                    '</g>' +
                    '<polyline points="215,152 162,250" fill="none" stroke="#38bdf8" stroke-width="1.8" stroke-dasharray="3 3"/>' +
                    '<g transform="translate(22,250)">' +
                    '<rect x="0" y="0" width="186" height="58" rx="6" fill="#0f172a" stroke="#f59e0b" stroke-width="1.5"/>' +
                    '<text x="93" y="23" fill="#fbbf24" font-size="13" font-weight="800" text-anchor="middle">Cường độ sáng Mặt Trời</text>' +
                    '<text x="93" y="44" fill="#e2e8f0" font-size="12.5" font-family="DM Mono,monospace" font-weight="700" text-anchor="middle">I = 1370 W/m² · H = 60%</text>' +
                    '</g>' +
                    '<polyline points="425,212 555,212" fill="none" stroke="#38bdf8" stroke-width="1.8" stroke-dasharray="3 3"/>' +
                    '<circle cx="425" cy="212" r="4" fill="#38bdf8"/>' +
                    '<g transform="translate(555,184)">' +
                    '<rect x="0" y="0" width="205" height="58" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>' +
                    '<text x="102" y="23" fill="#38bdf8" font-size="13" font-weight="800" text-anchor="middle">Tấm thu năng lượng mặt trời</text>' +
                    '<text x="102" y="44" fill="#cbd5e1" font-size="12.5" font-family="DM Mono,monospace" font-weight="700" text-anchor="middle">Diện tích S = 2 m²</text>' +
                    '</g>' +
                    '<polyline points="510,87 565,87" fill="none" stroke="#10b981" stroke-width="1.8" stroke-dasharray="3 3"/>' +
                    '<circle cx="510" cy="87" r="4" fill="#10b981"/>' +
                    '<g transform="translate(565,60)">' +
                    '<rect x="0" y="0" width="195" height="54" rx="6" fill="#0f172a" stroke="#10b981" stroke-width="1.5"/>' +
                    '<text x="97" y="22" fill="#6ee7b7" font-size="13" font-weight="800" text-anchor="middle">Bình chứa cách nhiệt</text>' +
                    '<text x="97" y="41" fill="#cbd5e1" font-size="12" font-weight="600" text-anchor="middle">Đối lưu giữ nước nóng</text>' +
                    '</g>' +
                    '</svg>';
                return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
                    captionHtml('fa-solid fa-solar-panel', 'Bình nước nóng năng lượng mặt trời (Tấm hấp thụ 2 m² & Bình bảo ôn 200 lít)') + svg +
                    '</div></div>';
            }
        },
        'MH-C1-07': {
            id: 'MH-C1-07',
            title: 'Sơ đồ nguyên lý máy làm nóng nước dùng rơ-le nhiệt tự ngắt (20 lít – 2500 W)',
            topic: 'DS-C1.4',
            layout: 'single',
            caption: 'Sơ đồ nguyên lý máy làm nóng nước 20 lít – 2500 W (Rơ-le ngắt ở 70°C)',
            alt: 'Máy làm nóng nước gián tiếp có đường điện vào phía trên, màn hình 70°C, núm điều chỉnh, ống nước nóng ra (khóa) và ống nước lạnh vào (18°C)',
            build: function () {
                var svg =
                    '<svg viewBox="0 0 760 390" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
                    '<line x1="373" y1="22" x2="373" y2="75" stroke="#ef4444" stroke-width="4" class="ambient-wire-pulse"/>' +
                    '<line x1="387" y1="22" x2="387" y2="75" stroke="#94a3b8" stroke-width="4"/>' +
                    '<rect x="275" y="75" width="210" height="236" rx="22" fill="#1e293b" stroke="#38bdf8" stroke-width="3"/>' +
                    '<rect x="295" y="95" width="170" height="196" rx="14" fill="#0f172a" stroke="#334155" stroke-width="2"/>' +
                    '<rect x="322" y="114" width="116" height="44" rx="6" fill="#050811" stroke="#475569" stroke-width="2"/>' +
                    '<text x="380" y="143" fill="#4ade80" font-size="22" font-family="DM Mono,monospace" font-weight="800" text-anchor="middle">70°C</text>' +
                    '<circle cx="380" cy="202" r="24" fill="#1e293b" stroke="#38bdf8" stroke-width="3"/>' +
                    '<circle cx="380" cy="202" r="14" fill="#0284c7"/>' +
                    '<line x1="380" y1="202" x2="394" y2="190" stroke="#f8fafc" stroke-width="2.5" stroke-linecap="round"/>' +
                    '<path d="M 326 266 Q 344 252 362 266 T 398 266 T 434 266" fill="none" stroke="#f97316" stroke-width="4" class="ambient-heat-arrow"/>' +
                    '<text x="380" y="246" fill="#94a3b8" font-size="12" font-family="DM Mono,monospace" font-weight="700" text-anchor="middle">20 lít · P = 2500 W</text>' +
                    '<rect x="336" y="311" width="16" height="58" fill="#ef4444" rx="2"/>' +
                    '<line x1="332" y1="336" x2="356" y2="336" stroke="#f8fafc" stroke-width="3"/>' +
                    '<rect x="408" y="311" width="16" height="58" fill="#0284c7" rx="2"/>' +
                    '<polyline points="387,44 495,44" fill="none" stroke="#cbd5e1" stroke-width="1.8" stroke-dasharray="3 3"/>' +
                    '<circle cx="387" cy="44" r="4" fill="#f59e0b"/>' +
                    '<g transform="translate(495,20)"><rect x="0" y="0" width="210" height="48" rx="6" fill="#0f172a" stroke="#f59e0b" stroke-width="1.5"/>' +
                    '<text x="105" y="21" fill="#fbbf24" font-size="13.5" font-weight="800" text-anchor="middle">Đường đưa điện vào</text>' +
                    '<text x="105" y="39" fill="#cbd5e1" font-size="12" font-weight="600" text-anchor="middle">Hiệu suất máy H = 95%</text></g>' +
                    '<polyline points="322,136 226,136" fill="none" stroke="#38bdf8" stroke-width="1.8" stroke-dasharray="3 3"/>' +
                    '<circle cx="322" cy="136" r="4" fill="#38bdf8"/>' +
                    '<g transform="translate(18,108)"><rect x="0" y="0" width="208" height="54" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>' +
                    '<text x="104" y="23" fill="#38bdf8" font-size="13.5" font-weight="800" text-anchor="middle">Nhiệt độ nước đã làm nóng</text>' +
                    '<text x="104" y="42" fill="#cbd5e1" font-size="12" font-weight="600" text-anchor="middle">Rơ-le tự ngắt tại 70°C</text></g>' +
                    '<polyline points="404,202 520,202" fill="none" stroke="#38bdf8" stroke-width="1.8" stroke-dasharray="3 3"/>' +
                    '<circle cx="404" cy="202" r="4" fill="#38bdf8"/>' +
                    '<g transform="translate(520,175)"><rect x="0" y="0" width="212" height="54" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>' +
                    '<text x="106" y="23" fill="#38bdf8" font-size="13.5" font-weight="800" text-anchor="middle">Núm điều chỉnh nhiệt độ</text>' +
                    '<text x="106" y="42" fill="#cbd5e1" font-size="12" font-weight="600" text-anchor="middle">Cảm biến rơ-le nhiệt</text></g>' +
                    '<polyline points="336,348 232,348" fill="none" stroke="#ef4444" stroke-width="1.8" stroke-dasharray="3 3"/>' +
                    '<circle cx="336" cy="348" r="4" fill="#ef4444"/>' +
                    '<g transform="translate(18,320)"><rect x="0" y="0" width="214" height="54" rx="6" fill="#0f172a" stroke="#ef4444" stroke-width="1.5"/>' +
                    '<text x="107" y="23" fill="#fca5a5" font-size="13.5" font-weight="800" text-anchor="middle">Ống dẫn nước nóng ra</text>' +
                    '<text x="107" y="42" fill="#cbd5e1" font-size="12" font-weight="600" text-anchor="middle">(Đang khóa van khi đun)</text></g>' +
                    '<polyline points="424,348 520,348" fill="none" stroke="#38bdf8" stroke-width="1.8" stroke-dasharray="3 3"/>' +
                    '<circle cx="424" cy="348" r="4" fill="#38bdf8"/>' +
                    '<g transform="translate(520,320)"><rect x="0" y="0" width="212" height="54" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>' +
                    '<text x="106" y="23" fill="#7dd3fc" font-size="13.5" font-weight="800" text-anchor="middle">Ống dẫn nước lạnh vào</text>' +
                    '<text x="106" y="42" fill="#cbd5e1" font-size="12" font-weight="600" text-anchor="middle">Nhiệt độ ban đầu 18°C</text></g>' +
                    '</svg>';
                return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
                    captionHtml('fa-solid fa-temperature-high', 'Sơ đồ nguyên lý máy làm nóng nước 20 lít – 2500 W (Rơ-le tự ngắt ở 70°C)') + svg +
                    '</div></div>';
            }
        },
        'MH-C1-09': {
            id: 'MH-C1-09',
            title: 'Hệ thống tắm nóng lạnh gián tiếp và vòi hoa sen hòa trộn',
            topic: 'DS-C1.4',
            layout: 'single',
            caption: 'Hệ thống bình tắm nóng lạnh gián tiếp (15 lít) hòa trộn qua vòi hoa sen',
            alt: 'Bình nước nóng gián tiếp 15 lít ở 70°C hòa trộn với đường nước lạnh 20°C qua van trộn để phun nước 30°C tại vòi hoa sen',
            build: function (u) {
                var svg =
                    '<svg viewBox="0 0 800 400" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
                    '<defs><marker id="' + u + 'arw" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">' +
                    '<path d="M 0 1 L 9 5 L 0 9 z" fill="#38bdf8"/></marker></defs>' +
                    '<rect x="38" y="34" width="236" height="52" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="1.5"/>' +
                    '<text x="156" y="57" fill="#fbbf24" font-size="13" font-weight="800" text-anchor="middle">Cầu dao nguồn điện 2,5 kW</text>' +
                    '<text x="156" y="75" fill="#cbd5e1" font-size="12" font-weight="600" text-anchor="middle">Hiệu suất làm nóng H = 97%</text>' +
                    '<line x1="156" y1="86" x2="156" y2="112" stroke="#f59e0b" stroke-width="3" class="ambient-wire-pulse"/>' +
                    '<rect x="52" y="112" width="208" height="148" rx="16" fill="#1e293b" stroke="#64748b" stroke-width="2.5"/>' +
                    '<rect x="66" y="126" width="180" height="120" rx="10" fill="rgba(239,68,68,0.22)" stroke="#ef4444" stroke-width="1.8"/>' +
                    '<path d="M 96 226 Q 116 212 136 226 T 176 226 T 216 226" fill="none" stroke="#f97316" stroke-width="3.5"/>' +
                    '<text x="156" y="160" fill="#f8fafc" font-size="14" font-weight="800" text-anchor="middle">BÌNH CHỨA 15 LÍT</text>' +
                    '<text x="156" y="182" fill="#fca5a5" font-size="13" font-family="DM Mono,monospace" font-weight="800" text-anchor="middle">t nóng = 70°C</text>' +
                    '<text x="156" y="202" fill="#94a3b8" font-size="12" font-weight="600" text-anchor="middle">(Ban đầu đầy nước 20°C)</text>' +
                    '<polyline points="156,260 156,315 395,315" fill="none" stroke="#ef4444" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>' +
                    '<polyline points="156,260 156,315 395,315" fill="none" stroke="#fca5a5" stroke-width="2" class="ambient-ray-glide"/>' +
                    '<rect x="44" y="330" width="210" height="44" rx="6" fill="#0f172a" stroke="#ef4444" stroke-width="1.5"/>' +
                    '<text x="149" y="357" fill="#fca5a5" font-size="12.5" font-weight="800" text-anchor="middle">Dòng nước nóng 70°C ra</text>' +
                    '<line x1="395" y1="190" x2="395" y2="300" stroke="#0284c7" stroke-width="8" stroke-linecap="round"/>' +
                    '<line x1="395" y1="195" x2="395" y2="295" stroke="#7dd3fc" stroke-width="2" class="ambient-ray-glide"/>' +
                    '<rect x="305" y="132" width="180" height="54" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>' +
                    '<text x="395" y="155" fill="#7dd3fc" font-size="13" font-weight="800" text-anchor="middle">Nước lạnh hệ thống</text>' +
                    '<text x="395" y="174" fill="#cbd5e1" font-size="12.5" font-family="DM Mono,monospace" font-weight="700" text-anchor="middle">t lạnh = 20°C</text>' +
                    '<circle cx="395" cy="315" r="24" fill="#1e293b" stroke="#f59e0b" stroke-width="3"/>' +
                    '<text x="395" y="319" fill="#fbbf24" font-size="12" font-weight="800" text-anchor="middle">TRỘN</text>' +
                    '<text x="395" y="358" fill="#cbd5e1" font-size="12.5" font-weight="700" text-anchor="middle">Van hòa trộn</text>' +
                    '<polyline points="419,315 585,315 585,112 630,112" fill="none" stroke="#f59e0b" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>' +
                    '<polyline points="419,315 585,315 585,112 630,112" fill="none" stroke="#fef3c7" stroke-width="2" class="ambient-ray-glide"/>' +
                    '<rect x="442" y="255" width="130" height="44" rx="6" fill="#0f172a" stroke="#f59e0b" stroke-width="1.5"/>' +
                    '<text x="507" y="275" fill="#fbbf24" font-size="12.5" font-weight="800" text-anchor="middle">Nước pha ấm</text>' +
                    '<text x="507" y="292" fill="#e2e8f0" font-size="12" font-family="DM Mono,monospace" font-weight="700" text-anchor="middle">t = 30°C</text>' +
                    '<polygon points="622,102 688,125 676,142 612,118" fill="#94a3b8" stroke="#cbd5e1" stroke-width="2"/>' +
                    '<g class="ambient-drops">' +
                    '<line x1="624" y1="126" x2="604" y2="215" stroke="#38bdf8" stroke-width="2.2" stroke-dasharray="5 5"/>' +
                    '<line x1="640" y1="132" x2="632" y2="225" stroke="#38bdf8" stroke-width="2.2" stroke-dasharray="5 5"/>' +
                    '<line x1="656" y1="138" x2="660" y2="225" stroke="#38bdf8" stroke-width="2.2" stroke-dasharray="5 5"/>' +
                    '<line x1="672" y1="144" x2="688" y2="215" stroke="#38bdf8" stroke-width="2.2" stroke-dasharray="5 5"/>' +
                    '</g>' +
                    '<rect x="598" y="242" width="184" height="72" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>' +
                    '<text x="690" y="264" fill="#38bdf8" font-size="13" font-weight="800" text-anchor="middle">Vòi hoa sen (30°C)</text>' +
                    '<text x="690" y="284" fill="#e2e8f0" font-size="12" font-family="DM Mono,monospace" font-weight="700" text-anchor="middle">Tổng tiết diện S = 30 mm²</text>' +
                    '<text x="690" y="302" fill="#e2e8f0" font-size="12" font-family="DM Mono,monospace" font-weight="700" text-anchor="middle">Tốc độ tia v = 4 m/s</text>' +
                    '</svg>';
                return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
                    captionHtml('fa-solid fa-shower', 'Hệ thống tắm nóng lạnh gián tiếp (15 lít) hòa trộn qua vòi hoa sen') + svg +
                    '</div></div>';
            }
        },
        'MH-C1-10': {
            id: 'MH-C1-10',
            title: 'Sục điện nhôm xoắn kép 2500 W đun 10 lít nước trong xô nhựa',
            topic: 'DS-C1.4',
            layout: 'single',
            caption: 'Mô hình đun 10 lít nước bằng sục điện xoắn kép (2500 W – 220 V)',
            alt: 'Xô nhựa chứa 10 lít nước ở 20°C có đầu sục điện nhôm xoắn kép cắm trực tiếp nối phích cắm vào ổ điện 220 V',
            build: function () {
                var svg =
                    '<svg viewBox="0 0 760 390" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
                    '<line x1="40" y1="348" x2="720" y2="348" stroke="#334155" stroke-width="2.5"/>' +
                    '<polygon points="155,142 365,142 342,344 178,344" fill="#1e293b" stroke="#64748b" stroke-width="3"/>' +
                    '<polygon points="163,182 357,182 338,338 182,338" fill="rgba(14,165,233,0.34)" class="ambient-water-wave"/>' +
                    '<line x1="163" y1="182" x2="357" y2="182" stroke="#7dd3fc" stroke-width="2"/>' +
                    '<rect x="242" y="102" width="36" height="58" rx="6" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>' +
                    '<line x1="252" y1="160" x2="252" y2="215" stroke="#cbd5e1" stroke-width="5"/>' +
                    '<line x1="268" y1="160" x2="268" y2="205" stroke="#cbd5e1" stroke-width="5"/>' +
                    '<ellipse cx="260" cy="222" rx="34" ry="8" fill="none" stroke="#f97316" stroke-width="6"/>' +
                    '<ellipse cx="260" cy="242" rx="34" ry="8" fill="none" stroke="#f97316" stroke-width="6"/>' +
                    '<ellipse cx="260" cy="262" rx="34" ry="8" fill="none" stroke="#f97316" stroke-width="6"/>' +
                    '<ellipse cx="260" cy="282" rx="34" ry="8" fill="none" stroke="#ea580c" stroke-width="6"/>' +
                    '<g class="ambient-steam">' +
                    '<circle cx="232" cy="196" r="4" fill="rgba(255,255,255,0.6)"/>' +
                    '<circle cx="288" cy="210" r="3.5" fill="rgba(255,255,255,0.55)"/>' +
                    '<circle cx="255" cy="176" r="4" fill="rgba(255,255,255,0.55)"/>' +
                    '</g>' +
                    '<path d="M 260 102 C 260 40 435 40 445 145 L 445 208" fill="none" stroke="#94a3b8" stroke-width="6" stroke-linecap="round"/>' +
                    '<path d="M 260 102 C 260 40 435 40 445 145 L 445 208" fill="none" stroke="#ef4444" stroke-width="2.5" class="ambient-wire-pulse"/>' +
                    '<rect x="415" y="198" width="60" height="58" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="2.5"/>' +
                    '<circle cx="434" cy="226" r="5" fill="#94a3b8"/><circle cx="456" cy="226" r="5" fill="#94a3b8"/>' +
                    '<text x="445" y="248" fill="#fbbf24" font-size="12" font-family="DM Mono,monospace" font-weight="800" text-anchor="middle">220 V</text>' +
                    '<polyline points="294,250 515,250" fill="none" stroke="#f59e0b" stroke-width="1.8" stroke-dasharray="3 3"/>' +
                    '<circle cx="294" cy="250" r="4" fill="#f59e0b"/>' +
                    '<g transform="translate(515,222)"><rect x="0" y="0" width="225" height="58" rx="6" fill="#0f172a" stroke="#f59e0b" stroke-width="1.5"/>' +
                    '<text x="112" y="23" fill="#fbbf24" font-size="13.5" font-weight="800" text-anchor="middle">Sợi nhôm xoắn kép (Sục điện)</text>' +
                    '<text x="112" y="44" fill="#cbd5e1" font-size="12" font-family="DM Mono,monospace" font-weight="700" text-anchor="middle">2500 W – 220 V · H = 90%</text></g>' +
                    '<polyline points="475,226 515,152" fill="none" stroke="#ef4444" stroke-width="1.8" stroke-dasharray="3 3"/>' +
                    '<circle cx="475" cy="226" r="4" fill="#ef4444"/>' +
                    '<g transform="translate(515,120)"><rect x="0" y="0" width="225" height="56" rx="6" fill="#0f172a" stroke="#ef4444" stroke-width="1.5"/>' +
                    '<text x="112" y="23" fill="#fca5a5" font-size="13.5" font-weight="800" text-anchor="middle">Ổ cắm lưới điện 220 V</text>' +
                    '<text x="112" y="43" fill="#cbd5e1" font-size="12" font-weight="600" text-anchor="middle">Cấu trúc dây trần ngâm nước</text></g>' +
                    '<polyline points="175,260 142,260" fill="none" stroke="#38bdf8" stroke-width="1.8" stroke-dasharray="3 3"/>' +
                    '<circle cx="175" cy="260" r="4" fill="#38bdf8"/>' +
                    '<g transform="translate(12,232)"><rect x="0" y="0" width="132" height="56" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>' +
                    '<text x="66" y="23" fill="#38bdf8" font-size="13.5" font-weight="800" text-anchor="middle">Xô nhựa</text>' +
                    '<text x="66" y="43" fill="#cbd5e1" font-size="12" font-weight="600" text-anchor="middle">10 lít (t₀ = 20°C)</text></g>' +
                    '</svg>';
                return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
                    captionHtml('fa-solid fa-plug', 'Mô hình đun 10 lít nước bằng sục điện xoắn kép (2500 W – 220 V)') + svg +
                    '</div></div>';
            }
        },
        'MH-C1-11': {
            id: 'MH-C1-11',
            title: 'Hệ thống tản nhiệt chất lỏng cho CPU (Water Block – Bơm – Quạt két tản nhiệt)',
            topic: 'DS-C1.5',
            layout: 'single',
            caption: 'Cấu trúc hệ thống tản nhiệt chất lỏng cho CPU (Lưu lượng 0,4 lít/phút · 210 W)',
            alt: 'Hệ thống làm mát chất lỏng CPU gồm bộ làm mát áp trực tiếp CPU 210 W, hai ống dẫn chất lỏng tuần hoàn và két tản nhiệt kèm quạt thổi',
            build: function (u) {
                var svg =
                    '<svg viewBox="0 0 820 390" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
                    '<defs>' +
                    '<linearGradient id="' + u + 'block" x1="0%" y1="0%" x2="100%" y2="0%">' +
                    '<stop offset="0%" stop-color="#ef4444"/><stop offset="100%" stop-color="#0284c7"/>' +
                    '</linearGradient>' +
                    '<marker id="' + u + 'arB" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">' +
                    '<path d="M 0 1 L 9 5 L 0 9 z" fill="#38bdf8"/></marker>' +
                    '<marker id="' + u + 'arR" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">' +
                    '<path d="M 0 1 L 9 5 L 0 9 z" fill="#ef4444"/></marker>' +
                    '</defs>' +
                    '<rect x="52" y="294" width="166" height="32" rx="5" fill="#334155" stroke="#64748b" stroke-width="2"/>' +
                    '<text x="135" y="315" fill="#f8fafc" font-size="13" font-weight="800" text-anchor="middle">Đế CPU (P = 210 W)</text>' +
                    '<ellipse cx="135" cy="264" rx="56" ry="22" fill="url(#' + u + 'block)" stroke="#cbd5e1" stroke-width="2.2"/>' +
                    '<rect x="79" y="232" width="112" height="32" fill="url(#' + u + 'block)" stroke="#cbd5e1" stroke-width="2"/>' +
                    '<ellipse cx="135" cy="232" rx="56" ry="18" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>' +
                    '<path d="M 190 250 C 310 250 410 235 552 152" fill="none" stroke="#ef4444" stroke-width="11" stroke-linecap="round"/>' +
                    '<path d="M 190 250 C 310 250 410 235 552 152" fill="none" stroke="#fef2f2" stroke-width="2.2" class="ambient-ray-glide"/>' +
                    '<path d="M 548 122 C 395 202 300 220 188 228" fill="none" stroke="#0284c7" stroke-width="11" stroke-linecap="round"/>' +
                    '<path d="M 548 122 C 395 202 300 220 188 228" fill="none" stroke="#e0f2fe" stroke-width="2.2" class="ambient-ray-glide"/>' +
                    '<rect x="536" y="40" width="142" height="148" rx="10" fill="#1e293b" stroke="#64748b" stroke-width="2.5"/>' +
                    '<rect x="550" y="54" width="114" height="120" rx="6" fill="#0f172a" stroke="#334155"/>' +
                    '<line x1="550" y1="74" x2="664" y2="74" stroke="#334155" stroke-width="3"/>' +
                    '<line x1="550" y1="94" x2="664" y2="94" stroke="#334155" stroke-width="3"/>' +
                    '<line x1="550" y1="114" x2="664" y2="114" stroke="#334155" stroke-width="3"/>' +
                    '<line x1="550" y1="134" x2="664" y2="134" stroke="#334155" stroke-width="3"/>' +
                    '<line x1="550" y1="154" x2="664" y2="154" stroke="#334155" stroke-width="3"/>' +
                    '<rect x="404" y="64" width="108" height="114" rx="10" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>' +
                    '<circle cx="458" cy="121" r="42" fill="#0f172a" stroke="#64748b" stroke-width="2"/>' +
                    '<g class="ambient-fan-spin">' +
                    '<ellipse cx="458" cy="100" rx="10" ry="18" fill="#64748b"/>' +
                    '<ellipse cx="477" cy="132" rx="10" ry="18" transform="rotate(120 477 132)" fill="#64748b"/>' +
                    '<ellipse cx="439" cy="132" rx="10" ry="18" transform="rotate(240 439 132)" fill="#64748b"/>' +
                    '<circle cx="458" cy="121" r="9" fill="#cbd5e1"/>' +
                    '</g>' +
                    '<g class="ambient-heat-arrow">' +
                    '<line x1="330" y1="102" x2="394" y2="102" stroke="#38bdf8" stroke-width="3" marker-end="url(#' + u + 'arB)"/>' +
                    '<line x1="330" y1="142" x2="394" y2="142" stroke="#38bdf8" stroke-width="3" marker-end="url(#' + u + 'arB)"/>' +
                    '<line x1="690" y1="84" x2="758" y2="84" stroke="#ef4444" stroke-width="3" marker-end="url(#' + u + 'arR)"/>' +
                    '<line x1="690" y1="126" x2="758" y2="126" stroke="#ef4444" stroke-width="3" marker-end="url(#' + u + 'arR)"/>' +
                    '</g>' +
                    '<g transform="translate(40,126)"><rect x="0" y="0" width="212" height="54" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>' +
                    '<text x="106" y="23" fill="#38bdf8" font-size="13.5" font-weight="800" text-anchor="middle">Bộ làm mát CPU</text>' +
                    '<text x="106" y="42" fill="#cbd5e1" font-size="12" font-weight="600" text-anchor="middle">Hấp thụ nhiệt H = 80%</text></g>' +
                    '<polyline points="135,180 135,216" fill="none" stroke="#38bdf8" stroke-width="1.8" stroke-dasharray="3 3"/>' +
                    '<g transform="translate(274,20)"><rect x="0" y="0" width="150" height="32" rx="6" fill="#0f172a" stroke="#94a3b8" stroke-width="1.5"/>' +
                    '<text x="75" y="21" fill="#e2e8f0" font-size="13" font-weight="800" text-anchor="middle">Quạt tản nhiệt</text></g>' +
                    '<g transform="translate(528,200)"><rect x="0" y="0" width="234" height="54" rx="6" fill="#0f172a" stroke="#f59e0b" stroke-width="1.5"/>' +
                    '<text x="117" y="23" fill="#fbbf24" font-size="13" font-weight="800" text-anchor="middle">Bộ tản nhiệt (Radiator)</text>' +
                    '<text x="117" y="42" fill="#cbd5e1" font-size="12" font-family="DM Mono,monospace" font-weight="700" text-anchor="middle">Lưu lượng 0,4 lít/phút</text></g>' +
                    '<text x="726" y="160" fill="#fca5a5" font-size="12.5" font-weight="800" text-anchor="middle">Khí nóng thoát ra</text>' +
                    '<text x="355" y="166" fill="#7dd3fc" font-size="12.5" font-weight="800" text-anchor="middle">Khí mát vào</text>' +
                    '</svg>';
                return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
                    captionHtml('fa-solid fa-microchip', 'Cấu trúc hệ thống tản nhiệt chất lỏng cho CPU (0,4 lít/phút · 210 W)') + svg +
                    '</div></div>';
            }
        },
        'MH-C1-12': {
            id: 'MH-C1-12',
            title: 'Hệ thống làm mát động cơ ô tô qua két tản nhiệt và bơm tuần hoàn',
            topic: 'DS-C1.5',
            layout: 'single',
            caption: 'Sơ đồ hệ thống làm mát tuần hoàn của động cơ ô tô',
            alt: 'Hệ thống làm mát ô tô gồm động cơ bên phải, bơm tuần hoàn, khoang nước nóng 80°C, các lá tản nhiệt kèm quạt và dòng nước lạnh 30°C hồi về',
            build: function (u) {
                var svg =
                    '<svg viewBox="0 0 820 390" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
                    '<defs>' +
                    '<linearGradient id="' + u + 'pipeV" x1="0%" y1="0%" x2="0%" y2="100%">' +
                    '<stop offset="0%" stop-color="#ef4444"/><stop offset="100%" stop-color="#0284c7"/>' +
                    '</linearGradient>' +
                    '<marker id="' + u + 'arC" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">' +
                    '<path d="M 0 1 L 9 5 L 0 9 z" fill="#7dd3fc"/></marker>' +
                    '</defs>' +
                    '<rect x="148" y="34" width="60" height="18" rx="3" fill="#94a3b8"/>' +
                    '<rect x="130" y="52" width="102" height="56" rx="6" fill="#ef4444" stroke="#fca5a5" stroke-width="2"/>' +
                    '<text x="181" y="77" fill="#fff" font-size="12.5" font-weight="800" text-anchor="middle">NƯỚC NÓNG</text>' +
                    '<text x="181" y="96" fill="#fef2f2" font-size="12.5" font-family="DM Mono,monospace" font-weight="800" text-anchor="middle">80°C</text>' +
                    '<polygon points="222,68 350,118 336,154 210,104" fill="#dc2626"/>' +
                    '<polygon points="376,128 456,162 456,196 364,158" fill="#38bdf8" opacity="0.72"/>' +
                    '<rect x="156" y="108" width="46" height="184" fill="url(#' + u + 'pipeV)"/>' +
                    '<line x1="142" y1="132" x2="216" y2="132" stroke="#cbd5e1" stroke-width="4"/>' +
                    '<line x1="142" y1="160" x2="216" y2="160" stroke="#cbd5e1" stroke-width="4"/>' +
                    '<line x1="142" y1="188" x2="216" y2="188" stroke="#cbd5e1" stroke-width="4"/>' +
                    '<line x1="142" y1="216" x2="216" y2="216" stroke="#cbd5e1" stroke-width="4"/>' +
                    '<line x1="142" y1="244" x2="216" y2="244" stroke="#cbd5e1" stroke-width="4"/>' +
                    '<line x1="142" y1="272" x2="216" y2="272" stroke="#cbd5e1" stroke-width="4"/>' +
                    '<path d="M 156 292 L 456 292 L 456 326 L 156 326 Z" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>' +
                    '<text x="302" y="314" fill="#f8fafc" font-size="13" font-weight="800" text-anchor="middle">NƯỚC LẠNH (30°C · 0,22 kg/s)</text>' +
                    '<rect x="444" y="150" width="330" height="186" rx="10" fill="rgba(56,189,248,0.16)" stroke="#38bdf8" stroke-width="2.5"/>' +
                    '<rect x="476" y="196" width="48" height="106" fill="#475569" stroke="#94a3b8" stroke-width="1.5"/>' +
                    '<rect x="548" y="196" width="48" height="106" fill="#475569" stroke="#94a3b8" stroke-width="1.5"/>' +
                    '<rect x="620" y="196" width="48" height="106" fill="#475569" stroke="#94a3b8" stroke-width="1.5"/>' +
                    '<rect x="692" y="196" width="48" height="106" fill="#475569" stroke="#94a3b8" stroke-width="1.5"/>' +
                    '<g class="ambient-heat-arrow">' +
                    '<line x1="536" y1="286" x2="536" y2="218" stroke="#7dd3fc" stroke-width="3" marker-end="url(#' + u + 'arC)"/>' +
                    '<line x1="608" y1="286" x2="608" y2="218" stroke="#7dd3fc" stroke-width="3" marker-end="url(#' + u + 'arC)"/>' +
                    '<line x1="680" y1="286" x2="680" y2="218" stroke="#7dd3fc" stroke-width="3" marker-end="url(#' + u + 'arC)"/>' +
                    '</g>' +
                    '<text x="609" y="178" fill="#f8fafc" font-size="14" font-weight="800" text-anchor="middle">ĐỘNG CƠ (4 Xi-lanh)</text>' +
                    '<circle cx="364" cy="134" r="34" fill="#0f172a" stroke="#38bdf8" stroke-width="3"/>' +
                    '<g class="ambient-fan-spin">' +
                    '<line x1="344" y1="134" x2="384" y2="134" stroke="#cbd5e1" stroke-width="3.5"/>' +
                    '<line x1="364" y1="114" x2="364" y2="154" stroke="#cbd5e1" stroke-width="3.5"/>' +
                    '<circle cx="364" cy="134" r="7" fill="#38bdf8"/>' +
                    '</g>' +
                    '<text x="364" y="88" fill="#cbd5e1" font-size="13" font-weight="800" text-anchor="middle">Bơm</text>' +
                    '<g transform="translate(242,165)">' +
                    '<line x1="20" y1="36" x2="72" y2="36" stroke="#94a3b8" stroke-width="6" stroke-linecap="round"/>' +
                    '<ellipse cx="20" cy="20" rx="7" ry="18" fill="#e2e8f0" stroke="#64748b"/>' +
                    '<ellipse cx="20" cy="52" rx="7" ry="18" fill="#e2e8f0" stroke="#64748b"/>' +
                    '<circle cx="20" cy="36" r="6" fill="#38bdf8"/>' +
                    '<text x="58" y="66" fill="#e2e8f0" font-size="13" font-weight="800" text-anchor="middle">Quạt</text>' +
                    '</g>' +
                    '<g transform="translate(14,154)"><rect x="0" y="0" width="112" height="90" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>' +
                    '<text x="56" y="25" fill="#38bdf8" font-size="13" font-weight="800" text-anchor="middle">Các lá</text>' +
                    '<text x="56" y="45" fill="#38bdf8" font-size="13" font-weight="800" text-anchor="middle">tản nhiệt</text>' +
                    '<text x="56" y="66" fill="#cbd5e1" font-size="12" font-weight="600" text-anchor="middle">Khí 20,0°C</text>' +
                    '<text x="56" y="81" fill="#cbd5e1" font-size="12" font-weight="600" text-anchor="middle">1,25 kg/s</text></g>' +
                    '<line x1="126" y1="196" x2="144" y2="196" stroke="#38bdf8" stroke-width="1.8" stroke-dasharray="3 3"/>' +
                    '</svg>';
                return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
                    captionHtml('fa-solid fa-car', 'Sơ đồ hệ thống làm mát tuần hoàn của động cơ ô tô') + svg +
                    '</div></div>';
            }
        },
        'MH-C1-13': {
            id: 'MH-C1-13',
            title: 'Cấu tạo máy hút ẩm ngưng tụ (Dàn lạnh 5°C – Khay nước – Dàn nóng)',
            topic: 'DS-C1.5',
            layout: 'single',
            caption: 'Sơ đồ cấu tạo máy hút ẩm dạng ngưng tụ (Công suất làm lạnh 400 W)',
            alt: 'Sơ đồ máy hút ẩm gồm cửa hút không khí ẩm 30°C, dàn lạnh làm ngưng tụ nước chảy xuống bình chứa, dàn nóng và quạt thổi không khí khô',
            build: function (u) {
                var svg =
                    '<svg viewBox="0 0 820 400" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
                    '<defs>' +
                    '<marker id="' + u + 'arIn" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 1 L 9 5 L 0 9 z" fill="#38bdf8"/></marker>' +
                    '<marker id="' + u + 'arOut" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 1 L 9 5 L 0 9 z" fill="#f59e0b"/></marker>' +
                    '</defs>' +
                    '<rect x="218" y="44" width="350" height="318" rx="14" fill="#111827" stroke="#64748b" stroke-width="3"/>' +
                    '<g class="ambient-heat-arrow">' +
                    '<path d="M 102 140 Q 134 128 164 140 T 206 140" fill="none" stroke="#38bdf8" stroke-width="3" marker-end="url(#' + u + 'arIn)"/>' +
                    '<path d="M 102 168 Q 134 156 164 168 T 206 168" fill="none" stroke="#38bdf8" stroke-width="3" marker-end="url(#' + u + 'arIn)"/>' +
                    '</g>' +
                    '<rect x="12" y="122" width="142" height="58" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>' +
                    '<text x="83" y="146" fill="#38bdf8" font-size="13" font-weight="800" text-anchor="middle">Không khí ẩm</text>' +
                    '<text x="83" y="167" fill="#cbd5e1" font-size="12" font-family="DM Mono,monospace" font-weight="700" text-anchor="middle">20 g · 30°C (80% hơi)</text>' +
                    '<g transform="translate(262,82)">' +
                    '<rect x="-6" y="-6" width="70" height="128" rx="6" fill="rgba(56,189,248,0.14)" stroke="#38bdf8" stroke-width="2"/>' +
                    '<path d="M 10 8 H 50 V 28 H 10 V 48 H 50 V 68 H 10 V 88 H 50 V 108 H 10" fill="none" stroke="#38bdf8" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>' +
                    '</g>' +
                    '<g transform="translate(394,82)">' +
                    '<rect x="-6" y="-6" width="70" height="128" rx="6" fill="rgba(239,68,68,0.14)" stroke="#f97316" stroke-width="2"/>' +
                    '<path d="M 10 8 H 50 V 28 H 10 V 48 H 50 V 68 H 10 V 88 H 50 V 108 H 10" fill="none" stroke="#f97316" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>' +
                    '</g>' +
                    '<circle cx="514" cy="142" r="34" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>' +
                    '<g class="ambient-fan-spin">' +
                    '<ellipse cx="514" cy="124" rx="8" ry="15" fill="#94a3b8"/>' +
                    '<ellipse cx="530" cy="151" rx="8" ry="15" transform="rotate(120 530 151)" fill="#94a3b8"/>' +
                    '<ellipse cx="498" cy="151" rx="8" ry="15" transform="rotate(240 498 151)" fill="#94a3b8"/>' +
                    '<circle cx="514" cy="142" r="7" fill="#cbd5e1"/>' +
                    '</g>' +
                    '<g class="ambient-heat-arrow">' +
                    '<path d="M 578 128 Q 612 116 644 128 T 684 128" fill="none" stroke="#f59e0b" stroke-width="3" marker-end="url(#' + u + 'arOut)"/>' +
                    '<path d="M 578 158 Q 612 146 644 158 T 684 158" fill="none" stroke="#f59e0b" stroke-width="3" marker-end="url(#' + u + 'arOut)"/>' +
                    '</g>' +
                    '<rect x="652" y="114" width="154" height="56" rx="6" fill="#0f172a" stroke="#f59e0b" stroke-width="1.5"/>' +
                    '<text x="729" y="137" fill="#fbbf24" font-size="13" font-weight="800" text-anchor="middle">Không khí khô</text>' +
                    '<text x="729" y="157" fill="#cbd5e1" font-size="12" font-weight="600" text-anchor="middle">Thổi trở lại phòng</text>' +
                    '<g class="ambient-drops">' +
                    '<circle cx="282" cy="222" r="3.5" fill="#38bdf8"/><circle cx="302" cy="230" r="3.5" fill="#38bdf8"/><circle cx="322" cy="224" r="3.5" fill="#38bdf8"/>' +
                    '</g>' +
                    '<polygon points="244,242 354,242 340,260 258,260" fill="#475569" stroke="#94a3b8" stroke-width="2"/>' +
                    '<line x1="299" y1="260" x2="299" y2="278" stroke="#38bdf8" stroke-width="3"/>' +
                    '<rect x="248" y="278" width="124" height="68" rx="8" fill="rgba(14,165,233,0.22)" stroke="#38bdf8" stroke-width="2"/>' +
                    '<text x="310" y="317" fill="#7dd3fc" font-size="12.5" font-weight="800" text-anchor="middle">Bình chứa nước</text>' +
                    '<rect x="404" y="258" width="76" height="86" rx="10" fill="#334155" stroke="#94a3b8" stroke-width="2"/>' +
                    '<text x="442" y="305" fill="#f8fafc" font-size="12.5" font-weight="800" text-anchor="middle">Máy nén</text>' +
                    '<polyline points="292,190 292,228 424,228 424,258" fill="none" stroke="#38bdf8" stroke-width="2"/>' +
                    '<polyline points="422,190 422,228 456,228 456,258" fill="none" stroke="#f97316" stroke-width="2"/>' +
                    '<g transform="translate(12,32)"><rect x="0" y="0" width="176" height="54" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>' +
                    '<text x="88" y="23" fill="#38bdf8" font-size="13.5" font-weight="800" text-anchor="middle">Dàn lạnh (5°C)</text>' +
                    '<text x="88" y="42" fill="#cbd5e1" font-size="12" font-weight="600" text-anchor="middle">Làm lạnh &amp; ngưng tụ</text></g>' +
                    '<polyline points="188,60 256,102" fill="none" stroke="#38bdf8" stroke-width="1.8" stroke-dasharray="3 3"/>' +
                    '<g transform="translate(604,24)"><rect x="0" y="0" width="200" height="54" rx="6" fill="#0f172a" stroke="#f97316" stroke-width="1.5"/>' +
                    '<text x="100" y="23" fill="#fb923c" font-size="13.5" font-weight="800" text-anchor="middle">Dàn nóng &amp; Quạt</text>' +
                    '<text x="100" y="42" fill="#cbd5e1" font-size="12" font-weight="600" text-anchor="middle">Công suất lạnh 400 W</text></g>' +
                    '<polyline points="604,52 464,102" fill="none" stroke="#f97316" stroke-width="1.8" stroke-dasharray="3 3"/>' +
                    '<g transform="translate(598,274)"><rect x="0" y="0" width="206" height="54" rx="6" fill="#0f172a" stroke="#94a3b8" stroke-width="1.5"/>' +
                    '<text x="103" y="23" fill="#e2e8f0" font-size="13" font-weight="800" text-anchor="middle">Khay hứng &amp; Máy nén</text>' +
                    '<text x="103" y="42" fill="#cbd5e1" font-size="12" font-weight="600" text-anchor="middle">Hứng nước ngưng tụ</text></g>' +
                    '<polyline points="598,300 480,300" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="3 3"/>' +
                    '</svg>';
                return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
                    captionHtml('fa-solid fa-droplet', 'Sơ đồ cấu tạo máy hút ẩm dạng ngưng tụ (400 W)') + svg +
                    '</div></div>';
            }
        },
        'MH-C1-14': {
            id: 'MH-C1-14',
            title: 'Ống Cu-lít-giơ phát tia X với hệ thống nước làm nguội Anode',
            topic: 'DS-C1.5',
            layout: 'single',
            caption: 'Sơ đồ ống Cu-lít-giơ phát tia X (U_AK = 1,0·10⁴ V · I = 10 A · H = 1,0%)',
            alt: 'Ống phát tia X có sợi nung F-F phẩy, Cathode K, chùm electron bắn vào Anode A phát tia X và đường ống nước làm nguội anode từ 25°C lên 55°C',
            build: function (u) {
                var svg =
                    '<svg viewBox="0 0 820 390" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
                    '<defs>' +
                    '<marker id="' + u + 'arX" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 1 L 9 5 L 0 9 z" fill="#f59e0b"/></marker>' +
                    '<marker id="' + u + 'arW" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 1 L 9 5 L 0 9 z" fill="#38bdf8"/></marker>' +
                    '</defs>' +
                    '<path d="M 85 152 L 245 152 A 95 95 0 1 1 245 228 L 85 228 A 14 38 0 0 1 85 152 Z" fill="rgba(56,189,248,0.06)" stroke="#cbd5e1" stroke-width="2.5"/>' +
                    '<path d="M 386 152 L 620 152 A 10 38 0 0 1 620 228 L 386 228" fill="rgba(56,189,248,0.06)" stroke="#cbd5e1" stroke-width="2.5"/>' +
                    '<line x1="70" y1="68" x2="70" y2="190" stroke="#ef4444" stroke-width="2.5"/>' +
                    '<line x1="70" y1="190" x2="210" y2="190" stroke="#ef4444" stroke-width="2.5"/>' +
                    '<circle cx="70" cy="64" r="6" fill="none" stroke="#ef4444" stroke-width="2.5"/>' +
                    '<text x="90" y="70" fill="#fca5a5" font-size="18" font-weight="800">-</text>' +
                    '<text x="195" y="180" fill="#cbd5e1" font-size="14" font-weight="800">K</text>' +
                    '<path d="M 212 172 A 16 18 0 0 1 212 208" fill="none" stroke="#cbd5e1" stroke-width="3"/>' +
                    '<path d="M 230 166 Q 242 178 230 190 T 230 214" fill="none" stroke="#f97316" stroke-width="3"/>' +
                    '<line x1="230" y1="166" x2="198" y2="128" stroke="#f97316" stroke-width="2"/>' +
                    '<line x1="230" y1="214" x2="198" y2="252" stroke="#f97316" stroke-width="2"/>' +
                    '<text x="184" y="128" fill="#fb923c" font-size="14" font-weight="800">F</text>' +
                    '<text x="184" y="264" fill="#fb923c" font-size="14" font-weight="800">F′</text>' +
                    '<g class="ambient-ray-glide">' +
                    '<line x1="242" y1="178" x2="314" y2="184" stroke="#38bdf8" stroke-width="2.5" stroke-dasharray="5 5"/>' +
                    '<line x1="242" y1="190" x2="314" y2="190" stroke="#38bdf8" stroke-width="2.5" stroke-dasharray="5 5"/>' +
                    '<line x1="242" y1="202" x2="314" y2="196" stroke="#38bdf8" stroke-width="2.5" stroke-dasharray="5 5"/>' +
                    '</g>' +
                    '<polygon points="314,190 344,162 344,216 314,200" fill="#94a3b8" stroke="#f8fafc" stroke-width="2"/>' +
                    '<text x="328" y="150" fill="#f8fafc" font-size="14" font-weight="800" text-anchor="middle">A</text>' +
                    '<rect x="344" y="176" width="280" height="28" fill="#78350f" stroke="#d97706" stroke-width="2"/>' +
                    '<line x1="354" y1="184" x2="650" y2="184" stroke="#38bdf8" stroke-width="3" class="ambient-ray-glide"/>' +
                    '<line x1="354" y1="196" x2="650" y2="196" stroke="#ef4444" stroke-width="3" class="ambient-ray-glide"/>' +
                    '<line x1="560" y1="68" x2="560" y2="176" stroke="#38bdf8" stroke-width="2.5"/>' +
                    '<circle cx="560" cy="64" r="6" fill="none" stroke="#38bdf8" stroke-width="2.5"/>' +
                    '<text x="536" y="70" fill="#7dd3fc" font-size="18" font-weight="800">+</text>' +
                    '<text x="315" y="42" fill="#e2e8f0" font-size="13" font-family="DM Mono,monospace" font-weight="800" text-anchor="middle">U_AK = 1,0·10⁴ V · I = 10 A</text>' +
                    '<g class="ambient-heat-arrow">' +
                    '<line x1="322" y1="210" x2="242" y2="316" stroke="#f59e0b" stroke-width="2.5" marker-end="url(#' + u + 'arX)"/>' +
                    '<line x1="328" y1="212" x2="288" y2="322" stroke="#f59e0b" stroke-width="2.5" marker-end="url(#' + u + 'arX)"/>' +
                    '<line x1="334" y1="212" x2="344" y2="322" stroke="#f59e0b" stroke-width="2.5" marker-end="url(#' + u + 'arX)"/>' +
                    '<line x1="340" y1="210" x2="394" y2="316" stroke="#f59e0b" stroke-width="2.5" marker-end="url(#' + u + 'arX)"/>' +
                    '</g>' +
                    '<text x="320" y="348" fill="#fbbf24" font-size="14" font-weight="800" text-anchor="middle">Tia X (Hiệu suất 1,0%)</text>' +
                    '<g transform="translate(598,242)"><rect x="0" y="0" width="208" height="72" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>' +
                    '<text x="104" y="23" fill="#38bdf8" font-size="13.5" font-weight="800" text-anchor="middle">Nước làm nguội Anode</text>' +
                    '<text x="104" y="44" fill="#7dd3fc" font-size="12" font-family="DM Mono,monospace" font-weight="700" text-anchor="middle">Vào: 25°C → Ra: 55°C</text>' +
                    '<text x="104" y="62" fill="#cbd5e1" font-size="12" font-weight="600" text-anchor="middle">Hấp thụ 99% nhiệt lượng</text></g>' +
                    '<polyline points="635,190 670,190 670,242" fill="none" stroke="#38bdf8" stroke-width="2.2" marker-end="url(#' + u + 'arW)"/>' +
                    '</svg>';
                return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
                    captionHtml('fa-solid fa-radiation', 'Ống phát tia X Cu-lít-giơ với hệ thống nước làm nguội Anode') + svg +
                    '</div></div>';
            }
        },
        'MH-C1-15': {
            id: 'MH-C1-15',
            title: 'Quạt hơi nước làm mát không khí phòng nhờ bay hơi trên tấm làm mát',
            topic: 'DS-C1.5',
            layout: 'single',
            caption: 'Nguyên lý làm mát bằng bay hơi nước của quạt hơi nước (L = 2,25·10⁶ J/kg)',
            alt: 'Quạt hơi nước gồm bể chứa nước trên nhỏ giọt làm ướt tấm làm mát, không khí nóng đi qua thu nhiệt bay hơi rồi được quạt thổi thành không khí mát',
            build: function (u) {
                var svg =
                    '<svg viewBox="0 0 800 390" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
                    '<defs>' +
                    '<marker id="' + u + 'arHot" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 1 L 9 5 L 0 9 z" fill="#ef4444"/></marker>' +
                    '<marker id="' + u + 'arCool" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 1 L 9 5 L 0 9 z" fill="#38bdf8"/></marker>' +
                    '</defs>' +
                    '<polygon points="236,36 376,36 356,64 256,64" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>' +
                    '<rect x="262" y="42" width="88" height="16" fill="#0284c7" rx="2"/>' +
                    '<text x="306" y="25" fill="#7dd3fc" font-size="13" font-weight="800" text-anchor="middle">Bể chứa nước (cấp ẩm)</text>' +
                    '<g class="ambient-drops">' +
                    '<circle cx="272" cy="78" r="3" fill="#38bdf8"/><circle cx="295" cy="84" r="3" fill="#38bdf8"/><circle cx="318" cy="78" r="3" fill="#38bdf8"/><circle cx="340" cy="84" r="3" fill="#38bdf8"/>' +
                    '</g>' +
                    '<rect x="256" y="96" width="100" height="186" rx="6" fill="#7c2d12" stroke="#d97706" stroke-width="2.5"/>' +
                    '<line x1="274" y1="96" x2="274" y2="282" stroke="#b45309" stroke-width="2" stroke-dasharray="4 4"/>' +
                    '<line x1="296" y1="96" x2="296" y2="282" stroke="#b45309" stroke-width="2" stroke-dasharray="4 4"/>' +
                    '<line x1="318" y1="96" x2="318" y2="282" stroke="#b45309" stroke-width="2" stroke-dasharray="4 4"/>' +
                    '<line x1="340" y1="96" x2="340" y2="282" stroke="#b45309" stroke-width="2" stroke-dasharray="4 4"/>' +
                    '<text x="306" y="302" fill="#fbbf24" font-size="13" font-weight="800" text-anchor="middle">Tấm làm mát ướt</text>' +
                    '<g class="ambient-drops">' +
                    '<circle cx="280" cy="290" r="3" fill="#38bdf8"/><circle cx="310" cy="296" r="3" fill="#38bdf8"/><circle cx="336" cy="290" r="3" fill="#38bdf8"/>' +
                    '</g>' +
                    '<polygon points="244,316 368,316 356,348 256,348" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>' +
                    '<rect x="262" y="324" width="88" height="16" fill="#0284c7" rx="2"/>' +
                    '<text x="306" y="368" fill="#cbd5e1" font-size="12.5" font-weight="700" text-anchor="middle">Bể thu hồi nước</text>' +
                    '<g class="ambient-heat-arrow">' +
                    '<line x1="158" y1="168" x2="244" y2="168" stroke="#ef4444" stroke-width="4" marker-end="url(#' + u + 'arHot)"/>' +
                    '<line x1="158" y1="208" x2="244" y2="208" stroke="#ef4444" stroke-width="4" marker-end="url(#' + u + 'arHot)"/>' +
                    '</g>' +
                    '<rect x="14" y="150" width="138" height="74" rx="6" fill="#0f172a" stroke="#ef4444" stroke-width="1.5"/>' +
                    '<text x="83" y="176" fill="#fca5a5" font-size="13.5" font-weight="800" text-anchor="middle">Không khí nóng</text>' +
                    '<text x="83" y="198" fill="#cbd5e1" font-size="12" font-family="DM Mono,monospace" font-weight="700" text-anchor="middle">Phòng 4×5×4 m</text>' +
                    '<text x="83" y="214" fill="#cbd5e1" font-size="12" font-weight="600" text-anchor="middle">(Bay hơi 0,5 g/s)</text>' +
                    '<line x1="366" y1="188" x2="438" y2="188" stroke="#38bdf8" stroke-width="4" marker-end="url(#' + u + 'arCool)"/>' +
                    '<rect x="448" y="114" width="128" height="148" rx="12" fill="#1e293b" stroke="#64748b" stroke-width="2.5"/>' +
                    '<circle cx="512" cy="188" r="52" fill="#0f172a" stroke="#475569" stroke-width="2"/>' +
                    '<g class="ambient-fan-spin">' +
                    '<ellipse cx="512" cy="160" rx="11" ry="22" fill="#94a3b8"/>' +
                    '<ellipse cx="536" cy="202" rx="11" ry="22" transform="rotate(120 536 202)" fill="#94a3b8"/>' +
                    '<ellipse cx="488" cy="202" rx="11" ry="22" transform="rotate(240 488 202)" fill="#94a3b8"/>' +
                    '<circle cx="512" cy="188" r="10" fill="#cbd5e1"/>' +
                    '</g>' +
                    '<text x="512" y="284" fill="#e2e8f0" font-size="13" font-weight="800" text-anchor="middle">Quạt hút &amp; thổi gió</text>' +
                    '<g class="ambient-heat-arrow">' +
                    '<path d="M 592 172 Q 628 148 660 138" fill="none" stroke="#38bdf8" stroke-width="3.5" marker-end="url(#' + u + 'arCool)"/>' +
                    '<line x1="592" y1="188" x2="672" y2="188" stroke="#38bdf8" stroke-width="4" marker-end="url(#' + u + 'arCool)"/>' +
                    '<path d="M 592 204 Q 628 228 660 238" fill="none" stroke="#38bdf8" stroke-width="3.5" marker-end="url(#' + u + 'arCool)"/>' +
                    '</g>' +
                    '<rect x="652" y="64" width="136" height="58" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>' +
                    '<text x="720" y="88" fill="#38bdf8" font-size="13.5" font-weight="800" text-anchor="middle">Không khí mát</text>' +
                    '<text x="720" y="109" fill="#cbd5e1" font-size="12" font-weight="600" text-anchor="middle">Thổi ra làm mát phòng</text>' +
                    '</svg>';
                return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
                    captionHtml('fa-solid fa-wind', 'Nguyên lý làm mát bằng bay hơi nước của quạt hơi nước') + svg +
                    '</div></div>';
            }
        },
        'MH-C1-18': {
            id: 'MH-C1-18',
            title: 'Quy trình nấu chảy đồng bằng than đá & đúc chuông đồng làng Trà Đông',
            topic: 'DS-C1.4',
            layout: 'single',
            caption: 'Quy trình nấu chảy đồng (20 kg · 1084°C) và đúc chuông đồng Trà Đông',
            alt: 'Mô hình đúc chuông đồng 20 kg gồm lò nấu đồng bằng than đá có ống khói, nồi rót đồng nóng chảy vào khuôn chuông và sơ đồ 6 bước đúc đồng',
            build: function () {
                var svg =
                    '<svg viewBox="0 0 800 390" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
                    '<rect x="44" y="130" width="186" height="148" rx="10" fill="#1e293b" stroke="#64748b" stroke-width="2.5"/>' +
                    '<rect x="190" y="48" width="26" height="82" fill="#334155" stroke="#64748b" stroke-width="2"/>' +
                    '<g class="ambient-steam">' +
                    '<circle cx="203" cy="34" r="9" fill="rgba(148,163,184,0.45)"/>' +
                    '<circle cx="216" cy="20" r="12" fill="rgba(148,163,184,0.35)"/>' +
                    '</g>' +
                    '<text x="234" y="40" fill="#cbd5e1" font-size="12" font-weight="700">Ống khói than đá (q = 27 MJ/kg)</text>' +
                    '<path d="M 88 214 L 186 214 L 172 260 L 102 260 Z" fill="#f97316" stroke="#fbbf24" stroke-width="2"/>' +
                    '<text x="137" y="242" fill="#0f172a" font-size="12.5" font-weight="800" text-anchor="middle">Đồng 1084°C</text>' +
                    '<ellipse cx="137" cy="186" rx="44" ry="14" fill="#ef4444" opacity="0.45" class="ambient-heat-arrow"/>' +
                    '<text x="137" y="160" fill="#fbbf24" font-size="13" font-weight="800" text-anchor="middle">Lò nấu đồng (31°C → 1084°C)</text>' +
                    '<g transform="translate(324,84)">' +
                    '<path d="M 38 14 L 98 14 L 84 68 L 50 68 Z" fill="#475569" stroke="#cbd5e1" stroke-width="2" transform="rotate(-22 68 41)"/>' +
                    '<path d="M 92 44 Q 108 78 106 118" fill="none" stroke="#f59e0b" stroke-width="8" stroke-linecap="round" class="ambient-heat-arrow"/>' +
                    '<rect x="26" y="114" width="160" height="84" rx="8" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>' +
                    '<path d="M 62 190 L 76 142 C 82 128 130 128 136 142 L 150 190 Z" fill="#f97316" stroke="#fbbf24" stroke-width="2"/>' +
                    '<text x="106" y="175" fill="#0f172a" font-size="12.5" font-weight="800" text-anchor="middle">Chuông đồng</text>' +
                    '</g>' +
                    '<text x="430" y="74" fill="#fbbf24" font-size="13.5" font-weight="800" text-anchor="middle">Rót đồng nóng chảy vào khuôn (20 kg · Hao phí 40%)</text>' +
                    '<g transform="translate(556,118)"><rect x="0" y="0" width="228" height="156" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>' +
                    '<text x="114" y="24" fill="#38bdf8" font-size="13" font-weight="800" text-anchor="middle">Thông số nhiệt học đồng</text>' +
                    '<text x="14" y="52" fill="#e2e8f0" font-size="12.5" font-family="DM Mono,monospace">• Khối lượng m = 20 kg</text>' +
                    '<text x="14" y="76" fill="#e2e8f0" font-size="12.5" font-family="DM Mono,monospace">• Ban đầu t₀ = 31°C</text>' +
                    '<text x="14" y="100" fill="#e2e8f0" font-size="12.5" font-family="DM Mono,monospace">• Nóng chảy t_nc = 1084°C</text>' +
                    '<text x="14" y="124" fill="#e2e8f0" font-size="12.5" font-family="DM Mono,monospace">• c = 380 J/(kg·K)</text>' +
                    '<text x="14" y="146" fill="#e2e8f0" font-size="12.5" font-family="DM Mono,monospace">• λ = 180 kJ/kg</text>' +
                    '</g>' +
                    '<g transform="translate(24,308)">' +
                    '<rect x="0" y="0" width="116" height="54" rx="6" fill="#0f172a" stroke="#475569"/><text x="58" y="22" fill="#38bdf8" font-size="12.5" font-weight="800" text-anchor="middle">Bước 1</text><text x="58" y="41" fill="#e2e8f0" font-size="12" text-anchor="middle">Tạo mẫu</text>' +
                    '<rect x="128" y="0" width="116" height="54" rx="6" fill="#0f172a" stroke="#475569"/><text x="186" y="22" fill="#38bdf8" font-size="12.5" font-weight="800" text-anchor="middle">Bước 2</text><text x="186" y="41" fill="#e2e8f0" font-size="12" text-anchor="middle">Tạo khuôn</text>' +
                    '<rect x="256" y="0" width="116" height="54" rx="6" fill="#0f172a" stroke="#f59e0b"/><text x="314" y="22" fill="#fbbf24" font-size="12.5" font-weight="800" text-anchor="middle">Bước 3</text><text x="314" y="41" fill="#e2e8f0" font-size="12" text-anchor="middle">Nấu chảy đồng</text>' +
                    '<rect x="384" y="0" width="116" height="54" rx="6" fill="#0f172a" stroke="#475569"/><text x="442" y="22" fill="#38bdf8" font-size="12.5" font-weight="800" text-anchor="middle">Bước 4</text><text x="442" y="41" fill="#e2e8f0" font-size="12" text-anchor="middle">Rót khuôn</text>' +
                    '<rect x="512" y="0" width="126" height="54" rx="6" fill="#0f172a" stroke="#475569"/><text x="575" y="22" fill="#38bdf8" font-size="12.5" font-weight="800" text-anchor="middle">Bước 5</text><text x="575" y="41" fill="#e2e8f0" font-size="12" text-anchor="middle">Làm nguội, tách</text>' +
                    '<rect x="650" y="0" width="114" height="54" rx="6" fill="#0f172a" stroke="#475569"/><text x="707" y="22" fill="#38bdf8" font-size="12.5" font-weight="800" text-anchor="middle">Bước 6</text><text x="707" y="41" fill="#e2e8f0" font-size="12" text-anchor="middle">Hoàn thiện</text>' +
                    '</g>' +
                    '</svg>';
                return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
                    captionHtml('fa-solid fa-fire-burner', 'Quy trình nấu chảy đồng (20 kg · 1084°C) và đúc chuông đồng Trà Đông') + svg +
                    '</div></div>';
            }
        },
        'MH-C1-19': {
            id: 'MH-C1-19',
            title: 'Thùng xốp cách nhiệt làm lạnh 24 lon bia (330 mL) cùng đá lạnh (-5°C)',
            topic: 'DS-C1.1',
            layout: 'single',
            caption: 'Mô hình cân bằng nhiệt trong thùng xốp cách nhiệt ướp đá làm lạnh bia',
            alt: 'Mặt cắt thùng xốp cách nhiệt chứa các lon bia vỏ nhôm (35°C) ngâm cùng các viên nước đá lạnh (-5°C) và mũi tên truyền nhiệt từ bia sang đá',
            build: function (u) {
                var svg =
                    '<svg viewBox="0 0 800 390" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
                    '<defs><marker id="' + u + 'arHeat" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 1 L 9 5 L 0 9 z" fill="#f59e0b"/></marker></defs>' +
                    '<rect x="92" y="42" width="440" height="22" rx="6" fill="#cbd5e1" stroke="#64748b" stroke-width="2"/>' +
                    '<text x="312" y="57" fill="#0f172a" font-size="12" font-weight="800" text-anchor="middle">NẮP THÙNG XỐP CÁCH NHIỆT</text>' +
                    '<rect x="92" y="72" width="440" height="252" rx="14" fill="#334155" stroke="#94a3b8" stroke-width="3"/>' +
                    '<rect x="114" y="90" width="396" height="216" rx="8" fill="#0f172a" stroke="#475569" stroke-width="2"/>' +
                    '<rect x="116" y="138" width="392" height="166" rx="6" fill="rgba(14,165,233,0.22)" class="ambient-water-wave"/>' +
                    '<g transform="translate(136,154)">' +
                    '<rect x="0" y="0" width="56" height="114" rx="8" fill="#1e3a8a" stroke="#94a3b8" stroke-width="2"/>' +
                    '<rect x="0" y="34" width="56" height="44" fill="#f59e0b" opacity="0.88"/>' +
                    '<text x="28" y="61" fill="#0f172a" font-size="13" font-weight="800" text-anchor="middle">330mL</text>' +
                    '</g>' +
                    '<g transform="translate(212,154)">' +
                    '<rect x="0" y="0" width="56" height="114" rx="8" fill="#1e3a8a" stroke="#94a3b8" stroke-width="2"/>' +
                    '<rect x="0" y="34" width="56" height="44" fill="#f59e0b" opacity="0.88"/>' +
                    '<text x="28" y="61" fill="#0f172a" font-size="13" font-weight="800" text-anchor="middle">330mL</text>' +
                    '</g>' +
                    '<g transform="translate(288,154)">' +
                    '<rect x="0" y="0" width="56" height="114" rx="8" fill="#1e3a8a" stroke="#94a3b8" stroke-width="2"/>' +
                    '<rect x="0" y="34" width="56" height="44" fill="#f59e0b" opacity="0.88"/>' +
                    '<text x="28" y="61" fill="#0f172a" font-size="13" font-weight="800" text-anchor="middle">330mL</text>' +
                    '</g>' +
                    '<g class="ambient-ice-bob">' +
                    '<rect x="374" y="142" width="44" height="40" rx="6" fill="rgba(255,255,255,0.84)" stroke="#38bdf8" stroke-width="2"/>' +
                    '<rect x="428" y="162" width="42" height="38" rx="6" fill="rgba(255,255,255,0.8)" stroke="#38bdf8" stroke-width="2"/>' +
                    '<rect x="384" y="206" width="46" height="40" rx="6" fill="rgba(255,255,255,0.78)" stroke="#38bdf8" stroke-width="2"/>' +
                    '<rect x="440" y="218" width="40" height="36" rx="6" fill="rgba(255,255,255,0.74)" stroke="#38bdf8" stroke-width="2"/>' +
                    '</g>' +
                    '<g class="ambient-heat-arrow">' +
                    '<line x1="346" y1="184" x2="378" y2="174" stroke="#f59e0b" stroke-width="2.5" marker-end="url(#' + u + 'arHeat)"/>' +
                    '<line x1="346" y1="224" x2="380" y2="224" stroke="#f59e0b" stroke-width="2.5" marker-end="url(#' + u + 'arHeat)"/>' +
                    '</g>' +
                    '<g transform="translate(556,74)"><rect x="0" y="0" width="228" height="248" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>' +
                    '<text x="114" y="26" fill="#38bdf8" font-size="13.5" font-weight="800" text-anchor="middle">Thành phần trao đổi nhiệt</text>' +
                    '<text x="14" y="56" fill="#fbbf24" font-size="12.5" font-weight="800">1. Két bia (24 lon · 35°C):</text>' +
                    '<text x="20" y="76" fill="#e2e8f0" font-size="12" font-family="DM Mono,monospace">• Bia: 330 mL (c = 4100)</text>' +
                    '<text x="20" y="96" fill="#e2e8f0" font-size="12" font-family="DM Mono,monospace">• Vỏ nhôm: 14 g (c = 880)</text>' +
                    '<text x="14" y="132" fill="#7dd3fc" font-size="12.5" font-weight="800">2. Nước đá (-5°C):</text>' +
                    '<text x="20" y="152" fill="#e2e8f0" font-size="12" font-family="DM Mono,monospace">• c_đá = 1800 J/(kg·K)</text>' +
                    '<text x="20" y="172" fill="#e2e8f0" font-size="12" font-family="DM Mono,monospace">• λ = 3,34·10⁵ J/kg</text>' +
                    '<text x="14" y="206" fill="#6ee7b7" font-size="12.5" font-weight="800">3. Nước rót ngập (nếu thêm):</text>' +
                    '<text x="20" y="226" fill="#e2e8f0" font-size="12" font-family="DM Mono,monospace">• 3 lít (30°C), c = 4200</text>' +
                    '</g>' +
                    '<text x="312" y="352" fill="#94a3b8" font-size="12.5" font-weight="700" text-anchor="middle">Truyền nhiệt nội hệ (bỏ qua thất thoát ra môi trường)</text>' +
                    '</svg>';
                return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
                    captionHtml('fa-solid fa-snowflake', 'Mô hình cân bằng nhiệt trong thùng cách nhiệt làm lạnh bia') + svg +
                    '</div></div>';
            }
        },
        'MH-C1-21': {
            id: 'MH-C1-21',
            title: 'Động cơ xăng đốt trong 4 kỳ (Cấu tạo xi-lanh và 4 hành trình)',
            topic: 'DS-C1.6',
            layout: 'single',
            caption: 'Cấu tạo xi-lanh và chu trình 4 hành trình của động cơ xăng 4 kỳ',
            alt: 'Mặt cắt động cơ đốt trong gồm van nạp, van xả, bugi, piston, thanh truyền, trục khuỷu và sơ đồ 4 hành trình Nạp, Nén, Nổ, Xả',
            build: function () {
                var svg =
                    '<svg viewBox="0 0 860 390" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
                    '<rect x="34" y="42" width="236" height="312" rx="14" fill="#1e293b" stroke="#64748b" stroke-width="2.5"/>' +
                    '<path d="M 34 86 H 78 V 116 H 34" fill="#0f172a" stroke="#64748b" stroke-width="2"/>' +
                    '<path d="M 270 86 H 226 V 116 H 270" fill="#0f172a" stroke="#64748b" stroke-width="2"/>' +
                    '<rect x="78" y="116" width="148" height="148" fill="#0b1120" stroke="#475569" stroke-width="2"/>' +
                    '<line x1="112" y1="64" x2="118" y2="118" stroke="#cbd5e1" stroke-width="5"/>' +
                    '<polygon points="104,118 132,118 118,125" fill="#cbd5e1"/>' +
                    '<line x1="192" y1="64" x2="186" y2="118" stroke="#cbd5e1" stroke-width="5"/>' +
                    '<polygon points="172,118 200,118 186,125" fill="#cbd5e1"/>' +
                    '<rect x="148" y="64" width="8" height="44" fill="#94a3b8"/>' +
                    '<polygon points="146,112 152,124 158,112" fill="#f59e0b" class="ambient-heat-arrow"/>' +
                    '<text x="152" y="54" fill="#fbbf24" font-size="12" font-weight="800" text-anchor="middle">Bugi đánh lửa</text>' +
                    '<g class="ambient-piston">' +
                    '<rect x="82" y="148" width="140" height="46" rx="4" fill="#94a3b8" stroke="#e2e8f0" stroke-width="2"/>' +
                    '<circle cx="152" cy="172" r="9" fill="#0f172a" stroke="#cbd5e1" stroke-width="2"/>' +
                    '<line x1="152" y1="181" x2="152" y2="278" stroke="#64748b" stroke-width="11" stroke-linecap="round"/>' +
                    '</g>' +
                    '<circle cx="152" cy="304" r="34" fill="#334155" stroke="#94a3b8" stroke-width="2.5"/>' +
                    '<circle cx="152" cy="278" r="9" fill="#cbd5e1"/>' +
                    '<text x="64" y="76" fill="#38bdf8" font-size="12" font-weight="800">Van nạp</text>' +
                    '<text x="242" y="76" fill="#fca5a5" font-size="12" font-weight="800" text-anchor="end">Van xả</text>' +
                    '<text x="152" y="372" fill="#cbd5e1" font-size="12.5" font-weight="800" text-anchor="middle">Mặt cắt xi-lanh – Piston – Trục khuỷu</text>' +
                    '<g transform="translate(300,32)">' +
                    '<rect x="0" y="0" width="255" height="148" rx="10" fill="#0f172a" stroke="#38bdf8" stroke-width="1.8"/>' +
                    '<text x="127" y="26" fill="#38bdf8" font-size="14" font-weight="800" text-anchor="middle">1. Hành trình NẠP</text>' +
                    '<text x="16" y="56" fill="#e2e8f0" font-size="12.5">• Van nạp mở, van xả đóng</text>' +
                    '<text x="16" y="82" fill="#e2e8f0" font-size="12.5">• Piston đi xuống ↓</text>' +
                    '<text x="16" y="108" fill="#cbd5e1" font-size="12.5">• Hút hòa khí xăng + không khí</text>' +
                    '<text x="16" y="132" fill="#7dd3fc" font-size="12" font-weight="700">Thể tích khí trong xi-lanh tăng</text>' +
                    '</g>' +
                    '<g transform="translate(575,32)">' +
                    '<rect x="0" y="0" width="255" height="148" rx="10" fill="#0f172a" stroke="#f59e0b" stroke-width="1.8"/>' +
                    '<text x="127" y="26" fill="#fbbf24" font-size="14" font-weight="800" text-anchor="middle">2. Hành trình NÉN</text>' +
                    '<text x="16" y="56" fill="#e2e8f0" font-size="12.5">• Cả hai van đều đóng</text>' +
                    '<text x="16" y="82" fill="#e2e8f0" font-size="12.5">• Piston đi lên ↑</text>' +
                    '<text x="16" y="108" fill="#cbd5e1" font-size="12.5">• Nén hỗn hợp, cuối kỳ bugi</text>' +
                    '<text x="16" y="132" fill="#fde68a" font-size="12" font-weight="700">đánh tia lửa điện đốt cháy</text>' +
                    '</g>' +
                    '<g transform="translate(300,204)">' +
                    '<rect x="0" y="0" width="255" height="150" rx="10" fill="#0f172a" stroke="#ef4444" stroke-width="1.8"/>' +
                    '<text x="127" y="26" fill="#fca5a5" font-size="14" font-weight="800" text-anchor="middle">3. Hành trình NỔ</text>' +
                    '<text x="16" y="56" fill="#e2e8f0" font-size="12.5">• Cả hai van đều đóng</text>' +
                    '<text x="16" y="82" fill="#e2e8f0" font-size="12.5">• Khí cháy giãn đẩy piston ↓</text>' +
                    '<text x="16" y="108" fill="#cbd5e1" font-size="12.5">• Làm quay trục khuỷu động cơ</text>' +
                    '<text x="16" y="132" fill="#fca5a5" font-size="12" font-weight="700">q = 44,8 MJ/kg · H = 30%</text>' +
                    '</g>' +
                    '<g transform="translate(575,204)">' +
                    '<rect x="0" y="0" width="255" height="150" rx="10" fill="#0f172a" stroke="#94a3b8" stroke-width="1.8"/>' +
                    '<text x="127" y="26" fill="#e2e8f0" font-size="14" font-weight="800" text-anchor="middle">4. Hành trình XẢ</text>' +
                    '<text x="16" y="56" fill="#e2e8f0" font-size="12.5">• Van xả mở, van nạp đóng</text>' +
                    '<text x="16" y="82" fill="#e2e8f0" font-size="12.5">• Piston đi lên ↑</text>' +
                    '<text x="16" y="108" fill="#cbd5e1" font-size="12.5">• Đẩy khí thải ra ngoài ống xả</text>' +
                    '<text x="16" y="132" fill="#cbd5e1" font-size="12" font-weight="700">Kết thúc 1 chu trình 4 kỳ</text>' +
                    '</g>' +
                    '</svg>';
                return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
                    captionHtml('fa-solid fa-gears', 'Cấu tạo xi-lanh và chu trình 4 hành trình của động cơ xăng 4 kỳ') + svg +
                    '</div></div>';
            }
        }
    };

    function has(id) {
        return typeof id === 'string' && Object.prototype.hasOwnProperty.call(MODELS, id);
    }

    function get(id) {
        if (!has(id)) return null;
        var m = MODELS[id];
        return {
            id: m.id,
            title: m.title,
            topic: m.topic,
            layout: m.layout,
            caption: m.caption,
            caption2: m.caption2 || '',
            alt: m.alt
        };
    }

    function listIds() {
        return Object.keys(MODELS);
    }

    function withStandaloneSvgFont(svgStr, includeStyleBlock) {
        if (!svgStr) return svgStr;
        var out = svgStr.replace(/<svg\b([^>]*)>/g, function (full, attrs) {
            var nextAttrs = /font-family=/i.test(attrs)
                ? attrs
                : attrs + ' font-family="\'Plus Jakarta Sans\', \'Segoe UI\', Arial, sans-serif"';
            if (includeStyleBlock) {
                return '<svg' + nextAttrs + '><style type="text/css">text,tspan{font-family:\'Plus Jakarta Sans\',\'Segoe UI\',Arial,sans-serif;}</style>';
            }
            return '<svg' + nextAttrs + '>';
        });
        return out;
    }

    function render(id, opts) {
        ensureStyles();
        if (!has(id)) {
            return '<div class="vlxt-model-error">Không tìm thấy mô hình trực quan: <code>' + escapeHtml(id) + '</code></div>';
        }
        var m = MODELS[id];
        var html = withStandaloneSvgFont(m.build(nextUid(), opts || {}), false);
        if (opts && opts.compact) {
            html = html.replace('class="vlxt-visual-container centered"', 'class="vlxt-visual-container centered compact"')
                       .replace('class="vlxt-visual-container"', 'class="vlxt-visual-container compact"');
        }
        return html;
    }

    function getSvgString(id, opts) {
        if (!has(id)) return '';
        var html = MODELS[id].build(nextUid(), opts || {});
        var matches = html.match(/<svg[\s\S]*?<\/svg>/g);
        if (!matches || !matches.length) return '';
        matches = matches.map(function (s) { return withStandaloneSvgFont(s, true); });
        if (opts && opts.all) return matches;
        return matches[0];
    }

    function mountAll(rootEl, opts) {
        ensureStyles();
        var root = rootEl || (typeof document !== 'undefined' ? document : null);
        if (!root || !root.querySelectorAll) return 0;
        var slots = root.querySelectorAll('.vlxt-model-slot[data-model-id]');
        var mounted = 0;
        for (var i = 0; i < slots.length; i++) {
            var slot = slots[i];
            var mid = slot.getAttribute('data-model-id');
            if (!mid) continue;
            var prev = slot.getAttribute('data-vlxt-mounted');
            if (prev === mid && slot.querySelector('svg')) continue;
            slot.innerHTML = render(mid, opts);
            slot.setAttribute('data-vlxt-mounted', mid);
            mounted += 1;
        }
        return mounted;
    }

    var api = {
        version: VERSION,
        has: has,
        get: get,
        listIds: listIds,
        render: render,
        getSvgString: getSvgString,
        mountAll: mountAll,
        ensureStyles: ensureStyles
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api;
    }
    global.VLXTModels = api;
})(typeof window !== 'undefined' ? window : globalThis);
