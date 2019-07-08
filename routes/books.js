var express = require('express');
var router = express.Router();
var Book = require('../models').Book;


// helper function
function makeArray(limit){
  let array = [1];
  let i = 1;
  while(i < limit){
    i++;
    array.push(i);
  }
  return array;
}

let pageNr;


router.post('/', async function(req, res, next){
  pageNr = req.query.page;
  res.redirect('/books');
});

// show list of books with pagination
// change amount of books shown on one page by changing variable lmt
router.get('/', async function(req, res, next){
  const lmt = 3;
  const page = (req.query.page || pageNr);
  const ost = (page - 1) * 3;
  let nrAllBooks = 0;

  await Book.findAll().then(function(books){
    nrAllBooks = books.length;
  }).catch(function(err){
    next(err);
  });

  let array = await makeArray(Math.ceil(nrAllBooks / lmt));

  Book.findAll({
    limit: lmt,
    offset: ost
  }).then(function(books){
    res.render("index", {
      books: books,
      bttns: array
    });
  }).catch(function(err){
    next(err);
  });
});


// shows the create new book form
router.get('/new', function(req, res, next){
  res.render('new-book', {book: Book.build()});
});



// posts a new book to the database
router.post('/new', function(req, res, next){
  Book.create(req.body).then(function(book){
    res.redirect("/books");
  }).catch(function(err){
    if(err.name === "SequelizeValidationError"){
      res.render('new-book', {
        book: Book.build(req.body),
        errors: err.errors
      });
    } else {
      throw err;
    }
  }).catch(function(err){
    next(err);
  });
});



// shows book detail form
router.get('/:id', function(req, res, next){
  
  console.log("inside get id");

  Book.findByPk(req.params.id).then(function(book){
    if(book){
      res.render("update-book", {book: book})
    } else {
      res.redirect('/book-doesnt-exist');
    }
  }).catch(function(err){
    next(err);
  });
});


// post updated form
router.post("/:id", function(req, res, next){
  

  Book.findByPk(req.params.id).then(function(book){
    if(book){
      return book.update(req.body);
    } else {
      res.redirect('/book-doesnt-exist');
    }
  }).then(function(book){
    res.redirect('/books');
  }).catch(function(err){
    if(err.name === "SequelizeValidationError"){
      let book = Book.build(req.body);
      book.id = req.params.id;
      res.render("update-book", {
        book: book,
        errors: err.errors
      });
    } else {
      throw err;
    }
  }).catch(function(err){
    next(err);
  });
});


// choose to delete book
router.get('/:id/delete', function(req, res, next){
  Book.findByPk(req.params.id).then(function(book){
    if(book){
      res.render('delete', {book: book});
    } else {
      res.redirect('/book-doesnt-exist');
    }
    
  }).catch(function(err){
    next(err);
  });
});


// delete book
router.post('/:id/delete', function(req, res, next){
  Book.findByPk(req.params.id).then(function(book){
    if(book){
      return book.destroy();
    } else {
      res.redirect('/book-doesnt-exist');
    }
  }).then(function(){
    res.redirect('/books');
  });
});




module.exports = router;



