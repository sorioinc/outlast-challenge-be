/* eslint-disable import/prefer-default-export */

import { plainToInstance } from 'class-transformer';
import { StatusCodes } from 'http-status-codes';

import { HttpException } from '../../util';
import { assertType } from './assertType';
import { ModelClass } from './ConstructableModelClass';

export async function validatePayload<T extends object>(
  RequestModel: ModelClass<T> | undefined,
  payload: Record<string, unknown>,
) {
  if (!RequestModel) {
    if (payload && Object.keys(payload).length) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'Unexpected request payload');
    }
    return undefined;
  }
  let request: T;
  try {
    request = plainToInstance(RequestModel, payload, { excludeExtraneousValues: false });
  } catch (e) {
    if (e instanceof Error) {
      throw new HttpException(StatusCodes.BAD_REQUEST, e.message);
    }
    throw new HttpException(StatusCodes.BAD_REQUEST);
  }
  await assertType(request);
  return request;
}
