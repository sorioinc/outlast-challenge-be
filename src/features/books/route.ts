import { Router, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { Empty } from '../../util';
import {
  GetBookResponse,
  GetBooksByPageRequest,
  IBooksService,
  IsFavoriteResponse,
  GetIsFavoriteBookRequest,
  PutIsFavoriteBookRequest,
} from './types';
import { validateParams, validateQuery } from '../../middleware';

const getBook =
  (
    booksService: IBooksService,
  ): RequestHandler<Empty, GetBookResponse, Empty, GetBooksByPageRequest> =>
  async (req, res) => {
    const { pageNumber } = req.query;

    try {
      let response: GetBookResponse;
      if (pageNumber && pageNumber > 0) {
        response = await booksService.getBooksFromPage(pageNumber);
      } else {
        response = await booksService.getBooks();
      }
      res.send(response);
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
  };

const getIsFavoriteBook =
  (booksService: IBooksService): RequestHandler<GetIsFavoriteBookRequest, IsFavoriteResponse> =>
  async (req, res) => {
    const { user } = req.headers;
    if (!user) {
      res.status(StatusCodes.FORBIDDEN).end();
      return;
    }
    const userId = user.toString();
    const { bookId } = req.params;
    try {
      const response = await booksService.getIsFavorite(userId, bookId);
      res.send(response);
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
  };

const putIsFavoriteBook =
  (booksService: IBooksService): RequestHandler<PutIsFavoriteBookRequest, IsFavoriteResponse> =>
  async (req, res) => {
    const { user } = req.headers;
    if (!user) {
      res.status(StatusCodes.FORBIDDEN).end();
      return;
    }
    const userId = user.toString();
    const { bookId } = req.params;
    try {
      const response = await booksService.setIsFavorite(userId, bookId);
      res.send(response);
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
  };

export default (router: Router, booksService: IBooksService) => {
  router.get('/books', validateQuery(GetBooksByPageRequest), getBook(booksService));
  router.get(
    '/books/:bookId/favorite',
    validateParams(GetIsFavoriteBookRequest),
    // TODO: Seems like express typings need improvement, compiler gets the signature of the first middleware and assuming the rest is the same. Create an issue in Github.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    getIsFavoriteBook(booksService),
  );
  router.put(
    '/books/:bookId/favorite',
    validateParams(PutIsFavoriteBookRequest),
    // TODO: Seems like express typings need improvement, compiler gets the signature of the first middleware and assuming the rest is the same. Create an issue in Github.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    putIsFavoriteBook(booksService),
  );

  return router;
};
