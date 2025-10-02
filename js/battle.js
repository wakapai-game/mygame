// Battle logic
window.Battle = {
  battleState: null,
  init: function() {
    // Set up button handlers
    document.getElementById('btn-guard').addEventListener('click', () => {
      if (this.battleState && this.battleState.awaiting === 'player') {
        this.playerGuard();
      }
    });
    document.getElementById('btn-swap').addEventListener('click', () => {
      if (this.battleState && this.battleState.awaiting === 'player') {
        this.playerSwap();
      }
    });
    document.getElementById('btn-surrender').addEventListener('click', () => {
      if (this.battleState && this.battleState.inProgress) {
        this.endBattle('enemy', '降参しました。');
      }
    });
    // Restart button is bound in main
  },
  // Start the battle: prepare players and enemies and begin the first turn
  startBattle: function() {
    const playerSide = {
      units: Game.state.playerParty.map(mon => ({
        base: mon,
        hp: mon.hp,
        st: mon.st,
        atk: mon.atk,
        def: mon.def,
        mag: mon.mag,
        spd: mon.spd,
        attr: mon.attr,
        moves: Game.state.skillAssignments[mon.id] ? Game.state.skillAssignments[mon.id].slice() : [],
        guard: false,
        alive: true
      })),
      frontIndex: 0
    };
    // If any unit has less than 4 moves (should not happen), fill random moves
    playerSide.units.forEach(u => {
      if (!u.moves || u.moves.length < 4) {
        const pool = Game.moves.map(m => m.id);
        while (u.moves.length < 4) {
          const id = Util.sample(pool, 1)[0];
          if (!u.moves.includes(id)) u.moves.push(id);
        }
      }
    });
    // Create enemy side: choose first 3 of enemyCandidates
    const chosenEnemies = Game.state.enemyCandidates.slice(0,3);
    const enemySide = {
      units: chosenEnemies.map(mon => ({
        base: mon,
        hp: mon.hp,
        st: mon.st,
        atk: mon.atk,
        def: mon.def,
        mag: mon.mag,
        spd: mon.spd,
        attr: mon.attr,
        moves: Util.sample(Game.moves.map(m => m.id), 4),
        guard: false,
        alive: true
      })),
      frontIndex: 0
    };
    this.battleState = {
      players: playerSide,
      enemies: enemySide,
      turnQueue: [],
      awaiting: null,
      log: [],
      inProgress: true
    };
    // Initial render
    this.renderBattle();
    // Begin first turn
    this.startTurn();
  },
  // Render battle UI
  renderBattle: function() {
    const state = this.battleState;
    if (!state) return;
    // Player status
    const ps = document.getElementById('player-status');
    ps.innerHTML = '';
    state.players.units.forEach((u, idx) => {
      const div = document.createElement('div');
      div.className = 'monster-status';
      if (idx === state.players.frontIndex && u.alive) div.classList.add('front');
      const hpPercent = Math.max(0, Math.floor((u.hp / u.base.hp) * 100));
      const stPercent = Math.max(0, Math.floor((u.st / u.base.st) * 100));
      div.innerHTML = `
        <strong>${u.base.name}${!u.alive ? ' (気絶)' : ''}</strong>
        <div class="status-bar">
          <span class="status">HP:</span>
          <span class="hp"><div style="width:${hpPercent}%;"></div></span>
          <span class="status">${u.hp}/${u.base.hp}</span>
        </div>
        <div class="status-bar">
          <span class="status">ST:</span>
          <span class="st"><div style="width:${stPercent}%;"></div></span>
          <span class="status">${u.st}/${u.base.st}</span>
        </div>
        <div class="status-bar">
          <span class="status">SPD:${u.spd}</span>
        </div>`;
      ps.appendChild(div);
    });
    // Enemy status
    const es = document.getElementById('enemy-status');
    es.innerHTML = '';
    state.enemies.units.forEach((u, idx) => {
      const div = document.createElement('div');
      div.className = 'monster-status';
      if (idx === state.enemies.frontIndex && u.alive) div.classList.add('front');
      const hpPercent = Math.max(0, Math.floor((u.hp / u.base.hp) * 100));
      div.innerHTML = `
        <strong>${u.base.name}${!u.alive ? ' (気絶)' : ''}</strong>
        <div class="status-bar">
          <span class="status">HP:</span>
          <span class="hp"><div style="width:${hpPercent}%;"></div></span>
          <span class="status">${u.hp}/${u.base.hp}</span>
        </div>
        <div class="status-bar">
          <span class="status">SPD:${u.spd}</span>
        </div>`;
      es.appendChild(div);
    });
    // Update skill buttons for player's front
    const sb = document.getElementById('skill-buttons');
    sb.innerHTML = '';
    if (state.inProgress && state.awaiting === 'player') {
      const front = state.players.units[state.players.frontIndex];
      front.moves.forEach(moveId => {
        const move = Game.moves.find(m => m.id === moveId);
        if (!move) return;
        const btn = document.createElement('button');
        btn.textContent = `${move.name} (${move.attr})`;
        // Disable if not enough ST or if front is not alive
        if (!front.alive || front.st < move.cost) {
          btn.disabled = true;
        }
        btn.addEventListener('click', () => {
          this.playerUseMove(move);
        });
        sb.appendChild(btn);
      });
    }
    // Update log
    const log = document.getElementById('battle-log');
    log.innerHTML = '';
    state.log.forEach(line => {
      const p = document.createElement('p');
      p.textContent = line;
      log.appendChild(p);
    });
    // Scroll to bottom
    log.scrollTop = log.scrollHeight;
    // Enable/disable command buttons based on awaiting
    const guardBtn = document.getElementById('btn-guard');
    const swapBtn = document.getElementById('btn-swap');
    const surrenderBtn = document.getElementById('btn-surrender');
    guardBtn.disabled = !(state.inProgress && state.awaiting === 'player');
    swapBtn.disabled = !(state.inProgress && state.awaiting === 'player');
    surrenderBtn.disabled = !state.inProgress;
  },
  // Start a new turn: determine turn order queue by SPD
  startTurn: function() {
    const state = this.battleState;
    if (!state || !state.inProgress) return;
    // Reset turn queue
    state.turnQueue = [];
    // Determine SPD of current front
    const pFront = state.players.units[state.players.frontIndex];
    const eFront = state.enemies.units[state.enemies.frontIndex];
    const pSPD = pFront.spd;
    const eSPD = eFront.spd;
    // Determine order: high SPD goes first; equal: random
    if (pSPD > eSPD) {
      state.turnQueue.push('player', 'enemy');
    } else if (eSPD > pSPD) {
      state.turnQueue.push('enemy', 'player');
    } else {
      // random
      if (Math.random() < 0.5) state.turnQueue.push('player','enemy');
      else state.turnQueue.push('enemy','player');
    }
    // Start processing actions
    this.nextAction();
  },
  nextAction: function() {
    const state = this.battleState;
    if (!state || !state.inProgress) return;
    // If queue is empty, end of turn: recover ST for bench, then start new turn
    if (state.turnQueue.length === 0) {
      // ST recovery: for each back unit (not front, alive), recover 1% of max st (min 1)
      this.recoverBackStamina();
      // After recovery, check if battle still ongoing
      if (state.inProgress) {
        // Start next turn
        this.startTurn();
      }
      return;
    }
    // Pop next side
    const side = state.turnQueue.shift();
    if (side === 'player') {
      // Wait for player's input
      state.awaiting = 'player';
      this.renderBattle();
      // Player will call back via UI; do not continue until player's action triggers call
    } else {
      // Enemy's action
      state.awaiting = 'enemy';
      this.renderBattle();
      // Delay a bit for readability
      setTimeout(() => {
        this.enemyAct();
      }, 300);
    }
  },
  // Player actions
  playerUseMove: function(move) {
    const state = this.battleState;
    if (!state || state.awaiting !== 'player') return;
    const attacker = state.players.units[state.players.frontIndex];
    const defender = state.enemies.units[state.enemies.frontIndex];
    this.executeMove('player', attacker, defender, move);
    // After player's action, proceed to next in queue
    this.postAction();
  },
  playerGuard: function() {
    const state = this.battleState;
    if (!state || state.awaiting !== 'player') return;
    const attacker = state.players.units[state.players.frontIndex];
    attacker.guard = true;
    state.log.push(`${attacker.base.name} はガードした！`);
    this.postAction();
  },
  playerSwap: function() {
    const state = this.battleState;
    if (!state || state.awaiting !== 'player') return;
    // Find next alive unit
    const nextIndex = this.findNextAlive(state.players.units, state.players.frontIndex);
    if (nextIndex === null) {
      state.log.push('交代できるモンスターがいません！');
      this.renderBattle();
      return;
    }
    state.players.frontIndex = nextIndex;
    state.log.push('モンスターを交代した！');
    this.postAction();
  },
  // After player's action or guard/swap, continue queue
  postAction: function() {
    const state = this.battleState;
    if (!state || !state.inProgress) return;
    // Clear awaiting flag
    state.awaiting = null;
    // Render updated
    this.renderBattle();
    // Continue to next action
    this.nextAction();
  },
  // Enemy chooses and executes action
  enemyAct: function() {
    const state = this.battleState;
    if (!state || state.awaiting !== 'enemy' || !state.inProgress) return;
    const attacker = state.enemies.units[state.enemies.frontIndex];
    const defender = state.players.units[state.players.frontIndex];
    // If attacker has no ST or no moves, maybe guard or swap
    // Determine available moves
    const availableMoves = attacker.moves
      .map(id => Game.moves.find(m => m.id === id))
      .filter(m => m && attacker.st >= m.cost);
    let actionType = 'move';
    let chosenMove = null;
    // 20% chance to guard if low HP
    if (attacker.hp < attacker.base.hp * 0.3 && Math.random() < 0.2) {
      actionType = 'guard';
    }
    // If no moves available, or random guard chosen
    if (actionType === 'guard' || availableMoves.length === 0) {
      attacker.guard = true;
      state.log.push(`${attacker.base.name} は身を守っている！`);
    } else {
      chosenMove = availableMoves[Util.randomInt(0, availableMoves.length - 1)];
      this.executeMove('enemy', attacker, defender, chosenMove);
    }
    // After enemy's action, clear awaiting and continue
    state.awaiting = null;
    this.renderBattle();
    this.nextAction();
  },
  // Execute a move from attacker to defender
  executeMove: function(side, attacker, defender, move) {
    const state = this.battleState;
    if (!state || !state.inProgress) return;
    if (!attacker.alive || !defender.alive) return;
    const attackerName = attacker.base.name;
    const defenderName = defender.base.name;
    // Determine number of hits
    let hits = 1;
    if (typeof move.hits === 'string' && move.hits.includes('-')) {
      const parts = move.hits.split('-');
      const min = parseInt(parts[0], 10);
      const max = parseInt(parts[1], 10);
      hits = Util.randomInt(min, max);
    } else {
      const h = parseInt(move.hits, 10);
      hits = isNaN(h) ? 1 : h;
    }
    // ST cost consumed by attacker on use
    if (attacker.st >= move.cost) {
      attacker.st -= move.cost;
    } else {
      // not enough ST, should not happen because UI prevents this
      state.log.push(`${attackerName} は技を使うためのスタミナが足りない！`);
      return;
    }
    // For each hit
    for (let i = 0; i < hits; i++) {
      if (!defender.alive) break;
      // Determine attack stat and defense stat
      const attackStat = (move.type === '物理' ? attacker.atk : attacker.mag);
      const defenseStat = (move.type === '物理' ? defender.def : defender.mag);
      // Base damage
      const base = Math.floor(move.pow * (10 + attackStat) / (10 + defenseStat));
      // STAB
      const stab = attacker.attr === move.attr ? 2.0 : 1.0;
      // Effectiveness
      const effect = Affinity.getEffect(move.attr, defender.attr);
      // Random factor between 0.85 and 1.0
      const rand = Util.randomFloat(0.85, 1.0);
      let dmg = Math.floor(base * stab * effect * rand);
      // Guard reduces damage to half
      if (defender.guard) {
        dmg = Math.floor(dmg / 2);
        defender.guard = false;
      }
      // Apply damage
      defender.hp -= dmg;
      if (defender.hp < 0) defender.hp = 0;
      // Log
      const effText = effect > 1.0 ? ' (効果ばつぐん！)' : effect < 1.0 ? ' (効果はいまひとつ…)' : '';
      state.log.push(`${attackerName} の ${move.name}! ${defenderName} に ${dmg} ダメージ${effText}`);
      // ST consumption when hit: defender loses 10 or 20 ST depending on weakness
      let stLoss = 10;
      if (effect > 1.0) stLoss = 20;
      defender.st -= stLoss;
      if (defender.st < 0) {
        // HP takes deficit
        defender.hp += defender.st;
        defender.st = 0;
        if (defender.hp < 0) defender.hp = 0;
      }
      // Check if defender fainted
      if (defender.hp <= 0) {
        defender.alive = false;
        state.log.push(`${defenderName} は倒れた！`);
        // Swap to next if available
        if (side === 'player') {
          // player's move, so defender side is enemy
          this.swapDefeated('enemy');
        } else {
          this.swapDefeated('player');
        }
        break;
      }
    }
    // After move, update UI
    this.renderBattle();
  },
  // Recover stamina for units in back row
  recoverBackStamina: function() {
    const state = this.battleState;
    ['players','enemies'].forEach(sideKey => {
      const side = state[sideKey];
      side.units.forEach((u, idx) => {
        if (!u.alive) return;
        if (idx !== side.frontIndex) {
          // Recover 1% of max ST (min 1)
          const recover = Math.max(1, Math.floor(u.base.st * 0.01));
          u.st += recover;
          if (u.st > u.base.st) u.st = u.base.st;
        }
      });
    });
  },
  // Find next alive unit after current index; returns index or null
  findNextAlive: function(units, currentIndex) {
    for (let i = 0; i < units.length; i++) {
      const idx = (currentIndex + 1 + i) % units.length;
      if (idx !== currentIndex && units[idx].alive) return idx;
    }
    return null;
  },
  // Swap to next alive unit when current is defeated (automatic)
  swapDefeated: function(sideKey) {
    const state = this.battleState;
    const side = state[sideKey + 's']; // 'players' or 'enemies'
    const next = this.findNextAlive(side.units, side.frontIndex);
    if (next !== null) {
      side.frontIndex = next;
    } else {
      // No alive left: battle ends
      const winner = (sideKey === 'player' ? 'enemy' : 'player');
      this.endBattle(winner, `${sideKey === 'player' ? 'あなた' : '相手'}のモンスターが全滅しました。`);
    }
  },
  // End the battle
  endBattle: function(winner, reason) {
    const state = this.battleState;
    state.inProgress = false;
    state.awaiting = null;
    if (winner === 'player') {
      state.log.push('勝利！ ' + (reason || ''));
    } else {
      state.log.push('敗北… ' + (reason || ''));
    }
    state.log.push('プレイしていただきありがとうございました！ ぜひご意見をお寄せください。');
    this.renderBattle();
  }
};