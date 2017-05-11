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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
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

exports.PURPLE_PLAYER = PURPLE_PLAYER;
exports.YELLOW_PLAYER = YELLOW_PLAYER;
exports.PURPLE_TURN = PURPLE_TURN;
exports.YELLOW_TURN = YELLOW_TURN;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CENTER_POSITION = exports.isValidShift = exports.isRemovable = exports.isValidMove = exports.countNewMills = undefined;

var _common = __webpack_require__(0);

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
                    _common.YELLOW_PLAYER.MILLPIECES += 1;
                } else if (move.TURN === _common.PURPLE_TURN) {
                    _common.PURPLE_PLAYER.MILLPIECES += 1;
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
    return tileState.ISAVAILABLE && tileState.TURN === move.TURN;
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
        console.log("1");
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
            console.log("2");
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
            console.log("3");
            return false;
        }

        if (move.BOARD[i][j].ISAVAILABLE) {
            if (move.BOARD[i][j].TURN === null) {
                // No piece there, we can shift
                move.SHIFTROW = i;
                move.SHIFTCOL = j;
                return true;
            } else {
                console.log(move);
                console.log("4");
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

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _algorithm = __webpack_require__(1);

var algorithm = _interopRequireWildcard(_algorithm);

var _common = __webpack_require__(0);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// Structs
var TILE = {
    ISAVAILABLE: true,
    ISMILL: false,
    TURN: null
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
    TURN: null,
    BOARD: null,
    SHIFT: null,
    SHIFTROW: null,
    SHIFTCOL: null
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
    MILLS: 0
};

function checkLose() {
    if (_common.PURPLE_PLAYER.PLACED < 3) return _common.PURPLE_TURN;
    if (_common.YELLOW_PLAYER.PLACED < 3) return _common.YELLOW_TURN;
}

function startGameWithPlayer() {
    init();
    GAME_PROPERTIES.TURN = coinFlip();
    printBoard();
    console.log("Phase1");
    phase1();
    console.log("Phase2");
    phase2();
    if (checkLose() === _common.PURPLE_TURN) {
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
            if (tileState.TURN !== null && tileState.TURN !== undefined) {
                stringState = tileState.TURN ? STATES.YELLOW : STATES.PURPLE;
            }
            stringBoard += stringState;
        }
        stringBoard += "\n";
    }
    console.log(stringBoard);
}

function placeSoldier(move) {
    if (algorithm.isValidMove(move)) {
        move.BOARD[move.ROW][move.COL].TURN = move.TURN;
        if (move.TURN === _common.PURPLE_TURN) {
            _common.PURPLE_PLAYER.AVAILABLE--;
            _common.PURPLE_PLAYER.PLACED++;
        } else {
            _common.YELLOW_PLAYER.AVAILABLE--;
            _common.YELLOW_PLAYER.PLACED++;
        }
        return true;
    } else {
        console.log("Algorithm: Not a valid move.");
        return false;
    }
}

function removeSoldier(move) {
    // When removing, we remove the piece with that color
    var removingPiece = move.TURN === _common.PURPLE_TURN ? _common.PURPLE_PLAYER : _common.YELLOW_PLAYER;
    if (!algorithm.isRemovable(move)) {
        return false;
    }

    if (!move.BOARD[move.ROW][move.COL].ISMILL) {
        // not a mill
        move.BOARD[move.ROW][move.COL].TURN = null;
        removingPiece.PLACED--;
        return true;
    } else {
        // is a mill
        if (removingPiece.PLACED - removingPiece.MILLPIECES === 0) {
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

function shiftSoldier(move) {
    if (algorithm.isValidShift(move)) {
        // reset state of current
        move.BOARD[move.ROW][move.COL].TURN = null;
        if (move.BOARD[move.ROW][move.COL].ISMILL === true) {
            if (move.TURN === _common.PURPLE_TURN) {
                _common.PURPLE_PLAYER.MILLPIECES--;
            } else {
                _common.YELLOW_PLAYER.MILLPIECES--;
            }
            move.BOARD[move.ROW][move.COL].ISMILL = false;
        }

        // update color of new
        move.BOARD[move.SHIFTROW][move.SHIFTCOL].TURN = move.TURN;
        return true;
    }

    return false;
}

function handleNewMills(move) {
    var numMills = algorithm.countNewMills(move);
    while (numMills > 0) {
        // Made a mill
        printBoard();
        var message = "";
        if (GAME_PROPERTIES.TURN === _common.YELLOW_TURN) {
            message = "Yellow: Enter a position to remove a purple piece in the form of row,col";
        } else {
            message = "Purple: Enter a position to remove a yellow piece in the form of row,col";
        }

        var removingPiece = (GAME_PROPERTIES.TURN + 1) % 2 === _common.PURPLE_TURN ? _common.PURPLE_PLAYER : _common.YELLOW_PLAYER;
        if (removingPiece.PLACED - removingPiece.MILLPIECES === 0) {
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
            TURN: (GAME_PROPERTIES.TURN + 1) % 2,
            BOARD: move.BOARD
        };
        if (removeSoldier(move)) {
            numMills--;
        } else {
            console.log("Invalid remove");
        }
    }
}

function phase1() {
    while (_common.PURPLE_PLAYER.AVAILABLE > 0 || _common.YELLOW_PLAYER.AVAILABLE > 0) {
        if (GAME_PROPERTIES.TURN === _common.YELLOW_TURN) {
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
    while (_common.PURPLE_PLAYER.PLACED > 2 && _common.YELLOW_PLAYER.PLACED > 2) {
        if (GAME_PROPERTIES.TURN === _common.YELLOW_TURN) {
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

function countN(isRow, n, turn, board) {
    var totalCount = 0;
    for (var row = 0; row < MATRIX_SIZE; row++) {
        var count = 0;
        for (var col = 0; col < MATRIX_SIZE; col++) {
            if (isRow) {
                if (board[row][col].ISAVAILABLE && board[row][col].TURN === turn) {
                    count++;
                }
            } else {
                if (board[col][row].ISAVAILABLE && board[col][row].TURN === turn) {
                    count++;
                }
            }
        }
        if (count === n) {
            totalCount++;
        }
    }
    return totalCount;
}

function scoreBoard(turn, board) {
    return 10 * countN(true, 2, turn, board) + 10 * countN(false, 2, turn, board) + 100 * countN(true, 3, turn, board) + 100 * countN(false, 3, turn, board) + (turn === _common.YELLOW_TURN ? _common.YELLOW_PLAYER.PLACED - _common.PURPLE_PLAYER.PLACED : _common.PURPLE_PLAYER.PLACED - _common.YELLOW_PLAYER.PLACED);
}

var bestMove;

function minimax(node, depth, maxPlayer, turn, phase1) {
    if (depth === 0) {
        return scoreBoard(turn, node);
    }

    if (maxPlayer) {
        var bestValue = -Infinity;
        var children = getChildren(node, turn, phase1);
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            var value = minimax(child.BOARD, depth - 1, false, (turn + 1) % 2, phase1);
            if (value > bestValue) {
                bestValue = value;
                bestMove = { BOARD: node, ROW: child.ROW, COL: child.COL, TURN: turn };
                if (!phase1) {
                    bestMove.SHIFT = child.SHIFT;
                }
            }
        }
        return bestValue;
    } else {
        var _bestValue = -Infinity;
        var _children = getChildren(node, turn, phase1);
        for (var _i = 0; _i < _children.length; _i++) {
            var _child = _children[_i];
            var _value = minimax(_child.BOARD, depth - 1, true, (turn + 1) % 2, phase1);
            if (_value < _bestValue) {
                _bestValue = _value;
                bestMove = { BOARD: node, ROW: _child.ROW, COL: _child.COL, TURN: turn };
                if (!phase1) {
                    bestMove.SHIFT = _child.SHIFT;
                }
            }
        }
        return _bestValue;
    }
}

function cloneBoard(board) {
    var clone = new Array(board.length);
    for (var i = 0; i < board.length; i++) {
        clone[i] = new Array(board[i].length);
        for (var j = 0; j < board[i].length; j++) {
            clone[i][j] = JSON.parse(JSON.stringify(board[i][j]));
        }
    }

    return clone;
}

function getShiftChildren(board, turn, row, col) {
    var shiftChildren = [];
    for (var direction = 0; direction < 4; direction++) {
        var t1 = 0;
        var t2 = 0;
        var i = row;
        var j = col;
        var rowBounds = [0, 6];
        var colBounds = [0, 6];
        if (direction === 0) {
            t2 = -1;
        } else if (direction === 1) {
            t2 = 1;
        } else if (direction === 2) {
            t1 = -1;
        } else if (direction === 3) {
            t1 = 1;
        }

        // Special cases for center row/column
        if (row === algorithm.CENTER_POSITION) {
            if (col < algorithm.CENTER_POSITION) {
                colBounds[1] = algorithm.CENTER_POSITION;
            } else {
                colBounds[0] = algorithm.CENTER_POSITION;
            }
        }

        if (col === algorithm.CENTER_POSITION) {
            if (row < algorithm.CENTER_POSITION) {
                rowBounds[1] = algorithm.CENTER_POSITION;
            } else {
                rowBounds[0] = algorithm.CENTER_POSITION;
            }
        }

        var status = true;
        while (status) {
            // Continue moving in a direction
            i += t1;
            j += t2;

            if (i < rowBounds[0] || i > rowBounds[1] || j < colBounds[0] || j > colBounds[1]) {
                // Out of bounds
                status = false;
                continue;
            }

            if (board[i][j].ISAVAILABLE) {
                if (board[i][j].TURN === null) {
                    // No piece there, we can shift
                    var clone = cloneBoard(board);
                    clone[row][col].TURN = null;
                    clone[i][j].TURN = turn;
                    shiftChildren.push({
                        BOARD: clone,
                        ROW: row,
                        COL: col,
                        SHIFT: direction
                    });
                }
                status = false;
                continue;
            }
        }
    }
    return shiftChildren;
}

function getChildren(node, turn, phase1) {
    var children = [];
    for (var row = 0; row < MATRIX_SIZE; row++) {
        for (var col = 0; col < MATRIX_SIZE; col++) {
            if (phase1) {
                if (board[row][col].ISAVAILABLE && board[row][col].TURN === null) {
                    var clone = cloneBoard(node);
                    clone[row][col].TURN = turn;
                    children.push({
                        BOARD: clone,
                        ROW: row,
                        COL: col
                    });
                }
            } else {
                if (board[row][col].ISAVAILABLE && board[row][col].TURN === turn) {
                    var shiftChildren = getShiftChildren(node, turn, row, col);
                    for (var i = 0; i < shiftChildren.length; i++) {
                        children.push(shiftChildren[i]);
                    }
                }
            }
        }
    }

    return children;
}

var computerTurn = false;

function handleNewMillsComputer(move) {
    var numMills = algorithm.countNewMills(move);
    move.TURN = (GAME_PROPERTIES.TURN + 1) % 2;
    while (numMills > 0) {
        var removeMillPiece = false;

        var removingPiece = move.TURN === _common.PURPLE_TURN ? _common.PURPLE_PLAYER : _common.YELLOW_PLAYER;
        if (removingPiece.PLACED - removingPiece.MILLPIECES === 0) {
            // Removing from mill is possible if only mills are left
            removeMillPiece = true;
        }

        for (var row = 0; row < MATRIX_SIZE; row++) {
            for (var col = 0; col < MATRIX_SIZE; col++) {
                move.ROW = row;
                move.COL = col;
                if (algorithm.isRemovable(move)) {
                    if (removeMillPiece && move.BOARD[move.ROW][move.COL].ISMILL || !removeMillPiece && !move.BOARD[move.ROW][move.COL].ISMILL) {
                        removeSoldier(move);
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

function phase1WithComputer() {
    while (_common.PURPLE_PLAYER.AVAILABLE > 0 || _common.YELLOW_PLAYER.AVAILABLE > 0) {
        if (computerTurn) {
            minimax(board, 3, true, GAME_PROPERTIES.TURN, true);
            // Need to ensure BOARD has reference to actual board
            bestMove.BOARD = board;
            if (placeSoldier(bestMove)) {
                handleNewMillsComputer(bestMove);
                GAME_PROPERTIES.TURN = (GAME_PROPERTIES.TURN + 1) % 2;
                printBoard();
                computerTurn = !computerTurn;
            } else {
                console.log("Invalid place");
            }
        } else {
            if (GAME_PROPERTIES.TURN === _common.YELLOW_TURN) {
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

            if (placeSoldier(move)) {
                handleNewMills(move);
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
    while (_common.PURPLE_PLAYER.PLACED > 2 && _common.YELLOW_PLAYER.PLACED > 2) {
        if (computerTurn) {
            //TODO
            minimax(board, 3, true, GAME_PROPERTIES.TURN, false);
            // Need to ensure BOARD has reference to actual board
            bestMove.BOARD = board;
            if (shiftSoldier(bestMove)) {
                handleNewMillsComputer(bestMove);
                GAME_PROPERTIES.TURN = (GAME_PROPERTIES.TURN + 1) % 2;
                printBoard();
                computerTurn = !computerTurn;
            } else {
                console.log("Invalid shift");
            }
        } else {
            if (GAME_PROPERTIES.TURN === _common.YELLOW_TURN) {
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

            if (shiftSoldier(move)) {
                // Update row and col for handleNewMills
                move.ROW = move.SHIFTROW;
                move.COL = move.SHIFTCOL;
                handleNewMills(move);
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
    GAME_PROPERTIES.TURN = coinFlip();
    printBoard();
    console.log("Phase1");
    phase1WithComputer();
    console.log("Phase2");
    phase2WithComputer();
    if (checkLose() === _common.PURPLE_TURN) {
        console.log("Yellow Wins");
    } else {
        console.log("Purple Wins");
    }
}

// startGameWithPlayer();
startGameWithComputer();

/***/ })
/******/ ]);