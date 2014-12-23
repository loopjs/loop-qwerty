var LoopGrid = require('loop-grid')
var Holder = require('loop-grid-holder')
var Repeater = require('loop-grid-repeater')
var Suppressor = require('loop-grid-suppressor')

var computed = require('observ/computed')
var convertKeyCode = require('keycode')

var ArrayGrid = require('array-grid')

var Observ = require('observ')
var ObservKeys = require('./lib/observ-keys.js')
var ObservGrid = require('observ-grid')
var ObservGridGrabber = require('observ-grid/grabber')
var computeIndexesWhereContains = require('observ-grid/indexes-where-contains')
var watchStruct = require('./lib/watch-struct.js')
var mapWatchDiff = require('./lib/map-watch-diff-stack.js')
var watch = require('observ/watch')

var InputStack = require('./input-stack.js')

var DittyGridStream = require('ditty-grid-stream')

var repeatStates = [2, 1, 2/3, 1/2, 1/3, 1/4, 1/6, 1/8]

var versionKey = 1
var cacheKey = "__QWERTY_KEY_INPUT_CACHE@" + versionKey
var getInput = document[cacheKey] = document[cacheKey] || InputStack()

module.exports = function(opts){

  // resolve options
  var opts = Object.create(opts)
  var triggerOutput = opts.triggerOutput
  var scheduler = opts.scheduler
  var gridMapping = getGridMapping()
  opts.shape = gridMapping.shape

  // bind to qwerty keyboard
  var keysDown = getInput()

  // extend loop-grid instance
  var self = LoopGrid(opts)
  self.repeatLength = Observ(2)

  self.grabInput = function(){
    keysDown.grab()
  }

  // loop transforms
  var transforms = {
    holder: Holder(self.transform),
    repeater: Repeater(self.transform),
    suppressor: Suppressor(self.transform, gridMapping.shape, gridMapping.stride)
  }

  var controllerGrid = KeyboardGrid(keysDown, gridMapping)
  var inputGrabber = ObservGridGrabber(controllerGrid)

  var noRepeat = computeIndexesWhereContains(self.flags, 'noRepeat')
  var grabInputExcludeNoRepeat = inputGrabber.bind(this, {exclude: noRepeat})

  // trigger notes at bottom of input stack
  var output = DittyGridStream(inputGrabber, self.grid, scheduler)
  output.pipe(triggerOutput)

  var buttons = ObservKeys(keysDown, {
    store: 'enter',
    flatten: 'backspace',
    undo: '-',
    redo: '=',
    hold: 'shift',
    halve: '[',
    double: ']'
  })

  watchStruct(buttons, {

    store: function(value){
      if (value){
        self.store()
      }
    },
  
    flatten: function(value){
      if (value){
        if (self.transforms.getLength()){
          self.flatten()
        } else {
          transforms.suppressor.start()
          self.flatten()
          transforms.suppressor.stop()
        }
      }
    },
  
    undo: function(value){
      if (value){
        self.undo()
      }
    },
  
    redo: function(value){
      if (value){
        self.redo()
      }
    },
  
    hold: function(value){
      if (value){
        transforms.holder.start(scheduler.getCurrentPosition())
      } else {
        transforms.holder.stop()
      }
    },

    halve: function(value){
      if (value){
        var current = self.loopLength() || 1
        self.loopLength.set(current/2)
      }
    },

    double: function(value){
      if (value){
        var current = self.loopLength() || 1
        self.loopLength.set(current*2)
      }
    }

  })

  var repeatButtons = ObservKeys(keysDown, {
    0: '1', 1: '2', 2: '3', 3: '4', 4: '5',
    5: '6', 6: '7', 7: '8', 8: '9', 9: '0'
  })

  // repeater
  var releaseRepeatLight = null
  mapWatchDiff(repeatStates, repeatButtons, self.repeatLength.set)
  watch(self.repeatLength, function(value){
    transforms.holder.setLength(value)
    if (value < 2){
      transforms.repeater.start(grabInputExcludeNoRepeat, value)
    } else {
      transforms.repeater.stop()
    }
  })

  // cleanup / disconnect from keyboard on destroy
  self._releases.push(
    keysDown.close,
    output.destroy
  )

  return self
}

function getGridMapping(){
  var result = "qwertyuiopasdfghjkl;zxcvbnm,./".split('').map(convertKeyCode)
  return ArrayGrid(result, [3, 10])
}

function KeyboardGrid(obs, mapping){
  var result = ObservGrid([], mapping.shape)

  watch(obs, function(value){
    var codes = resolve(mapping).data
    var r = value.reduce(function(res, code){
      var index = codes.indexOf(code)
      if (~index) res[index] = true
      return res
    }, [])
    result.data.set(r)
  })

  return result
}

function resolve(val){
  return typeof val === 'function' ? val() : val
}