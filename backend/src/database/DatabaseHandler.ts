import { Db, MongoClient } from "mongodb";


export class DatabaseHandler {
    private static mongoConnection: MongoClient;

    public static async connect() {
        var mongoConnectionUrl = "";
        if(process.env.MONGO_PASSWORD == null || process.env.MONGO_PASSWORD.length == 0) {
            mongoConnectionUrl = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`
        } else {
            mongoConnectionUrl = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@` + 
                `${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`  
        }
        if(process.env.MONGO_URL != null) {
            mongoConnectionUrl = process.env.MONGO_URL;
        }
        
        this.mongoConnection = await new MongoClient(mongoConnectionUrl);
    }

    public static getClient(): MongoClient {
        return this.mongoConnection;
    }
    public static getDatabase(): Db {
        return this.mongoConnection.db(process.env.MONGO_DATABASE!);
    }
}