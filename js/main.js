// Main game controller
window.Game = {
  monsters: [],
  moves: [],
  state: {
    screen: 'start',          // current screen
    enemyCandidates: [],      // array of monster objects for enemy to preview
    playerParty: [],          // array of monster objects selected by player
    skillAssignments: {},     // mapping from monster ID -> array of move IDs
    battle: null              // battle state
  },
  // Initialize the game: load data and set up event handlers
  init: async function() {
    // Load monsters from global
    this.monsters = window.MONSTERS || [];
    // Load moves from global (defined in data/moves.js) instead of fetching JSON.
    const movesData = window.MOVES || [];
    // Normalize move data
    this.moves = movesData.map(m => {
      const hits = m.hits || 1;
      return {
        id: m.id,
        name: m.name,
        attr: m.attr || m.el || m.element || '無',
        type: m.type || m.kind || '物理',
        pow: m.pow || 0,
        cost: m.cost || 0,
        hits: hits
      };
    });
    // Load type effectiveness from global TYPES via Affinity.load()
    await Affinity.load();
    // Set initial state
    this.showStartScreen();
    // Bind global navigation buttons
    document.getElementById('btn-start').addEventListener('click', () => {
      this.showSelectScreen();
    });
    document.getElementById('btn-back-start').addEventListener('click', () => {
      this.showStartScreen();
    });
    document.getElementById('btn-back-select').addEventListener('click', () => {
      this.showSelectScreen();
    });
    document.getElementById('btn-restart').addEventListener('click', () => {
      this.showStartScreen();
    });
    // Initialize sub-modules
    Select.init();
    Skill.init();
    Battle.init();
  },
  // Switch visible screen
  switchScreen: function(screenId) {
    document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
    const el = document.getElementById(screenId);
    if (el) el.classList.add('active');
  },
  // Reset to start screen
  showStartScreen: function() {
    // reset state
    this.state = {
      screen: 'start',
      enemyCandidates: [],
      playerParty: [],
      skillAssignments: {},
      battle: null
    };
    this.switchScreen('start-screen');
  },
  // Show monster selection screen
  showSelectScreen: function() {
    if (!this.monsters || !this.monsters.length) {
      alert('モンスターのデータが読み込まれていません。');
      return;
    }
    this.state.screen = 'select';
    Select.render();
    this.switchScreen('select-screen');
  },
  // Show skill selection screen
  showSkillScreen: function() {
    this.state.screen = 'skill';
    Skill.render();
    this.switchScreen('skill-screen');
  },
  // Show battle screen and start battle
  showBattleScreen: function() {
    this.state.screen = 'battle';
    Battle.startBattle();
    this.switchScreen('battle-screen');
  }
};
// Initialize game when DOM ready
document.addEventListener('DOMContentLoaded', () => {
  Game.init().catch(err => {
    console.error(err);
    alert('ゲームの読み込みに失敗しました。' + err);
  });
});