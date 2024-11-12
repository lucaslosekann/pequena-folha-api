import { Router } from "express";
import UsersController from "../controllers/UsersController";

const UsersRouter = Router();
UsersRouter.post("/", UsersController.create);
UsersRouter.get("/", UsersController.index);
UsersRouter.put("/:id/password", UsersController.createPassword);
UsersRouter.put("/:id/deactivate", UsersController.deactivate);
export default UsersRouter;
