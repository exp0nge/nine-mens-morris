import { setUpClicks } from './events.js';
import {
    SHARP_COLORS,
    STATES,
    makeMoveProp,
    ERRORS,
    DIALOG,
    PURPLE_PLAYER,
    YELLOW_PLAYER,
    PURPLE_TURN,
    YELLOW_TURN,
    MATRIX_SIZE,
    printBoard,
    placeSoldier,
    removeSoldier,
    shiftSoldier,
    handleNewMills
} from './common.js';
import { setUpStringFormat } from './utils.js';

setUpStringFormat();

// Structs
const TILE = {
    ISAVAILABLE: true,
    ISMILL: false,
    TURN: null
}


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
    SOURCE: null,
    PURPLE_PLAYER: {
        AVAILABLE: 4,
        PLACED: 0,
        MILLPIECES: 0
    },
    YELLOW_PLAYER: {
        AVAILABLE: 4,
        PLACED: 0,
        MILLPIECES: 0
    }
};

function otherPlayer() {
    return GAME_PROPERTIES.TURN !== null ? (GAME_PROPERTIES.TURN + 1) % 2 : null;
}

function checkLose() {
    if (GAME_PROPERTIES.PURPLE_PLAYER.PLACED < 3) return PURPLE_TURN;
    if (GAME_PROPERTIES.YELLOW_PLAYER.PLACED < 3) return YELLOW_TURN;
}

const alertText = document.getElementById("alertText");
const alert = document.getElementById("alert");
const turnText = document.getElementById("turnText");
const turnPromptText = document.getElementById("turnPromptText");

function setTurnText() {
    turnText.style.display = "block";
    turnText.innerHTML = GAME_PROPERTIES.TURN ? "YELLOW (1)" : "PURPLE (0)";
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
    turnPromptText.style.display = "block";
    turnPromptText.innerHTML = message;
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
}

function startGame() {
    console.log(PURPLE_TURN);
    console.log(YELLOW_TURN);
    init();
    GAME_PROPERTIES.TURN = coinFlip();

    setTurnText();
    console.log(GAME_PROPERTIES.PURPLE_PLAYER);
    console.log(GAME_PROPERTIES.YELLOW_PLAYER);
    printBoard(board);
    // phase2();
    // if (checkLose() === PURPLE_TURN) {
    //   console.log("Yellow Wins");
    // } else {
    //   console.log("Purple Wins");
    // }
}

function phase2() {
    const svg = document.getElementById("board").getSVGDocument();
    console.log("using phase 2 sync");
    while (GAME_PROPERTIES.PURPLE_PLAYER.PLACED > 2 && GAME_PROPERTIES.YELLOW_PLAYER.PLACED > 2) {
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

        printBoard(board);
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
            checkPhaseOneEnd();
            return;
        }
        ////////////////////////////////////////////////////////////////
        if (placeSoldier(move, board, GAME_PROPERTIES)) {
            e.setAttribute("fill", SHARP_COLORS[GAME_PROPERTIES.TURN]);
            if (handleNewMills(move, phaseOneHandler, GAME_PROPERTIES)) {
                console.log(move);
                GAME_PROPERTIES.TURN = otherPlayer();
            }
        } else {
            invalidMoveAlert();
            return;
        }
    } else {
        throw RangeError("GAME_PROPERTIES.TURN not handled");
    }

    console.log(GAME_PROPERTIES)
    console.log(GAME_PROPERTIES.PURPLE_PLAYER);
    console.log(GAME_PROPERTIES.YELLOW_PLAYER);
    checkPhaseOneEnd();

    setTurnText();
}

function checkPhaseOneEnd() {
    if (GAME_PROPERTIES.PURPLE_PLAYER.AVAILABLE === 0 && GAME_PROPERTIES.YELLOW_PLAYER.AVAILABLE === 0 && !GAME_PROPERTIES.CAPTURING) {
        // phase 1 end
        console.log("------------ PHASE 1 COMPLETE ------------");
        document.getElementById("phaseText").innerHTML = "Phase 2: Move and capture";
        GAME_PROPERTIES.PHASE = 2;

        // blocking call
        phase2();

    }
}

function phaseTwoHandler(e) {}

setUpClicks((e) => {
    if (GAME_PROPERTIES.PHASE === 1 || GAME_PROPERTIES.MILLS > 0) {
        phaseOneHandler(e);
    } else if (GAME_PROPERTIES.PHASE === 2) {
        phaseTwoHandler(e);
    }
});
