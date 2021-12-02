import express from 'express';
import UsersController from './users.controller';

const router = express.Router();

router.route("/").get(UsersController.apiAddUsers)
// router.route("/").post(ModulesController.apiUploadModule)
// router.route("/").put(ModulesController.apiUpdateModule)
// router.route("/").delete(ModulesController.apiDeleteModule)
// router.route("/id/:id").get(ModulesController.apiGetModulesById)
// router.route("/local").get(ModulesController.apiGetLocalModules)


export default router;
