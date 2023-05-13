import passport from 'passport';
import { Strategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import { User } from '../../user/model/User';
import { UserManager } from '../../user/UserManager';
import UUID from '../../type/UUID';

passport.use(
  new Strategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET
    },
    async (jwtPayload: any, done: VerifiedCallback) => {
      try {
        const user = await UserManager.findById(UUID.parseUUID(jwtPayload.id));
        if (!user) {
          return done(new Error(), false);
        }

        return done(null, user);
      } catch (err) {
        return done(new Error(), false);
      }
    }
  )
);
