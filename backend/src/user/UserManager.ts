import { Collection, ObjectId } from "mongodb";
import { DatabaseHandler } from "../database/DatabaseHandler";
import { User } from "./model/User";
import { CacheMap } from "../utils/CacheMap";
import { genSaltSync, hash } from "bcrypt";
import { RoleManager } from "../role/RoleManager";
import UUID from "../type/UUID";


export class UserManager {
    private static usersCache = new CacheMap<UUID, User>(1000 * 60 * 10);
    private static userCollection: Collection<Document>;
    public static loadData() {
        this.userCollection = DatabaseHandler.getDatabase().collection("users");
    }
    public static createUser(user: User) {
        this.usersCache.set(user.id, user);
        const filter = { id: user.id.toString() };
        const options = { upsert: true };
        this.userCollection.findOneAndReplace(filter, user.toDocument(), options);
    }
    public static async findById(id: UUID): Promise<User> {
        if (this.usersCache.has(id)) {
            return this.usersCache.get(id)!;
        }
        const user: User = User.fromDocument(await this.userCollection.findOne({ id: id.toString() }));
        this.usersCache.set(id, user);
        return user;
    }

    public static async findAll(): Promise<User[]> {
        const users: User[] = [];

        await this.userCollection.find().forEach(document => {
            users.push(User.fromDocument(document));
        });
        return users;
    }
} 