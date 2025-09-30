// mygame/assets/js/mon-spotlight.js
(() => {
  const EL_ICON = { 炎:'🔥', 水:'💧', 風:'🌪️', 土:'⛰️', 雷:'⚡', 氷:'❄️', 光:'✨', 闇:'🌑' };

  async function load() {
    const res = await fetch('./data/monsters.json', { cache: 'no-store' });
    const list = await res.json();

    // 先頭6体を採用（お好みでシャッフル等に変更OK）
    const picks = list.slice(0, 6);

    const wrap = document.getElementById('monSpot');
    if (!wrap) return;

    wrap.innerHTML = picks.map(m => {
      const icon = EL_ICON[m.attr] || '◆';
      // 深い場所まで行けるように id をクエリで付与
      const href = `./pages/monsters.html?id=${encodeURIComponent(m.id)}`;
      return `
        <a class="card link-card" href="${href}" aria-label="${m.name}へ">
          <h3>${icon} ${m.name}</h3>
          <p>属性：${m.attr} ／ HP:${m.hp} ATK:${m.atk} SPD:${m.spd}</p>
        </a>
      `;
    }).join('');
  }

  document.addEventListener('DOMContentLoaded', load);
})();
