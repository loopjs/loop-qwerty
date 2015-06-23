var aliased = new Map()
aliased.set("´", 187)
aliased.set("Backspace", "U+0008")
aliased.set("Space", "U+0020")

module.exports = function(key) {
  if (aliased.has(key)) {
    return aliased.get(key)
  } else if (typeof key === 'string'){
    if (key.length > 1) {
      return key
    } else {
      return toUnicode(normalizeCase(key).charCodeAt(0))
    }
  } else if (key === 'number') {
    return toUnicode(key)
  }
}

function toUnicode(number){
  return "U+"+("0000" + number.toString(16).toUpperCase()).slice(-4)
}

function normalizeCase(input) {
  return input.replace(/[a-z]/g, function(match) {
    return match.toUpperCase()
  })
}