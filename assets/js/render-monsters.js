// 一覧表示専用：pages/monsters.html から読み込まれる前提
(() => {
  const table = document.getElementById("monTable");
  if (!table) return;

  const EL_ICON = { 炎:'🔥', 水:'💧', 風:'🌪️', 土:'⛰️', 雷:'⚡', 氷:'❄️', 光:'✨', 闇:'🌑' };

  async function load() {
    const res = await fetch("../data/monsters.json", { cache: "no-store" });
    const mons = await res.json();

    // ヘッダ
    const headers = ["ID","名前","属性","HP","ST","ATK","DEF","MAG","SPD"];
    table.innerHTML = `<thead><tr>${headers.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody></tbody>`;
    const tbody = table.querySelector("tbody");

    // 行生成（行IDは mon-<id>）
    mons.forEach(m => {
      const tr = document.createElement("tr");
      tr.id = `mon-${m.id}`;
      tr.innerHTML = `
        <td><a href="#mon-${m.id}" class="row-anchor" aria-label="この行へのリンク">${m.id}</a></td>
        <td>${m.name}</td>
        <td>${(EL_ICON[m.attr] || "")} ${m.attr ?? ""}</td>
        <td>${m.hp ?? ""}</td>
        <td>${m.st ?? ""}</td>
        <td>${m.atk ?? ""}</td>
        <td>${m.def ?? ""}</td>
        <td>${m.mag ?? ""}</td>
        <td>${m.spd ?? ""}</td>
      `;
      tbody.appendChild(tr);
    });

    // 件数表示
    const countEl = document.getElementById("monCount");
    if (countEl) countEl.textContent = `登録数：${mons.length} 体`;

    // 深リンク対応（?id= / #mon-）
    const url = new URL(location.href);
    const qid = url.searchParams.get('id');
    const hashId = (location.hash || '').replace(/^#/, '');
    const targetId = qid ? `mon-${qid}` : (hashId.startsWith('mon-') ? hashId : '');

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
