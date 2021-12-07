export interface GutendexPayload {
  count: number;
  next: string | null;
  previous: string | null;
  results: GutendexBook[];
}

export interface GutendexBook {
  id: number;
  title: string;
  authors: Author[];
  translators: Author[];
  subjects: string[];
  bookshelves: string[];
  languages: Language[];
  copyright: boolean;
  media_type: 'Text';
  formats: Formats;
  download_count: number;
}

export interface Author {
  name: string;
  birth_year: number | null;
  death_year: number | null;
}

export interface Formats {
  'application/epub+zip': string;
  'application/rdf+xml': string;
  'application/x-mobipocket-ebook': string;
  'application/zip'?: string;
  'image/jpeg': string;
  'text/plain; charset=utf-8'?: string;
  'text/html; charset=utf-8'?: string;
  'text/html': string;
  'text/plain'?: string;
  'text/plain; charset=us-ascii'?: string;
  'application/octet-stream'?: string;
  'text/html; charset=iso-8859-1'?: string;
  'text/html; charset=us-ascii'?: string;
}

type Language = 'en' | 'es';
