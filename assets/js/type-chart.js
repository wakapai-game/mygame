// 属性相性マトリクスを描画（source: window.TYPES from ../data/types.js）
(() => {
  const root = document.getElementById('chart');
  if (!root) return;

  // フォールバック
  if (!window.TYPES || !Array.isArray(window.TYPES.order) || !window.TYPES.effect) {
    root.innerHTML = '<p class="muted">属性データを読み込めませんでした。<br>../data/types.js を確認してください。</p>';
    return;
  }

  const ORDER = window.TYPES.order;          // 例: ["炎","水","風","土","雷","氷","光","闇"]
  const EFFECT = window.TYPES.effect;        // 例: { 炎:{氷:1.5,...}, ... }
  const ICON = { 炎:'🔥', 水:'💧', 風:'🌪️', 土:'⛰️', 雷:'⚡', 氷:'❄️', 光:'✨', 闇:'🌑' };

  // 表要素を生成
  const table = document.createElement('table');
  table.className = 'mat';
  const thead = document.createElement('thead');
  const trh = document.createElement('tr');
  trh.append(th('攻撃\\防御'));
  ORDER.forEach(def => trh.append(th(elBadge(def))));
  thead.append(trh);

  const tbody = document.createElement('tbody');
  ORDER.forEach(att => {
    const tr = document.createElement('tr');
    tr.append(th(elBadge(att)));
    ORDER.forEach(def => {
      const eff = EFFECT?.[att]?.[def] ?? 1.0;
      const td = document.createElement('td');
      td.dataset.mult = String(eff);
      if (eff > 1) { td.textContent = '〇'; td.className = 'mat-good'; }
      else if (eff < 1) { td.textContent = '×'; td.className = 'mat-bad'; }
      else { td.textContent = '△'; td.className = 'mat-even'; }
      td.title = `${att} → ${def} : ×${eff.toFixed(1)}`;
      tr.append(td);
    });
    tbody.append(tr);
  });

  table.append(thead, tbody);
  root.innerHTML = '';
  root.append(table);

  /* helpers */
  function th(htmlOrNode) {
    const h = document.createElement('th');
    if (typeof htmlOrNode === 'string') h.innerHTML = htmlOrNode;
    else h.append(htmlOrNode);
    return h;
  }
  function elBadge(name) {
    const span = document.createElement('span');
    span.className = 'el-badge';
    span.innerHTML = `${ICON[name] || ''} ${name}`;
    return span;
  }
})();
