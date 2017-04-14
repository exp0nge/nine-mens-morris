import * as algorithm from './algorithm.js';
import { setUpClicks } from './events.js';
import { SHARP_COLORS, STATES, makeMoveProp } from './common.js';

// Structs
const TILE = {
  ISAVAILABLE: true,
  ISMILL: false,
  TURN: null
}

const MATRIX_SIZE = 7;
const board = new Array(MATRIX_SIZE);
const PURPLE_PLAYER = {
  AVAILABLE: 9,
  PLACED: 0
}
const YELLOW_PLAYER = {
  AVAILABLE: 9,
  PLACED: 0
}
var YELLOW_SOLDIERS_AVAILABLE = 9;
var PURPLE_TURN = 0;
var YELLOW_TURN = 1;

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

function startGame() {
  init();
  GAME_PROPERTIES.TURN = coinFlip();
  printBoard();
  phase1();
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
    return false;
  }
}

function removeSoldier(move) {
  if (algorithm.isRemovable(move)){
    if (move.TURN == PURPLE_TURN){
      PURPLE_PLAYER.AVAILABLE--;
      PURPLE_PLAYER.PLACED--;
    } else {
      YELLOW_PLAYER.AVAILABLE--;
      YELLOW_PLAYER.PLACED--;
    }
    board[move.ROW][move.COL].TURN = null;
    return true;
  } else {
    return false;
  }
}


function phase1() {
  while (PURPLE_PLAYER.AVAILABLE > 0 || YELLOW_PLAYER.AVAILABLE > 0) {
      if(GAME_PROPERTIES.TURN === YELLOW_TURN) {
        var positions = prompt("Yellow: Enter a position to place the piece in the form of x,y");
      } else {
        var positions = prompt("Purple: Enter a position to place the piece in the form of x,y");      }
      positions = positions.split(",");
      var move = {
          ROW: parseInt(positions[0], 10),
          COL: parseInt(positions[1], 10),
          TURN: GAME_PROPERTIES.TURN,
          BOARD: board
      };

      if (placeSoldier(move)) {
        let numMills = algorithm.countNewMills(move);
        while (numMills > 0) { // Made a mill
          printBoard();
          if(GAME_PROPERTIES.TURN === YELLOW_TURN) {
            positions = prompt("Yellow: Enter a position to remove a purple piece that is not a mill in the form of x,y");
          } else {
            positions = prompt("Purple: Enter a position to remove a yellow piece that is not a mill in the form of x,y");
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
          } else {
            console.log("Invalid remove");
          }
        }

        GAME_PROPERTIES.TURN = (GAME_PROPERTIES.TURN + 1) % 2;
      } else {
        console.log("Invalid place");
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
  let move = makeMoveProp(parseInt(id[0]), parseInt(id[1]), null, board);
  if (GAME_PROPERTIES.TURN == PURPLE_TURN) {
    move.TURN = PURPLE_TURN;
    e.setAttribute("fill", SHARP_COLORS.PURPLE);
    placeSoldier(move);
    GAME_PROPERTIES.TURN = YELLOW_TURN;
  } else if (GAME_PROPERTIES.TURN == YELLOW_TURN) {
    move.TURN = YELLOW_TURN;
    e.setAttribute("fill", SHARP_COLORS.YELLOW);
    placeSoldier(move);
    GAME_PROPERTIES.TURN = PURPLE_TURN;
  } else {
    throw RangeError("GAME_PROPERTIES.TURN not handled");
  }
});
