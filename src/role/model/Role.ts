import { Document } from "mongodb";


export class Role {
    public id: string;
    public name: string;
    public weight: number;
    public requiresTOTP: boolean;
    public permissions: string[];


    constructor(
        id: string,
        name: string,
        weight: number,
        requiresTOTP: boolean,
        permissions: string[]
    ) {
        this.id = id;
        this.name = name;
        this.weight = weight;
        this.requiresTOTP = requiresTOTP;
        this.permissions = permissions;
    }
    public toDocument(): any {
        return {
            _id: this.id,
            name: this.name,
            weight: this.weight,
            requiresTOTP: this.requiresTOTP,
            permissions: this.permissions
        };
    }

    public static fromDocument(document: any): Role {
        return new Role(
            document._id,
            document.name,
            document.weight,
            document.requiresTOTP,
            document.permissions
        );
    }
}