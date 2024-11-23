import { Router } from "express";
import UsersController from "../controllers/UsersController";

const UsersRouter = Router();
UsersRouter.post("/", UsersController.create);
UsersRouter.get("/", UsersController.index);
UsersRouter.put("/password/:id", UsersController.createPassword);
UsersRouter.put("/deactivate/:id", UsersController.deactivate);
export default UsersRouter;
