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
<<<<<<< HEAD:lib/main-bundle.js
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
=======
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
>>>>>>> 5bcc321... Check for mill capture if no other options available:lib/bundle.js
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
<<<<<<< HEAD:lib/main-bundle.js
function setUpClicks(clickHandler) {
  document.getElementById("board").addEventListener("load", function () {
    var svg = document.getElementById("board").getSVGDocument();
    var dots = svg.getElementsByTagName('ellipse');
    for (var i = 0; i < dots.length; i++) {
      if (dots[i] != null) {
        dots[i].removeEventListener("click", clickHandler);
        dots[i].addEventListener("click", function (e) {
          clickHandler(e.target);
        });
      }
    }
  });
}

exports.setUpClicks = setUpClicks;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var SHARP_COLORS = {
  0: '#ff00ee', // purple
  1: '#f6ff00', // yellow
  default: '#000000'
};

var STATES = {
  UNAVAILABLE: 0,
  AVAILABLE: 1,
  PURPLE: "P",
  YELLOW: "Y"
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

function makeMoveProp(row, col, turn, shift, shiftRow, shiftCol, board) {
  return {
    ROW: row,
    COL: col,
    TURN: turn,
    SHIFT: shift,
    SHIFTROW: shiftRow,
    SHIFTCOL: shiftCol,
    BOARD: board
  };
}

var ERRORS = {
  invalidMove: "Invalid move"
};

var DIALOG = {
  purpleTurn: "Purple's turn",
  yellowTurn: "Yellow's turn"
};

exports.SHARP_COLORS = SHARP_COLORS;
exports.STATES = STATES;
exports.makeMoveProp = makeMoveProp;
exports.ERRORS = ERRORS;
exports.DIALOG = DIALOG;

/***/ }),
/* 2 */
=======
var PURPLE_PLAYER = {
  AVAILABLE: 4,
  PLACED: 0,
  MILLPIECES: 0
};

var YELLOW_PLAYER = {
  AVAILABLE: 3,
  PLACED: 0,
  MILLPIECES: 0
};

var PURPLE_TURN = 0;
var YELLOW_TURN = 1;

exports.PURPLE_PLAYER = PURPLE_PLAYER;
exports.YELLOW_PLAYER = YELLOW_PLAYER;
exports.PURPLE_TURN = PURPLE_TURN;
exports.YELLOW_TURN = YELLOW_TURN;

/***/ }),
/* 1 */
>>>>>>> 5bcc321... Check for mill capture if no other options available:lib/bundle.js
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValidShift = exports.isRemovable = exports.isValidMove = exports.countNewMills = undefined;

<<<<<<< HEAD:lib/main-bundle.js
var _common = __webpack_require__(1);
=======
var _constants = __webpack_require__(0);
>>>>>>> 5bcc321... Check for mill capture if no other options available:lib/bundle.js

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
<<<<<<< HEAD:lib/main-bundle.js
    if (tileState.TURN === move.TURN) {
=======
    if (tileState.ISAVAILABLE === true && tileState.COLOR === move.COLOR) {
>>>>>>> 5bcc321... Check for mill capture if no other options available:lib/bundle.js
      count += 1;
    }
  }
  if (count === 3) {
    // change ISMILL to true
    for (var _i = start; _i <= end; _i++) {
      var _tileState = checkRow ? move.BOARD[move.ROW][_i] : move.BOARD[_i][move.COL];
<<<<<<< HEAD:lib/main-bundle.js
      if (_tileState.TURN === move.TURN) {
=======
      if (_tileState.ISAVAILABLE === true && _tileState.ISMILL === false) {
>>>>>>> 5bcc321... Check for mill capture if no other options available:lib/bundle.js
        _tileState.ISMILL = true;
        if (move.COLOR === _constants.YELLOW_TURN) {
          _constants.YELLOW_PLAYER.MILLPIECES += 1;
        } else if (move.COLOR === _constants.PURPLE_TURN) {
          _constants.PURPLE_PLAYER.MILLPIECES += 1;
        }
      }
    }
    return 1;
  } else {
    return 0;
  }
}

function isValidMove(move) {
  var tileState = move.BOARD[move.ROW][move.COL];
  return tileState.ISAVAILABLE && tileState.TURN === null;
}

function isRemovable(move) {
  // Is not part of a mill and has a piece
  var tileState = move.BOARD[move.ROW][move.COL];
<<<<<<< HEAD:lib/main-bundle.js
  return tileState.ISAVAILABLE && tileState.TURN === move.TURN && !tileState.ISMILL;
=======
  return tileState.ISAVAILABLE && tileState.COLOR === move.COLOR;
>>>>>>> 5bcc321... Check for mill capture if no other options available:lib/bundle.js
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
      if (move.BOARD[i][j].TURN === null) {
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
<<<<<<< HEAD:lib/main-bundle.js
/* 3 */
=======
/* 2 */
>>>>>>> 5bcc321... Check for mill capture if no other options available:lib/bundle.js
/***/ (function(module, exports, __webpack_require__) {

"use strict";


<<<<<<< HEAD:lib/main-bundle.js
var _algorithm = __webpack_require__(2);

var algorithm = _interopRequireWildcard(_algorithm);

var _events = __webpack_require__(0);

var _common = __webpack_require__(1);
=======
var _algorithm = __webpack_require__(1);

var algorithm = _interopRequireWildcard(_algorithm);

var _constants = __webpack_require__(0);
>>>>>>> 5bcc321... Check for mill capture if no other options available:lib/bundle.js

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// Structs
var TILE = {
  ISAVAILABLE: true,
  ISMILL: false,
  TURN: null
};

var MATRIX_SIZE = 7;
var board = new Array(MATRIX_SIZE);

function init() {
  for (var i = 0; i < MATRIX_SIZE; i++) {
    board[i] = new Array(MATRIX_SIZE);
    for (var j = 0; j < 7; j++) {
      board[i][j] = {
        ISAVAILABLE: true,
        ISMILL: false,
        TURN: null
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
  TURN: null,
  CAPTURING: false,
  MILLS: 0
};

function otherPlayer() {
  return GAME_PROPERTIES.TURN != null ? (GAME_PROPERTIES.TURN + 1) % 2 : null;
}

function checkLose() {
  if (_constants.PURPLE_PLAYER.PLACED < 3) return _constants.PURPLE_TURN;
  if (_constants.YELLOW_PLAYER.PLACED < 3) return _constants.YELLOW_TURN;
}

var alertText = document.getElementById("alertText");
var alert = document.getElementById("alert");
var turnText = document.getElementById("turnText");

function setTurnText() {
  turnText.innerHTML = GAME_PROPERTIES.TURN ? "YELLOW (1)" : "PURPLE (0)";
}

function startGame() {
  init();
  GAME_PROPERTIES.TURN = coinFlip();
  setTurnText();
  console.log(PURPLE_PLAYER);
  console.log(YELLOW_PLAYER);
  printBoard();
<<<<<<< HEAD:lib/main-bundle.js
  // phase2();
  // if (checkLose() === PURPLE_TURN) {
  //   console.log("Yellow Wins");
  // } else {
  //   console.log("Purple Wins");
  // }
=======
  console.log("Phase1");
  phase1();
  console.log("Phase2");
  phase2();
  if (checkLose() === _constants.PURPLE_TURN) {
    console.log("Yellow Wins");
  } else {
    console.log("Purple Wins");
  }
>>>>>>> 5bcc321... Check for mill capture if no other options available:lib/bundle.js
}

function printBoard() {
  var stringBoard = "";
  for (var i = 0; i < MATRIX_SIZE; i++) {
    for (var j = 0; j < 7; j++) {
      var tileState = board[i][j];
      var stringState = tileState.ISAVAILABLE ? _common.STATES.AVAILABLE : _common.STATES.UNAVAILABLE;
      if (tileState.TURN !== null && tileState.TURN !== undefined) {
        stringState = tileState.TURN ? _common.STATES.YELLOW : _common.STATES.PURPLE;
      }
      stringBoard += stringState;
    }
    stringBoard += "\n";
  }
  console.log(stringBoard);
}

function placeSoldier(move) {
  if (algorithm.isValidMove(move)) {
<<<<<<< HEAD:lib/main-bundle.js
    board[move.ROW][move.COL].TURN = move.TURN;
    if (move.TURN === PURPLE_TURN) {
      PURPLE_PLAYER.AVAILABLE--;
      PURPLE_PLAYER.PLACED++;
=======
    board[move.ROW][move.COL].COLOR = move.COLOR;
    if (move.COLOR === _constants.PURPLE_TURN) {
      _constants.PURPLE_PLAYER.AVAILABLE--;
      _constants.PURPLE_PLAYER.PLACED++;
>>>>>>> 5bcc321... Check for mill capture if no other options available:lib/bundle.js
    } else {
      _constants.YELLOW_PLAYER.AVAILABLE--;
      _constants.YELLOW_PLAYER.PLACED++;
    }
    return true;
  } else {
    console.log("Algorithm: Not a valid move.");
    return false;
  }
}

function removeSoldier(move) {
<<<<<<< HEAD:lib/main-bundle.js
  if (algorithm.isRemovable(move)) {
    if (move.TURN == PURPLE_TURN) {
      PURPLE_PLAYER.PLACED--;
    } else {
      YELLOW_PLAYER.PLACED--;
    }
    board[move.ROW][move.COL].TURN = null;
=======
  // When removing, we remove the piece with that color
  var removingPiece = move.COLOR === _constants.PURPLE_TURN ? _constants.PURPLE_PLAYER : _constants.YELLOW_PLAYER;
  if (!algorithm.isRemovable(move)) {
    return false;
  }

  if (!board[move.ROW][move.COL].ISMILL) {
    // not a mill
    board[move.ROW][move.COL].COLOR = null;
    removingPiece.PLACED--;
>>>>>>> 5bcc321... Check for mill capture if no other options available:lib/bundle.js
    return true;
  } else {
    // is a mill
    if (removingPiece.PLACED - removingPiece.MILLPIECES == 0) {
      // Removing from mill is possible if only mills are left
      board[move.ROW][move.COL].COLOR = null;
      board[move.ROW][move.COL].ISMILL = false;
      removingPiece.PLACED--;
      removingPiece.MILLPIECES--;
      return true;
    }
    return false;
  }
}

function shiftSoldier(move) {
  if (algorithm.isValidShift(move)) {
<<<<<<< HEAD:lib/main-bundle.js
    board[move.SHIFTROW][move.SHIFTCOL].TURN = move.TURN;
    board[move.ROW][move.COL].TURN = null;
=======
    // reset state of current
    board[move.ROW][move.COL].COLOR = null;
    if (board[move.ROW][move.COL].ISMILL === true) {
      if (move.COLOR === _constants.PURPLE_TURN) {
        _constants.PURPLE_PLAYER.MILLPIECES--;
      } else {
        _constants.YELLOW_PLAYER.MILLPIECES--;
      }
      board[move.ROW][move.COL].ISMILL = false;
    };

    // update color of new
    board[move.SHIFTROW][move.SHIFTCOL].COLOR = move.COLOR;
>>>>>>> 5bcc321... Check for mill capture if no other options available:lib/bundle.js
    return true;
  }

  return false;
}

function handleNewMills(move, originalHandler) {
  var numMills = algorithm.countNewMills(move);

  printBoard();
  if (numMills > 0) {
    // Made a mill
    printBoard();
<<<<<<< HEAD:lib/main-bundle.js
    if (GAME_PROPERTIES.TURN === YELLOW_TURN) {
      alertText.innerHTML = "Click on a PURPLE piece to remove that is not a mill";
    } else {
      alertText.innerHTML = "Click on a YELLOW piece to remove that is not a mill";
    }

    // tell originalHandler
    GAME_PROPERTIES.CAPTURING = true;
    GAME_PROPERTIES.MILLS = numMills;
=======
    var message = "";
    if (GAME_PROPERTIES.TURN === _constants.YELLOW_TURN) {
      message = "Yellow: Enter a position to remove a purple piece in the form of row,col";
    } else {
      message = "Purple: Enter a position to remove a yellow piece in the form of row,col";
    }

    var removingPiece = (GAME_PROPERTIES.TURN + 1) % 2 === _constants.PURPLE_TURN ? _constants.PURPLE_PLAYER : _constants.YELLOW_PLAYER;
    console.log(removingPiece.PLACED);
    console.log(removingPiece.MILLPIECES);
    if (removingPiece.PLACED - removingPiece.MILLPIECES == 0) {
      // Removing from mill is possible if only mills are left
      message += " that is a mill";
    } else {
      message += " that is not a mill";
    }

    var positions = prompt(message);
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
  while (_constants.PURPLE_PLAYER.AVAILABLE > 0 || _constants.YELLOW_PLAYER.AVAILABLE > 0) {
    if (GAME_PROPERTIES.TURN === _constants.YELLOW_TURN) {
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
>>>>>>> 5bcc321... Check for mill capture if no other options available:lib/bundle.js

    // don't switch turns
    return false;
  } else {
    // consume turn
    return false;
  }
}

function phase2() {
  while (_constants.PURPLE_PLAYER.PLACED > 2 && _constants.YELLOW_PLAYER.PLACED > 2) {
    if (GAME_PROPERTIES.TURN === _constants.YELLOW_TURN) {
      var positions = prompt("Yellow: Select position of your piece in the form of row,col");
      var direction = prompt("Yellow: Enter 0(left), 1(right), 2(up), or 3(down)");
    } else {
      var positions = prompt("Purple: Select position of your piece in the form of row,col");
      var direction = prompt("Purple: Enter 0(left), 1(right), 2(up), or 3(down)");
    }
    positions = positions.split(",");

    // Set up move for shift
    var move = (0, _common.makeMoveProp)(parseInt(positions[0], 10), parseInt(positions[1], 10), GAME_PROPERTIES.TURN, parseInt(direction, 10), null, null, board);

    if (move.BOARD[move.ROW][move.COL].TURN !== GAME_PROPERTIES.TURN) {
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

console.log("turn: " + GAME_PROPERTIES.TURN);

function clearAlert() {
  if (alert.style.display != "none") alert.style.display = "none";
}

function invalidMoveAlert() {
  console.log("TURN: " + GAME_PROPERTIES.TURN);
  if (alert.style.display == "none") {
    alert.style.display = "block";
  }
  alertText.innerHTML = _common.ERRORS.invalidMove;
  setTimeout(function () {
    clearAlert();
  }, 5000);
}

function clickHandler(e) {
  var id = e.getAttribute("id");
  var move = (0, _common.makeMoveProp)(parseInt(id[0]), parseInt(id[1]), null, null, null, null, board);
  if (GAME_PROPERTIES.TURN == PURPLE_TURN || GAME_PROPERTIES.TURN == YELLOW_TURN) {
    move.TURN = GAME_PROPERTIES.TURN;
    // phase 1
    ////////////////////////////////////////////////////////////////
    if (GAME_PROPERTIES.CAPTURING && GAME_PROPERTIES.MILLS > 0) {
      console.log("CAPTURING");
      move.TURN = otherPlayer();
      if (removeSoldier(move)) {
        e.setAttribute("fill", _common.SHARP_COLORS['default']);
        GAME_PROPERTIES.MILLS -= 1;
        if (GAME_PROPERTIES.MILL == 0) {
          GAME_PROPERTIES.MILLS = 0;
          GAME_PROPERTIES.CAPTURING = false;
        } else {
          GAME_PROPERTIES.TURN = otherPlayer();
          setTurnText();

          clearAlert();
        }
      } else {
        invalidMoveAlert();
      }
      // abort
      return;
    }
    ////////////////////////////////////////////////////////////////
    if (placeSoldier(move)) {
      e.setAttribute("fill", _common.SHARP_COLORS[GAME_PROPERTIES.TURN]);
      console.log(algorithm.countNewMills(move));
      handleNewMills(move, clickHandler);
      if (algorithm.countNewMills(move) === 0) {
        GAME_PROPERTIES.TURN = otherPlayer();
      }
    } else {
      invalidMoveAlert();
    }
  } else {
    throw RangeError("GAME_PROPERTIES.TURN not handled");
  }

  console.log(PURPLE_PLAYER);
  console.log(YELLOW_PLAYER);

  if (PURPLE_PLAYER.AVAILABLE === 0 && YELLOW_PLAYER.AVAILABLE === 0) {
    // phase 1 end
    console.log("------------ PHASE 1 COMPLETE ------------");
  } else if (PURPLE_PLAYER.AVAILABLE == 0) {
    GAME_PROPERTIES.TURN = YELLOW_TURN;
  } else if (YELLOW_PLAYER.AVAILABLE == 0) {
    GAME_PROPERTIES.TURN = PURPLE_TURN;
  }
  setTurnText();
}

(0, _events.setUpClicks)(function (e) {
  return clickHandler(e);
});

/***/ })
/******/ ]);