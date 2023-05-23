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
            id: this.id.toString(),
            issuedTo: this.issuedTo.id.toString(),
            issuedBy: this.issuedBy.id.toString(),
            issuedAt: this.issuedAt,
    
            roomFrom: this.roomFrom,
            roomTo: this.roomTo
        }
    }
    public static async fromDocument(document: any): Promise<Pass | undefined> {
        if(document == undefined || document == null) {
            return undefined;
        }
        return new Pass(
            UUID.parseUUID(document.id),
            await UserManager.findById(UUID.parseUUID(document.issuedTo)),
            await UserManager.findById(UUID.parseUUID(document.issuedBy)),
            document.issuedAt,
            document.roomFrom,
            document.roomTo
        );
    }

} 