import { RoleSpecification } from "mongodb";
import UUID from "../../type/UUID";
import { Role } from "../../role/model/Role";



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
    public updated_at: Date;



    constructor(
        id: UUID,
        username: string,
        email: string,
        name_first: string,
        name_last: string,
        password: string,
        language: string,
        role: Role,
        created_at: Date,
        updated_at: Date
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
        this.updated_at = updated_at;
    }
}