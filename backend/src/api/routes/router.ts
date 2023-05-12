import express from 'express';
import isAuthenticated from '../auth/policies/isAuthenticated';
import { UserController } from './user/UserController';
import hasPermission from '../auth/policies/hasPermission';
import { Permission } from '../../role/model/Role';


const router = express.Router();

router.get("/user", isAuthenticated, UserController.getSelf);
router.get("/user/:id", isAuthenticated, hasPermission(Permission.USER_LIST), UserController.getUser);
router.get("/user/list", isAuthenticated, hasPermission(Permission.USER_LIST), UserController.getListUser);

export = router;