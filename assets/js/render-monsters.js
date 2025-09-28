const $ = (s, r=document) => r.querySelector(s);
const tbody = $("#monTbl tbody");
const q = $("#q");
let data = [];
function render(){
  const term = (q.value||"").trim();
  const filtered = data.filter(m => !term || Object.values(m).some(v => String(v).includes(term)));
  tbody.innerHTML = filtered.map(m => `
    <tr>
      <td>${m.name}</td><td>${m.type}</td>
      <td>${m.hp}</td><td>${m.st}</td><td>${m.atk}</td>
      <td>${m.def}</td><td>${m.mag}</td><td>${m.spd}</td>
    </tr>`).join("");
}
fetch("../data/monsters.json").then(r=>r.json()).then(j=>{ data=j; render(); });
q.addEventListener("input", render);