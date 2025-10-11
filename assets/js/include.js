// ビルドなしでヘッダー/フッターを差し込む最小スクリプト
(function () {
  const isLocal = location.hostname === '127.0.0.1' || location.hostname === 'localhost';

  function getBasePath() {
    if (isLocal) return '';
    const segments = location.pathname.split('/').filter(Boolean);
    return segments.length ? '/' + segments[0] : '';
  }

  const BASE = getBasePath();

  async function inject() {
    const nodes = document.querySelectorAll('[data-include]');
    for (const el of nodes) {
      const url = el.getAttribute('data-include');
      const resolved = url.startsWith('/') ? (BASE + url) : url; // 先頭/ならBASEを前置
      try {
        const res = await fetch(resolved, { cache: 'no-cache' });
        if (!res.ok) throw new Error(res.status + ' ' + res.statusText);
        el.outerHTML = await res.text();
      } catch (err) {
        console.error('include failed', { url, resolved, err });
        el.outerHTML = '<!-- include failed: ' + resolved + ' -->';
      }
    }
    const y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();

// おまけ：公開時だけ 公開ディレクトリ名 を絶対パスに前置
(function fixAbsoluteLinks() {
  const isLocal = location.hostname === '127.0.0.1' || location.hostname === 'localhost';
  if (isLocal) return;
  const segments = location.pathname.split('/').filter(Boolean);
  const BASE = segments.length ? '/' + segments[0] : '';
  const sel = ['a[href^="/"]', 'link[href^="/"]', 'script[src^="/"]', 'img[src^="/"]'];
  document.querySelectorAll(sel.join(',')).forEach(el => {
    const attr = el.hasAttribute('href') ? 'href' : 'src';
    el.setAttribute(attr, BASE + el.getAttribute(attr));
  });
})();
