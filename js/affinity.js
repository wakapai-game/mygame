// Affinity (type effectiveness) utilities
window.Affinity = {
  types: { order: [], effect: {} },
  // Load type definitions. When running from file://, we cannot use fetch due to CORS,
  // so we read the global TYPES object if available. Otherwise fallback to empty definitions.
  load: async function() {
    // If TYPES is defined globally (via data/types.js), use it. Otherwise keep defaults.
    if (typeof window.TYPES !== 'undefined') {
      this.types = window.TYPES;
    } else {
      console.warn('TYPES is not defined; type effectiveness will default to neutral.');
      this.types = { order: [], effect: {} };
    }
  },
  getEffect: function(att, def) {
    const effMap = this.types.effect || {};
    if (!effMap[att] || typeof effMap[att][def] === 'undefined') {
      return 1.0;
    }
    return effMap[att][def];
  },
  getSymbol: function(mult) {
    if (mult > 1.0) return '〇';
    if (mult < 1.0) return '×';
    return '';
  },
  renderMatrix: function(container) {
    const { order, effect } = this.types;
    if (!order || !order.length) {
      container.innerHTML = '';
      return;
    }
    let html = '<table style="border-collapse: collapse; font-size:0.8rem;"><thead><tr><th style="padding:4px;border:1px solid #ccc;"></th>';
    for (const def of order) {
      html += `<th style="padding:4px;border:1px solid #ccc;">${def}</th>`;
    }
    html += '</tr></thead><tbody>';
    for (const att of order) {
      html += `<tr><th style="padding:4px;border:1px solid #ccc;">${att}</th>`;
      for (const def of order) {
        const m = effect[att] && effect[att][def] !== undefined ? effect[att][def] : 1.0;
        const symbol = this.getSymbol(m) || '-';
        html += `<td style="padding:4px;border:1px solid #ccc;text-align:center">${symbol}</td>`;
      }
      html += '</tr>';
    }
    html += '</tbody></table>';
    container.innerHTML = html;
  }
};