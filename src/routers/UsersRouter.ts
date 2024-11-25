import { Router } from "express";
import UsersController from "../controllers/UsersController";
import VerifyToken from "../middlewares/VerifyToken";

const UsersRouter = Router();
UsersRouter.post("/", UsersController.create);
UsersRouter.get("/", VerifyToken(true), UsersController.index);
UsersRouter.put("/password/:id", VerifyToken(true), UsersController.changePassword);
UsersRouter.put("/deactivate/:id", VerifyToken(true), UsersController.deactivate);
UsersRouter.put("/activate/:id", VerifyToken(true), UsersController.activate);
export default UsersRouter;
