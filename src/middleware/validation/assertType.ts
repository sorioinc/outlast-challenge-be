/* eslint-disable import/prefer-default-export */

import { validate, ValidatorOptions } from 'class-validator';
import { StatusCodes } from 'http-status-codes';

import { HttpException } from '../../util';

const validationOptions: ValidatorOptions = {
  validationError: { value: false, target: false },
};

export async function assertType<T extends object>(obj: T) {
  const errors = await validate(obj, {
    ...validationOptions,
    forbidUnknownValues: false,
  });
  if (errors.length) {
    throw new HttpException(StatusCodes.BAD_REQUEST, JSON.stringify(errors));
  }
}
