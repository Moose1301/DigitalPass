import UUID from "../../type/UUID";
import { Permission, Role } from "../../role/model/Role";
import { RoleManager } from "../../role/RoleManager";
import { sign as signJWT } from 'jsonwebtoken';

export enum TOTPType {
    EMAIL = "EMAIL",
    APPLICATION = "APPLICATION"
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
    public totp_authenticated_at: number | undefined;
    public role: Role;
    public created_at: Date;

    //Used for when setting up TOTP so the user doesn't lock themselfs out
    public temp_totp_type: TOTPType | undefined;
    public temp_totp_secret: string | undefined;


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
            created_at: this.created_at.toString()
        }
    }
    public generateToken(): string {
        const passData = {
            id: this.id.toString()
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
        return user;
    }
    public hasPermission(permission: Permission): boolean {
        return this.role.permissions.includes(permission);
    }

    public equals(obj: User) : boolean { 
        return this.id === obj.id;
    } 
    
}