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
var STATES = {
  UNAVAILABLE: 0,
  AVAILABLE: 1,
  PURPLE: 2,
  YELLOW: 3
};

var CENTER_POSITION = 3;

function countNewMills(move) {
  if (move.ROW == CENTER_POSITION) {
    if (move.COL < CENTER_POSITION) {
      return checkMill(move, 0, 2, true) + checkMill(move, 0, 6, false);
    } else {
      return checkMill(move, 4, 6, true) + checkMill(move, 0, 6, false);
    }
  }

  if (move.COL == CENTER_POSITION) {
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
    var pieceState = checkRow ? move.BOARD[move.ROW][i] : move.BOARD[i][move.COL];
    if (pieceState === move.COLOR) {
      count += 1;
    }
  }

  console.log(count);
  if (count == 3) {
    return 1;
  } else {
    return 0;
  }
}

function isValidMove(move) {
  return move.BOARD[move.ROW][move.COL] === STATES.AVAILABLE;
}

/**
Phase 2 Functions
**/

function checkLose(player) {

  if (player.PLACED === 2) return true;

  // TODO: Check for no more available moves

  return false;
}

exports.STATES = STATES;
exports.countNewMills = countNewMills;
exports.isValidMove = isValidMove;
exports.checkLose = checkLose;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.STATES = undefined;

var _algorithm = __webpack_require__(0);

var algorithm = _interopRequireWildcard(_algorithm);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var STATES = algorithm.STATES;

var MOVE = {
  ROW: null,
  COL: null,
  COLOR: null,
  BOARD: null
};

var MATRIX_SIZE = 7;
var board = new Array(MATRIX_SIZE);
var PURPLE_PLAYER = {
  AVAILABLE: 9,
  PLACED: 0
};
var YELLOW_PLAYER = {
  AVAILABLE: 9,
  PLACED: 0
};
var YELLOW_SOLDIERS_AVAILABLE = 9;
var PURPLE_TURN = 0;
var YELLOW_TURN = 1;

function init() {
  for (var i = 0; i < MATRIX_SIZE; i++) {
    board[i] = new Array(MATRIX_SIZE);
    for (var j = 0; j < 7; j++) {
      board[i][j] = STATES.AVAILABLE;
    }
  }

  board[0][1] = STATES.UNAVAILABLE;
  board[0][2] = STATES.UNAVAILABLE;
  board[0][4] = STATES.UNAVAILABLE;
  board[0][5] = STATES.UNAVAILABLE;

  board[1][0] = STATES.UNAVAILABLE;
  board[1][2] = STATES.UNAVAILABLE;
  board[1][4] = STATES.UNAVAILABLE;
  board[1][6] = STATES.UNAVAILABLE;

  board[2][0] = STATES.UNAVAILABLE;
  board[2][1] = STATES.UNAVAILABLE;
  board[2][5] = STATES.UNAVAILABLE;
  board[2][6] = STATES.UNAVAILABLE;

  board[3][3] = STATES.UNAVAILABLE;

  board[6][1] = STATES.UNAVAILABLE;
  board[6][2] = STATES.UNAVAILABLE;
  board[6][4] = STATES.UNAVAILABLE;
  board[6][5] = STATES.UNAVAILABLE;

  board[5][0] = STATES.UNAVAILABLE;
  board[5][2] = STATES.UNAVAILABLE;
  board[5][4] = STATES.UNAVAILABLE;
  board[5][6] = STATES.UNAVAILABLE;

  board[4][0] = STATES.UNAVAILABLE;
  board[4][1] = STATES.UNAVAILABLE;
  board[4][5] = STATES.UNAVAILABLE;
  board[4][6] = STATES.UNAVAILABLE;
}

function coinFlip() {
  return Math.floor(Math.random() * 2) + 0;
}

var GAME_PROPERTIES = {
  TURN: null
};

function startGame() {
  init();
  GAME_PROPERTIES.TURN = coinFlip();
  printBoard();
  phase1();
}

function printBoard() {
  var stringBoard = "";
  for (var i = 0; i < MATRIX_SIZE; i++) {
    for (var j = 0; j < 7; j++) {
      stringBoard += board[i][j];
    }
    stringBoard += "\n";
  }
  console.log(stringBoard);
}

function placeSoldier(move) {
  if (algorithm.isValidMove(move)) {
    board[move.ROW][move.COL] = move.COLOR;
    if (move.COLOR == PURPLE_TURN) {
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

function phase1() {
  while (PURPLE_PLAYER.AVAILABLE > 0 || YELLOW_PLAYER.AVAILABLE > 0) {
    if (GAME_PROPERTIES.TURN === YELLOW_TURN) {
      var positions = prompt("Yellow: Enter a position to place the piece in the form of x,y");
    } else {
      var positions = prompt("Purple: Enter a position to place the piece in the form of x,y");
    }
    positions = positions.split(",");
    var move = {
      ROW: parseInt(positions[0], 10),
      COL: parseInt(positions[1], 10),
      COLOR: GAME_PROPERTIES.TURN ? STATES.YELLOW : STATES.PURPLE,
      BOARD: board
    };

    if (placeSoldier(move)) {
      // TODO: Check mills here
      if (algorithm.countNewMills(move) > 0) {
        console.log("MILL");
      }

      GAME_PROPERTIES.TURN = (GAME_PROPERTIES.TURN + 1) % 2;
    } else {
      console.log("Invalid move");
    }

    printBoard();
  }
}

console.log("initializing game");

startGame();

exports.STATES = STATES;

/***/ })
/******/ ]);