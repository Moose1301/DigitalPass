import express from 'express';
import isAuthenticated from '../auth/policies/isAuthenticated';
import { UserController } from './controller/UserController';
import hasPermission from '../auth/policies/hasPermission';
import { Permission } from '../../role/model/Role';
import { PassController } from './controller/PassController';


const router = express.Router();

router.get("/user/list", isAuthenticated, hasPermission(Permission.USER_LIST), UserController.getListUser);
router.get("/user/:id", isAuthenticated, hasPermission(Permission.USER_LIST), UserController.getUser);
router.get("/user", isAuthenticated, UserController.getSelf);


router.get("/pass/list", isAuthenticated, hasPermission(Permission.PASS_LIST), PassController.getListPasses);
router.post("/pass/generate", isAuthenticated, hasPermission(Permission.PASS_CREATE), PassController.postGeneratePass);


export = router;