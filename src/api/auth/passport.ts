import passport from 'passport';
import { Strategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import { User } from '../../user/model/User';

passport.use(
  new Strategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET
    },
    async (jwtPayload: any, done: VerifiedCallback) => {
      try {
        const user = await User.findById(jwtPayload.id);

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
