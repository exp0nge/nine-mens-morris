import { PURPLE_TURN, YELLOW_TURN, Coordinate } from './common.js'

const CENTER_POSITION = 3;

function countNewMills(move, gameProperties) {
    if (move.ROW === CENTER_POSITION) {
        if (move.COL < CENTER_POSITION) {
            return checkMill(move, 0, 2, true, gameProperties) +
                checkMill(move, 0, 6, false, gameProperties);
        } else {
            return checkMill(move, 4, 6, true, gameProperties) +
                checkMill(move, 0, 6, false, gameProperties);
        }
    }

    if (move.COL === CENTER_POSITION) {
        if (move.ROW < CENTER_POSITION) {
            return checkMill(move, 0, 6, true, gameProperties) +
                checkMill(move, 0, 2, false, gameProperties);
        } else {
            return checkMill(move, 0, 6, true, gameProperties) +
                checkMill(move, 4, 6, false, gameProperties);
        }
    }

    return checkMill(move, 0, 6, true, gameProperties) + checkMill(move, 0, 6, false, gameProperties);
}

function checkMill(move, start, end, checkRow, gameProperties) {
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
            if (tileState.ISAVAILABLE === true) {
                tileState.ISMILL = true;
                for (let j = start; j <= end; j++) {
                    let otherState = checkRow ? move.BOARD[move.ROW][j] : move.BOARD[j][move.COL];
                    if (otherState.ISAVAILABLE === true) {
                        if (i !== j) {
                            if (tileState.OTHER_MILLS === undefined || tileState.OTHER_MILLS === null) {
                                tileState.OTHER_MILLS = [];
                            }

                            if (checkRow) {
                                tileState.OTHER_MILLS.push({ROW: move.ROW, COL: j});
                            } else {
                                tileState.OTHER_MILLS.push({ROW: j, COL: move.COL});
                            }
                        }
                    }
                }
                if (move.TURN === YELLOW_TURN) {
                    gameProperties.YELLOW_PLAYER.MILLPIECES += 1;
                } else if (move.TURN === PURPLE_TURN) {
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
    let tileState = move.BOARD[move.ROW][move.COL];
    return (tileState.ISAVAILABLE && tileState.TURN === null);
}

function isRemovable(move, otherTurn) {
    // Is not part of a mill and has a piece
    let tileState = move.BOARD[move.ROW][move.COL];
    return (tileState.ISAVAILABLE && tileState.TURN === otherTurn);
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
    },
    6: {
        0: [new Coordinate(6, 3), new Coordinate(3, 0)],
        3: [new Coordinate(6, 0), new Coordinate(6, 6), new Coordinate(5, 3)],
        6: [new Coordinate(6, 3), new Coordinate(3, 6)]
    },
    5: {
        1: [new Coordinate(3, 1), new Coordinate(5, 3)],
        3: [new Coordinate(5, 1), new Coordinate(5, 5), new Coordinate(4, 3), new Coordinate(6, 3)],
        5: [new Coordinate(5, 3), new Coordinate(3, 5)]
    },
    4: {
        2: [new Coordinate(4, 3), new Coordinate(3, 2)],
        3: [new Coordinate(4, 2), new Coordinate(4, 4), new Coordinate(5, 3)],
        4: [new Coordinate(4, 3), new Coordinate(3, 4)]
    }
};



function isValidShift(move) {

    if (move.FLYING !== null && move.FLYING !== undefined) {
        // console.log("flying");
        return true;
    }

    let i = move.ROW;
    let j = move.COL;

    // Make sure that there is a piece to move
    if (!move.BOARD[move.ROW][move.COL].ISAVAILABLE) {
        // console.log("1");
        return false;
    }
    let row = move.ROW;
    let shiftRow = move.SHIFTROW;
    if (VALID_SHIFTS[row] === undefined || VALID_SHIFTS[row][move.COL] === undefined) {
        return false
    }

    for (let k = 0; k < VALID_SHIFTS[row][move.COL].length; k++) {
        let element = VALID_SHIFTS[row][move.COL][k];
        if (element.X === shiftRow && element.Y === move.SHIFTCOL) {
            return true;
        }
    }

    return false;
}

function possibleShifts(row, col) {
    return VALID_SHIFTS[row][col];
}

export { countNewMills, isValidMove, isRemovable, isValidShift, CENTER_POSITION, possibleShifts };