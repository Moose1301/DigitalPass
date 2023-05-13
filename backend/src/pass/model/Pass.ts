import UUID from "../../type/UUID";
import { UserManager } from "../../user/UserManager";
import { User } from "../../user/model/User";

import { sign as signJWT } from 'jsonwebtoken';


export class Pass {
    public id: UUID;
    public issuedTo: User;
    public issuedBy: User;
    public issuedAt: Date;

    public roomFrom: string;
    public roomTo: string;


    constructor(
        id: UUID,
        issuedTo: User,
        issuedBy: User,
        issuedAt: Date,
    
        roomFrom: string,
        roomTo: string
    ) {
        this.id = id;
        
        this.issuedTo = issuedTo;
        this.issuedBy = issuedBy;
        this.issuedAt = issuedAt;

        this.roomFrom = roomFrom;
        this.roomTo = roomTo;
    }
    public generateToken(): string {
        const passData = {
            id: this.id.toString(),
            issuedTo: this.issuedTo.id,
            issuedBy: this.issuedBy.id
        }
        const token = signJWT(
            passData, 
            process.env.JWT_SECRET!,
            {
                expiresIn: '1d'
            }
        );
        return token;
    }

    public toDocument(): any {
        return {
            id: this.id,
            issuedTo: this.issuedTo.id,
            issuedBy: this.issuedBy.id,
            issuedAt: this.issuedAt,
    
            roomFrom: this.roomFrom,
            roomTo: this.roomTo
        }
    }
    public static async fromDocument(document: any): Promise<Pass> {
        return new Pass(
            document.id,
            await UserManager.findById(document.issuedTo),
            await UserManager.findById(document.issuedBy),
            document.issuedAt,
            document.roomFrom,
            document.roomTo
        );
    }

} 