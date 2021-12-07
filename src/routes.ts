import { Application, Router } from 'express';
import { booksRoute, BooksService, Gutendex } from './features/books';
import { FavoriteBookRepository } from './repositories';

export default (app: Application, router: Router): Router => {
  const favoriteBookRepository = new FavoriteBookRepository('');
  const booksProvider = new Gutendex();
  const booksService = new BooksService(booksProvider, favoriteBookRepository);

  app.use(booksRoute(router, booksService));
  return router;
};
