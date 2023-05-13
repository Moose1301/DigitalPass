import { Request, Response, NextFunction } from 'express';
import { UserManager } from '../../../user/UserManager';
import { User } from '../../../user/model/User';
import UUID from '../../../type/UUID';



export class UserController {
    public static async getSelf(req: Request, res: Response, next: NextFunction): Promise<Response> {
        return res.status(200).json({
            id: req.bUser.id,
            email: req.bUser.email,
            name_first: req.bUser.name_first,
            name_last: req.bUser.name_last,
            language: req.bUser.language
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
                role: user.role.id
            })
        }

        return res.status(200).json(usersJson);
    }
}