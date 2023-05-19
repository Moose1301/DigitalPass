import { Collection, ObjectId } from "mongodb";
import { DatabaseHandler } from "../database/DatabaseHandler";
import { User } from "./model/User";
import { CacheMap } from "../utils/CacheMap";
import UUID from "../type/UUID";


export class UserManager {
    private static usersCache = new CacheMap<UUID, User>(1000 * 60 * 10);
    private static emailCache = new CacheMap<string, UUID>(1000 * 60 * 1);
    private static userCollection: Collection<Document>;
    public static async loadData() {
        this.userCollection = DatabaseHandler.getDatabase().collection("users");
   
    }
    public static createUser(user: User) {
        this.usersCache.set(user.id, user);
        const filter = { id: user.id.toString() };
        const options = { upsert: true };
        this.userCollection.findOneAndReplace(filter, user.toDocument(), options);
    }
    public static async findByEmail(email: string): Promise<User | undefined> {
        if(this.emailCache.has(email)) {
            const user: User | undefined = this.usersCache.get(this.emailCache.get(email)!);
            if(user != undefined) {
                return user;
            }
        }
        const document: any = await this.userCollection.findOne({ email: email });
        if(document == null) {
            return undefined;
        }
        
        const user: User | undefined = User.fromDocument(document);
      
        this.usersCache.set(user!.id, user!);
        return user;
    }
    public static updateCache(user: User) {
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