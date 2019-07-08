var express = require('express');
var router = express.Router();
var Book = require('../models').Book;
var Sequelize = require('sequelize');
const Op = Sequelize.Op;


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



// handle search query
// change amount of books shown on one page by changing variable lmt
router.post('/', async function(req, res, next){
    const lmt = 3;
    const page = req.query.page;
    const searchVal = req.body.bookSearch || req.query.term;
    const ost = (page - 1) * 3;
    let nrAllBooks = 0;
  
    await Book.findAll({
      where: {
        [Op.or]: [
          {
            title: {
              [Op.like]: `%${searchVal}%`
            }
          }, 
          {
            author: {
              [Op.like]: `%${searchVal}%`
            }
          }, 
          {
            genre: {
              [Op.like]: `%${searchVal}%`
            }
          }, 
          {
            year: {
              [Op.like]: `%${searchVal}%`
            }
          }
        ]
      }
    }).then(function(books){
      nrAllBooks = books.length;
    }).catch(function(err){
      next(err);
    });
  
    let array = await makeArray(Math.ceil(nrAllBooks / lmt));
  
  
    Book.findAll({
      limit: lmt,
      offset: ost,
      where: {
        [Op.or]: [
          {
            title: {
              [Op.like]: `%${searchVal}%`
            }
          }, 
          {
            author: {
              [Op.like]: `%${searchVal}%`
            }
          }, 
          {
            genre: {
              [Op.like]: `%${searchVal}%`
            }
          }, 
          {
            year: {
              [Op.like]: `%${searchVal}%`
            }
          }
        ]
      }
    }).then(function(books){
      res.render("search-listing", {
        searchVal: searchVal,
        books: books,
        bttns: array
      });
    }).catch(function(err){
      next(err);
    });
  });


  module.exports = router;
