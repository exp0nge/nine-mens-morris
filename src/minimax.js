import { countNewMills, isValidMove, isRemovable, isValidShift } from './algorithm.js';
import {
    MATRIX_SIZE,
    printBoard,
    placeSoldier,
    removeSoldier,
    shiftSoldier,
    handleNewMills,
    makeMoveProp
} from './common.js';

class PhaseOnePossibleMove {
    constructor(row, col) {
        this.row = row;
        this.col = col;
    }
}

function findPhaseOneMoves(turn, board) {
    let moves = [];
    for (let row = 0; row < MATRIX_SIZE; row++) {
        for (let col = 0; col < MATRIX_SIZE; col++) {
            if (board[row][col].ISAVAILABLE && board[row][col].TURN === null) {
                moves.push(new PhaseOnePossibleMove(row, col));
            }
        }
    }
    return moves;
}

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
        if (count == n) {
            totalCount++;
        }
    }
    return totalCount;
}

function scoreBoard(turn, board) {
    // TODO
}

class BestMove {
    constructor(row, col, score) {
        this.row = row;
        this.col = col;
        this.score = score;
    }
}

function minimax(depth, turn, maxTurn, board) {
    // TODO: add AVAILABLE === 0 
    if (depth === 0) {
        return scoreBoard(turn, board);
    }
    // TODO: localize PURPLE and YELLOW player
    // TODO: Check if mill
    if (turn == maxTurn) {
        let moves = findPhaseOneMoves(turn, board);
        let maxScore = -Infinity;
        let maxMove;
        for (var i = 0; i < moves.length; i++) {
            let move = moves[i];
            let potentialBoard = board.slice();
            placeSoldier(makeMoveProp(move.row, move.col, turn, null, null, null, potentialBoard), potentialBoard);
            let maximizeMove = minimax(--depth, (turn + 1) % 2, maxTurn, potentialBoard);
            let score = maximizeMove.score;
            if (score > maxScore) {
                maxScore = score;
                maxMove = move;
            }
        }
        if (maxMove === null) {
            console.log(potentialBoard);
            throw new ExceptionInformation("Max unable to find move, ^ the board");
        }
        return new BestMove(maxMove.row, maxMove.col, maxScore);
    } else {
        let moves = findPhaseOneMoves(turn, board);
        let maxScore = Infinity;
        let maxMove;
        for (var i = 0; i < moves.length; i++) {
            let move = moves[i];
            let potentialBoard = board.slice();
            placeSoldier(makeMoveProp(move.row, move.col, turn, null, null, null, potentialBoard), potentialBoard);
            let maximizeMove = minimax(--depth, (turn + 1) % 2, (turn + 1) % 2, potentialBoard);
            let score = maximizeMove.score;
            if (score < maxScore) {
                maxScore = score;
                maxMove = move;
            }
        }
        if (maxMove === null) {
            console.log(potentialBoard);
            throw new ExceptionInformation("Min unable to find move, ^ the board");
        }
        return new BestMove(maxMove.row, maxMove.col, maxScore);
    }
}