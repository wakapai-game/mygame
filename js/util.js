// Utility functions used across the game
window.Util = {
  // Return a random integer between min and max inclusive
  randomInt: function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  // Return a random float between min (inclusive) and max (exclusive)
  randomFloat: function(min, max) {
    return Math.random() * (max - min) + min;
  },
  // Shuffle an array (returns new array)
  shuffle: function(arr) {
    return arr
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  },
  // Sample n distinct items from an array
  sample: function(arr, n) {
    const copy = arr.slice();
    const result = [];
    for (let i = 0; i < n && copy.length > 0; i++) {
      const idx = this.randomInt(0, copy.length - 1);
      result.push(copy.splice(idx, 1)[0]);
    }
    return result;
  }
};