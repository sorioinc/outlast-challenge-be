import { Router, RequestHandler } from 'express';

import {
  GetBookResponse,
  GetBooksByPageRequest,
  IBooksService,
  IsFavoriteResponse,
  PutBooksRequest,
} from './types';
import { validateParams } from '../../middleware';

export default (router: Router, booksService: IBooksService) => {
  router.get('/books/', async () => booksService.getBooks());

  router.get(
    '/books/:pageNumber',
    validateParams(GetBooksByPageRequest),
    (): RequestHandler<GetBooksByPageRequest, GetBookResponse> => async (req, res) => {
      const { pageNumber } = req.params;
      const response = await booksService.getBooksFromPage(pageNumber);
      res.send(response);
    },
  );

  router.put(
    '/books/:bookId/favorite',
    validateParams(PutBooksRequest),
    (): RequestHandler<PutBooksRequest, IsFavoriteResponse> => async (req, res) => {
      const { bookId } = req.params;
      const response = await booksService.setIsFavorite(bookId);
      res.send(response);
    },
  );

  return router;
};
