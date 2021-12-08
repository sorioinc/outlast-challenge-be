import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import { Repository } from '../types';

const baseUrl = 'https://jsonbase.com';
export interface JsonBaseRecord {
  id: number;
}
export default class JsonBase<T extends JsonBaseRecord> implements Repository<T> {
  constructor(private bucket: string, private bag: string) {}

  findAll(): Promise<T[]> {
    return axios
      .get(`${baseUrl}/${this.bucket}/${this.bag}`)
      .then(({ data }) => data)
      .catch(reason => {
        if (axios.isAxiosError(reason) && reason.response?.status === StatusCodes.NOT_FOUND) {
          return [];
        }
        throw reason;
      });
  }

  async findById(id: number): Promise<T | undefined> {
    const records = await this.findAll();
    return records.find(r => r.id === id);
  }

  async insert(item: T): Promise<T[]> {
    const records = await this.findAll();
    const updated = [...records, item];
    return axios.put(`${baseUrl}/${this.bucket}/${this.bag}`, updated).then(({ data }) => data);
  }

  async update(item: T): Promise<T[]> {
    const records = await this.findAll();
    const updated = records.filter(r => r.id !== item.id).concat(item);
    return axios.put(`${baseUrl}/${this.bucket}/${this.bag}`, updated).then(({ data }) => data);
  }

  changeDatabase(bucket: string) {
    this.bucket = bucket;
    return this;
  }
}
