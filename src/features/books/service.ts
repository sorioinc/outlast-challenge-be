import { FavoriteBookModel, PersistenceLayer } from '../../repositories';
import { IsFavoriteResponse, GetBookResponse, BooksProvider, IBooksService } from './types';

export default class BooksService implements IBooksService {
  constructor(
    private booksService: BooksProvider,
    private persistanceService: PersistenceLayer<FavoriteBookModel>,
  ) {}

  async getBooks(): Promise<GetBookResponse> {
    const books = await this.booksService.loadBooks();
    return books;
  }

  async getBooksFromPage(page: number): Promise<GetBookResponse> {
    const books = await this.booksService.loadBooks(page);
    return books;
  }

  async getIsFavorite(bookId: number): Promise<IsFavoriteResponse> {
    const book = await this.persistanceService.findById(bookId);
    return {
      bookId,
      isFavorite: !!book,
    };
  }

  async setIsFavorite(bookId: number): Promise<IsFavoriteResponse> {
    let book = await this.persistanceService.findById(bookId);
    if (!book) {
      book = await this.persistanceService.insert({ id: bookId });
    } else {
      book = await this.persistanceService.update({ id: bookId });
    }
    return {
      bookId: book.id,
      isFavorite: !!book,
    };
  }
}
