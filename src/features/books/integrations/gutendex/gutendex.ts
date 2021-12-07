import axios from 'axios';
import { BooksProvider, BookPayload } from '../../types';

import { GutendexPayload } from './types';

export default class GutendexBookProvider implements BooksProvider {
  baseUrl = 'https://gutendex.com';

  loadBooks(page?: number): Promise<BookPayload> {
    const url = `${this.baseUrl}/books/${page ? `?page=${page}` : ''}`;
    return axios.get<GutendexPayload>(url).then(({ data }) => {
      const nextPage = data.next !== null ? Number(data.next.split('=')[1]) : null;
      const response: BookPayload = {
        nextPage,
        books: data.results.map(b => ({
          id: b.id,
          title: b.title,
          authors: b.authors.map(a => a.name).join(', '),
          cover: b.formats['image/jpeg'],
        })),
      };
      return response;
    });
  }
}
