const wrap = document.getElementById("typeChart");
const types = await (await fetch("../data/types.json")).json();

function badge(t){ return `<span class="type-badge">${t}</span>`; }

Object.keys(types).forEach(attacker=>{
  const row = document.createElement("div");
  row.className = "type-row";
  const cells = [`<strong>${badge(attacker)} ▶</strong>`];

  const rowData = types[attacker]; // { super:[], resist:[], immune:[] }
  if(rowData.super?.length) cells.push(`<span>×2: ${rowData.super.map(badge).join(" ")}</span>`);
  if(rowData.resist?.length) cells.push(`<span>×0.5: ${rowData.resist.map(badge).join(" ")}</span>`);
  if(rowData.immune?.length) cells.push(`<span>×0: ${rowData.immune.map(badge).join(" ")}</span>`);

  row.innerHTML = cells.join(" ");
  wrap.appendChild(row);
});
