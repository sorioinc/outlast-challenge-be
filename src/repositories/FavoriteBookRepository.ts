import { JsonBase } from './json-base';

export interface FavoriteBookModel {
  id: number;
}

const tableName = 'FavoriteBooks';

export default class FavoriteBookRepository extends JsonBase<FavoriteBookModel> {
  constructor(user: string) {
    super(user, tableName);
  }
}
