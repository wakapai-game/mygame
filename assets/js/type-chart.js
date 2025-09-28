const el = document.getElementById('chart');
fetch('../data/types.json').then(r=>r.json()).then(d=>{
  const {types, matrix} = d;
  const table = document.createElement('table');
  table.className = 'matrix';
  const thead = document.createElement('thead');
  thead.innerHTML = '<tr><th>攻→防</th>' + types.map(t=>`<th>${t}</th>`).join('') + '</tr>';
  table.appendChild(thead);
  const tbody = document.createElement('tbody');
  matrix.forEach((row,i)=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<th>${types[i]}</th>` + row.map(v=>`<td data-v="${v}">${v}</td>`).join('');
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  el.appendChild(table);