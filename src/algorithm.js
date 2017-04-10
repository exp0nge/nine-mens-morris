const STATES = {
  UNAVAILABLE: 0,
  AVAILABLE: 1,
  PURPLE: 2,
  YELLOW: 3
};

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
    let pieceState = checkRow ? move.BOARD[move.ROW][i] : move.BOARD[i][move.COL];
    if (pieceState === move.COLOR){
      count += 1;
    }
  }
  if (count == 3){
    // TODO: change states of board to include isMill
    return 1;
  } else {
    return 0;
  }
}

function isValidMove(move) {
  return move.BOARD[move.ROW][move.COL] === STATES.AVAILABLE;
}

function isValidPiece(move) {
  // Is not part of a mill and has a piece
  return move.BOARD[move.ROW][move.COL] === ;
}

/**
Phase 2 Functions
**/

function checkLose(player) {

  if (player.PLACED === 2) return true;

  // TODO: Check for no more available moves

  return false;
}

export { STATES, countNewMills, isValidMove, checkLose };
