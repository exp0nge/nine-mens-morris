/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var CENTER_POSITION = 3;

function countNewMills(move) {
  if (move.ROW === CENTER_POSITION) {
    if (move.COL < CENTER_POSITION) {
      return checkMill(move, 0, 2, true) + checkMill(move, 0, 6, false);
    } else {
      return checkMill(move, 4, 6, true) + checkMill(move, 0, 6, false);
    }
  }

  if (move.COL === CENTER_POSITION) {
    if (move.ROW < CENTER_POSITION) {
      return checkMill(move, 0, 6, true) + checkMill(move, 0, 2, false);
    } else {
      return checkMill(move, 0, 6, true) + checkMill(move, 4, 6, false);
    }
  }

  return checkMill(move, 0, 6, true) + checkMill(move, 0, 6, false);
}

function checkMill(move, start, end, checkRow) {
  var count = 0;
  for (var i = start; i <= end; i++) {
    var tileState = checkRow ? move.BOARD[move.ROW][i] : move.BOARD[i][move.COL];
    if (tileState.COLOR === move.COLOR) {
      count += 1;
    }
  }
  if (count == 3) {
    // change ISMILL to true
    for (var _i = start; _i <= end; _i++) {
      var _tileState = checkRow ? move.BOARD[move.ROW][_i] : move.BOARD[_i][move.COL];
      if (_tileState.COLOR === move.COLOR) {
        _tileState.ISMILL = true;
      }
    }
    return 1;
  } else {
    return 0;
  }
}

function isValidMove(move) {
  var tileState = move.BOARD[move.ROW][move.COL];
  return tileState.ISAVAILABLE && tileState.COLOR === null;
}

function isRemovable(move) {
  // Is not part of a mill and has a piece
  var tileState = move.BOARD[move.ROW][move.COL];
  return tileState.ISAVAILABLE && tileState.COLOR === move.COLOR && !tileState.ISMILL;
}

/**
Phase 2 Functions
**/
var SHIFT = {
  LEFT: 0,
  RIGHT: 1,
  UP: 2,
  DOWN: 3
};

function isValidShift(move) {
  var i = move.ROW;
  var j = move.COL;
  var t1 = 0;
  var t2 = 0;
  var rowBounds = [0, 6];
  var colBounds = [0, 6];

  // Make sure that there is a piece to move
  if (!move.BOARD[move.ROW][move.COL].ISAVAILABLE) {
    return false;
  }

  // Translation for shift
  switch (move.SHIFT) {
    case SHIFT.LEFT:
      t2 = -1;
      break;
    case SHIFT.RIGHT:
      t2 = 1;
      break;
    case SHIFT.UP:
      t1 = -1;
      break;
    case SHIFT.DOWN:
      t1 = 1;
      break;
    default:
      return false;
  }

  // Special cases for center row/column
  if (move.ROW === CENTER_POSITION) {
    if (move.COL < CENTER_POSITION) {
      colBounds[1] = CENTER_POSITION;
    } else {
      colBounds[0] = CENTER_POSITION;
    }
  }

  if (move.COL === CENTER_POSITION) {
    if (move.ROW < CENTER_POSITION) {
      rowBounds[1] = CENTER_POSITION;
    } else {
      rowBounds[0] = CENTER_POSITION;
    }
  }

  while (true) {
    // Continue moving in a direction
    i += t1;
    j += t2;

    if (i < rowBounds[0] || i > rowBounds[1] || j < colBounds[0] || j > colBounds[1]) {
      // Out of bounds
      return false;
    }

    if (move.BOARD[i][j].ISAVAILABLE) {
      if (move.BOARD[i][j].COLOR === null) {
        // No piece there, we can shift
        move.SHIFTROW = i;
        move.SHIFTCOL = j;
        return true;
      } else {
        return false;
      }
    }
  }
}

exports.countNewMills = countNewMills;
exports.isValidMove = isValidMove;
exports.isRemovable = isRemovable;
exports.isValidShift = isValidShift;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _algorithm = __webpack_require__(0);

var algorithm = _interopRequireWildcard(_algorithm);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// Structs
var STATES = {
  UNAVAILABLE: 0,
  AVAILABLE: 1,
  PURPLE: "P",
  YELLOW: "Y"
};

var TILE = {
  ISAVAILABLE: true,
  ISMILL: false,
  COLOR: null
};

var MOVE = {
  ROW: null,
  COL: null,
  COLOR: null,
  BOARD: null,
  SHIFT: null,
  SHIFTROW: null,
  SHIFTCOL: null
};

var PURPLE_PLAYER = {
  AVAILABLE: 4,
  PLACED: 0
};

var YELLOW_PLAYER = {
  AVAILABLE: 4,
  PLACED: 0
};

var PURPLE_TURN = 0;
var YELLOW_TURN = 1;

var MATRIX_SIZE = 7;
var board = new Array(MATRIX_SIZE);

function init() {
  for (var i = 0; i < MATRIX_SIZE; i++) {
    board[i] = new Array(MATRIX_SIZE);
    for (var j = 0; j < 7; j++) {
      board[i][j] = {
        ISAVAILABLE: true,
        ISMILL: false,
        COLOR: null
      };
    }
  }

  board[0][1].ISAVAILABLE = false;
  board[0][2].ISAVAILABLE = false;
  board[0][4].ISAVAILABLE = false;
  board[0][5].ISAVAILABLE = false;

  board[1][0].ISAVAILABLE = false;
  board[1][2].ISAVAILABLE = false;
  board[1][4].ISAVAILABLE = false;
  board[1][6].ISAVAILABLE = false;

  board[2][0].ISAVAILABLE = false;
  board[2][1].ISAVAILABLE = false;
  board[2][5].ISAVAILABLE = false;
  board[2][6].ISAVAILABLE = false;

  board[3][3].ISAVAILABLE = false;

  board[6][1].ISAVAILABLE = false;
  board[6][2].ISAVAILABLE = false;
  board[6][4].ISAVAILABLE = false;
  board[6][5].ISAVAILABLE = false;

  board[5][0].ISAVAILABLE = false;
  board[5][2].ISAVAILABLE = false;
  board[5][4].ISAVAILABLE = false;
  board[5][6].ISAVAILABLE = false;

  board[4][0].ISAVAILABLE = false;
  board[4][1].ISAVAILABLE = false;
  board[4][5].ISAVAILABLE = false;
  board[4][6].ISAVAILABLE = false;
}

function coinFlip() {
  return Math.floor(Math.random() * 2) + 0;
}

var GAME_PROPERTIES = {
  TURN: null
};

function checkLose() {
  if (PURPLE_PLAYER.PLACED < 3) return PURPLE_TURN;
  if (YELLOW_PLAYER.PLACED < 3) return YELLOW_TURN;
}

function startGame() {
  init();
  GAME_PROPERTIES.TURN = coinFlip();
  printBoard();
  console.log("Phase1");
  phase1();
  console.log("Phase2");
  phase2();
  if (checkLose() === PURPLE_TURN) {
    console.log("Yellow Wins");
  } else {
    console.log("Purple Wins");
  }
}

function printBoard() {
  var stringBoard = "";
  for (var i = 0; i < MATRIX_SIZE; i++) {
    for (var j = 0; j < 7; j++) {
      var tileState = board[i][j];
      var stringState = tileState.ISAVAILABLE ? STATES.AVAILABLE : STATES.UNAVAILABLE;
      if (tileState.COLOR !== null) {
        stringState = tileState.COLOR ? STATES.YELLOW : STATES.PURPLE;
      }
      stringBoard += stringState;
    }
    stringBoard += "\n";
  }
  console.log(stringBoard);
}

function placeSoldier(move) {
  if (algorithm.isValidMove(move)) {
    board[move.ROW][move.COL].COLOR = move.COLOR;
    if (move.COLOR === PURPLE_TURN) {
      PURPLE_PLAYER.AVAILABLE--;
      PURPLE_PLAYER.PLACED++;
    } else {
      YELLOW_PLAYER.AVAILABLE--;
      YELLOW_PLAYER.PLACED++;
    }
    return true;
  } else {
    return false;
  }
}

function removeSoldier(move) {
  if (algorithm.isRemovable(move)) {
    if (move.COLOR === PURPLE_TURN) {
      PURPLE_PLAYER.PLACED--;
    } else {
      YELLOW_PLAYER.PLACED--;
    }
    board[move.ROW][move.COL].COLOR = null;
    return true;
  } else {
    return false;
  }
}

function shiftSoldier(move) {
  if (algorithm.isValidShift(move)) {
    board[move.SHIFTROW][move.SHIFTCOL].COLOR = move.COLOR;
    board[move.ROW][move.COL].COLOR = null;
    return true;
  }

  return false;
}

function handleNewMills(move) {
  var numMills = algorithm.countNewMills(move);
  while (numMills > 0) {
    // Made a mill
    printBoard();
    if (GAME_PROPERTIES.TURN === YELLOW_TURN) {
      var positions = prompt("Yellow: Enter a position to remove a purple piece that is not a mill in the form of row,col");
    } else {
      var positions = prompt("Purple: Enter a position to remove a yellow piece that is not a mill in the form of row,col");
    }
    positions = positions.split(",");
    move = {
      ROW: parseInt(positions[0], 10),
      COL: parseInt(positions[1], 10),
      COLOR: (GAME_PROPERTIES.TURN + 1) % 2,
      BOARD: board
    };
    if (removeSoldier(move)) {
      numMills--;
    } else {
      console.log("Invalid remove");
    }
  }
}

function phase1() {
  while (PURPLE_PLAYER.AVAILABLE > 0 || YELLOW_PLAYER.AVAILABLE > 0) {
    if (GAME_PROPERTIES.TURN === YELLOW_TURN) {
      var positions = prompt("Yellow: Enter a position to place the piece in the form of row,col");
    } else {
      var positions = prompt("Purple: Enter a position to place the piece in the form of row,col");
    }
    positions = positions.split(",");
    var move = {
      ROW: parseInt(positions[0], 10),
      COL: parseInt(positions[1], 10),
      COLOR: GAME_PROPERTIES.TURN,
      BOARD: board
    };

    if (placeSoldier(move)) {
      handleNewMills(move);
      GAME_PROPERTIES.TURN = (GAME_PROPERTIES.TURN + 1) % 2;
    } else {
      console.log("Invalid place");
    }

    printBoard();
  }
}

function phase2() {
  while (PURPLE_PLAYER.PLACED > 2 && YELLOW_PLAYER.PLACED > 2) {
    if (GAME_PROPERTIES.TURN === YELLOW_TURN) {
      var positions = prompt("Yellow: Select position of your piece in the form of row,col");
      var direction = prompt("Yellow: Enter 0(left), 1(right), 2(up), or 3(down)");
    } else {
      var positions = prompt("Purple: Select position of your piece in the form of row,col");
      var direction = prompt("Purple: Enter 0(left), 1(right), 2(up), or 3(down)");
    }
    positions = positions.split(",");

    // Set up move for shift
    var move = {
      ROW: parseInt(positions[0], 10),
      COL: parseInt(positions[1], 10),
      COLOR: GAME_PROPERTIES.TURN,
      BOARD: board,
      SHIFT: parseInt(direction, 10),
      SHIFTROW: null,
      SHIFTCOL: null
    };

    if (move.BOARD[move.ROW][move.COL].COLOR !== GAME_PROPERTIES.TURN) {
      // Not your color
      console.log("Invalid piece chosen");
      continue;
    }

    if (shiftSoldier(move)) {
      // Update row and col for handleNewMills
      move.ROW = move.SHIFTROW;
      move.COL = move.SHIFTCOL;
      handleNewMills(move);
      GAME_PROPERTIES.TURN = (GAME_PROPERTIES.TURN + 1) % 2;
    } else {
      console.log("Invalid shift");
    }

    printBoard();
  }
}

console.log("initializing game");

startGame();

/***/ })
/******/ ]);