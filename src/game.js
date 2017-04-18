import * as algorithm from './algorithm.js';
import { setUpClicks } from './events.js';
import { SHARP_COLORS, STATES, makeMoveProp, ERRORS, DIALOG } from './common.js';

// Structs
const TILE = {
  ISAVAILABLE: true,
  ISMILL: false,
  TURN: null
}

const PURPLE_PLAYER = {
  AVAILABLE: 4,
  PLACED: 0
};

const YELLOW_PLAYER = {
  AVAILABLE: 4,
  PLACED: 0
};

const PURPLE_TURN = 0;
const YELLOW_TURN = 1;

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
   return Math.floor(Math.random() * 2) + 0;
}

const GAME_PROPERTIES = {
  TURN: null
}

function checkLose() {
  if (PURPLE_PLAYER.PLACED < 3) return PURPLE_TURN;
  if (YELLOW_PLAYER.PLACED < 3) return YELLOW_TURN;
}

function startGame() {
  init();
  GAME_PROPERTIES.TURN = coinFlip();
  printBoard();
  console.log("Phase1");
  // phase1();
  console.log("Phase2");
  // phase2();
  if (checkLose() === PURPLE_TURN) {
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
        if (tileState.TURN !== null) {
          stringState = tileState.TURN ? STATES.YELLOW : STATES.PURPLE;
        }
        stringBoard += stringState;
      }
      stringBoard += "\n";
    }
    console.log(stringBoard);
}

function placeSoldier(move) {
  if (algorithm.isValidMove(move)){
    board[move.ROW][move.COL] = move.TURN;
    if (move.TURN === PURPLE_TURN){
      PURPLE_PLAYER.AVAILABLE--;
      PURPLE_PLAYER.PLACED++;
    } else {
      YELLOW_PLAYER.AVAILABLE--;
      YELLOW_PLAYER.PLACED++;
    }
    return true;
  } else {
    console.log("Algorithm: Not a valid move.")
    return false;
  }
}

function removeSoldier(move) {
  if (algorithm.isRemovable(move)){
    if (move.TURN == PURPLE_TURN){
      PURPLE_PLAYER.PLACED--;
    } else {
      YELLOW_PLAYER.PLACED--;
    }
    board[move.ROW][move.COL].TURN = null;
    return true;
  } else {
    return false;
  }
}

function shiftSoldier(move) {
  if (algorithm.isValidShift(move)) {
    board[move.SHIFTROW][move.SHIFTCOL].TURN = move.TURN;
    board[move.ROW][move.COL].TURN = null;
    return true;
  }

  return false;
}

function handleNewMills(move) {
  let numMills = algorithm.countNewMills(move);
  while (numMills > 0) { // Made a mill
    printBoard();
    if(GAME_PROPERTIES.TURN === YELLOW_TURN) {
      var positions = prompt("Yellow: Enter a position to remove a purple piece that is not a mill in the form of row,col");
    } else {
      var positions = prompt("Purple: Enter a position to remove a yellow piece that is not a mill in the form of row,col");
    }
    positions = positions.split(",");
    move = {
        ROW: parseInt(positions[0], 10),
        COL: parseInt(positions[1], 10),
        TURN: (GAME_PROPERTIES.TURN + 1) % 2,
        BOARD: board
    };
    if(removeSoldier(move)) {
      numMills--;
      return true;
    } else {
      console.log("Invalid remove");
    }
  }
}

function phase1() {
  while (PURPLE_PLAYER.AVAILABLE > 0 || YELLOW_PLAYER.AVAILABLE > 0) {
      if(GAME_PROPERTIES.TURN === YELLOW_TURN) {
        var positions = prompt("Yellow: Enter a position to place the piece in the form of row,col");
      } else {
        var positions = prompt("Purple: Enter a position to place the piece in the form of row,col");      }
      positions = positions.split(",");
      console.log("Got " + positions);
      var move = makeMoveProp(parseInt(positions[0], 10), 
                              parseInt(positions[1], 10), 
                              GAME_PROPERTIES.TURN, 
                              null, null, null, 
                              board);

      if (placeSoldier(move)) {
        handleNewMills(move);
        GAME_PROPERTIES.TURN = (GAME_PROPERTIES.TURN + 1) % 2;
      } else {
        console.log("Invalid place");
      }

      printBoard();
  }
}

function phase2() {
  while (PURPLE_PLAYER.PLACED > 2 && YELLOW_PLAYER.PLACED > 2) {
    if(GAME_PROPERTIES.TURN === YELLOW_TURN) {
      var positions = prompt("Yellow: Select position of your piece in the form of row,col");
      var direction = prompt("Yellow: Enter 0(left), 1(right), 2(up), or 3(down)");
    } else {
      var positions = prompt("Purple: Select position of your piece in the form of row,col");
      var direction = prompt("Purple: Enter 0(left), 1(right), 2(up), or 3(down)");
    }
    positions = positions.split(",");

    // Set up move for shift
    var move = makeMoveProp(parseInt(positions[0], 10), 
                            parseInt(positions[1], 10), 
                            GAME_PROPERTIES.TURN, 
                            parseInt(direction, 10), 
                            null, 
                            null, 
                            board);

    if (move.BOARD[move.ROW][move.COL].TURN !== GAME_PROPERTIES.TURN) {
      // Not your color
      console.log("Invalid piece chosen");
      continue;
    }

    if (shiftSoldier(move)) {
      // Update row and col for handleNewMills
      move.ROW = move.SHIFTROW;
      move.COL = move.SHIFTCOL;
      handleNewMills(move);
      GAME_PROPERTIES.TURN = (GAME_PROPERTIES.TURN + 1) % 2;
    } else {
      console.log("Invalid shift");
    }

    printBoard();
  }
}

console.log("initializing game");

startGame();

console.log("turn: " + GAME_PROPERTIES.TURN);

setUpClicks((e) => {
  console.log(e);
  let id = e.getAttribute("id");
  let alert = document.getElementById("alertText");
  let move = makeMoveProp(parseInt(id[0]), parseInt(id[1]), null, null, null, null, board);
  if (GAME_PROPERTIES.TURN == PURPLE_TURN) {
    move.TURN = PURPLE_TURN;
    if (placeSoldier(move)) {
      e.setAttribute("fill", SHARP_COLORS.PURPLE);
      GAME_PROPERTIES.TURN = YELLOW_TURN;
    } else {
      alert.innerHTML = ERRORS.invalidMove;
    }
  } else if (GAME_PROPERTIES.TURN == YELLOW_TURN) {
    move.TURN = YELLOW_TURN;
    if (placeSoldier(move)) {
      e.setAttribute("fill", SHARP_COLORS.YELLOW);
      GAME_PROPERTIES.TURN = PURPLE_TURN;
    } else {
      alert.innerHTML = ERRORS.invalidMove;
    }
  } else {
    throw RangeError("GAME_PROPERTIES.TURN not handled");
  }
  setTimeout(function() {
    document.getElementById("alert").style.display = "none";
  }, 2000);
});
