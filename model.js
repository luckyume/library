const mongoose = require('mongoose');
const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    comments: [String]
});
const Book = mongoose.model('Book', bookSchema);
module.exports = Book;