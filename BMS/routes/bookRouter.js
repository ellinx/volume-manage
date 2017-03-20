var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Books = require('../models/books');

var bookRouter = express.Router();
bookRouter.use(bodyParser.json());
bookRouter.route('/')
.get(function(req, res, next){

  Books.find({}, function(err, book) {
    if (err) throw err;
    res.json(book);
  });
	//res.end('Will send all the books to you!');
})
.post(function(req, res, next){

  Books.create(req.body, function(err, book) {
    if (err) throw err;

    console.log('Book created');
    var id = book._id;
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Added the book with id: ' + id);
  });
	//res.end('Will add the books:' + req.body.name + ' with details: ' + req.body.description);
})
.delete(function(req, res, next){

  Books.remove({}, function(err, resp) {
    if (err) throw err;
    res.json(resp);
  });
  //res.end('Deleting all books!');
});

bookRouter.route('/:bookId')
.get(function(req, res, next){

  Books.findById(req.params.bookId, function(err, book) {
    if (err) throw err;
    res.json(book);
  });
  //res.end('Will send details the book: ' + req.params.bookId + ' to you!');
})
.put(function(req, res, next){

  Books.findByIdAndUpdate(req.params.bookId, {$set: req.body}, {new: true}, function(err, book) {
    if (err) throw err;
    res.json(book);
  })
  //res.write('Updating the book:' + req.params.bookId + '\n');
	//res.end('Will update the books:' + req.body.name + ' with details: ' + req.body.description);
})
.delete(function(req, res, next){

  Books.findByIdAndRemove(req.params.bookId, function(err, resp) {
    if (err) throw err;
    res.json(resp);
  });
	//res.end('Deleting book: ' + req.params.bookId );
});

bookRouter.route('/:bookId/comments')
.get(function(req, res, next) {
  Books.findById(req.params.bookId, function(err, book) {
    if (err) throw err;
    res.json(book.comments);
  });
})
.post(function(req, res, next) {
  Books.findById(req.params.bookId, function(err, book) {
    if (err) throw err;
    book.comments.push(req.body);
    book.save(function(err, book) {
      if (err) throw err;
      console.log("Updated Comments!");
      res.json(book);
    });
  });
})
.delete(function(req, res, next) {
  Books.findById(req.params.bookId, function(err, book) {
    if (err) throw err;

    for (var i=book.comments.length-1;i>=0;i--) {
      book.comments.id(book.comments[i]._id).remove();
    }
    book.save(function(err, result) {
      if (err) throw err;
      res.writeHead(200,{"Content-Type": "text/plain"});
      res.end("Deleted All Comments!");
    });
  });
})

bookRouter.route('/:bookId/comments/:commentId')
.get(function(req, res, next) {
  Books.findById(req.params.bookId,function(err, book) {
    if (err) throw err;
    res.json(book.comments.id(req.params.commentId));
  });
})
.put(function(req, res, next) {
  Books.findById(req.params.bookId, function(err, book) {
    if (err) throw err;
    book.comments.id(req.params.commentId).remove();
    book.comments.push(req.body);
    book.save(function(err, result) {
      if (err) throw err;
      console.log("Updated Comments!");
      res.json(result);
    });
  });
})
.delete(function(req, res, next) {
  Books.findById(req.params.bookId, function(err, book) {
    if (err) throw err;
    book.comments.id(req.params.commentId).remove();
    book.save(function(err, result) {
      if (err) throw err;
      console.log("Deleted Comments!");
      res.json(result);
    });
  });
})

module.exports = bookRouter;
