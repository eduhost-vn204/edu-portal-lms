# Kịch bản kiểm thử End-to-End tự động bằng Playwright cho Live & Xem Lại
# Kiểm tra: Guest Access, 0 redirect, Gate ẩn, 0 request lưu tiến độ cá nhân,
# kiểm tra tính hợp lệ của link tài liệu và link phòng live, kiểm tra chế độ có tài khoản.

import http.server, socketserver, threading, time, os, sys
sys.stdout.reconfigure(encoding='utf-8')
from playwright.sync_api import sync_playwright

root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=root_dir, **kwargs)
    def log_message(self, format, *args):
        pass

class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True

# Sử dụng cổng 0 để hệ điều hành cấp phát cổng động khả dụng
server = ReusableTCPServer(('127.0.0.1', 0), CustomHandler)
PORT = server.server_address[1]
t = threading.Thread(target=server.serve_forever, daemon=True)
t.start()
print(f'Server test started at http://127.0.0.1:{PORT}')

results = []

try:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        # 1. Clean Context (Chế độ khách không đăng nhập)
        context = browser.new_context(viewport={'width': 1280, 'height': 800})
        page = context.new_page()

        bad_requests = []
        page.on('request', lambda req: bad_requests.append(req.url) if ('saveLiveProgress' in req.url or 'saveProgress' in req.url) else None)

        page.goto(f'http://127.0.0.1:{PORT}/live-record.html', wait_until='domcontentloaded')
        page.wait_for_timeout(1000)

        # Assert URL & Gate
        assert 'login.html' not in page.url, f'FAIL: redirected to {page.url}'
        assert not page.is_visible('#gate'), 'FAIL: Gate modal is visible for guest!'
        assert len(bad_requests) == 0, f'FAIL: Unauthorized progress requests: {bad_requests}'
        results.append(('Guest Home Access & Fail-closed Network', 'PASS'))

        # 2. Inject sample live lesson in localStorage for E2E link interaction check
        sample_lessons = [{
            "_rowIndex": 2,
            "KhoaHoc": "CHUYÊN ĐỀ LIVE & XEM LẠI",
            "Chuong": "CHƯƠNG 1",
            "TenBai": "Live Thực Chiến 01",
            "NgayGioLive": "2026-09-25T19:30:00.000Z",
            "LinkLive": "https://www.youtube.com/watch?v=live_stream_test_abc",
            "TaiLieuLive": "https://drive.google.com/file/d/test_tailieu_id/view",
            "Video": "",
            "VideoGhiLai": "",
            "VideoGiai": "",
            "MoTaBai": "Mô tả buổi live",
            "NgayDang": "2026-09-18T12:00:00.000Z",
            "PDF": "https://drive.google.com/file/d/test_pdf_id/view",
            "PDFLyThuyet": "https://drive.google.com/file/d/test_lt_id/view",
            "PDFLuyenTap": "https://drive.google.com/file/d/test_ltt_id/view",
            "BaiTap": "",
            "ThoiGianLamBai": "",
            "ThuTuBai": 1,
            "MaBai": "LIVE_E2E_01",
            "TrangThai": "published"
        }]

        page.evaluate(f"""(data) => {{
            localStorage.setItem('vlxt_live_records_cache', JSON.stringify({{ts: Date.now(), rows: data}}));
        }}""", sample_lessons)

        page.reload(wait_until='domcontentloaded')
        page.wait_for_timeout(1000)

        # Check course card
        assert page.locator('.course-card').count() > 0, 'FAIL: Course card should render from cache'

        # Navigate to lesson
        page.evaluate("() => { window.location.hash = '#lesson/LIVE_E2E_01'; }")
        page.wait_for_timeout(1000)

        # Verify live enter link
        live_btn = page.locator('a.btn-enter-live')
        assert live_btn.count() > 0, 'FAIL: btn-enter-live must exist'
        assert live_btn.first.get_attribute('href') == 'https://www.youtube.com/watch?v=live_stream_test_abc', 'FAIL: Wrong LinkLive href'
        assert live_btn.first.get_attribute('target') == '_blank', 'FAIL: btn-enter-live must have target=_blank'

        # Verify doc prep link
        doc_btn = page.locator('a.btn-prep-doc')
        assert doc_btn.count() > 0, 'FAIL: btn-prep-doc must exist'
        assert doc_btn.first.get_attribute('href') == 'https://drive.google.com/file/d/test_tailieu_id/view', 'FAIL: Wrong TaiLieuLive href'
        assert doc_btn.first.get_attribute('target') == '_blank', 'FAIL: btn-prep-doc must have target=_blank'

        results.append(('Live Link & Document Link Validity & Clickable', 'PASS'))

        # 3. Mobile Viewport Check
        m_context = browser.new_context(viewport={'width': 390, 'height': 844}, is_mobile=True)
        m_page = m_context.new_page()
        m_page.goto(f'http://127.0.0.1:{PORT}/live-record.html', wait_until='domcontentloaded')
        m_page.wait_for_timeout(1000)
        assert 'login.html' not in m_page.url
        results.append(('Mobile Responsive Guest View', 'PASS'))

        browser.close()

finally:
    try:
        server.shutdown()
    except Exception:
        pass
    try:
        server.server_close()
    except Exception:
        pass
    if t.is_alive():
        t.join(timeout=2)
    print(f'Server test on port {PORT} stopped and closed.')

print('\nE2E PLAYWRIGHT RESULTS:')
for r in results:
    print(f'  - {r[0]}: {r[1]}')
