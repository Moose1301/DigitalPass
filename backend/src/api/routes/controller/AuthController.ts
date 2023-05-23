import { Request, Response, NextFunction } from 'express';
import { User } from '../../../user/model/User';
import { UserManager } from '../../../user/UserManager';
import { compare } from 'bcrypt';
import { verifyToken } from 'node-2fa';


export class AuthController {

    public static async getLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { email, password, token } = req.body;

        if(!email || !password) {
            res.status(400).send({
                error: "Missing required fields"
            });
            return;
        }
        const user: User | undefined = await UserManager.findByEmail(email as string);
        if(user == undefined) {
            res.status(400).send({
                error: "User or Password Invalid"
            });
            return;
        }
        const requiresTwoFactor = user!.totp_secret != undefined;
        const ip = req.headers['CF-Connecting-IP'] || req.socket.remoteAddress;
        const isPasswordValid = await compare(password as string, user!.password);
        if(!isPasswordValid) {
            res.status(400).send({
                error: "User or Password Invalid"
            });
            return;
        }
        if(requiresTwoFactor) {
            if(token == undefined || (token as string).length < 6) {
                res.status(400).send({
                    error: "2fa Token invalid"
                });
                return;
            }
            const tokenValidation = verifyToken(user!.totp_secret!, token as string);
            if(tokenValidation == undefined || tokenValidation.delta == undefined) {
                res.status(400).send({
                    error: "2fa Token invalid"
                });
                return;
            }
        }
        req.login(user!, { session: false}, async (error) => {
            if(error) {
                return next(error);
            }
            return res.status(200).send(user!.generateAuthToken(ip! as string))
        });

    }


    public static async getLogout(req: Request, res: Response, next: NextFunction): Promise<Response> {
        req.tokenId.active = false;
        delete req.bUser.sessions[req.bUser.sessions.indexOf(req.tokenId)];
        return res.status(201);
    }

}