import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import http from 'http';
import assert from 'assert';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('======================================================================');
console.log('  STUDENT LMS: DIAGRAM ASSETS VERIFICATION SUITE');
console.log('======================================================================');

// 1. Audit SVGs in images/diagrams/
const diagDir = path.join(rootDir, 'images', 'diagrams');
assert(fs.existsSync(diagDir), 'images/diagrams directory must exist');

const svgFiles = fs.readdirSync(diagDir).filter(f => f.endsWith('.svg')).sort();
console.log(`\n1. Checking SVG files (found ${svgFiles.length} files)...`);
assert(svgFiles.length === 19, `Expected 19 SVG files, found ${svgFiles.length}`);

// 2. Security scan on every SVG file
console.log('\n2. Running Security Scan on all 19 SVG files...');
const dangerousPatterns = [
    /<\s*script/i,
    /\bon\w+\s*=/i,
    /javascript:/i,
    /data:text\/html/i,
    /<\s*foreignObject/i,
    /xlink:href\s*=\s*["']https?:\/\/(?!vatlyxuantruong\.io\.vn)/i
];

svgFiles.forEach(f => {
    const fullPath = path.join(diagDir, f);
    const content = fs.readFileSync(fullPath, 'utf-8');
    const size = fs.statSync(fullPath).size;
    assert(size > 0, `SVG ${f} must not be empty`);

    dangerousPatterns.forEach(pat => {
        const match = pat.exec(content);
        assert(!match, `Security violation in ${f}: matched pattern ${pat}`);
    });
    console.log(`   [PASS] ${f} (${size} B) - 100% clean of XSS/foreignObject/scripts`);
});

// 3. HTTP Local Server test: verify each SVG returns 200
console.log('\n3. Starting Local HTTP Server to test SVG HTTP 200 delivery...');
const server = http.createServer((req, res) => {
    const parsedUrl = new URL(req.url, 'http://127.0.0.1');
    const filePath = path.join(rootDir, parsedUrl.pathname.replace(/^\//, ''));
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        let contentType = 'text/plain';
        if (ext === '.svg') contentType = 'image/svg+xml';
        else if (ext === '.html') contentType = 'text/html; charset=utf-8';
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(fs.readFileSync(filePath));
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const port = server.address().port;
console.log(`   Local server listening on port ${port}`);

try {
    for (const f of svgFiles) {
        const url = `http://127.0.0.1:${port}/images/diagrams/${f}`;
        const res = await fetch(url);
        assert.equal(res.status, 200, `Expected 200 for ${f}, got ${res.status}`);
        const ct = res.headers.get('content-type');
        assert(ct && ct.includes('image/svg+xml'), `Expected image/svg+xml for ${f}, got ${ct}`);
        const buf = await res.arrayBuffer();
        assert(buf.byteLength > 0, `Downloaded SVG ${f} must have non-zero length`);
    }
    console.log(`   [PASS] All 19 SVGs returned HTTP 200 with Content-Type image/svg+xml!`);
} finally {
    server.close();
}

// 4. Test Student LMS template functions in baihoc.html
console.log('\n4. Testing renderStudentDiagram & getStudentDiagram functions in baihoc.html...');
const baiHocHtml = fs.readFileSync(path.join(rootDir, 'baihoc.html'), 'utf-8');

// Extract helper functions from baihoc.html
const fnSnippetMatch = baiHocHtml.match(/(const DIAGRAM_ORIGIN_ALLOWLIST[\s\S]*?function renderStudentDiagram[\s\S]*?^})/m);
assert(fnSnippetMatch, 'Could not find renderStudentDiagram snippet in baihoc.html');

// Create test context
const evalContext = `
${fnSnippetMatch[1]}
globalThis.renderStudentDiagram = renderStudentDiagram;
globalThis.isAllowedDiagramUrl = isAllowedDiagramUrl;
`;
eval(evalContext);

// 4.1 Test valid STEM SVG
const stemHtml = globalThis.renderStudentDiagram({
    url: 'https://vatlyxuantruong.io.vn/images/diagrams/IPC-T2-L01-Q12-D01.svg',
    altText: 'Đồ thị từ trường Q12'
}, false);
assert(stemHtml.includes('pq-diagram-stem'), 'STEM diagram must have class pq-diagram-stem');
assert(stemHtml.includes('https://vatlyxuantruong.io.vn/images/diagrams/IPC-T2-L01-Q12-D01.svg'), 'Must preserve image URL');
assert(stemHtml.includes('alt="Đồ thị từ trường Q12"'), 'Must preserve altText');
assert(stemHtml.includes('onerror='), 'Must include onerror fallback');
console.log('   [PASS] STEM diagram rendering valid');

// 4.2 Test Option diagram
const optHtml = globalThis.renderStudentDiagram({
    url: 'https://vatlyxuantruong.io.vn/images/diagrams/IPC-T2-L01-Q13-D01.svg',
    altText: 'Đồ thị A'
}, true);
assert(optHtml.includes('pq-diagram-opt'), 'Option diagram must have class pq-diagram-opt');
console.log('   [PASS] Option diagram rendering valid');

// 4.3 Test disallowed domain rejection
const badDomainHtml = globalThis.renderStudentDiagram({
    url: 'https://evil-hacker.com/exploit.svg',
    altText: 'Bad image'
}, false);
assert(badDomainHtml.includes('không thuộc nguồn tin cậy'), 'Disallowed domain must be blocked by allowlist');
console.log('   [PASS] Disallowed origin blocked by allowlist');

// 4.4 Test javascript: protocol rejection
const jsProtoHtml = globalThis.renderStudentDiagram({
    url: 'javascript:alert(1)',
    altText: 'XSS'
}, false);
assert(jsProtoHtml.includes('không thuộc nguồn tin cậy'), 'javascript: must be blocked');
console.log('   [PASS] javascript: protocol blocked');

// 5. Responsive mobile CSS check
console.log('\n5. Checking Mobile & Responsive CSS in baihoc.html...');
assert(baiHocHtml.includes('.pq-diagram-stem'), 'CSS must define .pq-diagram-stem');
assert(baiHocHtml.includes('.pq-diagram-opt'), 'CSS must define .pq-diagram-opt');
assert(baiHocHtml.includes('max-width:min(100%'), 'CSS must enforce max-width:min(100%...) for responsive mobile scaling');
console.log('   [PASS] Responsive mobile CSS confirmed!');

console.log('\n======================================================================');
console.log('  ALL STUDENT LMS TESTS PASSED SUCCESSFULLY!');
console.log('======================================================================');
