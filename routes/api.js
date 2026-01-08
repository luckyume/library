'use strict';
const Book = require('../model'); // Path to your schema

module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res) {
      try {
        const books = await Book.find({});
        const formatData = books.map(b => ({
          _id: b._id,
          title: b.title,
          commentcount: b.comments.length
        }));
        res.json(formatData);
      } catch (err) {
        res.send("error fetching books");
      }
    })

    .post(async function (req, res) {
      let title = req.body.title;
      if (!title) return res.send('missing required field title');

      try {
        const newBook = new Book({ title, comments: [] });
        const saved = await newBook.save();
        res.json({ _id: saved._id, title: saved.title });
      } catch (err) {
        res.send("error saving book");
      }
    })

    .delete(async function (req, res) {
      try {
        await Book.deleteMany({});
        res.send('complete delete successful');
      } catch (err) {
        res.send('error deleting all books');
      }
    });

  app.route('/api/books/:id')
    .get(async function (req, res) {
      let bookid = req.params.id;
      try {
        const book = await Book.findById(bookid);
        if (!book) return res.send('no book exists');
        res.json({
          _id: book._id,
          title: book.title,
          comments: book.comments
        });
      } catch (err) {
        res.send('no book exists');
      }
    })

    .post(async function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      if (!comment) return res.send('missing required field comment');

      try {
        const updatedBook = await Book.findByIdAndUpdate(
          bookid,
          { $push: { comments: comment } },
          { new: true }
        );
        if (!updatedBook) return res.send('no book exists');
        res.json({
          _id: updatedBook._id,
          title: updatedBook.title,
          comments: updatedBook.comments
        });
      } catch (err) {
        res.send('no book exists');
      }
    })

    .delete(async function (req, res) {
      let bookid = req.params.id;
      try {
        const deleted = await Book.findByIdAndDelete(bookid);
        if (!deleted) return res.send('no book exists');
        res.send('delete successful');
      } catch (err) {
        res.send('no book exists');
      }
    });
};