import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { User } from '../../../user/model/User';

const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
  passport.authenticate('jwt', (err: any, user: User) => {
    if (err || !user) {
      return res.status(401).send({
        error: 'UNAUTHORIZED'
      });
    }

    req.user = user;
    next();
  })(req, res, next);
};

export default isAuthenticated;
