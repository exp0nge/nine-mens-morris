import * as algorithm from './algorithm.js';
import { setUpClicks } from './events.js';
import { SHARP_COLORS, STATES, makeMoveProp, ERRORS, DIALOG, PURPLE_PLAYER, YELLOW_PLAYER, PURPLE_TURN, YELLOW_TURN } from './common.js';
import { setUpStringFormat } from './utils.js';

setUpStringFormat();
import * as common from './common.js';

// Structs
const TILE = {
    ISAVAILABLE: true,
    ISMILL: false,
    TURN: null
};

const MATRIX_SIZE = 7;
const board = new Array(MATRIX_SIZE);

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
    PHASE: 1,
    SOURCE: null,
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

function otherPlayer() {
    return GAME_PROPERTIES.TURN !== null ? (GAME_PROPERTIES.TURN + 1) % 2 : null;
}

const alertText = document.getElementById("alertText");
const alert = document.getElementById("alert");
const turnText = document.getElementById("turnText");
const turnPromptText = document.getElementById("turnPromptText");

function setTurnText(message) {
    turnText.style.display = "block";
    turnText.innerHTML = message || GAME_PROPERTIES.TURN ? "YELLOW (1)" : "PURPLE (0)";
    turnText.style.backgroundColor = SHARP_COLORS[GAME_PROPERTIES.TURN];
}

function setAlertText(message) {
    alertText.style.display = "block";
    alertText.innerHTML = message;
    setTimeout(() => {
        clearElement(alertText);
    }, 2000);
}

function clearElement(element) {
    if (element.style.display !== "none")
        element.style.display = "none";
}

function setCaptureText(message) {
    console.log(message);
    turnPromptText.style.display = "block";
    turnPromptText.innerHTML = message;
    turnPromptText.style.backgroundColor = SHARP_COLORS[GAME_PROPERTIES.TURN];
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
    turnPromptText.style.backgroundColor = SHARP_COLORS[GAME_PROPERTIES.TURN];
}

function startGameWithPlayer() {
    init();
    GAME_PROPERTIES.TURN = coinFlip();
    setTurnText();
    printBoard();
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

function isMillBreakable() {
    let removingPiece = (((GAME_PROPERTIES.TURN + 1) % 2) === PURPLE_TURN) ? PURPLE_PLAYER : YELLOW_PLAYER;
    return removingPiece.PLACED - removingPiece.MILLPIECES === 0;
}

function handleNewMills(move, gameProperties) {
    let numMills = algorithm.countNewMills(move, gameProperties);
    if (numMills > 0) { // Made a mill
        let message = "";
        if (GAME_PROPERTIES.TURN === YELLOW_TURN) {
            message = "Click on a PURPLE piece to remove";
        } else {
            message = "Click on a YELLOW piece to remove";
        }

        if (isMillBreakable()) { // Removing from mill is possible if only mills are left
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

startGame();

console.log("turn: " + GAME_PROPERTIES.TURN);

function invalidMoveAlert() {
    console.log("TURN: " + GAME_PROPERTIES.TURN);
    if (alert.style.display === "none") {
        alert.style.display = "block";
    }
    alertText.innerHTML = ERRORS.invalidMove;
    setTimeout(function() {
        clearElement(alert);
    }, 5000);
}

function phaseOneHandler(e) {
    let id = e.getAttribute("id");
    let move = makeMoveProp(parseInt(id[0]), parseInt(id[1]), null, null, null, null, board);
    if (GAME_PROPERTIES.TURN === PURPLE_TURN || GAME_PROPERTIES.TURN === YELLOW_TURN) {
        console.log(GAME_PROPERTIES.TURN);
        move.TURN = GAME_PROPERTIES.TURN;

        // phase 1
        ////////////////////////////////////////////////////////////////
        if (GAME_PROPERTIES.CAPTURING && GAME_PROPERTIES.MILLS > 0) {
            console.log("CAPTURING");
            move.TURN = otherPlayer();
            if (removeSoldier(move, GAME_PROPERTIES)) {
                e.setAttribute("fill", SHARP_COLORS['default']);
                GAME_PROPERTIES.MILLS -= 1;
                if (GAME_PROPERTIES.MILLS === 0) {
                    GAME_PROPERTIES.CAPTURING = false;
                    GAME_PROPERTIES.TURN = otherPlayer();
                    setTurnText();
                    clearElement(turnPromptText);
                }
            } else {
                invalidMoveAlert();
                return;
            }
            // abort
            return;
        }
        ////////////////////////////////////////////////////////////////
        if (placeSoldier(move, GAME_PROPERTIES)) {
            e.setAttribute("fill", SHARP_COLORS[GAME_PROPERTIES.TURN]);
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

    if (PURPLE_PLAYER.AVAILABLE === 0 && YELLOW_PLAYER.AVAILABLE === 0 && !GAME_PROPERTIES.CAPTURING) {
        // phase 1 end
        console.log("------------ PHASE 1 COMPLETE ------------");
        document.getElementById("phaseText").innerHTML = "Phase 2: Move and capture";
        GAME_PROPERTIES.PHASE = 2;
        setMoveText();
    }

    setTurnText();
}

function alertIfWinner() {
    if ((PURPLE_PLAYER.PLACED + PURPLE_PLAYER.AVAILABLE <= 2) ||
        (YELLOW_PLAYER.PLACED + YELLOW_PLAYER.AVAILABLE <= 2)) {
        clearElement(turnPromptText);
        clearElement(turnText);
        document.getElementById("phaseText").innerHTML = "WINNER " +
            (PURPLE_PLAYER.PLACED + PURPLE_PLAYER.AVAILABLE <= 2 ? "YELLOW" : "PURPLE") +
            " <a href='/'>(refresh)</a>";
        GAME_PROPERTIES.TURN = null;
    }
}

function phaseTwoHandler(e) {
    let id = e.getAttribute("id");
    let move = makeMoveProp(parseInt(id[0]), parseInt(id[1]), null, null, null, null, board);

    let x = parseInt(id[0]);
    let y = parseInt(id[1]);

    if (GAME_PROPERTIES.CAPTURING && GAME_PROPERTIES.MILLS > 0) {
        // currently capturing
        if (removeSoldier(move, GAME_PROPERTIES)) {
            e.setAttribute("fill", SHARP_COLORS["default"]);
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
        let x_original = parseInt(GAME_PROPERTIES.SOURCE.getAttribute("id")[0]);
        let y_original = parseInt(GAME_PROPERTIES.SOURCE.getAttribute("id")[1]);

        if (board[x][y].TURN !== null) {
            setAlertText("Select a empty spot to move the piece to");
            return;
        }
        let move = makeMoveProp(x_original, y_original, GAME_PROPERTIES.TURN, true, x, y, board);

        if (GAME_PROPERTIES.TURN === common.YELLOW_TURN ?
                GAME_PROPERTIES.YELLOW_PLAYER.PLACED === 3 : GAME_PROPERTIES.PURPLE_PLAYER.PLACED === 3) {
            move.FLYING = true;
        }

        if (shiftSoldier(move, GAME_PROPERTIES)) {
            // TODO: check if this makes a mill + capture
            GAME_PROPERTIES.SOURCE.setAttribute("stroke", null);
            GAME_PROPERTIES.SOURCE.setAttribute("fill", SHARP_COLORS["default"]);
            GAME_PROPERTIES.SOURCE = null;
            e.setAttribute("fill", SHARP_COLORS[GAME_PROPERTIES.TURN]);


            // Check if mills formed
            move.ROW = move.SHIFTROW;
            move.COL = move.SHIFTCOL;
            if (handleNewMills(move, GAME_PROPERTIES)) {
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

const svg = document.getElementById("board").getSVGDocument();

setUpClicks((e) => {
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
    let r = Math.random();
    let score = turn === common.YELLOW_TURN ?
        gameProperties.YELLOW_PLAYER.PLACED - gameProperties.PURPLE_PLAYER.PLACED :
        gameProperties.PURPLE_PLAYER.PLACED - gameProperties.YELLOW_PLAYER.PLACED;

    return maxPlayer ? score*(r*0.01) :  score*(r*(-0.01));
}


function alphabeta(board, depth, maxPlayer, turn, gameProperties, alpha, beta) {
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
        let children = getChildren(board, turn, gameProperties);
        for (let i = 0; i< children.length; i++) {
            let child = children[i];
            let m = alphabeta(child.BOARD, depth-1, false, (turn+1)%2, child.PROPERTIES, alpha, beta);
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
        let children = getChildren(board, turn, gameProperties);
        for (let i = 0; i< children.length; i++) {
            let child = children[i];
            let m = alphabeta(child.BOARD, depth-1, true, (turn+1)%2, child.PROPERTIES, alpha, beta);
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
    return JSON.parse(JSON.stringify(board));
}

function cloneGameProperties(gameProperties){
    return JSON.parse(JSON.stringify(gameProperties));
}


function getChildren(board, turn, gameProperties) {
    let children = [];
    for (let row = 0; row < MATRIX_SIZE; row++) {
        for (let col = 0; col < MATRIX_SIZE; col++) {
            if (gameProperties.PURPLE_PLAYER.AVAILABLE > 0 || gameProperties.YELLOW_PLAYER.AVAILABLE > 0) { // Phase 1
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
                    if ((turn === common.YELLOW_TURN && gameProperties.YELLOW_PLAYER.PLACED === 3) ||
                        (turn === common.PURPLE_TURN && gameProperties.PURPLE_PLAYER.PLACED === 3)) { // Phase 3
                        for (let i = 0; i < MATRIX_SIZE; i++) {
                            for (let j = 0; j < MATRIX_SIZE; j++) {
                                if (board[i][j].ISAVAILABLE && board[i][j].TURN === null) {
                                    let copyBoard = cloneBoard(board);
                                    let copyGameProperties = cloneGameProperties(gameProperties);
                                    copyBoard[i][j].TURN = turn;
                                    copyBoard[row][col].TURN = null;

                                    let move = {
                                        ROW: i,
                                        COL: j,
                                        GAME_PROPERTIES: copyGameProperties,
                                        BOARD: copyBoard
                                    };

                                    handleNewMillsComputer(move, copyGameProperties);
                                    children.push({BOARD: copyBoard, PROPERTIES: copyGameProperties});
                                }
                            }
                        }
                    } else { // Phase 2
                        for (let i = 0; i < 4; i++) {
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

let depth = 4; // TODO seems like the max reasonable depth is 4, but 3 works pretty fast

function phase1WithComputer() {
    while (GAME_PROPERTIES.PURPLE_PLAYER.AVAILABLE > 0 || GAME_PROPERTIES.YELLOW_PLAYER.AVAILABLE > 0) {
        if (computerTurn) {
            let bestM = alphabeta(board, depth, true, GAME_PROPERTIES.TURN, GAME_PROPERTIES, -Infinity, Infinity);
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
    while (GAME_PROPERTIES.PURPLE_PLAYER.PLACED > 2 && GAME_PROPERTIES.YELLOW_PLAYER.PLACED > 2) {
        if (computerTurn) {
            let bestM = alphabeta(board, depth, true, GAME_PROPERTIES.TURN, GAME_PROPERTIES, -Infinity, Infinity);
            board = bestM.BOARD;
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
    if (checkLose(GAME_PROPERTIES) === common.PURPLE_TURN) {
        console.log("Yellow Wins");
    } else {
        console.log("Purple Wins");
    }
}
