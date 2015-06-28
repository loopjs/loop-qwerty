// keyIdentifier returns bizarre results on linux 
// see https://code.google.com/p/chromium/issues/detail?id=51024
// here we make sense of it:

var lookup = {
  'U+00A0': 'Shift',   // Left Shift
  'U+00A1': 'Shift',   // Right Shift
  'U+00A2': 'Control', // Control
  'U+00A4': 'Alt',     // Left Alt
  'U+00E1': 'Alt',     // Right Alt
  'Win':    'Meta',    // Meta
  'U+00C0': 'U+0060',  // `
  'U+00BD': 'U+002D',  // -
  'U+00BB': 'U+003D',  // =
  'U+00DB': 'U+005B',  // [
  'U+00DD': 'U+005D',  // ]
  'U+00DC': 'U+005C',  // \
  'U+00BA': 'U+003B',  // ;
  'U+00DE': 'U+0027',  // '
  'U+00BC': 'U+002C',  // ,
  'U+00BE': 'U+002E',  // .
  'U+00BF': 'U+002F'   // /
}

module.exports = function getIdentifier(event) {
  if (event.keyIdentifier === 'Unidentified') {
    return event.keyCode
  } else {
    return lookup[event.keyIdentifier] || event.keyIdentifier
  }
}