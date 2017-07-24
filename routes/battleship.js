var express = require('express');
var router = express.Router();

/* GET battleship page. */
router.get('/', function(req, res, next) {
    let result = 'begin';
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
    
    res.render('battleship', { title: 'Battleship!', result: result, boardString: boardString});
});

/* POST to battleship page. */
router.post('/', function(req, res) {

    // Get our form values. 
    let x = req.body.xcoordinate;
    let y = req.body.ycoordinate;
    let board = JSON.parse(req.body.boardString);

    //let result = fire(x,y,board);
    let boardString = JSON.stringify(board);

    let result = 'Miss';

    res.render('battleship', { title: 'Battleship!', xcoordinate: x, ycoordinate: y, result: result, boardString: boardString});
});

module.exports = router;
