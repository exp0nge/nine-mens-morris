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

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _algorithm = __webpack_require__(1);

var algorithm = _interopRequireWildcard(_algorithm);

var _common = __webpack_require__(0);

var common = _interopRequireWildcard(_common);

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
    MILLS: 0,
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

function startGameWithPlayer() {
    init();
    GAME_PROPERTIES.TURN = coinFlip();
    printBoard();
    console.log("Phase1");
    phase1();
    console.log("Phase2");
    phase2();
    console.log("Phase3");
    phase3();
    if (checkLose(GAME_PROPERTIES) === common.PURPLE_TURN) {
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

function placeSoldier(move, gameProperties) {
    if (algorithm.isValidMove(move)) {
        move.BOARD[move.ROW][move.COL].TURN = move.TURN;
        if (move.TURN === common.PURPLE_TURN) {
            gameProperties.PURPLE_PLAYER.AVAILABLE--;
            gameProperties.PURPLE_PLAYER.PLACED++;
            // gameProperties.PURPLE_PLAYER.POSITIONS.push({ROW: move.ROW, COL: move.COL});
        } else {
            gameProperties.YELLOW_PLAYER.AVAILABLE--;
            gameProperties.YELLOW_PLAYER.PLACED++;
            // gameProperties.PURPLE_PLAYER.POSITIONS.push({ROW: move.ROW, COL: move.COL});
        }
        return true;
    } else {
        console.log("Algorithm: Not a valid move.");
        return false;
    }
}

// function findPosition(positions, row, col) {
//     for (let i=0; i < positions.length; i++) {
//         if (positions[i].ROW === row && positions[i].COL === col) {
//             return i;
//         }
//     }
//     return null;
// }

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

function handleNewMills(move, gameProperties) {
    var numMills = algorithm.countNewMills(move, gameProperties);
    while (numMills > 0) {
        // Made a mill
        printBoard();
        var message = "";
        if (gameProperties.TURN === common.YELLOW_TURN) {
            message = "Yellow: Enter a position to remove a purple piece in the form of row,col";
        } else {
            message = "Purple: Enter a position to remove a yellow piece in the form of row,col";
        }

        var otherTurn = (gameProperties.TURN + 1) % 2;
        var removingPiece = otherTurn === common.PURPLE_TURN ? gameProperties.PURPLE_PLAYER : gameProperties.YELLOW_PLAYER;
        if (removingPiece.PLACED > 0 && removingPiece.PLACED - removingPiece.MILLPIECES === 0) {
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
            TURN: (gameProperties.TURN + 1) % 2,
            BOARD: move.BOARD
        };
        if (removeSoldier(move, gameProperties, otherTurn)) {
            numMills--;
        } else {
            console.log("Invalid remove");
        }
    }
}

function phase1() {
    while (GAME_PROPERTIES.PURPLE_PLAYER.AVAILABLE > 0 || GAME_PROPERTIES.YELLOW_PLAYER.AVAILABLE > 0) {
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
        } else {
            console.log("Invalid place");
        }

        printBoard();
    }
}

function phase2() {
    while (GAME_PROPERTIES.PURPLE_PLAYER.PLACED > 3 && GAME_PROPERTIES.YELLOW_PLAYER.PLACED > 3) {
        if (GAME_PROPERTIES.TURN === common.YELLOW_TURN) {
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

        if (shiftSoldier(move, GAME_PROPERTIES)) {
            // Update row and col for handleNewMills
            move.ROW = move.SHIFTROW;
            move.COL = move.SHIFTCOL;
            handleNewMills(move, GAME_PROPERTIES);
            GAME_PROPERTIES.TURN = (GAME_PROPERTIES.TURN + 1) % 2;
        } else {
            console.log("Invalid shift");
        }

        printBoard();
    }
}

function phase3() {
    while (GAME_PROPERTIES.PURPLE_PLAYER.PLACED > 2 && GAME_PROPERTIES.YELLOW_PLAYER.PLACED > 2) {
        if (GAME_PROPERTIES.TURN === common.YELLOW_TURN) {
            var positions = prompt("Yellow: Select position of your piece in the form of row,col");
            var direction = prompt("Yellow: Enter position to fly to in the form of row,col");
        } else {
            var positions = prompt("Purple: Select position of your piece in the form of row,col");
            var direction = prompt("Purple: Enter position to fly to in the form of row,col");
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
        } else {
            console.log("Invalid shift");
        }

        printBoard();
    }
}

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

function alphabeta(board, depth, maxPlayer, turn, phase1, gameProperties, alpha, beta) {
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
        var children = getChildren(board, turn, phase1, gameProperties);
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            var m = alphabeta(child.BOARD, depth - 1, false, (turn + 1) % 2, phase1, child.PROPERTIES, alpha, beta);
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
        var _children = getChildren(board, turn, phase1, gameProperties);
        for (var _i = 0; _i < _children.length; _i++) {
            var _child = _children[_i];
            var _m = alphabeta(_child.BOARD, depth - 1, true, (turn + 1) % 2, phase1, _child.PROPERTIES, alpha, beta);
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
    var clone = new Array(board.length);
    for (var i = 0; i < board.length; i++) {
        clone[i] = new Array(board[i].length);
        for (var j = 0; j < board[i].length; j++) {
            clone[i][j] = JSON.parse(JSON.stringify(board[i][j]));
        }
    }

    return clone;
}

function cloneGameProperties(gameProperties) {
    return JSON.parse(JSON.stringify(gameProperties));
}

function getChildren(board, turn, phase1, gameProperties) {
    var children = [];
    for (var row = 0; row < MATRIX_SIZE; row++) {
        for (var col = 0; col < MATRIX_SIZE; col++) {
            if (phase1) {
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
                    for (var i = 0; i < 4; i++) {
                        var _copyBoard = cloneBoard(board);
                        var _copyGameProperties = cloneGameProperties(gameProperties);
                        var _move = { ROW: row, COL: col, BOARD: _copyBoard, TURN: turn };

                        _move.SHIFT = i;
                        if (shiftSoldier(_move, _copyGameProperties)) {
                            // Update row and col for handleNewMills
                            _move.ROW = _move.SHIFTROW;
                            _move.COL = _move.SHIFTCOL;
                            handleNewMillsComputer(_move, _copyGameProperties);
                            children.push({ BOARD: _copyBoard, PROPERTIES: _copyGameProperties });
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

function phase1WithComputer() {
    while (GAME_PROPERTIES.PURPLE_PLAYER.AVAILABLE > 0 || GAME_PROPERTIES.YELLOW_PLAYER.AVAILABLE > 0) {
        if (computerTurn) {
            var bestM = alphabeta(board, 4, true, GAME_PROPERTIES.TURN, true, GAME_PROPERTIES, -Infinity, Infinity);
            board = bestM.BOARD;
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
    while (GAME_PROPERTIES.PURPLE_PLAYER.PLACED > 3 && GAME_PROPERTIES.YELLOW_PLAYER.PLACED > 3) {
        if (computerTurn) {
            var bestM = alphabeta(board, 4, true, GAME_PROPERTIES.TURN, false, GAME_PROPERTIES, -Infinity, Infinity);
            board = bestM.BOARD;
            GAME_PROPERTIES = bestM.PROPERTIES;
            GAME_PROPERTIES.TURN = (GAME_PROPERTIES.TURN + 1) % 2;
            printBoard();
            computerTurn = !computerTurn;
        } else {
            if (GAME_PROPERTIES.TURN === common.YELLOW_TURN) {
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

// startGameWithPlayer();
startGameWithComputer();

/***/ })
/******/ ]);