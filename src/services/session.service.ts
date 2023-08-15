import Session from '../model/session.model';

//create user session
export const createSession = async (userId: string, userAgent: string) => {
  const session = await Session.create({ user: userId, userAgent });
  return session;
};
