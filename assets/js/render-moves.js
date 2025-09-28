const table = document.getElementById("moveTable");
const res = await fetch("../data/moves.json");
const moves = await res.json();

const headers = ["ID","技名","属性","威力","消費ST","分類","効果"];
table.innerHTML = `<thead><tr>${headers.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody></tbody>`;
const tbody = table.querySelector("tbody");

moves.forEach(v=>{
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${v.id}</td><td>${v.name}</td><td>${v.attr}</td>
    <td>${v.power ?? "-"}</td><td>${v.cost ?? "-"}</td>
    <td>${v.category}</td><td>${v.note ?? ""}</td>`;
  tbody.appendChild(tr);
});
