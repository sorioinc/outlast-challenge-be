import { RequestHandler, Request, Response, NextFunction } from 'express';
import { instanceToPlain } from 'class-transformer';

import { validatePayload } from './validatePayload';
import { ModelClass } from './ConstructableModelClass';

export default function validateBody<TRequest extends object>(
  RequestModel?: ModelClass<TRequest>,
): RequestHandler {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const payload = await validatePayload<TRequest>(RequestModel, req.body);
      req.body = instanceToPlain(payload, { excludeExtraneousValues: false });
      next();
    } catch (err) {
      next(err);
    }
  };
}
