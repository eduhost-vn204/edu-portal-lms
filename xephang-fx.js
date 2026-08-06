/* ═══════════════════════════════════════════════════════════
   XẾP HẠNG + HIỆU ỨNG — Vật Lý Xuân Trường  v1.0
   Nguồn DUY NHẤT cho thang bậc xếp hạng (VLXT_RANKS) + các hiệu
   ứng dùng chung: cộng điểm bay lên, lên hạng ăn mừng, ngọn lửa
   chuỗi ngày (càng chuỗi dài lửa càng "cháy" to hơn).
   Không phụ thuộc file nào khác — include ở <head>, TRƯỚC các
   script dùng tới (hoso.html, baihoc.html, dua-top.html, nhiem-vu.js).
═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  // Bậc lớn — GIỮ NGUYÊN mốc LP cũ (đã dùng từ trước) để không xáo trộn
  // hạng học sinh đang có sẵn. "Chia nhỏ hơn nữa" làm bằng subRank() bên dưới
  // (mỗi bậc lớn chia thành III → II → I).
  var RANKS = [
    { name: '🔩 Sắt',      min: 0,    cls: 'rank-iron',    color: '#475569' },
    { name: '🥉 Đồng',     min: 50,   cls: 'rank-bronze',  color: '#92400e' },
    { name: '🥈 Bạc',      min: 150,  cls: 'rank-silver',  color: '#334155' },
    { name: '🥇 Vàng',     min: 300,  cls: 'rank-gold',    color: '#b45309' },
    { name: '💎 Bạch Kim', min: 600,  cls: 'rank-plat',    color: '#065f46' },
    { name: '👑 Kim Cương', min: 1000, cls: 'rank-diamond', color: '#5b21b6' }
  ];

  function getRank(lp) {
    var r = RANKS[0];
    for (var i = 0; i < RANKS.length; i++) { if (lp >= RANKS[i].min) r = RANKS[i]; }
    return r;
  }
  function nextRank(lp) {
    for (var i = 0; i < RANKS.length; i++) { if (RANKS[i].min > lp) return RANKS[i]; }
    return null; // đã ở bậc cao nhất
  }
  // Chia mỗi bậc lớn thành 3 bậc phụ: III (mới vào bậc) → II → I (sắp lên bậc kế).
  // Bậc cao nhất (Kim Cương) không có "bậc sau" để chia mốc nên bỏ qua.
  function subRank(lp) {
    var idx = 0;
    for (var i = 0; i < RANKS.length; i++) { if (lp >= RANKS[i].min) idx = i; }
    var next = RANKS[idx + 1];
    if (!next) return '';
    var range = next.min - RANKS[idx].min;
    var pos = Math.max(0, lp - RANKS[idx].min);
    var third = range / 3;
    if (pos < third) return 'III';
    if (pos < third * 2) return 'II';
    return 'I';
  }

  function injectCSS() {
    if (document.getElementById('vlxt-fx-css')) return;
    var s = document.createElement('style');
    s.id = 'vlxt-fx-css';
    s.textContent = [
      '@keyframes vlxtLpFloat{0%{opacity:0;transform:translateY(0) scale(.8)}15%{opacity:1;transform:translateY(-6px) scale(1.05)}',
      '80%{opacity:1;transform:translateY(-34px) scale(1)}100%{opacity:0;transform:translateY(-46px) scale(.95)}}',
      '.vlxt-lp-gain{position:fixed;top:76px;right:24px;z-index:99990;background:linear-gradient(135deg,#0072ff,#00c6ff);',
      'color:#fff;font-weight:800;font-size:15px;padding:8px 16px;border-radius:20px;box-shadow:0 6px 20px rgba(0,114,255,.4);',
      'animation:vlxtLpFloat 1.8s ease-out forwards;pointer-events:none;}',
      '@media(max-width:480px){.vlxt-lp-gain{top:64px;right:12px;font-size:13px;padding:7px 13px}}',

      '@keyframes vlxtRankUpIn{from{opacity:0;transform:scale(.7) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)}}',
      '@keyframes vlxtRankUpGlow{0%,100%{filter:drop-shadow(0 0 14px currentColor)}50%{filter:drop-shadow(0 0 28px currentColor)}}',
      '.vlxt-ru-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.62);z-index:99991;display:flex;',
      'align-items:center;justify-content:center;}',
      '.vlxt-ru-card{background:linear-gradient(160deg,#161b22,#0d1117);border:1.5px solid rgba(255,255,255,.12);',
      'border-radius:20px;padding:34px 30px;text-align:center;max-width:320px;width:90%;',
      'animation:vlxtRankUpIn .35s cubic-bezier(.34,1.56,.64,1);box-shadow:0 20px 60px rgba(0,0,0,.5);}',
      '.vlxt-ru-icon{font-size:52px;animation:vlxtRankUpGlow 1.6s ease-in-out infinite;margin-bottom:8px;}',
      '.vlxt-ru-title{font-size:12px;font-weight:800;letter-spacing:.08em;color:#fbbf24;text-transform:uppercase;margin-bottom:8px;}',
      '.vlxt-ru-name{font-size:22px;font-weight:900;color:#fff;margin-bottom:4px;}',
      '.vlxt-ru-sub{font-size:13px;color:#8b949e;margin-bottom:20px;}',
      '.vlxt-ru-btn{padding:10px 26px;border:none;border-radius:10px;background:linear-gradient(135deg,#0072ff,#00f0ff);',
      'color:#fff;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit;}',

      '.vlxt-fire{display:inline-block;vertical-align:middle;line-height:1;}',
      '.vlxt-fire-count{font-weight:800;color:#d97706;margin-left:3px;vertical-align:middle;font-size:13px;}',
      '@keyframes vlxtFirePulse{0%,100%{transform:scale(1) rotate(-2deg)}50%{transform:scale(1.14) rotate(2deg)}}',
      '.vlxt-fire-pulse{animation:vlxtFirePulse 1.1s ease-in-out infinite;}',
      '@keyframes vlxtFireSpark{0%,100%{filter:drop-shadow(0 0 4px rgba(251,146,60,.7))}50%{filter:drop-shadow(0 0 10px rgba(251,146,60,1))}}',
      '.vlxt-fire-spark{animation:vlxtFireSpark 1.1s ease-in-out infinite, vlxtFirePulse 1.1s ease-in-out infinite;}',
      '.vlxt-fire-epic{filter:drop-shadow(0 0 14px rgba(236,72,153,.85));}'
    ].join('');
    document.head.appendChild(s);
  }

  function showLPGain(amount) {
    amount = Number(amount) || 0;
    if (amount <= 0) return;
    injectCSS();
    var el = document.createElement('div');
    el.className = 'vlxt-lp-gain';
    el.textContent = '+' + amount + ' LP';
    document.body.appendChild(el);
    setTimeout(function () { el.remove(); }, 1800);
  }

  function showRankUp(lpTotal) {
    injectCSS();
    var rank = getRank(lpTotal);
    var back = document.createElement('div');
    back.className = 'vlxt-ru-backdrop';
    back.innerHTML =
      '<div class="vlxt-ru-card">' +
        '<div class="vlxt-ru-icon">' + rank.name.split(' ')[0] + '</div>' +
        '<div class="vlxt-ru-title">Lên hạng!</div>' +
        '<div class="vlxt-ru-name">' + rank.name + '</div>' +
        '<div class="vlxt-ru-sub">' + lpTotal + ' LP — Chúc mừng em! 🎉</div>' +
        '<button class="vlxt-ru-btn">Tuyệt vời!</button>' +
      '</div>';
    back.querySelector('button').onclick = function () { back.remove(); };
    back.addEventListener('click', function (e) { if (e.target === back) back.remove(); });
    document.body.appendChild(back);
  }

  function fireTier(n) {
    if (n >= 30) return 5;
    if (n >= 14) return 4;
    if (n >= 7) return 3;
    if (n >= 3) return 2;
    return 1;
  }
  var FIRE_META = {
    1: { emoji: '🔥', size: 15, extra: '' },
    2: { emoji: '🔥', size: 18, extra: '' },
    3: { emoji: '🔥', size: 22, extra: 'vlxt-fire-pulse' },
    4: { emoji: '🔥', size: 26, extra: 'vlxt-fire-spark' },
    5: { emoji: '🔥🔥', size: 26, extra: 'vlxt-fire-spark vlxt-fire-epic' }
  };
  function streakFireHTML(count) {
    count = Number(count) || 0;
    if (count <= 0) return '';
    injectCSS();
    var m = FIRE_META[fireTier(count)];
    return '<span class="vlxt-fire ' + m.extra + '" style="font-size:' + m.size + 'px">' + m.emoji +
      '</span><span class="vlxt-fire-count">' + count + ' ngày</span>';
  }

  window.VLXT_RANKS = RANKS;
  window.vlxtGetRank = getRank;
  window.vlxtNextRank = nextRank;
  window.vlxtSubRank = subRank;
  window.vlxtShowLPGain = showLPGain;
  window.vlxtShowRankUp = showRankUp;
  window.vlxtStreakFireHTML = streakFireHTML;
})();
