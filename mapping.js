var qwerty = {
  grid: "qwertyuiopasdfghjkl;zxcvbnm,./",
  actions: {
    store: 'Space',
    flatten: 'Backspace',
    undo: '-',
    redo: '=',
    hold: 'Shift',
    halve: '[',
    double: ']'
  }
}

var qwertz = {
  grid: "qwertzuiopasdfghjklöyxcvbnm,.-",
  actions: {
    store: 'Space',
    flatten: 'Backspace',
    undo: 'ß',
    redo: '´',
    hold: 'Shift',
    halve: 'ü',
    double: '+'
  }
}

module.exports = {
  default: qwerty,

  // Mac:
  "German": qwertz,

  // Linux:
  'de': qwertz,      // German
  'de(mac)': qwertz, // German (mac)

  // Windows:
  '0407': qwertz     // German (standard)
}