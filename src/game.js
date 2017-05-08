import * as algorithm from './algorithm.js';
import { setUpClicks } from './events.js';
import { SHARP_COLORS, STATES, makeMoveProp, ERRORS, DIALOG, PURPLE_PLAYER, YELLOW_PLAYER, PURPLE_TURN, YELLOW_TURN } from './common.js';
import { setUpStringFormat } from './utils.js';

setUpStringFormat();

// Structs 
const TILE = {
    ISAVAILABLE: true,
    ISMILL: false,
    TURN: null
}

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

const GAME_PROPERTIES = {
    TURN: null,
    CAPTURING: false,
    MILLS: 0,
    PHASE: 1,
    SOURCE: null
};

function otherPlayer() {
    return GAME_PROPERTIES.TURN !== null ? (GAME_PROPERTIES.TURN + 1) % 2 : null;
}

function checkLose() {
    if (PURPLE_PLAYER.PLACED < 3) return PURPLE_TURN;
    if (YELLOW_PLAYER.PLACED < 3) return YELLOW_TURN;
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

function startGame() {
    console.log(PURPLE_TURN);
    console.log(YELLOW_TURN);
    init();
    GAME_PROPERTIES.TURN = coinFlip();

    setTurnText();
    console.log(PURPLE_PLAYER);
    console.log(YELLOW_PLAYER);
    printBoard();
    // phase2();
    // if (checkLose() === PURPLE_TURN) {
    //   console.log("Yellow Wins");
    // } else {
    //   console.log("Purple Wins");
    // }
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

function placeSoldier(move) {
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

function isMillBreakable() {
    let removingPiece = (((GAME_PROPERTIES.TURN + 1) % 2) === PURPLE_TURN) ? PURPLE_PLAYER : YELLOW_PLAYER;
    return removingPiece.PLACED - removingPiece.MILLPIECES === 0;
}

function handleNewMills(move) {
    let numMills = algorithm.countNewMills(move);
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

function phase2() {
    console.log("using phase 2 sync");
    while (PURPLE_PLAYER.PLACED > 2 && YELLOW_PLAYER.PLACED > 2) {
        let positions;
        let direction;
        if (GAME_PROPERTIES.TURN === YELLOW_TURN) {
            positions = prompt("Yellow: Select position of your piece in the form of row,col");
            direction = prompt("Yellow: Enter 0(left), 1(right), 2(up), or 3(down)");
        } else {
            positions = prompt("Purple: Select position of your piece in the form of row,col");
            direction = prompt("Purple: Enter 0(left), 1(right), 2(up), or 3(down)");
        }
        positions = positions.split(",");

        // Set up move for shift
        let move = makeMoveProp(parseInt(positions[0], 10),
            parseInt(positions[1], 10),
            GAME_PROPERTIES.TURN,
            parseInt(direction, 10),
            null,
            null,
            board);

        if (move.BOARD[move.ROW][move.COL].TURN !== GAME_PROPERTIES.TURN) {
            // Not your color
            setAlertText("Invalid piece chosen; please choose your own color!");
            continue;
        }

        if (shiftSoldier(move)) {
            // Update row and col for handleNewMills
            let oldSpot = svg.getElementById("{0}{1}".format(String(move.ROW), String(move.COL)));
            move.ROW = move.SHIFTROW;
            move.COL = move.SHIFTCOL;

            let newSpot = svg.getElementById("{0}{1}".format(String(move.SHIFTROW), String(move.SHIFTCOL)));
            oldSpot.setAttribute("fill", SHARP_COLORS["default"]);
            newSpot.setAttribute("fill", SHARP_COLORS[move.TURN]);

            handleNewMills(move);

            GAME_PROPERTIES.TURN = (GAME_PROPERTIES.TURN + 1) % 2;
        } else {
            setAlertText("Invalid shift");
        }

        printBoard();
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
            if (removeSoldier(move)) {
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
        if (placeSoldier(move)) {
            e.setAttribute("fill", SHARP_COLORS[GAME_PROPERTIES.TURN]);
            if (handleNewMills(move)) {
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
            (PURPLE_PLAYER.PLACED + PURPLE_PLAYER.AVAILABLE <= 2 ? "YELLOW" : "PURPLE");
        GAME_PROPERTIES.TURN = null;
    }
}

function phaseTwoHandler(e) {
    let id = e.getAttribute("id");

    let x = parseInt(id[0]);
    let y = parseInt(id[1]);

    if (GAME_PROPERTIES.CAPTURING && GAME_PROPERTIES.MILLS > 0) {
        // currently capturing
        if (removeSoldier) {
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
        if (shiftSoldier(move)) {
            // TODO: check if this makes a mill + capture
            GAME_PROPERTIES.SOURCE.setAttribute("stroke", null);
            GAME_PROPERTIES.SOURCE.setAttribute("fill", SHARP_COLORS["default"]);
            GAME_PROPERTIES.SOURCE = null;
            e.setAttribute("fill", SHARP_COLORS[GAME_PROPERTIES.TURN]);


            // Check if mills formed
            move.ROW = move.SHIFTROW;
            move.COL = move.SHIFTCOL;
            if (handleNewMills(move)) {
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