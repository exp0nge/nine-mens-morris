import { countNewMills, isValidMove, isRemovable, isValidShift } from './algorithm.js';
import {
    MATRIX_SIZE,
    printBoard,
    placeSoldier,
    removeSoldier,
    shiftSoldier,
    makeMoveProp,
    YELLOW_TURN,
    PURPLE_TURN
} from './common.js';

var bestMove;

class PhaseOnePossibleMove {
    constructor(row, col, turn) {
        this.row = row;
        this.col = col;
        this.turn = turn;
    }
}

function findPhaseOneMoves(turn, board) {
    let moves = [];
    for (let row = 0; row < MATRIX_SIZE; row++) {
        for (let col = 0; col < MATRIX_SIZE; col++) {
            if (board[row][col].ISAVAILABLE && board[row][col].TURN === null) {
                moves.push(new PhaseOnePossibleMove(row, col, turn));
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
        if (count === n) {
            totalCount++;
        }
    }
    return totalCount;
}

function scoreBoard(turn, board, gameProperties) {
    return 10*countN(true, 2, turn, board) + 10*countN(false, 2, turn, board) +
        100*countN(true, 3, turn, board) + 100*countN(false, 3, turn, board) +
        (turn === YELLOW_TURN ? gameProperties.YELLOW_PLAYER.PLACED - gameProperties.PURPLE_PLAYER.PLACED :
            gameProperties.PURPLE_PLAYER.PLACED - gameProperties.YELLOW_PLAYER.PLACED);
}

// Return of best move
class BestMove {
    constructor(row, col, score) {
        this.row = row;
        this.col = col;
        this.score = score;
    }
}

function cloneGameProperties(gameProperties) {
    let clone = {
        TURN: gameProperties.TURN,
        CAPTURING: gameProperties.CAPTURING,
        MILLS: gameProperties.MILLS,
        PHASE: gameProperties.PHASE,
        SOURCE: gameProperties.SOURCE,
        PURPLE_PLAYER: {
            AVAILABLE: gameProperties.PURPLE_PLAYER.AVAILABLE,
            PLACED: gameProperties.PURPLE_PLAYER.PLACED,
            MILLPIECES: gameProperties.PURPLE_PLAYER.MILLPIECES
        },
        YELLOW_PLAYER: {
            AVAILABLE: gameProperties.YELLOW_PLAYER.AVAILABLE,
            PLACED: gameProperties.YELLOW_PLAYER.PLACED,
            MILLPIECES: gameProperties.YELLOW_PLAYER.MILLPIECES
        }
    };


    return clone;
}

function cloneBoard(board) {
    let clone = [];
    for(let i=0; i<board.length; i++) {
        clone[i] = board[i].slice();
    }

    return clone;
}

function minimax(depth, turn, maxTurn, board, gameProperties) {
    // TODO: add AVAILABLE === 0. DONE
    if (depth === 0 || (turn === YELLOW_TURN ? gameProperties.YELLOW_PLAYER.AVAILABLE === 0 : gameProperties.PURPLE_PLAYER.AVAILABLE === 0))  {
        return scoreBoard(turn, board, gameProperties);
    }
    // TODO: localize PURPLE and YELLOW player
    // TODO: Check if mill. DONE
    if (turn === maxTurn) {
        let moves = findPhaseOneMoves(turn, board);
        let maxScore = -Infinity;
        let maxMove;
        for (let i = 0; i < moves.length; i++) {
            let move = moves[i];
            let potentialBoard = cloneBoard(board);
            let moveProp = makeMoveProp(move.row, move.col, turn, null, null, null, potentialBoard);

            let copyGameProperties = cloneGameProperties(gameProperties);
            placeSoldier(moveProp, potentialBoard, copyGameProperties);
            handleNewMills(moveProp, copyGameProperties);


            // Are we returning move or board or both?
            let score = minimax(depth-1, (turn + 1) % 2, maxTurn, potentialBoard, copyGameProperties);
            if (score > maxScore) {
                maxScore = score;
                maxMove = move;
            }
        }
        if (maxMove === null) {
            console.log(potentialBoard);
            throw new ExceptionInformation("Max unable to find move, ^ the board");
        }
        bestMove = BestMove(maxMove.row, maxMove.col, maxScore);
        return maxScore;
    } else {
        let moves = findPhaseOneMoves(turn, board);
        let minScore = Infinity;
        let minMove;
        for (let i = 0; i < moves.length; i++) {
            let move = moves[i];
            let potentialBoard = cloneBoard(board);
            let moveProp = makeMoveProp(move.row, move.col, turn, null, null, null, potentialBoard);

            let copyGameProperties = cloneGameProperties(gameProperties);
            placeSoldier(moveProp, potentialBoard, copyGameProperties);
            handleNewMills(moveProp, copyGameProperties);

            let score = minimax(depth-1, (turn + 1) % 2, maxTurn, potentialBoard, copyGameProperties);
            if (score < minScore) {
                minScore = score;
                minMove = move;
            }
        }
        if (minMove === null) {
            console.log(potentialBoard);
            throw new ExceptionInformation("Min unable to find move, ^ the board");
        }
        bestMove = BestMove(minMove.row, minMove.col, minScore);
        return minScore;
    }
}

function handleNewMills(move, gameProperties) {
    let numMills = countNewMills(move, gameProperties);
    move.TURN = (gameProperties.TURN + 1) % 2;
    while(numMills > 0) {
        let removeMillPiece = false;

        let removingPiece = (move.TURN === PURPLE_TURN) ? gameProperties.PURPLE_PLAYER : gameProperties.YELLOW_PLAYER;
        if (removingPiece.PLACED - removingPiece.MILLPIECES === 0) { // Removing from mill is possible if only mills are left
            removeMillPiece = true;
        }

        for (let row = 0; row < MATRIX_SIZE; row++) {
            for (let col = 0; col < MATRIX_SIZE; col++) {
                move.ROW = row;
                move.COL = col;
                if (isRemovable(move))  {
                    if ((removeMillPiece && move.BOARD[move.ROW][move.COL].ISMILL) ||
                        (!removeMillPiece && !move.BOARD[move.ROW][move.COL].ISMILL)) {
                        removeSoldier(move, gameProperties);
                        break;
                    }
                }
            }
        }
    }
}

export {minimax, bestMove};
