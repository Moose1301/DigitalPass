import http from 'http';
import express, { Express } from 'express';

import routes from './routes/router';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';

const router: Express = express();

/** Parse the request */
router.use(express.urlencoded({ extended: false }));
/** Takes care of JSON data */
router.use(express.json());
router.use(cors({
    origin: '*',
    credentials: true
}))

router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization');
    next()
})

router.use(session({
    secret: process.env.JWT_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 24 * 7 * 1000 }
}))
router.use(passport.initialize())
router.use(passport.session())
router.use(express.urlencoded({extended: false}))
router.use(express.json())

router.use('/', routes);

router.use((req, res, next) => {
    const error = new Error('Not Found');
    return res.status(404).json({
        message: error.message
    });
});
import('./auth/passport')


function start() {
    const httpServer = http.createServer(router);
    const PORT: any = process.env.REST_PORT ?? 6060;
    httpServer.listen(PORT, () => console.log(`The server is running on port ${PORT}`));

}
export { start }