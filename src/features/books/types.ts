/* eslint-disable max-classes-per-file */

import { Type } from 'class-transformer';
import { IsDefined, IsInt, IsOptional, IsPositive } from 'class-validator';

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
  getIsFavorite(userId: string, bookId: number): Promise<IsFavoriteResponse>;
  setIsFavorite(userId: string, bookId: number): Promise<IsFavoriteResponse>;
}

export class GetBooksByPageRequest {
  @IsOptional()
  @IsDefined()
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  public pageNumber?: number;
}

export class GetIsFavoriteBookRequest {
  @IsDefined()
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  public bookId = 0;
}

export class PutIsFavoriteBookRequest {
  @IsDefined()
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  public bookId = 0;
}
