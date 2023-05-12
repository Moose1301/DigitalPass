import { Collection } from "mongodb";
import { DatabaseHandler } from "../database/DatabaseHandler";
import { Role } from "./model/Role";



export class RoleManager {
    private static roles: Map<string, Role> = new Map();


    public static async loadRoles() {
        const collection: Collection<Document> = DatabaseHandler.getDatabase().collection("roles");

        const roles = collection.find();

        for await (const roleDocument of roles) {
            const role: Role = Role.fromDocument(roleDocument);
            this.roles.set(role.id, role);
        }
        console.log("Loaded %s Roles", this.roles.size.toString())
    }
    public static getRole(id: string): Role | undefined {
        return this.roles.get(id);
    }
    public static saveRole(role: Role): void {
        const collection: Collection<Document> = DatabaseHandler.getDatabase().collection("roles");

        collection.findOneAndReplace({
            _id: role.id
        }, role.toDocument());
    }
}