import { RoleSpecification } from "mongodb";
import UUID from "../../type/UUID";
import { Role } from "../../role/model/Role";
import { RoleManager } from "../../role/RoleManager";


export class User {
    public id: UUID;
    public username: string;
    public email: string;
    public name_first: string;
    public name_last: string;
    public password: string;
    public language: string;
    public totp_secret: string | undefined
    public totp_authenticated_at: number | undefined;
    public role: Role;
    public created_at: Date;


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
            totp_authenticated_at: this.totp_authenticated_at,
            role: this.role.id,
            created_at: this.created_at.getMilliseconds()
        }
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
            document.created_at,
        );
        user.totp_secret = document.totp_secret;
        user.totp_authenticated_at = document.totp_authenticated_at;
        return user;
    }
    
}