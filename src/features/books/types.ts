/* eslint-disable max-classes-per-file */

import { Type } from 'class-transformer';
import { IsDefined, IsInt, IsPositive } from 'class-validator';

export interface GetBookRequest {
  page?: number;
}
export interface GetBookResponse {
  nextPage: number | null;
  books: Book[];
}

export interface IsFavoriteRequest {
  bookId: number;
}

export interface IsFavoriteResponse {
  bookId: number;
  isFavorite: boolean;
}

export interface Book {
  id: number;
  title: string;
  authors: string;
  cover: string;
}

export interface BookPayload {
  nextPage: number | null;
  books: Book[];
}

export interface BooksProvider {
  loadBooks(page?: number): Promise<BookPayload>;
}

export interface IBooksService {
  getBooks(): Promise<GetBookResponse>;
  getBooksFromPage(page: number): Promise<GetBookResponse>;
  getIsFavorite(bookId: number): Promise<IsFavoriteResponse>;
  setIsFavorite(bookId: number): Promise<IsFavoriteResponse>;
}

export class GetBooksByPageRequest {
  @IsDefined()
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  public pageNumber = 0;
}

export class PutBooksRequest {
  @IsDefined()
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  public bookId = 0;
}
