import { Collection, ObjectId } from "mongodb";
import { DatabaseHandler } from "../database/DatabaseHandler";
import { Permission, Role } from "./model/Role";



export class RoleManager {
    private static roles: Map<string, Role> = new Map();
    private static collection: Collection<Document>
    private static defaultRoleId: string;
    public static async loadRoles() {
        this.collection = DatabaseHandler.getDatabase().collection("roles");

        const roles = this.collection.find();

        for await (const roleDocument of roles) {
            const role: Role = Role.fromDocument(roleDocument);
            this.roles.set(role.id, role);
            if(role.default) {
                this.defaultRoleId = role.id;
            }
        }
        console.log("Loaded %s Roles", this.roles.size.toString());
        if(this.roles.size == 0) {
            const defaultAdminRole: Role = new Role(
                "admin",
                "Administrator",
                1,
                false,
                false,
                Permission.all() 
            )
            const defaultUserRole: Role = new Role(
                "user",
                "User",
                0,
                false,
                true,
                []
            )
            this.roles.set(defaultAdminRole.id, defaultAdminRole);
            this.roles.set(defaultUserRole.id, defaultUserRole);
            this.saveRole(defaultAdminRole);
            this.saveRole(defaultUserRole)
            console.log("Automatically created a Admin and User role");
        }
    }
    public static getDefaultRole(): Role | undefined {
        return this.getRole(this.defaultRoleId);
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