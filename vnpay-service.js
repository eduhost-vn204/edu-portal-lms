/* ═══════════════════════════════════════════════════════════════════
   VNPAY PAYMENT GATEWAY INTEGRATION MODULE — VẬT LÝ XUÂN TRƯỜNG
   Chuẩn VNPay Payment Gateway v2.1.0 (HMAC-SHA512, Ordinal Sort, URL Encode)
   Chuyển thể và tối ưu từ đặc tả VNPay Library / VnPayService (ASP.NET)
   sang kiến trúc Static Web + Google Apps Script của Vật Lý Xuân Trường.
   ═══════════════════════════════════════════════════════════════════ */

(function (window) {
  'use strict';

  // ── 1. CẤU HÌNH MẶC ĐỊNH MÔI TRƯỜNG SANDBOX VNPAY (Chuẩn tài liệu Thầy gửi) ──
  // Đang đặt ở chế độ chờ (enabled: false) để ưu tiên VietQR nhận tiền thật.
  // Khi Thầy đăng ký Hộ kinh doanh xong, chỉ cần đổi enabled: true là bật lại ngay.
  const VNPAY_CONFIG = {
    enabled: false,
    tmnCode: 'NJJ0R8FS', // Mã định danh merchant (TmnCode)
    hashSecret: 'BYKJBHPPZKQMKBIBGGXIYKWYFAYSJXCW', // Chuỗi bí mật tạo chữ ký HMAC-SHA512 (Sandbox Test)
    baseUrl: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
    command: 'pay',
    currCode: 'VND',
    version: '2.1.0',
    locale: 'vn',
    orderType: 'other', // Mã loại hàng hóa chuẩn VNPay ('other', 'billpayment', 'topup', ...)
    timeZoneOffsetHours: 7, // SE Asia Standard Time (Asia/Bangkok, UTC+7)
    defaultReturnPath: 'vnpay-return.html',
    // Alias chuẩn PascalCase từ appsettings.json của ASP.NET
    TmnCode: 'NJJ0R8FS',
    HashSecret: 'BYKJBHPPZKQMKBIBGGXIYKWYFAYSJXCW',
    BaseUrl: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
    Command: 'pay',
    CurrCode: 'VND',
    Version: '2.1.0',
    Locale: 'vn',
    TimeZoneId: 'SE Asia Standard Time'
  };

  // Model dữ liệu gửi đi và trả về chuẩn bài hướng dẫn ASP.NET
  class PaymentInformationModel {
    constructor(init = {}) {
      this.OrderType = init.OrderType || init.orderType || 'other';
      this.Amount = Number(init.Amount ?? init.amount ?? 50000);
      this.OrderDescription = init.OrderDescription || init.orderDescription || '';
      this.Name = init.Name || init.name || '';
      this.planCode = init.planCode || '';
      this.sdt = init.sdt || '';
    }
  }

  class PaymentResponseModel {
    constructor(init = {}) {
      Object.assign(this, init);
    }
  }

  // Thẻ ngân hàng test chuẩn của VNPay Sandbox (Ngân hàng NCB) để học sinh / Thầy test ngay
  const VNPAY_TEST_CARD = {
    bank: 'NCB (Ngân hàng Quốc Dân)',
    cardNumber: '9704198526191432198',
    cardHolder: 'NGUYEN VAN A',
    issueDate: '07/15',
    otp: '123456'
  };

  const STORAGE_KEYS = {
    USER: 'vlxt_user_v2',
    ORDERS: 'vlxt_vnpay_orders_v1',
    LAST_ORDER: 'vlxt_vnpay_last_order'
  };

  // ── 2. THUẬT TOÁN HMAC-SHA512 THUẦN JAVASCRIPT (Đồng bộ 100% chuẩn .NET HMACSHA512) ──
  // Hỗ trợ đồng bộ (synchronous) trên mọi môi trường: Browser (http/https/file://) và Node.js.
  function utf8ToBytes(str) {
    if (typeof TextEncoder !== 'undefined') {
      return new TextEncoder().encode(String(str));
    }
    const utf8 = unescape(encodeURIComponent(String(str)));
    const arr = new Uint8Array(utf8.length);
    for (let i = 0; i < utf8.length; i++) {
      arr[i] = utf8.charCodeAt(i);
    }
    return arr;
  }

  // Hằng số K của SHA-512 (80 hằng số 64-bit)
  const SHA512_K = [
    0x428a2f98d728ae22n, 0x7137449123ef65cdn, 0xb5c0fbcfec4d3b2fn, 0xe9b5dba58189dbbcn,
    0x3956c25bf348b538n, 0x59f111f1b605d019n, 0x923f82a4af194f9bn, 0xab1c5ed5da6d8118n,
    0xd807aa98a3030242n, 0x12835b0145706fben, 0x243185be4ee4b28cn, 0x550c7dc3d5ffb4e2n,
    0x72be5d74f27b896fn, 0x80deb1fe3b1696b1n, 0x9bdc06a725c71235n, 0xc19bf174cf692694n,
    0xe49b69c19ef14ad2n, 0xefbe4786384f25e3n, 0x0fc19dc68b8cd5b5n, 0x240ca1cc77ac9c65n,
    0x2de92c6f592b0275n, 0x4a7484aa6ea6e483n, 0x5cb0a9dcbd41fbd4n, 0x76f988da831153b5n,
    0x983e5152ee66dfabn, 0xa831c66d2db43210n, 0xb00327c898fb213fn, 0xbf597fc7beef0ee4n,
    0xc6e00bf33da88fc2n, 0xd5a79147930aa725n, 0x06ca6351e003826fn, 0x142929670a0e6e70n,
    0x27b70a8546d22ffcn, 0x2e1b21385c26c926n, 0x4d2c6dfc5ac42aedn, 0x53380d139d95b3dfn,
    0x650a73548baf63den, 0x766a0abb3c77b2a8n, 0x81c2c92e47edaee6n, 0x92722c851482353bn,
    0xa2bfe8a14cf10364n, 0xa81a664bbc423001n, 0xc24b8b70d0f89791n, 0xc76c51a30654be30n,
    0xd192e819d6ef5218n, 0xd69906245565a910n, 0xf40e35855771202an, 0x106aa07032bbd1b8n,
    0x19a4c116b8d2d0c8n, 0x1e376c085141ab53n, 0x2748774cdf8eeb99n, 0x34b0bcb5e19b48a8n,
    0x391c0cb3c5c95a63n, 0x4ed8aa4ae3418acbn, 0x5b9cca4f7763e373n, 0x682e6ff3d6b2b8a3n,
    0x748f82ee5defb2fcn, 0x78a5636f43172f60n, 0x84c87814a1f0ab72n, 0x8cc702081a6439ecn,
    0x90befffa23631e28n, 0xa4506cebde82bde9n, 0xbef9a3f7b2c67915n, 0xc67178f2e372532bn,
    0xca273eceea26619cn, 0xd186b8c721c0c207n, 0xeada7dd6cde0eb1en, 0xf57d4f7fee6ed178n,
    0x06f067aa72176fban, 0x0a637dc5a2c898a6n, 0x113f9804bef90daen, 0x1b710b35131c471bn,
    0x28db77f523047d84n, 0x32caab7b40c72493n, 0x3c9ebe0a15c9bebcn, 0x431d67c49c100d4cn,
    0x4cc5d4becb3e42b6n, 0x597f299cfc657e2an, 0x5fcb6fab3ad6faecn, 0x6c44198c4a475817n
  ];

  const SHA512_H0 = [
    0x6a09e667f3bcc908n, 0xbb67ae8584caa73bn, 0x3c6ef372fe94f82bn, 0xa54ff53a5f1d36f1n,
    0x510e527fade682d1n, 0x9b05688c2b3e6c1fn, 0x1f83d9abfb41bd6bn, 0x5be0cd19137e2179n
  ];

  const MASK_64 = 0xffffffffffffffffn;

  function rotr64(x, n) {
    return ((x >> BigInt(n)) | (x << BigInt(64 - n))) & MASK_64;
  }

  function sha512Bytes(msgBytes) {
    const bitLen = BigInt(msgBytes.length) * 8n;
    // Padding: append 0x80, then 0x00 until length % 128 === 112, then 16-byte big-endian bit length
    const padZeroLen = (112 - ((msgBytes.length + 1) % 128) + 128) % 128;
    const totalLen = msgBytes.length + 1 + padZeroLen + 16;
    const buf = new Uint8Array(totalLen);
    buf.set(msgBytes, 0);
    buf[msgBytes.length] = 0x80;

    // Write 128-bit length (high 64 bits = 0, low 64 bits = bitLen)
    let lenTmp = bitLen;
    for (let i = 0; i < 8; i++) {
      buf[totalLen - 1 - i] = Number(lenTmp & 0xffn);
      lenTmp >>= 8n;
    }

    let h0 = SHA512_H0[0], h1 = SHA512_H0[1], h2 = SHA512_H0[2], h3 = SHA512_H0[3];
    let h4 = SHA512_H0[4], h5 = SHA512_H0[5], h6 = SHA512_H0[6], h7 = SHA512_H0[7];

    const W = new Array(80);

    for (let offset = 0; offset < totalLen; offset += 128) {
      for (let i = 0; i < 16; i++) {
        let word = 0n;
        for (let b = 0; b < 8; b++) {
          word = (word << 8n) | BigInt(buf[offset + i * 8 + b]);
        }
        W[i] = word;
      }

      for (let i = 16; i < 80; i++) {
        const w15 = W[i - 15];
        const s0 = rotr64(w15, 1) ^ rotr64(w15, 8) ^ (w15 >> 7n);
        const w2 = W[i - 2];
        const s1 = rotr64(w2, 19) ^ rotr64(w2, 61) ^ (w2 >> 6n);
        W[i] = (W[i - 16] + s0 + W[i - 7] + s1) & MASK_64;
      }

      let a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7;

      for (let i = 0; i < 80; i++) {
        const S1 = rotr64(e, 14) ^ rotr64(e, 18) ^ rotr64(e, 41);
        const ch = (e & f) ^ ((~e & MASK_64) & g);
        const temp1 = (h + S1 + ch + SHA512_K[i] + W[i]) & MASK_64;
        const S0 = rotr64(a, 28) ^ rotr64(a, 34) ^ rotr64(a, 39);
        const maj = (a & b) ^ (a & c) ^ (b & c);
        const temp2 = (S0 + maj) & MASK_64;

        h = g;
        g = f;
        f = e;
        e = (d + temp1) & MASK_64;
        d = c;
        c = b;
        b = a;
        a = (temp1 + temp2) & MASK_64;
      }

      h0 = (h0 + a) & MASK_64;
      h1 = (h1 + b) & MASK_64;
      h2 = (h2 + c) & MASK_64;
      h3 = (h3 + d) & MASK_64;
      h4 = (h4 + e) & MASK_64;
      h5 = (h5 + f) & MASK_64;
      h6 = (h6 + g) & MASK_64;
      h7 = (h7 + h) & MASK_64;
    }

    const out = new Uint8Array(64);
    const hs = [h0, h1, h2, h3, h4, h5, h6, h7];
    for (let i = 0; i < 8; i++) {
      let val = hs[i];
      for (let b = 7; b >= 0; b--) {
        out[i * 8 + b] = Number(val & 0xffn);
        val >>= 8n;
      }
    }
    return out;
  }

  function hmacSha512Hex(keyStr, inputStr) {
    const blockSize = 128; // 1024 bits for SHA-512
    let keyBytes = utf8ToBytes(keyStr);
    const inputBytes = utf8ToBytes(inputStr);

    if (keyBytes.length > blockSize) {
      keyBytes = sha512Bytes(keyBytes);
    }

    const paddedKey = new Uint8Array(blockSize);
    paddedKey.set(keyBytes, 0);

    const oKeyPad = new Uint8Array(blockSize);
    const iKeyPad = new Uint8Array(blockSize);
    for (let i = 0; i < blockSize; i++) {
      oKeyPad[i] = paddedKey[i] ^ 0x5c;
      iKeyPad[i] = paddedKey[i] ^ 0x36;
    }

    const innerData = new Uint8Array(blockSize + inputBytes.length);
    innerData.set(iKeyPad, 0);
    innerData.set(inputBytes, blockSize);
    const innerHash = sha512Bytes(innerData);

    const outerData = new Uint8Array(blockSize + innerHash.length);
    outerData.set(oKeyPad, 0);
    outerData.set(innerHash, blockSize);
    const finalHash = sha512Bytes(outerData);

    let hex = '';
    for (let i = 0; i < finalHash.length; i++) {
      hex += finalHash[i].toString(16).padStart(2, '0');
    }
    return hex;
  }

  // ── 3. HÀM URL ENCODE & SO SÁNH ORDINAL CHUẨN .NET WebUtility.UrlEncode & VnPayCompare ──
  // Trong .NET WebUtility.UrlEncode: khoảng trắng ' ' được mã hóa thành '+' và các ký tự
  // đặc biệt (!, ', (, ), *) được mã hóa phần trăm viết thường/hoa, tương thích cổng VNPay v2.1.0.
  function vnpUrlEncode(str) {
    if (str === null || str === undefined) return '';
    return encodeURIComponent(String(str))
      .replace(/%20/g, '+')
      .replace(/[!'()*]/g, function (c) {
        return '%' + c.charCodeAt(0).toString(16).toUpperCase();
      });
  }

  function vnpPayCompare(x, y) {
    if (x === y) return 0;
    if (x === null || x === undefined) return -1;
    if (y === null || y === undefined) return 1;
    // CompareOptions.Ordinal: so sánh mã Unicode từng ký tự
    return x < y ? -1 : 1;
  }

  // Định dạng thời gian theo múi giờ Việt Nam (SE Asia Standard Time, UTC+7): yyyyMMddHHmmss
  function formatVnPayDate(dateObj) {
    const d = dateObj instanceof Date ? dateObj : new Date();
    const utcMs = d.getTime() + (d.getTimezoneOffset() * 60000);
    const vnTime = new Date(utcMs + (VNPAY_CONFIG.timeZoneOffsetHours * 3600000));
    const yyyy = vnTime.getFullYear();
    const MM = String(vnTime.getMonth() + 1).padStart(2, '0');
    const dd = String(vnTime.getDate()).padStart(2, '0');
    const HH = String(vnTime.getHours()).padStart(2, '0');
    const mm = String(vnTime.getMinutes()).padStart(2, '0');
    const ss = String(vnTime.getSeconds()).padStart(2, '0');
    return `${yyyy}${MM}${dd}${HH}${mm}${ss}`;
  }

  // ── 4. CLASS VnPayLibrary (Chuyển thể 1:1 từ C# VnPayLibrary của Thầy) ──
  class VnPayLibrary {
    constructor() {
      this._requestData = new Map();
      this._responseData = new Map();
    }

    addRequestData(key, value) {
      if (key && value !== null && value !== undefined && String(value) !== '') {
        this._requestData.set(String(key), String(value));
      }
    }

    addResponseData(key, value) {
      if (key && value !== null && value !== undefined && String(value) !== '') {
        this._responseData.set(String(key), String(value));
      }
    }

    getResponseData(key) {
      return this._responseData.has(key) ? this._responseData.get(key) : '';
    }

    getSortedEntries(mapObj) {
      return Array.from(mapObj.entries())
        .filter(([_, val]) => val !== null && val !== undefined && String(val) !== '')
        .sort(([keyA], [keyB]) => vnpPayCompare(keyA, keyB));
    }

    createRequestUrl(baseUrl, vnpHashSecret) {
      const sorted = this.getSortedEntries(this._requestData);
      const pairs = [];
      for (const [key, value] of sorted) {
        pairs.push(vnpUrlEncode(key) + '=' + vnpUrlEncode(value));
      }
      const querystring = pairs.join('&');
      const signData = querystring;
      const vnpSecureHash = hmacSha512Hex(vnpHashSecret, signData);
      const separator = baseUrl.includes('?') ? '&' : '?';
      return `${baseUrl}${separator}${querystring}&vnp_SecureHash=${vnpSecureHash}`;
    }

    getResponseRawData() {
      const cloneMap = new Map(this._responseData);
      cloneMap.delete('vnp_SecureHashType');
      cloneMap.delete('vnp_SecureHash');
      const sorted = this.getSortedEntries(cloneMap);
      const pairs = [];
      for (const [key, value] of sorted) {
        pairs.push(vnpUrlEncode(key) + '=' + vnpUrlEncode(value));
      }
      return pairs.join('&');
    }

    validateSignature(inputHash, secretKey) {
      if (!inputHash || !secretKey) return false;
      const rspRaw = this.getResponseRawData();
      const myChecksum = hmacSha512Hex(secretKey, rspRaw);
      return myChecksum.toLowerCase() === String(inputHash).trim().toLowerCase();
    }

    getFullResponseData(queryParamsOrSearch, hashSecret) {
      const vnPay = new VnPayLibrary();
      let params;
      if (typeof queryParamsOrSearch === 'string') {
        params = new URLSearchParams(queryParamsOrSearch);
      } else if (queryParamsOrSearch instanceof URLSearchParams) {
        params = queryParamsOrSearch;
      } else if (queryParamsOrSearch && typeof queryParamsOrSearch === 'object') {
        params = new URLSearchParams();
        Object.keys(queryParamsOrSearch).forEach(k => {
          if (queryParamsOrSearch[k] !== undefined && queryParamsOrSearch[k] !== null) {
            params.set(k, String(queryParamsOrSearch[k]));
          }
        });
      } else {
        params = new URLSearchParams();
      }

      for (const [key, value] of params.entries()) {
        if (key && key.startsWith('vnp_')) {
          vnPay.addResponseData(key, value);
        }
      }

      const orderId = vnPay.getResponseData('vnp_TxnRef');
      const vnPayTranId = vnPay.getResponseData('vnp_TransactionNo');
      const vnpResponseCode = vnPay.getResponseData('vnp_ResponseCode');
      const vnpTransactionStatus = vnPay.getResponseData('vnp_TransactionStatus');
      const vnpSecureHash = params.get('vnp_SecureHash') || '';
      const orderInfo = vnPay.getResponseData('vnp_OrderInfo');
      const vnpAmountRaw = Number(vnPay.getResponseData('vnp_Amount') || 0);
      const vnpBankCode = vnPay.getResponseData('vnp_BankCode');
      const vnpPayDate = vnPay.getResponseData('vnp_PayDate');

      const checkSignature = vnPay.validateSignature(vnpSecureHash, hashSecret);
      if (!checkSignature) {
        return new PaymentResponseModel({
          success: false,
          Success: false,
          IsPaid: false,
          signatureValid: false,
          paymentMethod: 'VnPay',
          PaymentMethod: 'VnPay',
          orderDescription: orderInfo,
          OrderDescription: orderInfo,
          orderId: String(orderId || ''),
          OrderId: String(orderId || ''),
          paymentId: String(vnPayTranId || ''),
          PaymentId: String(vnPayTranId || ''),
          transactionId: String(vnPayTranId || ''),
          TransactionId: String(vnPayTranId || ''),
          token: vnpSecureHash,
          Token: vnpSecureHash,
          vnPayResponseCode: vnpResponseCode,
          VnPayResponseCode: vnpResponseCode,
          vnPayTransactionStatus: vnpTransactionStatus,
          amount: vnpAmountRaw / 100,
          bankCode: vnpBankCode,
          payDate: vnpPayDate,
          message: 'Chữ ký bảo mật (vnp_SecureHash) không hợp lệ!'
        });
      }

      const isApproved = (vnpResponseCode === '00' && (vnpTransactionStatus === '00' || !vnpTransactionStatus));
      return new PaymentResponseModel({
        success: isApproved,
        Success: true,
        IsPaid: isApproved,
        signatureValid: true,
        paymentMethod: 'VnPay',
        PaymentMethod: 'VnPay',
        orderDescription: orderInfo,
        OrderDescription: orderInfo,
        orderId: String(orderId || ''),
        OrderId: String(orderId || ''),
        paymentId: String(vnPayTranId || ''),
        PaymentId: String(vnPayTranId || ''),
        transactionId: String(vnPayTranId || ''),
        TransactionId: String(vnPayTranId || ''),
        token: vnpSecureHash,
        Token: vnpSecureHash,
        vnPayResponseCode: vnpResponseCode,
        VnPayResponseCode: vnpResponseCode,
        vnPayTransactionStatus: vnpTransactionStatus,
        amount: vnpAmountRaw / 100,
        bankCode: vnpBankCode,
        payDate: vnpPayDate,
        message: isApproved
          ? 'Giao dịch thanh toán VNPay thành công!'
          : getVnPayResponseMessage(vnpResponseCode)
      });
    }
  }

  // Bảng mã lỗi chuẩn VNPay
  function getVnPayResponseMessage(code) {
    const map = {
      '00': 'Giao dịch thành công',
      '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).',
      '09': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.',
      '10': 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
      '11': 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.',
      '12': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.',
      '13': 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP).',
      '24': 'Giao dịch không thành công do: Khách hàng hủy giao dịch.',
      '51': 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.',
      '65': 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.',
      '75': 'Ngân hàng thanh toán đang bảo trì.',
      '79': 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định.'
    };
    return map[String(code)] || ('Giao dịch không thành công (Mã phản hồi VNPay: ' + code + ')');
  }

  // ── 5. SERVICE TẠO URL & XỬ LÝ CALLBACK VNPAY (VnPayService) ──
  const VnPayService = {
    CONFIG: VNPAY_CONFIG,
    config: VNPAY_CONFIG,
    TEST_CARD: VNPAY_TEST_CARD,
    VnPayLibrary: VnPayLibrary,
    PaymentInformationModel: PaymentInformationModel,
    PaymentResponseModel: PaymentResponseModel,
    hmacSha512Hex: hmacSha512Hex,
    vnpUrlEncode: vnpUrlEncode,
    vnpPayCompare: vnpPayCompare,
    formatVnPayDate: formatVnPayDate,
    getVnPayResponseMessage: getVnPayResponseMessage,

    isEnabled: function () {
      if (VNPAY_CONFIG.enabled) return true;
      try {
        if (typeof window !== 'undefined' && window.location && window.location.search.includes('vnpay=1')) {
          return true;
        }
      } catch (e) {}
      return false;
    },

    // Tạo ReturnUrl động theo origin/đường dẫn hiện tại của website
    resolveReturnUrl: function (customReturnUrl) {
      if (customReturnUrl) return customReturnUrl;
      if (typeof window !== 'undefined' && window.location) {
        const href = window.location.href.split('?')[0].split('#')[0];
        if (href.startsWith('http://') || href.startsWith('https://')) {
          const baseDir = href.substring(0, href.lastIndexOf('/') + 1);
          return baseDir + VNPAY_CONFIG.defaultReturnPath;
        }
        // Khi mở trực tiếp từ ổ cứng (file:///), trình duyệt chặn redirect từ https:// về file:///
        // nên chuyển hướng về cổng Local Server http://localhost:8080/vnpay-return.html
        if (href.startsWith('file:')) {
          return 'http://localhost:8080/' + VNPAY_CONFIG.defaultReturnPath;
        }
      }
      return 'https://vatlyxuantruong.io.vn/' + VNPAY_CONFIG.defaultReturnPath;
    },

    // Tương đương CreatePaymentUrl(PaymentInformationModel model, HttpContext context)
    createPaymentUrl: function (model, options) {
      const opts = options || {};
      const cfg = Object.assign({}, VNPAY_CONFIG, opts.config || {});
      const amount = Math.max(5000, Math.round(Number(model?.amount || model?.Amount || 50000)));
      const name = String(model?.name || model?.Name || 'Hoc sinh').trim();
      const orderDesc = String(model?.orderDescription || model?.OrderDescription || 'Thanh toan goi hoc VLXT').trim();
      // VNPay yêu cầu OrderType nằm trong danh mục chuẩn ('other', 'billpayment', 'topup', 'fashion',...)
      let orderType = String(model?.orderType || model?.OrderType || cfg.orderType || 'other').trim().toLowerCase();
      if (orderType === 'order') orderType = 'other'; // tránh lỗi 'order' như trong video lưu ý

      const planCode = String(model?.planCode || 'THANG50K').trim();
      const sdt = String(model?.sdt || '').replace(/\D/g, '');
      const now = opts.now instanceof Date ? opts.now : new Date();
      const createDate = formatVnPayDate(now);
      const txnRef = String(model?.txnRef || (Date.now().toString() + Math.floor(100 + Math.random() * 900)));
      const ipAddr = String(opts.ipAddr || '127.0.0.1');
      const returnUrl = this.resolveReturnUrl(opts.returnUrl || cfg.returnUrl);

      // Chuẩn hóa OrderInfo không dấu / ký tự an toàn để mọi ngân hàng nội địa không báo lỗi định dạng
      const rawOrderInfo = `${name} ${orderDesc} ${amount}`.trim();
      const cleanOrderInfo = rawOrderInfo
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .replace(/[^a-zA-Z0-9\s_.-]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      const pay = new VnPayLibrary();
      pay.addRequestData('vnp_Version', cfg.version);
      pay.addRequestData('vnp_Command', cfg.command);
      pay.addRequestData('vnp_TmnCode', cfg.tmnCode);
      pay.addRequestData('vnp_Amount', String(amount * 100)); // VNPay quy định nhân 100 để triệt tiêu phần thập phân
      pay.addRequestData('vnp_CreateDate', createDate);
      pay.addRequestData('vnp_CurrCode', cfg.currCode);
      pay.addRequestData('vnp_IpAddr', ipAddr);
      pay.addRequestData('vnp_Locale', cfg.locale);
      pay.addRequestData('vnp_OrderInfo', cleanOrderInfo);
      pay.addRequestData('vnp_OrderType', orderType);
      pay.addRequestData('vnp_ReturnUrl', returnUrl);
      pay.addRequestData('vnp_TxnRef', txnRef);

      const bankCode = model?.bankCode !== undefined ? String(model.bankCode).trim() : '';
      if (bankCode && bankCode !== 'ALL') {
        pay.addRequestData('vnp_BankCode', bankCode);
      }

      const paymentUrl = pay.createRequestUrl(cfg.baseUrl, cfg.hashSecret);

      // Lưu thông tin đơn hàng đang chờ vào localStorage để đối chiếu khi callback trả về
      this.savePendingOrder({
        orderId: txnRef,
        planCode: planCode,
        planName: orderDesc,
        amount: amount,
        name: name,
        sdt: sdt,
        orderType: orderType,
        orderInfo: cleanOrderInfo,
        createdAt: Date.now(),
        status: 'pending'
      });

      return paymentUrl;
    },

    // Tương đương PaymentExecute(IQueryCollection collections)
    paymentExecute: function (queryParamsOrSearch, customSecret) {
      const secret = customSecret || VNPAY_CONFIG.hashSecret;
      const pay = new VnPayLibrary();
      const response = pay.getFullResponseData(queryParamsOrSearch, secret);

      // Nếu thanh toán thành công và chữ ký hợp lệ -> kích hoạt nâng cấp tài khoản
      if (response.signatureValid && response.success) {
        this.activatePaidOrder(response);
      }

      return response;
    },

    // Lưu đơn hàng khởi tạo
    savePendingOrder: function (orderObj) {
      try {
        if (typeof localStorage === 'undefined') return;
        localStorage.setItem(STORAGE_KEYS.LAST_ORDER, JSON.stringify(orderObj));
        const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
        list.unshift(orderObj);
        if (list.length > 30) list.length = 30;
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(list));
      } catch (e) {}
    },

    getLastOrder: function () {
      try {
        if (typeof localStorage === 'undefined') return null;
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.LAST_ORDER) || 'null');
      } catch (e) {
        return null;
      }
    },

    // Kích hoạt gói học Pro / VIP khi VNPay callback thành công (ResponseCode === '00' & Signature Valid)
    activatePaidOrder: function (vnpResponse) {
      try {
        if (typeof localStorage === 'undefined') return null;
        const lastOrder = this.getLastOrder() || {};
        const curUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || 'null') || {};

        const sdt = lastOrder.sdt || curUser.sdt || '0987654321';
        const hoten = lastOrder.name || curUser.hoten || 'Học sinh Pro';
        const planCode = lastOrder.planCode || (vnpResponse.amount >= 300000 ? 'NAM399K' : 'THANG50K');
        const durationDays = (planCode === 'NAM399K' || planCode === 'VIP850K' || vnpResponse.amount >= 300000) ? 365 : 30;
        const tier = (planCode === 'NAM399K' || planCode === 'VIP850K' || vnpResponse.amount >= 300000) ? 'premium' : 'pro';

        const planNamesMap = {
          THANG50K: 'Gói Tháng Linh Hoạt (50.000đ/tháng)',
          NAM399K: 'Trọn Khóa Cả Năm XPS 2k9 (399.000đ)',
          VIP850K: 'Lớp Online Cùng Thầy VIP (850.000đ)'
        };
        const nowMs = Date.now();
        const expiryMs = nowMs + durationDays * 24 * 3600 * 1000;
        const paymentRecord = {
          id: String(vnpResponse.transactionId || vnpResponse.orderId || ('VNP-' + nowMs)),
          gateway: 'VNPay',
          method: 'VNPay (' + (vnpResponse.bankCode || 'NCB') + ')',
          orderId: vnpResponse.orderId,
          transactionId: vnpResponse.transactionId,
          sdt: sdt,
          hoten: hoten,
          amount: vnpResponse.amount,
          bankCode: vnpResponse.bankCode,
          payDate: vnpResponse.payDate,
          planCode: planCode,
          planName: planNamesMap[planCode] || lastOrder.planName || ('Gói ' + planCode),
          loaiTK: tier,
          activatedAt: nowMs,
          paidAt: new Date(nowMs).toISOString(),
          expiryAt: expiryMs,
          status: 'paid'
        };

        const updatedUser = Object.assign({}, curUser, {
          sdt: sdt,
          hoten: hoten,
          loaiTK: tier,
          isPaid: true,
          planCode: planCode,
          planName: paymentRecord.planName,
          activatedAt: nowMs,
          proExpiry: expiryMs,
          trialExpiry: expiryMs,
          lastPayment: paymentRecord
        });

        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
        localStorage.setItem('vlxt_is_paid', 'true');
        try {
          const hist = JSON.parse(localStorage.getItem('vlxt_payment_history') || '[]');
          const arr = Array.isArray(hist) ? hist : [];
          const exists = arr.some(x => String(x.transactionId || x.orderId || x.id) === String(paymentRecord.id));
          if (!exists) arr.unshift(paymentRecord);
          localStorage.setItem('vlxt_payment_history', JSON.stringify(arr.slice(0, 50)));
        } catch (e) {}

        // Cập nhật trạng thái đơn hàng trong lịch sử
        if (lastOrder && lastOrder.orderId === vnpResponse.orderId) {
          lastOrder.status = 'paid';
          lastOrder.transactionId = vnpResponse.transactionId;
          lastOrder.paidAt = Date.now();
          localStorage.setItem(STORAGE_KEYS.LAST_ORDER, JSON.stringify(lastOrder));
        }

        // Đồng bộ ngầm lên Google Apps Script (nếu có kết nối mạng)
        this.syncPaymentToBackend(updatedUser, vnpResponse, planCode);

        // Phát sự kiện toàn cục
        if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function' && typeof CustomEvent !== 'undefined') {
          window.dispatchEvent(new CustomEvent('vlxt:pro_unlocked', { detail: { user: updatedUser, vnpResponse: vnpResponse } }));
        }

        return updatedUser;
      } catch (e) {
        console.warn('Lỗi kích hoạt đơn hàng VNPay:', e);
        return null;
      }
    },

    syncPaymentToBackend: function (user, vnpResponse, planCode) {
      try {
        const gasUrl = (typeof window !== 'undefined' && window.VLXT_GAS) ? window.VLXT_GAS : null;
        if (!gasUrl || typeof fetch !== 'function') return;
        fetch(gasUrl, {
          method: 'POST',
          mode: 'cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            action: 'loghoatdong',
            sdt: user.sdt,
            hoten: user.hoten,
            loai: 'vnpay_payment_success',
            chiTiet: `VNPay #${vnpResponse.transactionId} | Gói ${planCode} | ${vnpResponse.amount}đ | Ngân hàng ${vnpResponse.bankCode || 'NCB'}`
          })
        }).catch(() => {});
      } catch (e) {}
    },

    // Chuyển hướng sang cổng thanh toán VNPay
    redirectToVnPay: function (model, options) {
      const url = this.createPaymentUrl(model, options);
      if (typeof window !== 'undefined' && window.location) {
        window.location.href = url;
      }
      return url;
    }
  };

  window.PaymentInformationModel = PaymentInformationModel;
  window.PaymentResponseModel = PaymentResponseModel;
  window.VnPayLibrary = VnPayLibrary;
  window.VnPayService = VnPayService;
})(typeof window !== 'undefined' ? window : globalThis);
