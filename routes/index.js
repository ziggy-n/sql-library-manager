var express = require('express');
var router = express.Router();

/* redirects to first page of book listing at /books */
router.get('/', function(req, res, next) {
  res.redirect('/books?page=1');
});

module.exports = router;
