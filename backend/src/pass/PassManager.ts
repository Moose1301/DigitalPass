import { Collection, ObjectId } from "mongodb";
import { DatabaseHandler } from "../database/DatabaseHandler";
import { CacheMap } from "../utils/CacheMap";
import { Pass } from "./model/Pass";
import UUID from "../type/UUID";



export class PassManager {
    private static passCache = new CacheMap<UUID, Pass>(1000 * 60 * 10);
    private static passCollection: Collection<Document>;
    public static loadData() {
        this.passCollection =  DatabaseHandler.getDatabase().collection("passes");
        
    }
    public static async findById(id: UUID): Promise<Pass> {
        if(this.passCache.has(id)) {
            return this.passCache.get(id)!;
        }
        const user: Pass = await Pass.fromDocument(this.passCollection.findOne({ id: id.toString()}));
        this.passCache.set(id, user);
        return user;
    }
    public static async findByIssuedTo(userID: UUID): Promise<Pass[]> {
        const passes: Pass[] = [];
        const documents = await this.passCollection.find({ issuedTo: userID.toString() });
        for await(const document of documents) {
            const pass = await Pass.fromDocument(document);
            this.passCache.set(pass.id, pass, 1000 * 60);
        }
        return passes;
    }
    public static async findByIssuedBy(userID: UUID): Promise<Pass[]> {
        const passes: Pass[] = [];
        const documents = await this.passCollection.find({ issuedBy: userID.toString() });
        for await(const document of documents) {
            const pass = await Pass.fromDocument(document);
            this.passCache.set(pass.id, pass, 1000 * 60);
        }
        return passes;
    }
    public static async findAll(): Promise<Pass[]> {
        const passes: Pass[] = [];
        const documents = await this.passCollection.find();
        for await(const document of documents) {
            passes.push(await Pass.fromDocument(document));
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