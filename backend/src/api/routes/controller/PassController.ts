import { Request, Response, NextFunction } from 'express';
import { Pass } from '../../../pass/model/Pass';
import { PassManager } from '../../../pass/PassManager';
import UUID from '../../../type/UUID';
import { UserManager } from '../../../user/UserManager';
import { Permission } from '../../../role/model/Role';



export class PassController {
    public static async getPass(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const { id } = req.query;
        const pass: Pass = await PassManager.findById(UUID.parseUUID(id as string));
        if(pass == null) {
            return res.status(404).json({
                "error": "Pass with ID " + id + " not found"
            })
        }
        if(!req.bUser.hasPermission(Permission.PASS_CHECK_OTHERS)) {
            if(pass.issuedTo != req.bUser) {
                return res.status(401).json({
                    "error": "This is not your pass"
                });
            }
        }
        return res.status(200).json(pass);
    }
    public static async getListPasses(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const passes: Pass[] = await PassManager.findAll();
        const passesJson: any[] = [];
        for(var i = 0; i < passes.length; i++) {
            const pass: Pass = passes[i];
            passesJson.push({
                id: pass.id,
                issuedTo: pass.issuedTo.getName(),
                issuedBy: pass.issuedBy.getName(),
                issuedAt: pass.issuedAt,

                roomFrom: pass.roomFrom,
                roomTo: pass.roomTo
            })
        }

        return res.status(200).json(passesJson);
    }

    public static async postGeneratePass(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const json = req.body;
        const pass: Pass = new Pass(
            UUID.randomUUID(),
            await UserManager.findById(UUID.parseUUID(json.issuedTo as string)),
            req.bUser,
            new Date(),
            json.roomFrom as string,
            json.roomTo as string
        );
        PassManager.createPass(pass);

        return res.status(200).json({
            id: pass.id.toString()
        })
    }
    public static async getSelfPasses(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const passes: Pass[] = await PassManager.findByIssuedTo(req.bUser.id);
        const passesJson: any[] = [];
        for(var i = 0; i < passes.length; i++) {
            const pass: Pass = passes[i];
            passesJson.push({
                id: pass.id,
                issuedTo: pass.issuedTo.getName(),
                issuedBy: pass.issuedBy.getName(),
                issuedAt: pass.issuedAt,

                roomFrom: pass.roomFrom,
                roomTo: pass.roomTo
            })
        }
        return res.status(200).json({
            passes: passesJson
        })
    }
}