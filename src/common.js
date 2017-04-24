const SHARP_COLORS = {
    0: '#ff00ee', // purple
    1: '#f6ff00', // yellow
    default: '#000000'
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
    }
}

const ERRORS = {
    invalidMove: "Invalid move"
};

const DIALOG = {
    purpleTurn: "Purple's turn",
    yellowTurn: "Yellow's turn"
};

const PURPLE_PLAYER = {
    AVAILABLE: 4,
    PLACED: 0,
    MILLPIECES: 0
};

const YELLOW_PLAYER = {
    AVAILABLE: 4,
    PLACED: 0,
    MILLPIECES: 0
};

const PURPLE_TURN = 0;
const YELLOW_TURN = 1;

const MATRIX_SIZE = 7;

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

function placeSoldier(move, board) {
    if (algorithm.isValidMove(move)) {
        board[move.ROW][move.COL].TURN = move.TURN;
        if (move.TURN === PURPLE_TURN) {
            PURPLE_PLAYER.AVAILABLE--;
            PURPLE_PLAYER.PLACED++;
        } else {
            YELLOW_PLAYER.AVAILABLE--;
            YELLOW_PLAYER.PLACED++;
        }
        return true;
    } else {
        console.log("Algorithm: Not a valid move.");
        return false;
    }
}

function removeSoldier(move) {
    // When removing, we remove the piece with that colorc
    let removingPiece = (move.TURN === PURPLE_TURN) ? PURPLE_PLAYER : YELLOW_PLAYER;
    if (!algorithm.isRemovable(move)) {
        return false;
    }

    if (!board[move.ROW][move.COL].ISMILL) { // not a mill
        board[move.ROW][move.COL].TURN = null;
        removingPiece.PLACED--;
        return true;
    } else { // is a mill
        if (removingPiece.PLACED - removingPiece.MILLPIECES === 0) { // Removing from mill is possible if only mills are left
            board[move.ROW][move.COL].TURN = null;
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
        // reset state of current
        board[move.ROW][move.COL].TURN = null;
        if (board[move.ROW][move.COL].ISMILL === true) {
            if (move.TURN === PURPLE_TURN) {
                PURPLE_PLAYER.MILLPIECES--;
            } else {
                YELLOW_PLAYER.MILLPIECES--;
            }
            board[move.ROW][move.COL].ISMILL = false;
        }

        // update color of new
        board[move.SHIFTROW][move.SHIFTCOL].TURN = move.TURN;
        return true;
    }

    return false;
}

function handleNewMills(move, originalHandler) {
    let numMills = algorithm.countNewMills(move);
    printBoard();
    if (numMills > 0) { // Made a mill
        printBoard();
        let message = "";
        if (GAME_PROPERTIES.TURN === YELLOW_TURN) {
            message = "Click on a PURPLE piece to remove";
        } else {
            message = "Click on a YELLOW piece to remove";
        }

        let removingPiece = (((GAME_PROPERTIES.TURN + 1) % 2) === PURPLE_TURN) ? PURPLE_PLAYER : YELLOW_PLAYER;
        if (removingPiece.PLACED - removingPiece.MILLPIECES === 0) { // Removing from mill is possible if only mills are left
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

export { SHARP_COLORS, STATES, makeMoveProp, ERRORS, DIALOG, PURPLE_PLAYER, YELLOW_PLAYER, PURPLE_TURN, YELLOW_TURN, MATRIX_SIZE };