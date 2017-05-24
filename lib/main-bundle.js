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
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

var PURPLE_PLAYER = {
    AVAILABLE: 4,
    PLACED: 0,
    MILLPIECES: 0
};

var YELLOW_PLAYER = {
    AVAILABLE: 4,
    PLACED: 0,
    MILLPIECES: 0
};

var PURPLE_TURN = 0;
var YELLOW_TURN = 1;

var Coordinate = function Coordinate(x, y) {
    _classCallCheck(this, Coordinate);

    this.X = x;
    this.Y = y;
};

exports.SHARP_COLORS = SHARP_COLORS;
exports.STATES = STATES;
exports.makeMoveProp = makeMoveProp;
exports.ERRORS = ERRORS;
exports.DIALOG = DIALOG;
exports.PURPLE_PLAYER = PURPLE_PLAYER;
exports.YELLOW_PLAYER = YELLOW_PLAYER;
exports.PURPLE_TURN = PURPLE_TURN;
exports.YELLOW_TURN = YELLOW_TURN;
exports.Coordinate = Coordinate;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isPossibleShift = exports.CENTER_POSITION = exports.isValidShift = exports.isRemovable = exports.isValidMove = exports.countNewMills = undefined;

var _common = __webpack_require__(1);

var CENTER_POSITION = 3;

function countNewMills(move, gameProperties) {
    if (move.ROW === CENTER_POSITION) {
        if (move.COL < CENTER_POSITION) {
            return checkMill(move, 0, 2, true, gameProperties) + checkMill(move, 0, 6, false, gameProperties);
        } else {
            return checkMill(move, 4, 6, true, gameProperties) + checkMill(move, 0, 6, false, gameProperties);
        }
    }

    if (move.COL === CENTER_POSITION) {
        if (move.ROW < CENTER_POSITION) {
            return checkMill(move, 0, 6, true, gameProperties) + checkMill(move, 0, 2, false, gameProperties);
        } else {
            return checkMill(move, 0, 6, true, gameProperties) + checkMill(move, 4, 6, false, gameProperties);
        }
    }

    return checkMill(move, 0, 6, true, gameProperties) + checkMill(move, 0, 6, false, gameProperties);
}

function checkMill(move, start, end, checkRow, gameProperties) {
    var count = 0;
    for (var i = start; i <= end; i++) {
        var tileState = checkRow ? move.BOARD[move.ROW][i] : move.BOARD[i][move.COL];
        if (tileState.ISAVAILABLE === true && tileState.TURN === move.TURN) {
            count += 1;
        }
    }
    if (count === 3) {
        // change ISMILL to true
        for (var _i = start; _i <= end; _i++) {
            var _tileState = checkRow ? move.BOARD[move.ROW][_i] : move.BOARD[_i][move.COL];
            if (_tileState.ISAVAILABLE === true && _tileState.ISMILL === false) {
                _tileState.ISMILL = true;
                if (move.TURN === _common.YELLOW_TURN) {
                    gameProperties.YELLOW_PLAYER.MILLPIECES += 1;
                } else if (move.TURN === _common.PURPLE_TURN) {
                    gameProperties.PURPLE_PLAYER.MILLPIECES += 1;
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

function isRemovable(move, otherTurn) {
    // Is not part of a mill and has a piece
    var tileState = move.BOARD[move.ROW][move.COL];
    return tileState.ISAVAILABLE && tileState.TURN === otherTurn;
}

/**
Phase 2 Functions
**/

var VALID_SHIFTS = {
    0: {
        0: [new _common.Coordinate(0, 3), new _common.Coordinate(3, 0)],
        3: [new _common.Coordinate(1, 3), new _common.Coordinate(0, 0), new _common.Coordinate(0, 6)],
        6: [new _common.Coordinate(0, 3), new _common.Coordinate(3, 6)]
    },
    1: {
        1: [new _common.Coordinate(1, 3), new _common.Coordinate(3, 1)],
        3: [new _common.Coordinate(1, 1), new _common.Coordinate(0, 3), new _common.Coordinate(1, 5), new _common.Coordinate(2, 3)],
        5: [new _common.Coordinate(1, 3), new _common.Coordinate(3, 5)]
    },
    2: {
        2: [new _common.Coordinate(2, 3), new _common.Coordinate(3, 2)],
        3: [new _common.Coordinate(2, 2), new _common.Coordinate(1, 3), new _common.Coordinate(2, 4)],
        4: [new _common.Coordinate(2, 3), new _common.Coordinate(3, 4)]
    },
    3: {
        0: [new _common.Coordinate(0, 0), new _common.Coordinate(3, 1), new _common.Coordinate(6, 0)],
        1: [new _common.Coordinate(1, 1), new _common.Coordinate(3, 0), new _common.Coordinate(3, 2), new _common.Coordinate(5, 1)],
        2: [new _common.Coordinate(2, 2), new _common.Coordinate(3, 1), new _common.Coordinate(4, 2)],
        4: [new _common.Coordinate(2, 4), new _common.Coordinate(4, 4), new _common.Coordinate(3, 5)],
        5: [new _common.Coordinate(1, 5), new _common.Coordinate(3, 4), new _common.Coordinate(3, 6), new _common.Coordinate(5, 5)],
        6: [new _common.Coordinate(0, 6), new _common.Coordinate(3, 5), new _common.Coordinate(6, 6)]
    }
};

var mapRows = {
    4: 2,
    5: 1,
    6: 0
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
        // console.log("1");
        return false;
    }
    console.log(move);
    var row = move.ROW > 3 ? mapRows[move.ROW] : move.ROW;
    var shiftRow = move.SHIFTROW > 3 ? mapRows[move.SHIFTROW] : move.SHIFTROW;
    console.log("row: " + row);
    console.log("shift row: " + shiftRow);
    if (VALID_SHIFTS[row] === undefined || VALID_SHIFTS[row][move.COL] === undefined) {
        return false;
    }

    for (var k = 0; k < VALID_SHIFTS[row][move.COL].length; k++) {
        var element = VALID_SHIFTS[row][move.COL][k];
        if (element.X === shiftRow && element.Y === move.SHIFTCOL) {
            return true;
        }
    }

    return false;
}

function isPossibleShift(move) {
    var i = move.ROW;
    var j = move.COL;
    var t1 = 0;
    var t2 = 0;
    var rowBounds = [0, 6];
    var colBounds = [0, 6];

    // Make sure that there is a piece to move
    if (!move.BOARD[move.ROW][move.COL].ISAVAILABLE) {
        // console.log("1");
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
            // console.log("2");
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
            // console.log("3");
            return false;
        }

        if (move.BOARD[i][j].ISAVAILABLE) {
            if (move.BOARD[i][j].TURN === null) {
                // No piece there, we can shift
                move.SHIFTROW = i;
                move.SHIFTCOL = j;
                return true;
            } else {
                // console.log(move);
                // console.log("4");
                return false;
            }
        }
    }
}

exports.countNewMills = countNewMills;
exports.isValidMove = isValidMove;
exports.isRemovable = isRemovable;
exports.isValidShift = isValidShift;
exports.CENTER_POSITION = CENTER_POSITION;
exports.isPossibleShift = isPossibleShift;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
function setUpStringFormat() {
    if (!String.prototype.format) {
        String.prototype.format = function () {
            var args = arguments;
            return this.replace(/{(\d+)}/g, function (match, number) {
                return typeof args[number] != 'undefined' ? args[number] : match;
            });
        };
    }
}

exports.setUpStringFormat = setUpStringFormat;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _algorithm = __webpack_require__(2);

var algorithm = _interopRequireWildcard(_algorithm);

var _events = __webpack_require__(0);

var _common = __webpack_require__(1);

var common = _interopRequireWildcard(_common);

var _utils = __webpack_require__(3);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

(0, _utils.setUpStringFormat)();


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
    return Math.floor(Math.random() * 2);
}

var GAME_PROPERTIES = {
    TURN: null,
    CAPTURING: false,
    MILLS: 0,
    PHASE: 1,
    SOURCE: null,
    PURPLE_PLAYER: common.PURPLE_PLAYER,
    YELLOW_PLAYER: common.YELLOW_PLAYER
};

function checkLose(gameProperties) {
    if (gameProperties.PURPLE_PLAYER.PLACED < 3 && gameProperties.PURPLE_PLAYER.AVAILABLE === 0) {
        return common.PURPLE_TURN;
    } else if (gameProperties.YELLOW_PLAYER.PLACED < 3 && gameProperties.YELLOW_PLAYER.AVAILABLE === 0) {
        return common.YELLOW_TURN;
    } else {
        return null;
    }
}

function otherPlayer() {
    return GAME_PROPERTIES.TURN !== null ? (GAME_PROPERTIES.TURN + 1) % 2 : null;
}

var alertText = document.getElementById("alertText");
var alert = document.getElementById("alert");
var turnText = document.getElementById("turnText");
var turnPromptText = document.getElementById("turnPromptText");

function setTurnText(message) {
    turnText.style.display = "block";
    turnText.innerHTML = message || GAME_PROPERTIES.TURN ? "YELLOW (1)" : "PURPLE (0)";
    turnText.style.backgroundColor = _common.SHARP_COLORS[GAME_PROPERTIES.TURN];
}

function setAlertText(message) {
    alertText.style.display = "block";
    alertText.innerHTML = message;
    setTimeout(function () {
        clearElement(alertText);
    }, 2000);
}

function clearElement(element) {
    if (element.style.display !== "none") element.style.display = "none";
}

function setCaptureText(message) {
    console.log(message);
    turnPromptText.style.display = "block";
    turnPromptText.innerHTML = message;
    turnPromptText.style.backgroundColor = _common.SHARP_COLORS[GAME_PROPERTIES.TURN];
}

function setMoveText() {
    turnPromptText.style.display = "block";
    if (GAME_PROPERTIES.TURN === 0) {
        turnPromptText.innerHTML = "Click on a PURPLE piece and a destination spot";
    } else if (GAME_PROPERTIES.TURN === 1) {
        turnPromptText.innerHTML = "Click on a YELLOW piece and a destination spot";
    } else {
        throw new TypeError("GAME_PROPERTIES.TURN invalid, expected 0 or 1 got " + String(GAME_PROPERTIES.TURN));
    }
    turnPromptText.style.backgroundColor = _common.SHARP_COLORS[GAME_PROPERTIES.TURN];
}

function startGameWithPlayer() {
    init();
    GAME_PROPERTIES.TURN = coinFlip();
    setTurnText();
    printBoard();
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

function placeSoldier(move, gameProperties) {
    if (algorithm.isValidMove(move)) {
        move.BOARD[move.ROW][move.COL].TURN = move.TURN;
        if (move.TURN === common.PURPLE_TURN) {
            gameProperties.PURPLE_PLAYER.AVAILABLE--;
            gameProperties.PURPLE_PLAYER.PLACED++;
        } else {
            gameProperties.YELLOW_PLAYER.AVAILABLE--;
            gameProperties.YELLOW_PLAYER.PLACED++;
        }
        return true;
    } else {
        console.log("Algorithm: Not a valid move.");
        return false;
    }
}

function removeSoldier(move, gameProperties, otherTurn) {
    // When removing, we remove the piece with that color
    var removingPiece = otherTurn === common.PURPLE_TURN ? gameProperties.PURPLE_PLAYER : gameProperties.YELLOW_PLAYER;
    if (!algorithm.isRemovable(move, otherTurn)) {
        return false;
    }

    if (!move.BOARD[move.ROW][move.COL].ISMILL) {
        // not a mill
        move.BOARD[move.ROW][move.COL].TURN = null;
        removingPiece.PLACED--;
        // findPosition(removingPiece.POSITION, move.ROW, move.COL);
        // removingPiece
        return true;
    } else {
        // is a mill
        if (removingPiece.PLACED > 0 && removingPiece.PLACED - removingPiece.MILLPIECES === 0) {
            // Removing from mill is possible if only mills are left
            move.BOARD[move.ROW][move.COL].TURN = null;
            move.BOARD[move.ROW][move.COL].ISMILL = false;
            removingPiece.PLACED--;
            removingPiece.MILLPIECES--;
            return true;
        }
        return false;
    }
}

function shiftSoldier(move, gameProperties) {
    if (algorithm.isValidShift(move)) {
        // reset state of current
        move.BOARD[move.ROW][move.COL].TURN = null;
        if (move.BOARD[move.ROW][move.COL].ISMILL === true) {
            if (move.TURN === common.PURPLE_TURN) {
                gameProperties.PURPLE_PLAYER.MILLPIECES--;
            } else {
                gameProperties.YELLOW_PLAYER.MILLPIECES--;
            }
            move.BOARD[move.ROW][move.COL].ISMILL = false;
        }

        // update color of new
        move.BOARD[move.SHIFTROW][move.SHIFTCOL].TURN = move.TURN;
        return true;
    }

    return false;
}

function isMillBreakable() {
    var removingPiece = (GAME_PROPERTIES.TURN + 1) % 2 === _common.PURPLE_TURN ? _common.PURPLE_PLAYER : _common.YELLOW_PLAYER;
    return removingPiece.PLACED - removingPiece.MILLPIECES === 0;
}

function handleNewMills(move, gameProperties) {
    var numMills = algorithm.countNewMills(move, gameProperties);
    if (numMills > 0) {
        // Made a mill
        var message = "";
        if (GAME_PROPERTIES.TURN === _common.YELLOW_TURN) {
            message = "Click on a PURPLE piece to remove";
        } else {
            message = "Click on a YELLOW piece to remove";
        }

        if (isMillBreakable()) {
            // Removing from mill is possible if only mills are left
            message += " that is part of a mill";
        } else {
            message += " that is not part of a mill";
        }

        setCaptureText(message);
        // tell originalHandler
        GAME_PROPERTIES.CAPTURING = true;
        GAME_PROPERTIES.MILLS = numMills;

        // don't switch turns
        return false;
    } else {
        // consume turn
        return true;
    }
}

console.log("initializing game");

startGameWithPlayer();

console.log("turn: " + GAME_PROPERTIES.TURN);

function invalidMoveAlert() {
    console.log("TURN: " + GAME_PROPERTIES.TURN);
    if (alert.style.display === "none") {
        alert.style.display = "block";
    }
    alertText.innerHTML = _common.ERRORS.invalidMove;
    setTimeout(function () {
        clearElement(alert);
    }, 5000);
}

function phaseOneHandler(e) {
    var id = e.getAttribute("id");
    var move = (0, _common.makeMoveProp)(parseInt(id[0]), parseInt(id[1]), null, null, null, null, board);
    if (GAME_PROPERTIES.TURN === _common.PURPLE_TURN || GAME_PROPERTIES.TURN === _common.YELLOW_TURN) {
        console.log(GAME_PROPERTIES.TURN);
        move.TURN = GAME_PROPERTIES.TURN;

        // phase 1
        ////////////////////////////////////////////////////////////////
        if (GAME_PROPERTIES.CAPTURING && GAME_PROPERTIES.MILLS > 0) {
            console.log("CAPTURING");
            if (removeSoldier(move, GAME_PROPERTIES, otherPlayer())) {
                e.setAttribute("fill", _common.SHARP_COLORS['default']);
                GAME_PROPERTIES.MILLS -= 1;
                if (GAME_PROPERTIES.MILLS === 0) {
                    GAME_PROPERTIES.CAPTURING = false;
                    GAME_PROPERTIES.TURN = otherPlayer();
                    setTurnText();
                    clearElement(turnPromptText);
                }

                if (_common.PURPLE_PLAYER.AVAILABLE === 0 && _common.YELLOW_PLAYER.AVAILABLE === 0 && !GAME_PROPERTIES.CAPTURING) {
                    // phase 1 end
                    console.log("------------ PHASE 1 COMPLETE ------------");
                    document.getElementById("phaseText").innerHTML = "Phase 2: Move and capture";
                    GAME_PROPERTIES.PHASE = 2;
                    setMoveText();
                }
                console.log(GAME_PROPERTIES);
            } else {
                invalidMoveAlert();
                return;
            }
            // abort
            return;
        }
        ////////////////////////////////////////////////////////////////
        if (placeSoldier(move, GAME_PROPERTIES)) {
            e.setAttribute("fill", _common.SHARP_COLORS[GAME_PROPERTIES.TURN]);
            if (handleNewMills(move, GAME_PROPERTIES)) {
                GAME_PROPERTIES.TURN = otherPlayer();
            }
        } else {
            invalidMoveAlert();
            return;
        }
    } else {
        throw RangeError("GAME_PROPERTIES.TURN not handled");
    }

    if (_common.PURPLE_PLAYER.AVAILABLE === 0 && _common.YELLOW_PLAYER.AVAILABLE === 0 && !GAME_PROPERTIES.CAPTURING) {
        // phase 1 end
        console.log("------------ PHASE 1 COMPLETE ------------");
        document.getElementById("phaseText").innerHTML = "Phase 2: Move and capture";
        GAME_PROPERTIES.PHASE = 2;
        setMoveText();
    }

    setTurnText();
}

function alertIfWinner() {
    if (_common.PURPLE_PLAYER.PLACED + _common.PURPLE_PLAYER.AVAILABLE <= 2 || _common.YELLOW_PLAYER.PLACED + _common.YELLOW_PLAYER.AVAILABLE <= 2) {
        clearElement(turnPromptText);
        clearElement(turnText);
        document.getElementById("phaseText").innerHTML = "WINNER " + (_common.PURPLE_PLAYER.PLACED + _common.PURPLE_PLAYER.AVAILABLE <= 2 ? "YELLOW" : "PURPLE") + " <a href='/'>(refresh)</a>";
        GAME_PROPERTIES.TURN = null;
    }
}

function phaseTwoHandler(e) {
    var id = e.getAttribute("id");
    var move = (0, _common.makeMoveProp)(parseInt(id[0]), parseInt(id[1]), null, null, null, null, board);

    var x = parseInt(id[0]);
    var y = parseInt(id[1]);

    if (GAME_PROPERTIES.CAPTURING && GAME_PROPERTIES.MILLS > 0) {
        // currently capturing
        if (removeSoldier(move, GAME_PROPERTIES, otherPlayer())) {
            e.setAttribute("fill", _common.SHARP_COLORS["default"]);
        } else {
            invalidMoveAlert();
            return;
        }
    }

    if (GAME_PROPERTIES.SOURCE === null) {
        // check if piece is owned by turn
        if (GAME_PROPERTIES.TURN !== board[x][y].TURN && board[x][y].ISAVAILABLE) {
            console.log(board[x][y]);
            setAlertText("Select a piece that you own to begin moving");
            return;
        }
        e.setAttribute("stroke", "green");
        GAME_PROPERTIES.SOURCE = e;
        return;
    } else {
        var x_original = parseInt(GAME_PROPERTIES.SOURCE.getAttribute("id")[0]);
        var y_original = parseInt(GAME_PROPERTIES.SOURCE.getAttribute("id")[1]);

        if (x_original === x && y_original === y) {
            e.setAttribute("stroke", null);
            GAME_PROPERTIES.SOURCE = null;
            return;
        }

        if (board[x][y].TURN !== null) {
            setAlertText("Select a empty spot to move the piece to");
            return;
        }
        var _move = (0, _common.makeMoveProp)(x_original, y_original, GAME_PROPERTIES.TURN, true, x, y, board);

        if (GAME_PROPERTIES.TURN === common.YELLOW_TURN ? GAME_PROPERTIES.YELLOW_PLAYER.PLACED === 3 : GAME_PROPERTIES.PURPLE_PLAYER.PLACED === 3) {
            _move.FLYING = true;
        }

        if (shiftSoldier(_move, GAME_PROPERTIES)) {
            // TODO: check if this makes a mill + capture
            GAME_PROPERTIES.SOURCE.setAttribute("stroke", null);
            GAME_PROPERTIES.SOURCE.setAttribute("fill", _common.SHARP_COLORS["default"]);
            GAME_PROPERTIES.SOURCE = null;
            e.setAttribute("fill", _common.SHARP_COLORS[GAME_PROPERTIES.TURN]);

            // Check if mills formed
            _move.ROW = _move.SHIFTROW;
            _move.COL = _move.SHIFTCOL;
            if (handleNewMills(_move, GAME_PROPERTIES)) {
                GAME_PROPERTIES.TURN = otherPlayer();
                setTurnText();
                setMoveText();
            }
        } else {
            setAlertText("Invalid shift!");
            return;
        }
    }
}

var svg = document.getElementById("board").getSVGDocument();

(0, _events.setUpClicks)(function (e) {
    if (GAME_PROPERTIES.PHASE === 1 || GAME_PROPERTIES.MILLS > 0) {
        phaseOneHandler(e);
    } else if (GAME_PROPERTIES.PHASE === 2) {
        phaseTwoHandler(e);
    }
    alertIfWinner();
});

function scoreBoard(turn, maxPlayer, gameProperties) {
    if (checkLose(gameProperties) !== null) {
        if (checkLose(gameProperties) === turn) {
            return -100000;
        } else {
            return 100000;
        }
    }
    // Random number from 0 to 1 to choose between any equal board score randomly
    var r = Math.random();
    var score = turn === common.YELLOW_TURN ? gameProperties.YELLOW_PLAYER.PLACED - gameProperties.PURPLE_PLAYER.PLACED : gameProperties.PURPLE_PLAYER.PLACED - gameProperties.YELLOW_PLAYER.PLACED;

    return maxPlayer ? score * (r * 0.01) : score * (r * -0.01);
}

function alphabeta(board, depth, maxPlayer, turn, gameProperties, alpha, beta) {
    if (depth === 0 || checkLose(gameProperties) !== null) {
        return {
            VALUE: scoreBoard(turn, maxPlayer, gameProperties),
            BOARD: board,
            PROPERTIES: gameProperties
        };
    }

    if (maxPlayer) {
        var bestM = {
            VALUE: -Infinity,
            BOARD: null,
            PROPERTIES: null
        };
        var children = getChildren(board, turn, gameProperties);
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            var m = alphabeta(child.BOARD, depth - 1, false, (turn + 1) % 2, child.PROPERTIES, alpha, beta);
            if (m.VALUE > bestM.VALUE) {
                bestM.VALUE = m.VALUE;
                bestM.BOARD = child.BOARD;
                bestM.PROPERTIES = child.PROPERTIES;
            }

            if (alpha > bestM.VALUE) {
                alpha = bestM.VALUE;
            }
            if (beta <= alpha) {
                break; // beta cut off
            }
        }
        return bestM;
    } else {
        var _bestM = {
            VALUE: Infinity,
            BOARD: null,
            PROPERTIES: null
        };
        var _children = getChildren(board, turn, gameProperties);
        for (var _i = 0; _i < _children.length; _i++) {
            var _child = _children[_i];
            var _m = alphabeta(_child.BOARD, depth - 1, true, (turn + 1) % 2, _child.PROPERTIES, alpha, beta);
            if (_m.VALUE < _bestM.VALUE) {
                _bestM.VALUE = _m.VALUE;
                _bestM.BOARD = _child.BOARD;
                _bestM.PROPERTIES = _child.PROPERTIES;
            }

            if (beta < _bestM.VALUE) {
                beta = _bestM.VALUE;
            }
            if (beta <= alpha) {
                break; // alpha cut off
            }
        }
        return _bestM;
    }
}

function cloneBoard(board) {
    return JSON.parse(JSON.stringify(board));
}

function cloneGameProperties(gameProperties) {
    return JSON.parse(JSON.stringify(gameProperties));
}

function getChildren(board, turn, gameProperties) {
    var children = [];
    for (var row = 0; row < MATRIX_SIZE; row++) {
        for (var col = 0; col < MATRIX_SIZE; col++) {
            if (gameProperties.PURPLE_PLAYER.AVAILABLE > 0 || gameProperties.YELLOW_PLAYER.AVAILABLE > 0) {
                // Phase 1
                if (board[row][col].ISAVAILABLE && board[row][col].TURN === null) {
                    var copyBoard = cloneBoard(board);
                    var copyGameProperties = cloneGameProperties(gameProperties);
                    var move = { ROW: row, COL: col, BOARD: copyBoard, TURN: turn };

                    placeSoldier(move, copyGameProperties);
                    handleNewMillsComputer(move, copyGameProperties);
                    children.push({ BOARD: copyBoard, PROPERTIES: copyGameProperties });
                }
            } else {
                if (board[row][col].ISAVAILABLE && board[row][col].TURN === turn) {
                    if (turn === common.YELLOW_TURN && gameProperties.YELLOW_PLAYER.PLACED === 3 || turn === common.PURPLE_TURN && gameProperties.PURPLE_PLAYER.PLACED === 3) {
                        // Phase 3
                        for (var i = 0; i < MATRIX_SIZE; i++) {
                            for (var j = 0; j < MATRIX_SIZE; j++) {
                                if (board[i][j].ISAVAILABLE && board[i][j].TURN === null) {
                                    var _copyBoard = cloneBoard(board);
                                    var _copyGameProperties = cloneGameProperties(gameProperties);
                                    _copyBoard[i][j].TURN = turn;
                                    _copyBoard[row][col].TURN = null;

                                    var _move2 = {
                                        ROW: i,
                                        COL: j,
                                        GAME_PROPERTIES: _copyGameProperties,
                                        BOARD: _copyBoard
                                    };

                                    handleNewMillsComputer(_move2, _copyGameProperties);
                                    children.push({ BOARD: _copyBoard, PROPERTIES: _copyGameProperties });
                                }
                            }
                        }
                    } else {
                        // Phase 2
                        for (var _i2 = 0; _i2 < 4; _i2++) {
                            var _copyBoard2 = cloneBoard(board);
                            var _copyGameProperties2 = cloneGameProperties(gameProperties);
                            var _move3 = { ROW: row, COL: col, BOARD: _copyBoard2, TURN: turn };

                            _move3.SHIFT = _i2;
                            if (shiftSoldier(_move3, _copyGameProperties2)) {
                                // Update row and col for handleNewMills
                                _move3.ROW = _move3.SHIFTROW;
                                _move3.COL = _move3.SHIFTCOL;
                                handleNewMillsComputer(_move3, _copyGameProperties2);
                                children.push({ BOARD: _copyBoard2, PROPERTIES: _copyGameProperties2 });
                            }
                        }
                    }
                }
            }
        }
    }

    return children;
}

var computerTurn = false;

function handleNewMillsComputer(move, gameProperties) {
    var numMills = algorithm.countNewMills(move, gameProperties);
    var otherTurn = (move.TURN + 1) % 2;
    while (numMills > 0 && !checkLose(gameProperties)) {
        var removeMillPiece = false;

        var removingPiece = otherTurn === common.PURPLE_TURN ? gameProperties.PURPLE_PLAYER : gameProperties.YELLOW_PLAYER;
        if (removingPiece.PLACED > 0 && removingPiece.PLACED - removingPiece.MILLPIECES === 0) {
            // Removing from mill is possible if only mills are left
            removeMillPiece = true;
        }

        for (var row = 0; row < MATRIX_SIZE; row++) {
            for (var col = 0; col < MATRIX_SIZE; col++) {
                move.ROW = row;
                move.COL = col;
                if (algorithm.isRemovable(move, otherTurn)) {
                    if (removeMillPiece && move.BOARD[move.ROW][move.COL].ISMILL || !removeMillPiece && !move.BOARD[move.ROW][move.COL].ISMILL) {
                        removeSoldier(move, gameProperties, otherTurn);
                        --numMills;
                        // Break out of both loops
                        row = MATRIX_SIZE;
                        col = MATRIX_SIZE;
                    }
                }
            }
        }
    }
}

var depth = 4; // TODO seems like the max reasonable depth is 4, but 3 works pretty fast

function phase1WithComputer() {
    while (GAME_PROPERTIES.PURPLE_PLAYER.AVAILABLE > 0 || GAME_PROPERTIES.YELLOW_PLAYER.AVAILABLE > 0) {
        if (computerTurn) {
            var bestM = alphabeta(board, depth, true, GAME_PROPERTIES.TURN, GAME_PROPERTIES, -Infinity, Infinity);
            board = bestM.BOARD;
            updateBoardUI();

            GAME_PROPERTIES = bestM.PROPERTIES;
            GAME_PROPERTIES.TURN = (GAME_PROPERTIES.TURN + 1) % 2;
            printBoard();
            computerTurn = !computerTurn;
        } else {
            if (GAME_PROPERTIES.TURN === common.YELLOW_TURN) {
                var positions = prompt("Yellow: Enter a position to place the piece in the form of row,col");
            } else {
                var positions = prompt("Purple: Enter a position to place the piece in the form of row,col");
            }
            positions = positions.split(",");
            var move = {
                ROW: parseInt(positions[0], 10),
                COL: parseInt(positions[1], 10),
                TURN: GAME_PROPERTIES.TURN,
                BOARD: board
            };

            if (placeSoldier(move, GAME_PROPERTIES)) {
                handleNewMills(move, GAME_PROPERTIES);
                GAME_PROPERTIES.TURN = (GAME_PROPERTIES.TURN + 1) % 2;
                printBoard();
                computerTurn = !computerTurn;
            } else {
                console.log("Invalid place");
            }
        }
    }
}

function phase2WithComputer() {
    while (GAME_PROPERTIES.PURPLE_PLAYER.PLACED > 2 && GAME_PROPERTIES.YELLOW_PLAYER.PLACED > 2) {
        if (computerTurn) {
            var bestM = alphabeta(board, depth, true, GAME_PROPERTIES.TURN, GAME_PROPERTIES, -Infinity, Infinity);
            board = bestM.BOARD;
            updateBoardUI();

            GAME_PROPERTIES = bestM.PROPERTIES;
            GAME_PROPERTIES.TURN = (GAME_PROPERTIES.TURN + 1) % 2;
            printBoard();
            computerTurn = !computerTurn;
        } else {
            if (GAME_PROPERTIES.TURN === common.YELLOW_TURN) {
                var positions = prompt("Yellow: Select position of your piece in the form of row,col");

                if (GAME_PROPERTIES.YELLOW_PLAYER.PLACED === 3) {
                    phase3(positions);
                    continue;
                } else {
                    var direction = prompt("Yellow: Enter 0(left), 1(right), 2(up), or 3(down)");
                }
            } else {
                var positions = prompt("Purple: Select position of your piece in the form of row,col");
                if (GAME_PROPERTIES.PURPLE_PLAYER.PLACED === 3) {
                    phase3(positions);
                    continue;
                } else {
                    var direction = prompt("Purple: Enter 0(left), 1(right), 2(up), or 3(down)");
                }
            }
            positions = positions.split(",");

            // Set up move for shift
            var move = {
                ROW: parseInt(positions[0], 10),
                COL: parseInt(positions[1], 10),
                TURN: GAME_PROPERTIES.TURN,
                BOARD: board,
                SHIFT: parseInt(direction, 10),
                SHIFTROW: null,
                SHIFTCOL: null
            };

            if (move.BOARD[move.ROW][move.COL].TURN !== GAME_PROPERTIES.TURN) {
                // Not your color
                console.log("Invalid piece chosen");
                continue;
            }

            if (shiftSoldier(move, GAME_PROPERTIES)) {
                // Update row and col for handleNewMills
                move.ROW = move.SHIFTROW;
                move.COL = move.SHIFTCOL;
                handleNewMills(move, GAME_PROPERTIES);
                GAME_PROPERTIES.TURN = (GAME_PROPERTIES.TURN + 1) % 2;
                computerTurn = !computerTurn;
            } else {
                console.log("Invalid shift");
            }

            printBoard();
        }
    }
}

function startGameWithComputer() {
    init();
    /*
     TODO consider using yellow as always first and minimax to have yellow as max
     ComputerTurn should be a turn not true or false
     */

    GAME_PROPERTIES.TURN = coinFlip();
    printBoard();
    console.log("Phase1");
    phase1WithComputer();
    console.log("Phase2");
    phase2WithComputer();
    if (checkLose(GAME_PROPERTIES) === common.PURPLE_TURN) {
        console.log("Yellow Wins");
    } else {
        console.log("Purple Wins");
    }
}

function updateBoardUI() {
    for (var i = 0; i < MATRIX_SIZE; i++) {
        for (var j = 0; j < MATRIX_SIZE; j++) {
            var piece = svg.getElementById(i.toString() + j.toString());
            var current = board[i][j];
            if (current.ISAVAILABLE) {
                // You can place something at all
                piece.setAttribute("fill", _common.SHARP_COLORS['default']);
                if (current.TURN !== null) {
                    piece.setAttribute("fill", _common.SHARP_COLORS[current.TURN]);
                }
            }
        }
    }
}

/***/ })
/******/ ]);