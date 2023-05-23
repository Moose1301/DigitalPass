import { Collection, ObjectId } from "mongodb";
import { DatabaseHandler } from "../database/DatabaseHandler";
import { CacheMap } from "../utils/CacheMap";
import { Pass } from "./model/Pass";
import UUID from "../type/UUID";
import { UserManager } from "../user/UserManager";
import { User } from "../user/model/User";



export class PassManager {
    private static passCache = new CacheMap<UUID, Pass>(1000 * 60 * 10);
    private static passCollection: Collection<Document>;
    public static async loadData() {
        this.passCollection =  DatabaseHandler.getDatabase().collection("passes");
    
    }
    public static async findById(id: UUID): Promise<Pass | undefined> {
        if(this.passCache.has(id)) {
            return this.passCache.get(id)!;
        }
        const user: Pass | undefined = await Pass.fromDocument(await this.passCollection.findOne({ id: id.toString() }));
        if(user == undefined) {
            return undefined;
        }
        this.passCache.set(id, user);
        return user;
    }
    public static async findByIssuedTo(userID: UUID): Promise<Pass[]> {
        const passes: Pass[] = [];
        const documents = await this.passCollection.find({ issuedTo: userID.toString() });
        for await(const document of documents) {
            const pass = await Pass.fromDocument(document);
            if(pass == undefined) {
                continue;
            }
            passes.push(pass);
            this.passCache.set(pass.id, pass, 1000 * 60);
        }
        return passes;
    }
    public static async findByIssuedBy(userID: UUID): Promise<Pass[]> {
        const passes: Pass[] = [];
        const documents = await this.passCollection.find({ issuedBy: userID.toString() });
        for await(const document of documents) {
            const pass = await Pass.fromDocument(document);
            if(pass == undefined) {
                continue;
            }
            passes.push(pass);
            this.passCache.set(pass.id, pass, 1000 * 60);
        }
        return passes;
    }
    public static async findAll(): Promise<Pass[]> {
        const passes: Pass[] = [];
        const documents = await this.passCollection.find();
        for await(const document of documents) {
            const pass: Pass | undefined = await Pass.fromDocument(document);
            if(pass == undefined) {
                continue;
            }
            passes.push(pass);
        }
        return passes;
    }
    public static createPass(pass: Pass) {
        this.passCache.set(pass.id, pass);
        const filter = { id: pass.id };
        const options = { upsert: true };
        this.passCollection.findOneAndReplace(filter, pass.toDocument(), options);
    }
}