const table = document.getElementById("monTable");
const res = await fetch("../data/monsters.json");
const mons = await res.json();

const headers = ["ID","名前","属性","HP","ST","ATK","DEF","MAG","SPD"];
table.innerHTML = `<thead><tr>${headers.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody></tbody>`;
const tbody = table.querySelector("tbody");

mons.forEach(m=>{
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${m.id}</td><td>${m.name}</td><td>${m.attr}</td>
    <td>${m.hp}</td><td>${m.st}</td><td>${m.atk}</td>
    <td>${m.def}</td><td>${m.mag}</td><td>${m.spd}</td>`;
  tbody.appendChild(tr);
});
