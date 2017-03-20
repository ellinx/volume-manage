var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
  rating: {
    type: Number,
    min: 1,
    max: 5,
    request: true
  },
  comment: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  }
});

var bookSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  comments: [commentSchema],
  price: {
    type: Number,
    required: true
  },
  ISBN: {
    type: String,
    required: true,
    unique: true
  }
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var Books = mongoose.model('Book', bookSchema);

// make this available to our Node applications
module.exports = Books;
