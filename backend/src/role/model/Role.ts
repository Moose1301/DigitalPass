import { Document } from "mongodb";


export enum Permission {
    USER_LIST,
    USER_CREATE,
    USER_DELETE,
    USER_CHANGE_ROLE,
    USER_CHANGE_PASSWORD,
    USER_CHANGE_EMAIL,
    USER_CHANGE_USERNAME,
    USER_CHANGE_NAME,
    ROLE_LIST,
    ROLE_CREATE,
    ROLE_DELETE,
    ROLE_CHANGE_NAME,
    ROLE_CHANGE_WEIGHT,
    ROLE_CHANGE_TOTP,
    ROLE_CHANGE_PERMISSIONS
}
export namespace Permission {
    export function all(): Permission[] {
        return Object.keys(Permission).map((value: unknown) => value as Permission);
    }
}
export class Role {
    public id: string;
    public name: string;
    public weight: number;
    public requiresTOTP: boolean;
    public permissions: Permission[];


    constructor(
        id: string,
        name: string,
        weight: number,
        requiresTOTP: boolean,
        permissions: Permission[]
    ) {
        this.id = id;
        this.name = name;
        this.weight = weight;
        this.requiresTOTP = requiresTOTP;
        this.permissions = permissions;
    }
    public toDocument(): any {
        return {
            id: this.id,
            name: this.name,
            weight: this.weight,
            requiresTOTP: this.requiresTOTP,
            permissions: this.permissions
        };
    }

    public static fromDocument(document: any): Role {
        return new Role(
            document.id,
            document.name,
            document.weight,
            document.requiresTOTP,
            document.permissions
        );
    }
}