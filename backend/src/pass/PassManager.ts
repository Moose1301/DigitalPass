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
    public static findById(id: UUID): Pass {
        if(this.passCache.has(id)) {
            return this.passCache.get(id)!;
        }
        const user: Pass = Pass.fromDocument(this.passCollection.findOne({ id: id.toString()}));
        this.passCache.set(id, user);
        return user;
    }
    public static async findAll(): Promise<Pass[]> {
        const passes: Pass[] = [];

        await this.passCollection.find().forEach(document => {
            passes.push(Pass.fromDocument(document));
        });
        return passes;
    }
    public static createPass(pass: Pass) {
        this.passCache.set(pass.id, pass);
        const filter = { id: pass.id };
        const options = { upsert: true };
        this.passCollection.findOneAndReplace(filter, pass.toDocument(), options);
    }
}