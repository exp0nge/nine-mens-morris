const SHARP_COLORS = {
  YELLOW: '#f6ff00',
  PURPLE: '#ff00ee'
}

const STATES = {
  UNAVAILABLE: 0,
  AVAILABLE: 1,
  PURPLE: "P",
  YELLOW: "Y"
};

const MOVE = {
  ROW: null,
  COL: null,
  COLOR: null,
  BOARD: null,
  SHIFT: null,
  SHIFTROW: null,
  SHIFTCOL: null
};

function makeMoveProp(row, col, turn, shift, shiftRow, shiftCol, board) {
  return {
    ROW: row,
    COL: col,
    TURN: turn,
    SHIFT: shift,
    SHIFTROW: shiftRow,
    SHIFTCOL: shiftCol,
    BOARD: board
  }
}

export { SHARP_COLORS, STATES, makeMoveProp };
