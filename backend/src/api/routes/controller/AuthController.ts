import { Request, Response, NextFunction } from 'express';
import { User } from '../../../user/model/User';
import { UserManager } from '../../../user/UserManager';
import { compare } from 'bcrypt';
import { verifyToken } from 'node-2fa';
import { error } from 'console';


export class AuthController {

    public static async getLogin(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const { email, password, token } = req.body;

        if(!email || !password) {
            return res.status(400).send({
                error: "Missing required fields"
            });
        }
        const user: User = await UserManager.findByEmail(email);
        if(!user == undefined) {
            return res.status(400).send({
                error: "User or Password Invalid"
            });
        }
        const requiresTwoFactor = user.totp_secret != undefined;
        const ip = req.headers['CF-Connecting-IP'] || req.socket.remoteAddress;
        const isPasswordValid = await compare(password, user.password);
        if(!isPasswordValid) {
            return res.status(400).send({
                error: "User or Password Invalid"
            });
        }
        if(requiresTwoFactor) {
            if(token == undefined || token.length < 6) {
                return res.status(400).send({
                    error: "2fa Token invalid"
                });
            }
            const tokenValidation = verifyToken(user.totp_secret!, token);
            if(tokenValidation == undefined || tokenValidation.delta == undefined) {
                return res.status(400).send({
                    error: "2fa Token invalid"
                });
            }
        }
        req.login(user, { session: false}, async (error) => {
            if(error) {
                return next(error);
            }
            return res.status(200).send(user.generateAuthToken(ip! as string))
        })
    }


    public static async getLogout(req: Request, res: Response, next: NextFunction): Promise<Response> {
        req.tokenId.active = false;
        delete req.bUser.sessions[req.bUser.sessions.indexOf(req.tokenId)];
        return res.status(201);
    }

}