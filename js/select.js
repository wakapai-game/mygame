// Monster selection screen logic
window.Select = {
  init: function() {
    // Event: '技を選ぶ' button
    document.getElementById('btn-to-skill').addEventListener('click', () => {
      // Only proceed if at least 3 selected
      if (Game.state.playerParty.length === 3) {
        Game.showSkillScreen();
      }
    });
    // Event: Recommend button (simple suggestion)
    document.getElementById('btn-recommend').addEventListener('click', () => {
      // Provide simple recommendation: pick monsters strong against enemy candidates' types
      const enemyAttrs = Game.state.enemyCandidates.map(m => m.attr);
      let message = '';
      // Count advantage for each monster
      const monsters = Game.monsters.map(m => {
        let score = 0;
        enemyAttrs.forEach(ea => {
          const eff = Affinity.getEffect(m.attr, ea);
          if (eff > 1.0) score++;
          else if (eff < 1.0) score -= 0.5;
        });
        return { name: m.name, score };
      });
      monsters.sort((a,b) => b.score - a.score);
      message = monsters.slice(0,3).map(m => `${m.name} (スコア:${m.score.toFixed(1)})`).join('\n');
      alert('おすすめモンスター:\n' + message);
    });
    // Back button events bound in main.js
  },
  // Render selection screen
  render: function() {
    const enemyContainer = document.getElementById('enemy-candidates');
    const playerContainer = document.getElementById('player-list');
    const countEl = document.getElementById('selected-count');
    // If enemyCandidates not chosen or length not 6, choose random 6 from all monsters
    if (!Game.state.enemyCandidates || Game.state.enemyCandidates.length !== 6) {
      Game.state.enemyCandidates = Util.sample(Game.monsters, Math.min(6, Game.monsters.length));
    }
    // Render enemy candidates
    enemyContainer.innerHTML = '';
    Game.state.enemyCandidates.forEach(mon => {
      const div = document.createElement('div');
      div.className = 'mon-card';
      div.innerHTML = `<strong>${mon.name}</strong><br><small>${mon.attr}</small>`;
      enemyContainer.appendChild(div);
    });
    // Render player list
    playerContainer.innerHTML = '';
    Game.monsters.forEach(mon => {
      const div = document.createElement('div');
      div.className = 'mon-card';
      div.dataset.monId = mon.id;
      // Mark selected
      if (Game.state.playerParty.some(p => p.id === mon.id)) {
        div.classList.add('selected');
      }
      div.innerHTML = `<strong>${mon.name}</strong><br><small>${mon.attr}</small>`;
      // Click handler
      div.addEventListener('click', () => {
        this.toggleSelection(mon);
      });
      playerContainer.appendChild(div);
    });
    // Update counter and button state
    countEl.textContent = `${Game.state.playerParty.length}/3`;
    const btnSkill = document.getElementById('btn-to-skill');
    btnSkill.disabled = Game.state.playerParty.length !== 3;
    // Render type chart
    Affinity.renderMatrix(document.getElementById('type-chart'));
  },
  toggleSelection: function(mon) {
    const index = Game.state.playerParty.findIndex(m => m.id === mon.id);
    if (index >= 0) {
      // Deselect
      Game.state.playerParty.splice(index, 1);
      delete Game.state.skillAssignments[mon.id];
    } else {
      if (Game.state.playerParty.length >= 3) {
        alert('選べるモンスターは3体までです。');
        return;
      }
      Game.state.playerParty.push(mon);
    }
    this.render();
  }
};