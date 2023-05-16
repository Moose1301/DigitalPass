import express from 'express';
import isAuthenticated from '../auth/policies/isAuthenticated';
import { UserController } from './controller/UserController';
import hasPermission from '../auth/policies/hasPermission';
import { Permission } from '../../role/model/Role';
import { PassController } from './controller/PassController';
import { AuthController } from './controller/AuthController';


const router = express.Router();

router.get("auth/login", AuthController.getLogin)
router.get("auth/logout", isAuthenticated, AuthController.getLogout)

router.get("/user/list", isAuthenticated, hasPermission(Permission.USER_LIST), UserController.getListUser);
router.post("/user/totp/start", isAuthenticated, UserController.postStartTOTPEnable);
router.post("/user/totp/enable", isAuthenticated, UserController.postTOTPEnable);
router.post("/user/session", isAuthenticated, UserController.postRemoveSession);

router.get("/user/:id", isAuthenticated, hasPermission(Permission.USER_LIST), UserController.getUser);
router.get("/user", isAuthenticated, UserController.getSelf);


router.get("/pass/list", isAuthenticated, hasPermission(Permission.PASS_LIST), PassController.getListPasses);
router.post("/pass/generate", isAuthenticated, hasPermission(Permission.PASS_CREATE), PassController.postGeneratePass);
router.get("/pass/:id", isAuthenticated, PassController.getListPasses);


export = router;