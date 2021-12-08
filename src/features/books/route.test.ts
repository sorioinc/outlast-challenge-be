import Substitute, { Arg, SubstituteOf } from '@fluffy-spoon/substitute';
import express, { Router, Express } from 'express';
import supertest, { SuperTest, Test } from 'supertest';
import bodyParser from 'body-parser';

import route from './route';
import { IBooksService, GetBookResponse } from './types';

const responseData: GetBookResponse = {
  nextPage: 2,
  books: [
    {
      id: 84,
      title: 'Frankenstein; Or, The Modern Prometheus',
      authors: 'Shelley, Mary Wollstonecraft',
      cover: 'https://www.gutenberg.org/cache/epub/84/pg84.cover.small.jpg',
    },
  ],
};

describe('BooksRoutes', () => {
  let app: Express;
  let router: Router;
  let request: SuperTest<Test>;
  let bookService: SubstituteOf<IBooksService>;

  beforeEach(() => {
    bookService = Substitute.for<IBooksService>();
    app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    router = express.Router();

    app.use(route(router, bookService));

    request = supertest(app);
  });

  describe('GET /books', () => {
    test('Should successfully return books when no page is given', async () => {
      bookService.getBooks().resolves(responseData);
      bookService.getBooksFromPage(Arg.any());

      const result = await request.get('/books');

      bookService.received().getBooks();
      bookService.didNotReceive().getBooksFromPage(Arg.any());
      expect(result.status).toBe(200);
    });
    test('Should error if underlying service errors', async () => {
      bookService.getBooks().rejects(new Error());
      bookService.getBooksFromPage(Arg.any());

      const result = await request.get('/books');

      bookService.received().getBooks();
      bookService.didNotReceive().getBooksFromPage(Arg.any());
      expect(result.status).toBe(500);
    });
  });

  describe('GET /books?pageNumber=<number>', () => {
    test('Should successfully return books when page is given', async () => {
      bookService.getBooksFromPage(Arg.any()).resolves(responseData);
      bookService.getBooks().resolves(responseData);

      const result = await request.get('/books?pageNumber=4');

      bookService.received().getBooksFromPage(Arg.any());
      bookService.didNotReceive().getBooks();
      expect(result.status).toBe(200);
    });
    test('Should error when underlying service errors', async () => {
      bookService.getBooksFromPage(Arg.any()).rejects(new Error());
      bookService.getBooks().resolves(responseData);

      const result = await request.get('/books?pageNumber=4');

      bookService.received().getBooksFromPage(Arg.any());
      bookService.didNotReceive().getBooks();
      expect(result.status).toBe(500);
    });
  });

  describe('GET /books/:bookId/favorite', () => {
    test('Should fail as forbidden if user is not sent as header', async () => {
      bookService.getIsFavorite(Arg.all()).resolves({ bookId: 48, isFavorite: false });

      const result = await request.get('/books/48/favorite');

      bookService.didNotReceive().getIsFavorite(Arg.all());
      expect(result.status).toBe(403);
    });

    test('Should respond successfully when header and params are set correctly', async () => {
      const expectedResult = { bookId: 48, isFavorite: false };
      bookService.getIsFavorite(Arg.all()).resolves(expectedResult);

      const result = await request.get('/books/48/favorite').set('user', 'XX123');

      bookService.received().getIsFavorite(Arg.all());
      expect(result.status).toBe(200);
    });

    test('Should error when underlying service errors', async () => {
      bookService.getIsFavorite(Arg.all()).rejects(new Error());

      const result = await request.get('/books/48/favorite').set('user', 'XX123');

      bookService.received().getIsFavorite(Arg.all());
      expect(result.status).toBe(500);
    });

    test('Should fail as bad request when the book is not a positive number', async () => {
      bookService.getIsFavorite(Arg.all()).rejects(new Error());

      const result = await request.get('/books/sdfa/favorite').set('user', 'XX123');

      bookService.didNotReceive().getIsFavorite(Arg.all());
      expect(result.status).toBe(400);
    });
  });

  describe('PUT /books/:bookId/favorite', () => {
    test('Should fail as forbidden if user is not sent as header', async () => {
      bookService.setIsFavorite(Arg.all()).resolves({ bookId: 48, isFavorite: false });

      const result = await request.put('/books/48/favorite');

      bookService.didNotReceive().setIsFavorite(Arg.all());
      expect(result.status).toBe(403);
    });

    test('Should respond successfully when header and params are set correctly', async () => {
      const expectedResult = { bookId: 48, isFavorite: false };
      bookService.setIsFavorite(Arg.all()).resolves(expectedResult);

      const result = await request.put('/books/48/favorite').set('user', 'XX123');

      bookService.received().setIsFavorite(Arg.all());
      expect(result.status).toBe(200);
    });

    test('Should error when underlying service errors', async () => {
      bookService.setIsFavorite(Arg.all()).rejects(new Error());

      const result = await request.put('/books/48/favorite').set('user', 'XX123');

      bookService.received().setIsFavorite(Arg.all());
      expect(result.status).toBe(500);
    });

    test('Should fail as bad request when the book is not a positive number', async () => {
      bookService.setIsFavorite(Arg.all()).rejects(new Error());

      const result = await request.put('/books/sdfa/favorite').set('user', 'XX123');

      bookService.didNotReceive().setIsFavorite(Arg.all());
      expect(result.status).toBe(400);
    });
  });
});
