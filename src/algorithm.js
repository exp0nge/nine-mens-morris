const CENTER_POSITION = 3;

function countNewMills(move){
  if (move.ROW === CENTER_POSITION) {
    if (move.COL < CENTER_POSITION) {
      return checkMill(move, 0, 2, true) +
             checkMill(move, 0, 6, false);
    } else {
      return checkMill(move, 4, 6, true) +
             checkMill(move, 0, 6, false);
    }
  }

  if (move.COL === CENTER_POSITION) {
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
    if (tileState.COLOR === move.COLOR){
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
const SHIFT = {
  LEFT: 0,
  RIGHT: 1,
  UP: 2,
  DOWN: 3
};

function isValidShift(move) {
  let i = move.ROW;
  let j = move.COL;
  let t1 = 0;
  let t2 = 0;
  let rowBounds = [0, 6];
  let colBounds = [0, 6];

  if (!isValidMove(move)) {
    return false;
  }

  switch(move.SHIFT) {
    case SHIFT.LEFT:
      t2 = -1;
      break;
    case SHIFT.RIGHT:
      t2 = 1;
      break;
    case SHIFT.UP:
      t1 = 1;
      break;
    case SHIFT.DOWN:
      t1 = -1;
      break;
    default:
      return false;
  }


  if (move.ROW === CENTER_POSITION) {
    if (move.COL < CENTER_POSITION) {
      colBounds[1] = CENTER_POSITION;
    } else {
      colBounds[0] = CENTER_POSITION;
    }
  }

  if (move.COL === CENTER_POSITION) {
    if (move.ROW < CENTER_POSITION) {
      rowBounds[1] = CENTER_POSITION;
    } else {
      rowBounds[0] = CENTER_POSITION;
    }
  }

  while(true) {
    i+=t1;
    j+=t2;

    if (i < rowBounds[0] || i > rowBounds[1] || j < colBounds[0] || j > colBounds[1]) { // Out of bounds
      return false;
    }

    if (move.BOARD[i][j].ISAVAILABLE) {
      if (move.BOARD[i][j].COLOR === null) {
        move.SHIFTROW = i;
        move.SHIFTCOL = j;
        return true;
      } else {
        return false;
      }
    }
  }
}

function checkLose(player) {

  if (player.PLACED === 2) return true;

  // TODO: Check for no more available moves

  return false;
}

export { countNewMills, isValidMove, isRemovable, isValidShift, checkLose };
