import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { User } from '../../../user/model/User';
import { Permission } from '../../../role/model/Role';

function hasPermission(permission: Permission) {
    return async (req: Request, res: Response, next: NextFunction) => {
    
        if (req.bUser == null) {
            res.status(401).send({
                error: 'UNAUTHORIZED'
            });
            return;
        }
        if (!req.bUser.role.permissions.includes(permission)) {
            res.status(401).send({
                error: 'UNAUTHORIZED'
            });
            return;
        }
        next();
    };
}
export default hasPermission;
