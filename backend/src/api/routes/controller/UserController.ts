import { Request, Response, NextFunction } from 'express';
import { UserManager } from '../../../user/UserManager';
import { TOTPType, User } from '../../../user/model/User';
import UUID from '../../../type/UUID';
import { userInfo } from 'os';
import { generateSecret, generateToken, verifyToken } from 'node-2fa';
import { profile } from 'console';
import { RoleManager } from '../../../role/RoleManager';



export class UserController {
    public static async getSelf(req: Request, res: Response, next: NextFunction): Promise<Response> {
        return res.status(200).json({
            id: req.bUser.id,
            email: req.bUser.email,
            name_first: req.bUser.name_first,
            name_last: req.bUser.name_last,
            language: req.bUser.language,
            permissions: req.bUser.role.permissions
        });
    }
    public static async getUser(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const { id } = req.query
        const user: User = await UserManager.findById(UUID.parseUUID(id as string));
        return res.status(200).json({
            id: user.id,
            email: user.email,
            username: user.username,
            first_name: user.name_first,
            last_name: user.name_last,
            role: user.role.id,
            totp: (user.totp_secret != undefined),
            language: user.language
        });
    }
    public static async getListUser(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const users: User[] = await UserManager.findAll();
        const usersJson: any[] = [];
        for(var i = 0; i < users.length; i++) {
            const user: User = users[i];
            usersJson.push({
                id: user.id,
                username: user.username,
                first_name: user.name_first,
                last_name: user.name_last,
                role: user.role.id,
                hasTotp: (user.totp_secret != undefined)
            })
        }

        return res.status(200).json(usersJson);
    }
    public static async postStartTOTPEnable(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const json = req.body;

        
        if(req.bUser.totp_secret != undefined) {
            return res.status(400).json({
                error: "You already have TOTP enabled"
            });
        }
        const secret = generateSecret();

        req.bUser.temp_totp_secret = secret.secret;
        req.bUser.temp_totp_type = json.type as TOTPType;
        /*
        if(req.bUser.temp_totp_type == TOTPType.EMAIL) {
            UserManager.sendTOTPEmail(secret.secret);
        }
        */
        return res.status(200).json({
            image: secret.qr,
            uri: secret.uri,
            secret: secret.secret
        });        
    }
    public static async postTOTPEnable(req: Request, res: Response, next: NextFunction): Promise<Response> {
        if(req.bUser.totp_secret != undefined) {
            return res.status(400).json({
                error: "You already have TOTP enabled"
            });
        } else if(req.bUser.temp_totp_secret == undefined) {
            return res.status(400).json({
                error: "You are not setting up TOTP"
            });
        }
        const json = req.body;

        const verify: any | undefined = verifyToken(req.bUser.temp_totp_secret, json.token);

        if(verify ==undefined || verify.delta == undefined) {
            return res.status(400).json({
                error: "Invalid Token"
            });
        }
        req.bUser.totp_type = req.bUser.temp_totp_type;
        req.bUser.totp_secret = req.bUser.temp_totp_secret;
        return res.status(202);
    }
    public static async postRemoveSession(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const { tokenId } = req.query;
        const webSession = req.bUser.sessions.find(session => {
            return session.tokenId == UUID.parseUUID(tokenId as string);
        });
        if(!webSession) {
            return res.status(400).json({
                error: "Invalid Session ID"
            });
        }
        webSession.active = false;
    
        return res.status(200);
    }
    public static async getSelfSessions(req: Request, res: Response, next: NextFunction): Promise<Response> {
        return res.status(200).json({
            sessions: req.bUser.sessions
        });
    }

    public static async postCreateUser(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const { email, username, password, name_first, name_last, language } = req.body;

        const createdUser: User = new User(
            UUID.randomUUID(),
            username,
            email,
            name_first,
            name_last,
            password,
            language,
            RoleManager.getDefaultRole()!,
            new Date()
        );
        UserManager.createUser(createdUser);
        return res.status(200).json({
            id: createdUser.id
        })
    }
}