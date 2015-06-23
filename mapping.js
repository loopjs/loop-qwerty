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
  "com.apple.keylayout.German": qwertz
}