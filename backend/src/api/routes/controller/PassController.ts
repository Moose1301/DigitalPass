import { Request, Response, NextFunction } from 'express';
import { Pass } from '../../../pass/model/Pass';
import { PassManager } from '../../../pass/PassManager';
import UUID from '../../../type/UUID';
import { UserManager } from '../../../user/UserManager';



export class PassController {
    public static async getListPasses(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const passes: Pass[] = await PassManager.findAll();
        const passesJson: any[] = [];
        for(var i = 0; i < passes.length; i++) {
            const pass: Pass = passes[i];
            passesJson.push({
                id: pass.id,
                issuedTo: pass.issuedTo.id,
                issuedBy: pass.issuedBy.id,
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
}