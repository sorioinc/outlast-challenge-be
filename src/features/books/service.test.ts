import Substitute, { SubstituteOf, Arg } from '@fluffy-spoon/substitute';
import BooksService from './service';
import type { BooksProvider } from './types';
import type { Repository, FavoriteBookModel } from '../../repositories';

const bookProviderData = {
  books: [
    {
      authors: 'Shelley, Mary Wollstonecraft',
      cover: 'https://www.gutenberg.org/cache/epub/84/pg84.cover.small.jpg',
      id: 84,
      title: 'Frankenstein; Or, The Modern Prometheus',
    },
  ],
  nextPage: 2,
};

describe('BooksService', () => {
  let mockedBooksProvider: SubstituteOf<BooksProvider>;
  let mockedRepository: SubstituteOf<Repository<FavoriteBookModel>>;
  let bookService: BooksService;

  beforeEach(() => {
    mockedBooksProvider = Substitute.for<BooksProvider>();
    mockedRepository = Substitute.for<Repository<FavoriteBookModel>>();
    bookService = new BooksService(mockedBooksProvider, mockedRepository);
  });

  describe('getBooks', () => {
    test('Should get all books successfully', async () => {
      mockedBooksProvider.loadBooks(Arg.all()).resolves(bookProviderData);

      const books = await bookService.getBooks();

      expect(books).toEqual(bookProviderData);
    });
  });

  describe('getBooks', () => {
    test('Should get all books given a pageNumber successfully', async () => {
      const expectedResponseWhenPageIs3 = { ...bookProviderData, nextPage: 4 };
      const expectedResponseWhenPageIs7 = { ...bookProviderData, nextPage: 8 };
      mockedBooksProvider
        .loadBooks(Arg.is(x => x === 3))
        .resolves({ ...bookProviderData, nextPage: 4 });
      mockedBooksProvider
        .loadBooks(Arg.is(x => x === 7))
        .resolves({ ...bookProviderData, nextPage: 8 });

      const books1 = await bookService.getBooksFromPage(3);
      const books2 = await bookService.getBooksFromPage(7);

      expect(books1).toEqual(expectedResponseWhenPageIs3);
      expect(books2).toEqual(expectedResponseWhenPageIs7);
    });
  });

  describe('getIsFavorite', () => {
    test('Should return as favorite book when found', async () => {
      mockedRepository.findById(Arg.is(x => x === 1234)).resolves({ id: 1234 });

      const result = await bookService.getIsFavorite('XX123', 1234);

      expect(result).toEqual({ bookId: 1234, isFavorite: true });
    });
    test('Should not return as favorite book when not found', async () => {
      mockedRepository.findById(Arg.is(x => x === 1234)).resolves(undefined);

      const result = await bookService.getIsFavorite('XX123', 1234);

      expect(result).toEqual({ bookId: 1234, isFavorite: false });
    });
  });

  describe('setIsFavorite', () => {
    test('Should insert book when it is not favorite already', async () => {
      mockedRepository.findById(Arg.is(x => x === 1234)).resolves(undefined);
      mockedRepository.insert(Arg.is(x => x.id === 1234)).resolves([
        {
          id: 1234,
        },
      ]);
      mockedRepository.update(Arg.any());

      const result = await bookService.setIsFavorite('XX123', 1234);

      mockedRepository.received().insert(Arg.any());
      mockedRepository.didNotReceive().update(Arg.any());
      expect(result).toEqual({ bookId: 1234, isFavorite: true });
    });
    test('Should update favorite book when found', async () => {
      mockedRepository.findById(Arg.is(x => x === 1234)).resolves({ id: 1234 });
      mockedRepository.update(Arg.is(x => x.id === 1234)).resolves([
        {
          id: 1234,
        },
      ]);
      mockedRepository.insert(Arg.any());

      const result = await bookService.setIsFavorite('XX123', 1234);

      mockedRepository.received().update(Arg.any());
      mockedRepository.didNotReceive().insert(Arg.any());
      expect(result).toEqual({ bookId: 1234, isFavorite: true });
    });
  });
});
