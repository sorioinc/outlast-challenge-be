import axios from 'axios';
import { PersistenceLayer } from '../types';

const baseUrl = 'https://jsonbase.com/';
export interface JsonBaseRecord {
  id: number;
}
export default class JsonBase<T extends JsonBaseRecord> implements PersistenceLayer<T> {
  constructor(private bucket: string, private bag: string) {}

  findAll(): Promise<T[]> {
    return axios.get(`${baseUrl}/${this.bucket}/${this.bag}`);
  }

  async findById(id: number): Promise<T | undefined> {
    const records = await this.findAll();
    return records.find(r => r.id === id);
  }

  async insert(item: T): Promise<T> {
    const records = await this.findAll();
    const updated = [...records, item];
    return axios.put(`${baseUrl}/${this.bucket}/${this.bag}`, updated);
  }

  async update(item: T): Promise<T> {
    const records = await this.findAll();
    const updated = records.filter(r => r.id !== item.id).concat(item);
    return axios.put(`${baseUrl}/${this.bucket}/${this.bag}`, updated);
  }
}
