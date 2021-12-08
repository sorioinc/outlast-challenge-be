import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import type { GutendexPayload } from './types';

import Gutendex from './gutendex';

const responseData: GutendexPayload = {
  count: 66796,
  next: 'https://gutendex.com/books/?page=2',
  previous: null,
  results: [
    {
      id: 84,
      title: 'Frankenstein; Or, The Modern Prometheus',
      authors: [
        {
          name: 'Shelley, Mary Wollstonecraft',
          birth_year: 1797,
          death_year: 1851,
        },
      ],
      translators: [],
      subjects: [
        "Frankenstein's monster (Fictitious character) -- Fiction",
        'Frankenstein, Victor (Fictitious character) -- Fiction',
        'Gothic fiction',
        'Horror tales',
        'Monsters -- Fiction',
        'Science fiction',
        'Scientists -- Fiction',
      ],
      bookshelves: [
        'Gothic Fiction',
        'Movie Books',
        'Precursors of Science Fiction',
        'Science Fiction by Women',
      ],
      languages: ['en'],
      copyright: false,
      media_type: 'Text',
      formats: {
        'application/epub+zip': 'https://www.gutenberg.org/ebooks/84.epub.images',
        'application/rdf+xml': 'https://www.gutenberg.org/ebooks/84.rdf',
        'application/x-mobipocket-ebook': 'https://www.gutenberg.org/ebooks/84.kindle.images',
        'application/zip': 'https://www.gutenberg.org/files/84/84-0.zip',
        'image/jpeg': 'https://www.gutenberg.org/cache/epub/84/pg84.cover.small.jpg',
        'text/plain; charset=utf-8': 'https://www.gutenberg.org/files/84/84-0.txt',
        'text/html; charset=utf-8': 'https://www.gutenberg.org/files/84/84-h.zip',
        'text/html': 'https://www.gutenberg.org/ebooks/84.html.images',
      },
      download_count: 84371,
    },
  ],
};

describe('Gutendex', () => {
  let mock: MockAdapter;
  beforeAll(() => {
    mock = new MockAdapter(axios);
  });
  afterEach(() => {
    mock.reset();
  });

  test('Should load books successfully when no page is sent', async () => {
    const data: GutendexPayload = { ...responseData, results: [...responseData.results] };

    const expectedNextPage = 2;
    const expectedBooks = [
      {
        authors: 'Shelley, Mary Wollstonecraft',
        cover: 'https://www.gutenberg.org/cache/epub/84/pg84.cover.small.jpg',
        id: 84,
        title: 'Frankenstein; Or, The Modern Prometheus',
      },
    ];

    mock.onGet().reply(200, data);

    const provider = new Gutendex();
    const result = await provider.loadBooks();

    expect(result.nextPage).toBe(expectedNextPage);
    expect(result.books).toEqual(expectedBooks);
    expect(mock.history.get[0].url).toBe('https://gutendex.com/books/');
  });

  test('Should load books successfully given a page number', async () => {
    const data: GutendexPayload = {
      ...responseData,
      next: 'https://gutendex.com/books/?page=6',
      results: [...responseData.results],
    };

    const expectedNextPage = 6;
    const expectedBooks = [
      {
        authors: 'Shelley, Mary Wollstonecraft',
        cover: 'https://www.gutenberg.org/cache/epub/84/pg84.cover.small.jpg',
        id: 84,
        title: 'Frankenstein; Or, The Modern Prometheus',
      },
    ];

    mock.onGet().reply(200, data);

    const provider = new Gutendex();
    const result = await provider.loadBooks(5);

    expect(result.nextPage).toBe(expectedNextPage);
    expect(result.books).toEqual(expectedBooks);
    expect(mock.history.get[0].url).toBe('https://gutendex.com/books/?page=5');
  });

  test('Should send back null when next page is null', async () => {
    const data: GutendexPayload = { ...responseData, next: null };

    const expectedNextPage = null;

    mock.onGet().reply(200, data);

    const provider = new Gutendex();
    const result = await provider.loadBooks();

    expect(result.nextPage).toBe(expectedNextPage);
  });
});
