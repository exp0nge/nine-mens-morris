import * as algorithm from './algorithm.js';

const STATES = algorithm.STATES;

const MOVE = {
  ROW: null,
  COL: null,
  COLOR: null,
  BOARD: null
};

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
        board[i][j] = STATES.AVAILABLE;
    }
  }


  board[0][1] = STATES.UNAVAILABLE;
  board[0][2] = STATES.UNAVAILABLE;
  board[0][4] = STATES.UNAVAILABLE;
  board[0][5] = STATES.UNAVAILABLE;

  board[1][0] = STATES.UNAVAILABLE;
  board[1][2] = STATES.UNAVAILABLE;
  board[1][4] = STATES.UNAVAILABLE;
  board[1][6] = STATES.UNAVAILABLE;

  board[2][0] = STATES.UNAVAILABLE;
  board[2][1] = STATES.UNAVAILABLE;
  board[2][5] = STATES.UNAVAILABLE;
  board[2][6] = STATES.UNAVAILABLE;

  board[3][3] = STATES.UNAVAILABLE;

  board[6][1] = STATES.UNAVAILABLE;
  board[6][2] = STATES.UNAVAILABLE;
  board[6][4] = STATES.UNAVAILABLE;
  board[6][5] = STATES.UNAVAILABLE;

  board[5][0] = STATES.UNAVAILABLE;
  board[5][2] = STATES.UNAVAILABLE;
  board[5][4] = STATES.UNAVAILABLE;
  board[5][6] = STATES.UNAVAILABLE;

  board[4][0] = STATES.UNAVAILABLE;
  board[4][1] = STATES.UNAVAILABLE;
  board[4][5] = STATES.UNAVAILABLE;
  board[4][6] = STATES.UNAVAILABLE;


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
          stringBoard += board[i][j];
      }
      stringBoard += "\n";
    }
    console.log(stringBoard);
}

function placeSoldier(move) {
  if (algorithm.isValidMove(move)){
    board[move.ROW][move.COL] = move.COLOR;
    if (move.COLOR == PURPLE_TURN){
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
  if (algorithm.isValidPiece(move)){
    board[move.ROW][move.COL] = STATES.AVAILABLE;
    if (move.COLOR == PURPLE_TURN){
      PURPLE_PLAYER.PLACED--;
    } else {
      YELLOW_PLAYER.PLACED--;
    }
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
          var positions = prompt("Purple: Enter a position to place the piece in the form of x,y");
      }
      positions = positions.split(",");
      var move = {
          ROW: parseInt(positions[0], 10),
          COL: parseInt(positions[1], 10),
          COLOR: GAME_PROPERTIES.TURN ? STATES.YELLOW : STATES.PURPLE,
          BOARD: board
      };

      if (placeSoldier(move)) {
        // TODO: Check mills here
        if (algorithm.countNewMills(move) > 0) {
          console.log("MILL");
        }

        GAME_PROPERTIES.TURN = (GAME_PROPERTIES.TURN + 1) % 2;
      } else {
        console.log("Invalid move");
      }

      printBoard();
  }
}

console.log("initializing game");

startGame();

export { STATES };
