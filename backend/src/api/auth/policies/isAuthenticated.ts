import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { User } from '../../../user/model/User';
import UUID from '../../../type/UUID';

const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
  passport.authenticate('jwt', (err: any, user: User, tokenId: UUID) => {
    if (err || !user) {
      return res.status(401).send({
        error: 'NOT_LOGGED_IN'
      });
    }
    const webSession = user.sessions.find(session => {
      return session.tokenId == tokenId;
    });
    if(!webSession) {
      return res.status(401).send({
        error: 'NOT_LOGGED_IN'
      });
    }

    req.tokenId = webSession;
    req.bUser = user;
    next();
  })(req, res, next);
};

export default isAuthenticated;
