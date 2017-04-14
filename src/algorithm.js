import { STATES } from './common.js';

const CENTER_POSITION = 3;

function countNewMills(move){
  if (move.ROW == CENTER_POSITION) {
    if (move.COL < CENTER_POSITION) {
      return checkMill(move, 0, 2, true) +
             checkMill(move, 0, 6, false);
    } else {
      return checkMill(move, 4, 6, true) +
             checkMill(move, 0, 6, false);
    }
  }

  if (move.COL == CENTER_POSITION) {
    if (move.ROW < CENTER_POSITION) {
      return checkMill(move, 0, 6, true) +
             checkMill(move, 0, 2, false);
    } else {
      return checkMill(move, 0, 6, true) +
             checkMill(move, 4, 6, false);
    }
  }

  return checkMill(move, 0, 6, true) + checkMill(move, 0, 6, false);
}

function checkMill(move, start, end, checkRow){
  var count = 0;
  for (let i = start; i <= end; i++){
    let tileState = checkRow ? move.BOARD[move.ROW][i] : move.BOARD[i][move.COL];
    if (tileState.COLOR === move.TURN){
      count += 1;
    }
  }
  if (count == 3){
    // change ISMILL to true
    for (let i = start; i <= end; i++){
      let tileState = checkRow ? move.BOARD[move.ROW][i] : move.BOARD[i][move.COL];
      if (tileState.COLOR === move.COLOR){
        tileState.ISMILL = true;
      }
    }
    return 1;
  } else {
    return 0;
  }
}

function isValidMove(move) {
  return move.BOARD[move.ROW][move.COL].ISAVAILABLE;
}

function isRemovable(move) {
  // Is not part of a mill and has a piece
  let tileState = move.BOARD[move.ROW][move.COL];
  return (tileState.ISAVAILABLE && tileState.COLOR === move.COLOR && !tileState.ISMILL);
}

/**
Phase 2 Functions
**/

function checkLose(player) {

  if (player.PLACED === 2) return true;

  // TODO: Check for no more available moves

  return false;
}

export { countNewMills, isValidMove, isRemovable, checkLose };
