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

const GAME_PROPERTIES = {
    TURN: null,
    CAPTURING: false,
    MILLS: 0,
    PURPLE_PLAYER: common.PURPLE_PLAYER,
    YELLOW_PLAYER: common.YELLOW_PLAYER,
};

function checkLose(gameProperties) {
    if (gameProperties.PURPLE_PLAYER.PLACED < 3) return common.PURPLE_TURN;
    if (gameProperties.YELLOW_PLAYER.PLACED < 3) return common.YELLOW_TURN;
}

function startGameWithPlayer() {
    init();
    GAME_PROPERTIES.TURN = coinFlip();
    printBoard();
    console.log("Phase1");
    phase1();
    console.log("Phase2");
    phase2();
    if (checkLose() === common.PURPLE_TURN) {
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

function removeSoldier(move, gameProperties) {
    // When removing, we remove the piece with that color
    let removingPiece = (move.TURN === common.PURPLE_TURN) ? gameProperties.PURPLE_PLAYER : gameProperties.YELLOW_PLAYER;
    if (!algorithm.isRemovable(move)) {
        return false;
    }

    if (!move.BOARD[move.ROW][move.COL].ISMILL) { // not a mill
        move.BOARD[move.ROW][move.COL].TURN = null;
        removingPiece.PLACED--;
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

        let removingPiece = (((gameProperties.TURN + 1) % 2) === common.PURPLE_TURN) ? gameProperties.PURPLE_PLAYER : gameProperties.YELLOW_PLAYER;
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
        if (removeSoldier(move, gameProperties)) {
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

console.log("initializing game");

function countN(isRow, n, turn, board) {
    let totalCount = 0;
    for (let row = 0; row < MATRIX_SIZE; row++) {
        let count = 0;
        for (let col = 0; col < MATRIX_SIZE; col++) {
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

function scoreBoard(turn, board, gameProperties) {
    return 10*countN(true, 2, turn, board) + 10*countN(false, 2, turn, board) +
        100*countN(true, 3, turn, board) + 100*countN(false, 3, turn, board) +
        (turn === common.YELLOW_TURN ? gameProperties.YELLOW_PLAYER.PLACED - gameProperties.PURPLE_PLAYER.PLACED :
            gameProperties.PURPLE_PLAYER.PLACED - gameProperties.YELLOW_PLAYER.PLACED);
}

var bestBoard;

function minimax(board, depth, maxPlayer, turn, phase1, gameProperties) {
    if (depth === 0) {
        return scoreBoard(turn, board, gameProperties);
    }

    if (maxPlayer) {
        let bestValue = -Infinity;
        let children = getChildren(board, turn, phase1, gameProperties);
        for (let i = 0; i< children.length; i++) {
            let child = children[i];
            let value = minimax(child, depth-1, false, (turn+1)%2, phase1, gameProperties);
            if (value > bestValue) {
                bestValue = value;
                bestBoard = child;
            }
        }
        return bestValue;
    } else {
        let bestValue = -Infinity;
        let children = getChildren(board, turn, phase1, gameProperties);
        for (let i = 0; i< children.length; i++) {
            let child = children[i];
            let value = minimax(child, depth-1, true, (turn+1)%2, phase1, gameProperties);
            if (value < bestValue) {
                bestValue = value;
                bestBoard = child;
            }
        }
        return bestValue;
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


function getShiftChildren(board, turn, row, col) {
    let shiftChildren = [];
    for (let direction = 0; direction<4; direction++) {
        let t1 = 0;
        let t2 = 0;
        let i = row;
        let j = col;
        let rowBounds = [0, 6];
        let colBounds = [0, 6];
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

        let status = true;
        while (status) { // Continue moving in a direction
            i += t1;
            j += t2;

            if (i < rowBounds[0] || i > rowBounds[1] || j < colBounds[0] || j > colBounds[1]) { // Out of bounds
                status = false;
                continue;
            }

            if (board[i][j].ISAVAILABLE) {
                if (board[i][j].TURN === null) { // No piece there, we can shift
                    let clone = cloneBoard(board);
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
            }
        }
    }
    return shiftChildren;
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
                    children.push(copyBoard);
                }
            } else {
                if (board[row][col].ISAVAILABLE && board[row][col].TURN === turn) {
                    let shiftChildren = getShiftChildren(board, turn, row, col);
                    for (let i= 0; i<shiftChildren.length; i++) {
                        // TODO finish moving shift and handle here
                        children.push(shiftChildren[i]);
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
    move.TURN = (gameProperties.TURN + 1) % 2;
    while(numMills > 0 && !checkLose(gameProperties)) {
        let removeMillPiece = false;

        let removingPiece = (move.TURN === common.PURPLE_TURN) ? gameProperties.PURPLE_PLAYER : gameProperties.YELLOW_PLAYER;
        if (removingPiece.PLACED > 0 && removingPiece.PLACED - removingPiece.MILLPIECES === 0) { // Removing from mill is possible if only mills are left
            removeMillPiece = true;
        }

        for (let row = 0; row < MATRIX_SIZE; row++) {
            for (let col = 0; col < MATRIX_SIZE; col++) {
                move.ROW = row;
                move.COL = col;
                if (algorithm.isRemovable(move))  {
                    if ((removeMillPiece && move.BOARD[move.ROW][move.COL].ISMILL) ||
                        (!removeMillPiece && !move.BOARD[move.ROW][move.COL].ISMILL)) {
                        removeSoldier(move, gameProperties);
                        --numMills;
                        // Break out of both loops
                        row = MATRIX_SIZE;
                        col = MATRIX_SIZE;
                    } else {
                        console.log(move);
                        // console.log(move.BOARD);
                        console.log(removeMillPiece);
                    }
                }
            }
        }
    }
}


function phase1WithComputer() {
    while (GAME_PROPERTIES.PURPLE_PLAYER.AVAILABLE > 0 || GAME_PROPERTIES.YELLOW_PLAYER.AVAILABLE > 0) {
        if (computerTurn) {
            minimax(board, 3, true, GAME_PROPERTIES.TURN, true, GAME_PROPERTIES);
            board = bestBoard;
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
    while (GAME_PROPERTIES.PURPLE_PLAYER.PLACED > 2 && GAME_PROPERTIES.YELLOW_PLAYER.PLACED > 2) {
        if (computerTurn) {
            minimax(board, 3, true, GAME_PROPERTIES.TURN, false, GAME_PROPERTIES);
            // Need to ensure BOARD has reference to actual board
            bestBoard.BOARD = board;
            if (shiftSoldier(bestBoard, GAME_PROPERTIES)) {
                // TODO move handle new mills and shift to minimax
                handleNewMillsComputer(bestBoard, GAME_PROPERTIES);
                GAME_PROPERTIES.TURN = (GAME_PROPERTIES.TURN + 1) % 2;
                printBoard();
                computerTurn = !computerTurn;
            } else {
                console.log("Invalid shift");
            }

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

