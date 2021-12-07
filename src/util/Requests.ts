import { Request } from 'express';

export type Empty = Record<string, unknown>;

export interface ParamsDictionary {
  [key: string]: string;
}

/**
 * A request type that has a body. Typically not used with GET requests
 * but if there's ever a GET request with a body, could use this as well.
 */
type RequestWithBody<TBody = Empty, TParams = Empty, TQuery = Empty> = Request<
  TParams,
  Empty,
  TBody,
  TQuery
>;

/**
 * A request object that has query parameters. No Body.
 * Request types go in the following order:
 *  - Params
 *  - Response Body
 *  - Request Body
 *  - Request Query
 */
export type GetRequest<TQuery = Empty, TParams = Empty> = Request<TParams, Empty, Empty, TQuery>;

export type PostRequest<TBody = Empty, TParams = Empty, TQuery = Empty> = RequestWithBody<
  TBody,
  TParams,
  TQuery
>;

export type PutRequest<TBody = Empty, TParams = Empty, TQuery = Empty> = RequestWithBody<
  TBody,
  TParams,
  TQuery
>;

export type PatchRequest<TBody = Empty, TParams = Empty, TQuery = Empty> = RequestWithBody<
  TBody,
  TParams,
  TQuery
>;

export type DeleteRequest<TQuery = Empty, TParams = Empty> = Request<TParams, Empty, Empty, TQuery>;
