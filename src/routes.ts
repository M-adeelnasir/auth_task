import { Response, Request, Express } from 'express';
import {
  createUserHandler,
  searchUSerByQuery,
  users,
} from './controller/user.controller';
import { createUserSchema } from './schemas/create-user.schema';
import deserializeUser from './middlewares/deserialize.user';
import {
  sendEmailVerificationHandler,
  verifyEmailOPThanlder,
} from './controller/email-verification.controller';
import { requireAdminSignin } from './middlewares/current.user';
import { sessionCreateleHandler } from './controller/session.controller';
import { sessionCreate } from './schemas/session-create.scehma';
import { verifyOPTSchema } from './schemas/opt-verifications.schema';

import { validateRequest } from './middlewares/validateRequest';

const baseURI = '/api/v1/users';

export default function (app: Express) {
  app.get(
    baseURI + '/health-check',
    deserializeUser,
    (req: Request, res: Response) => {
      res.sendStatus(200);
    }
  );

  app.post(
    baseURI + '/signup',
    validateRequest(createUserSchema),
    createUserHandler
  );

  app.post(
    baseURI + '/signin',
    validateRequest(sessionCreate),
    sessionCreateleHandler
  );

  app.post(
    baseURI + '/send-email-opt',
    deserializeUser,
    sendEmailVerificationHandler
  );

  app.post(
    baseURI + '/verify-email-opt',
    deserializeUser,
    validateRequest(verifyOPTSchema),
    verifyEmailOPThanlder
  );

  app.post(baseURI + '/all', deserializeUser, requireAdminSignin, users);

  app.post(baseURI + '/search', deserializeUser, searchUSerByQuery);
}
