import { FavoriteBookModel, Repository } from '../../repositories';
import { IsFavoriteResponse, GetBookResponse, BooksProvider, IBooksService } from './types';

export default class BooksService implements IBooksService {
  constructor(
    private booksProvider: BooksProvider,
    private favoriteBookRepository: Repository<FavoriteBookModel>,
  ) {}

  async getBooks(): Promise<GetBookResponse> {
    const books = await this.booksProvider.loadBooks();
    return books;
  }

  async getBooksFromPage(page: number): Promise<GetBookResponse> {
    const books = await this.booksProvider.loadBooks(page);
    return books;
  }

  async getIsFavorite(userId: string, bookId: number): Promise<IsFavoriteResponse> {
    this.favoriteBookRepository.changeDatabase(userId);
    // TODO: Validate bookId
    const book = await this.favoriteBookRepository.findById(bookId);
    return {
      bookId,
      isFavorite: !!book,
    };
  }

  async setIsFavorite(userId: string, bookId: number): Promise<IsFavoriteResponse> {
    this.favoriteBookRepository.changeDatabase(userId);
    // TODO: Validate bookId
    const book = await this.favoriteBookRepository.findById(bookId);
    let result: FavoriteBookModel[];
    if (!book) {
      result = await this.favoriteBookRepository.insert({ id: bookId });
    } else {
      result = await this.favoriteBookRepository.update({ id: bookId });
    }
    return {
      bookId,
      isFavorite: result.findIndex(r => r.id === bookId) > -1,
    };
  }
}
