// Type effectiveness definitions loaded into global scope
// This file defines the order of elements and their effectiveness against each other.
// It mirrors the structure previously defined in types.json but is loaded via a script
// to avoid CORS issues when running from the file system.

window.TYPES = {
  order: ["炎", "水", "風", "土", "雷", "氷", "光", "闇"],
  effect: {
    "炎": { "氷": 1.5, "風": 1.0, "水": 0.5, "土": 0.5, "雷": 1.0, "光": 1.0, "闇": 1.0 },
    "水": { "炎": 1.5, "土": 1.5, "雷": 0.5, "風": 1.0, "氷": 1.0, "光": 1.0, "闇": 1.0 },
    "風": { "土": 1.5, "氷": 0.5, "炎": 1.0, "水": 1.0, "雷": 1.0, "光": 1.0, "闇": 1.0 },
    "土": { "雷": 1.5, "風": 0.5, "水": 0.5, "炎": 1.0, "氷": 1.0, "光": 1.0, "闇": 1.0 },
    "雷": { "水": 1.5, "土": 0.5, "炎": 1.0, "風": 1.0, "氷": 1.0, "光": 1.0, "闇": 1.0 },
    "氷": { "風": 1.5, "炎": 0.5, "水": 1.0, "土": 1.0, "雷": 1.0, "光": 1.0, "闇": 1.0 },
    "光": { "闇": 1.5, "炎": 1.0, "水": 1.0, "風": 1.0, "土": 1.0, "雷": 1.0, "氷": 1.0 },
    "闇": { "光": 1.5, "炎": 1.0, "水": 1.0, "風": 1.0, "土": 1.0, "雷": 1.0, "氷": 1.0 }
  }
};