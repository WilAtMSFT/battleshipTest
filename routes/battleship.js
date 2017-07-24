var express = require('express');
var router = express.Router();

/* GET battleship page. */
router.get('/', function(req, res, next) {
    let result = 'Begin';
    let board = {};
    board.cells = [];

    // ship 1 is 2 cells horizontial
    board.cells[1] = [];
    board.cells[1][0] = 1;
    board.cells[1][1] = 1;

    //ship 2 is one cell at
    board.cells[0] = []
    board.cells[0][0] = 2;

    board.cells[2] = []
    board.cells[3] = []

    // ship 1 has 2 hits, ship2 has 1 hit
    board.ships = [null, 2, 1];
    board.shipsRemaining = 2

    board.gameOver = 0;

    let boardString = JSON.stringify(board);
    
    res.render('battleship', { title: 'Battleship!', result: result, boardString: boardString, cells:board.cells});
});

/* POST to battleship page. */
router.post('/', function(req, res) {

    // Get our form values. 
    let x = req.body.xcoordinate;
    let y = req.body.ycoordinate;
    let board = JSON.parse(req.body.boardString);

    let result = fire(x,y,board);
    let boardString = JSON.stringify(board);

    res.render('battleship', { title: 'Battleship!', xcoordinate: x, ycoordinate: y, result: result, boardString: boardString, cells:board.cells});
});

function fire(x,y, board) {
   if (board.gameOver == 1) {
    return 'Error - the game is over!'
  }

  if (x > 2 || x < 0 || y > 2 || y < 0) {
    return 'error - coordinate out of range'
  }
  let result = 'Hit';
  let xarry = board.cells[x];

  if (xarry == null) {
    xarry = [];
    board.cells[x] = xarry;
  }

  let shipId = xarry[y];

  if (shipId == null) {
    xarry[y] = 0;
    return 'Miss';
  }

  // check if this spot has been fired on already
  if (shipId < 1)
  {
    return 'Duplicate fire error'
  }

  // we have a ship, lets count the hit
  board.ships[shipId]--;
  xarry[y] = -1 * xarry[y];

  if (board.ships[shipId] == 0)
  {
    // ship sunk
    board.shipsRemaining--;

    // is the game over
    if (board.shipsRemaining == 0)
    {
      board.gameOver = 1;
      return 'Sunk all ships - congrats!!';
    }

    return 'Ship sunk';
  }

  return result;
}

module.exports = router;
