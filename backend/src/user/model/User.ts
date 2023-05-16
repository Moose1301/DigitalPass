import UUID from "../../type/UUID";
import { Permission, Role } from "../../role/model/Role";
import { RoleManager } from "../../role/RoleManager";
import { sign as signJWT } from 'jsonwebtoken';

export enum TOTPType {
    EMAIL = "EMAIL",
    APPLICATION = "APPLICATION"
}
export class WebSession {
    public tokenId: UUID;
    public ip: string;
    public loggedInAt: Date;
    public tokenExpire: Date;
    public active: boolean = false;
    constructor(
        tokenid: UUID,
        ip: string,
        loggedInAt: Date,
        tokenExpire: Date
    ) {
        this.tokenId = tokenid;
        this.ip = ip;
        this.loggedInAt = loggedInAt;
        this.tokenExpire = tokenExpire;
    }
    public isValid(): boolean {
        return this.active && Date.now() < this.tokenExpire.getMilliseconds();
    }
}

export class User {
    public id: UUID;
    public username: string;
    public email: string;
    public name_first: string;
    public name_last: string;
    public password: string;
    public language: string;
    public totp_secret: string | undefined;
    public totp_type: TOTPType | undefined;
    public totp_authenticated_at: Date | undefined;
    public role: Role;
    public created_at: Date;

    //Used for when setting up TOTP so the user doesn't lock themselfs out
    public temp_totp_type: TOTPType | undefined;
    public temp_totp_secret: string | undefined;
    public sessions: WebSession[]

    constructor(
        id: UUID,
        username: string,
        email: string,
        name_first: string,
        name_last: string,
        password: string,
        language: string,
        role: Role,
        created_at: Date
    ) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.name_first = name_first;
        this.name_last = name_last;
        this.password = password;
        this.language = language;
        this.role = role;
        this.created_at = created_at;
        this.sessions = [];
    }

    public toDocument(): any {
        return {
            id: this.id.toString(),
            username: this.username,
            email: this.email,
            name_first: this.name_first,
            name_last: this.name_last,
            password: this.password,
            language: this.language,
            totp_secret: this.totp_secret,
            totp_type: this.totp_type,
            totp_authenticated_at: this.totp_authenticated_at,
            role: this.role.id,
            created_at: this.created_at.toString(),
            sessions: this.sessions
        }
    }
    public generateAuthToken(authIp: string): string {
        const tokenId = UUID.randomUUID();
        const passData = {
            tokenId: tokenId.toString(),
            id: this.id.toString()
        }
        const expireTime = new Date();
        expireTime.setDate(expireTime.getDate() + 7);
        this.sessions.push(new WebSession(
            tokenId,
            authIp,
            new Date(),
            expireTime
        ));

        const token = signJWT(
            passData, 
            process.env.JWT_SECRET!,
            {
                expiresIn: '1d'
            }
        );
        return token;
    }



    public static fromDocument(document: any): User {
        const user: User = new User(
            UUID.parseUUID(document.id),
            document.username,
            document.email,
            document.name_first,
            document.name_last,
            document.password,
            document.language,
            RoleManager.getRole(document.role)!,
            new Date(document.created_at),
        );
        user.totp_secret = document.totp_secret;
        user.totp_authenticated_at = document.totp_authenticated_at;
        user.totp_type = document.totp_type as TOTPType;
        user.sessions = document.sessions;
        user.sessions = user.sessions.filter(function( session: WebSession ) {
            return session.isValid();
        });
        return user;
    }
    public hasPermission(permission: Permission): boolean {
        return this.role.permissions.includes(permission);
    }

    public equals(obj: User) : boolean { 
        return this.id === obj.id;
    } 
    
}