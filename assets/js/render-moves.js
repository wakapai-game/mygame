// 一覧表示専用：pages/moves.html から読み込まれる前提
(() => {
  const table = document.getElementById("mvTable");
  if (!table) return;

  const EL_ICON = { 炎:'🔥', 水:'💧', 風:'🌪️', 土:'⛰️', 雷:'⚡', 氷:'❄️', 光:'✨', 闇:'🌑' };

  async function load() {
    // moves.json のスキーマ想定:
    // [{ id, name, type: '物理'|'魔法'|'補助', el: '炎'|...|null, pow, cost, note }]
    const res = await fetch("../data/moves.json", { cache: "no-store" });
    const moves = await res.json();

    // ヘッダ
    const headers = ["ID","名前","タイプ","属性","威力","消費ST","効果/備考"];
    table.innerHTML = `<thead><tr>${headers.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody></tbody>`;
    const tbody = table.querySelector("tbody");

    // 行生成（行IDは mv-<id>）
    moves.forEach(mv => {
      const tr = document.createElement("tr");
      tr.id = `mv-${mv.id}`;
      tr.innerHTML = `
        <td><a href="#mv-${mv.id}" class="row-anchor" aria-label="この行へのリンク">${mv.id}</a></td>
        <td>${mv.name ?? ""}</td>
        <td>${mv.type ?? ""}</td>
        <td>${mv.el ? `${EL_ICON[mv.el] || ""} ${mv.el}` : "—"}</td>
        <td>${mv.pow ?? ""}</td>
        <td>${mv.cost ?? ""}</td>
        <td>${mv.note ?? ""}</td>
      `;
      tbody.appendChild(tr);
    });

    // 件数表示
    const countEl = document.getElementById("mvCount");
    if (countEl) countEl.textContent = `登録数：${moves.length} 技`;

    // 深リンク対応（?id= / #mv-）
    const url = new URL(location.href);
    const qid = url.searchParams.get('id');
    const hashId = (location.hash || '').replace(/^#/, '');
    const targetId = qid ? `mv-${qid}` : (hashId.startsWith('mv-') ? hashId : '');

    if (targetId) highlightRow(targetId);

    window.addEventListener('hashchange', () => {
      const h = (location.hash || '').replace(/^#/, '');
      if (h) highlightRow(h);
    }, { passive: true });
  }

  function highlightRow(rowId) {
    const tr = document.getElementById(rowId);
    if (!tr) return;
    const prevTab = tr.tabIndex; tr.tabIndex = -1;
    tr.focus({ preventScroll: true });
    tr.classList.add('row-highlight');
    tr.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => tr.classList.remove('row-highlight'), 1800);
    tr.tabIndex = prevTab;
  }

  document.addEventListener('DOMContentLoaded', load);
})();
