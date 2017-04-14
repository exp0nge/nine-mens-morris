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
  BOARD: null
};

function makeMoveProp(row, col, turn, board) {
  return {
    ROW: row,
    COL: col,
    TURN: turn,
    BOARD: board
  }
}

export { SHARP_COLORS, STATES, makeMoveProp };
