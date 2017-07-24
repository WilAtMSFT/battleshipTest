var express = require('express');
var router = express.Router();

/* GET battleship page. */
router.get('/', function(req, res, next) {
  res.render('battleship', { title: 'Battleship!' });
});

/* POST to battleship page. */
router.post('/', function(req, res) {

    // Get our form values. 
    let x = req.body.xcoordinate;
    let y = req.body.ycoordinate;
    let result = 'Miss';

    res.render('battleship', { title: 'Battleship!', xcoordinate: x, ycoordinate: y, result: result});
});

module.exports = router;
