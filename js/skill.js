// Skill selection screen logic
window.Skill = {
  activeMonId: null,
  init: function() {
    // Button: to battle
    document.getElementById('btn-to-battle').addEventListener('click', () => {
      // ensure assignments complete
      if (this.isComplete()) {
        Game.showBattleScreen();
      } else {
        alert('全てのモンスターに4つの技を設定してください。');
      }
    });
    // Back button (bound in main)
  },
  isComplete: function() {
    const party = Game.state.playerParty;
    for (const mon of party) {
      const list = Game.state.skillAssignments[mon.id];
      if (!list || list.length !== 4) return false;
    }
    return party.length === 3;
  },
  // Render skill selection UI
  render: function() {
    // Fill enemy list
    const enemyContainer = document.getElementById('skill-enemy');
    enemyContainer.innerHTML = '';
    Game.state.enemyCandidates.forEach(mon => {
      const div = document.createElement('div');
      div.className = 'mon-card';
      div.innerHTML = `<strong>${mon.name}</strong><br><small>${mon.attr}</small>`;
      enemyContainer.appendChild(div);
    });
    // Tabs for player's monsters
    const tabs = document.getElementById('skill-tabs');
    tabs.innerHTML = '';
    Game.state.playerParty.forEach((mon, idx) => {
      const btn = document.createElement('button');
      btn.textContent = mon.name;
      btn.dataset.monId = mon.id;
      if (!this.activeMonId) this.activeMonId = mon.id;
      if (this.activeMonId === mon.id) {
        btn.classList.add('active');
      }
      btn.addEventListener('click', () => {
        this.activeMonId = mon.id;
        this.render(); // re-render to update active tab and moves
      });
      tabs.appendChild(btn);
    });
    // Render move panel for active mon
    this.renderPanel();
    // Update battle button state
    document.getElementById('btn-to-battle').disabled = !this.isComplete();
  },
  renderPanel: function() {
    const panel = document.getElementById('skill-panel');
    panel.innerHTML = '';
    const monId = this.activeMonId;
    if (!monId) return;
    const assignments = Game.state.skillAssignments[monId] || [];
    // Show selected list
    const selectedDiv = document.createElement('div');
    selectedDiv.className = 'move-list';
    selectedDiv.style.marginBottom = '8px';
    selectedDiv.innerHTML = '<strong>選択済み:</strong>';
    assignments.forEach(moveId => {
      const move = Game.moves.find(m => m.id === moveId);
      if (move) {
        const mdiv = document.createElement('div');
        mdiv.className = 'move-card selected';
        mdiv.textContent = `${move.name} (${move.attr} ${move.type} Pow:${move.pow} ST:${move.cost})`;
        mdiv.addEventListener('click', () => {
          // remove this move
          const idx = assignments.indexOf(moveId);
          if (idx >= 0) assignments.splice(idx, 1);
          Game.state.skillAssignments[monId] = assignments;
          this.render();
        });
        selectedDiv.appendChild(mdiv);
      }
    });
    panel.appendChild(selectedDiv);
    // Available moves
    const movesDiv = document.createElement('div');
    movesDiv.className = 'move-list';
    Game.moves.forEach(move => {
      const mdiv = document.createElement('div');
      mdiv.className = 'move-card';
      mdiv.dataset.moveId = move.id;
      // mark selected
      if (assignments.includes(move.id)) {
        mdiv.classList.add('selected');
      }
      mdiv.innerHTML = `<strong>${move.name}</strong><br><small>${move.attr} ${move.type} Pow:${move.pow} ST:${move.cost}</small>`;
      // disable if already selected 4 and this move is not selected
      if (assignments.length >= 4 && !assignments.includes(move.id)) {
        mdiv.style.opacity = '0.5';
        mdiv.style.pointerEvents = 'none';
      } else {
        mdiv.addEventListener('click', () => {
          // toggle select
          const idx = assignments.indexOf(move.id);
          if (idx >= 0) {
            assignments.splice(idx, 1);
          } else {
            if (assignments.length < 4) {
              assignments.push(move.id);
            }
          }
          Game.state.skillAssignments[monId] = assignments;
          this.render();
        });
      }
      movesDiv.appendChild(mdiv);
    });
    panel.appendChild(movesDiv);
    // update button
    document.getElementById('btn-to-battle').disabled = !this.isComplete();
  }
};