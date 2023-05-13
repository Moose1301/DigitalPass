import * as dotenv from 'dotenv'
dotenv.config() //Load Dot ENV Before importing anything
import { start as startRestAPI } from './api/RestAPI';
import { DatabaseHandler } from './database/DatabaseHandler';
import { RoleManager } from './role/RoleManager';
import { UserManager } from './user/UserManager';
import UUID from './type/UUID';
import { PassManager } from './pass/PassManager';

 
if(process.env.SECRET_KEY == null || process.env.SECRET_KEY === "") {
    console.log("Please set a SECRET KEY as this is used for encryption")
    process.exit(1);
}
if(process.env.SECRET_KEY.length < 32) {
    console.warn("Secret Key length is lower then recommanded amount (%s < 32)", process.env.SECRET_KEY.length);
} 
console.log("Connecting to the Mongo Database");
DatabaseHandler.connect().then(() => {  
    RoleManager.loadRoles();
    UserManager.loadData();
    PassManager.loadData();
    console.log("Connected to the Mongo Database");
});
startRestAPI();
