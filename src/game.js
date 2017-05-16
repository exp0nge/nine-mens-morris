import * as algorithm from './algorithm.js';
import * as common from './common.js';

// Structs
const TILE = {
    ISAVAILABLE: true,
    ISMILL: false,
    TURN: null
};

const STATES = {
    UNAVAILABLE: 0,
    AVAILABLE: 1,
    PURPLE: "P",
    YELLOW: "Y"
};

const MOVE = {
    ROW: null,
    COL: null,
    TURN: null,
    BOARD: null,
    SHIFT: null,
    SHIFTROW: null,
    SHIFTCOL: null
};

const MATRIX_SIZE = 7;
let board = new Array(MATRIX_SIZE);

function init() {
    for (let i = 0; i < MATRIX_SIZE; i++) {
        board[i] = new Array(MATRIX_SIZE);
        for (let j = 0; j < 7; j++) {
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
    YELLOW_PLAYER: common.YELLOW_PLAYER,
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
    // TODO work on phase 3
    if (checkLose(GAME_PROPERTIES) === common.PURPLE_TURN) {
        console.log("Yellow Wins");
    } else {
        console.log("Purple Wins");
    }
}

function printBoard() {
    let stringBoard = "";
    for (let i = 0; i < MATRIX_SIZE; i++) {
        for (let j = 0; j < 7; j++) {
            let tileState = board[i][j];
            let stringState = tileState.ISAVAILABLE ? STATES.AVAILABLE : STATES.UNAVAILABLE;
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
    let removingPiece = (otherTurn === common.PURPLE_TURN) ? gameProperties.PURPLE_PLAYER : gameProperties.YELLOW_PLAYER;
    if (!algorithm.isRemovable(move, otherTurn)) {
        return false;
    }

    if (!move.BOARD[move.ROW][move.COL].ISMILL) { // not a mill
        move.BOARD[move.ROW][move.COL].TURN = null;
        removingPiece.PLACED--;
        // findPosition(removingPiece.POSITION, move.ROW, move.COL);
        // removingPiece
        return true;
    } else { // is a mill
        if (removingPiece.PLACED > 0 && removingPiece.PLACED - removingPiece.MILLPIECES === 0) { // Removing from mill is possible if only mills are left
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
    let numMills = algorithm.countNewMills(move, gameProperties);
    while (numMills > 0) { // Made a mill
        printBoard();
        let message = "";
        if (gameProperties.TURN === common.YELLOW_TURN) {
            message = "Yellow: Enter a position to remove a purple piece in the form of row,col";
        } else {
            message = "Purple: Enter a position to remove a yellow piece in the form of row,col"
        }

        let otherTurn = (gameProperties.TURN + 1) % 2;
        let removingPiece = otherTurn === common.PURPLE_TURN ? gameProperties.PURPLE_PLAYER : gameProperties.YELLOW_PLAYER;
        if (removingPiece.PLACED > 0  && removingPiece.PLACED - removingPiece.MILLPIECES === 0) { // Removing from mill is possible if only mills are left
            message += " that is a mill";
        } else {
            message += " that is not a mill";
        }

        let positions = prompt(message);
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
        let move = {
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
    while (GAME_PROPERTIES.PURPLE_PLAYER.PLACED > 2 && GAME_PROPERTIES.YELLOW_PLAYER.PLACED > 2) {
        if (GAME_PROPERTIES.TURN === common.YELLOW_TURN) {
            var positions = prompt("Yellow: Select position of your piece in the form of row,col");
            var direction = prompt("Yellow: Enter 0(left), 1(right), 2(up), or 3(down)");
        } else {
            var positions = prompt("Purple: Select position of your piece in the form of row,col");
            var direction = prompt("Purple: Enter 0(left), 1(right), 2(up), or 3(down)");
        }
        positions = positions.split(",");

        // Set up move for shift
        let move = {
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
    let r = Math.random();
    let score = turn === common.YELLOW_TURN ?
            gameProperties.YELLOW_PLAYER.PLACED - gameProperties.PURPLE_PLAYER.PLACED :
            gameProperties.PURPLE_PLAYER.PLACED - gameProperties.YELLOW_PLAYER.PLACED;

    return maxPlayer ? score*(r*0.01) :  score*(r*(-0.01));
}

function alphabeta(board, depth, maxPlayer, turn, phase1, gameProperties, alpha, beta) {
    if (depth === 0 || (checkLose(gameProperties) !== null)) {
        return {
            VALUE: scoreBoard(turn, maxPlayer,gameProperties),
            BOARD: board,
            PROPERTIES: gameProperties
        };
    }

    if (maxPlayer) {
        let bestM = {
            VALUE: -Infinity,
            BOARD: null,
            PROPERTIES: null
        };
        let children = getChildren(board, turn, phase1, gameProperties);
        for (let i = 0; i< children.length; i++) {
            let child = children[i];
            let m = alphabeta(child.BOARD, depth-1, false, (turn+1)%2, phase1, child.PROPERTIES, alpha, beta);
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
        let bestM = {
            VALUE: Infinity,
            BOARD: null,
            PROPERTIES: null
        };
        let children = getChildren(board, turn, phase1, gameProperties);
        for (let i = 0; i< children.length; i++) {
            let child = children[i];
            let m = alphabeta(child.BOARD, depth-1, true, (turn+1)%2, phase1, child.PROPERTIES, alpha, beta);
            if (m.VALUE < bestM.VALUE) {
                bestM.VALUE = m.VALUE;
                bestM.BOARD = child.BOARD;
                bestM.PROPERTIES = child.PROPERTIES;
            }

            if (beta < bestM.VALUE) {
                beta = bestM.VALUE;
            }
            if (beta <= alpha) {
                break; // alpha cut off
            }
        }
        return bestM;
    }


}

function cloneBoard(board) {
    let clone = new Array(board.length);
    for(let i=0; i<board.length; i++) {
        clone[i] = new Array(board[i].length);
        for(let j=0; j<board[i].length; j++) {
            clone[i][j] = JSON.parse(JSON.stringify(board[i][j]));
        }
    }

    return clone;
}

function cloneGameProperties(gameProperties){
    return JSON.parse(JSON.stringify(gameProperties));
}


function getChildren(board, turn, phase1, gameProperties) {
    let children = [];
    for (let row = 0; row < MATRIX_SIZE; row++) {
        for (let col = 0; col < MATRIX_SIZE; col++) {
            if (phase1) {
                if (board[row][col].ISAVAILABLE && board[row][col].TURN === null) {
                    let copyBoard = cloneBoard(board);
                    let copyGameProperties = cloneGameProperties(gameProperties);
                    let move = {ROW: row, COL: col, BOARD: copyBoard, TURN: turn};

                    placeSoldier(move, copyGameProperties);
                    handleNewMillsComputer(move, copyGameProperties);
                    children.push({BOARD: copyBoard, PROPERTIES: copyGameProperties});
                }
            } else {
                if (board[row][col].ISAVAILABLE && board[row][col].TURN === turn) {
                    for (let i = 0; i<4; i++) {
                        let copyBoard = cloneBoard(board);
                        let copyGameProperties = cloneGameProperties(gameProperties);
                        let move = {ROW: row, COL: col, BOARD: copyBoard, TURN: turn};

                        move.SHIFT = i;
                        if (shiftSoldier(move, copyGameProperties)) {
                            // Update row and col for handleNewMills
                            move.ROW = move.SHIFTROW;
                            move.COL = move.SHIFTCOL;
                            handleNewMillsComputer(move, copyGameProperties);
                            children.push({BOARD: copyBoard, PROPERTIES: copyGameProperties});
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
    let numMills = algorithm.countNewMills(move, gameProperties);
    let otherTurn = (move.TURN + 1) % 2;
    while(numMills > 0 && !checkLose(gameProperties)) {
        let removeMillPiece = false;

        let removingPiece = (otherTurn === common.PURPLE_TURN) ? gameProperties.PURPLE_PLAYER : gameProperties.YELLOW_PLAYER;
        if (removingPiece.PLACED > 0 && removingPiece.PLACED - removingPiece.MILLPIECES === 0) { // Removing from mill is possible if only mills are left
            removeMillPiece = true;
        }

        for (let row = 0; row < MATRIX_SIZE; row++) {
            for (let col = 0; col < MATRIX_SIZE; col++) {
                move.ROW = row;
                move.COL = col;
                if (algorithm.isRemovable(move, otherTurn))  {
                    if ((removeMillPiece && move.BOARD[move.ROW][move.COL].ISMILL) ||
                        (!removeMillPiece && !move.BOARD[move.ROW][move.COL].ISMILL)) {
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
            let bestM = alphabeta(board, 4, true, GAME_PROPERTIES.TURN, true, GAME_PROPERTIES, -Infinity, Infinity);
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
            let move = {
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
            let bestM = alphabeta(board, 4, true, GAME_PROPERTIES.TURN, false, GAME_PROPERTIES, -Infinity, Infinity);
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
            let move = {
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
    //TODO phase 3
    if (checkLose(GAME_PROPERTIES) === common.PURPLE_TURN) {
        console.log("Yellow Wins");
    } else {
        console.log("Purple Wins");
    }
}

// startGameWithPlayer();
startGameWithComputer();

