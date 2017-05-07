import { STATES, PURPLE_PLAYER, YELLOW_PLAYER, PURPLE_TURN, YELLOW_TURN, Coordinate } from './common.js'

const CENTER_POSITION = 3;

function countNewMills(move) {
    if (move.ROW === CENTER_POSITION) {
        if (move.COL < CENTER_POSITION) {
            return checkMill(move, 0, 2, true) +
                checkMill(move, 0, 6, false);
        } else {
            return checkMill(move, 4, 6, true) +
                checkMill(move, 0, 6, false);
        }
    }

    if (move.COL === CENTER_POSITION) {
        if (move.ROW < CENTER_POSITION) {
            return checkMill(move, 0, 6, true) +
                checkMill(move, 0, 2, false);
        } else {
            return checkMill(move, 0, 6, true) +
                checkMill(move, 4, 6, false);
        }
    }

    return checkMill(move, 0, 6, true) + checkMill(move, 0, 6, false);
}

function checkMill(move, start, end, checkRow) {
    let count = 0;
    for (let i = start; i <= end; i++) {
        let tileState = checkRow ? move.BOARD[move.ROW][i] : move.BOARD[i][move.COL];
        if (tileState.ISAVAILABLE === true && tileState.TURN === move.TURN) {
            count += 1;
        }
    }
    if (count === 3) {
        // change ISMILL to true
        for (let i = start; i <= end; i++) {
            let tileState = checkRow ? move.BOARD[move.ROW][i] : move.BOARD[i][move.COL];
            if (tileState.ISAVAILABLE === true && tileState.ISMILL === false) {
                tileState.ISMILL = true;
                if (move.TURN === YELLOW_TURN) {
                    YELLOW_PLAYER.MILLPIECES += 1;
                } else if (move.TURN === PURPLE_TURN) {
                    PURPLE_PLAYER.MILLPIECES += 1;
                }
            }
        }
        return 1;
    } else {
        return 0;
    }
}

function isValidMove(move) {
    let tileState = move.BOARD[move.ROW][move.COL];
    return (tileState.ISAVAILABLE && tileState.TURN === null);
}

function isRemovable(move) {
    // Is not part of a mill and has a piece
    let tileState = move.BOARD[move.ROW][move.COL];
    console.log(move);
    console.log(tileState);
    return (tileState.ISAVAILABLE && tileState.TURN === move.TURN);
}

/**
Phase 2 Functions
**/

const VALID_SHIFTS = {
    0: {
        0: [new Coordinate(0, 3), new Coordinate(3, 0)],
        3: [new Coordinate(1, 3), new Coordinate(0, 0), new Coordinate(0, 6)],
        6: [new Coordinate(0, 3), new Coordinate(3, 6)]
    },
    1: {
        1: [new Coordinate(1, 3), new Coordinate(3, 1)],
        3: [new Coordinate(1, 1), new Coordinate(0, 3), new Coordinate(1, 5), new Coordinate(2, 3)],
        5: [new Coordinate(1, 3), new Coordinate(3, 5)]
    },
    2: {
        2: [new Coordinate(2, 3), new Coordinate(3, 2)],
        3: [new Coordinate(2, 2), new Coordinate(1, 3), new Coordinate(2, 4)],
        4: [new Coordinate(2, 3), new Coordinate(3, 4)]
    },
    3: {
        0: [new Coordinate(0, 0), new Coordinate(3, 1), new Coordinate(6, 0)],
        1: [new Coordinate(1, 1), new Coordinate(3, 0), new Coordinate(3, 2), new Coordinate(5, 1)],
        2: [new Coordinate(2, 2), new Coordinate(3, 1), new Coordinate(4, 2)],
        4: [new Coordinate(2, 4), new Coordinate(4, 4), new Coordinate(3, 5)],
        5: [new Coordinate(1, 5), new Coordinate(3, 4), new Coordinate(3, 6), new Coordinate(5, 5)],
        6: [new Coordinate(0, 6), new Coordinate(3, 5), new Coordinate(6, 6)]
    }
};

const mapRows = {
    4: 2,
    5: 1,
    6: 0
}

function isValidShift(move) {
    console.log(move);
    let row = move.ROW > 3 ? mapRows[move.ROW] : move.ROW;
    let shiftRow = move.SHIFTROW > 3 ? mapRows[move.SHIFTROW] : move.SHIFTROW;
    console.log("row: " + row);
    console.log("shift row: " + shiftRow);
    if (VALID_SHIFTS[row] === undefined || VALID_SHIFTS[row][move.COL] === undefined) {
        return false
    }

    for (var i = 0; i < VALID_SHIFTS[row][move.COL].length; i++) {
        let element = VALID_SHIFTS[row][move.COL][i];
        if (element.X === shiftRow && element.Y === move.SHIFTCOL) {
            return true;
        }
    }

    return false;
}

export { countNewMills, isValidMove, isRemovable, isValidShift };