var watch = require('observ/watch')
var Observ = require('observ')

module.exports = InputStack

function InputStack(){

  var keysDown = null
  var stack = []
  var release = null

  function grab(){
    var input = this
    var index = stack.indexOf(input)
    if (!stack.length || index < stack.length - 1){
      
      release&&release()
      if (stack.length){
        stack[stack.length-1].set([])
      }

      if (~index){
        stack.splice(index, 1)
      }
      stack.push(input)
      release = watch(getKeysDown(), input.set)
    }
  }

  function close(){
    var input = this

    if (stack.length){
      var index = stack.indexOf(input)
      if (index === stack.length-1){
        release&&release()
        stack.pop()
        release = stack.length ? 
          watch(getKeysDown(), stack[stack.length-1].set) : 
          null
      }
    }

    input.set([])
  }

  function getKeysDown(){
    return keysDown = keysDown || KeysDown()
  }

  return function(){
    var input = Observ([])
    input.grab = grab.bind(input)
    input.close = close.bind(input)
    input.grab()
    return input
  }

}

var ignore = ['INPUT', 'TEXTAREA', 'SELECT']
function KeysDown(){

  var obs = Observ([])

  function handleEvent(e){
    var el = document.activeElement
    if (!el || (!~ignore.indexOf(el.nodeName) && el.contentEditable !== 'true')){
      var index = obs().indexOf(e.keyCode)
      if (e.type === 'keydown'){
        if (!~index){
          var val = obs().concat()
          val.push(e.keyCode)
          obs.set(val)
        }
      } else if (e.type === 'keyup'){
        if (~index){
          var val = obs().concat()
          val.splice(index, 1)
          obs.set(val)
        }
      }
    }
  }

  document.addEventListener('keydown', handleEvent, false)
  document.addEventListener('keyup', handleEvent, false)

  obs.destroy = function(){
    document.removeEventListener('keydown', handleEvent, false)
    document.removeEventListener('keyup', handleEvent, false)
  }

  return obs
}