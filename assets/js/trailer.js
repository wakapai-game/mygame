// mygame/assets/js/trailer.js
(() => {
  const v = document.getElementById('gameTrailer');
  if (!v) return;

  const KEY = 'trailer_time_v1';

  // 可能ならミュート自動再生（モバイル/ブラウザの制約を考慮）
  v.muted = true;
  const tryAutoplay = async () => {
    try { await v.play(); } catch(_) { /* ユーザー操作待ち */ }
  };

  // レジューム（5秒以上見ていたら戻す）
  const saved = Number(localStorage.getItem(KEY) || 0);
  if (!isNaN(saved) && saved >= 5) {
    v.addEventListener('loadedmetadata', () => {
      if (saved < v.duration - 2) v.currentTime = saved;
    }, { once: true });
  }
  // 再生中は定期保存
  let tId = null;
  v.addEventListener('play', () => {
    clearInterval(tId);
    tId = setInterval(() => {
      if (!v.paused && !v.seeking) {
        localStorage.setItem(KEY, String(Math.floor(v.currentTime)));
      }
    }, 2000);
  });
  v.addEventListener('pause', () => clearInterval(tId));
  v.addEventListener('ended', () => { clearInterval(tId); localStorage.removeItem(KEY); });

  // 画面内に入ったら再生、外れたら一時停止（省電力）
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { tryAutoplay(); }
      else { v.pause(); }
    });
  }, { threshold: .4 });
  io.observe(v);

  // ユーザーが音を出したいときのUX：クリックでミュート解除
  v.addEventListener('click', () => {
    if (v.muted) { v.muted = false; v.play().catch(()=>{}); }
  });
})();
