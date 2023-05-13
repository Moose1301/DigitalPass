import { Collection, ObjectId } from "mongodb";
import { DatabaseHandler } from "../database/DatabaseHandler";
import { Permission, Role } from "./model/Role";



export class RoleManager {
    private static roles: Map<string, Role> = new Map();
    private static collection: Collection<Document>
    public static async loadRoles() {
        this.collection = DatabaseHandler.getDatabase().collection("roles");

        const roles = this.collection.find();

        for await (const roleDocument of roles) {
            const role: Role = Role.fromDocument(roleDocument);
            this.roles.set(role.id, role);
        }
        console.log("Loaded %s Roles", this.roles.size.toString());
        if(this.roles.size == 0) {
            const defaultRole: Role = new Role(
                "admin",
                "Administrator",
                1,
                false,
                Permission.all() 
            )
            this.roles.set(defaultRole.id, defaultRole);
            this.saveRole(defaultRole);
            console.log("Automatically created a admin role");
        }
    }

    public static getRole(id: string): Role | undefined {
        return this.roles.get(id);
    }
    public static saveRole(role: Role): void {
        const filter = { id: role.id };
        const options = { upsert: true };
        this.collection.findOneAndReplace(filter, role.toDocument(), options);
    }
}