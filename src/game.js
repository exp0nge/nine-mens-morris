import * as algorithm from './algorithm.js';
import { setUpClicks } from './events.js';
import { SHARP_COLORS, STATES, makeMoveProp } from './common.js';

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

  board[4][1] = STATES.UNAVAILABLE;
  board[4][2] = STATES.UNAVAILABLE;
  board[4][4] = STATES.UNAVAILABLE;
  board[4][5] = STATES.UNAVAILABLE;

  board[5][0] = STATES.UNAVAILABLE;
  board[5][2] = STATES.UNAVAILABLE;
  board[5][4] = STATES.UNAVAILABLE;
  board[5][6] = STATES.UNAVAILABLE;

  board[6][0] = STATES.UNAVAILABLE;
  board[6][1] = STATES.UNAVAILABLE;
  board[6][5] = STATES.UNAVAILABLE;
  board[6][6] = STATES.UNAVAILABLE;


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
}

function printBoard() {

}

function placeSoldier(move) {
  if (algorithm.isValidMove(move)){
    board[move.ROW][move.COL] = move.TURN;
    if (move.TURN == PURPLE_TURN){
      PURPLE_PLAYER.AVAILABLE--;
      PURPLE_PLAYER.PLACED++;
    } else {
      YELLOW_PLAYER.AVAILABLE--;
      YELLOW_PLAYER.PLACED++;
    }
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
