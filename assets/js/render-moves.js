const $ = (s, r=document) => r.querySelector(s);
const tbody = $("#mvTbl tbody");
const q = $("#q");
let data = [];
function render(){
  const term = (q.value||"").trim();
  const filtered = data.filter(m => !term || Object.values(m).some(v => String(v).includes(term)));
  tbody.innerHTML = filtered.map(m => `
    <tr>
      <td>${m.name}</td><td>${m.type}</td><td>${m.cat||"-"}</td>
      <td>${m.power??"-"}</td><td>${m.cost??"-"}</td>
      <td>${m.effect|| (m.tags? m.tags.join(', '): '-')}</td>
    </tr>`).join("");
}
fetch("../data/moves.json").then(r=>r.json()).then(j=>{ data=j; render(); });
q.addEventListener("input", render);