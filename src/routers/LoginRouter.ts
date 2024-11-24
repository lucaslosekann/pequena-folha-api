import { Router } from "express";
import LoginController from "../controllers/LoginController";

const LoginRouter = Router();

LoginRouter.post("/", LoginController.loginOne);

export default LoginRouter;