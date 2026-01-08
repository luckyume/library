const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {
  let testId; // Variable to store ID for testing detail routes

  suite('Routing tests', function () {

    suite('POST /api/books with title => create book object', function () {
      test('Test POST /api/books with title', function (done) {
        chai.request(server)
          .post('/api/books')
          .send({ title: 'Mocha Test Book' })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.title, 'Mocha Test Book');
            assert.property(res.body, '_id');
            testId = res.body._id; // IMPORTANT: This must succeed for other tests to work
            done();
          });
      });
    });

    suite('GET /api/books => array of books', function () {
      test('Test GET /api/books', function (done) {
        chai.request(server)
          .get('/api/books')
          .end((err, res) => {
            assert.isArray(res.body);
            assert.property(res.body[0], 'commentcount');
            done();
          });
      });
    });

    suite('GET /api/books/[id] => book object with [id]', function () {
      test('Test GET /api/books/[id] with id not in db', function (done) {
        chai.request(server)
          .get('/api/books/invalidid123')
          .end((err, res) => {
            assert.equal(res.text, 'no book exists');
            done();
          });
      });

      test('Test GET /api/books/[id] with valid id in db', function (done) {
        chai.request(server)
          .get('/api/books/' + testId)
          .end((err, res) => {
            assert.equal(res.body._id, testId);
            assert.isArray(res.body.comments);
            done();
          });
      });
    });

    suite('POST /api/books/[id] => add comment', function () {
      test('Test POST /api/books/[id] with comment', function (done) {
        chai.request(server)
          .post('/api/books/' + testId)
          .send({ comment: 'Great read!' })
          .end((err, res) => {
            assert.include(res.body.comments, 'Great read!');
            done();
          });
      });

      test('Test POST /api/books/[id] without comment field', function (done) {
        chai.request(server)
          .post('/api/books/' + testId)
          .send({})
          .end((err, res) => {
            assert.equal(res.text, 'missing required field comment');
            done();
          });
      });
    });

    suite('DELETE /api/books/[id] => delete book object id', function () {
      test('Test DELETE /api/books/[id] with valid id in db', function (done) {
        chai.request(server)
          .delete('/api/books/' + testId)
          .end((err, res) => {
            assert.equal(res.text, 'delete successful');
            done();
          });
      });

      test('Test DELETE /api/books/[id] with id not in db', function (done) {
        chai.request(server)
          .delete('/api/books/invalidid123')
          .end((err, res) => {
            assert.equal(res.text, 'no book exists');
            done();
          });
      });
    });

  });
});