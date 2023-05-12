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

        hash("password", genSaltSync(10)).then((password: string) => {
            const user: User = new User(
                UUID.randomUUID(),
                "Dev",
                "dev@example.com",
                "dev",
                "dev",
                password,
                "en_US",
                RoleManager.getRole("admin")!,
                new Date()
            )
            this.usersCache.set(user.id, user);
        });

    }
    public static findById(id: UUID): User {
        if (this.usersCache.has(id)) {
            return this.usersCache.get(id)!;
        }
        const user: User = User.fromDocument(this.userCollection.findOne({ id: id.toString() }));
        this.usersCache.set(id, user);
        return user;
    }

    public static findAll(): User[] {
        const users: User[] = [];

        this.userCollection.find().forEach(document => {
            users.push(User.fromDocument(document));
        })
        return users;
    }
} 