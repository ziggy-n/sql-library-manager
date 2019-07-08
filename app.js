var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

var indexRouter = require('./routes/index');
const booksRouter = require('./routes/books');
const searchRouter = require('./routes/search');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/books', booksRouter);
app.use('/search', searchRouter);


app.get('/not-found', function(req, res, next){
  res.render("page-not-found");
});


app.get('/book-doesnt-exist', function(req, res, next){
  res.render("book-doesnt-exist");
});


app.use((req, res, next) => {
  res.redirect('/not-found');
});


app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {error: err});
});



module.exports = app;
