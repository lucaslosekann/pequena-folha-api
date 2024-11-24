import { Router } from "express";
import UsersController from "../controllers/UsersController";
import VerifyToken from "../middlewares/VerifyToken";

const UsersRouter = Router();
UsersRouter.post("/", UsersController.create);
UsersRouter.get("/", VerifyToken(true), UsersController.index);
UsersRouter.put("/password/:id", VerifyToken(true), UsersController.createPassword);
UsersRouter.put("/deactivate/:id", VerifyToken(true), UsersController.deactivate);
export default UsersRouter;
