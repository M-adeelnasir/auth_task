import { Request, Response, NextFunction } from 'express';
import { get } from 'lodash';
import { decodeToken } from '../utils/jwt.utils';

declare global {
  namespace Express {
    interface Request {
      user?: object;
    }
  }
}

const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('===============================>');

  const accessToken = await get(req, 'headers.authorization', '').replace(
    /^Bearer\s/,
    ''
  );

  if (!accessToken) next();
  const { expired, decoded } = (await decodeToken(accessToken)) as any;
  console.log('==================>', decoded);
  if (decoded) {
    req.user = decoded;
    return next();
  }
  next();
};

export default deserializeUser;
